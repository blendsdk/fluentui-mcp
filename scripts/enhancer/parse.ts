/**
 * Robust JSON parsing for LLM responses.
 *
 * LLMs sometimes wrap JSON in markdown code fences or add stray prose
 * around the object. These helpers extract and parse the JSON payload
 * defensively so the orchestrator can tolerate minor formatting noise.
 *
 * @module enhancer/parse
 */

/**
 * Error thrown when an LLM response cannot be parsed into JSON.
 */
export class ResponseParseError extends Error {
  /** The raw content that failed to parse (truncated for logging). */
  readonly rawContent: string;

  constructor(message: string, rawContent: string) {
    super(message);
    this.name = 'ResponseParseError';
    this.rawContent = rawContent.slice(0, 500);
  }
}

/**
 * Strip markdown code fences (```json … ``` or ``` … ```) from a string.
 *
 * @param content - Raw LLM content
 * @returns The content with surrounding fences removed
 */
export function stripCodeFences(content: string): string {
  const trimmed = content.trim();
  const fenceMatch = trimmed.match(
    /^```(?:json|JSON|tsx|ts|javascript|js)?\s*\n?([\s\S]*?)\n?```$/,
  );
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return trimmed;
}

/**
 * Extract the outermost JSON object substring from a string.
 *
 * Finds the first `{` and the matching last `}` so leading/trailing prose
 * is discarded. Returns null when no braces are present.
 *
 * @param content - Text that may contain a JSON object
 * @returns The JSON substring, or null when none found
 */
export function extractJsonObject(content: string): string | null {
  const start = content.indexOf('{');
  const end = content.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) {
    return null;
  }
  return content.slice(start, end + 1);
}

/**
 * Find the index of the matching top-level closing brace/bracket.
 *
 * Performs a string-aware (escape-aware) scan from the first opening
 * `{` or `[`, tracking nesting depth so braces inside string literals are
 * ignored. Returns the index of the character that returns depth to zero,
 * or `-1` when the content is unbalanced (i.e., truncated/incomplete).
 *
 * @param content - Text that may contain a JSON value
 * @returns The index of the matching top-level close, or -1 when incomplete
 */
export function findJsonEnd(content: string): number {
  let depth = 0;
  let inStr = false;
  let esc = false;
  let started = false;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];

    if (inStr) {
      if (esc) {
        esc = false;
      } else if (ch === '\\') {
        esc = true;
      } else if (ch === '"') {
        inStr = false;
      }
      continue;
    }

    if (ch === '"') {
      inStr = true;
    } else if (ch === '{' || ch === '[') {
      depth += 1;
      started = true;
    } else if (ch === '}' || ch === ']') {
      depth -= 1;
      if (started && depth === 0) {
        return i;
      }
    }
  }

  return -1; // unbalanced → incomplete
}

/**
 * Heuristic: is this content a complete JSON value?
 *
 * True when the content parses directly, or when its braces/brackets are
 * balanced (string-aware) so the top-level value is closed. Used to decide
 * whether a continuation turn is needed.
 *
 * @param content - Raw LLM content
 * @returns true when the content appears to be a complete JSON value
 */
export function isLikelyComplete(content: string): boolean {
  const stripped = stripCodeFences(content);
  try {
    JSON.parse(stripped);
    return true;
  } catch {
    // Fall through to balance check.
  }
  const extracted = extractJsonObject(stripped) ?? stripped;
  return findJsonEnd(extracted) !== -1;
}

/**
 * Best-effort repair of a truncated JSON object (last resort).
 *
 * Closes an unterminated trailing string, strips a dangling comma, then
 * appends the closing `]`/`}` characters required to balance the open
 * structures (string-aware). This is intentionally conservative: it only
 * adds the minimal terminators needed to make the value parseable.
 *
 * @param content - Possibly truncated JSON content
 * @returns A repaired string that is more likely to parse
 */
export function repairJson(content: string): string {
  let working = stripCodeFences(content);

  const start = working.indexOf('{');
  if (start > 0) {
    working = working.slice(start);
  }

  // Already complete? Return as-is.
  if (findJsonEnd(working) !== -1) {
    return working;
  }

  // Scan to determine open structures and string state.
  const stack: string[] = [];
  let inStr = false;
  let esc = false;
  for (let i = 0; i < working.length; i += 1) {
    const ch = working[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{') stack.push('}');
    else if (ch === '[') stack.push(']');
    else if (ch === '}' || ch === ']') stack.pop();
  }

  if (inStr) {
    // The truncation happened inside a string. That string is the trailing
    // VALUE (or key); close it so the token is well-formed before balancing.
    working += '"';
  } else {
    // The string tokens are complete. Strip a dangling object key that has a
    // colon but no value (e.g. `..."c":`), which cannot be balanced into
    // valid JSON.
    working = working.replace(/,?\s*"(?:[^"\\]|\\.)*"\s*:\s*$/, '');
  }

  // Strip a dangling comma (and trailing whitespace) before closing.
  working = working.replace(/,\s*$/, '');


  // Append the required closers in reverse order.
  while (stack.length > 0) {
    working += stack.pop();
  }

  return working;
}


/**
 * Parse an LLM response string into a typed JSON object.
 *
 * Tries, in order: direct parse, parse after stripping code fences, and
 * parse of the extracted `{…}` substring. Throws {@link ResponseParseError}
 * when all strategies fail.
 *
 * @typeParam T - Expected shape of the parsed object
 * @param content - Raw LLM response content
 * @returns The parsed object cast to T
 * @throws {ResponseParseError} When the content cannot be parsed
 */
export function parseJsonResponse<T>(content: string): T {
  const candidates: string[] = [];
  const stripped = stripCodeFences(content);
  candidates.push(stripped);

  const extracted = extractJsonObject(stripped);
  if (extracted) candidates.push(extracted);

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // Try the next candidate.
    }
  }

  throw new ResponseParseError(
    'Failed to parse LLM response as JSON',
    content,
  );
}
