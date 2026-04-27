import { prisma } from '@/lib/prisma'
import { validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { updateReceiptSchema } from './validation'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import { serializeReceipt } from '../serialize'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Normalizes empty-ish values to a canonical form for comparison
function normalizeValue(val: unknown): unknown {
  if (val == null) return null
  if (typeof val === 'string' && val.trim() === '') return null
  if (Array.isArray(val) && val.length === 0) return null
  if (typeof val === 'object' && val !== null && !('toNumber' in val) && !(val instanceof Date) && Object.keys(val).length === 0) return null

  // Handle Decimal (convert to number for comparison)
  if (typeof val === 'object' && val !== null && 'toNumber' in val) {
    return (val as { toNumber: () => number }).toNumber()
  }

  // Handle Date
  if (val instanceof Date) {
    return val.getTime()
  }

  return val
}

// Helper to compare values for change detection
function hasValueChanged(oldVal: unknown, newVal: unknown): boolean {
  const normalizedOld = normalizeValue(oldVal)
  const normalizedNew = normalizeValue(newVal)

  // Both null/empty after normalization → no change
  if (normalizedOld == null && normalizedNew == null) return false

  // One empty, one not → changed
  if (normalizedOld == null || normalizedNew == null) return true

  // Handle dates/numbers
  if (typeof normalizedOld === 'number' && typeof normalizedNew === 'number') {
    return normalizedOld !== normalizedNew
  }

  return normalizedOld !== normalizedNew
}

// Helper to recalculate and update PurchaseOrder refundStatus
async function updatePurchaseOrderRefundStatus(purchaseOrderSystemId: string) {
  try {
    // Get PO details and all receipts for this PO
    const [purchaseOrder, allReceipts] = await Promise.all([
      prisma.purchaseOrder.findUnique({
        where: { systemId: purchaseOrderSystemId },
        select: { total: true },
      }),
      prisma.receipt.findMany({
        where: {
          purchaseOrderSystemId,
          status: { not: 'cancelled' },
        },
        select: { amount: true },
      }),
    ]);

    if (!purchaseOrder) return;

    // Order total (grandTotal)
    const orderTotal = Number(purchaseOrder.total || 0);

    // Calculate total received from supplier (all receipts linked to this PO)
    const totalReceived = allReceipts.reduce(
      (sum, r) => sum + Number(r.amount || 0),
      0
    );

    // Determine refund status based on order total
    // - "Chưa hoàn tiền": No refund received
    // - "Hoàn tiền một phần": Received some refund but less than order total
    // - "Hoàn tiền toàn bộ": Received refund >= order total
    let refundStatus = 'Chưa hoàn tiền';
    if (totalReceived > 0) {
      if (orderTotal > 0 && totalReceived >= orderTotal) {
        refundStatus = 'Hoàn tiền toàn bộ';
      } else {
        refundStatus = 'Hoàn tiền một phần';
      }
    }

    await prisma.purchaseOrder.update({
      where: { systemId: purchaseOrderSystemId },
      data: { refundStatus },
    });
  } catch (err) {
    logError('[Receipt] Failed to update PO refundStatus', err);
  }
}

// GET /api/receipts/[systemId]
export const GET = apiHandler(async (_request, { params }) => {
  try {
    const { systemId } = params

    const receipt = await prisma.receipt.findUnique({
      where: { systemId },
      include: {
        order: true,
        customers: true,
      },
    })

    if (!receipt) {
      return apiError('Phiếu thu không tồn tại', 404)
    }

    // Resolve creator name
    let createdByName: string | null = null
    if (receipt.createdBy) {
      const creator = await prisma.employee.findFirst({
        where: { OR: [{ systemId: receipt.createdBy }, { id: receipt.createdBy }] },
        select: { fullName: true },
      })
      createdByName = creator?.fullName || null
    }

    const serialized = serializeReceipt(receipt)
    return apiSuccess({
      ...serialized,
      date: receipt.receiptDate?.toISOString() || receipt.createdAt?.toISOString(),
      createdByName,
    })
  } catch (error) {
    logError('Error fetching receipt', error)
    return apiError('Không thể tải phiếu thu', 500)
  }
})

// PUT /api/receipts/[systemId]
export const PUT = apiHandler(async (request, { session, params }) => {

  const validation = await validateBody(request, updateReceiptSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = params

    // Fetch existing receipt for change detection
    const existingReceipt = await prisma.receipt.findUnique({
      where: { systemId },
      select: {
        id: true,
        amount: true,
        paymentMethod: true,
        description: true,
      },
    })

    if (!existingReceipt) {
      return apiError('Phiếu thu không tồn tại', 404)
    }

    // Check if any values actually changed
    const amountChanged = hasValueChanged(existingReceipt.amount, body.amount)
    const methodChanged = hasValueChanged(existingReceipt.paymentMethod, body.method || body.paymentMethod)
    const descriptionChanged = hasValueChanged(existingReceipt.description, body.description)

    const hasChanges = amountChanged || methodChanged || descriptionChanged

    if (!hasChanges) {
      // No actual changes, just return the existing receipt
      const receipt = await prisma.receipt.findUnique({
        where: { systemId },
        include: {
          order: true,
          customers: true,
        },
      })
      if (!receipt) return apiError('Phiếu thu không tồn tại', 404)
      return apiSuccess(serializeReceipt(receipt))
    }

    const receipt = await prisma.receipt.update({
      where: { systemId },
      data: {
        amount: body.amount,
        paymentMethod: body.method || body.paymentMethod,
        description: body.description,
      },
      include: {
        order: true,
        customers: true,
      },
    })

    // Update customer debt if receipt affects debt
    if (receipt.affectsDebt) {
      const customerSystemId = receipt.customerSystemId || receipt.payerSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          logError('[Update Receipt] Failed to update customer debt', err);
        });
      }
    }

    // Update PurchaseOrder refundStatus if receipt is linked to a PO
    if (receipt.purchaseOrderSystemId) {
      await updatePurchaseOrderRefundStatus(receipt.purchaseOrderSystemId);
    }

    // Notify about receipt update
    if (receipt.createdBy && receipt.createdBy !== session!.user.employeeId) {
      createNotification({
        type: 'receipt',
        settingsKey: 'receipt:updated',
        title: 'Phiếu thu cập nhật',
        message: `Phiếu thu ${receipt.id || systemId} đã được cập nhật`,
        link: `/receipts/${systemId}`,
        recipientId: receipt.createdBy,
        senderId: session!.user.employeeId,
        senderName: session!.user.name,
      }).catch(e => logError('[Receipt Update] notification failed', e));
    }

    // Compute changes for activity log
    const fieldLabels: Record<string, string> = {
      amount: 'Số tiền',
      paymentMethod: 'Phương thức',
      description: 'Mô tả',
    }
    const changedFields: string[] = []
    const changes: Record<string, { from: unknown; to: unknown }> = {}

    if (amountChanged) {
      changedFields.push(fieldLabels.amount)
      changes[fieldLabels.amount] = {
        from: Number(existingReceipt.amount),
        to: body.amount,
      }
    }
    if (methodChanged) {
      changedFields.push(fieldLabels.paymentMethod)
      changes[fieldLabels.paymentMethod] = {
        from: existingReceipt.paymentMethod,
        to: body.method || body.paymentMethod,
      }
    }
    if (descriptionChanged) {
      changedFields.push(fieldLabels.description)
      changes[fieldLabels.description] = {
        from: existingReceipt.description,
        to: body.description,
      }
    }

    const changeNote = changedFields.slice(0, 3).join(', ')
    const suffix = changedFields.length > 3 ? ` và ${changedFields.length - 3} trường khác` : ''

    // Log activity with change details
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'receipt',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          changes: JSON.parse(JSON.stringify(changes)),
          note: `Cập nhật phiếu thu ${receipt.id || systemId}: ${changeNote}${suffix}`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] receipt update failed', e))
    return apiSuccess(serializeReceipt(receipt))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu thu không tồn tại', 404)
    }
    logError('Error updating receipt', error)
    return apiError('Không thể cập nhật phiếu thu', 500)
  }
})

// DELETE /api/receipts/[systemId]
export const DELETE = apiHandler(async (_request, { session, params }) => {
  try {
    const { systemId } = params

    // Get receipt info before deleting to update customer debt and PO refundStatus
    const receipt = await prisma.receipt.findUnique({
      where: { systemId },
      select: {
        affectsDebt: true,
        customerSystemId: true,
        payerSystemId: true,
        purchaseOrderSystemId: true,
        category: true,
        amount: true,
        originalDocumentId: true,
        linkedOrderSystemId: true,
        linkedSalesReturnSystemId: true,
        linkedWarrantySystemId: true,
        linkedComplaintSystemId: true,
      },
    });

    if (!receipt) {
      return apiError('Phiếu thu không tồn tại', 404)
    }

    // Chặn xóa phiếu thu tự động sinh từ giao dịch
    const isAutoGenerated = receipt.originalDocumentId || receipt.linkedOrderSystemId 
      || receipt.linkedSalesReturnSystemId || receipt.linkedWarrantySystemId 
      || receipt.linkedComplaintSystemId || receipt.purchaseOrderSystemId;
    if (isAutoGenerated) {
      return apiError('Không thể xóa phiếu thu tự động sinh từ giao dịch. Vui lòng hủy phiếu thay vì xóa.', 400)
    }

    await prisma.receipt.delete({
      where: { systemId },
    })

    // Update customer debt if receipt affected debt
    if (receipt.affectsDebt) {
      const customerSystemId = receipt.customerSystemId || receipt.payerSystemId;
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          logError('[Delete Receipt] Failed to update customer debt', err);
        });
      }
    }

    // ✅ Revert supplier debt if receipt was a supplier refund
    // Xóa phiếu hoàn tiền từ NCC → tăng lại công nợ
    if (receipt.affectsDebt && receipt.category === 'supplier_refund') {
      const supplierSystemId = receipt.payerSystemId;
      if (supplierSystemId) {
        await prisma.supplier.update({
          where: { systemId: supplierSystemId },
          data: {
            currentDebt: { increment: Number(receipt.amount) || 0 },
          },
        }).catch(err => {
          logError('[Delete Receipt] Failed to revert supplier debt', err);
        });
      }
    }

    // Update PurchaseOrder refundStatus if receipt was linked to a PO
    if (receipt.purchaseOrderSystemId) {
      await updatePurchaseOrderRefundStatus(receipt.purchaseOrderSystemId);
    }

    // Log activity
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'receipt',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu thu`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] receipt delete failed', e))
    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu thu không tồn tại', 404)
    }
    logError('Error deleting receipt', error)
    return apiError('Không thể xóa phiếu thu', 500)
  }
})
