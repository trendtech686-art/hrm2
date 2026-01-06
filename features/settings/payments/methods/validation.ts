import { z } from 'zod';

// Create schema
export const createPaymentMethodSchema = z.object({
  name: z.string().min(1, 'Tên hình thức thanh toán không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  isDefault: z.boolean().default(false),
  isActive: z.boolean().default(true),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  // Bank account info (for transfer methods)
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
});

// Update schema (all optional)
export const updatePaymentMethodSchema = createPaymentMethodSchema.partial();

// Filter schema
export const paymentMethodFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Types from schemas
export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>;
export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>;
export type PaymentMethodFilter = z.infer<typeof paymentMethodFilterSchema>;
