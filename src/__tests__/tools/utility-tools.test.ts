/**
 * Tests for utility tools: list_all_docs, reindex.
 *
 * Uses the real docs/v9/ index for integration-level validation.
 *
 * @module __tests__/tools/utility-tools
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join } from 'path';
import type { DocumentStore } from '../../indexer/document-store.js';
import type { SearchEngine } from '../../indexer/search-engine.js';
import { getTestIndex } from './tools-setup.js';

import { listAllDocs } from '../../tools/list-all-docs.js';
import { reindex } from '../../tools/reindex.js';

/** Absolute path to the bundled v9 docs directory */
const DOCS_V9_PATH = join(process.cwd(), 'docs', 'v9');

let store: DocumentStore;
let searchEngine: SearchEngine;

beforeAll(async () => {
  const index = await getTestIndex();
  store = index.store;
  searchEngine = index.searchEngine;
});

// ============================================================================
// listAllDocs
// ============================================================================

describe('listAllDocs', () => {
  it('should return a formatted overview of all documents', () => {
    const result = listAllDocs(store);
    expect(result).toContain('Documentation Index');
  });

  it('should include module sections', () => {
    const result = listAllDocs(store);
    expect(result.toLowerCase()).toContain('foundation');
    expect(result.toLowerCase()).toContain('components');
    expect(result.toLowerCase()).toContain('patterns');
    expect(result.toLowerCase()).toContain('enterprise');
  });

  it('should include document count information', () => {
    const result = listAllDocs(store);
    // Should contain numeric counts
    expect(result).toMatch(/\d+/);
  });

  it('should include individual document titles', () => {
    const result = listAllDocs(store);
    expect(result).toContain('Button');
  });
});

// ============================================================================
// reindex
// ============================================================================

describe('reindex', () => {
  it('should successfully reindex the documentation', async () => {
    const result = await reindex(store, searchEngine, DOCS_V9_PATH);
    expect(result).toContain('Reindex');
    // Should report indexed file counts
    expect(result).toMatch(/\d+/);
  });

  it('should preserve search functionality after reindex', async () => {
    await reindex(store, searchEngine, DOCS_V9_PATH);
    // Store and engine should still work
    const doc = store.findByName('Button');
    expect(doc).toBeDefined();

    const results = searchEngine.search('dialog');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should report zero failed files for valid docs directory', async () => {
    const result = await reindex(store, searchEngine, DOCS_V9_PATH);
    // Result should not contain any failure warnings
    expect(result).not.toContain('Failed');
  });
});
