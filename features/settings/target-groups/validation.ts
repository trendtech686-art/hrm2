import { z } from 'zod';

// Create schema
export const createTargetGroupSchema = z.object({
  id: z.string().default(''),
  name: z.string().min(1, 'Tên nhóm không được để trống').max(100, 'Tên không được vượt quá 100 ký tự'),
  isActive: z.boolean().optional().default(true),
  isDefault: z.boolean().optional().default(false),
});

// Update schema (all optional)
export const updateTargetGroupSchema = createTargetGroupSchema.partial();

// Filter schema
export const targetGroupFilterSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Types from schemas
export type CreateTargetGroupInput = z.infer<typeof createTargetGroupSchema>;
export type UpdateTargetGroupInput = z.infer<typeof updateTargetGroupSchema>;
export type TargetGroupFilter = z.infer<typeof targetGroupFilterSchema>;
