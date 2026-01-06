import { z } from 'zod';

// Create schema
export const createSalesChannelSchema = z.object({
  id: z.string().max(20, 'Mã không được vượt quá 20 ký tự').default(''),
  name: z.string().min(1, 'Tên nguồn bán hàng không được để trống').max(120, 'Tên không được vượt quá 120 ký tự'),
  isApplied: z.boolean().default(true),
  isDefault: z.boolean().default(false),
});

// Update schema (all optional)
export const updateSalesChannelSchema = createSalesChannelSchema.partial();

// Filter schema
export const salesChannelFilterSchema = z.object({
  search: z.string().optional(),
  isApplied: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Types from schemas
export type CreateSalesChannelInput = z.infer<typeof createSalesChannelSchema>;
export type UpdateSalesChannelInput = z.infer<typeof updateSalesChannelSchema>;
export type SalesChannelFilter = z.infer<typeof salesChannelFilterSchema>;
