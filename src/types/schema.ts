/**
 * Schema type definitions for the FluentUI Enhanced Schema format.
 *
 * These types define the single-source-of-truth JSON schema used by the
 * schema-driven pipeline: Scraper → Enhancer → MCP Server.
 *
 * The schema replaces the previous markdown-based document indexing with
 * structured JSON that can be queried directly by MCP tools.
 *
 * @module types/schema
 */

// ============================================================================
// Root Schema
// ============================================================================

/**
 * Root schema for a FluentUI version.
 * This is the single source of truth for the MCP server.
 *
 * The scraper produces this with `enhanced` fields empty/undefined.
 * The enhancer populates `enhanced` fields and generates guides/patterns.
 * The MCP server loads the enhanced version at startup.
 */
export interface FluentUISchema {
  /** Schema format version (for forward compatibility) */
  schemaVersion: '1.0';

  /** FluentUI version this schema represents (e.g., 'v9', 'v8') */
  version: string;

  /** ISO 8601 timestamp of when this schema was generated */
  generatedAt: string;

  /** Source repositories used for scraping */
  sources: {
    /** Main FluentUI repository info */
    fluentui: SourceInfo;
    /** Optional contrib repository info */
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

/**
 * Information about a source repository used during scraping.
 * Tracks exactly which version of source code was used.
 */
export interface SourceInfo {
  /** Git repository URL */
  repo: string;

  /** Git ref used (branch, tag, or commit) */
  ref: string;

  /** Full commit hash at time of scrape */
  commit: string;

  /** ISO 8601 timestamp of the scrape */
  scrapedAt: string;
}

/**
 * Aggregate statistics for the schema.
 * Computed by the scraper and used for quick overview reporting.
 */
export interface SchemaStats {
  /** Total number of component entries */
  totalComponents: number;

  /** Total number of utility package entries */
  totalUtilities: number;

  /** Total number of contrib (community) packages */
  totalContrib: number;

  /** Total number of preview (unstable) packages */
  totalPreview: number;

  /** Total number of extracted stories across all components */
  totalStories: number;

  /** Total number of extracted props across all components */
  totalProps: number;

  /** Component count per category (e.g., { buttons: 5, forms: 12 }) */
  categoryCounts: Record<string, number>;
}

// ============================================================================
// Component Types
// ============================================================================

/**
 * A single FluentUI component with all its data.
 * This is the primary content type in the schema.
 *
 * Each component corresponds to a React component exported from a
 * FluentUI package (e.g., Button from @fluentui/react-button).
 */
export interface ComponentEntry {
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

  /**
   * Component category for organization.
   * Plain string for extensibility — validated against KNOWN_COMPONENT_CATEGORIES.
   */
  category: SchemaComponentCategory;

  /** Stability classification */
  stability: StabilityLevel;

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

  /**
   * LLM-enhanced content.
   * Populated by the enhancer stage; undefined in raw scraper output.
   */
  enhanced?: ComponentEnhanced;

  /** Related component names (e.g., Button → ['CompoundButton', 'ToggleButton']) */
  relatedComponents: string[];

  /** Additional exports from the same package (hooks, types, etc.) */
  additionalExports: string[];
}

/**
 * Component category is a plain string for extensibility.
 * New categories from contrib or future FluentUI versions don't require code changes.
 * Use KNOWN_COMPONENT_CATEGORIES for validation.
 */
export type SchemaComponentCategory = string;

/**
 * Stability classification for packages and components.
 * - stable: production-ready, in @fluentui/react-components
 * - preview: available via @fluentui/react-components/unstable
 * - unstable: internal/experimental, not recommended for production
 * - contrib: community-maintained in @fluentui-contrib
 */
export type StabilityLevel = 'stable' | 'preview' | 'unstable' | 'contrib';

/**
 * Known component categories used for validation and classification.
 * Unknown categories default to 'utilities' with a warning logged.
 */
export const KNOWN_COMPONENT_CATEGORIES = [
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

/** Type derived from KNOWN_COMPONENT_CATEGORIES for strict checking */
export type KnownComponentCategory = typeof KNOWN_COMPONENT_CATEGORIES[number];

// ============================================================================
// Prop & Slot Types
// ============================================================================

/**
 * A single prop on a component.
 * Extracted from TypeScript interface definitions in the FluentUI source.
 */
export interface PropEntry {
  /** Prop name (e.g., 'appearance') */
  name: string;

  /** TypeScript type as string (e.g., "'primary' | 'secondary' | 'outline'") */
  type: string;

  /** Whether this prop is required (no `?` modifier) */
  required: boolean;

  /** Default value if known (extracted from useComponent hooks) */
  defaultValue?: string;

  /** JSDoc description from the source code */
  description: string;

  /** Whether this prop is deprecated */
  deprecated: boolean;

  /** Deprecation message if deprecated */
  deprecationMessage?: string;

  /** Whether this prop is inherited from a base type (e.g., HTMLAttributes) */
  inherited: boolean;

  /** Source interface the prop originates from (e.g., 'ButtonProps', 'HTMLButtonElement') */
  source: string;
}

/**
 * A slot definition on a component.
 * Slots are the composable rendering units in FluentUI v9 architecture.
 */
export interface SlotEntry {
  /** Slot name (e.g., 'root', 'icon', 'content') */
  name: string;

  /** The HTML element or component type (e.g., 'button', 'span', 'div') */
  elementType: string;

  /** Alternative element types (e.g., for root: ['button', 'a']) */
  alternativeTypes?: string[];

  /** Whether this slot is required (NonNullable in Slots type) */
  required: boolean;

  /** JSDoc description */
  description: string;
}

/**
 * A Storybook story extracted from the FluentUI source.
 * Stories serve as canonical code examples for the MCP server.
 */
export interface StoryEntry {
  /** Story name (e.g., 'Default', 'Appearance', 'Size') */
  name: string;

  /** Story description from parameters.docs.description or JSDoc */
  description: string;

  /** The complete story source code (including imports and styles) */
  code: string;

  /** Just the render function/component (without surrounding imports) */
  renderCode: string;

  /** File the story was extracted from (relative path) */
  sourceFile: string;

  /** Import statements needed for this story */
  imports: string[];
}

// ============================================================================
// Enhanced Content Types (LLM-generated)
// ============================================================================

/**
 * LLM-enhanced content for a component.
 * Populated by the enhancer stage and preserved across updates
 * unless the component's props/slots change significantly (detected via sourceHash).
 */
export interface ComponentEnhanced {
  /** Rich description (better than JSDoc one-liner) */
  description: string;

  /** Guidance on when to use this component vs alternatives */
  whenToUse: string;

  /** Best practices for using this component */
  bestPractices: {
    /** Things to do */
    dos: string[];
    /** Things to avoid */
    donts: string[];
  };

  /** Accessibility guidance */
  accessibility: {
    /** General accessibility requirements */
    requirements: string;
    /** Keyboard interaction support */
    keyboardSupport: KeyboardEntry[];
    /** Relevant ARIA attributes */
    ariaAttributes: string[];
    /** How screen readers interact with this component */
    screenReaderBehavior: string;
  };

  /** Common usage patterns with code examples */
  commonPatterns: PatternExample[];

  /** Tips for styling this component with Griffel */
  stylingTips: string;

  /** Migration notes from previous version (if applicable) */
  migrationNotes?: string;

  /** Per-prop usage guidance keyed by prop name. */
  propGuidance?: PropGuidance[];

  /** Anti-patterns: things people commonly get wrong, with the correct fix. */
  antiPatterns?: AntiPattern[];

  /** Performance considerations (memoization, re-render costs, virtualization). */
  performanceNotes?: string;

  /** Theming & design-token guidance (which tokens to use, dark mode, RTL). */
  themingNotes?: string;

  /** Slot-composition examples demonstrating slot overrides/children. */
  compositionExamples?: PatternExample[];

  /** Related-pattern links (pattern/guide ids this component participates in). */
  relatedPatterns?: string[];

  /** Edge cases & gotchas (controlled/uncontrolled, async, empty states). */
  edgeCases?: string[];

  /**
   * Hash of the component's raw data when this enhancement was generated.
   * Used for diff-based updates — if the hash matches, skip re-enhancement.
   */
  sourceHash: string;

  /** ISO 8601 timestamp of when this enhancement was generated */
  enhancedAt: string;
}

/**
 * Per-prop usage guidance for a component prop.
 * The `prop` should match a prop name on the component; the validator emits a
 * warning (not an error) when it does not.
 */
export interface PropGuidance {
  /** Prop name (must exist in the component's props). */
  prop: string;

  /** When/why to set this prop and recommended values. */
  guidance: string;

  /** Example values or a short snippet. */
  example?: string;
}

/**
 * A common mistake people make with a component, paired with the correct fix.
 */
export interface AntiPattern {
  /** Short title of the mistake. */
  title: string;

  /** What people do wrong. */
  problem: string;

  /** The correct approach. */
  solution: string;

  /** Optional corrected code snippet. */
  code?: string;
}


/**
 * A keyboard interaction entry for accessibility documentation.
 */
export interface KeyboardEntry {
  /** Key or key combination (e.g., 'Enter', 'Space', 'Arrow Down') */
  key: string;

  /** What action this key triggers (e.g., 'Activates the button') */
  action: string;
}

/**
 * A code example demonstrating a common usage pattern.
 * Used in both ComponentEnhanced and UtilityEnhanced.
 */
export interface PatternExample {
  /** Pattern name (e.g., 'Primary Button', 'With Icon') */
  name: string;

  /** Description of what this pattern demonstrates */
  description: string;

  /** Complete working code example */
  code: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * A FluentUI utility package (not a component).
 * Examples: react-positioning, react-aria, react-tabster, react-motion.
 *
 * Utility packages export hooks, functions, types, and constants
 * rather than React components.
 */
export interface UtilityEntry {
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
  stability: StabilityLevel;

  /** All exported functions/hooks/types */
  exports: UtilityExport[];

  /**
   * LLM-enhanced content.
   * Populated by the enhancer stage; undefined in raw scraper output.
   */
  enhanced?: UtilityEnhanced;
}

/**
 * LLM-enhanced content for a utility package.
 * Simpler than ComponentEnhanced since utilities don't have props/slots.
 */
export interface UtilityEnhanced {
  /** Rich description of the utility package */
  description: string;

  /** When to use this utility */
  whenToUse: string;

  /** Common usage patterns with code examples */
  commonPatterns: PatternExample[];

  /** Per-export usage guidance. */
  exportGuidance?: ExportGuidance[];

  /** Performance considerations. */
  performanceNotes?: string;

  /** Edge cases & gotchas. */
  edgeCases?: string[];

  /** Hash for diff-based updates */
  sourceHash: string;

  /** ISO 8601 timestamp of when this enhancement was generated */
  enhancedAt: string;
}

/**
 * Per-export usage guidance for a utility export.
 * The `export` should match an export name on the utility; the validator emits
 * a warning (not an error) when it does not.
 */
export interface ExportGuidance {
  /** Export name (must exist in the utility's exports). */
  export: string;

  /** When/why to use this export. */
  guidance: string;

  /** Example values or a short snippet. */
  example?: string;
}

/**
 * A single export from a utility package.
 */

export interface UtilityExport {
  /** Export name (e.g., 'usePositioning', 'createArrowStyles') */
  name: string;

  /** Kind of export */
  kind: UtilityExportKind;

  /** JSDoc description */
  description: string;

  /** Function/hook parameters (if applicable) */
  parameters?: ParameterEntry[];

  /** Return type (if applicable) */
  returnType?: string;
}

/**
 * Classification of a utility export's kind.
 */
export type UtilityExportKind = 'function' | 'hook' | 'type' | 'interface' | 'constant' | 'class';

/**
 * A parameter definition for a function or hook export.
 */
export interface ParameterEntry {
  /** Parameter name */
  name: string;

  /** TypeScript type as string */
  type: string;

  /** Whether this parameter is required */
  required: boolean;

  /** Description of the parameter */
  description: string;
}

// ============================================================================
// Guide & Pattern Types
// ============================================================================

/**
 * A guide document (foundation, enterprise, or quick reference).
 * These are fully LLM-generated based on the component/utility data.
 *
 * Foundation guides cover core concepts (theming, styling, accessibility).
 * Enterprise guides cover complex patterns (dashboards, admin panels).
 * Quick reference guides are cheatsheets and checklists.
 */
export interface GuideEntry {
  /** Guide ID (e.g., 'getting-started', 'theming') */
  id: string;

  /** Guide title (e.g., 'Getting Started with FluentUI v9') */
  title: string;

  /** Guide category for grouping */
  category: string;

  /** Full guide content (markdown formatted) */
  content: string;

  /** Code examples within the guide */
  codeExamples: GuideCodeExample[];

  /** Component names referenced in this guide */
  referencedComponents: string[];

  /** Key takeaways / TL;DR bullets. */
  keyTakeaways?: string[];

  /** Common pitfalls for this topic. */
  pitfalls?: string[];

  /** Accessibility callouts relevant to the guide. */
  accessibilityNotes?: string;

  /** Hash for diff-based updates */
  sourceHash: string;

  /** ISO 8601 timestamp of when this was generated */
  enhancedAt: string;
}

/**
 * A code example embedded within a guide.
 */

export interface GuideCodeExample {
  /** Example title */
  title: string;

  /** Description of what this example demonstrates */
  description: string;

  /** The code content */
  code: string;

  /** Programming language for syntax highlighting (e.g., 'tsx', 'css') */
  language: string;
}

/**
 * A pattern guide grouping related components into real-world usage patterns.
 * Examples: login forms, sidebar navigation, dashboard layouts.
 *
 * Patterns differ from guides in that they focus on composing multiple
 * components together and include working examples with component references.
 */
export interface PatternEntry {
  /** Pattern ID (e.g., 'login-form', 'sidebar-navigation') */
  id: string;

  /** Pattern title */
  title: string;

  /** Pattern group (e.g., 'forms', 'navigation', 'layout', 'modals', 'state', 'data') */
  group: string;

  /** Full pattern content (markdown formatted) */
  content: string;

  /** Complete working examples */
  examples: PatternEntryExample[];

  /** Component names this pattern uses */
  referencedComponents: string[];

  /** When to use this pattern. */
  whenToUse?: string;

  /** When NOT to use this pattern. */
  whenNotToUse?: string;

  /** Accessibility callouts for the composed pattern. */
  accessibilityNotes?: string;

  /** Pitfalls specific to this pattern. */
  pitfalls?: string[];

  /** Hash for diff-based updates */
  sourceHash: string;

  /** ISO 8601 timestamp of when this was generated */
  enhancedAt: string;
}

/**
 * A complete working example within a pattern entry.

 * Includes references to which components are used.
 */
export interface PatternEntryExample {
  /** Example name */
  name: string;

  /** Description of this example */
  description: string;

  /** Complete working code */
  code: string;

  /** Component names used in this example */
  components: string[];
}
