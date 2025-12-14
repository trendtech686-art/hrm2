/**
 * Mẫu in Phiếu trả hàng NCC - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */
export const SUPPLIER_RETURN_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG NHÀ CUNG CẤP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{return_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 8px; border: 1px solid #333;"><strong>TỔNG GIÁ TRỊ TRẢ:</strong></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đã nhận hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refunded}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải nhận:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
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
        <strong>Đại diện NCC</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
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
