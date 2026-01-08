import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/attendance/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const attendance = await prisma.attendanceRecord.findUnique({
      where: { systemId },
      include: {
        employee: {
          include: {
            department: true,
            branch: true,
          },
        },
      },
    })

    if (!attendance) {
      return apiNotFound('Bản ghi chấm công')
    }

    return apiSuccess(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return apiError('Failed to fetch attendance', 500)
  }
}

// PUT /api/attendance/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const attendance = await prisma.attendanceRecord.update({
      where: { systemId },
      data: {
        checkIn: body.checkIn ? new Date(body.checkIn) : undefined,
        checkOut: body.checkOut ? new Date(body.checkOut) : undefined,
        status: body.status,
        notes: body.notes,
        workHours: body.workHours,
      },
      include: { employee: true },
    })

    return apiSuccess(attendance)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Bản ghi chấm công')
    }
    console.error('Error updating attendance:', error)
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

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiNotFound('Bản ghi chấm công')
    }
    console.error('Error deleting attendance:', error)
    return apiError('Failed to delete attendance', 500)
  }
}
