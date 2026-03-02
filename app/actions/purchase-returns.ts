'use server'

/**
 * Server Actions for Purchase Return Management (Trả hàng NCC)
 * 
 * Schema: PurchaseReturn, PurchaseReturnItem
 * Status: DRAFT, PENDING, APPROVED, COMPLETED, CANCELLED
 * Key fields: 
 *   - PurchaseReturn: total (not totalAmount), status
 *   - PurchaseReturnItem: systemId, returnId, productId, quantity, unitPrice, total, reason
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIds } from '@/lib/id-system'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createPurchaseReturnSchema, updatePurchaseReturnSchema, purchaseReturnItemSchema } from '@/features/purchase-returns/validation'

// Types
type PurchaseReturn = NonNullable<Awaited<ReturnType<typeof prisma.purchaseReturn.findFirst>>>
type PurchaseReturnItem = NonNullable<Awaited<ReturnType<typeof prisma.purchaseReturnItem.findFirst>>>

export type CreatePurchaseReturnInput = {
  supplierId?: string
  supplierSystemId?: string
  supplierName?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  purchaseOrderId?: string
  purchaseOrderSystemId?: string
  returnDate: string | Date
  reason?: string
  createdBy?: string
  items?: CreatePurchaseReturnItemInput[]
  totalReturnValue?: number
  refundAmount?: number
  refundMethod?: string
  accountSystemId?: string
  creatorName?: string
}

export type CreatePurchaseReturnItemInput = {
  productId: string
  productSystemId?: string
  productName?: string
  quantity?: number
  returnQuantity?: number  // alias for quantity
  orderedQuantity?: number
  unitPrice?: number
  reason?: string
  note?: string
}

export async function createPurchaseReturnAction(
  input: CreatePurchaseReturnInput
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const validated = createPurchaseReturnSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    const { systemId, businessId } = await generateNextIds('purchase-returns')

    // Calculate total from items
    const totalAmount = input.items?.reduce((sum, item) => {
      const qty = item.quantity ?? item.returnQuantity ?? 0
      const itemTotal = qty * (item.unitPrice ?? 0)
      return sum + itemTotal
    }, 0) ?? 0

    const purchaseReturn = await prisma.purchaseReturn.create({
      data: {
        systemId,
        id: businessId,
        supplierId: input.supplierId,
        supplierSystemId: input.supplierSystemId,
        supplierName: input.supplierName,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        branchName: input.branchName,
        purchaseOrderId: input.purchaseOrderId,
        purchaseOrderSystemId: input.purchaseOrderSystemId,
        returnDate: new Date(input.returnDate),
        reason: input.reason,
        total: totalAmount,
        status: 'DRAFT',
        createdBy: input.createdBy,
        items: input.items?.length ? {
          create: await Promise.all(input.items.map(async (item) => {
            const qty = item.quantity ?? item.returnQuantity ?? 0
            return {
              systemId: await generateIdWithPrefix('RTNI'),
              productId: item.productId,
              quantity: qty,
              unitPrice: item.unitPrice ?? 0,
              total: qty * (item.unitPrice ?? 0),
              reason: item.reason,
            }
          })),
        } : undefined,
      },
      include: { items: true },
    })

    revalidatePath('/purchase-returns')
    return { success: true, data: purchaseReturn }
  } catch (error) {
    console.error('Error creating purchase return:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo phiếu trả hàng nhập',
    }
  }
}

export async function updatePurchaseReturnAction(
  systemId: string,
  input: Partial<CreatePurchaseReturnInput>
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const validated = updatePurchaseReturnSchema.safeParse(input)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật phiếu trả hàng nhập ở trạng thái Nháp',
      }
    }

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: {
        supplierId: input.supplierId,
        supplierSystemId: input.supplierSystemId,
        supplierName: input.supplierName,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        branchName: input.branchName,
        purchaseOrderId: input.purchaseOrderId,
        purchaseOrderSystemId: input.purchaseOrderSystemId,
        returnDate: input.returnDate ? new Date(input.returnDate) : undefined,
        reason: input.reason,
      },
      include: { items: true },
    })

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${systemId}`)
    return { success: true, data: purchaseReturn }
  } catch (error) {
    console.error('Error updating purchase return:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật phiếu trả hàng nhập',
    }
  }
}

export async function deletePurchaseReturnAction(
  systemId: string
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa phiếu trả hàng nhập ở trạng thái Nháp',
      }
    }

    // Delete items first (cascade should handle this but being explicit)
    await prisma.purchaseReturnItem.deleteMany({
      where: { returnId: systemId },
    })

    const purchaseReturn = await prisma.purchaseReturn.delete({
      where: { systemId },
    })

    revalidatePath('/purchase-returns')
    return { success: true, data: purchaseReturn }
  } catch (error) {
    console.error('Error deleting purchase return:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa phiếu trả hàng nhập',
    }
  }
}

export async function getPurchaseReturnAction(
  systemId: string
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const purchaseReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: {
        items: true,
        suppliers: true,
      },
    })

    if (!purchaseReturn) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    return { success: true, data: purchaseReturn }
  } catch (error) {
    console.error('Error getting purchase return:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải phiếu trả hàng nhập',
    }
  }
}

export async function addPurchaseReturnItemAction(
  purchaseReturnId: string,
  item: CreatePurchaseReturnItemInput
): Promise<ActionResult<PurchaseReturnItem>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const validated = purchaseReturnItemSchema.safeParse(item)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    const purchaseReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId: purchaseReturnId },
      include: { items: true },
    })

    if (!purchaseReturn) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (purchaseReturn.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể thêm sản phẩm vào phiếu trả hàng nhập ở trạng thái Nháp',
      }
    }

    const qty = item.quantity ?? item.returnQuantity ?? 0
    const itemTotal = qty * (item.unitPrice ?? 0)

    const newItem = await prisma.purchaseReturnItem.create({
      data: {
        systemId: await generateIdWithPrefix('RTNI'),
        returnId: purchaseReturnId,
        productId: item.productId,
        quantity: qty,
        unitPrice: item.unitPrice ?? 0,
        total: itemTotal,
        reason: item.reason,
      },
    })

    // Update total
    const newTotal = Number(purchaseReturn.total ?? 0) + itemTotal
    await prisma.purchaseReturn.update({
      where: { systemId: purchaseReturnId },
      data: { total: newTotal },
    })

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${purchaseReturnId}`)
    return { success: true, data: newItem }
  } catch (error) {
    console.error('Error adding purchase return item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào phiếu trả hàng nhập',
    }
  }
}

export async function updatePurchaseReturnItemAction(
  itemSystemId: string,
  data: Partial<CreatePurchaseReturnItemInput>
): Promise<ActionResult<PurchaseReturnItem>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const validated = purchaseReturnItemSchema.partial().safeParse(data)
    if (!validated.success) {
      return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
    }

    const item = await prisma.purchaseReturnItem.findUnique({
      where: { systemId: itemSystemId },
      include: { purchaseReturn: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    if (item.purchaseReturn.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể cập nhật sản phẩm trong phiếu trả hàng nhập ở trạng thái Nháp',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.quantity !== undefined) updateData.quantity = data.quantity
    if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice
    if (data.reason !== undefined) updateData.reason = data.reason

    // Recalculate total
    const quantity = data.quantity ?? Number(item.quantity)
    const unitPrice = data.unitPrice ?? Number(item.unitPrice ?? 0)
    updateData.total = quantity * unitPrice

    const updatedItem = await prisma.purchaseReturnItem.update({
      where: { systemId: itemSystemId },
      data: updateData,
    })

    // Update return total
    const allItems = await prisma.purchaseReturnItem.findMany({
      where: { returnId: item.returnId },
    })
    const newTotal = allItems.reduce((sum, i) => sum + Number(i.total ?? 0), 0)
    await prisma.purchaseReturn.update({
      where: { systemId: item.returnId },
      data: { total: newTotal },
    })

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${item.returnId}`)
    return { success: true, data: updatedItem }
  } catch (error) {
    console.error('Error updating purchase return item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm trong phiếu trả hàng nhập',
    }
  }
}

export async function removePurchaseReturnItemAction(
  itemSystemId: string
): Promise<ActionResult<PurchaseReturnItem>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const item = await prisma.purchaseReturnItem.findUnique({
      where: { systemId: itemSystemId },
      include: { purchaseReturn: true },
    })

    if (!item) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    if (item.purchaseReturn.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Chỉ có thể xóa sản phẩm trong phiếu trả hàng nhập ở trạng thái Nháp',
      }
    }

    const deletedItem = await prisma.purchaseReturnItem.delete({
      where: { systemId: itemSystemId },
    })

    // Update return total
    const remainingItems = await prisma.purchaseReturnItem.findMany({
      where: { returnId: item.returnId },
    })
    const newTotal = remainingItems.reduce((sum, i) => sum + Number(i.total ?? 0), 0)
    await prisma.purchaseReturn.update({
      where: { systemId: item.returnId },
      data: { total: newTotal },
    })

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${item.returnId}`)
    return { success: true, data: deletedItem }
  } catch (error) {
    console.error('Error removing purchase return item:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa sản phẩm khỏi phiếu trả hàng nhập',
    }
  }
}

export async function approvePurchaseReturnAction(
  systemId: string,
  approvedBy: string
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'DRAFT' && existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể duyệt phiếu trả hàng nhập ở trạng thái Nháp hoặc Chờ duyệt',
      }
    }

    if (!existing.items.length) {
      return {
        success: false,
        error: 'Phiếu trả hàng nhập phải có ít nhất một sản phẩm',
      }
    }

    // Deduct inventory for returned items
    for (const item of existing.items) {
      if (item.productId && existing.branchId) {
        const inventory = await prisma.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: existing.branchId,
            },
          },
        })

        if (inventory) {
          const newQuantity = Math.max(0, Number(inventory.onHand) - Number(item.quantity))
          await prisma.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: existing.branchId,
              },
            },
            data: { onHand: newQuantity },
          })
        }
      }
    }

    // Update supplier debt if applicable
    if (existing.supplierId && existing.total) {
      const supplier = await prisma.supplier.findUnique({
        where: { systemId: existing.supplierId },
      })

      if (supplier) {
        const currentDebt = Number(supplier.currentDebt ?? 0)
        const returnAmount = Number(existing.total)
        await prisma.supplier.update({
          where: { systemId: existing.supplierId },
          data: { currentDebt: currentDebt - returnAmount },
        })
      }
    }

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: {
        status: 'APPROVED',
        updatedBy: approvedBy,
      },
      include: { items: true },
    })

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${systemId}`)
    revalidatePath('/products')
    revalidatePath('/suppliers')
    return { success: true, data: purchaseReturn }
  } catch (error) {
    console.error('Error approving purchase return:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể duyệt phiếu trả hàng nhập',
    }
  }
}

export async function completePurchaseReturnAction(
  systemId: string
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'APPROVED') {
      return {
        success: false,
        error: 'Chỉ có thể hoàn thành phiếu trả hàng nhập ở trạng thái Đã duyệt',
      }
    }

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: { status: 'COMPLETED' },
    })

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${systemId}`)
    return { success: true, data: purchaseReturn }
  } catch (error) {
    console.error('Error completing purchase return:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hoàn thành phiếu trả hàng nhập',
    }
  }
}

export async function cancelPurchaseReturnAction(
  systemId: string
): Promise<ActionResult<PurchaseReturn>> {
  try {
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: 'Chưa đăng nhập' }
    }

    const existing = await prisma.purchaseReturn.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy phiếu trả hàng nhập' }
    }

    if (existing.status !== 'DRAFT' && existing.status !== 'PENDING') {
      return {
        success: false,
        error: 'Chỉ có thể hủy phiếu trả hàng nhập ở trạng thái Nháp hoặc Chờ duyệt',
      }
    }

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: { status: 'CANCELLED' },
    })

    revalidatePath('/purchase-returns')
    revalidatePath(`/purchase-returns/${systemId}`)
    return { success: true, data: purchaseReturn }
  } catch (error) {
    console.error('Error cancelling purchase return:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy phiếu trả hàng nhập',
    }
  }
}
