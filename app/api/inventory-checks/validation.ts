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

// Inventory check item schema - match frontend structure
const inventoryCheckItemSchema = z.object({
  productSystemId: z.string(),
  productId: z.string(),
  productName: z.string().optional(),
  unit: z.string().optional(),
  systemQuantity: z.number().optional().default(0),
  actualQuantity: z.number().optional().default(0),
  difference: z.number().optional().default(0),
  reason: z.string().optional(),
  note: z.string().optional(),
})

// Create inventory check schema - match frontend structure
export const createInventoryCheckSchema = z.object({
  id: z.string().optional(), // Business ID (auto-generated if empty)
  branchSystemId: z.string(), // Required branch
  branchName: z.string().optional(),
  employeeId: z.string().optional(),
  checkDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  note: z.string().optional(),
  notes: z.string().optional(), // Alias for note
  items: z.array(inventoryCheckItemSchema).optional(),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
})

// Update inventory check schema
export const updateInventoryCheckSchema = createInventoryCheckSchema.partial()

// Delete inventory check schema
export const deleteInventoryCheckSchema = z.object({
  hard: z.boolean().optional().default(false),
})

// Cancel inventory check schema
export const cancelInventoryCheckSchema = z.object({
  reason: z.string().optional(),
  cancelledBy: z.string().optional(),
})

// Balance inventory check schema
export const balanceInventoryCheckSchema = z.object({
  balancedBy: z.string().optional(),
})

export type ListInventoryChecksInput = z.infer<typeof listInventoryChecksSchema>
export type CreateInventoryCheckInput = z.infer<typeof createInventoryCheckSchema>
export type UpdateInventoryCheckInput = z.infer<typeof updateInventoryCheckSchema>
