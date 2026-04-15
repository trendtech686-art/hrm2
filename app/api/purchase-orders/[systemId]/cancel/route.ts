/**
 * Cancel Purchase Order API
 * POST /api/purchase-orders/[systemId]/cancel - Cancel a purchase order
 * 
 * Updates PO status to CANCELLED. Complex operations like purchase returns
 * and refunds should be handled by the client or separate APIs.
 */

import { prisma } from '@/lib/prisma'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { z } from 'zod'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'

const cancelPurchaseOrderSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  reason: z.string().optional(),
})

export const POST = apiHandler(async (request, { session, params }) => {
  const validation = await validateBody(request, cancelPurchaseOrderSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const { userId, userName, reason } = validation.data

  try {
    const { systemId } = params

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

    // G1: Decrease inTransit for unreceived items when cancelling active PO
    const IN_TRANSIT_STATUSES = ['PENDING', 'CONFIRMED', 'RECEIVING'];
    const poBranchId = po.branchSystemId;
    if (IN_TRANSIT_STATUSES.includes(po.status) && poBranchId && po.items.length > 0) {
      // Get already received quantities from linked inventory receipts
      const receipts = await prisma.inventoryReceipt.findMany({
        where: { purchaseOrderSystemId: systemId, status: 'CONFIRMED' },
        include: { items: { select: { productId: true, quantity: true } } },
      });
      const receivedQtyMap = new Map<string, number>();
      for (const r of receipts) {
        for (const ri of r.items) {
          if (!ri.productId) continue;
          receivedQtyMap.set(ri.productId, (receivedQtyMap.get(ri.productId) || 0) + ri.quantity);
        }
      }
      for (const item of po.items) {
        if (!item.productId) continue;
        const received = receivedQtyMap.get(item.productId) || 0;
        const unreceived = item.quantity - received;
        if (unreceived > 0) {
          const inv = await prisma.productInventory.findUnique({
            where: { productId_branchId: { productId: item.productId, branchId: poBranchId } },
          });
          if (inv && inv.inTransit > 0) {
            await prisma.productInventory.update({
              where: { productId_branchId: { productId: item.productId, branchId: poBranchId } },
              data: { inTransit: { decrement: Math.min(unreceived, inv.inTransit) } },
            });
          }
        }
      }
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
    prisma.activityLog.create({
      data: {
        entityType: 'purchase_order',
        entityId: systemId,
        action: 'cancelled',
        actionType: 'status',
        changes: { status: { from: po.status, to: 'CANCELLED' } },
        note: reason || 'Đã hủy đơn hàng.',
        createdBy: session?.user?.employee?.fullName || session?.user?.name || session?.user?.id || null,
        metadata: { userName: session?.user?.name || userName },
      },
    }).catch(e => logError('Activity log failed', e));

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

    // ✅ Notify buyer about PO cancellation
    if (po.buyerSystemId && po.buyerSystemId !== session!.user?.employeeId) {
      createNotification({
        type: 'purchase_order',
        settingsKey: 'purchase-order:updated',
        title: 'Hủy đơn mua hàng',
        message: `Đơn mua hàng ${po.id || systemId} đã bị hủy${reason ? `: ${reason}` : ''}`,
        link: `/purchase-orders/${systemId}`,
        recipientId: po.buyerSystemId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Purchase Orders Cancel] notification failed', e))
    }

    return apiSuccess({
      purchaseOrder: updatedPO,
      purchaseReturn: null,
      receipt: null,
    })
  } catch (error) {
    logError('Error cancelling purchase order', error)
    return apiError('Không thể hủy đơn mua hàng', 500)
  }
})
