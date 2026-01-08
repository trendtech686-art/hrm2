import { z } from 'zod'

export const updatePaymentMethodSchema = z.object({
  name: z.string().optional(),
  code: z.string().optional(),
  type: z.string().optional(),
  isActive: z.boolean().optional(),
})

export type UpdatePaymentMethodInput = z.infer<typeof updatePaymentMethodSchema>
