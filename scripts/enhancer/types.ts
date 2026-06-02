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
