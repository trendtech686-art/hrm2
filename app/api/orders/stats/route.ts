import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { ORDER_STATUS_LABELS } from '@/lib/constants/order-enums'
import { OrderStatus, DeliveryStatus, PaymentStatus } from '@/generated/prisma/client'
import { Prisma } from '@/generated/prisma/client'
import { logError } from '@/lib/logger'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

// GET /api/orders/stats - Get order statistics
export async function GET(_request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    // Active orders (not cancelled, not completed)
    const activeWhere = {
      status: { notIn: [OrderStatus.CANCELLED, OrderStatus.COMPLETED] },
    } satisfies Prisma.OrderWhereInput

    // Fetch all statistics in parallel for performance
    const [
      statusCounts,
      // 9 workflow cards - count + amount
      pendingApproval,
      pendingPayment,
      pendingPack,
      pendingPickup,
      shipping,
      packed,
      rescheduled,
      pendingReturn,
      pendingCod,
    ] = await Promise.all([
      // Count by main status
      prisma.order.groupBy({
        by: ['status'],
        _count: { _all: true },
      }),

      // 1. Chờ duyệt: PENDING
      prisma.order.aggregate({
        where: { status: OrderStatus.PENDING },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 2. Chờ thanh toán: active + UNPAID
      prisma.order.aggregate({
        where: { ...activeWhere, paymentStatus: PaymentStatus.UNPAID },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 3. Chờ đóng gói: active + PENDING_PACK + not PENDING
      prisma.order.aggregate({
        where: {
          ...activeWhere,
          status: { notIn: [OrderStatus.CANCELLED, OrderStatus.COMPLETED, OrderStatus.PENDING] },
          deliveryStatus: DeliveryStatus.PENDING_PACK,
        },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 4. Chờ lấy hàng: PENDING_SHIP
      prisma.order.aggregate({
        where: { ...activeWhere, deliveryStatus: DeliveryStatus.PENDING_SHIP },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 5. Đang giao hàng: SHIPPING
      prisma.order.aggregate({
        where: { ...activeWhere, deliveryStatus: DeliveryStatus.SHIPPING },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 6. Đã đóng gói: PACKED
      prisma.order.aggregate({
        where: { ...activeWhere, deliveryStatus: DeliveryStatus.PACKED },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 7. Chờ giao lại: RESCHEDULED
      prisma.order.aggregate({
        where: { ...activeWhere, deliveryStatus: DeliveryStatus.RESCHEDULED },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 8. Chờ nhận hàng hoàn: returnStatus partial/full + not completed
      prisma.order.aggregate({
        where: {
          ...activeWhere,
          returnStatus: { in: ['PARTIAL_RETURN', 'FULL_RETURN'] },
        },
        _count: { _all: true },
        _sum: { grandTotal: true },
      }),

      // 9. Chờ thu hộ COD: delivered + codAmount > 0 + not fully paid
      prisma.order.aggregate({
        where: {
          deliveryStatus: DeliveryStatus.DELIVERED,
          codAmount: { gt: 0 },
          paymentStatus: { not: PaymentStatus.PAID },
        },
        _count: { _all: true },
        _sum: { codAmount: true },
      }),
    ])

    // Convert status counts to a map with Vietnamese labels
    const countByStatus: Record<string, number> = {}
    for (const item of statusCounts) {
      const label = ORDER_STATUS_LABELS[item.status] || item.status
      countByStatus[label] = (countByStatus[label] || 0) + item._count._all
    }

    return apiSuccess({
      countByStatus,
      // 9 workflow cards
      workflowCards: {
        pendingApproval:  { count: pendingApproval._count._all,  amount: pendingApproval._sum.grandTotal?.toNumber() ?? 0 },
        pendingPayment:   { count: pendingPayment._count._all,   amount: pendingPayment._sum.grandTotal?.toNumber() ?? 0 },
        pendingPack:      { count: pendingPack._count._all,      amount: pendingPack._sum.grandTotal?.toNumber() ?? 0 },
        pendingPickup:    { count: pendingPickup._count._all,    amount: pendingPickup._sum.grandTotal?.toNumber() ?? 0 },
        shipping:         { count: shipping._count._all,         amount: shipping._sum.grandTotal?.toNumber() ?? 0 },
        packed:           { count: packed._count._all,           amount: packed._sum.grandTotal?.toNumber() ?? 0 },
        rescheduled:      { count: rescheduled._count._all,      amount: rescheduled._sum.grandTotal?.toNumber() ?? 0 },
        pendingReturn:    { count: pendingReturn._count._all,    amount: pendingReturn._sum.grandTotal?.toNumber() ?? 0 },
        pendingCod:       { count: pendingCod._count._all,       amount: pendingCod._sum.codAmount?.toNumber() ?? 0 },
      },
    })
  } catch (error) {
    logError('Failed to fetch order stats', error)
    return apiError('Failed to fetch order stats', 500)
  }
}
