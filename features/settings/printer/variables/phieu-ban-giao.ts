import { TemplateVariable } from '../types';

/**
 * Variables cho Phiếu bàn giao tài sản/thiết bị
 * Đồng bộ với: templates/handover.ts và lib/print-mappers/handover.mapper.ts
 */
export const PHIEU_BAN_GIAO_VARIABLES: TemplateVariable[] = [
  // === THÔNG TIN CỬA HÀNG (auto từ getStoreData) ===
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },

  // === THÔNG TIN PHIẾU BÀN GIAO ===
  { key: '{handover_code}', label: 'Mã phiếu bàn giao', group: 'Thông tin phiếu' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin phiếu' },
  { key: '{created_on_time}', label: 'Giờ tạo', group: 'Thông tin phiếu' },
  { key: '{handover_type}', label: 'Loại bàn giao', group: 'Thông tin phiếu' },
  { key: '{status}', label: 'Trạng thái', group: 'Thông tin phiếu' },
  { key: '{note}', label: 'Ghi chú', group: 'Thông tin phiếu' },
  { key: '{account_name}', label: 'Người tạo phiếu', group: 'Thông tin phiếu' },

  // === THÔNG TIN NGƯỜI BÀN GIAO ===
  { key: '{from_employee}', label: 'Tên người bàn giao', group: 'Người bàn giao' },
  { key: '{from_employee_code}', label: 'Mã người bàn giao', group: 'Người bàn giao' },
  { key: '{from_department}', label: 'Bộ phận người bàn giao', group: 'Người bàn giao' },
  { key: '{from_position}', label: 'Chức vụ người bàn giao', group: 'Người bàn giao' },

  // === THÔNG TIN NGƯỜI NHẬN ===
  { key: '{to_employee}', label: 'Tên người nhận', group: 'Người nhận' },
  { key: '{to_employee_code}', label: 'Mã người nhận', group: 'Người nhận' },
  { key: '{to_department}', label: 'Bộ phận người nhận', group: 'Người nhận' },
  { key: '{to_position}', label: 'Chức vụ người nhận', group: 'Người nhận' },

  // === CHI TIẾT BÀN GIAO (Line items) ===
  { key: '{line_stt}', label: 'STT', group: 'Chi tiết bàn giao' },
  { key: '{line_item_code}', label: 'Mã tài sản', group: 'Chi tiết bàn giao' },
  { key: '{line_item_name}', label: 'Tên tài sản', group: 'Chi tiết bàn giao' },
  { key: '{line_description}', label: 'Mô tả', group: 'Chi tiết bàn giao' },
  { key: '{line_serial}', label: 'Số serial', group: 'Chi tiết bàn giao' },
  { key: '{line_quantity}', label: 'Số lượng', group: 'Chi tiết bàn giao' },
  { key: '{line_unit}', label: 'Đơn vị', group: 'Chi tiết bàn giao' },
  { key: '{line_condition}', label: 'Tình trạng', group: 'Chi tiết bàn giao' },
  { key: '{line_value}', label: 'Giá trị', group: 'Chi tiết bàn giao' },
  { key: '{line_note}', label: 'Ghi chú', group: 'Chi tiết bàn giao' },

  // === TỔNG KẾT ===
  { key: '{total_items}', label: 'Tổng số mục', group: 'Tổng kết' },
  { key: '{total_quantity}', label: 'Tổng số lượng', group: 'Tổng kết' },
  { key: '{total_value}', label: 'Tổng giá trị', group: 'Tổng kết' },
];

