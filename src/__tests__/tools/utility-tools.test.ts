/**
 * Tests for utility tools: list_all_docs, reindex.
 *
 * Uses the enhanced test schema via the shared schema-driven tools-setup, plus
 * the on-disk enhanced fixture JSON for reindex file-reload tests.
 *
 * @module __tests__/tools/utility-tools
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { join } from 'path';
import type { SchemaStore } from '../../schema/schema-store.js';
import { getTestIndex, createTestServerState } from './tools-setup.js';

import { listAllDocs } from '../../tools/list-all-docs.js';
import { reindex } from '../../tools/reindex.js';

/** Absolute path to the on-disk enhanced test schema fixture. */
const ENHANCED_SCHEMA_PATH = join(
  process.cwd(),
  'src',
  '__tests__',
  'fixtures',
  'test-schema-enhanced.json',
);

let store: SchemaStore;

beforeAll(() => {
  const index = getTestIndex();
  store = index.store;
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
  it('should successfully reindex from the schema file', async () => {
    const state = createTestServerState();
    state.schemaPath = ENHANCED_SCHEMA_PATH;
    const result = await reindex(state);
    expect(result).toContain('Reindex');
    expect(result).toMatch(/\d+/);
  });

  it('should preserve store/search functionality after reindex', async () => {
    const state = createTestServerState();
    state.schemaPath = ENHANCED_SCHEMA_PATH;
    await reindex(state);

    const component = state.store.findComponent('Button');
    expect(component).toBeDefined();

    const results = state.searchEngine.search('dialog');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should report no failure for a valid schema file', async () => {
    const state = createTestServerState();
    state.schemaPath = ENHANCED_SCHEMA_PATH;
    const result = await reindex(state);
    expect(result).toContain('Reindex Complete');
    expect(result).not.toContain('Failed');
  });

  it('should report an error for a missing schema file', async () => {
    const state = createTestServerState();
    state.schemaPath = join(process.cwd(), 'does-not-exist.json');
    const result = await reindex(state);
    expect(result).toContain('Reindex Failed');
  });
});
