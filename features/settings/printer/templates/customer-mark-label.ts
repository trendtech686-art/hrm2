/**
 * Mẫu in Tem đánh dấu khách hàng (customer mark label)
 * In kèm sau tem phụ sản phẩm để đánh dấu hàng của khách nào
 * Khổ giấy vật lý: 50mm rộng × 30mm cao (HPRT N41) — paper size '50x30'
 */
export const CUSTOMER_MARK_LABEL_TEMPLATE = `
<div style="font-family: Calibri, 'Segoe UI', Arial, sans-serif; width: 48mm; height: 28mm; max-height: 28mm; background: #fff; line-height: 1.3; font-size: 7pt; color: #111; box-sizing: border-box; overflow: hidden; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">

  <!-- MÃ ĐƠN -->
  <div style="margin-bottom: 2mm; font-size: 8pt; font-weight: 700; letter-spacing: 0.5px;">
    {order_code}
  </div>

  <!-- TÊN KHÁCH -->
  <div style="margin-bottom: 1mm; font-size: 8pt; font-weight: 700; max-width: 46mm; overflow: hidden; text-overflow: ellipsis;">
    {customer_name}
  </div>

  <!-- SỐ ĐIỆN THOẠI -->
  <div style="font-size: 7pt; font-weight: 600;">
    {customer_phone_number}
  </div>

</div>
`;
