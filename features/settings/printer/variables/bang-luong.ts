import { TemplateVariable } from '../types';

export const BANG_LUONG_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_province}', label: 'Tỉnh thành', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },

  // Thông tin bảng lương
  { key: '{batch_code}', label: 'Mã bảng lương', group: 'Thông tin bảng lương' },
  { key: '{batch_title}', label: 'Tiêu đề bảng lương', group: 'Thông tin bảng lương' },
  { key: '{batch_status}', label: 'Trạng thái', group: 'Thông tin bảng lương' },
  { key: '{pay_period}', label: 'Kỳ lương', group: 'Thông tin bảng lương' },
  { key: '{pay_period_start}', label: 'Ngày bắt đầu kỳ', group: 'Thông tin bảng lương' },
  { key: '{pay_period_end}', label: 'Ngày kết thúc kỳ', group: 'Thông tin bảng lương' },
  { key: '{payroll_date}', label: 'Ngày thanh toán', group: 'Thông tin bảng lương' },
  { key: '{reference_months}', label: 'Tháng tham chiếu', group: 'Thông tin bảng lương' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin bảng lương' },
  { key: '{created_by}', label: 'Người tạo', group: 'Thông tin bảng lương' },
  { key: '{locked_on}', label: 'Ngày khóa', group: 'Thông tin bảng lương' },
  { key: '{locked_by}', label: 'Người khóa', group: 'Thông tin bảng lương' },
  { key: '{notes}', label: 'Ghi chú', group: 'Thông tin bảng lương' },

  // Tổng kết
  { key: '{total_employees}', label: 'Tổng số nhân viên', group: 'Tổng kết' },
  { key: '{total_gross}', label: 'Tổng thu nhập', group: 'Tổng kết' },
  { key: '{total_gross_text}', label: 'Tổng thu nhập (chữ)', group: 'Tổng kết' },
  { key: '{total_earnings}', label: 'Tổng khoản cộng', group: 'Tổng kết' },
  { key: '{total_deductions}', label: 'Tổng khoản trừ', group: 'Tổng kết' },
  { key: '{total_contributions}', label: 'Tổng đóng góp', group: 'Tổng kết' },
  { key: '{total_net}', label: 'Tổng thực lĩnh', group: 'Tổng kết' },
  { key: '{total_net_text}', label: 'Tổng thực lĩnh (chữ)', group: 'Tổng kết' },
];

// Biến chi tiết phiếu lương từng nhân viên
export const PHIEU_LUONG_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },

  // Thông tin phiếu lương
  { key: '{payslip_code}', label: 'Mã phiếu lương', group: 'Thông tin phiếu lương' },
  { key: '{batch_code}', label: 'Mã bảng lương', group: 'Thông tin phiếu lương' },
  { key: '{batch_title}', label: 'Tiêu đề bảng lương', group: 'Thông tin phiếu lương' },
  { key: '{pay_period}', label: 'Kỳ lương', group: 'Thông tin phiếu lương' },
  { key: '{payroll_date}', label: 'Ngày thanh toán', group: 'Thông tin phiếu lương' },

  // Thông tin nhân viên
  { key: '{employee_code}', label: 'Mã nhân viên', group: 'Thông tin nhân viên' },
  { key: '{employee_name}', label: 'Tên nhân viên', group: 'Thông tin nhân viên' },
  { key: '{department_name}', label: 'Phòng ban', group: 'Thông tin nhân viên' },
  { key: '{position}', label: 'Chức vụ', group: 'Thông tin nhân viên' },

  // Chi tiết lương
  { key: '{total_earnings}', label: 'Tổng thu nhập', group: 'Chi tiết lương' },
  { key: '{total_deductions}', label: 'Tổng khấu trừ', group: 'Chi tiết lương' },
  { key: '{total_contributions}', label: 'Tổng đóng góp', group: 'Chi tiết lương' },
  { key: '{taxable_income}', label: 'Thu nhập chịu thuế', group: 'Chi tiết lương' },
  { key: '{social_insurance_base}', label: 'Lương tính BHXH', group: 'Chi tiết lương' },
  { key: '{penalty_deductions}', label: 'Khấu trừ phạt', group: 'Chi tiết lương' },
  { key: '{other_deductions}', label: 'Khấu trừ khác', group: 'Chi tiết lương' },
  { key: '{net_pay}', label: 'Thực lĩnh', group: 'Chi tiết lương' },
  { key: '{net_pay_text}', label: 'Thực lĩnh (chữ)', group: 'Chi tiết lương' },

  // Bảo hiểm chi tiết
  { key: '{total_insurance}', label: 'Tổng bảo hiểm NV đóng', group: 'Bảo hiểm' },
  { key: '{bhxh_amount}', label: 'BHXH (8%)', group: 'Bảo hiểm' },
  { key: '{bhyt_amount}', label: 'BHYT (1.5%)', group: 'Bảo hiểm' },
  { key: '{bhtn_amount}', label: 'BHTN (1%)', group: 'Bảo hiểm' },
  
  // Giảm trừ gia cảnh
  { key: '{personal_deduction}', label: 'Giảm trừ bản thân', group: 'Giảm trừ' },
  { key: '{dependent_deduction}', label: 'Giảm trừ người phụ thuộc', group: 'Giảm trừ' },
  { key: '{dependents_count}', label: 'Số người phụ thuộc', group: 'Giảm trừ' },
  
  // Thuế TNCN
  { key: '{personal_income_tax}', label: 'Thuế TNCN', group: 'Thuế' },
];

// Biến cho dòng chi tiết (line items)
export const BANG_LUONG_LINE_ITEM_VARIABLES: TemplateVariable[] = [
  { key: '{line_stt}', label: 'STT', group: 'Dòng chi tiết' },
  { key: '{employee_code}', label: 'Mã NV', group: 'Dòng chi tiết' },
  { key: '{employee_name}', label: 'Tên NV', group: 'Dòng chi tiết' },
  { key: '{department_name}', label: 'Phòng ban', group: 'Dòng chi tiết' },
  { key: '{earnings}', label: 'Thu nhập', group: 'Dòng chi tiết' },
  { key: '{deductions}', label: 'Khấu trừ', group: 'Dòng chi tiết' },
  { key: '{contributions}', label: 'Đóng góp', group: 'Dòng chi tiết' },
  { key: '{net_pay}', label: 'Thực lĩnh', group: 'Dòng chi tiết' },
];

export const PHIEU_LUONG_COMPONENT_VARIABLES: TemplateVariable[] = [
  { key: '{line_stt}', label: 'STT', group: 'Dòng thành phần lương' },
  { key: '{component_code}', label: 'Mã', group: 'Dòng thành phần lương' },
  { key: '{component_name}', label: 'Tên thành phần', group: 'Dòng thành phần lương' },
  { key: '{component_category}', label: 'Loại', group: 'Dòng thành phần lương' },
  { key: '{component_amount}', label: 'Số tiền', group: 'Dòng thành phần lương' },
];
