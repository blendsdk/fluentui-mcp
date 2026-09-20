/**
 * CLI entry point for the FluentUI scraper.
 *
 * Parses command-line arguments, validates options, orchestrates the
 * scraping pipeline (discover → extract → write), and reports results.
 *
 * Usage:
 *   npm run scrape -- --version v9 --source /path/to/fluentui
 *   npm run scrape -- --version v9 --source /path/to/fluentui --contrib /path/to/contrib
 *   npm run scrape -- --version v9 --source /path/to/fluentui --output data/v9/schema.json
 *
 * @module scraper/cli
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { getVersionConfig } from './config.js';
import { cloneRepo } from './clone.js';
import { createAdapter } from './adapters/factory.js';
import { resolveLatestStableTagFromRemote } from './git-ref.js';
import { scrape } from './pipeline.js';

import type { ScraperCliOptions } from './types.js';

// Re-exported so tests and other callers can build adapters without reaching
// into the adapters directory.
export { createAdapter };

// ============================================================================
// Argument Parsing
// ============================================================================

/**
 * Parse CLI arguments into typed ScraperCliOptions.
 *
 * Handles flag-value pairs (--version v9) and boolean flags (--verbose).
 *
 * @param args - Raw CLI arguments (typically process.argv.slice(2))
 * @returns Parsed options object
 */
export function parseArgs(args: string[]): ScraperCliOptions {
  const options: ScraperCliOptions = {
    version: '',
    clone: false,
    reuse: false,
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
      case '--source':
        options.source = next;
        i++;
        break;
      case '--contrib':
        options.contrib = next;
        i++;
        break;
      case '--clone':
        options.clone = true;
        break;
      case '--ref':
        options.ref = next;
        i++;
        break;
      case '--contrib-ref':
        options.contribRef = next;
        i++;
        break;
      case '--reuse':
        options.reuse = true;
        break;
      case '--output':
        options.output = next;
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
export function validateOptions(options: ScraperCliOptions): string[] {
  const errors: string[] = [];

  if (!options.version) {
    errors.push('--version is required (e.g., v9)');
  }

  if (!options.source && !options.clone) {
    errors.push('Either --source <path> or --clone is required');
  }

  if (options.source && options.clone) {
    errors.push('Cannot use both --source and --clone');
  }

  return errors;
}

// ============================================================================
// Pipeline Runner
// ============================================================================

/**
 * Run the full scraper pipeline and write the schema to disk.
 *
 * Resolves the source (cloning when requested), delegates the discovery and
 * extraction work to {@link scrape}, writes the resulting schema, and logs a
 * summary. User-supplied source paths are checked against the current working
 * directory so a traversal value is rejected.
 *
 * @param options - Validated CLI options
 * @throws Error when no source is discoverable or the source path is unsafe
 */
export function runScraper(options: ScraperCliOptions): void {
  const config = getVersionConfig(options.version);

  // Resolve the source path. With --clone we shallow-clone the FluentUI repo
  // (cached under .cache/) and treat the result like a --source checkout.
  // With --source we pass the provided local path through to the pipeline.
  // Pin the clone to the newest stable release tag unless the caller named a
  // ref explicitly. Cloning at the tag keeps the recorded ref and the checkout
  // commit aligned.
  const pinnedRef =
    options.ref ??
    (options.clone
      ? resolveLatestStableTagFromRemote(config.fluentui.repo) ?? undefined
      : undefined);

  let source: string;
  let contrib: string | undefined;
  if (options.clone) {
    source = cloneRepo({
      repo: config.fluentui,
      dirName: `fluentui-${config.version}`,
      ref: pinnedRef,
      reuse: options.reuse,
      verbose: options.verbose,
    });
    // Clone the contrib repo too when a contrib ref is explicitly requested.
    if (options.contribRef) {
      contrib = cloneRepo({
        repo: config.contrib,
        dirName: `fluentui-contrib-${config.version}`,
        ref: options.contribRef,
        reuse: options.reuse,
        verbose: options.verbose,
      });
    }
  } else {
    source = options.source!;
    contrib = options.contrib;
  }

  if (options.verbose) {
    console.log(`Scraping FluentUI ${config.version} from ${source}`);
  }

  // Only pass an explicit ref through. When none was given, the pipeline
  // derives the ref from the actual checkout, so a reused cache cannot record
  // a ref that differs from its commit.
  const { schema, coverage } = scrape({
    version: options.version,
    source,
    contrib,
    fluentuiRef: options.ref,
    contribRef: options.contribRef,
    allowedRoot: process.cwd(),
  });

  if (schema.components.length === 0 && schema.utilities.length === 0) {
    throw new Error(
      'No components or utilities discovered. Check --source path and version config.',
    );
  }

  const outputPath = resolve(
    options.output ?? `data/${config.version}/fluentui-schema.json`,
  );
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(schema, null, 2), 'utf-8');

  if (options.verbose) {
    console.log(`Discovered ${coverage.scraped.length} components`);
    for (const entry of coverage.scraped) {
      console.log(`  ✓ ${entry.name}`);
    }
    for (const entry of coverage.excluded) {
      console.log(`  – ${entry.dirName}: ${entry.reason}`);
    }
  }

  console.log('\nScraping complete!');
  console.log(`  Components: ${schema.stats.totalComponents}`);
  console.log(`  Utilities:  ${schema.stats.totalUtilities}`);
  console.log(`  Props:      ${schema.stats.totalProps}`);
  console.log(`  Stories:    ${schema.stats.totalStories}`);
  console.log(
    `  Coverage:   ${coverage.scraped.length} scraped, ` +
      `${coverage.excluded.length} excluded`,
  );
  console.log(`  Output:     ${outputPath}`);
}

// ============================================================================
// Entry Point
// ============================================================================

/**
 * Main entry point for the scraper CLI.
 *
 * Called when running: npm run scrape -- --version v9 --source /path/to/fluentui
 */
function main(): void {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  const errors = validateOptions(options);

  if (errors.length > 0) {
    console.error('Error(s):');
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    console.error(
      '\nUsage: npm run scrape -- --version v9 --source /path/to/fluentui',
    );
    process.exit(1);
  }

  try {
    runScraper(options);
  } catch (err) {
    console.error(
      'Scraper failed:',
      err instanceof Error ? err.message : err,
    );
    process.exit(1);
  }
}

// Only run when executed directly (not when imported by tests)
const isDirectRun =
  process.argv[1]?.endsWith('cli.ts') ||
  process.argv[1]?.endsWith('cli.js');

if (isDirectRun) {
  main();
}
