/**
 * API Validation Schemas for Complaints
 */
import { z } from 'zod'

// Query params for listing complaints
export const listComplaintsSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  customerId: z.string().optional(),
})

// Image type definition
const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  uploadedBy: z.string().optional(),
  uploadedAt: z.union([z.string(), z.date()]).optional(),
  type: z.string().optional(),
})

// Affected product type definition
const affectedProductSchema = z.object({
  productSystemId: z.string(),
  productId: z.string().optional(),
  productName: z.string().optional(),
  unitPrice: z.number().optional(),
  quantityOrdered: z.number().optional(),
  quantityReceived: z.number().optional(),
  quantityMissing: z.number().optional(),
  quantityDefective: z.number().optional(),
  quantityExcess: z.number().optional(),
  issueType: z.enum(['excess', 'missing', 'defective', 'other']).optional(),
  note: z.string().optional(),
  resolutionType: z.enum(['refund', 'replacement', 'ignore']).optional(),
  lineItemIndex: z.number().optional(),
})

// Employee image type definition
const employeeImageSchema = z.object({
  id: z.string().optional(),
  url: z.string(),
  uploadedBy: z.string().optional(),
  uploadedAt: z.union([z.string(), z.date()]).optional(),
})

// Create complaint schema
export const createComplaintSchema = z.object({
  id: z.string().optional(),
  // ⭐ NEW: Order & Customer fields (required for new flow)
  orderId: z.string().optional(),
  orderSystemId: z.string().optional(),
  orderCode: z.string().optional(),
  orderValue: z.number().optional(),
  branchSystemId: z.string().optional(),
  branchName: z.string().optional(),
  customerId: z.string().optional(),
  customerSystemId: z.string().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  // Legacy fields
  title: z.string().optional(), // Optional now - form doesn't require title
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL']).optional().default('MEDIUM'),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED']).optional().default('OPEN'),
  assigneeId: z.string().optional(),
  assignedTo: z.string().optional(),
  // ⭐ NEW: Image fields
  images: z.array(imageSchema).optional(),
  employeeImages: z.array(employeeImageSchema).optional(),
  // ⭐ NEW: Affected products
  affectedProducts: z.array(affectedProductSchema).optional(),
  // ⭐ NEW: Verification fields
  verification: z.string().optional(),
  isVerifiedCorrect: z.boolean().optional(),
  timeline: z.array(z.unknown()).optional(),
  // ⭐ NEW: Assignment
  createdBy: z.string().optional(),
  assignedAt: z.union([z.string(), z.date()]).optional(),
})

// Update complaint schema
export const updateComplaintSchema = createComplaintSchema.partial()

export type ListComplaintsInput = z.infer<typeof listComplaintsSchema>
export type CreateComplaintInput = z.infer<typeof createComplaintSchema>
export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>
