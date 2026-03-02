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

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const now = new Date();

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
        if (!item.productId) continue; // Skip items without product (deleted products)
        
        const product = await tx.product.findUnique({
          where: { systemId: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // ✅ Use ProductInventory table instead of Product.inventoryByBranch
        const inventory = await tx.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
            },
          },
        });

        const currentStock = inventory?.onHand || 0;
        
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${currentStock}, Required: ${item.quantity}`);
        }

        const newStockLevel = currentStock - item.quantity;

        // ✅ Update source branch: -onHand (stock leaves source)
        await tx.productInventory.upsert({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
            },
          },
          update: {
            onHand: { decrement: item.quantity },
            updatedAt: new Date(),
          },
          create: {
            productId: item.productId,
            branchId: transfer.fromBranchId,
            onHand: -item.quantity, // Should not happen normally
          },
        });

        // ✅ Update destination branch: +inTransit (stock in transit TO destination)
        await tx.productInventory.upsert({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.toBranchId,
            },
          },
          update: {
            inTransit: { increment: item.quantity },
            updatedAt: new Date(),
          },
          create: {
            productId: item.productId,
            branchId: transfer.toBranchId,
            onHand: 0,
            inTransit: item.quantity,
          },
        });

        // ✅ Create stock history entry
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            branchId: transfer.fromBranchId,
            action: 'Xuất chuyển kho',
            source: 'Chuyển kho',
            quantityChange: -item.quantity,
            newStockLevel: newStockLevel,
            documentId: transfer.id,
            documentType: 'stock_transfer',
            employeeId: session.user.id,
            employeeName: employee?.fullName || session.user.name || 'System',
            note: `Chuyển kho đến ${transfer.toBranchName || transfer.toBranchId}`,
          },
        });
      }

      return updatedTransfer;
    });

    // Transform status to lowercase for frontend compatibility
    const transformedResult = {
      ...result,
      status: result.status.toLowerCase(),
    };

    return apiSuccess(transformedResult);
  } catch (error) {
    console.error('[Stock Transfer Start] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to start transfer';
    return apiError(message, 500);
  }
}
