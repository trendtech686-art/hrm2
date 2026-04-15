/**
 * VTP (Viettel Post) Status Mapping & Constants
 * Based on VTP API documentation: https://partner2.viettelpost.vn/document/environment-parameter
 */

import type { OrderDeliveryStatus } from '@/lib/types/prisma-extended';

export type VTPStatusCode =
  | -1    // Hủy đơn hàng
  | 100   // Đơn hàng mới
  | 101   // Đã tiếp nhận
  | 102   // Đã lấy hàng
  | 103   // Đang vận chuyển
  | 104   // Đã đến bưu cục
  | 105   // Đang giao hàng
  | 107   // Đơn hàng đã hủy (có thể xóa)
  | 200   // Giao hàng thành công
  | 201   // Đã đối soát
  | 300   // Giao hàng thất bại
  | 301   // Đang hoàn hàng
  | 302   // Đã hoàn hàng
  | 303   // Hủy hoàn hàng
  | 500   // Đơn hàng ngoại lệ
  | 501   // Hàng mất/hư hỏng
  | 505;  // Thông báo chuyển hoàn

export interface VTPStatusMapping {
  statusCode: VTPStatusCode;
  statusText: string;
  deliveryStatus: OrderDeliveryStatus;
  description: string;
  canCancel: boolean;
  shouldUpdateStock: boolean;
  stockAction?: 'dispatch' | 'complete' | 'return';
  isFinal: boolean;
}

/**
 * Complete VTP Status Mapping
 */
export const VTP_STATUS_MAP: Record<number, VTPStatusMapping> = {
  [-1]: {
    statusCode: -1,
    statusText: 'Hủy đơn hàng',
    deliveryStatus: 'Đã hủy',
    description: 'Đơn hàng đã bị hủy',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  [100]: {
    statusCode: 100,
    statusText: 'Đơn hàng mới',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Đơn hàng mới tạo trên hệ thống',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [101]: {
    statusCode: 101,
    statusText: 'Đã tiếp nhận',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Viettel Post đã tiếp nhận đơn hàng',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [102]: {
    statusCode: 102,
    statusText: 'Đã lấy hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Bưu tá đã lấy hàng thành công',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'dispatch',
    isFinal: false,
  },
  [103]: {
    statusCode: 103,
    statusText: 'Đang vận chuyển',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đang được vận chuyển giữa các bưu cục',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [104]: {
    statusCode: 104,
    statusText: 'Đã đến bưu cục',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đã đến bưu cục phát',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [105]: {
    statusCode: 105,
    statusText: 'Đang giao hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Bưu tá đang giao hàng đến người nhận',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [107]: {
    statusCode: 107,
    statusText: 'Đã hủy',
    deliveryStatus: 'Đã hủy',
    description: 'Đơn hàng đã hủy (có thể xóa)',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  [200]: {
    statusCode: 200,
    statusText: 'Giao hàng thành công',
    deliveryStatus: 'Đã giao hàng',
    description: 'Giao hàng thành công cho người nhận',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'complete',
    isFinal: true,
  },
  [201]: {
    statusCode: 201,
    statusText: 'Đã đối soát',
    deliveryStatus: 'Đã giao hàng',
    description: 'Đã đối soát tiền cod & phí vận chuyển',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: true,
  },
  [300]: {
    statusCode: 300,
    statusText: 'Giao hàng thất bại',
    deliveryStatus: 'Đang giao hàng',
    description: 'Giao hàng không thành công',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [301]: {
    statusCode: 301,
    statusText: 'Đang hoàn hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Hàng đang được hoàn về cho người gửi',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [302]: {
    statusCode: 302,
    statusText: 'Đã hoàn hàng',
    deliveryStatus: 'Đã hủy',
    description: 'Hàng đã được hoàn về cho người gửi',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  [303]: {
    statusCode: 303,
    statusText: 'Hủy hoàn hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Yêu cầu hoàn hàng bị hủy, tiếp tục giao',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [500]: {
    statusCode: 500,
    statusText: 'Đơn hàng ngoại lệ',
    deliveryStatus: 'Đang giao hàng',
    description: 'Xảy ra sự cố ngoại lệ cần xử lý',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  [501]: {
    statusCode: 501,
    statusText: 'Hàng mất/hư hỏng',
    deliveryStatus: 'Đã hủy',
    description: 'Hàng bị mất hoặc hư hỏng trong quá trình vận chuyển',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  [505]: {
    statusCode: 505,
    statusText: 'Thông báo chuyển hoàn',
    deliveryStatus: 'Đang giao hàng',
    description: 'Đơn hàng được thông báo chuyển hoàn, chờ duyệt',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
};

/**
 * VTP Status Display cho UI badges
 */
export const VTP_STATUS_DISPLAY: Record<number, { label: string; variant: string }> = {
  [-1]: { label: 'Đã hủy', variant: 'destructive' },
  [100]: { label: 'Đơn mới', variant: 'secondary' },
  [101]: { label: 'Đã tiếp nhận', variant: 'info' },
  [102]: { label: 'Đã lấy hàng', variant: 'success' },
  [103]: { label: 'Đang vận chuyển', variant: 'warning' },
  [104]: { label: 'Đến bưu cục', variant: 'info' },
  [105]: { label: 'Đang giao', variant: 'warning' },
  [107]: { label: 'Đã hủy', variant: 'destructive' },
  [200]: { label: 'Đã giao', variant: 'success' },
  [201]: { label: 'Đã đối soát', variant: 'success' },
  [300]: { label: 'Giao thất bại', variant: 'destructive' },
  [301]: { label: 'Đang hoàn', variant: 'warning' },
  [302]: { label: 'Đã hoàn', variant: 'secondary' },
  [303]: { label: 'Hủy hoàn', variant: 'destructive' },
  [500]: { label: 'Ngoại lệ', variant: 'destructive' },
  [501]: { label: 'Mất/hư hỏng', variant: 'destructive' },
  [505]: { label: 'Chờ chuyển hoàn', variant: 'warning' },
};

/** Helper: get status info from VTP status code */
export function getVTPStatusInfo(statusCode: number): VTPStatusMapping | undefined {
  return VTP_STATUS_MAP[statusCode];
}

/** Helper: check if order can be cancelled (ORDER_STATUS < 200) */
export function canCancelVTPShipment(statusCode: number): boolean {
  const info = VTP_STATUS_MAP[statusCode];
  return info?.canCancel ?? false;
}

/** Helper: check if status should trigger sync */
export function shouldSyncVTPStatus(statusCode: number): boolean {
  const info = VTP_STATUS_MAP[statusCode];
  return info ? !info.isFinal : true;
}

/**
 * VTP API Environment URLs
 */
export const VTP_API_URLS = {
  PRODUCTION: 'https://partner.viettelpost.vn/v2',
  STAGING: 'https://partnerdev.viettelpost.vn/v2',
} as const;

/**
 * VTP Product Types (loại hàng hóa)
 */
export const VTP_PRODUCT_TYPES = {
  EXPRESS: 'VCN',   // Viettel Chuyển Phát Nhanh
  STANDARD: 'VTK',  // Viettel Tiết Kiệm
} as const;

/**
 * VTP Payment Types (hình thức thanh toán)
 */
export const VTP_PAYMENT_TYPES = {
  SENDER_PAY: 1,    // Người gửi trả phí
  RECEIVER_PAY: 2,  // Người nhận trả phí
  BOTH_PAY: 3,      // Cả 2 trả phí
} as const;

/**
 * VTP Order Service codes (mã dịch vụ chính)
 */
export const VTP_ORDER_SERVICES = {
  VCN: 'VCN',     // Chuyển phát nhanh
  VTK: 'VTK',     // Tiết kiệm
  VHT: 'VHT',     // Hỏa tốc
  VBS: 'VBS',     // Hẹn giờ
  LCOD: 'LCOD',   // Chuyển phát nhanh + CoD
  VBE: 'VBE',     // Chuyển phát tiêu chuẩn
} as const;

/**
 * VTP Update Order TYPE values
 */
export const VTP_UPDATE_TYPES = {
  APPROVE: 1,           // Duyệt đơn hàng
  APPROVE_RETURN: 2,    // Duyệt hoàn (khi ORDER_STATUS = 505)
  REDELIVER: 3,         // Phát tiếp (khi ORDER_STATUS = 505)
  CANCEL: 4,            // Hủy đơn hàng (ORDER_STATUS < 200)
  DELETE: 5,            // Xóa đơn hàng đã hủy (ORDER_STATUS = 107)
} as const;
