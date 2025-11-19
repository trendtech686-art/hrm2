/**
 * Payment (Phiếu Chi) Types
 * Includes PaymentType (category/classification)
 */

import type { SystemId, BusinessId } from '../../lib/id-types.ts';

// ============================================
// PAYMENT TYPE (Loại Phiếu Chi - Category)
// ============================================
export type PaymentType = {
  systemId: SystemId; // Simple string for categories
  id: BusinessId; // Mã loại
  name: string; // Tên loại
  description?: string;
  isBusinessResult: boolean; // Hạch toán kết quả kinh doanh
  createdAt: string; // YYYY-MM-DD
  isActive: boolean; // Trạng thái hoạt động
  color?: string; // Màu sắc
};

// ============================================
// PAYMENT (Phiếu Chi - Document)
// ============================================
export type PaymentStatus = 
  | 'completed'          // Hoàn thành
  | 'cancelled';         // Đã hủy

export type PaymentCategory = 
  | 'purchase'           // Mua hàng
  | 'complaint_refund'   // Hoàn tiền khiếu nại
  | 'warranty_refund'    // Hoàn tiền bảo hành
  | 'salary'             // Chi lương
  | 'expense'            // Chi phí khác
  | 'supplier_payment'   // Thanh toán nhà cung cấp
  | 'other';             // Khác

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const PAYMENT_CATEGORY_LABELS: Record<PaymentCategory, string> = {
  purchase: 'Mua hàng',
  complaint_refund: 'Hoàn tiền khiếu nại',
  warranty_refund: 'Hoàn tiền bảo hành',
  salary: 'Chi lương',
  expense: 'Chi phí',
  supplier_payment: 'Thanh toán NCC',
  other: 'Khác',
};

export type Payment = {
  systemId: SystemId;
  id: BusinessId; // PC-XXXXXX
  date: string; // ISO date
  amount: number;
  
  // Recipient info (Link to TargetGroup settings)
  recipientTypeSystemId: SystemId; // Link to TargetGroup (KHACHHANG, NHACUNGCAP, NHANVIEN, DOITACVC, KHAC)
  recipientTypeName: string; // Cached name: "Khách hàng", "Nhà cung cấp", etc.
  recipientName: string;
  recipientSystemId?: SystemId; // Link to customer/supplier/employee
  
  description: string;
  
  // Payment Method (Link to PaymentMethod settings)
  paymentMethodSystemId: SystemId; // Link to PaymentMethod
  paymentMethodName: string; // Cached name for display
  
  // Account & Type
  accountSystemId: SystemId; // Link to CashAccount
  paymentReceiptTypeSystemId: SystemId; // Link to PaymentType (loại phiếu chi)
  paymentReceiptTypeName: string;
  
  // Branch & User
  branchSystemId: SystemId;
  branchName: string;
  createdBy: SystemId;
  createdAt: string; // ISO timestamp
  
  // Status & Category
  status: PaymentStatus;
  category?: PaymentCategory;
  
  // Optional fields
  recognitionDate?: string; // Ngày ghi nhận (cho thanh toán trả sau)
  updatedAt?: string;
  cancelledAt?: string;
  
  // Links to other documents
  originalDocumentId?: string; // Link to Order/Complaint/Warranty (Business ID)
  purchaseOrderSystemId?: SystemId; // Link trực tiếp đến đơn nhập hàng (systemId)
  purchaseOrderId?: BusinessId; // Cache business id để hiển thị
  linkedWarrantySystemId?: SystemId; // Link to Warranty (System ID)
  linkedComplaintSystemId?: SystemId; // Link to Complaint (System ID)
  linkedOrderSystemId?: SystemId; // Link to Order (System ID)
  customerSystemId?: SystemId;
  customerName?: string;
  
  // Financial
  affectsDebt: boolean;
  runningBalance?: number;
};
