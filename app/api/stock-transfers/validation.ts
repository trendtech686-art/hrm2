/**
 * API Validation Schemas for Stock Transfers
 */
import { z } from 'zod'

// Query params for listing
export const listStockTransfersSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  includeDeleted: z.string().optional().transform(v => v === 'true'),
})

// Stock transfer item schema
const stockTransferItemSchema = z.object({
  productSystemId: z.string(),
  productId: z.string(),
  productName: z.string().optional(),
  quantity: z.number().optional().default(1),
  note: z.string().optional(),
})

// Create stock transfer schema
export const createStockTransferSchema = z.object({
  // IDs - optional, will be auto-generated if not provided
  systemId: z.string().optional(),
  id: z.string().optional(),
  
  // Branch info - support both old format (fromBranchId) and new format (fromBranchSystemId)
  fromBranchId: z.string().optional(),
  toBranchId: z.string().optional(),
  fromBranchSystemId: z.string().optional(),
  toBranchSystemId: z.string().optional(),
  fromBranchName: z.string().optional(),
  toBranchName: z.string().optional(),
  
  // Refs
  referenceCode: z.string().optional(),
  
  employeeId: z.string().optional(),
  transferDate: z.string().optional(),
  receivedDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  notes: z.string().optional(),
  note: z.string().optional(),
  items: z.array(stockTransferItemSchema).optional(),
  
  // Creator info
  createdBy: z.string().optional(),
  createdDate: z.string().optional(),
  createdBySystemId: z.string().optional(),
  createdByName: z.string().optional(),
  updatedBy: z.string().optional(),
}).refine(data => {
  // Ensure we have branch info in either format
  const hasFromBranch = data.fromBranchId || data.fromBranchSystemId;
  const hasToBranch = data.toBranchId || data.toBranchSystemId;
  return hasFromBranch && hasToBranch;
}, {
  message: 'Chi nhánh nguồn và chi nhánh đích là bắt buộc',
})

// Update stock transfer schema
export const updateStockTransferSchema = createStockTransferSchema.partial()

export type ListStockTransfersInput = z.infer<typeof listStockTransfersSchema>
export type CreateStockTransferInput = z.infer<typeof createStockTransferSchema>
export type UpdateStockTransferInput = z.infer<typeof updateStockTransferSchema>

// Complete transfer schema
export const completeStockTransferSchema = z.object({
  receivedItems: z.array(z.object({
    productSystemId: z.string(),
    receivedQuantity: z.number().min(0),
  })).optional(),
})

// Cancel transfer schema
export const cancelStockTransferSchema = z.object({
  reason: z.string().optional(),
})

export type CompleteStockTransferInput = z.infer<typeof completeStockTransferSchema>
export type CancelStockTransferInput = z.infer<typeof cancelStockTransferSchema>
