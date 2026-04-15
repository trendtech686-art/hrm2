/**
 * Single Notification API
 *
 * PATCH  /api/notifications/[id] — Mark as read
 * DELETE /api/notifications/[id] — Delete a notification
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

interface Params {
  params: Promise<{ id: string }>
}

// PATCH — mark notification as read
export async function PATCH(request: Request, { params }: Params) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { id } = await params
    const employeeId = session.user.employeeId
    if (!employeeId) return apiError('Employee not found', 400)

    const notification = await prisma.notification.updateMany({
      where: { id, recipientId: employeeId },
      data: { isRead: true, readAt: new Date() },
    })

    if (notification.count === 0) {
      return apiError('Notification not found', 404)
    }

    return apiSuccess({ success: true })
  } catch (error) {
    logError('[API] Error updating notification', error)
    return apiError('Failed to update notification', 500)
  }
}

// DELETE — remove a notification
export async function DELETE(request: Request, { params }: Params) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { id } = await params
    const employeeId = session.user.employeeId
    if (!employeeId) return apiError('Employee not found', 400)

    const result = await prisma.notification.deleteMany({
      where: { id, recipientId: employeeId },
    })

    if (result.count === 0) {
      return apiError('Notification not found', 404)
    }

    return apiSuccess({ success: true })
  } catch (error) {
    logError('[API] Error deleting notification', error)
    return apiError('Failed to delete notification', 500)
  }
}
