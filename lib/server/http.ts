/**
 * Outbound HTTP helpers: every call to a third party gets a timeout, and
 * retryable failures are retried with exponential backoff + full jitter.
 */

export class RetryableError extends Error {}

export async function fetchWithTimeout(
  url: string,
  init: RequestInit & { next?: { revalidate?: number } } = {},
  timeoutMs = 8000,
): Promise<Response> {
  return fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run `fn`, retrying when it throws a RetryableError, a network error or a
 * timeout. Delay for attempt n is random(0, min(maxDelay, base * 2^n)).
 */
export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  { retries = 2, baseDelayMs = 300, maxDelayMs = 3000 } = {},
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      const retryable =
        error instanceof RetryableError ||
        (error instanceof Error &&
          (error.name === "TimeoutError" ||
            error.name === "AbortError" ||
            error instanceof TypeError));

      if (!retryable || attempt === retries) break;

      const cap = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt);
      await sleep(Math.random() * cap);
    }
  }

  throw lastError;
}
