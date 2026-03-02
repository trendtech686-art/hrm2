'use server'

/**
 * Server Actions for Order Management (Đơn Hàng)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 * 
 * Note: Packaging-related operations are complex and use the Packaging relation model,
 * so they continue to use the existing API routes for now.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { OrderStatus } from '@/generated/prisma/client'
import type { ActionResult } from '@/types/action-result'
import { cancelOrderSchema } from '@/features/orders/validation'

// ====================================
// TYPES
// ====================================

export type CancelOrderInput = {
  systemId: string
  reason: string
  restockItems?: boolean
}

export type BulkCancelOrderInput = {
  systemIds: string[]
  reason: string
  restockItems?: boolean
}

export type UpdateOrderStatusInput = {
  systemId: string
  status: OrderStatus
}

export type AddOrderPaymentInput = {
  systemId: string
  amount: number
  paymentMethodId: string
  note?: string
}

// Packaging types - delegated to API routes but typed here for hook compatibility
export type CreatePackagingInput = {
  systemId: string
  assignedEmployeeId?: string
}

export type ConfirmPackagingInput = {
  systemId: string
  packagingId: string
  confirmingEmployeeId?: string
  confirmingEmployeeName?: string
}

export type CancelPackagingInput = {
  systemId: string
  packagingId: string
  reason: string
  cancelingEmployeeId?: string
  cancelingEmployeeName?: string
}

export type ProcessInStorePickupInput = {
  systemId: string
  packagingId: string
}

export type DispatchInput = {
  systemId: string
  packagingId: string
}

export type CompleteDeliveryInput = {
  systemId: string
  packagingId: string
}

export type FailDeliveryInput = {
  systemId: string
  packagingId: string
  reason: string
}

export type CancelDeliveryInput = {
  systemId: string
  packagingId: string
  reason: string
  restockItems?: boolean
}

// ====================================
// CANCEL ORDER
// ====================================

/**
 * Cancel an order with all related operations in a transaction
 * - Updates order status to CANCELLED
 * - Optionally restocks items
 */
export async function cancelOrderAction(
  input: CancelOrderInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const validated = cancelOrderSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, reason, restockItems = false } = input

  if (!reason.trim()) {
    return { success: false, error: 'Vui lòng nhập lý do hủy đơn' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find order with line items
      const order = await tx.order.findUnique({
        where: { systemId },
        include: {
          lineItems: {
            include: { product: true },
          },
        },
      })

      if (!order) {
        throw new Error('ORDER_NOT_FOUND')
      }

      // 2. Validate status
      if (order.status === 'CANCELLED') {
        throw new Error('ALREADY_CANCELLED')
      }

      if (['DELIVERED', 'COMPLETED'].includes(order.status)) {
        throw new Error('CANNOT_CANCEL_COMPLETED')
      }

      const now = new Date()

      // 3. Restock items if requested
      if (restockItems && order.branchId) {
        for (const item of order.lineItems) {
          if (item.productId) {
            const inventory = await tx.productInventory.findUnique({
              where: {
                productId_branchId: { 
                  productId: item.productId, 
                  branchId: order.branchId 
                },
              },
            })
            
            if (inventory) {
              await tx.productInventory.update({
                where: {
                  productId_branchId: { 
                    productId: item.productId, 
                    branchId: order.branchId 
                  },
                },
                data: {
                  committed: { decrement: Math.min(inventory.committed, item.quantity) },
                  onHand: { increment: item.quantity },
                  updatedAt: now,
                },
              })
            }
          }
        }
      }

      // 4. Update order
      const updatedOrder = await tx.order.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancelledDate: now,
          cancellationReason: reason,
        },
        include: {
          lineItems: true,
          customer: true,
        },
      })

      return {
        order: updatedOrder,
        restocked: restockItems,
      }
    })

    // Revalidate cache
    revalidatePath(`/orders/${systemId}`)
    revalidatePath('/orders')

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('cancelOrderAction error:', error)

    if (error instanceof Error) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return { success: false, error: 'Đơn hàng không tồn tại' }
      }
      if (error.message === 'ALREADY_CANCELLED') {
        return { success: false, error: 'Đơn hàng đã bị hủy' }
      }
      if (error.message === 'CANNOT_CANCEL_COMPLETED') {
        return { success: false, error: 'Không thể hủy đơn hàng đã hoàn thành' }
      }
    }

    return { success: false, error: 'Không thể hủy đơn hàng' }
  }
}

// ====================================
// BULK CANCEL ORDERS
// ====================================

/**
 * Cancel multiple orders in a single transaction
 * - Validates and cancels each order
 * - Optionally restocks items for each order
 * - Returns per-order results
 */
export async function bulkCancelOrderAction(
  input: BulkCancelOrderInput
): Promise<ActionResult<{ cancelled: number; failed: Array<{ systemId: string; error: string }> }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemIds, reason, restockItems = false } = input

  if (!systemIds.length) {
    return { success: false, error: 'Không có đơn hàng nào được chọn' }
  }

  if (!reason.trim()) {
    return { success: false, error: 'Vui lòng nhập lý do hủy đơn' }
  }

  const failed: Array<{ systemId: string; error: string }> = []
  let cancelled = 0

  try {
    await prisma.$transaction(async (tx) => {
      for (const systemId of systemIds) {
        // 1. Find order with line items
        const order = await tx.order.findUnique({
          where: { systemId },
          include: {
            lineItems: {
              include: { product: true },
            },
          },
        })

        if (!order) {
          failed.push({ systemId, error: 'Đơn hàng không tồn tại' })
          continue
        }

        // 2. Validate status
        if (order.status === 'CANCELLED') {
          failed.push({ systemId, error: 'Đã bị hủy trước đó' })
          continue
        }

        if (['DELIVERED', 'COMPLETED'].includes(order.status)) {
          failed.push({ systemId, error: 'Không thể hủy đơn đã hoàn thành' })
          continue
        }

        const now = new Date()

        // 3. Restock items if requested
        if (restockItems && order.branchId) {
          for (const item of order.lineItems) {
            if (item.productId) {
              const inventory = await tx.productInventory.findUnique({
                where: {
                  productId_branchId: {
                    productId: item.productId,
                    branchId: order.branchId,
                  },
                },
              })

              if (inventory) {
                await tx.productInventory.update({
                  where: {
                    productId_branchId: {
                      productId: item.productId,
                      branchId: order.branchId,
                    },
                  },
                  data: {
                    committed: { decrement: Math.min(inventory.committed, item.quantity) },
                    onHand: { increment: item.quantity },
                    updatedAt: now,
                  },
                })
              }
            }
          }
        }

        // 4. Update order
        await tx.order.update({
          where: { systemId },
          data: {
            status: 'CANCELLED',
            cancelledDate: now,
            cancellationReason: reason,
          },
        })

        cancelled++
      }
    })

    // Revalidate cache
    revalidatePath('/orders')

    return {
      success: true,
      data: { cancelled, failed },
    }
  } catch (error) {
    console.error('bulkCancelOrderAction error:', error)
    return { success: false, error: 'Không thể hủy đơn hàng hàng loạt' }
  }
}

// ====================================
// UPDATE ORDER STATUS
// ====================================

/**
 * Update order status
 */
export async function updateOrderStatusAction(
  input: UpdateOrderStatusInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId, status } = input

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { systemId },
      })

      if (!order) {
        throw new Error('ORDER_NOT_FOUND')
      }

      const now = new Date()

      const updatedOrder = await tx.order.update({
        where: { systemId },
        data: {
          status,
          updatedAt: now,
        },
      })

      return updatedOrder
    })

    // Revalidate cache
    revalidatePath(`/orders/${systemId}`)
    revalidatePath('/orders')

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('updateOrderStatusAction error:', error)

    if (error instanceof Error) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return { success: false, error: 'Đơn hàng không tồn tại' }
      }
    }

    return { success: false, error: 'Không thể cập nhật trạng thái đơn hàng' }
  }
}

// ====================================
// ADD ORDER PAYMENT
// ====================================

/**
 * Add a payment to an order
 */
export async function addOrderPaymentAction(
  input: AddOrderPaymentInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  const { systemId, amount, paymentMethodId, note } = input

  if (!amount || amount <= 0) {
    return { success: false, error: 'Số tiền phải lớn hơn 0' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find order
      const order = await tx.order.findUnique({
        where: { systemId },
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

      // Generate receipt system ID
      const receiptSystemId = await generateIdWithPrefix('PT', tx)

      // Create receipt
      await tx.receipt.create({
        data: {
          systemId: receiptSystemId,
          id: receiptSystemId,
          type: 'CUSTOMER_PAYMENT',
          amount,
          description: note || `Thu tiền đơn hàng ${systemId}`,
          category: 'SALES_REVENUE',
          paymentMethodSystemId: paymentMethodId || null,
          status: 'completed',
          branchId: order.branchId,
          payerTypeName: 'customer', // Use payerTypeName instead of payerType
          payerTypeSystemId: order.customerId || null,
          payerName: order.customer?.name || null,
          customerSystemId: order.customer?.systemId || null,
          customerName: order.customer?.name || null,
          linkedOrderSystemId: systemId,
          receiptDate: now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
        },
      })

      // Update order paid amount
      const updatedOrder = await tx.order.update({
        where: { systemId },
        data: {
          paidAmount: { increment: amount },
          updatedAt: now,
        },
      })

      return { order: updatedOrder, receiptSystemId }
    })

    // Revalidate cache
    revalidatePath(`/orders/${systemId}`)
    revalidatePath('/orders')
    revalidatePath('/receipts')

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    console.error('addOrderPaymentAction error:', error)

    if (error instanceof Error) {
      if (error.message === 'ORDER_NOT_FOUND') {
        return { success: false, error: 'Đơn hàng không tồn tại' }
      }
    }

    return { success: false, error: 'Không thể thêm thanh toán' }
  }
}

// ====================================
// PACKAGING OPERATIONS
// Note: These delegate to the existing API routes because they use
// the Packaging relation model which requires complex queries.
// The Server Actions here wrap the API calls for hook compatibility.
// ====================================

async function callOrderApi(endpoint: string, method: string, body?: unknown) {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}))
    throw new Error(error.message || 'API call failed')
  }
  
  return res.json()
}

/**
 * Create a packaging request for an order
 */
export async function createPackagingAction(
  input: CreatePackagingInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging`,
      'POST',
      { assignedEmployeeId: input.assignedEmployeeId }
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('createPackagingAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể tạo yêu cầu đóng gói' 
    }
  }
}

/**
 * Confirm packaging is complete
 */
export async function confirmPackagingAction(
  input: ConfirmPackagingInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/confirm`,
      'POST',
      { 
        confirmingEmployeeId: input.confirmingEmployeeId,
        confirmingEmployeeName: input.confirmingEmployeeName,
      }
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('confirmPackagingAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể xác nhận đóng gói' 
    }
  }
}

/**
 * Cancel a packaging request
 */
export async function cancelPackagingAction(
  input: CancelPackagingInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  if (!input.reason.trim()) {
    return { success: false, error: 'Vui lòng nhập lý do hủy' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/cancel`,
      'POST',
      { 
        reason: input.reason,
        cancelingEmployeeId: input.cancelingEmployeeId,
        cancelingEmployeeName: input.cancelingEmployeeName,
      }
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('cancelPackagingAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể hủy yêu cầu đóng gói' 
    }
  }
}

/**
 * Select in-store pickup as delivery method
 */
export async function processInStorePickupAction(
  input: ProcessInStorePickupInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/in-store-pickup`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('processInStorePickupAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể chọn phương thức giao hàng' 
    }
  }
}

/**
 * Confirm customer has picked up their order
 */
export async function confirmInStorePickupAction(
  input: ProcessInStorePickupInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/in-store-pickup/confirm`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('confirmInStorePickupAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể xác nhận nhận hàng' 
    }
  }
}

/**
 * Dispatch order from warehouse (deduct stock, mark as shipped)
 */
export async function dispatchOrderAction(
  input: DispatchInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/dispatch`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('dispatchOrderAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể xuất kho đơn hàng' 
    }
  }
}

/**
 * Mark order as delivered
 */
export async function completeDeliveryAction(
  input: CompleteDeliveryInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/complete-delivery`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('completeDeliveryAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể xác nhận giao hàng' 
    }
  }
}

/**
 * Mark delivery as failed
 */
export async function failDeliveryAction(
  input: FailDeliveryInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  if (!input.reason.trim()) {
    return { success: false, error: 'Vui lòng nhập lý do thất bại' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/fail-delivery`,
      'POST',
      { reason: input.reason }
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('failDeliveryAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể cập nhật trạng thái giao hàng' 
    }
  }
}

/**
 * Cancel delivery and optionally restock items
 */
export async function cancelDeliveryAction(
  input: CancelDeliveryInput
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Không có quyền truy cập' }
  }

  if (!input.reason.trim()) {
    return { success: false, error: 'Vui lòng nhập lý do hủy' }
  }

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/cancel-delivery`,
      'POST',
      { reason: input.reason, restockItems: input.restockItems }
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    console.error('cancelDeliveryAction error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể hủy giao hàng' 
    }
  }
}
