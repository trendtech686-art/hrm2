(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/features/settings/printer/templates/order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn bán hàng - TipTap compatible
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số sản phẩm
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Product table: table-layout fixed, responsive
 * - Summary: 250px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "ORDER_TEMPLATE",
    ()=>ORDER_TEMPLATE
]);
const ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

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
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 8px;">HÓA ĐƠN BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 11px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{customer_name}</strong></td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Mã KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Điện thoại:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_phone_number}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Nhóm KH:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{customer_group}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Địa chỉ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">ĐC giao hàng:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">NV bán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{account_name}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Trạng thái:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{order_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM - Responsive với table-layout fixed -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">STT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: left; font-size: 10px;">Tên sản phẩm</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 32px; font-size: 10px;">ĐVT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: center; width: 28px; font-size: 10px;">SL</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 65px; font-size: 10px;">Đơn giá</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 50px; font-size: 10px;">VAT</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 45px; font-size: 10px;">CK</th>
      <th style="padding: 5px 3px; border: 1px solid #333; text-align: right; width: 70px; font-size: 10px;">Thành tiền</th>
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

<!-- BẢNG TỔNG GIÁ TRỊ -->
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
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Chiết khấu:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Thuế:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Phí giao hàng:</td>
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

<!-- THANH TOÁN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Phương thức TT:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_name}</td>
      <td style="padding: 4px 6px; width: 18%; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">TT thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_status}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Khách đưa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payment_customer}</td>
      <td style="padding: 4px 6px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">Tiền thừa:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{money_return}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border: 1px solid #333; font-size: 11px;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 25px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người mua hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 8px; vertical-align: top;">
        <div style="font-weight: bold; font-size: 11px;">Người bán hàng</div>
        <div style="color: #888; font-size: 10px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div style="font-size: 11px;">{account_name}</div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 10px; color: #666;">
  <div>Cảm ơn quý khách đã mua hàng!</div>
  <div>Hotline: {store_phone_number} | In lúc: {print_date} {print_time}</div>
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/quote.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu báo giá / Đơn tạm tính - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "QUOTE_TEMPLATE",
    ()=>QUOTE_TEMPLATE
]);
const QUOTE_TEMPLATE = `
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

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÁO GIÁ</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div style="font-style: italic;">Hiệu lực đến: {issued_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã KH:</td>
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
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhân viên:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Chính sách giá:</td>
      <td style="padding: 5px; border: 1px solid #333;">{price_list_name}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">SL</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 80px;">CK</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
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

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
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

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {order_note}
</div>

<!-- ĐIỀU KHOẢN -->
<div style="margin-bottom: 10px; padding: 10px; border: 1px solid #333; font-size: 11px;">
  <strong>Điều khoản:</strong>
  <ul style="margin: 5px 0 0 15px; padding: 0;">
    <li>Báo giá có hiệu lực trong 7 ngày kể từ ngày lập</li>
    <li>Giá trên chưa bao gồm phí vận chuyển (nếu có)</li>
    <li>Thanh toán: Theo thỏa thuận</li>
  </ul>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận đồng ý)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên báo giá</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333;">
  <p style="margin: 5px 0;">Cảm ơn Quý khách đã quan tâm!</p>
  <p style="margin: 5px 0;">Liên hệ: {store_phone_number}</p>

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/receipt.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu thu - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "RECEIPT_TEMPLATE",
    ()=>RECEIPT_TEMPLATE
]);
const RECEIPT_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU THU</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{receipt_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{receipt_barcode}</div>
      <div style="font-family: monospace;">{receipt_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU THU -->
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
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do nộp:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
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

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nộp tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chi - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PAYMENT_TEMPLATE",
    ()=>PAYMENT_TEMPLATE
]);
const PAYMENT_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU CHI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{payment_voucher_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- MÃ VẠCH -->
<table style="width: 100%; margin-bottom: 10px;">
  <tr>
    <td style="text-align: center; padding: 10px; border: 1px solid #333; background: #f5f5f5;">
      <div style="margin-bottom: 8px;">{payment_barcode}</div>
      <div style="font-family: monospace;">{payment_voucher_code}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN PHIẾU CHI -->
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
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Lý do chi:</td>
      <td style="padding: 5px; border: 1px solid #333;">{description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Hình thức thanh toán:</td>
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

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người nhận tiền</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {object_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Thủ quỹ</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người lập phiếu</strong><br>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/warranty.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bảo hành - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "WARRANTY_TEMPLATE",
    ()=>WARRANTY_TEMPLATE
]);
const WARRANTY_TEMPLATE = `
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

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BẢO HÀNH</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{warranty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
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

<!-- THÔNG TIN SẢN PHẨM BẢO HÀNH -->
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
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Ngày hết hạn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{warranty_expired_on}</strong></td>
    </tr>
  </tbody>
</table>

<!-- QUY ĐỊNH BẢO HÀNH -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tr>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>ĐƯỢC BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Còn trong thời hạn bảo hành</div>
        <div>- Tem bảo hành còn nguyên vẹn</div>
        <div>- Hư hỏng do lỗi kỹ thuật từ NSX</div>
      </div>
    </td>
    <td style="width: 50%; padding: 10px; border: 1px solid #333; vertical-align: top;">
      <strong>TỪ CHỐI BẢO HÀNH:</strong>
      <div style="padding-left: 10px; margin-top: 5px;">
        <div>- Rơi vỡ, trầy xước, biến dạng</div>
        <div>- Vào nước, ẩm, cháy, nổ</div>
        <div>- Tự ý tháo lắp, sửa chữa</div>
        <div>- Sử dụng sai cách, cố ý làm hư</div>
      </div>
    </td>
  </tr>
</table>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Nhân viên</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã tin tưởng sử dụng dịch vụ của chúng tôi!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/inventory-check.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu kiểm kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "INVENTORY_CHECK_TEMPLATE",
    ()=>INVENTORY_CHECK_TEMPLATE
]);
const INVENTORY_CHECK_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KIỂM KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{inventory_code}</strong></div>
  <div>Ngày kiểm: {created_on}</div>
</div>

<!-- THÔNG TIN KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho kiểm:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
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
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Tồn kho</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 70px;">Thực tế</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">Lệch</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left; width: 100px;">Ghi chú</th>
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
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thừa):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>+{total_surplus}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chênh lệch (thiếu):</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>-{total_shortage}</strong></td>
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
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người kiểm kho</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Thủ kho</strong><br>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/stock-transfer.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu chuyển kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_TRANSFER_TEMPLATE",
    ()=>STOCK_TRANSFER_TEMPLATE
]);
const STOCK_TRANSFER_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/sales-return.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SALES_RETURN_TEMPLATE",
    ()=>SALES_RETURN_TEMPLATE
]);
const SALES_RETURN_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_return_code}</strong></div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">SĐT:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
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

<!-- TỔNG TIỀN HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right; width: 100px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG TIỀN HOÀN:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Trạng thái hoàn:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{refund_status}</td>
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
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người nhận hàng trả</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Hotline: {store_phone_number}

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/purchase-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PURCHASE_ORDER_TEMPLATE",
    ()=>PURCHASE_ORDER_TEMPLATE
]);
const PURCHASE_ORDER_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{order_supplier_code}</strong></div>
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
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
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
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
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

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người lập đơn</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {account_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Duyệt đơn</strong><br>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu đóng gói - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "PACKING_TEMPLATE",
    ()=>PACKING_TEMPLATE
]);
const PACKING_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/delivery.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu giao hàng - TipTap compatible
 * Cập nhật: 2025-12-08 - Responsive + Chuẩn hóa
 */ __turbopack_context__.s([
    "DELIVERY_TEMPLATE",
    ()=>DELIVERY_TEMPLATE
]);
const DELIVERY_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/shipping-label.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Nhãn giao hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SHIPPING_LABEL_TEMPLATE",
    ()=>SHIPPING_LABEL_TEMPLATE,
    "SHIPPING_LABEL_TEMPLATE_LARGE",
    ()=>SHIPPING_LABEL_TEMPLATE_LARGE,
    "SHIPPING_LABEL_TEMPLATE_SMALL",
    ()=>SHIPPING_LABEL_TEMPLATE_SMALL
]);
const SHIPPING_LABEL_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 400px; margin: 0 auto; border: 2px solid #333; padding: 15px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px dashed #333;">
  <div style="font-size: 14px; font-weight: bold;">{store_name}</div>
  <div style="font-size: 12px;">{store_phone_number}</div>
</div>

<!-- MÃ VẬN ĐƠN -->
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

<!-- THÔNG TIN KIỆN -->
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

<!-- GHI CHÚ -->
<div style="font-size: 11px;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
const SHIPPING_LABEL_TEMPLATE_SMALL = `
<div style="font-family: Arial, sans-serif; font-size: 11px; line-height: 1.3; max-width: 300px; padding: 10px; border: 1px solid #333;">
  <div style="text-align: center; margin-bottom: 8px;">{shipment_barcode}</div>
  <div style="text-align: center; font-weight: bold; font-family: monospace; margin-bottom: 10px;">{shipment_code}</div>
  <div style="border-top: 1px dashed #333; padding-top: 8px;">
    <div><strong>{customer_name}</strong></div>
    <div>{customer_phone_number}</div>
    <div style="font-size: 10px;">{shipping_address}</div>
  </div>
  <div style="text-align: center; margin-top: 10px; padding: 5px; background: #f5f5f5; font-weight: bold;">
    COD: {cod}
  </div>
</div>
`;
const SHIPPING_LABEL_TEMPLATE_LARGE = `
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.4; max-width: 500px; margin: 0 auto; border: 3px solid #333; padding: 20px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px; padding-bottom: 15px; border-bottom: 2px solid #333;">
  <div style="font-size: 18px; font-weight: bold;">{store_name}</div>
  <div>{store_phone_number}</div>
</div>

<!-- MÃ VẠCH + QR -->
<table style="width: 100%; margin-bottom: 20px;">
  <tr>
    <td style="text-align: center; width: 60%;">{shipment_barcode}</td>
    <td style="text-align: center; width: 40%;">{shipment_qrcode}</td>
  </tr>
</table>

<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 28px; font-weight: bold; font-family: monospace;">{shipment_code}</div>
  <div>Đơn: {order_code}</div>
</div>

<!-- NGƯỜI GỬI / NHẬN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tr>
    <td style="padding: 15px; background: #f5f5f5; border: 1px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI GỬI</div>
      <div><strong>{store_name}</strong></div>
      <div>{store_phone_number}</div>
      <div style="font-size: 11px;">{store_address}</div>
    </td>
    <td style="padding: 15px; border: 2px solid #333; vertical-align: top; width: 50%;">
      <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
      <div style="font-size: 16px;"><strong>{customer_name}</strong></div>
      <div style="font-size: 15px; font-weight: bold;">{customer_phone_number}</div>
      <div style="font-size: 12px;">{shipping_address}</div>
    </td>
  </tr>
</table>

<!-- THÔNG TIN KIỆN -->
<table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
  <tr>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Số lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_quantity}</div>
    </td>
    <td style="text-align: center; padding: 15px; background: #f5f5f5; width: 50%; border: 1px solid #333;">
      <div style="font-size: 12px;">Khối lượng</div>
      <div style="font-size: 24px; font-weight: bold;">{total_weight_kg} kg</div>
    </td>
  </tr>
</table>

<!-- COD -->
<div style="text-align: center; padding: 20px; border: 3px solid #333; margin-bottom: 10px;">
  <div style="font-size: 14px; font-weight: bold;">THU HỘ (COD)</div>
  <div style="font-size: 32px; font-weight: bold;">{cod}</div>
</div>

<!-- GHI CHÚ -->
<div style="padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/product-label.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Tem phụ sản phẩm (product label)
 * Thiết kế theo mẫu tem phụ nhập khẩu chuẩn
 */ __turbopack_context__.s([
    "PRODUCT_LABEL_TEMPLATE",
    ()=>PRODUCT_LABEL_TEMPLATE
]);
const PRODUCT_LABEL_TEMPLATE = `
<div style="font-family: 'Inter', Arial, sans-serif; width: 320px; background: #fff; padding: 16px; line-height: 1.5; font-size: 13px; color: #111;">
  <!-- TÊN SẢN PHẨM -->
  <div style="margin-bottom: 12px;">
    <span style="font-weight: 700;">TÊN SẢN PHẨM:</span> {product_name_vat}
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
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/stock-in.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu nhập kho - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "STOCK_IN_TEMPLATE",
    ()=>STOCK_IN_TEMPLATE
]);
const STOCK_IN_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU NHẬP KHO</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã: <strong>{stock_in_code}</strong></div>
  <div>Đơn đặt hàng: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NHẬP KHO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Kho nhập:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{location_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{stock_in_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Nhà cung cấp:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{supplier_name}</strong></td>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mã NCC:</td>
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
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 90px;">Mã SP</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Đặt</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 55px;">SL Nhập</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 90px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Thành tiền</th>
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
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
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
      <td style="padding: 5px; border: 1px solid #333;">Đã thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{paid}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Còn phải trả:</td>
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
        <strong>Người giao</strong><br>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/supplier-return.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu trả hàng NCC - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "SUPPLIER_RETURN_TEMPLATE",
    ()=>SUPPLIER_RETURN_TEMPLATE
]);
const SUPPLIER_RETURN_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/complaint.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu khiếu nại - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COMPLAINT_TEMPLATE",
    ()=>COMPLAINT_TEMPLATE
]);
const COMPLAINT_TEMPLATE = `
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

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU KHIẾU NẠI</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Mã phiếu: <strong>{complaint_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Khách hàng:</td>
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

<!-- THÔNG TIN ĐƠN HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Mã đơn hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Ngày mua:</td>
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
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Mô tả vấn đề:</td>
      <td style="padding: 8px; border: 1px solid #333;">{complaint_description}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333;">Yêu cầu của KH:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_request}</strong></td>
    </tr>
  </tbody>
</table>

<!-- XỬ LÝ KHIẾU NẠI -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{complaint_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Phương án xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolution}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Người xử lý:</td>
      <td style="padding: 5px; border: 1px solid #333;">{assignee_name}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày hoàn thành:</td>
      <td style="padding: 5px; border: 1px solid #333;">{resolved_on}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {complaint_note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Khách hàng</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {customer_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người xử lý</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
        {assignee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Quản lý</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Cảm ơn quý khách đã phản hồi. Chúng tôi sẽ xử lý trong thời gian sớm nhất!

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/penalty.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu phạt - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "PENALTY_TEMPLATE",
    ()=>PENALTY_TEMPLATE
]);
const PENALTY_TEMPLATE = `
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
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 14px; font-weight: bold; margin-bottom: 2px; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XỬ PHẠT</h2>
<div style="text-align: center; margin-bottom: 10px;">
  <div>Số: <strong>{penalty_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI BỊ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; background: #f5f5f5; border: 1px solid #333;">Họ và tên:</td>
      <td style="padding: 5px; border: 1px solid #333;"><strong>{employee_name}</strong></td>
      <td style="padding: 5px; width: 15%; background: #f5f5f5; border: 1px solid #333;">Mã NV:</td>
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
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Ngày vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_date}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Mô tả vi phạm:</td>
      <td style="padding: 5px; border: 1px solid #333;">{violation_description}</td>
    </tr>
    <tr>
      <td style="padding: 5px; background: #f5f5f5; border: 1px solid #333;">Bằng chứng:</td>
      <td style="padding: 5px; border: 1px solid #333;">{evidence}</td>
    </tr>
  </tbody>
</table>

<!-- HÌNH THỨC XỬ PHẠT -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed; border: 2px solid #333;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 30%; background: #f5f5f5; border: 1px solid #333;">Hình thức:</td>
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

<!-- GHI CHÚ -->
<div style="margin: 10px 0; padding: 10px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {penalty_note}
</div>

<!-- CĂN CỨ PHÁP LÝ -->
<div style="margin: 10px 0; padding: 10px; border: 1px solid #333; font-size: 12px;">
  <strong>Căn cứ pháp lý:</strong> Theo quy định nội bộ công ty và Bộ luật Lao động Việt Nam.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Người vi phạm</strong><br>
        <em>(Ký xác nhận)</em><br>
        <div style="height: 50px;"></div>
        {employee_name}
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Trưởng bộ phận</strong><br>
        <em>(Ký, ghi rõ họ tên)</em><br>
        <div style="height: 50px;"></div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px;">
        <strong>Giám đốc</strong><br>
        <em>(Ký duyệt)</em><br>
        <div style="height: 50px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/cost-adjustment.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu điều chỉnh giá vốn - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */ __turbopack_context__.s([
    "COST_ADJUSTMENT_TEMPLATE",
    ()=>COST_ADJUSTMENT_TEMPLATE
]);
const COST_ADJUSTMENT_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payroll.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
 */ __turbopack_context__.s([
    "PAYROLL_TEMPLATE",
    ()=>PAYROLL_TEMPLATE
]);
const PAYROLL_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/payslip.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Payslip Template - Phiếu lương cá nhân
 * Mẫu in mặc định theo chuẩn TEMPLATE v2
 * 
 * QUAN TRỌNG - Quy tắc template:
 * 1. Bảng chứa {line_stt} là bảng line items - sẽ được lặp theo số components
 * 2. Các bảng khác là bảng thông tin - không lặp
 * 3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
 * 
 * CHUẨN TEMPLATE v2 (2025-12-08):
 * - Header: Logo trái + Store info phải (dạng table)
 * - Title: Căn giữa, border-bottom
 * - Info table: Label 22% nền xám
 * - Component table: table-layout fixed, responsive
 * - Summary: 280px căn phải
 * - Footer: border-top dashed, font nhỏ
 */ __turbopack_context__.s([
    "PAYSLIP_TEMPLATE",
    ()=>PAYSLIP_TEMPLATE
]);
const PAYSLIP_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 700px; margin: 0 auto; padding: 10px;">

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
<h2 style="text-align: center; margin: 12px 0 5px 0; font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; padding-bottom: 8px;">PHIẾU LƯƠNG</h2>
<div style="text-align: center; margin-bottom: 12px; font-size: 12px;">
  <div>Kỳ lương: <strong>{pay_period}</strong></div>
  <div>Mã phiếu: <strong>{payslip_code}</strong></div>
</div>

<!-- THÔNG TIN NHÂN VIÊN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Mã nhân viên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_code}</strong></td>
      <td style="padding: 4px 6px; width: 22%; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Họ và tên:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;"><strong>{employee_name}</strong></td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Phòng ban:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{department_name}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Chức vụ:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{position}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Bảng lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;" colspan="3">{batch_title} ({batch_code})</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Ngày thanh toán:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{payroll_date}</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; background: #f5f5f5;">Kỳ lương:</td>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">{pay_period}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN CHẤM CÔNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; background: #f8f9fa;">
  <tbody>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Ngày công</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;"><strong>{work_days}</strong> / {standard_work_days}</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; background: #e8e8e8; font-weight: bold;">Nghỉ phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; width: 25%; text-align: center;">{leave_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Tổng giờ OT</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center; color: #0066cc;"><strong>{ot_hours}h</strong></td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8; font-weight: bold;">Vắng không phép</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{absent_days} ngày</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày thường</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekday}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">Đi trễ/Về sớm</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{late_arrivals} lần / {early_departures} lần</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT cuối tuần</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_weekend}h</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; background: #e8e8e8;">OT ngày lễ</td>
      <td style="padding: 6px 8px; border: 1px solid #333; font-size: 11px; text-align: center;">{ot_hours_holiday}h</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT CÁC THÀNH PHẦN LƯƠNG (LINE ITEMS) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">I. CHI TIẾT THU NHẬP</h4>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <thead>
    <tr style="background: #e8e8e8;">
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: center; font-size: 11px; width: 30px;">STT</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px; width: 140px;">Tên thành phần</th>
      <th style="padding: 5px 6px; border: 1px solid #333; text-align: left; font-size: 11px;">Chi tiết tính</th>
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

<!-- CÁC KHOẢN KHẤU TRỪ -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">II. CÁC KHOẢN KHẤU TRỪ</h4>
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
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; padding-left: 10px;">Khấu trừ khác</td>
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

<!-- TÍNH THUẾ TNCN (Tham khảo) -->
<h4 style="margin: 15px 0 8px 0; font-size: 12px; font-weight: bold; border-bottom: 1px solid #333; padding-bottom: 4px;">III. TÍNH THUẾ TNCN</h4>
<p style="font-size: 10px; color: #666; margin: 0 0 8px 0; font-style: italic;">Công thức: Thu nhập chịu thuế = Tổng thu nhập - BH (NV đóng) - Giảm trừ gia cảnh</p>
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
  <tbody>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px; width: 60%;">Mức giảm trừ bản thân (theo luật thuế TNCN)</td>
      <td style="padding: 4px 6px; border: 1px solid #333; text-align: right; font-size: 11px; color: #666;">{personal_deduction}</td>
    </tr>
    <tr>
      <td style="padding: 4px 6px; border: 1px solid #333; font-size: 11px;">Mức giảm trừ người phụ thuộc ({dependents_count} người × 4.400.000)</td>
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

<!-- FOOTER: Chữ ký -->
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

<!-- NGÀY IN -->
<div style="margin-top: 15px; padding-top: 8px; border-top: 1px dashed #ccc; font-size: 10px; color: #666; text-align: right;">
  Ngày in: {print_date} {print_time}
</div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/supplier-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn đặt hàng nhập (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SUPPLIER_ORDER_TEMPLATE",
    ()=>SUPPLIER_ORDER_TEMPLATE
]);
const SUPPLIER_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">ĐƠN ĐẶT HÀNG NHẬP</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{order_supplier_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN NHÀ CUNG CẤP -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Nhà cung cấp:</td>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>{supplier_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Mã NCC:</td>
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
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #ddd; font-weight: bold;">Ngày giao dự kiến:</td>
      <td style="padding: 8px; border: 1px solid #ddd;">{expected_on}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Đặt</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
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

<!-- TỔNG GIÁ TRỊ -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng tiền hàng:</td>
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

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP ĐƠN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">PHÊ DUYỆT</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/return-order.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Đơn trả hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "RETURN_ORDER_TEMPLATE",
    ()=>RETURN_ORDER_TEMPLATE
]);
const RETURN_ORDER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU TRẢ HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{return_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
  <div>Đơn hàng gốc: <strong>{order_code}</strong></div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 15%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã KH:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Email:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do trả:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3"><strong>{reason}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM TRẢ -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL Trả</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
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

<!-- TỔNG GIÁ TRỊ HOÀN -->
<table style="width: 250px; margin-left: auto; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Tổng số lượng trả:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; width: 120px;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr style="background: #f5f5f5;">
      <td style="padding: 10px; border: 1px solid #333; font-weight: bold; font-size: 14px;">TỔNG TIỀN HOÀN:</td>
      <td style="padding: 10px; border: 1px solid #333; text-align: right; font-weight: bold; font-size: 14px;">{total_amount}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Bằng chữ:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right; font-style: italic;">{total_text}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #333;">Trạng thái hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333; text-align: right;"><strong>{refund_status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/handover.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu bàn giao (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "HANDOVER_TEMPLATE",
    ()=>HANDOVER_TEMPLATE
]);
const HANDOVER_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU BÀN GIAO</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{handover_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người bàn giao:</td>
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
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Loại bàn giao:</td>
      <td style="padding: 8px; border: 1px solid #333;">{handover_type}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{status}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẢNG NỘI DUNG BÀN GIAO -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Nội dung bàn giao</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">Số lượng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Tình trạng</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left; width: 150px;">Ghi chú</th>
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

<!-- GHI CHÚ CHUNG -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CAM KẾT -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Cam kết:</strong> Hai bên đã kiểm tra và xác nhận đầy đủ các nội dung bàn giao trên. Người nhận cam kết bảo quản và sử dụng đúng mục đích.
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI BÀN GIAO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{from_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{to_employee}</div>
      </td>
      <td style="width: 33%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 15px; padding-top: 8px; border-top: 1px dashed #333; color: #666; font-size: 11px;">
  Phiếu này được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị như nhau.

  <div style="font-size: 10px; color: #666; margin-top: 5px;">In lúc: {print_date} {print_time}</div></div>

</div>
`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/refund-confirmation.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu xác nhận hoàn (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "REFUND_CONFIRMATION_TEMPLATE",
    ()=>REFUND_CONFIRMATION_TEMPLATE
]);
const REFUND_CONFIRMATION_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">{store_address}</div>
  <div style="color: #666;">ĐT: {store_phone_number}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">PHIẾU XÁC NHẬN HOÀN TIỀN</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Số: <strong>{refund_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN HOÀN TIỀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã đơn hàng gốc:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{order_code}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày đặt:</td>
      <td style="padding: 8px; border: 1px solid #333;">{order_date}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Mã phiếu trả:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{return_code}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày trả:</td>
      <td style="padding: 8px; border: 1px solid #333;">{return_date}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN KHÁCH HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Khách hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Điện thoại:</td>
      <td style="padding: 8px; border: 1px solid #333;">{customer_phone_number}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Lý do hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;" colspan="3">{refund_reason}</td>
    </tr>
  </tbody>
</table>

<!-- CHI TIẾT HOÀN TIỀN -->
<div style="background: #f5f5f5; border: 2px solid #333; padding: 20px; margin-bottom: 20px; text-align: center;">
  <div style="font-size: 14px; color: #666; margin-bottom: 10px;">SỐ TIỀN HOÀN</div>
  <div style="font-size: 28px; font-weight: bold;">{refund_amount}</div>
  <div style="font-style: italic; color: #666; margin-top: 5px;">({refund_amount_text})</div>
</div>

<!-- THÔNG TIN HOÀN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Hình thức hoàn:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_method}</strong></td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Trạng thái:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{refund_status}</strong></td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngày hoàn tiền:</td>
      <td style="padding: 8px; border: 1px solid #333;">{refunded_on}</td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Người xử lý:</td>
      <td style="padding: 8px; border: 1px solid #333;">{account_name}</td>
    </tr>
  </tbody>
</table>

<!-- THÔNG TIN TÀI KHOẢN (nếu chuyển khoản) -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <tbody>
    <tr>
      <td style="padding: 8px; width: 25%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Ngân hàng:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_name}</td>
      <td style="padding: 8px; width: 20%; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chi nhánh:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_branch}</td>
    </tr>
    <tr>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Số tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;"><strong>{bank_account}</strong></td>
      <td style="padding: 8px; background: #f5f5f5; border: 1px solid #333; font-weight: bold;">Chủ tài khoản:</td>
      <td style="padding: 8px; border: 1px solid #333;">{bank_account_name}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">KHÁCH HÀNG</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký xác nhận đã nhận tiền)</div>
        <div style="height: 60px;"></div>
        <div>{customer_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI XỬ LÝ</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing-guide.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu hướng dẫn đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_GUIDE_TEMPLATE",
    ()=>PACKING_GUIDE_TEMPLATE
]);
const PACKING_GUIDE_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">HƯỚNG DẪN ĐÓNG GÓI</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Đơn hàng: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on}</div>
</div>

<!-- THÔNG TIN NGƯỜI NHẬN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">THÔNG TIN GIAO HÀNG</div>
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

<!-- CHECKLIST ĐÓNG GÓI -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">CHECKLIST ĐÓNG GÓI</div>
  <table style="width: 100%;">
    <tbody>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra đầy đủ sản phẩm theo danh sách</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kiểm tra tình trạng sản phẩm</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Bọc chống sốc cho sản phẩm dễ vỡ</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Đóng gói chắc chắn, dán kín</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Dán nhãn giao hàng</td></tr>
      <tr><td style="padding: 5px 0;">[ ] Kèm hóa đơn/phiếu giao hàng</td></tr>
    </tbody>
  </table>
</div>

<!-- DANH SÁCH SẢN PHẨM -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 10px; table-layout: fixed;">
  <thead>
    <tr style="background: #f5f5f5;">
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Mã SP</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">SL</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 100px;">Vị trí kho</th>
      <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 60px;">Đã lấy</th>
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

<!-- LƯU Ý ĐẶC BIỆT -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px;">LƯU Ý ĐẶC BIỆT</div>
  <div>{packing_note}</div>
  <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #333;">
    <strong>Ghi chú đơn hàng:</strong> {order_note}
  </div>
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI ĐÓNG GÓI</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 50px;"></div>
        <div>{account_name}</div>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/sales-summary.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu tổng kết bán hàng (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "SALES_SUMMARY_TEMPLATE",
    ()=>SALES_SUMMARY_TEMPLATE
]);
const SALES_SUMMARY_TEMPLATE = `
<div style="font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; max-width: 800px; margin: 0 auto; padding: 10px;">

<!-- HEADER -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 2px;">{store_name}</div>
  <div style="color: #666;">Chi nhánh: {location_name}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 20px 0 10px 0; font-size: 18px; text-transform: uppercase; border-bottom: 2px solid #333; padding-bottom: 10px;">BÁO CÁO TỔNG KẾT BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 20px;">
  <div style="font-size: 14px;">Kỳ báo cáo: <strong>{period}</strong></div>
  <div>Từ ngày: {from_date} - Đến ngày: {to_date}</div>
  <div>Người lập: {account_name} | Ngày lập: {created_on}</div>
</div>

<!-- THỐNG KÊ TỔNG QUAN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
  <tbody>
    <tr>
      <td style="width: 25%; padding: 15px; text-align: center; background: #f5f5f5; border: 1px solid #333;">
        <div style="font-size: 12px; color: #666;">Tổng đơn hàng</div>
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
        <div style="font-size: 12px; color: #666;">Trả hàng</div>
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
        <td style="padding: 8px; border-bottom: 1px solid #333;">Doanh thu bán hàng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right; font-weight: bold;">{sales_revenue}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Phí giao hàng thu được:</td>
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

<!-- THỐNG KÊ THANH TOÁN -->
<div style="background: #f5f5f5; border: 1px solid #333; padding: 15px; margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; font-size: 14px;">THỐNG KÊ THANH TOÁN</div>
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
        <td style="padding: 8px; border-bottom: 1px solid #333;">Thẻ tín dụng:</td>
        <td style="padding: 8px; border-bottom: 1px solid #333; text-align: right;">{card_amount}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #333;">Ví điện tử:</td>
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

<!-- TOP SẢN PHẨM BÁN CHẠY -->
<div style="margin-bottom: 20px;">
  <div style="font-weight: bold; margin-bottom: 10px; color: #333; font-size: 14px;">TOP SẢN PHẨM BÁN CHẠY</div>
  <table style="width: 100%; border-collapse: collapse;">
    <thead>
      <tr style="background: #f5f5f5;">
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: left;">Sản phẩm</th>
        <th style="padding: 10px; border: 1px solid #333; text-align: center; width: 80px;">SL bán</th>
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

<!-- GHI CHÚ -->
<div style="margin-bottom: 20px; padding: 12px; background: #f5f5f5; border: 1px solid #333;">
  <strong>Ghi chú:</strong> {note}
</div>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 40px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">NGƯỜI LẬP BÁO CÁO</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
        <div>{account_name}</div>
      </td>
      <td style="width: 50%; text-align: center; padding: 10px; vertical-align: top;">
        <div style="font-weight: bold; margin-bottom: 5px;">QUẢN LÝ XÁC NHẬN</div>
        <div style="color: #888; font-size: 12px; font-style: italic;">(Ký, ghi rõ họ tên)</div>
        <div style="height: 60px;"></div>
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/warranty-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu bảo hành (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "WARRANTY_REQUEST_TEMPLATE",
    ()=>WARRANTY_REQUEST_TEMPLATE
]);
const WARRANTY_REQUEST_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/packing-request.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Mẫu in Phiếu yêu cầu đóng gói (Extended) - TipTap compatible
 */ __turbopack_context__.s([
    "PACKING_REQUEST_TEMPLATE",
    ()=>PACKING_REQUEST_TEMPLATE
]);
const PACKING_REQUEST_TEMPLATE = `
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/attendance.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Attendance Template - Bảng chấm công
 * Mẫu in mặc định cho bảng chấm công
 * 
 * CHUẨN TEMPLATE v3 (2025-12-10):
 * - Dạng DỌC (portrait) - mỗi nhân viên 1 tờ A4
 * - Compact: Chia 2 nửa tháng theo chiều ngang
 * - Font nhỏ gọn, vừa 1 trang
 */ // Template cho BÁO CÁO CÁ NHÂN (mỗi nhân viên 1 trang)
__turbopack_context__.s([
    "ATTENDANCE_SUMMARY_TEMPLATE",
    ()=>ATTENDANCE_SUMMARY_TEMPLATE,
    "ATTENDANCE_TEMPLATE",
    ()=>ATTENDANCE_TEMPLATE
]);
const ATTENDANCE_TEMPLATE = `<!DOCTYPE html>
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

    <div class="title">BẢNG CHẤM CÔNG CÁ NHÂN</div>
    <div class="subtitle">Tháng {month_year}</div>

    <!-- Thông tin nhân viên -->
    <div class="employee-info">
      <div class="info-group">
        <div class="info-item"><strong>Mã NV:</strong> {employee_code}</div>
        <div class="info-item"><strong>Họ tên:</strong> {employee_name}</div>
      </div>
      <div class="info-group">
        <div class="info-item"><strong>Phòng ban:</strong> {department_name}</div>
      </div>
    </div>

    <!-- Chú thích -->
    <div class="legend">
      <span>✓ Có mặt</span>
      <span>X Vắng</span>
      <span>P Nghỉ phép</span>
      <span>½ Nửa ngày</span>
      <span>L Nghỉ lễ</span>
      <span>- Cuối tuần/Chưa đến</span>
    </div>

    <!-- 2 bảng song song: Nửa đầu + Nửa cuối tháng -->
    <div class="tables-container">
      <!-- Nửa đầu tháng (1-15) -->
      <div class="half-month">
        <h4>Ngày 1 - 15</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
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

      <!-- Nửa cuối tháng (16-31) -->
      <div class="half-month">
        <h4>Ngày 16 - 31</h4>
        <table>
          <thead>
            <tr>
              <th class="col-day">Ngày</th>
              <th class="col-dow">Thứ</th>
              <th class="col-status">TT</th>
              <th class="col-time">Vào</th>
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
      <div class="summary-box"><span>Ngày công:</span> <strong>{work_days}</strong></div>
      <div class="summary-box"><span>Nghỉ phép:</span> <strong>{leave_days}</strong></div>
      <div class="summary-box"><span>Vắng mặt:</span> <strong>{absent_days}</strong></div>
      <div class="summary-box"><span>Đi trễ:</span> <strong>{late_arrivals}</strong></div>
      <div class="summary-box"><span>Về sớm:</span> <strong>{early_departures}</strong></div>
      <div class="summary-box"><span>Giờ làm thêm:</span> <strong>{ot_hours}h</strong></div>
    </div>

    <!-- Chữ ký -->
    <div class="footer">
      <div class="signature-box">
        <div class="signature-title">Nhân viên</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Trưởng phòng</div>
        <div class="signature-line">(Ký, ghi rõ họ tên)</div>
      </div>
      <div class="signature-box">
        <div class="signature-title">Giám đốc</div>
        <div class="signature-line">(Ký, đóng dấu)</div>
      </div>
    </div>

    <div class="print-date">Ngày in: {print_date}</div>
  </div>
  <div class="page-break"></div>
  {{/line_items}}
</body>
</html>`;
const ATTENDANCE_SUMMARY_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: Arial, sans-serif; 
      font-size: 8px; 
      line-height: 1.2;
      padding: 5mm;
    }
    @page { size: A4 landscape; margin: 5mm; }
    
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
    .store-name { 
      font-size: 11px; 
      font-weight: bold; 
    }
    .store-info { 
      font-size: 8px; 
      color: #333;
    }
    
    .title { 
      font-size: 14px; 
      font-weight: bold; 
      text-align: center;
      margin: 5px 0;
      text-transform: uppercase;
    }
    .subtitle {
      font-size: 10px;
      text-align: center;
      margin-bottom: 8px;
    }
    
    .legend {
      font-size: 7px;
      margin-bottom: 5px;
      color: #666;
    }
    
    table { 
      width: 100%; 
      border-collapse: collapse; 
      font-size: 7px;
    }
    th, td { 
      border: 1px solid #999; 
      padding: 2px; 
      text-align: center;
    }
    th { 
      background: #e0e0e0; 
      font-weight: bold;
    }
    .col-name { 
      text-align: left; 
      padding-left: 3px !important;
      min-width: 80px;
    }
    
    .summary {
      margin-top: 8px;
      font-size: 9px;
    }
    
    .footer { 
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      width: 25%;
      text-align: center;
    }
    .signature-title {
      font-weight: bold;
      font-size: 9px;
      margin-bottom: 30px;
    }
    
    .print-date {
      font-size: 7px;
      color: #666;
      text-align: right;
      margin-top: 8px;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="{store_logo}" class="store-logo" onerror="this.style.display='none'">
    <div>
      <div class="store-name">{store_name}</div>
      <div class="store-info">{store_address}</div>
    </div>
  </div>

  <div class="title">BẢNG CHẤM CÔNG TỔNG HỢP</div>
  <div class="subtitle">Tháng {month_year} | Phòng ban: {department_name}</div>

  <div class="legend">
    ✓ = Có mặt | X = Vắng | P = Nghỉ phép | ½ = Nửa ngày | L = Nghỉ lễ | - = Cuối tuần
  </div>

  <table>
    <thead>
      <tr>
        <th rowspan="2">STT</th>
        <th rowspan="2">Mã NV</th>
        <th rowspan="2" class="col-name">Họ và tên</th>
        <th colspan="4">Tổng kết</th>
        <th colspan="31">Ngày trong tháng</th>
      </tr>
      <tr>
        <th>Công</th>
        <th>Phép</th>
        <th>Vắng</th>
        <th>OT</th>
        <th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th>
        <th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th>
        <th>16</th><th>17</th><th>18</th><th>19</th><th>20</th><th>21</th><th>22</th>
        <th>23</th><th>24</th><th>25</th><th>26</th><th>27</th><th>28</th><th>29</th><th>30</th><th>31</th>
      </tr>
    </thead>
    <tbody>
      {{#line_items}}
      <tr>
        <td>{line_index}</td>
        <td>{employee_code}</td>
        <td class="col-name">{employee_name}</td>
        <td>{work_days}</td>
        <td>{leave_days}</td>
        <td>{absent_days}</td>
        <td>{ot_hours}</td>
        <td>{day_1}</td><td>{day_2}</td><td>{day_3}</td><td>{day_4}</td><td>{day_5}</td><td>{day_6}</td><td>{day_7}</td>
        <td>{day_8}</td><td>{day_9}</td><td>{day_10}</td><td>{day_11}</td><td>{day_12}</td><td>{day_13}</td><td>{day_14}</td><td>{day_15}</td>
        <td>{day_16}</td><td>{day_17}</td><td>{day_18}</td><td>{day_19}</td><td>{day_20}</td><td>{day_21}</td><td>{day_22}</td>
        <td>{day_23}</td><td>{day_24}</td><td>{day_25}</td><td>{day_26}</td><td>{day_27}</td><td>{day_28}</td><td>{day_29}</td><td>{day_30}</td><td>{day_31}</td>
      </tr>
      {{/line_items}}
    </tbody>
  </table>

  <div class="summary">
    <strong>Tổng cộng:</strong> {total_employees} nhân viên | 
    {total_work_days} công | {total_leave_days} phép | {total_absent_days} vắng | {total_ot_hours}h OT
  </div>

  <div class="footer">
    <div class="signature-box">
      <div class="signature-title">Người lập</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Kế toán</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Trưởng phòng</div>
    </div>
    <div class="signature-box">
      <div class="signature-title">Giám đốc</div>
    </div>
  </div>

  <div class="print-date">Ngày in: {print_date}</div>
</body>
</html>`;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_TEMPLATES",
    ()=>DEFAULT_TEMPLATES,
    "EXTENDED_TEMPLATES",
    ()=>EXTENDED_TEMPLATES,
    "getAllTemplateTypes",
    ()=>getAllTemplateTypes,
    "getDefaultTemplate",
    ()=>getDefaultTemplate
]);
// =============================================
// EXPORT ALL DEFAULT TEMPLATES
// =============================================
// MAIN TEMPLATES (16 loại chính)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/quote.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/receipt.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/inventory-check.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-transfer.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-return.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/purchase-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/delivery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/shipping-label.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/product-label.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/stock-in.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-return.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/complaint.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/penalty.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/cost-adjustment.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payroll.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/payslip.ts [app-client] (ecmascript)");
// EXTENDED TEMPLATES (8 loại mở rộng - MỚI)
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/supplier-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/return-order.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/handover.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/refund-confirmation.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-guide.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/sales-summary.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/warranty-request.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/packing-request.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/attendance.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const DEFAULT_TEMPLATES = {
    'order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ORDER_TEMPLATE"],
    'quote': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$quote$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QUOTE_TEMPLATE"],
    'receipt': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$receipt$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RECEIPT_TEMPLATE"],
    'payment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYMENT_TEMPLATE"],
    'warranty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARRANTY_TEMPLATE"],
    'inventory-check': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$inventory$2d$check$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INVENTORY_CHECK_TEMPLATE"],
    'stock-transfer': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$transfer$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_TRANSFER_TEMPLATE"],
    'sales-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_RETURN_TEMPLATE"],
    'purchase-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$purchase$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PURCHASE_ORDER_TEMPLATE"],
    'packing': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_TEMPLATE"],
    'delivery': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$delivery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DELIVERY_TEMPLATE"],
    'shipping-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$shipping$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SHIPPING_LABEL_TEMPLATE"],
    'product-label': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$product$2d$label$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCT_LABEL_TEMPLATE"],
    'stock-in': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$stock$2d$in$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STOCK_IN_TEMPLATE"],
    'supplier-return': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$return$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPLIER_RETURN_TEMPLATE"],
    'complaint': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$complaint$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COMPLAINT_TEMPLATE"],
    'penalty': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'leave': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$penalty$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PENALTY_TEMPLATE"],
    'cost-adjustment': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$cost$2d$adjustment$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["COST_ADJUSTMENT_TEMPLATE"],
    'handover': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$handover$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HANDOVER_TEMPLATE"],
    'payroll': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payroll$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYROLL_TEMPLATE"],
    'payslip': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$payslip$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PAYSLIP_TEMPLATE"],
    'attendance': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$attendance$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ATTENDANCE_TEMPLATE"]
};
const EXTENDED_TEMPLATES = {
    'supplier-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$supplier$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPLIER_ORDER_TEMPLATE"],
    'return-order': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$return$2d$order$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RETURN_ORDER_TEMPLATE"],
    'refund-confirmation': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$refund$2d$confirmation$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["REFUND_CONFIRMATION_TEMPLATE"],
    'packing-guide': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$guide$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_GUIDE_TEMPLATE"],
    'sales-summary': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$sales$2d$summary$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SALES_SUMMARY_TEMPLATE"],
    'warranty-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$warranty$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WARRANTY_REQUEST_TEMPLATE"],
    'packing-request': __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$packing$2d$request$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PACKING_REQUEST_TEMPLATE"]
};
function getDefaultTemplate(type) {
    if (type in DEFAULT_TEMPLATES) {
        return DEFAULT_TEMPLATES[type];
    }
    if (type in EXTENDED_TEMPLATES) {
        return EXTENDED_TEMPLATES[type];
    }
    return '';
}
function getAllTemplateTypes() {
    return [
        ...Object.keys(DEFAULT_TEMPLATES),
        ...Object.keys(EXTENDED_TEMPLATES)
    ];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/default-templates.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
// Re-export từ templates/index.ts - các template mới đã được tối ưu với inline styles
// Các template này tương thích với TipTap editor và preview
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>");
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/settings/printer/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usePrintTemplateStore",
    ()=>usePrintTemplateStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$default$2d$templates$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/default-templates.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/settings/printer/templates/index.ts [app-client] (ecmascript) <locals>");
;
;
const getTemplateKey = (type, size, branchId)=>branchId ? `${type}-${size}-${branchId}` : `${type}-${size}`;
// API sync helper
async function syncTemplateToAPI(template, action) {
    try {
        const response = await fetch('/api/settings/print-templates', {
            method: action === 'create' ? 'POST' : action === 'delete' ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(template)
        });
        return response.ok;
    } catch (error) {
        console.error('syncTemplateToAPI error:', error);
        return false;
    }
}
const usePrintTemplateStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((set, get)=>({
        templates: {},
        defaultSizes: {},
        initialized: false,
        getTemplate: (type, size, branchId)=>{
            const state = get();
            const key = getTemplateKey(type, size, branchId);
            // Thử tìm template cho branch cụ thể
            const branchTemplate = state.templates[key];
            if (branchTemplate && branchTemplate.content && branchTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                // - {{#line_items}} : Mustache syntax không được hỗ trợ
                // - {line_index} : biến cũ, phải dùng {line_stt}
                if ((type === 'payroll' || type === 'payslip') && (branchTemplate.content.includes('{{#line_items}}') || branchTemplate.content.includes('{line_index}'))) {
                    // Template đang dùng syntax cũ không được hỗ trợ -> reset về mặc định
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return branchTemplate;
            }
            // Nếu không có template cho branch, tìm template chung
            const generalKey = getTemplateKey(type, size);
            const generalTemplate = state.templates[generalKey];
            if (branchId && generalTemplate && generalTemplate.content && generalTemplate.content.trim() !== '') {
                // Auto-reset payroll templates nếu phát hiện dùng syntax cũ
                if ((type === 'payroll' || type === 'payslip') && (generalTemplate.content.includes('{{#line_items}}') || generalTemplate.content.includes('{line_index}'))) {
                    return {
                        id: `template-${key}`,
                        type,
                        name: type === 'payroll' ? 'Bảng lương' : 'Phiếu lương',
                        content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                        paperSize: size,
                        isActive: true,
                        updatedAt: new Date().toISOString()
                    };
                }
                return generalTemplate;
            }
            // Return default template if not exists or empty
            // Đây là điểm quan trọng: nếu chưa có template hoặc template trống
            // thì sử dụng mẫu mặc định của hệ thống
            return {
                id: `template-${key}`,
                type,
                name: type === 'order' ? 'Mẫu hóa đơn bán hàng' : 'Mẫu in',
                content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                paperSize: size,
                isActive: true,
                updatedAt: new Date().toISOString()
            };
        },
        updateTemplate: (type, size, content, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>{
                const current = state.templates[key] || {
                    id: `template-${key}`,
                    type,
                    name: 'Mẫu in',
                    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                    paperSize: size,
                    isActive: true,
                    updatedAt: new Date().toISOString()
                };
                return {
                    templates: {
                        ...state.templates,
                        [key]: {
                            ...current,
                            content,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        updateTemplateAllBranches: (type, size, content)=>{
            // Lưu template chung (không có branchId) - sẽ áp dụng cho tất cả chi nhánh
            const key = getTemplateKey(type, size);
            set((state)=>{
                // Xóa tất cả template cụ thể của các branch cho type và size này
                const newTemplates = {
                    ...state.templates
                };
                Object.keys(newTemplates).forEach((k)=>{
                    if (k.startsWith(`${type}-${size}-`)) {
                        delete newTemplates[k];
                    }
                });
                return {
                    templates: {
                        ...newTemplates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu in',
                            content,
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                };
            });
        },
        resetTemplate: (type, size, branchId)=>{
            const key = getTemplateKey(type, size, branchId);
            set((state)=>({
                    templates: {
                        ...state.templates,
                        [key]: {
                            id: `template-${key}`,
                            type,
                            name: 'Mẫu mặc định',
                            content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$settings$2f$printer$2f$templates$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getDefaultTemplate"])(type),
                            paperSize: size,
                            isActive: true,
                            updatedAt: new Date().toISOString()
                        }
                    }
                }));
        },
        setDefaultSize: (type, size)=>{
            set((state)=>({
                    defaultSizes: {
                        ...state.defaultSizes,
                        [type]: size
                    }
                }));
        },
        getDefaultSize: (type)=>{
            const state = get();
            return state.defaultSizes[type] || 'A4';
        },
        loadFromAPI: async ()=>{
            if (get().initialized) return;
            try {
                const response = await fetch('/api/settings/print-templates');
                if (response.ok) {
                    const json = await response.json();
                    if (json.data) {
                        set({
                            templates: json.data.templates || {},
                            defaultSizes: json.data.defaultSizes || {},
                            initialized: true
                        });
                    }
                }
            } catch (error) {
                console.error('loadFromAPI error:', error);
            }
            set({
                initialized: true
            });
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=features_settings_printer_794f2f72._.js.map