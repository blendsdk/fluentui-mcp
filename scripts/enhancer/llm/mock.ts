/**
 * Mock LLM provider for offline testing.
 *
 * Implements {@link LLMProvider} without any network calls. It records every
 * request it receives and returns scripted responses, optionally failing a
 * configurable number of times to exercise the batch processor's retry path.
 *
 * This lives under `scripts/` (not the test tree) so both Vitest tests and
 * local dry-run tooling can import it.
 *
 * @module enhancer/llm/mock
 */

import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
} from './provider.js';
import { LLMError } from './provider.js';

/**
 * A recorded call made to the mock provider.
 */
export interface RecordedCall {
  /** Messages passed to chat() */
  messages: LLMMessage[];

  /** Options passed to chat() */
  options?: LLMChatOptions;
}

/**
 * Configuration for {@link MockLLMProvider}.
 */
export interface MockProviderOptions {
  /**
   * Fixed response content to return. Can be a string or a function that
   * derives the content from the request messages.
   * Defaults to an empty JSON object string.
   */
  response?: string | ((messages: LLMMessage[]) => string);

  /**
   * Number of times to throw before succeeding. Used to test retry logic.
   * Each call decrements the remaining failure count.
   */
  failTimes?: number;

  /**
   * Whether the injected failures are retryable. Defaults to true.
   * Set false to test non-retryable error short-circuiting.
   */
  failRetryable?: boolean;

  /** Token usage to report on success (defaults to zeros). */
  usage?: LLMResponse['usage'];
}

/**
 * In-memory LLM provider that returns scripted responses and records calls.
 */
export class MockLLMProvider implements LLMProvider {
  /** Provider name for logging. */
  readonly name = 'mock';

  /** All calls received, in order. */
  readonly calls: RecordedCall[] = [];

  private remainingFailures: number;
  private readonly response: string | ((messages: LLMMessage[]) => string);
  private readonly failRetryable: boolean;
  private readonly usage: LLMResponse['usage'];

  constructor(options?: MockProviderOptions) {
    this.response = options?.response ?? '{}';
    this.remainingFailures = options?.failTimes ?? 0;
    this.failRetryable = options?.failRetryable ?? true;
    this.usage = options?.usage ?? {
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
    };
  }

  /** Total number of chat() invocations recorded. */
  get callCount(): number {
    return this.calls.length;
  }

  /**
   * Return a scripted response or throw an injected failure.
   *
   * @param messages - Conversation messages (recorded)
   * @param options - Generation options (recorded)
   */
  async chat(
    messages: LLMMessage[],
    options?: LLMChatOptions,
  ): Promise<LLMResponse> {
    this.calls.push({ messages, options });

    if (this.remainingFailures > 0) {
      this.remainingFailures -= 1;
      throw new LLMError('Injected mock failure', this.name, {
        retryable: this.failRetryable,
      });
    }

    const content =
      typeof this.response === 'function'
        ? this.response(messages)
        : this.response;

    return { content, usage: this.usage };
  }
}
