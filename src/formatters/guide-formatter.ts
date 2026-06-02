/**
 * Formatter for {@link GuideEntry} documents (foundation, enterprise, and
 * quick-reference guides).
 *
 * Guides already carry fully-authored markdown in their `content` field. This
 * formatter wraps that content with a consistent title and metadata header, and
 * appends any structured code examples that are not already inline in the body.
 *
 * Formatters are stateless and exported as plain functions.
 *
 * @module formatters/guide-formatter
 */

import type { GuideEntry, GuideCodeExample } from '../types/index.js';

/** Joins non-empty section strings with blank lines between them. */
function joinSections(sections: Array<string | undefined>): string {
  return sections
    .map((s) => (s ?? '').trim())
    .filter((s) => s !== '')
    .join('\n\n');
}

/**
 * Render a single code example as a titled, fenced block.
 */
function formatCodeExample(example: GuideCodeExample): string {
  const language = example.language?.trim() || 'tsx';
  const parts = [`### ${example.title}`];
  if (example.description && example.description.trim() !== '') {
    parts.push('', example.description.trim());
  }
  parts.push('', '```' + language, example.code.trim(), '```');
  return parts.join('\n');
}

/**
 * Render the "Referenced Components" footer when a guide references components.
 */
function formatReferenced(guide: GuideEntry): string {
  if (guide.referencedComponents.length === 0) {
    return '';
  }
  return `**Referenced components**: ${guide.referencedComponents.join(', ')}`;
}

/**
 * Format a guide as markdown.
 *
 * The guide's authored `content` forms the body. A title heading and category
 * line are prepended, and structured `codeExamples` are appended under an
 * "Examples" heading when present.
 *
 * @param guide - The guide to render.
 * @param includeExamples - Whether to append structured code examples
 *   (default `true`). Some content already embeds its examples inline.
 * @returns Markdown for the guide.
 */
export function formatGuide(guide: GuideEntry, includeExamples = true): string {
  const header = joinSections([
    `# ${guide.title}`,
    guide.category ? `> **Category**: ${guide.category}` : '',
  ]);

  const examples =
    includeExamples && guide.codeExamples.length > 0
      ? joinSections([
          '## Examples',
          ...guide.codeExamples.map(formatCodeExample),
        ])
      : '';

  return joinSections([
    header,
    guide.content?.trim() ?? '',
    examples,
    formatReferenced(guide),
  ]);
}

/**
 * Format a brief one-line summary of a guide for list output.
 *
 * @param guide - The guide to summarise.
 * @returns A compact markdown bullet-friendly summary.
 */
export function formatGuideSummary(guide: GuideEntry): string {
  return `**${guide.title}** (\`${guide.id}\`)`;
}
