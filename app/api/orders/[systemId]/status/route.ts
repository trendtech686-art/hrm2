import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { updateCustomerDebt } from '@/lib/services/customer-debt-service';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// Valid status transitions
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['PACKING', 'CANCELLED'],
  PACKING: ['PACKED', 'CANCELLED'],
  PACKED: ['SHIPPING', 'READY_FOR_PICKUP', 'CANCELLED'],
  READY_FOR_PICKUP: ['DELIVERED', 'COMPLETED', 'CANCELLED'],
  SHIPPING: ['DELIVERED', 'FAILED_DELIVERY', 'CANCELLED'],
  DELIVERED: ['COMPLETED', 'RETURNED'],
  COMPLETED: ['RETURNED'],
  FAILED_DELIVERY: ['SHIPPING', 'CANCELLED', 'RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

// PATCH /api/orders/[systemId]/status - Update order status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return apiError('Status is required', 400);
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { systemId },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    // Validate status transition
    const allowedStatuses = validTransitions[order.status] || [];
    if (!allowedStatuses.includes(status as OrderStatus)) {
      return apiError(`Cannot transition from ${order.status} to ${status}`, 400);
    }

    // Update timestamps based on status
    const statusTimestamps: Partial<Record<OrderStatus, object>> = {
      CONFIRMED: { approvedDate: new Date() },
      DELIVERED: { completedDate: new Date() },
      COMPLETED: { completedDate: new Date() },
      CANCELLED: { cancelledDate: new Date() },
    };

    const updatedOrder = await prisma.order.update({
      where: { systemId },
      data: {
        status: status as OrderStatus,
        ...statusTimestamps[status as OrderStatus],
      },
      include: {
        customer: true,
        lineItems: {
          include: { product: true },
        },
        payments: true,
      },
    });

    // ✅ Update customer debt when order is DELIVERED or COMPLETED
    const debtAffectingStatuses: OrderStatus[] = ['DELIVERED', 'COMPLETED'];
    if (debtAffectingStatuses.includes(status as OrderStatus) && updatedOrder.customer?.systemId) {
      await updateCustomerDebt(updatedOrder.customer.systemId).catch(err => {
        console.error('[Order Status] Failed to update customer debt:', err);
      });
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return apiError('Failed to update order status', 500);
  }
}
