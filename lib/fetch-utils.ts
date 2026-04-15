/**
 * Fetch utilities with timeout support
 * Prevents outbound HTTP calls from hanging indefinitely
 */

const DEFAULT_TIMEOUT_MS = 15_000 // 15 seconds

/**
 * Wrapper around fetch() that adds an AbortController timeout.
 * Throws an error if the request takes longer than `timeoutMs`.
 */
export async function fetchWithTimeout(
  input: string | URL | Request,
  init?: RequestInit & { timeoutMs?: number }
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchInit } = init ?? {}

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(input, {
      ...fetchInit,
      signal: controller.signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms: ${String(input)}`)
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}
