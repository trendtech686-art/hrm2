/**
 * Zod validation schemas for stock-history module
 */
import { z } from 'zod';

// Stock movement type
export const stockMovementTypeSchema = z.enum([
  'IN',           // Nhập kho
  'OUT',          // Xuất kho
  'TRANSFER_IN',  // Nhận chuyển kho
  'TRANSFER_OUT', // Chuyển kho đi
  'ADJUSTMENT',   // Điều chỉnh
  'RETURN_IN',    // Nhận hàng trả
  'RETURN_OUT',   // Trả hàng
]);

// Stock movement source
export const stockMovementSourceSchema = z.enum([
  'PURCHASE_ORDER',   // Đơn mua hàng
  'SALES_ORDER',      // Đơn bán hàng
  'STOCK_TRANSFER',   // Chuyển kho
  'INVENTORY_CHECK',  // Kiểm kho
  'SALES_RETURN',     // Trả hàng bán
  'PURCHASE_RETURN',  // Trả hàng mua
  'MANUAL',           // Thủ công
]);

// Stock history filters schema
export const stockHistoryFiltersSchema = z.object({
  productId: z.string().optional(),
  productSystemId: z.string().optional(),
  locationId: z.string().optional(),
  movementType: stockMovementTypeSchema.optional(),
  source: stockMovementSourceSchema.optional(),
  sourceId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

// Stock history entry schema
export const stockHistoryEntrySchema = z.object({
  id: z.string(),
  productId: z.string(),
  productSystemId: z.string(),
  productName: z.string(),
  productSku: z.string().optional(),
  locationId: z.string().optional(),
  locationName: z.string().optional(),
  movementType: stockMovementTypeSchema,
  source: stockMovementSourceSchema,
  sourceId: z.string().optional(),
  sourceCode: z.string().optional(),
  quantity: z.number(),
  quantityBefore: z.number(),
  quantityAfter: z.number(),
  unitCost: z.number().optional(),
  totalCost: z.number().optional(),
  note: z.string().optional(),
  createdBy: z.string().optional(),
  createdByName: z.string().optional(),
  createdAt: z.string().datetime(),
});

// Export types
export type StockMovementType = z.infer<typeof stockMovementTypeSchema>;
export type StockMovementSource = z.infer<typeof stockMovementSourceSchema>;
export type StockHistoryFilters = z.infer<typeof stockHistoryFiltersSchema>;
export type StockHistoryEntry = z.infer<typeof stockHistoryEntrySchema>;
