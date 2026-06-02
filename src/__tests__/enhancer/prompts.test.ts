/**
 * Unit tests for enhancer prompt builders and config.
 *
 * Verifies that each prompt builder produces a system + user message pair,
 * grounds the user content with the provided data, and that the JSON
 * response parser tolerates fenced / prose-wrapped output.
 *
 * @module tests/enhancer/prompts
 */

import { describe, it, expect } from 'vitest';

import {
  buildComponentEnhanceMessages,
  buildUtilityEnhanceMessages,
  buildFoundationGuideMessages,
  buildPatternGuideMessages,
  buildEnterpriseGuideMessages,
  buildQuickReferenceMessages,
  buildComponentSummaries,
  toComponentSummary,
  serializeComponentSummaries,
} from '../../../scripts/enhancer/prompts/index.js';
import {
  parseJsonResponse,
  stripCodeFences,
  extractJsonObject,
  ResponseParseError,
} from '../../../scripts/enhancer/parse.js';
import {
  resolveEnhancerConfig,
  FOUNDATION_GUIDES,
  PATTERN_GUIDES,
  ENTERPRISE_GUIDES,
  QUICK_REFERENCE_GUIDES,
} from '../../../scripts/enhancer/config.js';
import type {
  GuideGenerationContext,
  ComponentSummary,
} from '../../../scripts/enhancer/types.js';
import {
  createComponentEntry,
  createUtilityEntry,
  createUtilityExport,
} from '../fixtures/helpers.js';

// ============================================================================
// Component / Utility Prompts
// ============================================================================

describe('buildComponentEnhanceMessages', () => {
  it('produces a system + user message grounded in the component', () => {
    const component = createComponentEntry('Button');
    const messages = buildComponentEnhanceMessages({
      component,
      allComponentNames: ['Button', 'Input'],
      version: 'v9',
    });

    expect(messages).toHaveLength(2);
    expect(messages[0].role).toBe('system');
    expect(messages[1].role).toBe('user');
    expect(messages[1].content).toContain('Button');
    expect(messages[1].content).toContain('appearance');
    expect(messages[1].content).toContain('v9');
  });

  it('throws when no component is provided', () => {
    expect(() =>
      buildComponentEnhanceMessages({
        allComponentNames: [],
        version: 'v9',
      }),
    ).toThrow(/requires context.component/);
  });
});

describe('buildUtilityEnhanceMessages', () => {
  it('produces a grounded utility prompt', () => {
    const utility = createUtilityEntry('Positioning', {
      exports: [createUtilityExport('usePositioning', 'hook')],
    });
    const messages = buildUtilityEnhanceMessages({
      utility,
      allComponentNames: [],
      version: 'v9',
    });

    expect(messages).toHaveLength(2);
    expect(messages[1].content).toContain('usePositioning');
  });

  it('throws when no utility is provided', () => {
    expect(() =>
      buildUtilityEnhanceMessages({
        allComponentNames: [],
        version: 'v9',
      }),
    ).toThrow(/requires context.utility/);
  });
});

// ============================================================================
// Guide Prompts
// ============================================================================

function makeGuideContext(): GuideGenerationContext {
  const components = [
    createComponentEntry('Button'),
    createComponentEntry('Input', { category: 'forms' }),
  ];
  return {
    spec: { id: 'getting-started', title: 'Getting Started', group: 'foundation' },
    allComponentNames: components.map((c) => c.name),
    componentSummaries: buildComponentSummaries(components),
    version: 'v9',
  };
}

describe('guide prompt builders', () => {
  it('foundation guide includes the guide id and component inventory', () => {
    const messages = buildFoundationGuideMessages(makeGuideContext());
    expect(messages[0].role).toBe('system');
    expect(messages[1].content).toContain('getting-started');
    expect(messages[1].content).toContain('Button');
  });

  it('pattern guide includes the pattern group', () => {
    const ctx = makeGuideContext();
    ctx.spec = { id: 'login-form', title: 'Login Form', group: 'forms' };
    const messages = buildPatternGuideMessages(ctx);
    expect(messages[1].content).toContain('forms');
    expect(messages[1].content).toContain('login-form');
  });

  it('enterprise guide builds a system + user pair', () => {
    const messages = buildEnterpriseGuideMessages(makeGuideContext());
    expect(messages).toHaveLength(2);
    expect(messages[1].content).toContain('Button');
  });

  it('quick reference guide builds a system + user pair', () => {
    const messages = buildQuickReferenceMessages(makeGuideContext());
    expect(messages).toHaveLength(2);
    expect(messages[1].content).toContain('Button');
  });
});

// ============================================================================
// Shared Summary Helpers
// ============================================================================

describe('component summaries', () => {
  it('prefers required props and caps the count', () => {
    const component = createComponentEntry('Demo', {
      props: [
        { name: 'a', type: 'string', required: false, description: '', deprecated: false, inherited: false, source: 'X' },
        { name: 'b', type: 'string', required: true, description: '', deprecated: false, inherited: false, source: 'X' },
        { name: 'c', type: 'string', required: true, description: '', deprecated: false, inherited: false, source: 'X' },
        { name: 'd', type: 'string', required: false, description: '', deprecated: false, inherited: false, source: 'X' },
        { name: 'e', type: 'string', required: false, description: '', deprecated: false, inherited: false, source: 'X' },
        { name: 'f', type: 'string', required: false, description: '', deprecated: false, inherited: false, source: 'X' },
        { name: 'g', type: 'string', required: false, description: '', deprecated: false, inherited: false, source: 'X' },
      ],
    });
    const summary = toComponentSummary(component);
    // Required props come first.
    expect(summary.keyProps[0]).toBe('b');
    expect(summary.keyProps[1]).toBe('c');
    // Capped at 6.
    expect(summary.keyProps).toHaveLength(6);
  });

  it('serializes summaries into a readable block', () => {
    const summaries: ComponentSummary[] = [
      {
        name: 'Button',
        category: 'buttons',
        importStatement: "import { Button } from '@fluentui/react-components'",
        keyProps: ['appearance', 'size'],
      },
    ];
    const text = serializeComponentSummaries(summaries);
    expect(text).toContain('Button (buttons)');
    expect(text).toContain('props: appearance, size');
  });
});

// ============================================================================
// Response Parsing
// ============================================================================

describe('parseJsonResponse', () => {
  it('parses plain JSON', () => {
    expect(parseJsonResponse<{ a: number }>('{"a":1}')).toEqual({ a: 1 });
  });

  it('parses JSON wrapped in code fences', () => {
    const content = '```json\n{"a":2}\n```';
    expect(parseJsonResponse<{ a: number }>(content)).toEqual({ a: 2 });
  });

  it('parses JSON surrounded by prose', () => {
    const content = 'Here you go:\n{"a":3}\nHope that helps!';
    expect(parseJsonResponse<{ a: number }>(content)).toEqual({ a: 3 });
  });

  it('throws ResponseParseError on unparseable content', () => {
    expect(() => parseJsonResponse('no json here')).toThrow(ResponseParseError);
  });

  it('stripCodeFences removes language-tagged fences', () => {
    expect(stripCodeFences('```ts\nconst x = 1;\n```')).toBe('const x = 1;');
  });

  it('extractJsonObject returns null when no braces present', () => {
    expect(extractJsonObject('nothing')).toBeNull();
  });
});

// ============================================================================
// Config
// ============================================================================

describe('resolveEnhancerConfig', () => {
  it('applies defaults', () => {
    const config = resolveEnhancerConfig({ version: 'v9' });
    expect(config.version).toBe('v9');
    expect(config.concurrency).toBe(3);
    expect(config.maxRetries).toBe(3);
    expect(config.enhanceComponents).toBe(true);
    expect(config.generateGuides).toBe(true);
  });

  it('honours overrides', () => {
    const config = resolveEnhancerConfig({
      version: 'v9',
      full: true,
      generateGuides: false,
      concurrency: 8,
    });
    expect(config.full).toBe(true);
    expect(config.generateGuides).toBe(false);
    expect(config.concurrency).toBe(8);
  });

  it('guide catalogs are non-empty and well-formed', () => {
    expect(FOUNDATION_GUIDES.length).toBeGreaterThan(0);
    expect(PATTERN_GUIDES.length).toBeGreaterThan(0);
    expect(ENTERPRISE_GUIDES.length).toBeGreaterThan(0);
    expect(QUICK_REFERENCE_GUIDES.length).toBeGreaterThan(0);
    for (const spec of [
      ...FOUNDATION_GUIDES,
      ...PATTERN_GUIDES,
      ...ENTERPRISE_GUIDES,
      ...QUICK_REFERENCE_GUIDES,
    ]) {
      expect(spec.id).toBeTruthy();
      expect(spec.title).toBeTruthy();
      expect(spec.group).toBeTruthy();
    }
  });
});
