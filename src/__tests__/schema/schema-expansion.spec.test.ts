/**
 * Spec tests for Phase 3 (Schema Expansion) and Phase 4 (Schema Validator)
 * of the maximum-enhancement plan.
 *
 * Phase 3 (ST-18..ST-19): the enhancer mapping functions copy the new optional
 * enriched fields through when present and default cleanly (stay `undefined`)
 * when absent.
 *
 * Phase 4 (ST-20..ST-22): the schema validator tolerates schemas without the
 * new fields (back-compat, 0 errors) and emits *warnings* (never errors) when a
 * `propGuidance`/`exportGuidance` entry references a prop/export that does not
 * exist on the component/utility.
 *
 * These are written test-first: they fail until the new types, mapping, and
 * validation are implemented.
 *
 * @module tests/schema/schema-expansion.spec
 */

import { describe, it, expect } from 'vitest';

import {
  mapComponentEnhanced,
  mapUtilityEnhanced,
  mapGuideEntry,
  mapPatternEntry,
} from '../../../scripts/enhancer/enhancer.js';
import { validateSchema } from '../../schema/schema-validator.js';
import {
  createEnhancedTestSchema,
  createComponentEntry,
  createComponentEnhanced,
  createUtilityEntry,
  createUtilityEnhanced,
  createFluentUISchema,
  createSchemaStats,
} from '../fixtures/helpers.js';
import type { GuideSpec } from '../../../scripts/enhancer/types.js';

// Raw response shapes are intentionally not exported from enhancer.ts; the
// mapping functions accept structural objects, so we cast loosely here.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRaw = any;

const GUIDE_SPEC: GuideSpec = {
  id: 'getting-started',
  title: 'Getting Started',
  group: 'foundation',
  description: 'A getting-started guide.',
};

const PATTERN_SPEC: GuideSpec = {
  id: 'login-form',
  title: 'Login Form',
  group: 'forms',
  description: 'A login-form pattern.',
};

// ============================================================================
// Phase 3 — Schema Expansion: mapping
// ============================================================================

describe('ST-18: mapComponentEnhanced copies new optional fields', () => {
  it('copies propGuidance, antiPatterns, and scalar/array enrichment fields', () => {
    const raw: AnyRaw = {
      description: 'desc',
      whenToUse: 'when',
      propGuidance: [
        { prop: 'appearance', guidance: 'Use primary for the main action', example: 'appearance="primary"' },
      ],
      antiPatterns: [
        {
          title: 'Button for navigation',
          problem: 'Using Button to navigate',
          solution: 'Use Link instead',
          code: '<Link href="/x">Go</Link>',
        },
      ],
      performanceNotes: 'Memoize icon slots to avoid re-renders.',
      themingNotes: 'Use tokens.colorBrandBackground; supports RTL.',
      compositionExamples: [
        { name: 'Icon slot', description: 'Override icon slot', code: '<Button icon={<AddRegular />} />' },
      ],
      relatedPatterns: ['login-form', 'dialog-patterns'],
      edgeCases: ['Disabled buttons do not fire onClick'],
    };

    const mapped = mapComponentEnhanced(raw, 'hash-1');

    expect(mapped.propGuidance).toEqual(raw.propGuidance);
    expect(mapped.antiPatterns).toEqual(raw.antiPatterns);
    expect(mapped.performanceNotes).toBe('Memoize icon slots to avoid re-renders.');
    expect(mapped.themingNotes).toBe('Use tokens.colorBrandBackground; supports RTL.');
    expect(mapped.compositionExamples).toEqual(raw.compositionExamples);
    expect(mapped.relatedPatterns).toEqual(['login-form', 'dialog-patterns']);
    expect(mapped.edgeCases).toEqual(['Disabled buttons do not fire onClick']);
  });

  it('leaves new fields undefined when the raw response omits them', () => {
    const mapped = mapComponentEnhanced({ description: 'd', whenToUse: 'w' } as AnyRaw, 'hash-2');

    expect(mapped.propGuidance).toBeUndefined();
    expect(mapped.antiPatterns).toBeUndefined();
    expect(mapped.performanceNotes).toBeUndefined();
    expect(mapped.themingNotes).toBeUndefined();
    expect(mapped.compositionExamples).toBeUndefined();
    expect(mapped.relatedPatterns).toBeUndefined();
    expect(mapped.edgeCases).toBeUndefined();
    // Existing required fields still default cleanly.
    expect(mapped.commonPatterns).toEqual([]);
  });
});

describe('ST-19: utility/guide/pattern mapping copies new optional fields', () => {
  it('mapUtilityEnhanced copies exportGuidance, performanceNotes, edgeCases', () => {
    const raw: AnyRaw = {
      description: 'desc',
      whenToUse: 'when',
      exportGuidance: [
        { export: 'usePositioning', guidance: 'Call once per floating element', example: 'usePositioning(opts)' },
      ],
      performanceNotes: 'Avoid recreating options objects each render.',
      edgeCases: ['Returns a no-op on the server'],
    };

    const mapped = mapUtilityEnhanced(raw, 'uhash');

    expect(mapped.exportGuidance).toEqual(raw.exportGuidance);
    expect(mapped.performanceNotes).toBe('Avoid recreating options objects each render.');
    expect(mapped.edgeCases).toEqual(['Returns a no-op on the server']);
  });

  it('mapUtilityEnhanced leaves new fields undefined when omitted', () => {
    const mapped = mapUtilityEnhanced({ description: 'd', whenToUse: 'w' } as AnyRaw, 'uhash2');
    expect(mapped.exportGuidance).toBeUndefined();
    expect(mapped.performanceNotes).toBeUndefined();
    expect(mapped.edgeCases).toBeUndefined();
  });

  it('mapGuideEntry copies keyTakeaways, pitfalls, accessibilityNotes', () => {
    const raw: AnyRaw = {
      content: '# Guide',
      keyTakeaways: ['Wrap the app in FluentProvider'],
      pitfalls: ['Forgetting the theme prop'],
      accessibilityNotes: 'Ensure a single FluentProvider at the root.',
    };

    const mapped = mapGuideEntry(GUIDE_SPEC, raw);

    expect(mapped.keyTakeaways).toEqual(['Wrap the app in FluentProvider']);
    expect(mapped.pitfalls).toEqual(['Forgetting the theme prop']);
    expect(mapped.accessibilityNotes).toBe('Ensure a single FluentProvider at the root.');
  });

  it('mapGuideEntry leaves new fields undefined when omitted', () => {
    const mapped = mapGuideEntry(GUIDE_SPEC, { content: '# G' } as AnyRaw);
    expect(mapped.keyTakeaways).toBeUndefined();
    expect(mapped.pitfalls).toBeUndefined();
    expect(mapped.accessibilityNotes).toBeUndefined();
  });

  it('mapPatternEntry copies whenToUse, whenNotToUse, accessibilityNotes, pitfalls', () => {
    const raw: AnyRaw = {
      content: '# Pattern',
      whenToUse: 'Use for credential entry.',
      whenNotToUse: 'Avoid for SSO-only flows.',
      accessibilityNotes: 'Associate labels with inputs via Field.',
      pitfalls: ['Missing autocomplete attributes'],
    };

    const mapped = mapPatternEntry(PATTERN_SPEC, raw);

    expect(mapped.whenToUse).toBe('Use for credential entry.');
    expect(mapped.whenNotToUse).toBe('Avoid for SSO-only flows.');
    expect(mapped.accessibilityNotes).toBe('Associate labels with inputs via Field.');
    expect(mapped.pitfalls).toEqual(['Missing autocomplete attributes']);
  });

  it('mapPatternEntry leaves new fields undefined when omitted', () => {
    const mapped = mapPatternEntry(PATTERN_SPEC, { content: '# P' } as AnyRaw);
    expect(mapped.whenToUse).toBeUndefined();
    expect(mapped.whenNotToUse).toBeUndefined();
    expect(mapped.accessibilityNotes).toBeUndefined();
    expect(mapped.pitfalls).toBeUndefined();
  });
});

// ============================================================================
// Phase 4 — Schema Validator: new fields, back-compat, warnings
// ============================================================================

describe('ST-20: back-compat — enhanced schema without new fields validates with 0 errors', () => {
  it('produces no error-severity findings for a standard enhanced schema', () => {
    const schema = createEnhancedTestSchema();
    const findings = validateSchema(schema);
    const errors = findings.filter((f) => f.severity === 'error');
    expect(errors).toHaveLength(0);
  });

  it('accepts a component whose enhanced.propGuidance references a known prop (no warning)', () => {
    const component = createComponentEntry('Button', {
      enhanced: createComponentEnhanced({
        propGuidance: [
          { prop: 'appearance', guidance: 'Use primary for the main action' },
        ],
      }),
    });
    const schema = createFluentUISchema({
      components: [component],
      stats: createSchemaStats({ totalComponents: 1, categoryCounts: { buttons: 1 } }),
    });

    const findings = validateSchema(schema);
    const guidanceFindings = findings.filter((f) => f.path.includes('propGuidance'));
    expect(guidanceFindings).toHaveLength(0);
  });
});

describe('ST-21: propGuidance referencing an unknown prop yields a warning (not an error)', () => {
  it('emits a warning addressed to the offending propGuidance entry', () => {
    const component = createComponentEntry('Button', {
      enhanced: createComponentEnhanced({
        propGuidance: [
          { prop: 'doesNotExist', guidance: 'Set this nonexistent prop' },
        ],
      }),
    });
    const schema = createFluentUISchema({
      components: [component],
      stats: createSchemaStats({ totalComponents: 1, categoryCounts: { buttons: 1 } }),
    });

    const findings = validateSchema(schema);
    const warning = findings.find(
      (f) => f.path.includes('propGuidance') && f.severity === 'warning',
    );
    expect(warning).toBeDefined();
    expect(warning?.message).toContain('doesNotExist');
    // It must never escalate to an error.
    const guidanceErrors = findings.filter(
      (f) => f.path.includes('propGuidance') && f.severity === 'error',
    );
    expect(guidanceErrors).toHaveLength(0);
  });
});

describe('ST-22: exportGuidance referencing an unknown export yields a warning', () => {
  it('emits a warning for a utility exportGuidance with an unknown export name', () => {
    const utility = createUtilityEntry('Positioning', {
      exports: [],
      enhanced: createUtilityEnhanced({
        exportGuidance: [
          { export: 'useNope', guidance: 'Use this missing export' },
        ],
      }),
    });
    const schema = createFluentUISchema({
      utilities: [utility],
      stats: createSchemaStats({ totalUtilities: 1 }),
    });

    const findings = validateSchema(schema);
    const warning = findings.find(
      (f) => f.path.includes('exportGuidance') && f.severity === 'warning',
    );
    expect(warning).toBeDefined();
    expect(warning?.message).toContain('useNope');
  });
});
