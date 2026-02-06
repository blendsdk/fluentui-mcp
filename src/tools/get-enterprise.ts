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
 * Enterprise docs are organized by topic groups. Requesting a topic
 * returns all related documents (e.g., "dashboard" returns KPI cards,
 * charts, and real-time docs).
 *
 * @module tools/get-enterprise
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { GetEnterpriseArgs, DocumentEntry } from '../types/index.js';

/**
 * Enterprise topic groups.
 *
 * Each group maps to one or more files in the 04-enterprise/ folder.
 * The key is the user-facing topic name, the value contains display info
 * and a matcher function for filtering docs.
 */
const ENTERPRISE_TOPICS: Record<string, {
  /** Display name for the topic group */
  displayName: string;
  /** Brief description of what this topic covers */
  description: string;
  /** Test if a document belongs to this topic (based on filename) */
  matchesDoc: (filename: string) => boolean;
}> = {
  'app-shell': {
    displayName: 'Application Shell',
    description: 'Application shell patterns — layout, navigation, and overall app structure.',
    matchesDoc: (f) => f.includes('app-shell'),
  },
  'dashboard': {
    displayName: 'Dashboard Patterns',
    description: 'Dashboard components — KPI cards, charts/widgets, and real-time data updates.',
    matchesDoc: (f) => f.includes('dashboard'),
  },
  'admin': {
    displayName: 'Admin Panel Patterns',
    description: 'Admin interfaces — CRUD operations, user management, and settings panels.',
    matchesDoc: (f) => f.includes('admin'),
  },
  'data': {
    displayName: 'Data Management',
    description: 'Data handling at scale — virtualization, filtering/sorting, and export/import.',
    matchesDoc: (f) => f.includes('data-'),
  },
  'accessibility': {
    displayName: 'Enterprise Accessibility',
    description: 'Accessibility at scale — WCAG compliance, keyboard/focus management, and screen readers.',
    matchesDoc: (f) => f.includes('accessibility'),
  },
};

/**
 * Aliases for enterprise topics.
 * Enables users to use shorthand or alternate names.
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
 * If a topic is provided, returns all enterprise docs for that topic group.
 * If no topic is provided, returns an overview of all enterprise topics.
 *
 * @param store - The populated document store to query
 * @param args - Tool arguments with the enterprise topic
 * @returns Formatted markdown string with enterprise documentation
 *
 * @example
 * ```typescript
 * // Get all dashboard enterprise docs
 * const result = getEnterprise(store, { topic: "dashboard" });
 *
 * // Get overview
 * const overview = getEnterprise(store, { topic: "" });
 * ```
 */
export function getEnterprise(
  store: DocumentStore,
  args: GetEnterpriseArgs
): string {
  const { topic } = args;

  // No topic — show overview of all enterprise topics
  if (!topic || topic.trim().length === 0) {
    return formatEnterpriseOverview(store);
  }

  // Resolve topic (with alias support)
  const resolvedTopic = resolveTopic(topic.trim().toLowerCase());

  if (!resolvedTopic) {
    return formatInvalidTopic(topic);
  }

  // Get matching enterprise docs
  const topicConfig = ENTERPRISE_TOPICS[resolvedTopic];
  const enterpriseDocs = store.getByModule('enterprise');
  const matchingDocs = enterpriseDocs.filter((doc) => {
    const filename = doc.relativePath.split('/').pop() || '';
    return topicConfig.matchesDoc(filename);
  });

  if (matchingDocs.length === 0) {
    return `No enterprise documentation found for topic "${resolvedTopic}". The docs directory may be incomplete.`;
  }

  return formatEnterpriseTopicResponse(resolvedTopic, topicConfig.displayName, matchingDocs);
}

/**
 * Resolve a user-provided topic to a canonical enterprise topic key.
 *
 * @param input - User-provided topic string (lowercase, trimmed)
 * @returns Canonical topic key, or null if not recognized
 */
function resolveTopic(input: string): string | null {
  // Direct match
  if (ENTERPRISE_TOPICS[input]) {
    return input;
  }

  // Alias match
  const aliased = ENTERPRISE_TOPIC_ALIASES[input];
  if (aliased) {
    return aliased;
  }

  // Partial match — find a topic key that contains the input
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
 * @param store - Document store for doc counts
 * @returns Formatted markdown overview
 */
function formatEnterpriseOverview(store: DocumentStore): string {
  const parts: string[] = [];

  parts.push('## FluentUI Enterprise Documentation');
  parts.push('');
  parts.push('Enterprise-scale application patterns and best practices.');
  parts.push('');

  const enterpriseDocs = store.getByModule('enterprise');

  for (const [topicKey, config] of Object.entries(ENTERPRISE_TOPICS)) {
    const matchingDocs = enterpriseDocs.filter((doc) => {
      const filename = doc.relativePath.split('/').pop() || '';
      return config.matchesDoc(filename);
    });

    parts.push(`### ${config.displayName}`);
    parts.push(config.description);
    parts.push(`*${matchingDocs.length} document${matchingDocs.length === 1 ? '' : 's'} available*`);

    // Show doc titles
    if (matchingDocs.length > 0) {
      const titles = matchingDocs.map((doc) => doc.title).join(', ');
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
 * Concatenates all matching documents with separators between them.
 *
 * @param topicKey - The enterprise topic key
 * @param displayName - Human-readable topic name
 * @param docs - Matching documents
 * @returns Formatted markdown with all docs in the topic
 */
function formatEnterpriseTopicResponse(
  topicKey: string,
  displayName: string,
  docs: DocumentEntry[]
): string {
  const parts: string[] = [];

  parts.push(`# ${displayName}`);
  parts.push('');
  parts.push('**Module:** enterprise');
  parts.push(`**Topic:** ${topicKey}`);
  parts.push(`**Documents:** ${docs.length}`);
  parts.push('');

  // Sort by relative path (preserves numeric ordering: 02a, 02b, 02c)
  const sorted = [...docs].sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath)
  );

  // If multiple docs, show a table of contents first
  if (sorted.length > 1) {
    parts.push('## Table of Contents');
    parts.push('');
    for (const doc of sorted) {
      parts.push(`- ${doc.title}`);
    }
    parts.push('');
  }

  // Output each document with a separator
  for (let i = 0; i < sorted.length; i++) {
    const doc = sorted[i];

    if (i > 0) {
      parts.push('');
      parts.push('---');
      parts.push('');
    }

    parts.push(doc.content);
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
    // Find aliases for this topic
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
