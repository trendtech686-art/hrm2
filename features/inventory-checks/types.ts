/**
 * Inventory Check Types
 * Kiểm kê định kỳ hàng hóa
 */

import type { SystemId } from '../../lib/id-config.ts';

export type InventoryCheckStatus = 'draft' | 'balanced' | 'cancelled';

export type DifferenceReason = 
  | 'other'       // Khác
  | 'damaged'     // Hư Hỏng
  | 'wear'        // Hao Mòn
  | 'return'      // Trả Hàng
  | 'transfer'    // Chuyển Hàng
  | 'production'; // Sản Xuất Sản Phẩm

export interface InventoryCheckItem {
  productSystemId: string;    // Foreign key - PROD000001
  productId: string;          // Display ID - SP000001
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
  id: string;                 // User-facing ID: PKK000001 (Vietnamese prefix)
  branchSystemId: string;     // Foreign key - BRANCH000001
  branchName: string;         // Display only
  status: InventoryCheckStatus;
  createdBy: string;          // User systemId
  createdAt: string;
  balancedAt?: string;        // Thời điểm cân bằng
  balancedBy?: string;        // Người cân bằng (user systemId)
  cancelledAt?: string;       // Thời điểm hủy
  cancelledBy?: string;       // Người hủy (user systemId)
  cancelledReason?: string;   // Lý do hủy
  note?: string;
  items: InventoryCheckItem[];
}
