/**
 * Stock Transfers API Route
 * 
 * GET    /api/stock-transfers       - List all stock transfers with pagination
 * POST   /api/stock-transfers       - Create new stock transfer
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { StockTransferStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createStockTransferSchema } from './validation';

// Interface for stock transfer item input
interface StockTransferItemInput {
  systemId: string;
  productId: string;
  productName?: string;
  productSku?: string;
  quantity?: number;
  notes?: string;
}

// GET - List stock transfers
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const _includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: Prisma.StockTransferWhereInput = {};
    
    // Note: StockTransfer model doesn't have isDeleted field
    // Filter by status instead if needed
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.stockTransfer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.stockTransfer.count({ where }),
    ]);

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    console.error('[Stock Transfers API] GET error:', error);
    return apiError('Failed to fetch stock transfers', 500);
  }
}

// POST - Create new stock transfer
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const result = await validateBody(request, createStockTransferSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const {
      systemId,
      id,
      fromBranchId,
      toBranchId,
      employeeId,
      transferDate,
      receivedDate,
      status,
      notes,
      items,
      createdBy,
    } = result.data;

    const stockTransfer = await prisma.stockTransfer.create({
      data: {
        systemId,
        id,
        fromBranchId,
        toBranchId,
        employeeId: employeeId || null,
        transferDate: transferDate ? new Date(transferDate) : new Date(),
        receivedDate: receivedDate ? new Date(receivedDate) : null,
        status: (status || 'DRAFT') as StockTransferStatus,
        notes: notes || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: StockTransferItemInput) => ({
            systemId: item.systemId,
            productId: item.productId,
            productName: item.productName || '',
            productSku: item.productSku || '',
            quantity: item.quantity || 1,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(stockTransfer, 201);
  } catch (error) {
    console.error('[Stock Transfers API] POST error:', error);
    return apiError('Failed to create stock transfer', 500);
  }
}
