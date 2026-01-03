import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/cancel - Cancel packaging request
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId, packagingId } = await params;
    const body = await request.json();
    const { reason } = body;

    // Get the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
    });

    if (!packaging) {
      return NextResponse.json({ error: 'Packaging not found' }, { status: 404 });
    }

    if (packaging.orderId !== systemId) {
      return NextResponse.json({ error: 'Packaging does not belong to this order' }, { status: 400 });
    }

    if (packaging.confirmDate) {
      return NextResponse.json({ error: 'Cannot cancel completed packaging' }, { status: 400 });
    }

    if (packaging.cancelDate) {
      return NextResponse.json({ error: 'Packaging already cancelled' }, { status: 400 });
    }

    // Transaction: cancel packaging and update order status
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          status: 'CANCELLED',
          cancelDate: new Date(),
          cancelReason: reason,
        },
      });

      // Update order status back to CONFIRMED
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'CONFIRMED' },
        include: {
          customer: true,
          lineItems: {
            include: { product: true },
          },
          payments: true,
          packagings: {
            include: {
              assignedEmployee: true,
              shipment: true,
            },
          },
        },
      });

      return updated;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error cancelling packaging:', error);
    return NextResponse.json({ error: 'Failed to cancel packaging' }, { status: 500 });
  }
}
