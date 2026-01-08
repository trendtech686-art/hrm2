/**
 * Zod validation schemas for sales-returns module
 */
import { z } from 'zod';
import { businessIdSchema, systemIdSchema } from '@/lib/id-types';

// Return status enum
export const salesReturnStatusSchema = z.enum([
  'pending',
  'processing',
  'approved',
  'rejected',
  'completed',
  'cancelled'
]);

// Return reason enum
export const salesReturnReasonSchema = z.enum([
  'defective',
  'wrong_item',
  'not_as_described',
  'changed_mind',
  'damaged_in_transit',
  'missing_parts',
  'quality_issue',
  'other'
]);

// Return item schema
export const salesReturnItemSchema = z.object({
  orderItemSystemId: systemIdSchema.optional(),
  productSystemId: systemIdSchema,
  productBusinessId: businessIdSchema.optional(),
  productName: z.string().optional(),
  variantSystemId: systemIdSchema.optional(),
  variantName: z.string().optional(),
  quantity: z.number().int().positive('Số lượng phải lớn hơn 0'),
  returnedQuantity: z.number().int().min(0).default(0),
  unitPrice: z.number().min(0),
  reason: salesReturnReasonSchema,
  reasonNote: z.string().optional(),
  returnToStock: z.boolean().default(true),
  locationSystemId: systemIdSchema.optional(),
});

// Create sales return schema
export const createSalesReturnSchema = z.object({
  orderSystemId: systemIdSchema,
  orderBusinessId: businessIdSchema.optional(),
  customerSystemId: systemIdSchema.optional(),
  customerName: z.string().optional(),
  branchSystemId: systemIdSchema.optional(),
  reason: salesReturnReasonSchema,
  notes: z.string().optional(),
  items: z.array(salesReturnItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm trả hàng'),
  refundAmount: z.number().min(0).optional(),
  refundMethod: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// Update sales return schema
export const updateSalesReturnSchema = createSalesReturnSchema.partial().extend({
  status: salesReturnStatusSchema.optional(),
});

// Approve schema
export const approveSalesReturnSchema = z.object({
  approverNote: z.string().optional(),
  adjustedRefundAmount: z.number().min(0).optional(),
});

// Reject schema
export const rejectSalesReturnSchema = z.object({
  rejectionReason: z.string().min(1, 'Lý do từ chối không được để trống'),
});

// Complete schema
export const completeSalesReturnSchema = z.object({
  refundedAmount: z.number().min(0),
  refundedAt: z.date().optional(),
  completionNote: z.string().optional(),
});

// Filter schema
export const salesReturnFiltersSchema = z.object({
  status: salesReturnStatusSchema.optional(),
  reason: salesReturnReasonSchema.optional(),
  customerSystemId: z.string().optional(),
  branchSystemId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type SalesReturnStatus = z.infer<typeof salesReturnStatusSchema>;
export type SalesReturnReason = z.infer<typeof salesReturnReasonSchema>;
export type SalesReturnItem = z.infer<typeof salesReturnItemSchema>;
export type CreateSalesReturnInput = z.infer<typeof createSalesReturnSchema>;
export type UpdateSalesReturnInput = z.infer<typeof updateSalesReturnSchema>;
export type ApproveSalesReturnInput = z.infer<typeof approveSalesReturnSchema>;
export type RejectSalesReturnInput = z.infer<typeof rejectSalesReturnSchema>;
export type CompleteSalesReturnInput = z.infer<typeof completeSalesReturnSchema>;
export type SalesReturnFilters = z.infer<typeof salesReturnFiltersSchema>;
