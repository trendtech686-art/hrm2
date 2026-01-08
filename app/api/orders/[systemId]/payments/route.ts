import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId]/payments - List payments for order
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const payments = await prisma.orderPayment.findMany({
      where: { orderId: systemId },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return apiError('Failed to fetch payments', 500);
  }
}

// POST /api/orders/[systemId]/payments - Add payment to order
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { amount, paymentMethodId, note, employeeSystemId } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return apiError('Invalid payment amount', 400);
    }

    // Get the order
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: { payments: true },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    // Calculate paid amount
    const paidAmount = order.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const remainingAmount = Number(order.grandTotal || 0) - paidAmount;

    if (amount > remainingAmount) {
      return apiError(`Payment amount exceeds remaining balance of ${remainingAmount}`, 400);
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

    return apiSuccess(updatedOrder);
  } catch (error) {
    console.error('Error adding payment:', error);
    return apiError('Failed to add payment', 500);
  }
}
