/**
 * API Validation Schemas for Inventory
 */
import { z } from 'zod'

// Query params for listing
export const listInventorySchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  productId: z.string().optional(),
  locationId: z.string().optional(),
  lowStock: z.string().optional().transform(v => v === 'true'),
})

// Create inventory schema
export const createInventorySchema = z.object({
  productId: z.string().min(1, 'Product ID là bắt buộc'),
  locationId: z.string().optional(),
  quantity: z.number().optional().default(0),
})

// Update inventory schema
export const updateInventorySchema = createInventorySchema.partial()

export type ListInventoryInput = z.infer<typeof listInventorySchema>
export type CreateInventoryInput = z.infer<typeof createInventorySchema>
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>
