/**
 * GHN (Giao Hàng Nhanh) Status Mapping & Constants
 * Based on GHN API documentation: https://api.ghn.vn/home/docs/detail?id=48
 */

import type { OrderDeliveryStatus } from '@/lib/types/prisma-extended';

export type GHNStatusCode =
  | 'ready_to_pick'
  | 'picking'
  | 'cancel'
  | 'money_collect_picking'
  | 'picked'
  | 'storing'
  | 'transporting'
  | 'sorting'
  | 'delivering'
  | 'money_collect_delivering'
  | 'delivered'
  | 'delivery_fail'
  | 'waiting_to_return'
  | 'return'
  | 'return_transporting'
  | 'return_sorting'
  | 'returning'
  | 'return_fail'
  | 'returned'
  | 'exception'
  | 'damage'
  | 'lost';

export interface GHNStatusMapping {
  statusCode: GHNStatusCode;
  statusText: string;
  deliveryStatus: OrderDeliveryStatus;
  description: string;
  canCancel: boolean;
  shouldUpdateStock: boolean;
  stockAction?: 'dispatch' | 'complete' | 'return';
  isFinal: boolean;
}

/**
 * Complete GHN Status Mapping
 */
export const GHN_STATUS_MAP: Record<GHNStatusCode, GHNStatusMapping> = {
  'ready_to_pick': {
    statusCode: 'ready_to_pick',
    statusText: 'Chờ lấy hàng',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Đơn hàng mới tạo, đang chờ shipper đến lấy',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'picking': {
    statusCode: 'picking',
    statusText: 'Đang lấy hàng',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Shipper đang đến lấy hàng',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'cancel': {
    statusCode: 'cancel',
    statusText: 'Đã hủy',
    deliveryStatus: 'Đã hủy',
    description: 'Đơn hàng đã bị hủy',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  'money_collect_picking': {
    statusCode: 'money_collect_picking',
    statusText: 'Đang thu tiền người gửi',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Shipper đang tương tác với người gửi',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'picked': {
    statusCode: 'picked',
    statusText: 'Đã lấy hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper đã lấy hàng thành công',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'dispatch',
    isFinal: false,
  },
  'storing': {
    statusCode: 'storing',
    statusText: 'Đang lưu kho',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đã được chuyển đến kho phân loại GHN',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'transporting': {
    statusCode: 'transporting',
    statusText: 'Đang vận chuyển',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đang được luân chuyển giữa các kho',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'sorting': {
    statusCode: 'sorting',
    statusText: 'Đang phân loại',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đang được phân loại tại kho',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'delivering': {
    statusCode: 'delivering',
    statusText: 'Đang giao hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper đang giao hàng đến người nhận',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'money_collect_delivering': {
    statusCode: 'money_collect_delivering',
    statusText: 'Đang thu tiền người nhận',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper đang tương tác với người nhận',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'delivered': {
    statusCode: 'delivered',
    statusText: 'Đã giao hàng',
    deliveryStatus: 'Đã giao hàng',
    description: 'Giao hàng thành công',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'complete',
    isFinal: true,
  },
  'delivery_fail': {
    statusCode: 'delivery_fail',
    statusText: 'Giao hàng thất bại',
    deliveryStatus: 'Đang giao hàng',
    description: 'Giao hàng không thành công',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'waiting_to_return': {
    statusCode: 'waiting_to_return',
    statusText: 'Chờ xác nhận hoàn',
    deliveryStatus: 'Đang giao hàng',
    description: 'Đơn hàng đang chờ xác nhận hoàn (có thể giao lại trong 24/48h)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'return': {
    statusCode: 'return',
    statusText: 'Đang hoàn',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đang chờ hoàn lại cho shop sau 3 lần giao thất bại',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'return_transporting': {
    statusCode: 'return_transporting',
    statusText: 'Đang vận chuyển hoàn',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đang được luân chuyển để hoàn',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'return_sorting': {
    statusCode: 'return_sorting',
    statusText: 'Đang phân loại hoàn',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đang được phân loại để hoàn',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'returning': {
    statusCode: 'returning',
    statusText: 'Đang trả hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Shipper đang giao hàng hoàn về cho shop',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'return_fail': {
    statusCode: 'return_fail',
    statusText: 'Hoàn thất bại',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hoàn hàng không thành công',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'returned': {
    statusCode: 'returned',
    statusText: 'Đã hoàn hàng',
    deliveryStatus: 'Đã hủy',
    description: 'Hàng đã được hoàn về cho shop',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  'exception': {
    statusCode: 'exception',
    statusText: 'Ngoại lệ',
    deliveryStatus: 'Đang giao hàng',
    description: 'Xử lý ngoại lệ (trái quy trình bình thường)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  'damage': {
    statusCode: 'damage',
    statusText: 'Hàng hư hỏng',
    deliveryStatus: 'Đã hủy',
    description: 'Hàng bị hư hỏng trong quá trình vận chuyển',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  'lost': {
    statusCode: 'lost',
    statusText: 'Hàng thất lạc',
    deliveryStatus: 'Đã hủy',
    description: 'Hàng bị thất lạc',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
};

/**
 * GHN Status Display cho UI badges
 */
export const GHN_STATUS_DISPLAY: Record<GHNStatusCode, { label: string; variant: string }> = {
  'ready_to_pick': { label: 'Chờ lấy hàng', variant: 'secondary' },
  'picking': { label: 'Đang lấy hàng', variant: 'warning' },
  'cancel': { label: 'Đã hủy', variant: 'destructive' },
  'money_collect_picking': { label: 'Thu tiền người gửi', variant: 'info' },
  'picked': { label: 'Đã lấy hàng', variant: 'success' },
  'storing': { label: 'Lưu kho', variant: 'info' },
  'transporting': { label: 'Vận chuyển', variant: 'warning' },
  'sorting': { label: 'Phân loại', variant: 'info' },
  'delivering': { label: 'Đang giao', variant: 'warning' },
  'money_collect_delivering': { label: 'Thu tiền người nhận', variant: 'info' },
  'delivered': { label: 'Đã giao', variant: 'success' },
  'delivery_fail': { label: 'Giao thất bại', variant: 'destructive' },
  'waiting_to_return': { label: 'Chờ hoàn', variant: 'warning' },
  'return': { label: 'Đang hoàn', variant: 'warning' },
  'return_transporting': { label: 'Vận chuyển hoàn', variant: 'warning' },
  'return_sorting': { label: 'Phân loại hoàn', variant: 'info' },
  'returning': { label: 'Đang trả hàng', variant: 'warning' },
  'return_fail': { label: 'Hoàn thất bại', variant: 'destructive' },
  'returned': { label: 'Đã hoàn', variant: 'secondary' },
  'exception': { label: 'Ngoại lệ', variant: 'destructive' },
  'damage': { label: 'Hư hỏng', variant: 'destructive' },
  'lost': { label: 'Thất lạc', variant: 'destructive' },
};

/** Helper: get status info from GHN status code */
export function getGHNStatusInfo(statusCode: string): GHNStatusMapping | undefined {
  return GHN_STATUS_MAP[statusCode as GHNStatusCode];
}

/** Helper: check if order can be cancelled */
export function canCancelGHNShipment(statusCode: string): boolean {
  const info = GHN_STATUS_MAP[statusCode as GHNStatusCode];
  return info?.canCancel ?? false;
}

/** Helper: check if status should trigger sync */
export function shouldSyncGHNStatus(statusCode: string): boolean {
  const info = GHN_STATUS_MAP[statusCode as GHNStatusCode];
  return info ? !info.isFinal : true;
}

/**
 * GHN API Environment URLs
 */
export const GHN_API_URLS = {
  PRODUCTION: 'https://online-gateway.ghn.vn/shiip/public-api',
  STAGING: 'https://dev-online-gateway.ghn.vn/shiip/public-api',
} as const;

/**
 * GHN Service Types
 */
export const GHN_SERVICE_TYPES = {
  EXPRESS: 2,   // E-commerce Delivery (hỏa tốc)
  STANDARD: 5,  // Traditional Delivery (tiêu chuẩn)
} as const;

/**
 * GHN Payment Types
 */
export const GHN_PAYMENT_TYPES = {
  SHOP_PAY: 1,     // Shop trả phí ship
  CUSTOMER_PAY: 2, // Người nhận trả phí ship
} as const;

/**
 * GHN Required Note Options
 */
export const GHN_REQUIRED_NOTES = {
  ALLOW_TRY: 'CHOTHUHANG',                     // Cho thử hàng
  ALLOW_CHECK_NOT_TRY: 'CHOXEMHANGKHONGTHU',   // Cho xem hàng không thử
  NOT_ALLOW_CHECK: 'KHONGCHOXEMHANG',           // Không cho xem hàng
} as const;
