import { z } from 'zod';

// =============================================================================
// ORDER VALIDATION SCHEMAS
// =============================================================================

/**
 * Order Status Schemas
 */
export const orderMainStatusSchema = z.enum([
  'Đặt hàng',
  'Đang giao dịch',
  'Hoàn thành',
  'Đã hủy',
]);

export const orderPaymentStatusSchema = z.enum([
  'Chưa thanh toán',
  'Thanh toán 1 phần',
  'Thanh toán toàn bộ',
]);

export const packagingStatusSchema = z.enum([
  'Chờ đóng gói',
  'Đã đóng gói',
  'Hủy đóng gói',
]);

export const orderDeliveryStatusSchema = z.enum([
  'Chờ đóng gói',
  'Đã đóng gói',
  'Chờ lấy hàng',
  'Đang giao hàng',
  'Đã giao hàng',
  'Chờ giao lại',
  'Đã hủy',
]);

export const orderDeliveryMethodSchema = z.enum([
  'Nhận tại cửa hàng',
  'Dịch vụ giao hàng',
]);

export const orderStockOutStatusSchema = z.enum([
  'Chưa xuất kho',
  'Xuất kho toàn bộ',
]);

/**
 * Order Address Schema
 */
export const orderAddressSchema = z.object({
  street: z.string().max(200).optional(),
  ward: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  contactName: z.string().max(100).optional(),
  phone: z.string().regex(/^(0|\+84)[3-9][0-9]{8}$/, 'Số điện thoại không hợp lệ').optional().or(z.literal('')),
  company: z.string().max(200).optional(),
  note: z.string().max(500).optional(),
  label: z.string().max(50).optional(),
  provinceId: z.string().optional(),
  districtId: z.union([z.number(), z.string()]).optional(),
  wardId: z.string().optional(),
});

export type OrderAddressInput = z.infer<typeof orderAddressSchema>;

/**
 * Line Item Schema
 */
export const lineItemSchema = z.object({
  productSystemId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  productId: z.string(),
  productName: z.string(),
  quantity: z.number().min(1, 'Số lượng phải >= 1'),
  unitPrice: z.number().min(0, 'Đơn giá phải >= 0'),
  discount: z.number().min(0).default(0),
  discountType: z.enum(['percentage', 'fixed']).default('fixed'),
  tax: z.number().min(0).optional(),
  taxId: z.string().optional(),
  note: z.string().max(500).optional(),
});

export type LineItemInput = z.infer<typeof lineItemSchema>;

/**
 * Create Order Schema
 */
export const createOrderSchema = z.object({
  // Customer
  customerSystemId: z.string().min(1, 'Vui lòng chọn khách hàng'),
  
  // Branch
  branchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh'),
  
  // Products
  items: z.array(lineItemSchema).min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
  
  // Delivery
  deliveryMethod: orderDeliveryMethodSchema.default('Nhận tại cửa hàng'),
  shippingAddress: orderAddressSchema.optional(),
  
  // Payment
  paymentMethod: z.string().optional(),
  
  // Discounts
  orderDiscount: z.number().min(0).default(0),
  orderDiscountType: z.enum(['percentage', 'fixed']).default('fixed'),
  
  // Notes
  note: z.string().max(1000).optional(),
  internalNote: z.string().max(1000).optional(),
  
  // Date
  orderDate: z.date().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Update Order Schema
 */
export const updateOrderSchema = z.object({
  items: z.array(lineItemSchema).optional(),
  deliveryMethod: orderDeliveryMethodSchema.optional(),
  shippingAddress: orderAddressSchema.optional(),
  paymentMethod: z.string().optional(),
  orderDiscount: z.number().min(0).optional(),
  orderDiscountType: z.enum(['percentage', 'fixed']).optional(),
  note: z.string().max(1000).optional(),
  internalNote: z.string().max(1000).optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

/**
 * Order Payment Schema
 */
export const orderPaymentSchema = z.object({
  amount: z.number().min(1, 'Số tiền phải > 0'),
  method: z.string().min(1, 'Vui lòng chọn phương thức thanh toán'),
  date: z.date().optional(),
  description: z.string().max(500).optional(),
});

export type OrderPaymentInput = z.infer<typeof orderPaymentSchema>;

/**
 * Cancel Order Schema
 */
export const cancelOrderSchema = z.object({
  reason: z.string()
    .min(1, 'Vui lòng nhập lý do hủy')
    .max(500, 'Lý do không được quá 500 ký tự'),
  restockItems: z.boolean().default(true),
  notifyCustomer: z.boolean().default(false),
});

export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;

/**
 * List Orders Query Schema
 */
export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  status: orderMainStatusSchema.optional(),
  paymentStatus: orderPaymentStatusSchema.optional(),
  deliveryStatus: orderDeliveryStatusSchema.optional(),
  branchSystemId: z.string().optional(),
  customerSystemId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  sortBy: z.enum(['orderDate', 'createdAt', 'total', 'status']).optional().default('orderDate'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema>;
