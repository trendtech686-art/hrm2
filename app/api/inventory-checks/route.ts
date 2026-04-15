/**
 * Inventory Checks API Route
 * 
 * GET    /api/inventory-checks       - List all inventory checks
 * POST   /api/inventory-checks       - Create new inventory check
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { InventoryCheckStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createInventoryCheckSchema } from './validation';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

// Interface for inventory check item input (matches frontend)
interface InventoryCheckItemInput {
  productSystemId: string;
  productId: string;
  productName?: string;
  unit?: string;
  systemQuantity?: number;
  actualQuantity?: number;
  difference?: number;
  reason?: string;
  note?: string;
}

// GET - List inventory checks
// Helper to map DB item to app type
function mapInventoryCheckItem(item: {
  systemId: string;
  checkId: string;
  productId: string | null;
  productName: string;
  productSku: string;
  systemQty: number;
  actualQty: number;
  difference: number;
  notes: string | null;
}) {
  return {
    productSystemId: item.productId || item.productSku,
    productId: item.productSku,
    productName: item.productName,
    unit: '',
    systemQuantity: item.systemQty,
    actualQuantity: item.actualQty,
    difference: item.difference,
    reason: undefined,
    note: item.notes,
  };
}

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const _includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: Prisma.InventoryCheckWhereInput = {};
    
    // Note: InventoryCheck table doesn't have isDeleted field
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status as InventoryCheckStatus;
    }

    // Build orderBy
    const orderBy: Prisma.InventoryCheckOrderByWithRelationInput = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      prisma.inventoryCheck.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          items: true,
        },
      }),
      prisma.inventoryCheck.count({ where }),
    ]);

    // Map items to app types
    const mappedData = data.map(check => ({
      ...check,
      items: check.items.map(mapInventoryCheckItem),
    }));

    // Batch resolve employee names for createdBy/balancedBy
    const employeeIds = [...new Set(
      data.flatMap(c => [c.createdBy, c.balancedBy]).filter(Boolean) as string[]
    )]
    const employees = employeeIds.length > 0
      ? await prisma.employee.findMany({
          where: { systemId: { in: employeeIds } },
          select: { systemId: true, fullName: true },
        })
      : []
    const empMap = new Map(employees.map(e => [e.systemId, e.fullName]))
    const withNames = mappedData.map(check => ({
      ...check,
      createdByName: empMap.get(check.createdBy || '') || null,
      balancedByName: empMap.get(check.balancedBy || '') || null,
    }))

    return apiPaginated(withNames, { page, limit, total });
  } catch (error) {
    logError('[Inventory Checks API] GET error', error);
    return apiError('Lỗi khi lấy danh sách phiếu kiểm kê', 500);
  }
}

// POST - Create new inventory check
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const result = await validateBody(request, createInventoryCheckSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const data = result.data;

    const inventoryCheck = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'inventory-checks',
        data.id?.trim() || undefined
      );

      return tx.inventoryCheck.create({
        data: {
          systemId,
          id: businessId,
          branchId: data.branchSystemId, // Map branchSystemId to branchId
          branchSystemId: data.branchSystemId,
          branchName: data.branchName || null,
          employeeId: data.employeeId || null,
          checkDate: data.checkDate ? new Date(data.checkDate) : new Date(),
          status: (data.status?.toUpperCase() || 'DRAFT') as InventoryCheckStatus,
          notes: data.note || data.notes || null,
          createdBy: data.createdBy || null,
          items: data.items?.length ? {
            create: data.items.map((item: InventoryCheckItemInput) => ({
              productId: item.productSystemId, // Use productSystemId
              productName: item.productName || item.productId,
              productSku: item.productId,
              systemQty: item.systemQuantity || 0,
              actualQty: item.actualQuantity || 0,
              difference: item.difference || 0,
              notes: item.note || null,
            })),
          } : undefined,
        },
        include: {
          items: true,
        },
      });
    });

    // ✅ Notify assigned employee about new inventory check
    if (data.employeeId && data.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'inventory_check',
        settingsKey: 'inventory-check:updated',
        title: 'Kiểm kho mới',
        message: `Phiếu kiểm kho ${inventoryCheck.id || inventoryCheck.systemId} tại ${data.branchName || data.branchSystemId}`,
        link: `/inventory-checks/${inventoryCheck.systemId}`,
        recipientId: data.employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Inventory Checks POST] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'inventory_check',
          entityId: inventoryCheck.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu kiểm kê`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] inventory_check create failed', e))
    return apiSuccess(inventoryCheck, 201);
  } catch (error) {
    logError('[Inventory Checks API] POST error', error);
    return apiError('Lỗi khi tạo phiếu kiểm kê', 500);
  }
}
