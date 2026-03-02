# 🍞 BREADCRUMB SYSTEM v2.0

**Migration from store-based to Next.js native approach**  
**Date:** 2026-01-20  
**Status:** ✅ Production Ready

---

## 🎯 OVERVIEW

Refactored breadcrumb system để loại bỏ dependency vào Prisma/stores, fix build error "Module not found: Can't resolve 'dns'".

### **Problem (Old System)**
```
❌ breadcrumb-generator → id-system → prisma → Node.js deps
❌ Store registry pattern (complex, circular deps)  
❌ Client-side entity lookup (unnecessary)
❌ Build error: Can't resolve 'dns' in client bundle
```

### **Solution (New System)**
```
✅ Simple pathname parsing + route metadata
✅ Zero runtime dependencies (no Prisma, no stores)
✅ Works in both client & server components
✅ Pass entity data via props (Next.js native pattern)
```

---

## 📁 FILES CHANGED

### 1. [lib/breadcrumb-generator.ts](../lib/breadcrumb-generator.ts) - ✅ Refactored (207 lines)

**Removed:**
- ❌ `import { type EntityType, getEntityConfig } from './id-system'`
- ❌ Store registry pattern
- ❌ Entity lookup functions

**Added:**
- ✅ `getBreadcrumbsFromPath()` - Main function
- ✅ `ROUTE_METADATA` - Static route labels
- ✅ `useBreadcrumbs()` - React hook
- ✅ Simple pathname parsing (no DB/store lookups)

### 2. [lib/breadcrumb-system.ts](../lib/breadcrumb-system.ts) - ✅ Simplified (36 lines)

**Now just re-exports from breadcrumb-generator.ts:**
```typescript
export {
  getBreadcrumbsFromPath,
  useBreadcrumbs,
  type BreadcrumbItem,
} from './breadcrumb-generator';
```

### 3. [lib/id-system.ts](../lib/id-system.ts) - ✅ No changes needed

No longer imported by breadcrumb files → Prisma stays server-side only.

---

## 🚀 NEW USAGE

### **Option 1: Server Component (Recommended)**

```tsx
// app/categories/[systemId]/page.tsx
import { getBreadcrumbsFromPath } from '@/lib/breadcrumb-generator'

export default async function CategoryPage({ params }) {
  const category = await fetchCategory(params.systemId)
  
  // Generate breadcrumbs with entity data
  const breadcrumbs = getBreadcrumbsFromPath(
    `/categories/${params.systemId}`,
    { name: category.name, id: category.id }
  )
  
  return <PageHeader breadcrumbs={breadcrumbs} />
}
```

### **Option 2: Client Component**

```tsx
'use client'
import { usePathname } from 'next/navigation'
import { useBreadcrumbs } from '@/lib/breadcrumb-generator'

export function MyPage({ category }) {
  const pathname = usePathname()
  const breadcrumbs = useBreadcrumbs(pathname, {
    name: category.name,
    id: category.id
  })
  
  return <Breadcrumb items={breadcrumbs} />
}
```

### **Option 3: Simple Pathname (No Entity Data)**

```tsx
import { getBreadcrumbsFromPath } from '@/lib/breadcrumb-generator'

// Automatically generates labels from path segments
const breadcrumbs = getBreadcrumbsFromPath('/categories/new')
// Result: [
//   { label: 'Trang chủ', href: '/', isCurrent: false },
//   { label: 'Danh mục sản phẩm', href: '/categories', isCurrent: false },
//   { label: 'Tạo mới', href: '/categories/new', isCurrent: true }
// ]
```

---

## 📊 BREADCRUMB INTERFACE

```typescript
interface BreadcrumbItem {
  label: string        // Display text
  href: string         // Route path
  isCurrent?: boolean  // Is current page
}
```

---

## 🗺️ ROUTE METADATA

Static configuration in `ROUTE_METADATA`:

```typescript
const ROUTE_METADATA: Record<string, { label: string }> = {
  '/': { label: 'Trang chủ' },
  '/categories': { label: 'Danh mục sản phẩm' },
  '/products': { label: 'Sản phẩm' },
  '/customers': { label: 'Khách hàng' },
  '/orders': { label: 'Đơn hàng' },
  '/employees': { label: 'Nhân viên' },
  // ... 60+ routes
}
```

**Add new routes** by editing `ROUTE_METADATA` constant.

---

## 🔄 MIGRATION GUIDE

### **Before (Old System)**

```tsx
// ❌ Old - Required store registration
import { useBreadcrumb } from '@/lib/breadcrumb-generator'
import { registerBreadcrumbStore } from '@/lib/breadcrumb-generator'

registerBreadcrumbStore('categories', () => useCategoryStore())

function Page() {
  const crumbs = useBreadcrumb('categories', systemId, 'Danh mục')
  // ...
}
```

### **After (New System)**

```tsx
// ✅ New - Simple props passing
import { useBreadcrumbs } from '@/lib/breadcrumb-generator'
import { usePathname } from 'next/navigation'

function Page({ category }) {
  const pathname = usePathname()
  const crumbs = useBreadcrumbs(pathname, {
    name: category.name,
    id: category.id
  })
  // ...
}
```

---

## 🏗️ ARCHITECTURE

### **Data Flow**

```
Server Component (page.tsx)
  ↓ fetch category from DB
  ↓ generate breadcrumbs with entity data
  ↓ pass to PageHeader
PageHeader (client component)
  ↓ render breadcrumbs
```

### **No More:**
- ❌ Store lookups
- ❌ Client-side entity fetching  
- ❌ Prisma imports in breadcrumb code

### **Now:**
- ✅ Server fetches data once
- ✅ Pass data down as props
- ✅ Pure function transforms pathname → breadcrumbs

---

## ✅ BENEFITS

| Aspect | Old System | New System |
|--------|-----------|------------|
| **Dependencies** | Prisma, stores, id-system | Zero (just pathname) |
| **Build** | ❌ Error (DNS module) | ✅ Clean build |
| **Complexity** | Store registration, lookups | Simple props passing |
| **Performance** | Client-side lookups | Server-side only |
| **Maintainability** | Circular deps, hard to debug | Straightforward |
| **Next.js Pattern** | Anti-pattern | ✅ Recommended pattern |

---

## 🧪 TESTING

```bash
# Build should succeed (no DNS errors)
npm run build

# Type check
npm run type-check

# All breadcrumbs should work
# - Visit /categories
# - Visit /categories/[systemId]
# - Visit /categories/new
```

---

## 📝 BACKWARD COMPATIBILITY

Legacy exports still work (but deprecated):

```typescript
// Still exported but no-op
export function registerBreadcrumbStore() {}
export function clearBreadcrumbStores() {}

// Still work but use new implementation
export function generateDetailBreadcrumb(pathname, entityData) {
  return getBreadcrumbsFromPath(pathname, entityData)
}
```

**Migration strategy:** Update pages gradually, old code keeps working.

---

## 🎯 NEXT STEPS

### Recommended:
1. ✅ Update `page-header-context.tsx` to accept `breadcrumbs` prop
2. ✅ Remove all `registerBreadcrumbStore()` calls from store files
3. ✅ Update page components to pass entity data explicitly

### Optional:
- Add more routes to `ROUTE_METADATA`
- Create breadcrumb JSON-LD schema for SEO
- Add breadcrumb analytics tracking

---

## 🔗 REFERENCES

- **Main File:** [lib/breadcrumb-generator.ts](../lib/breadcrumb-generator.ts)
- **Re-exports:** [lib/breadcrumb-system.ts](../lib/breadcrumb-system.ts)
- **ID System:** [docs/ID-SYSTEM-ARCHITECTURE.md](./ID-SYSTEM-ARCHITECTURE.md)
- **Next.js Docs:** https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes

---

## ✅ CHANGELOG

### v2.0.0 (2026-01-20)
- ✅ Removed Prisma dependency from breadcrumb files
- ✅ Removed store registry pattern
- ✅ Added `getBreadcrumbsFromPath()` with pathname parsing
- ✅ Added `ROUTE_METADATA` static configuration
- ✅ Fixed build error: "Can't resolve 'dns'"
- ✅ Zero compile/lint errors
- ✅ Backward compatible exports

### v1.0.0 (Previous)
- Store-based entity lookups
- id-system.ts dependency
- Complex registration pattern
