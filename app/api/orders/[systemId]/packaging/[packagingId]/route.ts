import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { requireAuth, validateBody, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

// PATCH validation schema
const patchPackagingSchema = z.object({
  // Status fields
  status: z.string().optional(),
  printStatus: z.string().optional(),
  deliveryMethod: z.string().optional(),
  deliveryStatus: z.string().optional(),
  // Carrier & tracking
  carrier: z.string().optional(),
  service: z.string().optional(),
  trackingCode: z.string().optional(),
  partnerStatus: z.string().optional(),
  // Shipping details
  shippingFeeToPartner: z.number().optional(),
  codAmount: z.number().optional(),
  weight: z.number().optional(),
  dimensions: z.string().optional(),
  // People
  confirmingEmployeeId: z.string().optional(),
  confirmingEmployeeName: z.string().optional(),
  assignedEmployeeId: z.string().optional(),
  assignedEmployeeName: z.string().optional(),
  cancelReason: z.string().optional(),
  // Requestor info
  requestorName: z.string().optional(),
  requestorPhone: z.string().optional(),
  requestorId: z.string().optional(),
  // Dates (ISO strings)
  requestDate: z.string().optional(),
  confirmDate: z.string().optional(),
  cancelDate: z.string().optional(),
  deliveredDate: z.string().optional(),
  estimatedPickTime: z.string().optional(),
  estimatedDeliverTime: z.string().optional(),
  // GHTK sync
  ghtkStatusId: z.string().optional(),
  ghtkTrackingId: z.string().optional(),
  lastSyncedAt: z.string().optional(),
  // Misc
  notes: z.string().optional(),
})

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// GET /api/orders/[systemId]/packaging/[packagingId] - Get packaging details
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { packagingId } = await params;

    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      select: {
        systemId: true,
        id: true,
        orderId: true,
        branchId: true,
        status: true,
        requestDate: true,
        confirmDate: true,
        cancelDate: true,
        deliveredDate: true,
        confirmingEmployeeId: true,
        confirmingEmployeeName: true,
        requestingEmployeeId: true,
        requestingEmployeeName: true,
        cancelingEmployeeId: true,
        cancelingEmployeeName: true,
        cancelReason: true,
        assignedEmployeeId: true,
        assignedEmployeeName: true,
        printStatus: true,
        notes: true,
        deliveryMethod: true,
        deliveryStatus: true,
        carrier: true,
        service: true,
        trackingCode: true,
        partnerStatus: true,
        ghtkStatusId: true,
        shippingFeeToPartner: true,
        codAmount: true,
        weight: true,
        dimensions: true,
        requestorName: true,
        requestorPhone: true,
        requestorId: true,
        ghtkTrackingId: true,
        estimatedPickTime: true,
        estimatedDeliverTime: true,
        lastSyncedAt: true,
        order: {
          select: {
            systemId: true,
            id: true,
            customerId: true,
            customerName: true,
            branchId: true,
            branchName: true,
            status: true,
            grandTotal: true,
          },
        },
        assignedEmployee: {
          select: {
            systemId: true,
            fullName: true,
          },
        },
        shipment: {
          select: {
            systemId: true,
            id: true,
            carrier: true,
            trackingNumber: true,
            trackingCode: true,
            status: true,
            shippingFee: true,
            createdAt: true,
          },
        },
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    // Log activity
    const userName = await getUserNameFromDb(session.user?.id);
    await prisma.activityLog.create({
      data: {
        entityType: 'packaging',
        entityId: packagingId,
        action: 'updated',
        actionType: 'update',
        note: `Cập nhật phiếu đóng gói`,
        metadata: { userName },
        createdBy: userName,
      }
    }).catch(e => logError('[ActivityLog] packaging updated failed', e))

    return apiSuccess(packaging);
  } catch (error) {
    logError('Error fetching packaging', error);
    return apiError('Failed to fetch packaging', 500);
  }
}

// PATCH /api/orders/[systemId]/packaging/[packagingId] - Update packaging
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, patchPackagingSchema);
  if (!validation.success) return apiError(validation.error, 400);
  const body = validation.data;

  try {
    const { packagingId } = await params;

    const packaging = await prisma.packaging.update({
      where: { systemId: packagingId },
      data: body as Parameters<typeof prisma.packaging.update>[0]['data'],
      select: {
        systemId: true,
        id: true,
        orderId: true,
        branchId: true,
        status: true,
        requestDate: true,
        confirmDate: true,
        cancelDate: true,
        deliveredDate: true,
        confirmingEmployeeId: true,
        confirmingEmployeeName: true,
        requestingEmployeeId: true,
        requestingEmployeeName: true,
        cancelingEmployeeId: true,
        cancelingEmployeeName: true,
        cancelReason: true,
        assignedEmployeeId: true,
        assignedEmployeeName: true,
        printStatus: true,
        notes: true,
        deliveryMethod: true,
        deliveryStatus: true,
        carrier: true,
        service: true,
        trackingCode: true,
        partnerStatus: true,
        ghtkStatusId: true,
        shippingFeeToPartner: true,
        codAmount: true,
        weight: true,
        dimensions: true,
        requestorName: true,
        requestorPhone: true,
        requestorId: true,
        ghtkTrackingId: true,
        estimatedPickTime: true,
        estimatedDeliverTime: true,
        lastSyncedAt: true,
        order: {
          select: {
            systemId: true,
            id: true,
            customerId: true,
            customerName: true,
            branchId: true,
            branchName: true,
            status: true,
            grandTotal: true,
          },
        },
        assignedEmployee: {
          select: {
            systemId: true,
            fullName: true,
          },
        },
        shipment: {
          select: {
            systemId: true,
            id: true,
            carrier: true,
            trackingNumber: true,
            trackingCode: true,
            status: true,
            shippingFee: true,
            createdAt: true,
          },
        },
      },
    });

    return apiSuccess(packaging);
  } catch (error) {
    logError('Error updating packaging', error);
    return apiError('Failed to update packaging', 500);
  }
}
