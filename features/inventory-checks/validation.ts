/**
 * Zod validation schemas for inventory-checks module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

// Status enum - MUST match Prisma schema enum InventoryCheckStatus
// Database values: DRAFT, IN_PROGRESS, PENDING, COMPLETED, BALANCED, CANCELLED
export const inventoryCheckStatusSchema = z.enum([
  'DRAFT',
  'IN_PROGRESS',
  'PENDING',
  'COMPLETED',
  'BALANCED',
  'CANCELLED',
  // Also support lowercase for legacy compatibility (will be normalized to uppercase)
  'draft',
  'in_progress',
  'completed',
  'balanced',
  'cancelled',
]);

// Difference reason enum - MUST match inventory-check-item.prisma reason field
// Database values: other, damaged, wear, return, transfer, production
export const differenceReasonSchema = z.enum([
  'other',
  'damaged',
  'wear',
  'return',
  'transfer',
  'production',
]);

// Item schema - field names match database columns
export const inventoryCheckItemSchema = z.object({
  productSystemId: systemIdSchema,
  productId: businessIdSchema,
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  productSku: z.string().optional(),
  unit: z.string().optional(),
  systemQuantity: z.number().int().min(0, 'Số lượng hệ thống phải >= 0'),
  actualQuantity: z.number().int().min(0, 'Số lượng thực tế phải >= 0'),
  difference: z.number().int().optional(),
  reason: differenceReasonSchema.optional(),
  note: z.string().optional(), // Single 'note' field (not 'notes')
});

// Create schema - field names match database columns
export const createInventoryCheckSchema = z.object({
  branchSystemId: systemIdSchema.refine(v => v.length >= 1, 'Vui lòng chọn chi nhánh'),
  branchId: z.string().optional(), // Legacy field, use branchSystemId instead
  branchName: z.string().optional(),
  note: z.string().optional(), // Single 'note' field (not 'notes')
  checkDate: z.string().optional(),
  items: z.array(inventoryCheckItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
  linkedComplaintSystemId: z.string().optional(),
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
