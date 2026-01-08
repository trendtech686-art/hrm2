import { z } from 'zod'

export const updateFileSchema = z.object({
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  documentType: z.string().optional(),
})

export type UpdateFileInput = z.infer<typeof updateFileSchema>
