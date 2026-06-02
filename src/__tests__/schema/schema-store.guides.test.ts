/**
 * Unit tests for {@link SchemaStore} guide and pattern queries (Phase 10.3).
 *
 * Covers getFoundationGuide, getAllFoundationGuides, getPattern,
 * getPatternsByGroup, getAllPatterns, getEnterpriseGuide,
 * getAllEnterpriseGuides, getQuickReference, and getAllQuickReferences.
 *
 * @module tests/schema/schema-store.guides
 */

import { describe, it, expect } from 'vitest';

import { SchemaStore } from '../../schema/schema-store.js';
import {
  createEnhancedTestSchema,
  createFluentUISchema,
} from '../fixtures/helpers.js';

/** Build a store over the enhanced schema (one guide of each kind + a pattern). */
function enhancedStore(): SchemaStore {
  return new SchemaStore(createEnhancedTestSchema());
}

describe('SchemaStore — foundation guides', () => {
  it('finds a foundation guide by id', () => {
    const store = enhancedStore();
    expect(store.getFoundationGuide('getting-started')?.title).toBe(
      'Getting Started with FluentUI v9',
    );
  });

  it('returns undefined for unknown foundation guides', () => {
    const store = enhancedStore();
    expect(store.getFoundationGuide('nope')).toBeUndefined();
  });

  it('returns all foundation guides', () => {
    const store = enhancedStore();
    expect(store.getAllFoundationGuides()).toHaveLength(1);
  });

  it('returns a defensive copy of foundation guides', () => {
    const store = enhancedStore();
    store.getAllFoundationGuides().pop();
    expect(store.getAllFoundationGuides()).toHaveLength(1);
  });
});

describe('SchemaStore — patterns', () => {
  it('finds a pattern by id', () => {
    const store = enhancedStore();
    expect(store.getPattern('login-form')?.title).toBe('Login Form Pattern');
  });

  it('returns undefined for unknown patterns', () => {
    const store = enhancedStore();
    expect(store.getPattern('nope')).toBeUndefined();
  });

  it('filters patterns by group', () => {
    const store = enhancedStore();
    const forms = store.getPatternsByGroup('forms');
    expect(forms.map((p) => p.id)).toEqual(['login-form']);
  });

  it('returns an empty array for an unknown group', () => {
    const store = enhancedStore();
    expect(store.getPatternsByGroup('nonexistent')).toEqual([]);
  });

  it('returns all patterns', () => {
    const store = enhancedStore();
    expect(store.getAllPatterns()).toHaveLength(1);
  });
});

describe('SchemaStore — enterprise guides', () => {
  it('finds an enterprise guide by id', () => {
    const store = enhancedStore();
    expect(store.getEnterpriseGuide('app-shell')?.title).toBe('Application Shell Pattern');
  });

  it('returns undefined for unknown enterprise guides', () => {
    const store = enhancedStore();
    expect(store.getEnterpriseGuide('nope')).toBeUndefined();
  });

  it('returns all enterprise guides', () => {
    const store = enhancedStore();
    expect(store.getAllEnterpriseGuides()).toHaveLength(1);
  });
});

describe('SchemaStore — quick reference', () => {
  it('finds a quick-reference guide by id', () => {
    const store = enhancedStore();
    expect(store.getQuickReference('component-cheatsheet')?.title).toBe(
      'Component Quick Reference',
    );
  });

  it('returns undefined for unknown quick-reference guides', () => {
    const store = enhancedStore();
    expect(store.getQuickReference('nope')).toBeUndefined();
  });

  it('returns all quick-reference guides', () => {
    const store = enhancedStore();
    expect(store.getAllQuickReferences()).toHaveLength(1);
  });
});

describe('SchemaStore — guides on an empty schema', () => {
  it('returns empty results for all guide queries', () => {
    const store = new SchemaStore(createFluentUISchema());
    expect(store.getAllFoundationGuides()).toEqual([]);
    expect(store.getAllEnterpriseGuides()).toEqual([]);
    expect(store.getAllQuickReferences()).toEqual([]);
    expect(store.getAllPatterns()).toEqual([]);
    expect(store.getFoundationGuide('x')).toBeUndefined();
  });
});
