import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/start-shipping - Start shipping (after stock out)
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      select: {
        systemId: true,
        orderId: true,
        deliveryStatus: true,
        order: {
          select: {
            systemId: true,
            id: true,
            branchId: true,
          },
        },
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    // Must be in PENDING_SHIP state (after stock out)
    if (packaging.deliveryStatus !== 'PENDING_SHIP') {
      return apiError('Đơn hàng chưa được xuất kho hoặc đã bắt đầu giao', 400);
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: { deliveryStatus: 'SHIPPING' },
      });

      const updated = await tx.order.update({
        where: { systemId },
        data: {
          status: 'SHIPPING',
          deliveryStatus: 'SHIPPING',
        },
        select: {
          systemId: true,
          id: true,
          status: true,
          deliveryStatus: true,
          stockOutStatus: true,
          branchId: true,
          customerId: true,
          customerName: true,
          salespersonId: true,
          salespersonName: true,
          grandTotal: true,
          paidAmount: true,
          paymentStatus: true,
          deliveryMethod: true,
          shippingCarrier: true,
          trackingCode: true,
          notes: true,
          shippingFee: true,
          createdAt: true,
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
              address: true,
            },
          },
          lineItems: {
            select: {
              systemId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              unitPrice: true,
              discount: true,
              total: true,
              product: {
                select: {
                  systemId: true,
                  barcode: true,
                  name: true,
                  thumbnailImage: true,
                },
              },
            },
          },
          payments: {
            select: {
              systemId: true,
              amount: true,
              method: true,
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              status: true,
              confirmDate: true,
              cancelDate: true,
              deliveryStatus: true,
              trackingCode: true,
              carrier: true,
              assignedEmployeeId: true,
              assignedEmployeeName: true,
              assignedEmployee: {
                select: {
                  systemId: true,
                  fullName: true,
                },
              },
              shipment: {
                select: {
                  systemId: true,
                  trackingCode: true,
                  status: true,
                  carrier: true,
                },
              },
            },
          },
        },
      });

      return updated;
    });

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Bắt đầu giao hàng ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[StartShipping] activity log failed', e));

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error starting shipping', error);
    return apiError('Không thể bắt đầu giao hàng', 500);
  }
}
