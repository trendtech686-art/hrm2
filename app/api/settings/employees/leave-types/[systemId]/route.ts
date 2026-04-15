import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { NextRequest } from 'next/server'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

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
    logError('Error fetching leave type', error)
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

    // Activity log
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description, to: body.description }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: body.isDefault ? 'Có' : 'Không' }
    if (body.isPaid !== undefined && body.isPaid !== existingMetadata?.isPaid) changes['Hưởng lương'] = { from: existingMetadata?.isPaid ? 'Có' : 'Không', to: body.isPaid ? 'Có' : 'Không' }
    if (body.requiresAttachment !== undefined && body.requiresAttachment !== existingMetadata?.requiresDocument) changes['Y/C File'] = { from: existingMetadata?.requiresDocument ? 'Có' : 'Không', to: body.requiresAttachment ? 'Có' : 'Không' }
    if (body.numberOfDays !== undefined && body.numberOfDays !== existingMetadata?.maxDaysPerYear) changes['Số ngày'] = { from: existingMetadata?.maxDaysPerYear, to: body.numberOfDays }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      await createActivityLog({
        entityType: 'leave_type',
        entityId: systemId,
        action: `Cập nhật loại nghỉ phép: ${existing.name}: ${changeDetail}`,
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('Failed to create activity log', e))
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
    logError('Error updating leave type', error)
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

    await createActivityLog({
      entityType: 'leave_type',
      entityId: systemId,
      action: `Xóa loại nghỉ phép: ${existing.name}`,
      createdBy: session.user?.id,
    }).catch(e => logError('Failed to create activity log', e))

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Error deleting leave type', error)
    return apiError('Failed to delete leave type', 500)
  }
}
