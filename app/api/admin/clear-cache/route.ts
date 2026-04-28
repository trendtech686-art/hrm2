import { NextRequest } from 'next/server'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { cache } from '@/lib/cache'
import { prisma } from '@/lib/prisma'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError, logInfo } from '@/lib/logger'

// POST /api/admin/clear-cache - Clear server-side cache
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    // Admin only - verify role from database (source of truth)
    // Session might be stale, always verify from DB for critical operations
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return apiError('Forbidden - Admin only', 403)
    }

    const body = await request.json().catch(() => ({}))
    const pattern = body.pattern as string | undefined

    if (pattern) {
      // Clear specific pattern
      const count = cache.deletePattern(pattern)
      logInfo(`[Cache] Cleared ${count} entries matching pattern: ${pattern}`)
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
      logInfo(`[Cache] Cleared all ${stats.size} entries`)
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
    logError('Error clearing cache', error)
    return apiError('Failed to clear cache', 500)
  }
}
