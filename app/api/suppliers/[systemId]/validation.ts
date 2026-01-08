import { z } from 'zod'

export const updateSupplierSchema = z.object({
  name: z.string().optional(),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  taxCode: z.string().optional().nullable(),
  bankAccount: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
})

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
