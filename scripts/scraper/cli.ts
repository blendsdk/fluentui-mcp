/**
 * CLI entry point for the FluentUI scraper.
 *
 * Parses command-line arguments, validates options, orchestrates the
 * scraping pipeline (discover → extract → write), and reports results.
 *
 * Usage:
 *   yarn scrape --version v9 --source /path/to/fluentui
 *   yarn scrape --version v9 --source /path/to/fluentui --contrib /path/to/contrib
 *   yarn scrape --version v9 --source /path/to/fluentui --output data/v9/schema.json
 *
 * @module scraper/cli
 */

import { resolve } from 'node:path';

import { getVersionConfig } from './config.js';
import { cloneRepo, resolveCommit } from './clone.js';
import { discoverPackages, discoverContribPackages } from './discover.js';
import { V9Adapter } from './adapters/v9-adapter.js';
import { writeSchema } from './output.js';

import type { ScraperCliOptions, DiscoveredPackage } from './types.js';
import type {
  ComponentEntry,
  UtilityEntry,
  SourceInfo,
} from '../../src/types/schema.js';
import type { ScraperAdapter } from './adapters/adapter.js';

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
// Adapter Factory
// ============================================================================

/**
 * Create the appropriate scraper adapter for a version config.
 *
 * @param adapterType - Adapter type from version config ('v9', 'v8')
 * @returns Instantiated scraper adapter
 * @throws Error if the adapter type is unsupported
 */
export function createAdapter(adapterType: string): ScraperAdapter {
  switch (adapterType) {
    case 'v9':
      return new V9Adapter();
    case 'v8':
      throw new Error(
        'V8 adapter is not yet implemented (deferred to future phase)',
      );
    default:
      throw new Error(`Unknown adapter type: '${adapterType}'`);
  }
}

// ============================================================================
// Pipeline Runner
// ============================================================================

/**
 * Run the full scraper pipeline: discover → extract → write.
 *
 * @param options - Validated CLI options
 */
export function runScraper(options: ScraperCliOptions): void {
  const config = getVersionConfig(options.version);

  // Resolve the source path. With --clone we shallow-clone the FluentUI repo
  // (cached under .cache/) and treat the result like a --source checkout.
  // With --source we use the provided local path directly.
  let sourcePath: string;
  let contribPath: string | undefined;
  if (options.clone) {
    sourcePath = cloneRepo({
      repo: config.fluentui,
      dirName: `fluentui-${config.version}`,
      ref: options.ref,
      reuse: options.reuse,
      verbose: options.verbose,
    });
    // Clone the contrib repo too when a contrib ref is explicitly requested.
    if (options.contribRef) {
      contribPath = cloneRepo({
        repo: config.contrib,
        dirName: `fluentui-contrib-${config.version}`,
        ref: options.contribRef,
        reuse: options.reuse,
        verbose: options.verbose,
      });
    }

  } else {
    sourcePath = resolve(options.source!);
    contribPath = options.contrib ? resolve(options.contrib) : undefined;
  }

  const outputPath =
    options.output ?? `data/${config.version}/fluentui-schema.json`;

  if (options.verbose) {
    console.log(`Scraping FluentUI ${config.version} from ${sourcePath}`);
  }


  // Step 1: Discover packages in the main repo
  const packages = discoverPackages(sourcePath, config);
  if (options.verbose) {
    console.log(`Discovered ${packages.length} packages`);
  }

  // Step 1b: Discover contrib packages (optional)
  let contribPackages: DiscoveredPackage[] = [];
  if (contribPath) {
    contribPackages = discoverContribPackages(contribPath);
    if (options.verbose) {
      console.log(`Discovered ${contribPackages.length} contrib packages`);
    }
  }


  const allPackages = [...packages, ...contribPackages];

  if (allPackages.length === 0) {
    console.error(
      'No packages discovered. Check --source path and version config.',
    );
    process.exit(1);
  }

  // Step 2: Create the version-specific adapter
  const adapter = createAdapter(config.adapter);

  // Step 3: Extract components and utilities
  const components: ComponentEntry[] = [];
  const utilities: UtilityEntry[] = [];

  for (const pkg of allPackages) {
    if (pkg.type === 'component') {
      const entry = adapter.extractComponent(pkg);
      if (entry) {
        components.push(entry);
        if (options.verbose) {
          console.log(
            `  ✓ ${entry.name} (${entry.props.length} props, ${entry.stories.length} stories)`,
          );
        }
      }
    } else if (pkg.type === 'utility') {
      const entry = adapter.extractUtility(pkg);
      if (entry) {
        utilities.push(entry);
        if (options.verbose) {
          console.log(
            `  ✓ ${entry.name} utility (${entry.exports.length} exports)`,
          );
        }
      }
    }
    // Skip 'internal' packages silently
  }

  // Step 4: Build source info metadata. When the checkout came from a git
  // clone we can resolve the real commit SHA; otherwise fall back to 'unknown'.
  const sourceInfo: SourceInfo = {
    repo: config.fluentui.repo,
    ref: options.ref ?? config.fluentui.defaultRef,
    commit: resolveCommit(sourcePath),
    scrapedAt: new Date().toISOString(),
  };

  // Step 5: Write schema to disk
  const schema = writeSchema({
    version: config.version,
    outputPath: resolve(outputPath),
    components,
    utilities,
    sources: {
      fluentui: sourceInfo,
      contrib: contribPath
        ? {
            repo: config.contrib.repo,
            ref: options.contribRef ?? config.contrib.defaultRef,
            commit: resolveCommit(contribPath),
            scrapedAt: new Date().toISOString(),
          }
        : undefined,
    },
  });


  // Step 6: Report results
  console.log('\nScraping complete!');
  console.log(`  Components: ${schema.stats.totalComponents}`);
  console.log(`  Utilities:  ${schema.stats.totalUtilities}`);
  console.log(`  Props:      ${schema.stats.totalProps}`);
  console.log(`  Stories:    ${schema.stats.totalStories}`);
  console.log(`  Output:     ${resolve(outputPath)}`);
}

// ============================================================================
// Entry Point
// ============================================================================

/**
 * Main entry point for the scraper CLI.
 *
 * Called when running: yarn scrape --version v9 --source /path/to/fluentui
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
      '\nUsage: yarn scrape --version v9 --source /path/to/fluentui',
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
