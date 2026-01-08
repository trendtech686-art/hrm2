/**
 * Purchase Returns API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { PurchaseReturnStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createPurchaseReturnSchema } from './validation';

// Interface for purchase return item input
interface PurchaseReturnItemInput {
  systemId: string;
  productId: string;
  quantity?: number;
  unitPrice?: number;
  returnValue?: number;
  reason?: string;
}

// GET - List purchase returns
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';

    const where: Prisma.PurchaseReturnWhereInput = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.purchaseReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          suppliers: true,
        },
      }),
      prisma.purchaseReturn.count({ where }),
    ]);

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    console.error('[Purchase Returns API] GET error:', error);
    return apiError('Failed to fetch purchase returns', 500);
  }
}

// POST - Create new purchase return
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const result = await validateBody(request, createPurchaseReturnSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const {
      systemId,
      id,
      supplierId,
      purchaseOrderId,
      branchId,
      employeeId,
      returnDate,
      status,
      reason,
      subtotal,
      total,
      items,
      createdBy,
    } = result.data;

    const purchaseReturn = await prisma.purchaseReturn.create({
      data: {
        systemId,
        id,
        supplierId,
        purchaseOrderId: purchaseOrderId || null,
        branchId: branchId || null,
        employeeId: employeeId || null,
        returnDate: returnDate ? new Date(returnDate) : new Date(),
        status: (status || 'DRAFT') as PurchaseReturnStatus,
        reason: reason || null,
        subtotal: subtotal || 0,
        total: total || 0,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: PurchaseReturnItemInput) => ({
            systemId: item.systemId,
            productId: item.productId,
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            total: item.returnValue || 0,
            reason: item.reason || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
        suppliers: true,
      },
    });

    return apiSuccess(purchaseReturn, 201);
  } catch (error) {
    console.error('[Purchase Returns API] POST error:', error);
    return apiError('Failed to create purchase return', 500);
  }
}
