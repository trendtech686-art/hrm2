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
  supplierSystemId: z.string().optional(),
  supplierName: z.string().optional(),
  // Branch info
  branchSystemId: z.string().optional().nullable(),
  branchName: z.string().optional(),
  // Buyer/creator info
  buyerSystemId: z.string().optional().nullable(),
  buyer: z.string().optional(),
  creatorSystemId: z.string().optional().nullable(),
  creatorName: z.string().optional(),
  // Dates
  orderDate: z.string().optional(),
  expectedDate: z.string().optional(),
  deliveryDate: z.string().optional(),
  // Status
  status: z.string().optional().default('DRAFT'),
  deliveryStatus: z.string().optional(),
  paymentStatus: z.string().optional(),
  // Financial
  subtotal: z.number().optional().default(0),
  tax: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  discountType: z.string().optional(),
  shippingFee: z.number().optional().default(0),
  total: z.number().optional().default(0),
  grandTotal: z.number().optional().default(0),
  // Other
  notes: z.string().optional(),
  reference: z.string().optional().nullable(),
  items: z.array(purchaseOrderItemSchema).optional(),
  lineItems: z.array(z.any()).optional(), // Optional for frontend compatibility
})

// Update purchase order schema
export const updatePurchaseOrderSchema = createPurchaseOrderSchema.partial()

export type ListPurchaseOrdersInput = z.infer<typeof listPurchaseOrdersSchema>
export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>
export type UpdatePurchaseOrderInput = z.infer<typeof updatePurchaseOrderSchema>
