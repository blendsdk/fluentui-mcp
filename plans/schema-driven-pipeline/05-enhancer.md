# Enhancer: LLM Enrichment Pipeline

> **Document**: 05-enhancer.md
> **Parent**: [Index](00-index.md)

## Overview

The enhancer is Stage 2 of the pipeline. It reads the raw schema produced by the scraper (`fluentui-schema.json`), enriches it with LLM-generated content (descriptions, best practices, accessibility guidance, patterns, guides), and writes the enhanced schema (`fluentui-schema-enhanced.json`). It uses diff-based updates to only re-enhance components that have changed, preserving existing quality content and minimizing LLM costs.

## Architecture

### Pipeline Position

```
Scraper → [ENHANCER] → MCP Server
              │
              ├── Load raw schema + previous enhanced schema (if exists)
              ├── Diff: identify new/changed/unchanged components
              ├── Pass 1: Enhance changed components (descriptions, best practices, etc.)
              ├── Pass 2: Generate/update guides (foundation, patterns, enterprise)
              ├── Merge: combine new enhancements with preserved existing ones
              └── Write fluentui-schema-enhanced.json
```

### File Structure

```
scripts/
├── enhancer/
│   ├── cli.ts                    # CLI entry point (yarn enhance)
│   ├── config.ts                 # LLM provider configuration
│   ├── types.ts                  # Shared enhancer types
│   ├── diff.ts                   # Diff engine (compare raw vs previous enhanced)
│   ├── hasher.ts                 # Source hash computation for change detection
│   ├── enhancer.ts               # Main enhancement orchestrator
│   ├── llm/
│   │   ├── provider.ts           # LLM provider interface
│   │   ├── openai.ts             # OpenAI implementation
│   │   ├── anthropic.ts          # Anthropic implementation
│   │   └── batch.ts              # Batch processing with retry logic
│   ├── prompts/
│   │   ├── component-enhance.ts  # Prompt for component enhancement
│   │   ├── utility-enhance.ts    # Prompt for utility enhancement
│   │   ├── foundation-guide.ts   # Prompt for foundation guide generation
│   │   ├── pattern-guide.ts      # Prompt for pattern guide generation
│   │   ├── enterprise-guide.ts   # Prompt for enterprise guide generation
│   │   └── quick-reference.ts    # Prompt for quick reference generation
│   └── merge.ts                  # Merge new enhancements with existing
```

## CLI Interface

```bash
# Enhance raw schema (uses previous enhanced schema for diff)
yarn enhance --version v9

# Full re-enhancement (ignore previous, re-enhance everything)
yarn enhance --version v9 --full

# Enhance only components (skip guide generation)
yarn enhance --version v9 --components-only

# Enhance only guides (skip component enhancement)
yarn enhance --version v9 --guides-only

# Dry run (show what would be enhanced, don't call LLM)
yarn enhance --version v9 --dry-run

# Custom input/output
yarn enhance --input data/v9/fluentui-schema.json --output data/v9/fluentui-schema-enhanced.json
```

### CLI Options

| Flag | Required | Default | Description |
|------|----------|---------|-------------|
| `--version` | Yes | — | FluentUI version to enhance |
| `--full` | No | false | Re-enhance everything (ignore diff) |
| `--components-only` | No | false | Only enhance components, skip guides |
| `--guides-only` | No | false | Only generate guides, skip components |
| `--dry-run` | No | false | Show diff without calling LLM |
| `--input` | No | `data/<version>/fluentui-schema.json` | Input schema path |
| `--output` | No | `data/<version>/fluentui-schema-enhanced.json` | Output path |
| `--provider` | No | from env | LLM provider (openai, anthropic) |
| `--model` | No | from env | LLM model name |
| `--concurrency` | No | 3 | Parallel LLM requests |
| `--verbose` | No | false | Verbose logging |

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `LLM_PROVIDER` | Yes | 'openai' or 'anthropic' |
| `LLM_MODEL` | No | Model name (default: provider-specific) |
| `OPENAI_API_KEY` | If OpenAI | OpenAI API key |
| `ANTHROPIC_API_KEY` | If Anthropic | Anthropic API key |
| `LLM_MAX_RETRIES` | No | Max retries per request (default: 3) |
| `LLM_CONCURRENCY` | No | Parallel requests (default: 3) |

## Diff-Based Updates

### Source Hash Computation

```typescript
// scripts/enhancer/hasher.ts

/**
 * Compute a hash of the component's raw data (props, slots, stories).
 * Used to detect whether a component has changed since last enhancement.
 * If the hash matches the previous enhancement's sourceHash, skip re-enhancement.
 */
function computeSourceHash(component: ComponentEntry): string {
  const hashInput = JSON.stringify({
    name: component.name,
    packageVersion: component.packageVersion,
    props: component.props.map(p => ({ name: p.name, type: p.type, required: p.required })),
    slots: component.slots.map(s => ({ name: s.name, elementType: s.elementType, required: s.required })),
    storyCount: component.stories.length,
  });
  return createHash('sha256').update(hashInput).digest('hex').substring(0, 16);
}
```

### Diff Engine

```typescript
// scripts/enhancer/diff.ts

interface DiffResult {
  /** Components that are new (not in previous enhanced schema) */
  newComponents: ComponentEntry[];
  /** Components that have changed (hash mismatch) */
  changedComponents: ComponentEntry[];
  /** Components that are unchanged (hash matches) — carry forward existing enhancement */
  unchangedComponents: ComponentEntry[];
  /** Components that were removed (in previous but not in current raw schema) */
  removedComponents: string[];

  /** Same for utilities */
  newUtilities: UtilityEntry[];
  changedUtilities: UtilityEntry[];
  unchangedUtilities: UtilityEntry[];
  removedUtilities: string[];

  /** Summary stats */
  stats: {
    total: number;
    new: number;
    changed: number;
    unchanged: number;
    removed: number;
  };
}

/**
 * Compare raw schema against previous enhanced schema to determine what needs re-enhancement.
 */
function diffSchemas(rawSchema: FluentUISchema, previousEnhanced: FluentUISchema | null): DiffResult {
  // For each component in rawSchema:
  //   1. Compute sourceHash
  //   2. Look up in previousEnhanced by name
  //   3. If not found → new
  //   4. If found but hash differs → changed
  //   5. If found and hash matches → unchanged (carry forward)
  // Components in previousEnhanced but not in rawSchema → removed
}
```

### Diff Report (dry-run output)

```
FluentUI Enhancement Diff Report
=================================
Version: v9
Raw schema: 95 components, 12 utilities
Previous enhanced: 90 components, 10 utilities

Components:
  NEW (5):
    - ColorPicker (forms) — new package @fluentui/react-color-picker
    - SwatchPicker (forms) — new package @fluentui/react-swatch-picker
    - TagPicker (forms) — new package @fluentui/react-tag-picker
    - Carousel (utilities) — new package @fluentui/react-carousel
    - Nav (navigation) — new package @fluentui/react-nav

  CHANGED (3):
    - Button: 2 new props (iconOnly, loading), 1 removed prop (block)
    - Dialog: slot type changed for 'actions'
    - Input: new story added (InputPassword)

  UNCHANGED (87): [skipped — carry forward existing enhancements]

  REMOVED (0): none

Utilities:
  NEW (2): react-motion, react-carousel-context
  CHANGED (0): none
  UNCHANGED (10): [carry forward]

Estimated LLM cost: ~$1.50 (8 component enhancements + 2 utility enhancements)
```

## LLM Provider Interface

```typescript
// scripts/enhancer/llm/provider.ts

interface LLMProvider {
  /** Provider name */
  name: string;

  /**
   * Send a prompt to the LLM and get structured JSON response.
   * @param prompt - The system prompt
   * @param userMessage - The user message (component data)
   * @param responseSchema - Expected response structure hint
   * @returns Parsed JSON response
   */
  complete<T>(prompt: string, userMessage: string, responseSchema?: object): Promise<T>;
}

// scripts/enhancer/llm/openai.ts
class OpenAIProvider implements LLMProvider { ... }

// scripts/enhancer/llm/anthropic.ts
class AnthropicProvider implements LLMProvider { ... }
```

### Batch Processing with Retry

```typescript
// scripts/enhancer/llm/batch.ts

interface BatchOptions {
  concurrency: number;  // Parallel requests (default: 3)
  maxRetries: number;   // Per-request retries (default: 3)
  retryDelay: number;   // Base delay in ms (exponential backoff)
  onProgress: (completed: number, total: number, current: string) => void;
}

/**
 * Process items in batches with retry logic and progress reporting.
 */
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: BatchOptions
): Promise<Map<T, R>> { ... }
```

## Enhancement Prompts

### Component Enhancement Prompt

```typescript
// scripts/enhancer/prompts/component-enhance.ts

const COMPONENT_ENHANCE_PROMPT = `
You are a FluentUI React component documentation expert. Given the raw component data
(props, slots, Storybook examples), generate rich documentation content.

You MUST return valid JSON matching this exact structure:
{
  "description": "2-3 sentence rich description of the component",
  "whenToUse": "When and why to use this component vs alternatives",
  "bestPractices": {
    "dos": ["Do this", "Do that"],
    "donts": ["Don't do this", "Don't do that"]
  },
  "accessibility": {
    "requirements": "WCAG and accessibility requirements",
    "keyboardSupport": [{"key": "Enter", "action": "Activates the button"}],
    "ariaAttributes": ["aria-label", "aria-disabled"],
    "screenReaderBehavior": "How screen readers interact with this component"
  },
  "commonPatterns": [
    {
      "name": "Pattern name",
      "description": "When to use this pattern",
      "code": "// TypeScript/TSX code example"
    }
  ],
  "stylingTips": "Common styling customizations and tokens to use",
  "migrationNotes": "Differences from previous version (if applicable)"
}

Rules:
- Use ONLY the props and slots provided in the data — do NOT invent props that don't exist
- Code examples MUST use correct import paths and prop names from the data
- Best practices should be specific to this component, not generic React advice
- Accessibility guidance should reference actual ARIA attributes from the component
- Keep descriptions concise but informative
`;
```

### Foundation Guide Prompt

```typescript
// scripts/enhancer/prompts/foundation-guide.ts

const FOUNDATION_GUIDE_PROMPT = `
You are a FluentUI documentation expert. Generate a comprehensive foundation guide
for the topic specified. You have access to the full list of FluentUI components
and their APIs — use this to create accurate code examples.

The guide should be written in markdown and include:
- Clear explanation of the concept
- Step-by-step instructions where appropriate
- Working code examples using real FluentUI component APIs
- Links/references to related components

Available components and their import paths are provided in the context.
`;
```

### Pattern Guide Prompt

```typescript
// scripts/enhancer/prompts/pattern-guide.ts

const PATTERN_GUIDE_PROMPT = `
You are a FluentUI patterns expert. Generate a comprehensive pattern guide
that shows how to combine FluentUI components for real-world use cases.

Each pattern must include:
- Description of the pattern and when to use it
- Complete, working code examples using REAL FluentUI component APIs
- The component names referenced in the code must match the provided component list
- Props used in examples must exist in the provided prop definitions

Rules:
- ONLY use props that exist in the provided component data
- ONLY use import paths that are documented
- Code must be complete and ready to use (not pseudocode)
- Include TypeScript types where appropriate
`;
```

## Enhancement Orchestration

### Pass 1: Component & Utility Enhancement

```typescript
// For each NEW or CHANGED component:
//   1. Prepare input: component raw data (props, slots, stories)
//   2. Call LLM with COMPONENT_ENHANCE_PROMPT
//   3. Parse response as ComponentEnhanced
//   4. Set sourceHash to current hash
//   5. Set enhancedAt to now

// For UNCHANGED components:
//   Carry forward the existing enhancement from previous schema
```

### Pass 2: Guide Generation

```typescript
// Generate/update guides in these categories:
const GUIDE_CATEGORIES = {
  foundation: [
    { id: 'getting-started', title: 'Getting Started with FluentUI' },
    { id: 'fluent-provider', title: 'FluentProvider Setup' },
    { id: 'theming', title: 'Theming System' },
    { id: 'styling-griffel', title: 'Styling with Griffel' },
    { id: 'component-architecture', title: 'Component Architecture' },
    { id: 'accessibility', title: 'Accessibility Guide' },
  ],
  patterns: [
    // Forms
    { id: 'basic-forms', group: 'forms', title: 'Basic Form Patterns' },
    { id: 'form-validation', group: 'forms', title: 'Form Validation' },
    { id: 'login-form', group: 'forms', title: 'Login Form Pattern' },
    // Navigation
    { id: 'sidebar-navigation', group: 'navigation', title: 'Sidebar Navigation' },
    { id: 'tab-navigation', group: 'navigation', title: 'Tab Navigation' },
    { id: 'breadcrumb-patterns', group: 'navigation', title: 'Breadcrumb Patterns' },
    // Layout
    { id: 'page-structure', group: 'layout', title: 'Page Structure' },
    { id: 'responsive-design', group: 'layout', title: 'Responsive Design' },
    { id: 'dashboard-layout', group: 'layout', title: 'Dashboard Layout' },
    // Modals
    { id: 'dialog-patterns', group: 'modals', title: 'Dialog Patterns' },
    { id: 'drawer-patterns', group: 'modals', title: 'Drawer Patterns' },
    // State
    { id: 'controlled-uncontrolled', group: 'state', title: 'Controlled vs Uncontrolled' },
    { id: 'form-state', group: 'state', title: 'Form State Management' },
    // Data
    { id: 'loading-states', group: 'data', title: 'Loading States' },
    { id: 'error-handling', group: 'data', title: 'Error Handling Patterns' },
  ],
  enterprise: [
    { id: 'app-shell', title: 'Application Shell' },
    { id: 'dashboard-patterns', title: 'Dashboard Patterns' },
    { id: 'admin-crud', title: 'Admin CRUD Patterns' },
    { id: 'data-tables', title: 'Data Table Patterns' },
    { id: 'accessibility-enterprise', title: 'Enterprise Accessibility' },
  ],
  quickReference: [
    { id: 'setup-imports', title: 'Setup & Imports Cheatsheet' },
    { id: 'component-cheatsheet', title: 'Component Quick Reference' },
    { id: 'styling-tokens', title: 'Styling Tokens Reference' },
    { id: 'common-patterns', title: 'Common Patterns Cheatsheet' },
    { id: 'accessibility-checklist', title: 'Accessibility Checklist' },
  ],
};
```

### Guide Generation Strategy

Guides are regenerated when:
1. **Full re-run** (`--full` flag) — always regenerate
2. **New components added** — guides that reference the component's category are regenerated
3. **Significant changes** — if >20% of components changed, regenerate all guides
4. Otherwise — carry forward existing guides

When generating guides, the LLM receives the **full component list with props** as context, ensuring examples use real APIs.

## Merge Logic

```typescript
// scripts/enhancer/merge.ts

/**
 * Merge new enhancements with existing ones.
 * - NEW components: use new enhancement
 * - CHANGED components: use new enhancement
 * - UNCHANGED components: carry forward from previous
 * - REMOVED components: drop from output
 */
function mergeEnhancements(
  rawSchema: FluentUISchema,
  diffResult: DiffResult,
  newEnhancements: Map<string, ComponentEnhanced>,
  previousEnhanced: FluentUISchema | null,
): FluentUISchema { ... }
```

## Cost Estimation

| Scenario | Components | Tokens | Est. Cost (GPT-4o) | Est. Cost (Claude Sonnet) |
|----------|-----------|--------|---------------------|---------------------------|
| Full initial run | ~100 components + ~30 guides | ~550K | ~$5-10 | ~$3-7 |
| Minor update (5 changed) | 5 components | ~15K | ~$0.15 | ~$0.10 |
| Moderate update (20 changed) | 20 components + 5 guides | ~80K | ~$0.80 | ~$0.50 |
| New version (v10) | ~100 components + ~30 guides | ~550K | ~$5-10 | ~$3-7 |

## Error Handling

| Error Case | Handling Strategy |
|------------|-------------------|
| LLM API rate limit | Exponential backoff with jitter |
| LLM returns invalid JSON | Retry up to 3 times with stricter prompt |
| LLM returns hallucinated props | Validate against raw schema; strip unknown props from examples |
| LLM API key missing | Abort with clear error message |
| Partial enhancement failure | Save progress; allow resume from last successful item |
| Previous enhanced schema missing | Treat as full initial run (no diff) |

## Testing Requirements

- Unit tests for diff engine (new, changed, unchanged, removed detection)
- Unit tests for source hash computation (deterministic, changes when data changes)
- Unit tests for merge logic
- Integration test with mock LLM provider (returns canned responses)
- Validation test: enhanced schema passes JSON Schema validation
- Quality test: verify enhanced descriptions reference only props that exist in raw data
