/**
 * API Validation Schemas for Sales Returns
 */
import { z } from 'zod'

// Query params for listing
export const listSalesReturnsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  includeDeleted: z.string().optional().transform(v => v === 'true'),
})

// Sales return item schema
const salesReturnItemSchema = z.object({
  systemId: z.string(),
  productId: z.string().optional(),
  quantity: z.number().optional().default(1),
  unitPrice: z.number().optional().default(0),
  returnValue: z.number().optional().default(0),
  reason: z.string().optional(),
})

// Create sales return schema
export const createSalesReturnSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  orderId: z.string(),
  customerId: z.string().optional(),
  employeeId: z.string().optional(),
  branchId: z.string().optional(),
  returnDate: z.string().optional(),
  status: z.string().optional().default('PENDING'),
  reason: z.string().optional(),
  subtotal: z.number().optional().default(0),
  total: z.number().optional().default(0),
  refunded: z.number().optional().default(0),
  items: z.array(salesReturnItemSchema).optional(),
  createdBy: z.string().optional(),
})

// Update sales return schema
export const updateSalesReturnSchema = createSalesReturnSchema.partial()

export type ListSalesReturnsInput = z.infer<typeof listSalesReturnsSchema>
export type CreateSalesReturnInput = z.infer<typeof createSalesReturnSchema>
export type UpdateSalesReturnInput = z.infer<typeof updateSalesReturnSchema>
