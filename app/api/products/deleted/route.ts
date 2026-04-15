import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'

// GET /api/products/deleted - Get all soft-deleted products (excluding permanently archived)
export const GET = apiHandler(async () => {
    const deletedProducts = await prisma.product.findMany({
      where: {
        isDeleted: true,
        permanentlyDeletedAt: null,
      },
      orderBy: { deletedAt: 'desc' },
      select: {
        systemId: true,
        id: true,
        name: true,
        shortDescription: true,
        thumbnailImage: true,
        type: true,
        status: true,
        costPrice: true,
        totalInventory: true,
        isDeleted: true,
        deletedAt: true,
        categorySystemIds: true,
        brandId: true,
        brand: { select: { systemId: true, name: true } },
        productCategories: {
          select: {
            categoryId: true,
            category: { select: { systemId: true, name: true } },
          },
        },
      },
    })

    return apiSuccess(deletedProducts)
})
