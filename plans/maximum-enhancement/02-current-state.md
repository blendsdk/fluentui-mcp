# Current State: Maximum Enhancement

> **Document**: 02-current-state.md
> **Parent**: [Index](00-index.md)

## Existing Implementation

The enhancer pipeline lives in `scripts/enhancer/` and runs as a `tsx` CLI. It
takes the raw scraped schema (`data/v9/fluentui-schema.json`), enriches it via an
LLM, and writes the enhanced schema (`data/v9/fluentui-schema-enhanced.json`)
that the MCP server loads at runtime.

### Two-pass orchestration (`enhancer.ts`)

- **Pass 1** — enrich components and utilities. For each, build messages, call
  `provider.chat(messages, { temperature, responseFormat: 'json' })`, parse JSON,
  map into `ComponentEnhanced` / `UtilityEnhanced`.
- **Pass 2** — generate foundation, enterprise, quick-reference guides and
  patterns from the component inventory summaries.
- Diff-based: only new/changed entries are re-enhanced unless `--full`.

### Relevant Files

| File | Purpose | Changes Needed |
| ---- | ------- | -------------- |
| `scripts/enhancer/config.ts` | Guide catalogs + `EnhancerConfig` (temperature, concurrency) | Add `maxTokens`; default model note |
| `scripts/enhancer/types.ts` | `ComponentSummary`, `EnhancementContext`, `LLMChatOptions` | `ComponentSummary` carries full props/slots; context for guides |
| `scripts/enhancer/enhancer.ts` | Orchestrator + raw→enhanced mapping | Pass `maxTokens`; map new fields; continuation |
| `scripts/enhancer/parse.ts` | `parseJsonResponse`, `extractJsonObject` | Add incomplete-JSON detection / repair helpers |
| `scripts/enhancer/llm/openai.ts` | OpenAI provider (passes `max_tokens` if set) | High default ceiling; continuation support |
| `scripts/enhancer/llm/anthropic.ts` | Anthropic provider (`DEFAULT_MAX_TOKENS = 4096`) | Raise ceiling; continuation support |
| `scripts/enhancer/prompts/shared.ts` | `KEY_PROPS_LIMIT = 6`, summary serialization | Remove cap; richer serialization |
| `scripts/enhancer/prompts/component-enhance.ts` | Component prompt | Rewrite for max richness + new fields |
| `scripts/enhancer/prompts/utility-enhance.ts` | Utility prompt | Rewrite for max richness + new fields |
| `scripts/enhancer/prompts/foundation-guide.ts` | Foundation guide prompt | Rewrite + targeted grounding |
| `scripts/enhancer/prompts/pattern-guide.ts` | Pattern guide prompt | Rewrite + targeted grounding |
| `scripts/enhancer/prompts/enterprise-guide.ts` | Enterprise guide prompt | Rewrite + targeted grounding |
| `scripts/enhancer/prompts/quick-reference.ts` | Quick-ref prompt | Rewrite + targeted grounding |
| `src/types/schema.ts` | Schema type definitions | Add new optional enhanced fields |
| `src/schema/schema-validator.ts` | Validates enhanced schema | Validate new fields |
| `src/formatters/*` | Render schema entries for tools | Surface new fields |
| `src/tools/*` | MCP tool handlers | Pass new fields through |

### Code Analysis — the truncation problem

`scripts/enhancer/enhancer.ts` calls the provider with only `temperature` and
`responseFormat`:

```ts
const response = await provider.chat(messages, {
  temperature: config.temperature,
  responseFormat: 'json',
});
```

`scripts/enhancer/llm/anthropic.ts` then applies a hard cap:

```ts
const DEFAULT_MAX_TOKENS = 4096;
// ...
max_tokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
```

Because no `maxTokens` is passed, Anthropic responses are capped at 4096 tokens.
A maximal component (all props + all full-code stories + new fields) easily
exceeds that, producing truncated JSON. `parseJsonResponse` then throws
`ResponseParseError`, the batch marks the item failed, and the component is
dropped from the output (counted in `stats.failures`). OpenAI passes
`max_tokens` only when provided (so today it uses the model default), but the
same truncation risk applies for very large outputs.

### Code Analysis — the grounding cap

`scripts/enhancer/prompts/shared.ts`:

```ts
const KEY_PROPS_LIMIT = 6;
// ...
const keyProps = [...required, ...optional].slice(0, KEY_PROPS_LIMIT);
```

Guide prompts only ever see 6 prop *names* (no types, no slots) per component, so
generated guide code is under-grounded. `ComponentSummary` (in `types.ts`) only
holds `name`, `category`, `importStatement`, `keyProps`.

### Code Analysis — story trimming

`component-enhance.ts` `serializeComponentForPrompt` includes stories but maps
only `name`, `description`, `renderCode` — not the full `code` (imports+styles).

## Gaps Identified

### Gap 1: Output truncation drops content
**Current:** 4096-token cap + no `maxTokens` passed → large entries truncated and dropped.
**Required:** High per-model ceiling + continuation/repair so nothing is lost.
**Fix:** Phases 1 & 6 (`03-llm-capacity.md`).

### Gap 2: Under-grounded guides
**Current:** 6-prop cap, no types/slots in summaries.
**Required:** Full props+types+slots+imports+compositions; targeted full-component data.
**Fix:** Phase 2 (`04-grounding-data.md`).

### Gap 3: Thin enhanced schema
**Current:** Fixed `ComponentEnhanced` shape with limited fields.
**Required:** New rich fields (per-prop notes, anti-patterns, perf, theming, more examples, related patterns).
**Fix:** Phase 3 (`05-schema-expansion.md`).

### Gap 4: Generic prompts
**Current:** Prompts ask for concise output, no quotas, no self-check.
**Required:** Explicit high quotas, story-anchored examples, grounding self-check, new fields.
**Fix:** Phase 5 (`06-prompt-rewrites.md`).

### Gap 5: New content not surfaced
**Current:** Formatters/tools render only existing fields.
**Required:** Surface new fields in tool output.
**Fix:** Phase 7 (`08-formatters-tools.md`).

## Dependencies

### Internal
- Scraper output already contains full props/slots/stories (no scraper change needed).
- `runBatch` concurrency/retry already exists and is reused.

### External
- OpenAI / Anthropic REST APIs (via global `fetch`).
- `.env` provides `LLM_PROVIDER`, `LLM_MODEL`, `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`.

## Risks and Concerns

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Maximal prompt exceeds model **input** context | Med | High (call fails / data lost) | Smart-maximal grounding (AR-3); per-guide targeted injection |
| Continuation logic stitches JSON incorrectly | Med | High (parse failure) | Robust brace-balance detection + repair; spec tests for split JSON |
| New optional fields break old schema loading | Low | Med | Fields optional; validator tolerant; back-compat tests |
| Larger bundle slows MCP startup | Low | Low | Measure in Phase 9; schema is loaded once |
| Existing tests assume old `ComponentSummary`/prompt text | High | Med | Update tests alongside code (spec-first) |
