/**
 * Price Adjustment Confirm API Route
 * Confirms a price adjustment and updates product prices in the pricing policy
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { PriceAdjustmentStatus } from '@/generated/prisma/client'

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Confirm price adjustment and update product prices
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    // Get price adjustment with items
    const priceAdjustment = await prisma.priceAdjustment.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!priceAdjustment) {
      return apiNotFound('Price adjustment');
    }

    if (priceAdjustment.status === PriceAdjustmentStatus.CONFIRMED) {
      return apiError('Price adjustment already confirmed', 400);
    }

    if (priceAdjustment.status === PriceAdjustmentStatus.CANCELLED) {
      return apiError('Cannot confirm cancelled price adjustment', 400);
    }

    const pricingPolicyId = priceAdjustment.pricingPolicyId;

    // Update product prices in the pricing policy
    // ProductPrice uses composite key [productId, pricingPolicyId]
    const updatePromises = priceAdjustment.items
      .filter(item => item.productSystemId)
      .map(async (item) => {
        const newPrice = Number(item.newPrice);
        
        // Use upsert with composite key
        return prisma.productPrice.upsert({
          where: {
            productId_pricingPolicyId: {
              productId: item.productSystemId!,
              pricingPolicyId: pricingPolicyId,
            },
          },
          update: {
            price: newPrice,
          },
          create: {
            productId: item.productSystemId!,
            pricingPolicyId: pricingPolicyId,
            price: newPrice,
          },
        });
      });

    // Execute all product price updates
    await Promise.all(updatePromises);

    // Get current user info for confirmedBy fields
    const body = await request.json().catch(() => ({}));
    const confirmedBySystemId = body.confirmedBy || session.user?.id || null;
    let confirmedByName = body.confirmedByName || null;
    
    // Lookup confirmer name if not provided
    if (!confirmedByName && confirmedBySystemId) {
      const confirmer = await prisma.employee.findUnique({
        where: { systemId: confirmedBySystemId },
        select: { fullName: true },
      });
      confirmedByName = confirmer?.fullName || null;
    }

    // Update price adjustment status
    const updatedAdjustment = await prisma.priceAdjustment.update({
      where: { systemId },
      data: {
        status: PriceAdjustmentStatus.CONFIRMED,
        confirmedDate: new Date(),
        confirmedBySystemId,
        confirmedByName,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });

    // Transform for response
    const transformedAdjustment = {
      ...updatedAdjustment,
      items: updatedAdjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
      updatedProducts: priceAdjustment.items.length,
    };

    return apiSuccess(transformedAdjustment);
  } catch (error) {
    console.error('[Price Adjustments API] Confirm error:', error);
    return apiError('Failed to confirm price adjustment', 500);
  }
}
