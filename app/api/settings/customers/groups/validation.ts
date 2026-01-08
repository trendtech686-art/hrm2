import { z } from 'zod';

export const createCustomerGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
}).passthrough(); // Allow additional metadata fields

export const updateCustomerGroupSchema = createCustomerGroupSchema.partial();

export type CreateCustomerGroupInput = z.infer<typeof createCustomerGroupSchema>;
export type UpdateCustomerGroupInput = z.infer<typeof updateCustomerGroupSchema>;
