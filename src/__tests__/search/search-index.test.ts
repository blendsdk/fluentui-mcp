/**
 * Tests for the schema-driven search index builder.
 *
 * Verifies that {@link schemaToDocuments} flattens every kind of schema entry
 * (components, utilities, foundation/enterprise/quick-reference guides, and
 * patterns) into searchable {@link DocumentEntry} records, and that
 * {@link buildSearchIndex} produces a {@link SearchEngine} that returns
 * relevant, module-filterable results across all of that content.
 *
 * @module __tests__/search/search-index
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { SchemaStore } from '../../schema/schema-store.js';
import { SearchEngine } from '../../search/search-engine.js';
import { schemaToDocuments, buildSearchIndex } from '../../search/search-index.js';
import { createEnhancedTestSchema } from '../fixtures/helpers.js';
import type { DocumentEntry } from '../../types/index.js';

let store: SchemaStore;
let documents: DocumentEntry[];
let engine: SearchEngine;

beforeAll(() => {
  store = new SchemaStore(createEnhancedTestSchema());
  documents = schemaToDocuments(store);
  engine = buildSearchIndex(store);
});

// ============================================================================
// schemaToDocuments
// ============================================================================

describe('schemaToDocuments', () => {
  it('produces one document per schema entry across all kinds', () => {
    // 3 components + 1 utility + 1 foundation + 1 enterprise +
    // 1 quick-reference + 1 pattern = 8.
    expect(documents.length).toBe(8);
  });

  it('includes every component as a document', () => {
    const componentDocs = documents.filter((d) => d.module === 'components');
    expect(componentDocs.length).toBe(3);
    const titles = componentDocs.map((d) => d.title);
    expect(titles).toContain('Button');
    expect(titles).toContain('Input');
    expect(titles).toContain('Dialog');
  });

  it('assigns the correct legacy module names', () => {
    const modules = new Set(documents.map((d) => d.module));
    expect(modules).toContain('components');
    expect(modules).toContain('utilities');
    expect(modules).toContain('foundation');
    expect(modules).toContain('enterprise');
    expect(modules).toContain('quick-reference');
    expect(modules).toContain('patterns');
  });

  it('carries component category and package metadata', () => {
    const button = documents.find((d) => d.title === 'Button');
    expect(button).toBeDefined();
    expect(button!.category).toBe('buttons');
    expect(button!.metadata.packageName).toBe('@fluentui/react-button');
    expect(button!.metadata.description).toContain('Button');
    expect(button!.metadata.hasPropsTable).toBe(true);
    expect(button!.metadata.hasCodeExamples).toBe(true);
  });

  it('renders component content via the full formatter', () => {
    const button = documents.find((d) => d.title === 'Button');
    expect(button!.content).toContain('# Button');
    expect(button!.content).toContain('**Package**');
  });

  it('uses a synthetic file path for all documents', () => {
    for (const doc of documents) {
      expect(doc.filePath).toBe('<schema>');
    }
  });

  it('assigns unique, namespaced ids', () => {
    const ids = documents.map((d) => d.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('components/button');
    expect(ids.some((id) => id.startsWith('utilities/'))).toBe(true);
    expect(ids.some((id) => id.startsWith('patterns/'))).toBe(true);
  });

  it('includes utility export names in searchable content', () => {
    const utility = documents.find((d) => d.module === 'utilities');
    expect(utility).toBeDefined();
    expect(utility!.content).toContain('usePositioning');
  });
});

// ============================================================================
// buildSearchIndex
// ============================================================================

describe('buildSearchIndex', () => {
  it('returns a SearchEngine with a populated vocabulary', () => {
    expect(engine).toBeInstanceOf(SearchEngine);
    expect(engine.vocabularySize).toBeGreaterThan(0);
  });

  it('finds components by name', () => {
    const results = engine.search('Dialog');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.title).toBe('Dialog');
  });

  it('finds content from enhanced descriptions', () => {
    const results = engine.search('confirmation modal overlay');
    const titles = results.map((r) => r.document.title);
    expect(titles).toContain('Dialog');
  });

  it('finds guides and patterns, not just components', () => {
    const patternResults = engine.search('login form', undefined, 'patterns');
    expect(patternResults.length).toBeGreaterThan(0);

    const foundationResults = engine.search('installation getting started', undefined, 'foundation');
    expect(foundationResults.length).toBeGreaterThan(0);
  });

  it('respects the module filter', () => {
    const results = engine.search('button', undefined, 'components');
    expect(results.length).toBeGreaterThan(0);
    for (const result of results) {
      expect(result.document.module).toBe('components');
    }
  });

  it('returns no results for nonsense queries', () => {
    const results = engine.search('zzzzqqqxnonexistent');
    expect(results.length).toBe(0);
  });

  it('reuses and clears an existing engine when provided', () => {
    const existing = new SearchEngine();
    existing.buildIndex([
      {
        id: 'stale/doc',
        title: 'StaleDocument',
        content: 'this should be cleared',
        filePath: '<schema>',
        relativePath: 'stale/doc',
        module: 'components',
        category: null,
        metadata: {
          packageName: null,
          importStatement: null,
          description: null,
          seeAlso: [],
          hasPropsTable: false,
          hasCodeExamples: false,
        },
      },
    ]);

    const rebuilt = buildSearchIndex(store, existing);
    expect(rebuilt).toBe(existing);
    // The stale document must be gone after the rebuild.
    expect(rebuilt.search('StaleDocument').length).toBe(0);
    // And the schema content must be present.
    expect(rebuilt.search('Button').length).toBeGreaterThan(0);
  });
});
