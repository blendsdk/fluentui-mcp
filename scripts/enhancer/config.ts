/**
 * Enhancer configuration: guide catalogs and runtime options.
 *
 * Defines the canonical set of foundation, pattern, enterprise, and
 * quick-reference guides the enhancer generates in Pass 2, plus the
 * resolved runtime configuration (concurrency, retries, generation flags).
 *
 * @module enhancer/config
 */

import type { GuideSpec } from './types.js';

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
 * Pattern guides composing components for real-world use cases.
 * The `group` field is the pattern group (forms, navigation, layout…).
 */
export const PATTERN_GUIDES: GuideSpec[] = [
  { id: 'basic-forms', title: 'Basic Form Patterns', group: 'forms' },
  { id: 'form-validation', title: 'Form Validation', group: 'forms' },
  { id: 'login-form', title: 'Login Form Pattern', group: 'forms' },
  { id: 'sidebar-navigation', title: 'Sidebar Navigation', group: 'navigation' },
  { id: 'tab-navigation', title: 'Tab Navigation', group: 'navigation' },
  { id: 'breadcrumb-patterns', title: 'Breadcrumb Patterns', group: 'navigation' },
  { id: 'page-structure', title: 'Page Structure', group: 'layout' },
  { id: 'responsive-design', title: 'Responsive Design', group: 'layout' },
  { id: 'dashboard-layout', title: 'Dashboard Layout', group: 'layout' },
  { id: 'dialog-patterns', title: 'Dialog Patterns', group: 'modals' },
  { id: 'drawer-patterns', title: 'Drawer Patterns', group: 'modals' },
  { id: 'controlled-uncontrolled', title: 'Controlled vs Uncontrolled', group: 'state' },
  { id: 'form-state', title: 'Form State Management', group: 'state' },
  { id: 'loading-states', title: 'Loading States', group: 'data' },
  { id: 'error-handling', title: 'Error Handling Patterns', group: 'data' },
];

/**
 * Enterprise guides covering production-grade application patterns.
 */
export const ENTERPRISE_GUIDES: GuideSpec[] = [
  { id: 'app-shell', title: 'Application Shell', group: 'enterprise' },
  { id: 'dashboard-patterns', title: 'Dashboard Patterns', group: 'enterprise' },
  { id: 'admin-crud', title: 'Admin CRUD Patterns', group: 'enterprise' },
  { id: 'data-tables', title: 'Data Table Patterns', group: 'enterprise' },
  { id: 'accessibility-enterprise', title: 'Enterprise Accessibility', group: 'enterprise' },
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
    verbose: overrides.verbose ?? DEFAULT_ENHANCER_CONFIG.verbose,
  };
}
