import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound, validateBody, validateQuery } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { z } from 'zod';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// Validation schema for POST GHTK request
const createGhtkShipmentSchema = z.object({
  trackingCode: z.string().min(1, 'trackingCode is required'),
  trackingId: z.string().optional(),
  estimatedPickTime: z.string().datetime().optional(),
  estimatedDeliverTime: z.string().datetime().optional(),
  shippingFee: z.number().optional(),
  weight: z.number().optional(),
  dimensions: z.any().optional(),
  codAmount: z.number().optional(),
  payer: z.string().optional(),
  service: z.string().optional(),
})

// Validation schema for DELETE GHTK request
const cancelGhtkShipmentQuerySchema = z.object({
  trackingCode: z.string().min(1, 'Tracking code is required'),
})

// POST /api/orders/[systemId]/packaging/[packagingId]/ghtk - Create GHTK shipment
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

    const validation = await validateBody(request, createGhtkShipmentSchema);
    if (!validation.success) return apiError(validation.error, 400);
    const { trackingCode, trackingId, estimatedPickTime, estimatedDeliverTime, shippingFee, weight, dimensions, codAmount, payer, service } = validation.data;

    // Get the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      select: {
        systemId: true,
        orderId: true,
        trackingCode: true,
        order: {
          select: {
            systemId: true,
            id: true,
            branchId: true,
            customer: {
              select: {
                systemId: true,
                id: true,
                name: true,
                phone: true,
                address: true,
              },
            },
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

    if (!packaging.order) {
      return apiError('Packaging không thuộc đơn hàng nào', 400);
    }
    
    // Check if packaging already has a shipment
    const existingShipment = await prisma.shipment.findUnique({
      where: { packagingSystemId: packagingId },
    });
    
    if (existingShipment) {
      return apiError('Phiếu đóng gói này đã có đơn vận chuyển', 400);
    }

    // Transaction: create shipment with GHTK data
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Get last shipment systemId to generate next one sequentially
      const lastShipment = await tx.shipment.findFirst({
        orderBy: { systemId: 'desc' },
        select: { systemId: true },
        where: { systemId: { startsWith: 'SHIPMENT' } },
      });
      const lastNum = lastShipment?.systemId 
        ? parseInt(lastShipment.systemId.replace('SHIPMENT', '')) || 0
        : 0;
      const shipmentId = `SHIPMENT${String(lastNum + 1).padStart(6, '0')}`;
      
      // Create shipment
      await tx.shipment.create({
        data: {
          systemId: shipmentId,
          id: shipmentId,
          orderId: packaging.orderId!,
          packagingSystemId: packaging.systemId,
          carrier: 'GHTK',
          trackingCode: trackingCode,
          estimatedDeliverTime: estimatedDeliverTime ? new Date(estimatedDeliverTime) : null,
          status: 'PENDING',
        },
      });
      
      // Update packaging with GHTK info
      await tx.packaging.update({
        where: { systemId: packagingId },
        data: {
          trackingCode: trackingCode,
          ghtkTrackingId: trackingId != null ? String(trackingId) : null,
          estimatedPickTime: estimatedPickTime ? new Date(estimatedPickTime) : null,
          estimatedDeliverTime: estimatedDeliverTime ? new Date(estimatedDeliverTime) : null,
          shippingFeeToPartner: shippingFee != null ? String(shippingFee) : undefined,
          weight: weight,
          dimensions: dimensions,
          codAmount: codAmount != null ? String(codAmount) : undefined,
          payer: payer,
          service: service,
          carrier: 'GHTK',
          deliveryMethod: 'SHIPPING', // ✅ Use enum value
          deliveryStatus: 'PENDING_SHIP', // ✅ Use enum value - enables action buttons
          partnerStatus: 'Chờ lấy hàng',
          ghtkStatusId: 1,
          lastSyncedAt: new Date(),
        },
      });

      // Update order status
      const updated = await tx.order.update({
        where: { systemId },
        data: { 
          status: 'SHIPPING',
          trackingCode: trackingCode,
          shippingCarrier: 'GHTK',
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
      action: `Tạo vận đơn GHTK - ${updatedOrder.id || systemId} - Mã vận đơn: ${trackingCode}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[GHTK Create] activity log failed', e));

    // Notify salesperson about GHTK shipment created
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:packaging',
        title: 'Tạo vận đơn GHTK',
        message: `Đơn hàng ${updatedOrder.id || systemId} đã tạo vận đơn GHTK: ${trackingCode}`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[GHTK Create] notification failed', e));
    }

    return apiSuccess({ 
      success: true, 
      message: 'Đã tạo đơn vận chuyển GHTK thành công',
      trackingCode,
      order: updatedOrder,
    });
  } catch (error) {
    logError('Error creating GHTK shipment', error);
    return apiError('Failed to create GHTK shipment', 500);
  }
}

// DELETE /api/orders/[systemId]/packaging/[packagingId]/ghtk - Cancel GHTK shipment
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;
    const { searchParams } = new URL(request.url);
    const validation = await validateQuery(searchParams, cancelGhtkShipmentQuerySchema);
    if (!validation.success) return apiError(validation.error, 400);
    const { trackingCode } = validation.data;

    // Get the packaging with shipment
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      select: {
        systemId: true,
        orderId: true,
        shipment: {
          select: {
            systemId: true,
            trackingCode: true,
            status: true,
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

    if (!packaging.shipment || packaging.shipment.trackingCode !== trackingCode) {
      return apiNotFound('Shipment');
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
      action: `Hủy vận đơn GHTK - ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[GHTK Cancel] activity log failed', e));

    // Notify salesperson about GHTK shipment cancelled
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:packaging',
        title: 'Hủy vận đơn GHTK',
        message: `Vận đơn GHTK của đơn hàng ${updatedOrder.id || systemId} đã bị hủy`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[GHTK Cancel] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error cancelling GHTK shipment', error);
    return apiError('Failed to cancel GHTK shipment', 500);
  }
}
