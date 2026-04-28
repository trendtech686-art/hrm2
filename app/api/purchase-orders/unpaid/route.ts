import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Query params validation schema
const unpaidQuerySchema = z.object({
  supplierSystemId: z.string().min(1, 'supplierSystemId is required'),
})

/**
 * GET /api/purchase-orders/unpaid?supplierSystemId=xxx
 * Fetch unpaid/partially paid purchase orders for a supplier (for payment allocation)
 */
export const GET = apiHandler(async (request) => {
  const { searchParams } = new URL(request.url)
  const validation = unpaidQuerySchema.safeParse(Object.fromEntries(searchParams.entries()))

  if (!validation.success) {
    return apiError(validation.error.issues[0]?.message || 'supplierSystemId is required', 400)
  }
  const { supplierSystemId } = validation.data

  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: {
        supplierId: supplierSystemId,
        paymentStatus: { in: ['Chưa thanh toán', 'Thanh toán một phần'] },
        status: { notIn: ['CANCELLED'] },
        isDeleted: false,
      },
      select: {
        systemId: true,
        id: true,
        orderDate: true,
        grandTotal: true,
        paid: true,
        debt: true,
        paymentStatus: true,
        supplierName: true,
      },
      orderBy: { orderDate: 'asc' },
    })

    const serialized = purchaseOrders.map(po => ({
      systemId: po.systemId,
      id: po.id,
      orderDate: po.orderDate.toISOString(),
      grandTotal: Number(po.grandTotal),
      paidAmount: Number(po.paid),
      remainingAmount: Number(po.grandTotal) - Number(po.paid),
      paymentStatus: po.paymentStatus,
      supplierName: po.supplierName,
    }))

    return apiSuccess(serialized)
  } catch (error) {
    logError('Failed to fetch unpaid purchase orders', error)
    return apiError('Không thể tải danh sách đơn mua hàng chưa thanh toán', 500)
  }
}, { auth: true, permission: 'view_purchase_orders' })
