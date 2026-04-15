---
description: "Use when creating or editing React Query hooks in features/*/hooks/. Covers query keys, mutations with server actions, and cache invalidation."
applyTo: "features/**/hooks/*.ts"
---
# React Query Hook Pattern

## Query Keys
```typescript
export const featureKeys = {
  all: ['feature'] as const,
  lists: () => [...featureKeys.all, 'list'] as const,
  list: (params: object) => [...featureKeys.lists(), params] as const,
  details: () => [...featureKeys.all, 'detail'] as const,
  detail: (id: string) => [...featureKeys.details(), id] as const,
}
```

## Query Hook
```typescript
export function useFeature(params: Params, initialData?: Data) {
  return useQuery({
    queryKey: featureKeys.list(params),
    queryFn: () => fetchFeature(params),
    initialData,
  })
}
```

## Mutation Hook (Server Actions)
```typescript
import { createXxxAction, updateXxxAction } from '@/app/actions/xxx'
import { invalidateRelated } from '@/lib/query-invalidation-map'

export function useXxxMutations() {
  const queryClient = useQueryClient()

  const create = useMutation({
    mutationFn: async (data: CreateInput) => {
      const result = await createXxxAction(data)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      invalidateRelated(queryClient, 'xxx')
    },
  })

  return { create }
}
```

## Cache Invalidation
- **`invalidateRelated(queryClient, 'module-name')`** — invalidates own `['module-name']` + all cross-module deps defined in `lib/query-invalidation-map.ts`
- Cross-module deps are centralized in `INVALIDATION_MAP` — KHÔNG hardcode `['customers']`, `['products']` etc. inline
- `['activity-logs']` is handled globally by `MutationCache.onSuccess` — KHÔNG thêm vào map hoặc inline
- For critical forced refetch (e.g. costPrice update), add `queryClient.refetchQueries()` AFTER `invalidateRelated`
- Module NOT in map? `invalidateRelated` still invalidates `['module-name']` (self only) — safe to use

## Rules
- Toast trong `onSuccess` callback (KHÔNG toast trước mutation)
- KHÔNG import hooks/api từ feature khác — cross-feature qua `invalidateRelated`
- `initialData` nhận từ server component qua props
- KHÔNG dùng `refetchOnMount: false` — `staleTime` đã kiểm soát freshness
