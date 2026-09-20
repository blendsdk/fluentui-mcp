/**
 * Low-level Markdown builders shared by the skill renderers.
 *
 * Every function here is pure: it takes plain data and returns a string, with
 * no filesystem access and no shared state. Keeping these primitives in one
 * place makes the output style consistent across components, guides, and
 * recipes, and makes the escaping rules easy to audit.
 *
 * Design rules:
 * - Line endings are normalized to `\n` so generated files are identical on
 *   every platform.
 * - Empty sections return an empty string so callers can omit them rather than
 *   emit a dangling heading.
 * - Table cells collapse newlines and escape `|`, because an unescaped pipe
 *   inside a union type such as `'a' | 'b'` would split the row.
 *
 * @module skill/render/sections
 */

/** Placeholder rendered when a value is missing. */
export const EMPTY_CELL = '—';

/** Collapse newlines and trim, so a value always stays on one line. */
function singleLine(value: string): string {
  return value.replace(/\r?\n/g, ' ').trim();
}

/**
 * Escape a value used as the visible label of a Markdown link.
 *
 * Collapses newlines and escapes the square brackets that delimit the label,
 * so a label cannot break out of its link.
 *
 * @param value - Raw label text.
 * @returns The escaped, single-line label.
 */
export function escapeLinkLabel(value: string): string {
  return singleLine(value).replace(/\\/g, '\\\\').replace(/([[\]])/g, '\\$1');
}

/**
 * Join the non-empty parts with a single blank line between them.
 *
 * Falsy entries (empty strings, `undefined`, `false`) are dropped, which lets
 * callers build a document from optional sections without branching.
 *
 * @param parts - Candidate sections; blank values are ignored.
 * @returns The combined document, or an empty string when nothing remains.
 */
export function joinSections(parts: Array<string | undefined | false>): string {
  return parts
    .map((part) => (typeof part === 'string' ? part.trim() : ''))
    .filter((part) => part !== '')
    .join('\n\n');
}

/**
 * Render an ATX heading, clamping the level to the valid 1–6 range.
 *
 * Newlines are collapsed to spaces so a multi-line value cannot inject an
 * extra heading or paragraph.
 *
 * @param level - Requested heading level.
 * @param text - Heading text.
 * @returns The heading line.
 */
export function heading(level: number, text: string): string {
  const safeLevel = Math.min(Math.max(Math.trunc(level), 1), 6);
  return `${'#'.repeat(safeLevel)} ${singleLine(text)}`;
}

/**
 * Render items as a Markdown bullet list.
 *
 * @param items - List items; each is trimmed.
 * @returns One `- item` line per entry, or an empty string when there are none.
 */
export function bulletList(items: readonly string[]): string {
  return items
    .map((item) => item.trim())
    .filter((item) => item !== '')
    .map((item) => `- ${item}`)
    .join('\n');
}

/**
 * Render a bullet list under a level-2 heading.
 *
 * @param title - Heading text without the `##` prefix.
 * @param items - List items; an empty/absent list omits the whole section.
 * @returns The section, or an empty string when there are no items.
 */
export function bulletSection(
  title: string,
  items?: readonly string[],
): string {
  if (!items || items.length === 0) {
    return '';
  }
  return joinSections([heading(2, title), bulletList(items)]);
}

/**
 * Render prose under a level-2 heading.
 *
 * @param title - Heading text without the `##` prefix.
 * @param text - Prose body; blank text omits the whole section.
 * @returns The section, or an empty string when the text is blank.
 */
export function proseSection(title: string, text?: string): string {
  const trimmed = text?.trim();
  if (!trimmed) {
    return '';
  }
  return joinSections([heading(2, title), trimmed]);
}

/**
 * Escape a value for safe inclusion inside a Markdown table cell.
 *
 * Newlines are collapsed to spaces so the row stays on one line, and literal
 * pipes are backslash-escaped so they cannot start a new column.
 *
 * @param value - Raw cell value.
 * @returns The escaped cell value.
 */
export function escapeTableCell(value: string): string {
  return value.replace(/\r?\n/g, ' ').replace(/\|/g, '\\|').trim();
}

/**
 * Render a value as inline code, escaping table-breaking characters first.
 *
 * @param value - Raw value.
 * @returns A backtick-wrapped value, or the {@link EMPTY_CELL} placeholder when
 *   the value is blank.
 */
export function inlineCode(value?: string): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    return EMPTY_CELL;
  }
  return `\`${escapeTableCell(trimmed)}\``;
}

/**
 * Render a GitHub-flavoured Markdown table.
 *
 * @param headers - Column headers.
 * @param rows - Pre-escaped cell values, one array per row.
 * @returns The complete table.
 */
export function table(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): string {
  const header = `| ${headers.join(' | ')} |`;
  const divider = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((row) => `| ${row.join(' | ')} |`);
  return [header, divider, ...body].join('\n');
}

/**
 * Measure the longest run of backticks in a string.
 *
 * Used to pick a code fence that cannot be closed early by the code itself
 * (for example a story that embeds a Markdown code block).
 */
function longestBacktickRun(value: string): number {
  let longest = 0;
  for (const match of value.matchAll(/`+/g)) {
    longest = Math.max(longest, match[0].length);
  }
  return longest;
}

/**
 * Render a fenced code block, choosing a fence long enough to survive any
 * backticks inside the code.
 *
 * @param code - The code to render.
 * @param language - Info string for syntax highlighting (default `tsx`).
 * @returns The fenced block, or an empty string when the code is blank.
 */
export function fencedCode(code: string, language = 'tsx'): string {
  const normalized = code.replace(/\r\n/g, '\n').trim();
  if (normalized === '') {
    return '';
  }
  const fence = '`'.repeat(Math.max(3, longestBacktickRun(normalized) + 1));
  return [`${fence}${language}`, normalized, fence].join('\n');
}

/**
 * Append the generated-file marker as the final line of a document.
 *
 * The marker is added last so a reader (and the drift gate) can recognize a
 * machine-generated file at a glance.
 *
 * @param markdown - The document body.
 * @param marker - The marker comment to append.
 * @returns The document ending with the marker and a trailing newline.
 */
export function appendMarker(markdown: string, marker: string): string {
  return `${markdown.trimEnd()}\n\n${marker}\n`;
}
