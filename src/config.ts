/**
 * Server configuration module.
 *
 * Resolves the server configuration from three sources (in priority order):
 * 1. CLI arguments (e.g., `fluentui-mcp v9`)
 * 2. Environment variables (e.g., `FLUENTUI_DOCS_PATH=/custom/path`)
 * 3. Defaults (bundled v9 docs)
 *
 * This allows the server to be used in multiple ways:
 * - Global install with version arg: `fluentui-mcp v9`
 * - Custom docs path via env var: `FLUENTUI_DOCS_PATH=/my/docs fluentui-mcp`
 * - Default (no args): serves bundled v9 documentation
 *
 * @module config
 */

import { existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { DEFAULT_VERSION } from './types/index.js';
import type { ServerConfig } from './types/index.js';

/**
 * Resolve __dirname equivalent for ES modules.
 * Points to the directory containing this compiled file (dist/).
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** The package root directory (one level up from dist/) */
const PACKAGE_ROOT = join(__dirname, '..');

/** Environment variable name for custom docs path override */
const DOCS_PATH_ENV_VAR = 'FLUENTUI_DOCS_PATH';

/** Environment variable name for version override */
const VERSION_ENV_VAR = 'FLUENTUI_VERSION';

/** Package version — read from a constant to avoid dynamic import of package.json */
const PACKAGE_VERSION = '1.0.0';

/**
 * Resolves the complete server configuration.
 *
 * Resolution order:
 * 1. If `FLUENTUI_DOCS_PATH` env var is set → use that path directly
 * 2. If CLI arg provided (e.g., "v9") → look for `docs/{version}/` in package
 * 3. If `FLUENTUI_VERSION` env var is set → look for `docs/{version}/` in package
 * 4. Default → `docs/v9/` in the installed package
 *
 * @returns Fully resolved server configuration
 * @throws Error if the resolved docs path does not exist
 */
export function resolveConfig(): ServerConfig {
  // Step 1: Determine the version from CLI args or env var
  const cliVersion = parseCliVersion();
  const envVersion = process.env[VERSION_ENV_VAR];
  const version = cliVersion || envVersion || DEFAULT_VERSION;

  // Step 2: Resolve the docs path
  const docsPath = resolveDocsPath(version);

  // Step 3: Validate the docs path exists
  if (!existsSync(docsPath)) {
    throw new Error(
      `Documentation path not found: ${docsPath}\n` +
      `Looked for version "${version}" docs.\n` +
      `Available options:\n` +
      `  - Pass a version arg: fluentui-mcp v9\n` +
      `  - Set env var: ${DOCS_PATH_ENV_VAR}=/path/to/docs\n` +
      `  - Ensure bundled docs exist at: ${getBundledDocsPath(version)}`
    );
  }

  // Step 4: Build the server name incorporating the version
  const serverName = `fluentui-${version}-docs`;

  return {
    version,
    docsPath,
    serverName,
    serverVersion: PACKAGE_VERSION,
  };
}

/**
 * Parse the version from CLI arguments.
 *
 * Expects the version as the first positional argument:
 * `fluentui-mcp v9` → "v9"
 * `fluentui-mcp v10-react-20` → "v10-react-20"
 * `fluentui-mcp` → null (use default)
 *
 * @returns The version string, or null if not provided
 */
function parseCliVersion(): string | null {
  // process.argv: [node, script, ...args]
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return null;
  }

  // First positional arg is the version
  const versionArg = args[0];

  // Skip if it looks like a flag (e.g., --help)
  if (versionArg.startsWith('-')) {
    return null;
  }

  return versionArg;
}

/**
 * Resolve the absolute path to the documentation folder.
 *
 * Priority:
 * 1. FLUENTUI_DOCS_PATH environment variable (absolute or relative path)
 * 2. Bundled docs at `{package_root}/docs/{version}/`
 *
 * @param version - The FluentUI version identifier
 * @returns Absolute path to the docs folder
 */
function resolveDocsPath(version: string): string {
  // Check for custom docs path via environment variable
  const envDocsPath = process.env[DOCS_PATH_ENV_VAR];
  if (envDocsPath) {
    // Resolve relative paths against CWD, absolute paths stay as-is
    return resolve(envDocsPath);
  }

  // Use bundled docs
  return getBundledDocsPath(version);
}

/**
 * Get the path to bundled docs for a specific version.
 *
 * @param version - The FluentUI version identifier
 * @returns Absolute path to `{package_root}/docs/{version}/`
 */
function getBundledDocsPath(version: string): string {
  return join(PACKAGE_ROOT, 'docs', version);
}
