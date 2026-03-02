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
    const now = new Date();

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
          if (!item.productId) continue; // Skip items without product (deleted products)
          
          const product = await tx.product.findUnique({
            where: { systemId: item.productId },
          });

          if (!product) {
            throw new Error(`Product not found: ${item.productId}`);
          }

          // ✅ Get current inventory at source
          const inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: transfer.fromBranchId,
              },
            },
          });

          const newStockLevel = (inventory?.onHand || 0) + item.quantity;

          // ✅ Update source branch: +onHand (stock returns to source)
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: transfer.fromBranchId,
              },
            },
            update: {
              onHand: { increment: item.quantity },
              updatedAt: new Date(),
            },
            create: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
              onHand: item.quantity,
            },
          });

          // ✅ Update destination branch: -inTransit (clear pending stock)
          await tx.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: transfer.toBranchId,
              },
            },
            data: {
              inTransit: { decrement: item.quantity },
              updatedAt: new Date(),
            },
          }).catch(() => {
            // Ignore if destination inventory doesn't exist
          });

          // ✅ Create stock history entry
          await tx.stockHistory.create({
            data: {
              productId: item.productId,
              branchId: transfer.fromBranchId,
              action: 'Hủy chuyển kho',
              source: 'Chuyển kho',
              quantityChange: item.quantity,
              newStockLevel: newStockLevel,
              documentId: transfer.id,
              documentType: 'stock_transfer',
              employeeId: session.user.id,
              employeeName: employee?.fullName || session.user.name || 'System',
              note: `Hủy chuyển kho đến ${transfer.toBranchName || transfer.toBranchId}${body.reason ? ` - Lý do: ${body.reason}` : ''}`,
            },
          });
        }
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
    console.error('[Stock Transfer Cancel] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to cancel transfer';
    return apiError(message, 500);
  }
}
