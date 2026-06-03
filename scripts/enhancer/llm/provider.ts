/**
 * LLM provider abstraction for the enhancer pipeline.
 *
 * Defines the error type and a factory that selects a concrete provider
 * (OpenAI or Anthropic) based on configuration / environment variables.
 *
 * Design decision (recorded during exec_plan, Phase 7):
 * Providers are implemented with the Node.js global `fetch` API rather than
 * the official vendor SDKs. This keeps the dependency surface minimal (per
 * code.md rule 34 — minimize dependency surface), requires no `yarn install`
 * step to build/test the pipeline, and is fully testable offline via the
 * mock provider. Node >=20 guarantees global `fetch` is available.
 *
 * The `LLMProvider`, `LLMMessage`, `LLMResponse`, and `LLMChatOptions`
 * interfaces are defined in `../types.ts` and re-exported here so consumers
 * can import everything LLM-related from this module.
 *
 * @module enhancer/llm/provider
 */

import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
} from '../types.js';

// Re-export the core LLM types so callers can import them from this module.
export type { LLMProvider, LLMMessage, LLMResponse, LLMChatOptions };

// ============================================================================
// Errors
// ============================================================================

/**
 * Error thrown when an LLM provider request fails.
 *
 * Carries the originating provider name and (when available) the HTTP status
 * code so the batch processor can decide whether a failure is retryable.
 */
export class LLMError extends Error {
  /** Name of the provider that produced the error (e.g., 'openai') */
  readonly provider: string;

  /** HTTP status code if the failure originated from an API response */
  readonly statusCode?: number;

  /**
   * Whether this error is safe to retry.
   *
   * Rate limits (429) and server errors (5xx) are retryable; client errors
   * such as authentication (401) or bad requests (400) are not.
   */
  readonly retryable: boolean;

  /**
   * @param message - Human-readable error description
   * @param provider - Provider name that produced the error
   * @param options - Optional status code and retryable flag
   */
  constructor(
    message: string,
    provider: string,
    options?: { statusCode?: number; retryable?: boolean },
  ) {
    super(message);
    this.name = 'LLMError';
    this.provider = provider;
    this.statusCode = options?.statusCode;
    // Default to retryable when not explicitly specified, since transient
    // network failures (no status code) should generally be retried.
    this.retryable = options?.retryable ?? true;
  }
}

/**
 * Determine whether an HTTP status code represents a retryable failure.
 *
 * Retryable: 408 (timeout), 409 (conflict), 429 (rate limit), and any 5xx.
 * Non-retryable: all other 4xx client errors (e.g., 400, 401, 403, 404).
 *
 * @param status - HTTP status code
 * @returns true if the request should be retried
 */
export function isRetryableStatus(status: number): boolean {
  if (status === 408 || status === 409 || status === 429) return true;
  return status >= 500 && status <= 599;
}

// ============================================================================
// Provider Configuration & Factory
// ============================================================================

/**
 * Configuration for constructing an LLM provider.
 */
export interface ProviderConfig {
  /** Provider name: 'openai' or 'anthropic' */
  provider: 'openai' | 'anthropic';

  /** API key for the provider */
  apiKey: string;

  /** Model name (provider-specific default applied when omitted) */
  model?: string;

  /** Optional base URL override (useful for proxies / tests) */
  baseUrl?: string;
}

/**
 * Resolve provider configuration from explicit overrides and environment
 * variables.
 *
 * Precedence: explicit argument > environment variable. The API key is read
 * from the provider-specific environment variable (`OPENAI_API_KEY` or
 * `ANTHROPIC_API_KEY`).
 *
 * @param overrides - Partial config to take precedence over the environment
 * @returns A fully resolved ProviderConfig
 * @throws {LLMError} When the provider is unknown or the API key is missing
 */
export function resolveProviderConfig(
  overrides?: { provider?: string; model?: string; apiKey?: string },
): ProviderConfig {
  const providerName = (
    overrides?.provider ??
    process.env.LLM_PROVIDER ??
    ''
  ).toLowerCase();

  if (providerName !== 'openai' && providerName !== 'anthropic') {
    throw new LLMError(
      `Unknown or missing LLM provider: "${providerName}". ` +
        `Set LLM_PROVIDER (or --provider) to 'openai' or 'anthropic'.`,
      providerName || 'unknown',
      { retryable: false },
    );
  }

  const envKeyName =
    providerName === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY';
  const apiKey = overrides?.apiKey ?? process.env[envKeyName];

  if (!apiKey) {
    throw new LLMError(
      `Missing API key for ${providerName}. Set ${envKeyName} in the environment.`,
      providerName,
      { retryable: false },
    );
  }

  const model = overrides?.model ?? process.env.LLM_MODEL;

  return {
    provider: providerName,
    apiKey,
    model,
  };
}

/**
 * Construct a concrete {@link LLMProvider} from a resolved configuration.
 *
 * Imports the concrete provider classes lazily so that consumers who only
 * need the types or the config resolver don't pull in both implementations.
 *
 * @param config - Resolved provider configuration
 * @returns A ready-to-use LLM provider instance
 * @throws {LLMError} When the provider name is not recognized
 */
export async function createProvider(
  config: ProviderConfig,
): Promise<LLMProvider> {
  switch (config.provider) {
    case 'openai': {
      const { OpenAIProvider } = await import('./openai.js');
      return new OpenAIProvider(config);
    }
    case 'anthropic': {
      const { AnthropicProvider } = await import('./anthropic.js');
      return new AnthropicProvider(config);
    }
    default: {
      // Exhaustiveness guard — should be unreachable given ProviderConfig.
      throw new LLMError(
        `Unsupported provider: ${String(config.provider)}`,
        String(config.provider),
        { retryable: false },
      );
    }
  }
}

/**
 * Convenience helper: resolve configuration from overrides/environment and
 * construct the corresponding provider in one call.
 *
 * @param overrides - Partial config to take precedence over the environment
 * @returns A ready-to-use LLM provider instance
 * @throws {LLMError} When config is invalid or the provider is unsupported
 */
export async function createProviderFromEnv(
  overrides?: { provider?: string; model?: string; apiKey?: string },
): Promise<LLMProvider> {
  const config = resolveProviderConfig(overrides);
  return createProvider(config);
}

