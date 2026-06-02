/**
 * Formatter for {@link PatternEntry} documents.
 *
 * Patterns compose multiple components into a real-world usage recipe (e.g. a
 * login form). Like guides they carry authored markdown in `content`, but they
 * also include complete, multi-component working examples that this formatter
 * renders under an "Examples" heading.
 *
 * Formatters are stateless and exported as plain functions.
 *
 * @module formatters/pattern-formatter
 */

import type { PatternEntry, PatternEntryExample } from '../types/index.js';

/** Joins non-empty section strings with blank lines between them. */
function joinSections(sections: Array<string | undefined>): string {
  return sections
    .map((s) => (s ?? '').trim())
    .filter((s) => s !== '')
    .join('\n\n');
}

/**
 * Render a single pattern example: a heading, optional description, the list of
 * components it uses, and a fenced code block.
 */
function formatPatternExample(example: PatternEntryExample): string {
  const parts = [`### ${example.name}`];
  if (example.description && example.description.trim() !== '') {
    parts.push('', example.description.trim());
  }
  if (example.components.length > 0) {
    parts.push('', `**Uses**: ${example.components.join(', ')}`);
  }
  parts.push('', '```tsx', example.code.trim(), '```');
  return parts.join('\n');
}

/**
 * Format a pattern as markdown.
 *
 * @param pattern - The pattern to render.
 * @returns Markdown containing the pattern body, its examples, and referenced
 *   components.
 */
export function formatPattern(pattern: PatternEntry): string {
  const header = joinSections([
    `# ${pattern.title}`,
    pattern.group ? `> **Group**: ${pattern.group}` : '',
  ]);

  const examples =
    pattern.examples.length > 0
      ? joinSections([
          '## Examples',
          ...pattern.examples.map(formatPatternExample),
        ])
      : '';

  const referenced =
    pattern.referencedComponents.length > 0
      ? `**Referenced components**: ${pattern.referencedComponents.join(', ')}`
      : '';

  return joinSections([
    header,
    pattern.content?.trim() ?? '',
    examples,
    referenced,
  ]);
}

/**
 * Format a brief one-line summary of a pattern for list output.
 *
 * @param pattern - The pattern to summarise.
 * @returns A compact markdown summary.
 */
export function formatPatternSummary(pattern: PatternEntry): string {
  return `**${pattern.title}** (\`${pattern.id}\`, group: ${pattern.group})`;
}
