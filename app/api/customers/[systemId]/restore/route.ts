import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'

// POST /api/customers/[systemId]/restore - Restore soft-deleted customer
export const POST = apiHandler(async (
  _request,
  { session, params }
) => {
    const { systemId } = await params

    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Customer')
    }

    if (!existing.isDeleted) {
      return apiError('Khách hàng không nằm trong thùng rác', 400)
    }

    if (existing.permanentlyDeletedAt) {
      return apiError('Khách hàng đã được lưu trữ vĩnh viễn, không thể khôi phục', 400)
    }

    const restored = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    // Fire-and-forget activity log
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'restored',
          actionType: 'update',
          note: `Khôi phục khách hàng: ${existing.name} (${existing.id})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    return apiSuccess(restored)
}, { permission: 'delete_customers' })
