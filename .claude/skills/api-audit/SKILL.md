# Skill: API Audit & Implementation Planner

## Mục đích

Kiểm tra API endpoint hiện có xem đã đạt chuẩn HRM2 chưa, và lên kế hoạch triển khai đúng chuẩn.

## Khi nào dùng

- User muốn audit API hiện có
- User muốn tạo API mới đúng chuẩn
- User muốn đánh giá chất lượng code API
- User muốn lên kế hoạch refactor API

## QUY TRÌNH AUDIT

### Bước 1: Đọc API hiện có

```bash
# Liệt kê tất cả API routes trong feature
find app/api -name "route.ts" | grep <feature-name>
```

### Bước 2: Check theo Checklist

---

## CHECKLIST CHUẨN API HRM2

### 1. AUTHENTICATION ✅/❌

| Tiêu chí | Mô tả | File cần check |
|----------|-------|----------------|
| **requireAuth** | Dùng `requireAuth()` hoặc `apiHandler` | `lib/api-utils.ts` |
| **Session valid** | Trả 401 nếu chưa login | - |
| **Permission check** | Dùng `requirePermission()` nếu cần | `lib/api-utils.ts` |

**Code mẫu:**
```typescript
// ✅ ĐÚNG
const session = await requireAuth()
if (!session) return apiError('Unauthorized', 401)

// ✅ TỐT HƠN - Dùng apiHandler
export const GET = apiHandler(async (req, { session }) => {
  // session luôn có nếu auth: true
}, { auth: true, permission: 'view_orders' })
```

### 2. VALIDATION ✅/❌

| Tiêu chí | Mô tả |
|----------|-------|
| **Zod schema** | Body/query dùng Zod validate |
| **validateBody** | Dùng `validateBody(req, schema)` |
| **validateQuery** | Dùng `validateQuery(params, schema)` |

**Code mẫu:**
```typescript
import { z } from 'zod'
import { validateBody, validateQuery } from '@/lib/api-utils'

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
})

export async function POST(request: Request) {
  const result = await validateBody(request, createSchema)
  if (!result.success) return apiError(result.error, 400)
  
  const { name, email } = result.data
  // ...
}
```

### 3. PAGINATION ✅/❌

| Tiêu chí | Mô tả | Giới hạn |
|----------|-------|----------|
| **parsePagination** | Dùng `parsePagination()` | `API_MAX_PAGE_LIMIT` |
| **Limit capped** | `Math.min(limit, API_MAX_PAGE_LIMIT)` | 1000 |
| **skip/take** | Prisma dùng skip + take | - |

**Code mẫu:**
```typescript
import { parsePagination } from '@/lib/api-utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const { page, limit, skip } = parsePagination(searchParams)
  
  const [data, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count(),
  ])
  
  return apiPaginated(data, { page, limit, total })
}
```

### 4. ERROR HANDLING ✅/❌

| Tiêu chí | Mô tả |
|----------|-------|
| **try/catch** | Có try/catch cho async operations |
| **logError** | Dùng `logError()` thay vì console.log |
| **apiError** | Trả error qua `apiError()` |

**Code mẫu:**
```typescript
import { logError } from '@/lib/logger'

try {
  const order = await prisma.order.create({ data })
  return apiSuccess(order, 201)
} catch (error) {
  logError('Create order failed', error)
  return apiError('Failed to create order', 500)
}
```

### 5. RESPONSE FORMAT ✅/❌

| Tiêu chí | Helper |
|----------|--------|
| **Thành công** | `apiSuccess(data, 201)` |
| **Có phân trang** | `apiPaginated(data, { page, limit, total })` |
| **Lỗi** | `apiError(message, status)` |
| **Không tìm thấy** | `apiNotFound('Order')` |
| **Decimal** | `serializeDecimals()` (auto trong apiSuccess) |

### 6. SECURITY ✅/❌

| Tiêu chí | Mô tả |
|----------|-------|
| **Rate limiting** | Dùng `apiHandler` với rateLimit |
| **Input sanitization** | Không trust user input |
| **No sensitive data** | Không log password, token |

### 7. PRISMA BEST PRACTICES ✅/❌

| Tiêu chí | Mô tả |
|----------|-------|
| **Select only needed fields** | Dùng `select: {}` |
| **No include everything** | Tránh `include: { *: true }` |
| **Decimal serialization** | Dùng `serializeDecimals()` |
| **Async parallel** | Dùng `Promise.all()` cho independent queries |

---

## ĐÁNH GIÁ MỨC ĐỘ

### 🔴 CẦN SỬA NGAY (Critical)

- Không có auth
- Không validate input
- Leaking sensitive data
- SQL injection possible

### 🟡 NÊN CẢI THIỆN (Important)

- Thiếu pagination
- Thiếu error handling
- Dùng `console.log` thay vì `logError`
- Select * (lấy hết fields)

### 🟢 ĐẠT CHUẨN (Good)

- Đã follow tất cả checklist
- Có docs/comments cho complex logic

---

## TEMPLATE BÁO CÁO AUDIT

```markdown
# API Audit Report: {feature-name}

**Date:** {date}
**Auditor:** Claude
**API:** `/api/{feature}`

## Summary

| Category | Score | Status |
|----------|-------|--------|
| Authentication | X/Y | ✅/⚠️/❌ |
| Validation | X/Y | ✅/⚠️/❌ |
| Pagination | X/Y | ✅/⚠️/❌ |
| Error Handling | X/Y | ✅/⚠️/❌ |
| Response Format | X/Y | ✅/⚠️/❌ |
| Security | X/Y | ✅/⚠️/❌ |
| Prisma Best Practices | X/Y | ✅/⚠️/❌ |

## Chi tiết

### 1. Authentication
- [ ] Có `requireAuth()`
- [ ] Trả 401 nếu chưa login

### 2. Validation
- [ ] Có Zod schema
- [ ] Dùng `validateBody()` hoặc `validateQuery()`

### 3. Pagination
- [ ] Dùng `parsePagination()`
- [ ] Limit capped

...

## Issues

### 🔴 Critical
1. [Issue 1]
2. [Issue 2]

### 🟡 Important
1. [Issue 1]
2. [Issue 2]

## Recommendations

1. Thêm auth middleware
2. Tạo Zod schema cho input
3. ...

## Estimated Effort

- Critical fixes: X hours
- Important improvements: Y hours
- Nice to have: Z hours
```

---

## KẾ HOẠCH TRIỂN KHAI

### Phase 1: Critical Fixes (Ngày 1)
1. Thêm auth
2. Thêm validation
3. Fix security issues

### Phase 2: Important Improvements (Ngày 2-3)
1. Thêm pagination
2. Cải thiện error handling
3. Optimize Prisma queries

### Phase 3: Polish (Ngày 4)
1. Thêm logs/comments
2. Test các edge cases
3. Update documentation

---

## VÍ DỤ AUDIT

### Ví dụ: Audit `/api/orders/route.ts`

**Input:**
```typescript
export async function GET(req: Request) {
  const orders = await prisma.order.findMany()
  return Response.json(orders)
}
```

**Issues found:**
1. ❌ Không có auth
2. ❌ Không validate query params
3. ❌ Không có pagination (lấy HẾT)
4. ❌ Không có error handling
5. ❌ Select * (lấy hết fields)
6. ❌ Dùng Response.json() thay vì apiSuccess()

**Fixed version:**
```typescript
export const GET = apiHandler(async (req, { session }) => {
  const { searchParams } = new URL(req.url)
  const { page, limit, skip } = parsePagination(searchParams)
  
  const [data, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { systemId: true, total: true, status: true, /* ... */ },
    }),
    prisma.order.count(),
  ])
  
  return apiPaginated(data, { page, limit, total })
}, { auth: true, rateLimit: { max: 60 } })
```

---

## LƯU Ý

1. **Luôn dùng helpers** - `apiSuccess`, `apiError`, `parsePagination`
2. **Validation quan trọng** - Ngăn chặn bad data từ đầu
3. **Pagination là bắt buộc** - Không bao giờ `findMany()` không có limit
4. **Error handling** - Log để debug, không crash server
