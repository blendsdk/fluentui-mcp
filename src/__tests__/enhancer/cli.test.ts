/**
 * Tests for the enhancer CLI.
 *
 * Covers argument parsing, option validation, path resolution, schema I/O
 * round-tripping, and the `--dry-run` pipeline (which prints a diff report
 * without calling the LLM or writing output).
 *
 * @module tests/enhancer/cli
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mkdtempSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  parseArgs,
  validateOptions,
  resolvePaths,
  readSchema,
  writeSchema,
  runEnhancer,
} from '../../../scripts/enhancer/cli.js';
import { createMinimalTestSchema } from '../fixtures/helpers.js';

// ============================================================================
// Argument Parsing
// ============================================================================

describe('parseArgs', () => {
  it('parses defaults when no flags are given', () => {
    const opts = parseArgs([]);
    expect(opts.version).toBe('');
    expect(opts.full).toBe(false);
    expect(opts.componentsOnly).toBe(false);
    expect(opts.guidesOnly).toBe(false);
    expect(opts.dryRun).toBe(false);
    expect(opts.concurrency).toBe(3);
    expect(opts.verbose).toBe(false);
  });

  it('parses flag-value pairs', () => {
    const opts = parseArgs([
      '--version',
      'v9',
      '--input',
      'in.json',
      '--output',
      'out.json',
      '--provider',
      'openai',
      '--model',
      'gpt-4o',
      '--concurrency',
      '5',
    ]);
    expect(opts.version).toBe('v9');
    expect(opts.input).toBe('in.json');
    expect(opts.output).toBe('out.json');
    expect(opts.provider).toBe('openai');
    expect(opts.model).toBe('gpt-4o');
    expect(opts.concurrency).toBe(5);
  });

  it('parses boolean flags', () => {
    const opts = parseArgs([
      '--version',
      'v9',
      '--full',
      '--components-only',
      '--guides-only',
      '--dry-run',
      '--verbose',
    ]);
    expect(opts.full).toBe(true);
    expect(opts.componentsOnly).toBe(true);
    expect(opts.guidesOnly).toBe(true);
    expect(opts.dryRun).toBe(true);
    expect(opts.verbose).toBe(true);
  });
});

// ============================================================================
// Validation
// ============================================================================

describe('validateOptions', () => {
  it('accepts a valid version', () => {
    const errors = validateOptions(parseArgs(['--version', 'v9']));
    expect(errors).toHaveLength(0);
  });

  it('accepts --input without --version', () => {
    const errors = validateOptions(parseArgs(['--input', 'raw.json']));
    expect(errors).toHaveLength(0);
  });

  it('requires --version or --input', () => {
    const errors = validateOptions(parseArgs([]));
    expect(errors.some((e) => e.includes('--version'))).toBe(true);
  });

  it('rejects both --components-only and --guides-only', () => {
    const errors = validateOptions(
      parseArgs(['--version', 'v9', '--components-only', '--guides-only']),
    );
    expect(errors.some((e) => e.includes('Cannot use both'))).toBe(true);
  });

  it('rejects a non-positive concurrency', () => {
    const errors = validateOptions(
      parseArgs(['--version', 'v9', '--concurrency', '0']),
    );
    expect(errors.some((e) => e.includes('--concurrency'))).toBe(true);
  });
});

// ============================================================================
// Path Resolution
// ============================================================================

describe('resolvePaths', () => {
  it('derives default paths from the version', () => {
    const { inputPath, outputPath } = resolvePaths(parseArgs(['--version', 'v9']));
    expect(inputPath).toContain('data/v9/fluentui-schema.json');
    expect(outputPath).toContain('data/v9/fluentui-schema-enhanced.json');
  });

  it('honours explicit --input and --output', () => {
    const { inputPath, outputPath } = resolvePaths(
      parseArgs(['--input', 'a/raw.json', '--output', 'b/enh.json']),
    );
    expect(inputPath).toContain('a/raw.json');
    expect(outputPath).toContain('b/enh.json');
  });
});

// ============================================================================
// Schema I/O
// ============================================================================

describe('schema I/O', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'enhancer-cli-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('round-trips a schema through write/read', () => {
    const schema = createMinimalTestSchema();
    const path = join(dir, 'nested', 'schema.json');
    writeSchema(path, schema);
    expect(existsSync(path)).toBe(true);

    const loaded = readSchema(path);
    expect(loaded.version).toBe(schema.version);
    expect(loaded.components).toHaveLength(schema.components.length);
  });
});

// ============================================================================
// Dry Run Pipeline
// ============================================================================

describe('runEnhancer — dry run', () => {
  let dir: string;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'enhancer-dry-'));
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
    rmSync(dir, { recursive: true, force: true });
  });

  it('prints a diff report and writes no output', async () => {
    const inputPath = join(dir, 'raw.json');
    const outputPath = join(dir, 'enhanced.json');
    writeFileSync(
      inputPath,
      JSON.stringify(createMinimalTestSchema(), null, 2),
      'utf-8',
    );

    await runEnhancer({
      version: 'v9',
      full: false,
      componentsOnly: false,
      guidesOnly: false,
      dryRun: true,
      input: inputPath,
      output: outputPath,
      concurrency: 3,
      verbose: false,
    });

    // No enhanced output written in dry-run mode.
    expect(existsSync(outputPath)).toBe(false);

    // The diff report was printed.
    const printed = logSpy.mock.calls.map((c) => String(c[0])).join('\n');
    expect(printed).toContain('FluentUI Enhancement Diff Report');
    expect(printed).toContain('dry run');
  });
});
