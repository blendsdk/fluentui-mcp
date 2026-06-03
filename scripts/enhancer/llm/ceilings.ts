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

/**
 * Family-prefix ceilings for model lines whose exact ids change frequently
 * (e.g. dated snapshots like `gpt-5.5-2025-xx-xx`). Checked only when an exact
 * match is not found in {@link MODEL_OUTPUT_CEILINGS}. Longest prefix wins.
 *
 * The GPT-5 and o-series reasoning models expose much larger output windows
 * than GPT-4o, so they get a higher ceiling here.
 */
export const MODEL_FAMILY_CEILINGS: Array<[prefix: string, ceiling: number]> = [
  ['gpt-5', 32768],
  ['o4', 65536],
  ['o3', 65536],
  ['o1', 32768],
  ['gpt-4o', 16384],
  ['gpt-4', 4096],
  ['gpt-3.5', 4096],
  ['claude-3-5', 8192],
  ['claude-3', 4096],
];

/** Safe fallback ceiling for models not present in {@link MODEL_OUTPUT_CEILINGS}. */
export const FALLBACK_OUTPUT_CEILING = 4096;

/**
 * Resolve the documented output-token ceiling for a model.
 *
 * Tries an exact match first, then the longest matching family prefix, then
 * the safe fallback. Kept separate from {@link resolveMaxTokens} so callers
 * (and tests) can reason about the ceiling independently of clamping.
 *
 * @param model - The model name being requested
 * @returns The model's output-token ceiling
 */
export function ceilingForModel(model: string): number {
  const exact = MODEL_OUTPUT_CEILINGS[model];
  if (exact !== undefined) return exact;

  let best: number | undefined;
  let bestLen = -1;
  for (const [prefix, ceiling] of MODEL_FAMILY_CEILINGS) {
    if (model.startsWith(prefix) && prefix.length > bestLen) {
      best = ceiling;
      bestLen = prefix.length;
    }
  }
  return best ?? FALLBACK_OUTPUT_CEILING;
}

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
  const ceiling = ceilingForModel(model);
  return requested === undefined ? ceiling : Math.min(requested, ceiling);
}

/**
 * Whether an OpenAI model requires the newer `max_completion_tokens` request
 * parameter (and rejects the legacy `max_tokens`).
 *
 * The GPT-5 family and the o-series reasoning models (o1/o3/o4) switched to
 * `max_completion_tokens`; GPT-4 and earlier still use `max_tokens`.
 *
 * @param model - The model name being requested
 */
export function usesMaxCompletionTokens(model: string): boolean {
  return (
    model.startsWith('gpt-5') ||
    model.startsWith('o1') ||
    model.startsWith('o3') ||
    model.startsWith('o4')
  );
}

/**
 * Whether an OpenAI model accepts a custom `temperature`.
 *
 * The GPT-5 family and o-series reasoning models only support the default
 * temperature (1) and return an HTTP 400 for any other value, so the provider
 * must omit `temperature` entirely for them.
 *
 * @param model - The model name being requested
 */
export function supportsCustomTemperature(model: string): boolean {
  return !usesMaxCompletionTokens(model);
}
