/**
 * Spec tests for the Phase 2 grounding data layer (maximum-enhancement).
 *
 * These tests assert the "smart-maximal" grounding contract:
 *   - `ComponentSummary` carries the FULL prop/slot/relationship surface
 *     (no `KEY_PROPS_LIMIT` cap).
 *   - Serializers emit every prop (name + type), every slot, related
 *     components, and additional exports.
 *   - `serializeComponentForPrompt` includes full story `code` plus
 *     component compositions (relatedComponents / additionalExports).
 *   - `resolveTargetComponents` maps ids → entries, skipping unknown ids.
 *   - The PF-008 input-budget guard keeps targeted components at full
 *     fidelity while degrading the non-targeted inventory to compact lines
 *     only when the estimated size exceeds the budget.
 *
 * Written before implementation (RED) per the execution plan.
 *
 * @module tests/enhancer/grounding.spec
 */

import { describe, it, expect } from 'vitest';

import {
  toComponentSummary,
  buildComponentSummaries,
  serializeComponentSummaries,
  serializeComponentSummariesBudgeted,
  resolveTargetComponents,
  estimateTokens,
  GROUNDING_INPUT_BUDGET_TOKENS,
} from '../../../scripts/enhancer/prompts/shared.js';
import { serializeComponentForPrompt } from '../../../scripts/enhancer/prompts/component-enhance.js';
import { createComponentEntry, createPropEntry } from '../fixtures/helpers.js';
import type { PropEntry } from '../../types/index.js';

// ============================================================================
// Helpers
// ============================================================================

/** Build N props named p0..p(N-1) for cap-removal assertions. */
function manyProps(count: number): PropEntry[] {
  return Array.from({ length: count }, (_, i) =>
    createPropEntry(`p${i}`, {
      type: i % 2 === 0 ? 'string' : 'number',
      required: i < 2,
    }),
  );
}

// ============================================================================
// ST-11 / ST-17: full props, no cap
// ============================================================================

describe('toComponentSummary — no prop cap (ST-11, ST-17)', () => {
  it('returns ALL props with name, type, and required flag', () => {
    const component = createComponentEntry('Demo', { props: manyProps(20) });
    const summary = toComponentSummary(component);

    expect(summary.props).toHaveLength(20);
    expect(summary.props[0]).toEqual({ name: 'p0', type: 'string', required: true });
    expect(summary.props[19]).toEqual({ name: 'p19', type: 'number', required: false });
  });

  it('does not truncate at the old KEY_PROPS_LIMIT of 6', () => {
    const component = createComponentEntry('Demo', { props: manyProps(9) });
    const summary = toComponentSummary(component);
    expect(summary.props.length).toBeGreaterThan(6);
    // The enriched summary has no `keyProps` field anymore.
    expect((summary as unknown as { keyProps?: unknown }).keyProps).toBeUndefined();
  });
});

// ============================================================================
// ST-12: slots
// ============================================================================

describe('toComponentSummary — slots (ST-12)', () => {
  it('includes every slot with its element type', () => {
    const component = createComponentEntry('Button');
    const summary = toComponentSummary(component);
    expect(summary.slots).toEqual([{ name: 'root', elementType: 'button' }]);
  });
});

// ============================================================================
// ST-13: relationships
// ============================================================================

describe('toComponentSummary — relationships (ST-13)', () => {
  it('carries relatedComponents and additionalExports', () => {
    const component = createComponentEntry('Button', {
      relatedComponents: ['CompoundButton', 'ToggleButton'],
      additionalExports: ['buttonClassNames'],
    });
    const summary = toComponentSummary(component);
    expect(summary.relatedComponents).toEqual(['CompoundButton', 'ToggleButton']);
    expect(summary.additionalExports).toEqual(['buttonClassNames']);
  });
});

// ============================================================================
// ST-14: full serialization
// ============================================================================

describe('serializeComponentSummaries — full grounding (ST-14)', () => {
  it('emits every prop name + type and every slot', () => {
    const component = createComponentEntry('Button', {
      props: [
        createPropEntry('appearance', { type: "'primary' | 'secondary'" }),
        createPropEntry('size', { type: "'small' | 'large'" }),
      ],
      relatedComponents: ['ToggleButton'],
      additionalExports: ['buttonClassNames'],
    });
    const text = serializeComponentSummaries(buildComponentSummaries([component]));

    expect(text).toContain('Button');
    expect(text).toContain('appearance');
    expect(text).toContain("'primary' | 'secondary'");
    expect(text).toContain('size');
    expect(text).toContain('root'); // slot name
    expect(text).toContain('ToggleButton'); // related
    expect(text).toContain('buttonClassNames'); // additional export
  });
});

// ============================================================================
// ST-15: full story code + compositions
// ============================================================================

describe('serializeComponentForPrompt — full stories + compositions (ST-15)', () => {
  it('includes full story code (not just renderCode) and compositions', () => {
    const component = createComponentEntry('Button', {
      stories: [
        {
          name: 'Appearance',
          description: 'Appearance variants',
          code: 'import { Button } from "@fluentui/react-components";\nexport const Appearance = () => <Button appearance="primary">Hi</Button>;',
          renderCode: '<Button appearance="primary">Hi</Button>',
          sourceFile: 'Button.stories.tsx',
          imports: ['import { Button } from "@fluentui/react-components"'],
        },
      ],
      relatedComponents: ['ToggleButton'],
      additionalExports: ['buttonClassNames'],
    });

    const serialized = serializeComponentForPrompt(component);

    // Full story source code present (the `export const Appearance` only
    // appears in `code`, not `renderCode`).
    expect(serialized).toContain('export const Appearance');
    // Compositions present.
    expect(serialized).toContain('ToggleButton');
    expect(serialized).toContain('buttonClassNames');
  });
});

// ============================================================================
// ST-16: targeted component resolution
// ============================================================================

describe('resolveTargetComponents (ST-16)', () => {
  it('resolves entries from ids and skips unknown ids', () => {
    const components = [
      createComponentEntry('Button'),
      createComponentEntry('Input', { category: 'forms' }),
    ];
    const resolved = resolveTargetComponents(components, ['input', 'does-not-exist']);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].name).toBe('Input');
  });

  it('returns empty array when no ids match', () => {
    const components = [createComponentEntry('Button')];
    expect(resolveTargetComponents(components, ['nope'])).toEqual([]);
  });
});

// ============================================================================
// ST-17b / ST-17c: input-budget guard (PF-008)
// ============================================================================

describe('estimateTokens', () => {
  it('estimates ~4 chars per token', () => {
    expect(estimateTokens('aaaa')).toBe(1);
    expect(estimateTokens('aaaaa')).toBe(2);
    expect(estimateTokens('')).toBe(0);
  });

  it('exposes a sane default grounding budget', () => {
    expect(GROUNDING_INPUT_BUDGET_TOKENS).toBeGreaterThan(1000);
  });
});

describe('serializeComponentSummariesBudgeted — PF-008 (ST-17b, ST-17c)', () => {
  const summaries = buildComponentSummaries([
    createComponentEntry('Button'),
    createComponentEntry('Input', { category: 'forms' }),
  ]);

  it('emits the full inventory when it fits the budget (ST-17b)', () => {
    const text = serializeComponentSummariesBudgeted(summaries, {
      targetNames: ['Button'],
      budgetTokens: GROUNDING_INPUT_BUDGET_TOKENS,
    });
    // Full multiline format uses `slots:` and never the compact `[props:` marker.
    expect(text).toContain('slots:');
    expect(text).not.toContain('[props:');
  });

  it('degrades non-targeted components to compact lines over budget (ST-17c)', () => {
    const text = serializeComponentSummariesBudgeted(summaries, {
      targetNames: ['Button'],
      budgetTokens: 1, // force degradation
    });
    // Targeted Button stays full-fidelity (multiline slots present).
    expect(text).toContain('slots:');
    // Non-targeted Input degrades to a compact inline line.
    expect(text).toContain('[props:');
  });

  it('logs which inventory mode was used when a logger is supplied', () => {
    const logs: string[] = [];
    serializeComponentSummariesBudgeted(summaries, {
      budgetTokens: 1,
      log: (m) => logs.push(m),
    });
    expect(logs.join('\n')).toMatch(/compact/i);
  });
});
