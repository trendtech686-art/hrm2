import { z } from 'zod';

export const createCreditRatingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
}).passthrough(); // Allow additional metadata fields

export const updateCreditRatingSchema = createCreditRatingSchema.partial();

export type CreateCreditRatingInput = z.infer<typeof createCreditRatingSchema>;
export type UpdateCreditRatingInput = z.infer<typeof updateCreditRatingSchema>;
