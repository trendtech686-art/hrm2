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
  systemId: z.string().optional(),
  productId: z.string().optional(),
  productSystemId: z.string().optional(), // ✅ Added for consistency with exchange items
  quantity: z.number().optional().default(1),
  unitPrice: z.number().optional().default(0),
  returnValue: z.number().optional().default(0),
  reason: z.string().optional(),
})

// Exchange item schema
const exchangeItemSchema = z.object({
  productSystemId: z.string(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.number().min(1).default(1),
  unitPrice: z.number().min(0).default(0),
  discount: z.number().optional().default(0),
  discountType: z.string().optional().default('fixed'),
  note: z.string().optional(),
})

// Payment/Refund method schema
const paymentMethodSchema = z.object({
  method: z.string(),
  amount: z.number().min(0),
  accountSystemId: z.string().optional(),
  note: z.string().optional(),
})

// Create sales return schema
export const createSalesReturnSchema = z.object({
  orderId: z.string(),
  reason: z.string().optional(),
  items: z.array(salesReturnItemSchema).optional(),
  createdBy: z.string().optional(),
  // Exchange items support
  exchangeItems: z.array(exchangeItemSchema).optional(),
  branchId: z.string().optional(),
  isReceived: z.boolean().optional().default(false),
  // Delivery method for exchange items: 'pickup' (nhận tại CH), 'deliver-later', 'deliver-now'
  deliveryMethod: z.string().optional(),
  // ✅ Tracking code from external shipping partner (e.g., GHTK)
  exchangeTrackingCode: z.string().optional(),
  // ✅ Shipping info for exchange order
  shippingPartnerId: z.string().optional(),
  shippingServiceId: z.string().optional(),
  shippingAddress: z.any().optional(), // JSON address object
  packageInfo: z.object({
    weight: z.number().optional(),
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    codAmount: z.number().optional(),
    trackingCode: z.string().optional(),
    shippingFeeToPartner: z.number().optional(), // ✅ GHTK fee
    payer: z.string().optional(), // ✅ Người gửi / Người nhận
  }).optional(),
  configuration: z.any().optional(), // Shipping configuration
  // Financial amounts
  totalReturnValue: z.number().optional(),
  subtotalNew: z.number().optional(),
  shippingFeeNew: z.number().optional(),
  grandTotalNew: z.number().optional(),
  finalAmount: z.number().optional(),
  // Payment/Refund methods
  payments: z.array(paymentMethodSchema).optional(), // When customer needs to pay more (finalAmount > 0)
  refunds: z.array(paymentMethodSchema).optional(),  // When we need to refund customer (finalAmount < 0)
})

// Update sales return schema
export const updateSalesReturnSchema = createSalesReturnSchema.partial()

export type ListSalesReturnsInput = z.infer<typeof listSalesReturnsSchema>
export type CreateSalesReturnInput = z.infer<typeof createSalesReturnSchema>
export type UpdateSalesReturnInput = z.infer<typeof updateSalesReturnSchema>
