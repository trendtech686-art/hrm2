/**
 * Preview data for Phiếu tổng kết bán hàng (phieu-tong-ket-ban-hang)
 * Dữ liệu mẫu cho Phiếu tổng kết bán hàng theo ngày/ca
 */
import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PHIEU_TONG_KET_BAN_HANG_PREVIEW: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,

  // Thông tin
  date_print: '05/12/2024',
  time_print: '23:30',
  time_filter: '05/12/2024',
  source_name: 'Bán tại quầy',
  total_quantity_order_finished: '45',
  total_quantity_line_item_fulfillment: '156',
  total_quantity_line_item_return: '3',
  total_line_amount: '78,500,000',
  total_order_payment: '75,200,000',
  total_order_return_payment: '1,050,000',
  total_real_receipt: '74,150,000',
  real_receipt_cash: '35,000,000',
  real_receipt_transfer: '25,000,000',
  real_receipt_mpos: '10,000,000',
  real_receipt_cod: '3,150,000',
  real_receipt_online: '1,000,000',
  debt: '3,300,000',
  receipt_in_day: '80,000,000',
  receipt_cash: '38,000,000',
  receipt_transfer: '27,000,000',
  receipt_mpos: '11,000,000',
  receipt_cod: '3,000,000',
  receipt_online: '1,000,000',
  payment_in_day: '5,850,000',
  payment_cash: '3,000,000',
  payment_transfer: '2,500,000',
  payment_mpos: '350,000',

  // Chi tiết đơn hàng bán
  stt_order_finish: '1',
  order_code: 'DH-2024-005678',
  amount_order_finished: '1,750,000',
  discount_order_finished: '87,500',
  tax_order_finished: '166,250',
  total_order_finished: '1,828,750',

  // Chi tiết hàng bán
  stt_item_fulfillment: '1',
  sku_fulfillment: 'ATN-001-WH-XL',
  variant_name_fulfillment: 'Áo thun nam - Trắng / XL',
  quantity_item_fulfilment: '5',
  amount_item_fulfilment: '1,750,000',

  // Chi tiết hàng trả
  stt_item_return: '1',
  sku_return: 'ATN-002-BL-M',
  variant_name_return: 'Áo thun nam - Đen / M',
  quantity_item_return: '1',
  amount_item_return: '350,000',

  // Phương thức thanh toán
  payment_method_name: 'Tiền mặt',
  payment_method_amount: '35,000,000',
};
