import { TemplateVariable } from '../types';

export const PHIEU_KHIEU_NAI_VARIABLES: TemplateVariable[] = [
  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_email}', label: 'Email cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{print_date}', label: 'Ngày in', group: 'Thông tin cửa hàng' },
  { key: '{print_time}', label: 'Giờ in', group: 'Thông tin cửa hàng' },
  
  // Thông tin phiếu
  { key: '{complaint_code}', label: 'Mã phiếu khiếu nại', group: 'Thông tin phiếu' },
  { key: '{created_on}', label: 'Ngày tạo', group: 'Thông tin phiếu' },
  { key: '{created_on_time}', label: 'Thời gian tạo', group: 'Thông tin phiếu' },
  
  // Thông tin khách hàng
  { key: '{customer_name}', label: 'Tên khách hàng', group: 'Thông tin khách hàng' },
  { key: '{customer_code}', label: 'Mã khách hàng', group: 'Thông tin khách hàng' },
  { key: '{customer_phone_number}', label: 'SĐT khách hàng', group: 'Thông tin khách hàng' },
  { key: '{customer_email}', label: 'Email khách hàng', group: 'Thông tin khách hàng' },
  { key: '{customer_address}', label: 'Địa chỉ khách hàng', group: 'Thông tin khách hàng' },
  
  // Thông tin đơn hàng liên quan
  { key: '{order_code}', label: 'Mã đơn hàng', group: 'Đơn hàng liên quan' },
  { key: '{order_date}', label: 'Ngày đặt hàng', group: 'Đơn hàng liên quan' },
  
  // Nội dung khiếu nại
  { key: '{complaint_type}', label: 'Loại khiếu nại', group: 'Nội dung khiếu nại' },
  { key: '{complaint_description}', label: 'Mô tả vấn đề', group: 'Nội dung khiếu nại' },
  { key: '{customer_request}', label: 'Yêu cầu của khách hàng', group: 'Nội dung khiếu nại' },
  { key: '{line_product_name}', label: 'Tên sản phẩm', group: 'Nội dung khiếu nại' },
  { key: '{line_variant}', label: 'Phiên bản sản phẩm', group: 'Nội dung khiếu nại' },
  { key: '{line_variant_code}', label: 'Mã sản phẩm', group: 'Nội dung khiếu nại' },
  
  // Xử lý khiếu nại
  { key: '{complaint_status}', label: 'Trạng thái xử lý', group: 'Xử lý khiếu nại' },
  { key: '{resolution}', label: 'Phương án xử lý', group: 'Xử lý khiếu nại' },
  { key: '{assignee_name}', label: 'Người xử lý', group: 'Xử lý khiếu nại' },
  { key: '{resolved_on}', label: 'Ngày hoàn thành', group: 'Xử lý khiếu nại' },
  { key: '{complaint_note}', label: 'Ghi chú', group: 'Xử lý khiếu nại' },
  
  // Người tạo
  { key: '{account_name}', label: 'Người tạo phiếu', group: 'Người tạo' },
];
