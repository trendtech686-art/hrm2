/**
 * API Validation Schemas for Purchase Orders
 */
import { z } from 'zod'

// Query params for listing
export const listPurchaseOrdersSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  supplierId: z.string().optional(),
})

// Purchase order item schema
const purchaseOrderItemSchema = z.object({
  productId: z.string().min(1, 'Product ID là bắt buộc'),
  quantity: z.number().min(1, 'Số lượng phải >= 1'),
  unitPrice: z.number().min(0, 'Đơn giá phải >= 0'),
  discount: z.number().optional().default(0),
  total: z.number().optional(),
})

// Create purchase order schema
export const createPurchaseOrderSchema = z.object({
  id: z.string().optional(),
  supplierId: z.string().min(1, 'Nhà cung cấp là bắt buộc'),
  orderDate: z.string().optional(),
  expectedDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  subtotal: z.number().optional().default(0),
  tax: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  total: z.number().optional().default(0),
  notes: z.string().optional(),
  items: z.array(purchaseOrderItemSchema).optional(),
})

// Update purchase order schema
export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial()

export type ListPurchaseOrdersInput = z.infer<typeof listPurchaseOrdersSchema>
export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>
