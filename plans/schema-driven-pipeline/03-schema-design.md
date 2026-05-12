# Schema Design: FluentUI Enhanced Schema

> **Document**: 03-schema-design.md
> **Parent**: [Index](00-index.md)

## Overview

The enhanced JSON schema is the **single source of truth** for the MCP server. It contains all component data, utility package data, guides, and metadata in a structured format that tools can query directly. This document defines the complete schema format.

## Architecture

### Data Flow

```
Scraper Output:   data/<version>/fluentui-schema.json           (raw extracted data)
Enhancer Output:  data/<version>/fluentui-schema-enhanced.json  (LLM-enriched data)
MCP Server Input: data/<version>/fluentui-schema-enhanced.json  (loaded at startup)
```

### File Locations

```
data/
├── v9/
│   ├── fluentui-schema.json            # Raw scraper output (not bundled in npm)
│   └── fluentui-schema-enhanced.json   # Enhanced schema (bundled in npm)
├── v8/
│   └── fluentui-schema-enhanced.json
└── schema.json                         # JSON Schema validation file
```

## Schema Format

### Root Structure

```typescript
/**
 * Root schema for a FluentUI version.
 * This is the single source of truth for the MCP server.
 */
interface FluentUISchema {
  /** Schema format version (for forward compatibility) */
  schemaVersion: '1.0';

  /** FluentUI version this schema represents */
  version: string;  // e.g., 'v9', 'v8'

  /** When this schema was generated */
  generatedAt: string;  // ISO 8601

  /** Source repositories used for scraping */
  sources: {
    fluentui: SourceInfo;
    contrib?: SourceInfo;
  };

  /** All component packages (the main content) */
  components: ComponentEntry[];

  /** Utility packages (react-aria, react-positioning, etc.) */
  utilities: UtilityEntry[];

  /** Foundation guides (getting started, theming, styling, etc.) */
  foundation: GuideEntry[];

  /** Pattern guides (forms, navigation, layout, etc.) */
  patterns: PatternEntry[];

  /** Enterprise guides (dashboards, admin, data viz, etc.) */
  enterprise: GuideEntry[];

  /** Quick reference (cheatsheets, checklists, etc.) */
  quickReference: GuideEntry[];

  /** Schema-level statistics */
  stats: SchemaStats;
}

interface SourceInfo {
  /** Git repository URL */
  repo: string;
  /** Git ref used (branch, tag, or commit) */
  ref: string;
  /** Full commit hash at time of scrape */
  commit: string;
  /** Timestamp of the scrape */
  scrapedAt: string;
}

interface SchemaStats {
  totalComponents: number;
  totalUtilities: number;
  totalContrib: number;
  totalPreview: number;
  totalStories: number;
  totalProps: number;
  categoryCounts: Record<string, number>;
}
```

### Component Entry

```typescript
/**
 * A single FluentUI component with all its data.
 * This is the primary content type in the schema.
 */
interface ComponentEntry {
  /** Component display name (e.g., 'Button', 'CompoundButton') */
  name: string;

  /** Lowercase kebab-case ID for lookups (e.g., 'button', 'compound-button') */
  id: string;

  /** npm package name (e.g., '@fluentui/react-button') */
  packageName: string;

  /** Package version at time of scrape (e.g., '9.9.1') */
  packageVersion: string;

  /** Primary import path for users (e.g., '@fluentui/react-components') */
  importPath: string;

  /** Full import statement (e.g., "import { Button } from '@fluentui/react-components'") */
  importStatement: string;

  /** Component category for organization (string for extensibility, validated against KNOWN_COMPONENT_CATEGORIES) */
  category: ComponentCategory;

  /** Stability classification */
  stability: 'stable' | 'preview' | 'unstable' | 'contrib';

  /** Whether the component is deprecated */
  deprecated: boolean;

  /** Deprecation message (if deprecated) */
  deprecationMessage?: string;

  /** All props defined on this component */
  props: PropEntry[];

  /** All slots defined on this component */
  slots: SlotEntry[];

  /** Storybook examples extracted from source */
  stories: StoryEntry[];

  /** LLM-enhanced content (populated by enhancer, undefined in raw scraper output) */
  enhanced?: ComponentEnhanced;

  /** Related components (by name) */
  relatedComponents: string[];

  /** Additional exports from the same package (hooks, types, etc.) */
  additionalExports: string[];
}

/**
 * ComponentCategory is a plain string for extensibility (new categories from
 * contrib or future FluentUI versions don't require code changes).
 * Use KNOWN_COMPONENT_CATEGORIES for validation.
 */
type ComponentCategory = string;

/**
 * Known component categories used for validation and classification.
 * Unknown categories default to 'utilities' with a warning.
 */
const KNOWN_COMPONENT_CATEGORIES = [
  'buttons',
  'forms',
  'navigation',
  'data-display',
  'feedback',
  'overlays',
  'layout',
  'utilities',
  'contrib',
] as const;
```

### Prop Entry

```typescript
/**
 * A single prop on a component.
 */
interface PropEntry {
  /** Prop name (e.g., 'appearance') */
  name: string;

  /** TypeScript type as string (e.g., "'primary' | 'secondary' | 'outline'") */
  type: string;

  /** Whether this prop is required (no ? modifier) */
  required: boolean;

  /** Default value if known (extracted from hook) */
  defaultValue?: string;

  /** JSDoc description from the source code */
  description: string;

  /** Whether this prop is deprecated */
  deprecated: boolean;

  /** Deprecation message if deprecated */
  deprecationMessage?: string;

  /** Whether this prop is inherited from a base type (e.g., HTMLAttributes) */
  inherited: boolean;

  /** Source of the prop (which interface it comes from) */
  source: string;  // e.g., 'ButtonProps', 'HTMLButtonElement', 'ComponentProps'
}
```

### Slot Entry

```typescript
/**
 * A slot definition on a component.
 */
interface SlotEntry {
  /** Slot name (e.g., 'root', 'icon', 'content') */
  name: string;

  /** The HTML element or component type (e.g., 'button', 'span', 'div') */
  elementType: string;

  /** Alternative element types (e.g., for root: 'button | a') */
  alternativeTypes?: string[];

  /** Whether this slot is required (NonNullable) */
  required: boolean;

  /** JSDoc description */
  description: string;
}
```

### Story Entry

```typescript
/**
 * A Storybook story extracted from the FluentUI source.
 */
interface StoryEntry {
  /** Story name (e.g., 'Default', 'Appearance', 'Size') */
  name: string;

  /** Story description from parameters.docs.description or JSDoc */
  description: string;

  /** The complete story source code (including imports and styles) */
  code: string;

  /** Just the render function/component (without surrounding imports) */
  renderCode: string;

  /** File the story was extracted from */
  sourceFile: string;

  /** Import statements needed for this story */
  imports: string[];
}
```

### Enhanced Content (LLM-generated)

```typescript
/**
 * LLM-enhanced content for a component.
 * This is populated by the enhancer stage and preserved across updates
 * unless the component's props/slots change significantly.
 */
interface ComponentEnhanced {
  /** Rich description (better than JSDoc one-liner) */
  description: string;

  /** When to use this component */
  whenToUse: string;

  /** Best practices */
  bestPractices: {
    dos: string[];
    donts: string[];
  };

  /** Accessibility guidance */
  accessibility: {
    requirements: string;
    keyboardSupport: KeyboardEntry[];
    ariaAttributes: string[];
    screenReaderBehavior: string;
  };

  /** Common usage patterns */
  commonPatterns: PatternExample[];

  /** Styling tips */
  stylingTips: string;

  /** Migration notes (from previous version) */
  migrationNotes?: string;

  /** Hash of the component data when this enhancement was generated.
   *  Used for diff-based updates — if the hash matches, skip re-enhancement. */
  sourceHash: string;

  /** When this enhancement was generated */
  enhancedAt: string;
}

interface KeyboardEntry {
  key: string;
  action: string;
}

interface PatternExample {
  name: string;
  description: string;
  code: string;
}
```

### Utility Entry

```typescript
/**
 * A FluentUI utility package (not a component).
 * Examples: react-positioning, react-aria, react-tabster, react-motion
 */
interface UtilityEntry {
  /** Package display name (e.g., 'Positioning') */
  name: string;

  /** Lowercase kebab-case ID */
  id: string;

  /** npm package name (e.g., '@fluentui/react-positioning') */
  packageName: string;

  /** Package version */
  packageVersion: string;

  /** Import path */
  importPath: string;

  /** Stability classification */
  stability: 'stable' | 'preview' | 'unstable' | 'contrib';

  /** All exported functions/hooks/types */
  exports: UtilityExport[];

  /** LLM-enhanced content (populated by enhancer, undefined in raw scraper output) */
  enhanced?: {
    description: string;
    whenToUse: string;
    commonPatterns: PatternExample[];
    sourceHash: string;
    enhancedAt: string;
  };
}

interface UtilityExport {
  /** Export name (e.g., 'usePositioning', 'createArrowStyles') */
  name: string;

  /** Kind of export */
  kind: 'function' | 'hook' | 'type' | 'interface' | 'constant' | 'class';

  /** JSDoc description */
  description: string;

  /** Function/hook parameters (if applicable) */
  parameters?: ParameterEntry[];

  /** Return type (if applicable) */
  returnType?: string;
}

interface ParameterEntry {
  name: string;
  type: string;
  required: boolean;
  description: string;
}
```

### Guide Entry (Foundation, Enterprise, Quick Reference)

```typescript
/**
 * A guide document (foundation, enterprise, or quick reference).
 * These are fully LLM-generated based on the component/utility data.
 */
interface GuideEntry {
  /** Guide ID (e.g., 'getting-started', 'theming') */
  id: string;

  /** Guide title (e.g., 'Getting Started with FluentUI v9') */
  title: string;

  /** Guide category for grouping */
  category: string;

  /** Full guide content (markdown formatted) */
  content: string;

  /** Code examples within the guide */
  codeExamples: {
    title: string;
    description: string;
    code: string;
    language: string;
  }[];

  /** Components referenced in this guide */
  referencedComponents: string[];

  /** Hash for diff-based updates */
  sourceHash: string;

  /** When generated */
  enhancedAt: string;
}
```

### Pattern Entry

```typescript
/**
 * A pattern guide (forms, navigation, layout, etc.).
 * These group related components into real-world usage patterns.
 */
interface PatternEntry {
  /** Pattern ID (e.g., 'login-form', 'sidebar-navigation') */
  id: string;

  /** Pattern title */
  title: string;

  /** Pattern group (e.g., 'forms', 'navigation', 'layout', 'modals', 'state', 'data') */
  group: string;

  /** Full pattern content (markdown formatted) */
  content: string;

  /** Complete working examples */
  examples: {
    name: string;
    description: string;
    code: string;
    components: string[];  // Component names used
  }[];

  /** Components this pattern uses */
  referencedComponents: string[];

  /** Hash for diff-based updates */
  sourceHash: string;

  /** When generated */
  enhancedAt: string;
}
```

## Schema Validation

Custom TypeScript validation logic in `SchemaValidator` will validate:
- Required fields are present
- Type constraints are met (string, number, array, etc.)
- Enum values are valid (e.g., stability must be one of 'stable', 'preview', 'unstable', 'contrib')
- No orphaned references (e.g., relatedComponents pointing to non-existent components)

No external validation library (ajv, zod, etc.) is needed — the schema structure is fully defined by TypeScript types, and a lightweight custom validator keeps dependencies minimal.

The MCP server validates the schema at load time and reports errors.

## Schema Size Estimation

| Section | Estimated Size (uncompressed) |
|---------|-------------------------------|
| Components (~100) | ~2.5 MB |
| Utilities (~15) | ~200 KB |
| Stories (~500 total) | ~1.5 MB |
| Foundation guides (~6) | ~150 KB |
| Pattern guides (~30) | ~500 KB |
| Enterprise guides (~15) | ~250 KB |
| Quick reference (~5) | ~100 KB |
| **Total** | **~5.2 MB** |
| **Compressed (gzip)** | **~1.2 MB** |

This is reasonable for an npm package. Only the default version is bundled.

## Integration Points

### Scraper Output → Schema

The scraper produces `fluentui-schema.json` with all fields populated EXCEPT `enhanced` fields (which are empty objects or null).

### Enhancer Input/Output

The enhancer reads `fluentui-schema.json`, populates all `enhanced` fields, generates guide/pattern/enterprise entries, and writes `fluentui-schema-enhanced.json`.

### MCP Server Input

The MCP server reads `fluentui-schema-enhanced.json` at startup, validates it, builds the in-memory index (SchemaStore + SearchEngine), and serves queries.

## Error Handling

| Error Case | Handling Strategy |
|------------|-------------------|
| Schema file missing | Fall back to bundled default schema |
| Schema validation fails | Log errors, load partial data (skip invalid entries) |
| Component missing enhanced data | Serve raw data without enrichment (degrade gracefully) |
| Unknown stability value | Default to 'stable' with warning |
| Story code too large (>10KB) | Truncate with "... see full story at [source link]" |

## Testing Requirements

- Unit tests for schema validation logic
- Unit tests for SchemaStore queries (lookup by name, by category, by prop, etc.)
- Integration test: load a test schema → query all tool types → verify responses
- Snapshot test: validate schema structure hasn't changed unexpectedly
