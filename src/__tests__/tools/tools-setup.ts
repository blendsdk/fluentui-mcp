/**
 * Shared test setup for tool tests.
 *
 * Builds a {@link SchemaStore} and {@link SearchEngine} once from the enhanced
 * test schema fixture, and exposes them (plus a {@link ServerState}) for all
 * tool test files. This replaces the previous markdown-index setup now that the
 * tools are schema-driven.
 *
 * @module __tests__/tools/tools-setup
 */

import { SchemaStore } from '../../schema/schema-store.js';
import { buildSearchIndex } from '../../search/search-index.js';
import type { SearchEngine } from '../../search/search-engine.js';
import type { ServerState } from '../../tools/reindex.js';
import { createEnhancedTestSchema } from '../fixtures/helpers.js';

/** Cached store instance — built lazily on first access. */
let cachedStore: SchemaStore | null = null;

/** Cached search engine instance — built lazily on first access. */
let cachedEngine: SearchEngine | null = null;

/**
 * Get a populated schema store and search engine built from the enhanced test
 * schema. Built once, then cached for subsequent calls.
 *
 * @returns Object with the store and search engine.
 */
export function getTestIndex(): {
  store: SchemaStore;
  searchEngine: SearchEngine;
} {
  if (!cachedStore || !cachedEngine) {
    cachedStore = new SchemaStore(createEnhancedTestSchema());
    cachedEngine = buildSearchIndex(cachedStore);
  }
  return { store: cachedStore, searchEngine: cachedEngine };
}

/**
 * Build a fresh, isolated {@link ServerState} for tests that mutate it (e.g.
 * the `reindex` tool). Not cached — each call returns a new store/engine.
 *
 * @returns A new server state backed by the enhanced test schema.
 */
export function createTestServerState(): ServerState {
  const store = new SchemaStore(createEnhancedTestSchema());
  const searchEngine = buildSearchIndex(store);
  return { store, searchEngine, schemaPath: '<test>' };
}
