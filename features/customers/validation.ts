import { z } from 'zod';

// Phone number validation (Vietnam format)
const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Tax code validation (10-13 digits)
const taxCodeRegex = /^\d{10,13}$/;

// Address Schema
export const addressSchema = z.object({
  id: z.string(),
  label: z.string().min(1, "Nhãn địa chỉ là bắt buộc"),
  street: z.string().min(1, "Địa chỉ chi tiết là bắt buộc"),
  contactName: z.string().optional(),
  contactPhone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ").optional().or(z.literal('')),
  
  inputLevel: z.enum(['2-level', '3-level']).optional(),
  autoFilled: z.boolean().optional(),
  
  province: z.string().min(1, "Vui lòng chọn Tỉnh/Thành"),
  provinceId: z.string(),
  ward: z.string().min(1, "Vui lòng chọn Phường/Xã"),
  wardId: z.string(),
  
  district: z.string().min(1, "Vui lòng chọn Quận/Huyện"),
  districtId: z.number(),
  
  isDefaultShipping: z.boolean().optional(),
  isDefaultBilling: z.boolean().optional(),
  notes: z.string().optional(),
});

export const customerFormSchema = z.object({
  // Mã khách hàng - tùy chọn, nếu không nhập sẽ tự động sinh KH000001
  id: z.string()
    .max(50, "Mã khách hàng không được quá 50 ký tự")
    .optional()
    .or(z.literal('')),
  
  name: z.string()
    .min(2, "Tên khách hàng phải có ít nhất 2 ký tự")
    .max(200, "Tên khách hàng không được quá 200 ký tự"),
  
  phone: z.string()
    .regex(phoneRegex, "Số điện thoại không hợp lệ (VD: 0912345678)")
    .optional()
    .or(z.literal('')),

  email: z.string()
    .regex(emailRegex, "Email không hợp lệ")
    .optional()
    .or(z.literal('')),

  status: z.enum(['Đang giao dịch', 'Ngừng Giao Dịch', 'active', 'inactive'], {
    message: "Vui lòng chọn trạng thái"
  }),

  // Classification
  type: z.string().optional(),
  customerGroup: z.string().optional(),
  lifecycleStage: z.string().optional(),
  
  company: z.string()
    .max(200, "Tên công ty không được quá 200 ký tự")
    .optional(),
  
  taxCode: z.string()
    .regex(taxCodeRegex, "Mã số thuế không hợp lệ (10-13 chữ số)")
    .optional()
    .or(z.literal('')),
  
  representative: z.string()
    .max(100, "Tên người đại diện không được quá 100 ký tự")
    .optional(),
  
  position: z.string()
    .max(100, "Chức vụ không được quá 100 ký tự")
    .optional(),
  
  // Addresses
  addresses: z.array(addressSchema),

  // Legacy flat address fields (kept for backward compatibility but optional)
  shippingAddress_street: z.string().optional(),
  shippingAddress_ward: z.string().optional(),
  shippingAddress_province: z.string().optional(),
  
  billingAddress_street: z.string().optional(),
  billingAddress_ward: z.string().optional(),
  billingAddress_province: z.string().optional(),

  // Contact & Banking
  zaloPhone: z.string().optional(),
  bankName: z.string()
    .max(100, "Tên ngân hàng không được quá 100 ký tự")
    .optional(),
  
  bankAccount: z.string()
    .regex(/^\d{9,20}$/, "Số tài khoản phải từ 9-20 chữ số")
    .optional()
    .or(z.literal('')),
  
  // Financials
  currentDebt: z.number()
    .min(0, "Công nợ không được âm")
    .optional(),
  
  maxDebt: z.number()
    .min(0, "Hạn mức công nợ không được âm")
    .optional(),
    
  paymentTerms: z.string().optional(),
  creditRating: z.string().optional(),
  allowCredit: z.boolean().optional(),
  defaultDiscount: z.number().min(0).max(100).optional(),
  pricingLevel: z.string().optional(),
  
  // Marketing & Source
  source: z.string().optional(),
  campaign: z.string().optional(),
  referredBy: z.string().optional(),
  
  // Social Media
  social: z.object({
    facebook: z.string().url("Link Facebook không hợp lệ").optional().or(z.literal('')),
    linkedin: z.string().url("Link LinkedIn không hợp lệ").optional().or(z.literal('')),
    website: z.string().url("Website không hợp lệ").optional().or(z.literal('')),
  }).optional(),
  
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  
  // Contacts
  contacts: z.array(z.object({
    id: z.string(),
    name: z.string().min(1, "Tên liên hệ là bắt buộc"),
    role: z.string().min(1, "Chức vụ là bắt buộc"),
    phone: z.string().regex(phoneRegex, "Số điện thoại không hợp lệ").optional().or(z.literal('')),
    email: z.string().regex(emailRegex, "Email không hợp lệ").optional().or(z.literal('')),
    isPrimary: z.boolean().optional(),
  })).optional(),

  // Contract
  contract: z.object({
    number: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    value: z.number().optional(),
    status: z.enum(['Active', 'Expired', 'Pending', 'Cancelled']).optional(),
    fileUrl: z.string().optional(),
    details: z.string().optional(),
  }).optional(),
  
  notes: z.string()
    .max(500, "Ghi chú không được quá 500 ký tự")
    .optional(),

  // Account Management
  accountManagerId: z.string().optional(),
  accountManagerName: z.string().optional(),

  // Audit fields
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  deletedAt: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),

  // Statistics
  totalOrders: z.number().optional(),
  totalSpent: z.number().optional(),
  totalQuantityPurchased: z.number().optional(),
  totalQuantityReturned: z.number().optional(),
  lastPurchaseDate: z.string().optional(),
  failedDeliveries: z.number().optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;

// Validation helper for duplicate ID check
export const validateUniqueId = (
  id: string, 
  existingIds: string[], 
  currentId?: string
): boolean => {
  // If editing, exclude current ID from check
  const idsToCheck = currentId 
    ? existingIds.filter(existingId => existingId !== currentId)
    : existingIds;
  
  return !idsToCheck.includes(id);
};
