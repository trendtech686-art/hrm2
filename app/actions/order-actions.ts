'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { logError } from '@/lib/logger'
import { requireActionPermission } from '@/lib/api-utils'

type Order = NonNullable<Awaited<ReturnType<typeof prisma.order.findFirst>>>

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Cancel an order
 */
export async function cancelOrder(
  systemId: string,
  data: { reason: string; restockItems: boolean }
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult

  try {
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: { lineItems: true },
    });

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    if (order.status === 'CANCELLED') {
      return { success: false, error: 'Đơn hàng đã bị hủy trước đó' };
    }

    // Update order status
    const updated = await prisma.$transaction(async (tx) => {
      // Cancel the order
      const updatedOrder = await tx.order.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancellationReason: data.reason,
          cancelledDate: new Date(),
        },
      });

      // Update inventory based on order status
      if (order.branchId && order.lineItems.length > 0) {
        // Order was not dispatched if stockOutStatus is null or NOT_STOCKED_OUT
        const wasNotDispatched = !order.stockOutStatus || order.stockOutStatus === 'NOT_STOCKED_OUT';

        for (const item of order.lineItems) {
          if (!item.productId) continue;

          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: order.branchId,
              },
            },
          });

          if (!inventory) continue;

          if (wasNotDispatched) {
            // Order was not dispatched - only release committed
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: item.productId,
                  branchId: order.branchId,
                },
              },
              data: {
                committed: { decrement: Math.min(inventory.committed, item.quantity) },
              },
            });
          } else if (data.restockItems) {
            // Order was dispatched - return items to stock if requested
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
              },
            });
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
              },
            });
          }
        }
      }

      return updatedOrder;
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    logError('Failed to cancel order', error);
    return { success: false, error: 'Không thể hủy đơn hàng' };
  }
}

/**
 * Add payment to order
 */
export async function addOrderPayment(
  systemId: string,
  data: { amount: number; paymentMethodId: string; note?: string }
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult

  try {
    const order = await prisma.order.findUnique({
      where: { systemId },
    });

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    const currentPaid = order.paidAmount?.toNumber() || 0;
    const newPaidAmount = currentPaid + data.amount;

    const updated = await prisma.order.update({
      where: { systemId },
      data: {
        paidAmount: newPaidAmount,
        paymentStatus:
          newPaidAmount >= (order.grandTotal?.toNumber() || 0)
            ? 'PAID'
            : newPaidAmount > 0
            ? 'PARTIAL'
            : 'UNPAID',
        payments: {
          create: {
            id: await generateIdWithPrefix('PAYMENT', prisma),
            amount: data.amount,
            method: data.paymentMethodId,
            description: data.note,
            createdBy: 'system',
          },
        },
      },
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    logError('Failed to add payment', error);
    return { success: false, error: 'Không thể thêm thanh toán' };
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  systemId: string,
  status: string
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult

  try {
    const validStatuses = [
      'PENDING',
      'CONFIRMED',
      'PROCESSING',
      'PACKING',
      'PACKED',
      'READY_FOR_PICKUP',
      'SHIPPING',
      'DELIVERED',
      'COMPLETED',
      'FAILED_DELIVERY',
      'RETURNED',
      'CANCELLED',
    ];

    if (!validStatuses.includes(status)) {
      return { success: false, error: 'Trạng thái không hợp lệ' };
    }

    // Use transaction to also update ProductInventory when moving to terminal status
    const terminalStatuses = ['COMPLETED', 'DELIVERED', 'CANCELLED'];
    const needsInventoryRelease = terminalStatuses.includes(status);

    const updated = await prisma.$transaction(async (tx) => {
      const order = needsInventoryRelease
        ? await tx.order.findUnique({
            where: { systemId },
            include: { lineItems: true },
          })
        : null;

      const result = await tx.order.update({
        where: { systemId },
        data: {
          status: status as 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKING' | 'PACKED' | 'READY_FOR_PICKUP' | 'SHIPPING' | 'DELIVERED' | 'COMPLETED' | 'FAILED_DELIVERY' | 'RETURNED' | 'CANCELLED',
          ...(status === 'COMPLETED' && { completedDate: new Date() }),
          ...(status === 'CANCELLED' && { cancelledDate: new Date() }),
        },
      });

      // Release committed reservation if order was not yet dispatched
      if (
        order &&
        needsInventoryRelease &&
        order.stockOutStatus !== 'FULLY_STOCKED_OUT' &&
        order.branchId
      ) {
        for (const item of order.lineItems) {
          if (!item.productId) continue;
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: order.branchId,
              },
            },
          });
          if (inventory && inventory.committed > 0) {
            await tx.productInventory.update({
              where: {
                productId_branchId: {
                  productId: item.productId,
                  branchId: order.branchId,
                },
              },
              data: {
                committed: { decrement: Math.min(inventory.committed, item.quantity) },
                updatedAt: new Date(),
              },
            });
          }
        }
      }

      return result;
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    logError('Failed to update status', error);
    return { success: false, error: 'Không thể cập nhật trạng thái' };
  }
}

/**
 * Create packaging for order
 */
export async function createOrderPackaging(
  systemId: string,
  data: { assignedEmployeeId?: string }
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('create_packaging')
  if (!authResult.success) return authResult

  try {
    const order = await prisma.order.findUnique({
      where: { systemId },
    });

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    const packagingId = await generateIdWithPrefix('PKG', prisma);
    await prisma.packaging.create({
      data: {
        systemId: packagingId,
        id: packagingId,
        orderId: systemId,
        branchId: order.branchId,
        assignedEmployeeId: data.assignedEmployeeId,
        status: 'PENDING',
      },
    });

    const updated = await prisma.order.findUnique({
      where: { systemId },
      include: { packagings: true },
    });

    if (!updated) {
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    logError('Failed to create packaging', error);
    return { success: false, error: 'Không thể tạo đóng gói' };
  }
}

/**
 * Confirm packaging
 */
export async function confirmPackaging(
  orderSystemId: string,
  packagingId: string,
  _data?: { confirmingEmployeeId?: string; confirmingEmployeeName?: string }
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult

  try {
    await prisma.packaging.update({
      where: { systemId: packagingId },
      data: {
        status: 'COMPLETED',
      },
    });

    const order = await prisma.order.findUnique({
      where: { systemId: orderSystemId },
      include: { packagings: true },
    });

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    revalidatePath('/orders');
    revalidatePath(`/orders/${orderSystemId}`);
    return { success: true, data: order };
  } catch (error) {
    logError('Failed to confirm packaging', error);
    return { success: false, error: 'Không thể xác nhận đóng gói' };
  }
}

/**
 * Create shipment for order
 */
export async function createOrderShipment(
  systemId: string,
  data: { provider: string; serviceType?: string; packagingId?: string }
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('create_shipments')
  if (!authResult.success) return authResult

  try {
    const shipmentId = await generateIdWithPrefix('SHIP', prisma);
    await prisma.shipment.create({
      data: {
        systemId: shipmentId,
        id: shipmentId,
        orderId: systemId,
        carrier: data.provider,
        service: data.serviceType,
        packagingSystemId: data.packagingId,
        status: 'PENDING',
      },
    });

    const updated = await prisma.order.update({
      where: { systemId },
      data: {
        status: 'SHIPPING',
      },
      include: { shipments: true },
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    logError('Failed to create shipment', error);
    return { success: false, error: 'Không thể tạo vận đơn' };
  }
}

/**
 * Cancel shipment
 */
export async function cancelShipment(
  orderSystemId: string
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('edit_shipments')
  if (!authResult.success) return authResult

  try {
    // Find active shipment and cancel it
    await prisma.shipment.updateMany({
      where: {
        orderSystemId,
        status: { notIn: ['CANCELLED', 'DELIVERED'] },
      },
      data: {
        status: 'CANCELLED',
      },
    });

    const order = await prisma.order.findUnique({
      where: { systemId: orderSystemId },
      include: { shipments: true },
    });

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' };
    }

    revalidatePath('/orders');
    revalidatePath(`/orders/${orderSystemId}`);
    return { success: true, data: order };
  } catch (error) {
    logError('Failed to cancel shipment', error);
    return { success: false, error: 'Không thể hủy vận đơn' };
  }
}

/**
 * Mark order as delivered
 */
export async function markOrderDelivered(
  systemId: string
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult

  try {
    const updated = await prisma.order.update({
      where: { systemId },
      data: {
        status: 'DELIVERED',
      },
    });

    // Also update shipment status
    await prisma.shipment.updateMany({
      where: {
        orderSystemId: systemId,
        status: { notIn: ['CANCELLED', 'DELIVERED'] },
      },
      data: {
        status: 'DELIVERED',
      },
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    logError('Failed to mark delivered', error);
    return { success: false, error: 'Không thể đánh dấu đã giao' };
  }
}

/**
 * Complete order
 */
export async function completeOrder(
  systemId: string
): Promise<ActionResult<Order>> {
  const authResult = await requireActionPermission('edit_orders')
  if (!authResult.success) return authResult

  try {
    const updated = await prisma.order.update({
      where: { systemId },
      data: {
        status: 'COMPLETED',
        completedDate: new Date(),
      },
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    logError('Failed to complete order', error);
    return { success: false, error: 'Không thể hoàn thành đơn' };
  }
}

// ====================================
// BULK ASSIGN PACKAGING EMPLOYEE
// ====================================

export type BulkAssignPackagingInput = {
  packagingSystemIds: string[]
  assignedEmployeeId: string
  assignedEmployeeName: string
}

/**
 * Assign an employee to multiple packaging slips at once
 */
export async function bulkAssignPackagingAction(
  input: BulkAssignPackagingInput
): Promise<ActionResult<{ assigned: number; failed: Array<{ systemId: string; error: string }> }>> {
  const authResult = await requireActionPermission('edit_packaging')
  if (!authResult.success) return authResult

  const { packagingSystemIds, assignedEmployeeId, assignedEmployeeName } = input

  if (!packagingSystemIds.length) {
    return { success: false, error: 'Không có phiếu đóng gói nào được chọn' }
  }

  if (!assignedEmployeeId) {
    return { success: false, error: 'Vui lòng chọn nhân viên' }
  }

  const failed: Array<{ systemId: string; error: string }> = []
  let assigned = 0

  try {
    await prisma.$transaction(async (tx) => {
      for (const systemId of packagingSystemIds) {
        const packaging = await tx.packaging.findUnique({ where: { systemId } })

        if (!packaging) {
          failed.push({ systemId, error: 'Phiếu không tồn tại' })
          continue
        }

        if (packaging.status !== 'PENDING') {
          failed.push({ systemId, error: 'Chỉ gán NV cho phiếu chờ đóng gói' })
          continue
        }

        await tx.packaging.update({
          where: { systemId },
          data: { assignedEmployeeId, assignedEmployeeName },
        })

        assigned++
      }
    })

    revalidatePath('/packaging')

    return { success: true, data: { assigned, failed } }
  } catch (error) {
    logError('bulkAssignPackagingAction error', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Lỗi khi gán nhân viên hàng loạt',
    }
  }
}
