---
description: "Find and report dead code across the codebase — unused imports, orphaned files, unreferenced server actions."
agent: "agent"
argument-hint: "Phạm vi scan (e.g., 'all', 'actions', 'settings', 'features/orders')"
---
Tìm dead code trong phạm vi `$input`.

## Loại dead code cần tìm:

### 1. Server Actions không ai import
Scan `app/actions/*.ts` và `app/actions/settings/*.ts`:
- Tìm files KHÔNG được import ở bất kỳ đâu trong `features/` hoặc `app/`
- Loại trừ self-references

### 2. API files không ai import
Scan `features/*/api/*.ts`:
- Tìm fetch functions KHÔNG được gọi từ hooks hoặc components

### 3. Hook files không ai import
Scan `features/*/hooks/*.ts`:
- Tìm hooks KHÔNG được sử dụng trong components hoặc pages

### 4. Unused exports
- Functions/constants exported nhưng KHÔNG import ở đâu

### 5. Commented-out code blocks
- Blocks > 5 dòng code bị comment out

## Output Format
```
## Dead Code Report — [scope]

### ❌ Orphaned Files (có thể xóa)
- `path/to/file.ts` — Lý do: không ai import

### ⚠️ Unused Exports (cần kiểm tra)
- `path/to/file.ts` → `exportName` — không ai import

### 📝 Commented Code (cần cleanup)
- `path/to/file.ts:L42-L58` — 16 dòng code bị comment
```
