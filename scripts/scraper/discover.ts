/**
 * Package discovery module for the FluentUI scraper.
 *
 * This module finds all FluentUI component and utility packages in a local
 * checkout of the FluentUI monorepo. It reads package.json files, checks
 * the stable/unstable exports indices, and classifies each package.
 *
 * The discovery phase runs BEFORE extraction — it produces a list of
 * DiscoveredPackage objects that the version-specific adapters then process.
 *
 * @module scraper/discover
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';

import type { DiscoveredPackage, VersionConfig } from './types.js';

// ============================================================================
// Public API
// ============================================================================

/**
 * Discover all FluentUI packages in the given source directory.
 *
 * Scans the source directory using the version config's glob patterns,
 * reads package.json files, checks export indices, and classifies each
 * package as component, utility, or internal.
 *
 * @param sourcePath - Absolute path to the FluentUI monorepo checkout
 * @param config - Version-specific configuration with path patterns
 * @returns Array of discovered packages, sorted by directory name
 */
export function discoverPackages(
  sourcePath: string,
  config: VersionConfig,
): DiscoveredPackage[] {
  const resolvedSource = resolve(sourcePath);

  // Read the stable and unstable export indices to determine package stability
  const stableExports = readExportsIndex(
    join(resolvedSource, config.paths.stableExportsIndex),
  );
  const unstableExports = config.paths.unstableExportsIndex
    ? readExportsIndex(
        join(resolvedSource, config.paths.unstableExportsIndex),
      )
    : new Set<string>();

  // Find all package directories matching the glob pattern
  const packageDirs = findPackageDirectories(
    resolvedSource,
    config.paths.componentPackages,
  );

  const packages: DiscoveredPackage[] = [];

  for (const dir of packageDirs) {
    const dirName = basename(dir);

    // Skip packages on the skip list
    if (config.skipPackages.includes(dirName)) {
      continue;
    }

    // Skip the umbrella re-export package (e.g., react-components itself)
    // which is NOT a component package — it's the aggregator
    if (dirName === 'react-components') {
      continue;
    }

    // Read package.json
    const pkgInfo = readPackageJson(dir);
    if (!pkgInfo) {
      continue;
    }

    // Determine package type by inspecting source files
    const packageType = classifyPackageType(dir);

    // Check if this package's npm name appears in the export indices
    const isStable = stableExports.has(pkgInfo.name);
    const isPreview = unstableExports.has(pkgInfo.name);

    packages.push({
      dirName,
      path: dir,
      packageName: pkgInfo.name,
      packageVersion: pkgInfo.version,
      type: packageType,
      isStableExport: isStable,
      isPreviewExport: isPreview,
      source: 'fluentui',
    });
  }

  // Sort alphabetically by directory name for deterministic output
  return packages.sort((a, b) => a.dirName.localeCompare(b.dirName));
}

/**
 * Discover packages in the fluentui-contrib repository.
 *
 * The contrib repo has a simpler layout: `packages/*` with each package
 * being a `@fluentui-contrib/*` scoped package.
 *
 * @param contribPath - Absolute path to the fluentui-contrib checkout
 * @returns Array of discovered contrib packages
 */
export function discoverContribPackages(
  contribPath: string,
): DiscoveredPackage[] {
  const resolvedPath = resolve(contribPath);
  const packagesDir = join(resolvedPath, 'packages');

  if (!existsSync(packagesDir)) {
    return [];
  }

  const packages: DiscoveredPackage[] = [];
  const entries = readdirSync(packagesDir);

  for (const entry of entries) {
    const dir = join(packagesDir, entry);

    // Only process directories
    if (!statSync(dir).isDirectory()) {
      continue;
    }

    const pkgInfo = readPackageJson(dir);
    if (!pkgInfo) {
      continue;
    }

    // Contrib packages are always classified as components unless
    // they clearly don't export React components
    const packageType = classifyPackageType(dir);

    packages.push({
      dirName: entry,
      path: dir,
      packageName: pkgInfo.name,
      packageVersion: pkgInfo.version,
      type: packageType,
      isStableExport: false,
      isPreviewExport: false,
      source: 'contrib',
    });
  }

  return packages.sort((a, b) => a.dirName.localeCompare(b.dirName));
}

// ============================================================================
// Internal Helpers
// ============================================================================

/**
 * Parsed data from a package.json file.
 */
interface PackageJsonInfo {
  /** npm package name */
  name: string;
  /** Package version */
  version: string;
}

/**
 * Read and parse a package.json file from a directory.
 *
 * Returns null if the file doesn't exist or is malformed.
 * This is intentional — some directories might not have a package.json
 * (e.g., empty directories, directories being set up).
 *
 * @param dirPath - Directory containing the package.json
 * @returns Parsed name and version, or null if unreadable
 */
function readPackageJson(dirPath: string): PackageJsonInfo | null {
  const pkgJsonPath = join(dirPath, 'package.json');

  if (!existsSync(pkgJsonPath)) {
    return null;
  }

  try {
    const content = readFileSync(pkgJsonPath, 'utf-8');
    const parsed = JSON.parse(content) as Record<string, unknown>;

    const name = parsed['name'];
    const version = parsed['version'];

    // Both name and version must be strings
    if (typeof name !== 'string' || typeof version !== 'string') {
      return null;
    }

    return { name, version };
  } catch {
    // Malformed JSON — skip this package
    return null;
  }
}

/**
 * Read an exports index file and extract the npm package names
 * that are re-exported from it.
 *
 * Parses lines like:
 *   export { Button } from '@fluentui/react-button';
 *   export type { ButtonProps } from '@fluentui/react-button';
 *
 * Returns a Set of package names (e.g., '@fluentui/react-button').
 *
 * @param indexPath - Path to the exports index file
 * @returns Set of npm package names found in the exports
 */
export function readExportsIndex(indexPath: string): Set<string> {
  const packages = new Set<string>();

  if (!existsSync(indexPath)) {
    return packages;
  }

  try {
    const content = readFileSync(indexPath, 'utf-8');
    const lines = content.split('\n');

    // Match: export { ... } from 'package-name';
    // Match: export type { ... } from 'package-name';
    const exportPattern = /from\s+['"]([^'"]+)['"]/;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip comments and empty lines
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || !trimmed) {
        continue;
      }

      const match = exportPattern.exec(trimmed);
      if (match?.[1]) {
        packages.add(match[1]);
      }
    }
  } catch {
    // File unreadable — return empty set
  }

  return packages;
}

/**
 * Find package directories matching a simple glob pattern.
 *
 * Supports a single `*` wildcard at the end of the path pattern
 * (e.g., 'packages/react-components/react-*'). This is intentionally
 * simple — we don't need full glob support since FluentUI uses
 * predictable directory structures.
 *
 * @param basePath - Root directory to search from
 * @param pattern - Glob-like pattern (supports trailing `*`)
 * @returns Array of absolute paths to matching directories
 */
export function findPackageDirectories(
  basePath: string,
  pattern: string,
): string[] {
  // Split the pattern into segments
  const segments = pattern.split('/');
  return findMatchingDirs(basePath, segments);
}

/**
 * Recursively resolve path segments, expanding wildcards.
 *
 * Walks the directory tree segment by segment. When a segment
 * contains `*`, it lists the directory and filters entries that
 * match the wildcard pattern. Literal segments are resolved directly.
 *
 * @param currentPath - Current directory being resolved
 * @param remainingSegments - Path segments still to be matched
 * @returns Array of absolute paths matching all segments
 */
function findMatchingDirs(
  currentPath: string,
  remainingSegments: string[],
): string[] {
  if (remainingSegments.length === 0) {
    // All segments consumed — check if this is a directory
    return existsSync(currentPath) && statSync(currentPath).isDirectory()
      ? [currentPath]
      : [];
  }

  const [segment, ...rest] = remainingSegments;

  if (segment === undefined) {
    return [];
  }

  // Check if segment contains a wildcard
  if (segment.includes('*')) {
    // Convert the glob segment to a regex
    // e.g., 'react-*' → /^react-.*$/
    const regexStr = '^' + segment.replace(/\*/g, '.*') + '$';
    const regex = new RegExp(regexStr);

    if (!existsSync(currentPath) || !statSync(currentPath).isDirectory()) {
      return [];
    }

    const entries = readdirSync(currentPath);
    const results: string[] = [];

    for (const entry of entries) {
      if (regex.test(entry)) {
        const fullPath = join(currentPath, entry);
        if (statSync(fullPath).isDirectory()) {
          results.push(...findMatchingDirs(fullPath, rest));
        }
      }
    }

    return results;
  }

  // Literal segment — just step into it
  const nextPath = join(currentPath, segment);
  return findMatchingDirs(nextPath, rest);
}

/**
 * Classify a package as component, utility, or internal.
 *
 * Inspects the package directory for indicators of what the package exports:
 * - Has `.tsx` files in the source → likely a component
 * - Has only `.ts` files (hooks, utilities) → utility
 * - Has no source or only build config → internal
 *
 * The classification checks `library/src/` (v9 layout) and `src/` (fallback)
 * for source files.
 *
 * @param dirPath - Path to the package directory
 * @returns Package type classification
 */
export function classifyPackageType(
  dirPath: string,
): 'component' | 'utility' | 'internal' {
  // Check v9-style layout first (library/src/)
  const v9SrcDir = join(dirPath, 'library', 'src');
  // Fallback to direct src/ layout
  const directSrcDir = join(dirPath, 'src');

  const srcDir = existsSync(v9SrcDir)
    ? v9SrcDir
    : existsSync(directSrcDir)
      ? directSrcDir
      : null;

  if (!srcDir) {
    return 'internal';
  }

  // Recursively check for .tsx files (React components)
  if (hasTsxFiles(srcDir)) {
    return 'component';
  }

  // Has .ts files but no .tsx → utility
  if (hasTsFiles(srcDir)) {
    return 'utility';
  }

  return 'internal';
}

/**
 * Recursively check if a directory contains any .tsx files.
 *
 * Finding a .tsx file is a strong indicator that the package exports
 * React components (since .tsx is used for JSX).
 *
 * @param dirPath - Directory to search
 * @returns True if any .tsx file exists in the directory tree
 */
function hasTsxFiles(dirPath: string): boolean {
  return hasFilesWithExtension(dirPath, '.tsx');
}

/**
 * Recursively check if a directory contains any .ts files.
 *
 * @param dirPath - Directory to search
 * @returns True if any .ts file exists in the directory tree
 */
function hasTsFiles(dirPath: string): boolean {
  return hasFilesWithExtension(dirPath, '.ts');
}

/**
 * Recursively check if a directory contains files with a specific extension.
 *
 * Uses a depth-limited search (max 3 levels) to avoid crawling deep
 * into node_modules or build output directories.
 *
 * @param dirPath - Directory to search
 * @param extension - File extension to look for (e.g., '.tsx')
 * @param depth - Current recursion depth (max 3)
 * @returns True if any matching file is found
 */
function hasFilesWithExtension(
  dirPath: string,
  extension: string,
  depth: number = 0,
): boolean {
  // Depth limit to avoid crawling too deep
  if (depth > 3) {
    return false;
  }

  if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
    return false;
  }

  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    // Skip common non-source directories
    if (entry === 'node_modules' || entry === 'dist' || entry === 'lib') {
      continue;
    }

    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);

    if (stat.isFile() && entry.endsWith(extension)) {
      return true;
    }

    if (stat.isDirectory()) {
      if (hasFilesWithExtension(fullPath, extension, depth + 1)) {
        return true;
      }
    }
  }

  return false;
}
