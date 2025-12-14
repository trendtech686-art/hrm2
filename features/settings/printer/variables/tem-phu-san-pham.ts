import { TemplateVariable } from '../types';

export const TEM_PHU_SAN_PHAM_VARIABLES: TemplateVariable[] = [
  // Thông tin sản phẩm cơ bản
  { key: '{product_name}', label: 'Tên sản phẩm', group: 'Thông tin sản phẩm' },
  { key: '{product_name_vat}', label: 'Tên sản phẩm VAT (đầy đủ)', group: 'Thông tin sản phẩm' },
  { key: '{product_sku}', label: 'SKU / Mã sản phẩm', group: 'Thông tin sản phẩm' },
  { key: '{product_unit}', label: 'Đơn vị tính', group: 'Thông tin sản phẩm' },
  { key: '{product_brand}', label: 'Thương hiệu', group: 'Thông tin sản phẩm' },
  { key: '{product_category}', label: 'Danh mục', group: 'Thông tin sản phẩm' },
  { key: '{product_weight}', label: 'Khối lượng / Quy cách', group: 'Thông tin sản phẩm' },
  { key: '{product_origin}', label: 'Xuất xứ / Địa chỉ sản xuất', group: 'Thông tin sản phẩm' },

  // Thông tin nhập khẩu
  { key: '{product_importer_name}', label: 'Đơn vị nhập khẩu', group: 'Thông tin nhập khẩu' },
  { key: '{product_importer_address}', label: 'Địa chỉ nhập khẩu', group: 'Thông tin nhập khẩu' },
  { key: '{product_usage_guide}', label: 'Hướng dẫn sử dụng', group: 'Thông tin nhập khẩu' },

  // Ngày tháng & lô
  { key: '{product_lot_number}', label: 'Số lô', group: 'Ngày & lô' },
  { key: '{product_mfg_date}', label: 'Ngày sản xuất (NSX)', group: 'Ngày & lô' },
  { key: '{product_expiry_date}', label: 'Hạn sử dụng (HSD)', group: 'Ngày & lô' },

  // Giá & mã
  { key: '{product_price}', label: 'Giá bán hiển thị', group: 'Giá & mã' },
  { key: '{product_barcode}', label: 'Mã vạch (text)', group: 'Giá & mã' },
  { key: '{product_barcode_image}', label: 'Mã vạch (ảnh)', group: 'Giá & mã' },
  { key: '{product_qr_code}', label: 'QR sản phẩm (ảnh)', group: 'Giá & mã' },

  // Thông tin cửa hàng
  { key: '{store_logo}', label: 'Logo cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_name}', label: 'Tên cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_address}', label: 'Địa chỉ cửa hàng', group: 'Thông tin cửa hàng' },
  { key: '{store_phone_number}', label: 'SĐT cửa hàng', group: 'Thông tin cửa hàng' },

  // Mô tả & bảo quản (legacy)
  { key: '{product_short_description}', label: 'Mô tả ngắn', group: 'Mô tả' },
  { key: '{product_description}', label: 'Mô tả chi tiết', group: 'Mô tả' },
  { key: '{product_storage_instructions}', label: 'Hướng dẫn bảo quản', group: 'Mô tả' },
  { key: '{product_ingredients}', label: 'Thành phần', group: 'Mô tả' },
];
