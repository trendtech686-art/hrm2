import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/ghtk - Create GHTK shipment
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId, packagingId } = await params;
    const _body = await request.json();

    // Get the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: {
        order: {
          include: { customer: true },
        },
      },
    });

    if (!packaging) {
      return NextResponse.json({ error: 'Packaging not found' }, { status: 404 });
    }

    if (packaging.orderId !== systemId) {
      return NextResponse.json({ error: 'Packaging does not belong to this order' }, { status: 400 });
    }

    // TODO: Call GHTK API to create shipment
    // This is a placeholder - actual implementation needs GHTK API integration
    const ghtkResponse = {
      success: true,
      trackingCode: `GHTK${Date.now()}`,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    };

    // Transaction: create shipment with GHTK data
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Generate shipment systemId
      const shipmentId = `SH${Date.now()}`;
      
      // Create shipment
      await tx.shipment.create({
        data: {
          systemId: shipmentId,
          id: shipmentId,
          orderId: packaging.orderId,
          packagingSystemId: packaging.systemId,
          carrier: 'GHTK',
          trackingCode: ghtkResponse.trackingCode,
          estimatedDeliverTime: ghtkResponse.estimatedDelivery,
          status: 'PENDING',
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'SHIPPING' },
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
    console.error('Error creating GHTK shipment:', error);
    return NextResponse.json({ error: 'Failed to create GHTK shipment' }, { status: 500 });
  }
}

// DELETE /api/orders/[systemId]/packaging/[packagingId]/ghtk - Cancel GHTK shipment
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId, packagingId } = await params;
    const { searchParams } = new URL(request.url);
    const trackingCode = searchParams.get('trackingCode');

    if (!trackingCode) {
      return NextResponse.json({ error: 'Tracking code is required' }, { status: 400 });
    }

    // Get the packaging with shipment
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: { shipment: true },
    });

    if (!packaging) {
      return NextResponse.json({ error: 'Packaging not found' }, { status: 404 });
    }

    if (packaging.orderId !== systemId) {
      return NextResponse.json({ error: 'Packaging does not belong to this order' }, { status: 400 });
    }

    if (!packaging.shipment || packaging.shipment.trackingCode !== trackingCode) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // TODO: Call GHTK API to cancel shipment
    // This is a placeholder - actual implementation needs GHTK API integration

    // Transaction: cancel shipment
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update shipment
      await tx.shipment.update({
        where: { systemId: packaging.shipment!.systemId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
        },
      });

      // Update order status back to PACKED
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'PACKED' },
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
    console.error('Error cancelling GHTK shipment:', error);
    return NextResponse.json({ error: 'Failed to cancel GHTK shipment' }, { status: 500 });
  }
}
