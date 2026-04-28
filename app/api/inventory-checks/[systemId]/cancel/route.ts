/**
 * Inventory Check Cancel API Route
 * 
 * POST /api/inventory-checks/[systemId]/cancel - Cancel an inventory check
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound, validateBody } from '@/lib/api-utils';
import { cancelInventoryCheckSchema } from '../../validation';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Cancel inventory check
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, cancelInventoryCheckSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }

  const { reason, cancelledBy } = validation.data;

  try {
    const { systemId } = await params;

    // Get the inventory check
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    });

    if (!inventoryCheck) {
      return apiNotFound('Inventory check');
    }

    // Validate status - only DRAFT can be cancelled
    const currentStatus = String(inventoryCheck.status).toUpperCase();
    if (currentStatus !== 'DRAFT') {
      return apiError(`Chỉ có thể hủy phiếu ở trạng thái Nháp. Trạng thái hiện tại: ${inventoryCheck.status}`, 400);
    }

    // Use raw SQL to update status to avoid enum issues
    await prisma.$executeRaw`
      UPDATE inventory_checks
      SET status = 'CANCELLED',
          "cancelledAt" = NOW(),
          "cancelledBy" = ${cancelledBy || session!.user?.id || null},
          "cancelledReason" = ${reason || null},
          "updatedAt" = NOW()
      WHERE "systemId" = ${systemId}
    `;

    // Fetch the updated record
    const updatedCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        branchId: true,
        employeeId: true,
        checkDate: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        branchSystemId: true,
        branchName: true,
        balancedAt: true,
        balancedBy: true,
        cancelledAt: true,
        cancelledBy: true,
        cancelledReason: true,
        linkedComplaintSystemId: true,
        items: {
          select: {
            systemId: true,
            checkId: true,
            productId: true,
            productSystemId: true,
            productName: true,
            productSku: true,
            unit: true,
            systemQty: true,
            actualQty: true,
            difference: true,
            reason: true,
            notes: true,
          },
        },
      },
    });

    // Notify the assigned employee about cancellation
    if (inventoryCheck.employeeId && inventoryCheck.employeeId !== session!.user?.employeeId) {
      createNotification({
        type: 'inventory_check',
        settingsKey: 'inventory-check:updated',
        title: 'Kiểm kho bị hủy',
        message: `Phiếu kiểm kho ${inventoryCheck.id || systemId} đã bị hủy${reason ? `: ${reason}` : ''}`,
        link: `/inventory-checks/${systemId}`,
        recipientId: inventoryCheck.employeeId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Inventory Check Cancel] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_check',
          entityId: systemId,
          action: 'cancelled',
          actionType: 'update',
          note: `Hủy phiếu kiểm kê`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_check cancelled failed', e))
    return apiSuccess(updatedCheck);
  } catch (error) {
    logError('[Inventory Checks API] Cancel error', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return apiError(`Lỗi khi hủy phiếu kiểm kê: ${errorMessage}`, 500);
  }
}
