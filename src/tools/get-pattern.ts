/**
 * Tool: get_pattern — Get FluentUI pattern documentation.
 *
 * Returns documentation for implementation patterns organized by group:
 * composition, data, forms, layout, modals, navigation, state.
 *
 * When called with just a category, returns an index of all patterns
 * in that group. When called with a specific pattern name, returns the
 * full documentation for that pattern (rendered from the structured schema).
 *
 * @module tools/get-pattern
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { GetPatternArgs, PatternEntry } from '../types/index.js';
import { PATTERN_CATEGORIES } from '../types/index.js';
import { formatPattern } from '../formatters/pattern-formatter.js';

/**
 * Execute the get_pattern tool.
 *
 * If only a category is provided, lists all patterns in that group.
 * If a specific pattern name is also given, returns its full documentation.
 * If neither is provided, shows all available pattern categories.
 *
 * @param store - The populated schema store to query
 * @param args - Tool arguments with pattern category and optional pattern name
 * @returns Formatted markdown string with pattern documentation
 *
 * @example
 * ```typescript
 * const list = getPattern(store, { patternCategory: "forms" });
 * const doc = getPattern(store, { patternCategory: "forms", patternName: "validation" });
 * ```
 */
export function getPattern(
  store: SchemaStore,
  args: GetPatternArgs
): string {
  const { patternCategory, patternName } = args;

  // No category — show all pattern categories.
  if (!patternCategory || patternCategory.trim().length === 0) {
    return formatPatternOverview(store);
  }

  const normalizedCategory = patternCategory.trim().toLowerCase();

  if (!isValidPatternCategory(normalizedCategory)) {
    return formatInvalidPatternCategory(normalizedCategory);
  }

  const categoryPatterns = store.getPatternsByGroup(normalizedCategory);

  // If a specific pattern was requested, find and return it.
  if (patternName && patternName.trim().length > 0) {
    return findAndFormatPattern(categoryPatterns, patternName.trim(), normalizedCategory);
  }

  // No specific pattern — list all patterns in the category.
  return formatPatternCategoryList(normalizedCategory, categoryPatterns);
}

/**
 * Find a specific pattern by name within a group's patterns.
 *
 * Tries match on title, id, then partial matching.
 *
 * @param patterns - Patterns in the group
 * @param name - Pattern name to find
 * @param category - The group (for error messages)
 * @returns Formatted markdown for the pattern, or error if not found
 */
function findAndFormatPattern(
  patterns: PatternEntry[],
  name: string,
  category: string
): string {
  const normalized = name.toLowerCase();

  let match = patterns.find((p) => p.title.toLowerCase().includes(normalized));

  if (!match) {
    match = patterns.find(
      (p) => p.id.toLowerCase().includes(normalized) || normalized.includes(p.id.toLowerCase())
    );
  }

  if (!match) {
    return formatPatternNotFound(name, category, patterns);
  }

  return formatPattern(match);
}

/**
 * Format an overview of all available pattern categories.
 *
 * @param store - The schema store for getting pattern counts per group
 * @returns Formatted markdown overview
 */
function formatPatternOverview(store: SchemaStore): string {
  const parts: string[] = [];

  parts.push('## FluentUI Pattern Documentation');
  parts.push('');
  parts.push('Implementation patterns and best practices for common UI scenarios.');
  parts.push('');

  for (const category of PATTERN_CATEGORIES) {
    const patterns = store.getPatternsByGroup(category);
    const count = patterns.length;

    parts.push(`### ${capitalize(category)} Patterns`);
    parts.push(`*${count} pattern${count === 1 ? '' : 's'} available*`);

    if (patterns.length > 0) {
      const titles = patterns.map((p) => p.title).join(', ');
      parts.push(`Topics: ${titles}`);
    }

    parts.push(`*Use \`get_pattern("${category}")\` to see all patterns*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a list of all patterns within a specific group.
 *
 * @param category - The pattern group name
 * @param patterns - Patterns in this group
 * @returns Formatted markdown list
 */
function formatPatternCategoryList(
  category: string,
  patterns: PatternEntry[]
): string {
  const parts: string[] = [];

  parts.push(`## ${capitalize(category)} Patterns`);
  parts.push(`*${patterns.length} pattern${patterns.length === 1 ? '' : 's'} in this category*`);
  parts.push('');

  if (patterns.length === 0) {
    parts.push('No patterns found in this category.');
    return parts.join('\n');
  }

  const sorted = [...patterns].sort((a, b) => a.title.localeCompare(b.title));

  for (const pattern of sorted) {
    parts.push(`### ${pattern.title}`);
    parts.push(`*Use \`get_pattern("${category}", "${pattern.id}")\` for full documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format an error message when a specific pattern is not found.
 *
 * @param name - The pattern name that wasn't found
 * @param category - The group that was searched
 * @param available - Patterns available in the group (for suggestions)
 * @returns Formatted error message
 */
function formatPatternNotFound(
  name: string,
  category: string,
  available: PatternEntry[]
): string {
  const parts: string[] = [];
  parts.push(`Pattern "${name}" not found in category "${category}".`);
  parts.push('');

  if (available.length > 0) {
    parts.push('**Available patterns in this category:**');
    for (const pattern of available) {
      parts.push(`- ${pattern.title} → \`get_pattern("${category}", "${pattern.id}")\``);
    }
  }

  return parts.join('\n');
}

/**
 * Format an error for an invalid pattern category.
 *
 * @param category - The invalid category string
 * @returns Error message with valid categories
 */
function formatInvalidPatternCategory(category: string): string {
  const parts: string[] = [];
  parts.push(`**Error:** Invalid pattern category "${category}".`);
  parts.push('');
  parts.push('**Valid pattern categories:**');

  for (const cat of PATTERN_CATEGORIES) {
    parts.push(`- ${cat}`);
  }

  parts.push('');
  parts.push('*Omit the category to see an overview of all pattern categories.*');

  return parts.join('\n');
}

/**
 * Check if a string is a valid pattern category.
 *
 * @param value - The string to validate
 * @returns True if the value is a recognized pattern category
 */
function isValidPatternCategory(value: string): boolean {
  return (PATTERN_CATEGORIES as readonly string[]).includes(value);
}

/**
 * Capitalize the first letter of a string.
 *
 * @param str - Input string
 * @returns String with first letter capitalized
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
