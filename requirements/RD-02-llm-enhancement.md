# RD-02: LLM Enhancement (Layer B)

> **Document**: RD-02-llm-enhancement.md
> **Status**: Draft
> **Created**: 2026-09-19
> **Project**: FluentUI Agent Skill
> **Depends On**: RD-01
> **CodeOps Skills Version**: 3.20.0

---

## Feature Overview

This requirement defines the only LLM stage in the pipeline. Its job is narrow by design: add
synthesized **prose** to the deterministic API surface — descriptions, when-to-use guidance,
best practices, accessibility notes, anti-patterns, edge cases, and task recipes. It does not
author code examples; those come from scraped stories (RD-01). Narrowing the LLM to prose keeps
cost low, shrinks the hallucination surface, and limits what must be validated.

The stage uses the blendsdk v5 LLM mechanism: DeepSeek `deepseek-flash` in thinking mode at
`reasoning_effort=max`, an upfront cost estimate, a confirmation prompt, and **fail-fast** behavior.
A missing API key, a provider error, or a truncated response aborts the item/run rather than
writing partial or fallback documentation.

## Functional Requirements

### Must Have

- [ ] A DeepSeek provider is implemented over the OpenAI-compatible protocol
      (`DEEPSEEK_BASE_URL`, default `https://api.deepseek.com`), with thinking enabled and
      `reasoning_effort` from `DEEPSEEK_REASONING_EFFORT` (default `max`).
- [ ] The provider uses an output ceiling of 131,072 tokens and a 600-second timeout, matching the
      blendsdk DeepSeek limits.
- [ ] When `LLM_PROVIDER=deepseek`, any failure aborts the run (no fallback to OpenAI/Anthropic,
      no placeholder file).
- [ ] A response whose `finish_reason` is `length` is treated as truncated: the item fails and is
      not written.
- [ ] Per-component enhancement produces **prose only**: `description`, `whenToUse`,
      `bestPractices {dos[], donts[]}`, `accessibility`, `propGuidance[]`, `antiPatterns[]`
      (without code), `performanceNotes`, `themingNotes`, `edgeCases[]`, `relatedRecipes[]`.
      The fields `commonPatterns` and `compositionExamples` are not produced.
- [ ] Category guidance is generated once per schema category (8 documents): `overview`,
      `whenToUse`, `bestPractices`, `accessibility`, `antiPatterns[]` (prose), `componentIds[]`.
- [ ] Task recipes are generated for the agreed set (below), each with `id`, `title`, `group`,
      `goal`, `whenToUse`, `whenNotToUse`, `content`, `examples[]` (code allowed), `referencedComponents[]`,
      `accessibilityNotes`, `pitfalls[]`.
- [ ] Foundation guides (6) and quick-reference documents (5) are generated.
- [ ] The enhancer is incremental: each source entry is hashed; unchanged entries keep their
      existing content unless `--full` is passed.
- [ ] Before any paid call, a cost estimate is printed; the run requires explicit confirmation
      unless `--yes` is passed; `--dry-run` performs no calls.

### Should Have

- [ ] Rate-limit and server-error responses are retried with exponential backoff up to
      `LLM_MAX_RETRIES` (default 3); client errors are not retried.
- [ ] Token usage (input, output, reasoning) is reported per run.
- [ ] Category guidance and recipes receive the full prop/slot inventory of their target
      components, subject to a documented input budget with no silent truncation.

### Won't Have (Out of Scope)

- LLM-generated code examples for components — AR-09.
- Per-component code snippets, `commonPatterns`, or `compositionExamples` — AR-09.
- Fallback to OpenAI/Anthropic, or any silent placeholder content — AR-08.
- Widening to docs-era breadth (48 patterns) — AR-17.

## Technical Requirements

### Configuration

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `LLM_PROVIDER` | Yes | — | Must be `deepseek` |
| `DEEPSEEK_API_KEY` | Yes | — | Provider credential; never committed |
| `DEEPSEEK_MODEL` | No | `deepseek-flash` | Model id |
| `DEEPSEEK_BASE_URL` | No | `https://api.deepseek.com` | OpenAI-compatible endpoint |
| `DEEPSEEK_REASONING_EFFORT` | No | `max` | One of `none`, `low`, `high`, `max` |
| `LLM_CONCURRENCY` | No | 3 | Parallel requests |
| `LLM_MAX_RETRIES` | No | 3 | Retry attempts |

### Recipe catalog (Layer C, generated here)

| Group | Recipes |
|-------|---------|
| forms | `login-form`, `settings-form`, `multi-step-form`, `form-validation` |
| data | `data-table`, `async-data-states`, `virtualization` |
| navigation | `app-navigation`, `tabs`, `breadcrumb`, `pagination` |
| modals | `confirm-dialog`, `form-dialog`, `drawer` |
| layout | `dashboard-shell`, `responsive-layout` |
| state | `controlled-uncontrolled`, `server-state` |
| accessibility | `accessibility-basics` |

### Category guidance

One document per category: `buttons`, `forms`, `navigation`, `data-display`, `feedback`,
`overlays`, `layout`, `utilities`. Buttons depth depends on the completed scraper coverage
(RD-01).

### Cost estimate and confirmation

The estimator reports model, call count, estimated input/output tokens, and estimated USD using
published DeepSeek pricing. The prompt blocks on `[y/N]` unless `--yes` or `--dry-run` is set.

## Integration Points

### With RD-01 (Content Model)

All prompts are grounded in the raw schema. The enhancer must never introduce a component, prop,
or slot that is absent from that data.

### With RD-03 (Deterministic Skill Generator)

The enhancer writes `data/v9/fluentui-schema-enhanced.json`; the generator consumes it. New prose
types (`categoryGuidance`, `recipes`) must round-trip through schema types and the validator.

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale | AR Ref |
|----------|-------------------|--------|-----------|--------|
| Provider | Existing OpenAI/Anthropic / blendsdk DeepSeek | DeepSeek `deepseek-flash`, `reasoning_effort=max` | Proven mechanism; user directive | AR-08 |
| Failure policy | Fallback / placeholder / fail-fast | Fail-fast, no fallback | Wrong docs are worse than a failed run | AR-08 |
| LLM scope | Rich per-component incl. code / prose only | Prose only | Accuracy, cost, smaller validation surface | AR-09 |
| Recipes | Docs-era 48 / ~18 task recipes | ~18 recipes | High-signal, validatable | AR-17 |
| Guidance grouping | Per component / per category | Per category (8) | Aggregates cross-cutting advice cheaply | AR-18 |
| Regeneration | Reuse existing JSON / regenerate fresh | Regenerate fresh | Consistent new-shape corpus | AR-10 |

## Security Considerations

> **🚨 Mandatory.** The pipeline holds a provider credential and processes third-party text.

- **Data sensitivity**: the API key is a secret; scraped source is public.
- **Input validation**: prompts are built from validated schema data, never from raw network
  input; provider responses are parsed defensively.
- **Authentication & authorization**: N/A — outbound authenticated API calls only.
- **Injection risks**: prompt injection from scraped JSDoc/story text is mitigated by the
  grounding self-check and the RD-04 API-reference gate; no provider response is executed.
- **Encryption needs**: HTTPS to the DeepSeek endpoint; the `.env` file is gitignored.
- **Rate limiting**: client-side concurrency cap and backoff prevent provider abuse.
- **Infrastructure**: no containers; secrets provided via environment only.

## Acceptance Criteria

1. [ ] With `LLM_PROVIDER=deepseek` and no `DEEPSEEK_API_KEY`, the enhancer exits non-zero with a
       message naming the missing variable and makes no network call.
2. [ ] Setting `DEEPSEEK_MODEL=deepseek-flash` and `DEEPSEEK_REASONING_EFFORT=max` sends both in
       the request; an unsupported effort value is rejected before any call.
3. [ ] A stubbed truncated response (`finish_reason=length`) fails that item and writes no file;
       the run exits non-zero in DeepSeek mode.
4. [ ] Generated component `enhanced` objects contain no `commonPatterns` or `compositionExamples`
       keys, and no prose field contains a fenced code block.
5. [ ] The enhanced schema contains exactly 8 `categoryGuidance` entries and the 19 recipe ids
       listed above.
6. [ ] `--dry-run` makes zero LLM calls and writes no files; the cost report is still printed.
7. [ ] `--full` re-enhances every item; without it, an item whose `sourceHash` is unchanged is
       skipped.
8. [ ] Security requirements verified: a secret scan of the generated JSON and logs finds no
       key-like material.
