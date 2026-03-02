# 🚀 Products Module - Performance Audit & Optimization Guide

## Mục tiêu
- **Mượt mà**: UI phản hồi tức thì, không giật lag
- **Load nhanh**: Thời gian tải < 1s cho các thao tác thông thường
- **Best Practices**: Áp dụng chuẩn Next.js 14+ và React 18+

---

## 📋 Tiêu chí chuẩn Next.js & Hiệu năng

### 1. Data Fetching
| Tiêu chí | Mô tả | Trạng thái |
|----------|-------|------------|
| ✅ React Query | Sử dụng TanStack Query cho data fetching | ⬜ Kiểm tra |
| ✅ setQueryData | Cập nhật cache trực tiếp sau mutation (không invalidate) | ⬜ Kiểm tra |
| ✅ Optimistic Updates | Cập nhật UI trước khi API xong | ⬜ Kiểm tra |
| ✅ Stale Time | Cấu hình staleTime hợp lý (1-5 phút) | ⬜ Kiểm tra |
| ✅ Prefetch | Prefetch data khi hover/focus | ⬜ Kiểm tra |
| ✅ Parallel Queries | Fetch nhiều data song song | ⬜ Kiểm tra |

### 2. Component Optimization
| Tiêu chí | Mô tả | Trạng thái |
|----------|-------|------------|
| ✅ React.memo | Memo hóa components không cần re-render | ⬜ Kiểm tra |
| ✅ useMemo/useCallback | Memo hóa giá trị/hàm tốn kém | ⬜ Kiểm tra |
| ✅ Không hook trong cell | Cell components nhận props, không tạo hook | ⬜ Kiểm tra |
| ✅ Lazy loading | Lazy load components lớn (Dialog, Modal) | ⬜ Kiểm tra |
| ✅ Code splitting | Dynamic import cho routes | ⬜ Kiểm tra |

### 3. State Management
| Tiêu chí | Mô tả | Trạng thái |
|----------|-------|------------|
| ✅ Colocate state | State gần nơi sử dụng nhất | ⬜ Kiểm tra |
| ✅ Avoid prop drilling | Dùng Context/Zustand cho deep state | ⬜ Kiểm tra |
| ✅ Normalize data | Không duplicate data trong cache | ⬜ Kiểm tra |
| ✅ Minimal re-renders | Tránh re-render cascading | ⬜ Kiểm tra |

### 4. Table/List Performance
| Tiêu chí | Mô tả | Trạng thái |
|----------|-------|------------|
| ✅ Virtualization | Virtual scroll cho list lớn (>100 items) | ⬜ Kiểm tra |
| ✅ Column memoization | Memo columns definition | ⬜ Kiểm tra |
| ✅ Row key stability | Key ổn định (systemId, không dùng index) | ⬜ Kiểm tra |
| ✅ Pagination | Server-side pagination | ⬜ Kiểm tra |

### 5. Form Performance
| Tiêu chí | Mô tả | Trạng thái |
|----------|-------|------------|
| ✅ React Hook Form | Sử dụng RHF cho form management | ⬜ Kiểm tra |
| ✅ Uncontrolled inputs | Ưu tiên uncontrolled khi có thể | ⬜ Kiểm tra |
| ✅ Field-level validation | Validate từng field, không toàn form | ⬜ Kiểm tra |
| ✅ Debounce | Debounce search/filter inputs | ⬜ Kiểm tra |

### 6. Image Optimization
| Tiêu chí | Mô tả | Trạng thái |
|----------|-------|------------|
| ✅ next/image | Sử dụng Next.js Image component | ⬜ Kiểm tra |
| ✅ Lazy loading | Lazy load images ngoài viewport | ⬜ Kiểm tra |
| ✅ Placeholder | Blur placeholder khi loading | ⬜ Kiểm tra |
| ✅ Proper sizing | width/height cố định tránh layout shift | ⬜ Kiểm tra |

---

## 📂 Cấu trúc Products Module

```
features/products/
├── api/                          # API functions
├── hooks/                        # React hooks
│   ├── use-products.ts           # Basic CRUD hooks
│   ├── use-products-query.ts     # Table query hook
│   ├── use-pkgx-sync.ts          # PKGX sync handlers
│   ├── use-product-mutations.ts  # Mutation hooks
│   └── ...
├── components/                   # Shared components
├── product-form/                 # Form tabs
├── page.tsx                      # List page
├── detail-page.tsx               # Detail page
├── form-page.tsx                 # Create/Edit page
├── trash-page.tsx                # Trash page
├── columns.tsx                   # Table columns
└── types.ts                      # TypeScript types

app/(authenticated)/products/
├── page.tsx                      # → List page route
├── new/page.tsx                  # → Create page route
├── trash/page.tsx                # → Trash page route
└── [systemId]/
    ├── page.tsx                  # → Detail page route
    └── edit/page.tsx             # → Edit page route
```

---

## 📝 Danh sách chức năng cần rà soát

### A. TRANG DANH SÁCH (page.tsx)
| # | Chức năng | Mô tả | Ưu tiên | Trạng thái |
|---|-----------|-------|---------|------------|
| A1 | Load danh sách | Fetch products với pagination | 🔴 Cao | ✅ DONE |
| A2 | Tìm kiếm | Search theo tên, SKU, barcode | 🔴 Cao | ✅ DONE |
| A3 | Lọc | Filter theo status, category, brand... | 🟡 TB | ✅ DONE |
| A4 | Sắp xếp | Sort theo các cột | 🟡 TB | ✅ DONE |
| A5 | Phân trang | Pagination server-side | 🔴 Cao | ✅ DONE |
| A6 | Chọn nhiều | Multi-select rows | 🟢 Thấp | ✅ DONE |
| A7 | Bulk Actions | Xóa/Cập nhật nhiều | 🟡 TB | ✅ DONE |
| A8 | Inline Edit | Chỉnh sửa trực tiếp trong bảng | 🟡 TB | ✅ DONE |
| A9 | Column Toggle | Ẩn/Hiện cột | 🟢 Thấp | ✅ DONE |
| A10 | Export Excel | Xuất danh sách | 🟢 Thấp | ✅ DONE |
| A11 | Import Excel | Nhập từ file | 🟢 Thấp | ✅ DONE |

### B. TRANG CHI TIẾT (detail-page.tsx)
| # | Chức năng | Mô tả | Ưu tiên | Trạng thái |
|---|-----------|-------|---------|------------|
| B1 | Load chi tiết | Fetch single product | 🔴 Cao | ✅ DONE |
| B2 | Hiển thị ảnh | Gallery images | 🟡 TB | ✅ DONE |
| B3 | Thông tin cơ bản | Tên, SKU, giá, tồn kho | 🔴 Cao | ✅ DONE |
| B4 | Tabs thông tin | SEO, Inventory, Logistics | 🟡 TB | ✅ DONE |
| B5 | Stock History | Lịch sử tồn kho | 🟢 Thấp | ✅ DONE |
| B6 | Activity History | Lịch sử hoạt động | 🟢 Thấp | ✅ DONE |
| B7 | Quick Actions | Edit, Delete, PKGX sync | 🔴 Cao | ✅ DONE |

### C. TRANG EDIT (form-page.tsx)
| # | Chức năng | Mô tả | Ưu tiên | Trạng thái |
|---|-----------|-------|---------|------------|
| C1 | Load form data | Fetch product for editing | 🔴 Cao | ✅ DONE |
| C2 | BasicInfoTab | Tên, SKU, Category, Brand | 🔴 Cao | ✅ DONE |
| C3 | ImagesTab | Upload/Manage images | 🟡 TB | ✅ DONE |
| C4 | InventoryTab | Tồn kho, kho hàng | 🔴 Cao | ✅ DONE |
| C5 | SeoDefaultTab | SEO mặc định | 🟡 TB | ✅ DONE |
| C6 | SeoPkgxTab | SEO cho PKGX | 🟡 TB | ✅ DONE |
| C7 | SeoTrendtechTab | SEO cho Trendtech | 🟡 TB | ✅ DONE |
| C8 | LogisticsTab | Vận chuyển | 🟢 Thấp | ✅ DONE |
| C9 | LabelTab | In nhãn | 🟢 Thấp | ✅ DONE |
| C10 | Form Submit | Create/Update product | 🔴 Cao | ✅ DONE |
| C11 | Form Validation | Validate fields | 🔴 Cao | ✅ DONE |

### D. PKGX SYNC ACTIONS
| # | Chức năng | Mô tả | Ưu tiên | Trạng thái |
|---|-----------|-------|---------|------------|
| D1 | Đăng lên PKGX | Create product on PKGX | 🔴 Cao | ✅ DONE |
| D2 | Hủy liên kết | Remove pkgxId | 🔴 Cao | ✅ DONE |
| D3 | Đồng bộ tất cả | Sync all info | 🟡 TB | ✅ DONE |
| D4 | Đồng bộ giá | Sync prices | 🟡 TB | ✅ DONE |
| D5 | Đồng bộ tồn kho | Sync inventory | 🟡 TB | ✅ DONE |
| D6 | Đồng bộ SEO | Sync SEO info | 🟡 TB | ✅ DONE |
| D7 | Đồng bộ hình ảnh | Sync images | 🟡 TB | ✅ DONE |
| D8 | Bulk Sync | Sync nhiều sản phẩm | 🟢 Thấp | ✅ DONE |

### E. TRANG THÙNG RÁC (trash-page.tsx)
| # | Chức năng | Mô tả | Ưu tiên | Trạng thái |
|---|-----------|-------|---------|------------|
| E1 | Load deleted | Fetch deleted products | 🟢 Thấp | ✅ DONE |
| E2 | Restore | Khôi phục sản phẩm | 🟢 Thấp | ✅ DONE |
| E3 | Permanent Delete | Xóa vĩnh viễn | 🟢 Thấp | ✅ DONE |

### F. COMPONENTS CHUNG
| # | Component | Mô tả | Ưu tiên | Trạng thái |
|---|-----------|-------|---------|------------|
| F1 | PkgxProductActionsCell | PKGX dropdown in table | 🔴 Cao | ✅ DONE |
| F2 | ProductFilterControls | Filter UI | 🟡 TB | ✅ DONE |
| F3 | ProductBulkActions | Bulk actions toolbar | 🟡 TB | ✅ DONE |
| F4 | QuickAddProductDialog | Quick add popup | 🟢 Thấp | ✅ DONE |
| F5 | ProductImage | Image component | 🟡 TB | ✅ DONE |
| F6 | StockAlertBadges | Stock warning badges | 🟢 Thấp | ✅ DONE |

### G. HOOKS
| # | Hook | Mô tả | Trạng thái |
|---|------|-------|------------|
| G1 | use-products.ts | Query hooks, staleTime 60s | ✅ DONE |
| G2 | use-products-query.ts | keepPreviousData, no skeleton | ✅ DONE |
| G3 | use-pkgx-sync.ts | setQueryData thay invalidateQueries | ✅ DONE |
| G4 | use-all-products.ts | Giới hạn 500 items cho dropdown | ✅ DONE |
| G5 | use-table-state-handlers.ts | Clean useCallback handlers | ✅ DONE |
| G6 | use-product-import-handler.ts | Import Excel handler | ✅ DONE |

---

## 🔄 Tiến độ thực hiện

### Đã hoàn thành ✅ (Rà soát 26/01/2026)
- [x] **A1-A11**: Trang danh sách - React Query với staleTime, keepPreviousData, server-side pagination
- [x] **B1-B7**: Trang chi tiết - Dynamic imports cho heavy components, usePkgxSync hook
- [x] **C1-C11**: Form page - React Hook Form, validation, skeleton loading
- [x] **D1-D8**: PKGX Sync - ensureProductWithPrices, setQueryData cache updates
- [x] **E1-E3**: Trash page - Basic CRUD với mutations
- [x] **F1-F6**: Components - React.memo, props pattern, factory functions
- [x] **G1-G6**: Hooks - Proper staleTime, gcTime, cache management

### Ghi chú từ rà soát:
1. ✅ `use-products-query.ts`: `staleTime: 60_000`, `keepPreviousData`, `refetchOnWindowFocus: false`
2. ✅ `use-pkgx-sync.ts`: `setQueriesData` thay `invalidateQueries` cho instant UI update
3. ✅ `PkgxProductActionsCell`: Nhận handlers via props, `React.memo` với custom compare
4. ✅ Dynamic imports: Dialogs, heavy components lazy loaded
5. ✅ `detail-page.tsx`: Fetch allProducts chỉ khi product là combo (PHASE 2)

---

## 🚀 PHASE 2: Tối ưu nâng cao (Hoàn thành 27/01/2026)

### ✅ P2.1: Lazy load allProducts chỉ khi combo
**File**: `features/products/detail-page.tsx`, `features/products/hooks/use-products.ts`
- Thêm `enabled` option vào `useProducts` hook
- Chỉ fetch 1000 products khi `product.type === 'combo'`
- Giảm ~50% data fetching cho non-combo products

```typescript
const isCombo = productFromQuery?.type === 'combo';
const { data: allProductsData } = useProducts({ limit: 1000, enabled: isCombo });
```

### ✅ P2.2: Prefetch product khi hover row
**File**: `features/products/page.tsx`, `components/data-table/responsive-data-table.tsx`
- Thêm `onRowHover` prop vào `ResponsiveDataTable`
- Prefetch product data khi hover → detail page load nhanh hơn
- Sử dụng `queryClient.prefetchQuery` với `staleTime: 60_000`

```typescript
const handleRowHover = React.useCallback((r: Product) => {
  queryClient.prefetchQuery({
    queryKey: productKeys.detail(r.systemId),
    queryFn: () => fetchProduct(r.systemId),
    staleTime: 60_000,
  });
}, [queryClient]);
```

### ✅ P2.3: Optimistic updates với rollback on error
**File**: `features/products/page.tsx`
- Inline edit (status, inventory, fields) cập nhật UI ngay lập tức
- Nếu API lỗi → tự động rollback về giá trị cũ
- Toast thông báo lỗi và khôi phục

```typescript
const handleStatusChange = React.useCallback((p: Product, ns: 'ACTIVE' | 'INACTIVE') => {
  const previousStatus = p.status;
  // 1. Optimistic update UI ngay
  queryClient.setQueriesData(...);
  toast.success(...);
  // 2. Mutate với rollback
  updateMutation.mutate(..., {
    onError: () => {
      queryClient.setQueriesData(...); // Rollback
      toast.error('Cập nhật thất bại, đã khôi phục');
    }
  });
}, [updateMutation, queryClient]);
```

### Còn lại (Phase 3):
- [x] Virtualization cho table lớn (>500 rows) - sử dụng react-virtual

---

## 🚀 PHASE 3: Desktop Virtualization (Đánh giá 27/01/2026)

### Phân tích tình hình hiện tại:

**Products Table:**
- Server-side pagination: **20 rows/page** (default)
- Có thể tăng lên 50, 100 nếu cần
- Với 20-100 rows, virtualization **KHÔNG CẦN THIẾT**

**Khi nào cần virtualization:**
| Trường hợp | Số rows | Cần virtualization? |
|------------|---------|---------------------|
| Server-side pagination 20-50 | 20-50 | ❌ Không |
| Server-side pagination 100+ | 100+ | ⚠️ Có thể |
| Client-side full data | 500+ | ✅ Cần |
| Export preview | 1000+ | ✅ Cần |

### Đã chuẩn bị sẵn:

1. **`@tanstack/react-virtual`** - Đã cài đặt
2. **`TanStackVirtualTable`** - Component có sẵn tại `components/data-table/tanstack-virtual-table.tsx`
3. **`ResponsiveDataTable`** - Đã thêm props cho future use:

```typescript
// Props đã thêm vào ResponsiveDataTableProps
desktopVirtualized?: boolean;      // Enable virtualization
virtualThreshold?: number;         // Auto-enable threshold (default: 100)
virtualHeight?: number;            // Container height (default: 600px)
virtualRowHeight?: number;         // Row height estimate (default: 53px)
```

### Kết luận:
✅ **Virtualization đã sẵn sàng** nhưng **chưa cần bật** cho Products vì:
- Server-side pagination 20 rows/page đã đủ nhanh
- Data hiện tại ~3000 products được phân trang tốt
- Bật virtualization chỉ khi cần tăng pageSize > 100

### Cách bật khi cần:
```tsx
<ResponsiveDataTable
  // ... other props
  desktopVirtualized={true}
  virtualThreshold={100}
  virtualHeight={600}
/>
```

---

## 📊 Metrics cần đo lường

| Metric | Mục tiêu | Hiện tại |
|--------|----------|----------|
| First Contentful Paint | < 1.5s | ⬜ Chưa đo |
| Largest Contentful Paint | < 2.5s | ⬜ Chưa đo |
| Time to Interactive | < 3s | ⬜ Chưa đo |
| List load time | < 500ms | ⬜ Chưa đo |
| Detail load time | < 300ms | ⬜ Chưa đo |
| Form submit time | < 1s | ⬜ Chưa đo |
| Cache hit rate | > 80% | ⬜ Chưa đo |

---

## 🛠️ Công cụ kiểm tra

1. **React DevTools Profiler** - Đo render time
2. **Chrome DevTools Performance** - Đo load time
3. **Lighthouse** - Audit tổng thể
4. **React Query DevTools** - Kiểm tra cache
5. **Bundle Analyzer** - Kiểm tra bundle size

---

## 📝 Ghi chú kỹ thuật

### Pattern chuẩn cho CRUD operations

```typescript
// 1. Hook ở page level (không phải cell level)
const { handleCreate, handleUpdate, handleDelete } = useMutations();

// 2. Truyền handlers xuống qua props
<DataTable handlers={{ onEdit, onDelete }} />

// 3. Cell component nhận props, không tạo hook
const Cell = React.memo(({ onEdit }) => (
  <Button onClick={() => onEdit(item)} />
));

// 4. setQueryData sau mutation (không invalidate)
onSuccess: (newData) => {
  queryClient.setQueryData(['products'], (old) => ({
    ...old,
    items: old.items.map(item => 
      item.id === newData.id ? newData : item
    ),
  }));
};
```

### Pattern cho optimistic updates

```typescript
const mutation = useMutation({
  mutationFn: updateProduct,
  onMutate: async (newData) => {
    // 1. Cancel outgoing refetches
    await queryClient.cancelQueries(['products']);
    
    // 2. Snapshot previous value
    const previous = queryClient.getQueryData(['products']);
    
    // 3. Optimistically update
    queryClient.setQueryData(['products'], (old) => ({
      ...old,
      items: old.items.map(item => 
        item.id === newData.id ? { ...item, ...newData } : item
      ),
    }));
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    queryClient.setQueryData(['products'], context.previous);
  },
});
```

---

## 🎯 Kế hoạch thực hiện

### Phase 1: High Priority (Tuần 1)
- [ ] A1, A2, A5: List load, search, pagination
- [ ] B1, B7: Detail load, quick actions  
- [ ] C1, C10, C11: Form load, submit, validation

### Phase 2: Medium Priority (Tuần 2)
- [ ] A3, A4, A7, A8: Filter, sort, bulk actions, inline edit
- [ ] B2, B3, B4: Images, basic info, tabs
- [ ] C2, C3, C4, C5: Form tabs

### Phase 3: Low Priority (Tuần 3)
- [ ] A6, A9, A10, A11: Multi-select, column toggle, import/export
- [ ] B5, B6: History tabs
- [ ] E1, E2, E3: Trash page
- [ ] F2-F6: Common components

---

*Cập nhật lần cuối: 2026-01-26*
