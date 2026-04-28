/**
 * Cost Adjustment Cancel API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { requirePermission } from '@/lib/api-utils'
import { CostAdjustmentStatus } from '@/generated/prisma/client'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Transform Decimal fields to Numbers for JSON serialization
function transformItems<T extends { items?: { oldCost?: unknown; newCost?: unknown; adjustmentAmount?: unknown; adjustmentPercent?: unknown; productSystemId?: unknown; productId?: unknown }[] }>(data: T): T {
  if (!data.items) return data;
  return {
    ...data,
    items: data.items.map(item => {
      const { oldCost, newCost, adjustmentAmount, adjustmentPercent, ...rest } = item;
      const oldCostNum = Number(oldCost) || 0;
      const newCostNum = Number(newCost) || 0;
      return {
        ...rest,
        productSystemId: item.productSystemId || item.productId,
        productId: item.productId || item.productSystemId,
        oldCost: oldCostNum,
        newCost: newCostNum,
        oldCostPrice: oldCostNum,
        newCostPrice: newCostNum,
        adjustmentAmount: Number(adjustmentAmount) || (newCostNum - oldCostNum),
        adjustmentPercent: Number(adjustmentPercent) || (oldCostNum > 0 ? ((newCostNum - oldCostNum) / oldCostNum * 100) : 0),
      };
    }),
  };
}

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Cancel cost adjustment
export async function POST(request: Request, { params }: RouteParams) {
  const result = await requirePermission('approve_cost_adjustment')
  if (result instanceof Response) return result
  const session = result

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
      return apiError('Không thể hủy phiếu đã được xác nhận', 400);
    }

    if (costAdjustment.status === CostAdjustmentStatus.CANCELLED) {
      return apiError('Phiếu điều chỉnh giá vốn đã bị hủy', 400);
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
      select: {
        systemId: true,
        id: true,
        branchId: true,
        employeeId: true,
        adjustmentDate: true,
        status: true,
        type: true,
        reason: true,
        note: true,
        referenceCode: true,
        createdDate: true,
        createdBySystemId: true,
        createdByName: true,
        confirmedDate: true,
        confirmedBySystemId: true,
        confirmedByName: true,
        cancelledDate: true,
        cancelledBySystemId: true,
        cancelledByName: true,
        cancelReason: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        updatedBy: true,
        items: {
          select: {
            systemId: true,
            adjustmentId: true,
            productId: true,
            productSystemId: true,
            productName: true,
            productImage: true,
            oldCost: true,
            newCost: true,
            adjustmentAmount: true,
            adjustmentPercent: true,
            quantity: true,
            reason: true,
          },
        },
      },
    });

    // Notify creator about cancellation
    if (updatedAdjustment.createdBySystemId && updatedAdjustment.createdBySystemId !== session.user?.employeeId) {
      createNotification({
        type: 'cost_adjustment',
        settingsKey: 'cost-adjustment:updated',
        title: 'Điều chỉnh giá vốn bị hủy',
        message: `Phiếu điều chỉnh giá vốn ${updatedAdjustment.id || systemId} đã bị hủy${cancelReason ? `: ${cancelReason}` : ''}`,
        link: `/cost-adjustments/${systemId}`,
        recipientId: updatedAdjustment.createdBySystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Cost Adjustment Cancel] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'cost_adjustment',
          entityId: systemId,
          action: 'cancelled',
          actionType: 'update',
          note: `Hủy phiếu điều chỉnh giá vốn`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] cost_adjustment cancelled failed', e))
    return apiSuccess(transformItems(updatedAdjustment));
  } catch (error) {
    logError('[Cost Adjustments API] Cancel error', error);
    return apiError('Lỗi khi hủy phiếu điều chỉnh giá vốn', 500);
  }
}
