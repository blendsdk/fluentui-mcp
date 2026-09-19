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
  stylingTips: 'Use tokens.',
  propGuidance: [
    { prop: 'appearance', guidance: 'Use primary for the main action.' },
  ],
  antiPatterns: [
    { title: 'Avoid X', problem: 'It is wrong.', solution: 'Do Y instead.' },
  ],
  performanceNotes: 'Memoize handlers.',
  themingNotes: 'Respects tokens.colorBrandBackground.',
  relatedRecipes: ['login-form'],
  edgeCases: ['Disabled state suppresses onClick.'],
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

const CATEGORY_RESPONSE = JSON.stringify({
  overview: 'Category overview.',
  whenToUse: 'Use these components for their intended jobs.',
  bestPractices: { dos: ['Do it'], donts: ["Don't misuse it"] },
  accessibility: 'Keep everything keyboard reachable.',
  antiPatterns: [
    { title: 'Misuse', problem: 'Wrong component.', solution: 'Pick the right one.' },
  ],
});

const RECIPE_RESPONSE = JSON.stringify({
  goal: 'Achieve the recipe goal.',
  whenToUse: 'Use this recipe when it fits.',
  whenNotToUse: 'Avoid when a component suffices.',
  content: '# Recipe\n\nSome content.',
  examples: [
    {
      name: 'Ex',
      description: 'desc',
      code: '<Form />',
      language: 'tsx',
    },
  ],
  referencedComponents: ['Input', 'Button'],
  accessibilityNotes: 'Label every field.',
  pitfalls: ['Missing labels.'],
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
  if (system.includes('design-system expert')) {
    return CATEGORY_RESPONSE;
  }
  if (system.includes('application engineer')) {
    return RECIPE_RESPONSE;
  }
  // foundation / quick-reference share the guide shape.
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

    // Guides, category guidance, and recipes generated.
    expect(schema.foundation.length).toBeGreaterThan(0);
    expect(schema.categoryGuidance.length).toBeGreaterThan(0);
    expect(schema.quickReference.length).toBeGreaterThan(0);
    expect(schema.recipes.length).toBeGreaterThan(0);
    expect(stats.recipesGenerated).toBe(schema.recipes.length);
    expect(stats.categoryGuidanceGenerated).toBe(schema.categoryGuidance.length);

    // generatedAt refreshed.
    expect(schema.generatedAt).not.toBe(raw.generatedAt);
  });

  it('maps the new enrichment fields end-to-end', async () => {
    const raw = createMinimalTestSchema();
    const provider = makeProvider();
    const config = resolveEnhancerConfig({ version: 'v9', full: true });

    const { schema } = await runEnhancement(raw, null, provider, config);

    const button = schema.components.find((c) => c.name === 'Button');
    expect(button?.enhanced?.propGuidance?.[0]?.prop).toBe('appearance');
    expect(button?.enhanced?.antiPatterns?.[0]?.title).toBe('Avoid X');
    expect(button?.enhanced?.performanceNotes).toBe('Memoize handlers.');
    expect(button?.enhanced?.themingNotes).toContain('colorBrandBackground');
    expect(button?.enhanced?.relatedRecipes).toContain('login-form');
    expect(button?.enhanced).not.toHaveProperty('commonPatterns');
    expect(button?.enhanced).not.toHaveProperty('compositionExamples');
    expect(button?.enhanced?.edgeCases?.length).toBeGreaterThan(0);
  });

  it('stitches a truncated component response via chatComplete', async () => {
    // Split COMPONENT_RESPONSE into two parts so the first turn looks
    // truncated (no closing brace) and the continuation completes it.
    // Detect the continuation turn from the messages (not a shared counter)
    // so the test stays deterministic under concurrency.
    const splitAt = Math.floor(COMPONENT_RESPONSE.length / 2);
    const head = COMPONENT_RESPONSE.slice(0, splitAt);
    const tail = COMPONENT_RESPONSE.slice(splitAt);

    let sawContinuation = false;
    const provider = new MockLLMProvider({
      response: (messages) => {
        const system = messages[0]?.content ?? '';
        if (system.includes('component documentation expert')) {
          const last = messages[messages.length - 1]?.content ?? '';
          if (last.includes('Continue the JSON')) {
            sawContinuation = true;
            return tail;
          }
          return head;
        }
        return routeResponse(messages);
      },
    });

    const raw = createMinimalTestSchema();
    const config = resolveEnhancerConfig({
      version: 'v9',
      full: true,
      generateGuides: false,
    });

    const { schema, stats } = await runEnhancement(raw, null, provider, config);

    // A continuation turn must have happened to complete the JSON.
    expect(sawContinuation).toBe(true);
    // The stitched JSON parsed into a complete enhancement.
    const button = schema.components.find((c) => c.name === 'Button');
    expect(button?.enhanced?.description).toBe('A test component description.');
    expect(stats.failures).toBe(0);
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
    expect(schema.categoryGuidance.length).toBeGreaterThan(0);
    expect(schema.recipes.length).toBeGreaterThan(0);
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
    expect(schema.categoryGuidance).toHaveLength(0);
    expect(schema.recipes).toHaveLength(0);
  });
});
