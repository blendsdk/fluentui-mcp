/**
 * Tool: get_foundation — Get FluentUI foundation documentation.
 *
 * Returns documentation for core FluentUI topics like getting started,
 * FluentProvider setup, theming, styling with Griffel, component architecture,
 * and accessibility.
 *
 * Supports topic aliases for convenience (e.g., "theme" → "theming",
 * "a11y" → "accessibility", "css" → "styling-griffel").
 *
 * When called without a topic, returns an overview of all available
 * foundation topics.
 *
 * @module tools/get-foundation
 */

import type { DocumentStore } from '../indexer/document-store.js';
import type { GetFoundationArgs, DocumentEntry } from '../types/index.js';
import {
  FOUNDATION_TOPICS,
  FOUNDATION_TOPIC_ALIASES,
  FOUNDATION_TOPIC_FILE_MAP,
} from '../types/index.js';
import type { FoundationTopic } from '../types/index.js';

/**
 * Execute the get_foundation tool.
 *
 * If a topic is provided, returns the full documentation for that topic.
 * If no topic is provided, returns an overview listing all available topics.
 *
 * @param store - The populated document store to query
 * @param args - Tool arguments with optional topic name
 * @returns Formatted markdown string with the foundation documentation
 *
 * @example
 * ```typescript
 * // Get specific topic
 * const result = getFoundation(store, { topic: "theming" });
 *
 * // Get overview of all topics
 * const overview = getFoundation(store, {});
 * ```
 */
export function getFoundation(
  store: DocumentStore,
  args: GetFoundationArgs
): string {
  const { topic } = args;

  // No topic specified — return overview of all foundation docs
  if (!topic || topic.trim().length === 0) {
    return formatFoundationOverview(store);
  }

  // Resolve topic aliases (e.g., "theme" → "theming", "a11y" → "accessibility")
  const resolvedTopic = resolveTopic(topic.trim().toLowerCase());

  if (!resolvedTopic) {
    return formatInvalidTopic(topic);
  }

  // Find the document for this topic in the store
  const doc = findFoundationDoc(store, resolvedTopic);

  if (!doc) {
    return formatTopicNotIndexed(resolvedTopic);
  }

  return formatFoundationResponse(doc);
}

/**
 * Resolve a user-provided topic string to a canonical FoundationTopic.
 *
 * Tries exact match first, then checks the alias map.
 *
 * @param input - User-provided topic string (lowercase, trimmed)
 * @returns The canonical FoundationTopic, or null if not recognized
 */
function resolveTopic(input: string): FoundationTopic | null {
  // Exact match against known topics
  if ((FOUNDATION_TOPICS as readonly string[]).includes(input)) {
    return input as FoundationTopic;
  }

  // Check aliases (e.g., "theme" → "theming", "a11y" → "accessibility")
  const aliased = FOUNDATION_TOPIC_ALIASES[input];
  if (aliased) {
    return aliased;
  }

  // Try partial matching — find a topic that contains the input
  for (const topic of FOUNDATION_TOPICS) {
    if (topic.includes(input) || input.includes(topic)) {
      return topic;
    }
  }

  return null;
}

/**
 * Find the foundation document in the store by topic name.
 *
 * Uses the FOUNDATION_TOPIC_FILE_MAP to build the expected document ID,
 * then falls back to fuzzy name matching if the exact ID isn't found.
 *
 * @param store - The document store to search
 * @param topic - The resolved foundation topic name
 * @returns The matching DocumentEntry, or undefined if not found
 */
function findFoundationDoc(
  store: DocumentStore,
  topic: FoundationTopic
): DocumentEntry | undefined {
  // Try the expected document ID based on the file map
  // The ID is built as: "foundation/{topic}" (without numeric prefix)
  const expectedId = `foundation/${topic}`;
  const byId = store.getById(expectedId);
  if (byId) {
    return byId;
  }

  // Fallback: search by filename pattern in the foundation module
  const fileName = FOUNDATION_TOPIC_FILE_MAP[topic];
  if (fileName) {
    const foundationDocs = store.getByModule('foundation');
    const match = foundationDocs.find((doc) =>
      doc.relativePath.includes(fileName)
    );
    if (match) {
      return match;
    }
  }

  // Last resort: fuzzy name match
  return store.findByName(topic);
}

/**
 * Format the overview of all available foundation topics.
 *
 * Shows each topic with its description and available aliases.
 *
 * @param store - The document store for getting actual doc descriptions
 * @returns Formatted markdown overview
 */
function formatFoundationOverview(store: DocumentStore): string {
  const parts: string[] = [];

  parts.push('## FluentUI Foundation Documentation');
  parts.push('');
  parts.push('Core topics covering FluentUI setup, architecture, and design principles.');
  parts.push('');

  // List each topic with description from the store (if available)
  for (const topic of FOUNDATION_TOPICS) {
    const doc = findFoundationDoc(store, topic);
    const description = doc?.metadata.description || getTopicFallbackDescription(topic);

    parts.push(`### ${formatTopicName(topic)}`);
    parts.push(description);

    // Show aliases for this topic
    const aliases = getAliasesForTopic(topic);
    if (aliases.length > 0) {
      parts.push(`*Aliases: ${aliases.join(', ')}*`);
    }

    parts.push(`*Use \`get_foundation("${topic}")\` for full documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a foundation document response with metadata header.
 *
 * @param doc - The foundation document entry
 * @returns Formatted markdown with header and full content
 */
function formatFoundationResponse(doc: DocumentEntry): string {
  const parts: string[] = [];

  parts.push(`# ${doc.title}`);
  parts.push('');
  parts.push('**Module:** foundation');
  parts.push('');
  parts.push('---');
  parts.push('');
  parts.push(doc.content);

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
 * Format an error for a topic that is recognized but not in the index.
 *
 * This can happen if the docs directory is incomplete.
 *
 * @param topic - The recognized but missing topic
 * @returns Error message
 */
function formatTopicNotIndexed(topic: string): string {
  return `Foundation topic "${topic}" is recognized but no documentation was found in the index. The docs directory may be incomplete.`;
}

/**
 * Get all aliases that map to a given canonical topic.
 *
 * @param topic - The canonical foundation topic
 * @returns Array of alias strings
 */
function getAliasesForTopic(topic: FoundationTopic): string[] {
  const aliases: string[] = [];
  for (const [alias, target] of Object.entries(FOUNDATION_TOPIC_ALIASES)) {
    if (target === topic) {
      aliases.push(alias);
    }
  }
  return aliases;
}

/**
 * Format a topic identifier into a human-readable name.
 *
 * @param topic - Topic identifier (e.g., "getting-started")
 * @returns Human-readable name (e.g., "Getting Started")
 */
function formatTopicName(topic: string): string {
  return topic
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get a fallback description for a topic when the store has no data.
 *
 * @param topic - The foundation topic
 * @returns A brief fallback description
 */
function getTopicFallbackDescription(topic: FoundationTopic): string {
  const descriptions: Record<FoundationTopic, string> = {
    'getting-started': 'Installation, setup, and first steps with FluentUI v9.',
    'fluent-provider': 'The FluentProvider component for theme and direction context.',
    'theming': 'Design tokens, custom themes, and theme customization.',
    'styling-griffel': 'Styling with Griffel — makeStyles, mergeClasses, and CSS-in-JS.',
    'component-architecture': 'Hooks, slots, and the FluentUI component architecture.',
    'accessibility': 'Accessibility patterns, ARIA attributes, and keyboard navigation.',
  };
  return descriptions[topic];
}
