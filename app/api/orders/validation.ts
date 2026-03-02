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

// Base order schema - accepts both API field names (customerId/branchId) and form field names (customerSystemId/branchSystemId)
const baseOrderSchema = z.object({
  id: z.string().optional(),
  // Support both field names for customer
  customerId: z.string().optional(),
  customerSystemId: z.string().optional(),
  customerName: z.string().optional(),
  // Support both field names for branch
  branchId: z.string().optional(),
  branchSystemId: z.string().optional(),
  branchName: z.string().optional(),
  // Support both field names for salesperson
  salespersonId: z.string().optional(),
  salespersonSystemId: z.string().optional(),
  salespersonName: z.string().optional(),
  salesperson: z.string().optional(), // Alternative field for salesperson name
  lineItems: z.array(lineItemSchema).min(1, 'At least one line item is required'),
  orderDate: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  expectedPaymentMethod: z.string().optional(),
  // ✅ Accept shippingAddress as string OR object (address snapshot)
  shippingAddress: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  billingAddress: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  status: z.string().optional().default('PENDING'),
  paymentStatus: z.string().optional().default('UNPAID'),
  deliveryStatus: z.string().optional(),
  stockOutStatus: z.string().optional(),
  returnStatus: z.string().optional(),
  printStatus: z.string().optional(),
  deliveryMethod: z.string().optional().default('SHIPPING'),
  shippingFee: z.number().optional().default(0),
  tax: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  subtotal: z.number().optional(),
  grandTotal: z.number().optional(),
  paidAmount: z.number().optional(),
  codAmount: z.number().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  packagings: z.array(z.unknown()).optional(),
  payments: z.array(z.unknown()).optional(),
  assignedPackerSystemId: z.string().optional(),
  assignedPackerName: z.string().optional(),
  completedDate: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  createdBy: z.string().optional(),
})

// Create order schema with validation refinements
export const createOrderSchema = baseOrderSchema.refine(
  (data) => data.customerId || data.customerSystemId,
  { message: 'Customer is required', path: ['customerId'] }
).refine(
  (data) => data.branchId || data.branchSystemId,
  { message: 'Branch is required', path: ['branchId'] }
)

// Update order schema - use base schema (without refine) for partial updates
export const updateOrderSchema = baseOrderSchema.partial()

export type ListOrdersInput = z.infer<typeof listOrdersSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>
