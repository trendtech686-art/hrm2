import { z } from 'zod';

export const createLifecycleStageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
}).passthrough(); // Allow additional metadata fields

export const updateLifecycleStageSchema = createLifecycleStageSchema.partial();

export type CreateLifecycleStageInput = z.infer<typeof createLifecycleStageSchema>;
export type UpdateLifecycleStageInput = z.infer<typeof updateLifecycleStageSchema>;
