/**
 * Shared helpers for guide-generation prompts.
 *
 * Provides a compact serialization of the component inventory used to
 * ground guide/pattern prompts so generated code references only real
 * component names and import paths.
 *
 * @module enhancer/prompts/shared
 */

import type { ComponentEntry } from '../../../src/types/schema.js';
import type { ComponentSummary } from '../types.js';

/** Number of representative props to include per component summary. */
const KEY_PROPS_LIMIT = 6;

/**
 * Build a compact {@link ComponentSummary} from a full component entry.
 *
 * Selects up to {@link KEY_PROPS_LIMIT} props, preferring required props
 * first so the most important API surface is always represented.
 *
 * @param component - The raw component entry
 * @returns A compact summary for prompt grounding
 */
export function toComponentSummary(
  component: ComponentEntry,
): ComponentSummary {
  const required = component.props.filter((p) => p.required).map((p) => p.name);
  const optional = component.props
    .filter((p) => !p.required)
    .map((p) => p.name);
  const keyProps = [...required, ...optional].slice(0, KEY_PROPS_LIMIT);

  return {
    name: component.name,
    category: component.category,
    importStatement: component.importStatement,
    keyProps,
  };
}

/**
 * Build component summaries for an array of components.
 *
 * @param components - The raw component entries
 * @returns An array of compact summaries
 */
export function buildComponentSummaries(
  components: ComponentEntry[],
): ComponentSummary[] {
  return components.map(toComponentSummary);
}

/**
 * Serialize component summaries into a compact text block for prompts.
 *
 * Each line is `Name (category): importStatement [props: a, b, c]`.
 *
 * @param summaries - The component summaries to serialize
 * @returns A newline-delimited string
 */
export function serializeComponentSummaries(
  summaries: ComponentSummary[],
): string {
  return summaries
    .map(
      (s) =>
        `- ${s.name} (${s.category}): ${s.importStatement}` +
        (s.keyProps.length > 0 ? ` [props: ${s.keyProps.join(', ')}]` : ''),
    )
    .join('\n');
}
