/**
 * Tool: query_component — Look up complete documentation for a FluentUI component.
 *
 * Supports partial and fuzzy name matching (e.g., "button" finds "Button",
 * "toggle" finds "ToggleButton"). Returns a full markdown reference page
 * rendered on the fly from the structured schema via the component formatter.
 *
 * This is the primary tool for getting detailed component information
 * including props, slots, examples, accessibility, and usage guidance.
 *
 * @module tools/query-component
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { QueryComponentArgs } from '../types/index.js';
import { formatFull } from '../formatters/component-formatter.js';

/**
 * Execute the query_component tool.
 *
 * Looks up a component by name using the store's fuzzy matching and renders
 * the complete reference page from schema data.
 *
 * @param store - The populated schema store to query
 * @param args - Tool arguments containing the component name
 * @returns Formatted markdown documentation, or an error message if not found
 *
 * @example
 * ```typescript
 * const result = queryComponent(store, { componentName: "button" });
 * // Returns full Button documentation
 * ```
 */
export function queryComponent(
  store: SchemaStore,
  args: QueryComponentArgs
): string {
  const { componentName } = args;

  if (!componentName || componentName.trim().length === 0) {
    return formatError('Component name is required. Example: "Button", "Dialog", "Input"');
  }

  const component = store.findComponentFuzzy(componentName.trim());

  if (!component) {
    return formatNotFound(componentName, store);
  }

  return formatFull(component);
}

/**
 * Format a "not found" error message with helpful suggestions.
 *
 * Lists available components grouped by category so the user/LLM can see
 * what's available and try a different name.
 *
 * @param name - The component name that wasn't found
 * @param store - The schema store (for generating suggestions)
 * @returns Formatted error message with suggestions
 */
function formatNotFound(name: string, store: SchemaStore): string {
  const parts: string[] = [];
  parts.push(`Component "${name}" not found.`);
  parts.push('');

  const components = store.getAllComponents();
  if (components.length > 0) {
    parts.push('**Available components:**');

    // Group by category for readability.
    const byCategory = new Map<string, string[]>();
    for (const component of components) {
      const cat = component.category || 'other';
      const existing = byCategory.get(cat);
      if (existing) {
        existing.push(component.name);
      } else {
        byCategory.set(cat, [component.name]);
      }
    }

    for (const [category, names] of byCategory) {
      parts.push(`- **${category}:** ${names.sort().join(', ')}`);
    }

    parts.push('');
    parts.push('*Tip: Use partial names (e.g., "button" for Button, "toggle" for ToggleButton)*');
  }

  return parts.join('\n');
}

/**
 * Format a generic error message.
 *
 * @param message - The error description
 * @returns Formatted error string
 */
function formatError(message: string): string {
  return `**Error:** ${message}`;
}
