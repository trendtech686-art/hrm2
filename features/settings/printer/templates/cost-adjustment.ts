/**
 * Mẫu in Phiếu điều chỉnh giá vốn - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */
export const COST_ADJUSTMENT_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone}</div>
    </td>
  </tr>
</table>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU ĐIỀU CHỈNH GIÁ VỐN</h2>
<div style="text-align: center; margin-bottom: 15px;">
  <div>Số: <strong>{adjustment_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN CHI NHÁNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Chi nhánh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{location_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do điều chỉnh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{reason}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{status}</td>
    </tr>
  </tbody>
</table>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 30px;">STT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Mã SP</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn cũ</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Giá vốn mới</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Chênh lệch</th>
    </tr>
  </thead>
  <tbody>
    <tr data-line-item>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 5px; border: 1px solid #333;">{line_product_name}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_old_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_new_price}</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{line_difference}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 50%; margin-left: auto; border-collapse: collapse; margin-bottom: 15px;">
  <tbody>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng số sản phẩm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng tăng giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: green;">{total_increase}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng giảm giá vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: red;">{total_decrease}</td>
    </tr>
    <tr style="font-weight: bold; font-size: 13px;">
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">CHÊNH LỆCH:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_difference}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center;">
        <strong>Người lập phiếu</strong>
        <div style="margin-top: 50px; font-style: italic;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center;">
        <strong>Người xác nhận</strong>
        <div style="margin-top: 50px; font-style: italic;">{confirmed_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- NGÀY IN -->
<div style="text-align: right; margin-top: 20px; font-size: 10px; color: #666;">
  In ngày: {print_date} {print_time}
</div>

</div>
`;
