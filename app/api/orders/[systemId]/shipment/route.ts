import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { z } from 'zod'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// Validation schema for creating shipment
const createShipmentSchema = z.object({
  provider: z.string().optional(),
  serviceType: z.string().optional(),
  packagingId: z.string().optional(),
})

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
      select: {
        systemId: true,
        id: true,
        trackingCode: true,
        orderId: true,
        warrantyId: true,
        carrier: true,
        status: true,
        recipientName: true,
        recipientPhone: true,
        recipientAddress: true,
        shippingFee: true,
        codAmount: true,
        insuranceFee: true,
        weight: true,
        createdAt: true,
        pickedAt: true,
        deliveredAt: true,
        returnedAt: true,
        notes: true,
        failReason: true,
        updatedAt: true,
        createdBy: true,
        trackingNumber: true,
        packagingSystemId: true,
        orderSystemId: true,
        orderBusinessId: true,
        packaging: {
          select: {
            systemId: true,
            id: true,
            orderId: true,
            warrantyId: true,
            sourceType: true,
            branchId: true,
            employeeId: true,
            packDate: true,
            status: true,
            totalItems: true,
            packedItems: true,
            notes: true,
            createdAt: true,
            updatedAt: true,
            createdBy: true,
            requestDate: true,
            confirmDate: true,
            cancelDate: true,
            deliveredDate: true,
            requestingEmployeeId: true,
            requestingEmployeeName: true,
            confirmingEmployeeId: true,
            confirmingEmployeeName: true,
          },
        },
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
    
    // Validate request body with Zod schema
    const validation = await validateBody(request, createShipmentSchema)
    if (!validation.success) {
      return apiError(validation.error, 400)
    }
    const body = validation.data
    const { provider, serviceType: _serviceType, packagingId } = body;
    

    // Get the order with packaging - look for non-cancelled packagings
    const order = await prisma.order.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        status: true,
        paymentStatus: true,
        deliveryStatus: true,
        salespersonId: true,
        customerId: true,
        customerName: true,
        grandTotal: true,
        paidAmount: true,
        customer: {
          select: {
            systemId: true,
            id: true,
            name: true,
            phone: true,
          },
        },
        packagings: {
          where: { cancelDate: null },
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            systemId: true,
            id: true,
            orderId: true,
            requestDate: true,
            confirmDate: true,
            cancelDate: true,
            deliveredDate: true,
            status: true,
            deliveryStatus: true,
            deliveryMethod: true,
            printStatus: true,
            carrier: true,
            service: true,
            trackingCode: true,
            shippingFeeToPartner: true,
            codAmount: true,
            payer: true,
            noteToShipper: true,
            weight: true,
            dimensions: true,
            assignedEmployeeId: true,
            assignedEmployeeName: true,
            createdBy: true,
            createdAt: true,
          },
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
        select: {
          systemId: true,
          id: true,
          status: true,
          paymentStatus: true,
          deliveryStatus: true,
          salespersonId: true,
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
              date: true,
              method: true,
              amount: true,
              description: true,
              createdBy: true,
            },
          },
          packagings: {
            select: {
              systemId: true,
              id: true,
              orderId: true,
              status: true,
              packDate: true,
              totalItems: true,
              packedItems: true,
              cancelDate: true,
              assignedEmployee: {
                select: {
                  systemId: true,
                  id: true,
                  fullName: true,
                },
              },
              shipment: {
                select: {
                  systemId: true,
                  id: true,
                  status: true,
                  carrier: true,
                },
              },
            },
            where: { cancelDate: null },
            orderBy: { createdAt: 'desc' },
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
