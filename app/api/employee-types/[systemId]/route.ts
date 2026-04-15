import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

type RouteParams = { params: Promise<{ systemId: string }> }

// GET /api/employee-types/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const employeeType = await prisma.employeeTypeSetting.findUnique({
      where: { systemId },
    })

    if (!employeeType || employeeType.isDeleted) {
      return apiNotFound('Loại nhân viên')
    }

    return apiSuccess(employeeType)
  } catch (error) {
    logError('Error fetching employee type', error)
    return apiError('Failed to fetch employee type', 500)
  }
}

// PUT /api/employee-types/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // Read existing for diff
    const existing = await prisma.employeeTypeSetting.findUnique({
      where: { systemId },
    })
    if (!existing || existing.isDeleted) {
      return apiError('Loại nhân viên không tồn tại', 404)
    }

    // If this is set as default, unset other defaults
    if (body.isDefault) {
      await prisma.employeeTypeSetting.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const employeeType = await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: {
        ...(body.id !== undefined && { id: body.id }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isDefault !== undefined && { isDefault: body.isDefault }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
      },
    })

    // Activity log with diff
    const changes: Record<string, { from: unknown; to: unknown }> = {}
    if (body.name !== undefined && body.name !== existing.name) changes['Tên'] = { from: existing.name, to: body.name }
    if (body.description !== undefined && body.description !== existing.description) changes['Mô tả'] = { from: existing.description ?? '', to: body.description ?? '' }
    if (body.id !== undefined && body.id !== existing.id) changes['Mã'] = { from: existing.id, to: body.id }
    if (body.isDefault !== undefined && body.isDefault !== existing.isDefault) changes['Mặc định'] = { from: existing.isDefault ? 'Có' : 'Không', to: body.isDefault ? 'Có' : 'Không' }

    if (Object.keys(changes).length > 0) {
      const changeDetail = Object.keys(changes).join(', ')
      createActivityLog({
        entityType: 'employee_type',
        entityId: systemId,
        action: `Cập nhật loại nhân viên: ${existing.name}: ${changeDetail}`,
        actionType: 'update',
        changes,
        createdBy: session.user?.id,
      }).catch(e => logError('activity log failed', e))
    }

    return apiSuccess(employeeType)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại nhân viên')
    }
    logError('Error updating employee type', error)
    return apiError('Failed to update employee type', 500)
  }
}

// DELETE /api/employee-types/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    createActivityLog({
      entityType: 'employee_type',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess({ message: 'Đã xóa loại nhân viên' })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Loại nhân viên')
    }
    logError('Error deleting employee type', error)
    return apiError('Failed to delete employee type', 500)
  }
}
