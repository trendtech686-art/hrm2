import { z } from 'zod';

// Create schema
export const createReceiptTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại không được để trống'),
  name: z.string().min(1, 'Tên loại không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  description: z.string().optional(),
  isBusinessResult: z.boolean().default(true),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().optional().default(false),
  color: z.string().optional(),
});

// Update schema (all optional)
export const updateReceiptTypeSchema = createReceiptTypeSchema.partial();

// Filter schema
export const receiptTypeFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isBusinessResult: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Types from schemas
export type CreateReceiptTypeInput = z.infer<typeof createReceiptTypeSchema>;
export type UpdateReceiptTypeInput = z.infer<typeof updateReceiptTypeSchema>;
export type ReceiptTypeFilter = z.infer<typeof receiptTypeFilterSchema>;
