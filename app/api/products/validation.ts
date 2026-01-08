/**
 * API Validation Schemas for Products
 */
import { z } from 'zod'

// Query params for listing products
export const listProductsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  brandId: z.string().optional(),
  categoryId: z.string().optional(),
})

// Create product schema
export const createProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
  sku: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  thumbnailImage: z.string().optional(),
  imageUrl: z.string().optional(),
  galleryImages: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  brandId: z.string().optional(),
  unit: z.string().optional().default('Cái'),
  costPrice: z.number().optional().default(0),
  sellingPrice: z.number().optional().default(0),
  minPrice: z.number().optional().default(0),
  taxRate: z.number().optional().default(0),
  reorderLevel: z.number().optional().default(0),
  maxStock: z.number().optional(),
  weight: z.number().optional(),
  barcode: z.string().optional(),
  warrantyPeriodMonths: z.number().optional().default(12),
  primarySupplierId: z.string().optional(),
  isFeatured: z.boolean().optional().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  slug: z.string().optional(),
  status: z.string().optional().default('ACTIVE'),
  createdBy: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
})

// Update product schema
export const updateProductSchema = createProductSchema.partial()

export type ListProductsInput = z.infer<typeof listProductsSchema>
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
