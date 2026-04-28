import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'
import { z } from 'zod'

const MAX_BULK_SIZE = 100

// Validation schema for bulk employee operations
const bulkEmployeeSchema = z.object({
  action: z.enum(['delete', 'restore']),
  systemIds: z.array(z.string().min(1)).min(1).max(MAX_BULK_SIZE),
})

/**
 * POST /api/employees/bulk
 * 
 * Bulk operations: soft-delete or restore multiple employees in a single transaction.
 * Body: { action: 'delete' | 'restore', systemIds: string[] }
 */
export const POST = apiHandler(async (request, { session }) => {
    // Validate request body with Zod schema
    const validation = await validateBody(request, bulkEmployeeSchema)
    if (!validation.success) {
      return apiError(validation.error, 400)
    }
    
    const { action, systemIds } = validation.data

    if (action === 'delete') {
      // Lấy tên nhân viên trước khi xóa
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: systemIds }, isDeleted: false },
        select: { systemId: true, fullName: true, id: true },
      })

      const result = await prisma.employee.updateMany({
        where: {
          systemId: { in: systemIds },
          isDeleted: false,
        },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      })

      // Sync: deactivate linked user accounts
      await prisma.user.updateMany({
        where: { employeeId: { in: systemIds } },
        data: { isActive: false },
      })

      // Log bulk delete
      const userName = await getUserNameFromDb(session!.user?.id)
      const names = employees.map(e => e.fullName).join(', ')
      prisma.activityLog.create({
        data: {
          entityType: 'employee',
          entityId: systemIds[0],
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa hàng loạt ${result.count} nhân viên: ${names}`,
          changes: { affectedIds: systemIds, affectedCount: result.count },
          metadata: { userName, bulkOperation: true },
          createdBy: userName,
        },
      }).catch(e => logError('Activity log failed', e))

      return apiSuccess({ affected: result.count })
    }

    // action === 'restore'
    // Lấy tên nhân viên trước khi khôi phục
    const employees = await prisma.employee.findMany({
      where: { systemId: { in: systemIds }, isDeleted: true, permanentlyDeletedAt: null },
      select: { systemId: true, fullName: true, id: true },
    })

    const result = await prisma.employee.updateMany({
      where: {
        systemId: { in: systemIds },
        isDeleted: true,
        permanentlyDeletedAt: null, // Cannot restore permanently archived
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    // Sync: reactivate linked user accounts
    await prisma.user.updateMany({
      where: { employeeId: { in: systemIds } },
      data: { isActive: true },
    })

    // Log bulk restore
    const userName = await getUserNameFromDb(session!.user?.id)
    const names = employees.map(e => e.fullName).join(', ')
    prisma.activityLog.create({
      data: {
        entityType: 'employee',
        entityId: systemIds[0],
        action: 'restored',
        actionType: 'update',
        note: `Khôi phục hàng loạt ${result.count} nhân viên: ${names}`,
        changes: { affectedIds: systemIds, affectedCount: result.count },
        metadata: { userName, bulkOperation: true },
        createdBy: userName,
      },
    }).catch(e => logError('Activity log failed', e))

    return apiSuccess({ affected: result.count })
}, { permission: 'delete_employees' })
