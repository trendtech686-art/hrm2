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
export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Đặt hàng',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang giao dịch',
  PACKING: 'Đang đóng gói',
  PACKED: 'Đã đóng gói',
  READY_FOR_PICKUP: 'Chờ lấy hàng',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  COMPLETED: 'Hoàn thành',
  FAILED_DELIVERY: 'Giao thất bại',
  RETURNED: 'Đã trả hàng',
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
  'Giao thất bại': 'FAILED_DELIVERY',
  'Đã trả hàng': 'RETURNED',
  'Đã hủy': 'CANCELLED',
};

// ============================================
// PAYMENT STATUS LABELS
// ============================================
export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: 'Chưa thanh toán',
  PARTIAL: 'Thanh toán một phần',
  PAID: 'Đã thanh toán',
};

export const PAYMENT_STATUS_FROM_LABEL: Record<string, string> = {
  'Chưa thanh toán': 'UNPAID',
  'Thanh toán 1 phần': 'PARTIAL',
  'Thanh toán một phần': 'PARTIAL',
  'Đã thanh toán': 'PAID',
  'Thanh toán toàn bộ': 'PAID',
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
// DELIVERY STATUS LABELS
// ============================================
export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  PENDING_PACK: 'Chờ đóng gói',
  PACKED: 'Đã đóng gói',
  PENDING_SHIP: 'Chờ lấy hàng',
  SHIPPING: 'Đang giao hàng',
  DELIVERED: 'Đã giao hàng',
  RESCHEDULED: 'Chờ giao lại',
  CANCELLED: 'Đã hủy',
};

export const DELIVERY_STATUS_FROM_LABEL: Record<string, string> = {
  'Chờ đóng gói': 'PENDING_PACK',
  'Đã đóng gói': 'PACKED',
  'Chờ lấy hàng': 'PENDING_SHIP',
  'Đang giao hàng': 'SHIPPING',
  'Đã giao hàng': 'DELIVERED',
  'Chờ giao lại': 'RESCHEDULED',
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
// RETURN STATUS LABELS
// ============================================
export const RETURN_STATUS_LABELS: Record<string, string> = {
  NO_RETURN: 'Chưa trả hàng',
  PARTIAL_RETURN: 'Trả một phần',
  FULL_RETURN: 'Trả toàn bộ',
};

export const RETURN_STATUS_FROM_LABEL: Record<string, string> = {
  'Chưa trả hàng': 'NO_RETURN',
  'Trả một phần': 'PARTIAL_RETURN',
  'Trả hàng một phần': 'PARTIAL_RETURN',
  'Trả toàn bộ': 'FULL_RETURN',
  'Trả hàng toàn bộ': 'FULL_RETURN',
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
