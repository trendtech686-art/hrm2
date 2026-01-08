import { z } from 'zod';

export const createSlaSettingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
}).passthrough(); // Allow additional metadata fields

export const updateSlaSettingSchema = createSlaSettingSchema.partial();

export type CreateSlaSettingInput = z.infer<typeof createSlaSettingSchema>;
export type UpdateSlaSettingInput = z.infer<typeof updateSlaSettingSchema>;
