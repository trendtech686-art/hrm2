import { z } from 'zod'

export const updateReceiptSchema = z.object({
  amount: z.number().optional(),
  method: z.string().optional(),
  paymentMethod: z.string().optional(),
  description: z.string().optional().nullable(),
})

export type UpdateReceiptInput = z.infer<typeof updateReceiptSchema>
