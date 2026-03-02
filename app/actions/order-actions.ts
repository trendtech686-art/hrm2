'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

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

      // Restock items if requested
      if (data.restockItems && order.lineItems.length > 0) {
        for (const item of order.lineItems) {
          if (item.productId) {
            const inventory = await tx.productInventory.findFirst({
              where: {
                productId: item.productId,
                branchId: order.branchId,
              },
            });
            if (inventory) {
              await tx.productInventory.update({
                where: {
                  productId_branchId: {
                    productId: inventory.productId,
                    branchId: inventory.branchId,
                  },
                },
                data: {
                  onHand: { increment: item.quantity },
                },
              });
            }
          }
        }
      }

      return updatedOrder;
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to cancel order:', error);
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
    console.error('Failed to add payment:', error);
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

    const updated = await prisma.order.update({
      where: { systemId },
      data: {
        status: status as 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'PACKING' | 'PACKED' | 'READY_FOR_PICKUP' | 'SHIPPING' | 'DELIVERED' | 'COMPLETED' | 'FAILED_DELIVERY' | 'RETURNED' | 'CANCELLED',
        ...(status === 'COMPLETED' && { completedDate: new Date() }),
      },
    });

    revalidatePath('/orders');
    revalidatePath(`/orders/${systemId}`);
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update status:', error);
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
    console.error('Failed to create packaging:', error);
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
    console.error('Failed to confirm packaging:', error);
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
    console.error('Failed to create shipment:', error);
    return { success: false, error: 'Không thể tạo vận đơn' };
  }
}

/**
 * Cancel shipment
 */
export async function cancelShipment(
  orderSystemId: string
): Promise<ActionResult<Order>> {
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
    console.error('Failed to cancel shipment:', error);
    return { success: false, error: 'Không thể hủy vận đơn' };
  }
}

/**
 * Mark order as delivered
 */
export async function markOrderDelivered(
  systemId: string
): Promise<ActionResult<Order>> {
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
    console.error('Failed to mark delivered:', error);
    return { success: false, error: 'Không thể đánh dấu đã giao' };
  }
}

/**
 * Complete order
 */
export async function completeOrder(
  systemId: string
): Promise<ActionResult<Order>> {
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
    console.error('Failed to complete order:', error);
    return { success: false, error: 'Không thể hoàn thành đơn' };
  }
}
