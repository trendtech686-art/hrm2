/**
 * GHTK Sync Utilities
 * Shared functions for webhook and background sync
 */

import { prisma } from '@/lib/prisma';
import { getGHTKStatusInfo } from '@/lib/ghtk-constants';
import { DeliveryStatus, Prisma } from '@prisma/client';

// GHTK API base URL
const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

// Map Vietnamese delivery status to Prisma enum
const deliveryStatusToPrisma: Record<string, DeliveryStatus> = {
  'Chờ lấy hàng': 'PENDING_SHIP',
  'Đang giao hàng': 'SHIPPING',
  'Đã giao hàng': 'DELIVERED',
  'Chờ giao lại': 'RESCHEDULED',
  'Đã trả hàng': 'CANCELLED',
  'Hoàn thành': 'DELIVERED',
};

// GHTK Account interface
interface GHTKAccount {
  id: string;
  name: string;
  active: boolean;
  isDefault: boolean;
  credentials: {
    apiToken: string;
    partnerCode?: string;
  };
}

// GHTK Order Status Response
interface GHTKOrderStatusResponse {
  success: boolean;
  message?: string;
  order?: {
    label_id: string;
    partner_id: string;
    status: string;
    status_text: string;
    created: string;
    modified: string;
    pick_date?: string;
    deliver_date?: string;
    return_date?: string;
    ship_money?: number;
    insurance_fee?: number;
    estimated_pick_time?: string;
    estimated_deliver_time?: string;
  };
}

// Webhook payload from GHTK
export interface GHTKWebhookPayload {
  label_id: string;      // Tracking code
  partner_id: string;    // Our order ID
  status_id: number;     // Status code
  action_time: string;   // ISO timestamp
  reason_code?: string;  // Reason code
  reason?: string;       // Reason text
  weight?: number;       // Actual weight
  fee?: number;          // Actual shipping fee
  pick_money?: number;   // COD amount
  return_part_package?: number;
}

/**
 * Load GHTK config from database
 */
export async function loadGHTKConfig(): Promise<{
  apiToken: string;
  partnerCode: string;
} | null> {
  try {
    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: 'shipping_partners_config',
          group: 'shipping',
        }
      }
    });

    if (!setting?.value) return null;

    const config = setting.value as Record<string, unknown>;
    const ghtkPartner = (config.partners as Record<string, unknown>)?.GHTK as {
      accounts?: GHTKAccount[];
    } | undefined;

    if (!ghtkPartner?.accounts?.length) return null;

    const activeAccount = ghtkPartner.accounts.find(acc => acc.active && acc.isDefault)
      || ghtkPartner.accounts.find(acc => acc.active);

    if (!activeAccount?.credentials?.apiToken) return null;

    return {
      apiToken: activeAccount.credentials.apiToken,
      partnerCode: activeAccount.credentials.partnerCode || '',
    };
  } catch (error) {
    console.error('[GHTK Sync] Failed to load config:', error);
    return null;
  }
}

/**
 * Fetch order status from GHTK API
 */
export async function fetchGHTKOrderStatus(
  trackingCode: string,
  apiToken: string,
  partnerCode: string
): Promise<GHTKOrderStatusResponse> {
  const response = await fetch(`${GHTK_API_BASE}/services/shipment/v2/${trackingCode}`, {
    method: 'GET',
    headers: {
      'Token': apiToken,
      'X-Client-Source': partnerCode,
    },
  });

  if (!response.ok) {
    throw new Error(`GHTK API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Update packaging status in database from GHTK status
 */
export async function updatePackagingFromGHTK(
  packagingId: string,
  ghtkStatusId: number,
  webhookData?: {
    reasonCode?: string;
    reasonText?: string;
    fee?: number;
    pickMoney?: number;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    // Find the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: { order: true },
    });

    if (!packaging) {
      return { success: false, message: `Packaging ${packagingId} not found` };
    }

    // Get status info from mapping
    const statusInfo = getGHTKStatusInfo(ghtkStatusId);
    
    // Map to Prisma enums
    const prismaDeliveryStatus: DeliveryStatus = statusInfo?.deliveryStatus 
      ? (deliveryStatusToPrisma[statusInfo.deliveryStatus] || 'PENDING_SHIP')
      : 'PENDING_SHIP';
    
    // Determine packaging status
    type PrismaPackagingStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    let prismaPackagingStatus: PrismaPackagingStatus = 'COMPLETED';
    if (ghtkStatusId === -1) {
      prismaPackagingStatus = 'CANCELLED';
    } else if (ghtkStatusId >= 5 && ghtkStatusId <= 6) {
      prismaPackagingStatus = 'COMPLETED';
    }

    // Get existing webhook history
    const existingHistory = (packaging.ghtkWebhookHistory as Record<string, unknown>[]) || [];
    const newHistoryEntry = {
      statusId: ghtkStatusId,
      statusText: statusInfo?.statusText || `Status ${ghtkStatusId}`,
      reasonCode: webhookData?.reasonCode || null,
      reasonText: webhookData?.reasonText || null,
      timestamp: new Date().toISOString(),
    };

    // Update packaging in database
    await prisma.packaging.update({
      where: { systemId: packagingId },
      data: {
        ghtkStatusId: ghtkStatusId,
        partnerStatus: statusInfo?.statusText || null, // Use partnerStatus instead of non-existent ghtkStatusText
        ghtkReasonCode: webhookData?.reasonCode || null,
        ghtkReasonText: webhookData?.reasonText || null,
        lastSyncedAt: new Date(),
        deliveryStatus: prismaDeliveryStatus,
        status: prismaPackagingStatus,
        ghtkWebhookHistory: [...existingHistory, newHistoryEntry] as unknown as Prisma.InputJsonValue,
        // Update shipping fee if provided
        ...(webhookData?.fee !== undefined && { shippingFeeToPartner: webhookData.fee }),
      },
    });

    console.log(`✅ [GHTK Sync] Updated packaging ${packagingId}:`, {
      trackingCode: packaging.trackingCode,
      ghtkStatus: ghtkStatusId,
      statusText: statusInfo?.statusText,
      deliveryStatus: prismaDeliveryStatus,
    });

    return { success: true, message: 'Updated successfully' };
  } catch (error) {
    console.error(`❌ [GHTK Sync] Failed to update packaging ${packagingId}:`, error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Find packaging by tracking code
 */
export async function findPackagingByTrackingCode(trackingCode: string) {
  return prisma.packaging.findFirst({
    where: { trackingCode },
    include: { order: true },
  });
}

/**
 * Get all active GHTK shipments that need sync
 * - Carrier is GHTK
 * - Has tracking code
 * - Not delivered or cancelled
 * - Last synced more than 30 minutes ago (or never synced)
 */
export async function getActiveGHTKShipments(options: {
  maxAge?: number; // minutes since last sync (default 30)
  limit?: number;  // max records to return (default 50)
} = {}) {
  const { maxAge = 30, limit = 50 } = options;
  const cutoffTime = new Date(Date.now() - maxAge * 60 * 1000);

  return prisma.packaging.findMany({
    where: {
      carrier: 'GHTK',
      trackingCode: { not: null },
      deliveryStatus: {
        notIn: ['DELIVERED', 'CANCELLED'],
      },
      OR: [
        { lastSyncedAt: null },
        { lastSyncedAt: { lt: cutoffTime } },
      ],
    },
    include: {
      order: {
        select: {
          systemId: true,
          status: true,
        },
      },
    },
    orderBy: { lastSyncedAt: 'asc' }, // Oldest first
    take: limit,
  });
}

/**
 * Sync a single packaging with GHTK API
 */
export async function syncSinglePackaging(
  packaging: { systemId: string; trackingCode: string | null },
  ghtkConfig: { apiToken: string; partnerCode: string }
): Promise<{ success: boolean; message: string }> {
  if (!packaging.trackingCode) {
    return { success: false, message: 'No tracking code' };
  }

  try {
    // Fetch status from GHTK
    const statusResponse = await fetchGHTKOrderStatus(
      packaging.trackingCode,
      ghtkConfig.apiToken,
      ghtkConfig.partnerCode
    );

    if (!statusResponse.success || !statusResponse.order) {
      return { 
        success: false, 
        message: statusResponse.message || 'Failed to get GHTK status' 
      };
    }

    const ghtkStatusId = parseInt(statusResponse.order.status, 10);

    // Update packaging in database
    return await updatePackagingFromGHTK(
      packaging.systemId,
      ghtkStatusId,
      {
        fee: statusResponse.order.ship_money,
      }
    );
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
