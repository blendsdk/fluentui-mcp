/**
 * Tool: reindex — Reload the schema from disk and rebuild in-memory state.
 *
 * Re-reads the enhanced JSON schema file, rebuilds the {@link SchemaStore}, and
 * rebuilds the search index. The shared {@link ServerState} container is mutated
 * in place so that the server's request handlers pick up the new store/engine
 * without needing to be re-registered.
 *
 * @module tools/reindex
 */

import { SchemaStore } from '../schema/schema-store.js';
import { loadSchema } from '../schema/schema-loader.js';
import { buildSearchIndex } from '../search/search-index.js';
import type { SearchEngine } from '../search/search-engine.js';

/**
 * Mutable container holding the live server state. Both the entry point and the
 * `reindex` tool reference the same object so reloads are visible everywhere.
 */
export interface ServerState {
  /** The active schema store. Replaced on reindex. */
  store: SchemaStore;

  /** The active search engine. Rebuilt on reindex. */
  searchEngine: SearchEngine;

  /** Absolute path to the schema file the state was loaded from. */
  schemaPath: string;
}

/**
 * Execute the reindex tool.
 *
 * Reloads the schema from `state.schemaPath`, rebuilds the store and search
 * index, and mutates `state` in place.
 *
 * @param state - The shared server state container (mutated on success)
 * @returns Formatted markdown string with reindex results
 *
 * @example
 * ```typescript
 * const result = await reindex(state);
 * ```
 */
export async function reindex(state: ServerState): Promise<string> {
  try {
    const previousCount = state.store.getAllComponents().length;

    const { schema, validationErrors, resolvedPath } = loadSchema({
      path: state.schemaPath,
    });

    const store = new SchemaStore(schema);
    const searchEngine = buildSearchIndex(store, state.searchEngine);

    // Swap in the new state.
    state.store = store;
    state.searchEngine = searchEngine;
    state.schemaPath = resolvedPath;

    return formatReindexResult(store, previousCount, validationErrors.length);
  } catch (error) {
    return formatReindexError(error, state.schemaPath);
  }
}

/**
 * Format a successful reindex result with statistics.
 *
 * @param store - The freshly built schema store
 * @param previousCount - How many components were indexed before
 * @param warningCount - Number of validation findings from the reload
 * @returns Formatted markdown result
 */
function formatReindexResult(
  store: SchemaStore,
  previousCount: number,
  warningCount: number
): string {
  const stats = store.getStats();
  const newCount = store.getAllComponents().length;
  const parts: string[] = [];

  parts.push('# Reindex Complete ✅');
  parts.push('');
  parts.push(`**Components:** ${newCount}`);
  parts.push(`**Previous count:** ${previousCount}`);
  parts.push(`**Utilities:** ${store.getAllUtilities().length}`);

  if (warningCount > 0) {
    parts.push(`**⚠️ Validation findings:** ${warningCount}`);
  }

  parts.push('');

  const categories = store.getCategories();
  if (categories.size > 0) {
    parts.push('## By Category');
    for (const [category, count] of categories) {
      parts.push(`- **${category}:** ${count} components`);
    }
    parts.push('');
  }

  // Reference total props/stories from the schema stats block.
  parts.push(`*Total props: ${stats.totalProps}, total stories: ${stats.totalStories}.*`);

  const delta = newCount - previousCount;
  if (delta > 0) {
    parts.push(`*${delta} new component(s) discovered.*`);
  } else if (delta < 0) {
    parts.push(`*${Math.abs(delta)} component(s) no longer present.*`);
  } else {
    parts.push('*No change in component count.*');
  }

  return parts.join('\n');
}

/**
 * Format a reindex error with troubleshooting guidance.
 *
 * @param error - The error that occurred
 * @param schemaPath - The schema path that was being loaded
 * @returns Formatted error message
 */
function formatReindexError(error: unknown, schemaPath: string): string {
  const message = error instanceof Error ? error.message : String(error);

  return [
    '# Reindex Failed ❌',
    '',
    `**Error:** ${message}`,
    '',
    `**Schema path:** \`${schemaPath}\``,
    '',
    '**Troubleshooting:**',
    '- Verify the schema file exists and is readable',
    '- Check that the file contains valid JSON',
    '- Ensure the server has read permissions for the file',
  ].join('\n');
}
