# Scraper: FluentUI Source Code Extraction

> **Document**: 04-scraper.md
> **Parent**: [Index](00-index.md)

## Overview

The scraper is Stage 1 of the pipeline. It clones (or reuses) the FluentUI source repositories and extracts structured component/utility data into `fluentui-schema.json`. It uses ts-morph for TypeScript AST parsing with controlled type expansion, and falls back to API Extractor output for packages where direct parsing is problematic.

## Architecture

### Pipeline Position

```
[SCRAPER] → Enhancer → MCP Server
   │
   ├── Clone/checkout FluentUI repos
   ├── Discover packages
   ├── Extract component data (per-version adapter)
   ├── Extract utility data
   ├── Extract Storybook stories
   ├── Classify (stable/preview/contrib)
   └── Write fluentui-schema.json
```

### File Structure

```
scripts/
├── scraper/
│   ├── cli.ts                    # CLI entry point (yarn scrape)
│   ├── config.ts                 # Version configurations
│   ├── types.ts                  # Shared scraper types
│   ├── discover.ts               # Package discovery (find all packages)
│   ├── classify.ts               # Category/stability classification
│   ├── adapters/
│   │   ├── adapter.ts            # Base adapter interface
│   │   ├── v9-adapter.ts         # v9 extraction logic
│   │   └── v8-adapter.ts         # v8 extraction logic
│   ├── extractors/
│   │   ├── props-extractor.ts    # ts-morph props extraction
│   │   ├── slots-extractor.ts    # Slot definition extraction
│   │   ├── stories-extractor.ts  # Storybook story extraction
│   │   ├── utility-extractor.ts  # Utility package extraction
│   │   ├── defaults-extractor.ts # Default value extraction from hooks
│   │   └── api-extractor-fallback.ts  # Fallback: parse .api.md files
│   └── output.ts                 # Schema writer
```

## CLI Interface

```bash
# Full scrape from FluentUI source
yarn scrape --version v9 --source /path/to/fluentui

# With contrib
yarn scrape --version v9 --source /path/to/fluentui --contrib /path/to/fluentui-contrib

# Clone from GitHub (CI mode)
yarn scrape --version v9 --clone --ref main

# Incremental (reuse previous checkout)
yarn scrape --version v9 --source /tmp/fluentui --reuse

# Output to specific location
yarn scrape --version v9 --source /path/to/fluentui --output data/v9/fluentui-schema.json
```

### CLI Options

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--version` | Yes | — | FluentUI version to scrape (v8, v9) |
| `--source` | Yes* | — | Path to local FluentUI checkout |
| `--contrib` | No | — | Path to local fluentui-contrib checkout |
| `--clone` | No | false | Clone from GitHub instead of using local path |
| `--ref` | No | 'main'/'master' | Git ref to checkout (branch, tag, commit) |
| `--contrib-ref` | No | 'main' | Git ref for contrib repo |
| `--reuse` | No | false | Reuse existing checkout (skip clone/pull) |
| `--output` | No | `data/<version>/fluentui-schema.json` | Output file path |
| `--verbose` | No | false | Verbose logging |

*Required unless `--clone` is used.

## Version Configuration

```typescript
// scripts/scraper/config.ts

interface VersionConfig {
  /** Display version (e.g., 'v9') */
  version: string;

  /** Adapter class to use */
  adapter: 'v9' | 'v8';

  /** FluentUI repo details */
  fluentui: {
    repo: string;
    defaultRef: string;  // default branch/tag
    defaultBranch: string;  // for clone
  };

  /** Contrib repo details */
  contrib: {
    repo: string;
    defaultRef: string;
  };

  /** Path patterns for this version */
  paths: {
    /** Where component packages live */
    componentPackages: string;  // glob pattern
    /** The rollup package that re-exports stable components */
    stableExportsIndex: string;
    /** Unstable/preview exports (if exists) */
    unstableExportsIndex?: string;
    /** Story file patterns */
    storiesGlob: string;
  };

  /** Packages to skip (internal, not useful for docs) */
  skipPackages: string[];
}

const VERSIONS: Record<string, VersionConfig> = {
  v9: {
    version: 'v9',
    adapter: 'v9',
    fluentui: {
      repo: 'https://github.com/microsoft/fluentui.git',
      defaultRef: 'master',
      defaultBranch: 'master',
    },
    contrib: {
      repo: 'https://github.com/microsoft/fluentui-contrib.git',
      defaultRef: 'main',
    },
    paths: {
      componentPackages: 'packages/react-components/react-*',
      stableExportsIndex: 'packages/react-components/react-components/library/src/index.ts',
      unstableExportsIndex: 'packages/react-components/react-components/library/src/unstable/index.ts',
      storiesGlob: 'packages/react-components/react-*/stories/src/**/*.stories.tsx',
    },
    skipPackages: [
      'react-conformance-griffel',
      'react-storybook-addon',
      'react-storybook-addon-export-to-sandbox',
      'react-jsx-runtime',
      'react-theme-sass',
      'react-icons-compat',
      'react-portal-compat',
      'react-portal-compat-context',
      'react-migration-v0-v9',
      'react-migration-v8-v9',
      'babel-preset-global-context',
      'babel-preset-storybook-full-source',
      'component-selector-preview',
      'eslint-plugin-react-components',
      'deprecated',
    ],
  },
  v8: {
    version: 'v8',
    adapter: 'v8',
    fluentui: {
      repo: 'https://github.com/microsoft/fluentui.git',
      defaultRef: 'master',
      defaultBranch: 'master',
    },
    contrib: {
      repo: 'https://github.com/microsoft/fluentui-contrib.git',
      defaultRef: 'main',
    },
    paths: {
      componentPackages: 'packages/react/src/components/*',
      stableExportsIndex: 'packages/react/src/index.ts',
      storiesGlob: 'packages/react/stories/**/*.stories.tsx',
    },
    skipPackages: [],
  },
};
```

## Package Discovery

### Stage: Discover

```typescript
// scripts/scraper/discover.ts

interface DiscoveredPackage {
  /** Directory name (e.g., 'react-button') */
  dirName: string;
  /** Full path to package directory */
  path: string;
  /** Package name from package.json */
  packageName: string;
  /** Package version from package.json */
  packageVersion: string;
  /** Whether this is a component or utility package */
  type: 'component' | 'utility' | 'internal';
  /** Whether this package is in the stable exports index */
  isStableExport: boolean;
  /** Whether this package is in the unstable/preview exports */
  isPreviewExport: boolean;
  /** Source (official FluentUI or contrib) */
  source: 'fluentui' | 'contrib';
}
```

**Discovery algorithm for v9:**

1. Glob `packages/react-components/react-*` for package directories
2. Read each `package.json` to get name/version
3. Skip packages in `skipPackages` list
4. Read the stable exports index to determine which components are stable exports
5. Read the unstable exports index to determine preview components
6. Classify each package as component vs utility:
   - Has `.tsx` files with `React.FC`, `forwardRef`, or `React.Component` → component
   - Only exports hooks/functions/types → utility
   - Otherwise → internal (skip)

**Discovery algorithm for contrib:**

1. Glob `packages/*` in contrib repo
2. Read each `package.json` (names start with `@fluentui-contrib/`)
3. Same classification logic as above

## Version Adapters

### Base Adapter Interface

```typescript
// scripts/scraper/adapters/adapter.ts

interface ScraperAdapter {
  /** Extract component data from a discovered package */
  extractComponent(pkg: DiscoveredPackage): Promise<ComponentEntry | null>;

  /** Extract utility data from a discovered package */
  extractUtility(pkg: DiscoveredPackage): Promise<UtilityEntry | null>;

  /** Find the .types.ts file for a component */
  findTypesFile(pkg: DiscoveredPackage, componentName: string): string | null;

  /** Find story files for a component */
  findStoryFiles(pkg: DiscoveredPackage, componentName: string): string[];

  /** Find the hook file (use*.ts) for default value extraction */
  findHookFile(pkg: DiscoveredPackage, componentName: string): string | null;
}
```

### V9 Adapter

**File layout it expects:**
```
react-button/
├── library/
│   ├── src/
│   │   ├── index.ts                 # Exports
│   │   └── components/
│   │       ├── Button/
│   │       │   ├── Button.types.ts  # Props + Slots
│   │       │   ├── useButton.ts     # Hook (defaults)
│   │       │   └── Button.tsx       # Component
│   │       └── CompoundButton/
│   │           ├── CompoundButton.types.ts
│   │           └── ...
│   └── package.json
└── stories/
    └── src/
        └── Button/
            ├── ButtonDefault.stories.tsx
            ├── ButtonAppearance.stories.tsx
            └── ...
```

**V9 extraction strategy:**
1. Read `library/src/index.ts` to find exported component names
2. For each exported component:
   - Find `components/<Name>/<Name>.types.ts`
   - Use ts-morph to parse the `<Name>Props` interface (direct members only)
   - Find `<Name>Slots` type for slot definitions
   - Find `use<Name>.ts` for default values
   - Find `stories/src/<Name>/*.stories.tsx` for examples
3. Read `package.json` for package metadata

### V8 Adapter (Deferred — Future Phase)

> **Status**: NOT YET IMPLEMENTED. The V8 adapter is deferred to a future phase.
> The adapter interface and V8 version config are designed to support V8 when needed,
> but only the V9 adapter is implemented in the initial release.

**File layout it expects (different from v9):**
```
packages/react/src/components/
├── Button/
│   ├── Button.types.ts          # IButtonProps interface
│   ├── Button.base.tsx          # Base component
│   ├── Button.tsx               # Styled component
│   └── Button.styles.ts         # Styles
```

**V8 extraction strategy (for future implementation):**
1. Scan `packages/react/src/components/*/` for component directories
2. For each:
   - Find `*.types.ts` → look for `I<Name>Props` interface
   - Parse interface members directly (v8 uses simpler types than v9)
   - Styles files use `mergeStyles` (not Griffel)
3. Stories are in a different location for v8

## Props Extraction (ts-morph)

### Strategy: Syntactic Extraction (No `yarn install` Required)

**Key principle**: Extract only the **direct members** of the component's Props interface using **syntactic type text** (`getTypeNode()?.getText()`), NOT resolved types. This avoids both type explosion with `ComponentProps<>` AND the need to run `yarn install` on the FluentUI repository. The scraper operates on raw source files only — no dependency resolution needed.

**Fallback chain**: If ts-morph can't extract from a `.types.ts` file (non-standard structure, missing file), fall back to parsing the pre-built `.api.md` files that Microsoft generates via API Extractor.

```typescript
// scripts/scraper/extractors/props-extractor.ts

/**
 * Extract props from a .types.ts file using ts-morph.
 * Uses getTypeNode()?.getText() for SYNTACTIC type extraction — reads
 * the type annotation text as written in source code, without resolving
 * external imports. This means no yarn install is needed on FluentUI.
 *
 * Only extracts DIRECT members of the Props interface,
 * not inherited members from ComponentProps<>, HTMLAttributes, etc.
 */
function extractProps(typesFilePath: string, propsInterfaceName: string): PropEntry[] {
  const project = new Project({
    // Single file mode — no full project, no tsconfig, no resolution
    compilerOptions: { strict: true },
    skipAddingFilesFromTsConfig: true,
  });

  const sourceFile = project.addSourceFileAtPath(typesFilePath);
  const propsType = sourceFile.getTypeAlias(propsInterfaceName)
    ?? sourceFile.getInterface(propsInterfaceName);

  if (!propsType) return [];

  // Extract only direct members defined in THIS file (see getDirectMembers below)
  const directMembers = getDirectMembers(propsType);

  return directMembers.map(member => ({
    name: member.getName(),
    // Use getTypeNode() for syntactic text — no resolution needed
    // Falls back to 'unknown' if no type annotation exists
    type: member.getTypeNode()?.getText() ?? 'unknown',
    required: !member.hasQuestionToken(),
    description: getJSDocDescription(member),
    deprecated: hasDeprecatedTag(member),
    deprecationMessage: getDeprecatedMessage(member),
    inherited: false,
    source: propsInterfaceName,
  }));
}
```

### `getDirectMembers()` Implementation

This function handles three FluentUI type patterns:

```typescript
/**
 * Extract direct members from a Props type, handling three cases:
 *
 * Case 1: Interface declaration
 *   interface ButtonProps { appearance?: string; }
 *   → getMembers() returns direct members only (not inherited via extends)
 *
 * Case 2: Type alias with intersection (most common in FluentUI v9)
 *   type ButtonProps = ComponentProps<ButtonSlots> & { appearance?: string; }
 *   → Navigate AST to find the object literal type in the intersection,
 *     extract its members. Ignore the ComponentProps<> part.
 *
 * Case 3: Type alias without intersection (simple alias)
 *   type ButtonProps = { appearance?: string; }
 *   → Extract members from the type literal directly.
 *
 * If none of these patterns match, returns empty array (fallback to .api.md).
 */
function getDirectMembers(node: TypeAliasDeclaration | InterfaceDeclaration): PropertySignature[] {
  // Case 1: Interface — return direct members
  if (Node.isInterfaceDeclaration(node)) {
    return node.getMembers().filter(Node.isPropertySignature);
  }

  // Case 2 & 3: Type alias — inspect the type node
  const typeNode = node.getTypeNode();
  if (!typeNode) return [];

  // Case 2: Intersection type (A & B & { ... })
  if (Node.isIntersectionTypeNode(typeNode)) {
    // Find the TypeLiteral node(s) in the intersection — these are the direct members
    const typeLiterals = typeNode.getTypeNodes().filter(Node.isTypeLiteral);
    return typeLiterals.flatMap(lit => lit.getMembers().filter(Node.isPropertySignature));
  }

  // Case 3: Direct type literal ({ ... })
  if (Node.isTypeLiteral(typeNode)) {
    return typeNode.getMembers().filter(Node.isPropertySignature);
  }

  // Unrecognized pattern — return empty, fall back to .api.md
  return [];
}
```

### Fallback: API Extractor Output

FluentUI generates API reports in `<package>/etc/<package-name>.api.md`. These are pre-built, human-readable API summaries. If ts-morph parsing fails for a package, we can parse these files as fallback.

```
// Example from react-button/etc/react-button.api.md
## API Report File for "@fluentui/react-button"

export interface ButtonProps extends ComponentProps<ButtonSlots> {
    appearance?: 'secondary' | 'primary' | 'outline' | 'subtle' | 'transparent';
    block?: boolean;
    disabled?: boolean;
    // ...
}
```

The fallback parser uses regex to extract interface members from these `.api.md` files.

## Slots Extraction

```typescript
// scripts/scraper/extractors/slots-extractor.ts

/**
 * Extract slot definitions from the Slots type.
 * Looks for: type ButtonSlots = { root: NonNullable<Slot<'button', 'a'>>; icon?: Slot<'span'>; }
 */
function extractSlots(typesFilePath: string, slotsTypeName: string): SlotEntry[] {
  // Parse the Slots type alias
  // For each member:
  //   - name: property name
  //   - elementType: first generic arg of Slot<>
  //   - alternativeTypes: second generic arg (if any)
  //   - required: wrapped in NonNullable<> or no ?
}
```

## Default Value Extraction

```typescript
// scripts/scraper/extractors/defaults-extractor.ts

/**
 * Extract default prop values from the use<Name>.ts hook.
 * Looks for patterns like:
 *   appearance = 'secondary'
 *   size = 'medium'
 *   state.disabled = props.disabled ?? false
 */
function extractDefaults(hookFilePath: string): Record<string, string> {
  // Use ts-morph or regex to find:
  // 1. Destructured defaults: { appearance = 'secondary', ... } = props
  // 2. Nullish coalescing: props.appearance ?? 'secondary'
  // 3. Logical OR: props.appearance || 'secondary'
  // 4. Conditional defaults in the hook body
}
```

## Storybook Story Extraction

```typescript
// scripts/scraper/extractors/stories-extractor.ts

/**
 * Extract complete story code from .stories.tsx files.
 * Preserves the full file context (imports, makeStyles, etc.)
 */
function extractStories(storyFiles: string[]): StoryEntry[] {
  // For each story file:
  // 1. Read the full file content
  // 2. Find all exported functions (each is a story)
  // 3. For each export:
  //    - name: export name (e.g., 'Size', 'Appearance')
  //    - description: from .parameters.docs.description.story or JSDoc
  //    - code: full file content (includes imports and styles)
  //    - renderCode: just the exported function body
  //    - imports: extracted import statements
}
```

**Story extraction rules:**
- Each `.stories.tsx` file typically contains ONE story export
- The story name is the export name (e.g., `export const Size = ...`)
- Story descriptions come from `.parameters = { docs: { description: { story: '...' } } }`
- We include the FULL file (imports + makeStyles + component) as `code`
- We extract just the render function as `renderCode` for quick display
- **Size limit**: Stories exceeding 10KB are truncated with a `// ... truncated. Full story: <sourceFile>` comment. This prevents schema bloat from complex stories (data tables, chart examples, etc.)

## Category Classification

```typescript
// scripts/scraper/classify.ts

const CATEGORY_PATTERNS: Record<string, RegExp[]> = {
  'buttons': [/react-button$/],
  'forms': [
    /react-input$/, /react-textarea$/, /react-select$/, /react-combobox$/,
    /react-checkbox$/, /react-radio$/, /react-switch$/, /react-slider$/,
    /react-spinbutton$/, /react-field$/, /react-search/, /react-rating$/,
    /react-color-picker$/, /react-swatch-picker$/, /react-tag-picker$/,
    /react-infolabel$/, /react-label$/, /react-calendar/, /react-datepicker/,
    /react-timepicker/,
  ],
  'navigation': [/react-menu$/, /react-tabs$/, /react-breadcrumb$/, /react-nav/, /react-link$/],
  'data-display': [
    /react-avatar$/, /react-badge$/, /react-table$/, /react-list$/,
    /react-tree$/, /react-tags$/, /react-persona$/, /react-text$/,
    /react-image$/, /react-skeleton$/,
  ],
  'feedback': [
    /react-dialog$/, /react-toast$/, /react-message-bar$/,
    /react-spinner$/, /react-progress$/, /react-tooltip$/,
  ],
  'overlays': [/react-popover$/, /react-drawer$/, /react-teaching-popover$/],
  'layout': [/react-card$/, /react-divider$/],
  'utilities': [
    /react-accordion$/, /react-toolbar$/, /react-overflow$/,
    /react-carousel$/, /react-motion/,
  ],
};

/**
 * Classify a package into a category.
 * Falls back to 'utilities' if no pattern matches.
 */
function classifyCategory(packageDirName: string): ComponentCategory {
  for (const [category, patterns] of Object.entries(CATEGORY_PATTERNS)) {
    if (patterns.some(p => p.test(packageDirName))) {
      return category as ComponentCategory;
    }
  }
  return 'utilities';
}
```

## Output

The scraper writes `data/<version>/fluentui-schema.json` with:
- All component entries (with empty `enhanced` fields)
- All utility entries (with empty `enhanced` fields)
- Empty foundation/patterns/enterprise/quickReference arrays (populated by enhancer)
- Populated `sources` and `stats` fields

## Error Handling

| Error Case | Handling Strategy |
|------------|-------------------|
| Package missing .types.ts | Skip component, log warning, try API Extractor fallback |
| ts-morph parse failure | Fall back to API Extractor for that package |
| Story file has syntax errors | Skip that story, log warning |
| Package.json missing/malformed | Skip package, log warning |
| Git clone fails | Abort with clear error message |
| No components found | Abort — likely wrong source path or version config |

## Testing Requirements

- Unit tests for each extractor (props, slots, stories, defaults)
- Unit tests for category classification
- Unit tests for package discovery
- Integration test: scrape a mock FluentUI-like directory structure
- E2E test: scrape actual FluentUI checkout (if available) and validate output schema
