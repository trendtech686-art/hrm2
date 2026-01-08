import { z } from 'zod'

export const cleanupStagingSchema = z.object({
  thresholdHours: z.number().min(1).optional(),
})

export type CleanupStagingInput = z.infer<typeof cleanupStagingSchema>
