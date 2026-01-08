/**
 * Cost Adjustments API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { CostAdjustmentStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createCostAdjustmentSchema } from './validation'

// Interface for cost adjustment item input
interface CostAdjustmentItemInput {
  systemId: string;
  productId: string;
  oldCost?: number;
  newCost?: number;
  notes?: string;
}

// GET - List cost adjustments
export async function GET(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || '';

    const where: Prisma.CostAdjustmentWhereInput = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.costAdjustment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.costAdjustment.count({ where }),
    ]);

    return apiPaginated(data, { page, limit, total })
  } catch (error) {
    console.error('[Cost Adjustments API] GET error:', error);
    return apiError('Failed to fetch cost adjustments', 500)
  }
}

// POST - Create new cost adjustment
export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createCostAdjustmentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const {
    systemId,
    id,
    branchId,
    employeeId,
    adjustmentDate,
    status,
    reason,
    items,
    createdBy,
  } = validation.data

  if (!branchId) {
    return apiError('Branch ID is required', 400)
  }

  try {
    const costAdjustment = await prisma.costAdjustment.create({
      data: {
        systemId,
        id,
        branchId,
        employeeId: employeeId || null,
        adjustmentDate: adjustmentDate ? new Date(adjustmentDate) : new Date(),
        status: (status || 'DRAFT') as CostAdjustmentStatus,
        reason: reason || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: CostAdjustmentItemInput) => ({
            productId: item.productId,
            oldCost: item.oldCost || 0,
            newCost: item.newCost || 0,
            quantity: 1,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(costAdjustment, 201)
  } catch (error) {
    console.error('[Cost Adjustments API] POST error:', error);
    return apiError('Failed to create cost adjustment', 500)
  }
}
