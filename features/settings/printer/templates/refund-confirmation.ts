/**
 * Mẫu in Phiếu xác nhận hoàn (Extended) - TipTap compatible
 */
export const REFUND_CONFIRMATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XÁC NHẬN HOÀN TIỀN</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{refund_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN HOÀN TIỀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã đơn hàng gốc:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày đặt:</td>
      <td style="padding: 8px; border: 1px solid #333;">{order_date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã phiếu trả:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{return_code}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày trả:</td>
      <td style="padding: 8px; border: 1px solid #333;">{return_date}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3">{refund_reason}</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT HOÀN TIỀN -->
<div style="background: #f5f5f5; border: 2px solid #333; padding: 20px; margin-bottom: 20px; text-align: center;">
  <div style="font-size: 14px; color: #666; margin-bottom: 10px;">SỐ TIỀN HOÀN</div>
  <div style="font-size: 28px; font-weight: bold;">{refund_amount}</div>
  <div style="font-style: italic; color: #666; margin-top: 5px;">({refund_amount_text})</div>
</div>

<!-- THÔNG TIN HOÀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Hình thức hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_method}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333;">{refunded_on}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người xử lý:</td>
      <td style="padding: 8px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN TÀI KHOẢN (nếu chuyển khoản) -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngân hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_name}</td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chi nhánh:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_branch}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Số tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{bank_account}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chủ tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_account_name}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận đã nhận tiền)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI XỬ LÝ</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
