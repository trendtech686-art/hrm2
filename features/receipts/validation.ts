/**
 * Zod validation schemas for receipts module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

// Status enum
export const receiptStatusSchema = z.enum([
  'pending',
  'completed',
  'cancelled',
  'refunded'
]);

// Category enum
export const receiptCategorySchema = z.enum([
  'sales',
  'service',
  'refund',
  'deposit',
  'other'
]);

// Create receipt schema
export const createReceiptSchema = z.object({
  date: z.string().min(1, 'Ngày thu không được để trống'),
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  payerTypeSystemId: systemIdSchema,
  payerTypeName: z.string().optional(),
  payerName: z.string().min(1, 'Tên người nộp không được để trống'),
  payerSystemId: systemIdSchema.optional(),
  description: z.string().optional(),
  paymentMethodSystemId: systemIdSchema,
  paymentMethodName: z.string().optional(),
  accountSystemId: systemIdSchema,
  receiptTypeSystemId: systemIdSchema.optional(),
  receiptTypeName: z.string().optional(),
  branchSystemId: systemIdSchema.refine(v => v.length >= 1, 'Vui lòng chọn chi nhánh'),
  branchName: z.string().optional(),
  status: receiptStatusSchema.default('completed'),
  category: receiptCategorySchema,
  affectsDebt: z.boolean().default(true),
  orderSystemId: systemIdSchema.optional(),
  orderId: businessIdSchema.optional(),
  originalDocumentId: z.string().optional(),
});

// Update receipt schema
export const updateReceiptSchema = createReceiptSchema.partial();

// Filter schema
export const receiptFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  status: receiptStatusSchema.optional(),
  category: receiptCategorySchema.optional(),
  payerSystemId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type ReceiptStatus = z.infer<typeof receiptStatusSchema>;
export type ReceiptCategory = z.infer<typeof receiptCategorySchema>;
export type CreateReceiptInput = z.infer<typeof createReceiptSchema>;
export type UpdateReceiptInput = z.infer<typeof updateReceiptSchema>;
export type ReceiptFilters = z.infer<typeof receiptFiltersSchema>;
