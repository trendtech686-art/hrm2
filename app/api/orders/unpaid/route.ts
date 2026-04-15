import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

/**
 * GET /api/orders/unpaid?customerSystemId=xxx
 * Fetch unpaid/partially paid orders for a customer (for receipt allocation)
 */
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const customerSystemId = searchParams.get('customerSystemId')

  if (!customerSystemId) {
    return apiError('customerSystemId is required', 400)
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        customerId: customerSystemId,
        paymentStatus: { in: ['UNPAID', 'PARTIAL'] },
        status: { notIn: ['CANCELLED'] },
      },
      select: {
        systemId: true,
        id: true,
        orderDate: true,
        grandTotal: true,
        paidAmount: true,
        paymentStatus: true,
        customerName: true,
      },
      orderBy: { orderDate: 'asc' },
    })

    const serialized = orders.map(o => ({
      systemId: o.systemId,
      id: o.id,
      orderDate: o.orderDate.toISOString(),
      grandTotal: Number(o.grandTotal),
      paidAmount: Number(o.paidAmount),
      remainingAmount: Number(o.grandTotal) - Number(o.paidAmount),
      paymentStatus: o.paymentStatus,
      customerName: o.customerName,
    }))

    return apiSuccess(serialized)
  } catch (error) {
    console.error('[GET /api/orders/unpaid] Error:', error)
    return apiError('Failed to fetch unpaid orders', 500)
  }
}
