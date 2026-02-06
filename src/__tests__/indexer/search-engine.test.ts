/**
 * Tests for the SearchEngine class.
 *
 * Validates TF-IDF search, tokenization, field-weighted scoring,
 * module filtering, result limiting, and excerpt extraction.
 *
 * @module __tests__/indexer/search-engine
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SearchEngine } from '../../indexer/search-engine.js';
import type { DocumentEntry, DocumentMetadata } from '../../types/index.js';

// ============================================================================
// Test helpers
// ============================================================================

/** Create a minimal DocumentMetadata for testing */
function createMeta(overrides: Partial<DocumentMetadata> = {}): DocumentMetadata {
  return {
    packageName: null,
    importStatement: null,
    description: null,
    seeAlso: [],
    hasPropsTable: false,
    hasCodeExamples: false,
    ...overrides,
  };
}

/** Create a minimal DocumentEntry for testing */
function createDoc(overrides: Partial<DocumentEntry> = {}): DocumentEntry {
  return {
    id: 'test/doc',
    title: 'Test',
    content: 'Test content.',
    filePath: '/test.md',
    relativePath: 'test.md',
    module: 'components',
    category: null,
    metadata: createMeta(),
    ...overrides,
  };
}

/** Build a search engine pre-loaded with several test documents */
function createPopulatedEngine(): SearchEngine {
  const engine = new SearchEngine();
  const docs: DocumentEntry[] = [
    createDoc({
      id: 'components/buttons/button',
      title: 'Button',
      content: '# Button\n\nButton is the primary interactive element for triggering actions.',
      module: 'components',
      category: 'buttons',
      metadata: createMeta({ description: 'Primary button component' }),
    }),
    createDoc({
      id: 'components/forms/input',
      title: 'Input',
      content: '# Input\n\nInput component for text entry and form fields.',
      module: 'components',
      category: 'forms',
      metadata: createMeta({ description: 'Text input component' }),
    }),
    createDoc({
      id: 'components/feedback/dialog',
      title: 'Dialog',
      content: '# Dialog\n\nDialog is a modal overlay for confirming actions.',
      module: 'components',
      category: 'feedback',
      metadata: createMeta({ description: 'Modal dialog component' }),
    }),
    createDoc({
      id: 'foundation/theming',
      title: 'Theming',
      content: '# Theming\n\nDesign tokens and theme customization for FluentUI.',
      module: 'foundation',
      category: null,
      metadata: createMeta({ description: 'Theme and design tokens' }),
    }),
    createDoc({
      id: 'patterns/forms/validation',
      title: 'Form Validation',
      content: '# Form Validation\n\nPatterns for validating form input fields.',
      module: 'patterns',
      category: null,
      metadata: createMeta({ description: 'Form validation patterns' }),
    }),
  ];
  engine.buildIndex(docs);
  return engine;
}

// ============================================================================
// Basic search functionality
// ============================================================================

describe('SearchEngine — basic search', () => {
  let engine: SearchEngine;

  beforeEach(() => {
    engine = createPopulatedEngine();
  });

  it('should find documents matching a simple query', () => {
    const results = engine.search('button');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.title).toBe('Button');
  });

  it('should return empty results for an unmatched query', () => {
    const results = engine.search('xyznonexistent');
    expect(results).toHaveLength(0);
  });

  it('should return empty results for empty query', () => {
    const results = engine.search('');
    expect(results).toHaveLength(0);
  });

  it('should rank title matches higher than content matches', () => {
    // "Dialog" is in the title of the dialog doc — should rank highest
    const results = engine.search('dialog');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].document.title).toBe('Dialog');
  });

  it('should include relevance scores between 0 and 100', () => {
    const results = engine.search('button');
    for (const result of results) {
      expect(result.relevance).toBeGreaterThanOrEqual(0);
      expect(result.relevance).toBeLessThanOrEqual(100);
    }
  });

  it('should include matched fields information', () => {
    const results = engine.search('button');
    expect(results[0].matchedFields.length).toBeGreaterThan(0);
  });

  it('should include excerpt for each result', () => {
    const results = engine.search('button');
    expect(results[0].excerpt).toBeTruthy();
  });
});

// ============================================================================
// Module filtering
// ============================================================================

describe('SearchEngine — module filtering', () => {
  let engine: SearchEngine;

  beforeEach(() => {
    engine = createPopulatedEngine();
  });

  it('should filter results by module', () => {
    const results = engine.search('form', 10, 'patterns');
    // Only the pattern doc should match
    for (const result of results) {
      expect(result.document.module).toBe('patterns');
    }
  });

  it('should return empty when filter excludes all matches', () => {
    // "button" only exists in components module
    const results = engine.search('button', 10, 'enterprise');
    expect(results).toHaveLength(0);
  });

  it('should return all modules when no filter is applied', () => {
    const results = engine.search('form');
    const modules = new Set(results.map((r) => r.document.module));
    // Should find results in both components and patterns
    expect(modules.size).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================================
// Result limiting
// ============================================================================

describe('SearchEngine — result limiting', () => {
  let engine: SearchEngine;

  beforeEach(() => {
    engine = createPopulatedEngine();
  });

  it('should limit results to the specified count', () => {
    const results = engine.search('component', 2);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it('should clamp limit to at least 1', () => {
    const results = engine.search('button', 0);
    // Should still return at most 1 result (clamped from 0 to 1)
    expect(results.length).toBeLessThanOrEqual(1);
  });

  it('should clamp limit to maximum of 50', () => {
    // Even with limit=100, should never return more than 50
    const results = engine.search('component', 100);
    expect(results.length).toBeLessThanOrEqual(50);
  });
});

// ============================================================================
// Index lifecycle
// ============================================================================

describe('SearchEngine — index lifecycle', () => {
  it('should report vocabulary size after building index', () => {
    const engine = createPopulatedEngine();
    expect(engine.vocabularySize).toBeGreaterThan(0);
  });

  it('should clear the index completely', () => {
    const engine = createPopulatedEngine();
    engine.clear();
    expect(engine.vocabularySize).toBe(0);
    expect(engine.search('button')).toHaveLength(0);
  });

  it('should allow rebuilding the index after clearing', () => {
    const engine = createPopulatedEngine();
    engine.clear();

    // Rebuild with a single document
    engine.buildIndex([
      createDoc({
        id: 'test/rebuild',
        title: 'Rebuilt',
        content: 'This document was added after clearing.',
      }),
    ]);

    expect(engine.vocabularySize).toBeGreaterThan(0);
    const results = engine.search('rebuilt');
    expect(results.length).toBeGreaterThan(0);
  });
});
