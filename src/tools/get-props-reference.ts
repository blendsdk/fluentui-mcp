/**
 * Tool: get_props_reference — Extract the props/slots table for a component.
 *
 * Returns only the props and slots reference for a component, rendered from the
 * structured schema. This gives the LLM a focused view of the component's API
 * surface without the surrounding prose, examples, or guidance.
 *
 * @module tools/get-props-reference
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { GetPropsReferenceArgs, ComponentEntry } from '../types/index.js';
import { formatPropsTable, formatSlotsTable } from '../formatters/props-formatter.js';

/**
 * Execute the get_props_reference tool.
 *
 * @param store - The populated schema store to query
 * @param args - Tool arguments containing the component name
 * @returns Formatted markdown string with the props reference,
 *          or an error message if the component was not found
 *
 * @example
 * ```typescript
 * const props = getPropsReference(store, { componentName: "Button" });
 * ```
 */
export function getPropsReference(
  store: SchemaStore,
  args: GetPropsReferenceArgs
): string {
  const { componentName } = args;

  if (!componentName || componentName.trim().length === 0) {
    return formatError('Component name is required. Example: "Button", "Dialog", "Input"');
  }

  const component = store.findComponentFuzzy(componentName.trim());

  if (!component) {
    return formatNotFound(componentName, store);
  }

  if (component.props.length === 0 && component.slots.length === 0) {
    return formatNoProps(component);
  }

  return formatPropsResponse(component);
}

/**
 * Format the props/slots reference for a component.
 *
 * @param component - The component to render
 * @returns Formatted markdown string
 */
function formatPropsResponse(component: ComponentEntry): string {
  const parts: string[] = [];

  parts.push(`# ${component.name} — Props Reference`);
  parts.push('');
  parts.push(`**Package:** \`${component.packageName}\``);
  parts.push(`**Import:** \`${component.importStatement}\``);
  parts.push('');
  parts.push('---');
  parts.push('');
  parts.push('## Props');
  parts.push('');
  parts.push(formatPropsTable(component));

  const slots = formatSlotsTable(component);
  if (slots !== '') {
    parts.push('');
    parts.push('## Slots');
    parts.push('');
    parts.push(slots);
  }

  return parts.join('\n');
}

/**
 * Format a message when the component has no props or slots.
 *
 * @param component - The component entry
 * @returns Helpful message suggesting alternatives
 */
function formatNoProps(component: ComponentEntry): string {
  return [
    `# ${component.name} — No Props Reference Found`,
    '',
    `The schema for "${component.name}" does not contain any documented props or slots.`,
    '',
    '**Suggestions:**',
    '- Use `query_component` to see the full documentation',
    '- Use `list_by_category` to find components with props tables',
  ].join('\n');
}

/**
 * Format a "not found" error when the component doesn't exist.
 *
 * @param name - The component name that was searched for
 * @param store - The schema store (for generating suggestions)
 * @returns Formatted error message with available components
 */
function formatNotFound(name: string, store: SchemaStore): string {
  const parts: string[] = [];
  parts.push(`Component "${name}" not found.`);
  parts.push('');

  const withProps = store
    .getAllComponents()
    .filter((c) => c.props.length > 0)
    .map((c) => c.name)
    .sort();

  if (withProps.length > 0) {
    parts.push('**Components with props references:**');
    parts.push(withProps.join(', '));
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
