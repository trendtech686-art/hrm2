/**
 * Mẫu in Biên bản giao nhận hàng hóa - TipTap compatible
 * Chuẩn theo mẫu biên bản giao nhận thương mại B2B Việt Nam
 */
export const GOODS_HANDOVER_REPORT_TEMPLATE = `
<div style="font-family: 'Times New Roman', Times, serif; font-size: 13px; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">

<!-- HEADER QUỐC HIỆU -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tr>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-size: 13px; font-weight: bold;">{store_company_name}</div>
      <div style="font-size: 11px;">{store_address}</div>
    </td>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-size: 13px; font-weight: bold;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
      <div style="font-size: 13px; font-weight: bold; text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</div>
      <div style="font-size: 12px;">-------</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 5px 0; font-size: 18px; font-weight: bold;">BIÊN BẢN GIAO NHẬN HÀNG HÓA</h2>
<div style="text-align: center; margin-bottom: 20px; font-size: 13px; font-style: italic;">Số: {order_code}/BBGNHH</div>

<!-- CĂN CỨ -->
<div style="margin-bottom: 15px; text-align: justify;">
  <p style="margin: 4px 0;">Căn cứ vào Hợp đồng số: {order_code}/HĐMB ngày {created_on} giữa {store_company_name} và {customer_name}.</p>
  <p style="margin: 4px 0;">Căn cứ vào tình hình giao nhận hàng thực tế.</p>
</div>

<p style="margin-bottom: 15px;">Hôm nay, ngày {created_on}, chúng tôi gồm có:</p>

<!-- BÊN A -->
<div style="margin-bottom: 15px;">
  <p style="font-weight: bold; margin: 4px 0; font-size: 14px;">Bên A (Bên Bán): {store_company_name}</p>
  <table style="border-collapse: collapse; margin-left: 20px;">
    <tr><td style="padding: 3px 10px 3px 0; min-width: 140px;">Địa chỉ:</td><td style="padding: 3px 0;">{store_address}</td></tr>
    <tr><td style="padding: 3px 10px 3px 0;">Đại diện là:</td><td style="padding: 3px 0;">{store_representative} &nbsp;&nbsp;&nbsp;&nbsp;- Chức vụ: {store_representative_title}</td></tr>
    <tr><td style="padding: 3px 10px 3px 0;">MST:</td><td style="padding: 3px 0;">{store_tax_code}</td></tr>
    <tr><td style="padding: 3px 10px 3px 0;">Số tài khoản:</td><td style="padding: 3px 0;">{store_bank_account} ngân hàng {store_bank_name}</td></tr>
  </table>
</div>

<!-- BÊN B -->
<div style="margin-bottom: 15px;">
  <p style="font-weight: bold; margin: 4px 0; font-size: 14px;">Bên B (Bên Mua): {customer_name}</p>
  <table style="border-collapse: collapse; margin-left: 20px;">
    <tr><td style="padding: 3px 10px 3px 0; min-width: 140px;">Địa chỉ:</td><td style="padding: 3px 0;">{shipping_address}</td></tr>
    <tr><td style="padding: 3px 10px 3px 0;">MST:</td><td style="padding: 3px 0;">{customer_tax_number}</td></tr>
    <tr><td style="padding: 3px 10px 3px 0;">Điện thoại:</td><td style="padding: 3px 0;">{customer_phone_number}</td></tr>
  </table>
</div>

<p style="margin-bottom: 10px;">Hai bên cùng thống nhất tiến hành bàn giao số lượng hàng hóa theo thực tế như sau:</p>

<!-- BẢNG HÀNG HÓA -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #f0f0f0;">
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 35px; font-size: 12px;">STT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left; font-size: 12px;">Tên hàng hóa</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 55px; font-size: 12px;">ĐVT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 70px; font-size: 12px;">Số lượng</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 12px;">{line_stt}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 12px;">{line_product_name} {line_variant}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 12px;">{line_unit}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 12px;">{line_quantity}</td>
    </tr>
  </tbody>
</table>

<!-- KẾT LUẬN -->
<div style="margin: 15px 0; text-align: justify;">
  <p style="margin: 4px 0;">Chúng tôi cùng nhau xác nhận số lượng vật tư giao nhận đủ theo bảng kê trên.</p>
  <p style="margin: 4px 0;">Tình trạng: nguyên đai, nguyên kiện. Các thông số sản phẩm và quy cách đúng theo hợp đồng đã ký giữa hai bên.</p>
  <p style="margin: 4px 0;">Biên bản này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.</p>
</div>

<!-- KÝ TÊN -->
<table style="width: 100%; margin-top: 30px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">ĐẠI DIỆN BÊN NHẬN HÀNG</div>
      <div style="font-style: italic; font-size: 11px; color: #666; margin-bottom: 60px;">(Ký, ghi rõ họ tên)</div>
    </td>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">ĐẠI DIỆN BÊN GIAO HÀNG</div>
      <div style="font-style: italic; font-size: 11px; color: #666; margin-bottom: 60px;">(Ký, ghi rõ họ tên)</div>
    </td>
  </tr>
</table>

</div>
`;
