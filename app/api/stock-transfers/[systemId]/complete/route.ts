/**
 * Stock Transfer Complete/Receive Workflow
 * POST /api/stock-transfers/[systemId]/complete
 * 
 * Atomically:
 * 1. Update transfer status to 'completed'
 * 2. Complete delivery to destination branch
 * 3. Clear inTransit and add to inventory
 * 4. Create stock history entries
 * 5. Record timestamps and employee
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

interface CompleteTransferBody {
  receivedItems?: Array<{
    productSystemId: string;
    receivedQuantity: number;
  }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body: CompleteTransferBody = await request.json().catch(() => ({}));
    const now = new Date();

    // Fetch transfer with items
    const transfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!transfer) {
      return apiError('Stock transfer not found', 404);
    }

    if (transfer.status !== 'IN_TRANSIT') {
      return apiError(`Cannot complete transfer with status: ${transfer.status}`, 400);
    }

    // Get employee info
    const employee = await prisma.employee.findUnique({
      where: { systemId: session.user.id },
    });

    // Map received quantities
    const receivedMap = new Map(
      body.receivedItems?.map(item => [item.productSystemId, item.receivedQuantity]) || []
    );

    // Atomic transaction: Update transfer, inventory, and stock history
    const result = await prisma.$transaction(async (tx) => {
      // Update item received quantities
      const updatedItems = await Promise.all(
        transfer.items.map(async (item) => {
          const receivedQuantity = item.productId ? (receivedMap.get(item.productId) ?? item.quantity) : item.quantity;
          
          return tx.stockTransferItem.update({
            where: { systemId: item.systemId },
            data: { receivedQty: receivedQuantity },
          });
        })
      );

      // 1. Update transfer status
      const updatedTransfer = await tx.stockTransfer.update({
        where: { systemId },
        data: {
          status: 'COMPLETED',
          receivedDate: now,
          receivedBySystemId: session.user.id,
          receivedByName: employee?.fullName || session.user.name || 'System',
          updatedAt: new Date(),
          updatedBy: session.user.id,
        },
        include: { items: true },
      });

      // 2. Complete delivery for each item
      for (let i = 0; i < transfer.items.length; i++) {
        const item = transfer.items[i];
        if (!item.productId) continue; // Skip items without product (deleted products)
        
        const updatedItem = updatedItems[i];
        const receivedQty = updatedItem.receivedQty ?? item.quantity;
        
        const product = await tx.product.findUnique({
          where: { systemId: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // ✅ Get current inventory at destination
        const destInventory = await tx.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.toBranchId,
            },
          },
        });

        const newDestStock = (destInventory?.onHand || 0) + receivedQty;

        // ✅ Update ProductInventory: +onHand and -inTransit at destination
        await tx.productInventory.upsert({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: transfer.toBranchId,
            },
          },
          update: {
            onHand: { increment: receivedQty },
            inTransit: { decrement: item.quantity }, // Clear inTransit at destination
            updatedAt: new Date(),
          },
          create: {
            productId: item.productId,
            branchId: transfer.toBranchId,
            onHand: receivedQty,
            inTransit: 0,
          },
        });

        // ✅ Create stock history entry for destination
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            branchId: transfer.toBranchId,
            action: 'Nhập chuyển kho',
            source: 'Chuyển kho',
            quantityChange: receivedQty,
            newStockLevel: newDestStock,
            documentId: transfer.id,
            documentType: 'stock_transfer',
            employeeId: session.user.id,
            employeeName: employee?.fullName || session.user.name || 'System',
            note: `Nhận hàng từ ${transfer.fromBranchName || transfer.fromBranchId}`,
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
    console.error('[Stock Transfer Complete] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to complete transfer';
    return apiError(message, 500);
  }
}
