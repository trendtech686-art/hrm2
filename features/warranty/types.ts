/**
 * Warranty Management Types
 * 
 * Hệ thống quản lý bảo hành sản phẩm
 * - Tiếp nhận sản phẩm bảo hành từ khách hàng
 * - Xử lý và theo dõi tình trạng sản phẩm
 * - Ghi log lịch sử thao tác
 */

import type { Subtask } from '../../components/shared/subtask-list.tsx';
import type { SystemId, BusinessId } from '../../lib/id-types.ts';
import type { Customer } from '../customers/types.ts';
import type { WarrantyCustomerInfo } from './types/ui.ts';

export type {
  WarrantyCustomerInfo,
  WarrantyBranchContext,
  WarrantyVoucherDialogBaseProps,
} from './types/ui.ts';
export type { WarrantyStore } from './types/store.ts';

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

export type SettlementStatus = 'pending' | 'partial' | 'completed' | 'cancelled';

export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  pending: 'Chưa bù trừ',
  partial: 'Bù trừ 1 phần',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
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
  systemId: SystemId;               // BRANDED TYPE
  type: Exclude<SettlementType, 'mixed'>; // Không cho nested mixed
  amount: number;
  status: SettlementStatus;
  
  // Thông tin chi tiết theo từng loại
  linkedOrderSystemId?: SystemId | undefined;   // Link to order (BRANDED TYPE)
  paymentVoucherId?: SystemId | undefined;      // Cho cash/transfer (BRANDED TYPE)
  debtTransactionId?: SystemId | undefined;     // Cho debt (BRANDED TYPE)
  voucherCode?: string | undefined;             // Cho voucher
  bankAccount?: string | undefined;             // Cho transfer
  transactionCode?: string | undefined;         // Cho transfer
  dueDate?: string | undefined;                 // Cho debt
  
  notes?: string | undefined;
  createdAt: string;
  completedAt?: string | undefined;
}

// Thông tin bù trừ
export interface WarrantySettlement {
  systemId: SystemId;               // BRANDED TYPE
  warrantyId: SystemId;             // BRANDED TYPE - Reference to warranty ticket
  
  // Thông tin bù trừ
  settlementType: SettlementType;
  totalAmount: number;          // Tổng tiền cần bù trừ
  settledAmount: number;        // Số tiền đã bù trừ
  remainingAmount: number;      // Số tiền còn lại
  
  // Chi tiết sản phẩm không đổi được
  unsettledProducts: UnsettledProduct[];
  
  // Cho single settlement type
  paymentVoucherId?: SystemId | undefined;      // ID phiếu chi (BRANDED TYPE)
  debtTransactionId?: SystemId | undefined;     // ID giao dịch công nợ (BRANDED TYPE)
  voucherCode?: string | undefined;             // Mã voucher (nếu tạo voucher)
  linkedOrderSystemId?: SystemId | undefined;   // Link to order (BRANDED TYPE)
  
  // Cho mixed settlement type
  methods?: SettlementMethod[] | undefined;     // Danh sách các phương thức bù trừ (khi type = 'mixed')
  
  status: SettlementStatus;
  settledAt?: string | undefined;
  settledBy?: SystemId | undefined;             // BRANDED TYPE - Employee who settled
  notes: string;
  createdAt: string;
  updatedAt?: string | undefined;
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
  cancelled: [],              // Đã hủy → Final state
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
  cancelled: {},
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
  systemId: SystemId;             // ID hệ thống (BRANDED TYPE)
  productSystemId?: SystemId | undefined;     // Link to Product entity (BRANDED TYPE)
  sku?: BusinessId | undefined;               // Mã SKU sản phẩm (BRANDED TYPE - Business ID)
  productName: string;            // Tên sản phẩm (textbox)
  quantity?: number | undefined;              // Số lượng (mặc định 1)
  unitPrice?: number | undefined;             // Đơn giá (để tính thành tiền)
  issueDescription: string;       // Tình trạng/Ghi chú (textbox)
  resolution: ResolutionType;     // Cách xử lý (Trả lại/Đổi mới/Trừ tiền)
  deductionAmount?: number | undefined;       // Số tiền trừ (nếu chọn "Trừ tiền")
  productImages: string[];        // Hình ảnh sản phẩm thực tế lúc nhận
  notes?: string | undefined;                 // Ghi chú bổ sung cho sản phẩm
}

// ====================================
// Lịch sử thao tác
// ====================================
export interface WarrantyHistory {
  systemId: SystemId;             // ID hệ thống (BRANDED TYPE)
  action: string;                 // Hành động (VD: "create", "add_product", "update_status", "upload_image")
  actionLabel: string;            // Mô tả hiển thị (VD: "Tạo phiếu", "Thêm sản phẩm #1")
  entityType?: string | undefined;            // Loại đối tượng (VD: "product", "image", "status")
  entityId?: SystemId | undefined;            // ID đối tượng (BRANDED TYPE)
  changes?: {                     // Chi tiết thay đổi (for version control)
    field: string;                // Trường thay đổi
    oldValue: any;                // Giá trị cũ
    newValue: any;                // Giá trị mới
  }[] | undefined;
  performedBy: string;            // Người thực hiện (tên nhân viên)
  performedBySystemId?: SystemId | undefined; // SystemId của nhân viên (BRANDED TYPE)
  performedAt: string;            // Thời gian thực hiện (ISO datetime)
  note?: string | undefined;                  // Ghi chú thêm (optional)
  metadata?: Record<string, any> | undefined; // Metadata cho action (paymentSystemId, receiptSystemId, etc.)
  
  // Link to related documents (BRANDED TYPES)
  linkedOrderSystemId?: SystemId | undefined;   // Link to order (BRANDED TYPE)
  linkedVoucherSystemId?: SystemId | undefined; // Link to payment voucher (BRANDED TYPE)
}

// ====================================
// Comment (Bình luận)
// ====================================
export interface WarrantyComment {
  systemId: SystemId;             // ID hệ thống (BRANDED TYPE)
  content: string;                // Nội dung HTML từ TipTap editor
  contentText: string;            // Nội dung plain text (for search)
  createdBy: string;              // Người comment (tên nhân viên)
  createdBySystemId: SystemId;    // SystemId của nhân viên (BRANDED TYPE)
  createdAt: string;              // Thời gian comment (ISO datetime)
  updatedAt?: string | undefined;             // Thời gian chỉnh sửa (nếu có)
  attachments?: string[] | undefined;         // Hình ảnh đính kèm
  mentions?: SystemId[] | undefined;          // Danh sách systemId nhân viên được tag (BRANDED TYPE)
  parentId?: SystemId | undefined;            // ID comment cha (BRANDED TYPE)
  isEdited?: boolean | undefined;             // Đã chỉnh sửa
  isDeleted?: boolean | undefined;            // Đã xóa (soft delete)
}

// ====================================
// Phiếu bảo hành (Warranty Ticket)
// ====================================
export interface WarrantyTicket {
  // ====================================
  // ID & Basic Info
  // ====================================
  systemId: SystemId;             // ID hệ thống (primary key, duy nhất) - BRANDED TYPE
  id: BusinessId;                 // ID hiển thị/Mã phiếu bảo hành (BRANDED TYPE - Business ID)
  
  // ====================================
  // Thông tin chi nhánh & nhân viên
  // ====================================
  branchSystemId: SystemId;       // Chi nhánh xử lý (BRANDED TYPE)
  branchName: string;             // Tên chi nhánh
  employeeSystemId: SystemId;     // Nhân viên phụ trách (BRANDED TYPE)
  employeeName: string;           // Tên nhân viên
  
  // ====================================
  // Thông tin khách hàng
  // ====================================
  customerSystemId?: SystemId | undefined;    // Link to Customer entity (BRANDED TYPE)
  customerName: string;           // Tên khách hàng
  customerPhone: string;          // Số điện thoại
  customerAddress: string;        // Địa chỉ
  
  // ====================================
  // Thông tin vận chuyển
  // ====================================
  trackingCode: string;           // Mã vận đơn (GHTK, GHN, etc.)
  publicTrackingCode?: string | undefined;    // Mã tra cứu công khai (cho khách hàng)
  shippingFee?: number | undefined;           // Phí cước (optional)
  
  // ====================================
  // Tham chiếu bên ngoài
  // ====================================
  referenceUrl?: string | undefined;          // Đường dẫn (URL)
  externalReference?: string | undefined;     // Mã tham chiếu
  
  // ====================================
  // Hình ảnh & Sản phẩm
  // ====================================
  receivedImages: string[];       // Hình ảnh đơn hàng lúc nhận (upload khi tạo phiếu)
  products: WarrantyProduct[];    // Danh sách sản phẩm bảo hành
  processedImages?: string[] | undefined;     // Hình ảnh đơn hàng đã xử lý xong (upload sau khi xử lý)
  
  // ====================================
  // Trạng thái
  // ====================================
  status: WarrantyStatus;         // Trạng thái phiếu (Mới/Chưa xử lý/Đã xử lý/Đã trả)
  settlementStatus?: WarrantySettlementStatus | undefined; // Trạng thái thanh toán (Chưa thanh toán/Thanh toán một phần/Đã thanh toán)
  stockDeducted?: boolean | undefined;        // Flag: Đã trừ kho khi completed (tránh trừ lại khi reopen)
  
  // ====================================
  // Timestamps theo trạng thái
  // ====================================
  processingStartedAt?: string | undefined;   // Thời điểm bắt đầu xử lý (new -> pending)
  processedAt?: string | undefined;           // Thời điểm xử lý xong (pending -> processed)
  returnedAt?: string | undefined;            // Thời điểm trả hàng (processed -> returned)
  completedAt?: string | undefined;           // Thời điểm kết thúc phiếu (returned -> completed)
  cancelledAt?: string | undefined;           // Thời điểm hủy (nếu có)
  cancelReason?: string | undefined;          // Lý do hủy (khi hủy phiếu)
  
  // ====================================
  // Liên kết với đơn hàng
  // ====================================
  linkedOrderSystemId?: SystemId | undefined; // Link to order (BRANDED TYPE)
  
  // ====================================
  // DEPRECATED - No longer used after simplification
  // ====================================
  // version: number;                // REMOVED - Version control không cần thiết
  // previousVersions?: {...}[];     // REMOVED - Không track versions nữa
  
  // ====================================
  // Ghi chú
  // ====================================
  notes?: string | undefined;                 // Ghi chú đơn hàng
  
  // ====================================
  // Tổng hợp
  // ====================================
  summary: {
    totalProducts: number;        // Tổng số sản phẩm gửi bảo hành
    totalReplaced: number;        // Số lượng được đổi trả
    totalReturned?: number | undefined;       // Số lượng trả lại khách
    totalDeduction: number;       // Tổng tiền trừ
    totalOutOfStock?: number | undefined;     // Số lượng hết hàng (cần bù trừ)
    totalSettlement?: number | undefined;     // Tổng tiền cần bù trừ (Rename suggestion: totalRefund)
  };
  
  // ====================================
  // Thanh toán bù trừ (snapshot Phase 2)
  // ====================================
  settlement?: WarrantySettlement | undefined; // Lưu lịch sử tổng hợp phương thức bù trừ
  
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
  subtasks?: Subtask[] | undefined;           // Danh sách công việc cần thực hiện
  
  // ====================================
  // Audit fields
  // ====================================
  createdBy: string;              // Người tạo (tên nhân viên)
  createdBySystemId?: SystemId | undefined;   // SystemId của người tạo (BRANDED TYPE)
  createdAt: string;              // Ngày tạo (ISO datetime)
  updatedAt: string;              // Ngày cập nhật cuối (ISO datetime)
  updatedBySystemId?: SystemId | undefined;   // SystemId của người cập nhật cuối (BRANDED TYPE)
}

// ====================================
// Form values cho React Hook Form
// ====================================
export interface WarrantyFormValues {
  // ===== ID =====
  id?: BusinessId | undefined;                // Mã phiếu bảo hành (BRANDED TYPE - Business ID)
  
  // ===== Section 1: Thông tin khách hàng (REUSE CustomerSelector) =====
  customer: (Customer | WarrantyCustomerInfo) | null; // CustomerSelector lưu full Customer, fallback snapshot
  
  // ===== Section 2: Thông tin bổ sung (Adapted OrderInfoCard) =====
  branchSystemId: SystemId;       // Bán tại (chi nhánh) - required (BRANDED TYPE)
  employeeSystemId: SystemId;     // Làm bởi (nhân viên) - required (BRANDED TYPE)
  trackingCode: string;           // Mã vận đơn (required)
  shippingFee?: number | undefined;           // Phí cước
  referenceUrl?: string | undefined;          // Đường dẫn (URL)
  externalReference?: string | undefined;     // Mã tham chiếu
  
  // ===== Section 2B: Hình ảnh (50-50) =====
  receivedImages: string[];       // Hình ảnh đơn hàng lúc nhận (required)
  processedImages?: string[] | undefined;     // Hình ảnh đã xử lý (thêm sau)
  
  // ===== Section 3: Thông tin sản phẩm (Warranty-specific) =====
  products: WarrantyProduct[];    // Sản phẩm bảo hành (có thể tạo ngay)
  
  // ===== Section 4: Ghi chú (REUSE OrderNotes) =====
  notes?: string | undefined;                 // Ghi chú đơn hàng
  
  // ===== Section 5: Thanh toán (Adapted OrderSummary) =====
  status: WarrantyStatus;         // Trạng thái phiếu
  
  // ===== Bù trừ (inline trong card thanh toán) =====
  settlementMethod?: string | undefined;      // 'cash' | 'transfer' | 'debt' | 'voucher' | 'order_deduction'
  settlementAmount?: number | undefined;      // Số tiền bù trừ
  settlementBankAccount?: string | undefined; // Số tài khoản (transfer)
  settlementTransactionCode?: string | undefined; // Mã giao dịch (transfer)
  settlementDueDate?: string | undefined;     // Ngày hẹn trả (debt)
  settlementVoucherCode?: string | undefined; // Mã voucher (voucher)
  linkedOrderSystemId?: SystemId | undefined; // Link to order (BRANDED TYPE)
}
