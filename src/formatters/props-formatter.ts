/**
 * Formatters for a component's props and slots as markdown tables.
 *
 * These convert the structured {@link PropEntry} and {@link SlotEntry} data
 * into the GitHub-flavoured markdown tables consumed by the MCP tools
 * (`get_props_reference` and the props section of `query_component`).
 *
 * Formatters are stateless and exported as plain functions, consistent with the
 * rest of the codebase (the stateful {@link SchemaStore} is the exception).
 *
 * @module formatters/props-formatter
 */

import type { ComponentEntry, PropEntry, SlotEntry } from '../types/index.js';

/** Placeholder rendered when a cell has no meaningful value. */
const EMPTY_CELL = '—';

/**
 * Escape a value for safe inclusion inside a markdown table cell.
 *
 * The pipe character delimits columns, so any literal `|` (common in union
 * types like `'a' | 'b'`) must be escaped to avoid breaking the table.
 * Newlines are collapsed to spaces so a single cell stays on one row.
 */
function escapeCell(value: string): string {
  return value.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

/**
 * Wrap a value in backticks for inline-code rendering, escaping table-breaking
 * characters first. Returns the {@link EMPTY_CELL} placeholder for empty input.
 */
function code(value: string | undefined): string {
  if (value === undefined || value.trim() === '') {
    return EMPTY_CELL;
  }
  return `\`${escapeCell(value)}\``;
}

/**
 * Sort props alphabetically by name for stable, predictable output.
 * The scraper order is not guaranteed, so we normalise it here.
 */
function sortByName<T extends { name: string }>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Render a single prop as a markdown table row.
 * Deprecated props are annotated inline within the description cell.
 */
function formatPropRow(prop: PropEntry): string {
  const name = code(prop.name);
  const type = code(prop.type);
  const defaultValue = prop.defaultValue ? code(prop.defaultValue) : EMPTY_CELL;
  const required = prop.required ? 'Yes' : 'No';

  let description = prop.description ? escapeCell(prop.description) : EMPTY_CELL;
  if (prop.deprecated) {
    const note = prop.deprecationMessage
      ? `**Deprecated:** ${escapeCell(prop.deprecationMessage)}`
      : '**Deprecated**';
    description = description === EMPTY_CELL ? note : `${description} ${note}`;
  }

  return `| ${name} | ${type} | ${defaultValue} | ${required} | ${description} |`;
}

/**
 * Render the element column for a slot, combining the primary element type
 * with any alternative types (e.g. a `root` slot that can be `button` or `a`).
 */
function formatSlotElement(slot: SlotEntry): string {
  const types = [slot.elementType, ...(slot.alternativeTypes ?? [])].filter(
    (t) => t && t.trim() !== '',
  );
  if (types.length === 0) {
    return EMPTY_CELL;
  }
  return code(types.join(' | '));
}

/**
 * Render a single slot as a markdown table row.
 */
function formatSlotRow(slot: SlotEntry): string {
  const name = code(slot.name);
  const element = formatSlotElement(slot);
  const required = slot.required ? 'Yes' : 'No';
  const description = slot.description ? escapeCell(slot.description) : EMPTY_CELL;
  return `| ${name} | ${element} | ${required} | ${description} |`;
}

/**
 * Format a component's props as a markdown table.
 *
 * Returns a short notice instead of an empty table when the component has no
 * documented props, so downstream output never contains a header-only table.
 *
 * @param component - The component whose props to format.
 * @returns Markdown containing a props table (or an empty-state notice).
 */
export function formatPropsTable(component: ComponentEntry): string {
  if (component.props.length === 0) {
    return '_No documented props._';
  }

  const header = '| Prop | Type | Default | Required | Description |';
  const divider = '|------|------|---------|----------|-------------|';
  const rows = sortByName(component.props).map(formatPropRow);
  return [header, divider, ...rows].join('\n');
}

/**
 * Format a component's slots as a markdown table.
 *
 * Returns an empty string when the component has no slots, allowing callers to
 * omit the slots section entirely rather than render an empty heading.
 *
 * @param component - The component whose slots to format.
 * @returns Markdown containing a slots table, or an empty string if none.
 */
export function formatSlotsTable(component: ComponentEntry): string {
  if (component.slots.length === 0) {
    return '';
  }

  const header = '| Slot | Element | Required | Description |';
  const divider = '|------|---------|----------|-------------|';
  const rows = sortByName(component.slots).map(formatSlotRow);
  return [header, divider, ...rows].join('\n');
}
