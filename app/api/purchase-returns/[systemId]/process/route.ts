/**
 * Purchase Return Process Route
 * 
 * POST /api/purchase-returns/:systemId/process
 * 
 * Processes an approved purchase return:
 * - Updates status to COMPLETED
 * - Records processing timestamp
 * - Adds activity history entry
 * 
 * Note: Inventory and supplier balance are already updated when status changes to APPROVED.
 * This endpoint is for marking the administrative/financial processing as complete.
 */

import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { apiHandler } from '@/lib/api-handler';
import { PurchaseReturnStatus } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'

// POST - Process approved purchase return
export const POST = apiHandler(async (request, { session, params }) => {
  try {
    const { systemId } = params;

    // Get existing return
    const existingReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: { items: true, suppliers: true },
    });

    if (!existingReturn) {
      return apiNotFound('PurchaseReturn');
    }

    // Verify return is approved
    if (existingReturn.status !== PurchaseReturnStatus.APPROVED) {
      return apiError(
        `Cannot process purchase return with status ${existingReturn.status}. Must be APPROVED.`,
        400
      );
    }

    // Update to COMPLETED with activity log
    const purchaseReturn = await prisma.$transaction(async (tx) => {
      // Log activity to centralized ActivityLog table
      await tx.activityLog.create({
        data: {
          entityType: 'purchase_return',
          entityId: systemId,
          action: 'processed',
          actionType: 'status',
          changes: { status: { from: 'APPROVED', to: 'COMPLETED' } },
          note: 'Hoàn tất xử lý phiếu trả hàng',
          createdBy: session!.user?.employee?.fullName || session!.user?.name || session!.user?.id || null,
          metadata: { userName: session!.user?.name || 'System' },
        },
      });

      const updated = await tx.purchaseReturn.update({
        where: { systemId },
        data: {
          status: PurchaseReturnStatus.COMPLETED,
          updatedAt: new Date(),
          updatedBy: session!.user?.id || null,
        },
        include: {
          items: true,
          suppliers: true,
        },
      });

      return updated;
    });

    // Convert Decimal fields to numbers for serialization
    const serializable = {
      ...purchaseReturn,
      subtotal: Number(purchaseReturn.subtotal),
      total: Number(purchaseReturn.total),
      totalReturnValue: Number(purchaseReturn.totalReturnValue),
      refundAmount: Number(purchaseReturn.refundAmount),
      items: purchaseReturn.items?.map((item: { unitPrice?: unknown; total?: unknown }) => ({
        ...item,
        unitPrice: Number(item.unitPrice ?? 0),
        total: Number(item.total ?? 0),
      })),
    };

    // Notify creator about processing complete
    if (purchaseReturn.createdBy && purchaseReturn.createdBy !== session!.user?.employeeId) {
      createNotification({
        type: 'purchase_return',
        settingsKey: 'purchase-return:updated',
        title: 'Phếu trả hàng hoàn tất',
        message: `Phếu trả hàng ${purchaseReturn.id || systemId} đã được xử lý xong`,
        link: `/purchase-returns/${systemId}`,
        recipientId: purchaseReturn.createdBy,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Purchase Return Process] notification failed', e));
    }

    return apiSuccess(serializable);
  } catch (error) {
    logError('[Purchase Returns Process API] POST error', error);
    return apiError('Không thể xử lý phiếu trả hàng nhập', 500);
  }
})
