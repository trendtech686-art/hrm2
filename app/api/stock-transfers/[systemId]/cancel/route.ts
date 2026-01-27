/**
 * Stock Transfer Cancel Workflow
 * POST /api/stock-transfers/[systemId]/cancel
 * 
 * Atomically:
 * 1. Update transfer status to 'cancelled'
 * 2. Return stock from transit if already transferring
 * 3. Create stock history entries
 * 4. Record cancel reason, timestamps, and employee
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

interface CancelTransferBody {
  reason?: string;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body: CancelTransferBody = await request.json().catch(() => ({}));
    const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

    // Fetch transfer with items
    const transfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!transfer) {
      return apiError('Stock transfer not found', 404);
    }

    if (transfer.status === 'COMPLETED' || transfer.status === 'CANCELLED') {
      return apiError(`Cannot cancel transfer with status: ${transfer.status}`, 400);
    }

    // Get employee info
    const employee = await prisma.employee.findUnique({
      where: { systemId: session.user.id },
    });

    // Atomic transaction: Update transfer, inventory (if needed), and stock history
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update transfer status
      const updatedTransfer = await tx.stockTransfer.update({
        where: { systemId },
        data: {
          status: 'CANCELLED',
          cancelledDate: now,
          cancelledBySystemId: session.user.id,
          cancelledByName: employee?.fullName || session.user.name || 'System',
          cancelReason: body.reason?.trim() || undefined,
          updatedAt: new Date(),
          updatedBy: session.user.id,
        },
        include: { items: true },
      });

      // 2. If status was IN_TRANSIT, return stock from transit
      if (transfer.status === 'IN_TRANSIT') {
        for (const item of transfer.items) {
          const product = await tx.product.findUnique({
            where: { systemId: item.productId },
          });

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          // Update inventory: +stock, -inTransit
          const newInventoryByBranch = { ...(product.inventoryByBranch as Record<string, number> | null || {}) };
          const newInTransitByBranch = { ...(product.inTransitByBranch as Record<string, number> | null || {}) };
          
          newInventoryByBranch[transfer.fromBranchId] = (newInventoryByBranch[transfer.fromBranchId] || 0) + item.quantity;
          newInTransitByBranch[transfer.fromBranchId] = Math.max(0, (newInTransitByBranch[transfer.fromBranchId] || 0) - item.quantity);

          await tx.product.update({
            where: { systemId: item.productId },
            data: {
              inventoryByBranch: newInventoryByBranch,
              inTransitByBranch: newInTransitByBranch,
            },
          });

          // 3. Create stock history entry
          // TODO: StockHistory table doesn't exist yet - implement when available
          /* await tx.stockHistory.create({
            data: {
              productId: item.productId,
              date: now,
              employeeName: employee?.fullName || session.user.name || 'System',
              action: 'Hủy chuyển kho',
              quantityChange: item.quantity,
              newStockLevel: newInventoryByBranch[transfer.fromBranchId],
              documentId: transfer.id,
              branchSystemId: transfer.fromBranchId,
              branch: transfer.fromBranchName || '',
            },
          }); */
        }
      }

      return updatedTransfer;
    });

    return apiSuccess(result);
  } catch (error) {
    console.error('[Stock Transfer Cancel] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to cancel transfer';
    return apiError(message, 500);
  }
}
