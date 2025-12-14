import type { SystemId, BusinessId } from '../../lib/id-types.ts';

/**
 * Trạng thái phiếu chuyển kho
 * - pending: Chờ chuyển (vừa tạo, chưa ảnh hưởng tồn kho)
 * - transferring: Đang chuyển (đã xuất khỏi kho gốc, đang trên đường)
 * - completed: Hoàn thành (chi nhánh nhận đã xác nhận)
 * - cancelled: Đã hủy
 */
export type StockTransferStatus = 'pending' | 'transferring' | 'completed' | 'cancelled';

/**
 * Chi tiết sản phẩm trong phiếu chuyển kho
 */
export interface StockTransferItem {
  productSystemId: SystemId;
  productId: BusinessId; // SKU for display
  productName: string;
  quantity: number; // Số lượng chuyển
  receivedQuantity?: number; // Số lượng thực nhận (khi hoàn thành)
  note?: string;
}

/**
 * Phiếu chuyển kho giữa các chi nhánh
 */
export interface StockTransfer {
  systemId: SystemId;
  id: BusinessId; // e.g., PCK001 (Phiếu Chuyển Kho)
  referenceCode?: string; // Mã tham chiếu (ví dụ: mã nội bộ hoặc mã từ hệ thống khác)
  
  // Chi nhánh chuyển
  fromBranchSystemId: SystemId;
  fromBranchName: string;
  
  // Chi nhánh nhận
  toBranchSystemId: SystemId;
  toBranchName: string;
  
  // Trạng thái
  status: StockTransferStatus;
  
  // Danh sách sản phẩm
  items: StockTransferItem[];
  
  // Thông tin tạo phiếu
  createdDate: string; // YYYY-MM-DD HH:mm
  createdBySystemId: SystemId;
  createdByName: string;
  
  // Thông tin xác nhận chuyển (khi status = transferring)
  transferredDate?: string;
  transferredBySystemId?: SystemId;
  transferredByName?: string;
  
  // Thông tin nhận hàng (khi status = completed)
  receivedDate?: string;
  receivedBySystemId?: SystemId;
  receivedByName?: string;
  
  // Thông tin hủy (khi status = cancelled)
  cancelledDate?: string;
  cancelledBySystemId?: SystemId;
  cancelledByName?: string;
  cancelReason?: string;
  
  // Ghi chú
  note?: string;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
}

/**
 * Form data for creating/editing stock transfer
 */
export interface StockTransferFormData {
  fromBranchSystemId: string;
  toBranchSystemId: string;
  referenceCode?: string; // Mã tham chiếu
  items: {
    productSystemId: string;
    quantity: number;
    note?: string;
  }[];
  note?: string;
}
