/**
 * Mẫu in Phiếu xuất kho - TipTap compatible
 */
export const STOCK_OUT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU XUẤT KHO</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày xuất: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN XUẤT KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Mã KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Điện thoại:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Đơn hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{order_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Kho xuất:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{branch_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV xuất:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 60px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 40px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 40px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 80px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 90px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px;">{line_sku}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tr>
    <td style="padding: 4px 6px; font-size: 11px; border: 1px solid #333; background: #f5f5f5;">Tổng số lượng:</td>
    <td style="padding: 4px 6px; font-size: 11px; text-align: right; border: 1px solid #333; font-weight: bold;">{total_quantity}</td>
  </tr>
  <tr>
    <td style="padding: 4px 6px; font-size: 11px; border: 1px solid #333; background: #f5f5f5;">Tổng tiền hàng:</td>
    <td style="padding: 4px 6px; font-size: 11px; text-align: right; border: 1px solid #333; font-weight: bold;">{subtotal}</td>
  </tr>
  <tr>
    <td style="padding: 4px 6px; font-size: 11px; border: 1px solid #333; background: #f5f5f5;">Chiết khấu:</td>
    <td style="padding: 4px 6px; font-size: 11px; text-align: right; border: 1px solid #333;">{total_discount}</td>
  </tr>
  <tr>
    <td style="padding: 5px 6px; font-size: 12px; border: 1px solid #333; background: #f5f5f5; font-weight: bold;">TỔNG CỘNG:</td>
    <td style="padding: 5px 6px; font-size: 12px; text-align: right; border: 1px solid #333; font-weight: bold;">{total_amount}</td>
  </tr>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 15px;">
  <div style="font-size: 11px; font-weight: bold; margin-bottom: 3px;">Ghi chú:</div>
  <div style="font-size: 11px; color: #555; min-height: 30px; border: 1px dashed #ccc; padding: 5px;">{note}</div>
</div>

<!-- KÝ TÊN -->
<table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
  <tr>
    <td style="width: 33%; text-align: center; font-size: 11px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px;">Người lập phiếu</div>
      <div style="font-style: italic; font-size: 10px; color: #666;">(Ký, ghi rõ họ tên)</div>
    </td>
    <td style="width: 33%; text-align: center; font-size: 11px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px;">Thủ kho</div>
      <div style="font-style: italic; font-size: 10px; color: #666;">(Ký, ghi rõ họ tên)</div>
    </td>
    <td style="width: 33%; text-align: center; font-size: 11px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px;">Người nhận hàng</div>
      <div style="font-style: italic; font-size: 10px; color: #666;">(Ký, ghi rõ họ tên)</div>
    </td>
  </tr>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 6px; border-top: 1px dashed #999; font-size: 9px; color: #999; text-align: center;">
  In ngày: {print_date} | {store_name}
</div>

</div>
`;
