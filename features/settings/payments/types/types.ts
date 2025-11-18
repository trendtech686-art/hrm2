/**
 * Payment Type (Loại Phiếu Chi - Category/Classification)
 */

export type PaymentType = {
  systemId: string; // Simple string for categories
  id: string; // Mã loại
  name: string; // Tên loại
  description?: string;
  isBusinessResult: boolean; // Hạch toán kết quả kinh doanh
  createdAt: string; // YYYY-MM-DD
  isActive: boolean; // Trạng thái hoạt động
  color?: string; // Màu sắc
};
