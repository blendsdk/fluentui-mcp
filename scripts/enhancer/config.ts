/**
 * Enhancer configuration: guide catalogs and runtime options.
 *
 * Defines the canonical set of foundation, pattern, enterprise, and
 * quick-reference guides the enhancer generates in Pass 2, plus the
 * resolved runtime configuration (concurrency, retries, generation flags).
 *
 * @module enhancer/config
 */

import type { DeepSeekReasoningEffort, GuideSpec } from './types.js';

// ============================================================================
// DeepSeek Limits & Defaults
// ============================================================================

/**
 * Output-token ceiling requested from DeepSeek.
 *
 * DeepSeek's reasoning models expose a 128K output window; the enhancer always
 * asks for the maximum so large enriched JSON is never silently cut short. A
 * response that still ends with `finish_reason === 'length'` is treated as
 * truncated and aborts the item.
 */
export const DEEPSEEK_MAX_OUTPUT_TOKENS = 131_072;

/**
 * Per-request timeout in milliseconds for DeepSeek calls.
 *
 * Thinking-mode responses can take a long time, so the timeout is generous
 * (10 minutes) rather than the typical request timeout.
 */
export const DEEPSEEK_REQUEST_TIMEOUT_MS = 600_000;

/** Default DeepSeek model id when `DEEPSEEK_MODEL` is unset. */
export const DEFAULT_DEEPSEEK_MODEL = 'deepseek-flash';

/** Default DeepSeek OpenAI-compatible base URL when `DEEPSEEK_BASE_URL` is unset. */
export const DEFAULT_DEEPSEEK_BASE_URL = 'https://api.deepseek.com';

/**
 * Reasoning-effort levels DeepSeek accepts.
 *
 * Used both as the validation allowlist for `DEEPSEEK_REASONING_EFFORT` and as
 * the default (`max`) when the variable is unset.
 */
export const DEEPSEEK_REASONING_EFFORTS: readonly DeepSeekReasoningEffort[] = [
  'none',
  'low',
  'high',
  'max',
];

/** Default reasoning effort when `DEEPSEEK_REASONING_EFFORT` is unset. */
export const DEFAULT_DEEPSEEK_REASONING_EFFORT: DeepSeekReasoningEffort = 'max';

// ============================================================================
// Guide Catalogs
// ============================================================================

/**
 * Foundation guides covering core FluentUI v9 concepts.
 */
export const FOUNDATION_GUIDES: GuideSpec[] = [
  { id: 'getting-started', title: 'Getting Started with FluentUI', group: 'foundation' },
  { id: 'fluent-provider', title: 'FluentProvider Setup', group: 'foundation' },
  { id: 'theming', title: 'Theming System', group: 'foundation' },
  { id: 'styling-griffel', title: 'Styling with Griffel', group: 'foundation' },
  { id: 'component-architecture', title: 'Component Architecture', group: 'foundation' },
  { id: 'accessibility', title: 'Accessibility Guide', group: 'foundation' },
];

/**
 * Category guidance documents: one per schema category.
 *
 * The `id` is the category name, so the orchestrator can resolve each guide's
 * target components by matching `component.category`.
 */
export const CATEGORY_GUIDES: GuideSpec[] = [
  { id: 'buttons', title: 'Buttons', group: 'category-guidance' },
  { id: 'forms', title: 'Forms', group: 'category-guidance' },
  { id: 'navigation', title: 'Navigation', group: 'category-guidance' },
  { id: 'data-display', title: 'Data Display', group: 'category-guidance' },
  { id: 'feedback', title: 'Feedback', group: 'category-guidance' },
  { id: 'overlays', title: 'Overlays', group: 'category-guidance' },
  { id: 'layout', title: 'Layout', group: 'category-guidance' },
  { id: 'utilities', title: 'Utilities', group: 'category-guidance' },
];

/**
 * Task recipes: goal-oriented walkthroughs that compose components.
 * The `group` field is the recipe group (forms, data, navigation, …).
 */
export const RECIPE_GUIDES: GuideSpec[] = [
  { id: 'login-form', title: 'Login Form', group: 'forms' },
  { id: 'settings-form', title: 'Settings Form', group: 'forms' },
  { id: 'multi-step-form', title: 'Multi-Step Form', group: 'forms' },
  { id: 'form-validation', title: 'Form Validation', group: 'forms' },
  { id: 'data-table', title: 'Data Table', group: 'data' },
  { id: 'async-data-states', title: 'Async Data States', group: 'data' },
  { id: 'virtualization', title: 'Virtualization', group: 'data' },
  { id: 'app-navigation', title: 'Application Navigation', group: 'navigation' },
  { id: 'tabs', title: 'Tabs', group: 'navigation' },
  { id: 'breadcrumb', title: 'Breadcrumb', group: 'navigation' },
  { id: 'pagination', title: 'Pagination', group: 'navigation' },
  { id: 'confirm-dialog', title: 'Confirm Dialog', group: 'modals' },
  { id: 'form-dialog', title: 'Form Dialog', group: 'modals' },
  { id: 'drawer', title: 'Drawer', group: 'modals' },
  { id: 'dashboard-shell', title: 'Dashboard Shell', group: 'layout' },
  { id: 'responsive-layout', title: 'Responsive Layout', group: 'layout' },
  { id: 'controlled-uncontrolled', title: 'Controlled vs Uncontrolled', group: 'state' },
  { id: 'server-state', title: 'Server State', group: 'state' },
  { id: 'accessibility-basics', title: 'Accessibility Basics', group: 'accessibility' },
];

/**
 * Quick-reference cheatsheets and checklists.
 */
export const QUICK_REFERENCE_GUIDES: GuideSpec[] = [
  { id: 'setup-imports', title: 'Setup & Imports Cheatsheet', group: 'quick-reference' },
  { id: 'component-cheatsheet', title: 'Component Quick Reference', group: 'quick-reference' },
  { id: 'styling-tokens', title: 'Styling Tokens Reference', group: 'quick-reference' },
  { id: 'common-patterns', title: 'Common Patterns Cheatsheet', group: 'quick-reference' },
  { id: 'accessibility-checklist', title: 'Accessibility Checklist', group: 'quick-reference' },
];

// ============================================================================
// Runtime Configuration
// ============================================================================

/**
 * Resolved configuration controlling an enhancer run.
 */
export interface EnhancerConfig {
  /** FluentUI version being enhanced (e.g., 'v9') */
  version: string;

  /** Re-enhance everything, ignoring the diff */
  full: boolean;

  /** Enhance components/utilities (Pass 1) */
  enhanceComponents: boolean;

  /** Generate guides (Pass 2) */
  generateGuides: boolean;

  /** Maximum concurrent LLM requests */
  concurrency: number;

  /** Maximum retry attempts per LLM request */
  maxRetries: number;

  /** Base delay in ms for retry backoff */
  baseDelayMs: number;

  /** Temperature for LLM generation */
  temperature: number;

  /**
   * Maximum tokens to request per LLM response. OPTIONAL: when undefined, each
   * provider uses its model's own output ceiling (see MODEL_OUTPUT_CEILINGS).
   * An explicit value (or LLM_MAX_TOKENS) is clamped to the model ceiling.
   */
  maxTokens?: number;

  /** Enable verbose logging */
  verbose: boolean;
}


/** Default enhancer configuration values. */
export const DEFAULT_ENHANCER_CONFIG: Omit<EnhancerConfig, 'version'> = {
  full: false,
  enhanceComponents: true,
  generateGuides: true,
  concurrency: 3,
  maxRetries: 3,
  baseDelayMs: 500,
  temperature: 0.4,
  verbose: false,
};

/**
 * Resolve an {@link EnhancerConfig} from partial overrides plus environment.
 *
 * Precedence: explicit override > environment variable > default. The
 * `--components-only` / `--guides-only` semantics are expressed via the
 * `enhanceComponents` / `generateGuides` flags by the caller.
 *
 * @param overrides - Partial config (typically derived from CLI options)
 * @returns A fully resolved enhancer configuration
 */
export function resolveEnhancerConfig(
  overrides: Partial<EnhancerConfig> & { version: string },
): EnhancerConfig {
  const envConcurrency = process.env.LLM_CONCURRENCY
    ? Number.parseInt(process.env.LLM_CONCURRENCY, 10)
    : undefined;
  const envRetries = process.env.LLM_MAX_RETRIES
    ? Number.parseInt(process.env.LLM_MAX_RETRIES, 10)
    : undefined;
  // NaN-guarded: a non-numeric LLM_MAX_TOKENS resolves to undefined so the
  // provider falls back to the model's own output ceiling.
  const parsedEnvMaxTokens = process.env.LLM_MAX_TOKENS
    ? Number.parseInt(process.env.LLM_MAX_TOKENS, 10)
    : undefined;
  const envMaxTokens = Number.isFinite(parsedEnvMaxTokens)
    ? parsedEnvMaxTokens
    : undefined;

  return {
    version: overrides.version,
    full: overrides.full ?? DEFAULT_ENHANCER_CONFIG.full,

    enhanceComponents:
      overrides.enhanceComponents ?? DEFAULT_ENHANCER_CONFIG.enhanceComponents,
    generateGuides:
      overrides.generateGuides ?? DEFAULT_ENHANCER_CONFIG.generateGuides,
    concurrency:
      overrides.concurrency ??
      envConcurrency ??
      DEFAULT_ENHANCER_CONFIG.concurrency,
    maxRetries:
      overrides.maxRetries ?? envRetries ?? DEFAULT_ENHANCER_CONFIG.maxRetries,
    baseDelayMs: overrides.baseDelayMs ?? DEFAULT_ENHANCER_CONFIG.baseDelayMs,
    temperature: overrides.temperature ?? DEFAULT_ENHANCER_CONFIG.temperature,
    // undefined is a valid resolved value ⇒ provider uses the model ceiling.
    maxTokens: overrides.maxTokens ?? envMaxTokens,
    verbose: overrides.verbose ?? DEFAULT_ENHANCER_CONFIG.verbose,
  };
}

