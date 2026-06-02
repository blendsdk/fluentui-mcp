/**
 * Tests for the schema loader.
 *
 * Covers path resolution priority (explicit path → env var → bundled default),
 * successful loading + parsing of fixture files, error handling for missing
 * files and malformed JSON, and strict-mode validation gating.
 *
 * @module tests/schema/schema-loader
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, dirname, isAbsolute } from 'path';
import { fileURLToPath } from 'url';

import {
  loadSchema,
  resolveSchemaPath,
} from '../../schema/schema-loader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** Absolute path to the bundled, well-formed minimal fixture. */
const MINIMAL_FIXTURE = join(__dirname, '..', 'fixtures', 'test-schema-minimal.json');

/** The env var the loader honors for path overrides. */
const SCHEMA_PATH_ENV_VAR = 'FLUENTUI_SCHEMA_PATH';

describe('resolveSchemaPath', () => {
  // Snapshot and restore the env var around each test so cases don't leak.
  let savedEnv: string | undefined;

  beforeEach(() => {
    savedEnv = process.env[SCHEMA_PATH_ENV_VAR];
    delete process.env[SCHEMA_PATH_ENV_VAR];
  });

  afterEach(() => {
    if (savedEnv === undefined) {
      delete process.env[SCHEMA_PATH_ENV_VAR];
    } else {
      process.env[SCHEMA_PATH_ENV_VAR] = savedEnv;
    }
  });

  it('should use an explicit absolute path as-is', () => {
    const resolved = resolveSchemaPath({ path: MINIMAL_FIXTURE });
    expect(resolved).toBe(MINIMAL_FIXTURE);
  });

  it('should resolve an explicit relative path to absolute', () => {
    const resolved = resolveSchemaPath({ path: 'some/relative/schema.json' });
    expect(isAbsolute(resolved)).toBe(true);
    expect(resolved.endsWith(join('some', 'relative', 'schema.json'))).toBe(true);
  });

  it('should prefer an explicit path over the env var', () => {
    process.env[SCHEMA_PATH_ENV_VAR] = '/env/path/schema.json';
    const resolved = resolveSchemaPath({ path: MINIMAL_FIXTURE });
    expect(resolved).toBe(MINIMAL_FIXTURE);
  });

  it('should use the env var when no explicit path is given', () => {
    process.env[SCHEMA_PATH_ENV_VAR] = MINIMAL_FIXTURE;
    const resolved = resolveSchemaPath({});
    expect(resolved).toBe(MINIMAL_FIXTURE);
  });

  it('should fall back to the bundled data path for a version', () => {
    const resolved = resolveSchemaPath({ version: 'v9' });
    expect(isAbsolute(resolved)).toBe(true);
    expect(resolved.endsWith(join('data', 'v9', 'fluentui-schema-enhanced.json'))).toBe(true);
  });

  it('should default to v9 when no version is provided', () => {
    const resolved = resolveSchemaPath({});
    expect(resolved.endsWith(join('data', 'v9', 'fluentui-schema-enhanced.json'))).toBe(true);
  });
});

describe('loadSchema', () => {
  it('should load and parse a valid minimal fixture', () => {
    const result = loadSchema({ path: MINIMAL_FIXTURE });
    expect(result.schema.schemaVersion).toBe('1.0');
    expect(result.schema.version).toBe('v9');
    expect(result.schema.components.length).toBeGreaterThan(0);
    expect(result.resolvedPath).toBe(MINIMAL_FIXTURE);
  });

  it('should return no validation errors for a valid fixture', () => {
    const result = loadSchema({ path: MINIMAL_FIXTURE });
    const blocking = result.validationErrors.filter((e) => e.severity === 'error');
    expect(blocking).toEqual([]);
  });

  it('should throw a helpful error when the file does not exist', () => {
    const missing = join(tmpdir(), 'definitely-not-here-12345.json');
    expect(() => loadSchema({ path: missing })).toThrow(/Schema file not found/i);
  });

  describe('with a temporary directory', () => {
    let tmpDir: string;

    beforeEach(() => {
      tmpDir = mkdtempSync(join(tmpdir(), 'schema-loader-test-'));
    });

    afterEach(() => {
      rmSync(tmpDir, { recursive: true, force: true });
    });

    it('should throw a parse error for malformed JSON', () => {
      const badFile = join(tmpDir, 'bad.json');
      writeFileSync(badFile, '{ this is not valid json ', 'utf-8');
      expect(() => loadSchema({ path: badFile })).toThrow(/Failed to parse schema file/i);
    });

    it('should surface validation errors without throwing in non-strict mode', () => {
      const invalidFile = join(tmpDir, 'invalid.json');
      // Missing schemaVersion and version → error-severity findings.
      writeFileSync(invalidFile, JSON.stringify({ components: [] }), 'utf-8');
      const result = loadSchema({ path: invalidFile });
      expect(result.validationErrors.some((e) => e.severity === 'error')).toBe(true);
    });

    it('should throw in strict mode when validation produces errors', () => {
      const invalidFile = join(tmpDir, 'invalid-strict.json');
      writeFileSync(invalidFile, JSON.stringify({ components: [] }), 'utf-8');
      expect(() => loadSchema({ path: invalidFile, strict: true })).toThrow(
        /Schema validation failed/i,
      );
    });

    it('should not throw in strict mode for a valid schema', () => {
      const validFile = join(tmpDir, 'valid-strict.json');
      const minimal = loadSchema({ path: MINIMAL_FIXTURE }).schema;
      writeFileSync(validFile, JSON.stringify(minimal), 'utf-8');
      expect(() => loadSchema({ path: validFile, strict: true })).not.toThrow();
    });
  });
});
