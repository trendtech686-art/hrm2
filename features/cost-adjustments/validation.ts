/**
 * Zod validation schemas for cost-adjustments module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

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
  productSystemId: systemIdSchema,
  productId: businessIdSchema.optional(),
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  productImage: z.string().optional(),
  oldCost: z.number().min(0, 'Giá cũ phải >= 0').optional(),
  oldCostPrice: z.number().min(0, 'Giá cũ phải >= 0').optional(),
  newCost: z.number().min(0, 'Giá mới phải >= 0').optional(),
  newCostPrice: z.number().min(0, 'Giá mới phải >= 0').optional(),
  adjustmentAmount: z.number().optional(),
  adjustmentPercent: z.number().optional(),
  quantity: z.number().int().min(0).optional(),
  notes: z.string().optional(),
});

// Create schema - flexible to support both action format and form format
export const createCostAdjustmentSchema = z.object({
  branchSystemId: systemIdSchema.optional(),
  branchId: z.string().optional(),
  branchName: z.string().optional(),
  adjustmentDate: z.string().optional(),
  type: z.string().optional(),
  reason: z.union([costAdjustmentReasonSchema, z.string()]).optional(),
  note: z.string().optional(),
  notes: z.string().optional(),
  referenceCode: z.string().optional(),
  businessId: z.string().optional(),
  createdBy: z.string().optional(),
  createdByName: z.string().optional(),
  items: z.array(costAdjustmentItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
});

// Update schema
export const updateCostAdjustmentSchema = createCostAdjustmentSchema.partial().extend({
  status: costAdjustmentStatusSchema.optional(),
});

// Approve/Reject schema
export const approveCostAdjustmentSchema = z.object({
  approverSystemId: systemIdSchema,
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
