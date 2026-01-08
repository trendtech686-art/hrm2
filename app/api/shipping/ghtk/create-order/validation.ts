import { z } from 'zod'

export const createOrderSchema = z.object({
  apiToken: z.string().min(1),
  partnerCode: z.string().optional(),
}).passthrough()

export type CreateOrderInput = z.infer<typeof createOrderSchema>
