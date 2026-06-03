/**
 * Shared types for the FluentUI enhancer pipeline.
 *
 * Defines the diff result, enhancement context, CLI options,
 * and LLM provider interfaces used across all enhancer modules.
 *
 * @module enhancer/types
 */

import type {
  ComponentEntry,
  UtilityEntry,
  FluentUISchema,
} from '../../src/types/schema.js';

// ============================================================================
// Diff Types
// ============================================================================

/**
 * Result of comparing raw schema against previous enhanced schema.
 *
 * Used to determine which components need re-enhancement and which
 * can carry forward their existing enhancements unchanged.
 */
export interface DiffResult {
  /** Components that are new (not in previous enhanced schema) */
  newComponents: ComponentEntry[];

  /** Components that have changed (source hash mismatch) */
  changedComponents: ComponentEntry[];

  /** Component IDs that are unchanged (hash matches) — carry forward */
  unchangedComponentIds: string[];

  /** Component IDs that were removed (in previous but not in current) */
  removedComponentIds: string[];

  /** Utilities that are new */
  newUtilities: UtilityEntry[];

  /** Utilities that have changed */
  changedUtilities: UtilityEntry[];

  /** Utility IDs that are unchanged */
  unchangedUtilityIds: string[];

  /** Utility IDs that were removed */
  removedUtilityIds: string[];

  /** Summary statistics */
  stats: DiffStats;
}

/**
 * Summary statistics for a diff result.
 */
export interface DiffStats {
  totalComponents: number;
  newComponents: number;
  changedComponents: number;
  unchangedComponents: number;
  removedComponents: number;
  totalUtilities: number;
  newUtilities: number;
  changedUtilities: number;
  unchangedUtilities: number;
  removedUtilities: number;
}

// ============================================================================
// Hash Types
// ============================================================================

/**
 * A map of component/utility ID to its computed source hash.
 *
 * Hashes are deterministic 16-character hex strings derived from
 * the component's raw data (props, slots, stories).
 */
export type HashIndex = Record<string, string>;

// ============================================================================
// Enhancement Types
// ============================================================================

/**
 * Context passed to LLM enhancement prompts.
 *
 * Contains the raw component/utility data plus any additional
 * context needed for generating high-quality enhancements.
 */
export interface EnhancementContext {
  /** The raw component entry to enhance */
  component?: ComponentEntry;

  /** The raw utility entry to enhance */
  utility?: UtilityEntry;

  /** All component names (for cross-referencing) */
  allComponentNames: string[];

  /** The version being enhanced */
  version: string;
}

/**
 * Result of enhancing a single component via LLM.
 */
export interface ComponentEnhancementResult {
  /** Component ID that was enhanced */
  id: string;

  /** LLM-generated description (2-3 sentences) */
  description: string;

  /** When to use this component */
  whenToUse: string[];

  /** When NOT to use this component (use alternatives instead) */
  whenNotToUse: string[];

  /** Accessibility guidance */
  accessibilityNotes: string[];

  /** Best practice tips */
  bestPractices: string[];

  /** Related component IDs */
  relatedComponents: string[];

  /** Source hash at time of enhancement */
  sourceHash: string;
}

/**
 * Result of enhancing a single utility via LLM.
 */
export interface UtilityEnhancementResult {
  /** Utility ID that was enhanced */
  id: string;

  /** LLM-generated description */
  description: string;

  /** Source hash at time of enhancement */
  sourceHash: string;
}

// ============================================================================
// Guide Generation Types
// ============================================================================

/**
 * Specification for a guide to generate (foundation, enterprise, quick ref).
 *
 * Drives Pass 2 of the enhancer. The orchestrator iterates these specs and
 * asks the LLM to generate the corresponding guide content.
 */
export interface GuideSpec {
  /** Stable guide ID (e.g., 'getting-started', 'theming') */
  id: string;

  /** Human-readable title */
  title: string;

  /**
   * Grouping key. For foundation/enterprise/quick-reference this is the
   * collection name; for patterns it is the pattern group (forms, layout…).
   */
  group: string;

  /**
   * Optional component IDs this guide focuses on. When present, the
   * orchestrator resolves these to full {@link ComponentEntry} data
   * ({@link GuideGenerationContext.targetComponents}) and injects their
   * complete API surface at full fidelity. Unknown ids are skipped.
   */
  targetComponentIds?: string[];
}


/**
 * Context supplied to guide-generation prompts.
 *
 * Provides the LLM the full component inventory so generated examples
 * reference only real component names and import paths.
 */
export interface GuideGenerationContext {
  /** The guide specification being generated */
  spec: GuideSpec;

  /** All component names available for cross-referencing */
  allComponentNames: string[];

  /** Full component summaries (props/slots/relationships) for grounding */
  componentSummaries: ComponentSummary[];

  /**
   * Full component entries this guide focuses on (resolved from
   * `spec.targetComponentIds`). Injected at full fidelity so the guide
   * composes their real APIs. Empty when the spec declares no targets.
   */
  targetComponents: ComponentEntry[];

  /** The version being enhanced (e.g., 'v9') */
  version: string;
}

/**
 * A single prop entry in a {@link ComponentSummary} (name + type + required).
 */
export interface ComponentSummaryProp {
  name: string;
  type: string;
  required: boolean;
}

/**
 * A single slot entry in a {@link ComponentSummary} (name + element type).
 */
export interface ComponentSummarySlot {
  name: string;
  elementType: string;
}

/**
 * A full summary of a component used as grounding context in guide prompts.
 *
 * Carries the complete API surface — every prop (with type), every slot,
 * related components, and additional package exports — so generated guides
 * reference real, complete APIs (no truncation).
 */
export interface ComponentSummary {
  /** Component display name */
  name: string;

  /** Component category */
  category: string;

  /** Full import statement */
  importStatement: string;

  /** Every prop with name + type + required flag (no cap). */
  props: ComponentSummaryProp[];

  /** Every slot with name + elementType. */
  slots: ComponentSummarySlot[];

  /** Related component names. */
  relatedComponents: string[];

  /** Additional package exports (hooks, types). */
  additionalExports: string[];
}


// ============================================================================
// Merge Types
// ============================================================================

/**
 * Options for merging enhanced data back into a schema.
 */
export interface MergeOptions {
  /** The raw schema (source of truth for structure) */
  rawSchema: FluentUISchema;

  /** The previous enhanced schema (source for unchanged enhancements) */
  previousSchema: FluentUISchema | null;

  /** Diff result showing what changed */
  diff: DiffResult;

  /** New enhancement results for changed/new components */
  componentEnhancements: ComponentEnhancementResult[];

  /** New enhancement results for changed/new utilities */
  utilityEnhancements: UtilityEnhancementResult[];

  /** Hash index for all raw components/utilities */
  hashIndex: HashIndex;
}

// ============================================================================
// CLI Types
// ============================================================================

/**
 * Parsed CLI options for the enhancer.
 */
export interface EnhancerCliOptions {
  /** FluentUI version to enhance (e.g., 'v9') */
  version: string;

  /** Re-enhance everything, ignore diff */
  full: boolean;

  /** Only enhance components, skip guide generation */
  componentsOnly: boolean;

  /** Only generate guides, skip component enhancement */
  guidesOnly: boolean;

  /** Show diff without calling LLM */
  dryRun: boolean;

  /** Input schema path */
  input?: string;

  /** Output enhanced schema path */
  output?: string;

  /** LLM provider name */
  provider?: string;

  /** LLM model name */
  model?: string;

  /** Number of parallel LLM requests */
  concurrency: number;

  /** Enable verbose logging */
  verbose: boolean;
}

// ============================================================================
// LLM Provider Types
// ============================================================================

/**
 * Message format for LLM API calls.
 */
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Response from an LLM provider.
 */
export interface LLMResponse {
  /** The generated text content */
  content: string;

  /** Token usage information */
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Interface for LLM providers (OpenAI, Anthropic, etc.).
 */
export interface LLMProvider {
  /** Provider name for logging */
  name: string;

  /**
   * Send a chat completion request.
   *
   * @param messages - Array of messages in the conversation
   * @param options - Optional generation parameters
   * @returns The LLM response with content and usage stats
   */
  chat(
    messages: LLMMessage[],
    options?: LLMChatOptions,
  ): Promise<LLMResponse>;
}

/**
 * Options for LLM chat completion requests.
 */
export interface LLMChatOptions {
  /** Temperature (0-2, lower = more deterministic) */
  temperature?: number;

  /** Maximum tokens to generate */
  maxTokens?: number;

  /** Response format hint */
  responseFormat?: 'text' | 'json';
}
