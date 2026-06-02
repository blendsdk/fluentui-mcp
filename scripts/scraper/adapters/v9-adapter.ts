/**
 * V9 adapter for extracting FluentUI v9 component and utility data.
 *
 * Handles the v9 monorepo directory layout:
 * - library/src/ for TypeScript source files
 * - library/etc/ for API Extractor reports (.api.md)
 * - stories/src/ for Storybook examples
 *
 * The V9 adapter orchestrates all extractors (props, slots, stories,
 * defaults, utility) and builds complete ComponentEntry/UtilityEntry
 * objects from discovered packages.
 *
 * @module scraper/adapters/v9-adapter
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { ScraperAdapter } from './adapter.js';
import type { DiscoveredPackage } from '../types.js';
import type {
  ComponentEntry,
  UtilityEntry,
  PropEntry,
} from '../../../src/types/schema.js';
import { classifyCategory, classifyStability } from '../classify.js';
import { extractProps } from '../extractors/props-extractor.js';
import { extractSlots } from '../extractors/slots-extractor.js';
import { extractStoriesFromFile } from '../extractors/stories-extractor.js';
import { extractDefaults } from '../extractors/defaults-extractor.js';
import { extractPropsFromApiMd } from '../extractors/api-extractor-fallback.js';
import { extractUtilityExports } from '../extractors/utility-extractor.js';

// ============================================================================
// V9 Adapter Implementation
// ============================================================================

/**
 * Scraper adapter for FluentUI v9 packages.
 *
 * V9 uses a monorepo structure where each component lives in its own
 * package under packages/react-components/react-*. The adapter knows
 * how to find types files, stories, and hooks within this layout.
 */
export class V9Adapter implements ScraperAdapter {
  /**
   * Extract component data from a v9 component package.
   *
   * Orchestrates the full extraction pipeline:
   * 1. Find .types.ts file → extract props (ts-morph)
   * 2. Fallback to .api.md if ts-morph yields no props
   * 3. Extract slots from .types.ts
   * 4. Find hook file → extract defaults → merge into props
   * 5. Find story files → extract stories
   * 6. Classify category and stability
   * 7. Build ComponentEntry
   *
   * @param pkg - Discovered component package
   * @returns Complete ComponentEntry, or null if extraction fails entirely
   */
  extractComponent(pkg: DiscoveredPackage): ComponentEntry | null {
    const componentName = deriveComponentName(pkg.dirName);

    // Step 1: Find and extract props from .types.ts via ts-morph
    const typesFile = this.findTypesFile(pkg, componentName);
    let props: PropEntry[] = [];
    if (typesFile) {
      props = extractProps(typesFile);
    }

    // Step 2: Fallback to .api.md if ts-morph yielded no props
    if (props.length === 0) {
      const apiMdFile = findApiMdFile(pkg);
      if (apiMdFile) {
        props = extractPropsFromApiMd(apiMdFile);
      }
    }

    // Step 3: Extract slots from .types.ts
    const slots = typesFile ? extractSlots(typesFile) : [];

    // Step 4: Extract defaults from hook file and merge into props
    const hookFile = this.findHookFile(pkg, componentName);
    if (hookFile) {
      const defaults = extractDefaults(hookFile);
      props = mergeDefaults(props, defaults);
    }

    // Step 5: Extract stories from individual .stories.tsx files
    const storyFiles = this.findStoryFiles(pkg, componentName);
    const stories = storyFiles.flatMap((filePath) =>
      extractStoriesFromFile(filePath),
    );

    // Step 6: Classify and build entry
    const stability = classifyStability(pkg);
    const category = classifyCategory(pkg.dirName);
    const id = toKebabCaseId(componentName);
    const importPath = getImportPath(pkg, stability);

    return {
      name: componentName,
      id,
      packageName: pkg.packageName,
      packageVersion: pkg.packageVersion,
      importPath,
      importStatement: `import { ${componentName} } from '${importPath}';`,
      category,
      stability,
      deprecated: false,
      props,
      slots,
      stories,
      relatedComponents: [],
      additionalExports: [],
    };
  }

  /**
   * Extract utility data from a v9 utility package.
   *
   * Scans the source directory for exported hooks, functions, types,
   * and constants using the utility extractor.
   *
   * @param pkg - Discovered utility package
   * @returns UtilityEntry with all discovered exports
   */
  extractUtility(pkg: DiscoveredPackage): UtilityEntry | null {
    const name = deriveUtilityName(pkg.dirName);
    const stability = classifyStability(pkg);
    const id = pkg.dirName.replace(/^react-/, '');

    // Find source directory for utility export scanning
    const srcDir = findSrcDir(pkg.path);
    const exports = srcDir ? extractUtilityExports(srcDir) : [];

    return {
      name,
      id,
      packageName: pkg.packageName,
      packageVersion: pkg.packageVersion,
      importPath: pkg.packageName,
      stability,
      exports,
    };
  }

  /**
   * Find the .types.ts file for a component within a v9 package.
   *
   * Searches library/src/ recursively for `<ComponentName>.types.ts`.
   * Handles both flat layouts (library/src/Button.types.ts) and nested
   * layouts (library/src/components/Button/Button.types.ts).
   *
   * @param pkg - Package to search in
   * @param componentName - PascalCase component name
   * @returns Absolute path to the types file, or null
   */
  findTypesFile(pkg: DiscoveredPackage, componentName: string): string | null {
    const srcDir = findSrcDir(pkg.path);
    if (!srcDir) return null;
    return findFileRecursive(srcDir, `${componentName}.types.ts`);
  }

  /**
   * Find Storybook story files for a component.
   *
   * V9 stories live in: stories/src/<ComponentName>/*.stories.tsx
   * Falls back to searching all of stories/src/ if the component-specific
   * directory doesn't exist.
   *
   * @param pkg - Package to search in
   * @param componentName - PascalCase component name
   * @returns Sorted array of absolute paths to story files
   */
  findStoryFiles(pkg: DiscoveredPackage, componentName: string): string[] {
    // Primary location: stories/src/<ComponentName>/
    const componentStoriesDir = join(
      pkg.path,
      'stories',
      'src',
      componentName,
    );
    if (
      existsSync(componentStoriesDir) &&
      statSync(componentStoriesDir).isDirectory()
    ) {
      return findFilesRecursive(componentStoriesDir, '.stories.tsx');
    }

    // Fallback: search all of stories/src/ for any story files
    const storiesSrcDir = join(pkg.path, 'stories', 'src');
    if (existsSync(storiesSrcDir) && statSync(storiesSrcDir).isDirectory()) {
      return findFilesRecursive(storiesSrcDir, '.stories.tsx');
    }

    return [];
  }

  /**
   * Find the hook file (use<Name>.ts) for default value extraction.
   *
   * Searches library/src/ recursively for `use<ComponentName>.ts`.
   *
   * @param pkg - Package to search in
   * @param componentName - PascalCase component name
   * @returns Absolute path to the hook file, or null
   */
  findHookFile(pkg: DiscoveredPackage, componentName: string): string | null {
    const srcDir = findSrcDir(pkg.path);
    if (!srcDir) return null;
    return findFileRecursive(srcDir, `use${componentName}.ts`);
  }
}

// ============================================================================
// Name Derivation Helpers
// ============================================================================

/**
 * Derive a PascalCase component name from a package directory name.
 *
 * Removes the 'react-' prefix and converts kebab-case to PascalCase.
 *
 * @param dirName - Package directory name (e.g., 'react-button')
 * @returns PascalCase component name (e.g., 'Button')
 *
 * @example
 * deriveComponentName('react-button')          // → 'Button'
 * deriveComponentName('react-compound-button')  // → 'CompoundButton'
 * deriveComponentName('react-message-bar')      // → 'MessageBar'
 */
export function deriveComponentName(dirName: string): string {
  // Remove 'react-' prefix
  const nameWithoutPrefix = dirName.replace(/^react-/, '');

  // Convert kebab-case to PascalCase: split on hyphens, capitalize each segment
  return nameWithoutPrefix
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');
}

/**
 * Derive a display name for a utility package.
 *
 * Uses the same PascalCase conversion as component names.
 *
 * @param dirName - Package directory name (e.g., 'react-positioning')
 * @returns Display name (e.g., 'Positioning')
 */
export function deriveUtilityName(dirName: string): string {
  return deriveComponentName(dirName);
}

/**
 * Convert a PascalCase name to a kebab-case ID.
 *
 * Used to generate the `id` field for ComponentEntry, which serves
 * as the lookup key for fuzzy matching and URL-friendly references.
 *
 * @param pascalCase - PascalCase string (e.g., 'CompoundButton')
 * @returns kebab-case string (e.g., 'compound-button')
 */
export function toKebabCaseId(pascalCase: string): string {
  return pascalCase.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

// ============================================================================
// Import Path Helpers
// ============================================================================

/**
 * Determine the recommended import path for a component.
 *
 * Stable components should be imported from the umbrella package
 * (`@fluentui/react-components`). Preview components from the
 * unstable sub-path. Other packages use their own npm name.
 *
 * @param pkg - The discovered package
 * @param stability - Resolved stability level
 * @returns The recommended import path string
 */
export function getImportPath(
  pkg: DiscoveredPackage,
  stability: string,
): string {
  if (stability === 'stable') {
    return '@fluentui/react-components';
  }
  if (stability === 'preview') {
    return '@fluentui/react-components/unstable';
  }
  // Unstable/contrib: import from the package's own name
  return pkg.packageName;
}

// ============================================================================
// Data Merging Helpers
// ============================================================================

/**
 * Merge extracted default values into prop entries.
 *
 * For each prop in the array, if the defaults map contains a matching
 * value for that prop name, the `defaultValue` field is populated.
 * Existing defaultValues (e.g., from JSDoc @default tags) are NOT
 * overwritten — the types file is considered the primary source.
 *
 * @param props - Props extracted from .types.ts
 * @param defaults - Default values extracted from the hook file
 * @returns New array of PropEntry with defaultValue fields populated
 */
export function mergeDefaults(
  props: PropEntry[],
  defaults: Record<string, string>,
): PropEntry[] {
  if (Object.keys(defaults).length === 0) {
    return props;
  }

  return props.map((prop) => {
    const defaultValue = defaults[prop.name];
    // Only set if we found a default AND the prop doesn't already have one
    if (defaultValue !== undefined && !prop.defaultValue) {
      return { ...prop, defaultValue };
    }
    return prop;
  });
}

// ============================================================================
// File System Helpers
// ============================================================================

/**
 * Find the source directory for a v9 package.
 *
 * Checks for library/src/ first (standard v9 layout),
 * then falls back to src/ (some utility packages or simplified layouts).
 *
 * @param packagePath - Root path of the package
 * @returns Absolute path to the source directory, or null if not found
 */
export function findSrcDir(packagePath: string): string | null {
  // V9 standard layout: library/src/
  const v9SrcDir = join(packagePath, 'library', 'src');
  if (existsSync(v9SrcDir) && statSync(v9SrcDir).isDirectory()) {
    return v9SrcDir;
  }

  // Fallback: src/ directly
  const directSrcDir = join(packagePath, 'src');
  if (existsSync(directSrcDir) && statSync(directSrcDir).isDirectory()) {
    return directSrcDir;
  }

  return null;
}

/**
 * Recursively search a directory for a file by exact name.
 *
 * Returns the first match found. Uses depth-limited search (max 4 levels)
 * to avoid crawling into node_modules or build output directories.
 *
 * @param dirPath - Directory to search
 * @param fileName - Exact file name to find (e.g., 'Button.types.ts')
 * @param depth - Current recursion depth (internal, defaults to 0)
 * @returns Absolute path to the file, or null if not found
 */
export function findFileRecursive(
  dirPath: string,
  fileName: string,
  depth: number = 0,
): string | null {
  if (depth > 4 || !existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
    return null;
  }

  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    // Skip non-source directories to avoid crawling into build output
    if (entry === 'node_modules' || entry === 'dist' || entry === 'lib') {
      continue;
    }

    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);

    if (stat.isFile() && entry === fileName) {
      return fullPath;
    }

    if (stat.isDirectory()) {
      const found = findFileRecursive(fullPath, fileName, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

/**
 * Recursively find all files with a specific extension in a directory.
 *
 * Returns files sorted alphabetically for deterministic output.
 * Uses depth-limited search (max 4 levels).
 *
 * @param dirPath - Directory to search
 * @param extension - File extension to match (e.g., '.stories.tsx')
 * @param depth - Current recursion depth (internal, defaults to 0)
 * @returns Sorted array of absolute paths to matching files
 */
export function findFilesRecursive(
  dirPath: string,
  extension: string,
  depth: number = 0,
): string[] {
  if (depth > 4 || !existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
    return [];
  }

  const results: string[] = [];
  const entries = readdirSync(dirPath);

  for (const entry of entries) {
    // Skip non-source directories
    if (entry === 'node_modules' || entry === 'dist' || entry === 'lib') {
      continue;
    }

    const fullPath = join(dirPath, entry);
    const stat = statSync(fullPath);

    if (stat.isFile() && entry.endsWith(extension)) {
      results.push(fullPath);
    }

    if (stat.isDirectory()) {
      results.push(...findFilesRecursive(fullPath, extension, depth + 1));
    }
  }

  return results.sort();
}

/**
 * Find the API Extractor .api.md file for a package.
 *
 * These files are pre-built by Microsoft and live in library/etc/<dirName>.api.md.
 * Used as a fallback when ts-morph parsing fails or yields no results.
 *
 * @param pkg - The package to search in
 * @returns Absolute path to the .api.md file, or null if not found
 */
export function findApiMdFile(pkg: DiscoveredPackage): string | null {
  const etcDir = join(pkg.path, 'library', 'etc');
  if (!existsSync(etcDir)) return null;

  const apiMdName = `${pkg.dirName}.api.md`;
  const apiMdPath = join(etcDir, apiMdName);
  return existsSync(apiMdPath) ? apiMdPath : null;
}
