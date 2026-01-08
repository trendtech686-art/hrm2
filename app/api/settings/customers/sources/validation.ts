import { z } from 'zod';

export const createCustomerSourceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
}).passthrough(); // Allow additional metadata fields

export const updateCustomerSourceSchema = createCustomerSourceSchema.partial();

export type CreateCustomerSourceInput = z.infer<typeof createCustomerSourceSchema>;
export type UpdateCustomerSourceInput = z.infer<typeof updateCustomerSourceSchema>;
