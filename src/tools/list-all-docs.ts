/**
 * Tool: list_all_docs — List all indexed documentation entries.
 *
 * Returns a structured overview of every document in the store,
 * grouped by module and category. Useful for getting a bird's-eye
 * view of what documentation is available.
 *
 * This is a utility tool — no arguments required.
 *
 * @module tools/list-all-docs
 */

import type { DocumentStore } from '../indexer/document-store.js';

/**
 * Execute the list_all_docs tool.
 *
 * Returns a formatted overview of all indexed documents grouped by
 * module and category, with document counts and available categories.
 *
 * @param store - The populated document store
 * @returns Formatted markdown string listing all indexed documentation
 *
 * @example
 * ```typescript
 * const result = listAllDocs(store);
 * // Returns grouped list of all docs with counts
 * ```
 */
export function listAllDocs(store: DocumentStore): string {
  if (store.size === 0) {
    return formatEmpty();
  }

  return formatDocumentOverview(store);
}

/**
 * Format the complete document overview grouped by module and category.
 *
 * Structure:
 * - Summary with total counts
 * - Each module section with its documents
 * - Components sub-grouped by category
 *
 * @param store - The populated document store
 * @returns Formatted markdown overview
 */
function formatDocumentOverview(store: DocumentStore): string {
  const parts: string[] = [];

  // Header with summary
  const modules = store.getModules();
  const categories = store.getCategories();

  parts.push('# FluentUI Documentation Index');
  parts.push('');
  parts.push(`**Total documents:** ${store.size}`);
  parts.push(`**Modules:** ${modules.map((m) => `${m.module} (${m.count})`).join(', ')}`);

  if (categories.length > 0) {
    parts.push(`**Component categories:** ${categories.map((c) => `${c.category} (${c.count})`).join(', ')}`);
  }

  parts.push('');
  parts.push('---');

  // List each module's documents
  for (const { module } of modules) {
    parts.push('');
    parts.push(formatModuleSection(store, module));
  }

  return parts.join('\n');
}

/**
 * Format a single module section with its documents.
 *
 * For the "components" module, documents are sub-grouped by category.
 * For other modules, documents are listed as a flat list.
 *
 * @param store - The document store
 * @param module - The module name to format
 * @returns Formatted markdown section for this module
 */
function formatModuleSection(
  store: DocumentStore,
  module: string
): string {
  const parts: string[] = [];
  const moduleName = capitalize(module);

  // Use type assertion since getByModule expects DocumentModule
  // but we're iterating from getModules() which returns string
  const docs = store.getByModule(module as Parameters<typeof store.getByModule>[0]);

  parts.push(`## ${moduleName} (${docs.length} docs)`);
  parts.push('');

  if (module === 'components') {
    // Group components by category for better readability
    const byCategory = new Map<string, typeof docs>();
    for (const doc of docs) {
      const cat = doc.category || 'other';
      const existing = byCategory.get(cat);
      if (existing) {
        existing.push(doc);
      } else {
        byCategory.set(cat, [doc]);
      }
    }

    for (const [category, categoryDocs] of byCategory) {
      parts.push(`### ${capitalize(category)}`);
      for (const doc of categoryDocs) {
        parts.push(formatDocumentLine(doc.title, doc.id, doc.metadata.hasPropsTable, doc.metadata.hasCodeExamples));
      }
      parts.push('');
    }
  } else {
    // Flat list for non-component modules
    for (const doc of docs) {
      parts.push(formatDocumentLine(doc.title, doc.id, doc.metadata.hasPropsTable, doc.metadata.hasCodeExamples));
    }
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a single document line with indicators for available content.
 *
 * @param title - Document title
 * @param id - Document ID
 * @param hasProps - Whether the doc has a props table
 * @param hasExamples - Whether the doc has code examples
 * @returns Formatted line string
 */
function formatDocumentLine(
  title: string,
  id: string,
  hasProps: boolean,
  hasExamples: boolean
): string {
  const indicators: string[] = [];
  if (hasProps) indicators.push('📋 props');
  if (hasExamples) indicators.push('💻 examples');

  const suffix = indicators.length > 0 ? ` (${indicators.join(', ')})` : '';
  return `- **${title}** — \`${id}\`${suffix}`;
}

/**
 * Format a message when no documents are indexed.
 *
 * @returns Error message with troubleshooting tips
 */
function formatEmpty(): string {
  return [
    '**No documents indexed.**',
    '',
    'The document store is empty. This may indicate:',
    '- The docs directory was not found',
    '- No .md files were discovered during scanning',
    '- An error occurred during indexing',
    '',
    'Try the `reindex` tool to rebuild the index.',
  ].join('\n');
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
