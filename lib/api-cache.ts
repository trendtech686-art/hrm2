/**
 * API Response caching utilities
 * 
 * Provides caching for API routes with automatic invalidation
 * 
 * Usage in API routes:
 * ```ts
 * import { withCache, invalidateCache } from '@/lib/api-cache'
 * 
 * export async function GET(request: Request) {
 *   return withCache(
 *     'products',
 *     async () => {
 *       const products = await prisma.product.findMany()
 *       return NextResponse.json(products)
 *     },
 *     { ttl: CACHE_TTL.MEDIUM }
 *   )
 * }
 * 
 * // In mutation endpoints
 * export async function POST(request: Request) {
 *   const product = await prisma.product.create({ ... })
 *   invalidateCache('products') // Clear products cache
 *   return NextResponse.json(product)
 * }
 * ```
 */

import { NextResponse } from 'next/server'
import { cache, CACHE_TTL, cacheKey } from './cache'

interface CacheOptions {
  ttl?: number
  tags?: string[]
}

interface CachedResponse {
  body: unknown
  headers: Record<string, string>
  status: number
}

/**
 * Wrap an API handler with caching
 */
export async function withCache<T>(
  key: string,
  handler: () => Promise<NextResponse<T>>,
  options: CacheOptions = {}
): Promise<NextResponse<T>> {
  const { ttl = CACHE_TTL.MEDIUM * 1000 } = options

  // Try to get from cache
  const cached = cache.get<CachedResponse>(key)
  if (cached) {
    // Return cached response
    const response = NextResponse.json(cached.body as T, {
      status: cached.status,
    })
    
    // Add cache headers
    response.headers.set('X-Cache', 'HIT')
    response.headers.set('X-Cache-Key', key)
    
    // Restore original headers
    for (const [name, value] of Object.entries(cached.headers)) {
      if (!response.headers.has(name)) {
        response.headers.set(name, value)
      }
    }
    
    return response
  }

  // Execute handler
  const response = await handler()
  
  // Only cache successful responses
  if (response.status >= 200 && response.status < 300) {
    try {
      // Clone response to read body
      const cloned = response.clone()
      const body = await cloned.json()
      
      // Extract headers
      const headers: Record<string, string> = {}
      cloned.headers.forEach((value, name) => {
        headers[name] = value
      })

      // Store in cache
      cache.set<CachedResponse>(key, {
        body,
        headers,
        status: response.status,
      }, ttl)

      // Add cache headers to original response
      response.headers.set('X-Cache', 'MISS')
      response.headers.set('X-Cache-Key', key)
    } catch {
      // If we can't cache, just return the response
      console.warn('[API Cache] Failed to cache response for key:', key)
    }
  }

  return response
}

/**
 * Invalidate cache by key or pattern
 */
export function invalidateCache(keyOrPattern: string): void {
  if (keyOrPattern.includes('*') || keyOrPattern.includes('^')) {
    // Pattern-based invalidation
    cache.deletePattern(keyOrPattern)
  } else {
    // Exact key invalidation
    cache.delete(keyOrPattern)
  }
}

/**
 * Invalidate multiple cache keys
 */
export function invalidateCaches(...keys: string[]): void {
  for (const key of keys) {
    invalidateCache(key)
  }
}

/**
 * Helper to create cache key from request
 */
export function createCacheKey(
  prefix: string,
  request: Request
): string {
  const url = new URL(request.url)
  const params = url.searchParams.toString()
  return params ? `${prefix}:${params}` : prefix
}

// Re-export utilities
export { cache, CACHE_TTL, cacheKey }
