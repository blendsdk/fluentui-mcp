/**
 * Tests for the diff engine.
 *
 * Validates that the diff engine correctly categorizes components and
 * utilities as new, changed, unchanged, or removed by comparing
 * source hashes between raw and previous enhanced schemas.
 *
 * @module tests/enhancer/diff
 */

import { describe, it, expect } from 'vitest';

import { diffSchemas, formatDiffReport } from '../../../scripts/enhancer/diff.js';
import { buildHashIndex } from '../../../scripts/enhancer/hasher.js';
import {
  createFluentUISchema,
  createComponentEntry,
  createPropEntry,
  createUtilityEntry,
  createUtilityExport,
} from '../fixtures/helpers.js';

// ============================================================================
// First-Run Scenario (no previous schema)
// ============================================================================

describe('diffSchemas — first run (no previous)', () => {
  it('should mark all components as new when no previous schema', () => {
    const raw = createFluentUISchema({
      components: [
        createComponentEntry('Button'),
        createComponentEntry('Input'),
      ],
    });

    const diff = diffSchemas(raw, null, null);

    expect(diff.newComponents).toHaveLength(2);
    expect(diff.changedComponents).toHaveLength(0);
    expect(diff.unchangedComponentIds).toHaveLength(0);
    expect(diff.removedComponentIds).toHaveLength(0);
  });

  it('should mark all utilities as new when no previous schema', () => {
    const raw = createFluentUISchema({
      utilities: [createUtilityEntry('Positioning')],
    });

    const diff = diffSchemas(raw, null, null);

    expect(diff.newUtilities).toHaveLength(1);
    expect(diff.changedUtilities).toHaveLength(0);
    expect(diff.unchangedUtilityIds).toHaveLength(0);
  });

  it('should report correct stats for first run', () => {
    const raw = createFluentUISchema({
      components: [
        createComponentEntry('Button'),
        createComponentEntry('Input'),
        createComponentEntry('Dialog'),
      ],
      utilities: [createUtilityEntry('Positioning')],
    });

    const diff = diffSchemas(raw, null, null);

    expect(diff.stats.totalComponents).toBe(3);
    expect(diff.stats.newComponents).toBe(3);
    expect(diff.stats.changedComponents).toBe(0);
    expect(diff.stats.unchangedComponents).toBe(0);
    expect(diff.stats.removedComponents).toBe(0);
    expect(diff.stats.totalUtilities).toBe(1);
    expect(diff.stats.newUtilities).toBe(1);
  });
});

// ============================================================================
// Incremental Scenario (with previous schema)
// ============================================================================

describe('diffSchemas — incremental update', () => {
  it('should detect unchanged components (same hash)', () => {
    const button = createComponentEntry('Button', {
      props: [createPropEntry('appearance')],
    });

    const raw = createFluentUISchema({ components: [button] });
    const previous = createFluentUISchema({ components: [button] });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);

    expect(diff.unchangedComponentIds).toContain(button.id);
    expect(diff.newComponents).toHaveLength(0);
    expect(diff.changedComponents).toHaveLength(0);
  });

  it('should detect new components', () => {
    const button = createComponentEntry('Button');
    const input = createComponentEntry('Input');

    const raw = createFluentUISchema({ components: [button, input] });
    const previous = createFluentUISchema({ components: [button] });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);

    expect(diff.newComponents).toHaveLength(1);
    expect(diff.newComponents[0]!.id).toBe(input.id);
    expect(diff.unchangedComponentIds).toContain(button.id);
  });

  it('should detect changed components (prop added)', () => {
    const buttonV1 = createComponentEntry('Button', {
      props: [createPropEntry('appearance')],
    });
    const buttonV2 = createComponentEntry('Button', {
      props: [createPropEntry('appearance'), createPropEntry('size')],
    });

    const raw = createFluentUISchema({ components: [buttonV2] });
    const previous = createFluentUISchema({ components: [buttonV1] });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);

    expect(diff.changedComponents).toHaveLength(1);
    expect(diff.changedComponents[0]!.id).toBe(buttonV2.id);
    expect(diff.newComponents).toHaveLength(0);
    expect(diff.unchangedComponentIds).toHaveLength(0);
  });

  it('should detect changed components (version bump)', () => {
    const buttonV1 = createComponentEntry('Button', {
      packageVersion: '9.1.0',
    });
    const buttonV2 = createComponentEntry('Button', {
      packageVersion: '9.2.0',
    });

    const raw = createFluentUISchema({ components: [buttonV2] });
    const previous = createFluentUISchema({ components: [buttonV1] });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);

    expect(diff.changedComponents).toHaveLength(1);
  });

  it('should detect removed components', () => {
    const button = createComponentEntry('Button');
    const input = createComponentEntry('Input');

    const raw = createFluentUISchema({ components: [button] });
    const previous = createFluentUISchema({ components: [button, input] });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);

    expect(diff.removedComponentIds).toContain(input.id);
    expect(diff.removedComponentIds).toHaveLength(1);
    expect(diff.unchangedComponentIds).toContain(button.id);
  });

  it('should handle mixed scenario (new + changed + unchanged + removed)', () => {
    const unchanged = createComponentEntry('Dialog', {
      props: [createPropEntry('open')],
    });
    const changedV1 = createComponentEntry('Button', {
      props: [createPropEntry('appearance')],
    });
    const changedV2 = createComponentEntry('Button', {
      props: [createPropEntry('appearance'), createPropEntry('icon')],
    });
    const newComp = createComponentEntry('Card');
    const removed = createComponentEntry('OldThing');

    const raw = createFluentUISchema({
      components: [unchanged, changedV2, newComp],
    });
    const previous = createFluentUISchema({
      components: [unchanged, changedV1, removed],
    });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);

    expect(diff.newComponents.map((c) => c.id)).toEqual([newComp.id]);
    expect(diff.changedComponents.map((c) => c.id)).toEqual([changedV2.id]);
    expect(diff.unchangedComponentIds).toEqual([unchanged.id]);
    expect(diff.removedComponentIds).toEqual([removed.id]);

    expect(diff.stats.totalComponents).toBe(3);
    expect(diff.stats.newComponents).toBe(1);
    expect(diff.stats.changedComponents).toBe(1);
    expect(diff.stats.unchangedComponents).toBe(1);
    expect(diff.stats.removedComponents).toBe(1);
  });

  it('should handle utility diffs', () => {
    const utilV1 = createUtilityEntry('Positioning', {
      exports: [createUtilityExport('usePositioning')],
    });
    const utilV2 = createUtilityEntry('Positioning', {
      exports: [
        createUtilityExport('usePositioning'),
        createUtilityExport('useOverflow'),
      ],
    });
    const newUtil = createUtilityEntry('Motion');

    const raw = createFluentUISchema({ utilities: [utilV2, newUtil] });
    const previous = createFluentUISchema({ utilities: [utilV1] });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);

    expect(diff.changedUtilities).toHaveLength(1);
    expect(diff.changedUtilities[0]!.id).toBe(utilV2.id);
    expect(diff.newUtilities).toHaveLength(1);
    expect(diff.newUtilities[0]!.id).toBe(newUtil.id);
  });
});

// ============================================================================
// formatDiffReport
// ============================================================================

describe('formatDiffReport', () => {
  it('should produce a readable report string', () => {
    const raw = createFluentUISchema({
      components: [
        createComponentEntry('Button', { category: 'buttons' }),
        createComponentEntry('Card', { category: 'layout' }),
      ],
    });

    const diff = diffSchemas(raw, null, null);
    const report = formatDiffReport(diff, 'v9');

    expect(report).toContain('FluentUI Enhancement Diff Report');
    expect(report).toContain('Version: v9');
    expect(report).toContain('NEW (2)');
    expect(report).toContain('Button (buttons)');
    expect(report).toContain('Card (layout)');
    expect(report).toContain('Total entries to enhance: 2');
  });

  it('should include utility information', () => {
    const raw = createFluentUISchema({
      utilities: [createUtilityEntry('Positioning')],
    });

    const diff = diffSchemas(raw, null, null);
    const report = formatDiffReport(diff, 'v9');

    expect(report).toContain('Positioning');
  });

  it('should show removed entries', () => {
    const button = createComponentEntry('Button');
    const removed = createComponentEntry('OldComp');

    const raw = createFluentUISchema({ components: [button] });
    const previous = createFluentUISchema({ components: [button, removed] });
    const previousHashes = buildHashIndex(previous.components, previous.utilities);

    const diff = diffSchemas(raw, previous, previousHashes);
    const report = formatDiffReport(diff, 'v9');

    expect(report).toContain('REMOVED (1)');
    expect(report).toContain(removed.id);
  });
});
