/**
 * Never-truncate completion wrapper around an {@link LLMProvider}.
 *
 * Large enriched JSON responses can be cut off at a model's output-token
 * ceiling. `chatComplete` guarantees the orchestrator always receives a
 * complete (parseable) JSON value by running an escalation ladder:
 *
 *   Stage 1 — continuation: re-prompt the model to continue exactly where it
 *             left off, in PLAIN-TEXT mode so the raw token stream can be
 *             stitched (OpenAI `json_object` mode would emit a fresh object
 *             instead of continuing — see PF-001).
 *   Stage 2 — re-request: issue one fresh whole-entry request with the model
 *             ceiling (cost is irrelevant for this pipeline).
 *   Stage 3 — repair: as a last resort, close the truncated JSON via
 *             {@link repairJson}, logging a loud warning and incrementing a
 *             `repairsUsed` counter so lossy entries can be reviewed (PF-003).
 *
 * @module enhancer/llm/complete
 */

import type {
  LLMProvider,
  LLMMessage,
  LLMResponse,
  LLMChatOptions,
} from './provider.js';
import { isLikelyComplete, repairJson } from '../parse.js';

/** Default number of continuation rounds before escalating. */
const DEFAULT_MAX_CONTINUATIONS = 4;

/** Prompt used to ask the model to continue a truncated JSON response. */
const CONTINUATION_PROMPT =
  'Continue the JSON exactly where you left off. Output only the remaining ' +
  'raw JSON, no repetition, no commentary, no code fences.';

/**
 * Options for {@link chatComplete}, extending the base chat options.
 */
export interface CompleteOptions extends LLMChatOptions {
  /** Max continuation rounds before escalating (default 4). */
  maxContinuations?: number;

  /**
   * Allow one full re-request (with the model ceiling) before falling back to
   * repair. Defaults to true.
   */
  allowReRequest?: boolean;

  /** Optional verbose logger for continuation/re-request/repair events. */
  log?: (msg: string) => void;
}

/**
 * Result of {@link chatComplete}: a normal {@link LLMResponse} plus a count of
 * how many times last-resort JSON repair was applied (0 in the happy path).
 */
export interface CompleteResponse extends LLMResponse {
  /** Number of times Stage 3 repair was invoked (for human review). */
  repairsUsed: number;
}

/** Add two usage records field-by-field. */
function addUsage(
  a: LLMResponse['usage'],
  b: LLMResponse['usage'],
): LLMResponse['usage'] {
  return {
    promptTokens: a.promptTokens + b.promptTokens,
    completionTokens: a.completionTokens + b.completionTokens,
    totalTokens: a.totalTokens + b.totalTokens,
  };
}

/**
 * Run the escalation ladder so an LLM response is never lost to truncation.
 *
 * @param provider - The underlying LLM provider
 * @param messages - The conversation messages for the initial request
 * @param options - Completion options (continuation/re-request/repair tuning)
 * @returns The stitched, complete content with summed usage and a repair count
 */
export async function chatComplete(
  provider: LLMProvider,
  messages: LLMMessage[],
  options: CompleteOptions = {},
): Promise<CompleteResponse> {
  const maxContinuations = options.maxContinuations ?? DEFAULT_MAX_CONTINUATIONS;
  const allowReRequest = options.allowReRequest ?? true;
  const log = options.log ?? (() => {});

  const baseOptions: LLMChatOptions = {
    temperature: options.temperature,
    maxTokens: options.maxTokens,
    responseFormat: options.responseFormat,
  };

  // First turn: JSON mode is allowed (as requested by the caller).
  const first = await provider.chat(messages, baseOptions);
  let acc = first.content;
  let usage = first.usage;

  if (isLikelyComplete(acc)) {
    return { content: acc, usage, repairsUsed: 0 };
  }

  // Stage 1 — continuation turns in PLAIN-TEXT mode (PF-001).
  for (let round = 0; round < maxContinuations; round += 1) {
    log(`chatComplete: continuation round ${round + 1}`);
    const continuationMessages: LLMMessage[] = [
      ...messages,
      { role: 'assistant', content: acc },
      { role: 'user', content: CONTINUATION_PROMPT },
    ];
    const next = await provider.chat(continuationMessages, {
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      responseFormat: 'text',
    });
    acc += next.content;
    usage = addUsage(usage, next.usage);

    if (isLikelyComplete(acc)) {
      return { content: acc, usage, repairsUsed: 0 };
    }
  }

  // Stage 2 — one fresh whole-entry re-request at the model ceiling.
  if (allowReRequest) {
    log('chatComplete: continuation exhausted, re-requesting whole entry');
    const reRequest = await provider.chat(messages, {
      temperature: options.temperature,
      // Leave maxTokens undefined so the provider uses the model ceiling.
      responseFormat: options.responseFormat,
    });
    usage = addUsage(usage, reRequest.usage);
    if (isLikelyComplete(reRequest.content)) {
      return { content: reRequest.content, usage, repairsUsed: 0 };
    }
    // The fresh response is the cleanest basis for repair.
    acc = reRequest.content;
  }

  // Stage 3 — last-resort repair.
  log('chatComplete: WARNING — applying last-resort JSON repair (data may be lossy)');
  const repaired = repairJson(acc);
  return { content: repaired, usage, repairsUsed: 1 };
}
