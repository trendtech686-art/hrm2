# VS Code OOM (Out of Memory) - Đã Fix

## Các thay đổi đã thực hiện:

### 1. Tối ưu VS Code Settings (`.vscode/settings.json`)
✅ Tăng TypeScript memory: 8GB → **12GB**
✅ Tắt TypeScript project diagnostics (tốn memory)
✅ Tắt auto type acquisition
✅ Giảm editor suggestions
✅ Exclude thêm nhiều folders: `.next/cache`, `.next/types`, `tsbuildinfo`
✅ Tắt file search cache

### 2. Tăng Node.js Memory (`.env`)
✅ Thêm `NODE_OPTIONS="--max-old-space-size=8192"` (8GB)

### 3. Tối ưu TypeScript Config (`tsconfig.json`)
✅ Loại bỏ `generated/prisma` khỏi include (quá lớn)
✅ Exclude thêm: `.next/cache`, `generated/prisma/internal`, `tsbuildinfo`

### 4. Update Package Scripts (`package.json`)
✅ Tất cả dev/build scripts đều có memory limit 8GB
✅ Thêm script `npm run cleanup` để xóa cache nhanh

### 5. Batch Script Cleanup (`cleanup-cache.bat`)
✅ Double-click để xóa cache khi cần

## Hướng dẫn sử dụng:

### Ngay bây giờ:
1. **Đóng VS Code hoàn toàn** (Ctrl+Q hoặc tắt cửa sổ)
2. Chạy `cleanup-cache.bat` (double-click)
3. Mở lại VS Code

### Khi gặp lỗi OOM lần sau:
```bash
# Option 1: Chạy script
npm run cleanup

# Option 2: Chạy batch file
cleanup-cache.bat

# Option 3: Manual
rd /s /q .next
rd /s /q node_modules\.cache
del *.tsbuildinfo
```

### Tips tránh OOM:
1. **Đóng file không cần thiết** - Ctrl+K W (close all)
2. **Tắt extensions không dùng** - Vào Extensions, disable
3. **Restart VS Code thường xuyên** - Mỗi 2-3 tiếng
4. **Chỉ mở 1 workspace** - Đừng mở nhiều VS Code windows
5. **Dùng dev server thay vì build** - `npm run dev` thay vì `npm run build`

### Kiểm tra memory hiện tại:
- Nhấn `Ctrl+Shift+P` → gõ "Developer: Show Running Extensions"
- Xem extension nào tốn nhiều memory

## Nguyên nhân chính:
- **Generated Prisma files quá lớn** (hàng ngàn models)
- **.next cache tích tụ** theo thời gian
- **TypeScript checking toàn bộ workspace** bao gồm cả generated files
- **File watchers** theo dõi quá nhiều files

## Đã được fix:
✅ Tất cả folders lớn đã được exclude
✅ Memory limits đã được tăng gấp đôi
✅ Cache cleanup scripts đã sẵn sàng
