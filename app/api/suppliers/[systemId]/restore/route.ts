import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

// POST /api/suppliers/[systemId]/restore - Restore soft-deleted supplier
export const POST = apiHandler(async (_request, { session, params }) => {
  const { systemId } = params

  const existing = await prisma.supplier.findUnique({
    where: { systemId },
  })

  if (!existing) {
    return apiNotFound('Supplier')
  }

  if (!existing.isDeleted) {
    return apiError('Nhà cung cấp chưa bị xóa, không cần khôi phục', 400)
  }

  if (existing.permanentlyDeletedAt) {
    return apiError('Nhà cung cấp đã được lưu trữ vĩnh viễn, không thể khôi phục', 400)
  }

  const restored = await prisma.supplier.update({
    where: { systemId },
    data: {
      isDeleted: false,
      deletedAt: null,
    },
  })

  // Activity log (fire-and-forget)
  getUserNameFromDb(session!.user?.id).then(userName =>
    prisma.activityLog.create({
      data: {
        entityType: 'supplier',
        entityId: systemId,
        action: 'restored',
        actionType: 'update',
        note: `Khôi phục nhà cung cấp: ${existing.name} (${existing.id})`,
        createdBy: userName,
      },
    })
  ).catch(e => logError('[ActivityLog] supplier restored failed', e))

  return apiSuccess(restored)
})
