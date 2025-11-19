/**
 * Payment Type (Loại Phiếu Chi - Category/Classification)
 */

import type { BusinessId, SystemId } from '@/lib/id-types';

export type PaymentType = {
  systemId: SystemId;
  id: BusinessId; // Mã loại
  name: string; // Tên loại
  description?: string;
  isBusinessResult: boolean; // Hạch toán kết quả kinh doanh
  createdAt: string; // YYYY-MM-DD
  isActive: boolean; // Trạng thái hoạt động
  color?: string; // Màu sắc
};
