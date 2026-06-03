/**
 * Tests for the enhancer LLM subsystem.
 *
 * Covers provider config resolution, the OpenAI and Anthropic providers
 * (via a stubbed global fetch), the LLMError retry classification, the
 * concurrency-limited batch processor, and the mock provider.
 *
 * @module tests/enhancer/llm
 */

import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  LLMError,
  isRetryableStatus,
  resolveProviderConfig,
  createProvider,
  OpenAIProvider,
  AnthropicProvider,
  runBatch,
  MockLLMProvider,
} from '../../../scripts/enhancer/llm/index.js';
import type { LLMMessage } from '../../../scripts/enhancer/llm/index.js';

// ============================================================================
// Helpers
// ============================================================================

/** A no-op sleep so batch retry tests run instantly. */
const noSleep = async (): Promise<void> => {};

/** Build a fake fetch Response-like object. */
function fakeResponse(
  status: number,
  body: unknown,
): Response {
  const ok = status >= 200 && status < 300;
  return {
    ok,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.LLM_PROVIDER;
  delete process.env.LLM_MODEL;
  delete process.env.OPENAI_API_KEY;
  delete process.env.ANTHROPIC_API_KEY;
});

// ============================================================================
// isRetryableStatus
// ============================================================================

describe('isRetryableStatus', () => {
  it('treats 429 and 5xx as retryable', () => {
    expect(isRetryableStatus(429)).toBe(true);
    expect(isRetryableStatus(500)).toBe(true);
    expect(isRetryableStatus(503)).toBe(true);
    expect(isRetryableStatus(408)).toBe(true);
  });

  it('treats normal 4xx client errors as non-retryable', () => {
    expect(isRetryableStatus(400)).toBe(false);
    expect(isRetryableStatus(401)).toBe(false);
    expect(isRetryableStatus(404)).toBe(false);
  });
});

// ============================================================================
// LLMError
// ============================================================================

describe('LLMError', () => {
  it('defaults to retryable when not specified', () => {
    const err = new LLMError('boom', 'openai');
    expect(err.retryable).toBe(true);
    expect(err.provider).toBe('openai');
    expect(err.name).toBe('LLMError');
  });

  it('records statusCode and retryable flag', () => {
    const err = new LLMError('bad', 'anthropic', {
      statusCode: 401,
      retryable: false,
    });
    expect(err.statusCode).toBe(401);
    expect(err.retryable).toBe(false);
  });
});

// ============================================================================
// resolveProviderConfig
// ============================================================================

describe('resolveProviderConfig', () => {
  it('resolves openai config from environment', () => {
    process.env.LLM_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'sk-test';
    const config = resolveProviderConfig();
    expect(config.provider).toBe('openai');
    expect(config.apiKey).toBe('sk-test');
  });

  it('prefers explicit overrides over environment', () => {
    process.env.LLM_PROVIDER = 'openai';
    process.env.OPENAI_API_KEY = 'env-key';
    const config = resolveProviderConfig({
      provider: 'anthropic',
      apiKey: 'explicit-key',
    });
    expect(config.provider).toBe('anthropic');
    expect(config.apiKey).toBe('explicit-key');
  });

  it('throws a non-retryable error for an unknown provider', () => {
    expect(() => resolveProviderConfig({ provider: 'gemini' })).toThrowError(
      LLMError,
    );
    try {
      resolveProviderConfig({ provider: 'gemini' });
    } catch (e) {
      expect((e as LLMError).retryable).toBe(false);
    }
  });

  it('throws when the API key is missing', () => {
    expect(() => resolveProviderConfig({ provider: 'openai' })).toThrowError(
      /Missing API key/,
    );
  });
});

// ============================================================================
// createProvider
// ============================================================================

describe('createProvider', () => {
  it('constructs an OpenAIProvider', async () => {
    const provider = await createProvider({
      provider: 'openai',
      apiKey: 'k',
    });
    expect(provider).toBeInstanceOf(OpenAIProvider);
    expect(provider.name).toBe('openai');
  });

  it('constructs an AnthropicProvider', async () => {
    const provider = await createProvider({
      provider: 'anthropic',
      apiKey: 'k',
    });
    expect(provider).toBeInstanceOf(AnthropicProvider);
    expect(provider.name).toBe('anthropic');
  });
});

// ============================================================================
// OpenAIProvider
// ============================================================================

describe('OpenAIProvider', () => {
  const messages: LLMMessage[] = [
    { role: 'system', content: 'You are helpful.' },
    { role: 'user', content: 'Hello' },
  ];

  it('returns content and usage on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      fakeResponse(200, {
        choices: [{ message: { content: 'Hi there' } }],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 5,
          total_tokens: 15,
        },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider({ provider: 'openai', apiKey: 'k' });
    const res = await provider.chat(messages, { responseFormat: 'json' });

    expect(res.content).toBe('Hi there');
    expect(res.usage.totalTokens).toBe(15);

    // Verify request shape.
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/chat/completions');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.response_format).toEqual({ type: 'json_object' });
    expect(body.messages).toHaveLength(2);
  });

  it('throws a retryable LLMError on 429', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(fakeResponse(429, 'rate limited')),
    );
    const provider = new OpenAIProvider({ provider: 'openai', apiKey: 'k' });
    await expect(provider.chat(messages)).rejects.toMatchObject({
      retryable: true,
      statusCode: 429,
    });
  });

  it('throws a non-retryable LLMError on 401', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(fakeResponse(401, 'unauthorized')),
    );
    const provider = new OpenAIProvider({ provider: 'openai', apiKey: 'k' });
    await expect(provider.chat(messages)).rejects.toMatchObject({
      retryable: false,
      statusCode: 401,
    });
  });

  it('wraps network failures as retryable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('ECONNRESET')),
    );
    const provider = new OpenAIProvider({ provider: 'openai', apiKey: 'k' });
    await expect(provider.chat(messages)).rejects.toMatchObject({
      retryable: true,
    });
  });
});

// ============================================================================
// AnthropicProvider
// ============================================================================

describe('AnthropicProvider', () => {
  const messages: LLMMessage[] = [
    { role: 'system', content: 'Sys prompt' },
    { role: 'user', content: 'Question' },
  ];

  it('hoists system prompt and concatenates text blocks', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      fakeResponse(200, {
        content: [
          { type: 'text', text: 'Part 1 ' },
          { type: 'text', text: 'Part 2' },
          { type: 'tool_use', text: 'ignored' },
        ],
        usage: { input_tokens: 7, output_tokens: 3 },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const provider = new AnthropicProvider({
      provider: 'anthropic',
      apiKey: 'k',
    });
    const res = await provider.chat(messages, { maxTokens: 100 });

    expect(res.content).toBe('Part 1 Part 2');
    expect(res.usage.totalTokens).toBe(10);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain('/messages');
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.system).toBe('Sys prompt');
    expect(body.messages).toHaveLength(1);
    expect(body.max_tokens).toBe(100);
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers['x-api-key']).toBe('k');
    expect(headers['anthropic-version']).toBeDefined();
  });

  it('throws a retryable LLMError on 500', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(fakeResponse(500, 'server error')),
    );
    const provider = new AnthropicProvider({
      provider: 'anthropic',
      apiKey: 'k',
    });
    await expect(provider.chat(messages)).rejects.toMatchObject({
      retryable: true,
      statusCode: 500,
    });
  });
});

// ============================================================================
// MockLLMProvider
// ============================================================================

describe('MockLLMProvider', () => {
  it('records calls and returns the scripted response', async () => {
    const mock = new MockLLMProvider({ response: 'canned' });
    const res = await mock.chat([{ role: 'user', content: 'hi' }]);

    expect(res.content).toBe('canned');
    expect(mock.callCount).toBe(1);
    expect(mock.calls[0].messages[0].content).toBe('hi');
  });

  it('derives response from a function', async () => {
    const mock = new MockLLMProvider({
      response: (msgs) => `echo:${msgs[0].content}`,
    });
    const res = await mock.chat([{ role: 'user', content: 'ping' }]);
    expect(res.content).toBe('echo:ping');
  });

  it('throws injected failures before succeeding', async () => {
    const mock = new MockLLMProvider({ failTimes: 1, response: 'ok' });
    await expect(mock.chat([{ role: 'user', content: 'x' }])).rejects.toThrow(
      LLMError,
    );
    const res = await mock.chat([{ role: 'user', content: 'x' }]);
    expect(res.content).toBe('ok');
  });
});

// ============================================================================
// runBatch
// ============================================================================

describe('runBatch', () => {
  it('runs all tasks and preserves input order', async () => {
    const tasks = [1, 2, 3, 4, 5].map((n) => async () => n * 10);
    const result = await runBatch(tasks, { concurrency: 2 });

    expect(result.succeeded).toEqual([10, 20, 30, 40, 50]);
    expect(result.failed).toHaveLength(0);
    expect(result.items.map((i) => i.index)).toEqual([0, 1, 2, 3, 4]);
  });

  it('respects the concurrency limit', async () => {
    let active = 0;
    let maxActive = 0;
    const tasks = Array.from({ length: 6 }, () => async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 5));
      active -= 1;
      return 'done';
    });

    await runBatch(tasks, { concurrency: 2 });
    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it('retries retryable failures with backoff and eventually succeeds', async () => {
    let attempts = 0;
    const tasks = [
      async () => {
        attempts += 1;
        if (attempts < 3) {
          throw new LLMError('temp', 'mock', { retryable: true });
        }
        return 'recovered';
      },
    ];

    const result = await runBatch(tasks, {
      maxRetries: 3,
      sleep: noSleep,
    });

    expect(result.succeeded).toEqual(['recovered']);
    expect(result.items[0].attempts).toBe(3);
  });

  it('does not retry non-retryable failures', async () => {
    let attempts = 0;
    const tasks = [
      async () => {
        attempts += 1;
        throw new LLMError('fatal', 'mock', { retryable: false });
      },
    ];

    const result = await runBatch(tasks, {
      maxRetries: 5,
      sleep: noSleep,
    });

    expect(result.failed).toHaveLength(1);
    expect(attempts).toBe(1);
    expect(result.items[0].attempts).toBe(1);
  });

  it('reports failures after exhausting retries', async () => {
    const tasks = [
      async () => {
        throw new LLMError('always', 'mock', { retryable: true });
      },
    ];

    const result = await runBatch(tasks, {
      maxRetries: 2,
      sleep: noSleep,
    });

    expect(result.succeeded).toHaveLength(0);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].attempts).toBe(2);
  });

  it('invokes the progress callback for every item', async () => {
    const tasks = [async () => 1, async () => 2, async () => 3];
    const progress: number[] = [];
    await runBatch(tasks, {
      concurrency: 1,
      onProgress: (completed, total) => {
        expect(total).toBe(3);
        progress.push(completed);
      },
    });
    expect(progress).toEqual([1, 2, 3]);
  });

  it('integrates with MockLLMProvider as task source', async () => {
    const mock = new MockLLMProvider({ response: 'enh' });
    const tasks = ['Button', 'Input', 'Dialog'].map(
      (name) => async () =>
        (await mock.chat([{ role: 'user', content: name }])).content,
    );

    const result = await runBatch(tasks, { concurrency: 2 });
    expect(result.succeeded).toEqual(['enh', 'enh', 'enh']);
    expect(mock.callCount).toBe(3);
  });
});
