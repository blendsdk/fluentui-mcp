# Ambiguity Register: Maximum Enhancement

> **Status**: ✅ GATE PASSED — all 7 items resolved
> **Last Updated**: 2026-06-02

This register is the audit trail for every design decision in the
`maximum-enhancement` plan. Each plan document references these AR numbers.

## Context

The user wants the FluentUI v9 documentation enrichment (the **enhancer**
pipeline) to produce the **best-possible, maximum-richness** output to beat two
competitors producing the same kind of product. Explicit directives:

- "Add all available stories as much as possible"
- "Having `KEY_PROPS_LIMIT` is not good at all — we need all the properties, not shortcuts"
- "Add all compositions as much as possible"
- "Do not limit, truncate, or anything like that"
- "The cost is of no importance"

## Register

| # | Category | Ambiguity / Gap | Options Presented | User Decision | Status |
|---|----------|-----------------|-------------------|---------------|--------|
| 1 | Technical | LLM output truncation: Anthropic caps at 4096 tokens, orchestrator never passes `maxTokens`; maximal output would truncate JSON and drop entries | (a) Raise default + make configurable; (b) (a) + auto-continuation/JSON-repair so output is never truncated | **(b)** Raise to model ceiling + auto-continuation/JSON-repair | ✅ Resolved |
| 2 | Scope | Content-only enrichment vs schema expansion | (a) Keep existing shapes, richer/longer content; (b) Extend schema with new rich fields | **(b)** Expand the schema with new enhanced fields | ✅ Resolved |
| 3 | Technical | Guide grounding inventory size — full data for all 62 components per guide call risks context overflow (silent data loss) | (a) Smart-maximal: full targeted-component data + uncapped props/slots/imports for the rest; (b) Blind full-everything for all 62 in every call | **(a)** Smart-maximal grounding | ✅ Resolved |
| 4 | Technical | How much story content to inject into component prompts | (a) All stories, `renderCode` only; (b) All stories, full `code` (imports+styles+render) | **(b)** Full story `code`, all stories | ✅ Resolved |
| 5 | Technical | Default model | (a) Keep current defaults; (b) Upgrade default model | **(b-refined)** Default `gpt-4o`, honor `.env` (`LLM_PROVIDER`/`LLM_MODEL`) | ✅ Resolved |
| 6 | Technical | `KEY_PROPS_LIMIT` (6-prop cap in `shared.ts`) | Remove entirely | **Remove** — all props always | ✅ Resolved |
| 7 | Scope | Compositions/slots inclusion in component prompts | Include all slots + `relatedComponents` + `additionalExports`, instruct rich composition examples | **Confirmed** — include all | ✅ Resolved |

## Resolution Notes

**AR-1:** "Never truncate" is impossible with a fixed 4096-token cap and a
strict-JSON parser. Resolution: thread `maxTokens` from config through the
orchestrator into both providers; default it to each model's true output
ceiling; add a continuation loop that detects incomplete JSON (parse failure or
unbalanced braces) and requests the remainder, then stitches and repairs. This
guarantees no component/guide is dropped due to size.

**AR-2:** Schema expansion is what differentiates us from competitors. New
fields are additive and optional (back-compat preserved). See `05-schema-expansion.md`.

**AR-3:** "Maximum quality" means *most usable output*. Blindly stuffing all 62
components' full data into a single guide call can exceed the model context
window and cause the call to fail or silently drop content — which is *less*
data, not more. Smart-maximal injects the full inventory at uncapped detail and
additionally injects the complete data for the components a guide specifically
targets.

**AR-4:** User emphasized stories twice. Cost is irrelevant, so we inject the
full story `code` (imports + styles + render), for all stories.

**AR-5:** Default `gpt-4o`; `.env` values (`LLM_PROVIDER`, `LLM_MODEL`) take
precedence per existing `resolveProviderConfig`/`resolveEnhancerConfig`.

**AR-6:** `KEY_PROPS_LIMIT` removed entirely; component summaries carry the full
prop set with types.

**AR-7:** Component prompts include all slots, `relatedComponents`, and
`additionalExports`, with explicit instructions to produce rich
slot-composition examples.

## Runtime Additions

New ambiguities discovered during execution will be appended here tagged
`(runtime)` with the next sequential number.
