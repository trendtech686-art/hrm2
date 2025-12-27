/**
 * Receipt (Phiếu Thu) Types
 * Includes ReceiptType (category/classification)
 */

import type { BusinessId, SystemId } from '@/lib/id-types';
import type { HistoryEntry } from '../../components/ActivityHistory';

// ============================================
// RECEIPT TYPE (Loại Phiếu Thu - Category)
// ============================================
export type ReceiptType = {
  systemId: SystemId; // Simple string for categories
  id: BusinessId; // Mã loại
  name: string; // Tên loại
  description?: string | undefined;
  isBusinessResult: boolean; // Hạch toán kết quả kinh doanh
  createdAt: string; // YYYY-MM-DD
  isActive: boolean; // Trạng thái hoạt động
  color?: string | undefined; // Màu sắc
};

// ============================================
// RECEIPT (Phiếu Thu - Document)
// ============================================
export type ReceiptStatus = 
  | 'completed'          // Hoàn thành
  | 'cancelled';         // Đã hủy

export type ReceiptCategory = 
  | 'sale'                    // Bán hàng
  | 'complaint_penalty'       // Phạt nhân viên (khiếu nại)
  | 'warranty_additional'     // Thu thêm bảo hành
  | 'customer_payment'        // Thu tiền khách hàng
  | 'other';                  // Khác

export const RECEIPT_STATUS_LABELS: Record<ReceiptStatus, string> = {
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

export type ReceiptOrderAllocation = {
  orderSystemId: SystemId;
  orderId: BusinessId;
  amount: number;
};

export type Receipt = {
  systemId: SystemId;
  id: BusinessId; // PT-XXXXXX
  date: string; // ISO date
  amount: number;
  
  // Payer info (Link to TargetGroup settings)
  payerTypeSystemId: SystemId; // Link to TargetGroup (KHACHHANG, NHACUNGCAP, NHANVIEN, DOITACVC, KHAC)
  payerTypeName: string; // Cached name: "Khách hàng", "Nhà cung cấp", etc.
  payerName: string;
  payerSystemId?: SystemId | undefined; // Link to customer/supplier/employee
  
  description: string;
  
  // Payment Method (Link to PaymentMethod settings)
  paymentMethodSystemId: SystemId; // Link to PaymentMethod
  paymentMethodName: string; // Cached name for display
  
  // Account & Type
  accountSystemId: SystemId; // Link to CashAccount
  paymentReceiptTypeSystemId: SystemId; // Link to ReceiptType (loại phiếu thu)
  paymentReceiptTypeName: string;
  
  // Branch & User
  branchSystemId: SystemId;
  branchName: string;
  createdBy: SystemId;
  createdAt: string; // ISO timestamp
  
  // Status & Category
  status: ReceiptStatus;
  category?: ReceiptCategory | undefined;
  
  // Optional fields
  recognitionDate?: string | undefined; // Ngày ghi nhận
  updatedAt?: string | undefined;
  cancelledAt?: string | undefined;
  
  // Links to other documents
  originalDocumentId?: BusinessId | undefined; // Link to Order/Complaint/Warranty (Business ID)
  purchaseOrderSystemId?: SystemId | undefined; // Link trực tiếp đến đơn nhập hàng (systemId)
  purchaseOrderId?: BusinessId | undefined; // Cache business id để hiển thị
  linkedWarrantySystemId?: SystemId | undefined; // Link to Warranty (System ID)
  linkedComplaintSystemId?: SystemId | undefined; // Link to Complaint (System ID)
  linkedOrderSystemId?: SystemId | undefined; // Link to Order (System ID)
  linkedSalesReturnSystemId?: SystemId | undefined; // Link to Sales Return (System ID)
  customerSystemId?: SystemId | undefined;
  customerName?: string | undefined;
  
  // Financial
  affectsDebt: boolean;
  runningBalance?: number | undefined;
  orderAllocations?: ReceiptOrderAllocation[] | undefined;
  
  // Activity History
  activityHistory?: HistoryEntry[] | undefined;
};
