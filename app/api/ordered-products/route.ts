/**
 * Ordered Products API — Danh sách tất cả hàng đặt từ NCC
 *
 * GET /api/ordered-products
 *   ?page=1&limit=20
 *   &search=...          (tìm theo SKU, tên SP, mã đơn nhập, tên NCC)
 *   &supplierId=...      (lọc theo NCC)
 *   &dateFrom=...&dateTo=...  (lọc theo ngày đặt)
 *   &sortBy=orderDate&sortOrder=desc
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { parsePagination, apiPaginated } from '@/lib/api-utils'
import { buildSearchWhere } from '@/lib/search/build-search-where'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const { page, limit, skip } = parsePagination(searchParams)
  const search = searchParams.get('search')?.trim() || ''
  const supplierId = searchParams.get('supplierId') || ''
  const dateFrom = searchParams.get('dateFrom') || ''
  const dateTo = searchParams.get('dateTo') || ''
  const sortBy = searchParams.get('sortBy') || 'orderDate'
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
  const status = searchParams.get('status') || ''

  // Base where: only non-deleted, non-cancelled POs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    purchaseOrder: {
      isDeleted: false,
      ...(status
        ? { status }
        : { status: { notIn: ['CANCELLED'] } }),
    },
  }

  // Supplier filter
  if (supplierId) {
    where.purchaseOrder = {
      ...where.purchaseOrder,
      supplierSystemId: supplierId,
    }
  }

  // Date range filter (on PO orderDate)
  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {}
    if (dateFrom) dateFilter.gte = new Date(dateFrom)
    if (dateTo) dateFilter.lte = new Date(dateTo)
    where.purchaseOrder = {
      ...where.purchaseOrder,
      orderDate: dateFilter,
    }
  }

  const searchWhere = buildSearchWhere(search, [
    'productSku',
    'productName',
    'purchaseOrder.id',
    'purchaseOrder.supplierName',
  ])
  if (searchWhere) Object.assign(where, searchWhere)

  // Sort configuration
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderBy: any =
    sortBy === 'unitPrice'
      ? { unitPrice: sortOrder }
      : sortBy === 'total'
        ? { total: sortOrder }
        : sortBy === 'quantity'
          ? { quantity: sortOrder }
          : sortBy === 'supplierName'
            ? { purchaseOrder: { supplierName: sortOrder } }
            : sortBy === 'productName'
              ? { productName: sortOrder }
              : { purchaseOrder: { orderDate: sortOrder } }

  const [items, total] = await Promise.all([
    prisma.purchaseOrderItem.findMany({
      where,
      include: {
        purchaseOrder: {
          select: {
            id: true,
            systemId: true,
            orderDate: true,
            supplierSystemId: true,
            supplierName: true,
            status: true,
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
      orderBy,
      skip,
      take: limit,
    }),
    prisma.purchaseOrderItem.count({ where }),
  ])

  const data = items.map((item) => ({
    systemId: item.systemId,
    // PO info
    poId: item.purchaseOrder?.id || '',
    poSystemId: item.purchaseOrder?.systemId || '',
    poStatus: item.purchaseOrder?.status || '',
    orderDate: item.purchaseOrder?.orderDate?.toISOString() ?? null,
    // Supplier info
    supplierSystemId: item.purchaseOrder?.supplierSystemId || '',
    supplierName: item.purchaseOrder?.supplierName || '',
    // Product info
    productId: item.product?.systemId || item.productId || '',
    productSku: item.product?.id || item.productSku || '',
    productName: item.product?.name || item.productName || '',
    productImage: item.product?.thumbnailImage || null,
    // Numbers
    quantity: Number(item.quantity ?? 0),
    receivedQty: Number(item.receivedQty ?? 0),
    unitPrice: Number(item.unitPrice ?? 0),
    discount: Number(item.discount ?? 0),
    total: Number(item.total ?? 0),
  }))

  return apiPaginated(data, { total, page, limit })
}, { permission: 'view_purchase_orders' })
