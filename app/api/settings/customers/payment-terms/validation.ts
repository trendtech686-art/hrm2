import { z } from 'zod';

export const createPaymentTermSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
}).passthrough(); // Allow additional metadata fields

export const updatePaymentTermSchema = createPaymentTermSchema.partial();

export type CreatePaymentTermInput = z.infer<typeof createPaymentTermSchema>;
export type UpdatePaymentTermInput = z.infer<typeof updatePaymentTermSchema>;
