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
  systemId: z.string().optional(), // Auto-generated if not provided
  productId: z.string().optional(),
  productSystemId: z.string().optional(),
  productName: z.string().optional(),
  orderedQuantity: z.number().optional(),
  receivedQuantity: z.number().optional(), // Không default, để API xử lý
  quantity: z.number().optional(), // Không default, để API xử lý
  unitCost: z.number().optional().default(0),
  unitPrice: z.number().optional().default(0),
  totalCost: z.number().optional().default(0),
  notes: z.string().optional(),
})

// Create inventory receipt schema
export const createInventoryReceiptSchema = z.object({
  systemId: z.string().optional(), // Auto-generated if not provided
  id: z.string().optional(),
  type: z.string().optional().default('GOODS_RECEIPT'),
  // Support both branchId and branchSystemId
  branchId: z.string().optional(),
  branchSystemId: z.string().optional(),
  branchName: z.string().optional(),
  employeeId: z.string().optional(),
  // Purchase order reference
  purchaseOrderSystemId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  supplierSystemId: z.string().optional(),
  supplierName: z.string().optional(),
  // Receipt info
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  receiptDate: z.string().optional(),
  receivedDate: z.string().optional(),
  receiverSystemId: z.string().optional(),
  receiverName: z.string().optional(),
  warehouseName: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  notes: z.string().optional(),
  items: z.array(inventoryReceiptItemSchema).optional(),
  createdBy: z.string().optional(),
  
  // ✅ Chi phí phân bổ vào giá vốn
  shippingFee: z.number().optional().default(0), // Phí vận chuyển
  otherFees: z.number().optional().default(0), // Chi phí khác
  // Phương pháp tính giá vốn: 'last_purchase' | 'weighted_average' | 'with_fees'
  costCalculationMethod: z.enum(['last_purchase', 'weighted_average', 'with_fees']).optional().default('with_fees'),
})

// Update inventory receipt schema
export const updateInventoryReceiptSchema = createInventoryReceiptSchema.partial()

export type ListInventoryReceiptsInput = z.infer<typeof listInventoryReceiptsSchema>
export type CreateInventoryReceiptInput = z.infer<typeof createInventoryReceiptSchema>
export type UpdateInventoryReceiptInput = z.infer<typeof updateInventoryReceiptSchema>
