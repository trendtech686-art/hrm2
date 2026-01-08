/**
 * Zod validation schemas for inventory-checks module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

// Status enum
export const inventoryCheckStatusSchema = z.enum([
  'draft',
  'balanced', 
  'in_progress',
  'completed',
  'cancelled'
]);

// Difference reason enum
export const differenceReasonSchema = z.enum([
  'damaged',
  'expired', 
  'lost',
  'theft',
  'system_error',
  'counting_error',
  'other'
]);

// Item schema
export const inventoryCheckItemSchema = z.object({
  productSystemId: systemIdSchema,
  productId: businessIdSchema,
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  systemQuantity: z.number().int().min(0, 'Số lượng hệ thống phải >= 0'),
  actualQuantity: z.number().int().min(0, 'Số lượng thực tế phải >= 0'),
  difference: z.number().int(),
  differenceReason: differenceReasonSchema.optional(),
  notes: z.string().optional(),
  unitPrice: z.number().min(0).optional(),
});

// Create schema
export const createInventoryCheckSchema = z.object({
  branchSystemId: systemIdSchema.refine(v => v.length >= 1, 'Vui lòng chọn chi nhánh'),
  branchName: z.string().optional(),
  notes: z.string().optional(),
  checkDate: z.string().optional(),
  items: z.array(inventoryCheckItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
});

// Update schema  
export const updateInventoryCheckSchema = createInventoryCheckSchema.partial().extend({
  status: inventoryCheckStatusSchema.optional(),
});

// Complete check schema
export const completeInventoryCheckSchema = z.object({
  adjustInventory: z.boolean().default(true),
  notes: z.string().optional(),
});

// Filter schema
export const inventoryCheckFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  status: inventoryCheckStatusSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type InventoryCheckStatus = z.infer<typeof inventoryCheckStatusSchema>;
export type DifferenceReason = z.infer<typeof differenceReasonSchema>;
export type InventoryCheckItemInput = z.infer<typeof inventoryCheckItemSchema>;
export type CreateInventoryCheckInput = z.infer<typeof createInventoryCheckSchema>;
export type UpdateInventoryCheckInput = z.infer<typeof updateInventoryCheckSchema>;
export type CompleteInventoryCheckInput = z.infer<typeof completeInventoryCheckSchema>;
export type InventoryCheckFilters = z.infer<typeof inventoryCheckFiltersSchema>;
