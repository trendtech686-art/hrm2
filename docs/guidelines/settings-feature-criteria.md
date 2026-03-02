# Tiêu chí chuẩn hóa chức năng Settings

> Tài liệu mô tả các tiêu chuẩn UI/UX và kỹ thuật cho các trang cài đặt trong hệ thống.

## 1. Cấu trúc trang Settings

### 1.1 Page Header
- **Tiêu đề trang**: Rõ ràng, mô tả chức năng (VD: "Cài đặt nhân viên", "Cấu hình bán hàng")
- **Subtitle**: Mô tả ngắn gọn mục đích (VD: "Quy định về giờ làm việc, nghỉ phép và lương thưởng")
- **Actions**: Nút hành động chính ở góc phải (VD: "Lưu cài đặt", "Thêm mới")

### 1.2 Vertical Tabs (Menu bên trái)
- Sử dụng `SettingsVerticalTabs` component
- Các tab được sắp xếp theo logic nghiệp vụ
- Tab active được highlight rõ ràng
- Responsive trên mobile

## 2. Bảng dữ liệu (SimpleSettingsTable)

### 2.1 Cột bắt buộc
| Yêu cầu | Mô tả |
|---------|-------|
| ❌ Không có cột # | Bỏ cột số thứ tự (#) |
| ✅ Checkbox selection | Cho phép chọn nhiều dòng |
| ✅ Cột tên/tiêu đề | Cột chính hiển thị tên item |
| ✅ Cột actions | Dropdown menu với Sửa/Xóa |

### 2.2 Tính năng bảng
| Tính năng | Prop | Bắt buộc |
|-----------|------|----------|
| Selection (checkbox) | `enableSelection` | ✅ |
| Bulk delete | `onBulkDelete` | ✅ |
| Pagination | `enablePagination` | ✅ |
| Page size | `pagination={{ pageSize: 10, showInfo: true }}` | ✅ |

### 2.3 Bulk Actions
- Khi chọn items, bulk action bar **đè lên header row** (không hiển thị thêm row)
- Hiển thị số lượng đã chọn: "Đã chọn **X** mục"
- Nút "Xóa" với icon Trash2
- Checkbox "Chọn tất cả" vẫn hiển thị ở cột đầu tiên

## 3. Form và Dialog

### 3.1 Dialog thêm/sửa
- Sử dụng `Dialog` component từ ui/dialog
- Title rõ ràng: "Thêm [tên item]" hoặc "Sửa [tên item]"
- Description ngắn gọn
- Footer có nút "Hủy" và "Lưu/Thêm"

### 3.2 Xác nhận xóa
- Sử dụng `AlertDialog` component
- Title: "Xác nhận xóa" hoặc "Xóa X [tên items]?"
- Description cảnh báo: "Hành động này không thể hoàn tác"
- Nút "Hủy" và "Xóa" (destructive variant)

## 4. Data Layer

### 4.1 API Routes
```
GET    /api/settings/{feature}           - Lấy danh sách
POST   /api/settings/{feature}           - Tạo mới
PUT    /api/settings/{feature}/[id]      - Cập nhật
DELETE /api/settings/{feature}/[id]      - Xóa
```

### 4.2 React Query Hooks
- Query key factory pattern: `{ all: [...], detail: (id) => [...] }`
- Optimistic updates cho toggle switches
- `staleTime: 5 * 60 * 1000` (5 phút) cho settings data
- `setQueryData` thay vì `invalidateQueries` khi có thể

### 4.3 Seed Script
- Đặt trong `prisma/seeds/seed-{feature}.ts`
- Load env: `import 'dotenv/config'`
- Sử dụng PrismaPg adapter
- Kiểm tra dữ liệu tồn tại trước khi seed
- Log rõ ràng quá trình seed

## 5. Toast Notifications

| Hành động | Message |
|-----------|---------|
| Thêm thành công | "Đã thêm [tên item]" |
| Sửa thành công | "Đã cập nhật [tên item]" |
| Xóa thành công | "Đã xóa [tên item]" |
| Lỗi | "Lỗi: {error.message}" |
| Bulk delete | "Đã xóa X [tên items]" |

## 6. Loading States

### 6.1 Skeleton Loading
- Hiển thị skeleton rows khi `isLoading = true`
- Số skeleton rows: 5
- Skeleton cho cả checkbox và content columns

### 6.2 Button Loading
- Disable button khi đang submit
- Hiển thị Loader2 spinner + text (VD: "Đang lưu...")

## 7. Empty States

```tsx
<SimpleSettingsTable
  emptyTitle="Chưa có [tên items] nào"
  emptyDescription="Thêm [tên item] để [mục đích]"
  emptyAction={<Button>Thêm [tên item]</Button>}
/>
```

## 8. Checklist triển khai

### Backend
- [ ] Tạo API route (GET/POST/PUT/DELETE)
- [ ] Định nghĩa Prisma schema (nếu cần bảng mới)
- [ ] Tạo seed script trong `prisma/seeds/`
- [ ] Chạy seed và verify data

### Frontend
- [ ] Tạo page content component
- [ ] Tạo columns definition (không có cột #)
- [ ] Tạo form component
- [ ] Tạo React Query hooks
- [ ] Thêm `enableSelection` + `onBulkDelete`
- [ ] Thêm `enablePagination` + `pagination`
- [ ] Thêm AlertDialog cho bulk delete
- [ ] Register actions với parent page header

## 9. File Structure

```
features/settings/{feature}/
├── {feature}-settings-content.tsx    # Main content component
├── {feature}-columns.tsx             # Table columns definition
├── {feature}-form.tsx                # Add/Edit form
├── hooks/
│   └── use-{feature}.ts              # React Query hooks
├── api/
│   └── {feature}-api.ts              # API layer functions
└── types.ts                          # TypeScript types (nếu cần)

app/api/settings/{feature}/
├── route.ts                          # GET, POST handlers
└── [id]/
    └── route.ts                      # PUT, DELETE handlers

prisma/seeds/
└── seed-{feature}.ts                 # Seed script
```

## 10. Ví dụ tham khảo

- **Employee Settings**: `features/settings/employees/` - Full implementation với nhiều tabs
- **Sales Channels**: `features/settings/sales-channels/` - CRUD với selection và bulk delete
- **Penalty Types**: `features/settings/penalties/` - Với category badges và amount formatting
