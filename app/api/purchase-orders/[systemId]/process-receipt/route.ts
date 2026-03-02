/**
 * Process Inventory Receipt for Purchase Order API
 * POST /api/purchase-orders/[systemId]/process-receipt - Update PO status after inventory receipt
 * 
 * This recalculates deliveryStatus and status based on related inventory receipts.
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Fetch purchase order with items
    const po = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    })

    if (!po) {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }

    // Get all inventory receipts for this PO
    const receipts = await prisma.inventoryReceipt.findMany({
      where: { purchaseOrderSystemId: systemId },
      include: { items: true },
    })

    // Calculate total received by product using the quantity field
    const totalReceivedByProduct: Record<string, number> = {}
    for (const lineItem of po.items) {
      if (!lineItem.productId) continue; // Skip items without productId
      const totalReceived = receipts.reduce((sum, receipt) => {
        const item = receipt.items.find(i => i.productId === lineItem.productId)
        return sum + (item ? item.quantity : 0)
      }, 0)
      totalReceivedByProduct[lineItem.productId] = totalReceived
    }

    // Determine delivery status - chỉ có 2 trạng thái
    const anyItemReceived = Object.values(totalReceivedByProduct).some(qty => qty > 0)

    const newDeliveryStatus = anyItemReceived ? 'Đã nhập' : 'Chưa nhập'

    // Get payment info to determine overall status
    const payments = await prisma.payment.findMany({
      where: { 
        purchaseOrderSystemId: systemId,
      },
    })
    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0)
    
    // Get returns to calculate actual debt
    const returns = await prisma.purchaseReturn.findMany({
      where: { purchaseOrderSystemId: systemId },
    })
    const totalReturnedValue = returns.reduce((sum, r) => sum + Number(r.totalReturnValue), 0)
    const actualDebt = Number(po.grandTotal) - totalReturnedValue

    // Determine payment status
    let newPaymentStatus: string
    if (totalPaid >= actualDebt) {
      newPaymentStatus = 'Đã thanh toán'
    } else if (totalPaid > 0) {
      newPaymentStatus = 'Thanh toán một phần'
    } else {
      newPaymentStatus = 'Chưa thanh toán'
    }

    // Determine overall status - use enum values
    let newStatus = po.status
    if (po.status !== 'CANCELLED') {
      if (newDeliveryStatus === 'Đã nhập' && newPaymentStatus === 'Đã thanh toán') {
        newStatus = 'COMPLETED'
      } else if (newDeliveryStatus === 'Chưa nhập' && newPaymentStatus === 'Chưa thanh toán') {
        newStatus = 'PENDING'
      } else {
        newStatus = 'RECEIVING'
      }
    }

    // Update if changed
    if (po.deliveryStatus !== newDeliveryStatus || po.status !== newStatus || po.paymentStatus !== newPaymentStatus) {
      // Get latest receipt for history entry
      const latestReceipt = receipts
        .filter(r => r.receivedDate != null)
        .sort((a, b) => 
          new Date(b.receivedDate!).getTime() - new Date(a.receivedDate!).getTime()
        )[0]

      const historyEntry = {
        action: 'status_changed',
        description: `Cập nhật trạng thái giao hàng thành "${newDeliveryStatus}" thông qua phiếu nhập kho ${latestReceipt?.id || 'N/A'}.`,
        timestamp: new Date().toISOString(),
        user: { 
          systemId: latestReceipt?.receiverSystemId || 'SYSTEM', 
          name: latestReceipt?.receiverName || 'Hệ thống' 
        },
        changes: {
          field: 'deliveryStatus',
          oldValue: po.deliveryStatus,
          newValue: newDeliveryStatus,
        },
      }

      // Log activity to centralized ActivityLog table
      await prisma.activityLog.create({
        data: {
          entityType: 'purchase_order',
          entityId: systemId,
          action: 'delivery_status_changed',
          actionType: 'status',
          changes: { deliveryStatus: { from: po.deliveryStatus, to: newDeliveryStatus } },
          note: historyEntry.description,
          createdBy: latestReceipt?.receiverSystemId || null,
          metadata: { userName: latestReceipt?.receiverName || 'Hệ thống' },
        },
      });

      const updatedPO = await prisma.purchaseOrder.update({
        where: { systemId },
        data: {
          deliveryStatus: newDeliveryStatus,
          paymentStatus: newPaymentStatus,
          status: newStatus,
          // Set delivery date if first time receiving
          ...(po.deliveryStatus === 'Chưa nhập' && newDeliveryStatus !== 'Chưa nhập' && latestReceipt?.receivedDate ? {
            deliveryDate: latestReceipt.receivedDate,
          } : {}),
        },
        include: {
          items: true,
          supplier: true,
        },
      })

      return apiSuccess(updatedPO)
    }

    // No changes needed
    return apiSuccess(po)
  } catch (error) {
    console.error('Error processing inventory receipt:', error)
    return apiError('Failed to process inventory receipt', 500)
  }
}
