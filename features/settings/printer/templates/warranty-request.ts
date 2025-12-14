/**
 * Mẫu in Phiếu yêu cầu bảo hành (Extended) - TipTap compatible
 */
export const WARRANTY_REQUEST_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">Hotline: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU YÊU CẦU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{warranty_request_code}</strong></div>
  <div>Ngày tiếp nhận: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN KHÁCH HÀNG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Họ tên:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
        <td style="padding: 5px 0; width: 20%;"><strong>Mã KH:</strong></td>
        <td style="padding: 5px 0;">{customer_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td style="padding: 5px 0;">{customer_phone_number}</td>
        <td style="padding: 5px 0;"><strong>Email:</strong></td>
        <td style="padding: 5px 0;">{customer_email}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td style="padding: 5px 0;" colspan="3">{customer_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THÔNG TIN SẢN PHẨM -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN SẢN PHẨM BẢO HÀNH</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Sản phẩm:</strong></td>
        <td style="padding: 5px 0;"><strong>{product_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã SP:</strong></td>
        <td style="padding: 5px 0;">{product_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Serial/IMEI:</strong></td>
        <td style="padding: 5px 0;"><strong>{serial_number}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Mã đơn hàng gốc:</strong></td>
        <td style="padding: 5px 0;">{order_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Ngày mua:</strong></td>
        <td style="padding: 5px 0;">{purchase_date}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Thời hạn BH:</strong></td>
        <td style="padding: 5px 0;">{warranty_duration}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Hết hạn BH:</strong></td>
        <td style="padding: 5px 0;"><strong>{warranty_expired_on}</strong></td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TÌNH TRẠNG LỖI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TÌNH TRẠNG LỖI</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Loại lỗi:</strong></td>
        <td style="padding: 5px 0;"><strong>{issue_type}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; vertical-align: top;"><strong>Mô tả lỗi:</strong></td>
        <td style="padding: 5px 0;">{issue_description}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Tình trạng máy:</strong></td>
        <td style="padding: 5px 0;">{device_condition}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Phụ kiện kèm:</strong></td>
        <td style="padding: 5px 0;">{accessories}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TRẠNG THÁI XỬ LÝ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;"><strong style="color: #eb2f96;">{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Ưu tiên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{priority}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Người tiếp nhận:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{received_by}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Kỹ thuật viên:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{technician_name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Dự kiến hoàn thành:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;" colspan="3">{expected_completion_date}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- QUY ĐỊNH BẢO HÀNH -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>QUY ĐỊNH BẢO HÀNH:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Thời gian xử lý: 7-14 ngày làm việc (tùy mức độ lỗi)</li>
    <li>Khách hàng vui lòng mang theo phiếu này khi nhận máy</li>
    <li>Cửa hàng không chịu trách nhiệm nếu máy không được nhận trong 30 ngày</li>
    <li>Hotline hỗ trợ: {store_phone_number}</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận)</div>
        <div style="height: 50px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NHÂN VIÊN TIẾP NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{received_by}</div>
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
