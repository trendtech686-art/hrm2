/**
 * Mẫu in Phiếu giao hàng - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */
export const DELIVERY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 12px; border-collapse: collapse;">
  <tr>
    <td style="width: 70px; vertical-align: top; padding-right: 10px;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div style="font-size: 11px; color: #333;">{store_address}</div>
      <div style="font-size: 11px; color: #333;">ĐT: {store_phone_number}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU GIAO HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Mã: <strong>{delivery_code}</strong> | Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- MÃ VẠCH VẬN ĐƠN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 5px;">{shipment_barcode}</div>
      <div style="font-size: 14px; font-weight: bold; font-family: monospace;">{tracking_number}</div>
      <div style="font-size: 10px;">Đối tác: {carrier_name}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Người nhận:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{receiver_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{receiver_phone}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{shipper_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{delivery_status}</td>
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
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 30px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-family: monospace; font-size: 9px;">{line_variant_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 11px;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí vận chuyển:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người giao</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{shipper_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người nhận</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{receiver_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
