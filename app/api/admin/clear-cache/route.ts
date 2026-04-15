import { NextRequest } from 'next/server'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { cache } from '@/lib/cache'

// POST /api/admin/clear-cache - Clear server-side cache
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json().catch(() => ({}))
    const pattern = body.pattern as string | undefined

    if (pattern) {
      // Clear specific pattern
      const count = cache.deletePattern(pattern)
      console.log(`[Cache] Cleared ${count} entries matching pattern: ${pattern}`)
      return apiSuccess({ cleared: count, pattern })
    } else {
      // Clear all
      const stats = cache.stats()
      cache.clear()
      console.log(`[Cache] Cleared all ${stats.size} entries`)
      return apiSuccess({ cleared: stats.size, pattern: 'all' })
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
    return apiError('Failed to clear cache', 500)
  }
}
