/**
 * Order Status Labels - Vietnamese translations for all order-related enums
 * 
 * This file provides a single source of truth for status label mappings.
 * Import these maps in API routes, components, and utilities.
 * 
 * @example
 * import { orderStatusLabels, getOrderStatusLabel } from '@/lib/constants/order-status-labels';
 * 
 * // Use map directly
 * const label = orderStatusLabels['PENDING']; // 'Chờ xác nhận'
 * 
 * // Use helper function
 * const label = getOrderStatusLabel('PENDING'); // 'Chờ xác nhận'
 */

// ========================================
// ORDER STATUS (Sapo Standard - 5 main statuses)
// Internal workflow statuses map to main display statuses
// ========================================
export const orderStatusLabels: Record<string, string> = {
  'PENDING': 'Đặt hàng',
  'CONFIRMED': 'Đang giao dịch',
  'PROCESSING': 'Đang giao dịch',
  'PACKING': 'Đang giao dịch',
  'PACKED': 'Đang giao dịch',
  'READY_FOR_PICKUP': 'Đang giao dịch',
  'SHIPPING': 'Đang giao dịch',
  'DELIVERED': 'Đang giao dịch',
  'COMPLETED': 'Hoàn thành',
  'ARCHIVED': 'Đã lưu trữ',
  'FAILED_DELIVERY': 'Đang giao dịch',
  'RETURNED': 'Đang giao dịch',
  'CANCELLED': 'Đã hủy',
};

export function getOrderStatusLabel(status: string): string {
  return orderStatusLabels[status] || status;
}

// ========================================
// PAYMENT STATUS (Sapo Standard)
// ========================================
export const paymentStatusLabels: Record<string, string> = {
  'UNPAID': 'Chưa thanh toán',
  'PENDING_CONFIRMATION': 'Chờ xác nhận',
  'PARTIAL': 'Thanh toán một phần',
  'PAID': 'Đã thanh toán',
  'PARTIAL_REFUND': 'Hoàn tiền một phần',
  'REFUNDED': 'Đã hoàn tiền',
  'CANCELLED': 'Đã hủy',
};

export function getPaymentStatusLabel(status: string): string {
  return paymentStatusLabels[status] || status;
}

// ========================================
// DELIVERY STATUS (Sapo Standard)
// ========================================
export const deliveryStatusLabels: Record<string, string> = {
  'PENDING_PACK': 'Chờ đóng gói',
  'PACKED': 'Đã đóng gói',
  'PENDING_SHIP': 'Chờ lấy hàng',
  'PICKED_UP': 'Đã lấy hàng',
  'SHIPPING': 'Đang giao hàng',
  'RESCHEDULED': 'Chờ giao lại',
  'DELIVERED': 'Đã giao hàng',
  'RETURNING': 'Đang hoàn hàng',
  'WAITING_RETURN_CONFIRM': 'Chờ xác nhận hàng hoàn',
  'RETURNED': 'Đã hoàn hàng',
  'CANCELLED': 'Đã hủy',
};

export function getDeliveryStatusLabel(status: string): string {
  return deliveryStatusLabels[status] || status;
}

// ========================================
// PACKAGING STATUS
// ========================================
export const packagingStatusLabels: Record<string, string> = {
  'PENDING': 'Chờ đóng gói',
  'IN_PROGRESS': 'Đang đóng gói',
  'COMPLETED': 'Đã đóng gói',
  'CANCELLED': 'Đã hủy',
};

export function getPackagingStatusLabel(status: string): string {
  return packagingStatusLabels[status] || status;
}

// ========================================
// DELIVERY METHOD
// ========================================
export const deliveryMethodLabels: Record<string, string> = {
  'SHIPPING': 'Dịch vụ giao hàng',
  'PICKUP': 'Lấy tại kho',
  'IN_STORE_PICKUP': 'Nhận tại cửa hàng',
};

export function getDeliveryMethodLabel(method: string): string {
  return deliveryMethodLabels[method] || method;
}

// ========================================
// PRINT STATUS
// ========================================
export const printStatusLabels: Record<string, string> = {
  'NOT_PRINTED': 'Chưa in',
  'PRINTED': 'Đã in',
};

export function getPrintStatusLabel(status: string): string {
  return printStatusLabels[status] || status;
}

// ========================================
// STOCK OUT STATUS
// ========================================
export const stockOutStatusLabels: Record<string, string> = {
  'NOT_STOCKED_OUT': 'Chưa xuất kho',
  'FULLY_STOCKED_OUT': 'Xuất kho toàn bộ',
};

export function getStockOutStatusLabel(status: string): string {
  return stockOutStatusLabels[status] || status;
}

// ========================================
// RETURN STATUS
// ========================================
export const returnStatusLabels: Record<string, string> = {
  'NO_RETURN': 'Chưa trả hàng',
  'PARTIAL_RETURN': 'Trả hàng một phần',
  'FULL_RETURN': 'Trả hàng toàn bộ',
};

export function getReturnStatusLabel(status: string): string {
  return returnStatusLabels[status] || status;
}

// ========================================
// SHIPMENT STATUS
// ========================================
export const shipmentStatusLabels: Record<string, string> = {
  'PENDING': 'Chờ lấy hàng',
  'PICKED': 'Đã lấy hàng',
  'IN_TRANSIT': 'Đang vận chuyển',
  'DELIVERING': 'Đang giao hàng',
  'DELIVERED': 'Đã giao hàng',
  'RETURNED': 'Đã hoàn hàng',
  'CANCELLED': 'Đã hủy',
};

export function getShipmentStatusLabel(status: string): string {
  return shipmentStatusLabels[status] || status;
}

// ========================================
// TRANSFORM HELPERS
// ========================================

/**
 * Transform an order object - convert all status enums to Vietnamese labels
 */
export function transformOrderStatusLabels<T extends Record<string, unknown>>(order: T): T {
  return {
    ...order,
    status: typeof order.status === 'string' ? getOrderStatusLabel(order.status) : order.status,
    paymentStatus: typeof order.paymentStatus === 'string' ? getPaymentStatusLabel(order.paymentStatus) : order.paymentStatus,
    deliveryStatus: typeof order.deliveryStatus === 'string' ? getDeliveryStatusLabel(order.deliveryStatus) : order.deliveryStatus,
    printStatus: typeof order.printStatus === 'string' ? getPrintStatusLabel(order.printStatus) : order.printStatus,
    stockOutStatus: typeof order.stockOutStatus === 'string' ? getStockOutStatusLabel(order.stockOutStatus) : order.stockOutStatus,
    returnStatus: typeof order.returnStatus === 'string' ? getReturnStatusLabel(order.returnStatus) : order.returnStatus,
  };
}

/**
 * Transform a packaging object - convert status enums to Vietnamese labels
 */
export function transformPackagingStatusLabels<T extends Record<string, unknown>>(packaging: T): T {
  return {
    ...packaging,
    status: typeof packaging.status === 'string' ? getPackagingStatusLabel(packaging.status) : packaging.status,
    deliveryStatus: typeof packaging.deliveryStatus === 'string' ? getDeliveryStatusLabel(packaging.deliveryStatus) : packaging.deliveryStatus,
    deliveryMethod: typeof packaging.deliveryMethod === 'string' ? getDeliveryMethodLabel(packaging.deliveryMethod) : packaging.deliveryMethod,
    printStatus: typeof packaging.printStatus === 'string' ? getPrintStatusLabel(packaging.printStatus) : packaging.printStatus,
  };
}

// ========================================
// REVERSE MAPPINGS (Vietnamese → Enum)
// ========================================

/**
 * Convert Vietnamese label back to enum value
 * Useful when receiving form data
 */
export const reverseOrderStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(orderStatusLabels).map(([k, v]) => [v, k])
);

export const reversePaymentStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(paymentStatusLabels).map(([k, v]) => [v, k])
);

export const reverseDeliveryStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(deliveryStatusLabels).map(([k, v]) => [v, k])
);

export const reversePackagingStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(packagingStatusLabels).map(([k, v]) => [v, k])
);

export const reverseDeliveryMethodLabels: Record<string, string> = Object.fromEntries(
  Object.entries(deliveryMethodLabels).map(([k, v]) => [v, k])
);

export const reversePrintStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(printStatusLabels).map(([k, v]) => [v, k])
);

export const reverseStockOutStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(stockOutStatusLabels).map(([k, v]) => [v, k])
);

export const reverseReturnStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(returnStatusLabels).map(([k, v]) => [v, k])
);

export const reverseShipmentStatusLabels: Record<string, string> = Object.fromEntries(
  Object.entries(shipmentStatusLabels).map(([k, v]) => [v, k])
);
