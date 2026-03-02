/**
 * API Validation Schemas for Brands
 */
import { z } from 'zod'

// Query params for listing brands
export const listBrandsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '50')),
  search: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create brand schema
export const createBrandSchema = z.object({
  id: z.string().min(1, 'Mã thương hiệu là bắt buộc'),
  name: z.string().min(1, 'Tên thương hiệu là bắt buộc'),
  description: z.string().optional(),
  logo: z.string().optional(),
  logoUrl: z.string().optional(),
  website: z.string().optional(),
  // SEO fields
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  // Multi-website SEO
  websiteSeo: z.any().optional(),
})

// Update brand schema
export const updateBrandSchema = createBrandSchema.partial()

export type ListBrandsInput = z.infer<typeof listBrandsSchema>
export type CreateBrandInput = z.infer<typeof createBrandSchema>
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>
