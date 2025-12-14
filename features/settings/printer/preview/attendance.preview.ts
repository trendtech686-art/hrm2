/**
 * Attendance Preview Data - Bảng chấm công
 * Dữ liệu mẫu cho preview mẫu in bảng chấm công
 */

import { SHARED_PREVIEW_DATA } from './_shared.preview';

export const ATTENDANCE_PREVIEW_DATA: Record<string, string> = {
  ...SHARED_PREVIEW_DATA,
  
  // Thông tin bảng chấm công
  '{month_year}': '12/2024',
  '{month}': '12',
  '{year}': '2024',
  '{department_name}': 'Tất cả phòng ban',
  '{is_locked}': 'Đã khóa',
  '{created_on}': '01/01/2025',
  '{created_by}': 'Nguyễn Văn A',
  
  // Tổng kết
  '{total_employees}': '15',
  '{total_work_days}': '330',
  '{total_leave_days}': '12',
  '{total_absent_days}': '3',
  '{total_late_arrivals}': '8',
  '{total_early_departures}': '5',
  '{total_ot_hours}': '45',
};

// Preview line items cho bảng chấm công
export const ATTENDANCE_PREVIEW_LINE_ITEMS: Record<string, string>[] = [
  {
    '{line_index}': '1',
    '{employee_code}': 'NV001',
    '{employee_name}': 'Nguyễn Văn A',
    '{department_name}': 'Kỹ thuật',
    '{work_days}': '22',
    '{leave_days}': '0',
    '{absent_days}': '0',
    '{late_arrivals}': '1',
    '{early_departures}': '0',
    '{ot_hours}': '5',
    '{day_1}': '✓',
    '{day_2}': '✓',
    '{day_3}': '✓',
    '{day_4}': '✓',
    '{day_5}': '✓',
    '{day_6}': '-',
    '{day_7}': '-',
  },
  {
    '{line_index}': '2',
    '{employee_code}': 'NV002',
    '{employee_name}': 'Trần Thị B',
    '{department_name}': 'Kinh doanh',
    '{work_days}': '21',
    '{leave_days}': '1',
    '{absent_days}': '0',
    '{late_arrivals}': '2',
    '{early_departures}': '1',
    '{ot_hours}': '3',
    '{day_1}': '✓',
    '{day_2}': 'P',
    '{day_3}': '✓',
    '{day_4}': '✓',
    '{day_5}': '✓',
    '{day_6}': '-',
    '{day_7}': '-',
  },
  {
    '{line_index}': '3',
    '{employee_code}': 'NV003',
    '{employee_name}': 'Lê Văn C',
    '{department_name}': 'Nhân sự',
    '{work_days}': '20',
    '{leave_days}': '1',
    '{absent_days}': '1',
    '{late_arrivals}': '0',
    '{early_departures}': '0',
    '{ot_hours}': '0',
    '{day_1}': '✓',
    '{day_2}': '✓',
    '{day_3}': 'X',
    '{day_4}': '✓',
    '{day_5}': 'P',
    '{day_6}': '-',
    '{day_7}': '-',
  },
];
