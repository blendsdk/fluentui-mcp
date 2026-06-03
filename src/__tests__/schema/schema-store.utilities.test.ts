/**
 * Unit tests for {@link SchemaStore} utility and aggregate queries (Phase 10.3).
 *
 * Covers findUtility, getAllUtilities, getCategories, getModules, getStats,
 * getVersionInfo, and getSearchableEntries.
 *
 * @module tests/schema/schema-store.utilities
 */

import { describe, it, expect } from 'vitest';

import { SchemaStore } from '../../schema/schema-store.js';
import {
  createEnhancedTestSchema,
  createMinimalTestSchema,
  createFluentUISchema,
} from '../fixtures/helpers.js';

/** Build a store over the enhanced schema (has a Positioning utility + guides). */
function enhancedStore(): SchemaStore {
  return new SchemaStore(createEnhancedTestSchema());
}

describe('SchemaStore.findUtility', () => {
  it('finds a utility by name (case-insensitive)', () => {
    const store = enhancedStore();
    expect(store.findUtility('Positioning')?.name).toBe('Positioning');
    expect(store.findUtility('positioning')?.name).toBe('Positioning');
  });

  it('finds a utility by id', () => {
    const store = enhancedStore();
    expect(store.findUtility('positioning')?.id).toBe('positioning');
  });

  it('returns undefined for unknown utilities', () => {
    const store = enhancedStore();
    expect(store.findUtility('Nonexistent')).toBeUndefined();
  });

  it('returns undefined for empty input', () => {
    const store = enhancedStore();
    expect(store.findUtility('  ')).toBeUndefined();
  });
});

describe('SchemaStore.getAllUtilities', () => {
  it('returns all utilities', () => {
    const store = enhancedStore();
    const utilities = store.getAllUtilities();
    expect(utilities).toHaveLength(1);
    expect(utilities[0].name).toBe('Positioning');
  });

  it('returns an empty array when there are no utilities', () => {
    const store = new SchemaStore(createMinimalTestSchema());
    expect(store.getAllUtilities()).toEqual([]);
  });

  it('returns a defensive copy', () => {
    const store = enhancedStore();
    store.getAllUtilities().pop();
    expect(store.getAllUtilities()).toHaveLength(1);
  });
});

describe('SchemaStore.getCategories', () => {
  it('counts components per category', () => {
    const store = new SchemaStore(createMinimalTestSchema());
    const categories = store.getCategories();
    expect(categories.get('buttons')).toBe(1);
    expect(categories.get('forms')).toBe(1);
    expect(categories.get('feedback')).toBe(1);
  });

  it('returns an empty map for an empty schema', () => {
    const store = new SchemaStore(createFluentUISchema());
    expect(store.getCategories().size).toBe(0);
  });
});

describe('SchemaStore.getModules', () => {
  it('lists only non-empty modules', () => {
    const store = new SchemaStore(createMinimalTestSchema());
    expect(store.getModules()).toEqual(['components']);
  });

  it('lists all populated modules for the enhanced schema', () => {
    const store = enhancedStore();
    expect(store.getModules()).toEqual([
      'components',
      'utilities',
      'foundation',
      'patterns',
      'enterprise',
      'quick-reference',
    ]);
  });

  it('returns an empty array for an empty schema', () => {
    const store = new SchemaStore(createFluentUISchema());
    expect(store.getModules()).toEqual([]);
  });
});

describe('SchemaStore.getStats', () => {
  it('returns the schema stats block', () => {
    const store = new SchemaStore(createMinimalTestSchema());
    expect(store.getStats().totalComponents).toBe(3);
  });
});

describe('SchemaStore.getVersionInfo', () => {
  it('returns version, generatedAt, and sources', () => {
    const store = enhancedStore();
    const info = store.getVersionInfo();
    expect(info.version).toBe('v9');
    expect(info.generatedAt).toBeTruthy();
    expect(info.sources.fluentui).toBeDefined();
    expect(info.sources.contrib).toBeDefined();
  });
});

describe('SchemaStore.getSearchableEntries', () => {
  it('produces one entry per content item', () => {
    const store = enhancedStore();
    const entries = store.getSearchableEntries();
    // 3 components + 1 utility + 1 foundation + 1 enterprise + 1 quick-ref + 1 pattern
    expect(entries).toHaveLength(8);
  });

  it('tags entries with the correct type', () => {
    const store = enhancedStore();
    const entries = store.getSearchableEntries();
    const types = new Set(entries.map((e) => e.type));
    expect(types).toContain('component');
    expect(types).toContain('utility');
    expect(types).toContain('foundation');
    expect(types).toContain('enterprise');
    expect(types).toContain('quick-reference');
    expect(types).toContain('pattern');
  });

  it('includes title and description text in content', () => {
    const store = enhancedStore();
    const entries = store.getSearchableEntries();
    const button = entries.find((e) => e.id === 'button');
    expect(button?.content).toContain('Button');
    expect(button?.content.toLowerCase()).toContain('action');
  });

  it('carries package metadata for components', () => {
    const store = enhancedStore();
    const entries = store.getSearchableEntries();
    const button = entries.find((e) => e.id === 'button');
    expect(button?.metadata.packageName).toBe('@fluentui/react-button');
  });

  it('returns an empty array for an empty schema', () => {
    const store = new SchemaStore(createFluentUISchema());
    expect(store.getSearchableEntries()).toEqual([]);
  });
});
