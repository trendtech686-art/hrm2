/**
 * Cost Adjustment Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single cost adjustment
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const costAdjustment = await prisma.costAdjustment.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!costAdjustment) {
      return apiNotFound('Cost adjustment');
    }

    return apiSuccess(costAdjustment);
  } catch (error) {
    console.error('[Cost Adjustments API] GET by ID error:', error);
    return apiError('Failed to fetch cost adjustment', 500);
  }
}

// PATCH - Update cost adjustment
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const { status, reason, updatedBy } = body;

    const costAdjustment = await prisma.costAdjustment.update({
      where: { systemId },
      data: {
        ...(status !== undefined && { status }),
        ...(reason !== undefined && { reason }),
        ...(updatedBy !== undefined && { updatedBy }),
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(costAdjustment);
  } catch (error) {
    console.error('[Cost Adjustments API] PATCH error:', error);
    return apiError('Failed to update cost adjustment', 500);
  }
}

// DELETE - Delete cost adjustment
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    await prisma.costAdjustmentItem.deleteMany({
      where: { adjustmentId: systemId },
    });
    
    await prisma.costAdjustment.delete({
      where: { systemId },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('[Cost Adjustments API] DELETE error:', error);
    return apiError('Failed to delete cost adjustment', 500);
  }
}
