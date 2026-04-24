import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { createActivityLog } from '@/lib/services/activity-log-service'
import type { ActivityLogEntityType } from '@/lib/types/prisma-extended'

// GET /api/active-timer?userId=xxx - Get active timer for user
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return apiError('userId là bắt buộc', 400)
    }

    const timer = await prisma.activeTimer.findUnique({
      where: { userId },
    })

    if (!timer) {
      return apiSuccess(null)
    }

    return apiSuccess(timer)
  } catch (error) {
    logError('Error fetching active timer', error)
    return apiError('Failed to fetch active timer', 500)
  }
}

// POST /api/active-timer - Start new timer (replaces any existing)
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()

    if (!body.userId || !body.taskId) {
      return apiError('userId và taskId là bắt buộc', 400)
    }

    // Upsert - replace existing timer if any
    const timer = await prisma.activeTimer.upsert({
      where: { userId: body.userId },
      update: {
        taskId: body.taskId,
        startTime: body.startTime ? new Date(body.startTime) : new Date(),
        description: body.description,
        updatedAt: new Date(),
      },
      create: {
        userId: body.userId,
        taskId: body.taskId,
        startTime: body.startTime ? new Date(body.startTime) : new Date(),
        description: body.description,
      },
    })

    createActivityLog({
      entityType: 'employee' as ActivityLogEntityType,
      entityId: timer.userId,
      action: 'Bắt đầu timer',
      actionType: 'create',
      metadata: {
        taskId: body.taskId,
        userId: body.userId,
        description: body.description,
      },
      createdBy: session.user?.employeeId || session.user?.id || 'System',
    }).catch(e => logError('[active-timer] activity log failed', e))

    return apiSuccess(timer, 201)
  } catch (error) {
    logError('Error creating active timer', error)
    return apiError('Failed to create active timer', 500)
  }
}

// DELETE /api/active-timer?userId=xxx - Stop/delete timer
export async function DELETE(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return apiError('userId là bắt buộc', 400)
    }

    // Fetch timer info before deletion
    const timer = await prisma.activeTimer.findUnique({
      where: { userId },
      select: { taskId: true, description: true, startTime: true },
    })

    try {
      await prisma.activeTimer.delete({
        where: { userId },
      })
    } catch (e) {
      // If not found, that's okay
      if (!(e instanceof Error && 'code' in e && e.code === 'P2025')) {
        throw e
      }
    }

    // Log activity after successful deletion
    if (timer) {
      const taskTitle = timer.description || timer.taskId
      const duration = timer.startTime
        ? Math.round((Date.now() - new Date(timer.startTime).getTime()) / 1000)
        : 0
      getUserNameFromDb(session.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'active_timer',
            entityId: userId,
            action: 'deleted',
            actionType: 'delete',
            note: `Dừng timer làm việc: ${taskTitle}`,
            metadata: { userName, taskTitle, duration },
            createdBy: userName,
          }
        })
      ).catch(e => logError('[ActivityLog] active-timer delete failed', e))
    }

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Error deleting active timer', error)
    return apiError('Failed to delete active timer', 500)
  }
}
