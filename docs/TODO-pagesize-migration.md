# TODO: Page Size Migration Plan

## Mục tiêu
Migrate tất cả các page có hardcoded `pageSize` hoặc `ITEMS_PER_PAGE` sang sử dụng settings từ `global-settings-store.ts`.

## Hiện trạng

### Đã có sẵn
- `useDefaultPageSize()` hook trong `features/settings/global-settings-store.ts`
- `usePageSizeOptions()` hook để lấy các options cho dropdown

### Các file cần migrate

#### 1. Components cơ bản (Ưu tiên cao)
- [ ] `components/data-table/tanstack-data-table.tsx` - Line 54: `pageSize = 50`
- [ ] `components/data-table/responsive-data-table.tsx` - Line 865
- [ ] `components/data-table/data-table-old-backup.tsx` - Line 438

#### 2. Feature: Product Selection Dialogs
- [ ] `features/shared/product-selection-dialog.tsx` - Line 19: `const ITEMS_PER_PAGE = 10`
- [ ] `features/purchase-orders/components/bulk-product-selector-dialog.tsx` - Line 26
- [ ] `components/shared/bulk-product-selector-dialog.tsx` - Line 29

#### 3. Feature: Employees
- [ ] `features/employees/page-tanstack-test.tsx` - Line 161: `pageSize={50}`

#### 4. Config file
- [x] `lib/config.ts` - Line 28-29: `DEFAULT_PAGE_SIZE: 20, MAX_PAGE_SIZE: 100` (giữ làm fallback)

### Pages khác cần kiểm tra (có thể có pageSize props)
Tìm kiếm thêm bằng:
```bash
grep -rn "pageSize" --include="*.tsx" --include="*.ts" features/
grep -rn "ITEMS_PER_PAGE" --include="*.tsx" features/
```

## Cách thực hiện

### Bước 1: Import hook
```tsx
import { useDefaultPageSize, usePageSizeOptions } from '@/features/settings/global-settings-store';
```

### Bước 2: Sử dụng trong component
```tsx
function MyPage() {
  const defaultPageSize = useDefaultPageSize();
  const pageSizeOptions = usePageSizeOptions();
  
  // Thay vì hardcode
  // const [pageSize, setPageSize] = useState(20);
  
  // Dùng từ settings
  const [pageSize, setPageSize] = useState(defaultPageSize);
  
  return (
    <DataTable
      pageSize={pageSize}
      setPageSize={setPageSize}
      pageSizeOptions={pageSizeOptions}
    />
  );
}
```

### Bước 3: Cho các dialog selector
```tsx
function ProductSelectorDialog() {
  const defaultPageSize = useDefaultPageSize();
  // Với dialog, có thể dùng giá trị nhỏ hơn: Math.min(defaultPageSize, 10)
  const ITEMS_PER_PAGE = Math.min(defaultPageSize, 10);
  // ...
}
```

## Ước tính thời gian
- ~30 phút cho mỗi file cần migrate
- Tổng cộng: ~5-7 files = 3-4 giờ

## Lưu ý
1. Test lại pagination sau khi migrate
2. Đảm bảo SSR compatibility nếu dùng Next.js
3. Giữ fallback value trong `lib/config.ts` cho trường hợp store chưa load

## Liên quan
- `features/settings/other-page.tsx` - GeneralSettings tab có cài đặt `defaultPageSize`
- `features/settings/global-settings-store.ts` - Zustand store chứa settings
