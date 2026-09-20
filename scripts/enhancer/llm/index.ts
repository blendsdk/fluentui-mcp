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
  DeepSeekReasoningEffort,
} from './provider.js';
export type { DeepSeekConfig } from '../types.js';
export {
  LLMError,
  isRetryableStatus,
  resolveProviderConfig,
  createProvider,
  createProviderFromEnv,
} from './provider.js';

export { OpenAIProvider, DEFAULT_OPENAI_MODEL } from './openai.js';
export { AnthropicProvider, DEFAULT_ANTHROPIC_MODEL } from './anthropic.js';
export {
  DeepSeekProvider,
  toDeepSeekConfig,
  DEFAULT_DEEPSEEK_MODEL,
  DEFAULT_DEEPSEEK_BASE_URL,
} from './deepseek.js';
export {
  DEEPSEEK_MAX_OUTPUT_TOKENS,
  DEEPSEEK_REQUEST_TIMEOUT_MS,
  DEEPSEEK_REASONING_EFFORTS,
  DEFAULT_DEEPSEEK_REASONING_EFFORT,
} from '../config.js';

export {
  MODEL_OUTPUT_CEILINGS,
  MODEL_FAMILY_CEILINGS,
  FALLBACK_OUTPUT_CEILING,
  ceilingForModel,
  resolveMaxTokens,
  usesMaxCompletionTokens,
  supportsCustomTemperature,
} from './ceilings.js';


export type { CompleteOptions, CompleteResponse } from './complete.js';
export { chatComplete } from './complete.js';


export type {
  BatchItemResult,
  BatchRunResult,
  BatchOptions,
} from './batch.js';
export { runBatch } from './batch.js';

export type { MockProviderOptions, RecordedCall } from './mock.js';
export { MockLLMProvider } from './mock.js';
