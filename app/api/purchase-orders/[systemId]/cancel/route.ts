/**
 * Cancel Purchase Order API
 * POST /api/purchase-orders/[systemId]/cancel - Cancel a purchase order
 * 
 * Updates PO status to CANCELLED. Complex operations like purchase returns
 * and refunds should be handled by the client or separate APIs.
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'

const cancelPurchaseOrderSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  reason: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ systemId: string }>
}

export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, cancelPurchaseOrderSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { userId, userName, reason } = validation.data

  try {
    const { systemId } = await params

    // Fetch purchase order
    const po = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      include: {
        items: true,
        supplier: true,
      },
    })

    if (!po) {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }

    // Check if order can be cancelled
    if (['COMPLETED', 'CANCELLED'].includes(po.status)) {
      return apiError(`Không thể hủy đơn hàng ở trạng thái "${po.status}"`, 400)
    }

    // Create history entry
    const _historyEntry = {
      action: 'cancelled',
      description: reason || 'Đã hủy đơn hàng.',
      timestamp: new Date().toISOString(),
      user: { systemId: userId, name: userName },
      changes: {
        field: 'status',
        oldValue: po.status,
        newValue: 'CANCELLED',
      },
    }

    // Log activity to centralized ActivityLog table
    await prisma.activityLog.create({
      data: {
        entityType: 'purchase_order',
        entityId: systemId,
        action: 'cancelled',
        actionType: 'status',
        changes: { status: { from: po.status, to: 'CANCELLED' } },
        note: reason || 'Đã hủy đơn hàng.',
        createdBy: userId,
        metadata: { userName },
      },
    });

    // Update purchase order status
    const updatedPO = await prisma.purchaseOrder.update({
      where: { systemId },
      data: {
        status: 'CANCELLED',
      },
      include: {
        items: true,
        supplier: true,
      },
    })

    return apiSuccess({
      purchaseOrder: updatedPO,
      purchaseReturn: null,
      receipt: null,
    })
  } catch (error) {
    console.error('Error cancelling purchase order:', error)
    return apiError('Failed to cancel purchase order', 500)
  }
}
