/**
 * Category and stability classification for FluentUI packages.
 *
 * This module classifies discovered packages into UI categories (buttons,
 * forms, navigation, etc.) and stability levels (stable, preview, contrib).
 *
 * Category classification uses regex patterns matched against the package
 * directory name. Stability is derived from export index membership and
 * package source (fluentui vs contrib).
 *
 * @module scraper/classify
 */

import type { StabilityLevel, SchemaComponentCategory } from '../../src/types/schema.js';
import type { DiscoveredPackage } from './types.js';

// ============================================================================
// Category Classification
// ============================================================================

/**
 * Regex patterns for classifying FluentUI packages into categories.
 *
 * Each category has an array of patterns tested against the package directory
 * name (e.g., 'react-button', 'react-input'). The first matching category
 * wins. If no pattern matches, the package defaults to 'utilities'.
 *
 * Patterns are ordered to avoid ambiguity — more specific patterns come first
 * within each category.
 */
const CATEGORY_PATTERNS: ReadonlyArray<{
  category: SchemaComponentCategory;
  patterns: RegExp[];
}> = [
  {
    category: 'buttons',
    patterns: [/react-button$/],
  },
  {
    category: 'forms',
    patterns: [
      /react-input$/,
      /react-textarea$/,
      /react-select$/,
      /react-combobox$/,
      /react-checkbox$/,
      /react-radio$/,
      /react-switch$/,
      /react-slider$/,
      /react-spinbutton$/,
      /react-field$/,
      /react-search/,
      /react-rating$/,
      /react-color-picker$/,
      /react-swatch-picker$/,
      /react-tag-picker$/,
      /react-infolabel$/,
      /react-label$/,
      /react-calendar/,
      /react-datepicker/,
      /react-timepicker/,
    ],
  },
  {
    category: 'navigation',
    patterns: [
      /react-menu$/,
      /react-tabs$/,
      /react-breadcrumb$/,
      /react-nav/,
      /react-link$/,
    ],
  },
  {
    category: 'data-display',
    patterns: [
      /react-avatar$/,
      /react-badge$/,
      /react-table$/,
      /react-list$/,
      /react-tree$/,
      /react-tags$/,
      /react-persona$/,
      /react-text$/,
      /react-image$/,
      /react-skeleton$/,
    ],
  },
  {
    category: 'feedback',
    patterns: [
      /react-dialog$/,
      /react-toast$/,
      /react-message-bar$/,
      /react-spinner$/,
      /react-progress$/,
      /react-tooltip$/,
    ],
  },
  {
    category: 'overlays',
    patterns: [
      /react-popover$/,
      /react-drawer$/,
      /react-teaching-popover$/,
    ],
  },
  {
    category: 'layout',
    patterns: [
      /react-card$/,
      /react-divider$/,
    ],
  },
  {
    category: 'utilities',
    patterns: [
      /react-accordion$/,
      /react-toolbar$/,
      /react-overflow$/,
      /react-carousel$/,
      /react-motion/,
    ],
  },
];

/**
 * Classify a package directory name into a UI component category.
 *
 * Tests the directory name against regex patterns for each category.
 * Falls back to 'utilities' if no pattern matches — this is intentional
 * so that new or unknown packages still get a category instead of failing.
 *
 * @param packageDirName - Package directory name (e.g., 'react-button')
 * @returns The component category string
 */
export function classifyCategory(packageDirName: string): SchemaComponentCategory {
  for (const { category, patterns } of CATEGORY_PATTERNS) {
    if (patterns.some((p) => p.test(packageDirName))) {
      return category;
    }
  }
  return 'utilities';
}

// ============================================================================
// Stability Classification
// ============================================================================

/**
 * Determine the stability level of a discovered package.
 *
 * Stability is determined by a combination of:
 * - Source: contrib packages are always 'contrib'
 * - Export indices: packages in the stable index are 'stable',
 *   packages in the unstable index are 'preview'
 * - Default: packages not in any index are 'unstable'
 *
 * Priority order:
 * 1. contrib source → 'contrib'
 * 2. stable export index → 'stable'
 * 3. preview export index → 'preview'
 * 4. neither → 'unstable'
 *
 * @param pkg - The discovered package with export flags
 * @returns The stability classification
 */
export function classifyStability(pkg: DiscoveredPackage): StabilityLevel {
  // Contrib packages always get 'contrib' stability regardless of exports
  if (pkg.source === 'contrib') {
    return 'contrib';
  }

  // Stable export takes precedence over preview
  // (a package can be in both indices during migration)
  if (pkg.isStableExport) {
    return 'stable';
  }

  // Preview/unstable exports
  if (pkg.isPreviewExport) {
    return 'preview';
  }

  // Not in any export index — treat as unstable/internal
  return 'unstable';
}

// ============================================================================
// Batch Classification
// ============================================================================

/**
 * Result of classifying a single package.
 * Combines the category and stability into one object.
 */
export interface ClassificationResult {
  /** UI component category */
  category: SchemaComponentCategory;
  /** Package stability level */
  stability: StabilityLevel;
}

/**
 * Classify both category and stability for a discovered package.
 *
 * This is a convenience function that calls both classifyCategory
 * and classifyStability and returns the combined result.
 *
 * @param pkg - The discovered package
 * @returns Combined classification result
 */
export function classifyPackage(pkg: DiscoveredPackage): ClassificationResult {
  return {
    category: classifyCategory(pkg.dirName),
    stability: classifyStability(pkg),
  };
}
