/**
 * Payroll Template - Bảng lương
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} hoặc {line_index} là bảng line items - sẽ được lặp theo số nhân viên
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */
export const PAYROLL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 900px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo trái + Thông tin cửa hàng phải -->
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
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">BẢNG LƯƠNG TỔNG HỢP</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div><strong>{batch_title}</strong></div>
  <div>Mã: <strong>{batch_code}</strong> | Kỳ lương: <strong>{pay_period}</strong></div>
</div>

<!-- THÔNG TIN BẢNG LƯƠNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{batch_status}</strong></td>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tháng chấm công:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{reference_months}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Số nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{total_employees}</strong> người</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Người lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_by}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ngày lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_on}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ghi chú:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{notes}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG CHI TIẾT LƯƠNG TỪNG NHÂN VIÊN - Table layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 58px; font-size: 10px;">Mã NV</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Họ tên</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 80px; font-size: 10px;">Phòng ban</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px;">Thu nhập</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 55px; font-size: 10px;">Bảo hiểm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Thuế TNCN</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 72px; font-size: 10px; font-weight: bold;">Thực lĩnh</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px;">{employee_code}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{employee_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{department_name}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{earnings}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{total_insurance}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{personal_income_tax}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG KẾT -->
<table style="width: 300px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thu nhập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 120px; font-size: 11px;">{total_earnings}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng bảo hiểm (NV):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng thuế TNCN:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng khấu trừ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Đóng góp (DN):</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_contributions}</td>
    </tr>
    <tr>
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 12px; font-weight: bold; background: #f0f0f0;">TỔNG THỰC LĨNH:</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 12px; font-weight: bold; background: #f0f0f0;">{total_net}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px;">
  <strong>Bằng chữ:</strong> {total_net_text}
</p>

<!-- FOOTER: Chữ ký -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập</div>
      <div style="font-size: 11px;">{created_by}</div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Kế toán trưởng</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Giám đốc</div>
      <div style="font-size: 11px;"></div>
    </td>
  </tr>
</table>

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
