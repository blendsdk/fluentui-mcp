/**
 * Cost estimation for a paid enhancement run.
 *
 * The enhancer prints an upfront estimate of the number of API calls and the
 * likely token spend so a paid DeepSeek run is never started blindly. Token
 * counts are approximations (roughly one token per four characters) because
 * the exact tokenizer is provider-side; the estimate is deliberately
 * conservative to avoid surprising the user.
 *
 * @module enhancer/cost-estimator
 */

/**
 * Per-model token pricing in US dollars per one million tokens.
 *
 * DeepSeek values are its published cache-miss rates. Update this table when
 * pricing changes.
 */
export interface ModelPricing {
  /** USD per one million input (prompt) tokens. */
  inputPerMillionUsd: number;

  /** USD per one million output (completion) tokens. */
  outputPerMillionUsd: number;
}

/**
 * Known model pricing, keyed by model id.
 */
export const MODEL_PRICING: Record<string, ModelPricing> = {
  'deepseek-flash': { inputPerMillionUsd: 0.3, outputPerMillionUsd: 1.2 },
  'deepseek-v4-pro': { inputPerMillionUsd: 1.32, outputPerMillionUsd: 3.96 },
};

/** Fallback pricing for a model that is not in {@link MODEL_PRICING}. */
export const DEFAULT_PRICING: ModelPricing = {
  inputPerMillionUsd: 3.0,
  outputPerMillionUsd: 15.0,
};

/**
 * Approximate output tokens produced per enhancement call.
 *
 * Component enhancements and guides both produce a few thousand tokens of
 * JSON/markdown; a single representative value keeps the estimate simple.
 */
export const AVG_OUTPUT_TOKENS_PER_CALL = 2_500;

/**
 * Look up pricing for a model, falling back to {@link DEFAULT_PRICING}.
 *
 * @param model - The model id being requested
 * @returns The applicable pricing rates
 */
export function pricingForModel(model: string): ModelPricing {
  return MODEL_PRICING[model] ?? DEFAULT_PRICING;
}

/**
 * Approximate the number of tokens in a string.
 *
 * Uses the common heuristic of roughly one token per four characters. This is
 * an estimate only; it never affects what is sent to the provider.
 *
 * @param text - The text to estimate
 * @returns Approximate token count (always at least 0)
 */
export function estimateTokens(text: string): number {
  if (text.length === 0) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Input needed to produce a cost estimate.
 */
export interface EnhancementCostInput {
  /** Model id used for pricing lookup. */
  model: string;

  /** Number of planned LLM calls. */
  callCount: number;

  /** Estimated total input tokens across all calls. */
  inputTokens: number;

  /**
   * Estimated total output tokens across all calls. When omitted, the call
   * count is multiplied by {@link AVG_OUTPUT_TOKENS_PER_CALL}.
   */
  outputTokens?: number;
}

/**
 * Breakdown of an estimated enhancement run.
 */
export interface EnhancementCostEstimate {
  /** Model id used for pricing lookup. */
  model: string;

  /** Number of planned LLM calls. */
  callCount: number;

  /** Estimated total input tokens. */
  inputTokens: number;

  /** Estimated total output tokens. */
  outputTokens: number;

  /** Pricing rates applied. */
  pricing: ModelPricing;

  /** Estimated input-token cost in USD. */
  inputCostUsd: number;

  /** Estimated output-token cost in USD. */
  outputCostUsd: number;

  /** Total estimated cost in USD. */
  totalCostUsd: number;
}

/**
 * Estimate the USD cost of a planned enhancement run.
 *
 * @param input - Planned call count and estimated token totals
 * @returns A fully broken-down cost estimate
 */
export function estimateEnhancementCost(
  input: EnhancementCostInput,
): EnhancementCostEstimate {
  const pricing = pricingForModel(input.model);
  const outputTokens =
    input.outputTokens ?? input.callCount * AVG_OUTPUT_TOKENS_PER_CALL;

  const inputCostUsd = (input.inputTokens / 1_000_000) * pricing.inputPerMillionUsd;
  const outputCostUsd =
    (outputTokens / 1_000_000) * pricing.outputPerMillionUsd;

  return {
    model: input.model,
    callCount: input.callCount,
    inputTokens: input.inputTokens,
    outputTokens,
    pricing,
    inputCostUsd,
    outputCostUsd,
    totalCostUsd: inputCostUsd + outputCostUsd,
  };
}

/**
 * Format an estimate as a human-readable multi-line report.
 *
 * @param estimate - The estimate to format
 * @returns A printable report
 */
export function formatEnhancementCostReport(
  estimate: EnhancementCostEstimate,
): string {
  return [
    'Enhancement cost estimate',
    `  Model:        ${estimate.model}`,
    `  API calls:    ${estimate.callCount}`,
    `  Est. input:   ${formatTokens(estimate.inputTokens)}`,
    `  Est. output:  ${formatTokens(estimate.outputTokens)}`,
    `  Est. cost:    $${estimate.totalCostUsd.toFixed(2)} ` +
      `(input $${estimate.inputCostUsd.toFixed(2)}, ` +
      `output $${estimate.outputCostUsd.toFixed(2)})`,
  ].join('\n');
}

/**
 * Format a token count with a K/M suffix for readability.
 *
 * @param tokens - Token count
 * @returns A compact display string
 */
function formatTokens(tokens: number): string {
  if (tokens >= 1_000_000) return `${(tokens / 1_000_000).toFixed(1)}M tokens`;
  if (tokens >= 1_000) return `${Math.round(tokens / 1_000)}K tokens`;
  return `${tokens} tokens`;
}
