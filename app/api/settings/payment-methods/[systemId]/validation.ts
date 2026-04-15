import { z } from 'zod'

export const updatePaymentMethodSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  code: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
})

export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>
