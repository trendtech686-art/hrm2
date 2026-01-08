/**
 * Sales Returns API Route
 * 
 * GET    /api/sales-returns       - List all sales returns with pagination
 * POST   /api/sales-returns       - Create new sales return
 * 
 * Related: /api/sales-returns/[systemId]/route.ts for single item operations
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { SalesReturnStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createSalesReturnSchema } from './validation';

// Interface for sales return item input
interface SalesReturnItemInput {
  systemId: string;
  productId?: string;
  quantity?: number;
  unitPrice?: number;
  returnValue?: number;
  reason?: string;
}

// GET - List sales returns with pagination and filters
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const _includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: Prisma.SalesReturnWhereInput = {};
    
    // Note: SalesReturn table doesn't have isDeleted field
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.salesReturn.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.salesReturn.count({ where }),
    ]);

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    console.error('[Sales Returns API] GET error:', error);
    return apiError('Failed to fetch sales returns', 500);
  }
}

// POST - Create new sales return
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const result = await validateBody(request, createSalesReturnSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const {
      systemId,
      id,
      orderId,
      customerId,
      employeeId,
      branchId,
      returnDate,
      status,
      reason,
      subtotal,
      total,
      refunded,
      items,
      createdBy,
    } = result.data;

    // Create sales return with items
    const salesReturn = await prisma.salesReturn.create({
      data: {
        systemId,
        id,
        orderId,
        customerId: customerId || null,
        employeeId: employeeId || null,
        branchId: branchId || null,
        returnDate: returnDate ? new Date(returnDate) : new Date(),
        status: (status || 'PENDING') as SalesReturnStatus,
        reason: reason || null,
        subtotal: subtotal || 0,
        total: total || 0,
        refunded: refunded || 0,
        createdBy: createdBy || null,
        // Create items if provided
        items: items?.length ? {
          create: items.map((item: SalesReturnItemInput) => ({
            systemId: item.systemId,
            productId: item.productId || 'UNKNOWN',
            productName: item.productId || 'Unknown Product',
            productSku: item.productId || 'N/A',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0,
            total: item.returnValue || 0,
            reason: item.reason || null,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(salesReturn, 201);
  } catch (error) {
    console.error('[Sales Returns API] POST error:', error);
    return apiError('Failed to create sales return', 500);
  }
}
