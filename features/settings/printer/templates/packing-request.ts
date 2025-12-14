/**
 * Mẫu in Phiếu yêu cầu đóng gói (Extended) - TipTap compatible
 */
export const PACKING_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Kho: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Mã yêu cầu: <strong>{packing_request_code}</strong></div>
  <div>Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày tạo: {created_on} {created_on_time}</div>
</div>

<!-- ĐỘ ƯU TIÊN -->
<div style="text-align: center; margin-bottom: 20px;">
  <span style="background: #f5f5f5; border: 1px solid #333; padding: 8px 20px; font-weight: bold; font-size: 14px;">
    ĐỘ ƯU TIÊN: {priority}
  </span>
</div>

<!-- THÔNG TIN GIAO HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Người nhận:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;">{shipping_address}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Đơn vị VC:</strong></td>
        <td style="padding: 5px 0;">{carrier_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Dịch vụ:</strong></td>
        <td style="padding: 5px 0;">{service_name}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM CẦN ĐÓNG GÓI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- THỐNG KÊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #333; background: #f5f5f5; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">Tổng khối lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right;">{total_weight} g</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- YÊU CẦU ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">YÊU CẦU ĐẶC BIỆT</div>
  <div>{special_request}</div>
</div>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú đóng gói:</strong> {packing_note}
</div>

<!-- TRẠNG THÁI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người được gán:</td>
      <td style="padding: 8px; border: 1px solid #333;">{assigned_employee}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Thời hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{deadline}</strong></td>
    </tr>
  </tbody>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
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
