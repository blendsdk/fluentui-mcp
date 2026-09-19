# Content Pipeline: FluentUI Agent Skill

> **Document**: 03-01-content-pipeline.md
> **Parent**: [Index](00-index.md)
> **Implements**: RD-01, RD-02

## Overview

This specification covers the deterministic scraper (Layer A) and the prose-only LLM enhancer
(Layer B) that together produce `data/v9/fluentui-schema-enhanced.json`, the generator's input.

## Architecture

### Current Architecture

- `scripts/scraper/` extracts props/slots/stories from a FluentUI checkout into `fluentui-schema.json`.
- `scripts/enhancer/` enriches components and guides via a `fetch`-based OpenAI/Anthropic provider.
- `scripts/enhancer/llm/provider.ts` rejects any other provider.

### Proposed Changes

1. Correct scraper discovery/classification for full component coverage and exact names.
2. Pin the source ref to the latest stable release tag and record the commit.
3. Add a DeepSeek provider (OpenAI-compatible) with fail-fast and a 128K ceiling.
4. Add a cost estimator and confirmation gate.
5. Rewrite prompts to prose-only; drop code-bearing fields.
6. Replace patterns/enterprise with 8 category guides and 19 recipes.
7. Evolve `src/types/schema.ts` accordingly.

## Implementation Details

### Scraper: coverage and identity

- Discover exported React components from the pinned revision's stable entry point.
- Display name is the exported component name; `id` is its kebab-case.
- Emit a coverage report listing scraped components and explicit exclusions with reasons.
- Add the Button family and correct abbreviations (`ProgressBar`, `SearchBox`, `DataGrid`, …).

### Scraper: source revision

| Item | Rule |
| ---- | ---- |
| Default | Latest stable release tag at run time |
| Override | `--fluentui-ref <tag>` / `FLUENTUI_REF` |
| Recorded | `sources.fluentui.{repo,ref,commit,scrapedAt}` |

### DeepSeek provider (ported from blendsdk)

```
interface DeepSeekConfig {
  apiKey: string;              // DEEPSEEK_API_KEY
  baseUrl: string;             // DEEPSEEK_BASE_URL, default https://api.deepseek.com
  model: string;               // DEEPSEEK_MODEL, default deepseek-flash
  reasoningEffort: 'none'|'low'|'high'|'max'; // DEEPSEEK_REASONING_EFFORT, default max
}
```

- Request: `thinking: { type: 'enabled' }`, `reasoning_effort`, `max_tokens` (default 131072).
- `finish_reason === 'length'` ⇒ `truncated: true` ⇒ item fails, no file written.
- `LLM_PROVIDER=deepseek` ⇒ no fallback; any error aborts.

### Cost estimator

Report model, calls, estimated input/output tokens, and USD using DeepSeek pricing
(input `$0.30`/M, output `$1.20`/M). Prompt `[y/N]` unless `--yes` or `--dry-run`.

### Schema type changes (`src/types/schema.ts`)

| Change | Detail |
| ------ | ------ |
| `ComponentEnhanced` | Keep prose fields; remove `commonPatterns`, `compositionExamples`; add `relatedRecipes[]` |
| `AntiPattern` | Remove `code` field |
| New `CategoryGuidanceEntry` | `id`, `category`, `overview`, `whenToUse`, `bestPractices`, `accessibility`, `antiPatterns[]`, `componentIds[]` |
| New `RecipeEntry` | `id`, `title`, `group`, `goal`, `whenToUse`, `whenNotToUse`, `content`, `examples[]`, `referencedComponents[]`, `accessibilityNotes`, `pitfalls[]` |
| Root schema | Replace `patterns[]` + `enterprise[]` with `recipes[]`; add `categoryGuidance[]` |

### Guide catalog

| Kind | Ids |
| ---- | --- |
| categoryGuidance | buttons, forms, navigation, data-display, feedback, overlays, layout, utilities |
| recipes | login-form, settings-form, multi-step-form, form-validation, data-table, async-data-states, virtualization, app-navigation, tabs, breadcrumb, pagination, confirm-dialog, form-dialog, drawer, dashboard-shell, responsive-layout, controlled-uncontrolled, server-state, accessibility-basics |
| foundation | getting-started, fluent-provider, theming, styling-griffel, component-architecture, accessibility |
| quickReference | setup-imports, component-cheatsheet, styling-tokens, common-patterns, accessibility-checklist |

## Integration Points

- The raw schema feeds both enhancement and Layer A rendering (03-02).
- `serializeComponentForPrompt` and `serializeComponentSummariesBudgeted` are reused for grounding.

## Error Handling

| Error Case | Handling Strategy | AR Ref |
| ---------- | ----------------- | ------ |
| Missing `DEEPSEEK_API_KEY` | Exit non-zero naming the variable; no call | AR-08 |
| Truncated response | Fail the item; exit non-zero in DeepSeek mode | AR-08 |
| Provider 429/5xx | Retry with backoff up to `LLM_MAX_RETRIES` | AR-08 |
| Provider 4xx (non-retryable) | Fail immediately | AR-08 |
| Unknown category | Record with a warning and keep the string | AR-21 |
| No stories for a component | Render no Examples section | AR-09 |

## Testing Requirements

- Unit tests for provider config resolution, fail-fast, and truncation handling.
- Unit tests for coverage classification and name normalization.
- Unit tests for prompt shape (no code fields) and cost estimation.
- Integration test: scrape fixture `--dry-run` enhance to schema with 8 categories and 19 recipes.
