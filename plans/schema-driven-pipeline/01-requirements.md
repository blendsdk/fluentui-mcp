# Requirements: Schema-Driven Pipeline

> **Document**: 01-requirements.md
> **Parent**: [Index](00-index.md)

## Feature Overview

Transform the FluentUI MCP server from a static, manually-maintained markdown documentation server into an automatically-updatable, schema-driven system. The system will scrape FluentUI source code, enrich it with LLM-generated content, and serve structured data directly to AI assistants via the MCP protocol.

## Functional Requirements

### Must Have

- [ ] **Scraper**: Automated extraction of component data from FluentUI TypeScript source code
  - Props interfaces (name, type, required, default, JSDoc description)
  - Slot definitions (name, element type, required)
  - Package metadata (name, version, import paths)
  - Storybook stories (full working examples with imports/styles)
  - Deprecation status (from `@deprecated` JSDoc tags)
- [ ] **Utility packages**: Extract and document utility packages (react-aria, react-positioning, react-tabster, react-motion, react-portal, react-theme, etc.)
- [ ] **Contrib packages**: Scrape and include `@fluentui-contrib/*` packages
- [ ] **Preview/unstable**: Detect and classify preview/unstable components
- [ ] **Multi-version architecture**: Configurable version support with per-version adapter pattern (V9 implemented; V8 adapter deferred to future phase)
- [ ] **LLM enhancement**: AI-enriched descriptions, best practices, accessibility guidance, patterns
- [ ] **Diff-based updates**: Only re-enhance components that have changed since last run
- [ ] **Schema-driven MCP**: Server reads from JSON schema instead of markdown files
- [ ] **Backward-compatible tools**: All 12 existing MCP tool names preserved (same interface for users)
- [ ] **CI/CD pipeline**: Manual-trigger GitHub Action that runs full pipeline and commits results
- [ ] **Real Storybook examples**: Include actual working code from Microsoft's Storybook

### Should Have

- [ ] **Structured queries**: Cross-component queries (e.g., "all components with `appearance` prop")
- [ ] **Component comparison**: Compare props between similar components
- [ ] **Version diffing**: Show what changed between FluentUI versions
- [ ] **Markdown doc generation**: Optional generation of markdown docs from schema (for GitHub browsability)
- [ ] **Foundation guide generation**: LLM-generated getting-started, theming, styling, accessibility guides
- [ ] **Pattern guide generation**: LLM-generated form patterns, layout patterns, navigation patterns, etc.
- [ ] **Enterprise guide generation**: LLM-generated dashboard, admin panel, data visualization patterns
- [ ] **Quick reference generation**: LLM-generated cheatsheets and checklists

### Won't Have (Out of Scope)

- Live API integration (no runtime calls to FluentUI source or npm)
- Visual component previews or screenshots
- Automatic PR merging (manual review required)
- v0 (Northstar) support — only v8+ supported
- Type-checking or compilation of scraped examples (stories are included as-is)

## Technical Requirements

### Performance

- MCP server startup: < 2 seconds (JSON parsing, not file scanning)
- Scraper full run: < 30 minutes (including FluentUI clone + install)
- Scraper incremental: < 10 minutes (reuse existing checkout)
- LLM enhancement full run: < 60 minutes (batched, with retry)
- LLM enhancement incremental: < 10 minutes (only changed components)
- Schema file size: < 5 MB per version (compressed < 1.5 MB)

### Compatibility

- Node.js 20+ (raised from current 18+; Node 18 is EOL)
- MCP protocol 1.x (same as current)
- npm package `fluentui-mcp` — same package name, backward compatible
- All existing MCP tool names preserved

### Reliability

- Scraper handles missing/malformed source files gracefully (skip + report)
- LLM enhancer has retry logic with exponential backoff
- Pipeline can be resumed from any stage (stages are independent)
- Schema validation before MCP server loads data

## Scope Decisions

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Data store | Markdown files, JSON schema, Database | JSON schema | Eliminates parse-unparse round-trip, enables structured queries |
| Type extraction | ts-morph, regex, API Extractor | ts-morph (controlled) + API Extractor fallback | Best accuracy while handling complex types |
| Version adapters | Single generic scraper, per-version adapters | Per-version adapters | v8 and v9 have fundamentally different structures |
| LLM strategy | Full re-run, diff-based | Diff-based | Prevents quality churn, reduces cost |
| Project structure | Monorepo packages, scripts directory | Scripts directory | Simpler, lower overhead for internal tools |
| Version bundling | All versions, default only | Default only (others on-demand) | Keeps npm package size reasonable |

## Acceptance Criteria

1. [ ] Scraper successfully extracts 80+ components from FluentUI v9 source
2. [ ] Scraper extracts 15+ utility packages
3. [ ] Scraper extracts contrib packages from fluentui-contrib repo
4. [ ] Scraper extracts real Storybook stories for each component
5. [ ] LLM enhancer produces rich descriptions, best practices, and guides
6. [ ] MCP server loads from JSON schema and responds to all 12 tool calls
7. [ ] All tool responses contain accurate, source-verified data
8. [ ] CI/CD workflow runs full pipeline on manual trigger
9. [ ] Pipeline produces consistent results (diff-based, not random churn)
10. [ ] Architecture supports version switching (v9 implemented, adapter pattern ready for v8/v10)
11. [ ] npm package builds and publishes successfully
12. [ ] All tests pass (existing + new)
