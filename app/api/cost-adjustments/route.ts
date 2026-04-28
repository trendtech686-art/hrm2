/**
 * Cost Adjustments API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { CostAdjustmentStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { requirePermission } from '@/lib/api-utils'
import { createCostAdjustmentSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

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
    
    const searchWhere = buildSearchWhere<Prisma.CostAdjustmentWhereInput>(search, ['id', 'reason'])
    if (searchWhere) Object.assign(where, searchWhere)

    const [data, total] = await Promise.all([
      prisma.costAdjustment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
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
      // Transform items - exclude Decimal fields from spread
      items: adj.items?.map(item => {
        const { oldCost, newCost, ...rest } = item;
        const oldCostNum = Number(oldCost) || 0;
        const newCostNum = Number(newCost) || 0;
        return {
          ...rest,
          productSystemId: item.productId,
          oldCost: oldCostNum,
          newCost: newCostNum,
          oldCostPrice: oldCostNum,
          newCostPrice: newCostNum,
          adjustmentAmount: newCostNum - oldCostNum,
          adjustmentPercent: oldCostNum > 0 
            ? ((newCostNum - oldCostNum) / oldCostNum * 100)
            : 0,
        };
      }) || [],
    }));

    return apiPaginated(transformedData, { page, limit, total })
  } catch (error) {
    logError('[Cost Adjustments API] GET error', error);
    return apiError('Lỗi khi lấy danh sách điều chỉnh giá vốn', 500)
  }
}

// POST - Create new cost adjustment
export async function POST(request: NextRequest) {
  const result = await requirePermission('create_cost_adjustment')
  if (result instanceof Response) return result
  const session = result

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
      return apiError('Mã chi nhánh là bắt buộc', 400);
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

    // Transform Decimal fields before returning
    const transformed = {
      ...costAdjustment,
      items: costAdjustment.items?.map(item => {
        // Destructure to exclude Decimal fields from spread
        const { oldCost, newCost, adjustmentAmount, adjustmentPercent, ...rest } = item;
        const oldCostNum = Number(oldCost) || 0;
        const newCostNum = Number(newCost) || 0;
        return {
          ...rest,
          oldCost: oldCostNum,
          newCost: newCostNum,
          oldCostPrice: oldCostNum,
          newCostPrice: newCostNum,
          adjustmentAmount: Number(adjustmentAmount) || (newCostNum - oldCostNum),
          adjustmentPercent: Number(adjustmentPercent) || (oldCostNum > 0 ? ((newCostNum - oldCostNum) / oldCostNum * 100) : 0),
        };
      }) || [],
    };
    // ✅ Notify assigned employee about new cost adjustment
    if (employeeId && employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'cost_adjustment',
        settingsKey: 'cost-adjustment:updated',
        title: 'Điều chỉnh giá vốn mới',
        message: `Phiếu điều chỉnh giá vốn ${id || systemId}${reason ? ` - ${reason}` : ''}`,
        link: `/cost-adjustments/${systemId}`,
        recipientId: employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Cost Adjustments POST] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'cost_adjustment',
          entityId: transformed.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu điều chỉnh giá vốn`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] cost_adjustment create failed', e))
    return apiSuccess(transformed, 201)
  } catch (error) {
    logError('[Cost Adjustments API] POST error', error);
    return apiError('Lỗi khi tạo phiếu điều chỉnh giá vốn', 500)
  }
}
