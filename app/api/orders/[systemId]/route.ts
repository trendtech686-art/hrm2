import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId] - Get single order
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        customer: true,
        branch: true,
        lineItems: {
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                imageUrl: true,
                sellingPrice: true,
              },
            },
          },
        },
        payments: true,
        packagings: {
          include: {
            assignedEmployee: true,
            shipment: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PATCH /api/orders/[systemId] - Update order
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json();

    const order = await prisma.order.update({
      where: { systemId },
      data: body,
      include: {
        customer: true,
        lineItems: {
          include: { product: true },
        },
        payments: true,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE /api/orders/[systemId] - Delete order (soft delete via status)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    await prisma.order.update({
      where: { systemId },
      data: { 
        status: 'CANCELLED',
        cancelledDate: new Date(),
        cancellationReason: 'Deleted by user',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
