/**
 * Freshness gate.
 *
 * The manifest records a hash of the enhanced schema the tree was generated
 * from. If the schema on disk no longer hashes to that value, the committed
 * skill is stale and must be regenerated. This gate is cheap and runs locally
 * and in the publish workflow, not on every push.
 *
 * @module skill/check-freshness
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { isSchemaValid } from '../../src/schema/schema-validator.js';
import { hashSchema } from './manifest.js';

/** Outcome of a freshness check. */
export interface FreshnessResult {
  /** True when the manifest's schema hash matches the current schema. */
  ok: boolean;

  /** Hash of the schema currently on disk. */
  expected: string;

  /** Hash recorded in the manifest. */
  actual: string;
}

/** Default enhanced schema path, relative to the working directory. */
export const DEFAULT_FRESHNESS_SCHEMA = join(
  'data',
  'v9',
  'fluentui-schema-enhanced.json',
);

/** Default manifest path, relative to the working directory. */
export const DEFAULT_MANIFEST = join(
  '.agents',
  'skills',
  'fluentui',
  '.fluentui-skill-manifest.json',
);

/**
 * Compare the current schema hash with the manifest's recorded hash.
 *
 * @param options - Paths to the enhanced schema and the manifest.
 * @returns The comparison result.
 * @throws When either file is missing or is not valid JSON.
 */
export function checkFreshness(options: {
  schemaPath: string;
  manifestPath: string;
}): FreshnessResult {
  if (!existsSync(options.schemaPath)) {
    throw new Error(`Enhanced schema not found: ${options.schemaPath}`);
  }
  if (!existsSync(options.manifestPath)) {
    throw new Error(`Skill manifest not found: ${options.manifestPath}`);
  }

  const parsedSchema: unknown = JSON.parse(
    readFileSync(options.schemaPath, 'utf-8'),
  );
  if (!isSchemaValid(parsedSchema)) {
    throw new Error(`Enhanced schema failed validation: ${options.schemaPath}`);
  }

  const parsedManifest: unknown = JSON.parse(
    readFileSync(options.manifestPath, 'utf-8'),
  );
  const actual =
    typeof parsedManifest === 'object' &&
    parsedManifest !== null &&
    'schemaHash' in parsedManifest &&
    typeof (parsedManifest as { schemaHash: unknown }).schemaHash === 'string'
      ? (parsedManifest as { schemaHash: string }).schemaHash
      : '';

  return {
    ok: hashSchema(parsedSchema) === actual,
    expected: hashSchema(parsedSchema),
    actual,
  };
}

/**
 * Command-line entry point for the freshness gate.
 *
 * @param argv - Arguments after the script name.
 * @param cwd - Working directory used to resolve default paths.
 * @returns `0` when fresh, `1` when stale or on error.
 */
export function runFreshness(
  argv: readonly string[] = process.argv.slice(2),
  cwd: string = process.cwd(),
): number {
  let schemaPath = DEFAULT_FRESHNESS_SCHEMA;
  let manifestPath = DEFAULT_MANIFEST;

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--schema') {
      schemaPath = argv[++i] ?? schemaPath;
    } else if (argv[i] === '--manifest') {
      manifestPath = argv[++i] ?? manifestPath;
    }
  }

  try {
    const result = checkFreshness({
      schemaPath: join(cwd, schemaPath),
      manifestPath: join(cwd, manifestPath),
    });
    if (result.ok) {
      process.stdout.write('Skill is fresh.\n');
      return 0;
    }
    process.stderr.write(
      'Skill is stale: the enhanced schema changed since the last generation.\n' +
        'Regenerate with: node --import tsx scripts/skill/generate.ts\n',
    );
    return 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    return 1;
  }
}
