/**
 * API Validation Schemas for Categories
 */
import { z } from 'zod'

// Query params for listing categories
export const listCategoriesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
  tree: z.string().optional().transform(v => v === 'true'),
})

// Create category schema
export const createCategorySchema = z.object({
  id: z.string().min(1, 'Mã danh mục là bắt buộc'),
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().optional().nullable(),
  sortOrder: z.union([z.number(), z.string().transform(v => parseInt(v) || 0)]).optional().default(0),
  // SEO fields
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  slug: z.string().optional(),
  // Multi-website SEO
  websiteSeo: z.record(z.string(), z.any()).optional(),
})

// Update category schema
export const updateCategorySchema = createCategorySchema.partial()

export type ListCategoriesInput = z.infer<typeof listCategoriesSchema>
export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
