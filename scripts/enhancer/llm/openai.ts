/**
 * OpenAI chat completion provider.
 *
 * Implements the {@link LLMProvider} interface using the OpenAI
 * Chat Completions REST API via the Node.js global `fetch` (no SDK
 * dependency — see provider.ts for the rationale).
 *
 * @module enhancer/llm/openai
 */

import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
  ProviderConfig,
} from './provider.js';
import { LLMError, isRetryableStatus } from './provider.js';
import { resolveMaxTokens } from './ceilings.js';


/** Default OpenAI model used when none is configured. */
export const DEFAULT_OPENAI_MODEL = 'gpt-4o';

/** Default OpenAI API base URL. */
const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';

/**
 * Shape of the relevant fields in an OpenAI chat completion response.
 * Only the fields we consume are typed.
 */
interface OpenAIChatResponse {
  choices: Array<{ message: { content: string | null } }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * LLM provider backed by the OpenAI Chat Completions API.
 */
export class OpenAIProvider implements LLMProvider {
  /** Provider name for logging. */
  readonly name = 'openai';

  /** Resolved API key. */
  protected readonly apiKey: string;

  /** Model name to request. */
  protected readonly model: string;

  /** API base URL (without trailing slash). */
  protected readonly baseUrl: string;

  /**
   * @param config - Resolved provider configuration (apiKey required)
   */
  constructor(config: ProviderConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model ?? DEFAULT_OPENAI_MODEL;
    this.baseUrl = (config.baseUrl ?? DEFAULT_OPENAI_BASE_URL).replace(
      /\/$/,
      '',
    );
  }

  /**
   * Send a chat completion request to OpenAI.
   *
   * @param messages - Conversation messages (system/user/assistant)
   * @param options - Optional generation parameters
   * @returns The generated content and token usage
   * @throws {LLMError} On network failure or non-2xx API responses
   */
  async chat(
    messages: LLMMessage[],
    options?: LLMChatOptions,
  ): Promise<LLMResponse> {
    const body: Record<string, unknown> = {
      model: this.model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    };

    if (options?.temperature !== undefined) {
      body.temperature = options.temperature;
    }
    // Always request an explicit max_tokens, resolved against the model's
    // output ceiling so an unset value asks for the model maximum and an
    // over-limit request is clamped (never an HTTP 400).
    body.max_tokens = resolveMaxTokens(this.model, options?.maxTokens);

    // OpenAI supports a JSON response mode that guarantees valid JSON output.
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
      });
    } catch (cause) {
      // Network-level failures (DNS, connection reset) have no status code
      // and are treated as retryable transient errors.
      throw new LLMError(
        `OpenAI request failed: ${(cause as Error).message}`,
        this.name,
        { retryable: true },
      );
    }

    if (!response.ok) {
      const detail = await safeReadText(response);
      throw new LLMError(
        `OpenAI API error ${response.status}: ${detail}`,
        this.name,
        {
          statusCode: response.status,
          retryable: isRetryableStatus(response.status),
        },
      );
    }

    const json = (await response.json()) as OpenAIChatResponse;
    const content = json.choices?.[0]?.message?.content ?? '';

    return {
      content,
      usage: {
        promptTokens: json.usage?.prompt_tokens ?? 0,
        completionTokens: json.usage?.completion_tokens ?? 0,
        totalTokens: json.usage?.total_tokens ?? 0,
      },
    };
  }
}

/**
 * Read a Response body as text without throwing.
 * Used to surface error details safely in LLMError messages.
 */
async function safeReadText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return '<unreadable response body>';
  }
}
