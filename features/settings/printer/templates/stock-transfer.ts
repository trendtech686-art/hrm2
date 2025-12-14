/**
 * Mẫu in Phiếu chuyển kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */
export const STOCK_TRANSFER_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHUYỂN KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{transfer_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN CHUYỂN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO XUẤT</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{source_location_name}</div>
      </td>
      <td style="padding: 10px; text-align: center; font-size: 20px; width: 10%;">--&gt;</td>
      <td style="padding: 10px; width: 45%; border: 2px solid #333; text-align: center;">
        <div style="font-size: 12px;">KHO NHẬP</div>
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{target_location_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">OK</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;"><div style="width: 16px; height: 16px; border: 1px solid #333; margin: 0 auto;"></div></td>
    </tr>
  </tbody>
</table>

<!-- TỔNG CỘNG -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>Tổng số lượng:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_quantity}</strong></td>
    </tr>
  </tbody>
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
        <strong>Người lập phiếu</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho xuất</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho nhập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
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
