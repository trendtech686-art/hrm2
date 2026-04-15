/**
 * API Validation Schemas for Purchase Returns
 */
import { z } from 'zod';

// Query params for listing
export const listPurchaseReturnsSchema = z.object({
  page: z.string().optional().transform((v) => parseInt(v || '1')),
  limit: z.string().optional().transform((v) => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  supplierId: z.string().optional(),
  purchaseOrderId: z.string().optional(),
  branchId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Purchase return item schema with comprehensive validation
const purchaseReturnItemSchema = z.object({
  productSystemId: z.string().min(1, 'Product system ID is required'),
  productId: z.string().optional(),
  productName: z.string().optional(),
  orderedQuantity: z.number().optional(),
  returnQuantity: z.number().min(1, 'Return quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  note: z.string().optional(),
});

// Create purchase return schema with business validation
export const createPurchaseReturnSchema = z.object({
  purchaseOrderSystemId: z.string().min(1, 'Purchase order system ID is required'),
  reason: z.string().optional(),
  items: z.array(purchaseReturnItemSchema).min(1, 'At least one item is required'),
  refundAmount: z.number().min(0).optional().default(0),
  refundMethod: z.string().optional(),
  accountSystemId: z.string().optional(),
  branchSystemId: z.string().optional(),
  creatorName: z.string().optional(), // Creator name from frontend
  createdBy: z.string().optional(), // Creator systemId from frontend
});

// Update purchase return schema (for PATCH operations)
export const updatePurchaseReturnSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED']).optional(),
  reason: z.string().optional(),
  approvalNotes: z.string().optional(),
  refundAmount: z.number().min(0).optional(),
  updatedBy: z.string().optional(),
});

export type ListPurchaseReturnsInput = z.infer<typeof listPurchaseReturnsSchema>;
export type CreatePurchaseReturnInput = z.infer<typeof createPurchaseReturnSchema>;
export type UpdatePurchaseReturnInput = z.infer<typeof updatePurchaseReturnSchema>;
export type PurchaseReturnItemInput = z.infer<typeof purchaseReturnItemSchema>;

