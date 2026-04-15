/**
 * J&T Express Status Mapping & Constants
 * Based on J&T API documentation: https://developer.jet.co.id/documentation/index
 */

import type { OrderDeliveryStatus } from '@/lib/types/prisma-extended';

export type JNTStatusCode = 101 | 100 | 162 | 163 | 150 | 151 | 152 | 200 | 401 | 402;

export interface JNTStatusMapping {
  statusCode: JNTStatusCode;
  statusText: string;
  deliveryStatus: OrderDeliveryStatus;
  description: string;
  canCancel: boolean;
  shouldUpdateStock: boolean;
  stockAction?: 'dispatch' | 'complete' | 'return';
  isFinal: boolean;
}

/**
 * J&T Status Mapping
 * Note: J&T uses status_code in tracking responses.
 * status_code=100 covers multiple transit sub-statuses (identified by status text).
 */
export const JNT_STATUS_MAP: Record<number, JNTStatusMapping> = {
  101: {
    statusCode: 101,
    statusText: 'Đã tạo đơn',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'Đơn hàng đã được tạo trên hệ thống J&T (Manifes)',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  100: {
    statusCode: 100,
    statusText: 'Đang vận chuyển',
    deliveryStatus: 'Đang giao hàng',
    description: 'Đơn hàng đang được vận chuyển qua hệ thống J&T',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'dispatch',
    isFinal: false,
  },
  150: {
    statusCode: 150,
    statusText: 'Lưu kho',
    deliveryStatus: 'Đang giao hàng',
    description: 'Đơn hàng đang được lưu tại kho J&T (có vấn đề)',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  151: {
    statusCode: 151,
    statusText: 'Lấy hàng thất bại',
    deliveryStatus: 'Chờ lấy hàng',
    description: 'J&T không lấy được hàng',
    canCancel: true,
    shouldUpdateStock: false,
    isFinal: false,
  },
  152: {
    statusCode: 152,
    statusText: 'Giao hàng thất bại',
    deliveryStatus: 'Đang giao hàng',
    description: 'J&T không giao được hàng, đang lưu kho',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  162: {
    statusCode: 162,
    statusText: 'Hủy bởi người gửi',
    deliveryStatus: 'Đã hủy',
    description: 'Đơn hàng đã bị hủy bởi người gửi qua API',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  163: {
    statusCode: 163,
    statusText: 'Hủy bởi J&T',
    deliveryStatus: 'Đã hủy',
    description: 'Đơn hàng đã bị hủy bởi J&T Express',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
  200: {
    statusCode: 200,
    statusText: 'Đã giao hàng',
    deliveryStatus: 'Đã giao hàng',
    description: 'Đơn hàng đã được giao thành công',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'complete',
    isFinal: true,
  },
  401: {
    statusCode: 401,
    statusText: 'Đang trả hàng',
    deliveryStatus: 'Đang giao hàng',
    description: 'Đơn hàng đang được trả về cho người gửi',
    canCancel: false,
    shouldUpdateStock: false,
    isFinal: false,
  },
  402: {
    statusCode: 402,
    statusText: 'Đã trả hàng',
    deliveryStatus: 'Đã hủy',
    description: 'Đơn hàng đã được trả về cho người gửi',
    canCancel: false,
    shouldUpdateStock: true,
    stockAction: 'return',
    isFinal: true,
  },
};

/**
 * Get J&T status info from status code
 */
export function getJNTStatusInfo(statusCode: number): JNTStatusMapping | null {
  return JNT_STATUS_MAP[statusCode] || null;
}

/**
 * Check if a J&T shipment can be cancelled
 */
export function canCancelJNTShipment(statusCode?: number): boolean {
  if (statusCode === undefined || statusCode === null) return false;
  const info = getJNTStatusInfo(statusCode);
  return info?.canCancel ?? false;
}

/**
 * Check if J&T status should still be synced (not final)
 */
export function shouldSyncJNTStatus(statusCode?: number): boolean {
  if (statusCode === undefined || statusCode === null) return true;
  const info = getJNTStatusInfo(statusCode);
  return info ? !info.isFinal : true;
}

/**
 * J&T Status display mapping (for UI badges)
 */
export const JNT_STATUS_DISPLAY: Record<number, { text: string; color: string }> = {
  101: { text: 'Đã tạo đơn', color: 'secondary' },
  100: { text: 'Đang vận chuyển', color: 'warning' },
  150: { text: 'Lưu kho (có vấn đề)', color: 'warning' },
  151: { text: 'Lấy hàng thất bại', color: 'destructive' },
  152: { text: 'Giao hàng thất bại', color: 'destructive' },
  162: { text: 'Hủy bởi người gửi', color: 'destructive' },
  163: { text: 'Hủy bởi J&T', color: 'destructive' },
  200: { text: 'Đã giao hàng', color: 'success' },
  401: { text: 'Đang trả hàng', color: 'warning' },
  402: { text: 'Đã trả hàng', color: 'secondary' },
};

/**
 * J&T Service Types
 */
export const JNT_SERVICE_TYPES = {
  PICKUP: 1,    // Dịch vụ lấy hàng tận nơi
  DROP_OFF: 6,  // Gửi hàng tại bưu cục
} as const;

/**
 * J&T Express Types
 */
export const JNT_EXPRESS_TYPES = {
  EZ: '1', // Regular (EZ)
} as const;
