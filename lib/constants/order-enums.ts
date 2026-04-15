/**
 * Order Enum Labels - Vietnamese display names for order status enums
 * 
 * ⚠️ CLIENT-SAFE: This file does NOT import Prisma client
 * Can be used in both server and client components
 * 
 * Usage:
 * - Store enum values in database (PENDING, PROCESSING, etc.)
 * - Display Vietnamese labels in UI using these maps
 * 
 * Example:
 *   <Badge>{ORDER_STATUS_LABELS[order.status]}</Badge>
 */

// ============================================
// ENUM VALUES (string constants - no Prisma import)
// ============================================

// OrderStatus enum values
export const OrderStatusEnum = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  PACKING: 'PACKING',
  PACKED: 'PACKED',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  FAILED_DELIVERY: 'FAILED_DELIVERY',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
} as const;
export type OrderStatusType = typeof OrderStatusEnum[keyof typeof OrderStatusEnum];

// PaymentStatus enum values
export const PaymentStatusEnum = {
  UNPAID: 'UNPAID',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
} as const;
export type PaymentStatusType = typeof PaymentStatusEnum[keyof typeof PaymentStatusEnum];

// DeliveryMethod enum values
export const DeliveryMethodEnum = {
  PICKUP: 'PICKUP',
  SHIPPING: 'SHIPPING',
  IN_STORE_PICKUP: 'IN_STORE_PICKUP',
} as const;
export type DeliveryMethodType = typeof DeliveryMethodEnum[keyof typeof DeliveryMethodEnum];

// DeliveryStatus enum values
export const DeliveryStatusEnum = {
  PENDING_PACK: 'PENDING_PACK',
  PACKED: 'PACKED',
  PENDING_SHIP: 'PENDING_SHIP',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  RESCHEDULED: 'RESCHEDULED',
  CANCELLED: 'CANCELLED',
} as const;
export type DeliveryStatusType = typeof DeliveryStatusEnum[keyof typeof DeliveryStatusEnum];

// DiscountType enum values
export const DiscountTypeEnum = {
  FIXED: 'FIXED',
  PERCENTAGE: 'PERCENTAGE',
} as const;
export type DiscountTypeType = typeof DiscountTypeEnum[keyof typeof DiscountTypeEnum];

// PrintStatus enum values
export const PrintStatusEnum = {
  NOT_PRINTED: 'NOT_PRINTED',
  PRINTED: 'PRINTED',
} as const;
export type PrintStatusType = typeof PrintStatusEnum[keyof typeof PrintStatusEnum];

// StockOutStatus enum values
export const StockOutStatusEnum = {
  NOT_STOCKED_OUT: 'NOT_STOCKED_OUT',
  FULLY_STOCKED_OUT: 'FULLY_STOCKED_OUT',
} as const;
export type StockOutStatusType = typeof StockOutStatusEnum[keyof typeof StockOutStatusEnum];

// ReturnStatus enum values
export const ReturnStatusEnum = {
  NO_RETURN: 'NO_RETURN',
  PARTIAL_RETURN: 'PARTIAL_RETURN',
  FULL_RETURN: 'FULL_RETURN',
} as const;
export type ReturnStatusType = typeof ReturnStatusEnum[keyof typeof ReturnStatusEnum];

// ============================================
// ORDER STATUS LABELS
// ============================================

/**
 * Sapo Order Status Model:
 * - Main Order Status (trạng thái đơn hàng): Đặt hàng, Đang giao dịch, Đã hoàn thành, Đã lưu trữ, Đã hủy
 * - Payment Status (trạng thái thanh toán): Chưa thanh toán, Chờ xác nhận, Thanh toán một phần, Đã thanh toán, Hoàn tiền một phần, Đã hoàn tiền, Đã hủy
 * - Processing Status (trạng thái xử lý): Chưa xử lý, Xử lý một phần, Đã xử lý
 * - Return Status (trạng thái trả hàng): Đang trả hàng, Đã trả hàng
 * - Delivery Status (trạng thái giao hàng): Chờ lấy hàng, Đã lấy hàng, Đang giao hàng, Chờ giao lại, Đã giao hàng, Đang hoàn hàng, Chờ xác nhận hàng hoàn, Đã hoàn hàng, Đã hủy
 */

// Internal workflow statuses (stored in DB)
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Đặt hàng',
  CONFIRMED: 'Đang giao dịch',
  PROCESSING: 'Đang giao dịch',
  PACKING: 'Đang giao dịch',
  PACKED: 'Đang giao dịch',
  READY_FOR_PICKUP: 'Đang giao dịch',
  SHIPPING: 'Đang giao dịch',
  DELIVERED: 'Đang giao dịch',
  COMPLETED: 'Hoàn thành',
  ARCHIVED: 'Đã lưu trữ',
  FAILED_DELIVERY: 'Đang giao dịch',
  RETURNED: 'Đang giao dịch',
  CANCELLED: 'Đã hủy',
};

// Reverse lookup: Vietnamese -> Enum
export const ORDER_STATUS_FROM_LABEL: Record<string, string> = {
  'Đặt hàng': 'PENDING',
  'Chờ xử lý': 'PENDING',
  'Đã xác nhận': 'CONFIRMED',
  'Đang giao dịch': 'PROCESSING',
  'Đang xử lý': 'PROCESSING',
  'Đang đóng gói': 'PACKING',
  'Đã đóng gói': 'PACKED',
  'Chờ lấy hàng': 'READY_FOR_PICKUP',
  'Đang giao hàng': 'SHIPPING',
  'Đã giao hàng': 'DELIVERED',
  'Hoàn thành': 'COMPLETED',
  'Đã hoàn thành': 'COMPLETED',
  'Đã lưu trữ': 'ARCHIVED',
  'Giao thất bại': 'FAILED_DELIVERY',
  'Đã trả hàng': 'RETURNED',
  'Đã hủy': 'CANCELLED',
};

// ============================================
// MAIN DISPLAY STATUS (Sapo Standard - Only 5 values)
// ============================================
export type MainOrderStatus = 'Đặt hàng' | 'Đang giao dịch' | 'Hoàn thành' | 'Đã lưu trữ' | 'Đã hủy';

/**
 * Convert internal workflow status to Sapo main display status
 * Main statuses: Đặt hàng, Đang giao dịch, Hoàn thành, Đã lưu trữ, Đã hủy
 */
export function getMainOrderStatus(status: string): MainOrderStatus {
  switch (status) {
    case 'PENDING':
      return 'Đặt hàng';
    case 'CANCELLED':
      return 'Đã hủy';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'ARCHIVED':
      return 'Đã lưu trữ';
    // All other statuses are "in progress"
    default:
      return 'Đang giao dịch';
  }
}

// ============================================
// PAYMENT STATUS LABELS (Sapo Standard)
// ============================================
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  PARTIAL: 'Thanh toán một phần',
  PAID: 'Đã thanh toán',
  PARTIAL_REFUND: 'Hoàn tiền một phần',
  REFUNDED: 'Đã hoàn tiền',
  CANCELLED: 'Đã hủy',
};

export const PAYMENT_STATUS_FROM_LABEL: Record<string, string> = {
  'Chưa thanh toán': 'UNPAID',
  'Chờ xác nhận': 'PENDING_CONFIRMATION',
  'Thanh toán 1 phần': 'PARTIAL',
  'Thanh toán một phần': 'PARTIAL',
  'Đã thanh toán': 'PAID',
  'Thanh toán toàn bộ': 'PAID',
  'Hoàn tiền một phần': 'PARTIAL_REFUND',
  'Đã hoàn tiền': 'REFUNDED',
  'Đã hủy thanh toán': 'CANCELLED',
};

// ============================================
// DELIVERY METHOD LABELS
// ============================================
export const DELIVERY_METHOD_LABELS: Record<string, string> = {
  PICKUP: 'Khách tự đến lấy',
  SHIPPING: 'Dịch vụ giao hàng',
  IN_STORE_PICKUP: 'Nhận tại cửa hàng',
};

export const DELIVERY_METHOD_FROM_LABEL: Record<string, string> = {
  'Khách tự đến lấy': 'PICKUP',
  'Tự đến lấy': 'PICKUP',
  'Dịch vụ giao hàng': 'SHIPPING',
  'Giao hàng': 'SHIPPING',
  'Nhận tại cửa hàng': 'IN_STORE_PICKUP',
};

// ============================================
// DELIVERY STATUS LABELS (Sapo Standard)
// ============================================
export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  PENDING_PACK: 'Chờ đóng gói',
  PACKED: 'Đã đóng gói',
  PENDING_SHIP: 'Chờ lấy hàng',
  PICKED_UP: 'Đã lấy hàng',
  SHIPPING: 'Đang giao hàng',
  RESCHEDULED: 'Chờ giao lại',
  DELIVERED: 'Đã giao hàng',
  RETURNING: 'Đang hoàn hàng',
  WAITING_RETURN_CONFIRM: 'Chờ xác nhận hàng hoàn',
  RETURNED: 'Đã hoàn hàng',
  CANCELLED: 'Đã hủy',
};

export const DELIVERY_STATUS_FROM_LABEL: Record<string, string> = {
  'Chờ đóng gói': 'PENDING_PACK',
  'Đã đóng gói': 'PACKED',
  'Chờ lấy hàng': 'PENDING_SHIP',
  'Đã lấy hàng': 'PICKED_UP',
  'Đang giao hàng': 'SHIPPING',
  'Chờ giao lại': 'RESCHEDULED',
  'Đã giao hàng': 'DELIVERED',
  'Đang hoàn hàng': 'RETURNING',
  'Chờ xác nhận hàng hoàn': 'WAITING_RETURN_CONFIRM',
  'Đã hoàn hàng': 'RETURNED',
  'Đã hủy': 'CANCELLED',
};

// ============================================
// DISCOUNT TYPE LABELS
// ============================================
export const DISCOUNT_TYPE_LABELS: Record<string, string> = {
  FIXED: 'Số tiền cố định',
  PERCENTAGE: 'Phần trăm',
};

export const DISCOUNT_TYPE_FROM_LABEL: Record<string, string> = {
  'fixed': 'FIXED',
  'FIXED': 'FIXED',
  'Số tiền cố định': 'FIXED',
  'percentage': 'PERCENTAGE',
  'PERCENTAGE': 'PERCENTAGE',
  'percent': 'PERCENTAGE',
  'Phần trăm': 'PERCENTAGE',
  '%': 'PERCENTAGE',
};

// ============================================
// PRINT STATUS LABELS
// ============================================
export const PRINT_STATUS_LABELS: Record<string, string> = {
  NOT_PRINTED: 'Chưa in',
  PRINTED: 'Đã in',
};

export const PRINT_STATUS_FROM_LABEL: Record<string, string> = {
  'Chưa in': 'NOT_PRINTED',
  'Đã in': 'PRINTED',
};

// ============================================
// STOCK OUT STATUS LABELS
// ============================================
export const STOCK_OUT_STATUS_LABELS: Record<string, string> = {
  NOT_STOCKED_OUT: 'Chưa xuất kho',
  FULLY_STOCKED_OUT: 'Đã xuất kho',
};

export const STOCK_OUT_STATUS_FROM_LABEL: Record<string, string> = {
  'Chưa xuất kho': 'NOT_STOCKED_OUT',
  'Đã xuất kho': 'FULLY_STOCKED_OUT',
  'Xuất kho toàn bộ': 'FULLY_STOCKED_OUT',
};

// ============================================
// RETURN STATUS LABELS (Sapo Standard)
// ============================================
export const RETURN_STATUS_LABELS: Record<string, string> = {
  NO_RETURN: '',
  RETURNING: 'Đang trả hàng',
  PARTIAL_RETURN: 'Trả một phần',
  FULL_RETURN: 'Đã trả hàng',
};

export const RETURN_STATUS_FROM_LABEL: Record<string, string> = {
  'Chưa trả hàng': 'NO_RETURN',
  'Đang trả hàng': 'RETURNING',
  'Trả một phần': 'PARTIAL_RETURN',
  'Trả hàng một phần': 'PARTIAL_RETURN',
  'Trả toàn bộ': 'FULL_RETURN',
  'Trả hàng toàn bộ': 'FULL_RETURN',
  'Đã trả hàng': 'FULL_RETURN',
};

// ============================================
// PROCESSING STATUS LABELS (Sapo Standard - Trạng thái xử lý)
// ============================================
export const ProcessingStatusEnum = {
  NOT_PROCESSED: 'NOT_PROCESSED',
  PARTIAL_PROCESSED: 'PARTIAL_PROCESSED',
  PROCESSED: 'PROCESSED',
} as const;
export type ProcessingStatusType = typeof ProcessingStatusEnum[keyof typeof ProcessingStatusEnum];

export const PROCESSING_STATUS_LABELS: Record<string, string> = {
  NOT_PROCESSED: 'Chưa xử lý',
  PARTIAL_PROCESSED: 'Xử lý một phần',
  PROCESSED: 'Đã xử lý',
};

export const PROCESSING_STATUS_FROM_LABEL: Record<string, string> = {
  'Chưa xử lý': 'NOT_PROCESSED',
  'Xử lý một phần': 'PARTIAL_PROCESSED',
  'Đã xử lý': 'PROCESSED',
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get Vietnamese label for any order-related enum
 */
export function getOrderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] || status;
}

export function getPaymentStatusLabel(status: string): string {
  return PAYMENT_STATUS_LABELS[status] || status;
}

export function getDeliveryMethodLabel(method: string): string {
  return DELIVERY_METHOD_LABELS[method] || method;
}

export function getDeliveryStatusLabel(status: string): string {
  return DELIVERY_STATUS_LABELS[status] || status;
}

/**
 * Parse string (enum or Vietnamese) to enum value
 * Returns undefined if not found
 */
export function parseOrderStatus(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  // Check if already valid enum
  if (Object.values(OrderStatusEnum).includes(value as OrderStatusType)) {
    return value;
  }
  // Try Vietnamese lookup
  return ORDER_STATUS_FROM_LABEL[value];
}

export function parsePaymentStatus(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (Object.values(PaymentStatusEnum).includes(value as PaymentStatusType)) {
    return value;
  }
  return PAYMENT_STATUS_FROM_LABEL[value];
}

export function parseDeliveryMethod(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (Object.values(DeliveryMethodEnum).includes(value as DeliveryMethodType)) {
    return value;
  }
  return DELIVERY_METHOD_FROM_LABEL[value];
}

export function parseDeliveryStatus(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (Object.values(DeliveryStatusEnum).includes(value as DeliveryStatusType)) {
    return value;
  }
  return DELIVERY_STATUS_FROM_LABEL[value];
}

export function parseDiscountType(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (Object.values(DiscountTypeEnum).includes(value as DiscountTypeType)) {
    return value;
  }
  return DISCOUNT_TYPE_FROM_LABEL[value];
}

export function parsePrintStatus(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (Object.values(PrintStatusEnum).includes(value as PrintStatusType)) {
    return value;
  }
  return PRINT_STATUS_FROM_LABEL[value];
}

export function parseStockOutStatus(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (Object.values(StockOutStatusEnum).includes(value as StockOutStatusType)) {
    return value;
  }
  return STOCK_OUT_STATUS_FROM_LABEL[value];
}

export function parseReturnStatus(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  if (Object.values(ReturnStatusEnum).includes(value as ReturnStatusType)) {
    return value;
  }
  return RETURN_STATUS_FROM_LABEL[value];
}

// ============================================
// ORDER DATA CONVERTER (for API submission)
// ============================================
/**
 * Convert order data with Vietnamese status strings to Prisma enum values
 * Use this before sending to API
 */
export function convertOrderForApi(data: Record<string, unknown>): Record<string, unknown> {
  const result = { ...data };
  
  // Convert status fields
  if (data.status && typeof data.status === 'string') {
    result.status = parseOrderStatus(data.status) || 'PENDING';
  }
  if (data.paymentStatus && typeof data.paymentStatus === 'string') {
    result.paymentStatus = parsePaymentStatus(data.paymentStatus) || 'UNPAID';
  }
  if (data.deliveryMethod && typeof data.deliveryMethod === 'string') {
    result.deliveryMethod = parseDeliveryMethod(data.deliveryMethod) || 'SHIPPING';
  }
  if (data.deliveryStatus && typeof data.deliveryStatus === 'string') {
    result.deliveryStatus = parseDeliveryStatus(data.deliveryStatus) || 'PENDING_PACK';
  }
  if (data.printStatus && typeof data.printStatus === 'string') {
    result.printStatus = parsePrintStatus(data.printStatus) || 'NOT_PRINTED';
  }
  if (data.stockOutStatus && typeof data.stockOutStatus === 'string') {
    result.stockOutStatus = parseStockOutStatus(data.stockOutStatus) || 'NOT_STOCKED_OUT';
  }
  if (data.returnStatus && typeof data.returnStatus === 'string') {
    result.returnStatus = parseReturnStatus(data.returnStatus) || 'NO_RETURN';
  }
  
  // Convert lineItems discountType
  if (Array.isArray(data.lineItems)) {
    result.lineItems = data.lineItems.map((item: Record<string, unknown>) => ({
      ...item,
      discountType: item.discountType ? parseDiscountType(item.discountType as string) : undefined,
    }));
  }
  
  return result;
}
