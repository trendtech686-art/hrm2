import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { loadGHTKConfig } from '@/lib/ghtk-sync';

// GHTK API base URL (production)
const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

/**
 * POST /api/orders/[systemId]/packaging/[packagingId]/ghtk/cancel
 * Cancel GHTK shipment
 */
export async function POST(request: Request, { params }: RouteParams) {
  try {
    await requireAuth();
    const { systemId, packagingId } = await params;

    // Get tracking code from request body
    const body = await request.json().catch(() => ({}));
    const trackingCode = body.trackingCode;

    if (!trackingCode) {
      return apiError('Tracking code is required', 400);
    }

    // Load GHTK config
    const ghtkConfig = await loadGHTKConfig();
    if (!ghtkConfig) {
      return apiError('GHTK is not configured', 400);
    }

    // Verify packaging exists and belongs to this order
    const packaging = await prisma.packaging.findFirst({
      where: {
        systemId: packagingId,
        orderId: systemId,
        carrier: 'GHTK',
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging not found');
    }

    if (packaging.trackingCode !== trackingCode) {
      return apiError('Tracking code mismatch', 400);
    }

    console.log(`📡 [GHTK Cancel] Cancelling shipment ${trackingCode}...`);

    // Call GHTK API to cancel
    const cancelUrl = `${GHTK_API_BASE}/services/shipment/cancel/${trackingCode}`;
    
    const response = await fetch(cancelUrl, {
      method: 'POST',
      headers: {
        'Token': ghtkConfig.apiToken,
        'X-Client-Source': ghtkConfig.partnerCode || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json().catch(() => ({}));
    console.log(`📡 [GHTK Cancel] Response:`, data);

    if (!response.ok || !data.success) {
      const errorMsg = data.message || `GHTK API Error: ${response.status}`;
      console.error(`❌ [GHTK Cancel] Failed:`, errorMsg);
      return apiError(errorMsg, response.status >= 400 && response.status < 500 ? response.status : 500);
    }

    // Update packaging in database
    await prisma.packaging.update({
      where: { systemId: packagingId },
      data: {
        ghtkStatusId: -1, // GHTK cancelled status
        partnerStatus: 'Đã hủy',
        deliveryStatus: 'CANCELLED',
        status: 'CANCELLED',
        lastSyncedAt: new Date(),
      },
    });

    // ✅ Also update order-level deliveryStatus
    await prisma.order.update({
      where: { systemId },
      data: {
        deliveryStatus: 'CANCELLED',
      },
    });

    // Also update shipment status to CANCELLED
    await prisma.shipment.updateMany({
      where: { packagingSystemId: packagingId },
      data: {
        status: 'CANCELLED',
      },
    });

    console.log(`✅ [GHTK Cancel] Shipment ${trackingCode} cancelled successfully`);

    return apiSuccess({ 
      success: true, 
      message: data.message || 'Đã hủy vận đơn GHTK thành công' 
    });

  } catch (error) {
    console.error('[GHTK Cancel] Error:', error);
    return apiError(
      error instanceof Error ? error.message : 'Failed to cancel GHTK shipment',
      500
    );
  }
}
