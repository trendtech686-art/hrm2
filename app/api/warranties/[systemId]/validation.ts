import { z } from 'zod'
import { toPrismaStatus } from '../validation'

export const updateWarrantySchema = z.object({
  // Core identifiers (passed through but not updated)
  systemId: z.string().optional(),
  id: z.string().optional(),
  
  // Issue details
  issueDescription: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  
  // Transform frontend status to Prisma enum (supports both lowercase and UPPERCASE)
  status: z.string().optional().transform(val => val ? toPrismaStatus(val) : undefined),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  solution: z.string().optional().nullable(),
  diagnosis: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  branchId: z.string().optional().nullable(),
  
  // Customer info
  customerId: z.string().optional().nullable(),
  customerName: z.string().optional().nullable(),
  customerPhone: z.string().optional().nullable(),
  customerEmail: z.string().optional().nullable(),
  customerAddress: z.string().optional().nullable(),
  
  // Product info
  productId: z.string().optional().nullable(),
  productName: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  
  // Order info
  orderId: z.string().optional().nullable(),
  orderLineItemId: z.string().optional().nullable(),
  linkedOrderSystemId: z.string().optional().nullable(),
  
  // Dates
  purchaseDate: z.string().optional().nullable(),
  warrantyExpireDate: z.string().optional().nullable(),
  
  // Costs
  partsCost: z.number().optional().nullable(),
  laborCost: z.number().optional().nullable(),
  totalCost: z.number().optional().nullable(),
  
  // Warranty status
  isUnderWarranty: z.boolean().optional().nullable(),
  
  // Branch & employee
  branchSystemId: z.string().optional().nullable(),
  branchName: z.string().optional().nullable(),
  employeeSystemId: z.string().optional().nullable(),
  employeeName: z.string().optional().nullable(),
  
  // Shipping & external refs
  trackingCode: z.string().optional().nullable(),
  shippingFee: z.number().optional().nullable(),
  referenceUrl: z.string().optional().nullable(),
  externalReference: z.string().optional().nullable(),
  
  // Images (legacy field + new fields)
  images: z.array(z.string()).optional().nullable(),
  receivedImages: z.array(z.string()).optional().nullable(),
  processedImages: z.array(z.string()).optional().nullable(),
  
  // Products (JSON array)
  products: z.any().optional().nullable(),
  
  // Settlement (JSON object)
  settlement: z.any().optional().nullable(),
  settlementStatus: z.string().optional().nullable(),
  
  // Summary (JSON object)
  summary: z.any().optional().nullable(),
  
  // History & comments (JSON arrays)
  history: z.any().optional().nullable(),
  comments: z.any().optional().nullable(),
  
  // Subtasks
  subtasks: z.any().optional().nullable(),
}).passthrough() // Allow additional fields not in schema

export type UpdateWarrantyInput = z.infer<typeof updateWarrantySchema>
