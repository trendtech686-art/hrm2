import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiPaginated, parsePagination, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

// GET /api/products/deleted - Get all soft-deleted products (excluding permanently archived)
export const GET = apiHandler(async (req) => {
  try {
    const { searchParams } = new URL(req.url)
    const { page, limit, skip } = parsePagination(searchParams)

    const [deletedProducts, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          isDeleted: true,
          permanentlyDeletedAt: null,
        },
        skip,
        take: limit,
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
      }),
      prisma.product.count({
        where: {
          isDeleted: true,
          permanentlyDeletedAt: null,
        },
      }),
    ])

    return apiPaginated(deletedProducts, { page, limit, total })
  } catch (error) {
    logError('GET /api/products/deleted failed', error)
    return apiError('Failed to fetch deleted products', 500)
  }
})
