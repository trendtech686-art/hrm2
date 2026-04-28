# HRM2 Next.js Audit Report

**Generated**: Wednesday, April 29, 2026  
**Auditor**: Claude Code (Next.js Audit Skill)  
**Scope**: Full codebase audit against Next.js Best Practices

---

## Executive Summary

| Category | Errors | Warnings | Info | Status |
|----------|--------|----------|------|--------|
| Server/Client Components | 0 | 1 | 2 | ✅ Good |
| Performance | 0 | 6 | 6 | ✅ Good |
| Hydration | 11 | 4 | 3 | ⚠️ Needs Fix |
| React Query | 0 | 1 | 5 | ✅ Good |
| Bundle Size | 0 | 0 | 0 | ✅ Excellent |
| API Routes | 0 | 50+ | 10+ | ⚠️ Inconsistent |
| Image/Font Optimization | 8 | 4 | 5 | ⚠️ Needs Fix |
| **TOTAL** | **19** | **66** | **31** | **📊 116 issues** |

**Overall Grade: B+** - Codebase is well-structured but has some consistency issues that need attention.

---

## 1. Server/Client Components ✅

### Status: GOOD

**Finding**: 1 deprecated hook needs cleanup

| Severity | File | Line | Issue |
|----------|------|------|-------|
| Warning | `hooks/use-init-integration-settings.ts` | 1 | Deprecated hook with 'use client' that should be removed |

**Good Patterns Observed**:
- Contexts correctly use 'use client' directive
- Hooks properly declare client-side dependencies
- No server components accidentally using client hooks

---

## 2. Performance Anti-patterns ⚠️

### Status: NEEDS ATTENTION

**Finding**: 6 warnings about timer patterns that could cause unnecessary re-renders

| Severity | File | Line | Issue |
|----------|------|------|-------|
| Warning | `components/TimeTracker.tsx` | 43 | setInterval recreates on each isRunning change |
| Warning | `components/SlaTimer.tsx` | 71 | setInterval recreates on prop changes |
| Warning | `components/SlaTimer.tsx` | 198 | useSlaStatus recreates interval on every prop change |
| Warning | `features/auth/forgot-password-page.tsx` | 28 | setInterval recreates on countdown change |
| Warning | `components/data-table/sticky-scrollbar.tsx` | 76 | Multiple setTimeout without refs to track them |
| Warning | `features/warranty/hooks/use-warranty-time-tracking.ts` | 50 | Force re-rendering every 60s is inefficient |

**Good Patterns**:
- Proper cleanup functions in useEffect
- React.memo used for DataTablePagination
- PWA components have proper cleanup patterns

---

## 3. Hydration Issues 🔴

### Status: NEEDS FIX (11 Errors)

**Finding**: `new Date()` called directly in render/JSX causes server/client time mismatch

#### Critical Issues (Errors)

| Severity | File | Line | Issue |
|----------|------|------|-------|
| Error | `components/ActivityTimeline.tsx` | 87 | `new Date()` in formatTimestamp called during render |
| Error | `features/dashboard/page-lite.tsx` | 144 | `new Date()` in getPresets() called during render |
| Error | `features/dashboard/page-lite.tsx` | 157 | `new Date()` in getDefaultChartRange() called during render |
| Error | `features/dashboard/page-lite.tsx` | 167 | `new Date()` in getDefaultTopProductRange() called during render |
| Error | `features/reports/overview-page.tsx` | 152 | `new Date()` directly in component body |
| Error | `features/reports/overview-page.tsx` | 207 | `new Date()` in format() call causes locale mismatch |
| Error | `features/tasks/components/task-card.tsx` | 47 | `new Date()` inline in JSX computation |
| Error | `features/tasks/components/user-tasks-page.tsx` | 483 | `new Date()` in categorizedTasks useMemo |
| Error | `features/tasks/components/user-tasks-page.tsx` | 536 | `new Date().toISOString()` in render callback |
| Error | `features/tasks/components/user-tasks-page.tsx` | 582 | `new Date().toISOString().split('T')[0]` in render |
| Error | `features/settings/printer/workflow-templates-page.tsx` | 108 | `new Date()` directly in render body |
| Error | `features/settings/printer/workflow-templates-page.tsx` | 478 | `new Date()` directly in render body |

**Fix Pattern**: Use useState + useEffect for client-only initialization:

```tsx
// ❌ BAD
const now = new Date();

// ✅ GOOD
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
const now = mounted ? new Date() : null;
```

---

## 4. React Query Patterns ✅

### Status: GOOD

**Finding**: Good adherence to patterns, minor inconsistencies

| Severity | File | Line | Issue |
|----------|------|------|-------|
| Warning | `lib/query-client.ts` | 55 | `refetchOnMount: true` should be explicitly configured per hook |
| Info | Multiple hooks | - | Some hooks missing `STALE_TIME` enum usage |
| Info | `features/complaints/hooks/use-compensation-handlers.ts` | 110 | Direct `refetchQueries` call instead of `invalidateRelated` |

**Good Patterns**:
- `invalidateRelated` used consistently for cross-module invalidation
- Query key factories properly defined
- `staleTime` configured appropriately per use case
- `featureKeys` factory pattern in `.github/instructions/react-query-hooks.instructions.md`

---

## 5. Bundle Size ✅

### Status: EXCELLENT

**Finding**: No bundle size issues found!

**Good Practices**:
- No full lodash imports (`import _ from 'lodash'`)
- No moment.js usage (uses date-fns throughout)
- All imports are tree-shakeable named imports
- Recharts used with named imports
- Lucide icons use specific named imports

---

## 6. API Routes ⚠️

### Status: INCONSISTENT

**Finding**: 50+ instances of `NextResponse.json()` instead of `apiSuccess`/`apiError` helpers

#### Routes Missing Consistent Response Helpers

| Category | Files Affected |
|----------|---------------|
| Branding | `app/api/branding/[filename]/route.ts` |
| PKGX Settings | `app/api/pkgx/settings/route.ts` |
| Sales Channels | `app/api/settings/sales-channels/[systemid]/route.ts` |
| Public APIs | `app/api/public/complaint-tracking/route.ts` |
| Webhooks | `app/api/shipping/ghtk/webhook/route.ts` |
| Search | `app/api/search/health/route.ts` |
| TrendsTech | `app/api/trendtech/settings/route.ts` |
| Complaints | `app/api/complaints/statistics/route.ts` |
| Import Jobs | `app/api/import-jobs/parse-excel/route.ts` |
| PWA | `app/api/pwa/preferences/route.ts` |

**Note**: Public routes and webhooks intentionally skip `apiHandler` for performance - this is acceptable.

---

## 7. Image & Font Optimization ⚠️

### Status: NEEDS FIX

#### Critical Issues (Errors) - Image as Icon

**Finding**: 8 instances of `<Image>` component used as icon instead of Lucide icons

| File | Line | Current | Should Be |
|------|------|---------|-----------|
| `components/shared/file-upload.tsx` | 125 | `<Image className="h-4 w-4" />` | `<ImageIcon className="h-4 w-4" />` |
| `components/shared/file-upload.tsx` | 159 | `<Image className="h-10 w-10" />` | `<ImageIcon className="h-10 w-10" />` |
| `features/settings/other/general-tab.tsx` | 216 | `<Image className="h-8 w-8" />` | `<ImageIcon className="h-8 w-8" />` |
| `features/products/pkgx-product-actions-cell.tsx` | 222 | `<Image className="h-4 w-4" />` | `<ImageIcon className="h-4 w-4" />` |
| `features/products/detail-page.tsx` | 581 | `<Image className="h-4 w-4" />` | `<ImageIcon className="h-4 w-4" />` |
| `features/products/detail-page.tsx` | 699 | `<Image className="h-4 w-4" />` | `<ImageIcon className="h-4 w-4" />` |
| `features/tasks/components/TaskCheckboxItem.tsx` | 123 | `<Image className="h-4 w-4" />` | `<ImageIcon className="h-4 w-4" />` |
| `features/tasks/components/EvidenceThumbnailGrid.tsx` | 60 | `<Image className="h-4 w-4" />` | `<ImageIcon className="h-4 w-4" />` |

#### Good Practices

- **Fonts**: `app/layout.tsx` uses `next/font/google` correctly with Inter, Source_Serif_4, Geist_Mono
- **Remote Patterns**: `phukiengiaxuong.com.vn` and `img.vietqr.io` configured in `next.config.ts`
- **Sizes Attribute**: Most `next/image` usages have proper `sizes` attribute

---

## Recommendations by Priority

### 🔴 HIGH PRIORITY (Fix Now)

1. **Hydration Fixes**: Fix all 11 `new Date()` in render issues
   - Priority files: `task-card.tsx`, `user-tasks-page.tsx`, `workflow-templates-page.tsx`

2. **Image as Icon**: Replace 8 `<Image>` usages with Lucide icons

### 🟡 MEDIUM PRIORITY (Fix Soon)

3. **API Routes**: Standardize response helpers across all routes
   - Use `apiSuccess()`, `apiError()`, `apiPaginated()` consistently

4. **Performance**: Optimize timer patterns in `TimeTracker.tsx`, `SlaTimer.tsx`

### 🟢 LOW PRIORITY (Nice to Have)

5. **React Query**: Standardize `staleTime` enum usage
6. **Image Optimization**: Add external URLs to `remotePatterns`

---

## Files Already Following Best Practices

- `app/layout.tsx` - Proper next/font configuration
- `lib/api-handler.ts` - Comprehensive API wrapper
- `lib/api-utils.ts` - Full response helper utilities
- `lib/query-client.ts` - Proper React Query configuration
- `contexts/` - All contexts correctly use 'use client'
- `components/data-table/` - Proper memoization patterns

---

*Report generated by Claude Code using Next.js Audit Skill*
