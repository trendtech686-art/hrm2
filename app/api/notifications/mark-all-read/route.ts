/**
 * Mark All Notifications as Read
 *
 * POST /api/notifications/mark-all-read
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export async function POST() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const employeeId = session.user.employeeId
    if (!employeeId) return apiError('Employee not found', 400)

    const result = await prisma.notification.updateMany({
      where: { recipientId: employeeId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    })

    return apiSuccess({ success: true, count: result.count })
  } catch (error) {
    logError('[API] Error marking all notifications as read', error)
    return apiError('Failed to mark all as read', 500)
  }
}
