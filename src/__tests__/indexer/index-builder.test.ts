/**
 * Tests for the index builder module.
 *
 * Validates the full indexing pipeline: scan → read → extract → store → search.
 * Uses the real docs/v9/ directory for integration-level testing.
 *
 * @module __tests__/indexer/index-builder
 */

import { describe, it, expect } from 'vitest';
import { join } from 'path';
import { buildIndex } from '../../indexer/index-builder.js';
import { DocumentStore } from '../../indexer/document-store.js';
import { SearchEngine } from '../../indexer/search-engine.js';

/** Absolute path to the bundled v9 docs directory */
const DOCS_V9_PATH = join(process.cwd(), 'docs', 'v9');

// ============================================================================
// Full pipeline tests
// ============================================================================

describe('buildIndex — full pipeline', () => {
  it('should index all docs and return a populated store', async () => {
    const { store, stats } = await buildIndex(DOCS_V9_PATH);
    expect(store.size).toBeGreaterThan(50);
    expect(stats.indexedFiles).toBe(store.size);
    expect(stats.failedFiles).toBe(0);
  });

  it('should populate the search engine index', async () => {
    const { searchEngine } = await buildIndex(DOCS_V9_PATH);
    expect(searchEngine.vocabularySize).toBeGreaterThan(100);
  });

  it('should report stats with module and category breakdowns', async () => {
    const { stats } = await buildIndex(DOCS_V9_PATH);
    expect(stats.byModule).toHaveProperty('foundation');
    expect(stats.byModule).toHaveProperty('components');
    expect(stats.byModule).toHaveProperty('patterns');
    expect(stats.byModule).toHaveProperty('enterprise');
    expect(Object.keys(stats.byCategory).length).toBeGreaterThan(0);
  });

  it('should record a positive duration', async () => {
    const { stats } = await buildIndex(DOCS_V9_PATH);
    expect(stats.durationMs).toBeGreaterThan(0);
  });

  it('should make documents searchable after indexing', async () => {
    const { searchEngine } = await buildIndex(DOCS_V9_PATH);
    const results = searchEngine.search('button');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.title).toBeDefined();
  });

  it('should make documents retrievable by name after indexing', async () => {
    const { store } = await buildIndex(DOCS_V9_PATH);
    const doc = store.findByName('Button');
    expect(doc).toBeDefined();
    expect(doc!.title).toBe('Button');
    expect(doc!.metadata.packageName).toBe('@fluentui/react-button');
  });
});

// ============================================================================
// Reindex (clear and rebuild) tests
// ============================================================================

describe('buildIndex — reindex with existing instances', () => {
  it('should clear and repopulate an existing store', async () => {
    const existingStore = new DocumentStore();
    const existingEngine = new SearchEngine();

    // First build
    const { stats: stats1 } = await buildIndex(DOCS_V9_PATH, existingStore, existingEngine);
    const firstCount = existingStore.size;
    expect(firstCount).toBeGreaterThan(0);

    // Reindex — should clear and rebuild
    const { stats: stats2 } = await buildIndex(DOCS_V9_PATH, existingStore, existingEngine);
    expect(existingStore.size).toBe(firstCount);
    expect(stats2.indexedFiles).toBe(stats1.indexedFiles);
  });

  it('should produce a working search engine after reindex', async () => {
    const existingStore = new DocumentStore();
    const existingEngine = new SearchEngine();

    await buildIndex(DOCS_V9_PATH, existingStore, existingEngine);
    // Reindex
    await buildIndex(DOCS_V9_PATH, existingStore, existingEngine);

    const results = existingEngine.search('dialog');
    expect(results.length).toBeGreaterThan(0);
  });
});
