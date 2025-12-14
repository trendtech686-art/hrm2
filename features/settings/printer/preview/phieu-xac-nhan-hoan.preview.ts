/**
 * Preview data for Phiếu xác nhận hoàn (phieu-xac-nhan-hoan)
 * Dữ liệu mẫu cho Phiếu xác nhận hoàn hàng từ shipper
 */
import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PHIEU_XAC_NHAN_HOAN_PREVIEW: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,

  // Thông tin
  hand_over_code: 'XNH-2024-001234',
  shipping_provider_name: 'Giao Hàng Tiết Kiệm',
  service_name: 'Giao hàng nhanh',
  total_cod: '2,200,000',
  order_code: 'DH-2024-005679',
  shipping_name: 'Lê Văn C',
  shipping_phone: '0923 456 789',
  shipping_phone_hide: '0923 *** 789',
  printed_on: '05/12/2024',
  district: 'Quận Bình Thạnh',
  quantity: '2',
  current_account_name: 'Nhân viên B',
  shipment_code: 'GHTK-987654321',
  shipping_address: '321 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM',
  cod: '1,100,000',
  note: 'Khách không nhận hàng - hoàn lại',
  city: 'TP. Hồ Chí Minh',
};
