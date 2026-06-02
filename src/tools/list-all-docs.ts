/**
 * Tool: list_all_docs — List all documentation entries in the schema.
 *
 * Returns a structured overview of every component, utility, guide, and pattern
 * in the schema, grouped by type. Useful for getting a bird's-eye view of what
 * documentation is available.
 *
 * This is a utility tool — no arguments required.
 *
 * @module tools/list-all-docs
 */

import type { SchemaStore } from '../schema/schema-store.js';
import { formatAllDocs } from '../formatters/list-formatter.js';

/**
 * Execute the list_all_docs tool.
 *
 * Returns a formatted overview of all schema content grouped by type, with a
 * summary header showing totals.
 *
 * @param store - The populated schema store
 * @returns Formatted markdown string listing all documentation
 *
 * @example
 * ```typescript
 * const result = listAllDocs(store);
 * ```
 */
export function listAllDocs(store: SchemaStore): string {
  const components = store.getAllComponents();
  const utilities = store.getAllUtilities();
  const foundation = store.getAllFoundationGuides();
  const patterns = store.getAllPatterns();
  const enterprise = store.getAllEnterpriseGuides();
  const quickReference = store.getAllQuickReferences();

  const totalDocs =
    components.length +
    utilities.length +
    foundation.length +
    patterns.length +
    enterprise.length +
    quickReference.length;

  if (totalDocs === 0) {
    return formatEmpty();
  }

  const modules = store.getModules();
  const categories = store.getCategories();

  const header: string[] = [];
  header.push('# FluentUI Documentation Index');
  header.push('');
  header.push(`**Total documents:** ${totalDocs}`);
  header.push(`**Modules:** ${modules.join(', ')}`);

  if (categories.size > 0) {
    const categoryParts = [...categories.entries()].map(([c, n]) => `${c} (${n})`);
    header.push(`**Component categories:** ${categoryParts.join(', ')}`);
  }

  header.push('');
  header.push('---');

  const body = formatAllDocs({
    components,
    utilities,
    foundation,
    patterns,
    enterprise,
    quickReference,
  });

  return [header.join('\n'), body].join('\n\n');
}

/**
 * Format a message when no documents are present in the schema.
 *
 * @returns Error message with troubleshooting tips
 */
function formatEmpty(): string {
  return [
    '**No documents available.**',
    '',
    'The schema is empty. This may indicate:',
    '- The schema file was not found or failed to load',
    '- The schema contains no components, utilities, guides, or patterns',
    '',
    'Try the `reindex` tool to reload the schema.',
  ].join('\n');
}
