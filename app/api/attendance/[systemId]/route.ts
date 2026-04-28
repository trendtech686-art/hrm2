import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// Validation schema for updating attendance
const updateAttendanceSchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  workHours: z.number().optional(),
})

// GET /api/attendance/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const attendance = await prisma.attendanceRecord.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        employeeId: true,
        date: true,
        checkIn: true,
        checkOut: true,
        status: true,
        workHours: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
            department: {
              select: {
                systemId: true,
                name: true,
                code: true,
              },
            },
            branch: {
              select: {
                systemId: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    })

    if (!attendance) {
      return apiNotFound('Bản ghi chấm công')
    }

    return apiSuccess(attendance)
  } catch (error) {
    logError('Error fetching attendance', error)
    return apiError('Failed to fetch attendance', 500)
  }
}

// PUT /api/attendance/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    
    // Validate request body with Zod schema
    const validation = await validateBody(request, updateAttendanceSchema)
    if (!validation.success) {
      return apiError(validation.error, 400)
    }
    const body = validation.data

    // Fetch existing data before update for change detection
    const existing = await prisma.attendanceRecord.findUnique({
      where: { systemId },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        notes: true,
        workHours: true,
        employeeId: true,
      },
    })
    if (!existing) return apiNotFound('Bản ghi chấm công')

    const attendance = await prisma.attendanceRecord.update({
      where: { systemId },
      data: {
        checkIn: body.checkIn ? new Date(body.checkIn) : undefined,
        checkOut: body.checkOut ? new Date(body.checkOut) : undefined,
        status: body.status,
        notes: body.notes,
        workHours: body.workHours,
      },
      select: {
        systemId: true,
        employeeId: true,
        date: true,
        checkIn: true,
        checkOut: true,
        status: true,
        workHours: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        employee: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
            avatar: true,
          },
        },
      },
    })

    // Notify employee about attendance change (if admin edits)
    if (attendance.employeeId && attendance.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'attendance',
        settingsKey: 'attendance:updated',
        title: 'Chấm công được cập nhật',
        message: `Bản ghi chấm công ngày ${attendance.date ? new Date(attendance.date).toLocaleDateString('vi-VN') : ''} đã được cập nhật`,
        link: '/attendance',
        recipientId: attendance.employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Attendance Update] notification failed', e));
    }

    // Log activity only if values actually changed
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.checkIn !== undefined && body.checkIn !== existing.checkIn?.toISOString()) changes['Giờ vào'] = { from: existing.checkIn?.toISOString() ?? '', to: body.checkIn }
    if (body.checkOut !== undefined && body.checkOut !== existing.checkOut?.toISOString()) changes['Giờ ra'] = { from: existing.checkOut?.toISOString() ?? '', to: body.checkOut }
    if (body.status !== undefined && body.status !== existing.status) changes['Trạng thái'] = { from: existing.status ?? '', to: body.status }
    if (body.notes !== undefined && body.notes !== existing.notes) changes['Ghi chú'] = { from: existing.notes ?? '', to: body.notes }
    if (body.workHours !== undefined && body.workHours !== existing.workHours) changes['Giờ làm'] = { from: existing.workHours ?? 0, to: body.workHours }

    if (Object.keys(changes).length > 0) {
      getUserNameFromDb(session.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'attendance',
            entityId: systemId,
            action: `Cập nhật chấm công`,
            actionType: 'update',
            note: `Cập nhật chấm công: ${Object.keys(changes).join(', ')}`,
            metadata: { userName },
            createdBy: userName,
          }
        })
      ).catch(e => logError('[ActivityLog] attendance updated failed', e))
    }

    return apiSuccess(attendance)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Bản ghi chấm công')
    }
    logError('Error updating attendance', error)
    return apiError('Failed to update attendance', 500)
  }
}

// DELETE /api/attendance/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.attendanceRecord.delete({
      where: { systemId },
    })

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'attendance',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa bản ghi chấm công`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] attendance deleted failed', e))

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Bản ghi chấm công')
    }
    logError('Error deleting attendance', error)
    return apiError('Failed to delete attendance', 500)
  }
}
