import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@/generated/prisma/client';

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
  try {
    const { systemId } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { systemId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Validate status transition
    const allowedStatuses = validTransitions[order.status] || [];
    if (!allowedStatuses.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${order.status} to ${status}` },
        { status: 400 }
      );
    }

    // Update timestamps based on status
    const statusTimestamps: Partial<Record<OrderStatus, object>> = {
      CONFIRMED: { approvedDate: new Date() },
      DELIVERED: { completedDate: new Date() },
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

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
