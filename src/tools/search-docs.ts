/**
 * Tool: search_docs — Full-text search across all FluentUI documentation.
 *
 * Uses the TF-IDF search engine to find relevant documentation matching
 * a query string. Results are ranked by relevance and can be filtered
 * by documentation module (foundation, components, patterns, enterprise).
 *
 * Returns a formatted list of results with titles, relevance scores,
 * excerpts, and module/category information.
 *
 * @module tools/search-docs
 */

import type { SearchEngine } from '../indexer/search-engine.js';
import type { SearchDocsArgs, DocumentModule, SearchResult } from '../types/index.js';
import { DEFAULT_SEARCH_LIMIT } from '../types/index.js';

/**
 * Execute the search_docs tool.
 *
 * Runs a full-text search across all indexed documentation and returns
 * ranked results with relevance scores and context excerpts.
 *
 * @param searchEngine - The populated search engine to query
 * @param args - Tool arguments containing the query, optional module filter, and limit
 * @returns Formatted markdown string with search results,
 *          or an error/empty message if no results found
 *
 * @example
 * ```typescript
 * const result = searchDocs(engine, { query: "form validation", module: "patterns" });
 * // Returns ranked list of pattern docs about form validation
 * ```
 */
export function searchDocs(
  searchEngine: SearchEngine,
  args: SearchDocsArgs
): string {
  const { query, module, limit } = args;

  if (!query || query.trim().length === 0) {
    return formatError('Search query is required. Example: "form validation", "dialog patterns"');
  }

  const effectiveLimit = limit ?? DEFAULT_SEARCH_LIMIT;
  const moduleFilter = module as DocumentModule | undefined;

  // Run the search
  const results = searchEngine.search(query.trim(), effectiveLimit, moduleFilter);

  if (results.length === 0) {
    return formatNoResults(query, moduleFilter);
  }

  return formatSearchResults(query, results, moduleFilter);
}

/**
 * Format search results into a readable markdown response.
 *
 * Each result includes:
 * - Title with relevance percentage
 * - Module and category tags
 * - Context excerpt
 * - Document ID for reference
 *
 * @param query - The original search query
 * @param results - Array of search results from the engine
 * @param moduleFilter - The module filter that was applied, if any
 * @returns Formatted markdown string
 */
function formatSearchResults(
  query: string,
  results: SearchResult[],
  moduleFilter?: DocumentModule
): string {
  const parts: string[] = [];

  // Header with search context
  const filterNote = moduleFilter ? ` in **${moduleFilter}**` : '';
  parts.push(`## Search Results for "${query}"${filterNote}`);
  parts.push(`*Found ${results.length} result${results.length === 1 ? '' : 's'}*`);
  parts.push('');

  // Format each result
  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const doc = result.document;
    const rank = i + 1;

    parts.push(`### ${rank}. ${doc.title} (${result.relevance}% relevant)`);

    // Module and category tags
    const tags: string[] = [`📁 ${doc.module}`];
    if (doc.category) {
      tags.push(`🏷️ ${doc.category}`);
    }
    if (doc.metadata.hasCodeExamples) {
      tags.push('💻 has examples');
    }
    if (doc.metadata.hasPropsTable) {
      tags.push('📋 has props');
    }
    parts.push(tags.join(' · '));

    // Excerpt
    if (result.excerpt) {
      parts.push(`> ${result.excerpt}`);
    }

    // Quick reference — document ID for use with other tools
    parts.push(`*Use \`query_component("${doc.title}")\` for full documentation*`);
    parts.push('');
  }

  return parts.join('\n');
}

/**
 * Format a "no results" message with helpful suggestions.
 *
 * @param query - The search query that returned no results
 * @param moduleFilter - Module filter that was applied, if any
 * @returns Formatted message with suggestions
 */
function formatNoResults(query: string, moduleFilter?: DocumentModule): string {
  const parts: string[] = [];
  parts.push(`No results found for "${query}".`);
  parts.push('');

  if (moduleFilter) {
    parts.push(`*You searched only in the **${moduleFilter}** module. Try removing the module filter for broader results.*`);
    parts.push('');
  }

  parts.push('**Suggestions:**');
  parts.push('- Try simpler or shorter search terms');
  parts.push('- Use component names directly (e.g., "Button", "Dialog")');
  parts.push('- Try related terms (e.g., "dropdown" instead of "select menu")');
  parts.push('- Use `list_all_docs` to see all available modules and documents');

  return parts.join('\n');
}

/**
 * Format a generic error message.
 *
 * @param message - The error description
 * @returns Formatted error string
 */
function formatError(message: string): string {
  return `**Error:** ${message}`;
}
