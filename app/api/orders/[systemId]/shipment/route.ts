import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId]/shipment - Get shipment for order
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const shipments = await prisma.shipment.findMany({
      where: {
        orderId: systemId,
      },
      include: {
        packaging: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return apiSuccess(shipments);
  } catch (error) {
    logError('Error fetching shipments', error);
    return apiError('Failed to fetch shipments', 500);
  }
}

// POST /api/orders/[systemId]/shipment - Create shipment
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { provider, serviceType: _serviceType, packagingId } = body;
    

    // Get the order with packaging - look for non-cancelled packagings
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        packagings: {
          where: { cancelDate: null },  // Only exclude cancelled packagings
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    
    if (order?.packagings?.[0]) {
      // Packaging exists - no additional processing needed
    }

    if (!order) {
      return apiNotFound('Order');
    }

    const packaging = packagingId
      ? order.packagings.find((p) => p.systemId === packagingId)
      : order.packagings[0];

    if (!packaging) {
      return apiError('No completed packaging found', 400);
    }
    
    // Check if packaging already has a shipment
    const existingShipment = await prisma.shipment.findUnique({
      where: { packagingSystemId: packaging.systemId },
    });
    
    if (existingShipment) {
      return apiError('Phiếu đóng gói này đã có đơn vận chuyển. Vui lòng hủy đơn vận chuyển hiện tại hoặc sử dụng phiếu đóng gói khác.', 400);
    }

    // Transaction: create shipment
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
      
      // Create shipment - carrier is required, service is not a valid field in Shipment model
      await tx.shipment.create({
        data: {
          systemId: shipmentId,
          id: shipmentId,
          orderId: systemId,
          packagingSystemId: packaging.systemId,
          carrier: provider || 'Unknown',
          status: 'PENDING',
          // Note: serviceType is stored in packaging.service, not shipment
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

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Tạo vận đơn - ${updatedOrder.id || systemId}`,
      actionType: 'status',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Shipment] activity log failed', e));

    // Notify salesperson about new shipment
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'order:shipment',
        title: 'Tạo vận đơn mới',
        message: `Đơn hàng ${updatedOrder.id || systemId} đã tạo vận đơn vận chuyển`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Shipment] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error creating shipment', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError('[Shipment API] Error details', errorMessage);
    return apiError(`Failed to create shipment: ${errorMessage}`, 500);
  }
}
