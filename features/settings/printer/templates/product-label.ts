/**
 * Mẫu in Tem phụ sản phẩm (product label)
 * Thiết kế theo khổ giấy 50x30mm (khoảng 189x113 pixels ở 96 DPI)
 * Width: 50mm ≈ 189px, Height: 30mm ≈ 113px
 */
export const PRODUCT_LABEL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; width: 50mm; height: 30mm; max-height: 30mm; background: #fff; padding: 2mm; line-height: 1.2; font-size: 7px; color: #111; box-sizing: border-box; overflow: hidden;">
  <!-- TÊN SẢN PHẨM -->
  <div style="margin-bottom: 1mm; font-weight: 700; font-size: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    TÊN SP: {product_name_vat}
  </div>

  <!-- THƯƠNG HIỆU & XUẤT XỨ -->
  <div style="margin-bottom: 1mm; font-size: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    <span style="font-weight: 700;">TH:</span> {product_brand}. <span style="font-weight: 700;">XS:</span> {product_origin}
  </div>

  <!-- HƯỚNG DẪN SỬ DỤNG -->
  <div style="margin-bottom: 1mm; font-size: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    <span style="font-weight: 700;">HDSD:</span> {product_usage_guide}
  </div>

  <!-- ĐƠN VỊ NHẬP KHẨU -->
  <div style="margin-bottom: 1mm; font-size: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    <span style="font-weight: 700;">NK:</span> {product_importer_name}
  </div>

  <!-- ĐỊA CHỈ -->
  <div style="margin-bottom: 1mm; font-size: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
    <span style="font-weight: 700;">ĐC:</span> {product_importer_address}
  </div>

  <!-- BARCODE - Compact -->
  <div style="display: flex; align-items: center; gap: 2mm; padding-top: 1mm; border-top: 0.5px dashed #999;">
    <div style="flex: 1; text-align: center;">
      <img src="https://barcodeapi.org/api/128/{product_barcode}" style="height: 8mm; max-width: 100%;" alt="barcode"/>
      <div style="font-size: 6px; margin-top: 0.5mm;">{product_barcode}</div>
    </div>
  </div>
</div>
`;

/**
 * CSS cho khổ giấy 50x30mm
 * Dùng cho @page và print media
 */
export const PRODUCT_LABEL_50x30_CSS = `
@page {
  size: 50mm 30mm;
  margin: 0;
}
@media print {
  body {
    margin: 0;
    padding: 0;
  }
  .print-page {
    page-break-after: always;
    width: 50mm;
    height: 30mm;
  }
}
`;
