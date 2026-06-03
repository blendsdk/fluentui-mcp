/**
 * Unit tests for {@link SchemaStore} component query methods (Phase 10.2).
 *
 * Covers construction/indexing plus findComponent, findComponentFuzzy,
 * getComponentsByCategory, getComponentsByStability, findComponentsWithProp,
 * suggestComponents, and compareComponents.
 *
 * @module tests/schema/schema-store
 */

import { describe, it, expect } from 'vitest';

import { SchemaStore } from '../../schema/schema-store.js';
import {
  createMinimalTestSchema,
  createEnhancedTestSchema,
  createFluentUISchema,
  createComponentEntry,
} from '../fixtures/helpers.js';

/** Build a store over the minimal 3-component schema (Button/Input/Dialog). */
function minimalStore(): SchemaStore {
  return new SchemaStore(createMinimalTestSchema());
}

describe('SchemaStore — construction', () => {
  it('builds from a schema without throwing', () => {
    expect(() => minimalStore()).not.toThrow();
  });

  it('handles an empty schema', () => {
    const store = new SchemaStore(createFluentUISchema());
    expect(store.findComponent('Button')).toBeUndefined();
    expect(store.getComponentsByCategory('buttons')).toEqual([]);
  });
});

describe('SchemaStore.findComponent', () => {
  it('finds a component by exact name', () => {
    const store = minimalStore();
    expect(store.findComponent('Button')?.name).toBe('Button');
  });

  it('is case-insensitive', () => {
    const store = minimalStore();
    expect(store.findComponent('button')?.name).toBe('Button');
    expect(store.findComponent('BUTTON')?.name).toBe('Button');
  });

  it('trims surrounding whitespace', () => {
    const store = minimalStore();
    expect(store.findComponent('  Dialog  ')?.name).toBe('Dialog');
  });

  it('returns undefined for unknown names', () => {
    const store = minimalStore();
    expect(store.findComponent('Nonexistent')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    const store = minimalStore();
    expect(store.findComponent('')).toBeUndefined();
  });
});

describe('SchemaStore.findComponentFuzzy', () => {
  it('matches exact names', () => {
    const store = minimalStore();
    expect(store.findComponentFuzzy('Button')?.name).toBe('Button');
  });

  it('matches by id (kebab-case)', () => {
    const schema = createFluentUISchema({
      components: [createComponentEntry('CompoundButton', { category: 'buttons' })],
    });
    const store = new SchemaStore(schema);
    expect(store.findComponentFuzzy('compound-button')?.name).toBe('CompoundButton');
  });

  it('prefers the shortest match for prefixes (button → Button)', () => {
    const schema = createFluentUISchema({
      components: [
        createComponentEntry('CompoundButton', { category: 'buttons' }),
        createComponentEntry('Button', { category: 'buttons' }),
      ],
    });
    const store = new SchemaStore(schema);
    expect(store.findComponentFuzzy('button')?.name).toBe('Button');
  });

  it('matches by substring when no prefix matches', () => {
    const store = minimalStore();
    expect(store.findComponentFuzzy('ialog')?.name).toBe('Dialog');
  });

  it('returns undefined for empty input', () => {
    const store = minimalStore();
    expect(store.findComponentFuzzy('   ')).toBeUndefined();
  });

  it('returns undefined when nothing matches', () => {
    const store = minimalStore();
    expect(store.findComponentFuzzy('zzz')).toBeUndefined();
  });
});

describe('SchemaStore.getComponentsByCategory', () => {
  it('returns components in a category', () => {
    const store = minimalStore();
    const buttons = store.getComponentsByCategory('buttons');
    expect(buttons.map((c) => c.name)).toEqual(['Button']);
  });

  it('returns an empty array for unknown categories', () => {
    const store = minimalStore();
    expect(store.getComponentsByCategory('nonexistent')).toEqual([]);
  });

  it('returns a defensive copy', () => {
    const store = minimalStore();
    const first = store.getComponentsByCategory('buttons');
    first.push(createComponentEntry('Extra'));
    expect(store.getComponentsByCategory('buttons')).toHaveLength(1);
  });

  it('groups multiple components in the same category', () => {
    const schema = createFluentUISchema({
      components: [
        createComponentEntry('Button', { category: 'buttons' }),
        createComponentEntry('ToggleButton', { category: 'buttons' }),
      ],
    });
    const store = new SchemaStore(schema);
    expect(store.getComponentsByCategory('buttons')).toHaveLength(2);
  });
});

describe('SchemaStore.getComponentsByStability', () => {
  it('filters by stability', () => {
    const schema = createFluentUISchema({
      components: [
        createComponentEntry('Button', { category: 'buttons', stability: 'stable' }),
        createComponentEntry('Drawer', { category: 'overlays', stability: 'preview' }),
      ],
    });
    const store = new SchemaStore(schema);
    expect(store.getComponentsByStability('stable').map((c) => c.name)).toEqual(['Button']);
    expect(store.getComponentsByStability('preview').map((c) => c.name)).toEqual(['Drawer']);
  });

  it('returns an empty array when no components match', () => {
    const store = minimalStore();
    expect(store.getComponentsByStability('contrib')).toEqual([]);
  });
});

describe('SchemaStore.findComponentsWithProp', () => {
  it('finds components that declare a prop (case-insensitive)', () => {
    const store = minimalStore();
    // appearance exists on Button and Input in the minimal schema.
    const withAppearance = store.findComponentsWithProp('appearance');
    expect(withAppearance.map((c) => c.name).sort()).toEqual(['Button', 'Input']);
    expect(store.findComponentsWithProp('APPEARANCE').map((c) => c.name).sort()).toEqual([
      'Button',
      'Input',
    ]);
  });

  it('returns an empty array when no component has the prop', () => {
    const store = minimalStore();
    expect(store.findComponentsWithProp('nonexistentProp')).toEqual([]);
  });

  it('returns an empty array for empty input', () => {
    const store = minimalStore();
    expect(store.findComponentsWithProp('')).toEqual([]);
  });
});

describe('SchemaStore.suggestComponents', () => {
  it('scores an exact name match highly', () => {
    const store = minimalStore();
    const results = store.suggestComponents('I need a Button');
    expect(results[0].component.name).toBe('Button');
    expect(results[0].matchReasons.some((r) => r.includes('Name matches'))).toBe(true);
  });

  it('matches on category terms', () => {
    const store = minimalStore();
    const results = store.suggestComponents('forms input field');
    expect(results.map((r) => r.component.name)).toContain('Input');
  });

  it('uses enhanced description keywords', () => {
    const store = new SchemaStore(createEnhancedTestSchema());
    const results = store.suggestComponents('modal confirmation overlay');
    expect(results.map((r) => r.component.name)).toContain('Dialog');
  });

  it('returns results sorted by descending score', () => {
    const store = minimalStore();
    const results = store.suggestComponents('Button');
    for (let i = 1; i < results.length; i += 1) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it('returns an empty array for empty input', () => {
    const store = minimalStore();
    expect(store.suggestComponents('   ')).toEqual([]);
  });

  it('returns an empty array when nothing matches', () => {
    const store = minimalStore();
    expect(store.suggestComponents('zzzz qqqq')).toEqual([]);
  });
});

describe('SchemaStore.compareComponents', () => {
  it('computes shared and unique props', () => {
    const store = minimalStore();
    const result = store.compareComponents('Button', 'Input');
    expect(result.component1).toBe('Button');
    expect(result.component2).toBe('Input');
    // Both have appearance and disabled.
    expect(result.sharedProps).toContain('appearance');
    expect(result.sharedProps).toContain('disabled');
    // Button has size, icon; Input has value, type, defaultValue.
    expect(result.uniqueToFirst).toContain('size');
    expect(result.uniqueToSecond).toContain('value');
  });

  it('reports slot differences', () => {
    const store = minimalStore();
    const result = store.compareComponents('Button', 'Input');
    expect(result.slotDifferences.length).toBeGreaterThan(0);
  });

  it('throws when the first component is missing', () => {
    const store = minimalStore();
    expect(() => store.compareComponents('Nope', 'Button')).toThrow(/not found: Nope/);
  });

  it('throws when the second component is missing', () => {
    const store = minimalStore();
    expect(() => store.compareComponents('Button', 'Nope')).toThrow(/not found: Nope/);
  });

  it('returns sorted prop lists', () => {
    const store = minimalStore();
    const result = store.compareComponents('Button', 'Input');
    const sorted = [...result.sharedProps].sort();
    expect(result.sharedProps).toEqual(sorted);
  });
});
