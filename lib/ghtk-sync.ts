/**
 * GHTK Sync Utilities
 * Shared functions for webhook and background sync
 */

import { prisma } from '@/lib/prisma';
import { getGHTKStatusInfo, getGHTKReasonText } from '@/lib/ghtk-constants';
import { DeliveryStatus, Prisma } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'
import { fetchWithTimeout } from '@/lib/fetch-utils'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { createNotification } from '@/lib/notifications'
import { generateNextIds } from '@/lib/id-system'
import type { GlobalShippingConfig } from '@/lib/types/shipping-config'

// GHTK API base URL
export const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

// Map Vietnamese delivery status to Prisma enum
const deliveryStatusToPrisma: Record<string, DeliveryStatus> = {
  'Chờ lấy hàng': 'PENDING_SHIP',
  'Đang giao hàng': 'SHIPPING',
  'Đã giao hàng': 'DELIVERED',
  'Chờ giao lại': 'RESCHEDULED',
  'Đã trả hàng': 'CANCELLED',
  'Đã hủy': 'CANCELLED',
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
    pick_money?: number;
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
    logError('[GHTK Sync] Failed to load config', error);
    return null;
  }
}

const DEFAULT_GLOBAL_CONFIG: GlobalShippingConfig = {
  weight: { mode: 'FROM_PRODUCTS', customValue: 500 },
  dimensions: { length: 30, width: 20, height: 10 },
  requirement: 'ALLOW_CHECK_NOT_TRY',
  note: '',
  autoSyncCancelStatus: false,
  autoSyncCODCollection: false,
  autoCreateReconciliationSheet: false,
  latePickupWarningDays: 2,
  lateDeliveryWarningDays: 7,
  productSendMode: 'all',
};

/**
 * Load global shipping config directly from DB (server-side only)
 */
export async function loadGlobalShippingConfigFromDB(): Promise<GlobalShippingConfig> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'shipping_global_config', group: 'shipping' } },
    });
    if (!setting?.value) return DEFAULT_GLOBAL_CONFIG;
    return { ...DEFAULT_GLOBAL_CONFIG, ...(setting.value as Record<string, unknown>) } as GlobalShippingConfig;
  } catch (error) {
    logError('[GHTK Sync] Failed to load global shipping config', error);
    return DEFAULT_GLOBAL_CONFIG;
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
  const response = await fetchWithTimeout(`${GHTK_API_BASE}/services/shipment/v2/${trackingCode}`, {
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
 * Cancel status IDs from GHTK
 */
const CANCEL_STATUS_IDS = new Set([-1, 11, 13, 21]);

/**
 * COD reconciliation status ID from GHTK
 */
const COD_RECONCILED_STATUS_ID = 6;

/**
 * Update packaging status in database from GHTK status
 * Respects auto-sync settings: when OFF, records data but skips business-critical updates
 */
export async function updatePackagingFromGHTK(
  packagingId: string,
  ghtkStatusId: number,
  webhookData?: {
    reasonCode?: string;
    reasonText?: string;
    fee?: number;
    pickMoney?: number;
    actionTime?: string;
    ghtkStatusText?: string; // status_text from GHTK API response
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

    // Load settings to check auto-sync toggles
    const globalConfig = await loadGlobalShippingConfigFromDB();
    const isCancelStatus = CANCEL_STATUS_IDS.has(ghtkStatusId);
    const isCODReconciled = ghtkStatusId === COD_RECONCILED_STATUS_ID;

    // Check if this status should be auto-synced
    const skipCancelSync = isCancelStatus && !globalConfig.autoSyncCancelStatus;
    const skipCODSync = isCODReconciled && !globalConfig.autoSyncCODCollection;

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

    // Build rich status text: prefer GHTK's own text > local mapping
    const displayStatusText = webhookData?.ghtkStatusText || statusInfo?.statusText || `Trạng thái ${ghtkStatusId}`;

    // Build detailed description from status description + reason
    const statusDescription = statusInfo?.description || '';
    const reasonCodeText = webhookData?.reasonCode ? getGHTKReasonText(webhookData.reasonCode) : '';
    // Detailed text priority: reason from GHTK > reason_code mapping > status description
    const detailText = webhookData?.reasonText || reasonCodeText || statusDescription;

    const newHistoryEntry = {
      status_id: ghtkStatusId,
      status_text: displayStatusText,
      description: statusDescription,
      reason_code: webhookData?.reasonCode || null,
      reason_text: webhookData?.reasonText || null,
      reason_code_text: reasonCodeText || null,
      detail: detailText,
      action_time: webhookData?.actionTime || new Date().toISOString(),
      autoSynced: !(skipCancelSync || skipCODSync),
    };

    // Build update data — always record tracking info + webhook history
    const updateData: Record<string, unknown> = {
      ghtkStatusId: ghtkStatusId,
      partnerStatus: statusInfo?.statusText || null,
      ghtkReasonCode: webhookData?.reasonCode || null,
      ghtkReasonText: webhookData?.reasonText || null,
      lastSyncedAt: new Date(),
      ghtkWebhookHistory: [...existingHistory, newHistoryEntry] as unknown as Prisma.InputJsonValue,
      ...(webhookData?.fee !== undefined && { shippingFeeToPartner: webhookData.fee }),
      ...(webhookData?.pickMoney !== undefined && { codAmount: webhookData.pickMoney }),
    };

    // Only update business-critical status when auto-sync is enabled
    if (!skipCancelSync) {
      updateData.deliveryStatus = prismaDeliveryStatus;
      updateData.status = prismaPackagingStatus;
    }
    if (!skipCODSync && isCODReconciled) {
      updateData.reconciliationStatus = 'Đã đối soát';
    }
    // For non-cancel, non-COD statuses: always update delivery status
    if (!isCancelStatus && !isCODReconciled) {
      updateData.deliveryStatus = prismaDeliveryStatus;
      updateData.status = prismaPackagingStatus;
    }

    // Update packaging
    await prisma.packaging.update({
      where: { systemId: packagingId },
      data: updateData,
    });

    // Update order-level deliveryStatus (skip if cancel sync is off)
    if (packaging.orderId && !skipCancelSync) {
      await prisma.order.update({
        where: { systemId: packaging.orderId },
        data: {
          deliveryStatus: prismaDeliveryStatus,
          ...(prismaDeliveryStatus === 'DELIVERED' && { dispatchedDate: new Date() }),
        },
      }).catch(e => logError('[GHTK Sync] Failed to update order deliveryStatus', e));
    }

    // Create notifications when auto-sync is OFF — require manual action
    if (skipCancelSync && packaging.orderId) {
      const order = packaging.order;
      const statusText = statusInfo?.statusText || `Trạng thái ${ghtkStatusId}`;
      await createNotification({
        type: 'order',
        title: 'Vận chuyển: Cần xử lý hủy đơn',
        message: `Đơn ${order?.id || packaging.orderId} — GHTK báo "${statusText}". Tự động đồng bộ hủy đơn đang TẮT, cần xử lý thủ công.`,
        link: `/orders/${packaging.orderId}`,
        recipientId: order?.salespersonId || order?.createdBy || '',
        senderName: 'GHTK',
        metadata: { orderId: packaging.orderId, trackingCode: packaging.trackingCode, ghtkStatusId },
        settingsKey: 'order:status',
      }).catch(e => logError('[GHTK Sync] notification failed', e));
    }

    if (skipCODSync && packaging.orderId) {
      const order = packaging.order;
      await createNotification({
        type: 'order',
        title: 'Vận chuyển: Cần xác nhận đối soát COD',
        message: `Đơn ${order?.id || packaging.orderId} — GHTK đã đối soát COD${webhookData?.pickMoney ? ` (${webhookData.pickMoney.toLocaleString('vi-VN')}đ)` : ''}. Tự động đồng bộ COD đang TẮT, cần xác nhận thủ công.`,
        link: `/orders/${packaging.orderId}`,
        recipientId: order?.salespersonId || order?.createdBy || '',
        senderName: 'GHTK',
        metadata: { orderId: packaging.orderId, trackingCode: packaging.trackingCode, ghtkStatusId, codAmount: webhookData?.pickMoney },
        settingsKey: 'order:status',
      }).catch(e => logError('[GHTK Sync] notification failed', e));
    }

    // Auto-create reconciliation sheet when GHTK sends status 6 (Đã đối soát)
    if (isCODReconciled && !skipCODSync && globalConfig.autoCreateReconciliationSheet) {
      await autoCreateReconciliationSheet(packaging).catch(e => 
        logError('[GHTK Sync] auto-create reconciliation sheet failed', e)
      );
    }

    return { success: true, message: skipCancelSync || skipCODSync ? 'Recorded (manual action required)' : 'Updated successfully' };
  } catch (error) {
    logError(`❌ [GHTK Sync] Failed to update packaging ${packagingId}`, error);
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
  packaging: { systemId: string; trackingCode: string | null; orderId?: string | null },
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

    // Update packaging in database — pass GHTK's own status_text for richer history
    const result = await updatePackagingFromGHTK(
      packaging.systemId,
      ghtkStatusId,
      {
        fee: statusResponse.order.ship_money,
        pickMoney: statusResponse.order.pick_money,
        actionTime: statusResponse.order.modified || undefined,
        ghtkStatusText: statusResponse.order.status_text || undefined,
      }
    );

    // Log activity for cron/auto-sync
    if (result.success && packaging.orderId) {
      const statusInfo = getGHTKStatusInfo(ghtkStatusId);
      const statusText = statusInfo?.statusText || `Trạng thái ${ghtkStatusId}`;
      await createActivityLog({
        entityType: 'order',
        entityId: packaging.orderId,
        action: `Đồng bộ GHTK - ${statusText}`,
        actionType: 'status',
        metadata: { userName: 'GHTK' },
      }).catch(e => logError('[GHTK Sync] activity log failed', e));
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check for late pickup/delivery shipments and create warning notifications.
 * Called from cron job. Uses a metadata flag to avoid duplicate notifications per shipment per day.
 */
export async function checkLateShipmentWarnings(): Promise<{ latePickup: number; lateDelivery: number }> {
  const globalConfig = await loadGlobalShippingConfigFromDB();
  const { latePickupWarningDays, lateDeliveryWarningDays } = globalConfig;

  // Skip if both thresholds are 0
  if (latePickupWarningDays <= 0 && lateDeliveryWarningDays <= 0) {
    return { latePickup: 0, lateDelivery: 0 };
  }

  const now = new Date();
  const todayKey = now.toISOString().slice(0, 10); // YYYY-MM-DD for dedup
  const results = { latePickup: 0, lateDelivery: 0 };

  // --- Late Pickup: shipments stuck in PENDING_SHIP for too long ---
  if (latePickupWarningDays > 0) {
    const pickupCutoff = new Date(now.getTime() - latePickupWarningDays * 24 * 60 * 60 * 1000);
    const latePickupShipments = await prisma.packaging.findMany({
      where: {
        carrier: 'GHTK',
        trackingCode: { not: null },
        deliveryStatus: 'PENDING_SHIP',
        createdAt: { lt: pickupCutoff },
      },
      include: {
        order: { select: { systemId: true, id: true, salespersonId: true, createdBy: true } },
      },
      take: 50,
    });

    for (const pkg of latePickupShipments) {
      // Dedup: check if already notified today via metadata
      const history = (pkg.ghtkWebhookHistory as Record<string, unknown>[]) || [];
      const alreadyNotified = history.some(
        (h) => h.status_text === `late_pickup_warning_${todayKey}` || h.statusText === `late_pickup_warning_${todayKey}`
      );
      if (alreadyNotified) continue;

      const recipientId = pkg.order?.salespersonId || pkg.order?.createdBy;
      if (!recipientId) continue;

      const daysSinceCreated = Math.floor((now.getTime() - pkg.createdAt.getTime()) / (24 * 60 * 60 * 1000));
      await createNotification({
        type: 'order',
        title: 'Cảnh báo: Chậm lấy hàng',
        message: `Đơn ${pkg.order?.id || pkg.orderId} — đã ${daysSinceCreated} ngày chưa được lấy hàng (ngưỡng: ${latePickupWarningDays} ngày). Mã vận đơn: ${pkg.trackingCode}`,
        link: `/orders/${pkg.orderId}`,
        recipientId,
        senderName: 'Hệ thống',
        metadata: { orderId: pkg.orderId, trackingCode: pkg.trackingCode, warningType: 'late_pickup', daysSinceCreated },
        settingsKey: 'order:status',
      }).catch(e => logError('[GHTK Warning] notification failed', e));

      // Mark as notified today (append to webhook history)
      await prisma.packaging.update({
        where: { systemId: pkg.systemId },
        data: {
          ghtkWebhookHistory: [
            ...history,
            { status_text: `late_pickup_warning_${todayKey}`, action_time: now.toISOString() },
          ] as unknown as Prisma.InputJsonValue,
        },
      }).catch(e => logError('[GHTK Warning] mark notified failed', e));

      results.latePickup++;
    }
  }

  // --- Late Delivery: shipments stuck in SHIPPING/RESCHEDULED for too long ---
  if (lateDeliveryWarningDays > 0) {
    const deliveryCutoff = new Date(now.getTime() - lateDeliveryWarningDays * 24 * 60 * 60 * 1000);
    const lateDeliveryShipments = await prisma.packaging.findMany({
      where: {
        carrier: 'GHTK',
        trackingCode: { not: null },
        deliveryStatus: { in: ['SHIPPING', 'RESCHEDULED'] },
        createdAt: { lt: deliveryCutoff },
      },
      include: {
        order: { select: { systemId: true, id: true, salespersonId: true, createdBy: true } },
      },
      take: 50,
    });

    for (const pkg of lateDeliveryShipments) {
      const history = (pkg.ghtkWebhookHistory as Record<string, unknown>[]) || [];
      const alreadyNotified = history.some(
        (h) => h.status_text === `late_delivery_warning_${todayKey}` || h.statusText === `late_delivery_warning_${todayKey}`
      );
      if (alreadyNotified) continue;

      const recipientId = pkg.order?.salespersonId || pkg.order?.createdBy;
      if (!recipientId) continue;

      const daysSinceCreated = Math.floor((now.getTime() - pkg.createdAt.getTime()) / (24 * 60 * 60 * 1000));
      await createNotification({
        type: 'order',
        title: 'Cảnh báo: Chậm giao hàng',
        message: `Đơn ${pkg.order?.id || pkg.orderId} — đã ${daysSinceCreated} ngày chưa giao hàng (ngưỡng: ${lateDeliveryWarningDays} ngày). Mã vận đơn: ${pkg.trackingCode}`,
        link: `/orders/${pkg.orderId}`,
        recipientId,
        senderName: 'Hệ thống',
        metadata: { orderId: pkg.orderId, trackingCode: pkg.trackingCode, warningType: 'late_delivery', daysSinceCreated },
        settingsKey: 'order:status',
      }).catch(e => logError('[GHTK Warning] notification failed', e));

      await prisma.packaging.update({
        where: { systemId: pkg.systemId },
        data: {
          ghtkWebhookHistory: [
            ...history,
            { status_text: `late_delivery_warning_${todayKey}`, action_time: now.toISOString() },
          ] as unknown as Prisma.InputJsonValue,
        },
      }).catch(e => logError('[GHTK Warning] mark notified failed', e));

      results.lateDelivery++;
    }
  }

  return results;
}

/**
 * Auto-create a reconciliation sheet for a single packaging when GHTK confirms COD reconciliation (status 6).
 * Skips if packaging already belongs to an existing reconciliation sheet.
 */
async function autoCreateReconciliationSheet(
  packaging: {
    systemId: string;
    trackingCode: string | null;
    orderId: string | null;
    codAmount: unknown;
    shippingFeeToPartner: unknown;
    carrier: string | null;
    order: { systemId: string; id: string; customerName?: string | null; salespersonId?: string | null; createdBy?: string | null } | null;
  }
): Promise<void> {
  if (!packaging.trackingCode || !packaging.orderId) return;

  // Check if this packaging is already in a reconciliation sheet (DRAFT or CONFIRMED)
  const existingItem = await prisma.reconciliationSheetItem.findFirst({
    where: {
      packagingId: packaging.systemId,
      sheet: { status: { in: ['DRAFT', 'CONFIRMED'] } },
    },
  });
  if (existingItem) return; // Already in a sheet — skip

  const { systemId, businessId } = await generateNextIds('reconciliation');

  const codSystem = Number(packaging.codAmount) || 0;
  const codPartner = codSystem; // GHTK confirmed = same amount by default
  const feeSystem = Number(packaging.shippingFeeToPartner) || 0;
  const feePartner = feeSystem;

  await prisma.reconciliationSheet.create({
    data: {
      systemId,
      id: businessId,
      carrier: packaging.carrier || 'GHTK',
      status: 'DRAFT',
      totalCodSystem: codSystem,
      totalCodPartner: codPartner,
      totalFeeSystem: feeSystem,
      totalFeePartner: feePartner,
      codDifference: codPartner - codSystem,
      feeDifference: feePartner - feeSystem,
      createdByName: 'GHTK (tự động)',
      items: {
        create: [{
          packagingId: packaging.systemId,
          trackingCode: packaging.trackingCode,
          orderId: packaging.order?.id || '',
          orderSystemId: packaging.orderId,
          customerName: packaging.order?.customerName || null,
          codSystem,
          codPartner,
          codDifference: codPartner - codSystem,
          feeSystem,
          feePartner,
          feeDifference: feePartner - feeSystem,
        }],
      },
    },
  });

  // Log activity
  createActivityLog({
    entityType: 'reconciliation_sheet',
    entityId: systemId,
    action: `Tự động tạo phiếu đối soát ${businessId} — GHTK — ${packaging.trackingCode}`,
    actionType: 'create',
    metadata: { userName: 'GHTK', trackingCode: packaging.trackingCode },
  }).catch(e => logError('[GHTK Sync] reconciliation activity log failed', e));

  // Notify
  const recipientId = packaging.order?.salespersonId || packaging.order?.createdBy;
  if (recipientId) {
    createNotification({
      type: 'reconciliation',
      settingsKey: 'reconciliation:updated',
      title: 'Phiếu đối soát tự động',
      message: `Phiếu ${businessId} — GHTK đã đối soát đơn ${packaging.order?.id || packaging.orderId}. Vui lòng kiểm tra và xác nhận.`,
      link: `/reconciliation/${systemId}`,
      recipientId,
      senderName: 'GHTK',
    }).catch(e => logError('[GHTK Sync] reconciliation notification failed', e));
  }
}
