import { z } from 'zod'

export const confirmFilesSchema = z.object({
  fileIds: z.array(z.string()).optional(),
  sessionId: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  documentType: z.string().optional(),
  documentName: z.string().optional(),
})

export type ConfirmFilesInput = z.infer<typeof confirmFilesSchema>
