/**
 * Zod validation schemas for purchase-returns module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

// Item schema
export const purchaseReturnItemSchema = z.object({
  productSystemId: systemIdSchema,
  productId: businessIdSchema,
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  orderedQuantity: z.number().int().min(0).optional(),
  returnQuantity: z.number().int().min(1, 'Số lượng trả phải >= 1'),
  unitPrice: z.number().min(0, 'Đơn giá phải >= 0'),
});

// Create schema
export const createPurchaseReturnSchema = z.object({
  purchaseOrderSystemId: systemIdSchema,
  purchaseOrderId: businessIdSchema,
  supplierSystemId: systemIdSchema,
  supplierName: z.string().min(1, 'Tên nhà cung cấp không được để trống'),
  branchSystemId: systemIdSchema.refine(v => v.length >= 1, 'Vui lòng chọn chi nhánh'),
  branchName: z.string().optional(),
  returnDate: z.string().min(1, 'Ngày trả không được để trống'),
  reason: z.string().min(1, 'Lý do trả hàng không được để trống'),
  items: z.array(purchaseReturnItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
  totalReturnValue: z.number().min(0).optional(),
  refundAmount: z.number().min(0).optional(),
  refundMethod: z.string().optional(),
  creatorName: z.string().optional(),
});

// Update schema
export const updatePurchaseReturnSchema = createPurchaseReturnSchema.partial();

// Filter schema
export const purchaseReturnFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  supplierSystemId: z.string().optional(),
  purchaseOrderSystemId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type PurchaseReturnItemInput = z.infer<typeof purchaseReturnItemSchema>;
export type CreatePurchaseReturnInput = z.infer<typeof createPurchaseReturnSchema>;
export type UpdatePurchaseReturnInput = z.infer<typeof updatePurchaseReturnSchema>;
export type PurchaseReturnFilters = z.infer<typeof purchaseReturnFiltersSchema>;
