/**
 * Mẫu Excel xuất hóa đơn Full VAT (mẫu HTML tùy chỉnh)
 * Khi in sẽ xuất file Excel dựa trên cấu hình mẫu này
 */
export const EXCEL_FULL_VAT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 15px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 15px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 15px; font-weight: bold; margin-bottom: 3px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
      <div style="font-size: 11px; color: #333;">MST: {store_tax_code}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 18px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px;">HÓA ĐƠN BÁN HÀNG (VAT)</h2>
<div style="text-align: center; margin-bottom: 15px; font-size: 12px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
  <tr>
    <td style="padding: 4px 8px; width: 120px; background: #f5f5f5; border: 1px solid #ccc; font-size: 11px;">Khách hàng:</td>
    <td style="padding: 4px 8px; border: 1px solid #ccc; font-size: 11px; font-weight: bold;">{customer_name}</td>
    <td style="padding: 4px 8px; width: 100px; background: #f5f5f5; border: 1px solid #ccc; font-size: 11px;">Mã KH:</td>
    <td style="padding: 4px 8px; border: 1px solid #ccc; font-size: 11px;">{customer_code}</td>
  </tr>
  <tr>
    <td style="padding: 4px 8px; background: #f5f5f5; border: 1px solid #ccc; font-size: 11px;">Điện thoại:</td>
    <td style="padding: 4px 8px; border: 1px solid #ccc; font-size: 11px;">{customer_phone_number}</td>
    <td style="padding: 4px 8px; background: #f5f5f5; border: 1px solid #ccc; font-size: 11px;">MST khách:</td>
    <td style="padding: 4px 8px; border: 1px solid #ccc; font-size: 11px;">{customer_tax_code}</td>
  </tr>
  <tr>
    <td style="padding: 4px 8px; background: #f5f5f5; border: 1px solid #ccc; font-size: 11px;">Địa chỉ:</td>
    <td style="padding: 4px 8px; border: 1px solid #ccc; font-size: 11px;" colspan="3">{shipping_address}</td>
  </tr>
  <tr>
    <td style="padding: 4px 8px; background: #f5f5f5; border: 1px solid #ccc; font-size: 11px;">Nhân viên:</td>
    <td style="padding: 4px 8px; border: 1px solid #ccc; font-size: 11px;">{account_name}</td>
    <td style="padding: 4px 8px; background: #f5f5f5; border: 1px solid #ccc; font-size: 11px;">Chi nhánh:</td>
    <td style="padding: 4px 8px; border: 1px solid #ccc; font-size: 11px;">{branch_name}</td>
  </tr>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 12px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: center; width: 30px; font-size: 11px;">STT</th>
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: left; width: 65px; font-size: 11px;">Mã SP</th>
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: left; font-size: 11px;">Tên sản phẩm</th>
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: center; width: 40px; font-size: 11px;">ĐVT</th>
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: center; width: 35px; font-size: 11px;">SL</th>
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: right; width: 80px; font-size: 11px;">Đơn giá</th>
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: right; width: 55px; font-size: 11px;">CK (%)</th>
      <th style="padding: 6px 4px; border: 1px solid #333; text-align: right; width: 90px; font-size: 11px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 5px 4px; border: 1px solid #333; text-align: center; font-size: 11px;">{line_stt}</td>
      <td style="padding: 5px 4px; border: 1px solid #333; font-size: 11px;">{line_sku}</td>
      <td style="padding: 5px 4px; border: 1px solid #333; font-size: 11px;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 5px 4px; border: 1px solid #333; text-align: center; font-size: 11px;">{line_unit}</td>
      <td style="padding: 5px 4px; border: 1px solid #333; text-align: center; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 5px 4px; border: 1px solid #333; text-align: right; font-size: 11px;">{line_price}</td>
      <td style="padding: 5px 4px; border: 1px solid #333; text-align: right; font-size: 11px;">{line_discount_percent}</td>
      <td style="padding: 5px 4px; border: 1px solid #333; text-align: right; font-size: 11px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG (có VAT) -->
<table style="width: 300px; margin-left: auto; border-collapse: collapse; margin-bottom: 15px;">
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f5f5f5;">Tổng tiền hàng:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{subtotal}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f5f5f5;">Chiết khấu:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{total_discount}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f5f5f5;">Phí vận chuyển:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{shipping_fee}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #ffefc0; font-weight: bold;">Tiền trước thuế:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333; font-weight: bold;">{pre_tax_amount}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #ffefc0;">VAT ({vat_rate}%):</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{vat_amount}</td>
  </tr>
  <tr>
    <td style="padding: 6px 8px; font-size: 14px; border: 1px solid #333; background: #e8e8e8; font-weight: bold;">TỔNG THANH TOÁN:</td>
    <td style="padding: 6px 8px; font-size: 14px; text-align: right; border: 1px solid #333; font-weight: bold;">{total_amount_with_vat}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f5f5f5;">Đã thanh toán:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{paid_amount}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f5f5f5;">Còn nợ:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{remaining_amount}</td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 10px;">
  <div style="font-size: 11px; font-weight: bold; margin-bottom: 3px;">Ghi chú:</div>
  <div style="font-size: 11px; color: #555;">{note}</div>
</div>

<!-- KÝ TÊN -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-weight: bold; font-size: 12px; margin-bottom: 50px;">Người mua hàng</div>
      <div style="font-style: italic; font-size: 10px; color: #666;">(Ký, ghi rõ họ tên)</div>
    </td>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-weight: bold; font-size: 12px; margin-bottom: 50px;">Người bán hàng</div>
      <div style="font-style: italic; font-size: 10px; color: #666;">(Ký, đóng dấu, ghi rõ họ tên)</div>
    </td>
  </tr>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px solid #ccc; font-size: 10px; color: #888; text-align: center;">
  Cảm ơn quý khách! | {store_name} - MST: {store_tax_code} - ĐT: {store_phone_number}
</div>

</div>
`;
