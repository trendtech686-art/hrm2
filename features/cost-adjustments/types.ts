import { type SystemId, type BusinessId } from "@/lib/id-types";

/**
 * Loại điều chỉnh giá vốn
 * - 'manual': Điều chỉnh thủ công
 * - 'import': Từ đơn nhập hàng
 * - 'batch': Điều chỉnh hàng loạt
 */
export type CostAdjustmentType = 'manual' | 'import' | 'batch';

/**
 * Trạng thái điều chỉnh
 * - 'draft': Nháp
 * - 'confirmed': Đã xác nhận
 * - 'cancelled': Đã hủy
 */
export type CostAdjustmentStatus = 'draft' | 'confirmed' | 'cancelled';

/**
 * Item trong phiếu điều chỉnh giá vốn
 */
export type CostAdjustmentItem = {
  productSystemId: SystemId;
  productId: string; // Business ID for display
  productName: string;
  productImage?: string;
  oldCostPrice: number; // Giá vốn cũ
  newCostPrice: number; // Giá vốn mới
  adjustmentAmount: number; // Chênh lệch = newCostPrice - oldCostPrice
  adjustmentPercent: number; // Phần trăm thay đổi
  reason?: string; // Lý do điều chỉnh riêng cho sản phẩm này
};

/**
 * Phiếu điều chỉnh giá vốn
 */
export type CostAdjustment = {
  systemId: SystemId;
  id: BusinessId; // DCGV000001
  
  type: CostAdjustmentType;
  status: CostAdjustmentStatus;
  
  items: CostAdjustmentItem[];
  
  // Metadata
  note?: string;
  reason?: string; // Lý do điều chỉnh chung
  
  // Reference
  referenceCode?: string; // Mã tham chiếu (ví dụ: mã đơn nhập hàng)
  
  // Audit fields
  createdDate: string;
  createdBySystemId: SystemId;
  createdByName: string;
  
  confirmedDate?: string;
  confirmedBySystemId?: SystemId;
  confirmedByName?: string;
  
  cancelledDate?: string;
  cancelledBySystemId?: SystemId;
  cancelledByName?: string;
  cancelReason?: string;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
