/**
 * Zod validation schemas for stock-transfers module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

// Status enum
export const stockTransferStatusSchema = z.enum([
  'draft',
  'pending',
  'in_transit',
  'completed',
  'cancelled'
]);

// Item schema
export const stockTransferItemSchema = z.object({
  productSystemId: systemIdSchema,
  productId: businessIdSchema.optional(),
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  quantity: z.number().int().min(1, 'Số lượng phải >= 1'),
  unitPrice: z.number().min(0).optional(),
  notes: z.string().optional(),
});

// Create schema
export const createStockTransferSchema = z.object({
  fromBranchSystemId: systemIdSchema.refine(v => v.length >= 1, 'Vui lòng chọn chi nhánh xuất'),
  fromBranchName: z.string().optional(),
  toBranchSystemId: systemIdSchema.refine(v => v.length >= 1, 'Vui lòng chọn chi nhánh nhận'),
  toBranchName: z.string().optional(),
  transferDate: z.string().min(1, 'Ngày chuyển không được để trống'),
  notes: z.string().optional(),
  items: z.array(stockTransferItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
}).refine(data => data.fromBranchSystemId !== data.toBranchSystemId, {
  message: 'Chi nhánh xuất và nhận không được trùng nhau',
  path: ['toBranchSystemId'],
});

// Update schema
export const updateStockTransferSchema = createStockTransferSchema.partial().extend({
  status: stockTransferStatusSchema.optional(),
});

// Complete transfer schema
export const completeStockTransferSchema = z.object({
  receivedDate: z.string().optional(),
  receiverName: z.string().optional(),
  notes: z.string().optional(),
});

// Filter schema
export const stockTransferFiltersSchema = z.object({
  fromBranchSystemId: z.string().optional(),
  toBranchSystemId: z.string().optional(),
  status: stockTransferStatusSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type StockTransferStatus = z.infer<typeof stockTransferStatusSchema>;
export type StockTransferItemInput = z.infer<typeof stockTransferItemSchema>;
export type CreateStockTransferInput = z.infer<typeof createStockTransferSchema>;
export type UpdateStockTransferInput = z.infer<typeof updateStockTransferSchema>;
export type CompleteStockTransferInput = z.infer<typeof completeStockTransferSchema>;
export type StockTransferFilters = z.infer<typeof stockTransferFiltersSchema>;
