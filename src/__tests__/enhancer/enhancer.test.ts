/**
 * Integration tests for the enhancement orchestrator.
 *
 * Drives the full two-pass enhancer with the offline MockLLMProvider,
 * returning prompt-appropriate JSON so we can assert on the enhanced
 * schema shape, incremental carry-forward behaviour, and the
 * components-only / guides-only generation flags.
 *
 * @module tests/enhancer/enhancer
 */

import { describe, it, expect } from 'vitest';

import { runEnhancement } from '../../../scripts/enhancer/enhancer.js';
import { resolveEnhancerConfig } from '../../../scripts/enhancer/config.js';
import { MockLLMProvider } from '../../../scripts/enhancer/llm/index.js';
import type { LLMMessage } from '../../../scripts/enhancer/llm/provider.js';
import {
  createMinimalTestSchema,
  createEnhancedTestSchema,
} from '../fixtures/helpers.js';

// ============================================================================
// Scripted Mock Responses
// ============================================================================

const COMPONENT_RESPONSE = JSON.stringify({
  description: 'A test component description.',
  whenToUse: 'Use it when testing.',
  bestPractices: { dos: ['Do test'], donts: ["Don't skip tests"] },
  accessibility: {
    requirements: 'Be accessible.',
    keyboardSupport: [{ key: 'Enter', action: 'Activate' }],
    ariaAttributes: ['aria-label'],
    screenReaderBehavior: 'Announces label.',
  },
  commonPatterns: [
    { name: 'Basic', description: 'Basic usage', code: '<X />' },
  ],
  stylingTips: 'Use tokens.',
});

const UTILITY_RESPONSE = JSON.stringify({
  description: 'A test utility description.',
  whenToUse: 'Use the utility for shared logic.',
  commonPatterns: [
    { name: 'Hook', description: 'Use the hook', code: 'useX()' },
  ],
});

const GUIDE_RESPONSE = JSON.stringify({
  content: '# Guide\n\nSome content.',
  codeExamples: [
    { title: 'Ex', description: 'desc', code: '<X />', language: 'tsx' },
  ],
  referencedComponents: ['Button'],
});

const PATTERN_RESPONSE = JSON.stringify({
  content: '# Pattern\n\nSome content.',
  examples: [
    {
      name: 'Ex',
      description: 'desc',
      code: '<Form />',
      components: ['Input', 'Button'],
    },
  ],
  referencedComponents: ['Input', 'Button'],
});

/**
 * Route a mock response based on the system prompt's wording so each pass
 * receives schema-appropriate JSON.
 */
function routeResponse(messages: LLMMessage[]): string {
  const system = messages[0]?.content ?? '';
  if (system.includes('component documentation expert')) {
    return COMPONENT_RESPONSE;
  }
  if (system.includes('utilities documentation expert')) {
    return UTILITY_RESPONSE;
  }
  if (system.includes('patterns expert')) {
    return PATTERN_RESPONSE;
  }
  // foundation / enterprise / quick-reference all share the guide shape.
  return GUIDE_RESPONSE;
}

function makeProvider(): MockLLMProvider {
  return new MockLLMProvider({ response: routeResponse });
}

// ============================================================================
// Full Run (first time, no previous schema)
// ============================================================================

describe('runEnhancement — first run', () => {
  it('enhances all components and generates all guide groups', async () => {
    const raw = createMinimalTestSchema();
    const provider = makeProvider();
    const config = resolveEnhancerConfig({ version: 'v9', full: true });

    const { schema, stats } = await runEnhancement(
      raw,
      null,
      provider,
      config,
    );

    // Every component enhanced.
    expect(stats.componentsEnhanced).toBe(raw.components.length);
    for (const component of schema.components) {
      expect(component.enhanced).toBeDefined();
      expect(component.enhanced?.description).toBe(
        'A test component description.',
      );
    }

    // Guides + patterns generated.
    expect(schema.foundation.length).toBeGreaterThan(0);
    expect(schema.enterprise.length).toBeGreaterThan(0);
    expect(schema.quickReference.length).toBeGreaterThan(0);
    expect(schema.patterns.length).toBeGreaterThan(0);
    expect(stats.patternsGenerated).toBe(schema.patterns.length);

    // generatedAt refreshed.
    expect(schema.generatedAt).not.toBe(raw.generatedAt);
  });
});

// ============================================================================
// Incremental Run (carry forward unchanged enhancements)
// ============================================================================

describe('runEnhancement — incremental', () => {
  it('carries forward unchanged component enhancements', async () => {
    // Previous enhanced schema; raw is the same structure (no changes).
    const previous = createEnhancedTestSchema();
    const raw = createMinimalTestSchema();
    const provider = makeProvider();
    const config = resolveEnhancerConfig({
      version: 'v9',
      generateGuides: false,
    });

    const { schema, stats } = await runEnhancement(
      raw,
      previous,
      provider,
      config,
    );

    // Nothing changed → no fresh component enhancement calls.
    expect(stats.componentsEnhanced).toBe(0);
    expect(stats.componentsCarriedForward).toBeGreaterThan(0);

    // Carried-forward content comes from the previous enhanced schema.
    const button = schema.components.find((c) => c.name === 'Button');
    expect(button?.enhanced?.sourceHash).toBe('button-enhanced-hash');

    // No LLM calls should have happened (guides off, no changes).
    expect(provider.callCount).toBe(0);
  });

  it('re-enhances a changed component', async () => {
    const previous = createEnhancedTestSchema();
    const raw = createMinimalTestSchema();
    // Mutate Button so its hash differs from the previous schema.
    raw.components[0].props.push({
      name: 'newProp',
      type: 'boolean',
      required: false,
      description: 'A new prop',
      deprecated: false,
      inherited: false,
      source: 'ButtonProps',
    });

    const provider = makeProvider();
    const config = resolveEnhancerConfig({
      version: 'v9',
      generateGuides: false,
    });

    const { schema, stats } = await runEnhancement(
      raw,
      previous,
      provider,
      config,
    );

    expect(stats.componentsEnhanced).toBe(1);
    const button = schema.components.find((c) => c.name === 'Button');
    expect(button?.enhanced?.description).toBe('A test component description.');
  });
});

// ============================================================================
// Generation Flags
// ============================================================================

describe('runEnhancement — generation flags', () => {
  it('guides-only skips component enhancement', async () => {
    const raw = createMinimalTestSchema();
    const provider = makeProvider();
    const config = resolveEnhancerConfig({
      version: 'v9',
      full: true,
      enhanceComponents: false,
      generateGuides: true,
    });

    const { schema, stats } = await runEnhancement(
      raw,
      null,
      provider,
      config,
    );

    expect(stats.componentsEnhanced).toBe(0);
    expect(schema.foundation.length).toBeGreaterThan(0);
    expect(schema.patterns.length).toBeGreaterThan(0);
  });

  it('components-only skips guide generation', async () => {
    const raw = createMinimalTestSchema();
    const provider = makeProvider();
    const config = resolveEnhancerConfig({
      version: 'v9',
      full: true,
      enhanceComponents: true,
      generateGuides: false,
    });

    const { schema, stats } = await runEnhancement(
      raw,
      null,
      provider,
      config,
    );

    expect(stats.componentsEnhanced).toBe(raw.components.length);
    expect(stats.guidesGenerated).toBe(0);
    expect(schema.foundation).toHaveLength(0);
    expect(schema.patterns).toHaveLength(0);
  });
});
