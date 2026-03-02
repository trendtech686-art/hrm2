/**
 * Purchase Return Detail API Route
 */

import { NextRequest } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
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
      const updateData: Prisma.PurchaseReturnUpdateInput = {
        updatedAt: new Date(),
        updatedBy: updatedBy || session.user?.id || null,
      };

      if (status !== undefined) updateData.status = status as Prisma.PurchaseReturnUpdateInput['status'];
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
        interface ReturnItem {
          productSystemId: string;
          productName?: string;
          returnQuantity: number;
        }
        const returnItems = (existingReturn.returnItems as ReturnItem[] | null) || [];
        for (const item of returnItems) {
          // Get current inventory for stock history
          let currentStock = 0;
          if (existingReturn.branchSystemId) {
            const productInventory = await tx.productInventory.findUnique({
              where: {
                productId_branchId: {
                  productId: item.productSystemId,
                  branchId: existingReturn.branchSystemId,
                },
              },
            });
            currentStock = productInventory?.onHand || 0;
          }
          const newStock = currentStock + item.returnQuantity;

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
            
            // ✅ Create stock history record
            await tx.stockHistory.create({
              data: {
                productId: item.productSystemId,
                branchId: existingReturn.branchSystemId,
                action: 'Nhập kho hủy trả NCC',
                source: 'Phiếu trả hàng nhập',
                quantityChange: item.returnQuantity,
                newStockLevel: newStock,
                documentId: existingReturn.id,
                documentType: 'purchase_return',
                employeeId: session.user?.id,
                employeeName: session.user?.name || undefined,
                note: `Nhập lại kho do hủy trả NCC - ${item.productName || item.productSystemId}`,
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
        if (Number(existingReturn.refundAmount) > 0 && existingReturn.supplierId) {
          await tx.supplier.update({
            where: { systemId: existingReturn.supplierId },
            data: {
              currentDebt: { increment: existingReturn.refundAmount },
              totalDebt: { increment: existingReturn.refundAmount },
            },
          });
        }
      }

      // Log activity to centralized ActivityLog table
      await tx.activityLog.create({
        data: {
          entityType: 'purchase_return',
          entityId: systemId,
          action: status ? 'status_changed' : 'updated',
          actionType: status ? 'status' : 'update',
          changes: status ? { status: { from: currentStatus, to: status } } : undefined,
          note: approvalNotes ||
            (status === 'APPROVED'
              ? 'Purchase return approved'
              : status === 'CANCELLED'
              ? 'Purchase return cancelled'
              : 'Purchase return updated'),
          createdBy: session.user?.id || null,
          metadata: { userName: session.user?.name || 'System' },
        },
      });

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
        interface ReturnItemRecord {
          productSystemId: string;
          productName?: string;
          returnQuantity: number;
        }
        const returnItems = (purchaseReturn.returnItems as ReturnItemRecord[] | null) || [];

        // Restore inventory
        for (const item of returnItems) {
          // Get current inventory for stock history
          let currentStock = 0;
          if (purchaseReturn.branchSystemId) {
            const productInventory = await tx.productInventory.findUnique({
              where: {
                productId_branchId: {
                  productId: item.productSystemId,
                  branchId: purchaseReturn.branchSystemId,
                },
              },
            });
            currentStock = productInventory?.onHand || 0;
          }
          const newStock = currentStock + item.returnQuantity;

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
            
            // ✅ Create stock history record
            await tx.stockHistory.create({
              data: {
                productId: item.productSystemId,
                branchId: purchaseReturn.branchSystemId,
                action: 'Nhập kho xóa trả NCC',
                source: 'Phiếu trả hàng nhập',
                quantityChange: item.returnQuantity,
                newStockLevel: newStock,
                documentId: purchaseReturn.id,
                documentType: 'purchase_return',
                employeeId: session.user?.id,
                employeeName: session.user?.name || undefined,
                note: `Nhập lại kho do xóa phiếu trả NCC - ${item.productName || item.productSystemId}`,
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
        if (Number(purchaseReturn.refundAmount) > 0 && purchaseReturn.supplierId) {
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
