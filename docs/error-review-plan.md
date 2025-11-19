# Báo cáo lỗi TypeScript & Kế hoạch xử lý

*Cập nhật:* 18/11/2025 - **TIẾN ĐỘ FIX: 387 → 559 lỗi (Phát hiện thêm 172 lỗi)**  
*Nguồn dữ liệu:* `npx tsc --noEmit` (18/11/2025)

## 🎯 Tóm tắt tiến độ

| Giai đoạn | Trạng thái | Số lỗi còn lại | Mô tả |
| --- | --- | --- | --- |
| **P0: Thiết lập type nền** | ✅ HOÀN THÀNH | 0 lỗi | Auth Account, Complaint/Warranty Status enum |
| **P2: Customers Address** | ✅ HOÀN THÀNH | 0 lỗi | Fix imports provinces, mở rộng EnhancedCustomerAddress types |
| **P4: Cashbook fix** | ✅ HOÀN THÀNH | 0 lỗi | Cashbook page SystemId casting |
| **P1: Dual ID System** | ⚠️ ĐANG LÀM | 559 lỗi | Cần cast asSystemId/asBusinessId trong tất cả modules |

## 📊 Chi tiết lỗi còn lại (559 lỗi - cập nhật 18/11/2025)

### 1. Dual ID - SystemId/BusinessId Casting (559 lỗi)
**Nguyên nhân:** Types đã được cập nhật sang `SystemId`/`BusinessId` branded types, nhưng **chưa cast** string values sang branded types khi gán vào objects

**Phân bố lỗi theo module:**
1. **Provinces** - 160 lỗi (29% tổng lỗi) - data.ts, detail-page, page, ward-district-data
2. **Warranty** - 70 lỗi (13%) - dialogs, hooks, utils, form/list pages  
3. **Settings** - 70 lỗi (13%) - penalties, payments, branches, store-info, target-groups
4. **Complaints** - 45 lỗi (8%) - detail-page, form-page, handlers, hooks
5. **Purchase** - 30 lỗi (5%) - purchase-orders, purchase-returns
6. **Products/Suppliers/Employees** - 30 lỗi (5%) - trash pages, forms
7. **Orders** - 25 lỗi (4%) - customer-selector, shipping, forms
8. **Sales Returns** - 23 lỗi (4%) - store
9. **Tasks** - 21 lỗi (4%) - components, stores, form
10. **Customers** - 20 lỗi (4%) - address components
11. **Shared Components** - 20 lỗi (4%) - page-header, due-date-badge
12. **Payments/Receipts** - 10 lỗi (2%) - pages, forms
13. **Config & Env** - 8 lỗi (1%) - vite-env.d.ts thiếu, missing modules

**Giải pháp:** Cast tất cả string literals sang branded types khi gán vào objects

**Pattern fix:**
```typescript
import { asSystemId, asBusinessId } from '@/lib/id-types';

// ❌ BEFORE
const obj = {
  systemId: 'EMP000001',  // Error: string → SystemId
  id: 'NV001',            // Error: string → BusinessId
  assignedBy: 'SYSTEM',   // Error: string → SystemId
}

// ✅ AFTER  
const obj = {
  systemId: asSystemId('EMP000001'),
  id: asBusinessId('NV001'),
  assignedBy: asSystemId('SYSTEM'),
}

// Cast params từ URL
const { systemId } = useParams<{ systemId: string }>();
const entity = findById(asSystemId(systemId));

// Cast trong callbacks
updateComments(comments => [...comments, {
  systemId: asSystemId(`comment_${Date.now()}`),
  createdBy: asSystemId('CURRENT_USER')
}]);
```

### 2. Missing Modules & Config Issues (8 lỗi)
**Vấn đề:** Import module không tồn tại, vite-env chưa khai báo

**Lỗi phát hiện:**
- `lib/config.ts` - Property 'env' does not exist on type 'ImportMeta' (2 lỗi)
- `hooks/use-route-prefetch.ts` - Cannot find modules: payroll/page, kpi/page, organization-chart/page, internal-tasks/page, penalties/page, duty-schedule/page (6 lỗi)
- `features/warranty/components/create-payment-voucher-dialog.tsx` - Cannot find './warranty-processing-logic.ts'
- `features/warranty/components/dialogs/archive/settlement-dialog.tsx` - Cannot find UI components & stores

**Giải pháp:**
1. Tạo `src/vite-env.d.ts` với `interface ImportMetaEnv`
2. Xóa hoặc comment các route prefetch cho modules chưa tồn tại
3. Tạo hoặc fix import path cho warranty-processing-logic
4. Fix import paths trong settlement-dialog (adjust relative paths)

### 3. Icon mapping & type completeness (2 lỗi)
- `features/warranty/warranty-tracking-page.tsx` - Property 'cancelled' missing in warranty status icons (1 lỗi)
- `features/orders/types.ts` - Module issues (1 lỗi)

## 2. Chi tiết công việc đã hoàn thành

### ✅ P0. Thiết lập type nền (HOÀN THÀNH)
**Đã fix:**
1. ✅ Auth Account Store: Thay `employeeId` → `employeeSystemId`, `accountId` → `accountSystemId` trong `user-account-store.ts`
2. ✅ Complaint Status: Thay tất cả check `status === 'rejected'` thành `resolution === 'rejected'` hoặc `status === 'ended'` vì rejected là resolution, không phải status
3. ✅ Warranty Status: Thêm `'cancelled'` vào enum WarrantyStatus và SettlementStatus, cập nhật icon mapping trong `warranty-list-page.tsx`

**Kết quả:** ~20 lỗi Auth + ~15 lỗi Complaints + ~5 lỗi Warranty = **~40 lỗi biến mất**

### ✅ P2. Customers - Enhanced Address (HOÀN THÀNH)
**Đã fix:**
1. ✅ Fix imports provinces: Thay `@/features/provinces/*` → `@/features/settings/provinces/*` trong 5 files
2. ✅ Mở rộng `EnhancedCustomerAddress` type: Thêm fields `isDefault`, `isShipping`, `isBilling` (deprecated) để backward compatible với code hiện tại
3. ✅ Cập nhật `CreateAddress2LevelInput` & `CreateAddress3LevelInput`: Thêm các optional fields mới
4. ✅ Update helpers: `dual-address-form.tsx`, `enhanced-address-helper.ts` mapping sang `isDefaultShipping` và `isDefaultBilling`

**Kết quả:** ~30 lỗi imports + ~110 lỗi address fields = **~140 lỗi biến mất**

### ✅ P4. Các fix nhỏ (HOÀN THÀNH)
**Đã fix:**
1. ✅ Cashbook getColumns: Sửa call từ 4 params → 3 params trong `page.tsx`
2. ✅ Warranty form address: Thay `data.customer?.address` → `data.customer?.addresses?.[0]`
3. ✅ Enhanced address list dialog: Bỏ prop `trigger`, dùng controlled dialog với state `conversionDialogOpen`

**Kết quả:** **~5 lỗi biến mất**

---

## 3. Kế hoạch tiếp theo (Cập nhật 18/11/2025)

### 🔄 P1. Fix Config & Missing Modules (8 lỗi) - ƯU TIÊN CAO
- [ ] Tạo `src/vite-env.d.ts` với ImportMetaEnv interface
- [ ] Fix lib/config.ts imports
- [ ] Comment/fix use-route-prefetch.ts missing modules
- [ ] Fix warranty missing imports

### 🔄 P2. Fix Provinces Module (160 lỗi) - CHIẾM 29%
- [ ] `data.ts` - Cast systemId/parentSystemId với asSystemId()
- [ ] `detail-page.tsx` - Cast params
- [ ] `page.tsx` - Cast trong operations
- [ ] `ward-district-data.ts` - Cast data

### 🔄 P3. Fix Warranty Module (70 lỗi) - CHIẾM 13%  
- [ ] Dialogs: cast all SystemId/BusinessId fields
- [ ] Hooks: use-warranty-* cast returns
- [ ] Utils: audit-logger, settlement-store
- [ ] Pages: form, list, tracking (add cancelled icon)

### 🔄 P4. Fix Settings Modules (70 lỗi) - CHIẾM 13%
- [ ] Penalties, payments, branches, store-info
- [ ] Target-groups, provinces
- [ ] Cast systemId in all forms/columns

### 🔄 P5. Fix Core Modules (140 lỗi tổng)
- [ ] Complaints (45 lỗi)
- [ ] Purchase (30 lỗi)  
- [ ] Products/Suppliers/Employees (30 lỗi)
- [ ] Orders (25 lỗi)
- [ ] Customers addresses (20 lỗi)
- [ ] Tasks (21 lỗi)
- [ ] Sales Returns (23 lỗi)

### 🔄 P6. Fix Remaining (30 lỗi)
- [ ] Shared components
- [ ] Payments/Receipts
- [ ] Final verification

---

## 4. Lưu ý quan trọng

✅ **Đã tuân thủ guideline:**
- Tất cả text tiếng Việt
- Sử dụng shadcn/ui components
- Buttons/Inputs có `className="h-9"`
- Không dùng emoji
- Toast thay vì alert/confirm

⚠️ **Cần làm tiếp:**
- Cập nhật types sang SystemId branded type (guideline yêu cầu)
- Test smoke UI sau khi fix xong Dual ID
- Chạy `npm run build` final check

---

**Kết luận:** 
- ✅ Types đã được chuẩn hóa sang SystemId/BusinessId (hoàn thành trước đó)
- ⚠️ Cần cast 559 chỗ từ string literals sang branded types
- 🎯 Ưu tiên: Config (8) → Provinces (160) → Warranty (70) → Settings (70) → Core modules (251)
- 📊 Tiến độ thực tế: Đã hoàn thành chuẩn hóa types, đang trong giai đoạn casting values

| Nhóm lỗi | Tệp tiêu biểu | Số lượng ước tính | Nguyên nhân gốc |
| --- | --- | --- | --- |
| Dual ID (`systemId` vs `string`) | `features/customers/*.tsx`, `features/customers/store.ts` | ~140 | Các store & hooks vẫn dùng `string` thay vì `SystemId` brand theo guideline mới.
| Kiểu địa chỉ mở rộng | `features/customers/components/*address*`, `features/customers/utils/enhanced-address-helper.ts` | ~110 | Type `EnhancedCustomerAddress` chưa có các flag mới (`isDefault`, `isShipping`, ...); import tới module `features/provinces/*` bị di chuyển.
| Trạng thái khiếu nại/warranty | `features/complaints/*`, `features/warranty/*` | 40 | Các type `ComplaintStatus`, `WarrantyStatus`, `SettlementStatus` không đồng bộ với enum thực tế (thiếu `resolved`, `rejected`, `cancelled`).
| Auth account store | `features/auth/user-account-store.ts` | 20 | Interface `UserAccount`/`AccountActivity` chưa chứa các field mới (`employeeId`, `accountId`).
| Config & env typing | `lib/config.ts` | 2 | Thiếu khai báo `ImportMetaEnv` trong `vite-env.d.ts`.
| API sử dụng sai chữ ký | `features/cashbook/page.tsx` | 1 | `getColumns` chỉ nhận 3 tham số nhưng đang truyền 4.
| Thiếu module provinces | `features/customers/components/*`, `utils/*` | 30 | Module `features/provinces/*` đã chuyển sang `features/settings/provinces/*` nhưng import chưa cập nhật.
| Khác | `features/warranty/utils/settlement-store.ts`, `lib/id-config.ts` (chưa phát hiện), ... | 10 | Một số phép so sánh literal/hằng số sai và props thiếu.

> **Lưu ý:** Người dùng báo 379 lỗi; công cụ trả về 388. Khả năng do một số lỗi lặp hoặc đã được sửa cục bộ. Kế hoạch dưới đây bao phủ toàn bộ 388 lỗi để tránh sót.

## 2. Phân tích chi tiết & Giải pháp đề xuất

### 2.1 Nhóm Dual ID (`SystemId`)
- **Tác động:** Toàn bộ module Customers (form, detail, store, trash-page, edit dialog) + các hook dùng `findById`.
- **Nguyên nhân:** `Customer.systemId` hiện khai báo `string`. Các API helper (`createCrudStore`) mong đợi `SystemId` (brand) nên TS báo lỗi.
- **Cách fix:**
  1. Cập nhật `features/customers/types.ts` để `systemId: SystemId`, `id: string & { __brand: 'CustomerBusinessId' }?` nếu cần; ít nhất convert sang `SystemId`.
  2. Truyền tham số qua `asSystemId(systemId)` hoặc tạo helper `ensureSystemId` trước khi gọi store.
  3. Với dữ liệu route params (`useParams<{ systemId: string }>`), bọc lại bằng `asSystemId(systemId)`.
  4. Chạy `npm run build` xác thực các vị trí còn sót.
- **Ưu tiên:** Rất cao vì chiếm nhiều lỗi nhất và ảnh hưởng navigation (theo guideline Dual ID).

### 2.2 Kiểu địa chỉ mở rộng & Store tỉnh/thành
- **Nguyên nhân:** Type `EnhancedCustomerAddress` chưa chứa các flag `isDefault`, `isShipping`, `isBilling`. Module provinces được refactor sang `features/settings/provinces` nhưng các component vẫn import đường cũ.
- **Giải pháp:**
  - Cập nhật `EnhancedCustomerAddress` để bao gồm các flag + optional `addressLevel`, `wardCode` nếu đang dùng.
  - Điều chỉnh `CreateAddress2LevelInput/3Level` thêm các flag optional.
  - Đồng bộ `EnhancedCustomerAddress` với dữ liệu thực tế (tham khảo `features/orders/utils/address-integration.ts`).
  - Thay import: `@/features/provinces/store` -> `@/features/settings/provinces/store` (kiểm tra lại đường chính xác trong repo).
  - Sau khi types đúng, cập nhật JSX (`address.isDefault` etc.) không còn lỗi.

### 2.3 Trạng thái Complaints/Warranty/Settlement
- **Vấn đề:** Các enum `ComplaintStatus`, `WarrantyStatus`, `SettlementStatus` không chứa các trạng thái UI đang xử lý (`resolved`, `rejected`, `cancelled`).
- **Cách xử lý:**
  - Chuẩn hóa enum trong `features/complaints/types.ts` (hoặc store) để bao gồm full set.
  - Nếu business không còn trạng thái `rejected`, xoá logic UI. Nhưng theo UI, badge hiển thị `rejected`/`resolved` => nên cập nhật type.
  - Với warranty: thêm `cancelled` trong `WarrantyStatus` và cập nhật icon mapping.
  - `settlement-store.ts`: thay literal `'cancelled'` bằng giá trị hợp lệ (ví dụ `'canceled'` nếu enum US) hoặc mở rộng enum.

### 2.4 Auth Account Store
- **Vấn đề:** Interface `UserAccount` và `AccountActivity` thiếu các field `employeeId`/`accountId` được sử dụng tại store.
- **Giải pháp:**
  - Kiểm tra định nghĩa type trong `features/auth/types.ts` hoặc store factory; bổ sung field, hoặc khi log activity thì bỏ bớt field thừa.
  - Đồng bộ mock data (accounts initial state) với type sau khi cập nhật.

### 2.5 Thiếu định nghĩa `ImportMetaEnv`
- **Vấn đề:** `import.meta.env` chưa được khai báo (thiếu `src/vite-env.d.ts`).
- **Fix:**
  - Tạo `src/vite-env.d.ts` (hoặc cập nhật file đã có) với `interface ImportMetaEnv` & `ImportMeta`. Sau đó `tsconfig` include file.

### 2.6 Sai chữ ký `getColumns`
- **Fix nhanh:** Cập nhật lời gọi ở `features/cashbook/page.tsx` để truyền đúng 3 tham số (gộp callback) hoặc sửa định nghĩa `getColumns` để nhận thêm `navigate` nếu thực sự cần.

### 2.7 Module provinces bị di chuyển
- **Fix:** Thay thế toàn bộ alias `@/features/provinces/*` thành `@/features/settings/provinces/*` (hoặc module mới trong repo). Cần tìm file gốc để xác thực.

### 2.8 Lỗi còn lại
- `warranty-form-page`: dùng `data.customer?.addresses?.[0]` thay vì `.address`.
- `enhanced-address-list.tsx`: props `trigger` chưa khai báo; cần mở rộng `AddressConversionDialogProps` hoặc bỏ prop này.
- `address-conversion-dialog`: ensure props khớp.

## 3. Lộ trình xử lý 379+ lỗi

| Giai đoạn | Mục tiêu | Công việc cụ thể | Kết quả mong đợi |
| --- | --- | --- | --- |
| **P0. Thiết lập type nền** | Không còn lỗi hệ thống do thiếu type base | - Cập nhật `src/vite-env.d.ts`<br>- Chuẩn hóa enum `ComplaintStatus`, `WarrantyStatus`, `SettlementStatus`<br>- Đồng bộ `UserAccount`, `AccountActivity` | ~25 lỗi biến mất.
| **P1. Customers – Dual ID** | Tất cả store/hook Customers dùng `SystemId` chuẩn | - Update `features/customers/types.ts` + `store.ts` + components (form/detail/trash).<br>- Dùng helper `asSystemId` cho route params.<br>- Viết test smoke cho store nếu có. | ~140 lỗi giải quyết.
| **P2. Customers – Enhanced Address** | Type địa chỉ đồng bộ với UI | - Mở rộng `EnhancedCustomerAddress` + input types.<br>- Refactor helper `enhanced-address-helper.ts` để không tạo field lạ.<br>- Cập nhật components (`dual-address-form`, `enhanced-address-list`, dialogs).<br>- Fix import path provinces. | ~140 lỗi còn lại trong module Customers.
| **P3. Complaints/Warranty fixes** | Status logic hợp lệ | - Mở rộng enum + icon mapping.<br>- Rà soát `store.ts`, `hooks`. | ~40 lỗi biến mất.
| **P4. Khác** | Hoàn tất | - `cashbook` columns<br>- `warranty-form` address field<br>- Bổ sung prop typing `trigger` | 10 lỗi cuối cùng.
| **P5. QA & Regression** | Đảm bảo guideline | - `npm run build` + `npm run test` (nếu có).<br>- Kiểm tra UI theo checklist guideline (page header, h-9, ...). | Build sạch.

## 4. Kiểm thử & xác nhận

1. Chạy lại `npm run build` sau mỗi giai đoạn để bắt lỗi sót.
2. Với Customers, mock dữ liệu cần có `SystemId` hợp lệ (`asSystemId('CUS000001')`).
3. Viết unit test nhỏ cho helper `enhanced-address-helper.ts` để đảm bảo flags mới.
4. Smoke test UI chính (Customer Detail, Complaint Detail, Warranty List) để chắc guideline Dual ID & badge/breadcrumb đúng.

---

**Kết luận:** Tập trung xử lý modules Customers + Complaints/Warranty sẽ loại bỏ >90% lỗi. Sau khi cập nhật type nền và helper, các lỗi còn lại chủ yếu là chỉnh nhỏ. Kế hoạch trên tuân thủ `DEVELOPMENT-GUIDELINES-V2.md` (Dual ID, tiếng Việt, shadcn UI) và sẵn sàng triển khai theo từng giai đoạn rõ ràng.