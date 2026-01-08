/**
 * API Validation Schemas for Orders
 */
import { z } from 'zod'

// Query params for listing orders
export const listOrdersSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  customerId: z.string().optional(),
  branchId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// Line item schema
const lineItemSchema = z.object({
  productSystemId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be >= 0'),
  discount: z.number().optional().default(0),
  discountType: z.string().optional(),
  tax: z.number().optional(),
  note: z.string().optional(),
})

// Create order schema
export const createOrderSchema = z.object({
  id: z.string().optional(),
  customerId: z.string().min(1, 'Customer is required'),
  branchId: z.string().min(1, 'Branch is required'),
  salespersonId: z.string().optional(),
  salespersonName: z.string().optional(),
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  orderDate: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  shippingAddress: z.string().optional(),
  status: z.string().optional().default('PENDING'),
  paymentStatus: z.string().optional().default('UNPAID'),
  deliveryMethod: z.string().optional().default('SHIPPING'),
  shippingFee: z.number().optional().default(0),
  tax: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  notes: z.string().optional(),
  source: z.string().optional(),
  createdBy: z.string().optional(),
})

// Update order schema
export const updateOrderSchema = createOrderSchema.partial()

export type ListOrdersInput = z.infer<typeof listOrdersSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
