/**
 * API Validation Schemas for Search APIs
 */
import { z } from 'zod'

// Common pagination params
const paginationSchema = z.object({
  q: z.string().optional().default(''),
  limit: z.string().optional().transform(v => Math.min(parseInt(v || '20', 10), 100)),
  offset: z.string().optional().transform(v => parseInt(v || '0', 10)),
  sort: z.string().optional().default('createdAt:desc'),
})

// Customer search params
export const customerSearchSchema = paginationSchema.extend({
  city: z.string().optional(),
  district: z.string().optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  customerGroup: z.string().optional(),
})

// Employee search params
export const employeeSearchSchema = paginationSchema.extend({
  department: z.string().optional(),
  departmentId: z.string().optional(),
  position: z.string().optional(),
  status: z.string().optional(),
})

// Shipment search params
export const shipmentSearchSchema = paginationSchema.extend({
  status: z.string().optional(),
  carrier: z.string().optional(),
  printStatus: z.string().optional(),
  deliveryStatus: z.string().optional(),
})

// Supplier search params
export const supplierSearchSchema = paginationSchema.extend({
  isActive: z.string().optional(),
  status: z.string().optional(),
})

// Warranty search params
export const warrantySearchSchema = paginationSchema.extend({
  status: z.string().optional(),
  priority: z.string().optional(),
  isUnderWarranty: z.string().optional(),
  branchId: z.string().optional(),
})

// Global search params
export const globalSearchSchema = z.object({
  q: z.string().min(1),
  type: z.enum(['products', 'customers', 'orders', 'employees', 'all']).optional().default('all'),
  limit: z.string().optional().transform(v => Math.min(parseInt(v || '20', 10), 100)),
  offset: z.string().optional().transform(v => parseInt(v || '0', 10)),
})

export type CustomerSearchInput = z.infer<typeof customerSearchSchema>
export type EmployeeSearchInput = z.infer<typeof employeeSearchSchema>
export type ShipmentSearchInput = z.infer<typeof shipmentSearchSchema>
export type SupplierSearchInput = z.infer<typeof supplierSearchSchema>
export type WarrantySearchInput = z.infer<typeof warrantySearchSchema>
export type GlobalSearchInput = z.infer<typeof globalSearchSchema>
