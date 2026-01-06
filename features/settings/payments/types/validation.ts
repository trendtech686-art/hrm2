import { z } from 'zod';

// Create schema
export const createPaymentTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại không được để trống'),
  name: z.string().min(1, 'Tên loại không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  description: z.string().optional(),
  isBusinessResult: z.boolean().default(true),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().optional().default(false),
  color: z.string().optional(),
});

// Update schema (all optional)
export const updatePaymentTypeSchema = createPaymentTypeSchema.partial();

// Filter schema
export const paymentTypeFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isBusinessResult: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Types from schemas
export type CreatePaymentTypeInput = z.infer<typeof createPaymentTypeSchema>;
export type UpdatePaymentTypeInput = z.infer<typeof updatePaymentTypeSchema>;
export type PaymentTypeFilter = z.infer<typeof paymentTypeFilterSchema>;
