/**
 * Price Adjustment Cancel API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { PriceAdjustmentStatus } from '@/generated/prisma/client'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

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
      return apiError('Không thể hủy phiếu đã được xác nhận', 400);
    }

    if (priceAdjustment.status === PriceAdjustmentStatus.CANCELLED) {
      return apiError('Phiếu điều chỉnh giá đã bị hủy', 400);
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

    // Notify creator about cancellation
    if (updatedAdjustment.createdBySystemId && updatedAdjustment.createdBySystemId !== session.user?.employeeId) {
      createNotification({
        type: 'price_adjustment',
        settingsKey: 'price-adjustment:updated',
        title: 'Điều chỉnh giá bị hủy',
        message: `Phiếu điều chỉnh giá ${updatedAdjustment.id || systemId} đã bị hủy${cancelReason ? `: ${cancelReason}` : ''}`,
        link: `/price-adjustments/${systemId}`,
        recipientId: updatedAdjustment.createdBySystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Price Adjustment Cancel] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'price_adjustment',
          entityId: systemId,
          action: 'cancelled',
          actionType: 'update',
          note: `Hủy phiếu điều chỉnh giá`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] price_adjustment cancelled failed', e))
    return apiSuccess(transformedAdjustment);
  } catch (error) {
    logError('[Price Adjustments API] Cancel error', error);
    return apiError('Lỗi khi hủy phiếu điều chỉnh giá', 500);
  }
}
