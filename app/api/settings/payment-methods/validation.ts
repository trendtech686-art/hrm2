import { z } from 'zod'

export const createPaymentMethodSchema = z.object({
  systemId: z.string().optional(),
  id: z.string().optional(),
  name: z.string().min(1),
  code: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
})

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>
