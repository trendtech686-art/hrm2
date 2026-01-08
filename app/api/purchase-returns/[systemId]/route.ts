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

// PATCH - Update purchase return
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const { status, reason, updatedBy } = body;

    const purchaseReturn = await prisma.purchaseReturn.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status }),
        ...(reason !== undefined && { reason }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
        suppliers: true,
      },
    });

    return apiSuccess(purchaseReturn);
  } catch (error) {
    console.error('[Purchase Returns API] PATCH error:', error);
    return apiError('Failed to update purchase return', 500);
  }
}

// DELETE - Delete purchase return
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    await prisma.purchaseReturnItem.deleteMany({
      where: { returnId: systemId },
    });
    
    await prisma.purchaseReturn.delete({
      where: { systemId },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Purchase Returns API] DELETE error:', error);
    return apiError('Failed to delete purchase return', 500);
  }
}
