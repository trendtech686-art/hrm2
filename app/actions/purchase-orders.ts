'use server'

/**
 * Server Actions for Purchase Orders Management (Đơn đặt hàng NCC)
 */

import { prisma } from '@/lib/prisma'
import { PurchaseOrderStatus } from '@/generated/prisma/client'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createPurchaseOrderSchema, updatePurchaseOrderSchema } from '@/features/purchase-orders/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Map Vietnamese status to Prisma enum
function mapStatusToPrismaEnum(status?: string): PurchaseOrderStatus | undefined {
  if (!status) return undefined;
  
  const statusMap: Record<string, PurchaseOrderStatus> = {
    // Vietnamese names
    'Đặt hàng': 'PENDING',
    'Đang giao dịch': 'CONFIRMED',
    'Hoàn thành': 'COMPLETED',
    'Đã hủy': 'CANCELLED',
    'Kết thúc': 'COMPLETED',
    'Đã trả hàng': 'CANCELLED',
    // Schema enum values (from validation.ts)
    'draft': 'DRAFT',
    'pending_approval': 'PENDING',
    'approved': 'PENDING',
    'ordered': 'PENDING',
    'partial_received': 'CONFIRMED',
    'received': 'CONFIRMED',
    'completed': 'COMPLETED',
    'cancelled': 'CANCELLED',
    // Prisma enum values
    'DRAFT': 'DRAFT',
    'PENDING': 'PENDING',
    'CONFIRMED': 'CONFIRMED',
    'RECEIVING': 'RECEIVING',
    'COMPLETED': 'COMPLETED',
    'CANCELLED': 'CANCELLED',
  };
  
  return statusMap[status];
}

// Types
type PurchaseOrder = NonNullable<Awaited<ReturnType<typeof prisma.purchaseOrder.findFirst>>>
type PurchaseOrderItem = NonNullable<Awaited<ReturnType<typeof prisma.purchaseOrderItem.findFirst>>>

// Helper to serialize Decimal fields for Client Components
function serializePurchaseOrder<T extends PurchaseOrder>(order: T): T {
  return {
    ...order,
    subtotal: Number(order.subtotal),
    discount: Number(order.discount),
    tax: Number(order.tax),
    total: Number(order.total),
    paid: Number(order.paid),
    debt: Number(order.debt),
    shippingFee: Number(order.shippingFee),
    grandTotal: Number(order.grandTotal),
  } as T;
}

function serializePurchaseOrderWithItems(order: PurchaseOrder & { items: PurchaseOrderItem[] }) {
  return {
    ...serializePurchaseOrder(order),
    items: order.items.map(item => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      discount: Number(item.discount),
      total: Number(item.total),
    })),
  };
}

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
  receivedDate?: string | Date | null
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
  const authResult = await requireActionPermission('create_purchase_orders')
  if (!authResult.success) return authResult

  const validated = createPurchaseOrderSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system (queries MAX from actual table)
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'purchase-orders',
        undefined // Always auto-generate, don't use input.id
      );

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

      // Fallback: look up buyer name if not provided but buyerSystemId exists
      let buyerName = input.buyer
      if (!buyerName && input.buyerSystemId) {
        const employee = await tx.employee.findUnique({
          where: { systemId: input.buyerSystemId },
          select: { fullName: true },
        })
        buyerName = employee?.fullName || ''
      }

      const _purchaseOrder = await tx.purchaseOrder.create({
        data: {
          systemId,
          id: businessId,
          supplierId: input.supplierId,
          supplierSystemId: input.supplierSystemId,
          supplierName: input.supplierName,
          branchId: input.branchId,
          branchSystemId: input.branchSystemId,
          branchName: input.branchName,
          employeeId: input.employeeId,
          buyerSystemId: input.buyerSystemId,
          buyer: buyerName,
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
            total: (item.quantity * item.unitPrice) - (item.discount ?? 0),
          })),
        })
      }

      return await tx.purchaseOrder.findUnique({
        where: { systemId },
        include: { items: true },
      })
    })

    // Convert Decimal fields to plain numbers for Client Components
    const serializedResult = result ? {
      ...result,
      subtotal: Number(result.subtotal),
      discount: Number(result.discount),
      tax: Number(result.tax),
      total: Number(result.total),
      paid: Number(result.paid),
      debt: Number(result.debt),
      shippingFee: Number(result.shippingFee),
      grandTotal: Number(result.grandTotal),
      items: result.items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        total: Number(item.total),
      })),
    } : null;

    revalidatePath('/purchase-orders')

    // Activity log (fire-and-forget)
    const session = authResult.session!
    const userName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'purchase_order',
        entityId: serializedResult?.systemId ?? '',
        action: 'created',
        actionType: 'create',
        note: `Tạo đơn đặt hàng nhập: ${serializedResult?.id ?? ''} - NCC: ${input.supplierName ?? 'N/A'}`,
        createdBy: userName,
      },
    }).catch(e => logError('[ActivityLog] purchase_order create failed', e))

    return { success: true, data: serializedResult as unknown as PurchaseOrder & { items: PurchaseOrderItem[] } }
  } catch (error) {
    logError('Error creating purchase order', error)
    return {
      success: false,
      error: 'Không thể tạo đơn đặt hàng nhập',
    }
  }
}

export async function updatePurchaseOrderAction(
  input: UpdatePurchaseOrderInput
): Promise<ActionResult<PurchaseOrder>> {
  const authResult = await requireActionPermission('edit_purchase_orders')
  if (!authResult.success) return authResult

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
        error: 'Chỉ có thể cập nhật đơn ở trạng thái Nháp',
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
    if (data.status !== undefined) {
      const mappedStatus = mapStatusToPrismaEnum(data.status);
      if (mappedStatus) updateData.status = mappedStatus;
    }
    if (data.deliveryStatus !== undefined) updateData.deliveryStatus = data.deliveryStatus
    if (data.receivedDate !== undefined) {
      updateData.receivedDate = data.receivedDate ? new Date(data.receivedDate) : null
    }
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const purchaseOrder = await prisma.purchaseOrder.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/purchase-orders')
    revalidatePath(`/purchase-orders/${systemId}`)
    return { success: true, data: serializePurchaseOrder(purchaseOrder) }
  } catch (error) {
    logError('Error updating purchase order', error)
    return {
      success: false,
      error: 'Không thể cập nhật đơn đặt hàng nhập',
    }
  }
}

export async function deletePurchaseOrderAction(
  systemId: string
): Promise<ActionResult<PurchaseOrder>> {
  const authResult = await requireActionPermission('delete_purchase_orders')
  if (!authResult.success) return authResult

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
        error: 'Chỉ có thể xóa đơn ở trạng thái Nháp',
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

    // Activity log (fire-and-forget)
    const session3 = authResult.session!
    const userName3 = getSessionUserName(session3)
    prisma.activityLog.create({
      data: {
        entityType: 'purchase_order',
        entityId: systemId,
        action: 'deleted',
        actionType: 'delete',
        note: `Xóa đơn đặt hàng nhập: ${existing.id} - NCC: ${existing.supplierName ?? 'N/A'}`,
        createdBy: userName3,
      },
    }).catch(e => logError('[ActivityLog] purchase_order delete failed', e))

    return { success: true, data: serializePurchaseOrder(purchaseOrder) }
  } catch (error) {
    logError('Error deleting purchase order', error)
    return {
      success: false,
      error: 'Không thể xóa đơn đặt hàng nhập',
    }
  }
}

export async function getPurchaseOrderAction(
  systemId: string
): Promise<ActionResult<PurchaseOrder & { items: PurchaseOrderItem[] }>> {
  const authResult = await requireActionPermission('view_purchase_orders')
  if (!authResult.success) return authResult

  try {
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { systemId },
      include: { items: true },
    })

    if (!purchaseOrder) {
      return { success: false, error: 'Không tìm thấy đơn đặt hàng nhập' }
    }

    return { success: true, data: serializePurchaseOrderWithItems(purchaseOrder) as unknown as PurchaseOrder & { items: PurchaseOrderItem[] } }
  } catch (error) {
    logError('Error getting purchase order', error)
    return {
      success: false,
      error: 'Không thể lấy đơn đặt hàng nhập',
    }
  }
}

export async function confirmPurchaseOrderAction(
  systemId: string,
  confirmedBy?: string
): Promise<ActionResult<PurchaseOrder>> {
  const authResult = await requireActionPermission('approve_purchase_orders')
  if (!authResult.success) return authResult

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
        error: 'Chỉ có thể xác nhận đơn ở trạng thái Nháp',
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

    // Activity log (fire-and-forget)
    const session4 = authResult.session!
    const userName4 = getSessionUserName(session4)
    prisma.activityLog.create({
      data: {
        entityType: 'purchase_order',
        entityId: systemId,
        action: 'confirmed',
        actionType: 'status',
        note: `Xác nhận đơn đặt hàng nhập: ${existing.id}`,
        createdBy: userName4,
      },
    }).catch(e => logError('[ActivityLog] purchase_order confirm failed', e))

    return { success: true, data: serializePurchaseOrder(purchaseOrder) }
  } catch (error) {
    logError('Error confirming purchase order', error)
    return {
      success: false,
      error: 'Không thể xác nhận đơn đặt hàng nhập',
    }
  }
}

export async function cancelPurchaseOrderAction(
  systemId: string,
  reason?: string,
  cancelledBy?: string
): Promise<ActionResult<PurchaseOrder>> {
  const authResult = await requireActionPermission('edit_purchase_orders')
  if (!authResult.success) return authResult

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
        error: 'Không thể hủy đơn đã hoàn thành hoặc đã hủy',
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

    // Activity log (fire-and-forget)
    const session5 = authResult.session!
    const userName5 = getSessionUserName(session5)
    prisma.activityLog.create({
      data: {
        entityType: 'purchase_order',
        entityId: systemId,
        action: 'cancelled',
        actionType: 'status',
        note: `Hủy đơn đặt hàng nhập: ${existing.id}${reason ? `. Lý do: ${reason}` : ''}`,
        createdBy: userName5,
      },
    }).catch(e => logError('[ActivityLog] purchase_order cancel failed', e))

    return { success: true, data: serializePurchaseOrder(purchaseOrder) }
  } catch (error) {
    logError('Error cancelling purchase order', error)
    return {
      success: false,
      error: 'Không thể hủy đơn đặt hàng nhập',
    }
  }
}
