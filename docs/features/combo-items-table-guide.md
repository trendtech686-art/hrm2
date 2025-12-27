# Hướng dẫn sử dụng Component bảng sản phẩm Combo

## Tổng quan

Hệ thống có 2 component chuyên dùng cho hiển thị danh sách sản phẩm trong Combo:

| Component | File | Mục đích |
|-----------|------|----------|
| `ComboItemsReadOnlyTable` | `components/shared/combo-items-readonly-table.tsx` | Hiển thị danh sách SP combo ở trang **chi tiết** (read-only) |
| `ComboItemsEditTable` | `components/shared/combo-items-edit-table.tsx` | Hiển thị & chỉnh sửa danh sách SP combo ở trang **tạo/sửa** |

---

## 1. ComboItemsReadOnlyTable

### Khi nào dùng?
- Trang **chi tiết sản phẩm combo** (`/products/:id` với type = combo)
- Bất kỳ nơi nào cần hiển thị danh sách SP trong combo mà **không cần chỉnh sửa**

### Props

```tsx
interface ComboItemsReadOnlyTableProps {
  /** Danh sách sản phẩm trong combo */
  comboItems: Array<{
    productSystemId: string;
    quantity: number;
  }>;
  /** Hiển thị cột Giá vốn (mặc định: true) */
  showCostPrice?: boolean;
  /** Hiển thị cột Có thể bán (mặc định: true) */
  showStock?: boolean;
  /** Callback khi click preview ảnh */
  onImagePreview?: (imageUrl: string, title: string) => void;
}
```

### Các cột hiển thị
| Cột | Mô tả |
|-----|-------|
| Sản phẩm | Ảnh + Tên + Mã SP + Loại SP |
| SL | Số lượng trong combo |
| Giá vốn | Giá vốn sản phẩm (optional) |
| Đơn giá | Giá bán theo pricing policy mặc định |
| Thành tiền | SL × Đơn giá |
| Có thể bán | Tổng tồn có thể bán toàn hệ thống (optional) |

### Ví dụ sử dụng

```tsx
import { ComboItemsReadOnlyTable } from '@/components/shared/combo-items-readonly-table';

// Trong trang chi tiết sản phẩm combo
<ComboItemsReadOnlyTable
  comboItems={product.comboItems || []}
  showCostPrice={true}
  showStock={true}
  onImagePreview={(url, title) => setPreviewImage({ url, title })}
/>
```

---

## 2. ComboItemsEditTable

### Khi nào dùng?
- Trang **tạo sản phẩm combo** (`/products/new?type=combo`)
- Trang **sửa sản phẩm combo** (`/products/:id/edit` với type = combo)
- Bất kỳ form nào cần **thêm/xóa/sửa số lượng** sản phẩm trong combo

### Props

```tsx
interface ComboItemsEditTableProps {
  /** react-hook-form fields từ useFieldArray */
  fields: Array<{ id: string; productSystemId: string; quantity: number }>;
  /** Hàm xóa item từ useFieldArray */
  remove: (index: number) => void;
  /** react-hook-form control */
  control: Control<any>;
  /** Disabled state (khi đang submit) */
  disabled?: boolean;
  /** Callback khi click preview ảnh */
  onImagePreview?: (imageUrl: string, title: string) => void;
}
```

### Các cột hiển thị
| Cột | Mô tả |
|-----|-------|
| Sản phẩm | Ảnh + Tên + Mã SP + Loại SP |
| Số lượng | Input +/- để chỉnh số lượng |
| Giá vốn | Giá vốn sản phẩm |
| Đơn giá | Giá bán theo pricing policy mặc định |
| Thành tiền | SL × Đơn giá |
| Có thể bán | Tổng tồn có thể bán toàn hệ thống |
| Xóa | Nút xóa sản phẩm khỏi combo |

### Ví dụ sử dụng

```tsx
import { ComboItemsEditTable } from '@/components/shared/combo-items-edit-table';
import { useFieldArray, useFormContext } from 'react-hook-form';

function ComboSection() {
  const { control } = useFormContext();
  const { fields, remove } = useFieldArray({
    control,
    name: 'comboItems',
  });

  return (
    <ComboItemsEditTable
      fields={fields}
      remove={remove}
      control={control}
      disabled={false}
      onImagePreview={(url, title) => setPreviewImage({ url, title })}
    />
  );
}
```

---

## So sánh với các component khác

### Tại sao không dùng `ReadOnlyProductsTable`?
- `LineItem` type không phù hợp (yêu cầu `unitPrice`, `discount`, `total`)
- Có quá nhiều cột không cần thiết cho combo (Vị trí kho, Chiết khấu)
- Thiếu cột "Có thể bán" quan trọng cho combo

### Tại sao không dùng `LineItemsTable`?
- Thiết kế cho Order với logic phức tạp (chiết khấu, phí dịch vụ)
- Sử dụng form field name cố định `lineItems` thay vì `comboItems`
- Quá nặng cho use case đơn giản của combo

---

## Tính năng chung của cả 2 component

1. **Hiển thị ảnh sản phẩm** với ưu tiên từ server
2. **Preview ảnh** khi hover (icon Eye)
3. **Hiển thị Loại SP** dưới mã sản phẩm
4. **Tính toán giá** theo pricing policy mặc định (Bán hàng)
5. **Hiển thị tồn kho** có thể bán toàn hệ thống
6. **Responsive** - hoạt động tốt trên mobile

---

## Cập nhật

| Ngày | Thay đổi |
|------|----------|
| 2025-12-04 | Tạo mới 2 component `ComboItemsReadOnlyTable` và `ComboItemsEditTable` |
