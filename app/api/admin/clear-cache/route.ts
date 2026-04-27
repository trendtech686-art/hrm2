import { NextRequest } from 'next/server'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { cache } from '@/lib/cache'
import { prisma } from '@/lib/prisma'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'

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
      console.warn(`[Cache] Cleared ${count} entries matching pattern: ${pattern}`)
      getUserNameFromDb(session.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'system',
            entityId: 'clear-cache',
            action: 'created',
            actionType: 'create',
            note: `Xóa cache hệ thống`,
            metadata: { userName, keysCleared: count },
            createdBy: userName,
          }
        }).catch(e => logError('[ActivityLog] clear-cache failed', e))
      )
      return apiSuccess({ cleared: count, pattern })
    } else {
      // Clear all
      const stats = cache.stats()
      cache.clear()
      console.warn(`[Cache] Cleared all ${stats.size} entries`)
      getUserNameFromDb(session.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'system',
            entityId: 'clear-cache',
            action: 'created',
            actionType: 'create',
            note: `Xóa cache hệ thống`,
            metadata: { userName, keysCleared: stats.size },
            createdBy: userName,
          }
        }).catch(e => logError('[ActivityLog] clear-cache failed', e))
      )
      return apiSuccess({ cleared: stats.size, pattern: 'all' })
    }
  } catch (error) {
    console.error('Error clearing cache:', error)
    return apiError('Failed to clear cache', 500)
  }
}
