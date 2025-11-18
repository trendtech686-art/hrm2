/**
 * Receipt (Phiếu Thu) Types
 * Includes ReceiptType (category/classification)
 */

import type { SystemId, BusinessId } from '../../lib/id-types.ts';

// ============================================
// RECEIPT TYPE (Loại Phiếu Thu - Category)
// ============================================
export type ReceiptType = {
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
// RECEIPT (Phiếu Thu - Document)
// ============================================
export type ReceiptStatus = 
  | 'pending'            // Chờ xử lý
  | 'pending_approval'   // Chờ duyệt
  | 'approved'           // Đã duyệt
  | 'completed'          // Hoàn thành
  | 'cancelled';         // Đã hủy

export type ReceiptCategory = 
  | 'sale'                    // Bán hàng
  | 'complaint_penalty'       // Phạt nhân viên (khiếu nại)
  | 'warranty_additional'     // Thu thêm bảo hành
  | 'customer_payment'        // Thu tiền khách hàng
  | 'other';                  // Khác

export const RECEIPT_STATUS_LABELS: Record<ReceiptStatus, string> = {
  pending: 'Chờ xử lý',
  pending_approval: 'Chờ duyệt',
  approved: 'Đã duyệt',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

export const RECEIPT_CATEGORY_LABELS: Record<ReceiptCategory, string> = {
  sale: 'Bán hàng',
  complaint_penalty: 'Phạt nhân viên',
  warranty_additional: 'Thu thêm bảo hành',
  customer_payment: 'Thu tiền khách',
  other: 'Khác',
};

export type Receipt = {
  systemId: SystemId;
  id: BusinessId; // PT-XXXXXX
  date: string; // ISO date
  amount: number;
  
  // Payer info (Link to TargetGroup settings)
  payerTypeSystemId: string; // Link to TargetGroup (KHACHHANG, NHACUNGCAP, NHANVIEN, DOITACVC, KHAC)
  payerTypeName: string; // Cached name: "Khách hàng", "Nhà cung cấp", etc.
  payerName: string;
  payerSystemId?: string; // Link to customer/supplier/employee
  
  description: string;
  
  // Payment Method (Link to PaymentMethod settings)
  paymentMethodSystemId: string; // Link to PaymentMethod
  paymentMethodName: string; // Cached name for display
  
  // Account & Type
  accountSystemId: string; // Link to CashAccount
  paymentReceiptTypeSystemId: string; // Link to ReceiptType (loại phiếu thu)
  paymentReceiptTypeName: string;
  
  // Branch & User
  branchSystemId: string;
  branchName: string;
  createdBy: string;
  createdAt: string; // ISO timestamp
  
  // Status & Category
  status: ReceiptStatus;
  category?: ReceiptCategory;
  
  // Optional fields
  recognitionDate?: string; // Ngày ghi nhận
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
