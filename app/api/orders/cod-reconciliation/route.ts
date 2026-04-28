import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface ShipmentReconciliation {
  systemId: string;
  orderSystemId: string;
  codAmount: number;
}

// POST /api/orders/cod-reconciliation - Confirm COD reconciliation for multiple shipments
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json();
    const { shipments } = body as { shipments: ShipmentReconciliation[] };

    if (!shipments || !Array.isArray(shipments) || shipments.length === 0) {
      return apiError('Shipments array is required', 400);
    }

    const userName = session.user?.employee?.fullName || session.user?.name || 'Hệ thống';

    // Transaction: reconcile all shipments
    const result = await prisma.$transaction(async (tx) => {
      const updatedOrders: { systemId: string }[] = [];

      for (const shipment of shipments) {
        // Update packaging as reconciled
        await tx.packaging.update({
          where: { systemId: shipment.systemId },
          data: {
            reconciliationStatus: 'Đã đối soát',
          },
        });

        // Update order payment status if COD amount matches remaining balance
        const order = await tx.order.findUnique({
          where: { systemId: shipment.orderSystemId },
          select: {
            systemId: true,
            id: true,
            grandTotal: true,
            paidAmount: true,
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
          },
        });

        if (order) {
          const paidAmount = order.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
          const newPaidAmount = paidAmount + shipment.codAmount;
          const isPaidFull = newPaidAmount >= Number(order.grandTotal || 0);

          // Create payment record for COD
          const paymentId = await generateIdWithPrefix('PM', tx as unknown as typeof prisma);
          await tx.orderPayment.create({
            data: {
              id: paymentId,
              orderId: order.systemId,
              amount: shipment.codAmount,
              method: 'COD',
              description: `Đối soát COD - Tiền thu hộ`,
              createdBy: session.user?.id || 'system',
            },
          });

          // Update order
          const updated = await tx.order.update({
            where: { systemId: order.systemId },
            data: {
              paidAmount: newPaidAmount,
              paymentStatus: isPaidFull ? 'PAID' : 'PARTIAL',
            },
          });

          updatedOrders.push({ systemId: updated.systemId });
        }
      }

      return updatedOrders;
    });

    // Log activity for each order
    for (const shipment of shipments) {
      await createActivityLog({
        entityType: 'order',
        entityId: shipment.orderSystemId,
        action: `Đối soát COD - ${new Intl.NumberFormat('vi-VN').format(shipment.codAmount)}đ`,
        actionType: 'status',
        metadata: { userName },
      }).catch(e => logError('[COD Reconciliation] activity log failed', e));
    }

    return apiSuccess({
      receiptsCreated: result.length,
      ordersUpdated: result.length,
    });
  } catch (error) {
    logError('Error reconciling COD', error);
    return apiError('Failed to reconcile COD', 500);
  }
}
