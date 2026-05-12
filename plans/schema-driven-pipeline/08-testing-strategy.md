# Testing Strategy: Schema-Driven Pipeline

> **Document**: 08-testing-strategy.md
> **Parent**: [Index](00-index.md)

## Testing Overview

### Coverage Goals

- Unit tests: 90%+ coverage for all new code
- Integration tests: Key workflows covered (scrape → enhance → serve)
- E2E tests: Complete pipeline verification

### Test Framework

- **Vitest** (existing, kept as-is)
- Test files follow existing pattern: `src/__tests__/<area>/<concern>.test.ts`

## Test Categories

### Unit Tests

#### Scraper Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `scraper/discover.test.ts` | Package discovery from mock directory structure | High |
| `scraper/classify.test.ts` | Category classification for known and unknown packages | High |
| `scraper/props-extractor.test.ts` | ts-morph props extraction from mock .types.ts files | High |
| `scraper/slots-extractor.test.ts` | Slot extraction from mock Slots types | High |
| `scraper/stories-extractor.test.ts` | Story extraction from mock .stories.tsx files | High |
| `scraper/defaults-extractor.test.ts` | Default value extraction from mock hook files | Medium |
| `scraper/api-extractor-fallback.test.ts` | Fallback parsing of .api.md files | Medium |
| `scraper/v9-adapter.test.ts` | V9 adapter file-finding logic | High |
| `scraper/v8-adapter.test.ts` | V8 adapter file-finding logic | Medium |
| `scraper/config.test.ts` | Version configuration validation | Low |

#### Enhancer Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `enhancer/hasher.test.ts` | Source hash computation (deterministic, changes on data change) | High |
| `enhancer/diff.test.ts` | Diff engine (new, changed, unchanged, removed detection) | High |
| `enhancer/merge.test.ts` | Merge logic (preserve unchanged, apply new, drop removed) | High |
| `enhancer/batch.test.ts` | Batch processing with retry logic (mock LLM) | Medium |
| `enhancer/prompts.test.ts` | Prompt template rendering with component data | Low |

#### Schema/Store Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `schema/schema-loader.test.ts` | Load valid schema, handle missing file, handle invalid JSON | High |
| `schema/schema-validator.test.ts` | Validate schema format, detect missing fields, invalid enums | High |
| `schema/schema-store.test.ts` | All query methods (findComponent, fuzzy, by category, by prop, etc.) | High |
| `schema/schema-store.utilities.test.ts` | Utility queries | Medium |
| `schema/schema-store.guides.test.ts` | Guide/pattern/enterprise queries | Medium |

#### Formatter Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `formatters/component-formatter.test.ts` | Full/summary/props/examples formatting | High |
| `formatters/props-formatter.test.ts` | Props table markdown generation | High |
| `formatters/story-formatter.test.ts` | Story code block formatting | Medium |
| `formatters/guide-formatter.test.ts` | Guide content formatting | Medium |
| `formatters/list-formatter.test.ts` | List/summary formatting | Medium |
| `formatters/pattern-formatter.test.ts` | Pattern content formatting | Medium |

#### Search Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `search/search-index.test.ts` | Build index from schema, search components and guides | High |
| `search/search-engine.test.ts` | TF-IDF ranking, module filtering (adapted from existing) | High |

#### Tool Tests

| Test File | Description | Priority |
|-----------|-------------|----------|
| `tools/query-component.test.ts` | query_component with schema store | High |
| `tools/get-props-reference.test.ts` | get_props_reference with schema | High |
| `tools/get-component-examples.test.ts` | get_component_examples with stories | High |
| `tools/search-docs.test.ts` | search_docs over schema | High |
| `tools/suggest-components.test.ts` | suggest_components with structured matching | Medium |
| `tools/list-tools.test.ts` | list_all_docs and list_by_category | Medium |
| `tools/guide-tools.test.ts` | get_foundation, get_pattern, get_enterprise | Medium |
| `tools/implementation-guide.test.ts` | get_implementation_guide composition | Medium |
| `tools/reindex.test.ts` | Schema reload | Low |

### Integration Tests

| Test File | Components | Description |
|-----------|------------|-------------|
| `integration/scraper-pipeline.test.ts` | Discover + Extract + Classify | Scrape a mock FluentUI-like directory → validate output schema |
| `integration/enhancer-pipeline.test.ts` | Diff + Enhance + Merge | Mock LLM → enhance schema → validate enhanced output |
| `integration/server-pipeline.test.ts` | SchemaLoader + SchemaStore + Tools | Load test schema → call all tools → verify responses |

### End-to-End Tests

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Full schema load & query | Load bundled v9 schema → query Button → verify props | Returns accurate Button component with props table |
| Search across schema | Load schema → search "form validation" → verify results | Returns Field, Input, and form pattern guides |
| Category listing | Load schema → list by category "buttons" → verify | Returns Button, CompoundButton, etc. |
| Foundation guide | Load schema → get "getting-started" guide → verify | Returns comprehensive getting started content |
| Pattern guide | Load schema → get "login-form" pattern → verify | Returns pattern with real component examples |
| Reindex | Load schema → modify schema file → reindex → verify changes | Updated data is served |

## Test Data

### Fixtures Needed

#### Mock FluentUI Directory Structure

```
test-fixtures/
├── mock-fluentui/
│   ├── packages/
│   │   └── react-components/
│   │       ├── react-button/
│   │       │   ├── library/
│   │       │   │   ├── src/
│   │       │   │   │   ├── index.ts
│   │       │   │   │   └── components/
│   │       │   │   │       └── Button/
│   │       │   │   │           ├── Button.types.ts
│   │       │   │   │           └── useButton.ts
│   │       │   │   └── package.json
│   │       │   └── stories/
│   │       │       └── src/
│   │       │           └── Button/
│   │       │               └── ButtonDefault.stories.tsx
│   │       └── react-input/
│   │           └── ... (similar structure)
│   └── mock-contrib/
│       └── packages/
│           └── react-data-grid/
│               └── ... (similar structure)
```

#### Test Schema Files

```
test-fixtures/
├── schemas/
│   ├── test-schema-minimal.json    # Minimal valid schema (2-3 components)
│   ├── test-schema-full.json       # Full schema with all sections
│   ├── test-schema-invalid.json    # Invalid schema for validation tests
│   └── test-schema-enhanced.json   # Enhanced schema with LLM content
```

### Mock Requirements

- **Mock LLM provider**: Returns canned responses for enhancement tests (no real API calls)
- **Mock filesystem**: For scraper tests (using test fixtures, not real FluentUI repo)
- **Real schema**: For server/tool tests (use a small but realistic test schema)

**Note**: Per code.md Rule 25, we use real objects where they exist. SchemaStore, formatters, and search engine are tested with real implementations and test fixture data, NOT mocked.

## Verification Checklist

- [ ] All scraper unit tests pass
- [ ] All enhancer unit tests pass
- [ ] All schema/store unit tests pass
- [ ] All formatter unit tests pass
- [ ] All search unit tests pass
- [ ] All tool unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] No regressions in existing tests (during migration)
- [ ] Test coverage meets 90%+ goal
- [ ] Tests are split into logically grouped files (per code.md Rule 29)
