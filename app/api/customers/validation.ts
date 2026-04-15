/**
 * Customer API Validation Schemas
 */
import { z } from 'zod'

// GET /api/customers query params
export const listCustomersSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'POTENTIAL', 'VIP']).optional(),
})

// POST /api/customers body
export const createCustomerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên khách hàng là bắt buộc'),
  email: z.string().email('Email không hợp lệ').optional().nullable(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  companyName: z.string().optional().nullable(),
  taxCode: z.string().optional().nullable(),
  representative: z.string().optional().nullable(),
  contactPerson: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  addresses: z.any().optional(),
  maxDebt: z.number().optional().nullable(),
  creditLimit: z.number().optional().nullable(),
  lifecycleStage: z.string().optional().nullable(),
  customerType: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  tags: z.any().optional().nullable(),
  // Personal info
  gender: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  // Flat address fields
  address: z.string().optional().nullable(),
  province: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  ward: z.string().optional().nullable(),
  // Classification
  type: z.string().optional().nullable(),
  customerGroup: z.string().optional().nullable(),
  pricingPolicyId: z.string().optional().nullable(),
  defaultDiscount: z.number().optional().nullable(),
  // Source & Campaign
  source: z.string().optional().nullable(),
  campaign: z.string().optional().nullable(),
  referredBy: z.string().optional().nullable(),
  // Contact & Banking
  zaloPhone: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  bankAccount: z.string().optional().nullable(),
  // Payment terms
  paymentTerms: z.string().optional().nullable(),
  creditRating: z.string().optional().nullable(),
  allowCredit: z.boolean().optional().nullable(),
  // Multiple contacts
  contacts: z.any().optional().nullable(),
  // Contract
  contract: z.any().optional().nullable(),
  // Business Profiles
  businessProfiles: z.any().optional().nullable(),
  // Images & Social
  images: z.any().optional().nullable(),
  social: z.any().optional().nullable(),
  // Account manager
  accountManagerId: z.string().optional().nullable(),
  // Pricing level (legacy enum field)
  pricingLevel: z.string().optional().nullable(),
  // Follow-up tracking
  lastContactDate: z.string().optional().nullable(),
  nextFollowUpDate: z.string().optional().nullable(),
  followUpReason: z.string().optional().nullable(),
  followUpAssigneeId: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
})

// PUT /api/customers/[systemId] body
export const updateCustomerSchema = createCustomerSchema.partial()

export type ListCustomersQuery = z.infer<typeof listCustomersSchema>
export type CreateCustomerBody = z.infer<typeof createCustomerSchema>
export type UpdateCustomerBody = z.infer<typeof updateCustomerSchema>
