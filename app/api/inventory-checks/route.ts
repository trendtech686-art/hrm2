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

    return apiPaginated(mappedData, { page, limit, total });
  } catch (error) {
    console.error('[Inventory Checks API] GET error:', error);
    return apiError('Failed to fetch inventory checks', 500);
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

    return apiSuccess(inventoryCheck, 201);
  } catch (error) {
    console.error('[Inventory Checks API] POST error:', error);
    return apiError('Failed to create inventory check', 500);
  }
}
