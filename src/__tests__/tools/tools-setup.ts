/**
 * Shared test setup for tool tests.
 *
 * Builds the real document index once and exposes the store and search engine
 * for all tool test files. This avoids re-indexing in every test file
 * while testing tools against real documentation content.
 *
 * @module __tests__/tools/tools-setup
 */

import { join } from 'path';
import { buildIndex } from '../../indexer/index-builder.js';
import type { DocumentStore } from '../../indexer/document-store.js';
import type { SearchEngine } from '../../indexer/search-engine.js';

/** Absolute path to the bundled v9 docs directory */
const DOCS_V9_PATH = join(process.cwd(), 'docs', 'v9');

/** Cached store instance — built lazily on first access */
let cachedStore: DocumentStore | null = null;

/** Cached search engine instance — built lazily on first access */
let cachedEngine: SearchEngine | null = null;

/**
 * Get the populated document store and search engine.
 * Builds the index on first call, then returns cached instances.
 *
 * @returns Object with store and searchEngine
 */
export async function getTestIndex(): Promise<{
  store: DocumentStore;
  searchEngine: SearchEngine;
}> {
  if (!cachedStore || !cachedEngine) {
    const result = await buildIndex(DOCS_V9_PATH);
    cachedStore = result.store;
    cachedEngine = result.searchEngine;
  }
  return { store: cachedStore, searchEngine: cachedEngine };
}
