/**
 * Cost Adjustment Confirm API Route
 * Confirms a cost adjustment and updates product cost prices
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { CostAdjustmentStatus } from '@/generated/prisma/client'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Confirm cost adjustment and update product cost prices
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    // Get cost adjustment with items
    const costAdjustment = await prisma.costAdjustment.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!costAdjustment) {
      return apiNotFound('Cost adjustment');
    }

    if (costAdjustment.status === CostAdjustmentStatus.CONFIRMED) {
      return apiError('Cost adjustment already confirmed', 400);
    }

    if (costAdjustment.status === CostAdjustmentStatus.CANCELLED) {
      return apiError('Cannot confirm cancelled cost adjustment', 400);
    }

    // Update product cost prices
    const updatePromises = costAdjustment.items
      .filter(item => item.productSystemId || item.productId) // Only update items with product reference
      .map(item => {
        const newCost = Number(item.newCost);
        const productSystemId = item.productSystemId || item.productId;
        
        return prisma.product.update({
          where: { systemId: productSystemId! },
          data: {
            costPrice: newCost,
            updatedAt: new Date(),
          },
        });
      });

    // Execute all product updates
    await Promise.all(updatePromises);

    // Get current user info for confirmedBy fields
    const body = await request.json().catch(() => ({}));
    const confirmedBySystemId = body.confirmedBy || session.user?.id || null;
    let confirmedByName = body.confirmedByName || null;
    
    // Lookup confirmer name if not provided
    if (!confirmedByName && confirmedBySystemId) {
      const confirmer = await prisma.employee.findUnique({
        where: { systemId: confirmedBySystemId },
        select: { fullName: true },
      });
      confirmedByName = confirmer?.fullName || null;
    }

    // Update cost adjustment status
    const updatedAdjustment = await prisma.costAdjustment.update({
      where: { systemId },
      data: {
        status: CostAdjustmentStatus.CONFIRMED,
        confirmedDate: new Date(),
        confirmedBySystemId,
        confirmedByName,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    return apiSuccess({
      ...updatedAdjustment,
      updatedProducts: costAdjustment.items.length,
    });
  } catch (error) {
    console.error('[Cost Adjustments API] Confirm error:', error);
    return apiError('Failed to confirm cost adjustment', 500);
  }
}
