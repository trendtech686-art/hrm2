/**
 * Cost Adjustments API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { CostAdjustmentStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createCostAdjustmentSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'

// Interface for cost adjustment item input
interface CostAdjustmentItemInput {
  systemId?: string;
  productId?: string;
  productSystemId?: string;
  productName?: string;
  productImage?: string;
  oldCost?: number;
  newCost?: number;
  oldCostPrice?: number;
  newCostPrice?: number;
  adjustmentAmount?: number;
  adjustmentPercent?: number;
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
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const where: Prisma.CostAdjustmentWhereInput = {};

    if (status) {
      where.status = status as CostAdjustmentStatus;
    }
    
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
        orderBy: { [sortBy]: sortOrder },
        include: {
          items: true,
        },
      }),
      prisma.costAdjustment.count({ where }),
    ]);

    // Lookup employee names for all adjustments
    const employeeIds = data
      .flatMap(adj => [adj.createdBySystemId, adj.createdBy, adj.confirmedBySystemId, adj.cancelledBySystemId])
      .filter(Boolean) as string[];
    
    const employeeMap = new Map<string, string>();
    if (employeeIds.length > 0) {
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: [...new Set(employeeIds)] } },
        select: { systemId: true, fullName: true },
      });
      employees.forEach(e => employeeMap.set(e.systemId, e.fullName));
    }

    // Transform data for frontend
    const transformedData = data.map(adj => ({
      ...adj,
      // Employee names - use stored name or lookup
      createdByName: adj.createdByName || employeeMap.get(adj.createdBySystemId || adj.createdBy || '') || null,
      confirmedByName: adj.confirmedByName || employeeMap.get(adj.confirmedBySystemId || '') || null,
      cancelledByName: adj.cancelledByName || employeeMap.get(adj.cancelledBySystemId || '') || null,
      // Transform items
      items: adj.items?.map(item => ({
        ...item,
        productSystemId: item.productId,
        oldCostPrice: Number(item.oldCost) || 0,
        newCostPrice: Number(item.newCost) || 0,
        adjustmentAmount: Number(item.newCost || 0) - Number(item.oldCost || 0),
        adjustmentPercent: Number(item.oldCost) > 0 
          ? ((Number(item.newCost || 0) - Number(item.oldCost || 0)) / Number(item.oldCost) * 100)
          : 0,
      })) || [],
    }));

    return apiPaginated(transformedData, { page, limit, total })
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
    systemId: _inputSystemId, // Ignored - use generateNextIds instead
    id: inputId,
    businessId,
    branchId: inputBranchId,
    employeeId,
    adjustmentDate,
    status,
    reason,
    note,
    referenceCode,
    items,
    createdBy,
    createdByName,
  } = validation.data

  // Generate IDs using id-system (follows HRM ID governance)
  const customBusinessId = inputId || businessId || undefined;
  const { systemId, businessId: generatedBusinessId } = await generateNextIds('cost-adjustments', customBusinessId);
  const id = customBusinessId || generatedBusinessId;
  
  // Get default branch if not provided
  let branchId = inputBranchId;
  if (!branchId) {
    const defaultBranch = await prisma.branch.findFirst({ where: { isDefault: true } });
    branchId = defaultBranch?.systemId;
  }
  if (!branchId) {
    return apiError('Branch ID is required', 400);
  }

  // Lookup creator name if not provided
  let finalCreatedByName: string | null = createdByName || null;
  if (!finalCreatedByName && createdBy) {
    const creator = await prisma.employee.findUnique({
      where: { systemId: createdBy },
      select: { fullName: true },
    });
    finalCreatedByName = creator?.fullName || null;
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
        note: note || referenceCode || null,
        createdBy: createdBy || null,
        createdBySystemId: createdBy || null,
        createdByName: finalCreatedByName || null,
        items: items?.length ? {
          create: items.map((item: CostAdjustmentItemInput, index: number) => ({
            systemId: item.systemId || `${systemId}-${index + 1}`,
            productId: item.productId || item.productSystemId || '',
            productSystemId: item.productSystemId || item.productId || '',
            productName: item.productName || null,
            productImage: item.productImage || null,
            oldCost: item.oldCost ?? item.oldCostPrice ?? 0,
            newCost: item.newCost ?? item.newCostPrice ?? 0,
            adjustmentAmount: (item.newCost ?? item.newCostPrice ?? 0) - (item.oldCost ?? item.oldCostPrice ?? 0),
            adjustmentPercent: (item.oldCost ?? item.oldCostPrice ?? 0) > 0 
              ? (((item.newCost ?? item.newCostPrice ?? 0) - (item.oldCost ?? item.oldCostPrice ?? 0)) / (item.oldCost ?? item.oldCostPrice ?? 1) * 100)
              : 0,
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
