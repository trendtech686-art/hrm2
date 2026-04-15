/**
 * Zod validation schemas for payments module
 */
import { z } from 'zod';
import { systemIdSchema, businessIdSchema } from '@/lib/id-types';

// Status enum
export const paymentStatusSchema = z.enum([
  'pending',
  'completed',
  'cancelled',
  'refunded'
]);

// Category enum
export const paymentCategorySchema = z.enum([
  'purchase',
  'customer_payment',
  'complaint_refund',
  'warranty_refund',
  'sales_return_refund',
  'employee_advance',
  'employee_salary',
  'supplier_payment',
  'operational_expense',
  'expense',
  'salary',
  'other'
]);

// Create payment schema
export const createPaymentSchema = z.object({
  date: z.string().min(1, 'Ngày thanh toán không được để trống'),
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  recipientTypeSystemId: systemIdSchema.optional(),
  recipientTypeName: z.string().optional(),
  recipientName: z.string().min(1, 'Tên người nhận không được để trống'),
  recipientSystemId: systemIdSchema.optional(),
  description: z.string().optional(),
  paymentMethodSystemId: systemIdSchema.optional(),
  paymentMethodName: z.string().optional(),
  paymentMethod: z.string().optional(), // Alternative field for method name
  accountSystemId: systemIdSchema.optional(),
  paymentReceiptTypeSystemId: systemIdSchema.optional(),
  paymentReceiptTypeName: z.string().optional(),
  branchSystemId: systemIdSchema.optional(),
  branchId: z.string().optional(), // Alternative field for branch
  branchName: z.string().optional(),
  status: paymentStatusSchema.default('completed'),
  category: paymentCategorySchema,
  affectsDebt: z.boolean().default(true),
  affectsBusinessReport: z.boolean().default(false),
  purchaseOrderSystemId: systemIdSchema.optional(),
  purchaseOrderId: businessIdSchema.optional(),
  orderSystemId: systemIdSchema.optional(),
  orderId: businessIdSchema.optional(),
  originalDocumentId: z.string().optional(),
  supplierId: z.string().optional(), // For supplier payments
  createdBy: z.string().optional(),
});

// Update payment schema
export const updatePaymentSchema = createPaymentSchema.partial();

// Filter schema
export const paymentFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  status: paymentStatusSchema.optional(),
  category: paymentCategorySchema.optional(),
  recipientSystemId: z.string().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  search: z.string().optional(),
});

// Types
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type PaymentCategory = z.infer<typeof paymentCategorySchema>;
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type PaymentFilters = z.infer<typeof paymentFiltersSchema>;
