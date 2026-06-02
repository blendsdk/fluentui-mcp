/**
 * Tool: list_by_category — List all FluentUI components in a specific category.
 *
 * Returns a structured list of all components belonging to a given category
 * (e.g., "buttons", "forms", "navigation"), with brief summaries rendered from
 * the structured schema. When no category is given, returns an overview of all
 * available categories with component counts.
 *
 * @module tools/list-by-category
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { ListByCategoryArgs } from '../types/index.js';
import { formatComponentList } from '../formatters/list-formatter.js';

/**
 * Execute the list_by_category tool.
 *
 * @param store - The populated schema store to query
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
  store: SchemaStore,
  args: ListByCategoryArgs
): string {
  const { category } = args;

  if (!category || category.trim().length === 0) {
    return formatCategoryList(store);
  }

  const normalizedCategory = category.trim().toLowerCase();
  if (!isValidCategory(normalizedCategory, store)) {
    return formatInvalidCategory(normalizedCategory, store);
  }

  const components = store.getComponentsByCategory(normalizedCategory);

  if (components.length === 0) {
    return `No components found in category "${normalizedCategory}".`;
  }

  const heading = `${capitalize(normalizedCategory)} Components`;
  const countLine = `*${components.length} component${components.length === 1 ? '' : 's'} in this category*`;
  return [`## ${heading}`, '', countLine, '', formatComponentList(components)].join('\n');
}

/**
 * Format a list of all available categories with component counts.
 *
 * Shown when no category is specified, so the user can pick one.
 *
 * @param store - The schema store to get categories from
 * @returns Formatted markdown string listing all categories
 */
function formatCategoryList(store: SchemaStore): string {
  const parts: string[] = [];

  parts.push('## Available Component Categories');
  parts.push('');

  const categories = store.getCategories();

  if (categories.size === 0) {
    parts.push('No categories found. The schema may be empty.');
    return parts.join('\n');
  }

  for (const [category, count] of categories) {
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
 * @param store - The schema store for listing valid categories
 * @returns Formatted error message with available categories
 */
function formatInvalidCategory(
  invalidCategory: string,
  store: SchemaStore
): string {
  const parts: string[] = [];
  parts.push(`**Error:** Invalid category "${invalidCategory}".`);
  parts.push('');
  parts.push('**Valid categories:**');

  const categories = store.getCategories();
  if (categories.size > 0) {
    for (const [category, count] of categories) {
      parts.push(`- **${category}** (${count} components)`);
    }
  } else {
    parts.push('*(No categories discovered — the schema may be empty)*');
  }

  return parts.join('\n');
}

/**
 * Check if a string is a valid category by querying the store.
 * Validates dynamically against what was actually present in the schema.
 *
 * @param value - The string to validate
 * @param store - The schema store to check against
 * @returns True if the value is a recognized category in the store
 */
function isValidCategory(value: string, store: SchemaStore): boolean {
  return store.getCategories().has(value);
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
