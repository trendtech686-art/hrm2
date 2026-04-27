import { z } from 'zod'

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
  productName: z.string(),
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

export const updateComplaintSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT', 'CRITICAL']).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED']).optional(),
  assigneeId: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
  resolution: z.string().optional().nullable(),
  resolvedAt: z.string().optional().nullable(),
  // ⭐ NEW: Order & Customer fields
  orderSystemId: z.string().optional().nullable(),
  orderCode: z.string().optional().nullable(),
  orderValue: z.number().optional().nullable(),
  branchSystemId: z.string().optional().nullable(),
  branchName: z.string().optional().nullable(),
  customerSystemId: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  // ⭐ NEW: Image fields
  images: z.array(imageSchema).optional(),
  employeeImages: z.array(employeeImageSchema).optional(),
  // ⭐ NEW: Affected products
  affectedProducts: z.array(affectedProductSchema).optional(),
  // ⭐ NEW: Verification fields
  verification: z.string().optional().nullable(),
  isVerifiedCorrect: z.boolean().optional(),
  timeline: z.array(z.unknown()).optional(),
})

export type UpdateComplaintInput = z.infer<typeof updateComplaintSchema>
