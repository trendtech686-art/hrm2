/**
 * Inventory Check Cancel API Route
 * 
 * POST /api/inventory-checks/[systemId]/cancel - Cancel an inventory check
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// POST - Cancel inventory check
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const { reason, cancelledBy } = body;

    // Get the inventory check
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
    });

    if (!inventoryCheck) {
      return apiNotFound('Inventory check');
    }

    // Validate status - only DRAFT can be cancelled
    const currentStatus = String(inventoryCheck.status).toUpperCase();
    if (currentStatus !== 'DRAFT') {
      return apiError(`Chỉ có thể hủy phiếu ở trạng thái Nháp. Trạng thái hiện tại: ${inventoryCheck.status}`, 400);
    }

    // Use raw SQL to update status to avoid enum issues
    await prisma.$executeRaw`
      UPDATE inventory_checks 
      SET status = 'CANCELLED', 
          "cancelledAt" = NOW(), 
          "cancelledBy" = ${cancelledBy || session.user?.id || null},
          "cancelledReason" = ${reason || null},
          "updatedAt" = NOW()
      WHERE "systemId" = ${systemId}
    `;

    // Fetch the updated record
    const updatedCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: { items: true },
    });

    return apiSuccess(updatedCheck);
  } catch (error) {
    console.error('[Inventory Checks API] Cancel error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return apiError(`Failed to cancel inventory check: ${errorMessage}`, 500);
  }
}
