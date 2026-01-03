import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/cancel-delivery - Cancel delivery and optionally restock
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId, packagingId } = await params;
    const body = await request.json();
    const { reason, restockItems } = body;

    // Get the packaging with order
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: {
        order: {
          include: {
            lineItems: true,
          },
        },
      },
    });

    if (!packaging) {
      return NextResponse.json({ error: 'Packaging not found' }, { status: 404 });
    }

    if (packaging.orderId !== systemId) {
      return NextResponse.json({ error: 'Packaging does not belong to this order' }, { status: 400 });
    }

    // Transaction: cancel delivery
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Update packaging
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          cancelDate: new Date(),
          cancelReason: reason,
          status: 'CANCELLED',
        },
      });

      // Restock items if requested - update ProductInventory
      if (restockItems && packaging.order.lineItems.length > 0) {
        for (const item of packaging.order.lineItems) {
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: packaging.order.branchId,
              },
            },
            update: {
              onHand: { increment: item.quantity },
            },
            create: {
              productId: item.productId,
              branchId: packaging.order.branchId,
              onHand: item.quantity,
            },
          });
        }
      }

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { status: 'CANCELLED' },
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
    console.error('Error cancelling delivery:', error);
    return NextResponse.json({ error: 'Failed to cancel delivery' }, { status: 500 });
  }
}
