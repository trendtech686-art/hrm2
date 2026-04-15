---
description: "Create a new feature module with standard structure following V3 patterns."
agent: "agent"
argument-hint: "Tên module mới (e.g., vouchers, promotions)"
---
Tạo feature module `$input` với cấu trúc chuẩn HRM2.

## Tạo các files sau:

### 1. `features/$input/types.ts`
- Interface chính + CreateInput + UpdateInput
- Import Prisma generated types nếu có

### 2. `features/$input/validation.ts`
- Zod schemas cho create + update
- Export type inferred từ schema

### 3. `features/$input/api/$input-api.ts`
- Fetch functions: `fetchXxx(params)`, `fetchXxxDetail(id)`
- Gọi `/api/$input/` endpoints
- Extract `.data` từ response

### 4. `features/$input/hooks/use-$input.ts`
- Query keys factory pattern
- `useXxx(params, initialData?)` — list query
- `useXxxDetail(id)` — detail query 
- `useXxxMutations()` — create/update/delete via Server Actions

### 5. `features/$input/columns.tsx`
- Table columns definition (tách riêng khỏi page)

### 6. `features/$input/page.tsx`
- `'use client'` + named export
- < 300 lines, thin wrapper
- `useAuth()` cho permissions

### 7. `app/api/$input/route.ts`
- GET handler với `apiHandler()` + `apiPaginated()`

### 8. `app/actions/$input.ts`
- `'use server'` + CRUD actions
- `requireActionPermission()` + `revalidatePath/Tag`

Tham khảo pattern: `features/employees/` hoặc `features/products/`.
Output bằng tiếng Việt.
