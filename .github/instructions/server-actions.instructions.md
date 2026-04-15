---
description: "Use when creating or editing server actions in app/actions/. Covers auth, return types, and revalidation."
applyTo: "app/actions/**/*.ts"
---
# Server Action Pattern

```typescript
'use server'

import { requireActionPermission } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { revalidateTag } from 'next/cache'

export async function createXxxAction(input: CreateInput): Promise<ActionResult<Xxx>> {
  const authResult = await requireActionPermission('edit_xxx')
  if (!authResult.success) return authResult as any

  try {
    const data = await prisma.xxx.create({ data: { ... } })
    revalidatePath('/xxx')
    revalidateTag('xxx')
    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Đã xảy ra lỗi' }
  }
}
```

## Rules
- `'use server'` directive DÒNG ĐẦU
- `requireActionPermission()` cho auth (KHÔNG `getSessionFromCookie` trong actions)
- Return `ActionResult<T>`: `{ success: boolean, data?: T, error?: string }`
- Error messages bằng tiếng Việt
- `revalidatePath()` + `revalidateTag()` sau mutation (vì SSR dùng unstable_cache)
- KHÔNG gọi action khác — mỗi action là atomic
