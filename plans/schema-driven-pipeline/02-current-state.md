# Current State: Schema-Driven Pipeline

> **Document**: 02-current-state.md
> **Parent**: [Index](00-index.md)

## Existing Implementation

### What Exists

The FluentUI MCP server (v1.0.1, published on npm as `fluentui-mcp`) is a working MCP server that serves FluentUI v9 documentation to AI assistants via 12 tools. It uses an in-memory document store backed by ~80 hand-crafted (AI-generated) markdown files.

### Architecture

```
docs/v9/**/*.md  →  Scanner  →  MetadataExtractor  →  DocumentStore  →  Tools  →  MCP Protocol
                                                    →  SearchEngine (TF-IDF)
```

### Relevant Files

| File | Purpose | Changes Needed |
|------|---------|----------------|
| `src/index.ts` | MCP server entry point, tool registration, dispatch | Refactor to load schema instead of markdown |
| `src/config.ts` | Version/path configuration | Extend with schema paths |
| `src/indexer/scanner.ts` | Recursive markdown file discovery | Replace with schema loader |
| `src/indexer/metadata-extractor.ts` | Parse markdown → extract metadata | Eliminate (data already structured) |
| `src/indexer/document-store.ts` | In-memory document store with fuzzy search | Replace with SchemaStore |
| `src/indexer/index-builder.ts` | Orchestrates scan → extract → store | Replace with schema loading |
| `src/indexer/search-engine.ts` | TF-IDF full-text search | Adapt to index schema fields |
| `src/tools/*.ts` | 12 MCP tool handlers | Migrate to query SchemaStore |
| `src/types/index.ts` | Type definitions (DocumentEntry, etc.) | Extend with schema types |
| `docs/v9/**/*.md` | 80+ markdown documentation files | Become optional (schema is primary) |
| `package.json` | Package config, dependencies | Add scraper/enhancer deps |
| `.github/workflows/publish.yml` | Manual npm publish workflow | Keep, add update workflow |

### Code Analysis

**Current data flow** (3 conversions — wasteful):

1. FluentUI source → AI reads → writes markdown (human/AI process)
2. Markdown → Scanner finds files → MetadataExtractor parses text → DocumentEntry objects
3. DocumentEntry → Tools format as text → Return to LLM

**Key weakness**: Step 2 re-parses structured data (props tables, metadata) that was originally structured but got flattened to markdown. The metadata extractor uses regex patterns to find `> **Package**: ...` and markdown table rows — this is fragile and lossy.

**Current DocumentEntry type** (from `src/types/index.ts`):
```typescript
interface DocumentEntry {
  id: string;               // Unique identifier derived from file path
  title: string;            // Display name from markdown title
  content: string;          // Full raw markdown content
  filePath: string;         // Absolute file path on disk
  relativePath: string;     // Relative path within docs version folder
  module: DocumentModule;   // Which documentation module (string)
  category: ComponentCategory | null;  // Component category (null for non-component docs)
  metadata: DocumentMetadata;
}

interface DocumentMetadata {
  packageName: string | null;
  importStatement: string | null;
  description: string | null;
  seeAlso: string[];
  hasPropsTable: boolean;
  hasCodeExamples: boolean;
}
```

**Current tool pattern** (example from `query-component.ts`):
```typescript
// Tool finds document by name, returns raw markdown sections
const doc = store.findByName(componentName);
return doc.content;  // Returns the whole markdown file or sections of it
```

## Gaps Identified

### Gap 1: No Automated Data Extraction

**Current Behavior:** Documentation is written/generated manually by an AI agent reading FluentUI source and producing markdown.
**Required Behavior:** Automated scraper extracts props, slots, stories, metadata directly from TypeScript source.
**Fix Required:** Build `scripts/scraper/` with ts-morph-based extraction.

### Gap 2: No Structured Data Store

**Current Behavior:** All data lives in markdown text. Tools parse markdown to find answers.
**Required Behavior:** Structured JSON schema with typed fields. Tools query fields directly.
**Fix Required:** Design schema format, build SchemaStore, migrate tools.

### Gap 3: No Storybook Integration

**Current Behavior:** Code examples are AI-generated (may not compile, may use wrong APIs).
**Required Behavior:** Real Storybook stories extracted from FluentUI source.
**Fix Required:** Story extraction in scraper, story formatting in tools.

### Gap 4: No Utility/Contrib/Preview Coverage

**Current Behavior:** Only 47 stable v9 components documented. No utilities, no contrib, no preview.
**Required Behavior:** All components + utilities + contrib + preview extracted and served.
**Fix Required:** Expand scraper to cover all package types. Add classification logic.

### Gap 5: No Multi-Version Support

**Current Behavior:** Only v9 docs exist. Changing version requires manual doc creation.
**Required Behavior:** Configurable version with per-version extraction adapters.
**Fix Required:** Version adapter pattern in scraper. Schema per version in data/.

### Gap 6: No CI/CD for Updates

**Current Behavior:** Only a manual npm publish workflow exists. No automated doc updates.
**Required Behavior:** Manual-trigger workflow that runs full pipeline and commits results.
**Fix Required:** GitHub Actions workflow with clone → scrape → enhance → commit.

### Gap 7: No LLM Enhancement Pipeline

**Current Behavior:** All enrichment (descriptions, best practices, etc.) was done ad-hoc by AI.
**Required Behavior:** Structured LLM enhancement stage with prompts, batching, retry, and diff-based updates.
**Fix Required:** Build `scripts/enhancer/` with LLM integration.

## Dependencies

### Internal Dependencies

- Current MCP server code (to be incrementally migrated)
- Current test suite (to be adapted)
- Current npm publish workflow (to be preserved)

### External Dependencies

- **microsoft/fluentui** GitHub repository (source for scraping)
- **microsoft/fluentui-contrib** GitHub repository (source for contrib packages)
- **ts-morph** npm package (for TypeScript AST parsing)
- **LLM API** (OpenAI or Anthropic, for enhancement stage)
- **GitHub Actions** (for CI/CD pipeline)

## Risks and Concerns

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ts-morph can't resolve complex FluentUI types | Medium | High | Use controlled expansion (direct members only) + API Extractor fallback |
| FluentUI repo structure changes | Low | Medium | Version adapters isolate changes; tests catch regressions |
| LLM enhancement quality varies | Medium | Medium | Diff-based approach preserves known-good descriptions |
| Schema size too large for npm | Low | Medium | Bundle default version only; compress; lazy-load others |
| Migration breaks existing MCP users | Medium | High | Incremental migration with backward compatibility; same tool names |
| FluentUI `yarn install` too slow in CI | Medium | Low | Cache node_modules between runs; use sparse checkout |
| Contrib packages have inconsistent structure | High | Low | Scraper skips unrecognized packages gracefully; reports errors |
