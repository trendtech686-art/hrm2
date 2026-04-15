import { TemplateVariable } from '../types';

export const DON_NGHI_PHEP_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'Số điện thoại cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  
  // Thông tin đơn nghỉ phép
  { key: '{leave_code}', label: 'Mã đơn nghỉ phép', group: 'Thông tin đơn' },
  { key: '{created_on}', label: 'Ngày lập', group: 'Thông tin đơn' },
  { key: '{created_on_time}', label: 'Thời gian lập', group: 'Thông tin đơn' },
  { key: '{request_date}', label: 'Ngày yêu cầu', group: 'Thông tin đơn' },
  { key: '{account_name}', label: 'Người tạo', group: 'Thông tin đơn' },
  
  // Thông tin nhân viên
  { key: '{employee_name}', label: 'Họ tên nhân viên', group: 'Thông tin nhân viên' },
  { key: '{employee_code}', label: 'Mã nhân viên', group: 'Thông tin nhân viên' },
  { key: '{employee_phone}', label: 'Số điện thoại NV', group: 'Thông tin nhân viên' },
  { key: '{employee_email}', label: 'Email NV', group: 'Thông tin nhân viên' },
  { key: '{department_name}', label: 'Bộ phận', group: 'Thông tin nhân viên' },
  { key: '{position_name}', label: 'Chức vụ', group: 'Thông tin nhân viên' },
  
  // Thông tin nghỉ phép
  { key: '{leave_type_name}', label: 'Loại nghỉ phép', group: 'Thông tin nghỉ phép' },
  { key: '{leave_paid}', label: 'Hình thức (có/không lương)', group: 'Thông tin nghỉ phép' },
  { key: '{start_date}', label: 'Từ ngày', group: 'Thông tin nghỉ phép' },
  { key: '{end_date}', label: 'Đến ngày', group: 'Thông tin nghỉ phép' },
  { key: '{date_range}', label: 'Khoảng thời gian', group: 'Thông tin nghỉ phép' },
  { key: '{number_of_days}', label: 'Số ngày nghỉ', group: 'Thông tin nghỉ phép' },
  { key: '{reason}', label: 'Lý do nghỉ phép', group: 'Thông tin nghỉ phép' },
  
  // Trạng thái phê duyệt
  { key: '{status}', label: 'Trạng thái', group: 'Phê duyệt' },
  { key: '{approved_by}', label: 'Người phê duyệt', group: 'Phê duyệt' },
  { key: '{approved_date}', label: 'Ngày phê duyệt', group: 'Phê duyệt' },
  { key: '{rejected_by}', label: 'Người từ chối', group: 'Phê duyệt' },
  { key: '{rejected_date}', label: 'Ngày từ chối', group: 'Phê duyệt' },
  { key: '{rejection_reason}', label: 'Lý do từ chối', group: 'Phê duyệt' },
  
  // Ghi chú
  { key: '{note}', label: 'Ghi chú', group: 'Khác' },
];
