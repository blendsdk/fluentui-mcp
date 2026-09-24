/**
 * Manifest for a generated skill tree.
 *
 * The manifest lets later tooling answer two questions without re-reading
 * every file:
 * - Was the tree generated from the current enhanced schema? (`schemaHash`)
 * - Which files changed since the last generation? (`files` hashes)
 *
 * Everything in the manifest is derived from the input, never from the wall
 * clock, so regenerating the same schema produces a byte-identical manifest.
 * That property is what makes the drift gate a plain byte comparison.
 *
 * @module skill/manifest
 */

import { createHash } from 'node:crypto';

import type { FluentUISchema } from '../../src/types/schema.js';
import type { SkillFile } from './mapping.js';

/** Version of the generator; bump when the output format changes. */
export const GENERATOR_VERSION = '1.1.0';

/** File name of the manifest, relative to the skill root. */
export const MANIFEST_FILE = '.fluentui-skill-manifest.json';

/** Machine-readable description of one generated tree. */
export interface SkillManifest {
  /** SHA-256 of the input schema used for this generation. */
  schemaHash: string;

  /** Generator version that produced the tree. */
  generatorVersion: string;

  /**
   * ISO 8601 timestamp copied from the input schema.
   *
   * Copying the schema's own timestamp (instead of the current time) keeps the
   * whole tree reproducible: the same input always yields the same manifest.
   */
  generatedAt: string;

  /** Map of relative file path to the SHA-256 of its content. */
  files: Record<string, string>;
}

/**
 * Hash a string with SHA-256 and return the lowercase hex digest.
 *
 * @param content - The text to hash.
 * @returns The 64-character hex digest.
 */
export function hashContent(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex');
}

/**
 * Hash the input schema.
 *
 * The schema is serialized with `JSON.stringify`, whose key order follows the
 * parsed object and is therefore stable for a given schema file.
 *
 * @param schema - The enhanced schema.
 * @returns The SHA-256 hex digest of the serialized schema.
 */
export function hashSchema(schema: FluentUISchema): string {
  return hashContent(JSON.stringify(schema));
}

/**
 * Build the manifest for a set of generated files.
 *
 * @param schema - The input schema.
 * @param files - The generated files, in mapping order.
 * @returns The manifest with per-file hashes.
 */
export function buildManifest(
  schema: FluentUISchema,
  files: readonly SkillFile[],
): SkillManifest {
  const fileHashes: Record<string, string> = {};
  for (const file of files) {
    fileHashes[file.path] = hashContent(file.content);
  }
  return {
    schemaHash: hashSchema(schema),
    generatorVersion: GENERATOR_VERSION,
    generatedAt: schema.generatedAt,
    files: fileHashes,
  };
}

/**
 * Serialize a manifest to stable, human-readable JSON.
 *
 * @param manifest - The manifest to serialize.
 * @returns Pretty-printed JSON with a trailing newline.
 */
export function serializeManifest(manifest: SkillManifest): string {
  return `${JSON.stringify(manifest, null, 2)}\n`;
}
