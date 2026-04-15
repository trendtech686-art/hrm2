/**
 * Cost Adjustment Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// Transform Prisma CostAdjustment to frontend format
interface CostAdjustmentRecord {
  createdDate?: Date | null;
  createdAt?: Date | null;
  items?: CostAdjustmentItemRecord[];
  [key: string]: unknown;
}

interface CostAdjustmentItemRecord {
  productSystemId?: string | null;
  productId?: string | null;
  productName?: string | null;
  productImage?: string | null;
  oldCost?: number | string | null;
  newCost?: number | string | null;
  adjustmentAmount?: number | string | null;
  adjustmentPercent?: number | string | null;
  [key: string]: unknown;
}

function transformCostAdjustment(adjustment: CostAdjustmentRecord | null) {
  if (!adjustment) return adjustment;
  
  return {
    ...adjustment,
    // Date field aliases (frontend expects these names)
    createdDate: adjustment.createdDate || adjustment.createdAt,
    // Transform items to frontend field names
    items: adjustment.items?.map((item: CostAdjustmentItemRecord) => {
      // Destructure to exclude Decimal fields from spread
      const { oldCost, newCost, adjustmentAmount, adjustmentPercent, ...rest } = item;
      const oldCostNum = Number(oldCost) || 0;
      const newCostNum = Number(newCost) || 0;
      
      return {
        ...rest,
        // Map database fields to frontend fields - prefer stored productSystemId
        productSystemId: item.productSystemId || item.productId,
        productId: item.productId || item.productSystemId, // business ID for display
        productName: item.productName || null,
        productImage: item.productImage || null,
        // Converted numeric fields (not Decimal)
        oldCost: oldCostNum,
        newCost: newCostNum,
        adjustmentAmount: Number(adjustmentAmount) || (newCostNum - oldCostNum),
        adjustmentPercent: Number(adjustmentPercent) || (oldCostNum > 0 
          ? ((newCostNum - oldCostNum) / oldCostNum * 100)
          : 0),
        // Frontend field aliases
        oldCostPrice: oldCostNum,
        newCostPrice: newCostNum,
      };
    }) || [],
  };
}

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

    // If createdByName is missing but createdBySystemId exists, lookup from Employee
    let createdByName = costAdjustment.createdByName;
    if (!createdByName && costAdjustment.createdBySystemId) {
      const creator = await prisma.employee.findUnique({
        where: { systemId: costAdjustment.createdBySystemId },
        select: { fullName: true },
      });
      createdByName = creator?.fullName || null;
    }
    // Fallback to createdBy if still no name
    if (!createdByName && costAdjustment.createdBy) {
      const creator = await prisma.employee.findUnique({
        where: { systemId: costAdjustment.createdBy },
        select: { fullName: true },
      });
      createdByName = creator?.fullName || null;
    }

    return apiSuccess(transformCostAdjustment({
      ...costAdjustment,
      createdByName,
    } as unknown as CostAdjustmentRecord));
  } catch (error) {
    logError('[Cost Adjustments API] GET by ID error', error);
    return apiError('Lỗi khi lấy phiếu điều chỉnh giá vốn', 500);
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

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'cost_adjustment',
          entityId: systemId,
          action: 'updated',
          actionType: 'update',
          note: `Cập nhật phiếu điều chỉnh giá vốn`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] cost_adjustment update failed', e))
    return apiSuccess(transformCostAdjustment(costAdjustment as unknown as CostAdjustmentRecord));
  } catch (error) {
    logError('[Cost Adjustments API] PATCH error', error);
    return apiError('Lỗi khi cập nhật phiếu điều chỉnh giá vốn', 500);
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

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'cost_adjustment',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa phiếu điều chỉnh giá vốn`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] cost_adjustment delete failed', e))
    return apiSuccess({ success: true });
  } catch (error) {
    logError('[Cost Adjustments API] DELETE error', error);
    return apiError('Lỗi khi xóa phiếu điều chỉnh giá vốn', 500);
  }
}
