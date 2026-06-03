# Prompt Rewrites: All Six Prompts for Maximum Richness

> **Document**: 06-prompt-rewrites.md
> **Parent**: [Index](00-index.md)

## Overview

Rewrite all six enhancer prompts to demand maximum, high-quality, grounded
output: explicit high content quotas, full-story-anchored examples, requests for
the new schema fields, and a safe **grounding self-check** (the legitimate
version of the user's earlier "review before processing" idea). Resolves AR-2,
AR-4, AR-7 at the prompt level.

## Design Principles (apply to every prompt)

1. **Strict JSON still mandatory** — every prompt keeps "return ONLY valid JSON,
   no markdown fences". This is non-negotiable; the parser depends on it.
2. **High explicit quotas** instead of "be concise" — minimum counts for dos,
   donts, patterns, anti-patterns, examples, etc.
3. **Story-anchored examples** — base `code` examples on the provided story
   `code`/`renderCode`; adapt real APIs, never invent.
4. **Grounding self-check** — final instruction: *"Before returning, verify that
   every component, prop, slot, and import you reference appears in the provided
   data. Silently drop anything that does not. Do NOT invent APIs."*
5. **Request the new schema fields** (propGuidance, antiPatterns,
   performanceNotes, themingNotes, compositionExamples, relatedPatterns,
   edgeCases — or the guide/pattern equivalents).
6. **No "rewrite this prompt" meta-instruction** — explicitly rejected during
   research (breaks JSON; encourages hallucination).

## Per-Prompt Changes

### 1. `component-enhance.ts`

New required JSON keys appended to the existing structure:
`propGuidance`, `antiPatterns`, `performanceNotes`, `themingNotes`,
`compositionExamples`, `relatedPatterns`, `edgeCases`.

Quotas (minimums; produce more when warranted):
- `bestPractices.dos` ≥ 5, `donts` ≥ 5
- `commonPatterns` ≥ 4, each with complete runnable TSX (real imports)
- `compositionExamples` ≥ 2 demonstrating slot overrides
- `antiPatterns` ≥ 3
- `accessibility.keyboardSupport` covers every interactive key
- `propGuidance` covers all non-trivial props
- `stylingTips`/`themingNotes` cite real Griffel tokens (`tokens.*`)

Grounding line references the provided props/slots/stories/relatedComponents/
additionalExports and the self-check.

### 2. `utility-enhance.ts`

Add `exportGuidance`, `performanceNotes`, `edgeCases`. Quotas:
- `commonPatterns` ≥ 4 with real export names
- `exportGuidance` covers every exported hook/function
- self-check against the provided exports

### 3. `foundation-guide.ts`

Add `keyTakeaways`, `pitfalls`, `accessibilityNotes`. Quotas:
- `codeExamples` ≥ 4, complete & runnable
- `content` is thorough multi-section markdown
- uses the now-uncapped inventory + targeted components
- self-check against inventory

### 4. `pattern-guide.ts`

Add `whenToUse`, `whenNotToUse`, `accessibilityNotes`, `pitfalls`. Quotas:
- `examples` ≥ 3 complete compositions; `components[]` accurate
- leverages targeted-component full data
- self-check

### 5. `enterprise-guide.ts`

Add `keyTakeaways`, `pitfalls`, `accessibilityNotes`. Quotas:
- `codeExamples` ≥ 4 production-grade (composition, performance, a11y, scale)
- self-check

### 6. `quick-reference.ts`

Add `keyTakeaways`, `pitfalls`. Keep it scannable but **complete** (tables, all
relevant snippets). Quotas:
- `codeExamples` ≥ 4 short, copy-pasteable
- self-check

## Shared Self-Check Snippet (appended to every system prompt)

```
GROUNDING SELF-CHECK (perform silently before returning):
- Verify every component, prop, slot, hook, and import you reference appears in
  the provided data.
- Remove anything not present — never invent APIs, props, or import paths.
- Ensure all code examples would compile against the real API surface.
Return ONLY the final valid JSON object. No prose, no markdown fences.
```

## Integration Points

- Message builders consume the enriched `ComponentSummary` and (for guides) the
  `targetComponents` full data from Phase 2.
- `enhancer.ts` raw interfaces + `mapXxx` already extended in Phase 3 to capture
  the new keys.

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| LLM ignores a quota | Output still valid; we get fewer items (acceptable) | AR #2 |
| LLM emits prose around JSON | `parseJsonResponse` strips fences/extracts object | AR #1 |
| Self-check drops a referenced component | Desired behavior (prevents hallucination) | AR #2 |

## Testing Requirements

- Each `buildXxxMessages` returns a system prompt containing the new required
  keys and the self-check block.
- Component messages include full stories (code) and compositions.
- Guide messages include targeted-component data when `targetComponentIds` set.
- Snapshot/string-contains assertions updated in `prompts.test.ts`.
