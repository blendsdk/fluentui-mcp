/**
 * Model-aware output-token ceilings shared by all LLM providers.
 *
 * The enhancer wants "maximum" output per response so large enriched JSON is
 * never truncated. Rather than hardcoding a single magic number (which would
 * 400 on models with a lower ceiling), each provider resolves the effective
 * `max_tokens` against the model's true output ceiling via
 * {@link resolveMaxTokens}.
 *
 * @module enhancer/llm/ceilings
 */

/**
 * Known maximum output-token ceilings per model.
 *
 * Values reflect each model's documented max completion/output tokens. Update
 * this table as providers raise limits or new models are adopted.
 */
export const MODEL_OUTPUT_CEILINGS: Record<string, number> = {
  'gpt-4o': 16384,
  'gpt-4o-mini': 16384,
  'gpt-4-turbo': 4096,
  'gpt-3.5-turbo': 4096,
  'claude-3-5-sonnet-latest': 8192,
  'claude-3-5-haiku-latest': 8192,
};

/** Safe fallback ceiling for models not present in {@link MODEL_OUTPUT_CEILINGS}. */
export const FALLBACK_OUTPUT_CEILING = 4096;

/**
 * Resolve the effective `max_tokens` for a request.
 *
 * When `requested` is undefined, the model's own ceiling is used (so an unset
 * config automatically asks for the maximum). When a value is provided (e.g.
 * via `LLM_MAX_TOKENS`), it is clamped to the model ceiling so a request can
 * never exceed the model's real limit and trigger an HTTP 400.
 *
 * @param model - The model name being requested
 * @param requested - An explicit max_tokens request (optional)
 * @returns The resolved, clamped max_tokens value
 */
export function resolveMaxTokens(model: string, requested?: number): number {
  const ceiling = MODEL_OUTPUT_CEILINGS[model] ?? FALLBACK_OUTPUT_CEILING;
  return requested === undefined ? ceiling : Math.min(requested, ceiling);
}
