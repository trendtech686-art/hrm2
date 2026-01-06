/**
 * Zod validation schemas for payments module
 */
import { z } from 'zod';
import type { SystemId, BusinessId } from '@/lib/id-types';

// Status enum
export const paymentStatusSchema = z.enum([
  'pending',
  'completed',
  'cancelled',
  'refunded'
]);

// Category enum
export const paymentCategorySchema = z.enum([
  'customer_payment',
  'supplier_payment',
  'expense',
  'salary',
  'other'
]);

// Create payment schema
export const createPaymentSchema = z.object({
  date: z.string().min(1, 'Ngày thanh toán không được để trống'),
  amount: z.number().min(0, 'Số tiền phải >= 0'),
  recipientTypeSystemId: z.string() as z.ZodType<SystemId>,
  recipientTypeName: z.string().optional(),
  recipientName: z.string().min(1, 'Tên người nhận không được để trống'),
  recipientSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  description: z.string().optional(),
  paymentMethodSystemId: z.string() as z.ZodType<SystemId>,
  paymentMethodName: z.string().optional(),
  accountSystemId: z.string() as z.ZodType<SystemId>,
  paymentReceiptTypeSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  paymentReceiptTypeName: z.string().optional(),
  branchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh') as z.ZodType<SystemId>,
  branchName: z.string().optional(),
  status: paymentStatusSchema.default('completed'),
  category: paymentCategorySchema,
  affectsDebt: z.boolean().default(true),
  purchaseOrderSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  purchaseOrderId: z.string().optional() as z.ZodType<BusinessId | undefined>,
  orderSystemId: z.string().optional() as z.ZodType<SystemId | undefined>,
  orderId: z.string().optional() as z.ZodType<BusinessId | undefined>,
  originalDocumentId: z.string().optional(),
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
