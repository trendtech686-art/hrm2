/**
 * Sales Return Receive API Route
 * 
 * POST /api/sales-returns/[systemId]/receive - Mark return as received and update inventory
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Mark sales return as received and update inventory
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Fetch sales return
    const salesReturn = await prisma.salesReturn.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!salesReturn) {
      return apiNotFound('SalesReturn');
    }

    if (salesReturn.isReceived) {
      return apiError('Sales return already marked as received', 400);
    }

    if (salesReturn.status === 'REJECTED') {
      return apiError('Cannot receive rejected returns', 400);
    }

    // Update inventory in atomic transaction
    const updatedReturn = await prisma.$transaction(async (tx) => {
      // Update each product's inventory
      for (const item of salesReturn.items) {
        if (!item.productId) continue; // Skip items without product (deleted products)
        
        const branchId = salesReturn.branchId || salesReturn.branchSystemId;
        
        if (!branchId) {
          throw new Error('Branch ID is required for inventory updates');
        }

        // Check if inventory record exists
        const inventory = await tx.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: branchId,
            },
          },
        });

        const oldStock = inventory?.onHand || 0;
        const newStock = oldStock + item.quantity;

        if (inventory) {
          // Update existing inventory - add returned quantity back to onHand
          await tx.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: branchId,
              },
            },
            data: {
              onHand: { increment: item.quantity },
              updatedAt: new Date(),
            },
          });
        } else {
          // Create new inventory record if it doesn't exist
          await tx.productInventory.create({
            data: {
              productId: item.productId,
              branchId: branchId,
              onHand: item.quantity,
              committed: 0,
              inTransit: 0,
            },
          });
        }
        
        // ✅ Create stock history record
        await tx.stockHistory.create({
          data: {
            productId: item.productId,
            branchId: branchId,
            action: 'Nhập kho trả hàng',
            source: 'Phiếu trả hàng',
            quantityChange: item.quantity,
            newStockLevel: newStock,
            documentId: salesReturn.id,
            documentType: 'sales_return',
            employeeId: session.user?.id,
            employeeName: session.user?.name || undefined,
            note: `Nhập kho hàng trả - ${item.productName || item.productId}`,
          },
        });
      }

      // Mark sales return as received
      const updated = await tx.salesReturn.update({
        where: { systemId },
        data: {
          isReceived: true,
          status: 'APPROVED', // Auto-approve when received
          updatedAt: new Date(),
          updatedBy: session.user?.id || null,
        },
        include: {
          items: true,
        },
      });

      return updated;
    });

    return apiSuccess(updatedReturn);
  } catch (error) {
    console.error('[Sales Returns Receive API] POST error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to mark sales return as received', 500);
  }
}
