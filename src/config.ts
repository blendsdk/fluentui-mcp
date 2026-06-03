/**
 * Server configuration module.
 *
 * Resolves the server configuration from three sources (in priority order):
 * 1. CLI arguments (e.g., `fluentui-mcp v9`) — selects the version
 * 2. Environment variables (`FLUENTUI_SCHEMA_PATH`, `FLUENTUI_VERSION`)
 * 3. Defaults (bundled `data/v9/fluentui-schema-enhanced.json`)
 *
 * The schema path itself is resolved by {@link resolveSchemaPath} from the
 * schema loader, which honours the same priority order
 * (explicit → env var → bundled). This keeps a single source of truth for path
 * resolution shared between the server entry point and the loader.
 *
 * @module config
 */

import { DEFAULT_VERSION } from './types/index.js';
import type { ServerConfig } from './types/index.js';
import { resolveSchemaPath } from './schema/schema-loader.js';

/** Environment variable name for version override */
const VERSION_ENV_VAR = 'FLUENTUI_VERSION';

/** Package version — read from a constant to avoid dynamic import of package.json */
const PACKAGE_VERSION = '1.0.0';

/**
 * Resolves the complete server configuration.
 *
 * Resolution order:
 * 1. Version from CLI arg, else `FLUENTUI_VERSION` env var, else default.
 * 2. Schema path via {@link resolveSchemaPath}: explicit `FLUENTUI_SCHEMA_PATH`
 *    env var → bundled `data/<version>/fluentui-schema-enhanced.json`.
 *
 * @returns Fully resolved server configuration.
 */
export function resolveConfig(): ServerConfig {
  const cliVersion = parseCliVersion();
  const envVersion = process.env[VERSION_ENV_VAR];
  const version = cliVersion || envVersion || DEFAULT_VERSION;

  const schemaPath = resolveSchemaPath({ version });

  const serverName = `fluentui-${version}-docs`;

  return {
    version,
    schemaPath,
    serverName,
    serverVersion: PACKAGE_VERSION,
  };
}

/**
 * Parse the version from CLI arguments.
 *
 * Expects the version as the first positional argument:
 * `fluentui-mcp v9` → "v9"
 * `fluentui-mcp` → null (use default)
 *
 * @returns The version string, or null if not provided.
 */
function parseCliVersion(): string | null {
  // process.argv: [node, script, ...args]
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return null;
  }

  const versionArg = args[0];

  // Skip if it looks like a flag (e.g., --help).
  if (versionArg.startsWith('-')) {
    return null;
  }

  return versionArg;
}
