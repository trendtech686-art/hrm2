import { prisma } from '@/lib/prisma'
import { CustomerStatus } from '@/generated/prisma/client'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'

const MAX_BULK_SIZE = 100
const VALID_STATUSES = Object.values(CustomerStatus)

/**
 * POST /api/customers/bulk/status
 * 
 * Bulk update customer status.
 * Body: { systemIds: string[], status: CustomerStatus }
 */
export const POST = apiHandler(async (request, { session }) => {
    const body = await request.json()
    const { systemIds, status } = body

    if (!Array.isArray(systemIds) || systemIds.length === 0) {
      return apiError('systemIds phải là mảng không rỗng', 400)
    }

    if (systemIds.length > MAX_BULK_SIZE) {
      return apiError(`Tối đa ${MAX_BULK_SIZE} mục mỗi lần thao tác`, 400)
    }

    if (!systemIds.every((id: unknown) => typeof id === 'string' && id.length > 0)) {
      return apiError('Tất cả systemIds phải là chuỗi không rỗng', 400)
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return apiError(`Trạng thái không hợp lệ. Chấp nhận: ${VALID_STATUSES.join(', ')}`, 400)
    }

    // Lấy tên khách hàng + trạng thái cũ (cho activity log)
    const customers = await prisma.customer.findMany({
      where: { systemId: { in: systemIds }, isDeleted: false },
      select: { systemId: true, name: true, status: true },
    })

    const result = await prisma.customer.updateMany({
      where: {
        systemId: { in: systemIds },
        isDeleted: false,
      },
      data: { status },
    })

    const statusLabel = status === 'ACTIVE' ? 'Đang giao dịch' : 'Ngừng giao dịch'

    // Fire-and-forget activity log
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemIds[0],
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật trạng thái hàng loạt ${result.count} khách hàng → ${statusLabel}: ${customers.map(c => c.name).join(', ')}`,
          changes: { affectedIds: systemIds, affectedCount: result.count, status },
          metadata: { userName, bulkOperation: true },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    return apiSuccess({ affected: result.count })
}, { permission: 'edit_customers' })
