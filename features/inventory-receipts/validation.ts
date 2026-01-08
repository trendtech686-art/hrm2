/**
 * Zod validation schemas for inventory-receipts module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

// Item schema
export const inventoryReceiptItemSchema = z.object({
  productSystemId: systemIdSchema,
  productId: businessIdSchema.optional(),
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  orderedQuantity: z.number().int().min(0).optional(),
  receivedQuantity: z.number().int().min(1, 'Số lượng nhận phải >= 1'),
  unitPrice: z.number().min(0, 'Đơn giá phải >= 0'),
});

// Create schema
export const createInventoryReceiptSchema = z.object({
  purchaseOrderSystemId: systemIdSchema.optional(),
  purchaseOrderId: businessIdSchema.optional(),
  supplierSystemId: systemIdSchema,
  supplierName: z.string().min(1, 'Tên nhà cung cấp không được để trống'),
  receivedDate: z.string().min(1, 'Ngày nhận không được để trống'),
  receiverSystemId: systemIdSchema.optional(),
  receiverName: z.string().optional(),
  branchSystemId: systemIdSchema.refine(v => v.length >= 1, 'Vui lòng chọn chi nhánh'),
  branchName: z.string().optional(),
  warehouseName: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(inventoryReceiptItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
});

// Update schema
export const updateInventoryReceiptSchema = createInventoryReceiptSchema.partial();

// Filter schema
export const inventoryReceiptFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  supplierSystemId: z.string().optional(),
  purchaseOrderSystemId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type InventoryReceiptItemInput = z.infer<typeof inventoryReceiptItemSchema>;
export type CreateInventoryReceiptInput = z.infer<typeof createInventoryReceiptSchema>;
export type UpdateInventoryReceiptInput = z.infer<typeof updateInventoryReceiptSchema>;
export type InventoryReceiptFilters = z.infer<typeof inventoryReceiptFiltersSchema>;
