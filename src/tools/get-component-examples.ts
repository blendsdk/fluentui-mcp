/**
 * Tool: get_component_examples — Extract code examples for a FluentUI component.
 *
 * Returns the component's Storybook stories and enhanced common-pattern
 * examples, rendered as copy-pasteable code blocks from the structured schema.
 * Useful when the LLM just needs ready-to-use code rather than full docs.
 *
 * @module tools/get-component-examples
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { GetComponentExamplesArgs, ComponentEntry } from '../types/index.js';
import { formatExamples } from '../formatters/component-formatter.js';

/**
 * Execute the get_component_examples tool.
 *
 * @param store - The populated schema store to query
 * @param args - Tool arguments containing the component name
 * @returns Formatted markdown string with all code examples,
 *          or an error message if the component was not found
 *
 * @example
 * ```typescript
 * const examples = getComponentExamples(store, { componentName: "Button" });
 * ```
 */
export function getComponentExamples(
  store: SchemaStore,
  args: GetComponentExamplesArgs
): string {
  const { componentName } = args;

  if (!componentName || componentName.trim().length === 0) {
    return formatError('Component name is required. Example: "Button", "Dialog", "Input"');
  }

  const component = store.findComponentFuzzy(componentName.trim());

  if (!component) {
    return formatNotFound(componentName, store);
  }

  return formatExamples(component);
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

  const withExamples = store
    .getAllComponents()
    .filter((c: ComponentEntry) => c.stories.length > 0)
    .map((c) => c.name)
    .sort();

  if (withExamples.length > 0) {
    parts.push('**Components with code examples:**');
    parts.push(withExamples.join(', '));
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
