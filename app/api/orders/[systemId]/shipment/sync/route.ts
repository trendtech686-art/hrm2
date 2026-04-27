import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { loadGHTKConfig, fetchGHTKOrderStatus, updatePackagingFromGHTK } from '@/lib/ghtk-sync';
import { getGHTKStatusInfo } from '@/lib/ghtk-constants';
import { fetchWithTimeout } from '@/lib/fetch-utils';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// POST /api/orders/[systemId]/shipment/sync - Sync shipment status from provider
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Get order with shipment
    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        packagings: {
          include: { shipment: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    const activePackaging = order.packagings.find((p) => !p.cancelDate);
    const shipment = activePackaging?.shipment;

    if (!shipment) {
      return apiNotFound('Shipment');
    }

    // Validate request body for token if needed
    let requestToken: string | undefined;
    try {
      const body = await request.json();
      requestToken = body.token;
    } catch {
      // No body provided, that's ok
    }

    // Sync shipment status from provider based on carrier type
    let syncResult: { success: boolean; message?: string; status?: string } = { success: true };

    if (shipment.carrier === 'GHTK' && shipment.trackingCode) {
      // GHTK sync - fetch status from GHTK API
      syncResult = await syncGHTKShipment(shipment.trackingCode);
    } else if (shipment.carrier === 'VTP' && shipment.trackingCode) {
      // Viettel Post sync - call VTP status API
      syncResult = await syncVTPShipment(shipment.trackingCode, requestToken);
    } else if (shipment.carrier === 'GHN' && shipment.trackingCode) {
      // Giao Hàng Nhanh sync - placeholder for future implementation
      syncResult = { success: true, message: 'GHN sync not yet implemented' };
    }
    // Add other carriers here as needed (J&T, Ninja Van, etc.)

    if (!syncResult.success) {
      logError('[ShipmentSync] Sync failed', new Error(syncResult.message));
      // Continue to return current status rather than failing entirely
    }

    // Fetch updated order after sync attempt
    const updatedOrder = await prisma.order.findUnique({
      where: { systemId },
      include: {
        customer: true,
        lineItems: {
          include: { product: true },
        },
        payments: true,
        packagings: {
          include: {
            assignedEmployee: true,
            shipment: true,
          },
        },
      },
    });

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error syncing shipment', error);
    return apiError('Failed to sync shipment', 500);
  }
}

// ==================== Helper Functions ====================

async function syncGHTKShipment(trackingCode: string): Promise<{ success: boolean; message?: string; status?: string }> {
  try {
    const ghtkConfig = await loadGHTKConfig();
    if (!ghtkConfig) {
      return { success: false, message: 'GHTK is not configured' };
    }

    const statusResponse = await fetchGHTKOrderStatus(
      trackingCode,
      ghtkConfig.apiToken,
      ghtkConfig.partnerCode
    );

    if (!statusResponse.success || !statusResponse.order) {
      return { success: false, message: statusResponse.message || 'Failed to get GHTK status' };
    }

    // Find active packaging to update
    const packaging = await prisma.packaging.findFirst({
      where: { trackingCode },
      select: { systemId: true },
    });

    if (packaging) {
      const ghtkStatusId = parseInt(statusResponse.order.status, 10);
      await updatePackagingFromGHTK(packaging.systemId, ghtkStatusId, {
        fee: statusResponse.order.ship_money,
        pickMoney: statusResponse.order.pick_money,
        actionTime: statusResponse.order.modified || undefined,
      });

      const statusInfo = getGHTKStatusInfo(ghtkStatusId);
      return {
        success: true,
        status: statusInfo?.statusText || statusResponse.order.status_text || `Status ${statusResponse.order.status}`
      };
    }

    return { success: true, status: statusResponse.order.status_text || `Status ${statusResponse.order.status}` };
  } catch (error) {
    logError('[ShipmentSync] GHTK sync error', error);
    return { success: false, message: error instanceof Error ? error.message : 'GHTK sync failed' };
  }
}

async function syncVTPShipment(trackingCode: string, token?: string): Promise<{ success: boolean; message?: string; status?: string }> {
  try {
    if (!token) {
      return { success: false, message: 'VTP token is required for sync' };
    }

    // VTP API endpoint for getting order status
    const baseUrl = process.env.VTP_ENVIRONMENT === 'staging'
      ? 'https://partnerdev.viettelpost.vn/v2'
      : 'https://partner.viettelpost.vn/v2';

    const response = await fetchWithTimeout(`${baseUrl}/order/getOrderByTrackingCode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Token': token,
      },
      body: JSON.stringify({ ORDER_NUMBER: trackingCode }),
    });

    const data = await response.json();

    if (data.status !== 200 || data.error) {
      return { success: false, message: data.message || 'Failed to get VTP status' };
    }

    // Update packaging with VTP status
    const packaging = await prisma.packaging.findFirst({
      where: { trackingCode },
      select: { systemId: true },
    });

    if (packaging) {
      await prisma.packaging.update({
        where: { systemId: packaging.systemId },
        data: {
          partnerStatus: data.ORDER_STATUS?.toString(),
          lastSyncedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      status: `VTP Status: ${data.ORDER_STATUS || 'Unknown'}`
    };
  } catch (error) {
    logError('[ShipmentSync] VTP sync error', error);
    return { success: false, message: error instanceof Error ? error.message : 'VTP sync failed' };
  }
}
