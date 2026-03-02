'use server'

/**
 * Server Actions for Purchase Orders Management (Đơn đặt hàng NCC)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createPurchaseOrderSchema, updatePurchaseOrderSchema } from '@/features/purchase-orders/validation'

// Types
type PurchaseOrder = NonNullable<Awaited<ReturnType<typeof prisma.purchaseOrder.findFirst>>>
type PurchaseOrderItem = NonNullable<Awaited<ReturnType<typeof prisma.purchaseOrderItem.findFirst>>>

export type CreatePurchaseOrderInput = {
  supplierId?: string
  supplierSystemId?: string
  supplierName?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  employeeId?: string
  buyerSystemId?: string
  buyer?: string
  orderDate?: string | Date
  expectedDate?: string | Date
  deliveryDate?: string | Date
  notes?: string
  lineItems?: unknown
  items?: Array<{
    productId: string
    productSystemId?: string
    productName?: string
    productSku?: string
    quantity: number
    unitPrice: number
    discount?: number
    tax?: number
  }>
  discountType?: string
  discount?: number
  tax?: number
  shippingFee?: number
  reference?: string
  createdBy?: string
}

export type UpdatePurchaseOrderInput = {
  systemId: string
  supplierId?: string
  supplierSystemId?: string
  supplierName?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  expectedDate?: string | Date | null
  deliveryDate?: string | Date | null
  notes?: string
  lineItems?: unknown
  discountType?: string
  discount?: number
  tax?: number
  shippingFee?: number
  reference?: string
  status?: string
  deliveryStatus?: string
  paymentStatus?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createPurchaseOrderAction(
  input: CreatePurchaseOrderInput
): Promise<ActionResult<PurchaseOrder & { items: PurchaseOrderItem[] }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = createPurchaseOrderSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const systemId = await generateIdWithPrefix('PO', tx)

      // Calculate totals from items
      let subtotal = 0
      if (input.items?.length) {
        subtotal = input.items.reduce((sum, item) => {
          const itemTotal = item.quantity * item.unitPrice
          const itemDiscount = item.discount ?? 0
          const itemTax = item.tax ?? 0
          return sum + itemTotal - itemDiscount + itemTax
        }, 0)
      }

      const discount = input.discount ?? 0
      const tax = input.tax ?? 0
      const shippingFee = input.shippingFee ?? 0
      const total = subtotal - discount + tax
      const grandTotal = total + shippingFee

      const _purchaseOrder = await tx.purchaseOrder.create({
        data: {
          systemId,
          id: systemId,
          supplierId: input.supplierId,
          supplierSystemId: input.supplierSystemId,
          supplierName: input.supplierName,
          branchId: input.branchId,
          branchSystemId: input.branchSystemId,
          branchName: input.branchName,
          employeeId: input.employeeId,
          buyerSystemId: input.buyerSystemId,
          buyer: input.buyer,
          orderDate: input.orderDate ? new Date(input.orderDate) : new Date(),
          expectedDate: input.expectedDate ? new Date(input.expectedDate) : null,
          deliveryDate: input.deliveryDate ? new Date(input.deliveryDate) : null,
          status: 'DRAFT',
          notes: input.notes,
          lineItems: input.lineItems as never ?? input.items as never,
          discountType: input.discountType,
          discount,
          tax,
          shippingFee,
          subtotal,
          total,
          grandTotal,
          debt: grandTotal,
          reference: input.reference,
          createdBy: input.createdBy,
        },
        include: { items: true },
      })

      // Create items if provided
      if (input.items?.length) {
        await tx.purchaseOrderItem.createMany({
          data: input.items.map((item, index) => ({
            systemId: `${systemId}-${index + 1}`,
            purchaseOrderId: systemId,
            productId: item.productId,
            productName: item.productName ?? '',
            productSku: item.productSku ?? '',
            quantity: item.quantity,
            receivedQty: 0,
            unitPrice: item.unitPrice,
            discount: item.discount ?? 0,
            tax: item.tax ?? 0,
            total: (item.quantity * item.unitPrice) - (item.discount ?? 0) + (item.tax ?? 0),
          })),
        })
      }

      return await tx.purchaseOrder.findUnique({
        where: { systemId },
        include: { items: true },
      })
    })

    revalidatePath('/purchase-orders')
    return { success: true, data: result! }
  } catch (error) {
    console.error('Error creating purchase order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo đơn đặt hàng nhập',
    }
  }
}

export async function updatePurchaseOrderAction(
  input: UpdatePurchaseOrderInput
): Promise<ActionResult<PurchaseOrder>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = updatePurchaseOrderSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.purchaseOrder.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn đặt hàng nhập' }
    }

    // Only allow updates for DRAFT orders
    if (existing.status !== 'DRAFT' && !data.status) {
      return {
        success: false,
        error: 'Only DRAFT orders can be updated',
      }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.supplierId !== undefined) updateData.supplierId = data.supplierId
    if (data.supplierSystemId !== undefined) updateData.supplierSystemId = data.supplierSystemId
    if (data.supplierName !== undefined) updateData.supplierName = data.supplierName
    if (data.branchId !== undefined) updateData.branchId = data.branchId
    if (data.branchSystemId !== undefined) updateData.branchSystemId = data.branchSystemId
    if (data.branchName !== undefined) updateData.branchName = data.branchName
    if (data.expectedDate !== undefined) {
      updateData.expectedDate = data.expectedDate ? new Date(data.expectedDate) : null
    }
    if (data.deliveryDate !== undefined) {
      updateData.deliveryDate = data.deliveryDate ? new Date(data.deliveryDate) : null
    }
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.lineItems !== undefined) updateData.lineItems = data.lineItems
    if (data.discountType !== undefined) updateData.discountType = data.discountType
    if (data.discount !== undefined) updateData.discount = data.discount
    if (data.tax !== undefined) updateData.tax = data.tax
    if (data.shippingFee !== undefined) updateData.shippingFee = data.shippingFee
    if (data.reference !== undefined) updateData.reference = data.reference
    if (data.status !== undefined) updateData.status = data.status
    if (data.deliveryStatus !== undefined) updateData.deliveryStatus = data.deliveryStatus
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/purchase-orders')
    revalidatePath(`/purchase-orders/${systemId}`)
    return { success: true, data: purchaseOrder }
  } catch (error) {
    console.error('Error updating purchase order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật đơn đặt hàng nhập',
    }
  }
}

export async function deletePurchaseOrderAction(
  systemId: string
): Promise<ActionResult<PurchaseOrder>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.purchaseOrder.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn đặt hàng nhập' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Only DRAFT orders can be deleted',
      }
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/purchase-orders')
    return { success: true, data: purchaseOrder }
  } catch (error) {
    console.error('Error deleting purchase order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa đơn đặt hàng nhập',
    }
  }
}

export async function getPurchaseOrderAction(
  systemId: string
): Promise<ActionResult<PurchaseOrder & { items: PurchaseOrderItem[] }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!purchaseOrder) {
      return { success: false, error: 'Không tìm thấy đơn đặt hàng nhập' }
    }

    return { success: true, data: purchaseOrder }
  } catch (error) {
    console.error('Error getting purchase order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy đơn đặt hàng nhập',
    }
  }
}

export async function confirmPurchaseOrderAction(
  systemId: string,
  confirmedBy?: string
): Promise<ActionResult<PurchaseOrder>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.purchaseOrder.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn đặt hàng nhập' }
    }

    if (existing.status !== 'DRAFT') {
      return {
        success: false,
        error: 'Only DRAFT orders can be confirmed',
      }
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { systemId },
      data: {
        status: 'CONFIRMED',
        updatedBy: confirmedBy,
      },
    })

    revalidatePath('/purchase-orders')
    revalidatePath(`/purchase-orders/${systemId}`)
    return { success: true, data: purchaseOrder }
  } catch (error) {
    console.error('Error confirming purchase order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xác nhận đơn đặt hàng nhập',
    }
  }
}

export async function cancelPurchaseOrderAction(
  systemId: string,
  reason?: string,
  cancelledBy?: string
): Promise<ActionResult<PurchaseOrder>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.purchaseOrder.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy đơn đặt hàng nhập' }
    }

    if (existing.status === 'COMPLETED' || existing.status === 'CANCELLED') {
      return {
        success: false,
        error: 'Cannot cancel completed or already cancelled orders',
      }
    }

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { systemId },
      data: {
        status: 'CANCELLED',
        notes: reason ? `${existing.notes ?? ''}\nHủy: ${reason}` : existing.notes,
        updatedBy: cancelledBy,
      },
    })

    revalidatePath('/purchase-orders')
    revalidatePath(`/purchase-orders/${systemId}`)
    return { success: true, data: purchaseOrder }
  } catch (error) {
    console.error('Error cancelling purchase order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể hủy đơn đặt hàng nhập',
    }
  }
}
