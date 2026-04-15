import { z } from 'zod'

export const updateSupplierSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  contactPerson: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal('')),
  address: z.string().optional().nullable(),
  addressData: z.record(z.string(), z.unknown()).optional().nullable(),
  taxCode: z.string().optional().nullable(),
  bankAccount: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  website: z.string().optional().nullable(),
  accountManager: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
})

export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>
