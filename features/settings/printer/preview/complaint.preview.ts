import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Phiếu khiếu nại
 * Đồng bộ với: variables/phieu-khieu-nai.ts và templates/complaint.ts
 */
export const COMPLAINT_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,

  // === THÔNG TIN PHIẾU ===
  '{complaint_code}': 'KN000123',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '09:00',

  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'Nguyễn Văn A',
  '{customer_code}': 'KH00456',
  '{customer_phone_number}': '0912 345 678',
  '{customer_email}': 'nguyenvana@email.com',
  '{customer_address}': '456 Lê Duẩn, Đà Nẵng',

  // === THÔNG TIN ĐƠN HÀNG LIÊN QUAN ===
  '{order_code}': 'DH000100',
  '{order_date}': '01/12/2025',

  // === NỘI DUNG KHIẾU NẠI ===
  '{complaint_type}': 'Sản phẩm lỗi',
  '{complaint_description}': 'Sản phẩm bị rách đường may sau 2 ngày sử dụng',
  '{customer_request}': 'Đổi sản phẩm mới hoặc hoàn tiền',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_variant_code}': 'ATP-L-XANH',

  // === XỬ LÝ KHIẾU NẠI ===
  '{complaint_status}': 'Đã xử lý',
  '{resolution}': 'Đổi sản phẩm mới cho khách hàng',
  '{assignee_name}': 'Trần Văn B - Nhân viên CSKH',
  '{resolved_on}': '06/12/2025',
  '{complaint_note}': 'Khách hàng hài lòng với cách xử lý',
};
