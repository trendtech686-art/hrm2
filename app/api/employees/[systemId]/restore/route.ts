import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

// POST /api/employees/[systemId]/restore - Restore deleted employee
export const POST = apiHandler(async (_request, { session, params }) => {
    const { systemId } = params

    // Check if employee exists and is deleted
    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Employee')
    }

    if (!existing.isDeleted) {
      return apiError('Nhân viên chưa bị xóa', 400)
    }

    if (existing.permanentlyDeletedAt) {
      return apiError('Nhân viên đã được lưu trữ vĩnh viễn, không thể khôi phục', 400)
    }

    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
      },
    })

    // Sync: reactivate linked user account
    await prisma.user.updateMany({
      where: { employeeId: systemId },
      data: { isActive: true },
    })

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'employee',
          entityId: systemId,
          action: 'restored',
          actionType: 'update',
          note: `Khôi phục nhân viên`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] employee restored failed', e))

    return apiSuccess(employee)
}, { permission: 'edit_employees' })
