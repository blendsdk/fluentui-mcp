/**
 * Spec tests for Phase 1: LLM Output Capacity (never-truncate).
 *
 * These are spec-first tests authored before the implementation exists. They
 * pin the contracts described in `plans/maximum-enhancement/03-llm-capacity.md`:
 *   - parse.ts completeness/repair helpers (findJsonEnd, isLikelyComplete, repairJson)
 *   - model-aware ceiling lookup (resolveMaxTokens / MODEL_OUTPUT_CEILINGS)
 *   - optional config.maxTokens env resolution (NaN-guarded)
 *   - provider max_tokens is always sent at the resolved (clamped) value
 *   - chatComplete escalation ladder (continuation -> re-request -> repair)
 *
 * Spec IDs: ST-1..ST-10, ST-6b/6c, ST-9b/9c.
 *
 * @module tests/enhancer/capacity.spec
 */

import { describe, it, expect, afterEach, vi } from 'vitest';

import {
  findJsonEnd,
  isLikelyComplete,
  repairJson,
} from '../../../scripts/enhancer/parse.js';
import {
  MODEL_OUTPUT_CEILINGS,
  FALLBACK_OUTPUT_CEILING,
  resolveMaxTokens,
} from '../../../scripts/enhancer/llm/ceilings.js';
import { chatComplete } from '../../../scripts/enhancer/llm/complete.js';
import { resolveEnhancerConfig } from '../../../scripts/enhancer/config.js';
import { OpenAIProvider, AnthropicProvider } from '../../../scripts/enhancer/llm/index.js';
import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
} from '../../../scripts/enhancer/llm/index.js';

// ============================================================================
// Test helpers
// ============================================================================

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

/**
 * A provider that returns a queue of scripted chunks, one per call, recording
 * the options each call received. When the queue is exhausted it keeps
 * returning the last chunk (so escalation paths can be exercised).
 */
class ScriptedProvider implements LLMProvider {
  readonly name = 'scripted';
  readonly calls: Array<{ messages: LLMMessage[]; options?: LLMChatOptions }> = [];
  private readonly chunks: string[];

  constructor(chunks: string[]) {
    this.chunks = chunks;
  }

  async chat(
    messages: LLMMessage[],
    options?: LLMChatOptions,
  ): Promise<LLMResponse> {
    this.calls.push({ messages, options });
    const idx = Math.min(this.calls.length - 1, this.chunks.length - 1);
    return {
      content: this.chunks[idx],
      usage: { promptTokens: 1, completionTokens: 1, totalTokens: 2 },
    };
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.LLM_MAX_TOKENS;
});

// ============================================================================
// ST-1..ST-3: parse.ts completeness helpers
// ============================================================================

describe('findJsonEnd (ST-1)', () => {
  it('returns the index of the matching top-level closing brace', () => {
    const s = '{"a":1}';
    expect(findJsonEnd(s)).toBe(s.length - 1);
  });

  it('ignores braces inside strings', () => {
    const s = '{"a":"}{"}';
    expect(findJsonEnd(s)).toBe(s.length - 1);
  });

  it('handles nested arrays and objects', () => {
    const s = '{"items":[1,2,{"x":[3]}]}';
    expect(findJsonEnd(s)).toBe(s.length - 1);
  });

  it('returns -1 for unbalanced (truncated) content', () => {
    expect(findJsonEnd('{"a":1,"b":[1,2,')).toBe(-1);
  });

  it('returns -1 when truncated mid-string', () => {
    expect(findJsonEnd('{"a":"hello')).toBe(-1);
  });
});

describe('isLikelyComplete (ST-2)', () => {
  it('is true for valid complete JSON', () => {
    expect(isLikelyComplete('{"a":1,"b":[1,2,3]}')).toBe(true);
  });

  it('is true for balanced JSON even with surrounding prose', () => {
    expect(isLikelyComplete('Here:\n{"a":1}\nDone')).toBe(true);
  });

  it('is false for truncated JSON', () => {
    expect(isLikelyComplete('{"a":1,"b":[1,2,')).toBe(false);
  });

  it('is false when truncated mid-string', () => {
    expect(isLikelyComplete('{"a":"hel')).toBe(false);
  });
});

describe('repairJson (ST-3)', () => {
  it('closes an unterminated object', () => {
    const repaired = repairJson('{"a":1');
    expect(JSON.parse(repaired)).toEqual({ a: 1 });
  });

  it('closes an unterminated string and object', () => {
    const repaired = repairJson('{"a":"hello');
    expect(JSON.parse(repaired)).toEqual({ a: 'hello' });
  });

  it('strips a trailing comma and closes nested arrays', () => {
    const repaired = repairJson('{"items":[1,2,');
    expect(JSON.parse(repaired)).toEqual({ items: [1, 2] });
  });

  it('leaves already-complete JSON parseable', () => {
    const repaired = repairJson('{"a":1}');
    expect(JSON.parse(repaired)).toEqual({ a: 1 });
  });
});

// ============================================================================
// ST-9, ST-9b, ST-9c: model-aware ceiling lookup
// ============================================================================

describe('resolveMaxTokens (ST-9)', () => {
  it('returns the model ceiling when no value is requested', () => {
    expect(resolveMaxTokens('gpt-4o')).toBe(MODEL_OUTPUT_CEILINGS['gpt-4o']);
    expect(resolveMaxTokens('gpt-4o')).toBe(16384);
  });

  it('returns the fallback ceiling for unknown models (ST-9c)', () => {
    expect(resolveMaxTokens('some-future-model')).toBe(FALLBACK_OUTPUT_CEILING);
    expect(FALLBACK_OUTPUT_CEILING).toBe(4096);
  });

  it('clamps an over-limit request to the model ceiling (ST-9b)', () => {
    expect(resolveMaxTokens('gpt-4o', 999_999)).toBe(16384);
  });

  it('passes through a request below the ceiling', () => {
    expect(resolveMaxTokens('gpt-4o', 1000)).toBe(1000);
  });

  it('knows the Anthropic sonnet ceiling', () => {
    expect(resolveMaxTokens('claude-3-5-sonnet-latest')).toBe(8192);
  });
});

// ============================================================================
// ST-10: optional config.maxTokens env resolution (NaN-guarded)
// ============================================================================

describe('resolveEnhancerConfig maxTokens (ST-10)', () => {
  it('leaves maxTokens undefined by default', () => {
    const config = resolveEnhancerConfig({ version: 'v9' });
    expect(config.maxTokens).toBeUndefined();
  });

  it('honors a numeric LLM_MAX_TOKENS env var', () => {
    process.env.LLM_MAX_TOKENS = '12000';
    const config = resolveEnhancerConfig({ version: 'v9' });
    expect(config.maxTokens).toBe(12000);
  });

  it('treats a non-numeric LLM_MAX_TOKENS as undefined', () => {
    process.env.LLM_MAX_TOKENS = 'not-a-number';
    const config = resolveEnhancerConfig({ version: 'v9' });
    expect(config.maxTokens).toBeUndefined();
  });

  it('prefers an explicit override over the env var', () => {
    process.env.LLM_MAX_TOKENS = '12000';
    const config = resolveEnhancerConfig({ version: 'v9', maxTokens: 5000 });
    expect(config.maxTokens).toBe(5000);
  });
});

// ============================================================================
// ST-4, ST-5: providers always send the resolved (clamped) max_tokens
// ============================================================================

describe('OpenAIProvider sends resolved max_tokens (ST-4)', () => {
  const messages: LLMMessage[] = [{ role: 'user', content: 'hi' }];

  it('sends the model ceiling when no maxTokens requested', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      fakeResponse(200, { choices: [{ message: { content: '{}' } }] }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider({ provider: 'openai', apiKey: 'k' });
    await provider.chat(messages);

    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.max_tokens).toBe(16384);
  });

  it('clamps an over-limit request to the ceiling', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      fakeResponse(200, { choices: [{ message: { content: '{}' } }] }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const provider = new OpenAIProvider({ provider: 'openai', apiKey: 'k' });
    await provider.chat(messages, { maxTokens: 999_999 });

    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.max_tokens).toBe(16384);
  });
});

describe('AnthropicProvider sends resolved max_tokens (ST-5)', () => {
  const messages: LLMMessage[] = [{ role: 'user', content: 'hi' }];

  it('sends the model ceiling when no maxTokens requested', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      fakeResponse(200, { content: [{ type: 'text', text: '{}' }] }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const provider = new AnthropicProvider({ provider: 'anthropic', apiKey: 'k' });
    await provider.chat(messages);

    const body = JSON.parse(
      (fetchMock.mock.calls[0][1] as RequestInit).body as string,
    );
    expect(body.max_tokens).toBe(8192);
  });
});

// ============================================================================
// ST-6, ST-6b, ST-6c: chatComplete escalation ladder
// ============================================================================

describe('chatComplete continuation (ST-6)', () => {
  it('stitches a JSON object split across continuation turns', async () => {
    const provider = new ScriptedProvider([
      '{"description":"hello","items":[1,2,',
      '3]}',
    ]);

    const res = await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
      maxContinuations: 3,
    });

    expect(JSON.parse(res.content)).toEqual({
      description: 'hello',
      items: [1, 2, 3],
    });
  });

  it('issues continuation turns in plain-text mode, not json (ST-6b)', async () => {
    const provider = new ScriptedProvider([
      '{"description":"hello","items":[1,2,',
      '3]}',
    ]);

    await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
      maxContinuations: 3,
    });

    // First turn may use json mode; continuation turns must be plain text.
    expect(provider.calls.length).toBeGreaterThanOrEqual(2);
    expect(provider.calls[1].options?.responseFormat).toBe('text');
  });

  it('escalates to repair and reports repairsUsed when never completing (ST-6c)', async () => {
    // Always returns the same truncated chunk so continuation never completes.
    const provider = new ScriptedProvider(['{"a":1']);

    const res = await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
      maxContinuations: 2,
      allowReRequest: true,
    });

    expect(res.repairsUsed).toBe(1);
    expect(JSON.parse(res.content)).toEqual({ a: 1 });
  });
});
