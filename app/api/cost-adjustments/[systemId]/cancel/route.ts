/**
 * Cost Adjustment Cancel API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { CostAdjustmentStatus } from '@/generated/prisma/client'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Cancel cost adjustment
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    // Get cost adjustment
    const costAdjustment = await prisma.costAdjustment.findUnique({
      where: { systemId },
    });

    if (!costAdjustment) {
      return apiNotFound('Cost adjustment');
    }

    if (costAdjustment.status === CostAdjustmentStatus.CONFIRMED) {
      return apiError('Cannot cancel confirmed cost adjustment', 400);
    }

    if (costAdjustment.status === CostAdjustmentStatus.CANCELLED) {
      return apiError('Cost adjustment already cancelled', 400);
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

    // Update cost adjustment status
    const updatedAdjustment = await prisma.costAdjustment.update({
      where: { systemId },
      data: {
        status: CostAdjustmentStatus.CANCELLED,
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

    return apiSuccess(updatedAdjustment);
  } catch (error) {
    console.error('[Cost Adjustments API] Cancel error:', error);
    return apiError('Failed to cancel cost adjustment', 500);
  }
}
