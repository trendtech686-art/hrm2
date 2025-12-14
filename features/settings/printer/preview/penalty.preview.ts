import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu phạt
 * Đồng bộ với: variables/phieu-phat.ts
 */
export const PENALTY_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung (chỉ lấy thông tin cửa hàng)
  '{store_logo}': SHARED_PREVIEW_DATA['{store_logo}'],
  '{store_name}': SHARED_PREVIEW_DATA['{store_name}'],
  '{store_address}': SHARED_PREVIEW_DATA['{store_address}'],
  '{account_name}': SHARED_PREVIEW_DATA['{account_name}'],

  // === THÔNG TIN PHIẾU ===
  '{penalty_code}': 'XP000045',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '08:30',

  // === THÔNG TIN NHÂN VIÊN ===
  '{employee_name}': 'Lê Văn C',
  '{employee_code}': 'NV00123',
  '{department_name}': 'Bộ phận Bán hàng',
  '{position_name}': 'Nhân viên kinh doanh',

  // === NỘI DUNG VI PHẠM ===
  '{violation_type}': 'Vi phạm nội quy',
  '{violation_date}': '04/12/2025',
  '{violation_description}': 'Đi làm muộn quá 30 phút không có lý do chính đáng',
  '{evidence}': 'Hệ thống chấm công ghi nhận',
  '{violation_count}': '2',

  // === HÌNH THỨC XỬ PHẠT ===
  '{penalty_type}': 'Trừ lương',
  '{penalty_amount}': '200,000',
  '{penalty_amount_text}': 'Hai trăm nghìn đồng',
  '{penalty_note}': 'Nhân viên đã ký nhận và cam kết không tái phạm',
};
