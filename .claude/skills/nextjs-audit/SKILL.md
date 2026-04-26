# Skill: Rà soát Next.js Performance & Best Practices

## Mục đích
Kiểm tra code Next.js để tìm các vấn đề:
- Không chuẩn Next.js (Server/Client components)
- Performance issues (lag, giật)
- Hydration issues
- Bundle size problems

## Tiêu chí kiểm tra

### 1. Server/Client Components
```
Dấu hiệu SAI:
- 'use client' ở file không cần client-side logic
- Server component gọi useState/useEffect trực tiếp
- Client component fetch data trong useEffect mà không dùng React Query
- Component có 'use client' nhưng không dùng hooks

Dấu hiệu ĐÚNG:
- Data fetching trong Server Components (async/await)
- Event handlers, useState, useEffect trong 'use client'
- Form actions dùng server actions
```

### 2. Performance Anti-patterns
```
❌ SAI:
- useEffect với dependency array rỗng [] mà không có cleanup
- setTimeout/setInterval không cleanup trong useEffect
- Fetching data trong useEffect mà không có loading/error states
- Render prop trong JSX map() mà không memoize
- Inline arrow functions trong JSX render
- Context provider wrap toàn bộ app mà không lazy loading

✅ ĐÚNG:
- useCallback/useMemo khi cần
- React.memo cho pure components
- useMemo cho expensive computations
- Dynamic import cho heavy components
```

### 3. Hydration Issues
```
❌ SAI:
- Date/time rendering không đồng bộ
- Math.random() trong render
- localStorage/accessing browser APIs trong render

✅ ĐÚNG:
- Dùng suppressHydrationWarning khi cần
- Kiểm tra typeof window !== 'undefined'
- Dùng useState với lazy initialization
```

### 4. React Query Patterns
```
❌ SAI:
- useQuery với refetchOnMount: true (sai convention)
- Hardcoded invalidateQueries thay vì invalidateRelated
- Không dùng staleTime
- Fetching data trong useEffect thay vì useQuery

✅ ĐÚNG:
- Dùng featureKeys factory
- Dùng invalidateRelated cho cross-module invalidation
- staleTime phù hợp với use case
```

### 5. Bundle Size
```
❌ SAI:
- Import entire library thay vì tree-shakeable
- Heavy libraries (lodash, moment) thay vì native/lightweight
- Dùng dynamic imports nhưng preload sai cách

✅ ĐÚNG:
- import { debounce } from 'lodash'
- Dùng date-fns thay vì moment
- next/dynamic với loading component
```

### 6. API Routes
```
❌ SAI:
- Không dùng apiHandler wrapper
- Missing error handling
- Sync operations trong route handler

✅ ĐÚNG:
- Dùng apiHandler từ @/lib/api-handler
- Async operations
- Proper response format (apiSuccess/apiError/apiPaginated)
```

### 7. Image & Font Optimization
```
❌ SAI:
- <img> tag thuần
- Google Fonts import không qua next/font

✅ ĐÚNG:
- next/image với proper sizing
- next/font với preload
```

## Checklist Output Format

```typescript
{
  file: string,
  line?: number,
  issue: string,
  severity: 'error' | 'warning' | 'info',
  suggestion: string,
  category: 'server-client' | 'performance' | 'hydration' | 'react-query' | 'bundle' | 'api-route' | 'image-optimization'
}
```
