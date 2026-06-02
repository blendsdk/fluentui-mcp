# Execution Plan: Schema-Driven Pipeline

> **Document**: 99-execution-plan.md
> **Parent**: [Index](00-index.md)

## Overview

This document defines the execution phases and AI chat sessions for implementation.

## Implementation Phases

| Phase | Title | Sessions | Est. Time |
|-------|-------|----------|-----------|
| 1 | Schema Types & Test Fixtures | 2 | 2-3 hrs |
| 2 | Scraper: Discovery & Classification | 2 | 2-3 hrs |
| 3 | Scraper: Props & Slots Extraction | 3 | 3-4 hrs |
| 4 | Scraper: Stories & Defaults Extraction | 2 | 2-3 hrs |
| 5 | Scraper: CLI & Integration | 2 | 2-3 hrs |
| 6 | Enhancer: Diff Engine & Hasher | 2 | 2-3 hrs |
| 7 | Enhancer: LLM Provider & Batch Processing | 2 | 2-3 hrs |
| 8 | Enhancer: Prompts & Guide Generation | 2 | 2-3 hrs |
| 9 | Enhancer: CLI & Integration | 1 | 1-2 hrs |
| 10 | MCP Server: Schema Infrastructure | 3 | 3-4 hrs |
| 11 | MCP Server: Formatters | 2 | 2-3 hrs |
| 12 | MCP Server: Tool Migration | 3 | 3-4 hrs |
| 13 | MCP Server: Search Adaptation & E2E | 2 | 2-3 hrs |
| 14 | CI/CD Workflows | 1 | 1-2 hrs |
| 15 | Initial Data Generation & Validation | 2 | 2-4 hrs |
| 16 | Legacy Cleanup & Final Verification | 1 | 1-2 hrs |

**Total: ~31 sessions, ~30-45 hours**

---

## Phase 1: Schema Types & Test Fixtures

**Reference**: [03-schema-design.md](03-schema-design.md)

### Session 1.1: Schema Type Definitions

**Objective**: Define all TypeScript types for the FluentUI schema format.

**Tasks**:

| # | Task | File |
|---|------|------|
| 1.1.1 | Create schema type definitions (FluentUISchema, ComponentEntry, PropEntry, SlotEntry, StoryEntry, etc.) | `src/types/schema.ts` |
| 1.1.2 | Create enhancer-specific types (ComponentEnhanced, GuideEntry, PatternEntry, etc.) | `src/types/schema.ts` |
| 1.1.3 | Create utility types (UtilityEntry, UtilityExport, ParameterEntry) | `src/types/schema.ts` |
| 1.1.4 | Export new types from types/index.ts | `src/types/index.ts` |
| 1.1.5 | Create `tsconfig.build.json` (extends tsconfig.json, include only `src/`); update `tsconfig.json` to include `scripts/**/*`; update `package.json` build script to use `tsconfig.build.json` | `tsconfig.build.json`, `tsconfig.json`, `package.json` |
| 1.1.6 | Add `tsx` to devDependencies (needed for running scraper/enhancer scripts) | `package.json` |
| 1.1.7 | Add unit tests for type exports | `src/__tests__/types/schema-types.test.ts` |

**Deliverables**:
- [x] All schema types defined and exported ✅ (completed: 2026-05-12 10:42)
- [x] Types compile without errors ✅ (completed: 2026-05-12 10:43)
- [x] All tests passing ✅ (completed: 2026-05-12 10:43)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 1.2: Test Fixtures

**Objective**: Create test fixture data used by all subsequent tests.

**Tasks**:

| # | Task | File |
|---|------|------|
| 1.2.1 | Create minimal test schema JSON (3 components: Button, Input, Dialog) | `src/__tests__/fixtures/test-schema-minimal.json` |
| 1.2.2 | Create enhanced test schema JSON (with LLM-enhanced fields) | `src/__tests__/fixtures/test-schema-enhanced.json` |
| 1.2.3 | Create invalid test schema JSON (for validation tests) | `src/__tests__/fixtures/test-schema-invalid.json` |
| 1.2.4 | Create mock FluentUI directory structure for scraper tests | `src/__tests__/fixtures/mock-fluentui/` |
| 1.2.5 | Create test fixture helpers (functions to create test ComponentEntry, PropEntry, etc.) | `src/__tests__/fixtures/helpers.ts` |

**Deliverables**:
- [x] All fixture files created ✅ (completed: 2026-05-13 10:45)
- [x] Fixture helpers working and tested ✅ (completed: 2026-05-13 10:45)
- [x] All tests passing (230 tests, 11 files) ✅ (completed: 2026-05-13 10:45)

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 2: Scraper: Discovery & Classification

**Reference**: [04-scraper.md](04-scraper.md)

### Session 2.1: Package Discovery

**Objective**: Build the package discovery module that finds FluentUI component/utility packages.

**Tasks**:

| # | Task | File |
|---|------|------|
| 2.1.1 | Create scraper types (DiscoveredPackage, VersionConfig, etc.) | `scripts/scraper/types.ts` |
| 2.1.2 | Create version configuration (v9, v8 configs) | `scripts/scraper/config.ts` |
| 2.1.3 | Implement package discovery logic (glob, read package.json, classify) | `scripts/scraper/discover.ts` |
| 2.1.4 | Add unit tests for discovery | `src/__tests__/scraper/discover.test.ts` |

**Deliverables**:
- [x] Package discovery works against mock fixtures ✅ (completed: 2026-05-13 11:01)
- [x] All tests passing (272 tests, 12 files) ✅ (completed: 2026-05-13 11:01)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 2.2: Category Classification

**Objective**: Build category classification for FluentUI packages.

**Tasks**:

| # | Task | File |
|---|------|------|
| 2.2.1 | Implement category classification with regex patterns | `scripts/scraper/classify.ts` |
| 2.2.2 | Implement stability classification (stable/preview/contrib) | `scripts/scraper/classify.ts` |
| 2.2.3 | Add unit tests for classification | `src/__tests__/scraper/classify.test.ts` |

**Deliverables**:
- [x] All known packages classified correctly ✅ (completed: 2026-05-13 11:03)
- [x] Unknown packages default to 'utilities' ✅ (completed: 2026-05-13 11:03)
- [x] All tests passing (341 tests, 13 files) ✅ (completed: 2026-05-13 11:03)

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 3: Scraper: Props & Slots Extraction

**Reference**: [04-scraper.md](04-scraper.md)

### Session 3.1: Props Extractor (ts-morph)

**Objective**: Extract prop definitions from .types.ts files using ts-morph.

**Tasks**:

| # | Task | File |
|---|------|------|
| 3.1.1 | Add ts-morph dependency | `package.json` |
| 3.1.2 | Implement props extraction (direct members, JSDoc, deprecation) | `scripts/scraper/extractors/props-extractor.ts` |
| 3.1.3 | Create mock .types.ts files for testing | `src/__tests__/fixtures/mock-fluentui/` |
| 3.1.4 | Add unit tests for props extraction | `src/__tests__/scraper/props-extractor.test.ts` |

**Deliverables**:
- [x] Props extracted from mock types files ✅ (completed: 2026-05-13 11:08)
- [x] JSDoc descriptions captured ✅ (completed: 2026-05-13 11:08)
- [x] Deprecated props detected ✅ (completed: 2026-05-13 11:08)
- [x] All tests passing (368 tests, 14 files) ✅ (completed: 2026-05-13 11:08)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 3.2: Slots Extractor

**Objective**: Extract slot definitions from Slots type aliases.

**Tasks**:

| # | Task | File |
|---|------|------|
| 3.2.1 | Implement slots extraction (Slot<> generic parsing) | `scripts/scraper/extractors/slots-extractor.ts` |
| 3.2.2 | Add unit tests for slots extraction | `src/__tests__/scraper/extractors.test.ts` |

**Deliverables**:
- [x] Slots extracted with element types and required status ✅ (completed: 2026-05-13 11:08)
- [x] All tests passing ✅ (completed: 2026-05-13 11:08)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 3.3: API Extractor Fallback

**Objective**: Build fallback parser for .api.md files when ts-morph fails.

**Tasks**:

| # | Task | File |
|---|------|------|
| 3.3.1 | Implement .api.md file parser (regex-based) | `scripts/scraper/extractors/api-extractor-fallback.ts` |
| 3.3.2 | Create mock .api.md files for testing | `src/__tests__/fixtures/mock-fluentui/` |
| 3.3.3 | Add unit tests for fallback parser | `src/__tests__/scraper/extractors.test.ts` |

**Deliverables**:
- [x] Fallback parser extracts props from .api.md format ✅ (completed: 2026-05-13 11:08)
- [x] All tests passing ✅ (completed: 2026-05-13 11:08)

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 4: Scraper: Stories & Defaults Extraction

**Reference**: [04-scraper.md](04-scraper.md)

### Session 4.1: Stories Extractor

**Objective**: Extract Storybook stories from .stories.tsx files.

**Tasks**:

| # | Task | File |
|---|------|------|
| 4.1.1 | Implement story extraction (exports, descriptions, full code, render code) | `scripts/scraper/extractors/stories-extractor.ts` |
| 4.1.2 | Create mock .stories.tsx files for testing | `src/__tests__/fixtures/mock-fluentui/` |
| 4.1.3 | Add unit tests for story extraction | `src/__tests__/scraper/stories-extractor.test.ts` |

**Deliverables**:
- [x] Stories extracted with name, description, full code, render code ✅ (completed: 2026-05-13 11:12)
- [x] Import statements captured ✅ (completed: 2026-05-13 11:12)
- [x] All tests passing (396 tests, 15 files) ✅ (completed: 2026-05-13 11:12)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 4.2: Defaults Extractor

**Objective**: Extract default prop values from use*.ts hooks.

**Tasks**:

| # | Task | File |
|---|------|------|
| 4.2.1 | Implement default value extraction (destructuring, nullish coalescing) | `scripts/scraper/extractors/defaults-extractor.ts` |
| 4.2.2 | Implement utility package extractor | `scripts/scraper/extractors/utility-extractor.ts` |
| 4.2.3 | Add unit tests for defaults and utility extraction | `src/__tests__/scraper/stories-defaults.test.ts` |

**Deliverables**:
- [x] Default values extracted from common patterns ✅ (completed: 2026-05-13 11:12)
- [x] Utility exports extracted ✅ (completed: 2026-05-13 11:12)
- [x] All tests passing ✅ (completed: 2026-05-13 11:12)

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 5: Scraper: CLI & Integration

**Reference**: [04-scraper.md](04-scraper.md)

### Session 5.1: Version Adapters

**Objective**: Build version-specific adapters that orchestrate extraction.

**Tasks**:

| # | Task | File |
|---|------|------|
| 5.1.1 | Create adapter interface | `scripts/scraper/adapters/adapter.ts` |
| 5.1.2 | Implement V9 adapter (file finding, extraction orchestration) | `scripts/scraper/adapters/v9-adapter.ts` |
| 5.1.3 | ~~Implement V8 adapter~~ **(DEFERRED — future phase)** | `scripts/scraper/adapters/v8-adapter.ts` |
| 5.1.4 | Add unit tests for adapters | `src/__tests__/scraper/v9-adapter.test.ts` |

**Deliverables**:
- [x] V9 adapter finds all expected files in mock directory ✅ (completed: 2026-05-17 22:35)
- [ ] ~~V8 adapter handles different directory layout~~ (DEFERRED)
- [x] All tests passing (42 adapter tests) ✅ (completed: 2026-05-17 22:35)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 5.2: Scraper CLI & Integration Test

**Objective**: Build the CLI entry point and run full scraper integration test.

**Tasks**:

| # | Task | File |
|---|------|------|
| 5.2.1 | Implement schema output writer | `scripts/scraper/output.ts` |
| 5.2.2 | Implement CLI with arg parsing | `scripts/scraper/cli.ts` |
| 5.2.3 | Add yarn scrape script to package.json | `package.json` |
| 5.2.4 | Add integration test (mock directory → full schema output) | `src/__tests__/integration/scraper-pipeline.test.ts` |

**Deliverables**:
- [x] `yarn scrape` command works ✅ (completed: 2026-05-17 22:37)
- [x] Integration test produces valid schema JSON ✅ (completed: 2026-05-17 22:38)
- [x] All tests passing (455 tests, 17 files) ✅ (completed: 2026-05-17 22:38)

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 6: Enhancer: Diff Engine & Hasher

**Reference**: [05-enhancer.md](05-enhancer.md)

### Session 6.1: Source Hasher

**Objective**: Build deterministic hash computation for change detection.

**Tasks**:

| # | Task | File |
|---|------|------|
| 6.1.1 | Create enhancer types | `scripts/enhancer/types.ts` |
| 6.1.2 | Implement source hash computation | `scripts/enhancer/hasher.ts` |
| 6.1.3 | Add unit tests for hasher (determinism, change detection) | `src/__tests__/enhancer/hasher.test.ts` |

**Deliverables**:
- [x] Hash is deterministic for same input ✅ (completed: 2026-05-17 22:42)
- [x] Hash changes when props/slots change ✅ (completed: 2026-05-17 22:42)
- [x] All tests passing (28 hasher tests) ✅ (completed: 2026-05-17 22:42)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 6.2: Diff Engine & Merge

**Objective**: Build the diff engine that compares raw vs previous enhanced schema.

**Tasks**:

| # | Task | File |
|---|------|------|
| 6.2.1 | Implement diff engine (new, changed, unchanged, removed) | `scripts/enhancer/diff.ts` |
| 6.2.2 | Implement merge logic | `scripts/enhancer/merge.ts` |
| 6.2.3 | Add unit tests for diff and merge | `src/__tests__/enhancer/diff.test.ts`, `src/__tests__/enhancer/merge.test.ts` |

**Deliverables**:
- [x] Diff correctly identifies new/changed/unchanged/removed ✅ (completed: 2026-05-17 22:43)
- [x] Merge preserves unchanged enhancements ✅ (completed: 2026-05-17 22:44)
- [x] All tests passing (510 tests, 20 files) ✅ (completed: 2026-05-17 22:49)

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 7: Enhancer: LLM Provider & Batch Processing

**Reference**: [05-enhancer.md](05-enhancer.md)

### Session 7.1: LLM Provider Interface

**Objective**: Build the LLM provider abstraction with OpenAI and Anthropic implementations.

**Tasks**:

| # | Task | File |
|---|------|------|
| 7.1.1 | Create LLM provider interface | `scripts/enhancer/llm/provider.ts` |
| 7.1.2 | Implement OpenAI provider | `scripts/enhancer/llm/openai.ts` |
| 7.1.3 | Implement Anthropic provider | `scripts/enhancer/llm/anthropic.ts` |
| 7.1.4 | ~~Add LLM SDK dependencies~~ (N/A — Option B: native `fetch`, zero deps) | — |

**Deliverables**:
- [x] Provider interface defined ✅ (completed: 2026-06-02)
- [x] Both providers implemented ✅ (completed: 2026-06-02)
- [x] All tests passing ✅ (536 tests, 21 files)


**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 7.2: Batch Processing

**Objective**: Build batch processing with retry logic and progress reporting.

**Tasks**:

| # | Task | File |
|---|------|------|
| 7.2.1 | Implement batch processor with concurrency, retry, backoff | `scripts/enhancer/llm/batch.ts` |
| 7.2.2 | Create mock LLM provider for testing (placed in `scripts/` for reuse) | `scripts/enhancer/llm/mock.ts` |
| 7.2.3 | Add unit tests for batch processing | `src/__tests__/enhancer/llm.test.ts` |

**Deliverables**:
- [x] Batch processes items with concurrency control ✅ (completed: 2026-06-02)
- [x] Retries on failure with exponential backoff ✅ (completed: 2026-06-02)
- [x] All tests passing ✅ (536 tests, 21 files)


**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 8: Enhancer: Prompts & Guide Generation

**Reference**: [05-enhancer.md](05-enhancer.md)

### Session 8.1: Enhancement Prompts

**Objective**: Create all LLM prompt templates.

**Tasks**:

| # | Task | File |
|---|------|------|
| 8.1.1 | Create component enhancement prompt | `scripts/enhancer/prompts/component-enhance.ts` |
| 8.1.2 | Create utility enhancement prompt | `scripts/enhancer/prompts/utility-enhance.ts` |
| 8.1.3 | Create foundation guide prompt | `scripts/enhancer/prompts/foundation-guide.ts` |
| 8.1.4 | Create pattern guide prompt | `scripts/enhancer/prompts/pattern-guide.ts` |
| 8.1.5 | Create enterprise guide prompt | `scripts/enhancer/prompts/enterprise-guide.ts` |
| 8.1.6 | Create quick reference prompt | `scripts/enhancer/prompts/quick-reference.ts` |

**Deliverables**:
- [x] All prompts defined with clear output format instructions ✅ (completed: 2026-06-02)
- [x] All tests passing ✅ (completed: 2026-06-02)

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 8.2: Enhancement Orchestrator


**Objective**: Build the main enhancer that orchestrates Pass 1 (components) and Pass 2 (guides).

**Tasks**:

| # | Task | File |
|---|------|------|
| 8.2.1 | Implement enhancer orchestrator (Pass 1: components, Pass 2: guides) | `scripts/enhancer/enhancer.ts` |
| 8.2.2 | Implement enhancer configuration | `scripts/enhancer/config.ts` |
| 8.2.3 | Add integration test with mock LLM provider | `src/__tests__/enhancer/enhancer.test.ts`, `src/__tests__/enhancer/prompts.test.ts` |

**Deliverables**:
- [x] Enhancer orchestrates both passes ✅ (completed: 2026-06-02)
- [x] Integration test produces valid enhanced schema ✅ (completed: 2026-06-02)
- [x] All tests passing ✅ (560 tests, 23 files)


**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 9: Enhancer: CLI & Integration

### Session 9.1: Enhancer CLI

**Objective**: Build the CLI entry point and test full enhancer pipeline.

**Tasks**:

| # | Task | File |
|---|------|------|
| 9.1.1 | Implement CLI with arg parsing | `scripts/enhancer/cli.ts` |
| 9.1.2 | Add yarn enhance script to package.json | `package.json` |
| 9.1.3 | Add pipeline:full script to package.json | `package.json` |
| 9.1.4 | Test CLI (dry-run mode, components-only, guides-only) | Manual verification |

**Deliverables**:
- [ ] `yarn enhance` command works
- [ ] `yarn pipeline:full` runs scrape → enhance → build → test
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 10: MCP Server: Schema Infrastructure

**Reference**: [06-mcp-server-refactor.md](06-mcp-server-refactor.md)

### Session 10.1: Schema Loader & Validator

**Objective**: Build schema loading and validation.

**Tasks**:

| # | Task | File |
|---|------|------|
| 10.1.1 | Implement SchemaLoader (load from file, resolve path) | `src/schema/schema-loader.ts` |
| 10.1.2 | Implement SchemaValidator (validate required fields, enums) | `src/schema/schema-validator.ts` |
| 10.1.3 | Add unit tests | `src/__tests__/schema/schema-loader.test.ts`, `src/__tests__/schema/schema-validator.test.ts` |

**Deliverables**:
- [ ] Schema loads from test fixture files
- [ ] Validation catches invalid schemas
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 10.2: Schema Store (Components)

**Objective**: Build the SchemaStore with component query methods.

**Tasks**:

| # | Task | File |
|---|------|------|
| 10.2.1 | Implement SchemaStore constructor and component indexing | `src/schema/schema-store.ts` |
| 10.2.2 | Implement findComponent, findComponentFuzzy, getComponentsByCategory | `src/schema/schema-store.ts` |
| 10.2.3 | Implement findComponentsWithProp, suggestComponents, compareComponents | `src/schema/schema-store.ts` |
| 10.2.4 | Add unit tests for component queries | `src/__tests__/schema/schema-store.test.ts` |

**Deliverables**:
- [ ] All component query methods working
- [ ] Fuzzy matching works (Button → Button, buton → Button)
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 10.3: Schema Store (Utilities, Guides, Aggregates)

**Objective**: Complete SchemaStore with utility, guide, and aggregate queries.

**Tasks**:

| # | Task | File |
|---|------|------|
| 10.3.1 | Implement utility queries (findUtility, getAllUtilities) | `src/schema/schema-store.ts` |
| 10.3.2 | Implement guide queries (foundation, patterns, enterprise, quick-reference) | `src/schema/schema-store.ts` |
| 10.3.3 | Implement aggregate queries (getCategories, getModules, getStats, getSearchableEntries) | `src/schema/schema-store.ts` |
| 10.3.4 | Add unit tests | `src/__tests__/schema/schema-store.utilities.test.ts`, `src/__tests__/schema/schema-store.guides.test.ts` |

**Deliverables**:
- [ ] All SchemaStore methods implemented and tested
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 11: MCP Server: Formatters

**Reference**: [06-mcp-server-refactor.md](06-mcp-server-refactor.md)

### Session 11.1: Component & Props Formatters

**Objective**: Build formatters that convert schema data to markdown.

**Tasks**:

| # | Task | File |
|---|------|------|
| 11.1.1 | Implement ComponentFormatter (formatFull, formatSummary) | `src/formatters/component-formatter.ts` |
| 11.1.2 | Implement PropsFormatter (formatPropsTable, formatSlotsTable) | `src/formatters/props-formatter.ts` |
| 11.1.3 | Implement StoryFormatter (formatStories, formatSingleStory) | `src/formatters/story-formatter.ts` |
| 11.1.4 | Add unit tests | `src/__tests__/formatters/component-formatter.test.ts`, `src/__tests__/formatters/props-formatter.test.ts` |

**Deliverables**:
- [ ] Formatters produce clean, readable markdown
- [ ] Props tables render correctly
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 11.2: Guide, List & Pattern Formatters

**Objective**: Build remaining formatters.

**Tasks**:

| # | Task | File |
|---|------|------|
| 11.2.1 | Implement GuideFormatter | `src/formatters/guide-formatter.ts` |
| 11.2.2 | Implement ListFormatter | `src/formatters/list-formatter.ts` |
| 11.2.3 | Implement PatternFormatter | `src/formatters/pattern-formatter.ts` |
| 11.2.4 | Add unit tests | `src/__tests__/formatters/guide-formatter.test.ts`, `src/__tests__/formatters/list-formatter.test.ts` |

**Deliverables**:
- [ ] All formatters implemented
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 12: MCP Server: Tool Migration

**Reference**: [06-mcp-server-refactor.md](06-mcp-server-refactor.md)

### Session 12.1: Core Tools Migration

**Objective**: Migrate the 6 core tools to use SchemaStore.

**Tasks**:

| # | Task | File |
|---|------|------|
| 12.1.0 | Rewrite `tools-setup.ts` to use SchemaStore with test schema fixture (prerequisite for all tool test updates) | `src/__tests__/tools/tools-setup.ts` |
| 12.1.1 | Migrate query_component | `src/tools/query-component.ts` |
| 12.1.2 | Migrate search_docs | `src/tools/search-docs.ts` |
| 12.1.3 | Migrate list_by_category | `src/tools/list-by-category.ts` |
| 12.1.4 | Migrate get_foundation, get_pattern, get_enterprise | `src/tools/get-foundation.ts`, etc. |
| 12.1.5 | Update tool tests | `src/__tests__/tools/core-tools.test.ts` |

**Deliverables**:
- [ ] All 6 core tools use SchemaStore
- [ ] Tool output format unchanged (backward compatible)
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 12.2: Intelligence Tools Migration

**Objective**: Migrate the 4 intelligence tools.

**Tasks**:

| # | Task | File |
|---|------|------|
| 12.2.1 | Migrate suggest_components | `src/tools/suggest-components.ts` |
| 12.2.2 | Migrate get_implementation_guide | `src/tools/get-implementation-guide.ts` |
| 12.2.3 | Migrate get_component_examples | `src/tools/get-component-examples.ts` |
| 12.2.4 | Migrate get_props_reference | `src/tools/get-props-reference.ts` |
| 12.2.5 | Update tool tests | `src/__tests__/tools/intelligence-tools.test.ts` |

**Deliverables**:
- [ ] All 4 intelligence tools use SchemaStore
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 12.3: Utility Tools & Entry Point

**Objective**: Migrate utility tools and update server entry point.

**Tasks**:

| # | Task | File |
|---|------|------|
| 12.3.1 | Migrate list_all_docs | `src/tools/list-all-docs.ts` |
| 12.3.2 | Migrate reindex (reload schema) | `src/tools/reindex.ts` |
| 12.3.3 | Update src/index.ts to use SchemaLoader + SchemaStore | `src/index.ts` |
| 12.3.4 | Update src/config.ts with schema path resolution | `src/config.ts` |
| 12.3.5 | Update utility tool tests | `src/__tests__/tools/utility-tools.test.ts` |

**Deliverables**:
- [ ] All 12 tools migrated
- [ ] Server starts from schema (not markdown)
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 13: MCP Server: Search Adaptation & E2E

### Session 13.1: Search Engine Adaptation

**Objective**: Adapt search engine to index schema fields.

**Tasks**:

| # | Task | File |
|---|------|------|
| 13.1.1 | Implement search index builder from schema | `src/search/search-index.ts` |
| 13.1.2 | Adapt search engine for schema entries | `src/search/search-engine.ts` |
| 13.1.3 | Add search tests | `src/__tests__/search/search-index.test.ts` |

**Deliverables**:
- [ ] Search indexes all schema content
- [ ] Search returns relevant results
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

### Session 13.2: E2E Tests & Server Integration

**Objective**: Full end-to-end testing of the schema-driven server.

**Tasks**:

| # | Task | File |
|---|------|------|
| 13.2.1 | Update E2E full pipeline test | `src/__tests__/e2e/full-pipeline.test.ts` |
| 13.2.2 | Add server integration test (schema → tools → MCP) | `src/__tests__/integration/server-pipeline.test.ts` |
| 13.2.3 | Verify all existing E2E scenarios still pass | Existing test files |

**Deliverables**:
- [ ] E2E tests pass with schema-driven server
- [ ] All integration tests pass
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 14: CI/CD Workflows

**Reference**: [07-cicd-automation.md](07-cicd-automation.md)

### Session 14.1: GitHub Actions Workflows

**Objective**: Create CI, update-docs, and enhance publish workflows.

**Tasks**:

| # | Task | File |
|---|------|------|
| 14.1.1 | Create CI workflow (build + test on PR) | `.github/workflows/ci.yml` |
| 14.1.2 | Create update-docs workflow (scrape → enhance → PR) | `.github/workflows/update-docs.yml` |
| 14.1.3 | Update publish workflow (verify data/ in package) | `.github/workflows/publish.yml` |
| 14.1.4 | Update package.json files field (data/ instead of docs/) | `package.json` |

**Deliverables**:
- [ ] CI workflow defined
- [ ] Update-docs workflow defined
- [ ] Publish workflow updated
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 15: Initial Data Generation & Validation

### Session 15.1: Run Scraper Against Real FluentUI

**Objective**: Scrape actual FluentUI source and generate real schema.

**Tasks**:

| # | Task | File |
|---|------|------|
| 15.1.1 | Clone FluentUI repo (sparse checkout) | `/tmp/fluentui` |
| 15.1.2 | Clone FluentUI-contrib repo | `/tmp/fluentui-contrib` |
| 15.1.3 | Run `yarn scrape --version v9` against real source | `data/v9/fluentui-schema.json` |
| 15.1.4 | Validate output schema (component count, prop accuracy) | Manual + automated |
| 15.1.5 | Fix any scraper issues discovered | Various |

**Deliverables**:
- [ ] Real v9 schema generated with 80+ components
- [ ] Schema validates correctly
- [ ] All tests passing

### Session 15.2: Run Enhancer & Validate

**Objective**: Enhance the real schema with LLM and validate quality.

**Tasks**:

| # | Task | File |
|---|------|------|
| 15.2.1 | Run `yarn enhance --version v9 --full` | `data/v9/fluentui-schema-enhanced.json` |
| 15.2.2 | Validate enhanced schema (descriptions present, props correct) | Manual + automated |
| 15.2.3 | Verify MCP server starts and tools work with real schema | Manual testing |
| 15.2.4 | Fix any enhancer issues discovered | Various |

**Deliverables**:
- [ ] Enhanced v9 schema with LLM-enriched content
- [ ] MCP server works with real data
- [ ] All tests passing

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Phase 16: Legacy Cleanup & Final Verification

### Session 16.1: Cleanup & Documentation

**Objective**: Remove legacy code, update documentation, final verification.

**Tasks**:

| # | Task | File |
|---|------|------|
| 16.1.1 | Remove src/indexer/ (legacy markdown-based code) | `src/indexer/` |
| 16.1.2 | Remove legacy tests | `src/__tests__/indexer/` |
| 16.1.3 | Update README.md with new architecture | `README.md` |
| 16.1.4 | Update maintenance/DOCS-MAINTENANCE.md | `maintenance/DOCS-MAINTENANCE.md` |
| 16.1.5 | Final build & test | All |
| 16.1.6 | Move `npm-check-updates` from `dependencies` to `devDependencies` | `package.json` |
| 16.1.7 | Version bump in package.json (1.2.0 — backward-compatible MCP API, internal refactor) | `package.json` |

**Deliverables**:
- [ ] Legacy code removed
- [ ] Documentation updated
- [ ] All tests passing
- [ ] Ready for npm publish

**Verify**: `clear && yarn clean && yarn build && yarn test`

---

## Task Checklist (All Phases)

### Phase 1: Schema Types & Test Fixtures
- [x] 1.1.1 Create schema type definitions ✅ (completed: 2026-05-12 10:39)
- [x] 1.1.2 Create enhancer-specific types ✅ (completed: 2026-05-12 10:39)
- [x] 1.1.3 Create utility types ✅ (completed: 2026-05-12 10:39)
- [x] 1.1.4 Export new types ✅ (completed: 2026-05-12 10:40)
- [x] 1.1.5 Create tsconfig.build.json + update build config ✅ (completed: 2026-05-12 10:41)
- [x] 1.1.6 Add tsx to devDependencies ✅ (completed: 2026-05-12 10:41)
- [x] 1.1.7 Add type tests ✅ (completed: 2026-05-12 10:42)
- [x] 1.2.1 Create minimal test schema ✅ (completed: 2026-05-13 10:39)
- [x] 1.2.2 Create enhanced test schema ✅ (completed: 2026-05-13 10:41)
- [x] 1.2.3 Create invalid test schema ✅ (completed: 2026-05-13 10:41)
- [x] 1.2.4 Create mock FluentUI directory ✅ (completed: 2026-05-13 10:43)
- [x] 1.2.5 Create fixture helpers ✅ (completed: 2026-05-13 10:38)

### Phase 2: Scraper Discovery & Classification
- [x] 2.1.1 Create scraper types ✅ (completed: 2026-05-13 10:56)
- [x] 2.1.2 Create version configuration ✅ (completed: 2026-05-13 10:57)
- [x] 2.1.3 Implement package discovery ✅ (completed: 2026-05-13 10:58)
- [x] 2.1.4 Add discovery tests ✅ (completed: 2026-05-13 11:01)
- [x] 2.2.1 Implement category classification ✅ (completed: 2026-05-13 11:02)
- [x] 2.2.2 Implement stability classification ✅ (completed: 2026-05-13 11:02)
- [x] 2.2.3 Add classification tests ✅ (completed: 2026-05-13 11:03)

### Phase 3: Scraper Props & Slots
- [x] 3.1.1 Add ts-morph dependency ✅ (completed: 2026-05-13 11:06)
- [x] 3.1.2 Implement props extraction ✅ (completed: 2026-05-13 11:06)
- [x] 3.1.3 Create mock types files ✅ (pre-existing from Phase 1.2)
- [x] 3.1.4 Add props tests ✅ (completed: 2026-05-13 11:08)
- [x] 3.2.1 Implement slots extraction ✅ (completed: 2026-05-13 11:07)
- [x] 3.2.2 Add slots tests ✅ (completed: 2026-05-13 11:08)
- [x] 3.3.1 Implement API Extractor fallback ✅ (completed: 2026-05-13 11:07)
- [x] 3.3.2 Create mock .api.md files ✅ (completed: 2026-05-13 11:07)
- [x] 3.3.3 Add fallback tests ✅ (completed: 2026-05-13 11:08)

### Phase 4: Scraper Stories & Defaults
- [x] 4.1.1 Implement story extraction ✅ (completed: 2026-05-13 11:10)
- [x] 4.1.2 Create mock stories ✅ (pre-existing from Phase 1.2)
- [x] 4.1.3 Add story tests ✅ (completed: 2026-05-13 11:12)
- [x] 4.2.1 Implement defaults extraction ✅ (completed: 2026-05-13 11:10)
- [x] 4.2.2 Implement utility extractor ✅ (completed: 2026-05-13 11:11)
- [x] 4.2.3 Add defaults/utility tests ✅ (completed: 2026-05-13 11:12)

### Phase 5: Scraper CLI & Integration
- [x] 5.1.1 Create adapter interface ✅ (completed: 2026-05-17 22:31)
- [x] 5.1.2 Implement V9 adapter ✅ (completed: 2026-05-17 22:32)
- [ ] ~~5.1.3 Implement V8 adapter~~ (DEFERRED)
- [x] 5.1.4 Add adapter tests ✅ (completed: 2026-05-17 22:34)
- [x] 5.2.1 Implement schema output writer ✅ (completed: 2026-05-17 22:36)
- [x] 5.2.2 Implement CLI ✅ (completed: 2026-05-17 22:36)
- [x] 5.2.3 Add yarn scrape script ✅ (completed: 2026-05-17 22:37)
- [x] 5.2.4 Add scraper integration test ✅ (completed: 2026-05-17 22:38)

### Phase 6: Enhancer Diff & Hash
- [x] 6.1.1 Create enhancer types ✅ (completed: 2026-05-17 22:41)
- [x] 6.1.2 Implement source hasher ✅ (completed: 2026-05-17 22:41)
- [x] 6.1.3 Add hasher tests ✅ (completed: 2026-05-17 22:42)
- [x] 6.2.1 Implement diff engine ✅ (completed: 2026-05-17 22:43)
- [x] 6.2.2 Implement merge logic ✅ (completed: 2026-05-17 22:44)
- [x] 6.2.3 Add diff/merge tests ✅ (completed: 2026-05-17 22:49)

### Phase 7: Enhancer LLM & Batch
- [x] 7.1.1 Create LLM provider interface (`scripts/enhancer/llm/provider.ts` — LLMError, isRetryableStatus, resolveProviderConfig, createProvider)
- [x] 7.1.2 Implement OpenAI provider (`scripts/enhancer/llm/openai.ts`)
- [x] 7.1.3 Implement Anthropic provider (`scripts/enhancer/llm/anthropic.ts`)
- [x] 7.1.4 ~~Add LLM SDK dependencies~~ — **N/A**: chose Option B (native `fetch`, zero new deps). Decision recorded in `provider.ts` header.
- [x] 7.2.1 Implement batch processor (`scripts/enhancer/llm/batch.ts` — concurrency, retry, exponential backoff)
- [x] 7.2.2 Create mock LLM provider (`scripts/enhancer/llm/mock.ts` — placed under `scripts/` so both tooling and tests can import it)
- [x] 7.2.3 Add batch tests (`src/__tests__/enhancer/llm.test.ts` — 26 tests covering providers, config, batch, mock)


### Phase 8: Enhancer Prompts & Guides
- [x] 8.1.1-8.1.6 Create all prompt templates ✅ (completed: 2026-06-02 — component, utility, foundation, pattern, enterprise, quick-reference prompts + shared grounding + barrel)
- [x] 8.2.1 Implement enhancer orchestrator ✅ (completed: 2026-06-02 — `scripts/enhancer/enhancer.ts`, two-pass, incremental carry-forward, batch-driven)
- [x] 8.2.2 Implement enhancer config ✅ (completed: 2026-06-02 — `scripts/enhancer/config.ts` guide catalogs + runtime config; also `parse.ts` robust JSON parsing)
- [x] 8.2.3 Add enhancer integration test ✅ (completed: 2026-06-02 — `enhancer.test.ts` 5 + `prompts.test.ts` 19 = 24 new tests)


### Phase 9: Enhancer CLI
- [ ] 9.1.1 Implement CLI
- [ ] 9.1.2 Add yarn enhance script
- [ ] 9.1.3 Add pipeline:full script
- [ ] 9.1.4 Test CLI modes

### Phase 10: MCP Schema Infrastructure
- [ ] 10.1.1 Implement SchemaLoader
- [ ] 10.1.2 Implement SchemaValidator
- [ ] 10.1.3 Add loader/validator tests
- [ ] 10.2.1 Implement SchemaStore constructor
- [ ] 10.2.2 Implement component queries
- [ ] 10.2.3 Implement structured queries
- [ ] 10.2.4 Add store tests
- [ ] 10.3.1 Implement utility queries
- [ ] 10.3.2 Implement guide queries
- [ ] 10.3.3 Implement aggregate queries
- [ ] 10.3.4 Add utility/guide tests

### Phase 11: Formatters
- [ ] 11.1.1 Implement ComponentFormatter
- [ ] 11.1.2 Implement PropsFormatter
- [ ] 11.1.3 Implement StoryFormatter
- [ ] 11.1.4 Add formatter tests
- [ ] 11.2.1 Implement GuideFormatter
- [ ] 11.2.2 Implement ListFormatter
- [ ] 11.2.3 Implement PatternFormatter
- [ ] 11.2.4 Add remaining formatter tests

### Phase 12: Tool Migration
- [ ] 12.1.1-12.1.4 Migrate 6 core tools
- [ ] 12.1.5 Update core tool tests
- [ ] 12.2.1-12.2.4 Migrate 4 intelligence tools
- [ ] 12.2.5 Update intelligence tool tests
- [ ] 12.3.1-12.3.2 Migrate 2 utility tools
- [ ] 12.3.3 Update src/index.ts
- [ ] 12.3.4 Update src/config.ts
- [ ] 12.3.5 Update utility tool tests

### Phase 13: Search & E2E
- [ ] 13.1.1 Implement search index builder
- [ ] 13.1.2 Adapt search engine
- [ ] 13.1.3 Add search tests
- [ ] 13.2.1 Update E2E tests
- [ ] 13.2.2 Add server integration test
- [ ] 13.2.3 Verify all scenarios

### Phase 14: CI/CD
- [ ] 14.1.1 Create CI workflow
- [ ] 14.1.2 Create update-docs workflow
- [ ] 14.1.3 Update publish workflow
- [ ] 14.1.4 Update package.json files field

### Phase 15: Initial Data Generation
- [ ] 15.1.1-15.1.5 Scrape real FluentUI
- [ ] 15.2.1-15.2.4 Enhance and validate

### Phase 16: Cleanup
- [ ] 16.1.1 Remove legacy indexer code
- [ ] 16.1.2 Remove legacy tests
- [ ] 16.1.3 Update README
- [ ] 16.1.4 Update maintenance docs
- [ ] 16.1.5 Final build & test
- [ ] 16.1.6 Version bump to 1.2.0

---

## Session Protocol

### Starting a Session

```bash
# 1. Start agent settings
clear && scripts/agent.sh start

# 2. Reference this plan
# "Implement Phase X, Session X.X per plans/schema-driven-pipeline/99-execution-plan.md"
```

### Ending a Session

```bash
# 1. Verify tests pass
clear && yarn clean && yarn build && yarn test

# 2. End agent settings
clear && scripts/agent.sh finished

# 3. Compact conversation
/compact
```

### Between Sessions

1. Review completed tasks in this checklist
2. Mark completed items with [x]
3. Start new conversation for next session
4. Reference next session's tasks

---

## Dependencies

```
Phase 1 (Types & Fixtures)
    ↓
Phase 2-5 (Scraper)          Phase 10-11 (Schema Infra & Formatters)
    ↓                              ↓
Phase 6-9 (Enhancer)         Phase 12-13 (Tool Migration & E2E)
    ↓                              ↓
Phase 14 (CI/CD)             Phase 15 (Data Generation)
    ↓                              ↓
           Phase 16 (Cleanup)
```

**Note**: Phases 2-5 (Scraper) and Phases 10-11 (Schema Infrastructure) can be developed in parallel since they don't depend on each other. Phases 6-9 (Enhancer) depends on the Scraper. Phases 12-13 (Tool Migration) depends on Schema Infrastructure.

---

## Success Criteria

**Feature is complete when**:

1. ✅ `yarn scrape --version v9` extracts 80+ components from FluentUI source
2. ✅ `yarn enhance --version v9` enriches schema with LLM content
3. ✅ MCP server loads from enhanced JSON schema
4. ✅ All 12 tools work with schema-driven data
5. ✅ All tests passing (existing + new)
6. ✅ CI/CD workflows defined and functional
7. ✅ README and maintenance docs updated
8. ✅ npm package builds and publishes with bundled schema
