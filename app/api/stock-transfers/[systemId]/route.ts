/**
 * Stock Transfer Detail API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { StockTransferStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils';
import { updateStockTransferSchema, deleteStockTransferSchema } from './validation';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single stock transfer
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const stockTransfer = await prisma.stockTransfer.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!stockTransfer) {
      return apiError('Stock transfer not found', 404);
    }

    // Transform items to match frontend expectations
    const transformedItems = stockTransfer.items.map(item => ({
      ...item,
      // Map database fields to frontend expected fields
      productSystemId: item.productId, // DB productId is actually productSystemId
      productId: item.productSku, // DB productSku is actually the business ID
      receivedQuantity: item.receivedQty,
    }));

    // Transform status to lowercase and convert dates for frontend compatibility
    const transformedResult = {
      ...stockTransfer,
      status: stockTransfer.status.toLowerCase(),
      items: transformedItems,
      // Ensure dates are ISO strings for JSON serialization
      createdDate: stockTransfer.createdDate?.toISOString() || stockTransfer.createdAt?.toISOString(),
      createdAt: stockTransfer.createdAt?.toISOString(),
      updatedAt: stockTransfer.updatedAt?.toISOString(),
      transferDate: stockTransfer.transferDate?.toISOString(),
      transferredDate: stockTransfer.transferredDate?.toISOString() || null,
      receivedDate: stockTransfer.receivedDate?.toISOString() || null,
      cancelledDate: stockTransfer.cancelledDate?.toISOString() || null,
    };

    return apiSuccess(transformedResult);
  } catch (error) {
    console.error('[Stock Transfers API] GET by ID error:', error);
    return apiError('Failed to fetch stock transfer', 500);
  }
}

// PATCH - Update stock transfer
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, updateStockTransferSchema);
  if (!validation.success) {
    return apiError(validation.error, 400);
  }
  const { status, notes, updatedBy } = validation.data;

  try {
    const { systemId } = await params;

    const stockTransfer = await prisma.stockTransfer.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status: status.toUpperCase() as StockTransferStatus }),
        ...(notes !== undefined && { notes }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Transform status to lowercase for frontend compatibility
    const transformedResult = {
      ...stockTransfer,
      status: stockTransfer.status.toLowerCase(),
    };

    return apiSuccess(transformedResult);
  } catch (error) {
    console.error('[Stock Transfers API] PATCH error:', error);
    return apiError('Failed to update stock transfer', 500);
  }
}

// DELETE - Soft or hard delete stock transfer
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const validation = await validateBody(request, deleteStockTransferSchema).catch(() => ({ success: true, data: {} as { hard?: boolean } }));
  const hard = validation.success && validation.data?.hard === true;

  try {
    const { systemId } = await params;

    if (hard) {
      await prisma.stockTransferItem.deleteMany({
        where: { transferId: systemId },
      });
      
      await prisma.stockTransfer.delete({
        where: { systemId },
      });
    } else {
      // Stock transfer has no soft delete fields, use hard delete
      await prisma.stockTransferItem.deleteMany({
        where: { transferId: systemId },
      });
      
      await prisma.stockTransfer.delete({
        where: { systemId },
      });
    }

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Stock Transfers API] DELETE error:', error);
    return apiError('Failed to delete stock transfer', 500);
  }
}
