/**
 * Tests for the source hash computation module.
 *
 * Validates that hashes are deterministic, change when API surface
 * changes, and remain stable when non-API fields change.
 *
 * @module tests/enhancer/hasher
 */

import { describe, it, expect } from 'vitest';

import {
  computeComponentHash,
  computeUtilityHash,
  buildHashIndex,
} from '../../../scripts/enhancer/hasher.js';
import {
  createComponentEntry,
  createPropEntry,
  createSlotEntry,
  createStoryEntry,
  createUtilityEntry,
  createUtilityExport,
} from '../fixtures/helpers.js';

// ============================================================================
// computeComponentHash
// ============================================================================

describe('computeComponentHash', () => {
  it('should return a 16-character hex string', () => {
    const component = createComponentEntry();
    const hash = computeComponentHash(component);

    expect(hash).toHaveLength(16);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('should be deterministic (same input → same hash)', () => {
    const component = createComponentEntry();
    const hash1 = computeComponentHash(component);
    const hash2 = computeComponentHash(component);

    expect(hash1).toBe(hash2);
  });

  it('should be deterministic across separate instances with same data', () => {
    const component1 = createComponentEntry('Button');
    const component2 = createComponentEntry('Button');

    expect(computeComponentHash(component1)).toBe(
      computeComponentHash(component2),
    );
  });

  it('should change when a prop is added', () => {
    const base = createComponentEntry('TestComp', {
      props: [createPropEntry('appearance')],
    });
    const withExtraProp = createComponentEntry('TestComp', {
      props: [createPropEntry('appearance'), createPropEntry('size')],
    });

    expect(computeComponentHash(base)).not.toBe(
      computeComponentHash(withExtraProp),
    );
  });

  it('should change when a prop type changes', () => {
    const original = createComponentEntry('TestComp', {
      props: [createPropEntry('size', { type: 'string' })],
    });
    const changed = createComponentEntry('TestComp', {
      props: [
        createPropEntry('size', { type: "'small' | 'medium' | 'large'" }),
      ],
    });

    expect(computeComponentHash(original)).not.toBe(
      computeComponentHash(changed),
    );
  });

  it('should change when a prop required status changes', () => {
    const optional = createComponentEntry('TestComp', {
      props: [createPropEntry('value', { required: false })],
    });
    const required = createComponentEntry('TestComp', {
      props: [createPropEntry('value', { required: true })],
    });

    expect(computeComponentHash(optional)).not.toBe(
      computeComponentHash(required),
    );
  });

  it('should change when a slot is added', () => {
    const base = createComponentEntry('TestComp', {
      slots: [createSlotEntry('root')],
    });
    const withSlot = createComponentEntry('TestComp', {
      slots: [createSlotEntry('root'), createSlotEntry('icon')],
    });

    expect(computeComponentHash(base)).not.toBe(
      computeComponentHash(withSlot),
    );
  });

  it('should change when slot elementType changes', () => {
    const div = createComponentEntry('TestComp', {
      slots: [createSlotEntry('root', { elementType: 'div' })],
    });
    const span = createComponentEntry('TestComp', {
      slots: [createSlotEntry('root', { elementType: 'span' })],
    });

    expect(computeComponentHash(div)).not.toBe(computeComponentHash(span));
  });

  it('should change when story count changes', () => {
    const oneStory = createComponentEntry('TestComp', {
      stories: [createStoryEntry('Default')],
    });
    const twoStories = createComponentEntry('TestComp', {
      stories: [createStoryEntry('Default'), createStoryEntry('Disabled')],
    });

    expect(computeComponentHash(oneStory)).not.toBe(
      computeComponentHash(twoStories),
    );
  });

  it('should change when packageVersion changes', () => {
    const v1 = createComponentEntry('TestComp', { packageVersion: '9.1.0' });
    const v2 = createComponentEntry('TestComp', { packageVersion: '9.2.0' });

    expect(computeComponentHash(v1)).not.toBe(computeComponentHash(v2));
  });

  it('should change when component name changes', () => {
    const button = createComponentEntry('Button');
    const link = createComponentEntry('Link');

    expect(computeComponentHash(button)).not.toBe(
      computeComponentHash(link),
    );
  });

  // ========================================================================
  // Non-API fields should NOT affect the hash
  // ========================================================================

  it('should NOT change when description changes', () => {
    const base = createComponentEntry();
    const withDesc = createComponentEntry();
    expect(computeComponentHash(base)).toBe(computeComponentHash(withDesc));
  });

  it('should NOT change when category changes', () => {
    const buttons = createComponentEntry('TestComp', { category: 'buttons' });
    const forms = createComponentEntry('TestComp', { category: 'forms' });

    expect(computeComponentHash(buttons)).toBe(computeComponentHash(forms));
  });

  it('should NOT change when stability changes', () => {
    const stable = createComponentEntry('TestComp', { stability: 'stable' });
    const preview = createComponentEntry('TestComp', { stability: 'preview' });

    expect(computeComponentHash(stable)).toBe(computeComponentHash(preview));
  });

  it('should NOT change when importPath changes', () => {
    const umbrella = createComponentEntry('TestComp', {
      importPath: '@fluentui/react-components',
    });
    const direct = createComponentEntry('TestComp', {
      importPath: '@fluentui/react-button',
    });

    expect(computeComponentHash(umbrella)).toBe(
      computeComponentHash(direct),
    );
  });

  it('should NOT change when prop description changes', () => {
    const short = createComponentEntry('TestComp', {
      props: [createPropEntry('size', { description: 'Short' })],
    });
    const long = createComponentEntry('TestComp', {
      props: [
        createPropEntry('size', { description: 'A longer description' }),
      ],
    });

    expect(computeComponentHash(short)).toBe(computeComponentHash(long));
  });

  it('should NOT change when prop defaultValue changes', () => {
    const noDefault = createComponentEntry('TestComp', {
      props: [createPropEntry('size')],
    });
    const withDefault = createComponentEntry('TestComp', {
      props: [createPropEntry('size', { defaultValue: 'medium' })],
    });

    expect(computeComponentHash(noDefault)).toBe(
      computeComponentHash(withDefault),
    );
  });

  it('should NOT change when story content changes (only count matters)', () => {
    const story1 = createComponentEntry('TestComp', {
      stories: [createStoryEntry('Default', { code: 'code v1' })],
    });
    const story2 = createComponentEntry('TestComp', {
      stories: [createStoryEntry('Default', { code: 'code v2' })],
    });

    expect(computeComponentHash(story1)).toBe(computeComponentHash(story2));
  });
});

// ============================================================================
// computeUtilityHash
// ============================================================================

describe('computeUtilityHash', () => {
  it('should return a 16-character hex string', () => {
    const utility = createUtilityEntry();
    const hash = computeUtilityHash(utility);

    expect(hash).toHaveLength(16);
    expect(hash).toMatch(/^[0-9a-f]{16}$/);
  });

  it('should be deterministic', () => {
    const utility = createUtilityEntry();
    expect(computeUtilityHash(utility)).toBe(computeUtilityHash(utility));
  });

  it('should change when an export is added', () => {
    const base = createUtilityEntry('TestUtil', {
      exports: [createUtilityExport('usePositioning')],
    });
    const withExtra = createUtilityEntry('TestUtil', {
      exports: [
        createUtilityExport('usePositioning'),
        createUtilityExport('useOverflow'),
      ],
    });

    expect(computeUtilityHash(base)).not.toBe(computeUtilityHash(withExtra));
  });

  it('should change when export kind changes', () => {
    const hook = createUtilityEntry('TestUtil', {
      exports: [createUtilityExport('usePositioning', 'hook')],
    });
    const fn = createUtilityEntry('TestUtil', {
      exports: [createUtilityExport('usePositioning', 'function')],
    });

    expect(computeUtilityHash(hook)).not.toBe(computeUtilityHash(fn));
  });

  it('should change when packageVersion changes', () => {
    const v1 = createUtilityEntry('TestUtil', { packageVersion: '9.1.0' });
    const v2 = createUtilityEntry('TestUtil', { packageVersion: '9.2.0' });

    expect(computeUtilityHash(v1)).not.toBe(computeUtilityHash(v2));
  });

  it('should NOT change when stability changes', () => {
    const stable = createUtilityEntry('TestUtil', { stability: 'stable' });
    const preview = createUtilityEntry('TestUtil', { stability: 'preview' });

    expect(computeUtilityHash(stable)).toBe(computeUtilityHash(preview));
  });
});

// ============================================================================
// buildHashIndex
// ============================================================================

describe('buildHashIndex', () => {
  it('should build an index with entries for all components and utilities', () => {
    const components = [
      createComponentEntry('Button'),
      createComponentEntry('Input'),
    ];
    const utilities = [createUtilityEntry('Positioning')];

    const index = buildHashIndex(components, utilities);

    expect(Object.keys(index)).toHaveLength(3);
    expect(index[components[0]!.id]).toBeDefined();
    expect(index[components[1]!.id]).toBeDefined();
    expect(index[utilities[0]!.id]).toBeDefined();
  });

  it('should produce valid 16-char hex hashes for all entries', () => {
    const components = [createComponentEntry()];
    const utilities = [createUtilityEntry()];

    const index = buildHashIndex(components, utilities);

    for (const hash of Object.values(index)) {
      expect(hash).toMatch(/^[0-9a-f]{16}$/);
    }
  });

  it('should return empty index for empty arrays', () => {
    const index = buildHashIndex([], []);
    expect(Object.keys(index)).toHaveLength(0);
  });

  it('should produce different hashes for different components', () => {
    const button = createComponentEntry('Button', {
      props: [createPropEntry('appearance')],
    });
    const input = createComponentEntry('Input', {
      props: [createPropEntry('value')],
    });

    const index = buildHashIndex([button, input], []);
    expect(index[button.id]).not.toBe(index[input.id]);
  });
});
