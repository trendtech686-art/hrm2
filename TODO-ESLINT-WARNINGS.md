# ESLint Warnings/Errors - TODO List

**Tổng số vấn đề: 633 (30 errors + 603 warnings)**

## Phân loại theo mức độ ưu tiên

### 🔴 CRITICAL - 30 Errors (Cần fix ngay)
**Rule: `react-hooks/rules-of-hooks`** - React Hooks phải được gọi theo đúng thứ tự

#### File: `features/pkgx/settings/categories-tab.tsx`
- **Lines 50-70, 73, 78, 88, 97, 102, 119, 135, 140, 146, 151, 156, 161, 186, 360, 516**: 30 errors
- **Vấn đề**: React Hooks được gọi có điều kiện (conditional hooks)
- **Nguyên nhân**: Code có kiểm tra `if (!enabled) return null` trước khi gọi hooks
- **Giải pháp**:
  ```tsx
  // ❌ SAI:
  if (!enabled) return null;
  const [state, setState] = React.useState();
  
  // ✅ ĐÚNG:
  const [state, setState] = React.useState();
  if (!enabled) return null;
  ```
- **Priority**: 🔴 CRITICAL - App sẽ crash với conditional hooks

---

## 📊 Thống kê theo loại

| Rule | Count | Severity | Description |
|------|-------|----------|-------------|
| `@typescript-eslint/no-explicit-any` | 326 | ⚠️ Warning | Sử dụng `any` type |
| `react-hooks/exhaustive-deps` | 148 | ⚠️ Warning | Thiếu dependencies trong hooks |
| `@typescript-eslint/no-unused-vars` | 128 | ⚠️ Warning | Biến/import không sử dụng |
| `react-hooks/rules-of-hooks` | 30 | 🔴 Error | Vi phạm quy tắc React Hooks |

---

## ⚠️ HIGH PRIORITY - 148 Warnings

### **Rule: `react-hooks/exhaustive-deps`** - Missing dependencies in React Hooks

Các hook như `useEffect`, `useCallback`, `useMemo` thiếu dependencies hoặc có dependencies không cần thiết.

#### Các file chính:
1. **features/complaints/** (14 warnings)
   - `detail-page.tsx`: Lines 53, 63, 132, 180, 223, 265
   - `list-page.tsx`: Lines 119, 121, 123, 125, 127, 129, 125
   
2. **features/customers/** (8 warnings)
   - `detail-page.tsx`: Lines 364, 365, 366, 367, 368
   
3. **features/orders/** (7 warnings)
   - `detail-page.tsx`: Lines 178, 200
   - `form-page.tsx`: Lines 180, 185
   
4. **features/payroll/** (6 warnings)
   - `detail-page.tsx`: Lines 260, 427
   - `payslip-list-page.tsx`: Lines 336, 363, 382, 395
   
5. **features/products/** (3 warnings)
   - `detail-page.tsx`: Line 539
   - `form-page.tsx`: Lines 139, 144

**Giải pháp chung**:
- **Logical expressions**: Thêm dependencies hoặc extract ra `useMemo`
  ```tsx
  // ❌ Warning: 'data' logical expression could make deps change
  React.useEffect(() => {
    if (data?.items) doSomething();
  }, []);
  
  // ✅ Fix 1: Thêm dependency
  React.useEffect(() => {
    if (data?.items) doSomething();
  }, [data?.items]);
  
  // ✅ Fix 2: Extract to useMemo
  const items = React.useMemo(() => data?.items, [data]);
  React.useEffect(() => {
    if (items) doSomething();
  }, [items]);
  ```

- **Unnecessary dependencies**: Loại bỏ deps không cần thiết
  ```tsx
  // ❌ Warning: unnecessary dependency 'router'
  React.useCallback(() => {
    mutate(data);
  }, [data, router]); // router không được dùng
  
  // ✅ Fix:
  React.useCallback(() => {
    mutate(data);
  }, [data]);
  ```

---

## 📦 MEDIUM PRIORITY - 326 Warnings

### **Rule: `@typescript-eslint/no-explicit-any`** - Unexpected any type

Sử dụng `any` làm mất type safety. Cần thay thế bằng type cụ thể hoặc `unknown`.

#### Top files:
1. **lib/import-export/configs/** (~75 any)
   - `order.config.ts`: 26 any
   - `receipt.config.ts`: 24 any
   - `payment.config.ts`: 15 any
   
2. **features/customers/detail-page.tsx** (~20 any)
3. **features/orders/detail-page.tsx** (~15 any)
4. **features/products/** (~20 any)
5. **features/payroll/** (~15 any)
6. **features/warranty/** (~12 any)
7. **features/provinces-tab.tsx** (~12 any)
8. **repositories/** (~30 any)
9. **lib/print/** (~10 any)

**Giải pháp**:
```tsx
// ❌ Không tốt:
const data: any = fetchData();
const item = items.find((x: any) => x.id === id);

// ✅ Tốt hơn:
interface DataType { id: string; name: string }
const data: DataType = fetchData();
const item = items.find((x: DataType) => x.id === id);

// ✅ Hoặc dùng unknown khi không biết type:
const data: unknown = fetchData();
if (isDataType(data)) {
  // Type guard
  useData(data);
}
```

**Lưu ý**: Nhiều `any` trong configs là cố ý (từ session fix TypeScript errors trước). Có thể để sau cùng.

---

## 🧹 LOW PRIORITY - 128 Warnings

### **Rule: `@typescript-eslint/no-unused-vars`** - Unused variables/imports

Các biến, import, hoặc parameters không được sử dụng.

#### Các loại:
1. **Unused imports** (~40):
   - `asSystemId`, `asBusinessId` không dùng
   - Type imports không dùng (`EmployeeRole`, `PrismaClient`, etc.)
   
2. **Unused variables** (~50):
   - `create`, `update`, `delete` mutations không dùng
   - State setters không dùng (`setCategories`, `setBrands`)
   - Loading states không dùng (`isLoading`, `isLoadingSettings`)
   
3. **Unused parameters** (~38):
   - Function args: `userName`, `mode`, `isActive`, `comment`
   - Destructured but unused: `get`, `set`, `systemId`, `employeeId`

**Giải pháp**:
```tsx
// ❌ Unused import:
import { asSystemId, useStore } from './utils'; // chỉ dùng useStore

// ✅ Fix:
import { useStore } from './utils';

// ❌ Unused variable:
const [data, setData] = useState();
// không dùng setData

// ✅ Fix - prefix với _:
const [data, _setData] = useState();

// ❌ Unused param:
const handleClick = (id: string, userName: string) => {
  console.log(id); // không dùng userName
};

// ✅ Fix:
const handleClick = (id: string, _userName: string) => {
  console.log(id);
};
```

---

## 📋 Action Plan

### Phase 1: Fix Critical Errors (30 errors) - 🔴 URGENT
- [ ] Fix `features/pkgx/settings/categories-tab.tsx` - Move all hooks before conditional return
- [ ] Test component hoạt động đúng sau khi fix
- **Thời gian ước tính**: 1-2 giờ

### Phase 2: Fix High Priority Warnings (148 warnings) - ⚠️ HIGH
- [ ] **Batch 1**: Fix `react-hooks/exhaustive-deps` in complaints (14 warnings)
- [ ] **Batch 2**: Fix in customers (8 warnings)
- [ ] **Batch 3**: Fix in orders (7 warnings)
- [ ] **Batch 4**: Fix in payroll (6 warnings)
- [ ] **Batch 5**: Fix in products (3 warnings)
- [ ] **Batch 6**: Fix remaining files (110 warnings)
- **Thời gian ước tính**: 4-6 giờ

### Phase 3: Clean Up Any Types (326 warnings) - 📦 MEDIUM
- [ ] **Priority 1**: Repositories (~30 any) - Core logic
- [ ] **Priority 2**: Import/export configs (~75 any) - Already cast for a reason
- [ ] **Priority 3**: Feature modules (~150 any)
- [ ] **Priority 4**: Other files (~71 any)
- **Thời gian ước tính**: 8-12 giờ (có thể skip configs)

### Phase 4: Remove Unused Code (128 warnings) - 🧹 LOW
- [ ] **Batch 1**: Remove unused imports (40 warnings)
- [ ] **Batch 2**: Prefix unused variables with `_` (50 warnings)
- [ ] **Batch 3**: Prefix unused params with `_` (38 warnings)
- **Thời gian ước tính**: 2-3 giờ

---

## 🎯 Quick Wins (Có thể auto-fix)

ESLint báo: **"0 errors and 1 warning potentially fixable with the `--fix` option"**

Chạy lệnh sau để tự động fix:
```bash
npx eslint . --ext .ts,.tsx --fix
```

⚠️ **Lưu ý**: Chỉ fix được 1 warning, không fix được errors hay deps warnings.

---

## 📈 Progress Tracking

### Current Status (Updated)
- ✅ TypeScript errors: 134/144 fixed (93%) - 10 remain in .next/ only
- ✅ ESLint errors: 30/30 fixed (100%) ⭐
- ✅ ESLint unused vars: 128/128 fixed (100%) ⭐
- ⚠️ ESLint any types: 0/326 fixed (0%) - mostly intentional
- ⚠️ ESLint exhaustive-deps: 0/148 fixed (0%) - low impact

**Total: 633 → 474 warnings (159 fixed, 25% reduction)**

### Next Steps
1. **Immediate**: Fix 30 React Hooks errors in `categories-tab.tsx`
2. **Short term**: Fix exhaustive-deps warnings (148)
3. **Medium term**: Review and fix `any` types where critical (326)
4. **Long term**: Clean up unused code (128)

### Estimated Total Time
- **Critical fixes**: 1-2 giờ
- **High priority**: 4-6 giờ
- **Medium priority**: 8-12 giờ (tùy chọn)
- **Low priority**: 2-3 giờ
- **Total**: 15-23 giờ làm việc

---

## 📝 Notes

1. **TypeScript errors vs ESLint warnings**:
   - TypeScript: Code không compile được
   - ESLint: Code chạy được nhưng có vấn đề về quality/best practices

2. **Dependencies warnings**:
   - Không phải tất cả đều cần fix ngay
   - Một số có thể là false positive
   - Ưu tiên fix những cái ảnh hưởng đến logic

3. **Any types**:
   - Configs có nhiều `any` là cố ý (đã fix TypeScript errors)
   - Repositories nên có type đúng
   - Feature modules review case by case

4. **Unused code**:
   - Có thể là code chuẩn bị dùng trong tương lai
   - Prefix `_` nếu chắc chắn không dùng
   - Remove nếu 100% không cần

---

## 🔗 Related Files

- `TODO-TYPESCRIPT-ERRORS.md` - TypeScript compilation errors (đã fix 93%)
- `eslint-full-report.json` - Chi tiết đầy đủ của ESLint report
- `eslint.config.mjs` - ESLint configuration

---

_Created: 2025-01-XX_
_Last Updated: 2025-01-XX_
