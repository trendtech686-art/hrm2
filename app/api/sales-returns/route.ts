/**
 * Sales Returns API Route
 * 
 * GET    /api/sales-returns       - List all sales returns with pagination and filtering
 * POST   /api/sales-returns       - Create new sales return with inventory updates
 * 
 * Related: /api/sales-returns/[systemId]/route.ts for single item operations
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { SalesReturnStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createSalesReturnSchema } from './validation';
import { generateIdWithPrefix } from '@/lib/id-generator';
import { v4 as uuidv4 } from 'uuid';

// Interface for sales return item input
interface _SalesReturnItemInput {
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
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const orderId = searchParams.get('orderId');
    const branchId = searchParams.get('branchId');
    const isReceived = searchParams.get('isReceived');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const where: Prisma.SalesReturnWhereInput = {};
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status as SalesReturnStatus;
    }

    if (customerId) {
      where.customerId = customerId;
    }

    if (orderId) {
      where.orderId = orderId;
    }

    if (branchId) {
      where.branchId = branchId;
    }

    if (isReceived !== null && isReceived !== undefined) {
      where.isReceived = isReceived === 'true';
    }

    if (startDate || endDate) {
      where.returnDate = {};
      if (startDate) {
        where.returnDate.gte = new Date(startDate);
      }
      if (endDate) {
        where.returnDate.lte = new Date(endDate);
      }
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

// POST - Create new sales return with inventory and order updates
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const result = await validateBody(request, createSalesReturnSchema);
  if (!result.success) return apiError(result.error, 400);

  try {
    const {
      orderId,
      reason,
      items,
      createdBy,
    } = result.data;

    // Validate that order exists
    const order = await prisma.order.findUnique({
      where: { systemId: orderId },
      include: { lineItems: true, customer: true },
    });

    if (!order) {
      return apiError('Order not found', 404);
    }

    // Validate return items against order
    if (!items || items.length === 0) {
      return apiError('At least one return item is required', 400);
    }

    for (const item of items) {
      if (!item.productId) {
        return apiError('Product ID is required for all return items', 400);
      }

      const orderItem = order.lineItems.find(li => li.productId === item.productId);
      if (!orderItem) {
        return apiError(`Product ${item.productId} not found in order`, 400);
      }

      if ((item.quantity || 0) <= 0) {
        return apiError('Return quantity must be greater than 0', 400);
      }

      if ((item.quantity || 0) > orderItem.quantity) {
        return apiError(`Return quantity exceeds ordered quantity for product ${item.productId}`, 400);
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => 
      sum + ((item.unitPrice || 0) * (item.quantity || 0)), 0);
    const total = subtotal; // Can add fees/adjustments here

    // Create sales return with atomic transaction
    const salesReturn = await prisma.$transaction(async (tx) => {
      // Generate IDs
      const systemId = uuidv4();
      const businessId = await generateIdWithPrefix('TH', tx); // TH = Trả Hàng

      // Create sales return record
      const newReturn = await tx.salesReturn.create({
        data: {
          systemId,
          id: businessId,
          orderId: order.systemId,
          customerId: order.customerId,
          customerName: order.customerName,
          customerSystemId: order.customerId,
          employeeId: session.user?.id || null,
          branchId: order.branchId,
          branchSystemId: order.branchId,
          branchName: order.branchName,
          orderSystemId: order.systemId,
          orderBusinessId: order.id,
          returnDate: new Date(),
          status: SalesReturnStatus.PENDING,
          reason: reason || null,
          note: reason || null,
          notes: reason || null,
          subtotal,
          total,
          totalReturnValue: total,
          refunded: 0,
          isReceived: false, // Will be marked as received later
          createdBy: createdBy || session.user?.id || null,
          creatorSystemId: session.user?.id || null,
          creatorName: session.user?.name || null,
          // Store return items as JSON for flexible structure
          returnItems: items.map(item => ({
            systemId: item.systemId || uuidv4(),
            productSystemId: item.productId,
            productId: item.productId,
            quantity: item.quantity || 0,
            unitPrice: item.unitPrice || 0,
            returnValue: (item.unitPrice || 0) * (item.quantity || 0),
            reason: item.reason || null,
          })),
          // Create individual item records
          items: {
            create: items.map(item => {
              const orderItem = order.lineItems.find(li => li.productId === item.productId);
              return {
                systemId: item.systemId || uuidv4(),
                productId: item.productId!,
                productName: orderItem?.productName || 'Unknown Product',
                productSku: orderItem?.productSku || 'N/A',
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || orderItem?.unitPrice || 0,
                total: (Number(item.unitPrice) || Number(orderItem?.unitPrice) || 0) * (item.quantity || 1),
                reason: item.reason || null,
              };
            }),
          },
        },
        include: {
          items: true,
        },
      });

      // Note: Inventory updates will be handled when marking as received
      // This keeps inventory tracking accurate - don't update until items physically arrive

      return newReturn;
    });

    return apiSuccess(salesReturn, 201);
  } catch (error) {
    console.error('[Sales Returns API] POST error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to create sales return', 500);
  }
}
