/**
 * Mẫu in Tem phụ sản phẩm (product label)
 * Thiết kế theo mẫu tem phụ nhập khẩu chuẩn
 */
export const PRODUCT_LABEL_TEMPLATE = `
<div style="font-family: 'Inter', Arial, sans-serif; width: 320px; background: #fff; padding: 16px; line-height: 1.5; font-size: 13px; color: #111;">
  <!-- TÊN SẢN PHẨM -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">TÊN SẢN PHẨM:</span> {product_name_vat}
  </div>

  <!-- THƯƠNG HIỆU & ĐỊA CHỈ SẢN XUẤT -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Thương Hiệu:</span> {product_brand}. <span style="font-weight: 700;">Địa chỉ sản xuất:</span> {product_origin}
  </div>

  <!-- HƯỚNG DẪN SỬ DỤNG -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Hướng Dẫn sử dụng:</span> {product_usage_guide}
  </div>

  <!-- ĐƠN VỊ NHẬP KHẨU -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">ĐƠN VỊ NHẬP KHẨU:</span> {product_importer_name}
  </div>

  <!-- ĐỊA CHỈ NHẬP KHẨU -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">Địa chỉ:</span> {product_importer_address}
  </div>

  <!-- BARCODE -->
  <div style="display: flex; align-items: center; gap: 12px; padding-top: 8px; border-top: 1px dashed #ccc;">
    <div style="flex: 1;">
      {product_barcode_image}
      <div style="font-size: 11px; margin-top: 2px;">{product_barcode}</div>
    </div>
  </div>
</div>
`;
