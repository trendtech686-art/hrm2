# TypeScript Strict Mode Migration Plan

> **Tạo ngày:** 27/12/2025
> **Tổng số lỗi:** 1,523 errors
> **Mục tiêu:** Fix dần từng module để enable `strict: true`

---

## 📊 Phân loại lỗi theo mã lỗi

| Mã lỗi | Số lượng | Mô tả | Độ khó |
|--------|----------|-------|--------|
| **TS7006** | 659 | Parameter implicitly has 'any' type | 🟢 Dễ |
| **TS2307** | 561 | Cannot find module (import paths) | 🟡 Trung bình |
| **TS2322** | 101 | Type 'X' is not assignable to type 'Y' | 🟡 Trung bình |
| **TS7031** | 98 | Binding element implicitly has 'any' type | 🟢 Dễ |
| **TS7053** | 56 | Element implicitly has 'any' type (index access) | 🟡 Trung bình |
| **TS2345** | 18 | Argument type not assignable | 🟡 Trung bình |
| **TS18046** | 10 | 'X' is of type 'unknown' | 🟢 Dễ |
| **TS18048** | 6 | 'X' is possibly 'undefined' | 🟢 Dễ |
| **TS2769** | 4 | No overload matches this call | 🔴 Khó |
| **TS2339** | 4 | Property does not exist on type | 🟡 Trung bình |
| **Khác** | 6 | Các lỗi khác | - |

---

## 📁 Phân loại theo Feature Module

### 🔴 Ưu tiên cao (>100 errors) - Fix sau cùng

| Module | Errors | Files chính |
|--------|--------|-------------|
| **orders** | 315 | order-detail-page (163), order-form-page (83) |
| **employees** | 280 | detail-page (129), employee-form (102) |
| **complaints** | 238 | form-page (72), detail-page (70) |
| **tasks** | 221 | detail-page (53), recurring-page (32), task-form-page (31) |

### 🟡 Ưu tiên trung bình (10-100 errors)

| Module | Errors | Ghi chú |
|--------|--------|---------|
| **stock-transfers** | 112 | detail-page (44), edit-page (33), form-page (31) |
| **sales-returns** | 48 | form-page (24), detail-page (13) |
| **leaves** | 35 | leave-form (23) |
| **reports** | 30 | business-activity hooks |
| **warranty** | 29 | - |
| **customers** | 21 | detail-page (19) |
| **settings** | 20 | - |
| **products** | 19 | - |
| **shipments** | 15 | - |
| **dashboard** | 11 | - |
| **inventory-checks** | 10 | - |

### 🟢 Ưu tiên thấp (<10 errors) - Fix trước

| Module | Errors |
|--------|--------|
| purchase-orders | 9 |
| packaging | 8 |
| cost-adjustments | 6 |
| inventory-receipts | 3 |
| suppliers | 2 |
| purchase-returns | 2 |
| reconciliation | 2 |
| brands | 1 |
| attendance | 1 |
| cashbook | 1 |
| receipts | 1 |
| payments | 1 |
| categories | 1 |

---

## 📋 Top 25 Files cần fix (theo số lỗi)

| # | File | Errors |
|---|------|--------|
| 1 | features/orders/components/order-detail-page.tsx | 163 |
| 2 | features/employees/components/detail-page.tsx | 129 |
| 3 | features/employees/components/employee-form.tsx | 102 |
| 4 | features/orders/components/order-form-page.tsx | 83 |
| 5 | features/complaints/components/form-page.tsx | 72 |
| 6 | features/complaints/components/detail-page.tsx | 70 |
| 7 | features/tasks/components/detail-page.tsx | 53 |
| 8 | features/stock-transfers/components/detail-page.tsx | 44 |
| 9 | features/stock-transfers/components/edit-page.tsx | 33 |
| 10 | features/tasks/components/recurring-page.tsx | 32 |
| 11 | features/tasks/components/task-form-page.tsx | 31 |
| 12 | features/stock-transfers/components/form-page.tsx | 31 |
| 13 | features/tasks/components/templates-page.tsx | 29 |
| 14 | features/complaints/components/compensation-payment-receipt-wizard.tsx | 28 |
| 15 | features/orders/__tests__/order-store.test.ts | 26 |
| 16 | features/sales-returns/form-page.tsx | 24 |
| 17 | features/complaints/components/public-tracking-page.tsx | 24 |
| 18 | features/leaves/components/leave-form.tsx | 23 |
| 19 | features/reports/business-activity/hooks/use-sales-report.ts | 21 |
| 20 | features/tasks/components/dashboard-page.tsx | 20 |
| 21 | features/employees/components/employee-documents.tsx | 20 |
| 22 | features/customers/detail-page.tsx | 19 |
| 23 | features/complaints/components/statistics-page.tsx | 15 |
| 24 | features/tasks/components/user-tasks-page.tsx | 14 |
| 25 | features/sales-returns/detail-page.tsx | 13 |

---

## 🎯 Chiến lược Fix

### Phase 1: Quick Wins (Modules < 10 errors)
**Mục tiêu:** Fix 13 modules với tổng ~35 errors
- [ ] brands (1)
- [ ] attendance (1)
- [ ] cashbook (1)
- [ ] receipts (1)
- [ ] payments (1)
- [ ] categories (1)
- [ ] suppliers (2)
- [ ] purchase-returns (2)
- [ ] reconciliation (2)
- [ ] inventory-receipts (3)
- [ ] cost-adjustments (6)
- [ ] packaging (8)
- [ ] purchase-orders (9)

### Phase 2: Medium Effort (10-50 errors)
**Mục tiêu:** Fix 7 modules với tổng ~150 errors
- [ ] inventory-checks (10)
- [ ] dashboard (11)
- [ ] shipments (15)
- [ ] products (19)
- [ ] settings (20)
- [ ] customers (21)
- [ ] warranty (29)

### Phase 3: High Effort (50-150 errors)
**Mục tiêu:** Fix 4 modules với tổng ~230 errors
- [ ] reports (30)
- [ ] leaves (35)
- [ ] sales-returns (48)
- [ ] stock-transfers (112)

### Phase 4: Major Refactoring (>150 errors)
**Mục tiêu:** Fix 4 modules với tổng ~1050 errors
- [ ] tasks (221)
- [ ] complaints (238)
- [ ] employees (280)
- [ ] orders (315)

---

## 🔧 Hướng dẫn Fix theo loại lỗi

### TS7006 & TS7031: Parameter/Binding element implicitly has 'any' type
**Fix:** Thêm type annotation

```typescript
// ❌ Before
function handleClick(e) { ... }
const { data } = props;

// ✅ After
function handleClick(e: React.MouseEvent) { ... }
const { data }: { data: DataType } = props;
```

### TS2307: Cannot find module
**Fix:** Kiểm tra import paths, thêm type declarations

```typescript
// Kiểm tra paths trong tsconfig.json
// Hoặc tạo .d.ts file cho modules không có types
```

### TS2322: Type not assignable
**Fix:** Sửa type hoặc cast đúng

```typescript
// ❌ Before
const value: string = someNumber;

// ✅ After
const value: string = String(someNumber);
// hoặc fix source type
```

### TS7053: Element implicitly has 'any' type
**Fix:** Type index access properly

```typescript
// ❌ Before
const value = obj[key];

// ✅ After
const value = obj[key as keyof typeof obj];
// hoặc define proper index signature
```

---

## ✅ Progress Tracking

| Phase | Status | Errors Fixed | % Complete |
|-------|--------|--------------|------------|
| Phase 1 | ⏳ Not Started | 0/35 | 0% |
| Phase 2 | ⏳ Not Started | 0/150 | 0% |
| Phase 3 | ⏳ Not Started | 0/230 | 0% |
| Phase 4 | ⏳ Not Started | 0/1050 | 0% |
| **Total** | ⏳ | **0/1523** | **0%** |

---

## 📝 Notes

- Khi fix xong 1 module, chạy `npx tsc --noEmit --strict` để verify
- Có thể enable strict mode từng file bằng `// @ts-strict` comment
- Hoặc tạo `tsconfig.strict.json` extend từ base config để test riêng

---

*Last Updated: 27/12/2025*
