import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { loadGHTKConfig, fetchGHTKOrderStatus, updatePackagingFromGHTK } from '@/lib/ghtk-sync'
import { getGHTKStatusInfo } from '@/lib/ghtk-constants'

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// POST /api/orders/[systemId]/packaging/[packagingId]/ghtk/sync
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
    });

    if (!packaging) return apiNotFound('Packaging');
    if (packaging.orderId !== systemId) return apiError('Packaging does not belong to this order', 400);
    if (packaging.carrier !== 'GHTK') return apiError('Packaging is not a GHTK shipment', 400);
    if (!packaging.trackingCode) return apiError('Packaging has no tracking code', 400);

    const ghtkConfig = await loadGHTKConfig();
    if (!ghtkConfig) return apiError('GHTK is not configured', 400);

    // Fetch status from GHTK API
    const statusResponse = await fetchGHTKOrderStatus(
      packaging.trackingCode,
      ghtkConfig.apiToken,
      ghtkConfig.partnerCode
    );

    if (!statusResponse.success || !statusResponse.order) {
      return apiError(statusResponse.message || 'Failed to get GHTK status', 400);
    }

    const ghtkStatusId = parseInt(statusResponse.order.status, 10);

    // Update packaging + order via shared module
    const result = await updatePackagingFromGHTK(packagingId, ghtkStatusId, {
      fee: statusResponse.order.ship_money,
      pickMoney: statusResponse.order.pick_money,
      actionTime: statusResponse.order.modified || undefined,
    });

    if (!result.success) {
      return apiError(result.message, 500);
    }

    // Log activity
    const statusInfo = getGHTKStatusInfo(ghtkStatusId);
    const statusText = statusInfo?.statusText || statusResponse.order.status_text || `Trạng thái ${statusResponse.order.status}`;
    const userName = session.user?.employee?.fullName || session.user?.name || 'GHTK';
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Đồng bộ GHTK - ${statusText}`,
      actionType: 'status',
      metadata: { userName },
      createdBy: session.user?.id,
    }).catch(e => logError('[GHTK Sync] activity log failed', e));

    return apiSuccess({ success: true, status: statusText });
  } catch (error) {
    logError('Error syncing GHTK shipment', error);
    return apiError(error instanceof Error ? error.message : 'Failed to sync GHTK shipment', 500);
  }
}
