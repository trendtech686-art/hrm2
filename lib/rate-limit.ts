/**
 * Lightweight in-memory rate limiter for Server Actions
 * 
 * Uses a Map with automatic cleanup to track request counts per key.
 * Suitable for single-instance deployments. For multi-instance,
 * consider Redis-based rate limiting.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateMap = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
let cleanupInterval: ReturnType<typeof setInterval> | null = null

function ensureCleanup() {
  if (cleanupInterval) return
  cleanupInterval = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateMap) {
      if (now > entry.resetAt) {
        rateMap.delete(key)
      }
    }
    // Stop cleanup if map is empty
    if (rateMap.size === 0 && cleanupInterval) {
      clearInterval(cleanupInterval)
      cleanupInterval = null
    }
  }, 5 * 60 * 1000)
}

/**
 * Check if a request is within rate limits
 * 
 * @param key - Unique identifier (e.g., `login:${ip}` or `action:${userId}`)
 * @param limit - Maximum requests allowed in the window (default: 30)
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns true if request is allowed, false if rate limited
 * 
 * @example
 * ```ts
 * const ip = (await headers()).get('x-forwarded-for') ?? 'unknown'
 * if (!checkRateLimit(`login:${ip}`, 5, 60_000)) {
 *   return { error: 'Quá nhiều lần thử. Vui lòng đợi 1 phút.' }
 * }
 * ```
 */
export function checkRateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): boolean {
  ensureCleanup()

  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (entry.count >= limit) {
    return false
  }

  entry.count++
  return true
}

/**
 * Get remaining requests for a key
 */
export function getRateLimitRemaining(
  key: string,
  limit = 30
): number {
  const entry = rateMap.get(key)
  if (!entry || Date.now() > entry.resetAt) return limit
  return Math.max(0, limit - entry.count)
}
