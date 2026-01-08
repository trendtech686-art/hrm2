/**
 * API Validation Schemas for Inventory Receipts
 */
import { z } from 'zod'

// Query params for listing
export const listInventoryReceiptsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  type: z.string().optional(),
})

// Inventory receipt item schema
const inventoryReceiptItemSchema = z.object({
  systemId: z.string(),
  productId: z.string(),
  quantity: z.number().optional().default(1),
  unitCost: z.number().optional().default(0),
  totalCost: z.number().optional().default(0),
  notes: z.string().optional(),
})

// Create inventory receipt schema
export const createInventoryReceiptSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  type: z.string(),
  branchId: z.string(),
  employeeId: z.string().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  receiptDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  notes: z.string().optional(),
  items: z.array(inventoryReceiptItemSchema).optional(),
  createdBy: z.string().optional(),
})

// Update inventory receipt schema
export const updateInventoryReceiptSchema = createInventoryReceiptSchema.partial()

export type ListInventoryReceiptsInput = z.infer<typeof listInventoryReceiptsSchema>
export type CreateInventoryReceiptInput = z.infer<typeof createInventoryReceiptSchema>
export type UpdateInventoryReceiptInput = z.infer<typeof updateInventoryReceiptSchema>
