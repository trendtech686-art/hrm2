/**
 * Price Adjustment Detail API Route
 * GET - Get single price adjustment by systemId
 * PATCH - Update price adjustment
 * DELETE - Delete price adjustment
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// GET - Get single price adjustment
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    // Try to find by systemId first, then by business id
    let adjustment = await prisma.priceAdjustment.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    // If not found by systemId, try by business id
    if (!adjustment) {
      adjustment = await prisma.priceAdjustment.findUnique({
        where: { id: systemId },
        include: {
          items: true,
        },
      });
    }

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
    logError('[Price Adjustments API] Get error', error);
    return apiError('Lỗi khi lấy phiếu điều chỉnh giá', 500);
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
      return apiError('Chỉ có thể cập nhật phiếu ở trạng thái Nháp', 400);
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
    logError('[Price Adjustments API] Update error', error);
    return apiError('Lỗi khi cập nhật phiếu điều chỉnh giá', 500);
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
      return apiError('Chỉ có thể xóa phiếu ở trạng thái Nháp', 400);
    }

    await prisma.priceAdjustment.delete({
      where: { systemId },
    });

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'price_adjustment',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu điều chỉnh giá`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] price_adjustment delete failed', e))
    return apiSuccess({ deleted: true });
  } catch (error) {
    logError('[Price Adjustments API] Delete error', error);
    return apiError('Lỗi khi xóa phiếu điều chỉnh giá', 500);
  }
}
