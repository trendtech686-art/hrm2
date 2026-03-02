import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { getGHTKStatusInfo } from '@/lib/ghtk-constants';
import { DeliveryStatus } from '@prisma/client';

// GHTK API base URL (production)
const GHTK_API_BASE = 'https://services.giaohangtietkiem.vn';

interface RouteParams {
  params: Promise<{ systemId: string; packagingId: string }>;
}

// Map Vietnamese delivery status to Prisma enum
const deliveryStatusToPrisma: Record<string, DeliveryStatus> = {
  'Chờ lấy hàng': 'PENDING_SHIP',
  'Đang giao hàng': 'SHIPPING',
  'Đã giao hàng': 'DELIVERED',
  'Chờ giao lại': 'RESCHEDULED',
  'Đã trả hàng': 'CANCELLED',
  'Hoàn thành': 'DELIVERED',
};

// GHTK Account interface matching the new structure
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

// Load GHTK config from database (new multi-account structure)
async function loadGHTKConfig(): Promise<{
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

    // Find the default active account, or the first active account
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

// Call GHTK API directly to get order status
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

async function getGHTKOrderStatus(
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

// POST /api/orders/[systemId]/packaging/[packagingId]/ghtk/sync - Sync GHTK shipment status
export async function POST(_request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId, packagingId } = await params;

    // Get the packaging
    const packaging = await prisma.packaging.findUnique({
      where: { systemId: packagingId },
      include: {
        order: true,
        shipment: true,
      },
    });

    if (!packaging) {
      return apiNotFound('Packaging');
    }

    if (packaging.orderId !== systemId) {
      return apiError('Packaging does not belong to this order', 400);
    }

    if (packaging.carrier !== 'GHTK') {
      return apiError('Packaging is not a GHTK shipment', 400);
    }

    if (!packaging.trackingCode) {
      return apiError('Packaging has no tracking code', 400);
    }

    // Load GHTK config from database
    const ghtkConfig = await loadGHTKConfig();
    
    if (!ghtkConfig) {
      return apiError('GHTK is not configured', 400);
    }

    // Get order status directly from GHTK API
    const statusResponse = await getGHTKOrderStatus(
      packaging.trackingCode,
      ghtkConfig.apiToken,
      ghtkConfig.partnerCode
    );

    if (!statusResponse.success) {
      return apiError(statusResponse.message || 'Failed to get GHTK status', 400);
    }

    const order = statusResponse.order;
    if (!order) {
      return apiError('GHTK did not return order info', 400);
    }

    // GHTK returns status as string, convert to number
    const ghtkStatusId = parseInt(order.status, 10);

    // Get status info from mapping
    const statusInfo = getGHTKStatusInfo(ghtkStatusId);
    
    // Map to Prisma enums
    const prismaDeliveryStatus: DeliveryStatus = statusInfo?.deliveryStatus 
      ? (deliveryStatusToPrisma[statusInfo.deliveryStatus] || 'PENDING_SHIP')
      : 'PENDING_SHIP';
    
    // Determine packaging status based on GHTK status
    type PrismaPackagingStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    let prismaPackagingStatus: PrismaPackagingStatus = 'COMPLETED';
    if (ghtkStatusId === -1) {
      prismaPackagingStatus = 'CANCELLED';
    } else if (ghtkStatusId >= 5 && ghtkStatusId <= 6) {
      prismaPackagingStatus = 'COMPLETED'; // Delivered
    }

    // Update packaging with GHTK status
    await prisma.packaging.update({
      where: { systemId: packagingId },
      data: {
        ghtkStatusId: ghtkStatusId,
        partnerStatus: statusInfo?.statusText || order.status_text || `Trạng thái ${order.status}`,
        lastSyncedAt: new Date(),
        deliveryStatus: prismaDeliveryStatus,
        status: prismaPackagingStatus,
        // Update shipping fee from GHTK if available
        ...(order.ship_money !== undefined && { shippingFeeToPartner: order.ship_money }),
      },
    });

    // ✅ Also update order-level deliveryStatus to match packaging deliveryStatus
    await prisma.order.update({
      where: { systemId },
      data: {
        deliveryStatus: prismaDeliveryStatus,
        ...(prismaDeliveryStatus === 'DELIVERED' && { dispatchedDate: new Date() }),
      },
    });

    // Get updated order with all packagings
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

    // Transform packaging enums to Vietnamese for response
    const statusMap: Record<string, string> = {
      'PENDING': 'Chờ đóng gói',
      'COMPLETED': 'Đã đóng gói',
      'CANCELLED': 'Đã hủy',
    };

    const deliveryStatusMap: Record<string, string> = {
      'PENDING_SHIP': 'Chờ lấy hàng',
      'SHIPPING': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'RESCHEDULED': 'Chờ giao lại',
      'CANCELLED': 'Đã hủy',
    };

    const deliveryMethodMap: Record<string, string> = {
      'IN_STORE_PICKUP': 'Nhận tại cửa hàng',
      'SELF_DELIVERY': 'Tự giao',
      'SHIPPING': 'Dịch vụ giao hàng',
    };

    const transformedOrder = {
      ...updatedOrder,
      packagings: updatedOrder?.packagings.map(p => ({
        ...p,
        status: statusMap[p.status] || p.status,
        deliveryStatus: p.deliveryStatus ? (deliveryStatusMap[p.deliveryStatus] || p.deliveryStatus) : null,
        deliveryMethod: p.deliveryMethod ? (deliveryMethodMap[p.deliveryMethod] || p.deliveryMethod) : null,
      })),
    };

    console.log(`✅ [GHTK Sync] Successfully synced packaging ${packagingId}:`, {
      trackingCode: packaging.trackingCode,
      ghtkStatus: ghtkStatusId,
      statusText: statusInfo?.statusText,
      deliveryStatus: prismaDeliveryStatus,
    });

    return apiSuccess(transformedOrder);
  } catch (error) {
    console.error('Error syncing GHTK shipment:', error);
    const message = error instanceof Error ? error.message : 'Failed to sync GHTK shipment';
    return apiError(message, 500);
  }
}
