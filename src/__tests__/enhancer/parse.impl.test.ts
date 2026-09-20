/**
 * Implementation tests for robust LLM JSON parsing.
 *
 * A model can return text that has matching braces yet is not strict JSON —
 * most often a trailing comma or an unescaped control character inside a
 * string. {@link sanitizeJson} repairs those without touching commas inside
 * string literals, and {@link parseJsonResponse} uses it as a fallback.
 */

import { describe, it, expect } from 'vitest';

import {
  parseJsonResponse,
  sanitizeJson,
  ResponseParseError,
} from '../../../scripts/enhancer/parse.js';

describe('sanitizeJson', () => {
  it('removes a trailing comma before a closing brace', () => {
    expect(sanitizeJson('{"a": 1,}')).toBe('{"a": 1}');
  });

  it('removes a trailing comma before a closing bracket', () => {
    expect(sanitizeJson('[1, 2,]')).toBe('[1, 2]');
  });

  it('removes a trailing comma surrounded by whitespace', () => {
    expect(sanitizeJson('{"a": 1,\n  }')).toBe('{"a": 1\n  }');
  });

  it('keeps a comma that sits inside a string literal', () => {
    expect(sanitizeJson('{"a": "one, two"}')).toBe('{"a": "one, two"}');
  });

  it('escapes a raw newline inside a string literal', () => {
    expect(sanitizeJson('{"a": "line1\nline2"}')).toBe(
      '{"a": "line1\\nline2"}',
    );
  });

  it('leaves already-valid JSON unchanged', () => {
    const valid = '{"a": [1, 2], "b": {"c": true}}';
    expect(sanitizeJson(valid)).toBe(valid);
  });
});

describe('parseJsonResponse', () => {
  it('parses balanced JSON with a trailing comma', () => {
    expect(parseJsonResponse<{ a: number }>('{"a": 1,}')).toEqual({ a: 1 });
  });

  it('parses balanced JSON with a raw newline in a string', () => {
    expect(parseJsonResponse<{ a: string }>('{"a": "x\ny"}')).toEqual({
      a: 'x\ny',
    });
  });

  it('parses JSON wrapped in surrounding prose', () => {
    expect(parseJsonResponse<{ a: number }>('Result: {"a": 1} done')).toEqual({
      a: 1,
    });
  });

  it('throws ResponseParseError when no JSON is present', () => {
    expect(() => parseJsonResponse('no json here')).toThrow(ResponseParseError);
  });
});
