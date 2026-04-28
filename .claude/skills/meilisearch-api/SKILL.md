# Skill: Meilisearch API & Migration

## Mục đích

Tạo và migrate Meilisearch search APIs cho hệ thống HRM2, bao gồm:
- Tạo API search endpoint mới
- Thêm Meilisearch index config
- Tạo React Query hooks
- Migrate `useAllXxx` hooks sang Meilisearch

## Khi nào dùng

- User yêu cầu tạo API search mới (employees, suppliers, shipments, warranties)
- User muốn migrate `useAllProducts`, `useAllCustomers`, `useAllEmployees` sang Meilisearch
- User muốn thêm Meilisearch index cho entity mới

## QUY TRÌNH

### Phase 1: Tạo API Search

#### 1.1. Tạo route file

```
app/api/search/{entity}/route.ts
```

**Template:**

```typescript
import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliEntity } from '@/lib/meilisearch'
import { requireAuth, apiError } from '@/lib/api-utils'
import { NextResponse } from 'next/server'
import { logError } from '@/lib/logger'

/**
 * MEILISEARCH {Entity} SEARCH API
 * 
 * Fast fuzzy search with Prisma fallback when Meilisearch unavailable
 */

export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const isHealthy = await healthCheck()
    const { searchParams } = new URL(request.url)

    const query = searchParams.get('q')?.trim() || ''
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    
    // Build filters from params
    const filters = buildFilters(searchParams)
    const sort = searchParams.get('sort') || 'createdAt:desc'
    const startTime = Date.now()

    // Fallback to Prisma if Meilisearch unavailable
    if (!isHealthy) {
      if (!query) {
        return apiError('Search service unavailable', 503)
      }
      const fb = await prismaFallbackSearch({ query, limit, offset, filters })
      return NextResponse.json({
        data: fb.hits,
        meta: {
          total: fb.estimatedTotal,
          limit,
          offset,
          query,
          searchTimeMs: Date.now() - startTime,
          processingTimeMs: 0,
          fallback: 'prisma' as const,
        },
      })
    }

    // Meilisearch search
    const client = getMeiliClient()
    const index = client.index<MeiliEntity>(INDEXES.{ENTITY})

    const results = await index.search(query, {
      limit,
      offset,
      filter: filters.length > 0 ? filters.join(' AND ') : undefined,
      sort: [sort],
      attributesToRetrieve: ['id', 'name', /* other fields */],
      attributesToHighlight: ['name'],
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',
    })

    return NextResponse.json({
      data: results.hits.map(hit => mapHitToDto(hit)),
      meta: {
        total: results.estimatedTotalHits,
        limit,
        offset,
        query,
        searchTimeMs: Date.now() - startTime,
        processingTimeMs: results.processingTimeMs,
      },
    })
  } catch (error) {
    logError('Meilisearch search error', error)
    return apiError('Search failed', 500)
  }
}

function buildFilters(params: URLSearchParams): string[] {
  const filters: string[] = []
  // Add filters based on params
  return filters
}

function mapHitToDto(hit: MeiliEntity) {
  return {
    systemId: hit.id,
    name: hit.name,
    // ... other fields
  }
}
```

#### 1.2. Thêm Index Config

File: `lib/meilisearch.ts`

```typescript
// Thêm vào INDEXES
export const INDEXES = {
  // ... existing
  {ENTITY}: '{entity}',
} as const

// Thêm interface
export interface MeiliEntity {
  id: string
  name: string
  // ... other fields
  createdAt: number
}

// Thêm vào configureIndexes()
export async function configureIndexes() {
  // ... existing configs
  
  const entityIndex = client.index(INDEXES.{ENTITY})
  await entityIndex.updateSettings({
    searchableAttributes: ['name', /* other searchable */],
    filterableAttributes: [/* filterable fields */],
    sortableAttributes: ['name', 'createdAt'],
    typoTolerance: { enabled: true },
  })
}
```

### Phase 2: Tạo Prisma Fallback

File: `lib/search/{entity}-prisma-fallback.ts`

```typescript
import { prisma } from '@/lib/prisma'
import { buildSearchWhere } from './build-search-where'

export interface PrismaFallbackHit {
  systemId: string
  name: string
  // ... other fields
}

export async function prismaFallbackSearch({
  query,
  limit,
  offset,
  filters,
}: {
  query: string
  limit: number
  offset: number
  filters?: Record<string, string>
}): Promise<{ hits: PrismaFallbackHit[]; estimatedTotal: number }> {
  const where: Record<string, unknown> = { isDeleted: false }

  const searchWhere = buildSearchWhere(query, ['name', 'id'])
  if (searchWhere) Object.assign(where, searchWhere)

  // Apply filters
  if (filters) Object.assign(where, filters)

  const [data, total] = await Promise.all([
    prisma.{model}.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      select: {
        systemId: true,
        name: true,
        // ... other select fields
      },
    }),
    prisma.{model}.count({ where }),
  ])

  return {
    hits: data.map(item => ({ systemId: item.systemId, name: item.name })),
    estimatedTotal: total,
  }
}
```

### Phase 3: Tạo Hooks

File: `hooks/use-meilisearch.ts`

```typescript
// Thêm type
export interface EntitySearchResult {
  systemId: string
  name: string
  // ... other fields
}

// Thêm hook
export function useMeiliEntitySearch({
  query,
  limit = 20,
  offset = 0,
  debounceMs = 200,
  enabled = true,
  filters = {},
}: UseSearchOptions & { filters?: EntityFilters }) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  
  return useQuery({
    queryKey: ['meili-entity', debouncedQuery, limit, offset, filters],
    queryFn: async (): Promise<{ data: EntitySearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(limit),
        offset: String(offset),
      })
      
      if (filters?.field) params.set('field', filters.field)
      
      const response = await fetch(`/api/search/entity?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    enabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}

export function useInfiniteMeiliEntitySearch({
  query,
  debounceMs = 200,
  enabled = true,
  lazyLoad = false,
  filters = {},
}: Omit<UseSearchOptions, 'limit' | 'offset'> & { lazyLoad?: boolean; filters?: EntityFilters }) {
  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const isEnabled = enabled && (!lazyLoad || query.length > 0)
  
  return useInfiniteQuery({
    queryKey: ['meili-entity-infinite', debouncedQuery, filters],
    queryFn: async ({ pageParam = 0 }): Promise<{ data: EntitySearchResult[]; meta: SearchMeta }> => {
      const params = new URLSearchParams({
        q: debouncedQuery,
        limit: String(PAGE_SIZE),
        offset: String(pageParam),
      })
      
      const response = await fetch(`/api/search/entity?${params}`)
      if (!response.ok) throw new Error('Search failed')
      return response.json()
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0)
      if (totalLoaded >= lastPage.meta.total) return undefined
      return totalLoaded
    },
    enabled: isEnabled,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  })
}
```

### Phase 4: Migrate useAllXxx

#### 4.1. Với Product Search

```typescript
// THAY
import { useAllProducts } from '@/features/products/hooks/use-all-products'

// BẰNG
import { useInfiniteMeiliProductSearch } from '@/hooks/use-meilisearch'
// HOẶC
import { UnifiedProductSearch } from '@/components/shared/unified-product-search'

// Ví dụ dropdown
const { data: searchResult, fetchNextPage, hasNextPage } = useInfiniteMeiliProductSearch({
  query: searchTerm,
  debounceMs: 150,
  enabled: hasInteracted,
})
```

#### 4.2. Với Customer Search

```typescript
// THAY
import { useAllCustomers } from '@/features/customers/hooks/use-all-customers'

// BẰNG
import { useMeiliCustomerSearch } from '@/hooks/use-meilisearch'

const { data } = useMeiliCustomerSearch({
  query: searchTerm,
  limit: 20,
})
```

#### 4.3. Với Employee Search

```typescript
// THAY
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees'

// BẰNG
import { useMeiliEmployeeSearch } from '@/hooks/use-meilisearch'

const { data } = useMeiliEmployeeSearch({
  query: searchTerm,
})
```

## CHECKLIST

### API
- [ ] Route file tạo đúng path (`app/api/search/{entity}/route.ts`)
- [ ] Auth middleware (`requireAuth`)
- [ ] Params validation (limit capped)
- [ ] Health check trước khi search
- [ ] Prisma fallback khi Meilisearch down
- [ ] Response format với meta (total, searchTimeMs)
- [ ] Error handling với `logError`

### Index Config
- [ ] Thêm vào `INDEXES`
- [ ] Thêm interface `MeiliEntity`
- [ ] Cấu hình `searchableAttributes`
- [ ] Cấu hình `filterableAttributes`
- [ ] Cấu hình `sortableAttributes`

### Hooks
- [ ] Type `EntitySearchResult`
- [ ] `useMeiliEntitySearch`
- [ ] `useInfiniteMeiliEntitySearch`
- [ ] `useEntityAutocomplete` (optional)

### Migration
- [ ] Identify all files using `useAllXxx`
- [ ] Replace with Meilisearch hook
- [ ] Test with empty query
- [ ] Test with search query
- [ ] Test with filters
- [ ] Test infinite scroll if applicable

## VÍ DỤ THỰC TẾ

### Tạo Employees Search API

1. **API**: `app/api/search/employees/route.ts`
2. **Config**: Thêm vào `lib/meilisearch.ts`
3. **Fallback**: `lib/search/employees-prisma-fallback.ts`
4. **Hooks**: Thêm vào `hooks/use-meilisearch.ts`
5. **Migrate**: Update các files dùng `useAllEmployees`

### Migrate Product Dropdown

```tsx
// TRƯỚC
const { data: products } = useAllProducts()

// SAU
const {
  data: searchResult,
  isLoading,
  fetchNextPage,
  hasNextPage,
} = useInfiniteMeiliProductSearch({
  query: searchQuery,
  debounceMs: 150,
  enabled: hasInteracted,
})

const products = searchResult?.pages.flatMap(p => p.data) || []
```

## LƯU Ý

1. **Luôn có Prisma fallback** - Meilisearch có thể down
2. **Debounce queries** - Tránh spam API
3. **Lazy load** - Chỉ fetch khi user tương tác
4. **Limit capped** - Max 100 items/request
5. **Cache properly** - Dùng staleTime/gcTime phù hợp
