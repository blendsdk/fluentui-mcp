/**
 * Coverage reporting for the FluentUI scraper.
 *
 * A scrape can silently miss components when a package exports more than one
 * component, or when a package is skipped. The coverage report records what
 * was scraped and what was left out with an explicit reason, so gaps are
 * visible instead of implied by absence.
 *
 * @module scraper/coverage
 */

import { compareStrings } from './order.js';
import type { ComponentEntry } from '../../src/types/schema.js';
import type { DiscoveredPackage } from './types.js';

/**
 * A component that was successfully scraped.
 */
export interface CoverageEntry {
  /** Exported component name (e.g., 'ProgressBar'). */
  name: string;
  /** Kebab-case component id (e.g., 'progress-bar'). */
  id: string;
  /** npm package the component came from. */
  packageName: string;
}

/**
 * A discovered package that produced no scraped component, with the reason.
 */
export interface ExcludedPackage {
  /** Package directory name (e.g., 'react-activation'). */
  dirName: string;
  /** npm package name. */
  packageName: string;
  /** Human-readable reason the package was excluded. */
  reason: string;
}

/**
 * The result of a coverage pass over a scrape.
 */
export interface CoverageReport {
  /** One entry per scraped component, sorted by component name. */
  scraped: CoverageEntry[];
  /** Packages that produced no component, sorted by directory name. */
  excluded: ExcludedPackage[];
}

/**
 * Build a coverage report from the scraped components and discovered packages.
 *
 * A package is reported as excluded when it is on the skip list, is not a
 * component package, or is a component package from which no component could
 * be extracted. Components and exclusions are sorted for deterministic output.
 *
 * @param components - Components produced by the adapter
 * @param packages - Packages discovered in the source checkout
 * @param skipPackages - Directory names excluded by the version configuration
 * @returns Coverage report describing scraped and excluded packages
 */
export function buildCoverageReport(
  components: readonly ComponentEntry[],
  packages: readonly DiscoveredPackage[],
  skipPackages: readonly string[],
): CoverageReport {
  const scraped: CoverageEntry[] = components
    .map((component) => ({
      name: component.name,
      id: component.id,
      packageName: component.packageName,
    }))
    .sort((a, b) => compareStrings(a.name, b.name));

  const packagesWithComponents = new Set(
    components.map((component) => component.packageName),
  );

  const excluded: ExcludedPackage[] = [];

  for (const pkg of packages) {
    if (packagesWithComponents.has(pkg.packageName)) {
      continue;
    }

    excluded.push({
      dirName: pkg.dirName,
      packageName: pkg.packageName,
      reason: describeExclusion(pkg, skipPackages),
    });
  }

  excluded.sort((a, b) => compareStrings(a.dirName, b.dirName));

  return { scraped, excluded };
}

/**
 * Explain why a discovered package produced no scraped component.
 *
 * @param pkg - The discovered package
 * @param skipPackages - Directory names excluded by the version configuration
 * @returns A short human-readable reason
 */
function describeExclusion(
  pkg: DiscoveredPackage,
  skipPackages: readonly string[],
): string {
  if (pkg.dirName === 'react-components') {
    return 'umbrella re-export package';
  }
  if (skipPackages.includes(pkg.dirName)) {
    return 'excluded by configuration';
  }
  if (pkg.type === 'utility') {
    return 'utility package (no components)';
  }
  if (pkg.type === 'internal') {
    return 'internal package (no components)';
  }
  return 'component package with no extracted components';
}
