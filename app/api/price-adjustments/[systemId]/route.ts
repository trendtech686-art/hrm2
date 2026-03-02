/**
 * Price Adjustment Detail API Route
 * GET - Get single price adjustment by systemId
 * PATCH - Update price adjustment
 * DELETE - Delete price adjustment
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single price adjustment
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const adjustment = await prisma.priceAdjustment.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!adjustment) {
      return apiNotFound('Price adjustment');
    }

    // Transform for response
    const transformedAdjustment = {
      ...adjustment,
      items: adjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    };

    return apiSuccess(transformedAdjustment);
  } catch (error) {
    console.error('[Price Adjustments API] Get error:', error);
    return apiError('Failed to fetch price adjustment', 500);
  }
}

// PATCH - Update price adjustment
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;
    const body = await request.json();

    // Check if adjustment exists
    const existing = await prisma.priceAdjustment.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return apiNotFound('Price adjustment');
    }

    // Only allow updates to DRAFT adjustments
    if (existing.status !== 'DRAFT') {
      return apiError('Cannot update non-draft price adjustment', 400);
    }

    const adjustment = await prisma.priceAdjustment.update({
      where: { systemId },
      data: {
        reason: body.reason,
        note: body.note,
        referenceCode: body.referenceCode,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Transform for response
    const transformedAdjustment = {
      ...adjustment,
      items: adjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    };

    return apiSuccess(transformedAdjustment);
  } catch (error) {
    console.error('[Price Adjustments API] Update error:', error);
    return apiError('Failed to update price adjustment', 500);
  }
}

// DELETE - Delete price adjustment
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    // Check if adjustment exists
    const existing = await prisma.priceAdjustment.findUnique({
      where: { systemId },
    });

    if (!existing) {
      return apiNotFound('Price adjustment');
    }

    // Only allow deletion of DRAFT adjustments
    if (existing.status !== 'DRAFT') {
      return apiError('Cannot delete non-draft price adjustment', 400);
    }

    await prisma.priceAdjustment.delete({
      where: { systemId },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error('[Price Adjustments API] Delete error:', error);
    return apiError('Failed to delete price adjustment', 500);
  }
}
