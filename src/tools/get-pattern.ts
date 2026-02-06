/**
 * Tool: get_pattern — Get FluentUI pattern documentation.
 *
 * Returns documentation for implementation patterns organized by category:
 * composition, data, forms, layout, modals, navigation, state.
 *
 * When called with just a category, returns an index of all patterns
 * in that category. When called with a specific pattern name,
 * returns the full documentation for that pattern.
 *
 * @module tools/get-pattern
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { GetPatternArgs, DocumentEntry } from '../types/index.js';
import { PATTERN_CATEGORIES } from '../types/index.js';

/**
 * Execute the get_pattern tool.
 *
 * If only a category is provided, lists all patterns in that category.
 * If a specific pattern name is also given, returns its full documentation.
 * If neither is provided, shows all available pattern categories.
 *
 * @param store - The populated document store to query
 * @param args - Tool arguments with pattern category and optional pattern name
 * @returns Formatted markdown string with pattern documentation
 *
 * @example
 * ```typescript
 * // List all form patterns
 * const list = getPattern(store, { patternCategory: "forms" });
 *
 * // Get a specific pattern
 * const doc = getPattern(store, { patternCategory: "forms", patternName: "validation" });
 * ```
 */
export function getPattern(
  store: DocumentStore,
  args: GetPatternArgs
): string {
  const { patternCategory, patternName } = args;

  // No category — show all pattern categories
  if (!patternCategory || patternCategory.trim().length === 0) {
    return formatPatternOverview(store);
  }

  const normalizedCategory = patternCategory.trim().toLowerCase();

  // Validate category
  if (!isValidPatternCategory(normalizedCategory)) {
    return formatInvalidPatternCategory(normalizedCategory);
  }

  // Get all pattern docs in this category
  const categoryDocs = getPatternDocsForCategory(store, normalizedCategory);

  // If a specific pattern was requested, find and return it
  if (patternName && patternName.trim().length > 0) {
    return findAndFormatPattern(categoryDocs, patternName.trim(), normalizedCategory);
  }

  // No specific pattern — list all patterns in the category
  return formatPatternCategoryList(normalizedCategory, categoryDocs);
}

/**
 * Get all pattern documents that belong to a specific pattern category.
 *
 * Pattern docs are in the "patterns" module and their relative path
 * contains the category folder name (e.g., "03-patterns/forms/...").
 *
 * @param store - The document store to query
 * @param category - The pattern category folder name
 * @returns Array of documents in the pattern category
 */
function getPatternDocsForCategory(
  store: DocumentStore,
  category: string
): DocumentEntry[] {
  const allPatterns = store.getByModule('patterns');

  // Filter to docs whose relative path contains the category folder
  return allPatterns.filter((doc) => {
    const pathParts = doc.relativePath.split('/');
    // Pattern paths: "03-patterns/{category}/{file}.md"
    // pathParts[1] should be the category folder name
    return pathParts.length >= 2 && pathParts[1] === category;
  });
}

/**
 * Find a specific pattern by name within a set of category docs.
 *
 * Tries exact match on title, then partial/fuzzy matching.
 *
 * @param docs - Pattern documents in the category
 * @param name - Pattern name to find
 * @param category - The category (for error messages)
 * @returns Formatted markdown for the pattern, or error if not found
 */
function findAndFormatPattern(
  docs: DocumentEntry[],
  name: string,
  category: string
): string {
  const normalized = name.toLowerCase();

  // Strategy 1: Match title contains the name
  let match = docs.find((doc) =>
    doc.title.toLowerCase().includes(normalized)
  );

  // Strategy 2: Match filename contains the name
  if (!match) {
    match = docs.find((doc) => {
      const filename = doc.relativePath.split('/').pop()?.replace('.md', '') || '';
      // Strip numeric prefix from filename (e.g., "02-validation" → "validation")
      const cleanFilename = filename.replace(/^\d+-/, '');
      return cleanFilename.includes(normalized) || normalized.includes(cleanFilename);
    });
  }

  // Strategy 3: Match document ID contains the name
  if (!match) {
    match = docs.find((doc) =>
      doc.id.toLowerCase().includes(normalized)
    );
  }

  if (!match) {
    return formatPatternNotFound(name, category, docs);
  }

  return formatPatternResponse(match);
}

/**
 * Format an overview of all available pattern categories.
 *
 * @param store - The document store for getting doc counts per category
 * @returns Formatted markdown overview
 */
function formatPatternOverview(store: DocumentStore): string {
  const parts: string[] = [];

  parts.push('## FluentUI Pattern Documentation');
  parts.push('');
  parts.push('Implementation patterns and best practices for common UI scenarios.');
  parts.push('');

  for (const category of PATTERN_CATEGORIES) {
    const docs = getPatternDocsForCategory(store, category);
    const count = docs.length;

    parts.push(`### ${capitalize(category)} Patterns`);
    parts.push(`*${count} pattern${count === 1 ? '' : 's'} available*`);

    // Show brief list of pattern titles
    if (docs.length > 0) {
      const titles = docs.map((doc) => doc.title).join(', ');
      parts.push(`Topics: ${titles}`);
    }

    parts.push(`*Use \`get_pattern("${category}")\` to see all patterns*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a list of all patterns within a specific category.
 *
 * @param category - The pattern category name
 * @param docs - Documents in this category
 * @returns Formatted markdown list
 */
function formatPatternCategoryList(
  category: string,
  docs: DocumentEntry[]
): string {
  const parts: string[] = [];

  parts.push(`## ${capitalize(category)} Patterns`);
  parts.push(`*${docs.length} pattern${docs.length === 1 ? '' : 's'} in this category*`);
  parts.push('');

  if (docs.length === 0) {
    parts.push('No patterns found in this category.');
    return parts.join('\n');
  }

  // Sort by filename (which is ordered by numeric prefix)
  const sorted = [...docs].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath)
  );

  for (const doc of sorted) {
    const indicators: string[] = [];
    if (doc.metadata.hasCodeExamples) {
      indicators.push('💻 examples');
    }
    const indicatorStr = indicators.length > 0 ? ` (${indicators.join(', ')})` : '';

    parts.push(`### ${doc.title}${indicatorStr}`);

    if (doc.metadata.description) {
      parts.push(doc.metadata.description);
    }

    // Extract a clean pattern name for the tool hint
    const patternName = extractPatternName(doc);
    parts.push(`*Use \`get_pattern("${category}", "${patternName}")\` for full documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format the full documentation for a single pattern.
 *
 * @param doc - The pattern document entry
 * @returns Formatted markdown with header and full content
 */
function formatPatternResponse(doc: DocumentEntry): string {
  const parts: string[] = [];

  parts.push(`# ${doc.title}`);
  parts.push('');
  parts.push('**Module:** patterns');
  if (doc.metadata.hasCodeExamples) {
    parts.push('**Has code examples:** yes');
  }
  parts.push('');
  parts.push('---');
  parts.push('');
  parts.push(doc.content);

  return parts.join('\n');
}

/**
 * Format an error message when a specific pattern is not found.
 *
 * @param name - The pattern name that wasn't found
 * @param category - The category that was searched
 * @param availableDocs - Documents available in the category (for suggestions)
 * @returns Formatted error message
 */
function formatPatternNotFound(
  name: string,
  category: string,
  availableDocs: DocumentEntry[]
): string {
  const parts: string[] = [];
  parts.push(`Pattern "${name}" not found in category "${category}".`);
  parts.push('');

  if (availableDocs.length > 0) {
    parts.push('**Available patterns in this category:**');
    for (const doc of availableDocs) {
      const patternName = extractPatternName(doc);
      parts.push(`- ${doc.title} → \`get_pattern("${category}", "${patternName}")\``);
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
 * Extract a clean pattern name from a document for use in tool hints.
 *
 * Strips numeric prefix and extension from the filename.
 *
 * @param doc - The document entry
 * @returns Clean pattern name string
 */
function extractPatternName(doc: DocumentEntry): string {
  const filename = doc.relativePath.split('/').pop()?.replace('.md', '') || '';
  // Remove numeric prefix (e.g., "02-validation" → "validation")
  return filename.replace(/^\d+-/, '');
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
