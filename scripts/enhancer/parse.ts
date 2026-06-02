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
