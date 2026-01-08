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
  addresses: z.any().optional(),
  maxDebt: z.number().optional().nullable(),
  creditLimit: z.number().optional().nullable(),
  lifecycleStage: z.string().optional().nullable(),
  customerType: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  createdBy: z.string().optional().nullable(),
})

// PUT /api/customers/[systemId] body
export const updateCustomerSchema = createCustomerSchema.partial()

export type ListCustomersQuery = z.infer<typeof listCustomersSchema>
export type CreateCustomerBody = z.infer<typeof createCustomerSchema>
export type UpdateCustomerBody = z.infer<typeof updateCustomerSchema>
