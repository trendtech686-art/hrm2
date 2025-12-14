import { TemplateVariable } from '../types';

export const BANG_CHAM_CONG_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_province}', label: 'Tỉnh thành', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },

  // Thông tin bảng chấm công
  { key: '{month_year}', label: 'Tháng/Năm', group: 'Thông tin bảng chấm công' },
  { key: '{month}', label: 'Tháng', group: 'Thông tin bảng chấm công' },
  { key: '{year}', label: 'Năm', group: 'Thông tin bảng chấm công' },
  { key: '{department_name}', label: 'Phòng ban', group: 'Thông tin bảng chấm công' },
  { key: '{is_locked}', label: 'Trạng thái khóa', group: 'Thông tin bảng chấm công' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin bảng chấm công' },
  { key: '{created_by}', label: 'Người tạo', group: 'Thông tin bảng chấm công' },

  // Tổng kết
  { key: '{total_employees}', label: 'Tổng số nhân viên', group: 'Tổng kết' },
  { key: '{total_work_days}', label: 'Tổng ngày công', group: 'Tổng kết' },
  { key: '{total_leave_days}', label: 'Tổng ngày nghỉ', group: 'Tổng kết' },
  { key: '{total_absent_days}', label: 'Tổng ngày vắng', group: 'Tổng kết' },
  { key: '{total_late_arrivals}', label: 'Tổng lần đi trễ', group: 'Tổng kết' },
  { key: '{total_early_departures}', label: 'Tổng lần về sớm', group: 'Tổng kết' },
  { key: '{total_ot_hours}', label: 'Tổng giờ tăng ca', group: 'Tổng kết' },
];

// Biến cho dòng chi tiết (line items)
export const BANG_CHAM_CONG_LINE_ITEM_VARIABLES: TemplateVariable[] = [
  { key: '{line_index}', label: 'STT', group: 'Dòng chi tiết' },
  { key: '{employee_code}', label: 'Mã NV', group: 'Dòng chi tiết' },
  { key: '{employee_name}', label: 'Tên NV', group: 'Dòng chi tiết' },
  { key: '{department_name}', label: 'Phòng ban', group: 'Dòng chi tiết' },
  { key: '{work_days}', label: 'Ngày công', group: 'Dòng chi tiết' },
  { key: '{leave_days}', label: 'Ngày nghỉ', group: 'Dòng chi tiết' },
  { key: '{absent_days}', label: 'Ngày vắng', group: 'Dòng chi tiết' },
  { key: '{late_arrivals}', label: 'Đi trễ', group: 'Dòng chi tiết' },
  { key: '{early_departures}', label: 'Về sớm', group: 'Dòng chi tiết' },
  { key: '{ot_hours}', label: 'Giờ làm thêm', group: 'Dòng chi tiết' },
  // Các ngày trong tháng (day_1 đến day_31)
  ...Array.from({ length: 31 }, (_, i) => ({
    key: `{day_${i + 1}}`,
    label: `Ngày ${i + 1}`,
    group: 'Ngày trong tháng',
  })),
];

// Biến cho chi tiết chấm công từng nhân viên
export const CHI_TIET_CHAM_CONG_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },

  // Thông tin nhân viên
  { key: '{employee_code}', label: 'Mã nhân viên', group: 'Thông tin nhân viên' },
  { key: '{employee_name}', label: 'Tên nhân viên', group: 'Thông tin nhân viên' },
  { key: '{department_name}', label: 'Phòng ban', group: 'Thông tin nhân viên' },

  // Thông tin kỳ
  { key: '{month_year}', label: 'Tháng/Năm', group: 'Thông tin kỳ' },

  // Tổng kết cá nhân
  { key: '{work_days}', label: 'Ngày công', group: 'Tổng kết' },
  { key: '{leave_days}', label: 'Ngày nghỉ', group: 'Tổng kết' },
  { key: '{absent_days}', label: 'Ngày vắng', group: 'Tổng kết' },
  { key: '{late_arrivals}', label: 'Đi trễ', group: 'Tổng kết' },
  { key: '{early_departures}', label: 'Về sớm', group: 'Tổng kết' },
  { key: '{ot_hours}', label: 'Giờ tăng ca', group: 'Tổng kết' },
];

// Biến cho chi tiết từng ngày
export const CHI_TIET_CHAM_CONG_LINE_ITEM_VARIABLES: TemplateVariable[] = [
  { key: '{line_index}', label: 'STT', group: 'Dòng chi tiết ngày' },
  { key: '{day}', label: 'Ngày', group: 'Dòng chi tiết ngày' },
  { key: '{day_of_week}', label: 'Thứ', group: 'Dòng chi tiết ngày' },
  { key: '{status}', label: 'Trạng thái', group: 'Dòng chi tiết ngày' },
  { key: '{check_in}', label: 'Giờ vào', group: 'Dòng chi tiết ngày' },
  { key: '{check_out}', label: 'Giờ ra', group: 'Dòng chi tiết ngày' },
  { key: '{ot_check_in}', label: 'OT vào', group: 'Dòng chi tiết ngày' },
  { key: '{ot_check_out}', label: 'OT ra', group: 'Dòng chi tiết ngày' },
  { key: '{notes}', label: 'Ghi chú', group: 'Dòng chi tiết ngày' },
];
