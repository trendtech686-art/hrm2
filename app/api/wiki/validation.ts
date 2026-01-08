import { z } from 'zod'

export const listWikiSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  published: z.enum(['true', 'false']).optional(),
})

export const createWikiSchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  content: z.string().min(1),
  categoryId: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  authorId: z.string(),
})

export const updateWikiSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
})

export type ListWikiInput = z.infer<typeof listWikiSchema>
export type CreateWikiInput = z.infer<typeof createWikiSchema>
export type UpdateWikiInput = z.infer<typeof updateWikiSchema>
