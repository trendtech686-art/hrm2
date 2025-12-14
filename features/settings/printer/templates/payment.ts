/**
 * Mẫu in Phiếu chi - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */
export const PAYMENT_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{payment_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{payment_barcode}</div>
      <div style="font-family: monospace;">{payment_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU CHI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nhận tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do chi:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nhận tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
