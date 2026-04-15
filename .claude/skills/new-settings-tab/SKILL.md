# Skill: Tạo Settings Tab mới

## Khi nào dùng
User yêu cầu thêm tab cài đặt mới (VD: thêm danh mục nhà nhập khẩu, loại sản phẩm, kho...).

## Pattern: SettingsData + Metadata

Hầu hết settings dùng model `SettingsData` với `type` field để phân loại + `metadata` JSON cho extra fields.

## Các file cần tạo/update

### 1. Tab Component
`features/settings/[section]/tabs/[name]-tab.tsx`

```typescript
'use client'

import { useSettingsData } from '@/hooks/use-settings'
import { useSettingsDataMutations } from '@/hooks/use-settings-mutations'

export function NameTab() {
  // Fetch data by type
  const { data, isLoading } = useSettingsData('TYPE_NAME')
  const { createMutation, updateMutation, deleteMutation } = useSettingsDataMutations('TYPE_NAME')

  // CRUD handlers
  const handleSave = (values) => {
    const { name, code, ...extraFields } = values
    createMutation.mutate(
      { name, code, metadata: extraFields },
      { onSuccess: () => toast.success('Đã lưu') }
    )
  }

  // ...
}
```

### 2. API Route (nếu cần custom logic)
`app/api/settings/[section]/[name]/route.ts`

```typescript
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = apiHandler(async (req) => {
  const items = await prisma.settingsData.findMany({
    where: { type: 'TYPE_NAME', isDeleted: false },
    orderBy: { sortOrder: 'asc' },
  })
  // Merge metadata into response
  const result = items.map(item => ({
    ...item,
    ...(item.metadata as object || {}),
  }))
  return apiSuccess(result)
})
```

### 3. Đăng ký tab vào settings page
`features/settings/[section]/[section]-settings-page.tsx`
- Import tab component
- Thêm vào `<Tabs>` component

### 4. Extra Fields Pattern (metadata)
```typescript
// POST/PUT: Extract known fields, rest → metadata
const { name, code, isDefault, ...extraFields } = body
const data = {
  name,
  code,
  type: 'TYPE_NAME',
  isDefault: isDefault || false,
  metadata: Object.keys(extraFields).length > 0 ? extraFields : undefined,
}

// GET: Merge metadata back
const merged = {
  ...item,
  ...(item.metadata as object || {}),
}
```

### 5. Default Toggle Pattern
```typescript
// Khi set item làm default → unset tất cả item khác cùng type
const handleToggleDefault = async (item) => {
  // 1. Unset all others
  await Promise.all(
    items
      .filter(i => i.systemId !== item.systemId && i.isDefault)
      .map(i => updateMutation.mutateAsync({ systemId: i.systemId, isDefault: false }))
  )
  // 2. Set this one
  await updateMutation.mutateAsync({ systemId: item.systemId, isDefault: !item.isDefault })
}
```

## Checklist
- [ ] Tab component tạo đúng path
- [ ] Dùng SettingsData model + type field
- [ ] Extra fields → metadata JSON
- [ ] GET response merge metadata
- [ ] Default toggle: unset others first
- [ ] Toast trong onSuccess callback (KHÔNG trước mutation)
- [ ] Đăng ký tab vào settings page
- [ ] Permission check nếu cần
