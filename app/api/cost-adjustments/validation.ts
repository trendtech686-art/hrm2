/**
 * API Validation Schemas for Cost Adjustments
 */
import { z } from 'zod'

// Query params for listing
export const listCostAdjustmentsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
})

// Cost adjustment item schema
export const costAdjustmentItemSchema = z.object({
  systemId: z.string(),
  productId: z.string(),
  oldCost: z.number().optional(),
  newCost: z.number().optional(),
  notes: z.string().optional(),
})

// Create cost adjustment schema
export const createCostAdjustmentSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  branchId: z.string().optional(),
  employeeId: z.string().optional(),
  adjustmentDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  reason: z.string().optional(),
  items: z.array(costAdjustmentItemSchema).optional(),
  createdBy: z.string().optional(),
})

// Update cost adjustment schema
export const updateCostAdjustmentSchema = createCostAdjustmentSchema.partial()

export type ListCostAdjustmentsInput = z.infer<typeof listCostAdjustmentsSchema>
export type CreateCostAdjustmentInput = z.infer<typeof createCostAdjustmentSchema>
export type UpdateCostAdjustmentInput = z.infer<typeof updateCostAdjustmentSchema>
