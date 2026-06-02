# LLM Capacity: maxTokens Threading + Continuation/Repair

> **Document**: 03-llm-capacity.md
> **Parent**: [Index](00-index.md)

## Overview

Guarantee that LLM output is **never truncated**. This requires (1) threading a
configurable `maxTokens` through the whole call path, (2) defaulting it to each
model's true output ceiling via a **model-aware lookup** (never a single hardcoded
number), and (3) an automatic continuation + escalation loop that completes any
response cut off at the token limit. Resolves AR-1.

> **Preflight updates (see `00-preflight-report.md`):**
> - **PF-002/PF-005** — token ceilings are **model-aware**, not a single magic
>   number; config `maxTokens` is **optional** (unset ⇒ use the model's own
>   ceiling), and `LLM_MAX_TOKENS` overrides are **clamped** to the model ceiling
>   so a request can never 400 with "max_tokens too large".
> - **PF-001** — continuation is **provider-aware**: OpenAI `json_object` mode is
>   only set on the *first* turn; continuation turns run in plain-text mode so the
>   raw token stream can be stitched.
> - **PF-003** — `repairJson` is the **last** resort in an escalation ladder
>   (continue → re-request with a bumped ceiling → repair), and every repair is
>   logged and counted (`repairsUsed`) for human review.


## Architecture

### Current Architecture

- `EnhancerConfig` has `temperature` but no `maxTokens`.
- `enhancer.ts` calls `provider.chat(messages, { temperature, responseFormat })`.
- `anthropic.ts` caps at `DEFAULT_MAX_TOKENS = 4096`; `openai.ts` only sends
  `max_tokens` when provided.
- `parse.ts` throws `ResponseParseError` on truncated JSON → entry dropped.

### Proposed Changes

1. Add an **optional** `maxTokens` to `EnhancerConfig` (unset ⇒ use the model's
   own ceiling; `.env` `LLM_MAX_TOKENS` override) — mirrors existing
   `LLM_CONCURRENCY`/`LLM_MAX_RETRIES` resolution.
2. Add a **model-aware output-ceiling lookup** (`MODEL_OUTPUT_CEILINGS`) shared by
   both providers, with a safe fallback for unknown models. Each provider requests
   `min(requested, modelCeiling)` so a call can never exceed the model's real
   limit (resolves PF-002/PF-005). Example entries: `gpt-4o → 16384`,
   `gpt-4-turbo → 4096`, `claude-3-5-sonnet → 8192`, fallback `4096`.
3. `enhancer.ts` passes `maxTokens: config.maxTokens` (possibly `undefined`) on
   every call; when `undefined`, the provider resolves the model ceiling itself.
4. New `chatComplete()` wrapper (in a new `scripts/enhancer/llm/complete.ts`) that
   runs the **escalation ladder** (resolves PF-001/PF-003):
   - Calls `provider.chat` (first turn: JSON mode allowed).
   - Detects a truncated/incomplete JSON response via `isLikelyComplete`.
   - **Stage 1 — continuation:** issues continuation turns in **plain-text mode**
     (no `json_object`) so the raw token stream can be stitched. Anthropic uses
     assistant-prefill natively; OpenAI relies on text mode.
   - **Stage 2 — re-request:** if still incomplete after `maxContinuations`,
     re-requests the whole entry once with a bumped ceiling (cost is irrelevant).
   - **Stage 3 — repair:** only as a last resort, `repairJson(acc)`, emitting a
     loud warning and incrementing a `repairsUsed` counter for human review.
5. `parse.ts` gains `isLikelyComplete(content)` / `findJsonEnd(content)` helpers
   using brace/bracket-balance + string-aware scanning, plus a `repairJson()` that
   closes unterminated strings/objects as a last resort.


## Implementation Details

### New config field (optional — unset ⇒ model ceiling)

```ts
// config.ts — EnhancerConfig
/**
 * Maximum tokens to request per LLM response. OPTIONAL: when undefined, each
 * provider uses its model's own output ceiling (see MODEL_OUTPUT_CEILINGS).
 * An explicit value (or LLM_MAX_TOKENS) is clamped to the model ceiling.
 */
maxTokens?: number;
```

```ts
// DEFAULT_ENHANCER_CONFIG — leave maxTokens undefined so the model ceiling wins.
// (No hardcoded 8192 default; "maximum" is automatic per model.)
```

```ts
// resolveEnhancerConfig — add env resolution (NaN-guarded)
const parsedEnv = process.env.LLM_MAX_TOKENS
  ? Number.parseInt(process.env.LLM_MAX_TOKENS, 10)
  : undefined;
const envMaxTokens = Number.isFinite(parsedEnv) ? parsedEnv : undefined;
// ...
// undefined is a valid resolved value ⇒ provider uses the model ceiling.
maxTokens: overrides.maxTokens ?? envMaxTokens, // may be undefined
```

### Model-aware ceilings (shared lookup)

```ts
// scripts/enhancer/llm/ceilings.ts (shared by both providers)
export const MODEL_OUTPUT_CEILINGS: Record<string, number> = {
  'gpt-4o': 16384,
  'gpt-4o-mini': 16384,
  'gpt-4-turbo': 4096,
  'gpt-3.5-turbo': 4096,
  'claude-3-5-sonnet-latest': 8192,
  'claude-3-5-haiku-latest': 8192,
};

/** Safe fallback for models not in the table. */
export const FALLBACK_OUTPUT_CEILING = 4096;

/** Resolve the effective max_tokens: requested clamped to the model ceiling. */
export function resolveMaxTokens(model: string, requested?: number): number {
  const ceiling = MODEL_OUTPUT_CEILINGS[model] ?? FALLBACK_OUTPUT_CEILING;
  return requested === undefined ? ceiling : Math.min(requested, ceiling);
}
```

```ts
// openai.ts — chat(): body.max_tokens = resolveMaxTokens(this.model, options?.maxTokens);
// anthropic.ts — max_tokens: resolveMaxTokens(this.model, options?.maxTokens),
```

This guarantees a request can never exceed the model's real limit (no HTTP 400),
while an unset `maxTokens` automatically requests the model's maximum.

### Continuation wrapper (provider-aware, escalation ladder)

```ts
// scripts/enhancer/llm/complete.ts
export interface CompleteOptions extends LLMChatOptions {
  /** Max continuation rounds before escalating (default 4). */
  maxContinuations?: number;
  /** Allow one full re-request with a bumped ceiling before repair (default true). */
  allowReRequest?: boolean;
  /** Optional verbose logger. */
  log?: (msg: string) => void;
}

/**
 * Run the escalation ladder so output is never lost:
 *   continuation (plain-text turns) → re-request (bumped ceiling) → repair.
 * Returns combined content + summed usage. Increments a repairsUsed counter
 * (surfaced in run stats) whenever Stage 3 repair is invoked.
 */
export async function chatComplete(
  provider: LLMProvider,
  messages: LLMMessage[],
  options: CompleteOptions,
): Promise<LLMResponse> { /* ... */ }
```

Algorithm:
1. `resp = await provider.chat(messages, { ...opts, responseFormat: 'json' })`;
   `acc = resp.content`. (First turn may use JSON mode.)
2. If `isLikelyComplete(acc)` → return.
3. **Stage 1 — continuation (plain text):** append
   `{ role: 'assistant', content: acc }` and
   `{ role: 'user', content: 'Continue the JSON exactly where you left off. Output only the remaining raw JSON, no repetition, no fences.' }`,
   then call again with **`responseFormat: 'text'`** (no `json_object`) so the raw
   stream continues rather than emitting a fresh object. Concatenate. Repeat until
   complete or `maxContinuations` reached.
4. **Stage 2 — re-request:** if still incomplete and `allowReRequest`, issue one
   fresh request for the whole entry with a bumped ceiling (cost irrelevant).
5. **Stage 3 — repair (last resort):** run `repairJson(acc)`; log a loud warning
   and increment `repairsUsed`. If it still cannot parse, surface
   `ResponseParseError` (batch retry/backoff applies).


### parse.ts helpers

```ts
/** True when content parses OR has balanced top-level braces (string-aware). */
export function isLikelyComplete(content: string): boolean;

/** Best-effort repair: close unterminated strings/arrays/objects. */
export function repairJson(content: string): string;
```

### Integration points

- `enhancer.ts` replaces direct `provider.chat(...)` calls in the component,
  utility, guide, and pattern batches with `chatComplete(provider, messages, { temperature, maxTokens, responseFormat: 'json', maxContinuations, log })`.
- Verbose logs note continuation rounds, re-requests, and repairs per entry.
- The run result surfaces a `repairsUsed` count (and ideally the affected entry
  ids) so the Phase 9 live run can flag lossy entries for human review.


## Code Examples

### Detecting completeness (string-aware brace balance)

```ts
export function findJsonEnd(content: string): number {
  let depth = 0, inStr = false, esc = false;
  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') depth += 1;
    else if (ch === '}' || ch === ']') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1; // unbalanced → incomplete
}
```

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| Response truncated at token cap | Stage 1 continuation (plain-text turns), then stitch | AR #1 / PF-001 |
| Still incomplete after max rounds | Stage 2 re-request with bumped ceiling | AR #1 / PF-003 |
| Still incomplete after re-request | Stage 3 `repairJson` (last resort) + `repairsUsed` warning; if still unparseable, surface `ResponseParseError` (batch retry applies) | AR #1 / PF-003 |
| Requested `maxTokens` exceeds model limit | `resolveMaxTokens` clamps to the model ceiling (no HTTP 400) | PF-002 |
| Unknown model (not in lookup) | `FALLBACK_OUTPUT_CEILING` (4096) used | PF-002 |
| Provider returns empty content | Treated as failure → existing retry/backoff | AR #1 |
| `LLM_MAX_TOKENS` env var non-numeric | NaN-guarded → resolves to `undefined` ⇒ model ceiling used | AR #1 |

## Testing Requirements

- Unit tests for `findJsonEnd`, `isLikelyComplete`, `repairJson` (balanced,
  unbalanced, string-with-braces, truncated mid-string).
- `resolveMaxTokens`: known model returns its ceiling; unknown model returns the
  fallback; an over-limit request is clamped; `undefined` request returns ceiling.
- `chatComplete` with a mock provider that returns a deliberately split JSON over
  2–3 turns; assert the stitched result parses and equals the intended object, and
  that continuation turns are issued in **plain-text** mode (no `json_object`).
- `chatComplete` escalation: mock that never completes via continuation triggers a
  re-request, then repair, and increments `repairsUsed`.
- Config resolution: `LLM_MAX_TOKENS` env honored; non-numeric ⇒ `undefined`;
  default (unset) leaves `maxTokens` undefined so the model ceiling applies.
- Provider tests: `max_tokens` is sent in the request body for both providers and
  equals the resolved (clamped) value.

