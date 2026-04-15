/**
 * Cost Adjustment Confirm API Route
 * Confirms a cost adjustment and updates product cost prices
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
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
      return apiError('Phiếu điều chỉnh giá vốn đã được xác nhận', 400);
    }

    if (costAdjustment.status === CostAdjustmentStatus.CANCELLED) {
      return apiError('Không thể xác nhận phiếu đã bị hủy', 400);
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

    // ✅ Notify creator about cost adjustment confirmation
    if (costAdjustment.createdBySystemId && costAdjustment.createdBySystemId !== session.user?.employeeId) {
      createNotification({
        type: 'cost_adjustment',
        settingsKey: 'cost-adjustment:updated',
        title: 'Xác nhận điều chỉnh giá vốn',
        message: `Phiếu điều chỉnh giá vốn ${costAdjustment.id || systemId} đã được xác nhận`,
        link: `/cost-adjustments/${systemId}`,
        recipientId: costAdjustment.createdBySystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Cost Adjustments Confirm] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'cost_adjustment',
          entityId: systemId,
          action: 'confirmed',
          actionType: 'update',
          note: `Xác nhận điều chỉnh giá vốn`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] cost_adjustment confirmed failed', e))

    return apiSuccess({
      ...transformItems(updatedAdjustment),
      updatedProducts: costAdjustment.items.length,
    });
  } catch (error) {
    logError('[Cost Adjustments API] Confirm error', error);
    return apiError('Lỗi khi xác nhận phiếu điều chỉnh giá vốn', 500);
  }
}
