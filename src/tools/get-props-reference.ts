/**
 * Tool: get_props_reference — Extract the props table from a FluentUI component's documentation.
 *
 * Returns only the props/slots reference section from a component's docs,
 * stripped of all other content. This gives the LLM a focused view of
 * the component's API surface without the noise of usage examples and patterns.
 *
 * If the document doesn't have a dedicated "Props Reference" section,
 * it falls back to scanning for any markdown tables that look like prop definitions.
 *
 * @module tools/get-props-reference
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { GetPropsReferenceArgs, DocumentEntry } from '../types/index.js';
import { extractPropsSection } from '../indexer/metadata-extractor.js';

/**
 * Execute the get_props_reference tool.
 *
 * Looks up a component by name and extracts the props/slots reference
 * tables from its documentation.
 *
 * @param store - The populated document store to search
 * @param args - Tool arguments containing the component name
 * @returns Formatted markdown string with the props reference,
 *          or an error message if the component was not found or has no props table
 *
 * @example
 * ```typescript
 * const props = getPropsReference(store, { componentName: "Button" });
 * // Returns Button props table with Prop, Type, Default, Description columns
 * ```
 */
export function getPropsReference(
  store: DocumentStore,
  args: GetPropsReferenceArgs
): string {
  const { componentName } = args;

  if (!componentName || componentName.trim().length === 0) {
    return formatError('Component name is required. Example: "Button", "Dialog", "Input"');
  }

  // Find the component using fuzzy matching
  const doc = store.findByName(componentName.trim());

  if (!doc) {
    return formatNotFound(componentName, store);
  }

  // Extract the props section using the metadata extractor utility
  const propsSection = extractPropsSection(doc.content);

  // If no formal props section, try to extract any prop-like tables
  if (!propsSection) {
    const fallbackTables = extractPropTables(doc.content);
    if (fallbackTables.length > 0) {
      return formatFallbackPropsResponse(doc, fallbackTables);
    }
    return formatNoProps(doc);
  }

  return formatPropsResponse(doc, propsSection);
}

/**
 * Extract markdown tables that appear to contain prop definitions.
 *
 * This is a fallback strategy for docs that don't have a formal
 * "## Props Reference" section but do contain tables with prop information.
 * Looks for tables whose headers contain "Prop", "Type", or "Description".
 *
 * @param content - Raw markdown content
 * @returns Array of table strings that look like prop tables
 */
function extractPropTables(content: string): string[] {
  const tables: string[] = [];
  const lines = content.split('\n');

  let inTable = false;
  let currentTable: string[] = [];
  let isPropTable = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect table start (line starting with |)
    if (trimmed.startsWith('|') && !inTable) {
      inTable = true;
      currentTable = [trimmed];

      // Check if this is a prop-like table by inspecting the header row
      const headerLower = trimmed.toLowerCase();
      isPropTable = headerLower.includes('prop') ||
                    headerLower.includes('type') ||
                    headerLower.includes('slot') ||
                    (headerLower.includes('name') && headerLower.includes('description'));
      continue;
    }

    // Continue collecting table rows
    if (inTable && trimmed.startsWith('|')) {
      currentTable.push(trimmed);
      continue;
    }

    // End of table — save it if it looked like a prop table
    if (inTable && !trimmed.startsWith('|')) {
      inTable = false;
      if (isPropTable && currentTable.length >= 3) {
        // At least header + separator + one data row
        tables.push(currentTable.join('\n'));
      }
      currentTable = [];
      isPropTable = false;
    }
  }

  // Handle table at end of document
  if (inTable && isPropTable && currentTable.length >= 3) {
    tables.push(currentTable.join('\n'));
  }

  return tables;
}

/**
 * Format the response with the formal props section from the document.
 *
 * @param doc - The component document entry
 * @param propsSection - The extracted props section markdown
 * @returns Formatted markdown string
 */
function formatPropsResponse(
  doc: DocumentEntry,
  propsSection: string
): string {
  const parts: string[] = [];

  // Header with component info
  parts.push(`# ${doc.title} — Props Reference`);
  parts.push('');

  if (doc.metadata.packageName) {
    parts.push(`**Package:** \`${doc.metadata.packageName}\``);
  }
  if (doc.metadata.importStatement) {
    parts.push(`**Import:** \`${doc.metadata.importStatement}\``);
  }

  parts.push('');
  parts.push('---');
  parts.push('');

  // The extracted props section (already includes heading and tables)
  parts.push(propsSection);

  return parts.join('\n');
}

/**
 * Format the response using fallback prop tables (when no formal section exists).
 *
 * @param doc - The component document entry
 * @param tables - Array of extracted prop-like table strings
 * @returns Formatted markdown string
 */
function formatFallbackPropsResponse(
  doc: DocumentEntry,
  tables: string[]
): string {
  const parts: string[] = [];

  parts.push(`# ${doc.title} — Props Reference`);
  parts.push('');

  if (doc.metadata.packageName) {
    parts.push(`**Package:** \`${doc.metadata.packageName}\``);
  }
  if (doc.metadata.importStatement) {
    parts.push(`**Import:** \`${doc.metadata.importStatement}\``);
  }

  parts.push('');
  parts.push('*Note: Extracted from inline tables (no formal Props Reference section found)*');
  parts.push('');
  parts.push('---');
  parts.push('');

  for (let i = 0; i < tables.length; i++) {
    if (tables.length > 1) {
      parts.push(`### Table ${i + 1}`);
      parts.push('');
    }
    parts.push(tables[i]);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a message when the component exists but has no props table.
 *
 * @param doc - The component document entry
 * @returns Helpful message suggesting alternatives
 */
function formatNoProps(doc: DocumentEntry): string {
  const parts: string[] = [];
  parts.push(`# ${doc.title} — No Props Reference Found`);
  parts.push('');
  parts.push(`The documentation for "${doc.title}" does not contain a props reference table.`);
  parts.push('');

  // Check if it's a non-component doc (pattern, foundation, etc.)
  if (doc.module !== 'components') {
    parts.push(`*Note: "${doc.title}" is a ${doc.module} document, not a component.*`);
    parts.push('Props tables are typically found only in component documentation.');
    parts.push('');
  }

  parts.push('**Suggestions:**');
  parts.push('- Use `query_component` to see the full documentation');
  parts.push('- Use `list_by_category` to find components with props tables');
  parts.push('- Use `search_docs` to search for specific prop names');

  return parts.join('\n');
}

/**
 * Format a "not found" error when the component doesn't exist.
 *
 * @param name - The component name that was searched for
 * @param store - The document store (for generating suggestions)
 * @returns Formatted error message with available components
 */
function formatNotFound(name: string, store: DocumentStore): string {
  const parts: string[] = [];
  parts.push(`Component "${name}" not found.`);
  parts.push('');

  // List available components that have props tables
  const componentDocs = store.getByModule('components');
  const withProps = componentDocs.filter((doc) => doc.metadata.hasPropsTable);

  if (withProps.length > 0) {
    parts.push('**Components with props references:**');
    const names = withProps.map((doc) => doc.title).sort();
    parts.push(names.join(', '));
    parts.push('');
    parts.push('*Tip: Use partial names (e.g., "button" for Button)*');
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
