/**
 * Tool: list_by_category — List all FluentUI components in a specific category.
 *
 * Returns a structured list of all components belonging to a given category
 * (e.g., "buttons", "forms", "navigation"). Includes brief descriptions
 * and metadata for each component.
 *
 * Valid categories: buttons, forms, navigation, data-display, feedback,
 * overlays, layout, utilities.
 *
 * @module tools/list-by-category
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { ListByCategoryArgs, DocumentEntry } from '../types/index.js';

/**
 * Execute the list_by_category tool.
 *
 * Lists all components in a given category with their titles,
 * descriptions, and metadata indicators.
 *
 * @param store - The populated document store to query
 * @param args - Tool arguments containing the category name
 * @returns Formatted markdown string with the component list,
 *          or an error message for invalid categories
 *
 * @example
 * ```typescript
 * const result = listByCategory(store, { category: "buttons" });
 * // Returns list of Button, CompoundButton, MenuButton, etc.
 * ```
 */
export function listByCategory(
  store: DocumentStore,
  args: ListByCategoryArgs
): string {
  const { category } = args;

  if (!category || category.trim().length === 0) {
    return formatCategoryList(store);
  }

  // Validate category against what the store actually contains (fully dynamic)
  const normalizedCategory = category.trim().toLowerCase();
  if (!isValidCategory(normalizedCategory, store)) {
    return formatInvalidCategory(normalizedCategory, store);
  }

  const docs = store.getByCategory(normalizedCategory);

  if (docs.length === 0) {
    return `No components found in category "${normalizedCategory}".`;
  }

  return formatCategoryResponse(normalizedCategory, docs);
}

/**
 * Format the response for a valid category with components.
 *
 * Lists each component with its description, package info,
 * and indicators for props/examples availability.
 *
 * @param category - The category name
 * @param docs - Array of documents in this category
 * @returns Formatted markdown string
 */
function formatCategoryResponse(
  category: string,
  docs: DocumentEntry[]
): string {
  const parts: string[] = [];

  parts.push(`## ${capitalize(category)} Components`);
  parts.push(`*${docs.length} component${docs.length === 1 ? '' : 's'} in this category*`);
  parts.push('');

  // Sort alphabetically by title
  const sorted = [...docs].sort((a, b) => a.title.localeCompare(b.title));

  for (const doc of sorted) {
    // Component name with metadata indicators
    const indicators: string[] = [];
    if (doc.metadata.hasCodeExamples) {
      indicators.push('💻 examples');
    }
    if (doc.metadata.hasPropsTable) {
      indicators.push('📋 props');
    }
    const indicatorStr = indicators.length > 0 ? ` (${indicators.join(', ')})` : '';

    parts.push(`### ${doc.title}${indicatorStr}`);

    // Import statement if available
    if (doc.metadata.importStatement) {
      parts.push(`\`${doc.metadata.importStatement}\``);
    }

    // Description
    if (doc.metadata.description) {
      parts.push(doc.metadata.description);
    }

    // Usage hint
    parts.push(`*Use \`query_component("${doc.title}")\` for full documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a list of all available categories with document counts.
 *
 * Shown when no category is specified, so the user can pick one.
 *
 * @param store - The document store to get categories from
 * @returns Formatted markdown string listing all categories
 */
function formatCategoryList(store: DocumentStore): string {
  const parts: string[] = [];

  parts.push('## Available Component Categories');
  parts.push('');

  const categories = store.getCategories();

  if (categories.length === 0) {
    parts.push('No categories found. The document index may be empty.');
    return parts.join('\n');
  }

  for (const { category, count } of categories) {
    parts.push(`- **${category}** — ${count} component${count === 1 ? '' : 's'}`);
  }

  parts.push('');
  parts.push('*Use `list_by_category("category-name")` to see components in a category*');

  return parts.join('\n');
}

/**
 * Format an error message for an invalid category with suggestions.
 *
 * @param invalidCategory - The invalid category name provided
 * @param store - The document store for listing valid categories
 * @returns Formatted error message with available categories
 */
function formatInvalidCategory(
  invalidCategory: string,
  store: DocumentStore
): string {
  const parts: string[] = [];
  parts.push(`**Error:** Invalid category "${invalidCategory}".`);
  parts.push('');
  parts.push('**Valid categories:**');

  const categories = store.getCategories();
  if (categories.length > 0) {
    for (const { category, count } of categories) {
      parts.push(`- **${category}** (${count} components)`);
    }
  } else {
    parts.push('*(No categories discovered — the document index may be empty)*');
  }

  return parts.join('\n');
}

/**
 * Check if a string is a valid ComponentCategory by querying the store.
 * Validates dynamically against what was actually discovered from the docs folder.
 *
 * @param value - The string to validate
 * @param store - The document store to check against
 * @returns True if the value is a recognized category in the store
 */
function isValidCategory(value: string, store: DocumentStore): boolean {
  const categories = store.getCategories();
  return categories.some((c) => c.category === value);
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
