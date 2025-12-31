# ESLint Warnings - TODO List

> **Tạo ngày:** 2024-12-27  
> **Tổng warnings:** 3,511  
> **Trạng thái:** 🔄 Đang xử lý dần

---

## 📊 Tổng quan

| Rule | Số lượng | Độ ưu tiên | Độ khó |
|------|----------|------------|--------|
| `@typescript-eslint/no-unused-vars` | 1,925 | 🟡 Trung bình | 🟢 Dễ |
| `@typescript-eslint/no-explicit-any` | 1,330 | 🟠 Cao | 🟡 Trung bình |
| `react-hooks/exhaustive-deps` | 223 | 🟠 Cao | 🔴 Khó |
| `@next/next/no-img-element` | 28 | 🟢 Thấp | 🟢 Dễ |

---

## 🔧 Cách Fix từng loại

### 1. `@typescript-eslint/no-unused-vars` (1,925 warnings)

**Nguyên nhân phổ biến:**
- Import không dùng
- Biến destructure không dùng
- Function parameters không dùng (API routes)
- Variables trong try-catch không dùng

**Cách fix:**

```typescript
// ❌ Bad: Import không dùng
import { cookies } from 'next/headers'

// ✅ Good: Xóa import không dùng
// (xóa dòng trên)

// ❌ Bad: Destructure không dùng  
const { createdAt, updatedAt, ...rest } = data

// ✅ Good: Prefix underscore cho biến không dùng
const { createdAt: _createdAt, updatedAt: _updatedAt, ...rest } = data

// ❌ Bad: Parameter không dùng
export async function GET(request: Request) { }

// ✅ Good: Prefix underscore
export async function GET(_request: Request) { }

// ❌ Bad: Catch error không dùng
try { } catch (error) { }

// ✅ Good: Prefix underscore
try { } catch (_error) { }
```

**Quick fix với ESLint config:**
```json
{
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }]
  }
}
```

---

### 2. `@typescript-eslint/no-explicit-any` (1,330 warnings)

**Nguyên nhân phổ biến:**
- Prisma query results chưa có type
- API response chưa định nghĩa type
- Event handlers (e: any)
- Dynamic data structures

**Cách fix:**

```typescript
// ❌ Bad
const data: any = await prisma.user.findMany()

// ✅ Good: Sử dụng Prisma generated types
import { User } from '@/generated/prisma'
const data: User[] = await prisma.user.findMany()

// ❌ Bad
function handleChange(e: any) { }

// ✅ Good: Specific event type
function handleChange(e: React.ChangeEvent<HTMLInputElement>) { }

// ❌ Bad
const result: any = await fetch('/api/data').then(r => r.json())

// ✅ Good: Define response type
interface ApiResponse {
  data: User[]
  total: number
}
const result: ApiResponse = await fetch('/api/data').then(r => r.json())
```

**Chiến lược:**
1. Tạo types cho API responses trong `types/api.ts`
2. Sử dụng Prisma generated types thay vì any
3. Tạo shared types cho common patterns

---

### 3. `react-hooks/exhaustive-deps` (223 warnings)

**Nguyên nhân phổ biến:**
- Missing dependencies trong useEffect/useMemo/useCallback
- Unnecessary dependencies
- Object/function dependencies thay đổi mỗi render

**Cách fix:**

```typescript
// ❌ Bad: Missing dependency
useEffect(() => {
  fetchData(userId)
}, []) // userId missing

// ✅ Good: Add dependency
useEffect(() => {
  fetchData(userId)
}, [userId])

// ❌ Bad: Function dependency changes every render
const handleClick = () => { doSomething(value) }
useEffect(() => {
  element.addEventListener('click', handleClick)
}, [handleClick]) // Will re-run every render!

// ✅ Good: useCallback for stable reference
const handleClick = useCallback(() => {
  doSomething(value)
}, [value])

useEffect(() => {
  element.addEventListener('click', handleClick)
}, [handleClick])

// ❌ Bad: Unnecessary dependency
const memoValue = useMemo(() => {
  return items.filter(x => x.active)
}, [items, search]) // search not used!

// ✅ Good: Remove unnecessary
const memoValue = useMemo(() => {
  return items.filter(x => x.active)
}, [items])
```

**⚠️ Lưu ý:** Rule này quan trọng cho performance và bugs. Không nên disable!

---

### 4. `@next/next/no-img-element` (28 warnings)

**Nguyên nhân:** Sử dụng `<img>` thay vì `<Image>` từ next/image

**Cách fix:**

```tsx
// ❌ Bad
<img src="/logo.png" alt="Logo" width={100} height={50} />

// ✅ Good
import Image from 'next/image'
<Image src="/logo.png" alt="Logo" width={100} height={50} />

// Cho external URLs, cần config next.config.ts:
// images: { remotePatterns: [{ hostname: 'example.com' }] }

// Nếu cần dùng <img> (print, external dynamic URLs):
// eslint-disable-next-line @next/next/no-img-element
<img src={dynamicUrl} alt="..." />
```

---

## 📋 TODO Checklist theo Module

### Phase 1: Quick Wins (🟢 Dễ) - ~500 warnings

- [ ] **API Routes - unused `request` param** (~100)
  - Prefix với `_request`
  - Files: `app/api/**/route.ts`

- [ ] **Unused imports** (~200)
  - Xóa imports không dùng
  - Dùng IDE auto-organize imports

- [ ] **Unused destructured vars** (~200)
  - Prefix với `_` hoặc xóa

### Phase 2: img → Image (🟢 Dễ) - 28 warnings

- [ ] `app/(authenticated)/test-upload/page.tsx`
- [ ] `components/shared/data-export-dialog.tsx`
- [ ] `features/products/components/product-detail-dialog.tsx`
- [ ] `features/products/components/product-form.tsx`
- [ ] `features/products/components/product-list.tsx`
- [ ] `features/products/components/products-page.tsx`
- [ ] `features/orders/components/order-detail-view.tsx`
- [ ] `features/settings/general/components/general-settings-form.tsx`
- [ ] `features/wiki/components/wiki-editor.tsx`
- [ ] `hooks/use-lazy-image.tsx`
- [ ] Các file khác...

### Phase 3: no-explicit-any - API Routes (~400 warnings)

- [ ] `app/api/attendance/route.ts` (8 warnings)
- [ ] `app/api/branches/*/route.ts`
- [ ] `app/api/brands/*/route.ts`
- [ ] `app/api/categories/*/route.ts`
- [ ] `app/api/customers/route.ts`
- [ ] `app/api/departments/*/route.ts`
- [ ] `app/api/employees/*/route.ts`
- [ ] `app/api/orders/*/route.ts`
- [ ] `app/api/products/*/route.ts`
- [ ] ... (các routes khác)

### Phase 4: no-explicit-any - Components (~500 warnings)

- [ ] `components/data-table/*.tsx`
- [ ] `components/shared/*.tsx`
- [ ] `features/*/components/*.tsx`

### Phase 5: no-explicit-any - Stores & Hooks (~400 warnings)

- [ ] `features/*/store.ts`
- [ ] `hooks/*.ts`
- [ ] `lib/*.ts`

### Phase 6: exhaustive-deps (~223 warnings)

- [ ] `components/shared/generic-import-dialog-v2.tsx` (2 warnings)
- [ ] `features/products/components/*.tsx`
- [ ] `features/orders/components/*.tsx`
- [ ] `components/ui/*.tsx`
- [ ] `hooks/*.tsx`

---

## 🚀 Chiến lược thực hiện

### Option A: Fix dần khi touch file
- Mỗi khi edit file nào, fix luôn warnings trong file đó
- Pros: Không tốn effort riêng
- Cons: Chậm, không đồng đều

### Option B: Fix theo batch/sprint
- Dành 1-2 ngày mỗi sprint để fix warnings
- Pros: Progress rõ ràng
- Cons: Tốn thời gian riêng

### Option C: Tạm disable một số rules
- Disable rules ít quan trọng (`no-img-element`)
- Giữ rules quan trọng (`exhaustive-deps`)
- Pros: Giảm noise ngay
- Cons: Technical debt

### Recommended: Kết hợp A + C
1. **Disable** `no-img-element` (28 warnings, ít impact)
2. **Config** `no-unused-vars` cho phép `_` prefix
3. **Fix dần** `no-explicit-any` khi touch file
4. **Ưu tiên fix** `exhaustive-deps` (có thể gây bugs)

---

## 📝 ESLint Config đề xuất

```json
// .eslintrc.json
{
  "rules": {
    // Cho phép _ prefix cho unused vars
    "@typescript-eslint/no-unused-vars": ["warn", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_",
      "caughtErrorsIgnorePattern": "^_"
    }],
    
    // Giữ no-explicit-any là warn (không error)
    "@typescript-eslint/no-explicit-any": "warn",
    
    // Tắt no-img-element (hoặc để warn)
    "@next/next/no-img-element": "off",
    
    // Giữ exhaustive-deps (quan trọng!)
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## 📈 Progress Tracking

| Ngày | Errors | Warnings | Đã fix | Ghi chú |
|------|--------|----------|--------|---------|
| 2024-12-27 | 670 | 3,511 | 0 | Initial count |
| 2024-12-27 | 0 | 3,198 | 983 | Phase 1 + ESLint errors fixed ✅ |
| 2024-12-27 | 0 | 2,909 | 1,272 | Phase 3: no-explicit-any (API+lib+stores) ✅ |
| 2024-12-28 | 0 | 2,076 | 2,105 | Phase 3+4: no-explicit-any + no-unused-vars ✅ |
| 2024-12-28 | 0 | 2,011 | 2,170 | Fixed exhaustive-deps + useCallback patterns ✅ |
| | | | | Còn lại: ~820 no-explicit-any |
| | | | | ~1,000 no-unused-vars |
| | | | | ~160 exhaustive-deps |

---

## 🔗 Tài liệu tham khảo

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript ESLint Rules](https://typescript-eslint.io/rules/)
- [React Hooks Rules](https://reactjs.org/docs/hooks-rules.html)
- [Next.js ESLint](https://nextjs.org/docs/basic-features/eslint)
