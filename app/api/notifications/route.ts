/**
 * Notifications API
 *
 * GET  /api/notifications         — List notifications for current user (paginated)
 * POST /api/notifications         — Create a notification (internal / admin)
 */

import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiPaginated, apiSuccess, apiError, parsePagination } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { z } from 'zod'
import { getTypesForGroup, type NotificationGroup } from '@/lib/notification-groups'
import { createNotification } from '@/lib/notifications'

const VALID_GROUPS = ['orders', 'shipping', 'inventory', 'system'] as const

// GET — list notifications for the authenticated user
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, skip } = parsePagination(searchParams)
    const type = searchParams.get('type') || ''
    const group = searchParams.get('group') || ''
    const unreadOnly = searchParams.get('unreadOnly') === 'true'

    const employeeId = session.user.employeeId
    // If no employeeId, return empty notifications (user may be a system user without employee record)
    // Don't return error - just return empty list so UI shows "No notifications"
    if (!employeeId) {
      return apiPaginated([], { page, limit, total: 0 })
    }

    const where: Record<string, unknown> = { recipientId: employeeId }
    if (type) where.type = type
    if (group && VALID_GROUPS.includes(group as NotificationGroup)) {
      where.type = { in: getTypesForGroup(group as NotificationGroup) }
    }
    if (unreadOnly) where.isRead = false

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where }),
    ])

    return apiPaginated(notifications, { page, limit, total })
  } catch (error) {
    logError('[API] Error fetching notifications', error)
    return apiError('Failed to fetch notifications', 500)
  }
}

// POST — create a notification (internal use)
const createSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  message: z.string().min(1),
  link: z.string().optional(),
  recipientId: z.string().min(1),
  senderId: z.string().optional(),
  senderName: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  settingsKey: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(parsed.error.issues.map(i => i.message).join(', '), 400)
    }

    // Route through central helper → honors master switch + module toggles
    const { metadata, ...rest } = parsed.data
    const notification = await createNotification({
      ...rest,
      metadata: metadata as Prisma.InputJsonValue | undefined,
    })
    if (!notification) {
      return apiSuccess(null, 200)
    }

    return apiSuccess(notification, 201)
  } catch (error) {
    logError('[API] Error creating notification', error)
    return apiError('Failed to create notification', 500)
  }
}
