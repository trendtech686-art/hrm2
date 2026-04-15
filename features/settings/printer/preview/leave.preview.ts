import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Đơn nghỉ phép
 * Đồng bộ với: variables/don-nghi-phep.ts
 */
export const LEAVE_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  '{store_logo}': SHARED_PREVIEW_DATA['{store_logo}'],
  '{store_name}': SHARED_PREVIEW_DATA['{store_name}'],
  '{store_address}': SHARED_PREVIEW_DATA['{store_address}'],
  '{store_phone_number}': SHARED_PREVIEW_DATA['{store_phone_number}'] || '0909 123 456',
  '{account_name}': SHARED_PREVIEW_DATA['{account_name}'],

  // === THÔNG TIN ĐƠN ===
  '{leave_code}': 'NP000012',
  '{created_on}': '01/03/2026',
  '{created_on_time}': '09:15',
  '{request_date}': '01/03/2026',

  // === THÔNG TIN NHÂN VIÊN ===
  '{employee_name}': 'Nguyễn Văn An',
  '{employee_code}': 'NV00045',
  '{employee_phone}': '0912 345 678',
  '{employee_email}': 'an.nguyen@company.com',
  '{department_name}': 'Bộ phận Kinh doanh',
  '{position_name}': 'Nhân viên bán hàng',

  // === THÔNG TIN NGHỈ PHÉP ===
  '{leave_type_name}': 'Nghỉ phép năm',
  '{leave_paid}': 'Có lương',
  '{start_date}': '05/03/2026',
  '{end_date}': '07/03/2026',
  '{date_range}': '05/03/2026 - 07/03/2026',
  '{number_of_days}': '3',
  '{reason}': 'Nghỉ phép để giải quyết việc gia đình',

  // === PHÊ DUYỆT ===
  '{status}': 'Đã duyệt',
  '{approved_by}': 'Trần Thị B',
  '{approved_date}': '02/03/2026',
  '{rejected_by}': '',
  '{rejected_date}': '',
  '{rejection_reason}': '',

  // === GHI CHÚ ===
  '{note}': 'Đã bàn giao công việc cho đồng nghiệp',

  // === NGÀY IN ===
  '{print_date}': '04/03/2026',
  '{print_time}': '10:00',
};
