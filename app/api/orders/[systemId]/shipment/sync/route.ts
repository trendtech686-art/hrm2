import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// POST /api/orders/[systemId]/shipment/sync - Sync shipment status from provider
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    // Get order with shipment
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        packagings: {
          include: { shipment: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const activePackaging = order.packagings.find((p) => !p.cancelDate);
    const shipment = activePackaging?.shipment;

    if (!shipment) {
      return NextResponse.json({ error: 'No shipment found for order' }, { status: 404 });
    }

    // TODO: Call external shipping provider API to get status
    // This is a placeholder - actual implementation depends on shipping provider
    // For now, just return current status

    const updatedOrder = await prisma.order.findUnique({
      where: { systemId },
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

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error syncing shipment:', error);
    return NextResponse.json({ error: 'Failed to sync shipment' }, { status: 500 });
  }
}
