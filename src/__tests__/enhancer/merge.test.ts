/**
 * Tests for the merge logic.
 *
 * Validates that enhancements are correctly applied to new/changed
 * components, carried forward for unchanged components, and that
 * removed components are dropped from the output.
 *
 * @module tests/enhancer/merge
 */

import { describe, it, expect } from 'vitest';

import {
  mergeEnhancements,
  applyComponentEnhancement,
  carryForwardComponent,
  buildComponentEnhancementMap,
  buildPreviousComponentMap,
} from '../../../scripts/enhancer/merge.js';
import { diffSchemas } from '../../../scripts/enhancer/diff.js';
import { buildHashIndex } from '../../../scripts/enhancer/hasher.js';
import {
  createFluentUISchema,
  createComponentEntry,
  createPropEntry,
  createGuideEntry,
} from '../fixtures/helpers.js';
import type { ComponentEnhancementResult } from '../../../scripts/enhancer/types.js';

// ============================================================================
// Helper to create mock enhancement results
// ============================================================================

function createEnhancement(
  overrides?: Partial<ComponentEnhancementResult>,
): ComponentEnhancementResult {
  return {
    id: 'button',
    description: 'A clickable button component',
    whenToUse: ['For primary actions'],
    whenNotToUse: ['For navigation — use Link instead'],
    accessibilityNotes: ['Has built-in ARIA button role'],
    bestPractices: ['Always provide a label'],
    relatedComponents: ['compound-button', 'toggle-button'],
    sourceHash: 'abc123def456',
    ...overrides,
  };
}

// ============================================================================
// applyComponentEnhancement
// ============================================================================

describe('applyComponentEnhancement', () => {
  it('should apply relatedComponents from enhancement', () => {
    const raw = createComponentEntry('Button');
    const enhancement = createEnhancement({
      id: raw.id,
      relatedComponents: ['link', 'compound-button'],
    });
    const hashIndex = { [raw.id]: 'abc123' };

    const result = applyComponentEnhancement(raw, enhancement, hashIndex);

    expect(result.relatedComponents).toEqual(['link', 'compound-button']);
  });

  it('should preserve raw structural data', () => {
    const raw = createComponentEntry('Button', {
      props: [createPropEntry('appearance')],
    });
    const enhancement = createEnhancement({ id: raw.id });
    const hashIndex = { [raw.id]: 'abc123' };

    const result = applyComponentEnhancement(raw, enhancement, hashIndex);

    expect(result.name).toBe('Button');
    expect(result.props).toHaveLength(1);
    expect(result.props[0]!.name).toBe('appearance');
  });
});

// ============================================================================
// carryForwardComponent
// ============================================================================

describe('carryForwardComponent', () => {
  it('should carry forward relatedComponents from previous', () => {
    const raw = createComponentEntry('Button', {
      relatedComponents: [],
    });
    const previous = createComponentEntry('Button', {
      relatedComponents: ['link', 'toggle-button'],
    });

    const result = carryForwardComponent(raw, previous);

    expect(result.relatedComponents).toEqual(['link', 'toggle-button']);
  });

  it('should use raw structural data (props, slots)', () => {
    const raw = createComponentEntry('Button', {
      props: [createPropEntry('newProp')],
    });
    const previous = createComponentEntry('Button', {
      props: [createPropEntry('oldProp')],
    });

    const result = carryForwardComponent(raw, previous);

    // Structural data comes from raw
    expect(result.props[0]!.name).toBe('newProp');
  });
});

// ============================================================================
// Map Builders
// ============================================================================

describe('buildComponentEnhancementMap', () => {
  it('should build a map keyed by component ID', () => {
    const enhancements = [
      createEnhancement({ id: 'button' }),
      createEnhancement({ id: 'input' }),
    ];

    const map = buildComponentEnhancementMap(enhancements);

    expect(map.size).toBe(2);
    expect(map.get('button')!.id).toBe('button');
    expect(map.get('input')!.id).toBe('input');
  });

  it('should return empty map for empty array', () => {
    const map = buildComponentEnhancementMap([]);
    expect(map.size).toBe(0);
  });
});

describe('buildPreviousComponentMap', () => {
  it('should build a map from schema components', () => {
    const schema = createFluentUISchema({
      components: [
        createComponentEntry('Button'),
        createComponentEntry('Input'),
      ],
    });

    const map = buildPreviousComponentMap(schema);

    expect(map.size).toBe(2);
  });

  it('should return empty map for null schema', () => {
    const map = buildPreviousComponentMap(null);
    expect(map.size).toBe(0);
  });
});

// ============================================================================
// mergeEnhancements — full integration
// ============================================================================

describe('mergeEnhancements', () => {
  it('should apply enhancements to new components', () => {
    const button = createComponentEntry('Button');
    const rawSchema = createFluentUISchema({ components: [button] });

    const diff = diffSchemas(rawSchema, null, null);
    const hashIndex = buildHashIndex(rawSchema.components, rawSchema.utilities);

    const result = mergeEnhancements({
      rawSchema,
      previousSchema: null,
      diff,
      componentEnhancements: [
        createEnhancement({
          id: button.id,
          relatedComponents: ['link'],
        }),
      ],
      utilityEnhancements: [],
      hashIndex,
    });

    expect(result.components).toHaveLength(1);
    expect(result.components[0]!.relatedComponents).toEqual(['link']);
  });

  it('should carry forward unchanged components', () => {
    const button = createComponentEntry('Button', {
      relatedComponents: ['link'],
      props: [createPropEntry('appearance')],
    });

    const rawSchema = createFluentUISchema({ components: [button] });
    const previousSchema = createFluentUISchema({ components: [button] });
    const previousHashes = buildHashIndex(
      previousSchema.components,
      previousSchema.utilities,
    );

    const diff = diffSchemas(rawSchema, previousSchema, previousHashes);
    const hashIndex = buildHashIndex(rawSchema.components, rawSchema.utilities);

    const result = mergeEnhancements({
      rawSchema,
      previousSchema,
      diff,
      componentEnhancements: [],
      utilityEnhancements: [],
      hashIndex,
    });

    expect(result.components).toHaveLength(1);
    expect(result.components[0]!.relatedComponents).toEqual(['link']);
  });

  it('should drop removed components (they are simply not in raw)', () => {
    const button = createComponentEntry('Button');
    const removed = createComponentEntry('OldComp');

    const rawSchema = createFluentUISchema({ components: [button] });
    const previousSchema = createFluentUISchema({
      components: [button, removed],
    });
    const previousHashes = buildHashIndex(
      previousSchema.components,
      previousSchema.utilities,
    );

    const diff = diffSchemas(rawSchema, previousSchema, previousHashes);
    const hashIndex = buildHashIndex(rawSchema.components, rawSchema.utilities);

    const result = mergeEnhancements({
      rawSchema,
      previousSchema,
      diff,
      componentEnhancements: [],
      utilityEnhancements: [],
      hashIndex,
    });

    expect(result.components).toHaveLength(1);
    expect(result.components[0]!.id).toBe(button.id);
  });

  it('should carry forward guides from previous schema when raw has none', () => {
    const rawSchema = createFluentUISchema({
      foundation: [],
      patterns: [],
    });
    const previousSchema = createFluentUISchema({
      foundation: [createGuideEntry('theming', { title: 'Theming' })],
      patterns: [createGuideEntry('forms', { title: 'Forms' })],
    });

    const diff = diffSchemas(rawSchema, previousSchema, {});
    const hashIndex = buildHashIndex(rawSchema.components, rawSchema.utilities);

    const result = mergeEnhancements({
      rawSchema,
      previousSchema,
      diff,
      componentEnhancements: [],
      utilityEnhancements: [],
      hashIndex,
    });

    expect(result.foundation).toHaveLength(1);
    expect(result.foundation[0]!.id).toBe('theming');
    expect(result.patterns).toHaveLength(1);
    expect(result.patterns[0]!.id).toBe('forms');
  });

  it('should use raw guides when present (overriding previous)', () => {
    const rawSchema = createFluentUISchema({
      foundation: [createGuideEntry('new-theming', { title: 'New Theming' })],
    });
    const previousSchema = createFluentUISchema({
      foundation: [createGuideEntry('old-theming', { title: 'Old Theming' })],
    });

    const diff = diffSchemas(rawSchema, previousSchema, {});
    const hashIndex = buildHashIndex(rawSchema.components, rawSchema.utilities);

    const result = mergeEnhancements({
      rawSchema,
      previousSchema,
      diff,
      componentEnhancements: [],
      utilityEnhancements: [],
      hashIndex,
    });

    expect(result.foundation).toHaveLength(1);
    expect(result.foundation[0]!.id).toBe('new-theming');
  });

  it('should set generatedAt timestamp', () => {
    const rawSchema = createFluentUISchema();
    const diff = diffSchemas(rawSchema, null, null);
    const hashIndex = buildHashIndex(rawSchema.components, rawSchema.utilities);

    const result = mergeEnhancements({
      rawSchema,
      previousSchema: null,
      diff,
      componentEnhancements: [],
      utilityEnhancements: [],
      hashIndex,
    });

    expect(result.generatedAt).toBeDefined();
    expect(new Date(result.generatedAt).toISOString()).toBe(result.generatedAt);
  });
});
