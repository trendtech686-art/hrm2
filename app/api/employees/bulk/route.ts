import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { getUserNameFromDb } from '@/lib/get-user-name'

const MAX_BULK_SIZE = 100

/**
 * POST /api/employees/bulk
 * 
 * Bulk operations: soft-delete or restore multiple employees in a single transaction.
 * Body: { action: 'delete' | 'restore', systemIds: string[] }
 */
export const POST = apiHandler(async (request, { session }) => {
    const body = await request.json()
    const { action, systemIds } = body

    if (!action || !['delete', 'restore'].includes(action)) {
      return apiError('Invalid action. Must be "delete" or "restore"', 400)
    }

    if (!Array.isArray(systemIds) || systemIds.length === 0) {
      return apiError('systemIds must be a non-empty array', 400)
    }

    if (systemIds.length > MAX_BULK_SIZE) {
      return apiError(`Maximum ${MAX_BULK_SIZE} items per bulk operation`, 400)
    }

    // Validate all IDs are strings
    if (!systemIds.every((id: unknown) => typeof id === 'string' && id.length > 0)) {
      return apiError('All systemIds must be non-empty strings', 400)
    }

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
      }).catch(e => console.error('Activity log failed:', e))

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
    }).catch(e => console.error('Activity log failed:', e))

    return apiSuccess({ affected: result.count })
}, { permission: 'delete_employees' })
