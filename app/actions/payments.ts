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
import { auth } from '@/auth'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import type { Prisma } from '@/generated/prisma/client'
import type { ActionResult } from '@/types/action-result'
import { createPaymentSchema, updatePaymentSchema } from '@/features/payments/validation'

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
  | 'complaint_refund'
  | 'warranty_refund'
  | 'sales_return_refund'
  | 'employee_advance'
  | 'employee_salary'
  | 'operational_expense'
  | 'other'

export type CreatePaymentInput = {
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

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
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

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
          paymentDate: input.voucherDate || now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

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

    return {
      success: true,
      data: serializePayment(result),
    }
  } catch (error) {
    console.error('createPaymentAction error:', error)
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = updatePaymentSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, ...updateData } = input

  try {
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

      // Update payment
      const payment = await tx.payment.update({
        where: { systemId },
        data: dataToUpdate,
      })

      return payment
    })

    // Revalidate cache
    revalidatePath(`/payments/${systemId}`)
    revalidatePath('/payments')

    return {
      success: true,
      data: serializePayment(result),
    }
  } catch (error) {
    console.error('updatePaymentAction error:', error)

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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId, reason } = input

  try {
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

      return payment
    })

    // Revalidate cache
    revalidatePath(`/payments/${systemId}`)
    revalidatePath('/payments')

    return {
      success: true,
      data: serializePayment(result),
    }
  } catch (error) {
    console.error('cancelPaymentAction error:', error)

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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId } = input

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find existing payment
      const existingPayment = await tx.payment.findUnique({
        where: { systemId },
      })

      if (!existingPayment) {
        throw new Error('PAYMENT_NOT_FOUND')
      }

      // Hard delete payment
      await tx.payment.delete({
        where: { systemId },
      })

      return { deleted: true }
    })

    // Revalidate cache
    revalidatePath('/payments')

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('deletePaymentAction error:', error)

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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemIds, reason } = input

  if (!systemIds.length) {
    return { success: true, data: { cancelled: 0 } }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()

      let cancelled = 0

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
          cancelled++
        }
      }

      return { cancelled }
    })

    // Revalidate cache
    revalidatePath('/payments')

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('batchCancelPaymentsAction error:', error)
    return { success: false, error: 'Không thể hủy các phiếu chi' }
  }
}
