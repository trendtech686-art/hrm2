import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const PRICE_ADJUSTMENT_PREVIEW_DATA: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,
  
  // Thông tin phiếu
  '{adjustment_code}': 'DCGB000001',
  '{code}': 'DCGB000001',
  '{pricing_policy}': 'Bảng giá bán lẻ',
  '{created_on}': '15/01/2024',
  '{created_on_time}': '09:30',
  '{confirmed_on}': '15/01/2024 10:00',
  '{cancelled_on}': '',
  '{status}': 'Đã xác nhận',
  '{reason}': 'Điều chỉnh giá theo thị trường',
  '{note}': 'Cập nhật giá bán theo chương trình khuyến mãi',
  
  // Người lập/xác nhận
  '{account_name}': 'Nguyễn Văn A',
  '{confirmed_by}': 'Trần Thị B',
  
  // Line items
  '{line_stt}': '1',
  '{line_product_code}': 'SP001',
  '{line_product_name}': 'Áo thun nam basic',
  '{line_old_price}': '199,000 đ',
  '{line_new_price}': '249,000 đ',
  '{line_difference}': '+50,000 đ',
  
  // Tổng cộng
  '{total_items}': '5',
  '{total_old_value}': '1,500,000 đ',
  '{total_new_value}': '1,750,000 đ',
  '{total_difference}': '+250,000 đ',
};
