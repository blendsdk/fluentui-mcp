/**
 * Version-specific configuration for the FluentUI scraper.
 *
 * Each FluentUI version has different directory layouts, package structures,
 * and file naming conventions. This module provides the config for each
 * supported version so the scraper knows where to find everything.
 *
 * @module scraper/config
 */

import type { VersionConfig } from './types.js';

// ============================================================================
// Version Configurations
// ============================================================================

/**
 * Configuration for FluentUI v9 (the current/modern version).
 *
 * V9 uses a monorepo structure with individual packages under
 * `packages/react-components/react-*`. Each package has:
 * - `library/src/` for source code
 * - `stories/src/` for Storybook examples
 * - `package.json` with `@fluentui/react-*` naming
 */
const V9_CONFIG: VersionConfig = {
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
    defaultBranch: 'main',
  },
  paths: {
    componentPackages: 'packages/react-components/react-*',
    stableExportsIndex:
      'packages/react-components/react-components/library/src/index.ts',
    unstableExportsIndex:
      'packages/react-components/react-components/library/src/unstable/index.ts',
    storiesGlob:
      'packages/react-components/react-*/stories/src/**/*.stories.tsx',
  },
  skipPackages: [
    // Build tooling and internal utilities
    'react-conformance-griffel',
    'react-storybook-addon',
    'react-storybook-addon-export-to-sandbox',
    'react-jsx-runtime',
    // Theme compat layers
    'react-theme-sass',
    'react-icons-compat',
    // Portal compat
    'react-portal-compat',
    'react-portal-compat-context',
    // Migration helpers (not components)
    'react-migration-v0-v9',
    'react-migration-v8-v9',
    // Babel presets
    'babel-preset-global-context',
    'babel-preset-storybook-full-source',
    // Dev tools
    'component-selector-preview',
    'eslint-plugin-react-components',
    // Deprecated umbrella
    'deprecated',
  ],
};

/**
 * Configuration for FluentUI v8 (legacy Fabric-based version).
 *
 * V8 uses a different monorepo layout with components under
 * `packages/react/src/components/*`. Each component lives as a
 * directory in a single large package.
 *
 * NOTE: V8 adapter is deferred to a future phase. The config is
 * defined here for forward compatibility but is not yet functional.
 */
const V8_CONFIG: VersionConfig = {
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
    defaultBranch: 'main',
  },
  paths: {
    componentPackages: 'packages/react/src/components/*',
    stableExportsIndex: 'packages/react/src/index.ts',
    storiesGlob: 'packages/react/stories/**/*.stories.tsx',
  },
  skipPackages: [],
};

// ============================================================================
// Version Registry
// ============================================================================

/**
 * Registry of all supported FluentUI version configurations.
 * Keyed by version string (e.g., 'v9', 'v8').
 */
export const VERSION_CONFIGS: Readonly<Record<string, VersionConfig>> = {
  v9: V9_CONFIG,
  v8: V8_CONFIG,
};

/**
 * List of all supported version strings.
 */
export const SUPPORTED_VERSIONS = Object.keys(VERSION_CONFIGS);

/**
 * Retrieve the version configuration for a specific FluentUI version.
 *
 * @param version - Version string (e.g., 'v9', 'v8')
 * @returns The version configuration
 * @throws Error if the version is not supported
 */
export function getVersionConfig(version: string): VersionConfig {
  const config = VERSION_CONFIGS[version];
  if (!config) {
    throw new Error(
      `Unsupported FluentUI version: '${version}'. ` +
        `Supported versions: ${SUPPORTED_VERSIONS.join(', ')}`,
    );
  }
  return config;
}
