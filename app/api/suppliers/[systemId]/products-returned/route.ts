import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiError, parsePagination, apiPaginated } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

interface ReturnLineItem {
  id: string;           // Unique row id
  systemId: string;     // System ID for RelatedDataTable compatibility (same as id)
  returnId: string;     // Return business ID
  returnDate: string | null;
  productId: string;
  productSku: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
  reason: string | null;
}

/**
 * GET /api/suppliers/[systemId]/products-returned
 * 
 * Returns paginated list of individual return line items for this supplier.
 * Each row is one return item with return info, product info, quantity and price.
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

    // Get all PO systemIds for this supplier (to find returns via PO link)
    const supplierPOs = await prisma.purchaseOrder.findMany({
      where: { 
        OR: [
          { supplierSystemId: systemId },
          { supplierId: systemId },
        ],
        isDeleted: false,
      },
      select: { systemId: true },
    })
    const poSystemIds = supplierPOs.map(po => po.systemId)

    // First, get all purchase return systemIds for this supplier
    const supplierReturns = await prisma.purchaseReturn.findMany({
      where: {
        OR: [
          { supplierSystemId: systemId },
          { supplierId: systemId },
          { suppliers: { systemId: systemId } },
          ...(poSystemIds.length > 0 ? [{ purchaseOrderSystemId: { in: poSystemIds } }] : []),
        ],
        status: { not: 'CANCELLED' }, // Include DRAFT returns
      },
      select: { 
        systemId: true, 
        id: true, 
        returnDate: true, 
        reason: true 
      },
    })
    
    const returnSystemIds = supplierReturns.map(r => r.systemId)
    const returnInfoMap = new Map(supplierReturns.map(r => [r.systemId, r]))
    
    if (returnSystemIds.length === 0) {
      return apiPaginated([], { total: 0, page, limit })
    }

    // Get all unique productIds from return items to lookup product info
    const returnItemsForProducts = await prisma.purchaseReturnItem.findMany({
      where: { returnId: { in: returnSystemIds } },
      select: { productId: true },
      distinct: ['productId'],
    })
    const productIds = returnItemsForProducts.map(i => i.productId).filter(Boolean) as string[]

    // Get product info map
    const products = productIds.length > 0 ? await prisma.product.findMany({
      where: { systemId: { in: productIds } },
      select: { systemId: true, id: true, name: true, thumbnailImage: true },
    }) : []
    const productInfoMap = new Map(products.map(p => [p.systemId, p]))

    // Build search filter
    const searchProductIds = search 
      ? products.filter(p => p.id.toLowerCase().includes(search) || p.name.toLowerCase().includes(search)).map(p => p.systemId)
      : []
    const searchReturnIds = search
      ? supplierReturns.filter(r => r.id.toLowerCase().includes(search)).map(r => r.systemId)
      : []

    // Build where condition
    const itemWhere = search && (searchProductIds.length > 0 || searchReturnIds.length > 0) 
      ? {
          returnId: { in: returnSystemIds },
          OR: [
            ...(searchProductIds.length > 0 ? [{ productId: { in: searchProductIds } }] : []),
            ...(searchReturnIds.length > 0 ? [{ returnId: { in: searchReturnIds } }] : []),
          ],
        }
      : { returnId: { in: returnSystemIds } }

    // Count total items  
    const total = await prisma.purchaseReturnItem.count({ where: itemWhere })

    // Get paginated return items
    const items = await prisma.purchaseReturnItem.findMany({
      where: itemWhere,
      orderBy: { systemId: 'desc' },
      skip,
      take: limit,
    })

    // Transform to response format, using the pre-fetched return and product info
    const result: ReturnLineItem[] = items.map((item, index) => {
      const product = item.productId ? productInfoMap.get(item.productId) : null
      const returnInfo = returnInfoMap.get(item.returnId)
      const rowId = item.systemId || `${skip + index}`;
      return {
        id: rowId,
        systemId: rowId,
        returnId: returnInfo?.id || '',
        returnDate: returnInfo?.returnDate?.toISOString() ?? null,
        productId: item.productId || '',
        productSku: product?.id || item.productId || '',
        productName: product?.name || '',
        productImage: product?.thumbnailImage || null,
        quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unitPrice ?? 0),
        total: Number(item.total ?? 0),
        reason: item.reason || returnInfo?.reason || null,
      }
    })

    // Sort by returnDate desc
    result.sort((a, b) => {
      if (!a.returnDate && !b.returnDate) return 0
      if (!a.returnDate) return 1
      if (!b.returnDate) return -1
      return b.returnDate.localeCompare(a.returnDate)
    })

    return apiPaginated(result, { total, page, limit })
})
