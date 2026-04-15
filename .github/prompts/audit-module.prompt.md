---
description: "Audit a module against V4 quality criteria. Provide module name as argument."
agent: "agent"
argument-hint: "Tên module cần audit (e.g., orders, employees, settings/brands)"
---
Audit module `$input` theo tiêu chí trong `docs/MODULE-QUALITY-CRITERIA-V4.md`.

## Các bước:

1. **Đọc tiêu chí** V4: `docs/MODULE-QUALITY-CRITERIA-V4.md`

2. **Xác định loại module** (§1):
   - Feature module → audit theo §2 (30 điểm, 6 nhóm × 5 mục)
   - Settings module → audit theo §3 (25 điểm, 5 nhóm × 5 mục)

3. **Tìm tất cả files** của module:
   - `features/[module]/` — hooks, api, components, types, validation, page.tsx, columns.tsx
   - `app/api/[module]/` — API routes
   - `app/actions/[module].ts` — Server actions (nếu có)
   - `app/(authenticated)/[module]/page.tsx` — Server component wrapper
   - `lib/data/[module].ts` — Server data layer (nếu có)

4. **Kiểm tra từng mục** trong checklist V4 (§2 hoặc §3)

5. **Cho điểm** theo thang §4

6. **Đề xuất fix** cụ thể cho từng điểm chưa đạt, phân loại 🔴/🟡/🟢

Output bằng tiếng Việt.
