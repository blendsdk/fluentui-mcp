/**
 * Pure scraper pipeline for FluentUI v9.
 *
 * Combines discovery, extraction, classification, source pinning, and
 * coverage reporting into a single call that returns a schema object without
 * writing to disk. The CLI wraps this to add output writing and logging.
 *
 * @module scraper/pipeline
 */

import type {
  ComponentEntry,
  FluentUISchema,
  SourceInfo,
  UtilityEntry,
} from '../../src/types/schema.js';
import { getVersionConfig } from './config.js';
import {
  discoverContribPackages,
  discoverPackages,
  isExcludedPackage,
  readExportsIndexByPackage,
  resolveExportsIndexPath,
} from './discover.js';
import { createAdapter } from './adapters/factory.js';
import { resolveCommit } from './clone.js';
import { resolveTagAtHead } from './git-ref.js';
import { buildCoverageReport } from './coverage.js';
import type { CoverageReport } from './coverage.js';
import { compareStrings } from './order.js';
import { resolveSourcePath } from './paths.js';
import { computeStats } from './output.js';
import type { DiscoveredPackage, VersionConfig } from './types.js';

/**
 * Options controlling a scrape run.
 */
export interface ScrapeOptions {
  /** FluentUI version to scrape (e.g., 'v9'). */
  version: string;

  /** Path to a local FluentUI checkout. Resolved against `allowedRoot`. */
  source: string;

  /** Optional path to a local fluentui-contrib checkout. */
  contrib?: string;

  /** Explicit FluentUI ref to record; resolved from tags when omitted. */
  fluentuiRef?: string;

  /** Explicit contrib ref to record. */
  contribRef?: string;

  /** Commit SHA to record for the FluentUI checkout (otherwise resolved). */
  commit?: string;

  /** Commit SHA to record for the contrib checkout (otherwise resolved). */
  contribCommit?: string;

  /** Directory that `source` and `contrib` must stay inside. */
  allowedRoot?: string;
}

/**
 * The result of a scrape run.
 */
export interface ScrapeResult {
  /** The assembled, enhancer-ready schema (enhancer fields are empty). */
  schema: FluentUISchema;
  /** Coverage report describing scraped and excluded packages. */
  coverage: CoverageReport;
}

/**
 * Run the scraper against a local checkout.
 *
 * Source paths are resolved and checked against `allowedRoot` so a traversal
 * value cannot read outside the intended directory. The FluentUI ref is pinned
 * to the newest stable release tag found in the checkout unless an explicit
 * ref is supplied.
 *
 * @param options - Scrape configuration
 * @returns The assembled schema and its coverage report
 * @throws Error when a source path escapes `allowedRoot` or the version is unsupported
 */
export function scrape(options: ScrapeOptions): ScrapeResult {
  const config = getVersionConfig(options.version);
  const allowedRoot = options.allowedRoot ?? process.cwd();

  const sourcePath = resolveSourcePath(options.source, allowedRoot);

  // Discover every package (including excluded ones) so coverage can explain
  // what was left out, then extract from the non-excluded set only.
  const allDiscovered = discoverPackages(sourcePath, config, {
    includeSkipped: true,
  });
  const packages = allDiscovered.filter(
    (pkg) => !isExcludedPackage(pkg, config),
  );

  let contribPackages: DiscoveredPackage[] = [];
  let resolvedContribPath: string | undefined;
  if (options.contrib) {
    resolvedContribPath = resolveSourcePath(options.contrib, allowedRoot);
    contribPackages = discoverContribPackages(resolvedContribPath);
  }

  const exportNames = collectExportNames(sourcePath, config);
  const adapter = createAdapter(config.adapter);
  const components: ComponentEntry[] = [];
  const utilities: UtilityEntry[] = [];

  for (const pkg of [...packages, ...contribPackages]) {
    if (pkg.type === 'component') {
      components.push(
        ...adapter.extractComponents(pkg, {
          exportedNames: exportNames.get(pkg.packageName) ?? [],
        }),
      );
    } else if (pkg.type === 'utility') {
      const entry = adapter.extractUtility(pkg);
      if (entry) {
        utilities.push(entry);
      }
    }
  }

  // Sort globally so the output does not depend on discovery order.
  components.sort((a, b) => compareStrings(a.name, b.name));
  utilities.sort((a, b) => compareStrings(a.name, b.name));

  const fluentuiRef =
    options.fluentuiRef ??
    resolveTagAtHead(sourcePath) ??
    config.fluentui.defaultRef;

  const sources: { fluentui: SourceInfo; contrib?: SourceInfo } = {
    fluentui: {
      repo: config.fluentui.repo,
      ref: fluentuiRef,
      commit: options.commit ?? resolveCommit(sourcePath),
      scrapedAt: new Date().toISOString(),
    },
  };

  if (resolvedContribPath) {
    sources.contrib = {
      repo: config.contrib.repo,
      ref: options.contribRef ?? config.contrib.defaultRef,
      commit: options.contribCommit ?? resolveCommit(resolvedContribPath),
      scrapedAt: new Date().toISOString(),
    };
  }

  const schema: FluentUISchema = {
    schemaVersion: '1.0',
    version: options.version,
    generatedAt: new Date().toISOString(),
    sources,
    components,
    utilities,
    // Enhancer-populated fields — empty in scraper output.
    foundation: [],
    patterns: [],
    enterprise: [],
    quickReference: [],
    stats: computeStats(components, utilities),
  };

  const coverage = buildCoverageReport(
    components,
    allDiscovered,
    config.skipPackages,
  );

  return { schema, coverage };
}

/**
 * Collect the public value exports of each package from the umbrella indices.
 *
 * Reads the stable and unstable export indices and merges the identifiers each
 * package contributes. Discovery uses this to tell real components from
 * non-exported context/state type files.
 *
 * @param sourcePath - Absolute path to a FluentUI checkout
 * @param config - Version configuration with the index paths
 * @returns Map from npm package name to its exported value identifiers
 */
function collectExportNames(
  sourcePath: string,
  config: VersionConfig,
): Map<string, string[]> {
  const paths = [
    resolveExportsIndexPath(sourcePath, config.paths.stableExportsIndex),
    config.paths.unstableExportsIndex
      ? resolveExportsIndexPath(sourcePath, config.paths.unstableExportsIndex)
      : null,
  ];

  const merged = new Map<string, string[]>();
  for (const indexPath of paths) {
    if (!indexPath) {
      continue;
    }
    for (const [packageName, names] of readExportsIndexByPackage(indexPath)) {
      merged.set(packageName, [
        ...(merged.get(packageName) ?? []),
        ...names,
      ]);
    }
  }

  return merged;
}
