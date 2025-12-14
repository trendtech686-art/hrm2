/**
 * Mẫu in Nhãn giao hàng - TipTap compatible
 * Cập nhật: Thiết kế đen trắng cho máy in
 */
export const SHIPPING_LABEL_TEMPLATE = `
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

/**
 * Mẫu nhãn nhỏ - compact
 */
export const SHIPPING_LABEL_TEMPLATE_SMALL = `
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

/**
 * Mẫu nhãn lớn - đầy đủ thông tin
 */
export const SHIPPING_LABEL_TEMPLATE_LARGE = `
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
