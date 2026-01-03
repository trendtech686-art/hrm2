module.exports=[686797,a=>{"use strict";var b=a.i(920226),c=a.i(862435);let d=`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XỬ PHẠT</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{penalty_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN NGƯỜI BỊ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Họ v\xe0 t\xean:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{employee_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">M\xe3 NV:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{employee_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bộ phận:</td>
      <td style="padding: 5px; border: 1px solid #333;">{department_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chức vụ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{position_name}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG VI PHẠM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Loại vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{violation_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ng\xe0y vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_date}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">M\xf4 tả vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bằng chứng:</td>
      <td style="padding: 5px; border: 1px solid #333;">{evidence}</td>
    </tr>
  </tbody>
</table>

<!-- H\xccNH THỨC XỬ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 30%; background: #f5f5f5; border: 1px solid #333;">H\xecnh thức:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{penalty_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Lần vi phạm:</td>
      <td style="padding: 8px; border: 1px solid #333;">Lần thứ <strong>{violation_count}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 12px; border: 1px solid #333;"><strong>SỐ TIỀN PHẠT:</strong></td>
      <td style="padding: 12px; border: 1px solid #333; font-size: 18px; font-weight: bold;">{penalty_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; font-style: italic;">{penalty_amount_text}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {penalty_note}
</div>

<!-- CĂN CỨ PH\xc1P L\xdd -->
<div style="margin: 10px 0; padding: 10px; border: 1px solid #333; font-size: 12px;">
  <strong>Căn cứ ph\xe1p l\xfd:</strong> Theo quy định nội bộ c\xf4ng ty v\xe0 Bộ luật Lao động Việt Nam.
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người vi phạm</strong><br>
        <em>(K\xfd x\xe1c nhận)</em><br>
        <div style="height: 50px;"></div>
        {employee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Trưởng bộ phận</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Gi\xe1m đốc</strong><br>
        <em>(K\xfd duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Phiếu n\xe0y được lập th\xe0nh 02 bản, mỗi b\xean giữ 01 bản c\xf3 gi\xe1 trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In l\xfac: {print_date} {print_time}</div></div>

</div>
`,e={order:`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo tr\xe1i + Th\xf4ng tin cửa h\xe0ng phải -->
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">H\xd3A ĐƠN B\xc1N H\xc0NG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
</div>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">M\xe3 KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Điện thoại:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Nh\xf3m KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_group}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">ĐC giao h\xe0ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV b\xe1n:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{account_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng th\xe1i:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{order_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive với table-layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">T\xean sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 65px; font-size: 10px;">Đơn gi\xe1</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 50px; font-size: 10px;">VAT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 45px; font-size: 10px;">CK</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Th\xe0nh tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; font-size: 10px; word-wrap: break-word;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_unit}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: center; font-size: 10px; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_price}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_tax_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_discount_amount}</td>
      <td style="padding: 4px 3px; border: 1px solid #333; text-align: right; font-size: 10px;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG GI\xc1 TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền h\xe0ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Chiết khấu:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Thuế:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ph\xed giao h\xe0ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="margin: 8px 0; font-size: 11px;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- THANH TO\xc1N -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Phương thức TT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_name}</td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">TT thanh to\xe1n:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_status}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Kh\xe1ch đưa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_customer}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Tiền thừa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{money_return}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi ch\xfa:</strong> {order_note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người mua h\xe0ng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người b\xe1n h\xe0ng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn qu\xfd kh\xe1ch đ\xe3 mua h\xe0ng!</div>
  <div>Hotline: {store_phone_number} | In l\xfac: {print_date} {print_time}</div>
</div>

</div>
`,quote:`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>ĐT: {store_phone_number} | Email: {store_email}</div>
    </td>
  </tr>
</table>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU B\xc1O GI\xc1</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
  <div style="font-style: italic;">Hiệu lực đến: {issued_on}</div>
</div>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">M\xe3 KH:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nh\xe2n vi\xean:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ch\xednh s\xe1ch gi\xe1:</td>
      <td style="padding: 5px; border: 1px solid #333;">{price_list_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">SL</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn gi\xe1</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 80px;">CK</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Th\xe0nh tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_discount_amount}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GI\xc1 TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<p style="margin: 10px 0;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {order_note}
</div>

<!-- ĐIỀU KHOẢN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333; font-size: 11px;">
  <strong>Điều khoản:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>B\xe1o gi\xe1 c\xf3 hiệu lực trong 7 ng\xe0y kể từ ng\xe0y lập</li>
    <li>Gi\xe1 tr\xean chưa bao gồm ph\xed vận chuyển (nếu c\xf3)</li>
    <li>Thanh to\xe1n: Theo thỏa thuận</li>
  </ul>
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Kh\xe1ch h\xe0ng</strong><br>
        <em>(K\xfd x\xe1c nhận đồng \xfd)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nh\xe2n vi\xean b\xe1o gi\xe1</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333;">
  <p style="margin: 5px 0;">Cảm ơn Qu\xfd kh\xe1ch đ\xe3 quan t\xe2m!</p>
  <p style="margin: 5px 0;">Li\xean hệ: {store_phone_number}</p>

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In l\xfac: {print_date} {print_time}</div></div>

</div>
`,receipt:`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU THU</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{receipt_voucher_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- M\xc3 VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{receipt_barcode}</div>
      <div style="font-family: monospace;">{receipt_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- TH\xd4NG TIN PHIẾU THU -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nộp tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">L\xfd do nộp:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">H\xecnh thức thanh to\xe1n:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nộp tiền</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,payment:`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{payment_voucher_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- M\xc3 VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{payment_barcode}</div>
      <div style="font-family: monospace;">{payment_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- TH\xd4NG TIN PHIẾU CHI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Người nhận tiền:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{object_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{object_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">L\xfd do chi:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">H\xecnh thức thanh to\xe1n:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_method}</td>
    </tr>
  </tbody>
</table>

<!-- SỐ TIỀN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 15px; border: 2px solid #333;">
      <div style="margin-bottom: 8px;">Số tiền</div>
      <div style="font-size: 24px; font-weight: bold;">{amount}</div>
      <div style="font-style: italic; margin-top: 8px;">({amount_text})</div>
    </td>
  </tr>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nhận tiền</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,warranty:`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BẢO H\xc0NH</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>M\xe3 phiếu: <strong>{warranty_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- TH\xd4NG TIN SẢN PHẨM BẢO H\xc0NH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{product_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Serial/IMEI:</td>
      <td style="padding: 8px; border: 1px solid #333; font-family: monospace; font-size: 14px;">{serial_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Thời hạn BH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{warranty_duration}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Ng\xe0y hết hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{warranty_expired_on}</strong></td>
    </tr>
  </tbody>
</table>

<!-- QUY ĐỊNH BẢO H\xc0NH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>ĐƯỢC BẢO H\xc0NH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- C\xf2n trong thời hạn bảo h\xe0nh</div>
        <div>- Tem bảo h\xe0nh c\xf2n nguy\xean vẹn</div>
        <div>- Hư hỏng do lỗi kỹ thuật từ NSX</div>
      </div>
    </td>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>TỪ CHỐI BẢO H\xc0NH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Rơi vỡ, trầy xước, biến dạng</div>
        <div>- V\xe0o nước, ẩm, ch\xe1y, nổ</div>
        <div>- Tự \xfd th\xe1o lắp, sửa chữa</div>
        <div>- Sử dụng sai c\xe1ch, cố \xfd l\xe0m hư</div>
      </div>
    </td>
  </tr>
</table>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Kh\xe1ch h\xe0ng</strong><br>
        <em>(K\xfd x\xe1c nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nh\xe2n vi\xean</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn qu\xfd kh\xe1ch đ\xe3 tin tưởng sử dụng dịch vụ của ch\xfang t\xf4i!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In l\xfac: {print_date} {print_time}</div></div>

</div>
`,"inventory-check":`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KIỂM KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>M\xe3 phiếu: <strong>{inventory_code}</strong></div>
  <div>Ng\xe0y kiểm: {created_on}</div>
</div>

<!-- TH\xd4NG TIN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng th\xe1i:</td>
      <td style="padding: 5px; border: 1px solid #333;">{inventory_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Tồn kho</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Thực tế</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">Lệch</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left; width: 100px;">Ghi ch\xfa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_on_hand}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_real_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_difference}</td>
      <td style="padding: 6px; border: 1px solid #333; font-size: 11px;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG KẾT -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số SP kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 80px;"><strong>{total_items}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Ch\xeanh lệch (thừa):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>+{total_surplus}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Ch\xeanh lệch (thiếu):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>-{total_shortage}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người kiểm kho</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"stock-transfer":`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHUYỂN KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>M\xe3 phiếu: <strong>{transfer_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN CHUYỂN KHO -->
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
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng th\xe1i:</td>
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
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
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

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho xuất</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho nhập</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"sales-return":`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ H\xc0NG</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_return_code}</strong></div>
  <div>Đơn h\xe0ng gốc: <strong>{order_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">L\xfd do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn gi\xe1</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Th\xe0nh tiền</th>
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

<!-- TỔNG TIỀN HO\xc0N -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG TIỀN HO\xc0N:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Trạng th\xe1i ho\xe0n:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refund_status}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Kh\xe1ch h\xe0ng</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người nhận h\xe0ng trả</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Hotline: {store_phone_number}

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In l\xfac: {print_date} {print_time}</div></div>

</div>
`,"purchase-order":`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT H\xc0NG NHẬP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_supplier_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN NH\xc0 CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nh\xe0 cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">M\xe3 NCC:</td>
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
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn gi\xe1</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Th\xe0nh tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người lập đơn</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Duyệt đơn</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,packing:`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU Đ\xd3NG G\xd3I</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>M\xe3: <strong>{fulfillment_code}</strong> | Đơn h\xe0ng: <strong>{order_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">SĐT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ giao:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV được g\xe1n:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{assigned_employee}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">M\xe3 SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">T\xean sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 35px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 55px; font-size: 10px;">Vị tr\xed</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 70px; font-size: 10px;">Ghi ch\xfa</th>
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

<!-- TỔNG CỘNG V\xc0 COD -->
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

<!-- GHI CH\xda -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi ch\xfa đ\xf3ng g\xf3i:</strong> {packing_note}
</div>
<div style="margin: 8px 0; padding: 8px; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi ch\xfa đơn h\xe0ng:</strong> {order_note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người đ\xf3ng g\xf3i</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Kiểm tra</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,delivery:`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU GIAO H\xc0NG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>M\xe3: <strong>{delivery_code}</strong> | Đơn h\xe0ng: <strong>{order_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
</div>

<!-- M\xc3 VẠCH VẬN ĐƠN -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 8px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 5px;">{shipment_barcode}</div>
      <div style="font-size: 14px; font-weight: bold; font-family: monospace;">{tracking_number}</div>
      <div style="font-size: 10px;">Đối t\xe1c: {carrier_name}</div>
    </td>
  </tr>
</table>

<!-- TH\xd4NG TIN NGƯỜI NHẬN -->
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
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV giao h\xe0ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{shipper_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng th\xe1i:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{delivery_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 70px; font-size: 10px;">M\xe3 SP</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">T\xean sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 30px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 60px; font-size: 10px;">Đơn gi\xe1</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Th\xe0nh tiền</th>
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

<!-- TỔNG GI\xc1 TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng số lượng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; width: 85px; font-size: 11px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Tổng tiền h\xe0ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ph\xed vận chuyển:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{delivery_fee}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px;"><strong>COD - THU HỘ:</strong></td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px;"><strong>{cod_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người giao</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{shipper_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người nhận</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{receiver_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn qu\xfd kh\xe1ch!</div>
  <div>Hotline: {store_phone_number} | In l\xfac: {print_date} {print_time}</div>
</div>

</div>
`,"shipping-label":`
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 400px; margin: 0 auto; border: 2px solid #333; padding: 15px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px dashed #333;">
  <div style="font-size: 14px; font-weight: bold;">{store_name}</div>
  <div style="font-size: 12px;">{store_phone_number}</div>
</div>

<!-- M\xc3 VẬN ĐƠN -->
<div style="text-align: center; margin-bottom: 10px; padding: 10px; background: #f5f5f5;">
  <div style="margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="font-size: 18px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div style="font-size: 12px;">Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI -->
<div style="margin-bottom: 10px; padding: 8px; background: #f5f5f5;">
  <div style="font-weight: bold; font-size: 11px;">Gửi:</div>
  <div><strong>{store_name}</strong></div>
  <div style="font-size: 11px;">{store_address}</div>
</div>

<!-- NGƯỜI NHẬN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333;">
  <div style="font-weight: bold; font-size: 11px;">Nhận:</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{customer_name}</div>
  <div style="font-size: 14px; font-weight: bold;">{customer_phone_number}</div>
  <div style="font-size: 12px;">{shipping_address}</div>
</div>

<!-- TH\xd4NG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Số lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 8px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 11px;">Khối lượng</div>
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{total_weight_g}g</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 12px; border: 2px solid #333; margin-bottom: 10px;">
  <div style="font-size: 12px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 22px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CH\xda -->
<div style="font-size: 11px;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

</div>
`,"product-label":`
<div style="font-family: 'Inter', Arial, sans-serif; width: 320px; background: #fff; padding: 16px; line-height: 1.5; font-size: 13px; color: #111;">
  <!-- T\xcaN SẢN PHẨM -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">T\xcaN SẢN PHẨM:</span> {product_name_vat}
  </div>

  <!-- THƯƠNG HIỆU & ĐỊA CHỈ SẢN XUẤT -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Thương Hiệu:</span> {product_brand}. <span style="font-weight: 700;">Địa chỉ sản xuất:</span> {product_origin}
  </div>

  <!-- HƯỚNG DẪN SỬ DỤNG -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">Hướng Dẫn sử dụng:</span> {product_usage_guide}
  </div>

  <!-- ĐƠN VỊ NHẬP KHẨU -->
  <div style="margin-bottom: 8px;">
    <span style="font-weight: 700;">ĐƠN VỊ NHẬP KHẨU:</span> {product_importer_name}
  </div>

  <!-- ĐỊA CHỈ NHẬP KHẨU -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">Địa chỉ:</span> {product_importer_address}
  </div>

  <!-- BARCODE -->
  <div style="display: flex; align-items: center; gap: 12px; padding-top: 8px; border-top: 1px dashed #ccc;">
    <div style="flex: 1;">
      {product_barcode_image}
      <div style="font-size: 11px; margin-top: 2px;">{product_barcode}</div>
    </div>
  </div>
</div>
`,"stock-in":`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU NHẬP KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>M\xe3: <strong>{stock_in_code}</strong></div>
  <div>Đơn đặt h\xe0ng: <strong>{order_supplier_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN NHẬP KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho nhập:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Trạng th\xe1i:</td>
      <td style="padding: 5px; border: 1px solid #333;">{stock_in_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nh\xe0 cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">M\xe3 NCC:</td>
      <td style="padding: 5px; border: 1px solid #333; font-family: monospace;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người tạo:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 35px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 90px;">M\xe3 SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Nhập</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 90px;">Đơn gi\xe1</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Th\xe0nh tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small>{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_ordered_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_received_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_total}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG TIỀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{tax_vat}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đ\xe3 thanh to\xe1n:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{paid}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">C\xf2n phải trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người giao</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"supplier-return":`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ H\xc0NG NH\xc0 CUNG CẤP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>M\xe3: <strong>{return_supplier_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN NH\xc0 CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Nh\xe0 cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">M\xe3 NCC:</td>
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
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">L\xfd do trả:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3"><strong>{reason_return}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn gi\xe1</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Th\xe0nh tiền</th>
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

<!-- TỔNG GI\xc1 TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 8px; border: 1px solid #333;"><strong>TỔNG GI\xc1 TRỊ TRẢ:</strong></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_order}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Đ\xe3 nhận ho\xe0n:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refunded}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">C\xf2n phải nhận:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{remaining}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Đại diện NCC</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,complaint:`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="width: 80px; vertical-align: top;">{store_logo}</td>
    <td style="vertical-align: top;">
      <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
      <div>{store_address}</div>
      <div>Hotline: <strong>{store_phone_number}</strong></div>
    </td>
  </tr>
</table>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KHIẾU NẠI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>M\xe3 phiếu: <strong>{complaint_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_phone_number}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Email:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_email}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_address}</td>
    </tr>
  </tbody>
</table>

<!-- TH\xd4NG TIN ĐƠN H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">M\xe3 đơn h\xe0ng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Ng\xe0y mua:</td>
      <td style="padding: 5px; border: 1px solid #333;">{order_date}</td>
    </tr>
  </tbody>
</table>

<!-- NỘI DUNG KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Loại khiếu nại:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{complaint_type}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Sản phẩm:</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name} - <small>{line_variant}</small></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">M\xf4 tả vấn đề:</td>
      <td style="padding: 8px; border: 1px solid #333;">{complaint_description}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Y\xeau cầu của KH:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_request}</strong></td>
    </tr>
  </tbody>
</table>

<!-- XỬ L\xdd KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng th\xe1i:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{complaint_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Phương \xe1n xử l\xfd:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolution}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người xử l\xfd:</td>
      <td style="padding: 5px; border: 1px solid #333;">{assignee_name}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ng\xe0y ho\xe0n th\xe0nh:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolved_on}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {complaint_note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Kh\xe1ch h\xe0ng</strong><br>
        <em>(K\xfd x\xe1c nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người xử l\xfd</strong><br>
        <em>(K\xfd, ghi r\xf5 họ t\xean)</em><br>
        <div style="height: 50px;"></div>
        {assignee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Quản l\xfd</strong><br>
        <em>(K\xfd duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn qu\xfd kh\xe1ch đ\xe3 phản hồi. Ch\xfang t\xf4i sẽ xử l\xfd trong thời gian sớm nhất!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In l\xfac: {print_date} {print_time}</div></div>

</div>
`,penalty:d,leave:d,"cost-adjustment":`
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU ĐIỀU CHỈNH GI\xc1 VỐN</h2>
<div style="text-align: center; margin-bottom: 15px;">
  <div>Số: <strong>{adjustment_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
</div>

<!-- TH\xd4NG TIN CHI NH\xc1NH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; width: 25%; background: #f5f5f5; border: 1px solid #333;">Chi nh\xe1nh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;">{location_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">L\xfd do điều chỉnh:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{reason}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Trạng th\xe1i:</td>
      <td style="padding: 5px; border: 1px solid #333;">{status}</td>
    </tr>
  </tbody>
</table>

<!-- DANH S\xc1CH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 30px;">STT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">M\xe3 SP</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Gi\xe1 vốn cũ</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Gi\xe1 vốn mới</th>
      <th style="padding: 6px; border: 1px solid #333; text-align: right;">Ch\xeanh lệch</th>
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
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng tăng gi\xe1 vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: green;">{total_increase}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Tổng giảm gi\xe1 vốn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; color: red;">{total_decrease}</td>
    </tr>
    <tr style="font-weight: bold; font-size: 13px;">
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">CH\xcaNH LỆCH:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_difference}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin: 15px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center;">
        <strong>Người lập phiếu</strong>
        <div style="margin-top: 50px; font-style: italic;">{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center;">
        <strong>Người x\xe1c nhận</strong>
        <div style="margin-top: 50px; font-style: italic;">{confirmed_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- NG\xc0Y IN -->
<div style="text-align: right; margin-top: 20px; font-size: 10px; color: #666;">
  In ng\xe0y: {print_date} {print_time}
</div>

</div>
`,handover:`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU B\xc0N GIAO</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{handover_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
</div>

<!-- TH\xd4NG TIN B\xc0N GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người b\xe0n giao:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{from_employee}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{from_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người nhận:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{to_employee}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Bộ phận:</td>
      <td style="padding: 8px; border: 1px solid #333;">{to_department}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Loại b\xe0n giao:</td>
      <td style="padding: 8px; border: 1px solid #333;">{handover_type}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng th\xe1i:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG NỘI DUNG B\xc0N GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Nội dung b\xe0n giao</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">T\xecnh trạng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left; width: 150px;">Ghi ch\xfa</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_description}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_condition}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_note}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda CHUNG -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CAM KẾT -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Cam kết:</strong> Hai b\xean đ\xe3 kiểm tra v\xe0 x\xe1c nhận đầy đủ c\xe1c nội dung b\xe0n giao tr\xean. Người nhận cam kết bảo quản v\xe0 sử dụng đ\xfang mục đ\xedch.
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI B\xc0N GIAO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
        <div>{from_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
        <div>{to_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">X\xc1C NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; color: #666; font-size: 11px;">
  Phiếu n\xe0y được lập th\xe0nh 02 bản, mỗi b\xean giữ 01 bản c\xf3 gi\xe1 trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In l\xfac: {print_date} {print_time}</div></div>

</div>
`,payroll:`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 900px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo tr\xe1i + Th\xf4ng tin cửa h\xe0ng phải -->
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">BẢNG LƯƠNG TỔNG HỢP</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div><strong>{batch_title}</strong></div>
  <div>M\xe3: <strong>{batch_code}</strong> | Kỳ lương: <strong>{pay_period}</strong></div>
</div>

<!-- TH\xd4NG TIN BẢNG LƯƠNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Trạng th\xe1i:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{batch_status}</strong></td>
      <td style="padding: 4px 6px; width: 20%; border: 1px solid #333; font-size: 11px;">Ng\xe0y thanh to\xe1n:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Th\xe1ng chấm c\xf4ng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{reference_months}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Số nh\xe2n vi\xean:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{total_employees}</strong> người</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Người lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_by}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ng\xe0y lập:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{created_on}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Ghi ch\xfa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{notes}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG CHI TIẾT LƯƠNG TỪNG NH\xc2N VI\xcaN - Table layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 58px; font-size: 10px;">M\xe3 NV</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Họ t\xean</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; width: 80px; font-size: 10px;">Ph\xf2ng ban</th>
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
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Đ\xf3ng g\xf3p (DN):</td>
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

<!-- FOOTER: Chữ k\xfd -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập</div>
      <div style="font-size: 11px;">{created_by}</div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Kế to\xe1n trưởng</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 33%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Gi\xe1m đốc</div>
      <div style="font-size: 11px;"></div>
    </td>
  </tr>
</table>

<!-- NG\xc0Y IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ng\xe0y in: {print_date} {print_time}
</div>

</div>
`,payslip:`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 700px; margin: 0 auto; padding: 10px;">

<!-- HEADER: Logo tr\xe1i + Th\xf4ng tin cửa h\xe0ng phải -->
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

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU LƯƠNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div>Kỳ lương: <strong>{pay_period}</strong></div>
  <div>M\xe3 phiếu: <strong>{payslip_code}</strong></div>
</div>

<!-- TH\xd4NG TIN NH\xc2N VI\xcaN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">M\xe3 nh\xe2n vi\xean:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_code}</strong></td>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Họ v\xe0 t\xean:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Ph\xf2ng ban:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{department_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Chức vụ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{position}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Bảng lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{batch_title} ({batch_code})</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Ng\xe0y thanh to\xe1n:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Kỳ lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{pay_period}</td>
    </tr>
  </tbody>
</table>

<!-- TH\xd4NG TIN CHẤM C\xd4NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; background: #f8f9fa;">
  <tbody>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Ng\xe0y c\xf4ng</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;"><strong>{work_days}</strong> / {standard_work_days}</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Nghỉ ph\xe9p</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;">{leave_days} ng\xe0y</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Tổng giờ OT</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center; color: #0066cc;"><strong>{ot_hours}h</strong></td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Vắng kh\xf4ng ph\xe9p</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{absent_days} ng\xe0y</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ng\xe0y thường</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekday}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">Đi trễ/Về sớm</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{late_arrivals} lần / {early_departures} lần</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT cuối tuần</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekend}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ng\xe0y lễ</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_holiday}h</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT C\xc1C TH\xc0NH PHẦN LƯƠNG (LINE ITEMS) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">I. CHI TIẾT THU NHẬP</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 11px; width: 30px;">STT</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px; width: 140px;">T\xean th\xe0nh phần</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Chi tiết t\xednh</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 110px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: center; font-size: 10px;">{line_stt}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px;">{component_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 10px; color: #555;">{component_formula}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 10px; font-weight: bold;">{component_amount}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #f5f5f5;">
      <td colspan="3" style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng thu nhập (Gross)</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{total_earnings}</td>
    </tr>
  </tfoot>
</table>

<!-- C\xc1C KHOẢN KHẤU TRỪ -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">II. C\xc1C KHOẢN KHẤU TRỪ</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Khoản mục</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; width: 120px;">Số tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHXH (8%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhxh_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHYT (1.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhyt_amount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">BHTN (1%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{bhtn_amount}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng bảo hiểm (10.5%)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_insurance}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Thuế TNCN</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{personal_income_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ phạt</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{penalty_deductions}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ kh\xe1c</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #c00;">{other_deductions}</td>
    </tr>
  </tbody>
  <tfoot>
    <tr style="background: #fff5f5;">
      <td style="padding: 5px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">Tổng khấu trừ</td>
      <td style="padding: 5px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{total_deductions}</td>
    </tr>
  </tfoot>
</table>

<!-- T\xcdNH THUẾ TNCN (Tham khảo) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">III. T\xcdNH THUẾ TNCN</h4>
<p style="font-size: 10px; color: #666; margin: 0 0 8px 0; font-style: italic;">C\xf4ng thức: Thu nhập chịu thuế = Tổng thu nhập - BH (NV đ\xf3ng) - Giảm trừ gia cảnh</p>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; width: 60%;">Mức giảm trừ bản th\xe2n (theo luật thuế TNCN)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{personal_deduction}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Mức giảm trừ người phụ thuộc ({dependents_count} người \xd7 4.400.000)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{dependent_deduction}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thu nhập chịu thuế</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold;">{taxable_income}</td>
    </tr>
    <tr style="background: #fff5f5;">
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; font-weight: bold;">→ Thuế TNCN phải nộp</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; font-weight: bold; color: #c00;">{personal_income_tax}</td>
    </tr>
  </tbody>
</table>

<!-- THỰC LĨNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr style="background: #d4edda;">
      <td style="padding: 8px 10px; border: 2px solid #333; font-size: 14px; font-weight: bold; width: 50%;">THỰC LĨNH</td>
      <td style="padding: 8px 10px; border: 2px solid #333; text-align: right; font-size: 14px; font-weight: bold; color: #155724;">{net_pay}</td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="font-style: italic; margin: 10px 0; font-size: 11px; padding: 8px; border: 1px solid #333; background: #fffde7;">
  <strong>Số tiền bằng chữ:</strong> {net_pay_text}
</p>

<!-- FOOTER: Chữ k\xfd -->
<table style="width: 100%; margin-top: 25px; border-collapse: collapse;">
  <tr>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người lập phiếu</div>
      <div style="font-size: 11px;"></div>
    </td>
    <td style="width: 50%; text-align: center; padding: 5px; vertical-align: top;">
      <div style="font-weight: bold; margin-bottom: 50px; font-size: 11px;">Người nhận</div>
      <div style="font-size: 11px;">{employee_name}</div>
    </td>
  </tr>
</table>

<!-- NG\xc0Y IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ng\xe0y in: {print_date} {print_time}
</div>

</div>
`,attendance:`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 9px; 
      line-height: 1.2;
      padding: 8mm;
    }
    @page { size: A4 portrait; margin: 8mm; }
    .page-break { page-break-after: always; }
    
    .header { 
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      gap: 10px;
    }
    .store-logo {
      max-width: 40px;
      max-height: 40px;
    }
    .store-info-container { flex: 1; }
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 13px; 
      font-weight: bold; 
      text-align: center;
      margin: 8px 0 4px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 11px;
      text-align: center;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .employee-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 6px 10px;
      background: #f0f0f0;
      border-radius: 3px;
      font-size: 9px;
    }
    .info-group { display: flex; gap: 20px; }
    .info-item strong { font-weight: bold; }
    
    .legend {
      margin: 6px 0;
      font-size: 8px;
      color: #666;
    }
    .legend span { margin-right: 10px; }
    
    .tables-container {
      display: flex;
      gap: 8px;
    }
    .half-month {
      flex: 1;
    }
    .half-month h4 {
      font-size: 9px;
      text-align: center;
      margin-bottom: 4px;
      background: #333;
      color: white;
      padding: 3px;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 8px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px 3px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
      font-size: 7px;
    }
    .col-day { width: 22px; }
    .col-dow { width: 22px; }
    .col-status { width: 28px; }
    .col-time { width: 38px; font-size: 7px; }
    
    .summary-section {
      margin: 10px 0;
      display: flex;
      gap: 10px;
    }
    .summary-box {
      flex: 1;
      padding: 6px 10px;
      background: #f5f5f5;
      border-radius: 3px;
      border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
    }
    .summary-box strong {
      font-size: 11px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 30%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 35px;
    }
    .signature-line {
      border-top: 1px dotted #333;
      padding-top: 3px;
      font-size: 8px;
    }
    
    .print-date {
      font-size: 8px;
      color: #666;
      text-align: right;
      margin-top: 10px;
    }
    
    @media print {
      body { padding: 5mm; }
    }
  </style>
</head>
<body>
  {{#line_items}}
  <div class="employee-page">
    <!-- Header -->
    <div class="header">
      <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
      <div class="store-info-container">
        <div class="store-name">{store_name}</div>
        <div class="store-info">{store_address} | ĐT: {store_phone_number}</div>
      </div>
    </div>

    <div class="title">BẢNG CHẤM C\xd4NG C\xc1 NH\xc2N</div>
    <div class="subtitle">Th\xe1ng {month_year}</div>

    <!-- Th\xf4ng tin nh\xe2n vi\xean -->
    <div class="employee-info">
      <div class="info-group">
        <div class="info-item"><strong>M\xe3 NV:</strong> {employee_code}</div>
        <div class="info-item"><strong>Họ t\xean:</strong> {employee_name}</div>
      </div>
      <div class="info-group">
        <div class="info-item"><strong>Ph\xf2ng ban:</strong> {department_name}</div>
      </div>
    </div>

    <!-- Ch\xfa th\xedch -->
    <div class="legend">
      <span>✓ C\xf3 mặt</span>
      <span>X Vắng</span>
      <span>P Nghỉ ph\xe9p</span>
      <span>\xbd Nửa ng\xe0y</span>
      <span>L Nghỉ lễ</span>
      <span>- Cuối tuần/Chưa đến</span>
    </div>

    <!-- 2 bảng song song: Nửa đầu + Nửa cuối th\xe1ng -->
    <div class="tables-container">
      <!-- Nửa đầu th\xe1ng (1-15) -->
      <div class="half-month">
        <h4>Ng\xe0y 1 - 15</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ng\xe0y</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">V\xe0o</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>{dow_1}</td><td>{day_1}</td><td>{checkin_1}</td><td>{checkout_1}</td></tr>
            <tr><td>2</td><td>{dow_2}</td><td>{day_2}</td><td>{checkin_2}</td><td>{checkout_2}</td></tr>
            <tr><td>3</td><td>{dow_3}</td><td>{day_3}</td><td>{checkin_3}</td><td>{checkout_3}</td></tr>
            <tr><td>4</td><td>{dow_4}</td><td>{day_4}</td><td>{checkin_4}</td><td>{checkout_4}</td></tr>
            <tr><td>5</td><td>{dow_5}</td><td>{day_5}</td><td>{checkin_5}</td><td>{checkout_5}</td></tr>
            <tr><td>6</td><td>{dow_6}</td><td>{day_6}</td><td>{checkin_6}</td><td>{checkout_6}</td></tr>
            <tr><td>7</td><td>{dow_7}</td><td>{day_7}</td><td>{checkin_7}</td><td>{checkout_7}</td></tr>
            <tr><td>8</td><td>{dow_8}</td><td>{day_8}</td><td>{checkin_8}</td><td>{checkout_8}</td></tr>
            <tr><td>9</td><td>{dow_9}</td><td>{day_9}</td><td>{checkin_9}</td><td>{checkout_9}</td></tr>
            <tr><td>10</td><td>{dow_10}</td><td>{day_10}</td><td>{checkin_10}</td><td>{checkout_10}</td></tr>
            <tr><td>11</td><td>{dow_11}</td><td>{day_11}</td><td>{checkin_11}</td><td>{checkout_11}</td></tr>
            <tr><td>12</td><td>{dow_12}</td><td>{day_12}</td><td>{checkin_12}</td><td>{checkout_12}</td></tr>
            <tr><td>13</td><td>{dow_13}</td><td>{day_13}</td><td>{checkin_13}</td><td>{checkout_13}</td></tr>
            <tr><td>14</td><td>{dow_14}</td><td>{day_14}</td><td>{checkin_14}</td><td>{checkout_14}</td></tr>
            <tr><td>15</td><td>{dow_15}</td><td>{day_15}</td><td>{checkin_15}</td><td>{checkout_15}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Nửa cuối th\xe1ng (16-31) -->
      <div class="half-month">
        <h4>Ng\xe0y 16 - 31</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ng\xe0y</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">V\xe0o</th>
              <th class="col-time">Ra</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>16</td><td>{dow_16}</td><td>{day_16}</td><td>{checkin_16}</td><td>{checkout_16}</td></tr>
            <tr><td>17</td><td>{dow_17}</td><td>{day_17}</td><td>{checkin_17}</td><td>{checkout_17}</td></tr>
            <tr><td>18</td><td>{dow_18}</td><td>{day_18}</td><td>{checkin_18}</td><td>{checkout_18}</td></tr>
            <tr><td>19</td><td>{dow_19}</td><td>{day_19}</td><td>{checkin_19}</td><td>{checkout_19}</td></tr>
            <tr><td>20</td><td>{dow_20}</td><td>{day_20}</td><td>{checkin_20}</td><td>{checkout_20}</td></tr>
            <tr><td>21</td><td>{dow_21}</td><td>{day_21}</td><td>{checkin_21}</td><td>{checkout_21}</td></tr>
            <tr><td>22</td><td>{dow_22}</td><td>{day_22}</td><td>{checkin_22}</td><td>{checkout_22}</td></tr>
            <tr><td>23</td><td>{dow_23}</td><td>{day_23}</td><td>{checkin_23}</td><td>{checkout_23}</td></tr>
            <tr><td>24</td><td>{dow_24}</td><td>{day_24}</td><td>{checkin_24}</td><td>{checkout_24}</td></tr>
            <tr><td>25</td><td>{dow_25}</td><td>{day_25}</td><td>{checkin_25}</td><td>{checkout_25}</td></tr>
            <tr><td>26</td><td>{dow_26}</td><td>{day_26}</td><td>{checkin_26}</td><td>{checkout_26}</td></tr>
            <tr><td>27</td><td>{dow_27}</td><td>{day_27}</td><td>{checkin_27}</td><td>{checkout_27}</td></tr>
            <tr><td>28</td><td>{dow_28}</td><td>{day_28}</td><td>{checkin_28}</td><td>{checkout_28}</td></tr>
            <tr><td>29</td><td>{dow_29}</td><td>{day_29}</td><td>{checkin_29}</td><td>{checkout_29}</td></tr>
            <tr><td>30</td><td>{dow_30}</td><td>{day_30}</td><td>{checkin_30}</td><td>{checkout_30}</td></tr>
            <tr><td>31</td><td>{dow_31}</td><td>{day_31}</td><td>{checkin_31}</td><td>{checkout_31}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tổng kết -->
    <div class="summary-section">
      <div class="summary-box"><span>Ng\xe0y c\xf4ng:</span> <strong>{work_days}</strong></div>
      <div class="summary-box"><span>Nghỉ ph\xe9p:</span> <strong>{leave_days}</strong></div>
      <div class="summary-box"><span>Vắng mặt:</span> <strong>{absent_days}</strong></div>
      <div class="summary-box"><span>Đi trễ:</span> <strong>{late_arrivals}</strong></div>
      <div class="summary-box"><span>Về sớm:</span> <strong>{early_departures}</strong></div>
      <div class="summary-box"><span>Giờ l\xe0m th\xeam:</span> <strong>{ot_hours}h</strong></div>
    </div>

    <!-- Chữ k\xfd -->
    <div class="footer">
      <div class="signature-box">
        <div class="signature-title">Nh\xe2n vi\xean</div>
        <div class="signature-line">(K\xfd, ghi r\xf5 họ t\xean)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Trưởng ph\xf2ng</div>
        <div class="signature-line">(K\xfd, ghi r\xf5 họ t\xean)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Gi\xe1m đốc</div>
        <div class="signature-line">(K\xfd, đ\xf3ng dấu)</div>
      </div>
    </div>

    <div class="print-date">Ng\xe0y in: {print_date}</div>
  </div>
  <div class="page-break"></div>
  {{/line_items}}
</body>
</html>`},f={"supplier-order":`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT H\xc0NG NHẬP</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{order_supplier_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
</div>

<!-- TH\xd4NG TIN NH\xc0 CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Nh\xe0 cung cấp:</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>{supplier_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">M\xe3 NCC:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{supplier_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Địa chỉ:</td>
      <td style="padding: 8px; border: 1px solid #ddd;" colspan="3">{supplier_address}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Kho nhập:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{location_name}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Ng\xe0y giao dự kiến:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{expected_on}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn gi\xe1</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Th\xe0nh tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GI\xc1 TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng tiền h\xe0ng:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Thuế VAT:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG CỘNG:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP ĐƠN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">PH\xca DUYỆT</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"return-order":`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ H\xc0NG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{return_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
  <div>Đơn h\xe0ng gốc: <strong>{order_code}</strong></div>
</div>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">M\xe3 KH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">L\xfd do trả:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{reason}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn gi\xe1</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Th\xe0nh tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG GI\xc1 TRỊ HO\xc0N -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG TIỀN HO\xc0N:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; font-style: italic;">{total_text}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Trạng th\xe1i ho\xe0n tiền:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;"><strong>{refund_status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KH\xc1CH H\xc0NG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN H\xc0NG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"refund-confirmation":`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU X\xc1C NHẬN HO\xc0N TIỀN</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{refund_code}</strong></div>
  <div>Ng\xe0y: {created_on} {created_on_time}</div>
</div>

<!-- TH\xd4NG TIN HO\xc0N TIỀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">M\xe3 đơn h\xe0ng gốc:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ng\xe0y đặt:</td>
      <td style="padding: 8px; border: 1px solid #333;">{order_date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">M\xe3 phiếu trả:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{return_code}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ng\xe0y trả:</td>
      <td style="padding: 8px; border: 1px solid #333;">{return_date}</td>
    </tr>
  </tbody>
</table>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Kh\xe1ch h\xe0ng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">L\xfd do ho\xe0n:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3">{refund_reason}</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT HO\xc0N TIỀN -->
<div style="background: #f5f5f5; border: 2px solid #333; padding: 20px; margin-bottom: 20px; text-align: center;">
  <div style="font-size: 14px; color: #666; margin-bottom: 10px;">SỐ TIỀN HO\xc0N</div>
  <div style="font-size: 28px; font-weight: bold;">{refund_amount}</div>
  <div style="font-style: italic; color: #666; margin-top: 5px;">({refund_amount_text})</div>
</div>

<!-- TH\xd4NG TIN HO\xc0N -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">H\xecnh thức ho\xe0n:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_method}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng th\xe1i:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ng\xe0y ho\xe0n tiền:</td>
      <td style="padding: 8px; border: 1px solid #333;">{refunded_on}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người xử l\xfd:</td>
      <td style="padding: 8px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- TH\xd4NG TIN T\xc0I KHOẢN (nếu chuyển khoản) -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ng\xe2n h\xe0ng:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_name}</td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chi nh\xe1nh:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_branch}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Số t\xe0i khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{bank_account}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chủ t\xe0i khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_account_name}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KH\xc1CH H\xc0NG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd x\xe1c nhận đ\xe3 nhận tiền)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI XỬ L\xdd</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"packing-guide":`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">HƯỚNG DẪN Đ\xd3NG G\xd3I</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Đơn h\xe0ng: <strong>{order_code}</strong></div>
  <div>Ng\xe0y: {created_on}</div>
</div>

<!-- TH\xd4NG TIN NGƯỜI NHẬN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TH\xd4NG TIN GIAO H\xc0NG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 120px;"><strong>Người nhận:</strong></td>
        <td>{customer_name}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Điện thoại:</strong></td>
        <td>{customer_phone_number}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Địa chỉ:</strong></td>
        <td>{shipping_address}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- CHECKLIST Đ\xd3NG G\xd3I -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">CHECKLIST Đ\xd3NG G\xd3I</div>
  <table style="width: 100%;">
    <tbody>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra đầy đủ sản phẩm theo danh s\xe1ch</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra t\xecnh trạng sản phẩm</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Bọc chống sốc cho sản phẩm dễ vỡ</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Đ\xf3ng g\xf3i chắc chắn, d\xe1n k\xedn</td></tr>
      <tr><td style="padding: 5px 0;">[ ] D\xe1n nh\xe3n giao h\xe0ng</td></tr>
      <tr><td style="padding: 5px 0;">[ ] K\xe8m h\xf3a đơn/phiếu giao h\xe0ng</td></tr>
    </tbody>
  </table>
</div>

<!-- DANH S\xc1CH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị tr\xed kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Đ\xe3 lấy</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-family: monospace;">{line_variant_code}</td>
      <td style="padding: 8px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold; font-size: 16px;">{line_quantity}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center;">{bin_location}</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: center; font-size: 20px;">[ ]</td>
    </tr>
  </tbody>
</table>

<!-- TỔNG QUAN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold;">Tổng số lượng:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 16px;">{total_quantity}</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #333;">COD thu hộ:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold;">{cod}</td>
    </tr>
  </tbody>
</table>

<!-- LƯU \xdd ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">LƯU \xdd ĐẶC BIỆT</div>
  <div>{packing_note}</div>
  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #333;">
    <strong>Ghi ch\xfa đơn h\xe0ng:</strong> {order_note}
  </div>
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI Đ\xd3NG G\xd3I</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"sales-summary":`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Chi nh\xe1nh: {location_name}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">B\xc1O C\xc1O TỔNG KẾT B\xc1N H\xc0NG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Kỳ b\xe1o c\xe1o: <strong>{period}</strong></div>
  <div>Từ ng\xe0y: {from_date} - Đến ng\xe0y: {to_date}</div>
  <div>Người lập: {account_name} | Ng\xe0y lập: {created_on}</div>
</div>

<!-- THỐNG K\xca TỔNG QUAN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Tổng đơn h\xe0ng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_orders}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Doanh thu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_revenue}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Chiết khấu</div>
        <div style="font-size: 24px; font-weight: bold;">{total_discount}</div>
      </td>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Trả h\xe0ng</div>
        <div style="font-size: 24px; font-weight: bold;">{total_returns}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT DOANH THU -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">CHI TIẾT DOANH THU</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Doanh thu b\xe1n h\xe0ng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{sales_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Ph\xed giao h\xe0ng thu được:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{delivery_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thuế VAT:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{total_tax}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold; font-size: 14px;">TỔNG DOANH THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 16px;">{total_revenue}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- THỐNG K\xca THANH TO\xc1N -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">THỐNG K\xca THANH TO\xc1N</div>
  <table style="width: 100%; border-collapse: collapse;">
    <tbody>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Tiền mặt:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{cash_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Chuyển khoản:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{bank_transfer_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thẻ t\xedn dụng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{card_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">V\xed điện tử:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{ewallet_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">COD:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{cod_amount}</td>
      </tr>
      <tr style="background: #f5f5f5;">
        <td style="padding: 10px; font-weight: bold;">TỔNG THU:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 14px;">{total_collected}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TOP SẢN PHẨM B\xc1N CHẠY -->
<div style="margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; color: #333; font-size: 14px;">TOP SẢN PHẨM B\xc1N CHẠY</div>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: left;">Sản phẩm</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">SL b\xe1n</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 120px;">Doanh thu</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #333; text-align: center;">{line_stt}</td>
        <td style="padding: 8px; border: 1px solid #333;">{line_product_name}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: center; font-weight: bold;">{line_quantity}</td>
        <td style="padding: 8px; border: 1px solid #333; text-align: right;">{line_amount}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- GHI CH\xda -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP B\xc1O C\xc1O</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">QUẢN L\xdd X\xc1C NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"warranty-request":`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">Hotline: {store_phone_number}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU Y\xcaU CẦU BẢO H\xc0NH</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{warranty_request_code}</strong></div>
  <div>Ng\xe0y tiếp nhận: {created_on} {created_on_time}</div>
</div>

<!-- TH\xd4NG TIN KH\xc1CH H\xc0NG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TH\xd4NG TIN KH\xc1CH H\xc0NG</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Họ t\xean:</strong></td>
        <td style="padding: 5px 0;"><strong>{customer_name}</strong></td>
        <td style="padding: 5px 0; width: 20%;"><strong>M\xe3 KH:</strong></td>
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

<!-- TH\xd4NG TIN SẢN PHẨM -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TH\xd4NG TIN SẢN PHẨM BẢO H\xc0NH</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Sản phẩm:</strong></td>
        <td style="padding: 5px 0;"><strong>{product_name}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>M\xe3 SP:</strong></td>
        <td style="padding: 5px 0;">{product_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Serial/IMEI:</strong></td>
        <td style="padding: 5px 0;"><strong>{serial_number}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>M\xe3 đơn h\xe0ng gốc:</strong></td>
        <td style="padding: 5px 0;">{order_code}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Ng\xe0y mua:</strong></td>
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

<!-- T\xccNH TRẠNG LỖI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">T\xccNH TRẠNG LỖI</div>
  <table style="width: 100%;">
    <tbody>
      <tr>
        <td style="padding: 5px 0; width: 25%;"><strong>Loại lỗi:</strong></td>
        <td style="padding: 5px 0;"><strong>{issue_type}</strong></td>
      </tr>
      <tr>
        <td style="padding: 5px 0; vertical-align: top;"><strong>M\xf4 tả lỗi:</strong></td>
        <td style="padding: 5px 0;">{issue_description}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>T\xecnh trạng m\xe1y:</strong></td>
        <td style="padding: 5px 0;">{device_condition}</td>
      </tr>
      <tr>
        <td style="padding: 5px 0;"><strong>Phụ kiện k\xe8m:</strong></td>
        <td style="padding: 5px 0;">{accessories}</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- TRẠNG TH\xc1I XỬ L\xdd -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Trạng th\xe1i:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;"><strong style="color: #eb2f96;">{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Ưu ti\xean:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{priority}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Người tiếp nhận:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{received_by}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Kỹ thuật vi\xean:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;">{technician_name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #d9d9d9; font-weight: bold;">Dự kiến ho\xe0n th\xe0nh:</td>
      <td style="padding: 8px; border: 1px solid #d9d9d9;" colspan="3">{expected_completion_date}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CH\xda -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa:</strong> {note}
</div>

<!-- QUY ĐỊNH BẢO H\xc0NH -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>QUY ĐỊNH BẢO H\xc0NH:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Thời gian xử l\xfd: 7-14 ng\xe0y l\xe0m việc (t\xf9y mức độ lỗi)</li>
    <li>Kh\xe1ch h\xe0ng vui l\xf2ng mang theo phiếu n\xe0y khi nhận m\xe1y</li>
    <li>Cửa h\xe0ng kh\xf4ng chịu tr\xe1ch nhiệm nếu m\xe1y kh\xf4ng được nhận trong 30 ng\xe0y</li>
    <li>Hotline hỗ trợ: {store_phone_number}</li>
  </ul>
</div>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KH\xc1CH H\xc0NG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd x\xe1c nhận)</div>
        <div style="height: 50px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NH\xc2N VI\xcaN TIẾP NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
        <div>{received_by}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: center;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`,"packing-request":`
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Kho: {location_name}</div>
</div>

<!-- TI\xcaU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU Y\xcaU CẦU Đ\xd3NG G\xd3I</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">M\xe3 y\xeau cầu: <strong>{packing_request_code}</strong></div>
  <div>Đơn h\xe0ng: <strong>{order_code}</strong></div>
  <div>Ng\xe0y tạo: {created_on} {created_on_time}</div>
</div>

<!-- ĐỘ ƯU TI\xcaN -->
<div style="text-align: center; margin-bottom: 20px;">
  <span style="background: #f5f5f5; border: 1px solid #333; padding: 8px 20px; font-weight: bold; font-size: 14px;">
    ĐỘ ƯU TI\xcaN: {priority}
  </span>
</div>

<!-- TH\xd4NG TIN GIAO H\xc0NG -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">TH\xd4NG TIN GIAO H\xc0NG</div>
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

<!-- DANH S\xc1CH SẢN PHẨM CẦN Đ\xd3NG G\xd3I -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">M\xe3 SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">T\xean sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị tr\xed kho</th>
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

<!-- THỐNG K\xca -->
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

<!-- Y\xcaU CẦU ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">Y\xcaU CẦU ĐẶC BIỆT</div>
  <div>{special_request}</div>
</div>

<!-- GHI CH\xda -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi ch\xfa đ\xf3ng g\xf3i:</strong> {packing_note}
</div>

<!-- TRẠNG TH\xc1I -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng th\xe1i:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người được g\xe1n:</td>
      <td style="padding: 8px; border: 1px solid #333;">{assigned_employee}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Thời hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{deadline}</strong></td>
    </tr>
  </tbody>
</table>

<!-- CHỮ K\xdd -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI Đ\xd3NG G\xd3I</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KIỂM TRA</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(K\xfd, ghi r\xf5 họ t\xean)</div>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  In l\xfac: {print_date} {print_time}
</div>

</div>
`};function g(a){return a in e?e[a]:a in f?f[a]:""}let h=(a,b,c)=>c?`${a}-${b}-${c}`:`${a}-${b}`,i=(0,b.create)()((0,c.persist)((a,b)=>({templates:{},defaultSizes:{},getTemplate:(a,c,d)=>{let e=b(),f=h(a,c,d),i=e.templates[f];if(i&&i.content&&""!==i.content.trim())return("payroll"===a||"payslip"===a)&&(i.content.includes("{{#line_items}}")||i.content.includes("{line_index}"))?{id:`template-${f}`,type:a,name:"payroll"===a?"Bảng lương":"Phiếu lương",content:g(a),paperSize:c,isActive:!0,updatedAt:new Date().toISOString()}:i;let j=h(a,c),k=e.templates[j];return d&&k&&k.content&&""!==k.content.trim()?("payroll"===a||"payslip"===a)&&(k.content.includes("{{#line_items}}")||k.content.includes("{line_index}"))?{id:`template-${f}`,type:a,name:"payroll"===a?"Bảng lương":"Phiếu lương",content:g(a),paperSize:c,isActive:!0,updatedAt:new Date().toISOString()}:k:{id:`template-${f}`,type:a,name:"order"===a?"Mẫu hóa đơn bán hàng":"Mẫu in",content:g(a),paperSize:c,isActive:!0,updatedAt:new Date().toISOString()}},updateTemplate:(b,c,d,e)=>{let f=h(b,c,e);a(a=>{let e=a.templates[f]||{id:`template-${f}`,type:b,name:"Mẫu in",content:g(b),paperSize:c,isActive:!0,updatedAt:new Date().toISOString()};return{templates:{...a.templates,[f]:{...e,content:d,updatedAt:new Date().toISOString()}}}})},updateTemplateAllBranches:(b,c,d)=>{let e=h(b,c);a(a=>{let f={...a.templates};return Object.keys(f).forEach(a=>{a.startsWith(`${b}-${c}-`)&&delete f[a]}),{templates:{...f,[e]:{id:`template-${e}`,type:b,name:"Mẫu in",content:d,paperSize:c,isActive:!0,updatedAt:new Date().toISOString()}}}})},resetTemplate:(b,c,d)=>{let e=h(b,c,d);a(a=>({templates:{...a.templates,[e]:{id:`template-${e}`,type:b,name:"Mẫu mặc định",content:g(b),paperSize:c,isActive:!0,updatedAt:new Date().toISOString()}}}))},setDefaultSize:(b,c)=>{a(a=>({defaultSizes:{...a.defaultSizes,[b]:c}}))},getDefaultSize:a=>b().defaultSizes[a]||"A4"}),{name:"print-templates-storage"}));a.s(["usePrintTemplateStore",0,i],686797)}];

//# sourceMappingURL=features_settings_printer_store_ts_4accb666._.js.map