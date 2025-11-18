/**
 * Warranty Management Types
 * 
 * Hệ thống quản lý bảo hành sản phẩm
 * - Tiếp nhận sản phẩm bảo hành từ khách hàng
 * - Xử lý và theo dõi tình trạng sản phẩm
 * - Ghi log lịch sử thao tác
 */

import type { Subtask } from '../../components/shared/subtask-list.tsx';
import type { SystemId } from '../../lib/id-config.ts';

// ====================================
// Trạng thái phiếu bảo hành
// ====================================
export type WarrantyStatus = 
  | 'incomplete'    // Chưa đầy đủ (chỉ có info cơ bản, chưa có danh sách sản phẩm)
  | 'pending'       // Chưa xử lý (đã có danh sách SP, đang chờ xử lý)
  | 'processed'     // Đã xử lý (đã xử lý xong)
  | 'returned'      // Đã trả (đã trả hàng cho khách)
  | 'completed'     // Kết thúc (đã trả hàng + thanh toán đầy đủ)
  | 'cancelled';    // Đã hủy (phiếu bị hủy)

export const WARRANTY_STATUS_LABELS: Record<WarrantyStatus, string> = {
  incomplete: 'Chưa đầy đủ',
  pending: 'Chưa xử lý',
  processed: 'Đã xử lý',
  returned: 'Đã trả',
  completed: 'Kết thúc',
  cancelled: 'Đã hủy',
};

export const WARRANTY_STATUS_COLORS: Record<WarrantyStatus, string> = {
  incomplete: 'bg-orange-100 text-orange-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processed: 'bg-green-100 text-green-800',
  returned: 'bg-gray-100 text-gray-800',
  completed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800 line-through',
};

// ====================================
// Trạng thái thanh toán bù trừ (cho WarrantyTicket)
// ====================================
export type WarrantySettlementStatus = 'pending' | 'partial' | 'completed';

export const WARRANTY_SETTLEMENT_STATUS_LABELS: Record<WarrantySettlementStatus, string> = {
  pending: 'Chưa thanh toán',
  partial: 'Thanh toán một phần',
  completed: 'Đã thanh toán',
};

export const WARRANTY_SETTLEMENT_STATUS_COLORS: Record<WarrantySettlementStatus, string> = {
  pending: 'bg-red-100 text-red-800',
  partial: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
};

// ====================================
// Cách xử lý sản phẩm bảo hành
// ====================================
export type ResolutionType = 
  | 'return'    // Trả lại (trả nguyên hiện trạng)
  | 'replace'   // Đổi mới (thay thế sản phẩm mới)
  | 'deduct'    // Trừ tiền (đổi trả có hoàn tiền 1 phần)
  | 'out_of_stock'; // Hết hàng (không có để đổi)

export const RESOLUTION_LABELS: Record<ResolutionType, string> = {
  return: 'Trả lại',
  replace: 'Đổi mới',
  deduct: 'Trừ tiền',
  out_of_stock: 'Hết hàng',
};

// ====================================
// Bù trừ thanh toán
// ====================================
export type SettlementType = 
  | 'cash'              // Trả tiền mặt ngay
  | 'transfer'          // Chuyển khoản
  | 'debt'              // Ghi công nợ (trả sau)
  | 'voucher'           // Tạo voucher trừ đơn hàng sau
  | 'order_deduction'   // Trừ vào tiền hàng (đơn hàng hiện tại/tương lai)
  | 'mixed';            // Kết hợp nhiều phương thức

export const SETTLEMENT_TYPE_LABELS: Record<SettlementType, string> = {
  cash: 'Trả tiền mặt',
  transfer: 'Chuyển khoản',
  debt: 'Ghi công nợ',
  voucher: 'Tạo voucher',
  order_deduction: 'Trừ vào tiền hàng',
  mixed: 'Kết hợp nhiều phương thức',
};

export type SettlementStatus = 'pending' | 'partial' | 'completed';

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  pending: 'Chưa bù trừ',
  partial: 'Bù trừ 1 phần',
  completed: 'Đã hoàn thành',
};

// Sản phẩm cần bù trừ
export interface UnsettledProduct {
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  reason: 'out_of_stock' | 'discontinued' | 'defective';
}

// Chi tiết từng phương thức bù trừ (cho mixed settlement)
export interface SettlementMethod {
  systemId: string;
  type: Exclude<SettlementType, 'mixed'>; // Không cho nested mixed
  amount: number;
  status: SettlementStatus;
  
  // Thông tin chi tiết theo từng loại
  linkedOrderSystemId?: string;     // ✅ Link to order (chỉ dùng systemId)
  paymentVoucherId?: string;        // Cho cash/transfer (systemId)
  debtTransactionId?: string;       // Cho debt (systemId)
  voucherCode?: string;             // Cho voucher
  bankAccount?: string;             // Cho transfer
  transactionCode?: string;         // Cho transfer
  dueDate?: string;                 // Cho debt
  
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

// Thông tin bù trừ
export interface WarrantySettlement {
  systemId: string;
  warrantyId: string;
  
  // Thông tin bù trừ
  settlementType: SettlementType;
  totalAmount: number;          // Tổng tiền cần bù trừ
  settledAmount: number;        // Số tiền đã bù trừ
  remainingAmount: number;      // Số tiền còn lại
  
  // Chi tiết sản phẩm không đổi được
  unsettledProducts: UnsettledProduct[];
  
  // Cho single settlement type
  paymentVoucherId?: string;    // ID phiếu chi (nếu trả tiền)
  debtTransactionId?: string;   // ID giao dịch công nợ (nếu ghi nợ)
  voucherCode?: string;         // Mã voucher (nếu tạo voucher)
  linkedOrderSystemId?: string; // ✅ Link to order (chỉ dùng systemId)
  
  // Cho mixed settlement type
  methods?: SettlementMethod[]; // Danh sách các phương thức bù trừ (khi type = 'mixed')
  
  status: SettlementStatus;
  settledAt?: string;
  settledBy?: string;
  notes: string;
  createdAt: string;
  updatedAt?: string;
}

// ====================================
// Status workflow rules
// ====================================
export const WARRANTY_STATUS_TRANSITIONS: Record<WarrantyStatus, WarrantyStatus[]> = {
  incomplete: ['pending'],    // Chưa đầy đủ → Chưa xử lý
  pending: ['processed'],     // Chưa xử lý → Đã xử lý
  processed: ['returned'],    // Đã xử lý → Đã trả
  returned: ['completed'],    // Đã trả → Kết thúc (sau khi thanh toán đầy đủ)
  completed: [],              // Kết thúc → Final state
};

export const WARRANTY_STATUS_TRANSITION_LABELS: Partial<Record<WarrantyStatus, Partial<Record<WarrantyStatus, string>>>> = {
  incomplete: {
    pending: 'Bắt đầu xử lý',
  },
  pending: {
    processed: 'Hoàn thành xử lý',
  },
  processed: {
    returned: 'Trả hàng cho khách',
  },
  returned: {
    completed: 'Kết thúc phiếu bảo hành',
  },
  completed: {},
};

// Helper function to validate status transition
export function canTransitionStatus(currentStatus: WarrantyStatus, newStatus: WarrantyStatus): boolean {
  return WARRANTY_STATUS_TRANSITIONS[currentStatus].includes(newStatus);
}

// Helper function to get next allowed statuses
export function getNextAllowedStatuses(currentStatus: WarrantyStatus): WarrantyStatus[] {
  return WARRANTY_STATUS_TRANSITIONS[currentStatus];
}

// ====================================
// Sản phẩm trong phiếu bảo hành
// ====================================
export interface WarrantyProduct {
  systemId: string;               // ID hệ thống (duy nhất)
  sku?: string;                   // Mã SKU sản phẩm (để link sang chi tiết)
  productName: string;            // Tên sản phẩm (textbox)
  quantity?: number;              // Số lượng (mặc định 1)
  unitPrice?: number;             // Đơn giá (để tính thành tiền)
  issueDescription: string;       // Tình trạng/Ghi chú (textbox)
  resolution: ResolutionType;     // Cách xử lý (Trả lại/Đổi mới/Trừ tiền)
  deductionAmount?: number;       // Số tiền trừ (nếu chọn "Trừ tiền")
  productImages: string[];        // Hình ảnh sản phẩm thực tế lúc nhận
  notes?: string;                 // Ghi chú bổ sung cho sản phẩm
}

// ====================================
// Lịch sử thao tác
// ====================================
export interface WarrantyHistory {
  systemId: string;               // ID hệ thống (duy nhất)
  action: string;                 // Hành động (VD: "create", "add_product", "update_status", "upload_image")
  actionLabel: string;            // Mô tả hiển thị (VD: "Tạo phiếu", "Thêm sản phẩm #1")
  entityType?: string;            // Loại đối tượng (VD: "product", "image", "status")
  entityId?: string;              // ID đối tượng (nếu có)
  changes?: {                     // Chi tiết thay đổi (for version control)
    field: string;                // Trường thay đổi
    oldValue: any;                // Giá trị cũ
    newValue: any;                // Giá trị mới
  }[];
  performedBy: string;            // Người thực hiện (tên nhân viên)
  performedAt: string;            // Thời gian thực hiện (ISO datetime)
  note?: string;                  // Ghi chú thêm (optional)
  metadata?: Record<string, any>; // ✅ Metadata cho action (paymentSystemId, receiptSystemId, etc.)
  
  // ✅ Link to related documents (chỉ dùng systemId)
  linkedOrderSystemId?: string;   // Link to order
  linkedVoucherSystemId?: string; // Link to payment voucher
}

// ====================================
// Comment (Bình luận)
// ====================================
export interface WarrantyComment {
  systemId: string;               // ID hệ thống (duy nhất)
  content: string;                // Nội dung HTML từ TipTap editor
  contentText: string;            // Nội dung plain text (for search)
  createdBy: string;              // Người comment (tên nhân viên)
  createdBySystemId: string;      // SystemId của nhân viên
  createdAt: string;              // Thời gian comment (ISO datetime)
  updatedAt?: string;             // Thời gian chỉnh sửa (nếu có)
  attachments?: string[];         // Hình ảnh đính kèm
  mentions?: string[];            // Danh sách systemId nhân viên được tag
  parentId?: string;              // ID comment cha (for nested replies)
  isEdited?: boolean;             // Đã chỉnh sửa
  isDeleted?: boolean;            // Đã xóa (soft delete)
}

// ====================================
// Phiếu bảo hành (Warranty Ticket)
// ====================================
export interface WarrantyTicket {
  // ====================================
  // ID & Basic Info
  // ====================================
  systemId: SystemId;             // ID hệ thống (primary key, duy nhất) - BRANDED TYPE
  id: string;                     // ID hiển thị/Mã phiếu bảo hành (VD: "WR001")
  
  // ====================================
  // Thông tin chi nhánh & nhân viên
  // ====================================
  branchSystemId: string;         // Chi nhánh xử lý
  branchName: string;             // Tên chi nhánh
  employeeSystemId: string;       // Nhân viên phụ trách
  employeeName: string;           // Tên nhân viên
  
  // ====================================
  // Thông tin khách hàng
  // ====================================
  customerName: string;           // Tên khách hàng
  customerPhone: string;          // Số điện thoại
  customerAddress: string;        // Địa chỉ
  
  // ====================================
  // Thông tin vận chuyển
  // ====================================
  trackingCode: string;           // Mã vận đơn (GHTK, GHN, etc.)
  publicTrackingCode?: string;    // Mã tra cứu công khai (cho khách hàng)
  shippingFee?: number;           // Phí cước (optional)
  
  // ====================================
  // Tham chiếu bên ngoài
  // ====================================
  referenceUrl?: string;          // Đường dẫn (URL)
  externalReference?: string;     // Mã tham chiếu
  
  // ====================================
  // Hình ảnh & Sản phẩm
  // ====================================
  receivedImages: string[];       // Hình ảnh đơn hàng lúc nhận (upload khi tạo phiếu)
  products: WarrantyProduct[];    // Danh sách sản phẩm bảo hành
  processedImages?: string[];     // Hình ảnh đơn hàng đã xử lý xong (upload sau khi xử lý)
  
  // ====================================
  // Trạng thái
  // ====================================
  status: WarrantyStatus;         // Trạng thái phiếu (Mới/Chưa xử lý/Đã xử lý/Đã trả)
  settlementStatus?: WarrantySettlementStatus; // Trạng thái thanh toán (Chưa thanh toán/Thanh toán một phần/Đã thanh toán)
  stockDeducted?: boolean;        // ✅ Flag: Đã trừ kho khi completed (tránh trừ lại khi reopen)
  
  // ====================================
  // Timestamps theo trạng thái
  // ====================================
  processingStartedAt?: string;   // Thời điểm bắt đầu xử lý (new -> pending)
  processedAt?: string;           // Thời điểm xử lý xong (pending -> processed)
  returnedAt?: string;            // Thời điểm trả hàng (processed -> returned)
  cancelledAt?: string;           // Thời điểm hủy (nếu có)
  cancelReason?: string;          // ✅ Lý do hủy (khi hủy phiếu)
  
  // ====================================
  // Liên kết với đơn hàng
  // ====================================
  linkedOrderSystemId?: string;   // ✅ Link to order (chỉ dùng systemId)
  
  // ====================================
  // ❌ DEPRECATED - No longer used after simplification
  // ====================================
  // version: number;                // REMOVED - Version control không cần thiết
  // previousVersions?: {...}[];     // REMOVED - Không track versions nữa
  // settlement?: WarrantySettlement; // REMOVED - Chuyển sang module vouchers (phiếu thu/chi)
  
  // ====================================
  // Ghi chú
  // ====================================
  notes?: string;                 // Ghi chú đơn hàng
  
  // ====================================
  // Tổng hợp
  // ====================================
  summary: {
    totalProducts: number;        // Tổng số sản phẩm gửi bảo hành
    totalReplaced: number;        // Số lượng được đổi trả
    totalReturned?: number;       // Số lượng trả lại khách
    totalDeduction: number;       // Tổng tiền trừ
    totalOutOfStock?: number;     // Số lượng hết hàng (cần bù trừ)
    totalSettlement?: number;     // Tổng tiền cần bù trừ (⚠️ Rename suggestion: totalRefund)
  };
  
  // ====================================
  // ❌ DEPRECATED - Bù trừ thanh toán (Moved to vouchers module)
  // ====================================
  // settlement?: WarrantySettlement; // REMOVED - Use vouchers (phiếu thu/chi) instead
  
  // ====================================
  // Lịch sử thao tác
  // ====================================
  history: WarrantyHistory[];     // Lịch sử tất cả thao tác
  
  // ====================================
  // Bình luận
  // ====================================
  comments: WarrantyComment[];    // Danh sách bình luận
  
  // ====================================
  // Quy trình xử lý (Subtasks)
  // ====================================
  subtasks?: Subtask[];           // Danh sách công việc cần thực hiện
  
  // ====================================
  // Audit fields
  // ====================================
  createdBy: string;              // Người tạo (tên nhân viên)
  createdAt: string;              // Ngày tạo (ISO datetime)
  updatedAt: string;              // Ngày cập nhật cuối (ISO datetime)
}

// ====================================
// Form values cho React Hook Form
// ====================================
export interface WarrantyFormValues {
  // ===== ID =====
  id?: string;                    // Mã phiếu bảo hành (VD: BH00000001) - user có thể sửa
  
  // ===== Section 1: Thông tin khách hàng (REUSE CustomerSelector) =====
  customer: any;                  // Customer object from CustomerSelector
  
  // ===== Section 2: Thông tin bổ sung (Adapted OrderInfoCard) =====
  branchSystemId: string;         // Bán tại (chi nhánh) - required
  employeeSystemId: string;       // Làm bởi (nhân viên) - required
  trackingCode: string;           // Mã vận đơn (required)
  shippingFee?: number;           // Phí cước
  referenceUrl?: string;          // Đường dẫn (URL)
  externalReference?: string;     // Mã tham chiếu
  
  // ===== Section 2B: Hình ảnh (50-50) =====
  receivedImages: string[];       // Hình ảnh đơn hàng lúc nhận (required)
  processedImages?: string[];     // Hình ảnh đã xử lý (thêm sau)
  
  // ===== Section 3: Thông tin sản phẩm (Warranty-specific) =====
  products: WarrantyProduct[];    // Sản phẩm bảo hành (có thể tạo ngay)
  
  // ===== Section 4: Ghi chú (REUSE OrderNotes) =====
  notes?: string;                 // Ghi chú đơn hàng
  
  // ===== Section 5: Thanh toán (Adapted OrderSummary) =====
  status: WarrantyStatus;         // Trạng thái phiếu
  
  // ===== Bù trừ (inline trong card thanh toán) =====
  settlementMethod?: string;      // 'cash' | 'transfer' | 'debt' | 'voucher' | 'order_deduction'
  settlementAmount?: number;      // Số tiền bù trừ
  settlementBankAccount?: string; // Số tài khoản (transfer)
  settlementTransactionCode?: string; // Mã giao dịch (transfer)
  settlementDueDate?: string;     // Ngày hẹn trả (debt)
  settlementVoucherCode?: string; // Mã voucher (voucher)
  linkedOrderSystemId?: string;   // ✅ Link to order (chỉ dùng systemId)
}
