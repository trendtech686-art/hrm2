import { TemplateVariable } from '../types';

export const PHIEU_PHAT_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  
  // Thông tin phiếu
  { key: '{penalty_code}', label: 'Mã phiếu phạt', group: 'Thông tin phiếu' },
  { key: '{created_on}', label: 'Ngày lập', group: 'Thông tin phiếu' },
  { key: '{created_on_time}', label: 'Thời gian lập', group: 'Thông tin phiếu' },
  
  // Thông tin nhân viên
  { key: '{employee_name}', label: 'Họ tên nhân viên', group: 'Thông tin nhân viên' },
  { key: '{employee_code}', label: 'Mã nhân viên', group: 'Thông tin nhân viên' },
  { key: '{department_name}', label: 'Bộ phận', group: 'Thông tin nhân viên' },
  { key: '{position_name}', label: 'Chức vụ', group: 'Thông tin nhân viên' },
  
  // Nội dung vi phạm
  { key: '{violation_type}', label: 'Loại vi phạm', group: 'Nội dung vi phạm' },
  { key: '{violation_date}', label: 'Ngày vi phạm', group: 'Nội dung vi phạm' },
  { key: '{violation_description}', label: 'Mô tả vi phạm', group: 'Nội dung vi phạm' },
  { key: '{evidence}', label: 'Bằng chứng', group: 'Nội dung vi phạm' },
  { key: '{violation_count}', label: 'Lần vi phạm thứ', group: 'Nội dung vi phạm' },
  
  // Hình thức xử phạt
  { key: '{penalty_type}', label: 'Hình thức phạt', group: 'Hình thức xử phạt' },
  { key: '{penalty_amount}', label: 'Số tiền phạt', group: 'Hình thức xử phạt' },
  { key: '{penalty_amount_text}', label: 'Số tiền phạt bằng chữ', group: 'Hình thức xử phạt' },
  { key: '{penalty_note}', label: 'Ghi chú', group: 'Hình thức xử phạt' },
  
  // Người lập
  { key: '{account_name}', label: 'Người lập phiếu', group: 'Người lập' },
];
