/**
 * Zod validation schemas for cost-adjustments module
 */
import { z } from 'zod';
import type { SystemId, BusinessId } from '@/lib/id-types';

// Status enum
export const costAdjustmentStatusSchema = z.enum([
  'draft',
  'pending',
  'approved',
  'rejected',
  'cancelled'
]);

// Reason enum
export const costAdjustmentReasonSchema = z.enum([
  'price_change',
  'supplier_discount',
  'promotion',
  'correction',
  'damage',
  'other'
]);

// Item schema
export const costAdjustmentItemSchema = z.object({
  productSystemId: z.string() as z.ZodType<SystemId>,
  productId: z.string().optional() as z.ZodType<BusinessId | undefined>,
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  oldCost: z.number().min(0, 'Giá cũ phải >= 0'),
  newCost: z.number().min(0, 'Giá mới phải >= 0'),
  quantity: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

// Create schema
export const createCostAdjustmentSchema = z.object({
  branchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh') as z.ZodType<SystemId>,
  branchName: z.string().optional(),
  adjustmentDate: z.string().min(1, 'Ngày điều chỉnh không được để trống'),
  reason: costAdjustmentReasonSchema,
  notes: z.string().optional(),
  items: z.array(costAdjustmentItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
});

// Update schema
export const updateCostAdjustmentSchema = createCostAdjustmentSchema.partial().extend({
  status: costAdjustmentStatusSchema.optional(),
});

// Approve/Reject schema
export const approveCostAdjustmentSchema = z.object({
  approverSystemId: z.string() as z.ZodType<SystemId>,
  approverName: z.string().optional(),
  notes: z.string().optional(),
});

// Filter schema
export const costAdjustmentFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  status: costAdjustmentStatusSchema.optional(),
  reason: costAdjustmentReasonSchema.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type CostAdjustmentStatus = z.infer<typeof costAdjustmentStatusSchema>;
export type CostAdjustmentReason = z.infer<typeof costAdjustmentReasonSchema>;
export type CostAdjustmentItemInput = z.infer<typeof costAdjustmentItemSchema>;
export type CreateCostAdjustmentInput = z.infer<typeof createCostAdjustmentSchema>;
export type UpdateCostAdjustmentInput = z.infer<typeof updateCostAdjustmentSchema>;
export type ApproveCostAdjustmentInput = z.infer<typeof approveCostAdjustmentSchema>;
export type CostAdjustmentFilters = z.infer<typeof costAdjustmentFiltersSchema>;
