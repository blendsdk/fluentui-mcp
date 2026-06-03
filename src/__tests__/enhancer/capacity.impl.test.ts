/**
 * Implementation tests for Phase 1: LLM Output Capacity.
 *
 * Complements `capacity.spec.test.ts` with edge cases and internal-behavior
 * checks that go beyond the public contract: multi-turn stitching, the
 * re-request success path, verbose logging, usage accumulation, and additional
 * parse-helper corner cases.
 *
 * @module tests/enhancer/capacity.impl
 */

import { describe, it, expect } from 'vitest';

import {
  findJsonEnd,
  isLikelyComplete,
  repairJson,
} from '../../../scripts/enhancer/parse.js';
import { chatComplete } from '../../../scripts/enhancer/llm/complete.js';
import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
} from '../../../scripts/enhancer/llm/index.js';

// ============================================================================
// Helpers
// ============================================================================

/** Provider returning queued chunks; records every call's options. */
class QueueProvider implements LLMProvider {
  readonly name = 'queue';
  readonly calls: Array<{ messages: LLMMessage[]; options?: LLMChatOptions }> = [];
  private idx = 0;

  constructor(private readonly chunks: string[]) {}

  async chat(
    messages: LLMMessage[],
    options?: LLMChatOptions,
  ): Promise<LLMResponse> {
    this.calls.push({ messages, options });
    const content = this.chunks[Math.min(this.idx, this.chunks.length - 1)];
    this.idx += 1;
    return {
      content,
      usage: { promptTokens: 2, completionTokens: 3, totalTokens: 5 },
    };
  }
}

// ============================================================================
// parse helper edge cases
// ============================================================================

describe('parse helper edge cases', () => {
  it('findJsonEnd handles escaped quotes and backslashes inside strings', () => {
    const s = '{"a":"he said \\"hi\\" \\\\ ok"}';
    expect(findJsonEnd(s)).toBe(s.length - 1);
    expect(JSON.parse(s.slice(0, findJsonEnd(s) + 1))).toEqual({
      a: 'he said "hi" \\ ok',
    });
  });

  it('findJsonEnd returns end of first top-level value, ignoring trailing junk', () => {
    const s = '{"a":1} trailing prose';
    expect(findJsonEnd(s)).toBe(6);
  });

  it('isLikelyComplete is false for empty content', () => {
    expect(isLikelyComplete('')).toBe(false);
  });

  it('repairJson handles truncation inside a nested object', () => {
    const repaired = repairJson('{"a":{"b":1,"c":');
    // Trailing "c": with no value — strip the dangling key/comma is not done,
    // but the result must still be parseable JSON after balancing.
    expect(() => JSON.parse(repaired)).not.toThrow();
  });

  it('repairJson preserves nested arrays of objects', () => {
    const repaired = repairJson('{"items":[{"x":1},{"y":2}');
    expect(JSON.parse(repaired)).toEqual({ items: [{ x: 1 }, { y: 2 }] });
  });
});

// ============================================================================
// chatComplete internals
// ============================================================================

describe('chatComplete internals', () => {
  it('stitches a value split across three turns', async () => {
    const provider = new QueueProvider([
      '{"description":"a long',
      ' description","items":[1,2,3',
      ']}',
    ]);

    const res = await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
      maxContinuations: 5,
    });

    expect(JSON.parse(res.content)).toEqual({
      description: 'a long description',
      items: [1, 2, 3],
    });
    expect(res.repairsUsed).toBe(0);
    // 1 initial + 2 continuations.
    expect(provider.calls).toHaveLength(3);
  });

  it('accumulates usage across all turns', async () => {
    const provider = new QueueProvider(['{"a":1,', '"b":2}']);
    const res = await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
    });
    // 2 turns × totalTokens 5 each.
    expect(res.usage.totalTokens).toBe(10);
  });

  it('returns immediately (no continuation) when first turn is complete', async () => {
    const provider = new QueueProvider(['{"done":true}']);
    const res = await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
    });
    expect(provider.calls).toHaveLength(1);
    expect(res.repairsUsed).toBe(0);
  });

  it('recovers via the Stage 2 re-request without repair', async () => {
    // First two truncated (initial + 1 continuation), then a clean whole entry.
    const provider = new QueueProvider(['{"a":1', '{"a":1', '{"a":1,"b":2}']);
    const res = await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
      maxContinuations: 1,
      allowReRequest: true,
    });
    expect(JSON.parse(res.content)).toEqual({ a: 1, b: 2 });
    expect(res.repairsUsed).toBe(0);
  });

  it('invokes the verbose logger during escalation', async () => {
    const provider = new QueueProvider(['{"a":1']);
    const logs: string[] = [];
    await chatComplete(provider, [{ role: 'user', content: 'go' }], {
      responseFormat: 'json',
      maxContinuations: 1,
      allowReRequest: false,
      log: (m) => logs.push(m),
    });
    expect(logs.some((l) => l.includes('continuation'))).toBe(true);
    expect(logs.some((l) => l.includes('repair'))).toBe(true);
  });
});
