'use server'

/**
 * Server Actions for Stock Transfers Management (Chuyển kho)
 * 
 * SIMPLIFIED VERSION - Basic CRUD operations
 * Complex stock operations should use API routes
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createStockTransferSchema, updateStockTransferSchema } from '@/features/stock-transfers/validation'

// Types from Prisma (auto-inferred)
type StockTransfer = NonNullable<Awaited<ReturnType<typeof prisma.stockTransfer.findFirst>>>
type StockTransferItem = NonNullable<Awaited<ReturnType<typeof prisma.stockTransferItem.findFirst>>>

// ====================================
// TYPES
// ====================================

export type CreateStockTransferInput = {
  fromBranchId: string
  fromBranchSystemId?: string
  fromBranchName?: string
  toBranchId: string
  toBranchSystemId?: string
  toBranchName?: string
  transferDate?: string | Date
  note?: string
  notes?: string
  reason?: string
  items: Array<{
    productId: string
    productSku?: string
    productName?: string
    quantity: number
  }>
  createdBy?: string
}

export type UpdateStockTransferInput = {
  systemId: string
  note?: string
  notes?: string
  reason?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

/**
 * Create a new stock transfer
 */
export async function createStockTransferAction(
  input: CreateStockTransferInput
): Promise<ActionResult<StockTransfer & { items: StockTransferItem[] }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  const validated = createStockTransferSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const result = await prisma.$transaction(async (tx) => {
      const systemId = await generateIdWithPrefix('CK', tx)
      
      const transferDate = input.transferDate 
        ? new Date(input.transferDate) 
        : new Date()

      // Create transfer (assign to _ to indicate intentionally unused)
      const _transfer = await tx.stockTransfer.create({
        data: {
          systemId,
          id: systemId,
          fromBranchId: input.fromBranchId,
          fromBranchSystemId: input.fromBranchSystemId,
          fromBranchName: input.fromBranchName,
          toBranchId: input.toBranchId,
          toBranchSystemId: input.toBranchSystemId,
          toBranchName: input.toBranchName,
          transferDate,
          status: 'PENDING',
          note: input.note || input.reason,
          notes: input.notes,
          createdBy: input.createdBy,
        },
        include: { items: true },
      })

      // Create items
      if (input.items?.length > 0) {
        await tx.stockTransferItem.createMany({
          data: input.items.map((item) => ({
            systemId: `${systemId}-${item.productId}`,
            transferId: systemId,
            productId: item.productId,
            productSku: item.productSku || '',
            productName: item.productName || '',
            quantity: item.quantity,
            receivedQty: 0,
          })),
        })
      }

      return await tx.stockTransfer.findUnique({
        where: { systemId },
        include: { items: true },
      })
    })

    revalidatePath('/stock-transfers')
    return { success: true, data: result! }
  } catch (error) {
    console.error('Error creating stock transfer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo phiếu chuyển kho',
    }
  }
}

/**
 * Update a stock transfer (basic fields only)
 */
export async function updateStockTransferAction(
  input: UpdateStockTransferInput
): Promise<ActionResult<StockTransfer>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  const validated = updateStockTransferSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.stockTransfer.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu chuyển kho' }
    }

    // Only allow updates for PENDING transfers
    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Only PENDING transfers can be updated',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.note !== undefined) updateData.note = data.note
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.reason !== undefined) updateData.note = data.reason // Map reason to note
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const transfer = await prisma.stockTransfer.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/stock-transfers')
    revalidatePath(`/stock-transfers/${systemId}`)
    return { success: true, data: transfer }
  } catch (error) {
    console.error('Error updating stock transfer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật phiếu chuyển kho',
    }
  }
}

/**
 * Delete a stock transfer
 */
export async function deleteStockTransferAction(
  systemId: string
): Promise<ActionResult<StockTransfer>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const existing = await prisma.stockTransfer.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu chuyển kho' }
    }

    // Only allow deletion for PENDING transfers
    if (existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Only PENDING transfers can be deleted',
      }
    }

    // Delete items first
    await prisma.stockTransferItem.deleteMany({
      where: { transferId: systemId },
    })

    const transfer = await prisma.stockTransfer.delete({
      where: { systemId },
    })

    revalidatePath('/stock-transfers')
    return { success: true, data: transfer }
  } catch (error) {
    console.error('Error deleting stock transfer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa phiếu chuyển kho',
    }
  }
}

/**
 * Note: For START, COMPLETE, and CANCEL operations that involve
 * stock changes, use the existing API routes:
 * - POST /api/stock-transfers/[systemId]/start
 * - POST /api/stock-transfers/[systemId]/complete
 * - POST /api/stock-transfers/[systemId]/cancel
 */
