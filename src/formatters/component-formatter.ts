/**
 * Formatters that render a {@link ComponentEntry} as markdown for LLM
 * consumption.
 *
 * This is the heart of the schema-driven approach: instead of reading a
 * pre-written markdown file, the MCP server generates documentation on the fly
 * from structured data. The output mirrors the previous hand-written docs so
 * that tool consumers see no breaking change.
 *
 * - {@link formatFull} powers `query_component` (full reference page).
 * - {@link formatSummary} powers list/search results (one-paragraph blurb).
 * - {@link formatExamples} powers `get_component_examples` (stories + patterns).
 *
 * Formatters are stateless and exported as plain functions.
 *
 * @module formatters/component-formatter
 */

import type { ComponentEntry, ComponentEnhanced } from '../types/index.js';
import { formatPropsTable, formatSlotsTable } from './props-formatter.js';
import { formatStories } from './story-formatter.js';

/** Joins non-empty section strings with blank lines between them. */
function joinSections(sections: Array<string | undefined>): string {
  return sections
    .map((s) => (s ?? '').trim())
    .filter((s) => s !== '')
    .join('\n\n');
}

/**
 * Build the metadata header block: title plus a blockquote of package, import,
 * category, and stability. Deprecated components get a prominent warning.
 */
function formatHeader(component: ComponentEntry): string {
  const lines: string[] = [`# ${component.name}`, ''];

  if (component.deprecated) {
    const message = component.deprecationMessage
      ? `: ${component.deprecationMessage}`
      : '';
    lines.push(`> ⚠️ **Deprecated**${message}`, '>');
  }

  lines.push(
    `> **Package**: \`${component.packageName}\`${
      component.packageVersion ? ` v${component.packageVersion}` : ''
    }`,
    `> **Import**: \`${component.importStatement}\``,
    `> **Category**: ${component.category}`,
    `> **Stability**: ${component.stability}`,
  );

  return lines.join('\n');
}

/**
 * Render the Overview section from the enhanced description, falling back to a
 * neutral placeholder when the component has not been enhanced yet.
 */
function formatOverview(component: ComponentEntry): string {
  const description = component.enhanced?.description?.trim();
  const whenToUse = component.enhanced?.whenToUse?.trim();

  const body = description && description !== ''
    ? description
    : `${component.name} is part of the \`${component.packageName}\` package.`;

  const parts = ['## Overview', '', body];
  if (whenToUse && whenToUse !== '') {
    parts.push('', `**When to use**: ${whenToUse}`);
  }
  return parts.join('\n');
}

/**
 * Render the Props Reference section, including the slots table when present.
 */
function formatPropsSection(component: ComponentEntry): string {
  const parts = ['## Props Reference', '', formatPropsTable(component)];

  const slots = formatSlotsTable(component);
  if (slots !== '') {
    parts.push('', '### Slots', '', slots);
  }
  return parts.join('\n');
}

/**
 * Render the Examples section from Storybook stories. Returns an empty string
 * when there are no stories, so the section is omitted entirely.
 */
function formatExamplesSection(component: ComponentEntry): string {
  const stories = formatStories(component, 3);
  if (stories === '') {
    return '';
  }
  return ['## Examples', '', stories].join('\n');
}

/**
 * Render the Best Practices section (Do's / Don'ts) from enhanced content.
 */
function formatBestPractices(enhanced: ComponentEnhanced): string {
  const { dos, donts } = enhanced.bestPractices;
  if (dos.length === 0 && donts.length === 0) {
    return '';
  }

  const parts = ['## Best Practices'];
  if (dos.length > 0) {
    parts.push('', "### ✅ Do's", '', ...dos.map((d) => `- ${d}`));
  }
  if (donts.length > 0) {
    parts.push('', "### ❌ Don'ts", '', ...donts.map((d) => `- ${d}`));
  }
  return parts.join('\n');
}

/**
 * Render the Accessibility section from enhanced content, including a keyboard
 * interaction table, ARIA attributes, and screen-reader behaviour.
 */
function formatAccessibility(enhanced: ComponentEnhanced): string {
  const a11y = enhanced.accessibility;
  const parts = ['## Accessibility'];

  if (a11y.requirements && a11y.requirements.trim() !== '') {
    parts.push('', `**Requirements**: ${a11y.requirements.trim()}`);
  }

  if (a11y.keyboardSupport.length > 0) {
    parts.push(
      '',
      '| Key | Action |',
      '|-----|--------|',
      ...a11y.keyboardSupport.map((k) => `| \`${k.key}\` | ${k.action} |`),
    );
  }

  if (a11y.ariaAttributes.length > 0) {
    parts.push('', `**ARIA**: ${a11y.ariaAttributes.join(', ')}`);
  }

  if (a11y.screenReaderBehavior && a11y.screenReaderBehavior.trim() !== '') {
    parts.push('', `**Screen Reader**: ${a11y.screenReaderBehavior.trim()}`);
  }

  return parts.length > 1 ? parts.join('\n') : '';
}

/**
 * Render the Styling section from enhanced styling tips.
 */
function formatStyling(enhanced: ComponentEnhanced): string {
  const tips = enhanced.stylingTips?.trim();
  if (!tips || tips === '') {
    return '';
  }
  return ['## Styling', '', tips].join('\n');
}

/**
 * Render the "See Also" section from related component names.
 */
function formatSeeAlso(component: ComponentEntry): string {
  if (component.relatedComponents.length === 0) {
    return '';
  }
  return [
    '## See Also',
    '',
    ...component.relatedComponents.map((name) => `- ${name}`),
  ].join('\n');
}

/**
 * Format the full component reference page as markdown.
 *
 * Sections present only when the underlying data exists: enhanced sections
 * (overview detail, best practices, accessibility, styling) are skipped for
 * un-enhanced components, and examples/slots/see-also are skipped when empty.
 *
 * @param component - The component to document.
 * @returns A complete markdown reference page.
 */
export function formatFull(component: ComponentEntry): string {
  const enhanced = component.enhanced;

  return joinSections([
    formatHeader(component),
    formatOverview(component),
    formatPropsSection(component),
    formatExamplesSection(component),
    enhanced ? formatBestPractices(enhanced) : '',
    enhanced ? formatAccessibility(enhanced) : '',
    enhanced ? formatStyling(enhanced) : '',
    formatSeeAlso(component),
  ]);
}

/**
 * Format a brief one-paragraph summary of a component, used in list and search
 * results. Includes the name, package, category, and a short description.
 *
 * @param component - The component to summarise.
 * @returns A compact markdown summary (a single bolded line plus description).
 */
export function formatSummary(component: ComponentEntry): string {
  const description = component.enhanced?.description?.trim();
  const blurb = description && description !== ''
    ? firstSentence(description)
    : `Part of \`${component.packageName}\`.`;

  return `**${component.name}** (${component.category}) — ${blurb}`;
}

/**
 * Format only the examples for a component: Storybook stories followed by any
 * enhanced common patterns. Used by `get_component_examples`.
 *
 * @param component - The component whose examples to render.
 * @returns Markdown with stories and common patterns, or an empty-state notice.
 */
export function formatExamples(component: ComponentEntry): string {
  const sections: string[] = [`# ${component.name} Examples`];

  const stories = formatStories(component, 2);
  if (stories !== '') {
    sections.push(stories);
  }

  const patterns = component.enhanced?.commonPatterns ?? [];
  if (patterns.length > 0) {
    const patternBlocks = patterns.map((p) => {
      const parts = [`## ${p.name}`];
      if (p.description && p.description.trim() !== '') {
        parts.push('', p.description.trim());
      }
      parts.push('', '```tsx', p.code.trim(), '```');
      return parts.join('\n');
    });
    sections.push(...patternBlocks);
  }

  if (sections.length === 1) {
    sections.push('_No examples available._');
  }

  return sections.join('\n\n');
}

/**
 * Extract the first sentence from a block of text for compact summaries.
 * Falls back to the whole string when no sentence terminator is found.
 */
function firstSentence(text: string): string {
  const match = text.match(/^.*?[.!?](?=\s|$)/);
  return (match ? match[0] : text).trim();
}
