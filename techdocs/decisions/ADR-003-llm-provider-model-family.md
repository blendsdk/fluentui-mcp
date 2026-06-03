# ADR-003: LLM Provider Model-Family Request Shaping

> **Date**: 2026-06-04
> **Status**: Accepted
> **Source**: plans/maximum-enhancement (live verification, bug fix)

## Context

The enhancer talks to OpenAI and Anthropic via native `fetch` providers. During
live verification, every component failed instantly against a newer OpenAI model
(`gpt-5.5`). The root cause was an HTTP 400:

> Unsupported parameter: `max_tokens` … Use `max_completion_tokens`.

Newer OpenAI model families (GPT-5.x, and the o-series: o1/o3/o4) **require**
`max_completion_tokens` and **reject** any non-default `temperature`. Older
families (GPT-4o and earlier) use the legacy `max_tokens` and accept a custom
`temperature`. A single hard-coded request shape cannot serve both.

## Options Considered

### Option A: Pin a single model and hard-code its parameters

- **Pros**: Simplest.
- **Cons**: Brittle; breaks the moment a user picks a different model family;
  forces an arbitrary model choice on operators.

### Option B: Detect the model family and shape the request accordingly

- **Pros**: Works across GPT-4o, GPT-5.x, and o-series; degrades gracefully for
  unknown models via a conservative fallback.
- **Cons**: Requires a small model-family knowledge table to maintain.

## Decision

**Chosen option**: Option B — branch on model family in the OpenAI provider.

Implemented in `scripts/enhancer/llm/ceilings.ts`:

- `usesMaxCompletionTokens(model)` — `true` for `gpt-5*`, `o1*`, `o3*`, `o4*`.
- `supportsCustomTemperature(model)` — the inverse (newer families omit
  `temperature`).
- `ceilingForModel(model)` — token ceiling via exact match → longest family
  prefix → conservative fallback (4096).

The OpenAI provider sends `max_completion_tokens` and omits `temperature` for
newer families, and `max_tokens` + custom `temperature` for older ones.

## Rationale

Operators choose the model via `LLM_MODEL`. The provider must adapt to whichever
family they pick rather than dictating it. Family-prefix matching plus a safe
fallback keeps new models working without code changes in the common case, and
the behavior is locked in by spec tests (`capacity.spec.test.ts`). The fix was
verified live against both `gpt-5.5` and `gpt-4o` (0 failures each).

## Consequences

### Positive

- Model-agnostic enrichment across current OpenAI families.
- Graceful fallback for unknown models.
- Regression-protected by spec tests.

### Negative

- The family table needs occasional updates as providers add families.

### Risks

- A brand-new family with different parameter rules could still need a code
  tweak — mitigated by the conservative fallback and clear spec tests.
