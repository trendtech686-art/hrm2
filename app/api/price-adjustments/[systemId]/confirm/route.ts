/**
 * Price Adjustment Confirm API Route
 * Confirms a price adjustment and updates product prices in the pricing policy
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { PriceAdjustmentStatus } from '@/generated/prisma/client'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'

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
      select: {
        systemId: true,
        id: true,
        pricingPolicyId: true,
        status: true,
        confirmedDate: true,
        confirmedBySystemId: true,
        confirmedByName: true,
        cancelledDate: true,
        cancelledBySystemId: true,
        cancelledByName: true,
        cancelReason: true,
        createdBySystemId: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            id: true,
            productSystemId: true,
            oldPrice: true,
            newPrice: true,
            adjustmentAmount: true,
            adjustmentPercent: true,
          },
        },
      },
    });

    if (!priceAdjustment) {
      return apiNotFound('Price adjustment');
    }

    if (priceAdjustment.status === PriceAdjustmentStatus.CONFIRMED) {
      return apiError('Phiếu điều chỉnh giá đã được xác nhận', 400);
    }

    if (priceAdjustment.status === PriceAdjustmentStatus.CANCELLED) {
      return apiError('Không thể xác nhận phiếu đã bị hủy', 400);
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
      select: {
        systemId: true,
        id: true,
        pricingPolicyId: true,
        status: true,
        confirmedDate: true,
        confirmedBySystemId: true,
        confirmedByName: true,
        cancelledDate: true,
        cancelledBySystemId: true,
        cancelledByName: true,
        cancelReason: true,
        createdBySystemId: true,
        createdAt: true,
        updatedAt: true,
        items: {
          select: {
            systemId: true,
            id: true,
            productSystemId: true,
            oldPrice: true,
            newPrice: true,
            adjustmentAmount: true,
            adjustmentPercent: true,
          },
        },
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

    // Notify creator about confirmation
    if (priceAdjustment.createdBySystemId && priceAdjustment.createdBySystemId !== session.user?.employeeId) {
      createNotification({
        type: 'price_adjustment',
        settingsKey: 'price-adjustment:updated',
        title: 'Điều chỉnh giá đã duyệt',
        message: `Phiếu điều chỉnh giá ${priceAdjustment.id || systemId} đã được duyệt`,
        link: `/price-adjustments/${systemId}`,
        recipientId: priceAdjustment.createdBySystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Price Adjustment Confirm] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'price_adjustment',
          entityId: systemId,
          action: 'confirmed',
          actionType: 'update',
          note: `Xác nhận điều chỉnh giá`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] price_adjustment confirmed failed', e))
    return apiSuccess(transformedAdjustment);
  } catch (error) {
    logError('[Price Adjustments API] Confirm error', error);
    return apiError('Lỗi khi xác nhận phiếu điều chỉnh giá', 500);
  }
}
