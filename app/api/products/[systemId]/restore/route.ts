import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// POST /api/products/[systemId]/restore - Restore soft-deleted product
export const POST = apiHandler(async (
  _request, { params }
) => {
    const { systemId } = await params

    const existing = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Sản phẩm')
    }

    if (!existing.isDeleted) {
      return apiError('Sản phẩm chưa bị xóa, không cần khôi phục', 400)
    }

    if (existing.permanentlyDeletedAt) {
      return apiError('Sản phẩm đã được lưu trữ vĩnh viễn, không thể khôi phục', 400)
    }

    const restored = await prisma.product.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    return apiSuccess(restored)
})
