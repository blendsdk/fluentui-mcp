/**
 * Tool: query_component — Look up complete documentation for a FluentUI component.
 *
 * Supports partial and fuzzy name matching (e.g., "button" finds "Button",
 * "toggle" finds "ToggleButton"). Returns the full markdown documentation
 * for the best-matching component.
 *
 * This is the primary tool for getting detailed component information
 * including props, usage patterns, and code examples.
 *
 * @module tools/query-component
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { QueryComponentArgs } from '../types/index.js';

/**
 * Execute the query_component tool.
 *
 * Looks up a component by name using the DocumentStore's fuzzy matching,
 * and returns the complete documentation including metadata header.
 *
 * @param store - The populated document store to search
 * @param args - Tool arguments containing the component name
 * @returns Formatted markdown string with the component documentation,
 *          or an error message if the component was not found
 *
 * @example
 * ```typescript
 * const result = queryComponent(store, { componentName: "button" });
 * // Returns full Button documentation with metadata header
 * ```
 */
export function queryComponent(
  store: DocumentStore,
  args: QueryComponentArgs
): string {
  const { componentName } = args;

  if (!componentName || componentName.trim().length === 0) {
    return formatError('Component name is required. Example: "Button", "Dialog", "Input"');
  }

  // Use the store's fuzzy matching to find the best match
  const doc = store.findByName(componentName.trim());

  if (!doc) {
    return formatNotFound(componentName, store);
  }

  // Build the response with a metadata header followed by full content
  return formatComponentResponse(doc.title, doc.content, doc.metadata.packageName, doc.metadata.importStatement, doc.module, doc.category);
}

/**
 * Format a successful component documentation response.
 *
 * Prepends a structured metadata header to the raw markdown content
 * so the LLM gets key info (package, import) upfront.
 *
 * @param title - Component display name
 * @param content - Full markdown content
 * @param packageName - NPM package name, if known
 * @param importStatement - Import statement, if known
 * @param module - Documentation module
 * @param category - Component category, if applicable
 * @returns Formatted response string
 */
function formatComponentResponse(
  title: string,
  content: string,
  packageName: string | null,
  importStatement: string | null,
  module: string,
  category: string | null
): string {
  const parts: string[] = [];

  // Metadata header — gives the LLM quick-reference info
  parts.push(`# ${title}`);
  parts.push('');

  if (packageName) {
    parts.push(`**Package:** \`${packageName}\``);
  }
  if (importStatement) {
    parts.push(`**Import:** \`${importStatement}\``);
  }
  parts.push(`**Module:** ${module}`);
  if (category) {
    parts.push(`**Category:** ${category}`);
  }

  parts.push('');
  parts.push('---');
  parts.push('');

  // Full documentation content
  parts.push(content);

  return parts.join('\n');
}

/**
 * Format a "not found" error message with helpful suggestions.
 *
 * Lists available components from the store so the user/LLM
 * can see what's available and try a different name.
 *
 * @param name - The component name that wasn't found
 * @param store - The document store (for generating suggestions)
 * @returns Formatted error message with suggestions
 */
function formatNotFound(name: string, store: DocumentStore): string {
  const parts: string[] = [];
  parts.push(`Component "${name}" not found.`);
  parts.push('');

  // Suggest available components from the "components" module
  const componentDocs = store.getByModule('components');
  if (componentDocs.length > 0) {
    parts.push('**Available components:**');
    // Group by category for readability
    const byCategory = new Map<string, string[]>();
    for (const doc of componentDocs) {
      const cat = doc.category || 'other';
      const existing = byCategory.get(cat);
      if (existing) {
        existing.push(doc.title);
      } else {
        byCategory.set(cat, [doc.title]);
      }
    }

    for (const [category, names] of byCategory) {
      parts.push(`- **${category}:** ${names.join(', ')}`);
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
