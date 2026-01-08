/**
 * API Validation Schemas for Stock Locations
 */
import { z } from 'zod'

// Query params for listing
export const listStockLocationsSchema = z.object({
  all: z.string().optional().transform(v => v === 'true'),
})

// Create stock location schema
export const createStockLocationSchema = z.object({
  id: z.string().min(1, 'Mã kho là bắt buộc'),
  name: z.string().min(1, 'Tên kho là bắt buộc'),
  code: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  branchId: z.string().optional(),
  isActive: z.boolean().optional().default(true),
})

// Update stock location schema
export const updateStockLocationSchema = createStockLocationSchema.partial()

export type ListStockLocationsInput = z.infer<typeof listStockLocationsSchema>
export type CreateStockLocationInput = z.infer<typeof createStockLocationSchema>
export type UpdateStockLocationInput = z.infer<typeof updateStockLocationSchema>
