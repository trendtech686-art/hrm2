/**
 * Mẫu in Tem phụ sản phẩm (product label)
 * Khổ giấy vật lý: 50mm rộng × 30mm cao (HPRT N41: hình chữ nhật ngang)
 * Nội dung: 48mm × 28mm (sau margin 1mm)
 */
export const PRODUCT_LABEL_TEMPLATE = `
<div style="font-family: Calibri, 'Segoe UI', Arial, sans-serif; width: 48mm; max-height: 28mm; background: #fff; line-height: 1.25; font-size: 5.5pt; color: #111; box-sizing: border-box; overflow: hidden;">
  <!-- TÊN SẢN PHẨM -->
  <div style="font-weight: 700; font-size: 5.5pt; margin-bottom: 0.5mm;">
    TÊN SẢN PHẨM: {product_name_vat}
  </div>

  <!-- SẢN XUẤT -->
  <div style="font-size: 5pt; margin-bottom: 0.5mm;">
    <span style="font-weight: 700;">Sản Xuất:</span> {product_origin}
  </div>

  <!-- HƯỚNG DẪN SỬ DỤNG -->
  <div style="font-size: 5pt; margin-bottom: 0.5mm;">
    <span style="font-weight: 700;">HDSD:</span> {product_usage_guide}
  </div>

  <!-- ĐƠN VỊ NHẬP KHẨU -->
  <div style="font-size: 5pt; margin-bottom: 0.5mm;">
    <span style="font-weight: 700;">NK:</span> {product_importer_name}
  </div>

  <!-- ĐỊA CHỈ -->
  <div style="font-size: 5pt;">
    <span style="font-weight: 700;">ĐC:</span> {product_importer_address}
  </div>
</div>
`;

/**
 * CSS cho khổ giấy 50x30mm (50mm rộng × 30mm cao)
 * Dùng cho @page và print media
 */
export const PRODUCT_LABEL_50x30_CSS = `
@page {
  size: 50mm 30mm;
  margin: 1mm;
}
@media print {
  body {
    margin: 0;
    padding: 0;
  }
  .print-page {
    page-break-after: always;
    width: 48mm;
    height: 28mm;
  }
}
`;
