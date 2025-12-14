/**
 * Mẫu in Phiếu đóng gói - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */
export const PACKING_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{fulfillment_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV được gán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{assigned_employee}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">Mã SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 35px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 55px; font-size: 10px;">Vị trí</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 70px; font-size: 10px;">Ghi chú</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{bin_location}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 9px;">{line_note}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center;"><div style="width: 14px; height: 14px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG VÀ COD -->
<table style="width: 220px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 75px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>
<div style="margin: 8px 0; padding: 8px; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú đơn hàng:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người đóng gói</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Kiểm tra</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In lúc: {print_date} {print_time}
</div>

</div>
`;
