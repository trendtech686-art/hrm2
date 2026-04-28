/**
 * API Validation Schemas for Warranties
 */
import { z } from 'zod'

/**
 * Valid Prisma WarrantyStatus enum values
 */
export const VALID_WARRANTY_STATUSES = [
  'RECEIVED',
  'PROCESSING',
  'COMPLETED',
  'RETURNED',
  'CANCELLED',
] as const;

/**
 * Validate and normalize status to Prisma enum value
 * Accepts both uppercase (DB) and lowercase (legacy) values
 */
export function toPrismaStatus(status?: string): string {
  if (!status) return 'RECEIVED';
  const upper = status.toUpperCase();
  if (VALID_WARRANTY_STATUSES.includes(upper as typeof VALID_WARRANTY_STATUSES[number])) {
    return upper;
  }
  return 'RECEIVED';
}

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

// Create warranty schema with status transformation
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
  // Transform frontend status to Prisma enum
  status: z.string().optional().transform(toPrismaStatus),
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
  replacementProductSystemId: z.string().optional(),
  
  // ===== ADDITIONAL FIELDS FOR FULL WARRANTY DATA =====
  // Tracking & external references
  trackingCode: z.string().optional(),
  publicTrackingCode: z.string().optional(),
  shippingFee: z.number().optional(),
  referenceUrl: z.string().optional(),
  externalReference: z.string().optional(),
  
  // Images
  receivedImages: z.array(z.string()).optional(),
  processedImages: z.array(z.string()).optional(),
  
  // Products in warranty ticket (JSON array)
  products: z.any().optional(), // Allow any for JSON array
  
  // Settlement
  settlement: z.any().optional(), // Allow any for JSON object
  settlementStatus: z.string().optional(),
  
  // Summary stats
  summary: z.any().optional(), // Allow any for JSON object
  
  // History & comments (stored as JSON)
  history: z.any().optional(),
  comments: z.any().optional(),
  
  // Workflow subtasks
  subtasks: z.any().optional(),
  
  // Order linking
  linkedOrderSystemId: z.string().optional(),
  
  // Audit fields
  createdBy: z.string().optional(),
  createdBySystemId: z.string().optional(),
})

// Update warranty schema
export const updateWarrantySchema = createWarrantySchema.partial()

export type ListWarrantiesInput = z.infer<typeof listWarrantiesSchema>
export type CreateWarrantyInput = z.infer<typeof createWarrantySchema>
export type UpdateWarrantyInput = z.infer<typeof updateWarrantySchema>
