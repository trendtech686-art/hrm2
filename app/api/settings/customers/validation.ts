import { z } from 'zod'

const VALID_TYPES = [
  'customer-group',
  'customer-type', 
  'customer-source',
  'payment-term',
  'credit-rating',
  'lifecycle-stage',
  'sla-setting',
] as const

export const createCustomerSettingSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(VALID_TYPES),
  description: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
  orderIndex: z.number().optional(),
  createdBy: z.string().optional(),
}).passthrough()

export type CreateCustomerSettingInput = z.infer<typeof createCustomerSettingSchema>
