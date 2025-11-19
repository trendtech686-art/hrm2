// =============================================
// COMPLAINT TYPES & INTERFACES
// =============================================

import type { Subtask } from '../../components/shared/subtask-list.tsx';
import { type SystemId, type BusinessId } from '../../lib/id-types';

export type ComplaintType =
  | "wrong-product" // Sai hàng
  | "missing-items" // Thiếu hàng
  | "wrong-packaging" // Đóng gói sai quy cách
  | "warehouse-defect" // Trả hàng lỗi do kho
  | "product-condition"; // Khách phàn nàn về tình trạng hàng

export type ComplaintStatus =
  | "pending" // Chờ xử lý
  | "investigating" // Đang kiểm tra
  | "resolved" // Đã giải quyết
  | "cancelled" // Đã hủy
  | "ended"; // Kết thúc

export type ComplaintResolution =
  | "refund" // Trừ tiền vào đơn hàng
  | "return-shipping" // Gửi trả hàng (shop chịu phí)
  | "advice-only" // Tư vấn/hỗ trợ
  | "rejected"; // Không chấp nhận

export type ComplaintVerification =
  | "verified-correct" // Xác nhận đúng
  | "verified-incorrect" // Xác nhận sai
  | "pending-verification"; // Chưa xác minh

export interface ComplaintImage {
  id: SystemId;
  url: string;
  uploadedBy: SystemId; // userId (branded)
  uploadedAt: Date;
  description?: string;
  type: "initial" | "evidence"; // initial = từ khách, evidence = bằng chứng từ nhân viên
}

export interface ComplaintAction {
  id: SystemId;
  actionType: 
    | "created" 
    | "assigned" 
    | "investigated" 
    | "verified" 
    | "verified-correct"
    | "verified-incorrect"
    | "resolved" 
    | "rejected" 
    | "cancelled"
    | "ended"
    | "reopened"
    | "status-changed"
    | "commented";
  performedBy: SystemId; // userId (branded)
  performedAt: Date;
  note?: string;
  images?: string[]; // image ids
  metadata?: Record<string, any>; // Additional data for specific actions
}

export interface Complaint {
  systemId: SystemId; // System-generated, immutable - dùng trong code (branded)
  id: BusinessId; // User-facing, auto-generated từ systemId - dùng hiển thị (VD: COM001) (branded)
  publicTrackingCode?: string; // Mã tracking công khai random (VD: rb5n8xzhrm) - cho khách hàng tra cứu
  
  // Thông tin đơn hàng liên quan
  orderSystemId: SystemId; // SystemId của đơn hàng (ORD00000001) - dùng để query (branded)
  orderCode?: string; // Mã đơn hàng hiển thị (ORD001) - chỉ để hiển thị, có thể lấy từ order
  orderValue?: number; // Giá trị đơn hàng
  
  // Thông tin chi nhánh (lấy từ đơn hàng)
  branchSystemId: SystemId; // SystemId của chi nhánh (từ order.branchSystemId) (branded)
  branchName: string; // Tên chi nhánh (từ order.branchName)
  
  // Thông tin khách hàng
  customerSystemId: SystemId; // SystemId của khách hàng (CUS00000001) - dùng để query (branded)
  customerId?: string; // Mã khách hàng hiển thị (CUS001) - chỉ để hiển thị
  customerName: string;
  customerPhone: string;

  // Thông tin khiếu nại
  type: ComplaintType;
  description: string; // Mô tả ban đầu từ manager/khách
  images: ComplaintImage[]; // Hình ảnh từ khách (type: 'initial')
  employeeImages?: Array<{  // Hình ảnh từ nhân viên kiểm tra (field riêng)
    id: SystemId;
    url: string;
    uploadedBy: SystemId;  // (branded)
    uploadedAt: Date;
  }>;

  // Trạng thái
  status: ComplaintStatus;
  verification: ComplaintVerification;
  resolution?: ComplaintResolution;

  // Người xử lý
  createdBy: SystemId; // userId - Manager tạo (branded)
  createdAt: Date;
  assignedTo?: SystemId; // userId - Nhân viên được giao xử lý (branded)
  assignedAt?: Date;

  // Xử lý
  investigationNote?: string; // Ghi chú kiểm tra từ nhân viên
  evidenceImages?: string[]; // Hình ảnh camera, bằng chứng
  proposedSolution?: string; // Đề xuất giải pháp từ nhân viên
  resolutionNote?: string; // Ghi chú cách xử lý cuối cùng

  // KPI
  isVerifiedCorrect?: boolean; // true = lỗi thật, false = khách sai
  responsibleUserId?: SystemId; // Người chịu trách nhiệm (nếu lỗi đúng) (branded)
  
  // NEW: Quản lý sản phẩm thiếu/lỗi từ đơn hàng
  affectedProducts?: Array<{
      productSystemId: SystemId;
    productId: string;           // SKU
    productName: string;
    unitPrice: number;           // NEW: Giá đơn vị
    quantityOrdered: number;     // Số lượng trên đơn
    quantityReceived: number;    // Số lượng khách nhận được
    quantityMissing: number;     // Số lượng thiếu
    quantityDefective: number;   // Số lượng hỏng/lỗi
    quantityExcess: number;      // NEW: Số lượng thừa
    issueType: 'excess' | 'missing' | 'defective' | 'other'; // NEW: Loại vấn đề
    note?: string;               // Ghi chú chung
    resolutionType?: 'refund' | 'replacement' | 'ignore'; // Cách xử lý
  }>;
  
  // NEW: Theo dõi điều chỉnh kho
  inventoryAdjustment?: {
    adjusted: boolean;           // Đã điều chỉnh kho chưa
    adjustedBy: SystemId;  // (branded)
    adjustedAt: Date;
    adjustmentNote: string;
    inventoryCheckSystemId?: SystemId;  // ✅ Foreign Key - Link to Inventory Check (branded)
    items: Array<{
      productSystemId: SystemId;  // (branded)
      productId: string;
      productName: string;
      quantityAdjusted: number;  // Số lượng cộng lại (+) hoặc trừ (-)
      reason: string;
      branchSystemId: SystemId;  // (branded)
    }>;
  };
  
  // NEW: Lịch sử phiếu chi/thu đã hủy (khi reopen/cancel/change verification)
  cancelledPaymentsReceipts?: Array<{
    paymentReceiptSystemId: SystemId;
    paymentReceiptId: BusinessId;    // PC001, PT001
    type: 'payment' | 'receipt';
    amount: number;
    cancelledAt: Date;
    cancelledBy: SystemId;  // (branded)
    cancelledReason: string;     // "Mở lại khiếu nại", "Hủy khiếu nại", "Đổi verification"
  }>;
  
  // NEW: Lịch sử thay đổi kho (tracking mọi lần điều chỉnh và reverse)
  inventoryHistory?: Array<{
    adjustedAt: Date;
    adjustedBy: SystemId;  // (branded)
    adjustmentType: 'initial' | 'reversed';  // initial = điều chỉnh lần đầu, reversed = khôi phục
    reason: string;                          // "Xác nhận đúng - điều chỉnh kho", "Mở lại - khôi phục kho"
    items: Array<{
      productSystemId: SystemId;  // (branded)
      productId: string;
      productName: string;
      quantityAdjusted: number;              // Số lượng đã thay đổi (+/-)
      branchSystemId: SystemId;  // (branded)
    }>;
  }>;
  
  // Metadata
  resolvedBy?: SystemId; // userId - Người giải quyết (branded)
  resolvedAt?: Date;
  cancelledBy?: SystemId; // userId - Người hủy (branded)
  cancelledAt?: Date;
  endedBy?: SystemId; // userId - Người kết thúc (branded)
  endedAt?: Date;
  updatedAt: Date;
  priority: "low" | "medium" | "high" | "urgent";
  tags?: string[];

  // Timeline
  timeline: ComplaintAction[];

  // Workflow
  subtasks?: Subtask[]; // Quy trình xử lý khiếu nại
}

// =============================================
// CONSTANTS
// =============================================

export const complaintTypeLabels: Record<ComplaintType, string> = {
  "wrong-product": "Sai hàng",
  "missing-items": "Thiếu hàng",
  "wrong-packaging": "Đóng gói sai quy cách",
  "warehouse-defect": "Trả hàng lỗi do kho",
  "product-condition": "Phàn nàn về tình trạng hàng",
};

export const complaintTypeColors: Record<ComplaintType, string> = {
  "wrong-product": "bg-red-500/10 text-red-700 border-red-200",
  "missing-items": "bg-orange-500/10 text-orange-700 border-orange-200",
  "wrong-packaging": "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  "warehouse-defect": "bg-purple-500/10 text-purple-700 border-purple-200",
  "product-condition": "bg-pink-500/10 text-pink-700 border-pink-200",
};

export const complaintStatusLabels: Record<ComplaintStatus, string> = {
  pending: "Chờ xử lý",
  investigating: "Đang kiểm tra",
  resolved: "Đã giải quyết",
  cancelled: "Đã hủy",
  ended: "Kết thúc",
};

export const complaintStatusColors: Record<ComplaintStatus, string> = {
  pending: "bg-gray-500/10 text-gray-700 border-gray-200",
  investigating: "bg-blue-500/10 text-blue-700 border-blue-200",
  resolved: "bg-green-500/10 text-green-700 border-green-200",
  cancelled: "bg-red-500/10 text-red-700 border-red-200",
  ended: "bg-purple-500/10 text-purple-700 border-purple-200",
};

export const complaintResolutionLabels: Record<ComplaintResolution, string> = {
  refund: "Trừ tiền vào đơn hàng",
  "return-shipping": "Gửi trả hàng (shop chịu phí)",
  "advice-only": "Tư vấn/Hỗ trợ",
  rejected: "Từ chối khiếu nại",
};

export const complaintVerificationLabels: Record<ComplaintVerification, string> = {
  "verified-correct": "Xác nhận đúng",
  "verified-incorrect": "Xác nhận sai",
  "pending-verification": "Chưa xác minh",
};

export const complaintVerificationColors: Record<ComplaintVerification, string> = {
  "verified-correct": "bg-red-500/10 text-red-700 border-red-200",
  "verified-incorrect": "bg-green-500/10 text-green-700 border-green-200",
  "pending-verification": "bg-gray-500/10 text-gray-700 border-gray-200",
};

export const complaintPriorityLabels = {
  low: "Thấp",
  medium: "Trung bình",
  high: "Cao",
  urgent: "Khẩn cấp",
};

export const complaintPriorityColors = {
  low: "bg-gray-500/10 text-gray-700 border-gray-200",
  medium: "bg-blue-500/10 text-blue-700 border-blue-200",
  high: "bg-orange-500/10 text-orange-700 border-orange-200",
  urgent: "bg-red-500/10 text-red-700 border-red-200",
};

// =============================================
// HELPER FUNCTIONS
// =============================================

export function getComplaintTypeLabel(type: ComplaintType): string {
  return complaintTypeLabels[type];
}

export function getComplaintStatusLabel(status: ComplaintStatus): string {
  return complaintStatusLabels[status];
}

export function getComplaintResolutionLabel(resolution: ComplaintResolution): string {
  return complaintResolutionLabels[resolution];
}
