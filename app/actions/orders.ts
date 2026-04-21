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
import { requireActionPermission, serializeDecimals } from '@/lib/api-utils'
import { revalidatePath } from '@/lib/revalidation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import { OrderStatus } from '@/generated/prisma/client'
import type { ActionResult } from '@/types/action-result'
import { cancelOrderSchema } from '@/features/orders/validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { createNotification } from '@/lib/notifications'

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

export type BulkApproveOrderInput = {
  systemIds: string[]
}

export type AddOrderPaymentInput = {
  systemId: string
  amount: number
  paymentMethodId: string
  note?: string
}

export type BulkPaymentOrderInput = {
  systemIds: string[]
  paymentMethodId: string
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

export type StartShippingInput = {
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
 * - Checks allowCancelAfterExport setting
 * - Updates order status to CANCELLED
 * - Optionally restocks items + creates stockHistory
 * - Updates customer debt
 * - Notifies salesperson
 */
export async function cancelOrderAction(
  input: CancelOrderInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('cancel_orders')
  if (!authResult.success) return authResult
  const { session } = authResult

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
          customer: true,
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

      // 3. Check allowCancelAfterExport setting
      const isExported = order.dispatchedDate || order.status === 'SHIPPING'
      if (isExported) {
        const setting = await tx.setting.findFirst({
          where: { key: 'sales-management-settings' },
        })
        const settingValue = setting?.value as { allowCancelAfterExport?: boolean } | null
        if (settingValue && settingValue.allowCancelAfterExport === false) {
          throw new Error('CANCEL_AFTER_EXPORT_NOT_ALLOWED')
        }
      }

      const now = new Date()
      const wasNotDispatched = !order.stockOutStatus || order.stockOutStatus === 'NOT_STOCKED_OUT'

      // 4. Update inventory based on order's dispatch status
      if (order.branchId) {
        for (const item of order.lineItems) {
          if (!item.productId) continue

          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: order.branchId,
              },
            },
          })

          if (!inventory) continue

          if (wasNotDispatched) {
            // Order was not dispatched - only release committed reservation
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: item.productId,
                  branchId: order.branchId,
                },
              },
              data: {
                committed: { decrement: Math.min(inventory.committed, item.quantity) },
                updatedAt: now,
              },
            })
          } else if (restockItems) {
            // Order was dispatched - return items to stock
            const newOnHand = inventory.onHand + item.quantity
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: item.productId,
                  branchId: order.branchId,
                },
              },
              data: {
                onHand: { increment: item.quantity },
                inDelivery: { decrement: Math.min(inventory.inDelivery, item.quantity) },
                updatedAt: now,
              },
            })

            // Create stock history record for restock
            await tx.stockHistory.create({
              data: {
                productId: item.productId,
                branchId: order.branchId,
                action: 'Nhập kho hủy đơn',
                source: 'Đơn hàng',
                quantityChange: item.quantity,
                newStockLevel: newOnHand,
                documentId: order.id,
                documentType: 'order',
                employeeId: session.user?.employeeId,
                employeeName: session.user?.employee?.fullName || session.user?.name || undefined,
                note: `Nhập lại kho do hủy đơn hàng - ${item.productName || item.productId}`,
              },
            })
          } else {
            // Order was dispatched but don't restock - just clear inDelivery (write off)
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: item.productId,
                  branchId: order.branchId,
                },
              },
              data: {
                inDelivery: { decrement: Math.min(inventory.inDelivery, item.quantity) },
                updatedAt: now,
              },
            })
          }
        }
      }

      // 5. Update order
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
        previousStatus: order.status,
        restocked: restockItems,
        salespersonId: order.salespersonId,
      }
    })

    // 6. Update customer debt (fire-and-forget)
    const customerSysId = result.order.customer?.systemId || result.order.customerId
    if (customerSysId) {
      updateCustomerDebt(customerSysId).catch(err => {
        logError('[Cancel Order] Failed to update customer debt', err)
      })
    }

    // 7. Notify salesperson
    if (result.salespersonId) {
      createNotification({
        type: 'order',
        title: 'Đơn hàng bị hủy',
        message: `Đơn hàng ${result.order.id} đã bị hủy${reason ? `: ${reason}` : ''}`,
        link: `/orders/${systemId}`,
        recipientId: result.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.employee?.fullName || session.user?.name,
        settingsKey: 'order:cancelled',
      }).catch(e => logError('[Cancel Order] notification failed', e))
    }

    // 8. Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Hủy đơn hàng - ${result.order.id || systemId}`,
      actionType: 'status',
      changes: { status: { from: result.previousStatus, to: 'CANCELLED' } },
      note: `Hủy đơn hàng ${result.order.id}${reason ? `: ${reason}` : ''}`,
      metadata: { reason },
      createdBy: session.user?.employee?.fullName || session.user?.name || undefined,
    }).catch(e => logError('[Cancel Order] activity log failed', e))

    // Revalidate cache
    revalidatePath(`/orders/${systemId}`)
    revalidatePath('/orders')

    return {
      success: true,
      data: serializeDecimals(result),
    }
  } catch (error) {
    logError('cancelOrderAction error', error)

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
      if (error.message === 'CANCEL_AFTER_EXPORT_NOT_ALLOWED') {
        return { success: false, error: 'Không được phép hủy đơn hàng sau khi xuất kho. Vui lòng liên hệ quản trị viên.' }
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
  const authResult = await requireActionPermission('cancel_orders')
  if (!authResult.success) return authResult
  const { session: bulkSession } = authResult

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

    // Log activity for bulk cancel
    if (cancelled > 0) {
      await createActivityLog({
        entityType: 'order',
        entityId: systemIds[0],
        action: `Hủy hàng loạt ${cancelled} đơn hàng`,
        actionType: 'status',
        metadata: { systemIds, reason, cancelled },
        createdBy: bulkSession.user?.employee?.fullName || bulkSession.user?.name || undefined,
      }).catch(e => logError('[Bulk Cancel] activity log failed', e))

      // Update customer debt for all affected customers
      const affectedOrders = await prisma.order.findMany({
        where: { systemId: { in: systemIds }, status: 'CANCELLED' },
        select: { customerId: true },
      })
      const uniqueCustomerIds = [...new Set(affectedOrders.map(o => o.customerId).filter(Boolean))] as string[]
      for (const customerId of uniqueCustomerIds) {
        updateCustomerDebt(customerId).catch(err => {
          logError('[Bulk Cancel] Failed to update customer debt', err)
        })
      }
    }

    // Revalidate cache
    revalidatePath('/orders')

    return {
      success: true,
      data: { cancelled, failed },
    }
  } catch (error) {
    logError('bulkCancelOrderAction error', error)
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
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult
  const { session } = authResult

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

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Đổi trạng thái đơn hàng - ${result.id || systemId} → ${status}`,
      actionType: 'status',
      changes: { status: { from: 'previous', to: status } },
      createdBy: session.user?.employee?.fullName || session.user?.name || undefined,
    }).catch(e => logError('[Update Status] activity log failed', e))

    // Revalidate cache
    revalidatePath(`/orders/${systemId}`)
    revalidatePath('/orders')

    return {
      success: true,
      data: serializeDecimals(result),
    }
  } catch (error) {
    logError('updateOrderStatusAction error', error)

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
  const authResult = await requireActionPermission('pay_orders')
  if (!authResult.success) return authResult
  const { session } = authResult

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

      // Generate receipt IDs using the unified ID system
      const { systemId: receiptSystemId, businessId: receiptBusinessId } = await generateNextIdsWithTx(tx, 'receipts')

      // Look up payment method by name to get systemId and proper name
      let resolvedPaymentMethodSystemId: string | null = null
      let resolvedPaymentMethodName: string | null = null
      if (paymentMethodId) {
        const pm = await tx.paymentMethod.findFirst({
          where: {
            OR: [
              { systemId: paymentMethodId },
              { name: paymentMethodId },
            ],
          },
          select: { systemId: true, name: true },
        })
        if (pm) {
          resolvedPaymentMethodSystemId = pm.systemId
          resolvedPaymentMethodName = pm.name
        } else {
          // Fallback: store the raw value as name
          resolvedPaymentMethodName = paymentMethodId
        }
      }

      // Create receipt (phiếu thu)
      await tx.receipt.create({
        data: {
          systemId: receiptSystemId,
          id: receiptBusinessId,
          type: 'CUSTOMER_PAYMENT',
          amount,
          description: note || `Thu tiền đơn hàng ${order.id} - KH: ${order.customer?.name || 'N/A'} - ${resolvedPaymentMethodName || 'Tiền mặt'} - ${new Intl.NumberFormat('vi-VN').format(amount)}đ`,
          category: 'sale',
          status: 'completed',
          branchId: order.branchId,
          orderId: systemId,
          // Payer info
          payerTypeName: 'Khách hàng',
          payerTypeSystemId: 'CUSTOMER',
          payerName: order.customer?.name || null,
          payerSystemId: order.customer?.systemId || order.customerId || null,
          // Customer info
          customerSystemId: order.customer?.systemId || null,
          customerName: order.customer?.name || null,
          // Payment method
          paymentMethodSystemId: resolvedPaymentMethodSystemId,
          paymentMethodName: resolvedPaymentMethodName,
          paymentMethod: resolvedPaymentMethodName,
          // Receipt type
          paymentReceiptTypeSystemId: 'SALE',
          paymentReceiptTypeName: 'Thu tiền bán hàng',
          // Branch info
          branchSystemId: order.branchId,
          branchName: order.branchName,
          // Link to order
          linkedOrderSystemId: systemId,
          originalDocumentId: order.id,
          // Dates
          receiptDate: now,
          createdAt: now,
          updatedAt: now,
          createdBy: userName,
          affectsDebt: true,
        },
      })

      // ✅ Create OrderPayment record (so order.payments relation is up-to-date)
      await tx.orderPayment.create({
        data: {
          id: receiptBusinessId,
          orderId: systemId,
          amount,
          method: resolvedPaymentMethodName || 'Tiền mặt',
          description: note || null,
          createdBy: userName,
          linkedReceiptSystemId: receiptSystemId,
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

      // ✅ Update paymentStatus based on new paidAmount vs grandTotal
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
      // ✅ Check if order should be marked COMPLETED
      // Order is complete when: fully paid AND (delivered OR fully stocked out)
      // NOT just PROCESSING - that just means order is being processed, not delivered
      const isDelivered = updatedOrder.status === 'DELIVERED' || 
                          updatedOrder.deliveryStatus === 'DELIVERED' ||
                          updatedOrder.stockOutStatus === 'FULLY_STOCKED_OUT'
      const shouldComplete = isDelivered && newPaymentStatus === 'PAID'
      
      const statusUpdate: Record<string, unknown> = {
        paymentStatus: newPaymentStatus,
      }
      if (shouldComplete) {
        statusUpdate.status = 'COMPLETED'
        statusUpdate.completedDate = new Date()
      }
      
      if (updatedOrder.paymentStatus !== newPaymentStatus || shouldComplete) {
        await tx.order.update({
          where: { systemId },
          data: statusUpdate,
        })
      }

      return { order: updatedOrder, receiptSystemId, customerSystemId: order.customer?.systemId || order.customerId }
    })

    // ✅ Update customer debt after payment (reduces debt)
    if (result.customerSystemId) {
      await updateCustomerDebt(result.customerSystemId).catch(err => {
        logError('[Add Payment] Failed to update customer debt', err);
      });
    }

    // Log activity
    const { session: paymentSession } = authResult
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Thêm thanh toán - ${new Intl.NumberFormat('vi-VN').format(amount)}đ`,
      actionType: 'update',
      createdBy: paymentSession.user?.employee?.fullName || paymentSession.user?.name || undefined,
    }).catch(e => logError('[Add Payment] activity log failed', e))

    // Revalidate cache
    revalidatePath(`/orders/${systemId}`)
    revalidatePath('/orders')
    revalidatePath('/receipts')

    return {
      success: true,
      data: serializeDecimals(result),
    }
  } catch (error) {
    logError('addOrderPaymentAction error', error)

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
  const { cookies } = await import('next/headers')
  const cookieStore = await cookies()
  const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ')

  const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
    },
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
  const authResult = await requireActionPermission('create_packaging')
  if (!authResult.success) return authResult

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
    logError('createPackagingAction error', error)
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
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult

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
    logError('confirmPackagingAction error', error)
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
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult

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
    logError('cancelPackagingAction error', error)
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
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/in-store-pickup`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    logError('processInStorePickupAction error', error)
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
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/in-store-pickup/confirm`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    logError('confirmInStorePickupAction error', error)
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
  const authResult = await requireActionPermission('create_shipments')
  if (!authResult.success) return authResult

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/dispatch`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    logError('dispatchOrderAction error', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể xuất kho đơn hàng' 
    }
  }
}

/**
 * Start shipping after stock out (PENDING_SHIP → SHIPPING)
 */
export async function startShippingAction(
  input: StartShippingInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('create_shipments')
  if (!authResult.success) return authResult

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/start-shipping`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    logError('startShippingAction error', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể bắt đầu giao hàng' 
    }
  }
}

/**
 * Mark order as delivered
 */
export async function completeDeliveryAction(
  input: CompleteDeliveryInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_shipments')
  if (!authResult.success) return authResult

  try {
    const data = await callOrderApi(
      `/api/orders/${input.systemId}/packaging/${input.packagingId}/complete-delivery`,
      'POST'
    )
    
    revalidatePath(`/orders/${input.systemId}`)
    revalidatePath('/orders')
    
    return { success: true, data }
  } catch (error) {
    logError('completeDeliveryAction error', error)
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
  const authResult = await requireActionPermission('edit_shipments')
  if (!authResult.success) return authResult

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
    logError('failDeliveryAction error', error)
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
  const authResult = await requireActionPermission('edit_shipments')
  if (!authResult.success) return authResult

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
    logError('cancelDeliveryAction error', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Không thể hủy giao hàng' 
    }
  }
}

// ====================================
// BULK APPROVE ORDERS
// ====================================

/**
 * Approve (confirm) multiple orders at once
 * - Only PENDING orders can be approved
 * - Sets status to CONFIRMED + approvedDate
 */
export async function bulkApproveOrderAction(
  input: BulkApproveOrderInput
): Promise<ActionResult<{ approved: number; failed: Array<{ systemId: string; error: string }> }>> {
  const authResult = await requireActionPermission('approve_orders')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemIds } = input

  if (!systemIds.length) {
    return { success: false, error: 'Không có đơn hàng nào được chọn' }
  }

  const failed: Array<{ systemId: string; error: string }> = []
  let approved = 0

  try {
    await prisma.$transaction(async (tx) => {
      for (const systemId of systemIds) {
        const order = await tx.order.findUnique({
          where: { systemId },
        })

        if (!order) {
          failed.push({ systemId, error: 'Đơn hàng không tồn tại' })
          continue
        }

        if (order.status !== 'PENDING') {
          failed.push({ systemId, error: `Không thể duyệt đơn ở trạng thái ${order.status}` })
          continue
        }

        await tx.order.update({
          where: { systemId },
          data: {
            status: 'CONFIRMED',
            approvedDate: new Date(),
          },
        })

        approved++
      }
    })

    if (approved > 0) {
      await createActivityLog({
        entityType: 'order',
        entityId: systemIds[0],
        action: `Duyệt hàng loạt ${approved} đơn hàng`,
        actionType: 'status',
        metadata: { systemIds, approved },
        createdBy: session.user?.employee?.fullName || session.user?.name || undefined,
      }).catch(e => logError('[Bulk Approve] activity log failed', e))
    }

    revalidatePath('/orders')

    return { success: true, data: { approved, failed } }
  } catch (error) {
    logError('bulkApproveOrderAction error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi khi duyệt đơn hàng loạt',
    }
  }
}

// ====================================
// BULK PAYMENT ORDERS
// ====================================

/**
 * Pay remaining balance for multiple orders at once
 * - Each order pays its full remaining amount
 * - Creates receipt for each payment
 */
export async function bulkPaymentOrderAction(
  input: BulkPaymentOrderInput
): Promise<ActionResult<{ paid: number; failed: Array<{ systemId: string; error: string }> }>> {
  const authResult = await requireActionPermission('pay_orders')
  if (!authResult.success) return authResult
  const { session } = authResult

  const { systemIds, paymentMethodId } = input

  if (!systemIds.length) {
    return { success: false, error: 'Không có đơn hàng nào được chọn' }
  }

  if (!paymentMethodId) {
    return { success: false, error: 'Vui lòng chọn phương thức thanh toán' }
  }

  const failed: Array<{ systemId: string; error: string }> = []
  let paid = 0

  try {
    await prisma.$transaction(async (tx) => {
      for (const systemId of systemIds) {
        const order = await tx.order.findUnique({
          where: { systemId },
          include: { payments: true, customer: true },
        })

        if (!order) {
          failed.push({ systemId, error: 'Đơn hàng không tồn tại' })
          continue
        }

        if (order.status === 'CANCELLED') {
          failed.push({ systemId, error: 'Đơn đã hủy' })
          continue
        }

        const totalPaid = order.payments.reduce((sum, p) => sum + Number(p.amount), 0)
        const remaining = Number(order.grandTotal) - totalPaid

        if (remaining <= 0) {
          failed.push({ systemId, error: 'Đơn đã thanh toán đủ' })
          continue
        }

        const now = new Date()

        // Create payment record
        const { systemId: paymentSystemId, businessId: paymentBusinessId } = await generateNextIdsWithTx(tx, 'payments')
        await tx.orderPayment.create({
          data: {
            systemId: paymentSystemId,
            id: paymentBusinessId,
            orderId: systemId,
            amount: remaining,
            method: paymentMethodId,
            date: now,
            createdBy: session.user?.employee?.fullName || session.user?.name || 'system',
            createdAt: now,
          },
        })

        // Update order payment status
        const newTotalPaid = totalPaid + remaining
        await tx.order.update({
          where: { systemId },
          data: {
            paidAmount: newTotalPaid,
            paymentStatus: newTotalPaid >= Number(order.grandTotal) ? 'PAID' : 'PARTIAL',
            updatedAt: now,
          },
        })

        // Create receipt
        const { systemId: receiptSystemId, businessId: receiptBusinessId } = await generateNextIdsWithTx(tx, 'receipts')
        await tx.receipt.create({
          data: {
            systemId: receiptSystemId,
            id: receiptBusinessId,
            customerSystemId: order.customerId,
            orderId: systemId,
            branchId: order.branchId || '',
            amount: remaining,
            paymentMethod: paymentMethodId,
            type: 'CUSTOMER_PAYMENT',
            description: `Thanh toán hàng loạt - Đơn ${order.id || systemId}`,
            status: 'completed',
            receiptDate: now,
            createdBy: session.user?.employee?.fullName || session.user?.name || undefined,
          },
        })

        // Update customer debt if applicable
        if (order.customerId) {
          await updateCustomerDebt(order.customerId).catch(e =>
            logError('[Bulk Payment] customer debt update failed', e)
          )
        }

        paid++
      }
    })

    if (paid > 0) {
      await createActivityLog({
        entityType: 'order',
        entityId: systemIds[0],
        action: `Thanh toán hàng loạt ${paid} đơn hàng`,
        actionType: 'update',
        metadata: { systemIds, paid, paymentMethodId },
        createdBy: session.user?.employee?.fullName || session.user?.name || undefined,
      }).catch(e => logError('[Bulk Payment] activity log failed', e))
    }

    revalidatePath('/orders')

    return { success: true, data: { paid, failed } }
  } catch (error) {
    logError('bulkPaymentOrderAction error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi khi thanh toán hàng loạt',
    }
  }
}
