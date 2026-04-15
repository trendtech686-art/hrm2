/**
 * Dữ liệu preview dùng chung cho tất cả loại mẫu in
 * Bao gồm: Thông tin cửa hàng, chi nhánh, người tạo
 */
export const SHARED_PREVIEW_DATA = {
  // === THÔNG TIN CỬA HÀNG ===
  '{store_logo}': '<img src="https://placehold.co/120x60?text=LOGO" alt="Logo" style="max-height:60px"/>',
  '{store_name}': 'Cửa hàng Thời trang TrendTech',
  '{store_address}': '123 Nguyễn Văn Linh, Đà Nẵng',
  '{store_phone_number}': '0905 123 456',
  '{store_email}': 'contact@trendtech.vn',
  '{store_fax}': '0236 3333 555',
  '{store_tax_code}': '0123456789-001',
  '{store_province}': 'Đà Nẵng',
  // === THÔNG TIN PHÁP LÝ CÔNG TY (cho hợp đồng) ===
  '{store_company_name}': 'CÔNG TY TNHH THỜI TRANG TRENDTECH',
  '{store_representative}': 'Bà NGUYỄN THỊ A',
  '{store_representative_title}': 'Giám Đốc',
  '{store_bank_account}': '123456789',
  '{store_bank_name}': 'Vietcombank - CN Đà Nẵng',
  '{store_bank_account_name}': 'CONG TY TNHH THOI TRANG TRENDTECH',

  // === THÔNG TIN CHI NHÁNH ===
  '{location_name}': 'Chi nhánh Hải Châu',
  '{location_address}': '789 Trần Phú, Hải Châu, Đà Nẵng',
  '{location_province}': 'Đà Nẵng',
  '{location_phone_number}': '0236 3333 666',
  '{location_country}': 'Việt Nam',

  // === NGƯỜI TẠO ===
  '{account_name}': 'Trần Văn B',
  '{assignee_name}': 'Nguyễn Thị C',
} as const;

export type SharedPreviewKeys = keyof typeof SHARED_PREVIEW_DATA;
