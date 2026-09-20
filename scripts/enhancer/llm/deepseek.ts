/**
 * DeepSeek chat completion provider.
 *
 * Implements the {@link LLMProvider} interface against DeepSeek's
 * OpenAI-compatible REST API using the Node.js global `fetch` (no SDK
 * dependency — see provider.ts for the rationale).
 *
 * DeepSeek runs in thinking mode. Requests always enable thinking and send a
 * `reasoning_effort` value, and they ask for the model's full 128K output
 * window so large enriched JSON is never cut short. If the model still stops
 * because it hit that ceiling (`finish_reason === 'length'`), the response is
 * treated as truncated: the call rejects and the item is never written.
 *
 * @module enhancer/llm/deepseek
 */

import type { DeepSeekConfig } from '../types.js';
import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
  ProviderConfig,
} from './provider.js';
import { LLMError, isRetryableStatus, readResponseBody } from './provider.js';
import {
  DEFAULT_DEEPSEEK_BASE_URL,
  DEFAULT_DEEPSEEK_MODEL,
  DEFAULT_DEEPSEEK_REASONING_EFFORT,
  DEEPSEEK_MAX_OUTPUT_TOKENS,
  DEEPSEEK_REQUEST_TIMEOUT_MS,
} from '../config.js';

/** Default DeepSeek model used when none is configured. */
export { DEFAULT_DEEPSEEK_MODEL, DEFAULT_DEEPSEEK_BASE_URL };

/**
 * Shape of the relevant fields in a DeepSeek chat completion response.
 * Only the fields we consume are typed.
 */
interface DeepSeekChatResponse {
  choices: Array<{
    message: { content: string | null };
    finish_reason?: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    completion_tokens_details?: { reasoning_tokens?: number };
  };
}

/**
 * LLM provider backed by the DeepSeek Chat Completions API.
 */
export class DeepSeekProvider implements LLMProvider {
  /** Provider name for logging. */
  readonly name = 'deepseek';

  /** Resolved API key. */
  protected readonly apiKey: string;

  /** Model name to request. */
  protected readonly model: string;

  /** API base URL (without trailing slash). */
  protected readonly baseUrl: string;

  /** Thinking-mode reasoning effort. */
  protected readonly reasoningEffort: DeepSeekConfig['reasoningEffort'];

  /**
   * @param config - Resolved DeepSeek configuration (apiKey required)
   */
  constructor(config: DeepSeekConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.reasoningEffort = config.reasoningEffort;
  }

  /**
   * Send a chat completion request to DeepSeek.
   *
   * @param messages - Conversation messages (system/user/assistant)
   * @param options - Optional generation parameters
   * @returns The generated content and token usage
   * @throws {LLMError} On network failure, non-2xx responses, or truncation
   */
  async chat(
    messages: LLMMessage[],
    options?: LLMChatOptions,
  ): Promise<LLMResponse> {
    const maxTokens = Math.min(
      options?.maxTokens ?? DEEPSEEK_MAX_OUTPUT_TOKENS,
      DEEPSEEK_MAX_OUTPUT_TOKENS,
    );

    const body: Record<string, unknown> = {
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_tokens: maxTokens,
      thinking: { type: 'enabled' },
      reasoning_effort: this.reasoningEffort,
    };

    if (options?.responseFormat === 'json') {
      body.response_format = { type: 'json_object' };
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(DEEPSEEK_REQUEST_TIMEOUT_MS),
      });
    } catch (cause) {
      // Network-level failures and timeouts have no status code and are
      // treated as retryable transient errors.
      throw new LLMError(
        `DeepSeek request failed: ${(cause as Error).message}`,
        this.name,
        { retryable: true },
      );
    }

    if (!response.ok) {
      const detail = await readResponseBody(response);
      throw new LLMError(
        `DeepSeek API error ${response.status}: ${detail}`,
        this.name,
        {
          statusCode: response.status,
          retryable: isRetryableStatus(response.status),
        },
      );
    }

    const json = (await response.json()) as DeepSeekChatResponse;
    const choice = json.choices?.[0];

    // A `length` finish reason means the model ran out of output budget: the
    // JSON is incomplete, so the item must fail rather than persist partial
    // documentation. Non-retryable — repeating the same request cannot help.
    if (choice?.finish_reason === 'length') {
      throw new LLMError(
        `DeepSeek response was truncated (finish_reason=length) for model ${this.model}`,
        this.name,
        { retryable: false },
      );
    }

    return {
      content: choice?.message?.content ?? '',
      usage: {
        promptTokens: json.usage?.prompt_tokens ?? 0,
        completionTokens: json.usage?.completion_tokens ?? 0,
        totalTokens: json.usage?.total_tokens ?? 0,
        reasoningTokens: json.usage?.completion_tokens_details?.reasoning_tokens,
      },
    };
  }
}

/**
 * Convert a general {@link ProviderConfig} into a fully resolved
 * {@link DeepSeekConfig}, applying the documented defaults.
 *
 * @param config - Provider configuration with `provider: 'deepseek'`
 * @returns A DeepSeek configuration with every field populated
 */
export function toDeepSeekConfig(config: ProviderConfig): DeepSeekConfig {
  return {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl ?? DEFAULT_DEEPSEEK_BASE_URL,
    model: config.model ?? DEFAULT_DEEPSEEK_MODEL,
    reasoningEffort:
      config.reasoningEffort ?? DEFAULT_DEEPSEEK_REASONING_EFFORT,
  };
}
