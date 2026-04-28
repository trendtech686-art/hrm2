import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, parsePagination, apiPaginated } from '@/lib/api-utils'
import { buildSearchWhere } from '@/lib/search/build-search-where'

export const dynamic = 'force-dynamic'

interface POLineItem {
  id: string;           // Unique row id
  systemId: string;     // System ID for RelatedDataTable compatibility (same as id)
  orderId: string;      // PO business ID
  orderDate: string | null;
  productId: string;
  productSku: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

/**
 * GET /api/suppliers/[systemId]/products-ordered
 * 
 * Returns paginated list of individual PO line items from this supplier.
 * Each row is one PO item with order info, product info, quantity and price.
 */
export const GET = apiHandler(async (
  request,
  { params }
) => {
  const { systemId } = params
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''

    // Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { systemId },
      select: { systemId: true },
    })

    if (!supplier) {
      return apiError('Nhà cung cấp không tồn tại', 404)
    }

    const searchCondition = buildSearchWhere(search, [
      'product.id',
      'product.name',
      'productSku',
      'productName',
      'purchaseOrder.id',
    ]) ?? {}

    // Count total items
    const total = await prisma.purchaseOrderItem.count({
      where: {
        purchaseOrder: {
          supplierSystemId: systemId,
          isDeleted: false,
          status: { notIn: ['CANCELLED'] },
        },
        ...searchCondition,
      },
    })

    // Get paginated PO items for this supplier
    const poItems = await prisma.purchaseOrderItem.findMany({
      where: {
        purchaseOrder: {
          supplierSystemId: systemId,
          isDeleted: false,
          status: { notIn: ['CANCELLED'] },
        },
        ...searchCondition,
      },
      select: {
        purchaseOrder: {
          select: {
            id: true,
            orderDate: true,
          },
        },
        product: {
          select: {
            systemId: true,
            id: true,
            name: true,
            thumbnailImage: true,
          },
        },
      },
      orderBy: [
        { purchaseOrder: { orderDate: 'desc' } },
      ],
      skip,
      take: limit,
    })

    // Transform to response format
    const items: POLineItem[] = poItems.map((item, index) => {
      const rowId = item.systemId || `${skip + index}`;
      return {
        id: rowId,
        systemId: rowId,
        orderId: item.purchaseOrder?.id || '',
        orderDate: item.purchaseOrder?.orderDate?.toISOString() ?? null,
        productId: item.product?.systemId || item.productId || '',
        productSku: item.product?.id || item.productSku || '',
        productName: item.product?.name || item.productName || '',
        productImage: item.product?.thumbnailImage || null,
        quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unitPrice ?? 0),
        total: Number(item.total ?? 0),
      };
    })

    return apiPaginated(items, { total, page, limit })
})
