/**
 * Payment (Phiếu Chi) Types
 * Includes PaymentType (category/classification)
 */

import type { SystemId, BusinessId } from '../../lib/id-types.ts';

// ============================================
// PAYMENT TYPE (Loại Phiếu Chi - Category)
// ============================================
export type PaymentType = {
  systemId: string; // Simple string for categories
  id: string; // Mã loại
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
  | 'pending'            // Chờ xử lý
  | 'pending_approval'   // Chờ duyệt
  | 'approved'           // Đã duyệt
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
  pending: 'Chờ xử lý',
  pending_approval: 'Chờ duyệt',
  approved: 'Đã duyệt',
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
  recipientTypeSystemId: string; // Link to TargetGroup (KHACHHANG, NHACUNGCAP, NHANVIEN, DOITACVC, KHAC)
  recipientTypeName: string; // Cached name: "Khách hàng", "Nhà cung cấp", etc.
  recipientName: string;
  recipientSystemId?: string; // Link to customer/supplier/employee
  
  description: string;
  
  // Payment Method (Link to PaymentMethod settings)
  paymentMethodSystemId: string; // Link to PaymentMethod
  paymentMethodName: string; // Cached name for display
  
  // Account & Type
  accountSystemId: string; // Link to CashAccount
  paymentReceiptTypeSystemId: string; // Link to PaymentType (loại phiếu chi)
  paymentReceiptTypeName: string;
  
  // Branch & User
  branchSystemId: string;
  branchName: string;
  createdBy: string;
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
  linkedWarrantySystemId?: string; // Link to Warranty (System ID)
  linkedComplaintSystemId?: string; // Link to Complaint (System ID)
  linkedOrderSystemId?: string; // Link to Order (System ID)
  customerSystemId?: string;
  customerName?: string;
  
  // Financial
  affectsDebt: boolean;
  runningBalance?: number;
  
  // Approval workflow
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  completedBy?: string;
  completedByName?: string;
  completedAt?: string;
};
