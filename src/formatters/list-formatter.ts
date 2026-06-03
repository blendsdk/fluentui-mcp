/**
 * Formatters that render lists/overviews of schema entries as markdown.
 *
 * Used by the listing tools (`list_by_category`, `list_all_docs`) and to render
 * category/module overviews. These operate on plain data passed in by the
 * caller, keeping them decoupled from the {@link SchemaStore}.
 *
 * Formatters are stateless and exported as plain functions.
 *
 * @module formatters/list-formatter
 */

import type { ComponentEntry, GuideEntry, PatternEntry } from '../types/index.js';
import { formatSummary } from './component-formatter.js';

/**
 * Format a list of components as a markdown bullet list of summaries.
 *
 * @param components - The components to list.
 * @param title - Optional heading to render above the list.
 * @returns Markdown bullet list, or an empty-state notice.
 */
export function formatComponentList(
  components: readonly ComponentEntry[],
  title?: string,
): string {
  const heading = title ? `## ${title}\n\n` : '';
  if (components.length === 0) {
    return `${heading}_No components found._`;
  }
  const items = [...components]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((c) => `- ${formatSummary(c)}`);
  return `${heading}${items.join('\n')}`;
}

/**
 * Format a category → count overview as a markdown table.
 *
 * Accepts either a `Map` (as produced by `SchemaStore.getCategories`) or a
 * plain record. Categories are sorted alphabetically.
 *
 * @param categories - Mapping of category name to component count.
 * @returns Markdown table of categories and counts.
 */
export function formatCategoryOverview(
  categories: Map<string, number> | Record<string, number>,
): string {
  const entries =
    categories instanceof Map
      ? [...categories.entries()]
      : Object.entries(categories);

  if (entries.length === 0) {
    return '_No categories found._';
  }

  const sorted = entries.sort((a, b) => a[0].localeCompare(b[0]));
  const header = '| Category | Components |';
  const divider = '|----------|------------|';
  const rows = sorted.map(([name, count]) => `| ${name} | ${count} |`);
  return [header, divider, ...rows].join('\n');
}

/**
 * Format a simple markdown bullet list of module names.
 *
 * @param modules - Ordered module names.
 * @returns Markdown bullet list, or an empty-state notice.
 */
export function formatModuleList(modules: readonly string[]): string {
  if (modules.length === 0) {
    return '_No modules available._';
  }
  return modules.map((m) => `- ${m}`).join('\n');
}

/**
 * Format a combined "all docs" overview spanning components, utilities, guides,
 * and patterns. Each section is included only when it has entries.
 *
 * @param data - The collections to render.
 * @returns A multi-section markdown overview.
 */
export function formatAllDocs(data: {
  components: readonly ComponentEntry[];
  utilities: readonly { name: string; id: string }[];
  foundation: readonly GuideEntry[];
  patterns: readonly PatternEntry[];
  enterprise: readonly GuideEntry[];
  quickReference: readonly GuideEntry[];
}): string {
  const sections: string[] = [];

  if (data.components.length > 0) {
    sections.push(formatComponentList(data.components, 'Components'));
  }

  if (data.utilities.length > 0) {
    const items = [...data.utilities]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((u) => `- **${u.name}** (\`${u.id}\`)`);
    sections.push(['## Utilities', '', ...items].join('\n'));
  }

  const guideSections: Array<[string, readonly GuideEntry[]]> = [
    ['Foundation', data.foundation],
    ['Enterprise', data.enterprise],
    ['Quick Reference', data.quickReference],
  ];
  for (const [label, guides] of guideSections) {
    if (guides.length > 0) {
      const items = [...guides]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map((g) => `- **${g.title}** (\`${g.id}\`)`);
      sections.push([`## ${label}`, '', ...items].join('\n'));
    }
  }

  if (data.patterns.length > 0) {
    const items = [...data.patterns]
      .sort((a, b) => a.title.localeCompare(b.title))
      .map((p) => `- **${p.title}** (\`${p.id}\`, group: ${p.group})`);
    sections.push(['## Patterns', '', ...items].join('\n'));
  }

  if (sections.length === 0) {
    return '_No documentation available._';
  }

  return sections.join('\n\n');
}
