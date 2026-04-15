/**
 * Mẫu in Hợp đồng mua bán - TipTap compatible
 * Chuẩn theo mẫu hợp đồng thương mại B2B Việt Nam
 */
export const SALES_CONTRACT_TEMPLATE = `
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
      <div style="font-size: 12px;">-------------</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 5px 0; font-size: 18px; font-weight: bold;">HỢP ĐỒNG MUA BÁN</h2>
<div style="text-align: center; margin-bottom: 20px; font-size: 13px; font-style: italic;">(Hợp đồng số: {order_code}/HĐMB)</div>

<!-- CĂN CỨ -->
<div style="margin-bottom: 15px; text-align: justify;">
  <p style="margin: 4px 0;">Căn cứ Bộ Luật Dân Sự số 91/2015/QH13 nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam được Quốc Hội thông qua ngày 24/11/2015 có hiệu lực thi hành từ ngày 01/01/2017.</p>
  <p style="margin: 4px 0;">Căn cứ Luật Thương Mại số 36/2005/QH11 nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam được Quốc Hội Khóa 11 thông qua ngày 14/06/2005 có hiệu lực thi hành từ ngày 01/01/2006.</p>
  <p style="margin: 4px 0;">Căn cứ vào khả năng và nhu cầu của Hai Bên.</p>
</div>

<p style="margin-bottom: 15px;">Hôm nay ngày {created_on}, Chúng tôi gồm:</p>

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
    <tr><td style="padding: 3px 10px 3px 0;">Email:</td><td style="padding: 3px 0;">{customer_email}</td></tr>
  </table>
</div>

<p style="margin-bottom: 10px;">Hai bên thống nhất thỏa thuận nội dung hợp đồng như sau:</p>

<!-- ĐIỀU 1 -->
<p style="font-weight: bold; margin: 15px 0 8px 0; font-size: 14px;">Điều 1: Nội dung hàng hóa.</p>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #f0f0f0;">
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 35px; font-size: 12px;">STT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left; font-size: 12px;">Tên hàng hóa</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 45px; font-size: 12px;">ĐVT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 55px; font-size: 12px;">Số lượng</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right; width: 100px; font-size: 12px;">Đơn giá (VNĐ)</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right; width: 110px; font-size: 12px;">Thành tiền (VNĐ)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 12px;">{line_stt}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 12px;">{line_product_name} {line_variant}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 12px;">{line_unit}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 12px;">{line_quantity}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 12px;">{line_price}</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 12px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<table style="width: 350px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f0f0f0;">Cộng tiền hàng:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{total}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f0f0f0;">Chiết khấu:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{total_discount}</td>
  </tr>
  <tr>
    <td style="padding: 5px 8px; font-size: 12px; border: 1px solid #333; background: #f0f0f0;">Thuế GTGT:</td>
    <td style="padding: 5px 8px; font-size: 12px; text-align: right; border: 1px solid #333;">{total_tax}</td>
  </tr>
  <tr>
    <td style="padding: 6px 8px; font-size: 13px; border: 1px solid #333; background: #f0f0f0; font-weight: bold;">Tổng tiền thanh toán:</td>
    <td style="padding: 6px 8px; font-size: 13px; text-align: right; border: 1px solid #333; font-weight: bold;">{total_amount}</td>
  </tr>
</table>

<p style="margin: 5px 0 15px 0; font-style: italic;">Bằng chữ: {total_text}./.</p>

<!-- ĐIỀU 2 -->
<p style="font-weight: bold; margin: 15px 0 8px 0; font-size: 14px;">Điều 2: Chất lượng và quy cách hàng hóa.</p>
<p style="margin: 4px 0; text-align: justify;">2.1 Chất lượng mặt hàng được đảm bảo theo cam kết của nhà sản xuất.</p>
<p style="margin: 4px 0; text-align: justify;">2.2 Quy cách hàng hóa theo mẫu Bên B đã chọn.</p>
<p style="margin: 4px 0; text-align: justify;">2.3 Hàng hóa được bảo hành đúng tiêu chuẩn của nhà sản xuất.</p>
<p style="margin: 4px 0; text-align: justify;">2.4 Trong thời hạn 10 ngày kể từ ngày nhận hàng, nếu hàng hóa bên A giao cho bên B không đúng mẫu mã, hoặc bên B phát hiện hàng bị lỗi do sản xuất thì bên A phải đổi lại chiếc mới đúng theo tiêu chuẩn đã thỏa thuận, mọi chi phí phát sinh do bên A chịu.</p>

<!-- ĐIỀU 3 -->
<p style="font-weight: bold; margin: 15px 0 8px 0; font-size: 14px;">Điều 3: Phương thức và thời gian giao nhận hàng.</p>
<p style="margin: 4px 0; text-align: justify;">3.1 Sau khoảng 10 ngày kể từ ngày ký hợp đồng, bên A sẽ tiến hành giao hàng cho Bên B.</p>
<p style="margin: 4px 0; text-align: justify;">3.2 Giao nhận hàng tại địa điểm của Bên B: {shipping_address}.</p>
<p style="margin: 4px 0; text-align: justify;">3.3 Khi nhận hàng, Bên B có trách nhiệm kiểm tra hàng hóa, nếu phát hiện hàng thiếu hoặc không đúng chủng loại, chất lượng thì lập biên bản, yêu cầu Bên bán xác nhận. Hai bên cùng thống nhất để có phương án giải quyết.</p>

<!-- ĐIỀU 4 -->
<p style="font-weight: bold; margin: 15px 0 8px 0; font-size: 14px;">Điều 4: Phương thức thanh toán và hình thức thanh toán.</p>
<p style="margin: 4px 0; text-align: justify;">4.1 Bên B thanh toán cho bên A trong vòng 20 ngày kể từ ngày ký hợp đồng này.</p>
<p style="margin: 4px 0; text-align: justify;">4.2 Bên B thanh toán cho bên A bằng hình thức: Chuyển khoản.</p>

<!-- ĐIỀU 5 -->
<p style="font-weight: bold; margin: 15px 0 8px 0; font-size: 14px;">Điều 5: Thủ tục giải quyết tranh chấp hợp đồng.</p>
<p style="margin: 4px 0; text-align: justify;">5.1 Hai bên cần chủ động thông báo cho nhau tiến độ thực hiện hợp đồng. Nếu có vấn đề gì bất lợi phát sinh các bên phải kịp thời thông báo cho nhau biết và bàn bạc giải quyết (cần lập biên bản ghi toàn bộ nội dung).</p>
<p style="margin: 4px 0; text-align: justify;">5.2 Trường hợp các bên không tự giải quyết được mới đưa vụ tranh chấp ra tòa án có thẩm quyền giải quyết.</p>

<!-- ĐIỀU 6 -->
<p style="font-weight: bold; margin: 15px 0 8px 0; font-size: 14px;">Điều 6: Điều khoản chung.</p>
<p style="margin: 4px 0; text-align: justify;">Các điều kiện và điều khoản khác không ghi trong này sẽ được các bên thực hiện theo quy định hiện hành của các văn bản pháp luật.</p>
<p style="margin: 4px 0; text-align: justify;">Hợp đồng này có hiệu lực kể từ ngày ký. Hợp đồng sẽ tự động thanh lý sau khi Hai bên hoàn thành xong các nghĩa vụ của hợp đồng.</p>
<p style="margin: 4px 0; text-align: justify;">Hợp đồng này được làm thành 02 (hai) bản, có giá trị như nhau, mỗi bên giữ 01 (một) bản. Hợp đồng được ký trực tiếp hoặc qua gmail, fax.</p>

<!-- KÝ TÊN -->
<table style="width: 100%; margin-top: 30px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">ĐẠI DIỆN BÊN A</div>
      <div style="font-style: italic; font-size: 11px; color: #666; margin-bottom: 60px;">(Ký, đóng dấu, ghi rõ họ tên)</div>
    </td>
    <td style="width: 50%; text-align: center; vertical-align: top;">
      <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">ĐẠI DIỆN BÊN B</div>
      <div style="font-style: italic; font-size: 11px; color: #666; margin-bottom: 60px;">(Ký, ghi rõ họ tên)</div>
    </td>
  </tr>
</table>

</div>
`;
