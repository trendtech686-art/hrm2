import { z } from 'zod'

export const cancelOrderSchema = z.object({
  trackingCode: z.string().min(1),
  apiToken: z.string().min(1),
  partnerCode: z.string().optional(),
})

export type CancelOrderInput = z.infer<typeof cancelOrderSchema>
