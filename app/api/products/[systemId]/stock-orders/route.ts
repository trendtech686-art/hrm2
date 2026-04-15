/**
 * Stock Orders API - Server-side filtered with pagination
 * 
 * Returns stock order items (committed, in-transit, in-delivery) for a product at a specific branch.
 * All filtering is done server-side instead of fetching all orders and filtering client-side.
 * 
 * Query params:
 *   - type: 'committed' | 'in-transit' | 'in-delivery'
 *   - branchSystemId: string
 *   - page: number (default: 1)
 *   - limit: number (default: 10)
 */

import { prisma } from '@/lib/prisma'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, parsePagination } from '@/lib/api-utils'
import { serializeDecimals } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export const GET = apiHandler(async (request, { params }) => {
    const { systemId: productSystemId } = await params
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'committed' | 'in-transit' | 'in-delivery' | null
    const branchSystemId = searchParams.get('branchSystemId')
    const { page, limit, skip } = parsePagination(searchParams)

    if (!type || !['committed', 'in-transit', 'in-delivery'].includes(type)) {
      return apiError('Loại không hợp lệ. Phải là: committed, in-transit, in-delivery', 400)
    }
    if (!branchSystemId) {
      return apiError('branchSystemId là bắt buộc', 400)
    }

    // Get product SKU for warranty matching
    const product = await prisma.product.findUnique({
      where: { systemId: productSystemId },
      select: { id: true },
    })
    if (!product) return apiError('Sản phẩm không tồn tại', 404)

    if (type === 'in-transit') {
      return handleInTransit(productSystemId, branchSystemId, page, limit, skip)
    }

    return handleOrderBased(type, productSystemId, branchSystemId, product.id, page, limit, skip)
})

interface StockOrderItem {
  id: string;
  systemId: string;
  type: string;
  date: Date | string | null | undefined;
  dispatchDate?: Date | string | null;
  customerName: string;
  quantity: number;
  status: string;
  statusVariant: string;
  shippingCarrier?: string | null;
  trackingCode?: string | null;
}

async function handleOrderBased(
  type: 'committed' | 'in-delivery',
  productSystemId: string,
  branchSystemId: string,
  productSku: string,
  page: number,
  limit: number,
  skip: number,
) {
  // Build the where clause with all filters server-side
  const cancelledStatuses = ['CANCELLED'] as const
  const completedStatuses = ['COMPLETED', 'DELIVERED'] as const

  const orderWhere: Record<string, unknown> = {
    branchId: branchSystemId,
    lineItems: { some: { productId: productSystemId } },
    status: { notIn: [...cancelledStatuses] },
  }

  if (type === 'committed') {
    // Committed: not cancelled, not completed/delivered, not fully stocked out
    orderWhere.status = { notIn: [...cancelledStatuses, ...completedStatuses] }
    orderWhere.stockOutStatus = { not: 'FULLY_STOCKED_OUT' }
  } else {
    // In-delivery: fully stocked out but not yet completed/delivered/cancelled
    orderWhere.stockOutStatus = 'FULLY_STOCKED_OUT'
    orderWhere.status = { notIn: [...cancelledStatuses, ...completedStatuses] }
  }

  // Fetch matching orders
  const orders = await prisma.order.findMany({
      where: orderWhere,
      orderBy: { orderDate: 'desc' },
      select: {
        systemId: true,
        id: true,
        orderDate: true,
        customerName: true,
        status: true,
        stockOutStatus: true,
        dispatchedDate: true,
        shippingCarrier: true,
        trackingCode: true,
        lineItems: {
          where: { productId: productSystemId },
          select: { quantity: true },
        },
      },
    })

  const items: StockOrderItem[] = orders.map(order => {
    const quantity = order.lineItems.reduce((sum, li) => sum + Number(li.quantity), 0)
    let status: string
    let statusVariant: string

    if (type === 'committed') {
      if (order.stockOutStatus === 'NOT_STOCKED_OUT' || !order.stockOutStatus) {
        status = 'Chờ xuất kho'
      } else {
        status = 'Đã xuất một phần'
      }
      statusVariant = 'warning'
    } else {
      // in-delivery
      if (order.status === 'SHIPPING') {
        status = 'Đang giao'
      } else {
        status = 'Đang vận chuyển'
      }
      statusVariant = 'secondary'
    }

    return {
      id: order.id,
      systemId: order.systemId,
      type: 'order' as const,
      date: order.orderDate,
      dispatchDate: type === 'in-delivery' ? order.dispatchedDate : undefined,
      customerName: order.customerName,
      quantity,
      status,
      statusVariant,
      shippingCarrier: type === 'in-delivery' ? order.shippingCarrier : undefined,
      trackingCode: type === 'in-delivery' ? order.trackingCode : undefined,
    }
  })

  // For committed type, also fetch warranty REPLACEMENT items (resolution='replace')
  // Only 'replace' needs stock out - 'out_of_stock', 'refund', 'return' don't need shipping
  if (type === 'committed') {
    const warranties = await prisma.warranty.findMany({
      where: {
        branchSystemId,
        status: { notIn: ['COMPLETED', 'RETURNED', 'CANCELLED'] },
        stockDeducted: false,
      },
      select: {
        systemId: true,
        id: true,
        createdAt: true,
        customerName: true,
        status: true,
        products: true,
      },
    })

    for (const warranty of warranties) {
      const products = warranty.products as Array<{ 
        sku?: string; 
        productSystemId?: string;
        resolution?: string; 
        quantity?: number 
      }> | null
      if (!products || !Array.isArray(products)) continue

      // Only include items with resolution='replace' (đổi mới) - these need stock out
      const replacementItem = products.find(
        (item) => (item.sku === productSku || item.productSystemId === productSystemId) && item.resolution === 'replace'
      )
      if (!replacementItem) continue

      items.push({
        id: warranty.id,
        systemId: warranty.systemId,
        type: 'warranty' as const,
        date: warranty.createdAt,
        dispatchDate: undefined,
        customerName: warranty.customerName,
        quantity: replacementItem.quantity || 1,
        status: warranty.status === 'PROCESSING' ? 'Đang xử lý (Đổi mới)' : warranty.status === 'RECEIVED' ? 'Đã tiếp nhận (Đổi mới)' : 'Chờ linh kiện (Đổi mới)',
        statusVariant: 'warning',
        shippingCarrier: undefined,
        trackingCode: undefined,
      })
    }
  }

  // Sort by date descending
  items.sort((a, b) => {
    const dateA = new Date(a.dispatchDate || a.date || 0).getTime()
    const dateB = new Date(b.dispatchDate || b.date || 0).getTime()
    return dateB - dateA
  })

  // Calculate quantities from actual matched items (not from ProductInventory cache which can be stale)
  const orderQuantity = items
    .filter(item => item.type === 'order')
    .reduce((sum, item) => sum + item.quantity, 0)
  
  const warrantyQuantity = items
    .filter(item => item.type === 'warranty')
    .reduce((sum, item) => sum + item.quantity, 0)
  const totalQuantity = orderQuantity + warrantyQuantity
  const totalItems = items.length
  
  // Apply pagination
  const paginatedItems = items.slice(skip, skip + limit)

  return apiSuccess(serializeDecimals({ 
    items: paginatedItems, 
    totalQuantity,
    orderQuantity,
    warrantyQuantity,
    pagination: {
      page,
      limit,
      total: totalItems,
      totalPages: Math.ceil(totalItems / limit),
    }
  }))
}

async function handleInTransit(productSystemId: string, branchSystemId: string, page: number, limit: number, skip: number) {
  const transferWhere = {
    toBranchSystemId: branchSystemId,
    status: 'IN_TRANSIT' as const,
    items: { some: { productId: productSystemId } },
  }

  const [transfers, total] = await Promise.all([
    prisma.stockTransfer.findMany({
      where: transferWhere,
      orderBy: { transferDate: 'desc' },
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        transferDate: true,
        fromBranchName: true,
        toBranchName: true,
        items: {
          where: { productId: productSystemId },
          select: { quantity: true },
        },
      },
    }),
    prisma.stockTransfer.count({ where: transferWhere }),
  ])

  const items: StockOrderItem[] = transfers.map(transfer => ({
    id: transfer.id,
    systemId: transfer.systemId,
    type: 'transfer' as const,
    date: transfer.transferDate,
    dispatchDate: undefined,
    customerName: `${transfer.fromBranchName || '?'} → ${transfer.toBranchName || '?'}`,
    quantity: transfer.items.reduce((sum, i) => sum + i.quantity, 0),
    status: 'Đang chuyển',
    statusVariant: 'secondary',
    shippingCarrier: undefined,
    trackingCode: undefined,
  }))

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  return apiSuccess(serializeDecimals({ 
    items, 
    totalQuantity,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    }
  }))
}
