/**
 * Sales Return Exchange API Route
 * 
 * POST /api/sales-returns/[systemId]/exchange - Exchange returned product for new product
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { v4 as uuidv4 } from 'uuid';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

interface ExchangeRequestBody {
  newProductSystemId: string;
  newQuantity: number;
  additionalPayment?: number;
  notes?: string;
}

// POST - Exchange returned product for new product
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body: ExchangeRequestBody = await request.json();

    const { newProductSystemId, newQuantity, additionalPayment, notes } = body;

    // Validate input
    if (!newProductSystemId) {
      return apiError('New product ID is required', 400);
    }

    if (!newQuantity || newQuantity <= 0) {
      return apiError('New quantity must be greater than 0', 400);
    }

    // Fetch sales return
    const salesReturn = await prisma.salesReturn.findUnique({
      where: { systemId },
      include: { items: true },
    });

    if (!salesReturn) {
      return apiNotFound('SalesReturn');
    }

    if (salesReturn.status === 'REJECTED') {
      return apiError('Cannot exchange rejected returns', 400);
    }

    // Fetch new product details
    const newProduct = await prisma.product.findUnique({
      where: { systemId: newProductSystemId },
    });

    if (!newProduct) {
      return apiError('New product not found', 404);
    }

    // Check inventory availability
    const branchId = salesReturn.branchId || salesReturn.branchSystemId;
    if (!branchId) {
      return apiError('Branch ID is required for exchange', 400);
    }

    const inventory = await prisma.productInventory.findUnique({
      where: {
        productId_branchId: {
          productId: newProductSystemId,
          branchId: branchId,
        },
      },
    });

    const availableQuantity = (inventory?.onHand || 0) - (inventory?.committed || 0);
    if (availableQuantity < newQuantity) {
      return apiError(`Insufficient inventory for exchange. Available: ${availableQuantity}`, 400);
    }

    // Calculate exchange value
    const newProductPrice = Number(newProduct.sellingPrice || newProduct.costPrice || 0);
    const exchangeTotal = newProductPrice * newQuantity;

    // Perform exchange in atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create exchange items array
      const exchangeItems = [{
        systemId: uuidv4(),
        productSystemId: newProductSystemId,
        productId: newProduct.id,
        productName: newProduct.name,
        productSku: newProduct.id,
        quantity: newQuantity,
        unitPrice: newProductPrice,
        total: exchangeTotal,
      }];

      // Update sales return with exchange information
      const updatedReturn = await tx.salesReturn.update({
        where: { systemId },
        data: {
          status: 'COMPLETED',
          exchangeItems: exchangeItems,
          exchangeOrderSystemId: null, // Could create a new order here
          grandTotalNew: exchangeTotal,
          subtotalNew: exchangeTotal,
          finalAmount: (additionalPayment || 0) - Number(salesReturn.total),
          notes: notes ? `${salesReturn.notes || ''}\nExchange: ${notes}` : salesReturn.notes,
          updatedAt: new Date(),
          updatedBy: session.user?.id || null,
        },
        include: {
          items: true,
        },
      });

      // Update inventory for returned items (add back to stock)
      for (const item of salesReturn.items) {
        const itemInventory = await tx.productInventory.findUnique({
          where: {
            productId_branchId: {
              productId: item.productId,
              branchId: branchId,
            },
          },
        });

        if (itemInventory) {
          await tx.productInventory.update({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: branchId,
              },
            },
            data: {
              onHand: { increment: item.quantity },
              updatedAt: new Date(),
            },
          });
        } else {
          await tx.productInventory.create({
            data: {
              productId: item.productId,
              branchId: branchId,
              onHand: item.quantity,
              committed: 0,
              inTransit: 0,
            },
          });
        }
      }

      // Update inventory for new product (subtract from stock)
      await tx.productInventory.update({
        where: {
          productId_branchId: {
            productId: newProductSystemId,
            branchId: branchId,
          },
        },
        data: {
          onHand: { decrement: newQuantity },
          committed: { increment: newQuantity },
          updatedAt: new Date(),
        },
      });

      return updatedReturn;
    });

    return apiSuccess({
      ...result,
      exchangeSummary: {
        originalValue: Number(salesReturn.total),
        newValue: exchangeTotal,
        additionalPayment: additionalPayment || 0,
        finalAmount: (additionalPayment || 0) - Number(salesReturn.total),
      },
    });
  } catch (error) {
    console.error('[Sales Returns Exchange API] POST error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to process exchange', 500);
  }
}
