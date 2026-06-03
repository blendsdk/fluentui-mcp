/**
 * Tool: get_foundation — Get FluentUI foundation documentation.
 *
 * Returns documentation for core FluentUI topics like getting started,
 * FluentProvider setup, theming, styling with Griffel, component architecture,
 * and accessibility — rendered from the structured schema's foundation guides.
 *
 * Supports topic aliases for convenience (e.g., "theme" → "theming",
 * "a11y" → "accessibility", "css" → "styling-griffel").
 *
 * When called without a topic, returns an overview of all available
 * foundation guides present in the schema.
 *
 * @module tools/get-foundation
 */

import type { SchemaStore } from '../schema/schema-store.js';
import type { GetFoundationArgs, GuideEntry } from '../types/index.js';
import {
  FOUNDATION_TOPICS,
  FOUNDATION_TOPIC_ALIASES,
} from '../types/index.js';
import type { FoundationTopic } from '../types/index.js';
import { formatGuide } from '../formatters/guide-formatter.js';

/**
 * Execute the get_foundation tool.
 *
 * If a topic is provided, returns the full guide for that topic.
 * If no topic is provided, returns an overview listing all available guides.
 *
 * @param store - The populated schema store to query
 * @param args - Tool arguments with optional topic name
 * @returns Formatted markdown string with the foundation documentation
 *
 * @example
 * ```typescript
 * const result = getFoundation(store, { topic: "theming" });
 * const overview = getFoundation(store, {});
 * ```
 */
export function getFoundation(
  store: SchemaStore,
  args: GetFoundationArgs
): string {
  const { topic } = args;

  // No topic specified — return overview of all foundation guides.
  if (!topic || topic.trim().length === 0) {
    return formatFoundationOverview(store);
  }

  // Resolve topic aliases (e.g., "theme" → "theming", "a11y" → "accessibility").
  const resolvedTopic = resolveTopic(topic.trim().toLowerCase());

  if (!resolvedTopic) {
    return formatInvalidTopic(topic);
  }

  // Find the guide for this topic. Guide ids match canonical topic names.
  const guide = findFoundationGuide(store, resolvedTopic);

  if (!guide) {
    return formatTopicNotIndexed(resolvedTopic);
  }

  return [`> **Module:** foundation`, '', formatGuide(guide)].join('\n');
}

/**
 * Resolve a user-provided topic string to a canonical FoundationTopic.
 *
 * Tries exact match first, then the alias map, then partial matching.
 *
 * @param input - User-provided topic string (lowercase, trimmed)
 * @returns The canonical FoundationTopic, or null if not recognized
 */
function resolveTopic(input: string): FoundationTopic | null {
  if ((FOUNDATION_TOPICS as readonly string[]).includes(input)) {
    return input as FoundationTopic;
  }

  const aliased = FOUNDATION_TOPIC_ALIASES[input];
  if (aliased) {
    return aliased;
  }

  for (const topic of FOUNDATION_TOPICS) {
    if (topic.includes(input) || input.includes(topic)) {
      return topic;
    }
  }

  return null;
}

/**
 * Find the foundation guide in the store for a resolved topic.
 *
 * Tries the exact guide id (which matches the canonical topic name), then
 * falls back to matching against guide ids/titles.
 *
 * @param store - The schema store to search
 * @param topic - The resolved foundation topic name
 * @returns The matching guide, or undefined if not found
 */
function findFoundationGuide(
  store: SchemaStore,
  topic: FoundationTopic
): GuideEntry | undefined {
  const byId = store.getFoundationGuide(topic);
  if (byId) {
    return byId;
  }

  // Fallback: fuzzy match against id/title for guides whose id differs.
  const guides = store.getAllFoundationGuides();
  return guides.find(
    (g) =>
      g.id.includes(topic) ||
      topic.includes(g.id) ||
      g.title.toLowerCase().includes(topic)
  );
}

/**
 * Format the overview of all available foundation guides.
 *
 * @param store - The schema store for getting actual guide data
 * @returns Formatted markdown overview
 */
function formatFoundationOverview(store: SchemaStore): string {
  const parts: string[] = [];

  parts.push('## FluentUI Foundation Documentation');
  parts.push('');
  parts.push('Core topics covering FluentUI setup, architecture, and design principles.');
  parts.push('');

  const guides = store.getAllFoundationGuides();

  if (guides.length === 0) {
    parts.push('*No foundation guides are available in the current schema.*');
    return parts.join('\n');
  }

  for (const guide of guides) {
    parts.push(`### ${guide.title}`);

    const aliases = getAliasesForTopic(guide.id);
    if (aliases.length > 0) {
      parts.push(`*Aliases: ${aliases.join(', ')}*`);
    }

    parts.push(`*Use \`get_foundation("${guide.id}")\` for full documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format an error message for an unrecognized topic.
 *
 * @param topic - The invalid topic string
 * @returns Error message with available topics
 */
function formatInvalidTopic(topic: string): string {
  const parts: string[] = [];
  parts.push(`**Error:** Foundation topic "${topic}" not recognized.`);
  parts.push('');
  parts.push('**Available topics:**');

  for (const t of FOUNDATION_TOPICS) {
    const aliases = getAliasesForTopic(t);
    const aliasNote = aliases.length > 0 ? ` (aliases: ${aliases.join(', ')})` : '';
    parts.push(`- **${t}**${aliasNote}`);
  }

  parts.push('');
  parts.push('*Omit the topic parameter to get an overview of all foundation docs.*');

  return parts.join('\n');
}

/**
 * Format an error for a topic that is recognized but not present in the schema.
 *
 * @param topic - The recognized but missing topic
 * @returns Error message
 */
function formatTopicNotIndexed(topic: string): string {
  return `Foundation topic "${topic}" is recognized but no guide was found in the schema. The schema may be incomplete.`;
}

/**
 * Get all aliases that map to a given canonical topic.
 *
 * @param topic - The canonical foundation topic
 * @returns Array of alias strings
 */
function getAliasesForTopic(topic: string): string[] {
  const aliases: string[] = [];
  for (const [alias, target] of Object.entries(FOUNDATION_TOPIC_ALIASES)) {
    if (target === topic) {
      aliases.push(alias);
    }
  }
  return aliases;
}
