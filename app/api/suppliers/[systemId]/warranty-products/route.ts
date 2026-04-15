import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, parsePagination, apiPaginated, serializeDecimals } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

/**
 * GET /api/suppliers/[systemId]/warranty-products
 * 
 * Returns paginated list of warranty line items for this supplier.
 * Each row is one warranty item with warranty info, product info, quantity and cost.
 */
export const GET = apiHandler(async (
  request,
  { params }
) => {
  const { systemId } = params
  const { searchParams } = new URL(request.url)
  const { page, limit, skip } = parsePagination(searchParams)
  const search = searchParams.get('search')?.toLowerCase() || ''

  // Verify supplier exists
  const supplier = await prisma.supplier.findUnique({
    where: { systemId },
    select: { systemId: true },
  })

  if (!supplier) {
    return apiError('Nhà cung cấp không tồn tại', 404)
  }

  // Build where condition
  const where = {
    warranty: {
      supplierSystemId: systemId,
      isDeleted: false,
    },
    ...(search ? {
      OR: [
        { productId: { contains: search, mode: 'insensitive' as const } },
        { productName: { contains: search, mode: 'insensitive' as const } },
        { warranty: { id: { contains: search, mode: 'insensitive' as const } } },
      ],
    } : {}),
  }

  const [items, total] = await Promise.all([
    prisma.supplierWarrantyItem.findMany({
      where,
      include: {
        warranty: {
          select: {
            systemId: true,
            id: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { warranty: { createdAt: 'desc' } },
      skip,
      take: limit,
    }),
    prisma.supplierWarrantyItem.count({ where }),
  ])

  const data = items.map(item => ({
    id: item.systemId,
    systemId: item.systemId,
    warrantyId: item.warranty.systemId,
    warrantyBusinessId: item.warranty.id,
    warrantyDate: item.warranty.createdAt.toISOString(),
    warrantyStatus: item.warranty.status,
    productId: item.productId,
    productSku: item.productId,
    productName: item.productName,
    productImage: item.productImage,
    sentQuantity: item.sentQuantity,
    returnedQuantity: item.returnedQuantity,
    unitPrice: item.unitPrice,
    warrantyCost: item.warrantyCost,
    warrantyResult: item.warrantyResult,
  }))

  return apiPaginated(serializeDecimals(data), { total, page, limit })
}, { permission: 'view_supplier_warranty' })
