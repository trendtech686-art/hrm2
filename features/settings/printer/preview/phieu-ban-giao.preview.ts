/**
 * Preview data for Phiếu bàn giao (phieu-ban-giao)
 * Dữ liệu mẫu cho Phiếu bàn giao đơn hàng cho shipper
 */
import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PHIEU_BAN_GIAO_PREVIEW: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,

  // Thông tin
  hand_over_code: 'BG-2024-001234',
  shipping_provider_name: 'Giao Hàng Nhanh',
  service_name: 'Giao hàng tiêu chuẩn',
  total_cod: '5,500,000',
  order_code: 'DH-2024-005678',
  shipping_name: 'Trần Văn B',
  shipping_phone: '0912 345 678',
  shipping_phone_hide: '0912 *** 678',
  printed_on: '05/12/2024',
  freight_amount: '30,000',
  district: 'Quận 7',
  quantity: '5',
  current_account_name: 'Nhân viên A',
  shipment_code: 'GHN-123456789',
  shipping_address: '789 Nguyễn Thị Thập, Quận 7, TP.HCM',
  cod: '1,100,000',
  note: 'Giao hàng trước 17h',
  city: 'TP. Hồ Chí Minh',
  freight_payer: 'Người nhận',
  total_freight_amount: '150,000',
};
