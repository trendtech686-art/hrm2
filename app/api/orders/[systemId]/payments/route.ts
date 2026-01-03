import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId]/payments - List payments for order
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;

    const payments = await prisma.orderPayment.findMany({
      where: { orderId: systemId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

// POST /api/orders/[systemId]/payments - Add payment to order
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { systemId } = await params;
    const body = await request.json();
    const { amount, paymentMethodId, note, employeeSystemId } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: { payments: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Calculate paid amount
    const paidAmount = order.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const remainingAmount = Number(order.grandTotal || 0) - paidAmount;

    if (amount > remainingAmount) {
      return NextResponse.json(
        { error: `Payment amount exceeds remaining balance of ${remainingAmount}` },
        { status: 400 }
      );
    }

    // Transaction: add payment and update order
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Create payment - generate ID
      const paymentId = `PM${Date.now()}`;
      await tx.orderPayment.create({
        data: {
          id: paymentId,
          orderId: systemId,
          amount,
          method: paymentMethodId || 'CASH',
          description: note,
          createdBy: employeeSystemId || 'system',
        },
      });

      // Update order paid amount and status
      const newPaidAmount = paidAmount + amount;
      const isPaidFull = newPaidAmount >= Number(order.grandTotal || 0);

      const updated = await tx.order.update({
        where: { systemId },
        data: {
          paidAmount: newPaidAmount,
          paymentStatus: isPaidFull ? 'PAID' : 'PARTIAL',
        },
        include: {
          customer: true,
          lineItems: {
            include: { product: true },
          },
          payments: true,
        },
      });

      // Note: Cashbook entry should be handled separately if needed

      return updated;
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error adding payment:', error);
    return NextResponse.json({ error: 'Failed to add payment' }, { status: 500 });
  }
}
