/**
 * Anthropic (Claude) message provider.
 *
 * Implements the {@link LLMProvider} interface using the Anthropic
 * Messages REST API via the Node.js global `fetch` (no SDK dependency —
 * see provider.ts for the rationale).
 *
 * Key API differences from OpenAI:
 *  - System prompts are passed as a top-level `system` field, not a message.
 *  - Authentication uses the `x-api-key` header plus `anthropic-version`.
 *  - `max_tokens` is REQUIRED by the API.
 *  - Responses return a `content` array of blocks; we concatenate text blocks.
 *
 * @module enhancer/llm/anthropic
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

/** Default Anthropic model used when none is configured. */
export const DEFAULT_ANTHROPIC_MODEL = 'claude-3-5-sonnet-latest';

/** Default Anthropic API base URL. */
const DEFAULT_ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1';

/** Anthropic API version header value. */
const ANTHROPIC_VERSION = '2023-06-01';


/**
 * Shape of the relevant fields in an Anthropic messages response.
 * Only the fields we consume are typed.
 */
interface AnthropicMessageResponse {
  content: Array<{ type: string; text?: string }>;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * LLM provider backed by the Anthropic Messages API.
 */
export class AnthropicProvider implements LLMProvider {
  /** Provider name for logging. */
  readonly name = 'anthropic';

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
    this.model = config.model ?? DEFAULT_ANTHROPIC_MODEL;
    this.baseUrl = (config.baseUrl ?? DEFAULT_ANTHROPIC_BASE_URL).replace(
      /\/$/,
      '',
    );
  }

  /**
   * Send a message request to Anthropic.
   *
   * System messages are hoisted into the top-level `system` field; the
   * remaining user/assistant messages form the `messages` array.
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
    // Anthropic separates the system prompt from the conversation turns.
    const systemPrompt = messages
      .filter((m) => m.role === 'system')
      .map((m) => m.content)
      .join('\n\n');

    const conversation = messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({ role: m.role, content: m.content }));

    const body: Record<string, unknown> = {
      model: this.model,
      messages: conversation,
      // max_tokens is REQUIRED; resolve against the model ceiling so an unset
      // value asks for the model maximum and over-limit requests are clamped.
      max_tokens: resolveMaxTokens(this.model, options?.maxTokens),
    };


    if (systemPrompt) {
      body.system = systemPrompt;
    }
    if (options?.temperature !== undefined) {
      body.temperature = options.temperature;
    }

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': ANTHROPIC_VERSION,
        },
        body: JSON.stringify(body),
      });
    } catch (cause) {
      // Network-level failures have no status code; treat as retryable.
      throw new LLMError(
        `Anthropic request failed: ${(cause as Error).message}`,
        this.name,
        { retryable: true },
      );
    }

    if (!response.ok) {
      const detail = await safeReadText(response);
      throw new LLMError(
        `Anthropic API error ${response.status}: ${detail}`,
        this.name,
        {
          statusCode: response.status,
          retryable: isRetryableStatus(response.status),
        },
      );
    }

    const json = (await response.json()) as AnthropicMessageResponse;
    const content = (json.content ?? [])
      .filter((block) => block.type === 'text' && block.text)
      .map((block) => block.text)
      .join('');

    return {
      content,
      usage: {
        promptTokens: json.usage?.input_tokens ?? 0,
        completionTokens: json.usage?.output_tokens ?? 0,
        totalTokens:
          (json.usage?.input_tokens ?? 0) + (json.usage?.output_tokens ?? 0),
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
