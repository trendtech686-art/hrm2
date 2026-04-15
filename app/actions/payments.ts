'use server'

/**
 * Server Actions for Payment Management (Phiếu Chi)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

import { prisma } from '@/lib/prisma'
import { requireActionPermission } from '@/lib/api-utils'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import type { Prisma } from '@/generated/prisma/client'
import type { ActionResult } from '@/types/action-result'
import { createPaymentSchema, updatePaymentSchema } from '@/features/payments/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'

// Helper to serialize payment for client (convert Decimal to number)
function serializePayment<T extends { amount?: Prisma.Decimal | number | null; runningBalance?: Prisma.Decimal | number | null }>(payment: T): T & { amount: number; runningBalance: number | null } {
  return {
    ...payment,
    amount: payment.amount !== null && payment.amount !== undefined ? Number(payment.amount) : 0,
    runningBalance: payment.runningBalance !== null && payment.runningBalance !== undefined ? Number(payment.runningBalance) : null,
  };
}

// ====================================
// TYPES
// ====================================

export type PaymentCategory = 
  | 'purchase'
  | 'customer_payment'
  | 'complaint_refund'
  | 'warranty_refund'
  | 'sales_return_refund'
  | 'employee_advance'
  | 'employee_salary'
  | 'supplier_payment'
  | 'operational_expense'
  | 'expense'
  | 'salary'
  | 'other'

export type CreatePaymentInput = {
  date?: string // For payment date
  amount: number
  description?: string
  category: PaymentCategory
  paymentMethodSystemId?: string
  paymentMethodName?: string
  branchId: string
  branchSystemId?: string
  branchName?: string
  accountId?: string
  accountSystemId?: string
  recipientType?: string
  recipientTypeSystemId?: string
  recipientTypeName?: string
  recipientName?: string
  recipientSystemId?: string
  linkedOrderSystemId?: string
  linkedSalesReturnSystemId?: string
  linkedWarrantySystemId?: string
  linkedComplaintSystemId?: string
  purchaseOrderSystemId?: string
  linkedPayrollBatchSystemId?: string
  linkedPayslipSystemId?: string
  paymentReceiptTypeSystemId?: string
  paymentReceiptTypeName?: string
  voucherDate?: Date
  supplierId?: string // For supplier payments
  // Purchase order allocations (for "Thanh toán theo đơn nhập")
  orderAllocations?: { purchaseOrderSystemId: string; purchaseOrderId: string; amount: number }[]
}

export type UpdatePaymentInput = {
  systemId: string
  amount?: number
  description?: string
  category?: PaymentCategory
  paymentMethodSystemId?: string
  paymentMethodName?: string
  branchSystemId?: string
  branchName?: string
  accountSystemId?: string
  recipientType?: string
  recipientTypeSystemId?: string
  recipientName?: string
  recipientSystemId?: string
  voucherDate?: Date
}

export type CancelPaymentInput = {
  systemId: string
  reason?: string
}

export type DeletePaymentInput = {
  systemId: string
}

// ====================================
// CREATE PAYMENT
// ====================================

/**
 * Create a new payment voucher (phiếu chi)
 */
export async function createPaymentAction(
  input: CreatePaymentInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('create_payments')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = createPaymentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { amount, category, branchId } = input

  if (!amount || amount <= 0) {
    return { success: false, error: 'Số tiền phải lớn hơn 0' }
  }

  if (!category) {
    return { success: false, error: 'Vui lòng chọn loại chi' }
  }

  if (!branchId) {
    return { success: false, error: 'Vui lòng chọn chi nhánh' }
  }

  try {
    const userName = getSessionUserName(session)

    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()

      // Generate IDs using id-system (query MAX from DB)
      const { systemId, businessId } = await generateNextIdsWithTx(tx, 'payments')

      // Create payment
      const payment = await tx.payment.create({
        data: {
          systemId,
          id: businessId, // Use businessId for user-facing ID
          type: 'OTHER_EXPENSE',
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
          recipientTypeName: input.recipientTypeName || input.recipientType || null, // Map recipientType to recipientTypeName
          recipientTypeSystemId: input.recipientTypeSystemId || null,
          recipientName: input.recipientName || null,
          recipientSystemId: input.recipientSystemId || null,
          linkedOrderSystemId: input.linkedOrderSystemId || null,
          linkedSalesReturnSystemId: input.linkedSalesReturnSystemId || null,
          linkedWarrantySystemId: input.linkedWarrantySystemId || null,
          linkedComplaintSystemId: input.linkedComplaintSystemId || null,
          purchaseOrderSystemId: input.purchaseOrderSystemId || null,
          linkedPayrollBatchSystemId: input.linkedPayrollBatchSystemId || null,
          linkedPayslipSystemId: input.linkedPayslipSystemId || null,
          paymentReceiptTypeSystemId: input.paymentReceiptTypeSystemId || null,
          paymentReceiptTypeName: input.paymentReceiptTypeName || null,
          supplierId: input.supplierId || null,
          // Order allocations JSON
          orderAllocations: input.orderAllocations && input.orderAllocations.length > 0
            ? input.orderAllocations
            : undefined,
          paymentDate: input.voucherDate || now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      // ✅ Update supplier's currentDebt when paying a supplier
      // Payment to supplier DECREASES our debt to them
      if (input.supplierId) {
        await tx.supplier.update({
          where: { systemId: input.supplierId },
          data: {
            currentDebt: {
              decrement: amount,
            },
            updatedAt: now,
          },
        })
      }

      // Process purchase order allocations — update each PO's paid, debt & paymentStatus
      if (input.orderAllocations && input.orderAllocations.length > 0) {
        for (const alloc of input.orderAllocations) {
          const updatedPO = await tx.purchaseOrder.update({
            where: { systemId: alloc.purchaseOrderSystemId },
            data: {
              paid: { increment: alloc.amount },
              debt: { decrement: alloc.amount },
              updatedAt: now,
            },
          })

          // Update paymentStatus based on new paid vs grandTotal
          const newPaid = Number(updatedPO.paid)
          const grandTotal = Number(updatedPO.grandTotal)
          let newPaymentStatus: string
          if (newPaid >= grandTotal && grandTotal > 0) {
            newPaymentStatus = 'Đã thanh toán'
          } else if (newPaid > 0) {
            newPaymentStatus = 'Thanh toán một phần'
          } else {
            newPaymentStatus = 'Chưa thanh toán'
          }
          if (updatedPO.paymentStatus !== newPaymentStatus) {
            await tx.purchaseOrder.update({
              where: { systemId: alloc.purchaseOrderSystemId },
              data: { paymentStatus: newPaymentStatus },
            })
          }
        }
      }

      return payment
    })

    // Revalidate cache
    revalidatePath('/payments')
    if (input.linkedOrderSystemId) {
      revalidatePath(`/orders/${input.linkedOrderSystemId}`)
    }
    if (input.linkedWarrantySystemId) {
      revalidatePath(`/warranty/${input.linkedWarrantySystemId}`)
    }
    if (input.linkedSalesReturnSystemId) {
      revalidatePath(`/sales-returns/${input.linkedSalesReturnSystemId}`)
    }
    if (input.purchaseOrderSystemId) {
      revalidatePath(`/purchase-orders/${input.purchaseOrderSystemId}`)
    }
    if (input.supplierId) {
      revalidatePath(`/suppliers/${input.supplierId}`)
    }
    // Revalidate allocated purchase orders
    if (input.orderAllocations) {
      for (const alloc of input.orderAllocations) {
        revalidatePath(`/purchase-orders/${alloc.purchaseOrderSystemId}`)
      }
    }

    // Sync: update customer debt if payment affects customer
    const customerSystemId = input.recipientSystemId
    if (customerSystemId) {
      updateCustomerDebt(customerSystemId).catch(err => {
        logError('[Create Payment] Failed to update customer debt', err)
      })
    }

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'payment',
        entityId: result.systemId,
        action: 'created',
        actionType: 'create',
        note: `Thêm phiếu chi: ${result.id} - ${input.recipientName || ''} - ${Number(result.amount).toLocaleString('vi-VN')}đ`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] payment created failed', e))

    return {
      success: true,
      data: serializePayment(result),
    }
  } catch (error) {
    logError('createPaymentAction error', error)
    const errorMessage = error instanceof Error ? error.message : 'Không thể tạo phiếu chi'
    return { success: false, error: errorMessage }
  }
}

// ====================================
// UPDATE PAYMENT
// ====================================

/**
 * Update an existing payment voucher
 */
export async function updatePaymentAction(
  input: UpdatePaymentInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_payments')
  if (!authResult.success) return authResult

  const validated = updatePaymentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, ...updateData } = input

  try {
    const userName = getSessionUserName(authResult.session)

    const result = await prisma.$transaction(async (tx) => {
      // Find existing payment
      const existingPayment = await tx.payment.findUnique({
        where: { systemId },
      })

      if (!existingPayment) {
        throw new Error('PAYMENT_NOT_FOUND')
      }

      if (existingPayment.status === 'cancelled') {
        throw new Error('PAYMENT_CANCELLED')
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
        recipientName: 'Người nhận', voucherDate: 'Ngày chứng từ',
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
      if (updateData.recipientType !== undefined) dataToUpdate.recipientType = updateData.recipientType
      if (updateData.recipientTypeSystemId !== undefined) dataToUpdate.recipientTypeSystemId = updateData.recipientTypeSystemId
      if (updateData.recipientName !== undefined) dataToUpdate.recipientName = updateData.recipientName
      if (updateData.recipientSystemId !== undefined) dataToUpdate.recipientSystemId = updateData.recipientSystemId
      if (updateData.voucherDate !== undefined) dataToUpdate.paymentDate = updateData.voucherDate

      // Track changes diff
      const trackFields: Record<string, string> = {
        amount: 'amount', description: 'description', category: 'category',
        paymentMethodName: 'paymentMethodName', branchName: 'branchName',
        recipientName: 'recipientName',
      }
      for (const [inputKey, dbKey] of Object.entries(trackFields)) {
        if (updateData[inputKey as keyof typeof updateData] !== undefined) {
          const oldVal = (existingPayment as Record<string, unknown>)[dbKey]
          const newVal = updateData[inputKey as keyof typeof updateData]
          if (String(oldVal ?? '') !== String(newVal ?? '')) {
            const label = fieldLabels[inputKey] || inputKey
            changes[label] = { from: oldVal ?? '', to: newVal ?? '' }
          }
        }
      }

      // Update payment
      const payment = await tx.payment.update({
        where: { systemId },
        data: dataToUpdate,
      })

      return { payment, changes }
    })

    // Revalidate cache
    revalidatePath(`/payments/${systemId}`)
    revalidatePath('/payments')

    // Activity log (fire-and-forget)
    if (Object.keys(result.changes).length > 0) {
      const changedFields = Object.keys(result.changes).join(', ')
      prisma.activityLog.create({
        data: {
          entityType: 'payment',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu chi: ${result.payment.id}: ${changedFields}`,
          changes: result.changes as import('@prisma/client').Prisma.InputJsonValue,
          createdBy: userName,
        },
      }).catch(e => logError('[ActivityLog] payment updated failed', e))
    }

    return {
      success: true,
      data: serializePayment(result.payment),
    }
  } catch (error) {
    logError('updatePaymentAction error', error)

    if (error instanceof Error) {
      if (error.message === 'PAYMENT_NOT_FOUND') {
        return { success: false, error: 'Phiếu chi không tồn tại' }
      }
      if (error.message === 'PAYMENT_CANCELLED') {
        return { success: false, error: 'Phiếu chi đã bị hủy, không thể cập nhật' }
      }
    }

    return { success: false, error: 'Không thể cập nhật phiếu chi' }
  }
}

// ====================================
// CANCEL PAYMENT
// ====================================

/**
 * Cancel a payment voucher
 */
export async function cancelPaymentAction(
  input: CancelPaymentInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_payments')
  if (!authResult.success) return authResult

  const { systemId, reason } = input

  try {
    const userName = getSessionUserName(authResult.session)

    const result = await prisma.$transaction(async (tx) => {
      // Find existing payment
      const existingPayment = await tx.payment.findUnique({
        where: { systemId },
      })

      if (!existingPayment) {
        throw new Error('PAYMENT_NOT_FOUND')
      }

      if (existingPayment.status === 'cancelled') {
        throw new Error('ALREADY_CANCELLED')
      }

      const now = new Date()

      // Update payment to cancelled
      const payment = await tx.payment.update({
        where: { systemId },
        data: {
          status: 'cancelled',
          cancelledAt: now,
          description: reason 
            ? `[HỦY] ${reason}${existingPayment.description ? ` | Gốc: ${existingPayment.description}` : ''}`
            : existingPayment.description,
          updatedAt: now,
        },
      })

      // ✅ Restore supplier's currentDebt when cancelling a payment
      // Cancelling payment to supplier INCREASES our debt to them (restore the original debt)
      if (existingPayment.supplierId) {
        await tx.supplier.update({
          where: { systemId: existingPayment.supplierId },
          data: {
            currentDebt: {
              increment: Number(existingPayment.amount) || 0,
            },
            updatedAt: now,
          },
        })
      }

      return payment
    })

    // Sync: update customer debt if payment affects customer
    const customerSystemId = result.customerSystemId || result.recipientSystemId
    if (customerSystemId) {
      updateCustomerDebt(customerSystemId as string).catch(err => {
        logError('[Cancel Payment] Failed to update customer debt', err)
      })
    }

    // Revalidate cache
    revalidatePath(`/payments/${systemId}`)
    revalidatePath('/payments')

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'payment',
        entityId: systemId,
        action: 'cancelled',
        actionType: 'status',
        note: `Hủy phiếu chi: ${result.id}${reason ? `: ${reason}` : ''}`,
        changes: { 'Trạng thái': { from: 'Hoàn thành', to: 'Đã hủy' } },
        metadata: reason ? { reason } : undefined,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] payment cancelled failed', e))

    return {
      success: true,
      data: serializePayment(result),
    }
  } catch (error) {
    logError('cancelPaymentAction error', error)

    if (error instanceof Error) {
      if (error.message === 'PAYMENT_NOT_FOUND') {
        return { success: false, error: 'Phiếu chi không tồn tại' }
      }
      if (error.message === 'ALREADY_CANCELLED') {
        return { success: false, error: 'Phiếu chi đã bị hủy' }
      }
    }

    return { success: false, error: 'Không thể hủy phiếu chi' }
  }
}

// ====================================
// DELETE PAYMENT
// ====================================

/**
 * Delete a payment voucher (hard delete)
 */
export async function deletePaymentAction(
  input: DeletePaymentInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('delete_payments')
  if (!authResult.success) return authResult

  const { systemId } = input

  try {
    const userName = getSessionUserName(authResult.session)

    // Fetch payment info before deletion for activity log + debt sync
    const paymentInfo = await prisma.payment.findUnique({
      where: { systemId },
      select: { id: true, recipientName: true, amount: true, customerSystemId: true, recipientSystemId: true },
    })

    const result = await prisma.$transaction(async (tx) => {
      // Find existing payment
      const existingPayment = await tx.payment.findUnique({
        where: { systemId },
      })

      if (!existingPayment) {
        throw new Error('PAYMENT_NOT_FOUND')
      }

      // Restore supplier's currentDebt before deleting payment
      // Only restore if payment was not already cancelled
      if (existingPayment.supplierId && existingPayment.status !== 'cancelled') {
        await tx.supplier.update({
          where: { systemId: existingPayment.supplierId },
          data: {
            currentDebt: {
              increment: Number(existingPayment.amount) || 0,
            },
            updatedAt: new Date(),
          },
        })
      }

      // Hard delete payment
      await tx.payment.delete({
        where: { systemId },
      })

      return { deleted: true }
    })

    // Sync: update customer debt if payment affected customer
    const affectedCustomerId = paymentInfo?.customerSystemId || paymentInfo?.recipientSystemId
    if (affectedCustomerId) {
      updateCustomerDebt(affectedCustomerId).catch(err => {
        logError('[Delete Payment] Failed to update customer debt', err)
      })
    }

    // Revalidate cache
    revalidatePath('/payments')

    // Activity log (fire-and-forget)
    prisma.activityLog.create({
      data: {
        entityType: 'payment',
        entityId: systemId,
        action: 'deleted',
        actionType: 'delete',
        note: `Xóa phiếu chi: ${paymentInfo?.id || systemId}${paymentInfo?.recipientName ? ` - ${paymentInfo.recipientName}` : ''}`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] payment deleted failed', e))

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    logError('deletePaymentAction error', error)

    if (error instanceof Error) {
      if (error.message === 'PAYMENT_NOT_FOUND') {
        return { success: false, error: 'Phiếu chi không tồn tại' }
      }
    }

    return { success: false, error: 'Không thể xóa phiếu chi' }
  }
}

// ====================================
// BATCH CANCEL PAYMENTS
// ====================================

/**
 * Cancel multiple payments in a single transaction
 */
export async function batchCancelPaymentsAction(input: {
  systemIds: string[]
  reason: string
}): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_payments')
  if (!authResult.success) return authResult

  const { systemIds, reason } = input

  if (!systemIds.length) {
    return { success: true, data: { cancelled: 0 } }
  }

  try {
    const userName = getSessionUserName(authResult.session)

    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()

      let cancelled = 0
      const cancelledIds: string[] = []
      const affectedCustomerIds: string[] = []

      for (const systemId of systemIds) {
        const payment = await tx.payment.findUnique({
          where: { systemId },
        })

        if (payment && payment.status !== 'cancelled') {
          await tx.payment.update({
            where: { systemId },
            data: {
              status: 'cancelled',
              cancelledAt: now,
              description: `[HỦY] ${reason}${payment.description ? ` | Gốc: ${payment.description}` : ''}`,
              updatedAt: now,
            },
          })

          // Restore supplier debt
          if (payment.supplierId) {
            await tx.supplier.update({
              where: { systemId: payment.supplierId },
              data: {
                currentDebt: { increment: Number(payment.amount) || 0 },
                updatedAt: now,
              },
            })
          }

          // Track affected customers for debt sync
          const custId = (payment.customerSystemId || payment.recipientSystemId) as string | null
          if (custId) affectedCustomerIds.push(custId)

          cancelled++
          cancelledIds.push(payment.id)
        }
      }

      return { cancelled, cancelledIds, affectedCustomerIds }
    })

    // Sync customer debt for affected customers
    const uniqueCustomerIds = [...new Set(result.affectedCustomerIds)]
    for (const customerId of uniqueCustomerIds) {
      await updateCustomerDebt(customerId)
    }

    // Revalidate cache
    revalidatePath('/payments')

    // Activity log (fire-and-forget)
    if (result.cancelled > 0) {
      prisma.activityLog.create({
        data: {
          entityType: 'payment',
          entityId: systemIds[0],
          action: 'batch_cancelled',
          actionType: 'status',
          note: `Hủy hàng loạt ${result.cancelled} phiếu chi: ${result.cancelledIds.join(', ')}`,
          metadata: { reason, count: result.cancelled, ids: result.cancelledIds },
          createdBy: userName,
        },
      }).catch(e => logError('[ActivityLog] payment batch cancelled failed', e))
    }

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    logError('batchCancelPaymentsAction error', error)
    return { success: false, error: 'Không thể hủy các phiếu chi' }
  }
}
