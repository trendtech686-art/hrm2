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
  systemId: z.string(),
  productId: z.string(),
  quantity: z.number().optional().default(1),
  notes: z.string().optional(),
})

// Create stock transfer schema
export const createStockTransferSchema = z.object({
  systemId: z.string(),
  id: z.string(),
  fromBranchId: z.string().min(1, 'Chi nhánh nguồn là bắt buộc'),
  toBranchId: z.string().min(1, 'Chi nhánh đích là bắt buộc'),
  employeeId: z.string().optional(),
  transferDate: z.string().optional(),
  receivedDate: z.string().optional(),
  status: z.string().optional().default('DRAFT'),
  notes: z.string().optional(),
  items: z.array(stockTransferItemSchema).optional(),
  createdBy: z.string().optional(),
})

// Update stock transfer schema
export const updateStockTransferSchema = createStockTransferSchema.partial()

export type ListStockTransfersInput = z.infer<typeof listStockTransfersSchema>
export type CreateStockTransferInput = z.infer<typeof createStockTransferSchema>
export type UpdateStockTransferInput = z.infer<typeof updateStockTransferSchema>
