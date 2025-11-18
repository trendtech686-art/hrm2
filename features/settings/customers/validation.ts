import { z } from 'zod';

// Base validation schema
const baseSettingSchema = z.object({
  id: z.string().min(1, 'Mã không được để trống'),
  name: z.string().min(1, 'Tên không được để trống'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

// Customer Type schema
export const customerTypeSchema = baseSettingSchema;
export type CustomerTypeFormData = z.infer<typeof customerTypeSchema>;

// Customer Group schema
export const customerGroupSchema = baseSettingSchema.extend({
  color: z.string().optional(),
});
export type CustomerGroupFormData = z.infer<typeof customerGroupSchema>;

// Customer Source schema
export const customerSourceSchema = baseSettingSchema.extend({
  type: z.enum(['Online', 'Offline', 'Referral', 'Other']).optional(),
});
export type CustomerSourceFormData = z.infer<typeof customerSourceSchema>;

// Payment Term schema
export const paymentTermSchema = baseSettingSchema.extend({
  days: z.number().min(0, 'Số ngày phải >= 0'),
  isDefault: z.boolean().optional(),
});
export type PaymentTermFormData = z.infer<typeof paymentTermSchema>;

// Credit Rating schema
export const creditRatingSchema = baseSettingSchema.extend({
  level: z.number().min(1).max(10),
  maxCreditLimit: z.number().min(0).optional(),
  color: z.string().optional(),
});
export type CreditRatingFormData = z.infer<typeof creditRatingSchema>;
