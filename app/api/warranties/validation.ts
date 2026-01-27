/**
 * API Validation Schemas for Warranties
 */
import { z } from 'zod'

// Query params for listing warranties
export const listWarrantiesSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  customerId: z.string().optional(),
  productId: z.string().optional(),
  branchId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

// Create warranty schema
export const createWarrantySchema = z.object({
  id: z.string().optional(),
  productId: z.string().optional(),
  orderId: z.string().optional(),
  customerId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().optional(),
  customerAddress: z.string().optional(),
  productName: z.string().optional(),
  serialNumber: z.string().optional(),
  title: z.string().optional().default('Phiếu bảo hành'),
  description: z.string().optional(),
  issueDescription: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional().default('RECEIVED'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  purchaseDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  solution: z.string().optional(),
  estimatedCost: z.number().optional(),
  branchSystemId: z.string().optional(),
  branchName: z.string().optional(),
  employeeSystemId: z.string().optional(),
  employeeName: z.string().optional(),
  isUnderWarranty: z.boolean().optional(),
  isReplacement: z.boolean().optional(),
  replacementProductId: z.string().optional(),
  replacementQuantity: z.number().optional(),
})

// Update warranty schema
export const updateWarrantySchema = createWarrantySchema.partial()

export type ListWarrantiesInput = z.infer<typeof listWarrantiesSchema>
export type CreateWarrantyInput = z.infer<typeof createWarrantySchema>
export type UpdateWarrantyInput = z.infer<typeof updateWarrantySchema>
