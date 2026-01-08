import { z } from 'zod'

export const calculateFeeSchema = z.object({
  apiToken: z.string().min(1),
  partnerCode: z.string().optional(),
  pick_province: z.string().optional(),
  pick_district: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  address: z.string().optional(),
  weight: z.number().optional(),
  value: z.number().optional(),
  deliver_option: z.string().optional(),
  transport: z.string().optional(),
  tags: z.array(z.number()).optional(),
  subTags: z.array(z.number()).optional(),
}).passthrough()

export type CalculateFeeInput = z.infer<typeof calculateFeeSchema>
