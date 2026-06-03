/**
 * CLI entry point for the FluentUI enhancer.
 *
 * Parses command-line arguments, loads the raw schema (and the previous
 * enhanced schema when present), and orchestrates the two-pass enhancement
 * pipeline (Pass 1: components/utilities, Pass 2: guides). Supports a
 * `--dry-run` mode that prints the diff report without calling the LLM.
 *
 * Usage:
 *   yarn enhance --version v9
 *   yarn enhance --version v9 --full
 *   yarn enhance --version v9 --components-only
 *   yarn enhance --version v9 --guides-only
 *   yarn enhance --version v9 --dry-run
 *   yarn enhance --input data/v9/fluentui-schema.json \
 *                --output data/v9/fluentui-schema-enhanced.json
 *
 * @module enhancer/cli
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import type { FluentUISchema } from '../../src/types/schema.js';
import { validateSchema } from '../../src/schema/schema-validator.js';
import type { EnhancerCliOptions } from './types.js';
import { diffSchemas, formatDiffReport } from './diff.js';

import { computeComponentHash, computeUtilityHash } from './hasher.js';
import { resolveEnhancerConfig } from './config.js';
import { runEnhancement } from './enhancer.js';
import { createProviderFromEnv } from './llm/index.js';

// ============================================================================
// Argument Parsing
// ============================================================================

/**
 * Parse CLI arguments into typed {@link EnhancerCliOptions}.
 *
 * Handles flag-value pairs (--version v9) and boolean flags (--full).
 *
 * @param args - Raw CLI arguments (typically process.argv.slice(2))
 * @returns Parsed options object
 */
export function parseArgs(args: string[]): EnhancerCliOptions {
  const options: EnhancerCliOptions = {
    version: '',
    full: false,
    componentsOnly: false,
    guidesOnly: false,
    dryRun: false,
    concurrency: 3,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--version':
        options.version = next ?? '';
        i++;
        break;
      case '--full':
        options.full = true;
        break;
      case '--components-only':
        options.componentsOnly = true;
        break;
      case '--guides-only':
        options.guidesOnly = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--input':
        options.input = next;
        i++;
        break;
      case '--output':
        options.output = next;
        i++;
        break;
      case '--provider':
        options.provider = next;
        i++;
        break;
      case '--model':
        options.model = next;
        i++;
        break;
      case '--concurrency':
        options.concurrency = next ? Number.parseInt(next, 10) : 3;
        i++;
        break;
      case '--verbose':
        options.verbose = true;
        break;
    }
  }

  return options;
}

/**
 * Validate parsed CLI options and return any error messages.
 *
 * @param options - Parsed CLI options
 * @returns Array of error messages (empty if valid)
 */
export function validateOptions(options: EnhancerCliOptions): string[] {
  const errors: string[] = [];

  if (!options.version && !options.input) {
    errors.push('--version is required (e.g., v9), or pass --input <path>');
  }

  if (options.componentsOnly && options.guidesOnly) {
    errors.push('Cannot use both --components-only and --guides-only');
  }

  if (
    Number.isNaN(options.concurrency) ||
    options.concurrency < 1
  ) {
    errors.push('--concurrency must be a positive integer');
  }

  return errors;
}

// ============================================================================
// Path Resolution
// ============================================================================

/**
 * Resolve the input (raw) and output (enhanced) schema paths from options.
 *
 * Defaults follow the convention `data/<version>/fluentui-schema.json` for
 * input and `data/<version>/fluentui-schema-enhanced.json` for output.
 *
 * @param options - Parsed CLI options
 * @returns Absolute input and output paths
 */
export function resolvePaths(options: EnhancerCliOptions): {
  inputPath: string;
  outputPath: string;
} {
  const inputPath = resolve(
    options.input ?? `data/${options.version}/fluentui-schema.json`,
  );
  const outputPath = resolve(
    options.output ??
      `data/${options.version}/fluentui-schema-enhanced.json`,
  );
  return { inputPath, outputPath };
}

// ============================================================================
// Schema I/O
// ============================================================================

/**
 * Read and parse a FluentUI schema JSON file.
 *
 * @param path - Absolute path to the schema file
 * @returns The parsed schema
 * @throws Error when the file is missing or invalid JSON
 */
export function readSchema(path: string): FluentUISchema {
  const raw = readFileSync(path, 'utf-8');
  return JSON.parse(raw) as FluentUISchema;
}

/**
 * Write a FluentUI schema as pretty-printed JSON, creating directories as
 * needed.
 *
 * @param path - Absolute output path
 * @param schema - The schema to write
 */
export function writeSchema(path: string, schema: FluentUISchema): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(schema, null, 2), 'utf-8');
}

/**
 * Build a hash index for a previous enhanced schema, used by the diff engine
 * to detect unchanged entries.
 *
 * @param schema - The previous enhanced schema (or null)
 * @returns A hash index, or null when there is no previous schema
 */
function buildPreviousHashIndex(
  schema: FluentUISchema | null,
): Record<string, string> | null {
  if (!schema) return null;
  const index: Record<string, string> = {};
  for (const c of schema.components) index[c.id] = computeComponentHash(c);
  for (const u of schema.utilities) index[u.id] = computeUtilityHash(u);
  return index;
}

// ============================================================================
// Pipeline Runner
// ============================================================================

/**
 * Run the enhancer pipeline for the given options.
 *
 * @param options - Validated CLI options
 */
export async function runEnhancer(options: EnhancerCliOptions): Promise<void> {
  const { inputPath, outputPath } = resolvePaths(options);

  if (!existsSync(inputPath)) {
    console.error(`Raw schema not found: ${inputPath}`);
    console.error('Run `yarn scrape --version <v>` first to generate it.');
    process.exit(1);
  }

  const rawSchema = readSchema(inputPath);
  const version = options.version || rawSchema.version;

  // Load the previous enhanced schema for incremental diffing (unless --full).
  const previousSchema =
    !options.full && existsSync(outputPath) ? readSchema(outputPath) : null;

  if (options.verbose) {
    console.error(`[enhancer] input:  ${inputPath}`);
    console.error(`[enhancer] output: ${outputPath}`);
    console.error(
      `[enhancer] previous enhanced schema: ${
        previousSchema ? 'loaded' : 'none (first run)'
      }`,
    );
  }

  // --------------------------------------------------------------------------
  // Dry run: print the diff report and exit without calling the LLM.
  // --------------------------------------------------------------------------
  if (options.dryRun) {
    const diff = diffSchemas(
      rawSchema,
      previousSchema,
      buildPreviousHashIndex(previousSchema),
    );
    console.log(formatDiffReport(diff, version));
    console.log('\n(dry run — no LLM calls made, no output written)');
    return;
  }

  // --------------------------------------------------------------------------
  // Resolve config. --components-only / --guides-only narrow the passes.
  // --------------------------------------------------------------------------
  const config = resolveEnhancerConfig({
    version,
    full: options.full,
    enhanceComponents: !options.guidesOnly,
    generateGuides: !options.componentsOnly,
    concurrency: options.concurrency,
    verbose: options.verbose,
  });

  // Construct the LLM provider from --provider/--model or environment.
  const provider = await createProviderFromEnv({
    provider: options.provider,
    model: options.model,
  });

  if (options.verbose) {
    console.error(`[enhancer] provider: ${provider.name}`);
  }

  const { schema, stats } = await runEnhancement(
    rawSchema,
    previousSchema,
    provider,
    config,
  );

  writeSchema(outputPath, schema);

  // Validate the freshly written schema so a `--full` run that produces a
  // structurally invalid output is surfaced immediately (errors block;
  // warnings are advisory). This makes "validate output: 0 errors" automatic.
  const findings = validateSchema(schema);
  const validationErrors = findings.filter((f) => f.severity === 'error');
  const validationWarnings = findings.filter((f) => f.severity === 'warning');

  // Report results.
  console.log('\nEnhancement complete!');
  console.log(`  Components enhanced:        ${stats.componentsEnhanced}`);
  console.log(`  Components carried forward: ${stats.componentsCarriedForward}`);
  console.log(`  Utilities enhanced:         ${stats.utilitiesEnhanced}`);
  console.log(`  Utilities carried forward:  ${stats.utilitiesCarriedForward}`);
  console.log(`  Guides generated:           ${stats.guidesGenerated}`);
  console.log(`  Patterns generated:         ${stats.patternsGenerated}`);
  console.log(`  Failures:                   ${stats.failures}`);
  console.log(`  Validation errors:          ${validationErrors.length}`);
  console.log(`  Validation warnings:        ${validationWarnings.length}`);
  console.log(`  Output:                     ${outputPath}`);

  // Surface the first handful of findings so they are actionable without a
  // separate validation run.
  for (const finding of [...validationErrors, ...validationWarnings].slice(0, 10)) {
    const tag = finding.severity === 'error' ? 'ERROR' : 'warn';
    console.error(`  [${tag}] ${finding.path}: ${finding.message}`);
  }

  // A structurally invalid output is a hard failure — the bundled schema must
  // always load cleanly.
  if (validationErrors.length > 0) {
    console.error(
      `\nOutput failed schema validation with ${validationErrors.length} error(s).`,
    );
    process.exit(1);
  }
}


// ============================================================================
// Entry Point
// ============================================================================

/**
 * Main entry point for the enhancer CLI.
 *
 * Called when running: yarn enhance --version v9
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  const errors = validateOptions(options);

  if (errors.length > 0) {
    console.error('Error(s):');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    console.error('\nUsage: yarn enhance --version v9 [--full] [--dry-run]');
    process.exit(1);
  }

  try {
    await runEnhancer(options);
  } catch (err) {
    console.error(
      'Enhancer failed:',
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  }
}

// Only run when executed directly (not when imported by tests).
const isDirectRun =
  process.argv[1]?.endsWith('cli.ts') ||
  process.argv[1]?.endsWith('cli.js');

if (isDirectRun) {
  void main();
}
