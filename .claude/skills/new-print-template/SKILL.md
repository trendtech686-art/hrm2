# Skill: Tạo Print Template mới

## Khi nào dùng
User yêu cầu thêm mẫu in mới (hóa đơn, phiếu xuất, biên bản, tem nhãn...).

## Các file cần tạo/update

### 1. Tạo template file
`features/settings/printer/templates/[template-name].ts`

```typescript
import type { TemplateType } from '../types'

// Template HTML với {variable} placeholders
export function getTemplateName(): string {
  return `
    <div style="font-family: 'Times New Roman'; padding: 20px;">
      <h2>{company_name}</h2>
      <p>Mã: {order_code}</p>
      <p>Ngày: {order_date}</p>
      <!-- Line items table -->
      <table>
        <tr><th>STT</th><th>Tên SP</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr>
        {line_items}
      </table>
      <p>Tổng: {total_amount}</p>
    </div>
  `
}

// Template type phải khớp với TemplateType union
export const TEMPLATE_NAME_TYPE: TemplateType = 'template-name'
```

### 2. Đăng ký template trong types.ts
`features/settings/printer/types.ts`
- Thêm vào `TemplateType` union: `| 'template-name'`
- Thêm vào `TEMPLATE_TYPES` array
- Thêm label vào `TEMPLATE_TYPE_LABELS`

### 3. Đăng ký trong templates/index.ts
`features/settings/printer/templates/index.ts`
- Import template function
- Thêm vào `getTemplate(type)` switch/map

### 4. Thêm vào UI (nếu cần)
`features/orders/components/order-print-button.tsx` hoặc component tương ứng
- Thêm dropdown item / button cho mẫu in mới

### 5. Tạo data mapper (nếu cần)
`lib/print/print-data-mappers.ts`
- Map dữ liệu từ order/product → template variables

## Template Variables (Phổ biến)
```
{company_name}     — Tên công ty
{company_address}  — Địa chỉ công ty
{company_phone}    — SĐT công ty
{order_code}       — Mã đơn hàng
{order_date}       — Ngày đặt hàng
{customer_name}    — Tên khách hàng
{customer_phone}   — SĐT khách
{line_items}       — Bảng sản phẩm (HTML rows)
{total_amount}     — Tổng tiền
{total_quantity}   — Tổng số lượng
```

## Paper Sizes
- `A4`: Giấy A4 (210×297mm) — hóa đơn, hợp đồng
- `50x30`: Tem nhãn (HPRT N41, 30mm rộng × 50mm cao) — CSS: `size: 30mm 50mm; margin: 1mm`

## Checklist
- [ ] Template file tạo đúng path
- [ ] TemplateType union cập nhật
- [ ] TEMPLATE_TYPES array cập nhật
- [ ] templates/index.ts đăng ký
- [ ] UI button/dropdown thêm
- [ ] Data mapper nếu cần
- [ ] CSS @page size đúng cho paper size
