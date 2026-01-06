/**
 * Zod validation schemas for categories module
 */
import { z } from 'zod';

// Category base schema
export const categoryBaseSchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống').max(100, 'Tên tối đa 100 ký tự'),
  parentId: z.string().optional().nullable(),
  description: z.string().max(1000, 'Mô tả tối đa 1000 ký tự').optional().nullable(),
  image: z.string().url('URL hình ảnh không hợp lệ').optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  // SEO fields
  metaTitle: z.string().max(70, 'Meta title tối đa 70 ký tự').optional().nullable(),
  metaDescription: z.string().max(160, 'Meta description tối đa 160 ký tự').optional().nullable(),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug chỉ chứa chữ thường, số và dấu gạch ngang').optional().nullable(),
});

// Create category schema
export const createCategorySchema = categoryBaseSchema;

// Update category schema  
export const updateCategorySchema = categoryBaseSchema.partial();

// Category filters schema
export const categoryFiltersSchema = z.object({
  search: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  includeChildren: z.boolean().default(false),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

// PKGX sync schema
export const pkgxCategorySyncSchema = z.object({
  categoryId: z.string(),
  pkgxCategoryId: z.string().optional().nullable(),
  action: z.enum(['link', 'unlink', 'sync']),
});

// Bulk update schema
export const categoryBulkUpdateSchema = z.object({
  ids: z.array(z.string()).min(1, 'Chọn ít nhất 1 danh mục'),
  data: updateCategorySchema,
});

// Export types
export type CategoryBase = z.infer<typeof categoryBaseSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryFilters = z.infer<typeof categoryFiltersSchema>;
export type PkgxCategorySync = z.infer<typeof pkgxCategorySyncSchema>;
export type CategoryBulkUpdate = z.infer<typeof categoryBulkUpdateSchema>;
