/**
 * Inventory Receipt Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single inventory receipt
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const inventoryReceipt = await prisma.inventoryReceipt.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryReceipt) {
      return apiNotFound('Inventory receipt');
    }

    return apiSuccess(inventoryReceipt);
  } catch (error) {
    console.error('[Inventory Receipts API] GET by ID error:', error);
    return apiError('Failed to fetch inventory receipt', 500);
  }
}

// PATCH - Update inventory receipt
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const { status, notes, updatedBy } = body;

    const inventoryReceipt = await prisma.inventoryReceipt.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(inventoryReceipt);
  } catch (error) {
    console.error('[Inventory Receipts API] PATCH error:', error);
    return apiError('Failed to update inventory receipt', 500);
  }
}

// DELETE - Delete inventory receipt
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const hard = body.hard === true;

    if (hard) {
      await prisma.inventoryReceiptItem.deleteMany({
        where: { receiptId: systemId },
      });
      
      await prisma.inventoryReceipt.delete({
        where: { systemId },
      });
    } else {
      // Soft delete not supported in schema, use hard delete
      await prisma.inventoryReceiptItem.deleteMany({
        where: { receiptId: systemId },
      });
      
      await prisma.inventoryReceipt.delete({
        where: { systemId },
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Inventory Receipts API] DELETE error:', error);
    return apiError('Failed to delete inventory receipt', 500);
  }
}
