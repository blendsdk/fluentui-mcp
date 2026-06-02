/**
 * Base interface for version-specific scraper adapters.
 *
 * Each FluentUI version (v8, v9) has different directory layouts, file
 * naming conventions, and component structures. The adapter interface
 * abstracts these differences, providing a consistent API for the
 * scraper pipeline to extract component and utility data.
 *
 * @module scraper/adapters/adapter
 */

import type { DiscoveredPackage } from '../types.js';
import type { ComponentEntry, UtilityEntry } from '../../../src/types/schema.js';

// ============================================================================
// Adapter Interface
// ============================================================================

/**
 * Scraper adapter interface for version-specific extraction logic.
 *
 * Implementations handle the file-finding and data-extraction logic
 * that differs between FluentUI versions. The scraper pipeline calls
 * these methods for each discovered package to produce ComponentEntry
 * and UtilityEntry objects.
 */
export interface ScraperAdapter {
  /**
   * Extract component data from a discovered component package.
   *
   * Finds types files, extracts props/slots, finds stories,
   * extracts defaults, and builds a complete ComponentEntry.
   *
   * @param pkg - The discovered package to extract from
   * @returns ComponentEntry if extraction succeeds, null if the package
   *          cannot be parsed (e.g., missing types file, parse errors)
   */
  extractComponent(pkg: DiscoveredPackage): ComponentEntry | null;

  /**
   * Extract utility data from a discovered utility package.
   *
   * Scans the package's source directory for exported functions,
   * hooks, types, and constants.
   *
   * @param pkg - The discovered utility package
   * @returns UtilityEntry if extraction succeeds, null otherwise
   */
  extractUtility(pkg: DiscoveredPackage): UtilityEntry | null;

  /**
   * Find the .types.ts file for a named component within a package.
   *
   * Searches the package's source directory for `<componentName>.types.ts`,
   * handling different directory layouts (flat vs nested in components/).
   *
   * @param pkg - The package to search in
   * @param componentName - PascalCase component name (e.g., 'Button')
   * @returns Absolute path to the types file, or null if not found
   */
  findTypesFile(pkg: DiscoveredPackage, componentName: string): string | null;

  /**
   * Find Storybook story files for a named component.
   *
   * Searches the package's stories directory for .stories.tsx files
   * related to the component.
   *
   * @param pkg - The package to search in
   * @param componentName - PascalCase component name (e.g., 'Button')
   * @returns Array of absolute paths to story files
   */
  findStoryFiles(pkg: DiscoveredPackage, componentName: string): string[];

  /**
   * Find the hook file (use<Name>.ts) for default value extraction.
   *
   * Searches for the component's primary hook file which typically
   * contains default prop values via destructuring or nullish coalescing.
   *
   * @param pkg - The package to search in
   * @param componentName - PascalCase component name (e.g., 'Button')
   * @returns Absolute path to the hook file, or null if not found
   */
  findHookFile(pkg: DiscoveredPackage, componentName: string): string | null;
}
