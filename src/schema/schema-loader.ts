/**
 * Schema loading for the FluentUI Enhanced Schema format.
 *
 * Loads the pre-built, LLM-enhanced JSON schema from disk and parses it into a
 * typed {@link FluentUISchema}. Path resolution supports three sources, tried in
 * priority order:
 *
 * 1. An explicit path passed to {@link loadSchema} (e.g. a custom file).
 * 2. The `FLUENTUI_SCHEMA_PATH` environment variable.
 * 3. The bundled location `data/<version>/fluentui-schema-enhanced.json`.
 *
 * Loading is deliberately strict about I/O and JSON parsing (these throw) but
 * delegates *content* validation to {@link validateSchema}, which is lenient.
 * This separation lets the MCP server decide whether to load partial data on
 * validation warnings while still failing fast on a missing or corrupt file.
 *
 * @module schema/schema-loader
 */

import { existsSync, readFileSync } from 'fs';
import { dirname, isAbsolute, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import type { FluentUISchema } from '../types/index.js';
import { DEFAULT_VERSION } from '../types/index.js';
import { validateSchema } from './schema-validator.js';
import type { ValidationError } from './schema-validator.js';

/**
 * Resolve the directory of this compiled module (dist/schema/ at runtime).
 * Used to locate the bundled `data/` folder relative to the package root.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Package root, two levels up from `dist/schema/`.
 * The bundled `data/` directory lives directly under this root.
 */
const PACKAGE_ROOT = join(__dirname, '..', '..');

/** Environment variable that, when set, overrides all other schema path resolution. */
const SCHEMA_PATH_ENV_VAR = 'FLUENTUI_SCHEMA_PATH';

/** File name of the enhanced schema bundled under `data/<version>/`. */
const ENHANCED_SCHEMA_FILENAME = 'fluentui-schema-enhanced.json';

/**
 * Options accepted by {@link loadSchema}.
 * All fields are optional; defaults reproduce the production resolution order.
 */
export interface LoadSchemaOptions {
  /** FluentUI version to load (e.g. `'v9'`). Defaults to {@link DEFAULT_VERSION}. */
  version?: string;

  /**
   * Explicit path to a schema file. When provided it takes priority over the
   * environment variable and bundled location. Relative paths resolve against CWD.
   */
  path?: string;

  /**
   * When true, throw if validation produces any `error`-severity findings.
   * When false (default), validation findings are returned but not thrown,
   * letting the caller decide how to handle partial data.
   */
  strict?: boolean;
}

/**
 * The result of loading a schema: the parsed schema plus any validation findings
 * and the absolute path it was loaded from (useful for logging and `reindex`).
 */
export interface LoadSchemaResult {
  /** The parsed schema object. */
  schema: FluentUISchema;

  /** Validation findings (may be empty). Errors are blocking, warnings advisory. */
  validationErrors: ValidationError[];

  /** Absolute filesystem path the schema was read from. */
  resolvedPath: string;
}

/**
 * Resolve the absolute path to the schema file using the documented priority:
 * explicit path → env var → bundled `data/<version>/` location.
 *
 * This does not check that the file exists — it only computes where to look.
 * Use {@link existsSync} (or rely on {@link loadSchema}) to confirm presence.
 *
 * @param options - Version and/or explicit path overrides.
 * @returns The absolute path the loader will attempt to read.
 */
export function resolveSchemaPath(options: LoadSchemaOptions = {}): string {
  // Priority 1: an explicit path argument (relative resolved against CWD).
  if (options.path) {
    return isAbsolute(options.path) ? options.path : resolve(options.path);
  }

  // Priority 2: the environment variable override.
  const envPath = process.env[SCHEMA_PATH_ENV_VAR];
  if (envPath) {
    return isAbsolute(envPath) ? envPath : resolve(envPath);
  }

  // Priority 3: the bundled location for the requested version.
  const version = options.version ?? DEFAULT_VERSION;
  return join(PACKAGE_ROOT, 'data', version, ENHANCED_SCHEMA_FILENAME);
}

/**
 * Load and parse a schema from disk, returning the schema plus validation info.
 *
 * Throws when the file cannot be found or the contents are not valid JSON, since
 * those are unrecoverable I/O errors. Content validation, by contrast, is
 * surfaced via {@link LoadSchemaResult.validationErrors} unless `strict` is set.
 *
 * @param options - Version, explicit path, and strictness controls.
 * @returns The parsed schema, validation findings, and the resolved path.
 * @throws Error when the file is missing, unreadable, or contains invalid JSON,
 *   or (when `strict`) when validation produces error-severity findings.
 */
export function loadSchema(options: LoadSchemaOptions = {}): LoadSchemaResult {
  const resolvedPath = resolveSchemaPath(options);

  // Fail fast on a missing file — there is nothing to load.
  if (!existsSync(resolvedPath)) {
    throw new Error(
      `Schema file not found: ${resolvedPath}\n` +
        `Resolution order: explicit path → ${SCHEMA_PATH_ENV_VAR} env var → ` +
        `data/<version>/${ENHANCED_SCHEMA_FILENAME}`,
    );
  }

  // Read and parse. JSON.parse throws on malformed content; wrap for context.
  let parsed: unknown;
  try {
    const raw = readFileSync(resolvedPath, 'utf-8');
    parsed = JSON.parse(raw);
  } catch (cause) {
    const reason = cause instanceof Error ? cause.message : String(cause);
    throw new Error(`Failed to parse schema file ${resolvedPath}: ${reason}`);
  }

  const validationErrors = validateSchema(parsed);

  // In strict mode, treat error-severity findings as fatal.
  if (options.strict) {
    const blocking = validationErrors.filter((e) => e.severity === 'error');
    if (blocking.length > 0) {
      const summary = blocking.map((e) => `  - ${e.path}: ${e.message}`).join('\n');
      throw new Error(
        `Schema validation failed for ${resolvedPath} (${blocking.length} error(s)):\n${summary}`,
      );
    }
  }

  // The cast is safe here: structural problems are reported in validationErrors,
  // and the caller is expected to honor them (or use strict mode).
  return {
    schema: parsed as FluentUISchema,
    validationErrors,
    resolvedPath,
  };
}
