---
description: "Use when editing Settings module files. Covers React Query + API Routes pattern, NOT Server Actions + Zustand."
applyTo: "features/settings/**"
---
# Settings Module Pattern

Settings modules dùng **API Routes + React Query** (KHÔNG phải Server Actions + Zustand):

```
features/settings/[module]/
├── api/                    # fetch functions → /api/[module]/
├── components/             # FormDialog, ListContent
├── hooks/use-[module].ts   # React Query hooks + mutations
├── types.ts
├── validation.ts
└── [module]-settings-content.tsx
```

## Mutation Pattern
```typescript
const mutation = useMutation({
  mutationFn: (data) => updateXxx(data),   // → API Route (POST/PUT)
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: xxxKeys.all })
    toast.success('Thành công')
  },
})
```

## Activity Log
- Action format tiếng Việt: `Cập nhật [entity]: [tên]: [fields]`
- Changes key tiếng Việt: `'Tên'`, `'Mô tả'` (KHÔNG `'name'`, `'description'`)
- Boolean: `'Có'/'Không'` hoặc `'Hoạt động'/'Ngừng'` (KHÔNG `true/false`)
- Non-blocking: `createActivityLog({...}).catch(...)` — KHÔNG `await`
- `createdBy: session.user?.id`

## Dead Code Warning
- `app/actions/settings/[module].ts` — 33 files dead code, KHÔNG import
- Chỉ `app/actions/settings/module-settings.ts` còn active
