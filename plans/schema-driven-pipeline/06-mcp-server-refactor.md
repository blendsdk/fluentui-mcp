# MCP Server Refactor: Schema-Driven Architecture

> **Document**: 06-mcp-server-refactor.md
> **Parent**: [Index](00-index.md)

## Overview

The MCP server is refactored from a markdown-based document store to a schema-driven architecture. Instead of scanning markdown files, parsing metadata, and building an index, it loads a pre-built JSON schema and queries it directly. All 12 existing MCP tool names are preserved for backward compatibility, but their implementations are rewritten to use structured data.

## Architecture

### Before (Markdown-Based)

```
docs/v9/**/*.md → Scanner → MetadataExtractor → DocumentStore → Tools → MCP
                                               → SearchEngine
```

### After (Schema-Driven)

```
data/v9/fluentui-schema-enhanced.json → SchemaLoader → SchemaStore → Tools → MCP
                                                      → SearchEngine
                                                      → Formatters
```

### New File Structure

```
src/
├── index.ts                      # MCP server entry point (updated)
├── config.ts                     # Configuration (updated with schema paths)
├── types/
│   ├── index.ts                  # All type exports
│   ├── schema.ts                 # FluentUI schema types (NEW)
│   └── legacy.ts                 # Legacy types (deprecated, for backward compat)
├── schema/
│   ├── schema-loader.ts          # Load and validate JSON schema (NEW)
│   ├── schema-store.ts           # In-memory schema store with query methods (NEW)
│   └── schema-validator.ts       # JSON Schema validation (NEW)
├── search/
│   ├── search-engine.ts          # TF-IDF search adapted for schema (REFACTORED)
│   └── search-index.ts           # Search index builder from schema fields (NEW)
├── formatters/
│   ├── component-formatter.ts    # Format ComponentEntry → markdown for LLM (NEW)
│   ├── props-formatter.ts        # Format props table → markdown (NEW)
│   ├── story-formatter.ts        # Format stories → code blocks (NEW)
│   ├── guide-formatter.ts        # Format GuideEntry → markdown (NEW)
│   ├── list-formatter.ts         # Format lists/summaries → markdown (NEW)
│   └── pattern-formatter.ts      # Format PatternEntry → markdown (NEW)
├── tools/
│   ├── query-component.ts        # REFACTORED: query SchemaStore
│   ├── get-props-reference.ts    # REFACTORED: format props from schema
│   ├── get-component-examples.ts # REFACTORED: format stories from schema
│   ├── search-docs.ts            # REFACTORED: search over schema fields
│   ├── suggest-components.ts     # REFACTORED: structured matching
│   ├── list-all-docs.ts          # REFACTORED: list from schema
│   ├── list-by-category.ts       # REFACTORED: filter schema by category
│   ├── get-foundation.ts         # REFACTORED: serve foundation guides
│   ├── get-pattern.ts            # REFACTORED: serve pattern guides
│   ├── get-enterprise.ts         # REFACTORED: serve enterprise guides
│   ├── get-implementation-guide.ts # REFACTORED: compose from schema data
│   └── reindex.ts                # REFACTORED: reload schema file
├── indexer/                      # DEPRECATED (kept for backward compat during migration)
│   ├── document-store.ts
│   ├── index-builder.ts
│   ├── metadata-extractor.ts
│   ├── scanner.ts
│   └── search-engine.ts
```

## Architecture Style Note

The current codebase uses a **purely functional pattern** (standalone exported functions, no classes). The new schema subsystem introduces classes where stateful encapsulation is beneficial:

- **`SchemaStore`** — uses a `class` because it holds multiple internal indexes built in the constructor. This is a natural fit for encapsulation.
- **`SchemaLoader`**, **formatters** — implemented as **exported functions** (consistent with the existing codebase style) since they are stateless operations.

This is a conscious decision: classes where state matters, functions elsewhere.

## New Components

### SchemaLoader

```typescript
// src/schema/schema-loader.ts

/**
 * Load and validate a FluentUI enhanced schema from JSON file.
 * Handles both bundled schemas (in data/) and custom paths.
 */
class SchemaLoader {
  /**
   * Load schema for the specified version.
   * Tries in order:
   * 1. Custom path from FLUENTUI_SCHEMA_PATH env var
   * 2. data/<version>/fluentui-schema-enhanced.json (bundled)
   * 3. Fallback to bundled default version
   */
  static load(version: string): FluentUISchema;

  /**
   * Validate schema against JSON Schema definition.
   * Returns validation errors (if any).
   */
  static validate(schema: FluentUISchema): ValidationError[];
}
```

### SchemaStore

```typescript
// src/schema/schema-store.ts

/**
 * In-memory store for querying the FluentUI schema.
 * Provides fast lookups by name, category, stability, and props.
 * Replaces the old DocumentStore.
 */
class SchemaStore {
  // --- Construction ---

  /** Create store from loaded schema */
  constructor(schema: FluentUISchema);

  // --- Component Queries ---

  /** Find component by exact name (case-insensitive) */
  findComponent(name: string): ComponentEntry | undefined;

  /** Find component by fuzzy name match (like current findByName) */
  findComponentFuzzy(name: string): ComponentEntry | undefined;

  /** Get all components in a category */
  getComponentsByCategory(category: ComponentCategory): ComponentEntry[];

  /** Get all components by stability */
  getComponentsByStability(stability: string): ComponentEntry[];

  /** Find components that have a specific prop */
  findComponentsWithProp(propName: string): ComponentEntry[];

  /** Find components that match a requirements description */
  suggestComponents(requirements: string): ScoredComponent[];

  /** Compare props between two components */
  compareComponents(name1: string, name2: string): ComponentComparison;

  // --- Utility Queries ---

  /** Find utility by name */
  findUtility(name: string): UtilityEntry | undefined;

  /** Get all utilities */
  getAllUtilities(): UtilityEntry[];

  // --- Guide Queries ---

  /** Get foundation guide by ID */
  getFoundationGuide(id: string): GuideEntry | undefined;

  /** Get all foundation guides */
  getAllFoundationGuides(): GuideEntry[];

  /** Get pattern by ID or group */
  getPattern(id: string): PatternEntry | undefined;
  getPatternsByGroup(group: string): PatternEntry[];

  /** Get enterprise guide by ID */
  getEnterpriseGuide(id: string): GuideEntry | undefined;

  /** Get quick reference by ID */
  getQuickReference(id: string): GuideEntry | undefined;

  // --- Aggregate Queries ---

  /** Get all categories with counts */
  getCategories(): Map<string, number>;

  /** Get all modules (foundation, components, patterns, enterprise, quick-reference) */
  getModules(): string[];

  /** Get schema statistics */
  getStats(): SchemaStats;

  /** Get schema version info */
  getVersionInfo(): { version: string; generatedAt: string; sources: object };

  // --- Search Support ---

  /** Get all searchable text entries for building search index */
  getSearchableEntries(): SearchableEntry[];
}

interface ScoredComponent {
  component: ComponentEntry;
  score: number;
  matchReasons: string[];
}

interface ComponentComparison {
  component1: string;
  component2: string;
  sharedProps: string[];
  uniqueToFirst: string[];
  uniqueToSecond: string[];
  slotDifferences: string[];
}

interface SearchableEntry {
  id: string;
  title: string;
  type: 'component' | 'utility' | 'foundation' | 'pattern' | 'enterprise' | 'quick-reference';
  category: string;
  content: string;  // Combined text for TF-IDF indexing
  metadata: Record<string, string>;
}
```

### Formatters

Formatters convert structured schema data into markdown text for LLM consumption. This is the key difference from the old approach — instead of reading pre-written markdown, we **generate markdown on-the-fly** from structured data.

```typescript
// src/formatters/component-formatter.ts

/**
 * Format a ComponentEntry as markdown for LLM consumption.
 * This replaces the old approach of reading a markdown file.
 */
class ComponentFormatter {
  /**
   * Full component documentation (used by query_component).
   * Includes: metadata, description, props, slots, examples, best practices, accessibility.
   */
  static formatFull(component: ComponentEntry): string;

  /**
   * Brief component summary (used by list tools and search results).
   * Includes: name, package, brief description, category.
   */
  static formatSummary(component: ComponentEntry): string;

  /**
   * Props table only (used by get_props_reference).
   */
  static formatPropsTable(component: ComponentEntry): string;

  /**
   * Examples only (used by get_component_examples).
   * Includes Storybook stories + enhanced common patterns.
   */
  static formatExamples(component: ComponentEntry): string;
}
```

**Example output of `formatFull()`:**

```markdown
# Button

> **Package**: `@fluentui/react-button` v9.9.1
> **Import**: `import { Button } from '@fluentui/react-components'`
> **Category**: buttons
> **Stability**: stable

## Overview

Button triggers an action or event when activated. It's the most common interactive
element in FluentUI applications, supporting multiple appearances, sizes, and states.

---

## Props Reference

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `appearance` | `'secondary' \| 'primary' \| 'outline' \| 'subtle' \| 'transparent'` | `'secondary'` | No | Visual style |
| `disabled` | `boolean` | — | No | Disables the button |
| `icon` | `JSX.Element` | — | No | Icon to render |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | No | Button size |

### Slots

| Slot | Element | Required | Description |
|------|---------|----------|-------------|
| `root` | `button \| a` | Yes | Root element |
| `icon` | `span` | No | Icon wrapper |

---

## Examples

### Default Usage (from Storybook)
```tsx
import { Button } from '@fluentui/react-components';

export const Default = () => <Button>Example</Button>;
```

### Size Variants (from Storybook)
```tsx
import { Button, Tooltip, makeStyles } from '@fluentui/react-components';
import { CalendarMonthRegular } from '@fluentui/react-icons';
// ... full story code
```

---

## Best Practices

### ✅ Do's
- Use `appearance="primary"` for the main action on a page
- Provide `aria-label` for icon-only buttons

### ❌ Don'ts
- Don't use more than one primary button per section
- Don't disable buttons without explaining why

---

## Accessibility

**Requirements**: Button is accessible by default with proper role and keyboard support.

| Key | Action |
|-----|--------|
| `Enter` | Activates the button |
| `Space` | Activates the button |

**ARIA**: aria-label, aria-disabled
**Screen Reader**: Announces button label and state (disabled, pressed for toggle)

---

## Styling

Common customizations using Griffel tokens and classNames.

---

## See Also

- CompoundButton, ToggleButton, SplitButton, MenuButton
```

## Tool Migration

### Tool-by-Tool Changes

| Tool | Current Behavior | New Behavior | Breaking? |
|------|-----------------|--------------|-----------|
| `query_component` | `store.findByName()` → return `doc.content` | `schemaStore.findComponent()` → `ComponentFormatter.formatFull()` | No (same output format) |
| `get_props_reference` | Find doc → extract `propsSection` text | `schemaStore.findComponent()` → `ComponentFormatter.formatPropsTable()` | No |
| `get_component_examples` | Find doc → extract code blocks | `schemaStore.findComponent()` → `ComponentFormatter.formatExamples()` | No |
| `search_docs` | `searchEngine.search(query)` → return excerpts | Same search engine, but indexes schema fields | No |
| `suggest_components` | Keyword match on descriptions | `schemaStore.suggestComponents()` — match on props, description, category | No (better results) |
| `list_all_docs` | List all DocumentEntries | List all components + utilities + guides from schema | No |
| `list_by_category` | Filter by category string | `schemaStore.getComponentsByCategory()` | No |
| `get_foundation` | Find doc by module='foundation' | `schemaStore.getFoundationGuide()` → `GuideFormatter.format()` | No |
| `get_pattern` | Find doc by module='patterns' | `schemaStore.getPattern()` → `PatternFormatter.format()` | No |
| `get_enterprise` | Find doc by module='enterprise' | `schemaStore.getEnterpriseGuide()` → `GuideFormatter.format()` | No |
| `get_implementation_guide` | Compose from multiple docs | Compose from schema: props + examples + patterns + best practices | No (richer) |
| `reindex` | Re-scan markdown files | Reload JSON schema from disk | No |

### New Tool Capabilities (Future)

These are enabled by the schema-driven architecture but not required for v1:

| Potential New Tool | Description |
|-------------------|-------------|
| `compare_components` | Side-by-side prop comparison of two components |
| `find_by_prop` | Find all components that have a specific prop name or type |
| `get_utility` | Query utility packages (react-positioning, react-aria, etc.) |
| `get_version_info` | Show schema version, source commits, generation date |
| `get_migration_guide` | Show migration notes for a component (v8→v9) |

## Search Engine Adaptation

The search engine is adapted to index structured schema fields instead of raw markdown text.

```typescript
// src/search/search-index.ts

/**
 * Build a search index from the FluentUI schema.
 * Indexes component names, descriptions, prop names, prop descriptions,
 * guide titles, guide content, and pattern content.
 */
function buildSearchIndex(store: SchemaStore): SearchEngine {
  const entries = store.getSearchableEntries();

  // For each entry, create searchable text by combining:
  // - Title (boosted 3x)
  // - Description (boosted 2x)
  // - Prop names and descriptions
  // - Guide content
  // - Category name

  const engine = new SearchEngine();
  for (const entry of entries) {
    engine.addDocument({
      id: entry.id,
      title: entry.title,
      content: entry.content,
      module: entry.type,
      category: entry.category,
    });
  }
  return engine;
}
```

## Configuration Updates

```typescript
// src/config.ts (updated)

interface Config {
  /** FluentUI version */
  version: string;

  /** Path to enhanced schema file */
  schemaPath: string;

  /** Fallback: path to legacy markdown docs (for migration period) */
  legacyDocsPath?: string;
}

function resolveConfig(): Config {
  const version = process.argv[2] || process.env.FLUENTUI_VERSION || 'v9';

  // Schema path resolution order:
  // 1. FLUENTUI_SCHEMA_PATH env var
  // 2. data/<version>/fluentui-schema-enhanced.json (bundled)
  const schemaPath = process.env.FLUENTUI_SCHEMA_PATH
    || path.join(__dirname, '..', 'data', version, 'fluentui-schema-enhanced.json');

  return { version, schemaPath };
}
```

## Server Startup Flow

```typescript
// src/index.ts (updated startup)

async function main() {
  const config = resolveConfig();

  // Load and validate schema
  const schema = SchemaLoader.load(config.schemaPath);
  const errors = SchemaLoader.validate(schema);
  if (errors.length > 0) {
    console.error(`Schema validation warnings: ${errors.length}`);
  }

  // Build in-memory store
  const store = new SchemaStore(schema);
  const searchEngine = buildSearchIndex(store);

  console.error(`FluentUI MCP (${schema.version}) loaded: ${store.getStats().totalComponents} components, ${store.getStats().totalUtilities} utilities`);

  // Register MCP tools (same tool names as before)
  // Dispatch tool calls to handlers using store + searchEngine + formatters
}
```

## Incremental Migration Strategy

To avoid breaking the existing working server, migration happens incrementally:

### Phase 1: Add Schema Infrastructure (no tool changes)
- Add `src/types/schema.ts` with schema types
- Add `src/schema/` with SchemaLoader, SchemaStore, SchemaValidator
- Add `src/formatters/` with all formatters
- Add `src/search/search-index.ts`
- Add tests for all new code
- **Tools still use old DocumentStore** — nothing breaks

### Phase 2: Migrate Tools (one at a time)
- Update each tool to use SchemaStore instead of DocumentStore
- Each tool is migrated independently
- Tests updated for each tool
- Old `src/indexer/` code remains for reference

### Phase 3: Remove Legacy Code
- Remove `src/indexer/` (scanner, metadata-extractor, document-store, index-builder)
- Remove `docs/` folder dependency (docs become optional)
- Update package.json to bundle `data/` instead of `docs/`
- Clean up legacy types

## Project Structure Changes

### TypeScript Configuration

Two tsconfig files are used to separate type-checking from build output:

```
tsconfig.json           → Includes both src/ AND scripts/ (for IDE support + type checking)
tsconfig.build.json     → Only compiles src/ to dist/ (for npm package build)
```

- `tsconfig.json` is the root config — editors and `tsc --noEmit` use it to type-check everything
- `tsconfig.build.json` extends the root but restricts `include` to `src/` only
- `scripts/` imports shared types from `src/types/schema.ts` (one-way dependency: scripts → src/types)
- `src/` NEVER imports from `scripts/` (enforced by convention)
- Vitest resolves imports from both `src/` and `scripts/` natively

### Package.json Changes

```json
{
  "engines": { "node": ">=20.0.0" },
  "files": [
    "dist/",
    "data/",
    "docs/"    // Kept for 1.2.0 (deprecated), removed in 1.3.0
  ],
  "scripts": {
    "build": "tsc --project tsconfig.build.json",
    "typecheck": "tsc --noEmit",
    "scrape": "tsx scripts/scraper/cli.ts",
    "enhance": "tsx scripts/enhancer/cli.ts",
    "pipeline:full": "yarn scrape && yarn enhance && yarn build && yarn test"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.26.0"
  },
  "devDependencies": {
    "tsx": "^4.x",
    "ts-morph": "^28.0.0",
    "openai": "^4.x",
    "@anthropic-ai/sdk": "^0.x"
  }
}
```

**Note**: `ts-morph` and LLM SDKs are **devDependencies** — they're only needed at scrape/enhance time, not at MCP server runtime. This keeps the npm package small.

**Note**: `npm-check-updates` should be moved from `dependencies` to `devDependencies` (existing issue in current package.json).

## Error Handling

| Error Case | Handling Strategy |
|------------|-------------------|
| Schema file not found | Log error, try bundled default, abort if none found |
| Schema validation fails | Load partial data, skip invalid entries, warn |
| Component not found | Return helpful "did you mean...?" with fuzzy matches |
| Guide not found | Return list of available guides |
| Search returns no results | Return suggestions based on partial matches |

## Testing Requirements

- Unit tests for SchemaLoader (load, validate, error handling)
- Unit tests for SchemaStore (all query methods, fuzzy matching, structured queries)
- Unit tests for each Formatter (output format matches expected markdown)
- Unit tests for SearchEngine adaptation (indexes schema fields, returns relevant results)
- Integration tests: load test schema → call each tool → verify output format
- E2E test: full pipeline (schema → store → tools → MCP protocol)
- Backward compatibility test: verify tool output format hasn't changed for consumers
