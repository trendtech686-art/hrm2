/**
 * Zod validation schemas for brands module
 */
import { z } from 'zod';

// Brand base schema
export const brandBaseSchema = z.object({
  name: z.string().min(1, 'Tên thương hiệu không được để trống').max(100, 'Tên tối đa 100 ký tự'),
  description: z.string().max(500, 'Mô tả tối đa 500 ký tự').optional().nullable(),
  logo: z.string().url('URL logo không hợp lệ').optional().nullable(),
  website: z.string().url('URL website không hợp lệ').optional().nullable(),
  isActive: z.boolean().default(true),
});

// Create brand schema
export const createBrandSchema = brandBaseSchema;

// Update brand schema
export const updateBrandSchema = brandBaseSchema.partial();

// Brand filters schema
export const brandFiltersSchema = z.object({
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// PKGX sync schema
export const pkgxBrandSyncSchema = z.object({
  brandId: z.string(),
  pkgxBrandId: z.string().optional().nullable(),
  action: z.enum(['link', 'unlink', 'sync']),
});

// Export types
export type BrandBase = z.infer<typeof brandBaseSchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
export type BrandFilters = z.infer<typeof brandFiltersSchema>;
export type PkgxBrandSync = z.infer<typeof pkgxBrandSyncSchema>;
