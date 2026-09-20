# Current State: FluentUI Agent Skill

> **Document**: 02-current-state.md
> **Parent**: [Index](00-index.md)

## Existing Implementation

### What Exists

The repository is a schema-driven MCP server. An offline pipeline scrapes FluentUI source with
`ts-morph`, enriches it with an LLM (OpenAI or Anthropic via a native-`fetch` provider), and writes
`data/v9/fluentui-schema-enhanced.json`. At runtime the server loads that JSON into an in-memory
store, builds a TF-IDF index, and serves 12 tools over stdio.

Findings from the analysis that shape this plan:

- The schema contains 62 components, 4 utilities, 767 stories, 473 props, 16 patterns, 5 enterprise
  guides, 6 foundation guides, and 5 quick-reference docs.
- The scraper misses the Button family (CompoundButton, MenuButton, SplitButton, ToggleButton) and
  abbreviates names (`Progress`, `Search`); `buttons` has only one component. This violates RD-01.
- The enhancer's prompts request LLM-authored code (`commonPatterns[].code`,
  `compositionExamples[].code`, guide `examples[].code`), which RD-02 removes.
- The LLM provider supports only `openai` and `anthropic` (`scripts/enhancer/llm/provider.ts:99`);
  DeepSeek does not exist yet.
- `docs/` is 141 agent-generated Markdown files, unshipped and link-broken; `techdocs/` is a
  VitePress site with a Pages deploy workflow.

### Relevant Files

| File | Purpose | Changes Needed |
| ---- | ------- | -------------- |
| `scripts/scraper/**` | ts-morph extraction | Fix discovery/classification for full coverage (RD-01) |
| `scripts/enhancer/config.ts` | Guide catalogs | Replace patterns/enterprise with categories + recipes (RD-02) |
| `scripts/enhancer/prompts/**` | Prompt builders | Prose-only prompts; add category/recipe prompts (RD-02) |
| `scripts/enhancer/llm/provider.ts` | Provider factory | Add DeepSeek, fail-fast, 128K ceiling (RD-02) |
| `scripts/enhancer/prompts/shared.ts` | Grounding serializers | Keep; reused for budgeted inventories |
| `src/types/schema.ts` | Schema types | Drop code-bearing fields; add `categoryGuidance`, `recipes` (RD-03) |
| `src/formatters/**` | Markdown renderers | Relocate reusable renderers to `scripts/skill/render/` (RD-03, RD-06) |
| `src/index.ts`, `src/server.ts`, `src/tools/**`, MCP runtime parts of `src/schema/**`, `src/search/**` | MCP runtime | Delete (RD-06); `src/schema/schema-validator.ts` retained (PR-15) |
| `src/__tests__/**` | Test suite | Keep pipeline tests; delete MCP tests; add skill tests (RD-06) |
| `package.json` | Package config | New name/bin/scripts/files; drop MCP SDK and VitePress deps (RD-05, RD-06) |
| `.github/workflows/**` | CI/CD | Update CI, replace update-docs, delete deploy-techdocs, update publish (RD-06) |
| `docs/**`, `techdocs/**` | Legacy docs and site | Delete (RD-06) |
| `README.md` | Project docs | Rewrite skill-first (RD-08) |

### Code Analysis

The provider factory hard-rejects anything but `openai`/`anthropic`:

```ts
// scripts/enhancer/llm/provider.ts:132
if (providerName !== 'openai' && providerName !== 'anthropic') {
  throw new LLMError(`Unknown or missing LLM provider: "${providerName}". ...`);
}
```

The component prompt requests code examples and the schema type carries them:

```ts
// scripts/enhancer/prompts/component-enhance.ts:45
"commonPatterns": [{ "name": "...", "code": "// Complete runnable TSX ..." }],
```

Both are replaced in RD-02. The story data already holds compiled examples
(`stories[].code`), so Layer A can render them without the LLM.

## Gaps Identified

### Gap 1: Incomplete component coverage
**Current:** Missing Button-family components; abbreviated names.
**Required:** Every public v9 component present with exact names (RD-01).
**Fix Required:** Correct scraper discovery and classification.

### Gap 2: LLM authors code
**Current:** Prompts ask for runnable TSX in components and guides.
**Required:** Prose only; examples from stories (RD-02).
**Fix Required:** Rewrite prompts and schema types.

### Gap 3: No DeepSeek provider or cost gate
**Current:** Only OpenAI/Anthropic; no estimate or confirmation.
**Required:** DeepSeek-flash-max, fail-fast, cost estimator (RD-02).
**Fix Required:** Port the blendsdk provider and estimator.

### Gap 4: No skill generator
**Current:** Runtime formatters render Markdown per tool call.
**Required:** Offline deterministic generator emitting a skill tree (RD-03).
**Fix Required:** Build `scripts/skill/generate.ts` and relocate renderers.

### Gap 5: No integrity gates
**Current:** No example validation, drift, freshness, or coverage checks.
**Required:** All gates, with example validation as the trust guarantee (RD-04).
**Fix Required:** Build the gate scripts and wire CI.

### Gap 6: No installer or skill package
**Current:** npm package ships `dist/` + `data/`; bin `fluentui-mcp`.
**Required:** `fluentui-skill`, bin `fluentui`, `skills/fluentui/`, installer (RD-05).
**Fix Required:** Build the installer, assemble step, and packaging.

### Gap 7: Dead runtime and docs
**Current:** MCP server, legacy `docs/`, VitePress `techdocs/`.
**Required:** Removed (RD-06).
**Fix Required:** Delete and migrate tests.

## Dependencies

### Internal Dependencies
- Existing scraper, enhancer, batch processor, hasher/diff/merge.
- Existing formatter logic (relocated to the generator).
- Existing Vitest suite.

### External Dependencies
- `microsoft/fluentui` source (pinned release tag) and optionally `fluentui-contrib`.
- DeepSeek API over HTTPS (`deepseek-flash`).
- `@fluentui/react-components` and `@fluentui/react-icons` installed in a throwaway project for
  example validation.
- npm and GitHub Actions.

## Risks and Concerns

| Risk | Likelihood | Impact | Mitigation |
| ---- | ---------- | ------ | ---------- |
| Widening/regenerating content costs more than estimated | Med | Low | Cost estimator, `--dry-run`, incremental hashing |
| DeepSeek reasoning truncates large outputs | Med | High | 128K ceiling; fail-fast; fail item, never partial |
| Story snippets fail type-check (missing `useStyles`) | High | Med | Gate API errors only; repair type-only errors (AR-19) |
| Scraper coverage fix is larger than expected | Med | Med | Coverage report test; explicit exclusion reasons |
| Deleting MCP/docs breaks hidden references | Low | Med | Grep gates in RD-06 acceptance criteria |
| npm rejects dot-directory packaging | Low | Low | Ship from non-dot `skills/` via assemble |
