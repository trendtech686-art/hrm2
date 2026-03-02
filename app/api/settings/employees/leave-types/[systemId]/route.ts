import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { NextRequest } from 'next/server'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/settings/employees/leave-types/[systemId]
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const leaveType = await prisma.settingsData.findUnique({
      where: { systemId },
    })

    if (!leaveType || leaveType.type !== 'leave_type') {
      return apiNotFound('Loại nghỉ phép')
    }

    return apiSuccess({
      systemId: leaveType.systemId,
      id: leaveType.id,
      name: leaveType.name,
      numberOfDays: (leaveType.metadata as Record<string, unknown>)?.maxDaysPerYear ?? 0,
      isPaid: (leaveType.metadata as Record<string, unknown>)?.isPaid ?? true,
      requiresAttachment: (leaveType.metadata as Record<string, unknown>)?.requiresDocument ?? false,
      applicableGender: 'All' as const,
      applicableDepartmentSystemIds: [],
      createdAt: leaveType.createdAt,
      updatedAt: leaveType.updatedAt,
    })
  } catch (error) {
    console.error('Error fetching leave type:', error)
    return apiError('Failed to fetch leave type', 500)
  }
}

// PATCH /api/settings/employees/leave-types/[systemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const body = await request.json()
    
    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    })

    if (!existing || existing.type !== 'leave_type') {
      return apiNotFound('Loại nghỉ phép')
    }

    const existingMetadata = existing.metadata as Record<string, unknown>

    const leaveType = await prisma.settingsData.update({
      where: { systemId },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        isDefault: body.isDefault ?? existing.isDefault,
        metadata: {
          ...existingMetadata,
          isPaid: body.isPaid ?? existingMetadata?.isPaid,
          requiresDocument: body.requiresAttachment ?? existingMetadata?.requiresDocument,
          maxDaysPerYear: body.numberOfDays ?? existingMetadata?.maxDaysPerYear,
        },
        updatedBy: session.user?.id,
      },
    })

    return apiSuccess({
      systemId: leaveType.systemId,
      id: leaveType.id,
      name: leaveType.name,
      numberOfDays: (leaveType.metadata as Record<string, unknown>)?.maxDaysPerYear ?? 0,
      isPaid: (leaveType.metadata as Record<string, unknown>)?.isPaid ?? true,
      requiresAttachment: (leaveType.metadata as Record<string, unknown>)?.requiresDocument ?? false,
      applicableGender: 'All' as const,
      applicableDepartmentSystemIds: [],
      createdAt: leaveType.createdAt,
      updatedAt: leaveType.updatedAt,
    })
  } catch (error) {
    console.error('Error updating leave type:', error)
    return apiError('Failed to update leave type', 500)
  }
}

// DELETE /api/settings/employees/leave-types/[systemId]
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { systemId } = await params

  try {
    const existing = await prisma.settingsData.findUnique({
      where: { systemId },
    })

    if (!existing || existing.type !== 'leave_type') {
      return apiNotFound('Loại nghỉ phép')
    }

    // Soft delete
    await prisma.settingsData.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        updatedBy: session.user?.id,
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error deleting leave type:', error)
    return apiError('Failed to delete leave type', 500)
  }
}
