import { z } from 'zod'

const VALID_TYPES = [
  'unit',
  'tax',
  'shipping-partner',
  'sales-channel',
  'receipt-type',
  'pricing-policy',
  'penalty',
  'penalty-type',
  'payment-type',
  'target-group',
  'task-template',
  'recurring-task',
  'custom-field',
] as const

export const createSettingsDataSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.enum(VALID_TYPES),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  createdBy: z.string().optional(),
}).passthrough()

export type CreateSettingsDataInput = z.infer<typeof createSettingsDataSchema>
