/**
 * Zod validation schemas for supplier-warranty module
 */
import { z } from 'zod';

// Item schema
export const supplierWarrantyItemSchema = z.object({
  productSystemId: z.string().min(1, 'Vui lòng chọn sản phẩm'),
  productId: z.string().min(1),
  productName: z.string().min(1, 'Tên sản phẩm không được để trống'),
  productImage: z.string().nullable().optional(),
  sentQuantity: z.number().int().min(1, 'Số lượng gửi BH phải >= 1'),
  unitPrice: z.number().min(0, 'Đơn giá phải >= 0'),
  itemNote: z.string().optional(),
});

// Create schema
export const createSupplierWarrantySchema = z.object({
  supplierSystemId: z.string().min(1, 'Vui lòng chọn nhà cung cấp'),
  supplierName: z.string().min(1, 'Tên NCC không được để trống'),
  branchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh'),
  branchName: z.string().min(1, 'Tên chi nhánh không được để trống'),
  reason: z.string().min(1, 'Lý do BH không được để trống'),
  notes: z.string().optional(),
  assignedToSystemId: z.string().optional(),
  assignedToName: z.string().optional(),
  // Delivery method (from shipping card)
  deliveryMethod: z.string().optional(),
  // Legacy shipping info
  trackingNumber: z.string().optional(),
  sentDate: z.string().optional(),
  items: z.array(supplierWarrantyItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
  // Workflow subtasks (saved from detail page)
  subtasks: z.unknown().optional(),
});

// Update schema
export const updateSupplierWarrantySchema = createSupplierWarrantySchema.partial();

// Confirm item schema (kết quả BH cho từng SP)
export const confirmWarrantyItemSchema = z.object({
  systemId: z.string().min(1),
  approvedQuantity: z.number().int().min(0, 'SL được BH phải >= 0'),
  returnedQuantity: z.number().int().min(0, 'SL trả lại phải >= 0'),
  warrantyCost: z.number().min(0, 'Chi phí BH phải >= 0'),
  warrantyResult: z.string().optional(),
});

// Warranty result options
export const WARRANTY_RESULTS = [
  { value: 'Trả lại', label: 'Trả lại (đã sửa)' },
  { value: 'Đổi mới', label: 'Đổi mới' },
  { value: 'Trừ tiền', label: 'Trừ tiền' },
] as const;

export type WarrantyResultValue = typeof WARRANTY_RESULTS[number]['value'];

// Confirm schema (xác nhận kết quả BH)
export const confirmSupplierWarrantySchema = z.object({
  items: z.array(confirmWarrantyItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm'),
  confirmNotes: z.string().optional(),
});

// Complete schema (hoàn thành — CONFIRMED → COMPLETED)
export const completeSupplierWarrantySchema = z.object({
  completionNotes: z.string().optional(),
});

// Approve schema (DRAFT → APPROVED)
export const approveSupplierWarrantySchema = z.object({
  approveNotes: z.string().optional(),
});

// Pack schema (APPROVED → PACKED) — nhập thông tin vận chuyển
export const packSupplierWarrantySchema = z.object({
  trackingNumber: z.string().optional(),
  deliveryMethod: z.string().optional(),
  packNotes: z.string().optional(),
  shippingFee: z.number().optional(),
  payer: z.string().optional(),
  carrier: z.string().optional(),
});

// Export schema (PACKED → EXPORTED)
export const exportSupplierWarrantySchema = z.object({
  trackingNumber: z.string().optional(),
  exportNotes: z.string().optional(),
});

// Deliver schema (EXPORTED → DELIVERED)
export const deliverSupplierWarrantySchema = z.object({
  deliverNotes: z.string().optional(),
});

// Create receipt from warranty (tạo phiếu thu từ detail page)
export const createWarrantyReceiptSchema = z.object({
  accountSystemId: z.string().optional(),
});

// Cancel pack schema (PACKED → APPROVED)
export const cancelPackSupplierWarrantySchema = z.object({
  reason: z.string().optional(),
});

// Types
export type SupplierWarrantyItemInput = z.infer<typeof supplierWarrantyItemSchema>;
export type CreateSupplierWarrantyInput = z.infer<typeof createSupplierWarrantySchema>;
export type UpdateSupplierWarrantyInput = z.infer<typeof updateSupplierWarrantySchema>;
export type ConfirmWarrantyItemInput = z.infer<typeof confirmWarrantyItemSchema>;
export type ConfirmSupplierWarrantyInput = z.infer<typeof confirmSupplierWarrantySchema>;
export type CompleteSupplierWarrantyInput = z.infer<typeof completeSupplierWarrantySchema>;
export type ApproveSupplierWarrantyInput = z.infer<typeof approveSupplierWarrantySchema>;
export type PackSupplierWarrantyInput = z.infer<typeof packSupplierWarrantySchema>;
export type ExportSupplierWarrantyInput = z.infer<typeof exportSupplierWarrantySchema>;
export type DeliverSupplierWarrantyInput = z.infer<typeof deliverSupplierWarrantySchema>;
export type CreateWarrantyReceiptInput = z.infer<typeof createWarrantyReceiptSchema>;
export type CancelPackSupplierWarrantyInput = z.infer<typeof cancelPackSupplierWarrantySchema>;
