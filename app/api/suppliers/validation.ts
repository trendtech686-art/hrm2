/**
 * API Validation Schemas for Suppliers
 */
import { z } from 'zod'

// Query params for listing suppliers
export const listSuppliersSchema = z.object({
  page: z.string().optional().transform(v => parseInt(v || '1')),
  limit: z.string().optional().transform(v => parseInt(v || '20')),
  search: z.string().optional(),
  status: z.string().optional(),
  all: z.string().optional().transform(v => v === 'true'),
})

// Create supplier schema
export const createSupplierSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tên nhà cung cấp là bắt buộc'),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  taxCode: z.string().optional(),
  bankAccount: z.string().optional(),
  website: z.string().optional(),
  status: z.string().optional().default('active'),
})

// Update supplier schema
export const updateSupplierSchema = createSupplierSchema.partial()

export type ListSuppliersInput = z.infer<typeof listSuppliersSchema>
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
