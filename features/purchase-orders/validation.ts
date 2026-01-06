/**
 * Zod validation schemas for purchase-orders module
 */
import { z } from 'zod';
import type { BusinessId, SystemId } from '@/lib/id-types';

// Purchase order status enum
export const purchaseOrderStatusSchema = z.enum([
  'draft',
  'pending_approval',
  'approved',
  'ordered',
  'partial_received',
  'received',
  'completed',
  'cancelled'
]);

// Payment status enum
export const poPaymentStatusSchema = z.enum([
  'unpaid',
  'partial_paid',
  'paid'
]);

// Purchase order item schema
export const purchaseOrderItemSchema = z.object({
  productSystemId: z.string() as z.ZodType<SystemId>,
  productBusinessId: z.string().optional() as z.ZodType<BusinessId | undefined>,
  productName: z.string().optional(),
  variantSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  variantName: z.string().optional(),
  sku: z.string().optional(),
  unit: z.string().optional(),
  quantity: z.number().int().positive('Số lượng phải lớn hơn 0'),
  receivedQuantity: z.number().int().min(0).default(0),
  unitPrice: z.number().min(0, 'Đơn giá phải >= 0'),
  discount: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  taxAmount: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
  notes: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
});

// Create purchase order schema
export const createPurchaseOrderSchema = z.object({
  supplierSystemId: z.string() as z.ZodType<SystemId>,
  supplierBusinessId: z.string().optional() as z.ZodType<BusinessId | undefined>,
  supplierName: z.string().optional(),
  
  // Branch/Warehouse
  branchSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  branchName: z.string().optional(),
  warehouseSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  warehouseName: z.string().optional(),
  
  // Dates
  orderDate: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  
  // Financial
  subtotal: z.number().min(0).optional(),
  discountRate: z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  taxAmount: z.number().min(0).optional(),
  shippingCost: z.number().min(0).optional(),
  otherCost: z.number().min(0).optional(),
  totalAmount: z.number().min(0).optional(),
  
  // Payment
  paymentTerms: z.string().optional(),
  paymentDueDate: z.string().optional(),
  
  // Items
  items: z.array(purchaseOrderItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
  
  // Additional
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

// Update purchase order schema
export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial().extend({
  status: purchaseOrderStatusSchema.optional(),
  paymentStatus: poPaymentStatusSchema.optional(),
});

// Approve schema
export const approvePurchaseOrderSchema = z.object({
  approverNote: z.string().optional(),
});

// Send to supplier schema
export const sendToSupplierSchema = z.object({
  sentAt: z.date().optional(),
  sentVia: z.enum(['email', 'phone', 'fax', 'other']).optional(),
  contactPerson: z.string().optional(),
  sentNote: z.string().optional(),
});

// Receive goods schema
export const receiveGoodsSchema = z.object({
  receivedAt: z.string().optional(),
  receiverName: z.string().optional(),
  items: z.array(z.object({
    itemIndex: z.number().int().min(0),
    receivedQuantity: z.number().int().min(0),
    locationSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
    batchNumber: z.string().optional(),
    expiryDate: z.string().optional(),
    notes: z.string().optional(),
  })),
  receiveNote: z.string().optional(),
  createInventoryReceipt: z.boolean().default(true),
});

// Cancel schema
export const cancelPurchaseOrderSchema = z.object({
  cancellationReason: z.string().min(1, 'Lý do hủy không được để trống'),
  cancelledAt: z.date().optional(),
});

// Filter schema
export const purchaseOrderFiltersSchema = z.object({
  status: purchaseOrderStatusSchema.optional(),
  paymentStatus: poPaymentStatusSchema.optional(),
  supplierSystemId: z.string().optional(),
  branchSystemId: z.string().optional(),
  warehouseSystemId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

// Types
export type PurchaseOrderStatus = z.infer<typeof purchaseOrderStatusSchema>;
export type POPaymentStatus = z.infer<typeof poPaymentStatusSchema>;
export type PurchaseOrderItem = z.infer<typeof purchaseOrderItemSchema>;
export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>;
export type ApprovePurchaseOrderInput = z.infer<typeof approvePurchaseOrderSchema>;
export type SendToSupplierInput = z.infer<typeof sendToSupplierSchema>;
export type ReceiveGoodsInput = z.infer<typeof receiveGoodsSchema>;
export type CancelPurchaseOrderInput = z.infer<typeof cancelPurchaseOrderSchema>;
export type PurchaseOrderFilters = z.infer<typeof purchaseOrderFiltersSchema>;
