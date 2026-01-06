/**
 * Zod validation schemas for stock-locations module
 */
import { z } from 'zod';

// Location type
export const locationTypeSchema = z.enum([
  'WAREHOUSE',    // Kho hàng
  'STORE',        // Cửa hàng
  'TRANSIT',      // Đang vận chuyển
  'DAMAGED',      // Hàng hỏng
  'RETURNED',     // Hàng trả
]);

// Stock location base schema
export const stockLocationBaseSchema = z.object({
  code: z.string().min(1, 'Mã vị trí không được để trống').max(20, 'Mã tối đa 20 ký tự'),
  name: z.string().min(1, 'Tên vị trí không được để trống').max(100, 'Tên tối đa 100 ký tự'),
  type: locationTypeSchema.default('WAREHOUSE'),
  address: z.string().max(500, 'Địa chỉ tối đa 500 ký tự').optional().nullable(),
  description: z.string().max(500, 'Mô tả tối đa 500 ký tự').optional().nullable(),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  sortOrder: z.number().int().min(0).default(0),
});

// Create location schema
export const createStockLocationSchema = stockLocationBaseSchema;

// Update location schema
export const updateStockLocationSchema = stockLocationBaseSchema.partial().extend({
  code: z.string().min(1).max(20).optional(), // Code cannot be changed after creation
});

// Location filters schema
export const stockLocationFiltersSchema = z.object({
  search: z.string().optional(),
  type: locationTypeSchema.optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

// Stock by location query
export const stockByLocationQuerySchema = z.object({
  locationId: z.string(),
  productId: z.string().optional(),
  lowStock: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
});

// Export types
export type LocationType = z.infer<typeof locationTypeSchema>;
export type StockLocationBase = z.infer<typeof stockLocationBaseSchema>;
export type CreateStockLocationInput = z.infer<typeof createStockLocationSchema>;
export type UpdateStockLocationInput = z.infer<typeof updateStockLocationSchema>;
export type StockLocationFilters = z.infer<typeof stockLocationFiltersSchema>;
export type StockByLocationQuery = z.infer<typeof stockByLocationQuerySchema>;
