/**
 * Concurrency-limited batch processor for LLM requests.
 *
 * Runs a list of async tasks with a bounded number of in-flight requests,
 * retrying retryable failures with exponential backoff. Designed to wrap
 * the per-component enhancement calls so the enhancer can process many
 * components efficiently without overwhelming the provider's rate limits.
 *
 * The processor is provider-agnostic: it operates on arbitrary task
 * functions, so it can be unit-tested with the mock provider offline.
 *
 * @module enhancer/llm/batch
 */

import { LLMError } from './provider.js';

/**
 * Outcome for a single batch item.
 *
 * Exactly one of `result` / `error` is populated depending on `ok`.
 */
export interface BatchItemResult<T> {
  /** Index of the item in the original input array */
  index: number;

  /** Whether the task succeeded */
  ok: boolean;

  /** The successful result (present when ok === true) */
  result?: T;

  /** The error that caused failure (present when ok === false) */
  error?: Error;

  /** Number of attempts made (1 = succeeded first try) */
  attempts: number;
}

/**
 * Aggregate result of a batch run.
 */
export interface BatchRunResult<T> {
  /** Per-item results in original input order */
  items: BatchItemResult<T>[];

  /** Successfully completed results, in original input order */
  succeeded: T[];

  /** Items that ultimately failed after all retries */
  failed: BatchItemResult<T>[];
}

/**
 * Options controlling batch execution.
 */
export interface BatchOptions {
  /** Maximum number of concurrent in-flight tasks (default: 4) */
  concurrency?: number;

  /** Maximum retry attempts for retryable failures (default: 3) */
  maxRetries?: number;

  /** Base delay in ms for exponential backoff (default: 500) */
  baseDelayMs?: number;

  /**
   * Sleep function (injectable for tests). Defaults to a real timer.
   * Receives the delay in milliseconds.
   */
  sleep?: (ms: number) => Promise<void>;

  /**
   * Optional progress callback invoked after each item settles
   * (success or final failure).
   */
  onProgress?: (completed: number, total: number) => void;
}

/** Default sleep implementation using setTimeout. */
function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Decide whether an error should be retried.
 *
 * {@link LLMError} carries an explicit `retryable` flag. Any other error is
 * treated as retryable (transient) by default, since the task functions may
 * throw generic network errors.
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof LLMError) return error.retryable;
  return true;
}

/**
 * Run a single task with retry + exponential backoff.
 *
 * @returns A settled BatchItemResult for the given index
 */
async function runWithRetry<T>(
  task: () => Promise<T>,
  index: number,
  maxRetries: number,
  baseDelayMs: number,
  sleep: (ms: number) => Promise<void>,
): Promise<BatchItemResult<T>> {
  let attempts = 0;
  let lastError: Error = new Error('No attempts were made');

  while (attempts < maxRetries) {
    attempts += 1;
    try {
      const result = await task();
      return { index, ok: true, result, attempts };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Stop immediately on non-retryable errors or when retries are exhausted.
      if (!isRetryableError(error) || attempts >= maxRetries) {
        break;
      }

      // Exponential backoff: base * 2^(attempt-1).
      const delay = baseDelayMs * Math.pow(2, attempts - 1);
      await sleep(delay);
    }
  }

  return { index, ok: false, error: lastError, attempts };
}

/**
 * Execute an array of async tasks with bounded concurrency and retries.
 *
 * Tasks run in parallel up to `concurrency`; as each settles, the next
 * pending task starts. Results are returned in the original input order
 * regardless of completion order.
 *
 * @param tasks - Array of task functions to execute
 * @param options - Concurrency / retry configuration
 * @returns Aggregate batch result with per-item outcomes
 */
export async function runBatch<T>(
  tasks: Array<() => Promise<T>>,
  options?: BatchOptions,
): Promise<BatchRunResult<T>> {
  const concurrency = Math.max(1, options?.concurrency ?? 4);
  const maxRetries = Math.max(1, options?.maxRetries ?? 3);
  const baseDelayMs = options?.baseDelayMs ?? 500;
  const sleep = options?.sleep ?? defaultSleep;
  const onProgress = options?.onProgress;

  const items: BatchItemResult<T>[] = new Array(tasks.length);
  let completed = 0;
  let nextIndex = 0;

  /**
   * Worker pulls the next pending task index until the queue is drained.
   * Multiple workers run concurrently to enforce the concurrency bound.
   */
  async function worker(): Promise<void> {
    while (nextIndex < tasks.length) {
      const current = nextIndex;
      nextIndex += 1;

      items[current] = await runWithRetry(
        tasks[current],
        current,
        maxRetries,
        baseDelayMs,
        sleep,
      );

      completed += 1;
      onProgress?.(completed, tasks.length);
    }
  }

  const workerCount = Math.min(concurrency, tasks.length);
  const workers: Array<Promise<void>> = [];
  for (let i = 0; i < workerCount; i += 1) {
    workers.push(worker());
  }
  await Promise.all(workers);

  const succeeded: T[] = [];
  const failed: BatchItemResult<T>[] = [];
  for (const item of items) {
    if (item.ok && item.result !== undefined) {
      succeeded.push(item.result);
    } else if (!item.ok) {
      failed.push(item);
    }
  }

  return { items, succeeded, failed };
}
