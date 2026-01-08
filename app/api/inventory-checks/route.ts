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

// Interface for inventory check item input
interface InventoryCheckItemInput {
  systemId: string;
  productId: string;
  expectedQuantity?: number;
  actualQuantity?: number;
  difference?: number;
  notes?: string;
}

// GET - List inventory checks
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const _includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: Prisma.InventoryCheckWhereInput = {};
    
    // Note: InventoryCheck table doesn't have isDeleted field
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.inventoryCheck.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.inventoryCheck.count({ where }),
    ]);

    return apiPaginated(data, { page, limit, total });
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
    const {
      systemId,
      id,
      branchId,
      employeeId,
      checkDate,
      status,
      notes,
      items,
      createdBy,
    } = result.data;

    const inventoryCheck = await prisma.inventoryCheck.create({
      data: {
        systemId,
        id,
        branchId,
        employeeId: employeeId || null,
        checkDate: checkDate ? new Date(checkDate) : new Date(),
        status: (status || 'DRAFT') as InventoryCheckStatus,
        notes: notes || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: InventoryCheckItemInput) => ({
            productId: item.productId,
            productName: item.productId, // Will be resolved from product
            productSku: item.productId, // Will be resolved from product
            systemQty: item.expectedQuantity || 0,
            actualQty: item.actualQuantity || 0,
            difference: item.difference || 0,
            notes: item.notes || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(inventoryCheck, 201);
  } catch (error) {
    console.error('[Inventory Checks API] POST error:', error);
    return apiError('Failed to create inventory check', 500);
  }
}
