# ADR-004: DeepSeek-flash-max with fail-fast and no fallback

> **Status**: Accepted
> **Date**: 2026-09-19
> **Authorising decision**: AR-8, AR-10

## Context

Layer B prose is written by an LLM. The choice of provider affects cost, output size, and how the
pipeline behaves when a call fails. A pipeline that silently falls back to a weaker model, or that
quietly drops entries, produces a tree that looks complete but is not.

## Decision

Use one provider and make its limits explicit:

- Provider `deepseek` with the `deepseek-flash` model.
- `reasoning_effort` set to `max`.
- A 131,072-token output cap and a 600-second request timeout.
- **Fail fast.** On an error the run stops and exits non-zero; there is no fallback provider and no
  partial success.
- Enhancement is incremental: each entry is hashed, and only changed entries are re-sent.

## Alternatives considered

- **OpenAI or Anthropic.** Viable providers, but the project standardised on the DeepSeek mechanism
  already used by the author's toolchain.
- **Multi-provider fallback.** Rejected: it hides failures and makes output provenance unclear.
- **A local model.** Rejected: lower prose quality and a heavier operational footprint.

## Consequences

- A failed enhancement run is visible and repeatable rather than silently partial.
- Cost is bounded by the incremental hash and by `--dry-run`, which previews a diff without calls.
- The project depends on a single provider; a provider outage stops enhancement, not generation or
  validation, which stay offline.
