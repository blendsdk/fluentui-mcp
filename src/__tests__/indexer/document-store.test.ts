/**
 * Tests for the DocumentStore class.
 *
 * Validates document storage, retrieval by ID, fuzzy name matching,
 * category/module indexing, and store lifecycle (clear, size).
 *
 * @module __tests__/indexer/document-store
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DocumentStore } from '../../indexer/document-store.js';
import type { DocumentEntry, DocumentMetadata } from '../../types/index.js';

// ============================================================================
// Test helpers
// ============================================================================

/**
 * Create a minimal DocumentEntry for testing.
 * Provides sensible defaults that can be overridden per-test.
 *
 * @param overrides - Fields to override on the default entry
 * @returns A complete DocumentEntry
 */
function createTestDoc(overrides: Partial<DocumentEntry> = {}): DocumentEntry {
  const defaults: DocumentEntry = {
    id: 'components/buttons/button',
    title: 'Button',
    content: '# Button\n\nA button component.',
    filePath: '/docs/v9/02-components/buttons/button.md',
    relativePath: '02-components/buttons/button.md',
    module: 'components',
    category: 'buttons',
    metadata: createTestMetadata(),
  };
  return { ...defaults, ...overrides };
}

/**
 * Create a minimal DocumentMetadata for testing.
 *
 * @param overrides - Fields to override
 * @returns A complete DocumentMetadata
 */
function createTestMetadata(overrides: Partial<DocumentMetadata> = {}): DocumentMetadata {
  const defaults: DocumentMetadata = {
    packageName: '@fluentui/react-button',
    importStatement: "import { Button } from '@fluentui/react-components'",
    description: 'A button component for triggering actions.',
    seeAlso: [],
    hasPropsTable: true,
    hasCodeExamples: true,
  };
  return { ...defaults, ...overrides };
}

// ============================================================================
// Store setup helper — populates a store with realistic test data
// ============================================================================

/** Creates a store pre-populated with several test documents */
function createPopulatedStore(): DocumentStore {
  const store = new DocumentStore();

  store.addDocument(createTestDoc());

  store.addDocument(createTestDoc({
    id: 'components/buttons/toggle-button',
    title: 'ToggleButton',
    relativePath: '02-components/buttons/toggle-button.md',
    filePath: '/docs/v9/02-components/buttons/toggle-button.md',
    category: 'buttons',
    metadata: createTestMetadata({ packageName: '@fluentui/react-button' }),
  }));

  store.addDocument(createTestDoc({
    id: 'components/forms/input',
    title: 'Input',
    relativePath: '02-components/forms/input.md',
    filePath: '/docs/v9/02-components/forms/input.md',
    category: 'forms',
    module: 'components',
    metadata: createTestMetadata({ packageName: '@fluentui/react-input' }),
  }));

  store.addDocument(createTestDoc({
    id: 'foundation/theming',
    title: 'Theming',
    relativePath: '01-foundation/03-theming.md',
    filePath: '/docs/v9/01-foundation/03-theming.md',
    module: 'foundation',
    category: null,
    metadata: createTestMetadata({ packageName: null, hasPropsTable: false }),
  }));

  store.addDocument(createTestDoc({
    id: 'patterns/forms/basic-forms',
    title: 'Basic Forms',
    relativePath: '03-patterns/forms/01-basic-forms.md',
    filePath: '/docs/v9/03-patterns/forms/01-basic-forms.md',
    module: 'patterns',
    category: null,
    metadata: createTestMetadata({ packageName: null, hasPropsTable: false }),
  }));

  return store;
}

// ============================================================================
// Basic operations
// ============================================================================

describe('DocumentStore — basic operations', () => {
  let store: DocumentStore;

  beforeEach(() => {
    store = createPopulatedStore();
  });

  it('should report correct size after adding documents', () => {
    expect(store.size).toBe(5);
  });

  it('should retrieve a document by exact ID', () => {
    const doc = store.getById('components/buttons/button');
    expect(doc).toBeDefined();
    expect(doc!.title).toBe('Button');
  });

  it('should return undefined for a non-existent ID', () => {
    expect(store.getById('nonexistent')).toBeUndefined();
  });

  it('should return all documents via getAllDocuments', () => {
    const all = store.getAllDocuments();
    expect(all).toHaveLength(5);
  });

  it('should clear all documents and indexes', () => {
    store.clear();
    expect(store.size).toBe(0);
    expect(store.getAllDocuments()).toHaveLength(0);
    expect(store.getCategories()).toHaveLength(0);
    expect(store.getModules()).toHaveLength(0);
  });
});

// ============================================================================
// Fuzzy name matching (findByName)
// ============================================================================

describe('DocumentStore — findByName', () => {
  let store: DocumentStore;

  beforeEach(() => {
    store = createPopulatedStore();
  });

  it('should find a document by exact title (case-insensitive)', () => {
    const doc = store.findByName('button');
    expect(doc).toBeDefined();
    expect(doc!.title).toBe('Button');
  });

  it('should find a document by uppercase title', () => {
    const doc = store.findByName('BUTTON');
    expect(doc).toBeDefined();
    expect(doc!.title).toBe('Button');
  });

  it('should find a document with hyphenated name from filename', () => {
    const doc = store.findByName('toggle-button');
    expect(doc).toBeDefined();
    expect(doc!.title).toBe('ToggleButton');
  });

  it('should find a document via prefix matching', () => {
    const doc = store.findByName('toggle');
    expect(doc).toBeDefined();
    expect(doc!.title).toBe('ToggleButton');
  });

  it('should find a document via substring matching', () => {
    const doc = store.findByName('theming');
    expect(doc).toBeDefined();
    expect(doc!.title).toBe('Theming');
  });

  it('should return undefined when no name matches', () => {
    expect(store.findByName('nonexistent-widget')).toBeUndefined();
  });
});

// ============================================================================
// Category and module indexing
// ============================================================================

describe('DocumentStore — category and module indexing', () => {
  let store: DocumentStore;

  beforeEach(() => {
    store = createPopulatedStore();
  });

  it('should return documents by category', () => {
    const buttons = store.getByCategory('buttons');
    expect(buttons).toHaveLength(2);
    expect(buttons.map((d) => d.title)).toContain('Button');
    expect(buttons.map((d) => d.title)).toContain('ToggleButton');
  });

  it('should return empty array for category with no documents', () => {
    const overlays = store.getByCategory('overlays');
    expect(overlays).toHaveLength(0);
  });

  it('should return documents by module', () => {
    const foundation = store.getByModule('foundation');
    expect(foundation).toHaveLength(1);
    expect(foundation[0].title).toBe('Theming');
  });

  it('should return all component-module documents', () => {
    const components = store.getByModule('components');
    expect(components).toHaveLength(3);
  });

  it('should list available categories with counts', () => {
    const categories = store.getCategories();
    expect(categories.length).toBeGreaterThan(0);

    const buttonsCat = categories.find((c) => c.category === 'buttons');
    expect(buttonsCat).toBeDefined();
    expect(buttonsCat!.count).toBe(2);
  });

  it('should list available modules with counts', () => {
    const modules = store.getModules();
    expect(modules.length).toBeGreaterThan(0);

    const compModule = modules.find((m) => m.module === 'components');
    expect(compModule).toBeDefined();
    expect(compModule!.count).toBe(3);
  });
});
