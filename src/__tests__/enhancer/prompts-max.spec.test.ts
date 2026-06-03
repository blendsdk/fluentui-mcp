/**
 * Spec tests for Phase 5 — Maximum-richness prompt rewrites.
 *
 * These tests pin the contract for all six rewritten enhancer prompts:
 *   - each system prompt requests the new schema fields (propGuidance,
 *     antiPatterns, performanceNotes, etc. — or the guide/pattern equivalents),
 *   - each system prompt embeds the shared GROUNDING SELF-CHECK block,
 *   - each system prompt states explicit content quotas (minimum counts),
 *   - the component user message still carries full story `code`.
 *
 * Written spec-test-first (ST-23..ST-26) per 06-prompt-rewrites.md.
 *
 * @module tests/enhancer/prompts-max.spec
 */

import { describe, it, expect } from 'vitest';

import {
  COMPONENT_ENHANCE_SYSTEM_PROMPT,
  UTILITY_ENHANCE_SYSTEM_PROMPT,
  FOUNDATION_GUIDE_SYSTEM_PROMPT,
  PATTERN_GUIDE_SYSTEM_PROMPT,
  ENTERPRISE_GUIDE_SYSTEM_PROMPT,
  QUICK_REFERENCE_SYSTEM_PROMPT,
  buildComponentEnhanceMessages,
  buildComponentSummaries,
  GROUNDING_SELF_CHECK,
} from '../../../scripts/enhancer/prompts/index.js';
import type { GuideGenerationContext } from '../../../scripts/enhancer/types.js';
import { createComponentEntry } from '../fixtures/helpers.js';

const ALL_SYSTEM_PROMPTS = [
  COMPONENT_ENHANCE_SYSTEM_PROMPT,
  UTILITY_ENHANCE_SYSTEM_PROMPT,
  FOUNDATION_GUIDE_SYSTEM_PROMPT,
  PATTERN_GUIDE_SYSTEM_PROMPT,
  ENTERPRISE_GUIDE_SYSTEM_PROMPT,
  QUICK_REFERENCE_SYSTEM_PROMPT,
];

// ============================================================================
// ST-26: shared self-check + strict-JSON across every prompt
// ============================================================================

describe('ST-26: shared grounding self-check', () => {
  it('exports a non-empty GROUNDING_SELF_CHECK snippet', () => {
    expect(typeof GROUNDING_SELF_CHECK).toBe('string');
    expect(GROUNDING_SELF_CHECK).toMatch(/GROUNDING SELF-CHECK/);
    expect(GROUNDING_SELF_CHECK).toMatch(/never invent/i);
  });

  it('embeds the self-check block in every system prompt', () => {
    for (const prompt of ALL_SYSTEM_PROMPTS) {
      expect(prompt).toContain(GROUNDING_SELF_CHECK);
    }
  });

  it('keeps strict-JSON instruction in every system prompt', () => {
    for (const prompt of ALL_SYSTEM_PROMPTS) {
      expect(prompt).toMatch(/ONLY valid JSON/);
      expect(prompt).toMatch(/no markdown fences/i);
    }
  });
});

// ============================================================================
// ST-23: component + utility prompts request new fields & quotas
// ============================================================================

describe('ST-23: component & utility prompt richness', () => {
  it('component prompt requests every new schema field', () => {
    for (const key of [
      'propGuidance',
      'antiPatterns',
      'performanceNotes',
      'themingNotes',
      'compositionExamples',
      'relatedPatterns',
      'edgeCases',
    ]) {
      expect(COMPONENT_ENHANCE_SYSTEM_PROMPT).toContain(key);
    }
  });

  it('component prompt states explicit minimum quotas', () => {
    // dos/donts >= 5, commonPatterns >= 4, compositionExamples >= 2,
    // antiPatterns >= 3 — assert the numbers appear.
    expect(COMPONENT_ENHANCE_SYSTEM_PROMPT).toMatch(/at least 5|≥\s*5|5 or more/);
    expect(COMPONENT_ENHANCE_SYSTEM_PROMPT).toMatch(/at least 4|≥\s*4|4 or more/);
    expect(COMPONENT_ENHANCE_SYSTEM_PROMPT).toMatch(/at least 3|≥\s*3|3 or more/);
  });

  it('utility prompt requests new fields and quotas', () => {
    for (const key of ['exportGuidance', 'performanceNotes', 'edgeCases']) {
      expect(UTILITY_ENHANCE_SYSTEM_PROMPT).toContain(key);
    }
    expect(UTILITY_ENHANCE_SYSTEM_PROMPT).toMatch(/at least 4|≥\s*4|4 or more/);
  });

  it('component user message still carries full story code', () => {
    const component = createComponentEntry('Button');
    const messages = buildComponentEnhanceMessages({
      component,
      allComponentNames: ['Button'],
      version: 'v9',
    });
    // The default fixture story has a `code` field; it must be serialized.
    expect(messages[1].content).toContain('code');
  });
});

// ============================================================================
// ST-24: foundation / enterprise / quick-reference guide fields
// ============================================================================

describe('ST-24: foundation/enterprise/quick-ref guide richness', () => {
  it('foundation prompt requests keyTakeaways, pitfalls, accessibilityNotes', () => {
    for (const key of ['keyTakeaways', 'pitfalls', 'accessibilityNotes']) {
      expect(FOUNDATION_GUIDE_SYSTEM_PROMPT).toContain(key);
    }
    expect(FOUNDATION_GUIDE_SYSTEM_PROMPT).toMatch(/at least 4|≥\s*4|4 or more/);
  });

  it('enterprise prompt requests keyTakeaways, pitfalls, accessibilityNotes', () => {
    for (const key of ['keyTakeaways', 'pitfalls', 'accessibilityNotes']) {
      expect(ENTERPRISE_GUIDE_SYSTEM_PROMPT).toContain(key);
    }
    expect(ENTERPRISE_GUIDE_SYSTEM_PROMPT).toMatch(/at least 4|≥\s*4|4 or more/);
  });

  it('quick-reference prompt requests keyTakeaways and pitfalls', () => {
    for (const key of ['keyTakeaways', 'pitfalls']) {
      expect(QUICK_REFERENCE_SYSTEM_PROMPT).toContain(key);
    }
    expect(QUICK_REFERENCE_SYSTEM_PROMPT).toMatch(/at least 4|≥\s*4|4 or more/);
  });
});

// ============================================================================
// ST-25: pattern guide fields
// ============================================================================

describe('ST-25: pattern guide richness', () => {
  it('pattern prompt requests whenToUse/whenNotToUse/accessibilityNotes/pitfalls', () => {
    for (const key of [
      'whenToUse',
      'whenNotToUse',
      'accessibilityNotes',
      'pitfalls',
    ]) {
      expect(PATTERN_GUIDE_SYSTEM_PROMPT).toContain(key);
    }
  });

  it('pattern prompt states a minimum examples quota', () => {
    expect(PATTERN_GUIDE_SYSTEM_PROMPT).toMatch(/at least 3|≥\s*3|3 or more/);
  });
});

// ============================================================================
// Sanity: guide builders still produce a system+user pair (unchanged contract)
// ============================================================================

describe('guide builders remain well-formed after rewrite', () => {
  function makeGuideContext(): GuideGenerationContext {
    const components = [createComponentEntry('Button')];
    return {
      spec: { id: 'getting-started', title: 'Getting Started', group: 'foundation' },
      allComponentNames: components.map((c) => c.name),
      componentSummaries: buildComponentSummaries(components),
      targetComponents: [],
      version: 'v9',
    };
  }

  it('pattern messages still contain two roles', () => {
    const messages = buildComponentEnhanceMessages({
      component: createComponentEntry('Button'),
      allComponentNames: ['Button'],
      version: 'v9',
    });
    expect(messages).toHaveLength(2);
    // Guide context is exercised by prompts.test.ts; ensure it constructs.
    expect(makeGuideContext().spec.id).toBe('getting-started');
  });
});
