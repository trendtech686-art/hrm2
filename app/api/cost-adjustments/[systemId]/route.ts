/**
 * Cost Adjustment Detail API Route
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

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
    items: adjustment.items?.map((item: CostAdjustmentItemRecord) => ({
      ...item,
      // Map database fields to frontend fields - prefer stored productSystemId
      productSystemId: item.productSystemId || item.productId,
      productId: item.productId || item.productSystemId, // business ID for display
      productName: item.productName || null,
      productImage: item.productImage || null,
      oldCostPrice: Number(item.oldCost) || 0,
      newCostPrice: Number(item.newCost) || 0,
      adjustmentAmount: Number(item.adjustmentAmount) || (Number(item.newCost || 0) - Number(item.oldCost || 0)),
      adjustmentPercent: Number(item.adjustmentPercent) || (Number(item.oldCost) > 0 
        ? ((Number(item.newCost || 0) - Number(item.oldCost || 0)) / Number(item.oldCost) * 100)
        : 0),
    })) || [],
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
