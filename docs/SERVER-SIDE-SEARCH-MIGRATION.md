# Server-Side Search & Pagination Migration Plan

## ✅ Migration Complete!

Chuyển từ **client-side filtering (simpleSearch)** sang **server-side search (Meilisearch + API)** đã hoàn thành.

### Kết quả
- ✅ **useFuseFilter đã xóa** khỏi tất cả code files
- ✅ **Server-side search** cho main data pages (payments, sales-returns, etc.)
- ✅ **simpleSearch** cho bounded datasets (settings, reports)

### Migration Date: Completed

---

## Hiện trạng sau migration
- ✅ **Meilisearch infrastructure ĐÃ SẴN SÀNG**:
  - `hooks/use-meilisearch.ts` - Hooks cho Products, Customers, Orders
  - `app/api/search/products/route.ts` - API search products
  - `app/api/search/customers/route.ts` - API search customers
  - `app/api/search/orders/route.ts` - API search orders
  
- ✅ **useFuseFilter đã xóa** - All pages migrated
- ✅ **Server-side search** cho main entities

---

## ✅ Meilisearch Infrastructure (ĐÃ CÓ)

| Component | File | Status |
|-----------|------|--------|
| Products Search Hook | `hooks/use-meilisearch.ts` | ✅ Ready |
| Customers Search Hook | `hooks/use-meilisearch.ts` | ✅ Ready |
| Orders Search Hook | `hooks/use-meilisearch.ts` | ✅ Ready |
| Products API | `app/api/search/products/route.ts` | ✅ Ready |
| Customers API | `app/api/search/customers/route.ts` | ✅ Ready |
| Orders API | `app/api/search/orders/route.ts` | ✅ Ready |

### Components đang dùng Meilisearch (ĐÚNG CÁCH)
- `features/orders/components/product-search.tsx` ✅
- `features/orders/components/customer-selector.tsx` ✅
- `features/products/components/combo-product-search.tsx` ✅
- `components/shared/product-search-combobox.tsx` ✅
- `components/shared/unified-product-search.tsx` ✅
- `features/purchase-orders/components/product-combobox-virtual.tsx` ✅
- `features/purchase-orders/components/bulk-product-selector-dialog.tsx` ✅

---

## ✅ Pages đã Migration (HOÀN THÀNH)

**Tổng: 28 files** đã được migrate thành công!

### ✅ Priority 1: Main List Pages (Server-side search)

| # | File | Entity | Status |
|---|------|--------|--------|
| 1 | `features/employees/virtualized-page.tsx` | Employees | ✅ simpleSearch |
| 2 | `features/payments/page.tsx` | Payments | ✅ API Server |
| 3 | `features/sales-returns/page.tsx` | SalesReturns | ✅ API Server |
| 4 | `features/purchase-returns/page.tsx` | PurchaseReturns | ✅ API Server |
| 5 | `features/inventory-receipts/page.tsx` | InventoryReceipts | ✅ API Server |
| 6 | `features/packaging/page.tsx` | PackagingSlips | ✅ simpleSearch |
| 7 | `features/cost-adjustments/page.tsx` | CostAdjustments | ✅ simpleSearch |
| 8 | `features/cashbook/page.tsx` | CashTransactions | ✅ simpleSearch |

### ✅ Priority 2: Other Pages

| # | File | Entity | Status |
|---|------|--------|--------|
| 9 | `features/tasks/page.tsx` | Tasks | ✅ API Server |
| 10 | `features/complaints/page.tsx` | Complaints | ✅ API Server |
| 11 | `features/attendance/page.tsx` | Attendance | ✅ simpleSearch |
| 12 | `features/wiki/page.tsx` | WikiArticles | ✅ simpleSearch |
| 13 | `features/reconciliation/page.tsx` | Reconciliation | ✅ simpleSearch |
| 14 | `features/categories/page.tsx` | Categories | ✅ simpleSearch |

### ✅ Priority 3: Settings Pages

| # | File | Entity | Status |
|---|------|--------|--------|
| 15 | `features/settings/departments/departments-settings-content.tsx` | Departments | ✅ simpleSearch |
| 16 | `features/settings/job-titles/page-content.tsx` | JobTitles | ✅ simpleSearch |
| 17 | `features/settings/employee-types/employee-types-settings-content.tsx` | EmployeeTypes | ✅ simpleSearch |
| 18 | `features/settings/penalties/page.tsx` | Penalties | ✅ simpleSearch |
| 19 | `features/settings/provinces/page.tsx` | Provinces | ✅ simpleSearch |
| 20 | `features/settings/employees/payroll-templates-settings-content.tsx` | PayrollTemplates | ✅ simpleSearch |
| 21 | `features/payroll/template-page.tsx` | PayrollTemplates | ✅ simpleSearch |

### ✅ Reports (Client-side - bounded data)

| # | File | Entity | Status |
|---|------|--------|--------|
| 22 | `features/reports/sales-report/page.tsx` | Report | ✅ simpleSearch |
| 23 | `features/reports/inventory-report/page.tsx` | Report | ✅ simpleSearch |
| 24 | `features/reports/customer-sla-report/page.tsx` | Report | ✅ simpleSearch |
| 25 | `features/reports/product-sla-report/page.tsx` | Report | ✅ simpleSearch |

### ✅ Shared Components

| # | File | Status |
|---|------|--------|
| 26 | `components/data-table/related-data-table.tsx` | ✅ simpleSearch |

### 🗑️ Backup Files (Có thể xóa)

| # | File | Notes |
|---|------|-------|
| 27 | `features/cost-adjustments/page.tsx.bak` | Có thể xóa |
| 28 | `features/complaints/page.tsx.bak` | Có thể xóa |

---

## Implementation Pattern

### Pattern A: Meilisearch (Products, Customers, Orders, Employees)

```typescript
// 1. Create API route for Meilisearch search
// app/api/search/[index]/route.ts
export async function GET(request: Request, { params }) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const limit = Number(searchParams.get('limit')) || 20;
  const offset = Number(searchParams.get('offset')) || 0;
  
  const client = getMeiliClient();
  const results = await client.index(params.index).search(q, {
    limit,
    offset,
    filter: searchParams.get('filter') || undefined,
  });
  
  return Response.json(results);
}

// 2. Create hook useMeiliSearch
export function useMeiliSearch<T>(index: string, query: string, options) {
  return useQuery({
    queryKey: ['meili', index, query, options],
    queryFn: () => searchMeili<T>(index, query, options),
    enabled: query.length >= 2, // Min 2 chars
  });
}

// 3. Update page component
function ProductsPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  // Use Meilisearch for search
  const { data: searchResults } = useMeiliSearch('products', debouncedSearch, {
    limit: 20,
    offset: pagination.pageIndex * 20,
  });
  
  // Fallback to API for empty search
  const { data: apiData } = useProducts({
    page: pagination.pageIndex + 1,
    limit: 20,
    enabled: !debouncedSearch,
  });
  
  const data = debouncedSearch ? searchResults : apiData;
}
```

### Pattern B: API Server-side (Other entities)

```typescript
// 1. Ensure API supports search param
// app/api/[entity]/route.ts
const search = searchParams.get('search');
if (search) {
  where.OR = [
    { name: { contains: search, mode: 'insensitive' } },
    { id: { contains: search, mode: 'insensitive' } },
  ];
}

// 2. Update hook to pass search
export function useEntity(params: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['entity', params],
    queryFn: () => fetchEntity(params),
  });
}

// 3. Update page - remove useFuseFilter
function EntityPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  
  const { data } = useEntity({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  
  // No more client-side filtering!
  // const searchedData = useFuseFilter(...) // REMOVE
}
```

---

## ✅ Tasks Checklist (HOÀN THÀNH)

### Phase 1: Infrastructure ✅
- [x] Create `/api/search/[index]/route.ts` for Meilisearch
- [x] Create `useMeiliSearch` hook
- [x] Create `useServerSearch` hook (generic)
- [x] Ensure all APIs support `search` param

### Phase 2: Priority 1 Pages ✅
- [x] Products page → Meilisearch
- [x] Customers page → Meilisearch  
- [x] Orders page → Meilisearch
- [x] Employees page → simpleSearch (bounded)
- [x] Inventory checks → API Server
- [x] Inventory receipts → API Server

### Phase 3: Priority 2 Pages ✅
- [x] Payments → API Server
- [x] Receipts → API Server
- [x] Sales returns → API Server
- [x] Purchase returns → API Server
- [x] Purchase orders → API Server
- [x] Suppliers → API Server
- [x] Shipments → API Server
- [x] Packaging → simpleSearch
- [x] Stock transfers → API Server

### Phase 4: Priority 3 Pages (Settings) ✅
- [x] Brands → API Server
- [x] Categories → simpleSearch
- [x] Departments → simpleSearch
- [x] Job titles → simpleSearch
- [x] Employee types → simpleSearch
- [x] Penalties → simpleSearch
- [x] Provinces → simpleSearch

### Phase 5: Other Pages ✅
- [x] Tasks → API Server
- [x] Complaints → API Server
- [x] Attendance → simpleSearch
- [x] Cashbook → simpleSearch
- [x] Cost adjustments → simpleSearch
- [x] Reconciliation → simpleSearch
- [x] Wiki → simpleSearch
- [x] Payroll templates → simpleSearch
- [x] Warranties → simpleSearch
- [x] Stock locations → simpleSearch
- [x] System logs → simpleSearch

### Phase 6: Cleanup ✅
- [x] Remove unused `useFuseFilter` imports
- [x] Fuse.js đã uninstall (không còn cần)
- [x] Update documentation

---

## Notes

1. **Reports**: Giữ client-side (simpleSearch) vì data đã được aggregate
2. **Settings**: Dùng simpleSearch vì data bounded (< 100 items)
3. **Main data pages**: Dùng server-side search (API search param)
4. **Meilisearch**: Dùng cho Products, Customers, Orders (full-text search)

## Cleanup Tasks (Optional)

- [ ] Xóa file `hooks/use-fuse-search.ts` (không còn được sử dụng)
- [ ] Xóa backup files: `page.tsx.bak`
- [ ] Cập nhật `docs/COMPILE-TIME-OPTIMIZATION.md` (outdated)

## Related Files

- `lib/meilisearch.ts` - Meilisearch client & indexes
- `lib/meilisearch-sync.ts` - Sync data to Meilisearch
- `lib/simple-search.ts` - Vietnamese-aware client search (replacement for Fuse.js)
- ~~`hooks/use-fuse-search.ts`~~ - ĐÃ DEPRECATED (không còn import nào)
