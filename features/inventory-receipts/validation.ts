/**
 * Zod validation schemas for inventory-receipts module
 */
import { z } from 'zod';

// Item schema - matches server action fields
export const inventoryReceiptItemSchema = z.object({
  productId: z.string().min(1, 'Product ID không được để trống'),
  productSku: z.string().optional(),
  productName: z.string().optional().default(''), // Allow undefined, default to empty
  quantity: z.number().int().min(1, 'Số lượng phải >= 1'),
  unitCost: z.number().min(0, 'Đơn giá phải >= 0').optional(),
  totalCost: z.number().min(0).optional(),
});

// Create schema - matches server action fields
export const createInventoryReceiptSchema = z.object({
  type: z.enum(['PURCHASE', 'TRANSFER_IN', 'RETURN', 'ADJUSTMENT', 'OTHER']),
  branchId: z.string().optional(), // branchSystemId is the main identifier
  branchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh'),
  branchName: z.string().optional(),
  supplierSystemId: z.string().optional(),
  supplierName: z.string().optional(),
  purchaseOrderSystemId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  receiptDate: z.string().optional(),
  notes: z.string().optional(),
  createdBy: z.string().optional(),
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
