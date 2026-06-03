/**
 * Tool: get_enterprise — Get FluentUI enterprise pattern documentation.
 *
 * Returns documentation for enterprise-scale application patterns:
 * - app-shell: Application shell and layout
 * - dashboard: KPI cards, charts, real-time updates
 * - admin: CRUD operations, user management, settings
 * - data: Virtualization, filtering/sorting, export/import
 * - accessibility: WCAG compliance, keyboard/focus, screen readers
 *
 * Enterprise guides are stored individually in the schema. Requesting a topic
 * returns all related guides (matched by id prefix), rendered from schema data.
 *
 * @module tools/get-enterprise
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { GetEnterpriseArgs, GuideEntry } from '../types/index.js';
import { formatGuide } from '../formatters/guide-formatter.js';

/**
 * Enterprise topic groups.
 *
 * Each group maps to one or more enterprise guides. The key is the user-facing
 * topic name; `matchesGuide` tests whether a guide belongs to the group based
 * on its id/title.
 */
const ENTERPRISE_TOPICS: Record<string, {
  /** Display name for the topic group */
  displayName: string;
  /** Brief description of what this topic covers */
  description: string;
  /** Test if a guide belongs to this topic (based on id/title) */
  matchesGuide: (idOrTitle: string) => boolean;
}> = {
  'app-shell': {
    displayName: 'Application Shell',
    description: 'Application shell patterns — layout, navigation, and overall app structure.',
    matchesGuide: (s) => s.includes('app-shell') || s.includes('shell'),
  },
  'dashboard': {
    displayName: 'Dashboard Patterns',
    description: 'Dashboard components — KPI cards, charts/widgets, and real-time data updates.',
    matchesGuide: (s) => s.includes('dashboard'),
  },
  'admin': {
    displayName: 'Admin Panel Patterns',
    description: 'Admin interfaces — CRUD operations, user management, and settings panels.',
    matchesGuide: (s) => s.includes('admin'),
  },
  'data': {
    displayName: 'Data Management',
    description: 'Data handling at scale — virtualization, filtering/sorting, and export/import.',
    matchesGuide: (s) => s.includes('data'),
  },
  'accessibility': {
    displayName: 'Enterprise Accessibility',
    description: 'Accessibility at scale — WCAG compliance, keyboard/focus management, and screen readers.',
    matchesGuide: (s) => s.includes('accessibility'),
  },
};

/**
 * Aliases for enterprise topics.
 */
const ENTERPRISE_TOPIC_ALIASES: Record<string, string> = {
  'shell': 'app-shell',
  'layout': 'app-shell',
  'kpi': 'dashboard',
  'charts': 'dashboard',
  'widgets': 'dashboard',
  'realtime': 'dashboard',
  'real-time': 'dashboard',
  'crud': 'admin',
  'users': 'admin',
  'user-management': 'admin',
  'settings': 'admin',
  'virtualization': 'data',
  'filtering': 'data',
  'sorting': 'data',
  'export': 'data',
  'import': 'data',
  'a11y': 'accessibility',
  'wcag': 'accessibility',
  'keyboard': 'accessibility',
  'screen-reader': 'accessibility',
  'screen-readers': 'accessibility',
};

/**
 * Execute the get_enterprise tool.
 *
 * If a topic is provided, returns all enterprise guides for that topic group.
 * If no topic is provided, returns an overview of all enterprise topics.
 *
 * @param store - The populated schema store to query
 * @param args - Tool arguments with the enterprise topic
 * @returns Formatted markdown string with enterprise documentation
 *
 * @example
 * ```typescript
 * const result = getEnterprise(store, { topic: "dashboard" });
 * const overview = getEnterprise(store, { topic: "" });
 * ```
 */
export function getEnterprise(
  store: SchemaStore,
  args: GetEnterpriseArgs
): string {
  const { topic } = args;

  // No topic — show overview of all enterprise topics.
  if (!topic || topic.trim().length === 0) {
    return formatEnterpriseOverview(store);
  }

  const resolvedTopic = resolveTopic(topic.trim().toLowerCase());

  if (!resolvedTopic) {
    return formatInvalidTopic(topic);
  }

  const topicConfig = ENTERPRISE_TOPICS[resolvedTopic];
  const matchingGuides = matchGuides(store, topicConfig.matchesGuide);

  if (matchingGuides.length === 0) {
    return `No enterprise documentation found for topic "${resolvedTopic}". The schema may be incomplete.`;
  }

  return formatEnterpriseTopicResponse(resolvedTopic, topicConfig.displayName, matchingGuides);
}

/**
 * Get all enterprise guides matching a predicate (on lowercased id/title).
 */
function matchGuides(
  store: SchemaStore,
  matches: (idOrTitle: string) => boolean
): GuideEntry[] {
  return store.getAllEnterpriseGuides().filter((g) => {
    return matches(g.id.toLowerCase()) || matches(g.title.toLowerCase());
  });
}

/**
 * Resolve a user-provided topic to a canonical enterprise topic key.
 *
 * @param input - User-provided topic string (lowercase, trimmed)
 * @returns Canonical topic key, or null if not recognized
 */
function resolveTopic(input: string): string | null {
  if (ENTERPRISE_TOPICS[input]) {
    return input;
  }

  const aliased = ENTERPRISE_TOPIC_ALIASES[input];
  if (aliased) {
    return aliased;
  }

  for (const key of Object.keys(ENTERPRISE_TOPICS)) {
    if (key.includes(input) || input.includes(key)) {
      return key;
    }
  }

  return null;
}

/**
 * Format an overview of all enterprise topic groups.
 *
 * @param store - Schema store for guide counts
 * @returns Formatted markdown overview
 */
function formatEnterpriseOverview(store: SchemaStore): string {
  const parts: string[] = [];

  parts.push('## FluentUI Enterprise Documentation');
  parts.push('');
  parts.push('Enterprise-scale application patterns and best practices.');
  parts.push('');

  for (const [topicKey, config] of Object.entries(ENTERPRISE_TOPICS)) {
    const matchingGuides = matchGuides(store, config.matchesGuide);

    parts.push(`### ${config.displayName}`);
    parts.push(config.description);
    parts.push(`*${matchingGuides.length} document${matchingGuides.length === 1 ? '' : 's'} available*`);

    if (matchingGuides.length > 0) {
      const titles = matchingGuides.map((g) => g.title).join(', ');
      parts.push(`Topics: ${titles}`);
    }

    parts.push(`*Use \`get_enterprise("${topicKey}")\` for full documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format the response for an enterprise topic group.
 *
 * @param topicKey - The enterprise topic key
 * @param displayName - Human-readable topic name
 * @param guides - Matching guides
 * @returns Formatted markdown with all guides in the topic
 */
function formatEnterpriseTopicResponse(
  topicKey: string,
  displayName: string,
  guides: GuideEntry[]
): string {
  const parts: string[] = [];

  parts.push(`# ${displayName}`);
  parts.push('');
  parts.push('**Module:** enterprise');
  parts.push(`**Topic:** ${topicKey}`);
  parts.push(`**Documents:** ${guides.length}`);
  parts.push('');

  const sorted = [...guides].sort((a, b) => a.id.localeCompare(b.id));

  if (sorted.length > 1) {
    parts.push('## Table of Contents');
    parts.push('');
    for (const guide of sorted) {
      parts.push(`- ${guide.title}`);
    }
    parts.push('');
  }

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0) {
      parts.push('');
      parts.push('---');
      parts.push('');
    }
    parts.push(formatGuide(sorted[i]));
  }

  return parts.join('\n');
}

/**
 * Format an error message for an unrecognized enterprise topic.
 *
 * @param topic - The invalid topic string
 * @returns Error message with available topics and aliases
 */
function formatInvalidTopic(topic: string): string {
  const parts: string[] = [];
  parts.push(`**Error:** Enterprise topic "${topic}" not recognized.`);
  parts.push('');
  parts.push('**Available enterprise topics:**');

  for (const [key, config] of Object.entries(ENTERPRISE_TOPICS)) {
    const aliases = Object.entries(ENTERPRISE_TOPIC_ALIASES)
      .filter(([, target]) => target === key)
      .map(([alias]) => alias);
    const aliasNote = aliases.length > 0 ? ` (aliases: ${aliases.join(', ')})` : '';

    parts.push(`- **${key}** — ${config.description}${aliasNote}`);
  }

  parts.push('');
  parts.push('*Provide an empty topic to get an overview of all enterprise docs.*');

  return parts.join('\n');
}
