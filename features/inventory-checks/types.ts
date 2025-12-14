/**
 * Inventory Check Types
 * Kiểm kê định kỳ hàng hóa
 */

import { SystemId, BusinessId } from '../../lib/id-types.ts';
import type { HistoryEntry } from '../../components/ActivityHistory.tsx';

export type InventoryCheckStatus = 'draft' | 'balanced' | 'cancelled';

export type DifferenceReason = 
  | 'other'       // Khác
  | 'damaged'     // Hư Hỏng
  | 'wear'        // Hao Mòn
  | 'return'      // Trả Hàng
  | 'transfer'    // Chuyển Hàng
  | 'production'; // Sản Xuất Sản Phẩm

export interface InventoryCheckItem {
  productSystemId: SystemId;  // Foreign key - PRODUCT000001
  productId: BusinessId;      // Display ID - SP000001
  productName: string;
  unit: string;
  systemQuantity: number;     // Số lượng hệ thống
  actualQuantity: number;     // Số lượng thực tế
  difference: number;         // Chênh lệch (actualQuantity - systemQuantity)
  reason?: DifferenceReason;  // Lý do chênh lệch
  note?: string;              // Ghi chú
}

export interface InventoryCheck {
  systemId: SystemId;         // Internal ID: INVCHECK000001 (English prefix)
  id: BusinessId;             // User-facing ID: PKK000001 (Vietnamese prefix)
  branchSystemId: SystemId;   // Foreign key - BRANCH000001
  branchName: string;         // Display only
  status: InventoryCheckStatus;
  createdBy: SystemId;        // User systemId
  createdAt: string;
  balancedAt?: string;        // Thời điểm cân bằng
  balancedBy?: SystemId;      // Người cân bằng (user systemId)
  cancelledAt?: string;       // Thời điểm hủy
  cancelledBy?: SystemId;     // Người hủy (user systemId)
  cancelledReason?: string;   // Lý do hủy
  note?: string;
  items: InventoryCheckItem[];
  activityHistory?: HistoryEntry[];  // Lịch sử hoạt động
}
