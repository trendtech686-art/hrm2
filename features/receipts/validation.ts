/**
 * Zod validation schemas for receipts module
 */
import { z } from 'zod';

// Status enum
export const receiptStatusSchema = z.enum([
  'pending',
  'completed',
  'cancelled',
  'refunded'
]);

// Category enum for server action
export const serverReceiptCategorySchema = z.enum([
  'sale',
  'SALES_REVENUE',
  'service_revenue',
  'complaint_penalty',
  'warranty_additional',
  'customer_payment',
  'deposit_received',
  'other'
]);

// Category enum for form (legacy)
export const receiptCategorySchema = z.enum([
  'sales',
  'service',
  'refund',
  'deposit',
  'other'
]);

// Create receipt schema - matches CreateReceiptInput in app/actions/receipts.ts
export const createReceiptSchema = z.object({
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  description: z.string().optional(),
  category: serverReceiptCategorySchema,
  paymentMethodSystemId: z.string().optional(),
  paymentMethodName: z.string().optional(),
  branchId: z.string().min(1, 'Vui lòng chọn chi nhánh'),
  branchSystemId: z.string().optional(),
  branchName: z.string().optional(),
  accountId: z.string().optional(),
  accountSystemId: z.string().optional(),
  payerType: z.string().optional(),
  payerTypeSystemId: z.string().optional(),
  payerName: z.string().optional(),
  payerSystemId: z.string().optional(),
  payerPhone: z.string().optional(),
  customerId: z.string().optional(),
  customerSystemId: z.string().optional(),
  customerName: z.string().optional(),
  linkedOrderSystemId: z.string().optional(),
  linkedSalesReturnSystemId: z.string().optional(),
  linkedWarrantySystemId: z.string().optional(),
  linkedComplaintSystemId: z.string().optional(),
  voucherDate: z.date().optional(),
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
