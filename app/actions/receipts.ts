'use server'

/**
 * Server Actions for Receipt Management (Phiếu Thu)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { auth } from '@/auth'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import type { ActionResult } from '@/types/action-result'
import { createReceiptSchema, updateReceiptSchema } from '@/features/receipts/validation'

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
  | 'SALES_REVENUE'
  | 'service_revenue'
  | 'complaint_penalty'
  | 'warranty_additional'
  | 'deposit_received'
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
 * Create a new receipt voucher (phiếu thu)
 */
export async function createReceiptAction(
  input: CreateReceiptInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = createReceiptSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { amount, category, branchId } = input

  if (!amount || amount <= 0) {
    return { success: false, error: 'Số tiền phải lớn hơn 0' }
  }

  if (!category) {
    return { success: false, error: 'Vui lòng chọn loại thu' }
  }

  if (!branchId) {
    return { success: false, error: 'Vui lòng chọn chi nhánh' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()
      const userName = session.user?.name || session.user?.email || 'Unknown'

      // Generate system ID using ID generator
      const systemId = await generateIdWithPrefix('PT', tx)

      // Create receipt
      const receipt = await tx.receipt.create({
        data: {
          systemId,
          id: systemId, // Use same value for id
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
          receiptDate: input.voucherDate || now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

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

    return {
      success: true,
      data: serializeReceipt(result),
    }
  } catch (error) {
    console.error('createReceiptAction error:', error)
    return { success: false, error: 'Không thể tạo phiếu thu' }
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = updateReceiptSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, ...updateData } = input

  try {
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

      // Update receipt
      const receipt = await tx.receipt.update({
        where: { systemId },
        data: dataToUpdate,
      })

      return receipt
    })

    // Revalidate cache
    revalidatePath(`/receipts/${systemId}`)
    revalidatePath('/receipts')

    return {
      success: true,
      data: serializeReceipt(result),
    }
  } catch (error) {
    console.error('updateReceiptAction error:', error)

    if (error instanceof Error) {
      if (error.message === 'RECEIPT_NOT_FOUND') {
        return { success: false, error: 'Phiếu thu không tồn tại' }
      }
      if (error.message === 'RECEIPT_CANCELLED') {
        return { success: false, error: 'Phiếu thu đã bị hủy, không thể cập nhật' }
      }
    }

    return { success: false, error: 'Không thể cập nhật phiếu thu' }
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId, reason } = input

  try {
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
            ? `[HỦY] ${reason}${existingReceipt.description ? ` | Gốc: ${existingReceipt.description}` : ''}`
            : existingReceipt.description,
          updatedAt: now,
        },
      })

      return receipt
    })

    // Revalidate cache
    revalidatePath(`/receipts/${systemId}`)
    revalidatePath('/receipts')

    return {
      success: true,
      data: serializeReceipt(result),
    }
  } catch (error) {
    console.error('cancelReceiptAction error:', error)

    if (error instanceof Error) {
      if (error.message === 'RECEIPT_NOT_FOUND') {
        return { success: false, error: 'Phiếu thu không tồn tại' }
      }
      if (error.message === 'ALREADY_CANCELLED') {
        return { success: false, error: 'Phiếu thu đã bị hủy' }
      }
    }

    return { success: false, error: 'Không thể hủy phiếu thu' }
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId } = input

  try {
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

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('deleteReceiptAction error:', error)

    if (error instanceof Error) {
      if (error.message === 'RECEIPT_NOT_FOUND') {
        return { success: false, error: 'Phiếu thu không tồn tại' }
      }
    }

    return { success: false, error: 'Không thể xóa phiếu thu' }
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
        const receipt = await tx.receipt.findUnique({
          where: { systemId },
        })

        if (receipt && receipt.status !== 'cancelled') {
          await tx.receipt.update({
            where: { systemId },
            data: {
              status: 'cancelled',
              cancelledAt: now,
              description: `[HỦY] ${reason}${receipt.description ? ` | Gốc: ${receipt.description}` : ''}`,
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
    console.error('batchCancelReceiptsAction error:', error)
    return { success: false, error: 'Không thể hủy các phiếu thu' }
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { orderSystemId, amount, paymentMethodSystemId, paymentMethodName, note } = input

  if (!amount || amount <= 0) {
    return { success: false, error: 'Số tiền phải lớn hơn 0' }
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

      // Generate system ID
      const systemId = await generateIdWithPrefix('PT', tx)

      // Create receipt
      const receipt = await tx.receipt.create({
        data: {
          systemId,
          id: systemId,
          type: 'CUSTOMER_PAYMENT',
          amount,
          description: note || `Thu tiền đơn hàng ${orderSystemId}`,
          category: 'SALES_REVENUE',
          paymentMethodSystemId: paymentMethodSystemId || null,
          paymentMethodName: paymentMethodName || null,
          status: 'completed',
          branchId: order.branchId,
          payerTypeName: 'customer', // Use payerTypeName instead of payerType
          payerTypeSystemId: order.customerId || null,
          payerName: order.customer?.name || null,
          customerSystemId: order.customer?.systemId || null,
          customerName: order.customer?.name || null,
          linkedOrderSystemId: orderSystemId,
          receiptDate: now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      // Update order paidAmount
      await tx.order.update({
        where: { systemId: orderSystemId },
        data: {
          paidAmount: { increment: amount },
          updatedAt: now,
        },
      })

      return receipt
    })

    // Revalidate cache
    revalidatePath('/receipts')
    revalidatePath(`/orders/${orderSystemId}`)

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('createOrderReceiptAction error:', error)

    if (error instanceof Error) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return { success: false, error: 'Đơn hàng không tồn tại' }
      }
      if (error.message === 'ORDER_NO_BRANCH') {
        return { success: false, error: 'Đơn hàng chưa có chi nhánh' }
      }
    }

    return { success: false, error: 'Không thể tạo phiếu thu' }
  }
}
