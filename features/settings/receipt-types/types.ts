/**
 * Receipt Type (Loại Phiếu Thu - Category/Classification)
 */

import type { BusinessId, SystemId } from '@/lib/id-types';

export type ReceiptType = {
  systemId: SystemId;
  id: BusinessId; // Mã loại
  name: string; // Tên loại
  description?: string | undefined;
  isBusinessResult: boolean; // Hạch toán kết quả kinh doanh
  createdAt: string; // YYYY-MM-DD
  updatedAt?: string;
  createdBy?: SystemId;
  updatedBy?: SystemId;
  isActive: boolean; // Trạng thái hoạt động
  isDefault?: boolean; // Mặc định
  color?: string | undefined; // Màu sắc
};
