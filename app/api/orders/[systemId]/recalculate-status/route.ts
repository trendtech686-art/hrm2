import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { OrderStatus, DeliveryStatus, StockOutStatus, PaymentStatus } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// POST /api/orders/[systemId]/recalculate-status - Recalculate and fix order status
// Call this when order status seems incorrect
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Get the order with payments
    const order = await prisma.order.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        status: true,
        paymentStatus: true,
        deliveryStatus: true,
        stockOutStatus: true,
        grandTotal: true,
        paidAmount: true,
        linkedSalesReturnValue: true,
        payments: {
          select: {
            systemId: true,
            id: true,
            orderId: true,
            amount: true,
            method: true,
            description: true,
            createdBy: true,
            createdAt: true,
          },
        },
        packagings: {
          select: {
            systemId: true,
            id: true,
            status: true,
            deliveryStatus: true,
            assignedEmployeeId: true,
            assignedEmployeeName: true,
            shipment: {
              select: {
                systemId: true,
                id: true,
                status: true,
                carrier: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    // Skip if already completed or cancelled
    if (order.status === OrderStatus.COMPLETED || order.status === OrderStatus.CANCELLED) {
      return apiSuccess({ 
        message: 'Order status is already final', 
        order,
        changed: false,
      });
    }

    // Calculate payment status
    const totalPaid = order.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const grandTotal = Number(order.grandTotal || 0);
    const linkedReturnValue = Number(order.linkedSalesReturnValue || 0);
    const netGrandTotal = Math.max(0, grandTotal - linkedReturnValue);
    const isFullyPaid = totalPaid >= netGrandTotal;

    // Check if delivered
    const isDelivered = order.deliveryStatus === DeliveryStatus.DELIVERED ||
                        order.status === OrderStatus.DELIVERED ||
                        order.stockOutStatus === StockOutStatus.FULLY_STOCKED_OUT;

    // Determine correct status
    let newStatus: OrderStatus = order.status;
    if (isFullyPaid && isDelivered) {
      newStatus = OrderStatus.COMPLETED;
    } else if (isDelivered && !isFullyPaid) {
      newStatus = OrderStatus.DELIVERED;
    }

    // Update if changed
    if (newStatus !== order.status) {
      const updated = await prisma.order.update({
        where: { systemId },
        data: {
          status: newStatus,
          ...(newStatus === OrderStatus.COMPLETED && { completedDate: new Date() }),
          paidAmount: totalPaid,
          paymentStatus: isFullyPaid ? PaymentStatus.PAID : (totalPaid > 0 ? PaymentStatus.PARTIAL : PaymentStatus.UNPAID),
        },
        select: {
          systemId: true,
          id: true,
          status: true,
          paymentStatus: true,
          deliveryStatus: true,
          completedDate: true,
          paidAmount: true,
          customerId: true,
          customerName: true,
          branchId: true,
          salespersonId: true,
          grandTotal: true,
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
            },
          },
          lineItems: {
            select: {
              systemId: true,
              productId: true,
              productSku: true,
              productName: true,
              quantity: true,
              unitPrice: true,
              discount: true,
              tax: true,
              total: true,
              note: true,
              product: {
                select: {
                  systemId: true,
                  id: true,
                  name: true,
                  thumbnailImage: true,
                },
              },
            },
          },
          payments: {
            select: {
              systemId: true,
              id: true,
              orderId: true,
              amount: true,
              method: true,
              description: true,
              createdBy: true,
              createdAt: true,
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              status: true,
              deliveryStatus: true,
              assignedEmployeeId: true,
              assignedEmployeeName: true,
              shipment: {
                select: {
                  systemId: true,
                  id: true,
                  status: true,
                  carrier: true,
                },
              },
            },
          },
        },
      });

      return apiSuccess({ 
        message: `Order status updated from ${order.status} to ${newStatus}`,
        order: updated,
        changed: true,
        calculation: {
          totalPaid,
          netGrandTotal,
          isFullyPaid,
          isDelivered,
        },
      });
    }

    return apiSuccess({ 
      message: 'Order status is correct',
      order,
      changed: false,
      calculation: {
        totalPaid,
        netGrandTotal,
        isFullyPaid,
        isDelivered,
      },
    });
  } catch (error) {
    logError('Error recalculating order status', error);
    return apiError('Failed to recalculate order status', 500);
  }
}
