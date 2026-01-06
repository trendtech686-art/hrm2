import { z } from 'zod';

// Create schema
export const createUnitSchema = z.object({
  id: z.string().min(1, 'Mã đơn vị tính không được để trống'),
  name: z.string().min(1, 'Tên đơn vị tính không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  description: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

// Update schema (all optional)
export const updateUnitSchema = createUnitSchema.partial();

// Filter schema
export const unitFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Types from schemas
export type CreateUnitInput = z.infer<typeof createUnitSchema>;
export type UpdateUnitInput = z.infer<typeof updateUnitSchema>;
export type UnitFilter = z.infer<typeof unitFilterSchema>;
