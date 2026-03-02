/**
 * POST /api/products/validate-stock
 * Validate stock availability for multiple products in a branch
 * 
 * This API allows order form to validate stock without loading all products
 * Reduces memory usage and improves performance significantly
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface StockValidationItem {
  productSystemId: string;
  productName: string;
  quantity: number;
}

interface RequestBody {
  branchSystemId: string;
  items: StockValidationItem[];
  existingOrderSystemId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: RequestBody = await request.json();
    const { branchSystemId, items, existingOrderSystemId } = body;

    if (!branchSystemId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Get all product systemIds
    const productSystemIds = items.map(item => item.productSystemId);

    // Fetch inventory for all products in one query
    // Note: ProductInventory uses productId (which is the systemId of Product)
    const inventories = await prisma.productInventory.findMany({
      where: {
        productId: { in: productSystemIds },
        branchId: branchSystemId,
      },
      select: {
        productId: true,
        onHand: true,
        committed: true,
      },
    });

    // Create a map for quick lookup (productId is actually Product.systemId)
    const inventoryMap = new Map(
      inventories.map(inv => [inv.productId, inv])
    );

    // If editing an existing order, get the quantities currently held by that order
    const existingOrderQuantities = new Map<string, number>();
    if (existingOrderSystemId) {
      const existingOrder = await prisma.order.findUnique({
        where: { systemId: existingOrderSystemId },
        select: {
          status: true,
          lineItems: {
            select: {
              productId: true,
              quantity: true,
            },
          },
        },
      });

      if (existingOrder && ['Đang giao dịch', 'Chờ lấy hàng', 'Đang giao hàng', 'Chờ giao lại'].includes(existingOrder.status)) {
        existingOrder.lineItems.forEach(li => {
          // lineItems.productId is also Product.systemId
          if (li.productId) {
            existingOrderQuantities.set(li.productId, li.quantity);
          }
        });
      }
    }

    // Validate each item
    const errors: Array<{
      productSystemId: string;
      productName: string;
      requested: number;
      available: number;
    }> = [];

    for (const item of items) {
      const inventory = inventoryMap.get(item.productSystemId);
      const onHand = inventory?.onHand || 0;
      const committed = inventory?.committed || 0;
      let available = onHand - committed;

      // Add back quantity from existing order if editing
      const existingQty = existingOrderQuantities.get(item.productSystemId) || 0;
      available += existingQty;

      if (available < item.quantity) {
        errors.push({
          productSystemId: item.productSystemId,
          productName: item.productName,
          requested: item.quantity,
          available: Math.max(0, available),
        });
      }
    }

    return NextResponse.json({
      valid: errors.length === 0,
      errors,
    });
  } catch (error) {
    console.error('Error validating stock:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
