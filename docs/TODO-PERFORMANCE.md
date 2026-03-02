# 🚀 TODO: Performance Optimization

> Created: 2026-02-13
> Status: In Progress

## 📊 Phân tích hiện tại

### API Response Times (từ dev logs):

| API | Render Time | Vấn đề | Priority |
|-----|-------------|--------|----------|
| `/api/products?limit=500` | **1602ms** | Query quá nhiều data | 🔴 HIGH |
| `/api/settings/pkgx/products?limit=10000` | **1301ms** | limit=10000! | 🔴 HIGH |
| `/api/products/list` | **1283ms** | Data lớn, không cache | 🔴 HIGH |
| `/api/pkgx/settings` | **923ms** | Slow query | 🟡 MEDIUM |
| `/api/settings/pkgx/categories` | **687ms** | Không cache | 🟡 MEDIUM |
| `/api/orders?limit=1000` | **486ms** | limit cao | 🟡 MEDIUM |
| `/api/customers?limit=1000` | **371ms** | limit cao | 🟡 MEDIUM |

### Vấn đề chính:
1. **Limit quá cao**: Frontend request `limit=10000`, `limit=1000` → load toàn bộ DB
2. **Không có cache**: Settings, branches, categories gọi lại mỗi lần
3. **Duplicate requests**: `user-preferences` được gọi 3-4 lần/page
4. **No pagination**: Load all → filter client-side

---

## ✅ TODO List

### 1. Cache Static APIs (Priority: HIGH)
- [ ] `/api/settings/*` - TTL: 30 phút
- [ ] `/api/branches` - TTL: 1 giờ  
- [ ] `/api/categories` - TTL: 30 phút
- [ ] `/api/brands` - TTL: 30 phút
- [ ] `/api/employees` - TTL: 5 phút
- [ ] `/api/departments` - TTL: 1 giờ

**Files cần sửa:**
```
app/api/settings/route.ts
app/api/branches/route.ts
app/api/categories/route.ts
app/api/brands/route.ts
app/api/employees/route.ts
app/api/departments/route.ts
```

### 2. Fix Limit Quá Cao (Priority: HIGH)
- [ ] Tìm tất cả nơi gọi `limit=10000` hoặc `limit=1000`
- [ ] Đổi sang pagination thực sự hoặc giảm limit
- [ ] Implement infinite scroll cho lists lớn

**Targets:**
- `/api/settings/pkgx/products?limit=10000` → max 500, có pagination
- `/api/products?limit=500` → limit 100, infinite scroll
- `/api/orders?limit=1000` → limit 50, pagination
- `/api/customers?limit=1000` → limit 100, pagination

### 3. Optimize User Preferences (Priority: MEDIUM)
- [ ] Batch multiple preference keys vào 1 request
- [ ] Cache preferences client-side (React Query staleTime)
- [ ] Hoặc: tạo endpoint `/api/user-preferences/batch`

**Current problem:**
```
GET /api/user-preferences?key=column-visibility   ← Request 1
GET /api/user-preferences?key=column-order        ← Request 2  
GET /api/user-preferences?key=column-pinned       ← Request 3
```

**Solution:**
```
GET /api/user-preferences/batch?keys=column-visibility,column-order,column-pinned
```

### 4. Optimize PKGX APIs (Priority: MEDIUM)
- [ ] `/api/pkgx/settings` - Cache 1 giờ
- [ ] `/api/settings/pkgx/products` - Pagination, không load 10000
- [ ] `/api/settings/pkgx/categories` - Cache 30 phút
- [ ] `/api/settings/pkgx/brands` - Cache 30 phút

### 5. Database Query Optimization (Priority: LOW)
- [ ] Add indexes cho frequently queried columns
- [ ] Review N+1 queries trong products API
- [ ] Add `select` để chỉ lấy columns cần thiết

---

## 🛠 Implementation Guide

### Cách áp dụng cache cho API route:

```typescript
// app/api/categories/route.ts
import { withCache, CACHE_TTL, createCacheKey } from '@/lib/api-cache'

export async function GET(request: Request) {
  const cacheKey = createCacheKey('categories', request)
  
  return withCache(cacheKey, async () => {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories)
  }, { ttl: CACHE_TTL.LONG }) // 30 phút
}
```

### Cách invalidate cache khi data thay đổi:

```typescript
// app/api/categories/route.ts (POST)
import { invalidateCache } from '@/lib/api-cache'

export async function POST(request: Request) {
  const category = await prisma.category.create({ ... })
  
  // Clear cache
  invalidateCache('categories')
  
  return NextResponse.json(category)
}
```

---

## 📈 Expected Improvements

| Metric | Before | After (Expected) |
|--------|--------|------------------|
| Products page load | ~2s | ~500ms |
| Settings APIs | 500-900ms | <50ms (cached) |
| Categories/Brands | 300-600ms | <50ms (cached) |
| User preferences | 3-4 requests | 1 request |

---

## 🔄 Progress Tracking

- [x] Task 1: Cache Static APIs ✅
- [x] Task 2: Fix Limit Quá Cao ✅ (cap at 500 for pkgx)
- [x] Task 3: Optimize User Preferences ✅ (batch endpoint)
- [x] Task 4: Optimize PKGX APIs ✅ (cache + limit cap)
- [ ] Task 5: Database Optimization (future)

### Completed Changes:

1. **app/api/settings/route.ts** - Added cache với TTL 30 phút
2. **app/api/branches/route.ts** - Added cache với TTL 1 giờ  
3. **app/api/categories/route.ts** - Added cache với TTL 30 phút
4. **app/api/brands/route.ts** - Added cache với TTL 30 phút
5. **app/api/stats/counts/route.ts** - NEW: Count endpoint thay vì load all
6. **app/api/user-preferences/batch/route.ts** - NEW: Batch get preferences
7. **app/api/settings/pkgx/products/route.ts** - Cache + cap limit at 500

**Last Updated:** 2026-02-13
