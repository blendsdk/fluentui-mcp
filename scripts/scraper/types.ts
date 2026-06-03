/**
 * Shared type definitions for the FluentUI scraper.
 *
 * These types are used internally by the scraper pipeline — they represent
 * intermediate data structures during the discovery and extraction process.
 * The final output conforms to the FluentUISchema types in src/types/schema.ts.
 *
 * @module scraper/types
 */

// ============================================================================
// Package Discovery Types
// ============================================================================

/**
 * A discovered FluentUI package found during the discovery phase.
 *
 * This is the primary input to the extraction phase — each discovered package
 * is then processed by a version-specific adapter to extract component or
 * utility data.
 */
export interface DiscoveredPackage {
  /** Directory name (e.g., 'react-button') */
  dirName: string;

  /** Full absolute path to the package directory */
  path: string;

  /** npm package name from package.json (e.g., '@fluentui/react-button') */
  packageName: string;

  /** Package version from package.json (e.g., '9.9.1') */
  packageVersion: string;

  /**
   * Whether this is a component, utility, or internal-only package.
   * - component: exports React components (has .tsx with forwardRef, etc.)
   * - utility: exports hooks, functions, or types only
   * - internal: build tooling, test utilities, etc. (should be skipped)
   */
  type: 'component' | 'utility' | 'internal';

  /** Whether this package is re-exported from the stable exports index */
  isStableExport: boolean;

  /** Whether this package is re-exported from the unstable/preview exports index */
  isPreviewExport: boolean;

  /**
   * Source repository origin.
   * - fluentui: official Microsoft FluentUI monorepo
   * - contrib: community-maintained fluentui-contrib repo
   */
  source: 'fluentui' | 'contrib';
}

// ============================================================================
// Version Configuration Types
// ============================================================================

/**
 * Configuration for scraping a specific FluentUI version.
 *
 * Each version has its own directory layout, package patterns, and extraction
 * strategies. The scraper uses this config to know where to look for packages
 * and how to interpret the file structure.
 */
export interface VersionConfig {
  /** Display version identifier (e.g., 'v9', 'v8') */
  version: string;

  /** Which adapter to use for extraction */
  adapter: 'v9' | 'v8';

  /** FluentUI main repository details */
  fluentui: RepoConfig;

  /** FluentUI contrib repository details */
  contrib: RepoConfig;

  /** Path patterns for locating packages and files in this version */
  paths: VersionPaths;

  /**
   * Package directory names to skip during discovery.
   * These are internal build tools, test utilities, compat layers, etc.
   * that don't produce useful documentation content.
   */
  skipPackages: string[];
}

/**
 * Git repository configuration for cloning/checkout.
 */
export interface RepoConfig {
  /** Git remote URL (e.g., 'https://github.com/microsoft/fluentui.git') */
  repo: string;

  /** Default git ref to checkout (branch, tag, or commit) */
  defaultRef: string;

  /** Default branch name for cloning (some repos use 'main' vs 'master') */
  defaultBranch: string;
}

/**
 * Path patterns for a specific FluentUI version.
 *
 * These glob patterns and file paths tell the discovery module where to
 * find component packages, export indices, and story files within the
 * FluentUI monorepo.
 */
export interface VersionPaths {
  /** Glob pattern for finding component/utility packages */
  componentPackages: string;

  /**
   * Path to the stable exports index file.
   * The scraper reads this to determine which components are publicly
   * re-exported as part of the stable API.
   */
  stableExportsIndex: string;

  /**
   * Path to the unstable/preview exports index file (optional).
   * Components exported here are classified as 'preview' stability.
   */
  unstableExportsIndex?: string;

  /** Glob pattern for finding Storybook story files */
  storiesGlob: string;
}

// ============================================================================
// CLI Types
// ============================================================================

/**
 * Parsed CLI options for the scraper command.
 */
export interface ScraperCliOptions {
  /** FluentUI version to scrape ('v9', 'v8') */
  version: string;

  /** Path to local FluentUI checkout (mutually exclusive with --clone) */
  source?: string;

  /** Path to local fluentui-contrib checkout */
  contrib?: string;

  /** Whether to clone from GitHub instead of using a local path */
  clone: boolean;

  /** Git ref to checkout (branch, tag, commit) */
  ref?: string;

  /** Git ref for contrib repo */
  contribRef?: string;

  /** Reuse existing checkout (skip clone/pull) */
  reuse: boolean;

  /** Output file path for the generated schema JSON */
  output?: string;

  /** Enable verbose logging */
  verbose: boolean;
}
