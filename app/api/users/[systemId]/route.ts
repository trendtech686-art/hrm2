import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import bcrypt from 'bcryptjs'
import { updateUserSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { getPasswordRules, validatePassword } from '@/lib/password-rules'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/users/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const user = await prisma.user.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        email: true,
        role: true,
        isActive: true,
        lastLogin: true,
        createdAt: true,
        updatedAt: true,
        employee: {
          include: {
            department: true,
            branch: true,
            jobTitle: true,
          },
        },
      },
    })

    if (!user) {
      return apiError('User không tồn tại', 404)
    }

    return apiSuccess(user)
  } catch (error) {
    logError('Error fetching user', error)
    return apiError('Failed to fetch user', 500)
  }
}

// PUT /api/users/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateUserSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const updateData: Parameters<typeof prisma.user.update>[0]['data'] = {
      email: body.email,
      role: body.role,
      isActive: body.isActive,
      employeeId: body.employeeId,
    }

    // If password is provided, validate and hash it
    if (body.password) {
      const rules = await getPasswordRules()
      const validationError = validatePassword(body.password, rules)
      if (validationError) return apiError(validationError, 400)
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    const user = await prisma.user.update({
      where: { systemId },
      data: updateData,
      select: {
        systemId: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
        employee: true,
        employeeId: true,
      },
    })

    // Sync user → employee khi thay đổi email hoặc isActive
    if (user.employeeId) {
      const empSyncData: Record<string, unknown> = {}
      if (body.email) empSyncData.workEmail = body.email
      if (body.isActive === false) empSyncData.employmentStatus = 'TERMINATED'
      if (body.isActive === true) empSyncData.employmentStatus = 'ACTIVE'
      if (Object.keys(empSyncData).length > 0) {
        await prisma.employee.update({
          where: { systemId: user.employeeId },
          data: empSyncData,
        }).catch(e => logError('Sync user→employee failed', e))
      }
    }

    createActivityLog({
      entityType: 'user',
      entityId: systemId,
      action: 'updated',
      actionType: 'update',
      metadata: { email: user.email, role: user.role },
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess(user)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('User không tồn tại', 404)
    }
    logError('Error updating user', error)
    return apiError('Failed to update user', 500)
  }
}

// DELETE /api/users/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Lấy user trước khi xóa để sync employee
    const user = await prisma.user.findUnique({
      where: { systemId },
      select: { employeeId: true },
    })

    await prisma.user.delete({
      where: { systemId },
    })

    // Sync: deactivate linked employee
    if (user?.employeeId) {
      await prisma.employee.update({
        where: { systemId: user.employeeId },
        data: { employmentStatus: 'TERMINATED' },
      }).catch(e => logError('Sync user delete→employee failed', e))
    }

    createActivityLog({
      entityType: 'user',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('User không tồn tại', 404)
    }
    logError('Error deleting user', error)
    return apiError('Failed to delete user', 500)
  }
}
