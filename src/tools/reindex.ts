/**
 * Tool: reindex — Rebuild the documentation index.
 *
 * Re-scans the docs directory and rebuilds all in-memory indexes
 * (document store + search engine). Useful if documentation files
 * have been added, modified, or removed at runtime.
 *
 * This reuses existing store and search engine instances so that
 * all tool references remain valid after reindexing.
 *
 * @module tools/reindex
 */

import { buildIndex } from '../indexer/index-builder.js';
import type { DocumentStore } from '../indexer/document-store.js';
import type { SearchEngine } from '../indexer/search-engine.js';
import type { IndexStats } from '../indexer/index-builder.js';

/**
 * Execute the reindex tool.
 *
 * Clears all existing data and re-scans the documentation directory,
 * rebuilding the document store and search engine indexes.
 *
 * @param store - The existing document store (will be cleared and repopulated)
 * @param searchEngine - The existing search engine (will be cleared and rebuilt)
 * @param docsPath - Absolute path to the docs version directory
 * @returns Formatted markdown string with reindex results and statistics
 *
 * @example
 * ```typescript
 * const result = await reindex(store, searchEngine, '/path/to/docs/v9');
 * // Returns summary of reindexed documents
 * ```
 */
export async function reindex(
  store: DocumentStore,
  searchEngine: SearchEngine,
  docsPath: string
): Promise<string> {
  try {
    // Track the previous state for comparison
    const previousCount = store.size;

    // Rebuild the index using existing instances (they'll be cleared internally)
    const { stats } = await buildIndex(docsPath, store, searchEngine);

    return formatReindexResult(stats, previousCount);
  } catch (error) {
    return formatReindexError(error, docsPath);
  }
}

/**
 * Format a successful reindex result with statistics.
 *
 * Shows document counts, timing, and breakdown by module/category.
 *
 * @param stats - Indexing statistics from the build operation
 * @param previousCount - How many documents were indexed before
 * @returns Formatted markdown result
 */
function formatReindexResult(stats: IndexStats, previousCount: number): string {
  const parts: string[] = [];

  parts.push('# Reindex Complete ✅');
  parts.push('');

  // Summary
  parts.push(`**Documents indexed:** ${stats.indexedFiles}`);
  parts.push(`**Previous count:** ${previousCount}`);
  parts.push(`**Duration:** ${stats.durationMs}ms`);

  if (stats.failedFiles > 0) {
    parts.push(`**⚠️ Failed files:** ${stats.failedFiles}`);
  }

  parts.push('');

  // Module breakdown
  const moduleEntries = Object.entries(stats.byModule);
  if (moduleEntries.length > 0) {
    parts.push('## By Module');
    for (const [module, count] of moduleEntries) {
      parts.push(`- **${module}:** ${count} docs`);
    }
    parts.push('');
  }

  // Category breakdown
  const categoryEntries = Object.entries(stats.byCategory);
  if (categoryEntries.length > 0) {
    parts.push('## By Category');
    for (const [category, count] of categoryEntries) {
      parts.push(`- **${category}:** ${count} docs`);
    }
    parts.push('');
  }

  // Delta info
  const delta = stats.indexedFiles - previousCount;
  if (delta > 0) {
    parts.push(`*${delta} new document(s) discovered.*`);
  } else if (delta < 0) {
    parts.push(`*${Math.abs(delta)} document(s) no longer present.*`);
  } else {
    parts.push('*No change in document count.*');
  }

  return parts.join('\n');
}

/**
 * Format a reindex error with troubleshooting guidance.
 *
 * @param error - The error that occurred
 * @param docsPath - The docs path that was being scanned
 * @returns Formatted error message
 */
function formatReindexError(error: unknown, docsPath: string): string {
  const message = error instanceof Error ? error.message : String(error);

  return [
    '# Reindex Failed ❌',
    '',
    `**Error:** ${message}`,
    '',
    `**Docs path:** \`${docsPath}\``,
    '',
    '**Troubleshooting:**',
    '- Verify the docs directory exists and is readable',
    '- Check that .md files are present in the expected structure',
    '- Ensure the server has read permissions for the directory',
  ].join('\n');
}
