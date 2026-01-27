/**
 * Purchase Return Detail API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single purchase return
export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const purchaseReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: {
        items: true,
        suppliers: true,
      },
    });

    if (!purchaseReturn) {
      return apiNotFound('PurchaseReturn');
    }

    return apiSuccess(purchaseReturn);
  } catch (error) {
    console.error('[Purchase Returns API] GET by ID error:', error);
    return apiError('Failed to fetch purchase return', 500);
  }
}

// PATCH - Update purchase return (approve/reject/update status)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const { status, reason, approvalNotes, refundAmount, updatedBy } = body;

    // Get existing return
    const existingReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: { items: true, suppliers: true },
    });

    if (!existingReturn) {
      return apiNotFound('PurchaseReturn');
    }

    // Validate status transition
    const currentStatus = existingReturn.status;
    const _newStatus = status || currentStatus;

    // Define valid transitions
    const validTransitions: Record<string, string[]> = {
      DRAFT: ['PENDING', 'CANCELLED'],
      PENDING: ['APPROVED', 'CANCELLED'],
      APPROVED: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [], // Cannot transition from completed
      CANCELLED: [], // Cannot transition from cancelled
    };

    if (
      status &&
      status !== currentStatus &&
      !validTransitions[currentStatus]?.includes(status)
    ) {
      return apiError(
        `Invalid status transition from ${currentStatus} to ${status}`,
        400
      );
    }

    // Perform update with transaction if status is changing to APPROVED or CANCELLED
    const purchaseReturn = await prisma.$transaction(async (tx) => {
      // Prepare update data
      const updateData: any = {
        updatedAt: new Date(),
        updatedBy: updatedBy || session.user?.id || null,
      };

      if (status !== undefined) updateData.status = status;
      if (reason !== undefined) updateData.reason = reason;
      if (refundAmount !== undefined) updateData.refundAmount = refundAmount;

      // Handle approval logic
      if (status === 'APPROVED' && currentStatus !== 'APPROVED') {
        // Approval processing already done during creation
        // Just update status and record who approved
        updateData.status = 'APPROVED';
      }

      // Handle cancellation logic
      if (status === 'CANCELLED' && currentStatus !== 'CANCELLED') {
        // Reverse inventory changes
        const returnItems = (existingReturn.returnItems as any) || [];
        for (const item of returnItems) {
          // Restore inventory
          if (existingReturn.branchSystemId) {
            await tx.productInventory.updateMany({
              where: {
                productId: item.productSystemId,
                branchId: existingReturn.branchSystemId,
              },
              data: {
                onHand: { increment: item.returnQuantity },
              },
            });
          }

          // Restore general inventory
          const inventory = await tx.inventory.findFirst({
            where: { productId: item.productSystemId },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { systemId: inventory.systemId },
              data: {
                quantity: { increment: item.returnQuantity },
              },
            });
          }
        }

        // Reverse supplier balance
        if (Number(existingReturn.refundAmount) > 0) {
          await tx.supplier.update({
            where: { systemId: existingReturn.supplierId },
            data: {
              currentDebt: { increment: existingReturn.refundAmount },
              totalDebt: { increment: existingReturn.refundAmount },
            },
          });
        }
      }

      // Build activity history entry
      const activityEntry = {
        timestamp: new Date().toISOString(),
        action: status ? 'STATUS_UPDATED' : 'UPDATED',
        field: status ? 'status' : 'general',
        oldValue: currentStatus,
        newValue: status || currentStatus,
        userId: session.user?.id || null,
        userName: session.user?.name || 'System',
        description:
          approvalNotes ||
          (status === 'APPROVED'
            ? 'Purchase return approved'
            : status === 'CANCELLED'
            ? 'Purchase return cancelled'
            : 'Purchase return updated'),
      };

      // Append to existing activity history
      const existingHistory = (existingReturn.activityHistory as any) || [];
      updateData.activityHistory = [...existingHistory, activityEntry];

      // Perform update
      const updated = await tx.purchaseReturn.update({
        where: { systemId },
        data: updateData,
        include: {
          items: true,
          suppliers: true,
        },
      });

      return updated;
    });

    return apiSuccess(purchaseReturn);
  } catch (error) {
    console.error('[Purchase Returns API] PATCH error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to update purchase return', 500);
  }
}

// DELETE - Delete purchase return (with inventory and supplier balance reversal)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Get return details for reversal
    const purchaseReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!purchaseReturn) {
      return apiNotFound('PurchaseReturn');
    }

    // Only allow deletion if status is DRAFT or CANCELLED
    if (!['DRAFT', 'CANCELLED'].includes(purchaseReturn.status)) {
      return apiError(
        'Cannot delete purchase return with status ' + purchaseReturn.status,
        400
      );
    }

    await prisma.$transaction(async (tx) => {
      // If not cancelled, reverse the inventory and supplier balance changes
      if (purchaseReturn.status !== 'CANCELLED') {
        const returnItems = (purchaseReturn.returnItems as any) || [];

        // Restore inventory
        for (const item of returnItems) {
          if (purchaseReturn.branchSystemId) {
            await tx.productInventory.updateMany({
              where: {
                productId: item.productSystemId,
                branchId: purchaseReturn.branchSystemId,
              },
              data: {
                onHand: { increment: item.returnQuantity },
              },
            });
          }

          const inventory = await tx.inventory.findFirst({
            where: { productId: item.productSystemId },
          });

          if (inventory) {
            await tx.inventory.update({
              where: { systemId: inventory.systemId },
              data: {
                quantity: { increment: item.returnQuantity },
              },
            });
          }
        }

        // Restore supplier balance
        if (Number(purchaseReturn.refundAmount) > 0) {
          await tx.supplier.update({
            where: { systemId: purchaseReturn.supplierId },
            data: {
              currentDebt: { increment: purchaseReturn.refundAmount },
              totalDebt: { increment: purchaseReturn.refundAmount },
            },
          });
        }
      }

      // Delete items first (cascade should handle this, but being explicit)
      await tx.purchaseReturnItem.deleteMany({
        where: { returnId: systemId },
      });

      // Delete the return
      await tx.purchaseReturn.delete({
        where: { systemId },
      });
    });

    return apiSuccess({ success: true, message: 'Purchase return deleted' });
  } catch (error) {
    console.error('[Purchase Returns API] DELETE error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to delete purchase return', 500);
  }
}
