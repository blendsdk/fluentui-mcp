/**
 * Integration test for the complete scraper pipeline.
 *
 * Runs the full pipeline: discovery → classification → extraction → output
 * against the mock FluentUI fixture directory and validates the resulting
 * FluentUISchema structure.
 *
 * @module tests/integration/scraper-pipeline
 */

import { describe, it, expect, afterAll } from 'vitest';
import { resolve, join } from 'node:path';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

import { discoverPackages } from '../../../scripts/scraper/discover.js';
import { getVersionConfig } from '../../../scripts/scraper/config.js';
import { V9Adapter } from '../../../scripts/scraper/adapters/v9-adapter.js';
import { writeSchema } from '../../../scripts/scraper/output.js';
import { computeStats } from '../../../scripts/scraper/output.js';
import {
  parseArgs,
  validateOptions,
  createAdapter,
} from '../../../scripts/scraper/cli.js';
import type { FluentUISchema, ComponentEntry, UtilityEntry } from '../../types/schema.js';

// ============================================================================
// Test Fixtures
// ============================================================================

/** Root of the mock FluentUI monorepo fixture */
const MOCK_ROOT = resolve(
  __dirname,
  '../fixtures/mock-fluentui',
);

/** Temporary output directory for integration test artifacts */
const TEST_OUTPUT_DIR = join(tmpdir(), 'fluentui-mcp-test-integration');
const TEST_OUTPUT_PATH = join(TEST_OUTPUT_DIR, 'test-schema.json');

// Clean up temporary files after all tests
afterAll(() => {
  if (existsSync(TEST_OUTPUT_DIR)) {
    rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
  }
});

// ============================================================================
// CLI Parsing Tests
// ============================================================================

describe('CLI argument parsing', () => {
  it('should parse all flags correctly', () => {
    const args = [
      '--version', 'v9',
      '--source', '/path/to/fluentui',
      '--contrib', '/path/to/contrib',
      '--ref', 'main',
      '--contrib-ref', 'develop',
      '--output', 'out.json',
      '--verbose',
    ];
    const options = parseArgs(args);

    expect(options.version).toBe('v9');
    expect(options.source).toBe('/path/to/fluentui');
    expect(options.contrib).toBe('/path/to/contrib');
    expect(options.ref).toBe('main');
    expect(options.contribRef).toBe('develop');
    expect(options.output).toBe('out.json');
    expect(options.verbose).toBe(true);
    expect(options.clone).toBe(false);
  });

  it('should parse boolean flags', () => {
    const options = parseArgs(['--version', 'v9', '--clone', '--reuse']);
    expect(options.clone).toBe(true);
    expect(options.reuse).toBe(true);
  });

  it('should return defaults for missing flags', () => {
    const options = parseArgs([]);
    expect(options.version).toBe('');
    expect(options.clone).toBe(false);
    expect(options.verbose).toBe(false);
  });
});

describe('CLI validation', () => {
  it('should require --version', () => {
    const errors = validateOptions(parseArgs(['--source', '/tmp']));
    expect(errors.some((e) => e.includes('--version'))).toBe(true);
  });

  it('should require --source or --clone', () => {
    const errors = validateOptions(parseArgs(['--version', 'v9']));
    expect(errors.some((e) => e.includes('--source'))).toBe(true);
  });

  it('should reject both --source and --clone', () => {
    const errors = validateOptions(
      parseArgs(['--version', 'v9', '--source', '/tmp', '--clone']),
    );
    expect(errors.some((e) => e.includes('Cannot use both'))).toBe(true);
  });

  it('should pass valid options', () => {
    const errors = validateOptions(
      parseArgs(['--version', 'v9', '--source', '/tmp']),
    );
    expect(errors).toHaveLength(0);
  });
});

describe('Adapter factory', () => {
  it('should create V9Adapter for v9', () => {
    const adapter = createAdapter('v9');
    expect(adapter).toBeInstanceOf(V9Adapter);
  });

  it('should throw for v8 (deferred)', () => {
    expect(() => createAdapter('v8')).toThrow('not yet implemented');
  });

  it('should throw for unknown adapter type', () => {
    expect(() => createAdapter('v99')).toThrow('Unknown adapter');
  });
});

// ============================================================================
// Full Pipeline Integration Test
// ============================================================================

describe('Scraper pipeline integration', () => {
  /** Components extracted by the pipeline */
  let components: ComponentEntry[];
  /** Schema written by the pipeline */
  let schema: FluentUISchema;

  it('should discover packages from mock directory', () => {
    const config = getVersionConfig('v9');
    const packages = discoverPackages(MOCK_ROOT, config);

    // Should find react-button, react-dialog, react-input (not react-components)
    expect(packages.length).toBe(3);
    const dirNames = packages.map((p) => p.dirName);
    expect(dirNames).toContain('react-button');
    expect(dirNames).toContain('react-dialog');
    expect(dirNames).toContain('react-input');
  });

  it('should extract all components from mock packages', () => {
    const config = getVersionConfig('v9');
    const packages = discoverPackages(MOCK_ROOT, config);
    const adapter = new V9Adapter();

    components = packages
      .filter((pkg) => pkg.type === 'component')
      .map((pkg) => adapter.extractComponent(pkg))
      .filter((entry): entry is ComponentEntry => entry !== null);

    expect(components.length).toBe(3);
    const names = components.map((c) => c.name);
    expect(names).toContain('Button');
    expect(names).toContain('Dialog');
    expect(names).toContain('Input');
  });

  it('should produce valid ComponentEntry structure', () => {
    const button = components.find((c) => c.name === 'Button')!;

    // Required fields present
    expect(button.id).toBe('button');
    expect(button.packageName).toBe('@fluentui/react-button');
    expect(button.importPath).toBe('@fluentui/react-components');
    expect(button.category).toBe('buttons');
    expect(button.stability).toBe('stable');
    expect(button.deprecated).toBe(false);
    expect(button.relatedComponents).toEqual([]);
    expect(button.additionalExports).toEqual([]);

    // Extracted data present
    expect(button.props.length).toBeGreaterThan(0);
    expect(button.slots.length).toBeGreaterThan(0);
    expect(button.stories.length).toBeGreaterThan(0);
  });

  it('should compute correct statistics', () => {
    const utilities: UtilityEntry[] = [];
    const stats = computeStats(components, utilities);

    expect(stats.totalComponents).toBe(3);
    expect(stats.totalUtilities).toBe(0);
    expect(stats.totalProps).toBeGreaterThan(0);
    expect(stats.totalStories).toBeGreaterThan(0);
    expect(stats.categoryCounts['buttons']).toBe(1);
    expect(stats.categoryCounts['forms']).toBe(1);
    expect(stats.categoryCounts['feedback']).toBe(1);
  });

  it('should write valid schema JSON to disk', () => {
    // Ensure clean output directory
    if (existsSync(TEST_OUTPUT_DIR)) {
      rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    }

    schema = writeSchema({
      version: 'v9',
      outputPath: TEST_OUTPUT_PATH,
      components,
      utilities: [],
      sources: {
        fluentui: {
          repo: 'https://github.com/microsoft/fluentui.git',
          ref: 'master',
          commit: 'test-commit-hash',
          scrapedAt: new Date().toISOString(),
        },
      },
    });

    // File should exist
    expect(existsSync(TEST_OUTPUT_PATH)).toBe(true);

    // File should be valid JSON
    const content = readFileSync(TEST_OUTPUT_PATH, 'utf-8');
    const parsed = JSON.parse(content) as FluentUISchema;

    expect(parsed.schemaVersion).toBe('1.0');
    expect(parsed.version).toBe('v9');
    expect(parsed.components.length).toBe(3);
    expect(parsed.utilities.length).toBe(0);
    expect(parsed.foundation).toEqual([]);
    expect(parsed.patterns).toEqual([]);
    expect(parsed.enterprise).toEqual([]);
    expect(parsed.quickReference).toEqual([]);
  });

  it('should include source info in schema', () => {
    expect(schema.sources.fluentui.repo).toContain('fluentui.git');
    expect(schema.sources.fluentui.ref).toBe('master');
    expect(schema.sources.fluentui.commit).toBe('test-commit-hash');
    expect(schema.generatedAt).toBeDefined();
  });

  it('should include stats in schema', () => {
    expect(schema.stats.totalComponents).toBe(3);
    expect(schema.stats.totalProps).toBeGreaterThan(0);
    expect(schema.stats.totalStories).toBeGreaterThan(0);
  });
});
