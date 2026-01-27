/**
 * Stock Transfer Start/Dispatch Workflow
 * POST /api/stock-transfers/[systemId]/start
 * 
 * Atomically:
 * 1. Update transfer status to 'transferring'
 * 2. Dispatch stock from source branch
 * 3. Create stock history entries
 * 4. Record timestamps and employee
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');

    // Fetch transfer with items
    const transfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!transfer) {
      return apiError('Stock transfer not found', 404);
    }

    if (transfer.status !== 'PENDING') {
      return apiError(`Cannot start transfer with status: ${transfer.status}`, 400);
    }

    // Get employee info
    const employee = await prisma.employee.findUnique({
      where: { systemId: session.user.id },
    });

    // Atomic transaction: Update transfer, inventory, and stock history
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update transfer status
      const updatedTransfer = await tx.stockTransfer.update({
        where: { systemId },
        data: {
          status: 'IN_TRANSIT',
          transferDate: now,
          transferredDate: now,
          transferredBySystemId: session.user.id,
          transferredByName: employee?.fullName || session.user.name || 'System',
          updatedAt: new Date(),
          updatedBy: session.user.id,
        },
        include: { items: true },
      });

      // 2. Dispatch stock from source branch for each item
      for (const item of transfer.items) {
        const product = await tx.product.findUnique({
          where: { systemId: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // Get current inventory
        const currentInventory = (product.inventoryByBranch as Record<string, number> | null)?.[transfer.fromBranchId] || 0;
        
        if (currentInventory < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${currentInventory}, Required: ${item.quantity}`);
        }

        // Update inventory: -stock, +inTransit
        const newInventoryByBranch = { ...(product.inventoryByBranch as Record<string, number> | null || {}) };
        const newInTransitByBranch = { ...(product.inTransitByBranch as Record<string, number> | null || {}) };
        
        newInventoryByBranch[transfer.fromBranchId] = currentInventory - item.quantity;
        newInTransitByBranch[transfer.fromBranchId] = (newInTransitByBranch[transfer.fromBranchId] || 0) + item.quantity;

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
            action: 'Xuất chuyển kho',
            quantityChange: -item.quantity,
            newStockLevel: newInventoryByBranch[transfer.fromBranchId],
            documentId: transfer.id,
            branchSystemId: transfer.fromBranchId,
            branch: transfer.fromBranchName || '',
          },
        }); */
      }

      return updatedTransfer;
    });

    return apiSuccess(result);
  } catch (error) {
    console.error('[Stock Transfer Start] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to start transfer';
    return apiError(message, 500);
  }
}
