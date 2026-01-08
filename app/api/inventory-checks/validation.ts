/**
 * API Validation Schemas for Inventory Checks
 */
import { z } from 'zod'

// Query params for listing
export const listInventoryChecksSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  includeDeleted: z.string().optional().transform(v => v === 'true'),
})

// Inventory check item schema
const inventoryCheckItemSchema = z.object({
  systemId: z.string(),
  productId: z.string(),
  expectedQuantity: z.number().optional().default(0),
  actualQuantity: z.number().optional().default(0),
  difference: z.number().optional().default(0),
  notes: z.string().optional(),
})

// Create inventory check schema
export const createInventoryCheckSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  branchId: z.string(),
  employeeId: z.string().optional(),
  checkDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  notes: z.string().optional(),
  items: z.array(inventoryCheckItemSchema).optional(),
  createdBy: z.string().optional(),
})

// Update inventory check schema
export const updateInventoryCheckSchema = createInventoryCheckSchema.partial()

export type ListInventoryChecksInput = z.infer<typeof listInventoryChecksSchema>
export type CreateInventoryCheckInput = z.infer<typeof createInventoryCheckSchema>
export type UpdateInventoryCheckInput = z.infer<typeof updateInventoryCheckSchema>
