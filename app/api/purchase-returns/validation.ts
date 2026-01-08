/**
 * API Validation Schemas for Purchase Returns
 */
import { z } from 'zod'

// Query params for listing
export const listPurchaseReturnsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
})

// Purchase return item schema
const purchaseReturnItemSchema = z.object({
  systemId: z.string(),
  productId: z.string(),
  quantity: z.number().optional().default(1),
  unitPrice: z.number().optional().default(0),
  returnValue: z.number().optional().default(0),
  reason: z.string().optional(),
})

// Create purchase return schema
export const createPurchaseReturnSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  supplierId: z.string(),
  purchaseOrderId: z.string().optional(),
  branchId: z.string().optional(),
  employeeId: z.string().optional(),
  returnDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  reason: z.string().optional(),
  subtotal: z.number().optional().default(0),
  total: z.number().optional().default(0),
  items: z.array(purchaseReturnItemSchema).optional(),
  createdBy: z.string().optional(),
})

// Update purchase return schema
export const updatePurchaseReturnSchema = createPurchaseReturnSchema.partial()

export type ListPurchaseReturnsInput = z.infer<typeof listPurchaseReturnsSchema>
export type CreatePurchaseReturnInput = z.infer<typeof createPurchaseReturnSchema>
export type UpdatePurchaseReturnInput = z.infer<typeof updatePurchaseReturnSchema>
