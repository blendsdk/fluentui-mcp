/**
 * Barrel exports for the enhancer LLM subsystem.
 *
 * Provides a single import surface for provider construction, the concrete
 * providers, the batch processor, and the mock provider used in tests.
 *
 * @module enhancer/llm
 */

export type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
  ProviderConfig,
} from './provider.js';
export {
  LLMError,
  isRetryableStatus,
  resolveProviderConfig,
  createProvider,
  createProviderFromEnv,
} from './provider.js';

export { OpenAIProvider, DEFAULT_OPENAI_MODEL } from './openai.js';
export { AnthropicProvider, DEFAULT_ANTHROPIC_MODEL } from './anthropic.js';

export type {
  BatchItemResult,
  BatchRunResult,
  BatchOptions,
} from './batch.js';
export { runBatch } from './batch.js';

export type { MockProviderOptions, RecordedCall } from './mock.js';
export { MockLLMProvider } from './mock.js';
