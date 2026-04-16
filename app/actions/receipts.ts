'use server'

/**
 * Server Actions for Receipt Management (Phiáº¿u Thu)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { requireActionPermission } from '@/lib/api-utils'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import type { ActionResult } from '@/types/action-result'
import { createReceiptSchema, updateReceiptSchema } from '@/features/receipts/validation'
import { logError } from '@/lib/logger'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import { getSessionUserName } from '@/lib/get-user-name'

// ====================================
// HELPERS
// ====================================

// Serialize Decimal fields for client components
function serializeReceipt<T extends { amount?: Prisma.Decimal | number | null; runningBalance?: Prisma.Decimal | number | null }>(receipt: T) {
  return {
    ...receipt,
    amount: receipt.amount !== null && receipt.amount !== undefined ? Number(receipt.amount) : 0,
    runningBalance: receipt.runningBalance !== null && receipt.runningBalance !== undefined ? Number(receipt.runningBalance) : null,
  };
}

// ====================================
// TYPES
// ====================================

export type ReceiptCategory = 
  | 'sale'
  | 'service_revenue'
  | 'complaint_penalty'
  | 'warranty_additional'
  | 'customer_payment'
  | 'deposit_received'
  | 'SALES_REVENUE'
  | 'other'

export type CreateReceiptInput = {
  amount: number
  description?: string
  category: ReceiptCategory
  paymentMethodSystemId?: string
  paymentMethodName?: string
  branchId: string
  branchSystemId?: string
  branchName?: string
  accountId?: string
  accountSystemId?: string
  payerType?: string
  payerTypeSystemId?: string
  payerName?: string
  payerSystemId?: string
  payerPhone?: string
  customerId?: string
  customerSystemId?: string
  customerName?: string
  linkedOrderSystemId?: string
  linkedSalesReturnSystemId?: string
  linkedWarrantySystemId?: string
  linkedComplaintSystemId?: string
  voucherDate?: Date
  // Receipt type (loáº¡i phiáº¿u thu)
  paymentReceiptTypeSystemId?: string
  paymentReceiptTypeName?: string
  // Debt tracking
  affectsDebt?: boolean
  // Order allocations (for "Thanh toán theo đơn hàng")
  orderAllocations?: { orderSystemId: string; orderId: string; amount: number }[]
}

export type UpdateReceiptInput = {
  systemId: string
  amount?: number
  description?: string
  category?: ReceiptCategory
  paymentMethodSystemId?: string
  paymentMethodName?: string
  branchSystemId?: string
  branchName?: string
  accountSystemId?: string
  payerType?: string
  payerTypeSystemId?: string
  payerName?: string
  payerSystemId?: string
  voucherDate?: Date
}

export type CancelReceiptInput = {
  systemId: string
  reason?: string
}

export type DeleteReceiptInput = {
  systemId: string
}

export type CreateOrderReceiptInput = {
  orderSystemId: string
  amount: number
  paymentMethodSystemId?: string
  paymentMethodName?: string
  note?: string
}

// ====================================
// CREATE RECEIPT
// ====================================

/**
 * Create a new receipt voucher (phiáº¿u thu)
 */
export async function createReceiptAction(
  input: CreateReceiptInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('create_receipts')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = createReceiptSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dá»¯ liá»‡u khÃ´ng há»£p lá»‡' }
  }

  const { amount, category, branchId } = input

  if (!amount || amount <= 0) {
    return { success: false, error: 'Sá»‘ tiá»n pháº£i lá»›n hÆ¡n 0' }
  }

  if (!category) {
    return { success: false, error: 'Vui lÃ²ng chá»n loáº¡i thu' }
  }

  if (!branchId) {
    return { success: false, error: 'Vui lÃ²ng chá»n chi nhÃ¡nh' }
  }

  try {
    const userName = getSessionUserName(session)

    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()

      // Generate receipt IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(tx, 'receipts')

      // Create receipt
      const receipt = await tx.receipt.create({
        data: {
          systemId,
          id: businessId,
          type: 'OTHER_INCOME',
          amount,
          description: input.description || '',
          category,
          paymentMethodSystemId: input.paymentMethodSystemId || null,
          paymentMethodName: input.paymentMethodName || null,
          status: 'completed',
          branchId,
          branchSystemId: input.branchSystemId || null,
          branchName: input.branchName || null,
          accountId: input.accountId || null,
          accountSystemId: input.accountSystemId || null,
          payerTypeName: input.payerType || null, // Map payerType to payerTypeName
          payerTypeSystemId: input.payerTypeSystemId || null,
          payerName: input.payerName || null,
          payerSystemId: input.payerSystemId || null,
          customerId: input.customerId || null,
          customerSystemId: input.customerSystemId || null,
          customerName: input.customerName || null,
          linkedOrderSystemId: input.linkedOrderSystemId || null,
          linkedSalesReturnSystemId: input.linkedSalesReturnSystemId || null,
          linkedWarrantySystemId: input.linkedWarrantySystemId || null,
          linkedComplaintSystemId: input.linkedComplaintSystemId || null,
          // Receipt type (loáº¡i phiáº¿u thu)
          paymentReceiptTypeSystemId: input.paymentReceiptTypeSystemId || null,
          paymentReceiptTypeName: input.paymentReceiptTypeName || null,
          // Debt tracking - default true for customer receipts
          affectsDebt: input.affectsDebt ?? true,
          // Order allocations JSON
          orderAllocations: input.orderAllocations && input.orderAllocations.length > 0
            ? input.orderAllocations
            : undefined,
          receiptDate: input.voucherDate || now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      // Process order allocations â€” update each order's paidAmount & paymentStatus
      if (input.orderAllocations && input.orderAllocations.length > 0) {
        for (const alloc of input.orderAllocations) {
          // Increment order paidAmount
          const updatedOrder = await tx.order.update({
            where: { systemId: alloc.orderSystemId },
            data: {
              paidAmount: { increment: alloc.amount },
              updatedAt: now,
            },
          })

          // Create OrderPayment record
          await tx.orderPayment.create({
            data: {
              id: `${businessId}-${alloc.orderId}`,
              orderId: alloc.orderSystemId,
              amount: alloc.amount,
              method: input.paymentMethodName || 'Tiá»n máº·t',
              description: input.description || null,
              createdBy: userName,
              linkedReceiptSystemId: systemId,
            },
          })

          // Update paymentStatus based on new paidAmount vs grandTotal
          const newPaidAmount = Number(updatedOrder.paidAmount)
          const grandTotal = Number(updatedOrder.grandTotal)
          const linkedReturnValue = updatedOrder.linkedSalesReturnValue ? Number(updatedOrder.linkedSalesReturnValue) : 0
          const effectivePaid = newPaidAmount + linkedReturnValue
          let newPaymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID'
          if (effectivePaid >= grandTotal && grandTotal > 0) {
            newPaymentStatus = 'PAID'
          } else if (effectivePaid > 0) {
            newPaymentStatus = 'PARTIAL'
          } else {
            newPaymentStatus = 'UNPAID'
          }
          // Check if order should be auto-completed
          // Order is complete when: fully paid AND (delivered OR fully stocked out)
          const isDelivered = updatedOrder.status === 'DELIVERED' || 
                              updatedOrder.deliveryStatus === 'DELIVERED' ||
                              updatedOrder.stockOutStatus === 'FULLY_STOCKED_OUT'
          const shouldComplete = isDelivered && newPaymentStatus === 'PAID' && updatedOrder.status !== 'COMPLETED'

          const statusUpdate: Record<string, unknown> = {}
          if (updatedOrder.paymentStatus !== newPaymentStatus) {
            statusUpdate.paymentStatus = newPaymentStatus
          }
          if (shouldComplete) {
            statusUpdate.status = 'COMPLETED'
            statusUpdate.completedDate = new Date()
          }
          if (Object.keys(statusUpdate).length > 0) {
            await tx.order.update({
              where: { systemId: alloc.orderSystemId },
              data: statusUpdate,
            })
          }
        }
      }

      return receipt
    })

    // Revalidate cache
    revalidatePath('/receipts')
    if (input.linkedOrderSystemId) {
      revalidatePath(`/orders/${input.linkedOrderSystemId}`)
    }
    if (input.linkedWarrantySystemId) {
      revalidatePath(`/warranty/${input.linkedWarrantySystemId}`)
    }
    if (input.linkedSalesReturnSystemId) {
      revalidatePath(`/sales-returns/${input.linkedSalesReturnSystemId}`)
    }
    // Revalidate allocated orders
    if (input.orderAllocations) {
      for (const alloc of input.orderAllocations) {
        revalidatePath(`/orders/${alloc.orderSystemId}`)
      }
    }

    // Update customer debt if receipt affects debt
    if (input.affectsDebt !== false) {
      const customerSystemId = input.customerSystemId || input.payerSystemId
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          logError('[createReceiptAction] Failed to update customer debt', err)
        })
      }
    }

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'receipt',
        entityId: result.systemId,
        action: 'created',
        actionType: 'create',
        note: `Thêm phiếu thu: ${result.id} - ${input.payerName || input.customerName || ''} - ${Number(result.amount).toLocaleString('vi-VN')}đ`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] receipt created failed', e))

    return {
      success: true,
      data: serializeReceipt(result),
    }
  } catch (error) {
    logError('createReceiptAction error', error)
    return { success: false, error: 'KhÃ´ng thá»ƒ táº¡o phiáº¿u thu' }
  }
}

// ====================================
// UPDATE RECEIPT
// ====================================

/**
 * Update an existing receipt voucher
 */
export async function updateReceiptAction(
  input: UpdateReceiptInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_receipts')
  if (!authResult.success) return authResult

  const validated = updateReceiptSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dá»¯ liá»‡u khÃ´ng há»£p lá»‡' }
  }

  const { systemId, ...updateData } = input

  try {
    const userName = getSessionUserName(authResult.session)

    const result = await prisma.$transaction(async (tx) => {
      // Find existing receipt
      const existingReceipt = await tx.receipt.findUnique({
        where: { systemId },
      })

      if (!existingReceipt) {
        throw new Error('RECEIPT_NOT_FOUND')
      }

      if (existingReceipt.status === 'cancelled') {
        throw new Error('RECEIPT_CANCELLED')
      }

      const now = new Date()

      // Build update data - only include fields that are actually present
      const dataToUpdate: Record<string, unknown> = {
        updatedAt: now,
      }
      
      // Field labels for activity log
      const fieldLabels: Record<string, string> = {
        amount: 'Số tiền', description: 'Mô tả', category: 'Danh mục',
        paymentMethodName: 'Phương thức TT', branchName: 'Chi nhánh',
        payerName: 'Người nộp', voucherDate: 'Ngày chứng từ',
      }
      const changes: Record<string, { from: unknown; to: unknown }> = {}

      if (updateData.amount !== undefined) dataToUpdate.amount = updateData.amount
      if (updateData.description !== undefined) dataToUpdate.description = updateData.description
      if (updateData.category !== undefined) dataToUpdate.category = updateData.category
      if (updateData.paymentMethodSystemId !== undefined) dataToUpdate.paymentMethodSystemId = updateData.paymentMethodSystemId
      if (updateData.paymentMethodName !== undefined) dataToUpdate.paymentMethodName = updateData.paymentMethodName
      if (updateData.branchSystemId !== undefined) dataToUpdate.branchSystemId = updateData.branchSystemId
      if (updateData.branchName !== undefined) dataToUpdate.branchName = updateData.branchName
      if (updateData.accountSystemId !== undefined) dataToUpdate.accountSystemId = updateData.accountSystemId
      if (updateData.payerType !== undefined) dataToUpdate.payerType = updateData.payerType
      if (updateData.payerTypeSystemId !== undefined) dataToUpdate.payerTypeSystemId = updateData.payerTypeSystemId
      if (updateData.payerName !== undefined) dataToUpdate.payerName = updateData.payerName
      if (updateData.payerSystemId !== undefined) dataToUpdate.payerSystemId = updateData.payerSystemId
      if (updateData.voucherDate !== undefined) dataToUpdate.receiptDate = updateData.voucherDate

      // Track changes diff
      const trackFields: Record<string, string> = {
        amount: 'amount', description: 'description', category: 'category',
        paymentMethodName: 'paymentMethodName', branchName: 'branchName',
        payerName: 'payerName',
      }
      for (const [inputKey, dbKey] of Object.entries(trackFields)) {
        if (updateData[inputKey as keyof typeof updateData] !== undefined) {
          const oldVal = (existingReceipt as Record<string, unknown>)[dbKey]
          const newVal = updateData[inputKey as keyof typeof updateData]
          if (String(oldVal ?? '') !== String(newVal ?? '')) {
            const label = fieldLabels[inputKey] || inputKey
            changes[label] = { from: oldVal ?? '', to: newVal ?? '' }
          }
        }
      }

      // Update receipt
      const receipt = await tx.receipt.update({
        where: { systemId },
        data: dataToUpdate,
      })

      return { receipt, changes }
    })

    // Revalidate cache
    revalidatePath(`/receipts/${systemId}`)
    revalidatePath('/receipts')

    // Update customer debt after update
    const customerSystemId = result.receipt.customerSystemId || result.receipt.payerSystemId
    if (customerSystemId) {
      await updateCustomerDebt(customerSystemId).catch(err => {
        logError('[updateReceiptAction] Failed to update customer debt', err)
      })
    }

    // Activity log (fire-and-forget)
    if (Object.keys(result.changes).length > 0) {
      const changedFields = Object.keys(result.changes).join(', ')
      prisma.activityLog.create({
        data: {
          entityType: 'receipt',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu thu: ${result.receipt.id}: ${changedFields}`,
          changes: result.changes as import('@/generated/prisma/client').Prisma.InputJsonValue,
          createdBy: userName,
        },
      }).catch(e => logError('[ActivityLog] receipt updated failed', e))
    }

    return {
      success: true,
      data: serializeReceipt(result.receipt),
    }
  } catch (error) {
    logError('updateReceiptAction error', error)

    if (error instanceof Error) {
      if (error.message === 'RECEIPT_NOT_FOUND') {
        return { success: false, error: 'Phiáº¿u thu khÃ´ng tá»“n táº¡i' }
      }
      if (error.message === 'RECEIPT_CANCELLED') {
        return { success: false, error: 'Phiáº¿u thu Ä‘Ã£ bá»‹ há»§y, khÃ´ng thá»ƒ cáº­p nháº­t' }
      }
    }

    return { success: false, error: 'KhÃ´ng thá»ƒ cáº­p nháº­t phiáº¿u thu' }
  }
}

// ====================================
// CANCEL RECEIPT
// ====================================

/**
 * Cancel a receipt voucher
 */
export async function cancelReceiptAction(
  input: CancelReceiptInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_receipts')
  if (!authResult.success) return authResult

  const { systemId, reason } = input

  try {
    const userName = getSessionUserName(authResult.session)

    const result = await prisma.$transaction(async (tx) => {
      // Find existing receipt
      const existingReceipt = await tx.receipt.findUnique({
        where: { systemId },
      })

      if (!existingReceipt) {
        throw new Error('RECEIPT_NOT_FOUND')
      }

      if (existingReceipt.status === 'cancelled') {
        throw new Error('ALREADY_CANCELLED')
      }

      const now = new Date()

      // Update receipt to cancelled
      const receipt = await tx.receipt.update({
        where: { systemId },
        data: {
          status: 'cancelled',
          cancelledAt: now,
          description: reason 
            ? `[Há»¦Y] ${reason}${existingReceipt.description ? ` | Gá»‘c: ${existingReceipt.description}` : ''}`
            : existingReceipt.description,
          updatedAt: now,
        },
      })

      return receipt
    })

    // Revalidate cache
    revalidatePath(`/receipts/${systemId}`)
    revalidatePath('/receipts')

    // Update customer debt after cancellation
    const customerSystemId = result.customerSystemId || result.payerSystemId
    if (customerSystemId) {
      await updateCustomerDebt(customerSystemId).catch(err => {
        logError('[cancelReceiptAction] Failed to update customer debt', err)
      })
    }

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'receipt',
        entityId: systemId,
        action: 'cancelled',
        actionType: 'status',
        note: `Hủy phiếu thu: ${result.id}${reason ? `: ${reason}` : ''}`,
        changes: { 'Trạng thái': { from: 'Hoàn thành', to: 'Đã hủy' } },
        metadata: reason ? { reason } : undefined,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] receipt cancelled failed', e))

    return {
      success: true,
      data: serializeReceipt(result),
    }
  } catch (error) {
    logError('cancelReceiptAction error', error)

    if (error instanceof Error) {
      if (error.message === 'RECEIPT_NOT_FOUND') {
        return { success: false, error: 'Phiáº¿u thu khÃ´ng tá»“n táº¡i' }
      }
      if (error.message === 'ALREADY_CANCELLED') {
        return { success: false, error: 'Phiáº¿u thu Ä‘Ã£ bá»‹ há»§y' }
      }
    }

    return { success: false, error: 'KhÃ´ng thá»ƒ há»§y phiáº¿u thu' }
  }
}

// ====================================
// DELETE RECEIPT
// ====================================

/**
 * Delete a receipt voucher (hard delete)
 */
export async function deleteReceiptAction(
  input: DeleteReceiptInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('delete_receipts')
  if (!authResult.success) return authResult

  const { systemId } = input

  try {
    const userName = getSessionUserName(authResult.session)

    // Fetch receipt before deletion to get info for debt update + activity log
    const receiptForDebt = await prisma.receipt.findUnique({
      where: { systemId },
      select: { id: true, customerSystemId: true, payerSystemId: true, payerName: true, affectsDebt: true, amount: true },
    })

    const result = await prisma.$transaction(async (tx) => {
      // Find existing receipt
      const existingReceipt = await tx.receipt.findUnique({
        where: { systemId },
      })

      if (!existingReceipt) {
        throw new Error('RECEIPT_NOT_FOUND')
      }

      // Hard delete receipt
      await tx.receipt.delete({
        where: { systemId },
      })

      return { deleted: true }
    })

    // Revalidate cache
    revalidatePath('/receipts')

    // Update customer debt after deletion
    if (receiptForDebt?.affectsDebt) {
      const customerSystemId = receiptForDebt.customerSystemId || receiptForDebt.payerSystemId
      if (customerSystemId) {
        await updateCustomerDebt(customerSystemId).catch(err => {
          logError('[deleteReceiptAction] Failed to update customer debt', err)
        })
      }
    }

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'receipt',
        entityId: systemId,
        action: 'deleted',
        actionType: 'delete',
        note: `Xóa phiếu thu: ${receiptForDebt?.id || systemId}${receiptForDebt?.payerName ? ` - ${receiptForDebt.payerName}` : ''}`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] receipt deleted failed', e))

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    logError('deleteReceiptAction error', error)

    if (error instanceof Error) {
      if (error.message === 'RECEIPT_NOT_FOUND') {
        return { success: false, error: 'Phiáº¿u thu khÃ´ng tá»“n táº¡i' }
      }
    }

    return { success: false, error: 'KhÃ´ng thá»ƒ xÃ³a phiáº¿u thu' }
  }
}

// ====================================
// BATCH CANCEL RECEIPTS
// ====================================

/**
 * Cancel multiple receipts in a single transaction
 */
export async function batchCancelReceiptsAction(input: {
  systemIds: string[]
  reason: string
}): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_receipts')
  if (!authResult.success) return authResult

  const { systemIds, reason } = input

  if (!systemIds.length) {
    return { success: true, data: { cancelled: 0 } }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()

      let cancelled = 0

      for (const systemId of systemIds) {
        const receipt = await tx.receipt.findUnique({
          where: { systemId },
        })

        if (receipt && receipt.status !== 'cancelled') {
          await tx.receipt.update({
            where: { systemId },
            data: {
              status: 'cancelled',
              cancelledAt: now,
              description: `[Há»¦Y] ${reason}${receipt.description ? ` | Gá»‘c: ${receipt.description}` : ''}`,
              updatedAt: now,
            },
          })
          cancelled++
        }
      }

      return { cancelled }
    })

    // Revalidate cache
    revalidatePath('/receipts')

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    logError('batchCancelReceiptsAction error', error)
    return { success: false, error: 'KhÃ´ng thá»ƒ há»§y cÃ¡c phiáº¿u thu' }
  }
}

// ====================================
// CREATE ORDER RECEIPT
// ====================================

/**
 * Create a receipt for an order payment (specialized function)
 * This creates a receipt linked to a specific order
 */
export async function createOrderReceiptAction(
  input: CreateOrderReceiptInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('create_receipts')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { orderSystemId, amount, paymentMethodSystemId, paymentMethodName, note } = input

  if (!amount || amount <= 0) {
    return { success: false, error: 'Sá»‘ tiá»n pháº£i lá»›n hÆ¡n 0' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find the order with customer
      const order = await tx.order.findUnique({
        where: { systemId: orderSystemId },
        include: { customer: true },
      })

      if (!order) {
        throw new Error('ORDER_NOT_FOUND')
      }

      if (!order.branchId) {
        throw new Error('ORDER_NO_BRANCH')
      }

      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

      // Generate receipt IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(tx, 'receipts')

      // Create receipt
      const receipt = await tx.receipt.create({
        data: {
          systemId,
          id: businessId,
          type: 'CUSTOMER_PAYMENT',
          amount,
          description: note || `Thu tiền đơn hàng ${order.id}`,
          category: 'SALES_REVENUE',
          status: 'completed',
          branchId: order.branchId,
          // Payer info
          payerTypeName: 'KhÃ¡ch hÃ ng',
          payerTypeSystemId: order.customerId || null,
          payerName: order.customer?.name || null,
          payerSystemId: order.customerId || null,
          // Customer info
          customerSystemId: order.customer?.systemId || null,
          customerName: order.customer?.name || null,
          // Payment method
          paymentMethodSystemId: paymentMethodSystemId || null,
          paymentMethodName: paymentMethodName || null,
          // Receipt type
          paymentReceiptTypeName: 'Thu tá»« khÃ¡ch hÃ ng',
          // Branch info
          branchSystemId: order.branchId,
          branchName: order.branchName,
          // Link to order
          linkedOrderSystemId: orderSystemId,
          originalDocumentId: order.id,
          // Dates
          receiptDate: now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      // Update order paidAmount
      const updatedOrder = await tx.order.update({
        where: { systemId: orderSystemId },
        data: {
          paidAmount: { increment: amount },
          updatedAt: now,
        },
      })

      // âœ… Create OrderPayment record (so order.payments relation stays in sync)
      await tx.orderPayment.create({
        data: {
          id: businessId,
          orderId: orderSystemId,
          amount,
          method: paymentMethodName || 'Tiá»n máº·t',
          description: note || null,
          createdBy: userName,
          linkedReceiptSystemId: systemId,
        },
      })

      // âœ… Update paymentStatus based on new paidAmount vs grandTotal
      const newPaidAmount = Number(updatedOrder.paidAmount)
      const grandTotal = Number(updatedOrder.grandTotal)
      const linkedReturnValue = updatedOrder.linkedSalesReturnValue ? Number(updatedOrder.linkedSalesReturnValue) : 0
      const effectivePaid = newPaidAmount + linkedReturnValue
      let newPaymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID'
      if (effectivePaid >= grandTotal && grandTotal > 0) {
        newPaymentStatus = 'PAID'
      } else if (effectivePaid > 0) {
        newPaymentStatus = 'PARTIAL'
      } else {
        newPaymentStatus = 'UNPAID'
      }
      // Check if order should be auto-completed
      // Order is complete when: fully paid AND (delivered OR fully stocked out)
      const isDelivered = updatedOrder.status === 'DELIVERED' || 
                          updatedOrder.deliveryStatus === 'DELIVERED' ||
                          updatedOrder.stockOutStatus === 'FULLY_STOCKED_OUT'
      const shouldComplete = isDelivered && newPaymentStatus === 'PAID' && updatedOrder.status !== 'COMPLETED'

      const statusUpdate: Record<string, unknown> = {}
      if (updatedOrder.paymentStatus !== newPaymentStatus) {
        statusUpdate.paymentStatus = newPaymentStatus
      }
      if (shouldComplete) {
        statusUpdate.status = 'COMPLETED'
        statusUpdate.completedDate = new Date()
      }
      if (Object.keys(statusUpdate).length > 0) {
        await tx.order.update({
          where: { systemId: orderSystemId },
          data: statusUpdate,
        })
      }

      return receipt
    })

    // Revalidate cache
    revalidatePath('/receipts')
    revalidatePath(`/orders/${orderSystemId}`)

    // Update customer debt
    const order = await prisma.order.findUnique({
      where: { systemId: orderSystemId },
      select: { customerId: true },
    })
    if (order?.customerId) {
      await updateCustomerDebt(order.customerId).catch(err => {
        logError('[createOrderReceiptAction] Failed to update customer debt', err)
      })
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    logError('createOrderReceiptAction error', error)

    if (error instanceof Error) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return { success: false, error: 'ÄÆ¡n hÃ ng khÃ´ng tá»“n táº¡i' }
      }
      if (error.message === 'ORDER_NO_BRANCH') {
        return { success: false, error: 'ÄÆ¡n hÃ ng chÆ°a cÃ³ chi nhÃ¡nh' }
      }
    }

    return { success: false, error: 'KhÃ´ng thá»ƒ táº¡o phiáº¿u thu' }
  }
}
