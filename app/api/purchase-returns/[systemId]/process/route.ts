/**
 * Purchase Return Process Route
 * 
 * POST /api/purchase-returns/:systemId/process
 * 
 * Processes an approved purchase return:
 * - Updates status to COMPLETED
 * - Records processing timestamp
 * - Adds activity history entry
 * 
 * Note: Inventory and supplier balance are already updated when status changes to APPROVED.
 * This endpoint is for marking the administrative/financial processing as complete.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { PurchaseReturnStatus } from '@/generated/prisma/client';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Process approved purchase return
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Get existing return
    const existingReturn = await prisma.purchaseReturn.findUnique({
      where: { systemId },
      include: { items: true, suppliers: true },
    });

    if (!existingReturn) {
      return apiNotFound('PurchaseReturn');
    }

    // Verify return is approved
    if (existingReturn.status !== PurchaseReturnStatus.APPROVED) {
      return apiError(
        `Cannot process purchase return with status ${existingReturn.status}. Must be APPROVED.`,
        400
      );
    }

    // Update to COMPLETED with activity history
    const purchaseReturn = await prisma.$transaction(async (tx) => {
      const activityEntry = {
        timestamp: new Date().toISOString(),
        action: 'PROCESSED',
        field: 'status',
        oldValue: 'APPROVED',
        newValue: 'COMPLETED',
        userId: session.user?.id || null,
        userName: session.user?.name || 'System',
        description: 'Purchase return processing completed',
      };

      const existingHistory = (existingReturn.activityHistory as unknown as Array<Record<string, unknown>>) || [];

      const updated = await tx.purchaseReturn.update({
        where: { systemId },
        data: {
          status: PurchaseReturnStatus.COMPLETED,
          updatedAt: new Date(),
          updatedBy: session.user?.id || null,
          activityHistory: [...existingHistory, activityEntry] as unknown as Prisma.InputJsonValue,
        },
        include: {
          items: true,
          suppliers: true,
        },
      });

      return updated;
    });

    return apiSuccess(purchaseReturn);
  } catch (error) {
    console.error('[Purchase Returns Process API] POST error:', error);
    if (error instanceof Error) {
      return apiError(error.message, 500);
    }
    return apiError('Failed to process purchase return', 500);
  }
}
