/**
 * Price Adjustment Cancel API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { PriceAdjustmentStatus } from '@/generated/prisma/client'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Cancel price adjustment
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    // Get price adjustment
    const priceAdjustment = await prisma.priceAdjustment.findUnique({
      where: { systemId },
    });

    if (!priceAdjustment) {
      return apiNotFound('Price adjustment');
    }

    if (priceAdjustment.status === PriceAdjustmentStatus.CONFIRMED) {
      return apiError('Cannot cancel confirmed price adjustment', 400);
    }

    if (priceAdjustment.status === PriceAdjustmentStatus.CANCELLED) {
      return apiError('Price adjustment already cancelled', 400);
    }

    // Get cancel info from request body
    const body = await request.json().catch(() => ({}));
    const cancelledBySystemId = body.cancelledBy || session.user?.id || null;
    const cancelReason = body.reason || body.cancelReason || null;
    let cancelledByName = body.cancelledByName || null;
    
    // Lookup canceller name if not provided
    if (!cancelledByName && cancelledBySystemId) {
      const canceller = await prisma.employee.findUnique({
        where: { systemId: cancelledBySystemId },
        select: { fullName: true },
      });
      cancelledByName = canceller?.fullName || null;
    }

    // Update price adjustment status
    const updatedAdjustment = await prisma.priceAdjustment.update({
      where: { systemId },
      data: {
        status: PriceAdjustmentStatus.CANCELLED,
        cancelledDate: new Date(),
        cancelledBySystemId,
        cancelledByName,
        cancelReason,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Transform for response
    const transformedAdjustment = {
      ...updatedAdjustment,
      items: updatedAdjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    };

    return apiSuccess(transformedAdjustment);
  } catch (error) {
    console.error('[Price Adjustments API] Cancel error:', error);
    return apiError('Failed to cancel price adjustment', 500);
  }
}
