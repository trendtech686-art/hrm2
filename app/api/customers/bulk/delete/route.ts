import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'

const MAX_BULK_SIZE = 100

/**
 * POST /api/customers/bulk/delete
 * 
 * Bulk soft-delete multiple customers.
 * Body: { systemIds: string[] }
 */
export const POST = apiHandler(async (request, { session }) => {
    const body = await request.json()
    const { systemIds } = body

    if (!Array.isArray(systemIds) || systemIds.length === 0) {
      return apiError('systemIds phải là mảng không rỗng', 400)
    }

    if (systemIds.length > MAX_BULK_SIZE) {
      return apiError(`Tối đa ${MAX_BULK_SIZE} mục mỗi lần thao tác`, 400)
    }

    if (!systemIds.every((id: unknown) => typeof id === 'string' && id.length > 0)) {
      return apiError('Tất cả systemIds phải là chuỗi không rỗng', 400)
    }

    // Lấy tên khách hàng trước khi xóa (cho activity log)
    const customers = await prisma.customer.findMany({
      where: { systemId: { in: systemIds }, isDeleted: false },
      select: { systemId: true, name: true, id: true },
    })

    const result = await prisma.customer.updateMany({
      where: {
        systemId: { in: systemIds },
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Fire-and-forget activity log
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemIds[0],
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa hàng loạt ${result.count} khách hàng: ${customers.map(c => c.name).join(', ')}`,
          changes: { affectedIds: systemIds, affectedCount: result.count },
          metadata: { userName, bulkOperation: true },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    return apiSuccess({ affected: result.count })
}, { permission: 'delete_customers' })
