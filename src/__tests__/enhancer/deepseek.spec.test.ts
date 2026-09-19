/**
 * Specification tests for the DeepSeek enhancement pipeline.
 *
 * These tests are authored BEFORE the implementation exists. They pin the
 * behavior required by the LLM enhancement requirement (RD-02): DeepSeek
 * fail-fast configuration, truncation handling, prose-only component
 * enhancement, the category/recipe catalog, the dry-run cost report, and
 * incremental skipping. They must never be edited to match an implementation;
 * a failing spec test means the implementation is wrong.
 *
 * Planned interfaces (defined here so the oracle is concrete):
 *   - `resolveProviderConfig()` accepts `LLM_PROVIDER=deepseek` and reads
 *     `DEEPSEEK_API_KEY`, `DEEPSEEK_BASE_URL`, `DEEPSEEK_MODEL`,
 *     `DEEPSEEK_REASONING_EFFORT`.
 *   - `DeepSeekProvider` implements the `LLMProvider` chat contract.
 *   - `runEnhancement(raw, previous, provider, config)` returns the enhanced
 *     schema plus run statistics.
 *   - `runEnhancer(options)` is the CLI pipeline runner.
 *
 * Spec IDs: ST-5 … ST-11.
 *
 * @module tests/enhancer/deepseek.spec
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  resolveProviderConfig,
  DeepSeekProvider,
  DEEPSEEK_MAX_OUTPUT_TOKENS,
  DEFAULT_DEEPSEEK_MODEL,
  DEFAULT_DEEPSEEK_BASE_URL,
} from '../../../scripts/enhancer/llm/index.js';
import type { LLMMessage } from '../../../scripts/enhancer/llm/index.js';
import type {
  FluentUISchema,
  ComponentEntry,
} from '../../../src/types/schema.js';
import { MockLLMProvider } from '../../../scripts/enhancer/llm/mock.js';
import { resolveEnhancerConfig } from '../../../scripts/enhancer/config.js';
import { runEnhancement } from '../../../scripts/enhancer/enhancer.js';
import { runEnhancer } from '../../../scripts/enhancer/cli.js';
import { computeComponentHash } from '../../../scripts/enhancer/hasher.js';

// ============================================================================
// Fixtures & helpers
// ============================================================================

/** The eight category-guidance documents required by the requirement. */
const CATEGORY_IDS = [
  'buttons',
  'forms',
  'navigation',
  'data-display',
  'feedback',
  'overlays',
  'layout',
  'utilities',
];

/** The nineteen task recipes required by the requirement. */
const RECIPE_IDS = [
  'login-form',
  'settings-form',
  'multi-step-form',
  'form-validation',
  'data-table',
  'async-data-states',
  'virtualization',
  'app-navigation',
  'tabs',
  'breadcrumb',
  'pagination',
  'confirm-dialog',
  'form-dialog',
  'drawer',
  'dashboard-shell',
  'responsive-layout',
  'controlled-uncontrolled',
  'server-state',
  'accessibility-basics',
];

/** Build a fake fetch Response-like object. */
function fakeResponse(status: number, body: unknown): Response {
  const ok = status >= 200 && status < 300;
  return {
    ok,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
}

/** Build a minimal raw schema with one component and no utilities. */
function rawSchemaWithButton(component: Partial<ComponentEntry> = {}): FluentUISchema {
  const button: ComponentEntry = {
    name: 'Button',
    id: 'button',
    packageName: '@fluentui/react-button',
    packageVersion: '9.0.0',
    importPath: '@fluentui/react-components',
    importStatement:
      "import { Button } from '@fluentui/react-components'",
    category: 'buttons',
    stability: 'stable',
    deprecated: false,
    props: [],
    slots: [],
    stories: [],
    relatedComponents: [],
    additionalExports: [],
    ...component,
  };

  return {
    schemaVersion: '1.0',
    version: 'v9',
    generatedAt: '2026-09-19T00:00:00.000Z',
    sources: {
      fluentui: {
        repo: 'https://github.com/microsoft/fluentui',
        ref: '@fluentui/react-components_v9.0.0',
        commit: '0'.repeat(40),
        scrapedAt: '2026-09-19T00:00:00.000Z',
      },
    },
    components: [button],
    utilities: [],
    foundation: [],
    categoryGuidance: [],
    recipes: [],
    quickReference: [],
    stats: {
      totalComponents: 1,
      totalUtilities: 0,
      totalContrib: 0,
      totalPreview: 0,
      totalStories: 0,
      totalProps: 0,
      categoryCounts: { buttons: 1 },
    },
  };
}

/**
 * Recursively collect every string value in a JSON-like structure.
 * Used to assert that no prose field contains a fenced code block.
 */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') {
    out.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
  } else if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectStrings(item, out);
  }
  return out;
}

const ENV_KEYS = [
  'LLM_PROVIDER',
  'LLM_MODEL',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'DEEPSEEK_API_KEY',
  'DEEPSEEK_BASE_URL',
  'DEEPSEEK_MODEL',
  'DEEPSEEK_REASONING_EFFORT',
] as const;

afterEach(() => {
  vi.restoreAllMocks();
  for (const key of ENV_KEYS) delete process.env[key];
});

// ============================================================================
// ST-5: missing key fails fast
// ============================================================================

describe('DeepSeek configuration fail-fast (ST-5)', () => {
  it('exits non-zero naming DEEPSEEK_API_KEY when the key is missing', () => {
    process.env.LLM_PROVIDER = 'deepseek';
    delete process.env.DEEPSEEK_API_KEY;

    expect(() => resolveProviderConfig()).toThrowError(/DEEPSEEK_API_KEY/);
  });

  it('makes no network call while resolving a missing key', () => {
    process.env.LLM_PROVIDER = 'deepseek';
    delete process.env.DEEPSEEK_API_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    try {
      resolveProviderConfig();
    } catch {
      // Expected: the failure happens before any request.
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });
});

// ============================================================================
// ST-6: reasoning-effort validation and request shape
// ============================================================================

describe('DeepSeek reasoning effort (ST-6)', () => {
  it('rejects an unsupported DEEPSEEK_REASONING_EFFORT before any call', () => {
    process.env.LLM_PROVIDER = 'deepseek';
    process.env.DEEPSEEK_API_KEY = 'k';
    process.env.DEEPSEEK_REASONING_EFFORT = 'bogus';

    expect(() => resolveProviderConfig()).toThrowError(/DEEPSEEK_REASONING_EFFORT/);
  });

  it('defaults to deepseek-flash, the official base URL, and effort max', () => {
    process.env.LLM_PROVIDER = 'deepseek';
    process.env.DEEPSEEK_API_KEY = 'k';

    const config = resolveProviderConfig();

    expect(config.provider).toBe('deepseek');
    expect(config.model).toBe(DEFAULT_DEEPSEEK_MODEL);
    expect(config.baseUrl).toBe(DEFAULT_DEEPSEEK_BASE_URL);
    expect(config.reasoningEffort).toBe('max');
  });

  it('sends model, thinking, reasoning_effort, and the output ceiling', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      fakeResponse(200, {
        choices: [
          { message: { content: '{}' }, finish_reason: 'stop' },
        ],
        usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const provider = new DeepSeekProvider({
      apiKey: 'k',
      baseUrl: DEFAULT_DEEPSEEK_BASE_URL,
      model: DEFAULT_DEEPSEEK_MODEL,
      reasoningEffort: 'max',
    });
    await provider.chat([{ role: 'user', content: 'hi' }]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/chat/completions');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.model).toBe(DEFAULT_DEEPSEEK_MODEL);
    expect(body.reasoning_effort).toBe('max');
    expect(body.thinking).toEqual({ type: 'enabled' });
    expect(body.max_tokens).toBe(DEEPSEEK_MAX_OUTPUT_TOKENS);
  });
});

// ============================================================================
// ST-7: truncated responses fail the item and abort the run
// ============================================================================

describe('DeepSeek truncation handling (ST-7)', () => {
  const messages: LLMMessage[] = [{ role: 'user', content: 'hi' }];

  it('rejects a response whose finish_reason is length', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        fakeResponse(200, {
          choices: [
            { message: { content: '{"a":1' }, finish_reason: 'length' },
          ],
        }),
      ),
    );

    const provider = new DeepSeekProvider({
      apiKey: 'k',
      baseUrl: DEFAULT_DEEPSEEK_BASE_URL,
      model: DEFAULT_DEEPSEEK_MODEL,
      reasoningEffort: 'max',
    });

    await expect(provider.chat(messages)).rejects.toThrowError(/truncat/i);
  });

  it('writes no output and rejects when the model truncates', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluentui-enhance-'));
    const input = join(dir, 'schema.json');
    const output = join(dir, 'schema-enhanced.json');
    writeFileSync(input, JSON.stringify(rawSchemaWithButton()), 'utf-8');

    process.env.LLM_PROVIDER = 'deepseek';
    process.env.DEEPSEEK_API_KEY = 'k';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        fakeResponse(200, {
          choices: [
            { message: { content: '{"a":1' }, finish_reason: 'length' },
          ],
        }),
      ),
    );

    try {
      await expect(
        runEnhancer({
          version: 'v9',
          full: false,
          componentsOnly: true,
          guidesOnly: false,
          dryRun: false,
          input,
          output,
          concurrency: 1,
          verbose: false,
        }),
      ).rejects.toThrowError(/truncat/i);

      expect(existsSync(output)).toBe(false);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

// ============================================================================
// ST-8: prose-only component enhancement
// ============================================================================

describe('prose-only component enhancement (ST-8)', () => {
  it('drops code-bearing fields and never emits a fenced code block', async () => {
    const raw = rawSchemaWithButton();
    const componentPayload = JSON.stringify({
      description: 'A button.',
      whenToUse: 'Use a button to trigger an action.',
      bestPractices: { dos: ['Label it.'], donts: ['Do not nest buttons.'] },
      accessibility: {
        requirements: 'Always provide an accessible name.',
        keyboardSupport: [{ key: 'Enter', action: 'Activates' }],
        ariaAttributes: [],
        screenReaderBehavior: 'Announced as a button.',
      },
      commonPatterns: [
        { name: 'Primary', description: 'x', code: 'const a = <Button />;' },
      ],
      compositionExamples: [
        { name: 'Icon', description: 'x', code: 'const b = <Button />;' },
      ],
      antiPatterns: [
        {
          title: 'No label',
          problem: 'Icon-only without a name.',
          solution: 'Add aria-label.',
          code: '```tsx\n<Button aria-label="x" />\n```',
        },
      ],
      propGuidance: [{ prop: 'appearance', guidance: 'Pick a style.' }],
      edgeCases: ['Empty label', 'Wrap ```tsx with care'],
      relatedRecipes: ['login-form'],
      sourceHash: 'placeholder',
      enhancedAt: '2026-09-19T00:00:00.000Z',
    });

    const provider = new MockLLMProvider({ response: componentPayload });
    const config = resolveEnhancerConfig({
      version: 'v9',
      enhanceComponents: true,
      generateGuides: false,
    });

    const { schema } = await runEnhancement(raw, null, provider, config);
    const enhanced = schema.components[0].enhanced;

    expect(enhanced).toBeDefined();
    expect(enhanced).not.toHaveProperty('commonPatterns');
    expect(enhanced).not.toHaveProperty('compositionExamples');

    const prose = collectStrings(enhanced?.antiPatterns ?? []);
    expect(prose.some((text) => text.includes('```'))).toBe(false);
  });
});

// ============================================================================
// ST-9: exact category and recipe catalog
// ============================================================================

describe('category guidance and recipe catalog (ST-9)', () => {
  it('produces eight category entries and the nineteen recipe ids', async () => {
    const raw = rawSchemaWithButton();
    raw.components[0].category = 'buttons';

    const provider = new MockLLMProvider({ response: '{}' });
    const config = resolveEnhancerConfig({
      version: 'v9',
      enhanceComponents: false,
      generateGuides: true,
      full: true,
    });

    const { schema } = await runEnhancement(raw, null, provider, config);

    expect(schema.categoryGuidance).toHaveLength(8);
    expect(schema.categoryGuidance.map((entry) => entry.category)).toEqual(
      CATEGORY_IDS,
    );
    expect(schema.recipes.map((entry) => entry.id)).toEqual(RECIPE_IDS);
  });
});

// ============================================================================
// ST-10: dry run makes no calls and writes nothing, but prints the cost
// ============================================================================

describe('dry-run cost report (ST-10)', () => {
  it('makes no LLM calls, writes no file, and prints a cost report', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'fluentui-dryrun-'));
    const input = join(dir, 'schema.json');
    const output = join(dir, 'schema-enhanced.json');
    writeFileSync(input, JSON.stringify(rawSchemaWithButton()), 'utf-8');

    process.env.LLM_PROVIDER = 'deepseek';
    process.env.DEEPSEEK_API_KEY = 'k';

    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    try {
      await runEnhancer({
        version: 'v9',
        full: false,
        componentsOnly: false,
        guidesOnly: false,
        dryRun: true,
        input,
        output,
        concurrency: 1,
        verbose: false,
      });

      expect(fetchMock).not.toHaveBeenCalled();
      expect(existsSync(output)).toBe(false);
      const printed = logSpy.mock.calls.flat().join('\n');
      expect(printed).toMatch(/cost|\$/i);
    } finally {
      logSpy.mockRestore();
      rmSync(dir, { recursive: true, force: true });
    }
  });
});

// ============================================================================
// ST-11: incremental skip by source hash
// ============================================================================

describe('incremental enhancement (ST-11)', () => {
  it('skips an unchanged component when --full is not set', async () => {
    const raw = rawSchemaWithButton();
    const previous = rawSchemaWithButton();
    previous.components[0].enhanced = {
      description: 'kept',
      whenToUse: 'kept',
      bestPractices: { dos: [], donts: [] },
      accessibility: {
        requirements: '',
        keyboardSupport: [],
        ariaAttributes: [],
        screenReaderBehavior: '',
      },
      sourceHash: computeComponentHash(raw.components[0]),
      enhancedAt: '2026-09-19T00:00:00.000Z',
    };

    const provider = new MockLLMProvider({ response: '{}' });
    const config = resolveEnhancerConfig({
      version: 'v9',
      full: false,
      enhanceComponents: true,
      generateGuides: false,
    });

    const { schema, stats } = await runEnhancement(
      raw,
      previous,
      provider,
      config,
    );

    expect(provider.callCount).toBe(0);
    expect(stats.componentsEnhanced).toBe(0);
    expect(schema.components[0].enhanced?.description).toBe('kept');
  });
});
