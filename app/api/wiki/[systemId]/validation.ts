import { z } from 'zod'

export const updateWikiSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
})

export type UpdateWikiInput = z.infer<typeof updateWikiSchema>
