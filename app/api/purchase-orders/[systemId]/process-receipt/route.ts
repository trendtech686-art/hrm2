/**
 * Process Inventory Receipt for Purchase Order API
 * POST /api/purchase-orders/[systemId]/process-receipt - Update PO status after inventory receipt
 * 
 * This recalculates deliveryStatus and status based on related inventory receipts.
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'

export const POST = apiHandler(async (_request, { session, params }) => {
  try {
    const { systemId } = params

    // Fetch purchase order with items
    const po = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        status: true,
        deliveryStatus: true,
        paymentStatus: true,
        grandTotal: true,
        deliveryDate: true,
        receivedDate: true,
        buyerSystemId: true,
        items: {
          select: {
            systemId: true,
            productId: true,
            quantity: true,
          },
        },
      },
    })

    if (!po) {
      return apiError('Đơn mua hàng không tồn tại', 404)
    }

    // Get all inventory receipts for this PO
    const receipts = await prisma.inventoryReceipt.findMany({
      where: { purchaseOrderSystemId: systemId },
      select: {
        systemId: true,
        id: true,
        receivedDate: true,
        receiptDate: true,
        receiverSystemId: true,
        receiverName: true,
        items: {
          select: {
            systemId: true,
            productId: true,
            productName: true,
            productSku: true,
            quantity: true,
            unitCost: true,
            totalCost: true,
          },
        },
      },
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

    // Get payment info to determine overall status (exclude cancelled)
    const payments = await prisma.payment.findMany({
      where: { 
        purchaseOrderSystemId: systemId,
        status: { not: 'cancelled' },
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

    // Determine overall status - use Prisma enum values for database
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
      // Get latest receipt for history entry - use receiptDate (always populated) or receivedDate
      const latestReceipt = receipts
        .filter(r => r.receiptDate != null || r.receivedDate != null)
        .sort((a, b) => {
          const dateA = new Date(a.receivedDate || a.receiptDate || 0).getTime()
          const dateB = new Date(b.receivedDate || b.receiptDate || 0).getTime()
          return dateB - dateA
        })[0]
      
      const latestReceiptDate = latestReceipt?.receivedDate || latestReceipt?.receiptDate

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
      prisma.activityLog.create({
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
      }).catch(e => logError('Activity log failed', e));

      const updatedPO = await prisma.purchaseOrder.update({
        where: { systemId },
        data: {
          deliveryStatus: newDeliveryStatus,
          paymentStatus: newPaymentStatus,
          status: newStatus,
          // Set delivery/received date if first time receiving
          ...(po.deliveryStatus === 'Chưa nhập' && newDeliveryStatus !== 'Chưa nhập' && latestReceiptDate ? {
            deliveryDate: latestReceiptDate,
            receivedDate: latestReceiptDate, // Also set receivedDate for display
          } : {}),
        },
        select: {
          systemId: true,
          id: true,
          status: true,
          deliveryStatus: true,
          paymentStatus: true,
          grandTotal: true,
          deliveryDate: true,
          receivedDate: true,
          buyerSystemId: true,
          items: {
            select: {
              systemId: true,
              productId: true,
              quantity: true,
            },
          },
          supplier: {
            select: { systemId: true, id: true, name: true, phone: true, email: true, address: true, bankAccount: true, bankName: true },
          },
        },
      })

      // Notify buyer about delivery status change
      if (updatedPO.buyerSystemId && updatedPO.buyerSystemId !== session!.user?.employeeId) {
        createNotification({
          type: 'purchase_order',
          settingsKey: 'purchase-order:updated',
          title: 'Cập nhật nhập hàng',
          message: `Đơn mua hàng ${updatedPO.id || systemId} - trạng thái giao hàng: ${newDeliveryStatus}`,
          link: `/purchase-orders/${systemId}`,
          recipientId: updatedPO.buyerSystemId,
          senderId: session!.user?.employeeId,
          senderName: session!.user?.name,
        }).catch(e => logError('[PO Process Receipt] notification failed', e));
      }

      return apiSuccess(updatedPO)
    }

    // No changes needed
    return apiSuccess(po)
  } catch (error) {
    logError('Error processing inventory receipt', error)
    return apiError('Không thể xử lý phiếu nhập kho', 500)
  }
})
