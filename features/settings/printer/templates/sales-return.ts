/**
 * Mẫu in Phiếu trả hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */
export const SALES_RETURN_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_return_code}</strong></div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG TIỀN HOÀN:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Trạng thái hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refund_status}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người nhận hàng trả</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Hotline: {store_phone_number}

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
