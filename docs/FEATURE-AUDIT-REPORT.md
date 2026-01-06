# Báo cáo Kiểm tra Features theo DATA-ARCHITECTURE

> **Ngày kiểm tra:** 2026-01-03  
> **Quy tắc tham chiếu:** [DATA-ARCHITECTURE.md](./guidelines/DATA-ARCHITECTURE.md)

---

## 📊 Tổng quan

| Loại file | Tổng số | Trạng thái | Ghi chú |
|-----------|---------|------------|---------|
| `types.ts` | 61 | ✅ GIỮ TẤT CẢ | Re-export layer hợp lệ |
| `data.ts` / `*-data.ts` | 18 | ✅ **9 đã xóa** | GIỮ 9 utility/static |
| `store.ts` | 30+ | TBD | Cần review từng case |

---

## 1️⃣ types.ts - Phân loại

**Tổng số:** 61 files | **RE-EXPORT:** 39 files (GIỮ) | **CÓ LOGIC RIÊNG:** 22 files (GIỮ)

> ⚠️ **Quyết định:** GIỮ LẠI tất cả types.ts files như re-export layer
> - Có hàng trăm files đang import từ feature types.ts
> - Việc xóa sẽ yêu cầu sửa quá nhiều imports
> - Re-export pattern là hợp lệ và có lợi ích về modularity

### ✅ GIỮ LẠI (39 files - Re-export từ prisma-extended)

```
features/attendance/types.ts
features/audit-log/types.ts
features/cashbook/types.ts
features/complaints/types.ts           # ⚠️ Re-export từ prisma-extended (labels/colors đã ở đó)
features/cost-adjustments/types.ts
features/customers/types.ts
features/customers/sla/types.ts
features/employees/types.ts            # ⚠️ Re-export từ prisma-extended (helpers đã ở đó)
features/inventory-checks/types.ts
features/inventory-receipts/types.ts
features/leaves/types.ts
features/orders/types.ts
features/packaging/types.ts
features/payments/types.ts
features/products/types.ts
features/purchase-orders/types.ts
features/purchase-returns/types.ts
features/receipts/types.ts
features/sales-returns/types.ts
features/settings/branches/types.ts
features/settings/customers/types.ts
features/settings/departments/types.ts
features/settings/employees/types.ts
features/settings/inventory/types.ts
features/settings/pricing/types.ts
features/settings/provinces/types.ts
features/settings/receipt-types/types.ts
features/settings/sales-channels/types.ts
features/settings/shipping/types.ts
features/settings/target-groups/types.ts
features/settings/units/types.ts
features/settings/websites/types.ts
features/shipments/types.ts
features/stock-history/types.ts
features/stock-locations/types.ts
features/stock-transfers/types.ts
features/suppliers/types.ts
features/tasks/types.ts
features/wiki/types.ts
```

**Lý do:** Chỉ chứa `export type { X } from '@/lib/types/prisma-extended'` - có thể import trực tiếp.

### ✅ CẦN GIỮ (22 files - Có types/interfaces/constants riêng)

```
features/employees/detail/types.ts                     # formatCurrency, formatMonthLabel helpers
features/orders/components/shipping/types.ts           # DeliveryMethod, ShippingService interfaces
features/orders/detail/types.ts                        # OrderComment, statusVariants constants
features/products/product-form/types.ts                # ValidationError, validateProductForm
features/reports/business-activity/types.ts            # ReportType và các interfaces
features/reports/customer-sla-report/types.ts          # ReportTab type
features/reports/inventory-report/types.ts             # InventoryReportRow interface
features/reports/product-sla-report/types.ts           # StockAlertReportRow interface
features/reports/sales-report/types.ts                 # OrderWithProfit type
features/sales-returns/form/types.ts                   # Helper functions, productTypeFallbackLabels
features/settings/complaints/types.ts                  # CardColorSettings interface
features/settings/job-titles/types.ts                  # JobTitle type (⚠️ nên move to prisma-extended)
features/settings/other/types.ts                       # TabContentProps interface
features/settings/payments/methods/types.ts            # PaymentMethod type (⚠️ nên move)
features/settings/payments/types/types.ts              # PaymentType type (⚠️ nên move)
features/settings/penalties/types.ts                   # penaltyStatusLabels, penaltyCategoryLabels constants
features/settings/pkgx/types.ts                        # PkgxSettingsTab, ConnectionTestResult types
features/settings/pkgx/components/product-mapping/types.ts  # PUSH_SYNC_FIELDS config
features/settings/printer/types.ts                     # TemplateType, PrinterSettings interfaces
features/settings/tasks/types.ts                       # CardColorSettings, SLASettings interfaces
features/settings/taxes/types.ts                       # TaxFormValues derived type
features/warranty/types.ts                             # WARRANTY_STATUS_LABELS, transitions constants
```

### ⚠️ ✅ ĐÃ MIGRATE TO PRISMA-EXTENDED (2026-01-03)

Các types.ts sau đã được chuyển sang re-export từ `lib/types/prisma-extended.ts`:

```
features/settings/job-titles/types.ts → JobTitle ✅
features/settings/payments/methods/types.ts → PaymentMethod ✅
features/settings/payments/types/types.ts → PaymentType ✅
```

---

## 2️⃣ data.ts / *-data.ts - Phân loại

**Tổng số:** 18 files | **CẦN XÓA:** 9 files | **CẦN GIỮ:** 9 files

### ❌ CẦN XÓA (9 files - Mock/Seed data)

```
features/settings/customers/credit-ratings-data.ts    # 72 lines - mock CreditRating[]
features/settings/customers/customer-groups-data.ts   # 46 lines - mock CustomerGroup[]
features/settings/customers/customer-sources-data.ts  # 60 lines - mock CustomerSource[]
features/settings/customers/customer-types-data.ts    # 22 lines - mock CustomerType[]
features/settings/customers/lifecycle-stages-data.ts  # 50 lines - mock LifecycleStage[]
features/settings/customers/payment-terms-data.ts     # 66 lines - mock PaymentTerm[]
features/settings/customers/sla-settings-data.ts      # 65 lines - mock SLA settings
features/tasks/template-data.ts                       # 176 lines - mock TaskTemplate[]
features/warranty/initial-data.ts                     # 232 lines - mock WarrantyTicket[]
```

**⚠️ CÁC FILE ĐANG IMPORT MOCK DATA (CẦN SỬA TRƯỚC KHI XÓA):**

| File Mock Data | Import bởi | Import | Trạng thái |
|----------------|------------|--------|------------|
| credit-ratings-data.ts | credit-ratings-store.ts | defaultCreditRatings | ❌ Cần sửa |
| customer-groups-data.ts | customer-groups-store.ts | defaultCustomerGroups | ❌ Cần sửa |
| customer-sources-data.ts | customer-sources-store.ts | defaultCustomerSources | ❌ Cần sửa |
| customer-types-data.ts | customer-types-store.ts | defaultCustomerTypes | ❌ Cần sửa |
| lifecycle-stages-data.ts | lifecycle-stages-store.ts | defaultLifecycleStages | ❌ Cần sửa |
| payment-terms-data.ts | payment-terms-store.ts | defaultPaymentTerms | ❌ Cần sửa |
| sla-settings-data.ts | sla-settings-store.ts | defaultCustomerSlaSettings | ❌ Cần sửa |
| sla-settings-data.ts | columns.tsx, setting-form-dialog.tsx, sla-activity-history.tsx | SLA_TYPE_LABELS | ⚠️ Labels cần giữ hoặc move |
| template-data.ts | template-store.ts | templateData | ❌ Cần sửa |
| initial-data.ts | store/base-store.ts | warrantyInitialData | ❌ Cần sửa |

**Thay thế bằng:** `prisma/seed.ts`

### ✅ CẦN GIỮ (9 files - Utility functions hoặc static config)

```
features/attendance/data.ts                    # 49 lines - generateMockAttendance() utility function
features/settings/printer/preview-data.ts      # 7 lines - Re-export từ preview/ (deprecated wrapper)
features/settings/provinces/provinces-data.ts  # 194 lines - Static provinces list (VN không đổi)
features/settings/provinces/districts-data.ts  # 3770 lines - Static districts list
features/settings/provinces/ward-district-data.ts   # 26600 lines - Mapping ward-district
features/settings/provinces/wards-2level-data.ts    # 26610 lines - Static wards (2 level)
features/settings/provinces/wards-3level-data.ts    # 100396 lines - Static wards (3 level)  
features/settings/provinces/lazy-data-loader.ts     # 154 lines - Lazy load utility
features/settings/provinces/hooks/use-province-data.ts  # 51 lines - Hook utility
```

---

## 3️⃣ store.ts - Đánh giá chi tiết

**Tổng số:** 81 store files | **Pattern hiện tại:** Hybrid (Zustand + React Query)

> 📊 **Phát hiện quan trọng:** 
> - Hầu hết features đã có cả **Store + Hooks + API** (45/47 features)
> - React Query đã là primary cho server state
> - Zustand stores đang giữ vai trò client-side state / legacy

### 🔴 Stores LỚN (>200 lines) - Business Logic phức tạp - GIỮ Zustand

| Store | Lines | Lý do giữ |
|-------|-------|-----------|
| `orders/store.ts` | 1891 | Workflow phức tạp nhất, status transitions |
| `settings/employees/employee-settings-store.ts` | 652 | Complex employee settings |
| `settings/pkgx/store.ts` | 565 | PKGX sync integration |
| `payroll/payroll-batch-store.ts` | 564 | Payroll calculation workflow |
| `customers/store.ts` | 523 | RFM scoring, lifecycle, debt tracking |
| `sales-returns/store.ts` | 516 | Return workflow, refunds |
| `settings/trendtech/store.ts` | 514 | External integration |
| `complaints/store.ts` | 492 | Complaint workflow |
| `tasks/store.ts` | 491 | Task management workflow |
| `purchase-orders/store.ts` | 480 | PO workflow, payments |
| `payroll/payroll-template-store.ts` | 390 | Payroll templates |
| `products/store.ts` | 387 | Inventory management |
| `employees/document-store.ts` | 306 | Document management |
| `payments/store.ts` | 307 | Payment processing |
| `receipts/store.ts` | 305 | Receipt processing |
| `shipments/store.ts` | 300 | Shipping workflow |
| `stock-transfers/store.ts` | 296 | Transfer workflow |
| `tasks/recurring-store.ts` | 291 | Recurring tasks |
| `customers/sla/store.ts` | 245 | SLA engine |
| `inventory-receipts/store.ts` | 242 | Inventory receipts |
| `settings/provinces/store.ts` | 234 | Province data (static) |
| `employees/store.ts` | 207 | Employee management |

### 🟡 Stores TRUNG BÌNH (50-200 lines) - Xem xét case by case

| Store | Lines | Gợi ý |
|-------|-------|-------|
| `cost-adjustments/store.ts` | 194 | Keep - có business logic |
| `purchase-returns/store.ts` | 188 | Keep - workflow |
| `settings/printer/store.ts` | 182 | Keep - printer config |
| `settings/inventory/product-category-store.ts` | 176 | Keep - category tree |
| `settings/appearance/store.ts` | 160 | Keep - theme state |
| `inventory-checks/store.ts` | 155 | Keep - check workflow |
| `products/image-store.ts` | 150 | Keep - image management |
| `tasks/template-store.ts` | 141 | Consider React Query |
| `employees/employee-comp-store.ts` | 125 | Keep - compensation |
| `settings/shipping/store.ts` | 109 | Consider React Query |
| `settings/taxes/store.ts` | 111 | Consider React Query |
| `warranty/utils/settlement-store.ts` | 111 | Keep - settlement |
| `settings/employees/role-store.ts` | 101 | Consider React Query |

### 🟢 Stores NHỎ (<50 lines) - Simple CRUD - Deprecated bởi React Query

| Store | Lines | Trạng thái |
|-------|-------|------------|
| `wiki/store.ts` | 47 | ⚠️ Đã có use-wiki.ts (React Query) |
| `stock-history/store.ts` | 39 | ⚠️ Đã có use-stock-history.ts |
| `suppliers/store.ts` | 86 | ⚠️ Đã có use-suppliers.ts |
| `settings/branches/store.ts` | 55 | ⚠️ Đã có use-branches.ts |
| `settings/departments/store.ts` | 7 | ⚠️ Đã có use-departments.ts |
| `settings/job-titles/store.ts` | 7 | ⚠️ Đã có use-job-titles.ts |
| `settings/units/store.ts` | 9 | ⚠️ Đã có use-units.ts |
| `stock-locations/store.ts` | 9 | ⚠️ Đã có use-stock-locations.ts |
| `settings/target-groups/store.ts` | 9 | ⚠️ Đã có use-target-groups.ts |
| `settings/customers/*-store.ts` | 9-21 | ⚠️ Đã có React Query hooks |
| `settings/receipt-types/store.ts` | 26 | ⚠️ Đã có use-receipt-types.ts |
| `settings/payments/methods/store.ts` | 37 | ⚠️ Đã có use-payment-methods.ts |
| `settings/payments/types/store.ts` | 26 | ⚠️ Đã có use-payment-types.ts |
| `settings/complaints/store.ts` | 16 | ⚠️ Có thể dùng React Query |
| `settings/penalties/store.ts` | 16 | ⚠️ Đã có use-penalties.ts |

### 📋 Kết luận Phase 4

1. **KHÔNG XÓA stores** - Giữ hybrid pattern hiện tại
2. **React Query là PRIMARY** cho server data fetching
3. **Zustand giữ vai trò**:
   - Complex client-side state
   - Business logic workflows
   - Legacy compatibility
4. **Small stores deprecated** nhưng không cần xóa ngay - dần migrate UI sang React Query hooks

---

## 4️⃣ Kế hoạch thực hiện

### ✅ Phase 1: Xóa mock data files - HOÀN THÀNH
- [x] Update stores để dùng empty initialData
- [x] Move SLA_TYPE_LABELS sang types.ts
- [x] Xóa 9 mock data files

### ✅ Phase 2: Đánh giá types.ts - HOÀN THÀNH  
- [x] Scan imports - phát hiện hàng trăm files sử dụng
- [x] Quyết định: GIỮ LẠI tất cả như re-export layer

### ✅ Phase 3: Migrate types to prisma-extended - HOÀN THÀNH
- [x] JobTitle → re-export từ prisma-extended
- [x] PaymentMethod → re-export từ prisma-extended
- [x] PaymentType → re-export từ prisma-extended

### ✅ Phase 4: Đánh giá stores - HOÀN THÀNH
- [x] Scan 81 store files
- [x] Phân loại theo complexity (Lớn/Trung bình/Nhỏ)
- [x] Xác định pattern: Hybrid (Zustand + React Query)
- [x] Kết luận: Giữ hybrid pattern, React Query là primary

---

## 📈 TIẾN ĐỘ TỔNG THỂ

| Phase | Mô tả | Trạng thái |
|-------|-------|------------|
| Phase 1 | Xóa mock data files | ✅ Hoàn thành |
| Phase 2 | Đánh giá types.ts | ✅ Giữ tất cả |
| Phase 3 | Migrate types to prisma-extended | ✅ Hoàn thành |
| Phase 4 | Đánh giá stores | ✅ Hoàn thành |

### 🎯 Hành động tiếp theo (Tùy chọn)

1. **Dọn dẹp small stores** - Dần migrate UI components sang React Query hooks
2. **Xóa deprecated stores** - Khi UI đã fully migrate
3. **Documentation** - Cập nhật coding guidelines cho hybrid pattern

---

## 📝 Ghi chú

1. **Không xóa ngay** - Cần update imports trước khi xóa types.ts
2. **Provinces data** - Giữ lại vì đây là static reference data (tỉnh/huyện/xã VN)
3. **Preview data** - Giữ lại cho printer preview functionality
4. **Store evaluation** - Cần review kỹ hơn từng store
5. **sla-settings-data.ts** - File này có 2 phần:
   - Mock data (`defaultCustomerSlaSettings`) → Xóa, chuyển sang prisma/seed.ts
   - Labels (`SLA_TYPE_LABELS`, `SLA_TYPE_DESCRIPTIONS`) → Move sang prisma-extended hoặc types.ts
6. **Mock data stores chưa được migrate** - 10 store files vẫn import từ *-data.ts, cần sửa sang `[]`

---

## ⚠️ HÀNH ĐỘNG CẦN THIẾT

### ✅ Đã hoàn thành (2026-01-03):

1. **✅ Sửa 9 store files** - Đã thay import mock data bằng empty array `[]`:
   - `features/settings/customers/credit-ratings-store.ts`
   - `features/settings/customers/customer-groups-store.ts`
   - `features/settings/customers/customer-sources-store.ts`
   - `features/settings/customers/customer-types-store.ts`
   - `features/settings/customers/lifecycle-stages-store.ts`
   - `features/settings/customers/payment-terms-store.ts`
   - `features/settings/customers/sla-settings-store.ts`
   - `features/tasks/template-store.ts`
   - `features/warranty/store/base-store.ts`

2. **✅ Move SLA_TYPE_LABELS** - Đã di chuyển từ sla-settings-data.ts sang types.ts
   - Cập nhật imports trong: columns.tsx, setting-form-dialog.tsx, sla-activity-history.tsx

3. **✅ Xóa 9 mock data files**:
   - `features/settings/customers/credit-ratings-data.ts`
   - `features/settings/customers/customer-groups-data.ts`
   - `features/settings/customers/customer-sources-data.ts`
   - `features/settings/customers/customer-types-data.ts`
   - `features/settings/customers/lifecycle-stages-data.ts`
   - `features/settings/customers/payment-terms-data.ts`
   - `features/settings/customers/sla-settings-data.ts`
   - `features/tasks/template-data.ts`
   - `features/warranty/initial-data.ts`

4. **✅ TypeScript & ESLint** - Đã verify, không có lỗi

---

*Báo cáo này được tạo tự động. Cần review manual trước khi thực hiện xóa.*
