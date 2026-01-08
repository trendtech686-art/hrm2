/**
 * Inventory Receipts API Route
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma, InventoryReceiptType, InventoryReceiptStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createInventoryReceiptSchema } from './validation';

// Interface for inventory receipt item input
interface InventoryReceiptItemInput {
  systemId: string;
  productId: string;
  quantity?: number;
  unitCost?: number;
  totalCost?: number;
  notes?: string;
}

// GET - List inventory receipts
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';

    const where: Prisma.InventoryReceiptWhereInput = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (type) {
      where.type = type as InventoryReceiptType;
    }

    const [data, total] = await Promise.all([
      prisma.inventoryReceipt.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
        },
      }),
      prisma.inventoryReceipt.count({ where }),
    ]);

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    console.error('[Inventory Receipts API] GET error:', error);
    return apiError('Failed to fetch inventory receipts', 500);
  }
}

// POST - Create new inventory receipt
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const result = await validateBody(request, createInventoryReceiptSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const {
      systemId,
      id,
      type,
      branchId,
      employeeId,
      referenceType,
      referenceId,
      receiptDate,
      status,
      notes,
      items,
      createdBy,
    } = result.data;

    const inventoryReceipt = await prisma.inventoryReceipt.create({
      data: {
        systemId,
        id,
        type: type as InventoryReceiptType,
        branchId,
        employeeId: employeeId || null,
        referenceType: referenceType || null,
        referenceId: referenceId || null,
        receiptDate: receiptDate ? new Date(receiptDate) : new Date(),
        status: (status || 'DRAFT') as InventoryReceiptStatus,
        notes: notes || null,
        createdBy: createdBy || null,
        items: items?.length ? {
          create: items.map((item: InventoryReceiptItemInput) => ({
            productId: item.productId,
            productName: item.productId, // Will be resolved from product
            productSku: item.productId, // Will be resolved from product
            quantity: item.quantity || 1,
            unitCost: item.unitCost || 0,
            totalCost: item.totalCost || 0,
          })),
        } : undefined,
      },
      include: {
        items: true,
      },
    });

    return apiSuccess(inventoryReceipt, 201);
  } catch (error) {
    console.error('[Inventory Receipts API] POST error:', error);
    return apiError('Failed to create inventory receipt', 500);
  }
}
