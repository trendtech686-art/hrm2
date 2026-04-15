/**
 * Mẫu in Đơn nghỉ phép - TipTap compatible
 * Chuẩn template v2 - Inline styles cho máy in
 */
export const LEAVE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">ĐƠN XIN NGHỈ PHÉP</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Số: <strong>{leave_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN NHÂN VIÊN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Họ và tên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_name}</strong></td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Mã NV:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{employee_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Bộ phận:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{department_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Chức vụ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{position_name}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Điện thoại:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{employee_phone}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Email:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{employee_email}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN NGHỈ PHÉP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Loại nghỉ phép:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{leave_type_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Hình thức:</td>
      <td style="padding: 8px; border: 1px solid #333;">{leave_paid}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Từ ngày:</td>
      <td style="padding: 8px; border: 1px solid #333;">{start_date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Đến ngày:</td>
      <td style="padding: 8px; border: 1px solid #333;">{end_date}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold;">SỐ NGÀY NGHỈ:</td>
      <td style="padding: 10px; border: 1px solid #333; font-size: 16px; font-weight: bold;">{number_of_days} ngày</td>
    </tr>
  </tbody>
</table>

<!-- LÝ DO -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Lý do nghỉ phép:</strong><br/>
  {reason}
</div>

<!-- TRẠNG THÁI PHÊ DUYỆT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333;"><strong>{status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333;">Người duyệt:</td>
      <td style="padding: 4px 6px; border: 1px solid #333;">{approved_by}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333;">Ngày duyệt:</td>
      <td style="padding: 4px 6px; border: 1px solid #333;">{approved_date}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">Người xin nghỉ</div>
        <div style="font-style: italic; color: #666; font-size: 10px;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{employee_name}</div>
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">Người phê duyệt</div>
        <div style="font-style: italic; color: #666; font-size: 10px;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{approved_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="border-top: 1px dashed #ccc; margin-top: 15px; padding-top: 8px; font-size: 9px; color: #888; text-align: center;">
  <div>Ngày in: {print_date} | {store_name}</div>
</div>

</div>
`;
