import { z } from 'zod';

// Create schema
export const createTaxSchema = z.object({
  id: z.string().min(1, 'Mã thuế không được để trống'),
  name: z.string().min(1, 'Tên thuế không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  rate: z.number().min(0, 'Thuế suất phải >= 0').max(100, 'Thuế suất không được vượt quá 100%'),
  isDefaultSale: z.boolean().default(false),
  isDefaultPurchase: z.boolean().default(false),
  description: z.string().optional(),
});

// Update schema (all optional)
export const updateTaxSchema = createTaxSchema.partial();

// Filter schema
export const taxFilterSchema = z.object({
  search: z.string().optional(),
  isDefaultSale: z.boolean().optional(),
  isDefaultPurchase: z.boolean().optional(),
});

// Types from schemas
export type CreateTaxInput = z.infer<typeof createTaxSchema>;
export type UpdateTaxInput = z.infer<typeof updateTaxSchema>;
export type TaxFilter = z.infer<typeof taxFilterSchema>;
