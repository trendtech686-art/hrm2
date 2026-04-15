/**
 * Unread Notification Count by Group
 *
 * GET /api/notifications/unread-counts
 *
 * Returns: { orders: number, shipping: number, inventory: number, system: number, total: number }
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getNotificationGroup, type NotificationGroup } from '@/lib/notification-groups'

export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const employeeId = session.user.employeeId
    if (!employeeId) return apiError('Employee not found', 400)

    // Group unread notifications by type using raw groupBy
    const grouped = await prisma.notification.groupBy({
      by: ['type'],
      where: { recipientId: employeeId, isRead: false },
      _count: true,
    })

    // Aggregate into 4 groups
    const counts: Record<NotificationGroup, number> = {
      orders: 0,
      shipping: 0,
      inventory: 0,
      system: 0,
    }

    let total = 0
    for (const row of grouped) {
      const group = getNotificationGroup(row.type)
      counts[group] += row._count
      total += row._count
    }

    return apiSuccess({ ...counts, total })
  } catch (error) {
    logError('[API] Error fetching unread counts', error)
    return apiError('Failed to fetch unread counts', 500)
  }
}
