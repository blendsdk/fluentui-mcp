/**
 * Implementation tests for the DeepSeek enhancement internals.
 *
 * These cover behavior that the specification tests intentionally do not pin:
 * retry/backoff, token accounting (including reasoning tokens), environment
 * parsing, prose sanitization, and cost-estimator arithmetic. They are written
 * after the implementation exists and may reference internal helpers.
 *
 * @module tests/enhancer/deepseek.impl
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

import { DeepSeekProvider } from '../../../scripts/enhancer/llm/deepseek.js';
import {
  resolveProviderConfig,
  LLMError,
} from '../../../scripts/enhancer/llm/provider.js';
import { runBatch } from '../../../scripts/enhancer/llm/batch.js';
import { mapComponentEnhanced } from '../../../scripts/enhancer/enhancer.js';
import {
  estimateEnhancementCost,
  estimateTokens,
  pricingForModel,
  MODEL_PRICING,
} from '../../../scripts/enhancer/cost-estimator.js';

function fakeResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
}

const DEEPSEEK_CONFIG = {
  apiKey: 'k',
  baseUrl: 'https://api.deepseek.com',
  model: 'deepseek-flash',
  reasoningEffort: 'max' as const,
};

const ENV_KEYS = [
  'LLM_PROVIDER',
  'DEEPSEEK_API_KEY',
  'DEEPSEEK_BASE_URL',
  'DEEPSEEK_MODEL',
  'DEEPSEEK_REASONING_EFFORT',
] as const;

afterEach(() => {
  vi.restoreAllMocks();
  for (const key of ENV_KEYS) delete process.env[key];
});

describe('DeepSeek token accounting', () => {
  it('reports reasoning tokens separately while including them in the total', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        fakeResponse(200, {
          choices: [{ message: { content: '{}' }, finish_reason: 'stop' }],
          usage: {
            prompt_tokens: 10,
            completion_tokens: 40,
            total_tokens: 50,
            completion_tokens_details: { reasoning_tokens: 25 },
          },
        }),
      ),
    );

    const provider = new DeepSeekProvider(DEEPSEEK_CONFIG);
    const response = await provider.chat([{ role: 'user', content: 'hi' }]);

    expect(response.usage.promptTokens).toBe(10);
    expect(response.usage.completionTokens).toBe(40);
    expect(response.usage.totalTokens).toBe(50);
    expect(response.usage.reasoningTokens).toBe(25);
  });
});

describe('DeepSeek retry classification', () => {
  it('marks a 429 as retryable and a 400 as non-retryable', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(fakeResponse(429, 'rate limited'))
        .mockResolvedValueOnce(fakeResponse(400, 'bad request')),
    );

    const provider = new DeepSeekProvider(DEEPSEEK_CONFIG);

    await expect(
      provider.chat([{ role: 'user', content: 'a' }]),
    ).rejects.toMatchObject({ statusCode: 429, retryable: true });
    await expect(
      provider.chat([{ role: 'user', content: 'b' }]),
    ).rejects.toMatchObject({ statusCode: 400, retryable: false });
  });
});

describe('runBatch retry/backoff', () => {
  it('retries a retryable failure and eventually succeeds', async () => {
    let attempts = 0;
    const sleep = vi.fn().mockResolvedValue(undefined);

    const result = await runBatch(
      [
        async () => {
          attempts += 1;
          if (attempts < 3) {
            throw new LLMError('transient', 'deepseek', { retryable: true });
          }
          return 'ok';
        },
      ],
      { maxRetries: 3, baseDelayMs: 100, sleep },
    );

    expect(result.succeeded).toEqual(['ok']);
    expect(attempts).toBe(3);
    // Backoff: 100ms then 200ms.
    expect(sleep).toHaveBeenNthCalledWith(1, 100);
    expect(sleep).toHaveBeenNthCalledWith(2, 200);
  });

  it('does not retry a non-retryable failure', async () => {
    let attempts = 0;
    const sleep = vi.fn().mockResolvedValue(undefined);

    const result = await runBatch(
      [
        async () => {
          attempts += 1;
          throw new LLMError('fatal', 'deepseek', { retryable: false });
        },
      ],
      { maxRetries: 5, baseDelayMs: 10, sleep },
    );

    expect(attempts).toBe(1);
    expect(sleep).not.toHaveBeenCalled();
    expect(result.failed).toHaveLength(1);
  });
});

describe('DeepSeek environment parsing', () => {
  it('honours DEEPSEEK_MODEL, DEEPSEEK_BASE_URL, and a valid effort', () => {
    process.env.LLM_PROVIDER = 'deepseek';
    process.env.DEEPSEEK_API_KEY = 'secret';
    process.env.DEEPSEEK_MODEL = 'deepseek-v4-pro';
    process.env.DEEPSEEK_BASE_URL = 'https://proxy.example.com';
    process.env.DEEPSEEK_REASONING_EFFORT = 'high';

    const config = resolveProviderConfig();

    expect(config.model).toBe('deepseek-v4-pro');
    expect(config.baseUrl).toBe('https://proxy.example.com');
    expect(config.reasoningEffort).toBe('high');
  });
});

describe('prose sanitization', () => {
  it('strips fenced code blocks from every prose field', () => {
    const enhanced = mapComponentEnhanced(
      {
        description: 'Use it like ```tsx\n<Button />\n``` for actions.',
        whenToUse: 'When ```you need a click```.',
        bestPractices: { dos: ['Do ```x```'], donts: ['No ```y```'] },
        accessibility: {
          requirements: 'See ```a```.',
          keyboardSupport: [{ key: 'Enter', action: 'Activate ```b```' }],
          ariaAttributes: ['aria-label'],
          screenReaderBehavior: 'Announces ```c```',
        },
        antiPatterns: [
          {
            title: 'Bad',
            problem: 'Wrong ```d```',
            solution: 'Right ```e```',
          },
        ],
        relatedRecipes: ['login-form'],
      },
      'hash',
    );

    expect(enhanced.description).not.toContain('```');
    expect(enhanced.whenToUse).not.toContain('```');
    expect(enhanced.bestPractices.dos[0]).not.toContain('```');
    expect(enhanced.bestPractices.donts[0]).not.toContain('```');
    expect(enhanced.accessibility.requirements).not.toContain('```');
    expect(enhanced.accessibility.keyboardSupport[0].action).not.toContain('```');
    expect(enhanced.accessibility.screenReaderBehavior).not.toContain('```');
    expect(enhanced.antiPatterns?.[0]?.problem).not.toContain('```');
    expect(enhanced.antiPatterns?.[0]?.solution).not.toContain('```');
    expect(enhanced.relatedRecipes).toEqual(['login-form']);
  });
});

describe('cost estimator', () => {
  it('prices deepseek-flash input and output using published rates', () => {
    const estimate = estimateEnhancementCost({
      model: 'deepseek-flash',
      callCount: 10,
      inputTokens: 1_000_000,
      outputTokens: 1_000_000,
    });

    // input $0.30/M + output $1.20/M.
    expect(estimate.totalCostUsd).toBeCloseTo(1.5, 6);
    expect(estimate.inputCostUsd).toBeCloseTo(0.3, 6);
    expect(estimate.outputCostUsd).toBeCloseTo(1.2, 6);
  });

  it('falls back to default pricing for an unknown model', () => {
    expect(pricingForModel('unknown-model').inputPerMillionUsd).toBe(3.0);
  });

  it('defaults output tokens to a per-call average when omitted', () => {
    const estimate = estimateEnhancementCost({
      model: 'deepseek-flash',
      callCount: 4,
      inputTokens: 0,
    });
    expect(estimate.outputTokens).toBe(4 * 2_500);
  });

  it('estimates tokens as roughly one per four characters', () => {
    expect(estimateTokens('')).toBe(0);
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
  });

  it('exposes deepseek-flash in the pricing table', () => {
    expect(MODEL_PRICING['deepseek-flash']).toBeDefined();
  });
});
