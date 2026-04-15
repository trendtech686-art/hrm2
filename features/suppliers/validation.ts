/**
 * Zod validation schemas for suppliers module
 */
import { z } from 'zod';
import { businessIdSchema, systemIdSchema, SystemId, BusinessId } from '@/lib/id-types';

// Supplier status enum - matches database values
export const supplierStatusSchema = z.enum([
  'Đang Giao Dịch',
  'Ngừng Giao Dịch',
]);

// Supplier type enum
export const supplierTypeSchema = z.enum([
  'manufacturer',
  'distributor',
  'wholesaler',
  'retailer',
  'individual',
  'other'
]);

// Payment terms enum
export const paymentTermsSchema = z.enum([
  'cod',
  'prepaid',
  'net_7',
  'net_15',
  'net_30',
  'net_45',
  'net_60',
  'net_90',
  'custom'
]);

// Contact schema
export const supplierContactSchema = z.object({
  name: z.string().min(1, 'Tên liên hệ không được để trống'),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  isPrimary: z.boolean().default(false),
});

// Bank account schema
export const supplierBankAccountSchema = z.object({
  bankName: z.string().min(1, 'Tên ngân hàng không được để trống'),
  accountNumber: z.string().min(1, 'Số tài khoản không được để trống'),
  accountName: z.string().min(1, 'Tên chủ tài khoản không được để trống'),
  branch: z.string().optional(),
  isPrimary: z.boolean().default(false),
});

// Create supplier schema
export const createSupplierSchema = z.object({
  businessId: businessIdSchema.optional(),
  name: z.string().min(1, 'Tên nhà cung cấp không được để trống'),
  type: supplierTypeSchema.default('other'),
  
  // Contact info
  phone: z.string().optional(),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  website: z.string().url('Website không hợp lệ').optional().or(z.literal('')),
  
  // Address
  address: z.string().optional(),
  addressData: z.record(z.string(), z.unknown()).nullable().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
  country: z.string().default('Việt Nam'),
  
  // Tax info
  taxCode: z.string().optional(),
  companyName: z.string().optional(),
  
  // Business terms
  paymentTerms: paymentTermsSchema.default('cod'),
  customPaymentTerms: z.string().optional(),
  creditLimit: z.number().min(0).optional(),
  discountRate: z.number().min(0).max(100).optional(),
  
  // Categories
  categorySystemIds: z.array(systemIdSchema).optional(),
  productCategories: z.array(z.string()).optional(),
  
  // Additional
  notes: z.string().optional(),
  contacts: z.array(supplierContactSchema).optional(),
  bankAccounts: z.array(supplierBankAccountSchema).optional(),
  tags: z.array(z.string()).optional(),
});

// Update supplier schema
export const updateSupplierSchema = createSupplierSchema.partial().extend({
  status: supplierStatusSchema.optional(),
});

// Supplier product schema
export const supplierProductSchema = z.object({
  productSystemId: z.string() as unknown as z.ZodType<SystemId>,
  productBusinessId: z.string().optional() as unknown as z.ZodType<BusinessId | undefined>,
  productName: z.string().optional(),
  supplierProductCode: z.string().optional(),
  supplierProductName: z.string().optional(),
  unitPrice: z.number().min(0),
  minOrderQuantity: z.number().int().min(1).optional(),
  leadTimeDays: z.number().int().min(0).optional(),
  isPreferred: z.boolean().default(false),
});

// Filter schema
export const supplierFiltersSchema = z.object({
  status: supplierStatusSchema.optional(),
  type: supplierTypeSchema.optional(),
  categorySystemId: z.string().optional(),
  paymentTerms: paymentTermsSchema.optional(),
  search: z.string().optional(),
  hasDebt: z.boolean().optional(),
});

// Types
export type SupplierStatus = z.infer<typeof supplierStatusSchema>;
export type SupplierType = z.infer<typeof supplierTypeSchema>;
export type PaymentTerms = z.infer<typeof paymentTermsSchema>;
export type SupplierContact = z.infer<typeof supplierContactSchema>;
export type SupplierBankAccount = z.infer<typeof supplierBankAccountSchema>;
export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
export type SupplierProduct = z.infer<typeof supplierProductSchema>;
export type SupplierFilters = z.infer<typeof supplierFiltersSchema>;
