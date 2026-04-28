# Skill: useAllXxx Hooks Audit

## Mục đích

Phát hiện và đề xuất giải pháp cho các `useAllXxx` hooks trong hệ thống HRM2, dựa trên **dữ liệu thực tế** hoặc **tính chất tăng trưởng** của entity.

## Khi nào dùng

- User muốn check hooks nào đang load quá nhiều data
- User muốn migrate `useAllXxx` sang Meilisearch
- User gặp vấn đề performance với dropdown/search
- User muốn audit tất cả `useAllXxx` hooks trong project

---

## MEILISEARCH vs useAll - SO SÁNH CHI TIẾT

### useAllXxx hooks

| Hook | Behavior | Records loaded |
|------|----------|----------------|
| `useAllEmployees` | Auto-pagination, load ALL | Tất cả employees |
| `useAllProducts` | Auto-pagination, load ALL | Tất cả products |
| `useAllCustomers` | Auto-pagination, load ALL | Tất cả customers |

→ **Dùng cho:** Dropdown nhỏ (< 100 items), hoặc components cần render tất cả items

### Meilisearch hooks

| Hook | Query rỗng | Filter support | Default limit |
|------|------------|----------------|---------------|
| `useMeiliProductSearch` | Trả về all (sort by date) | brandId, categoryId, status | 20 |
| `useMeiliCustomerSearch` | Trả về all (sort) | city, district | 20 |
| `useMeiliEmployeeSearch` | Trả về all (sort by name) | department, position, status | 20 |
| `useMeiliOrderSearch` | **KHÔNG fetch** | status, branchId, fromDate, toDate | 20 |
| `useMeiliShipmentSearch` | **KHÔNG fetch** | status, carrier, printStatus, deliveryStatus | 20 |
| `useMeiliWarrantySearch` | **KHÔNG fetch** | status, priority, branchName, assigneeName | 20 |

→ **Dùng cho:** Search boxes, comboboxes, infinite scroll lists

### Key difference: Meilisearch với query rỗng

```typescript
// useMeiliProductSearch({ query: "" })
// → Meilisearch trả về TẤT CẢ products, nhưng CHỈ giới hạn bởi limit (20)
// → KHÔNG load all như useAllProducts!

// useMeiliOrderSearch({ query: "" })
// → KHÔNG fetch gì cả (enabled = false khi query rỗng)
```

### Filter + Search

```typescript
// Kết hợp filter + search
const { data } = useMeiliEmployeeSearch({
  query: "nguyen",                    // Fuzzy search
  filters: { department: "Kỹ thuật", status: "ACTIVE" }
})

// Infinite scroll với filter
const { data, fetchNextPage } = useInfiniteMeiliProductSearch({
  query: "laptop",
  filters: { brandId: "xxx", categoryId: "yyy" }
})
```

---

## NGUƯỠNG QUYẾT ĐỊNH

### ✅ QUY TẮC ĐƠN GIẢN

```
useAll → API Filter → Meilisearch
```

**Nhưng KHÔNG PHẢI lúc nào cũng cần cả 3 bước!**

| Loại Entity | Decision | Lý do |
|-------------|----------|-------|
| **Settings** (branches, departments, units, pricing, taxes, etc.) | ✅ Giữ `useAllXxx` | < 100 records, dữ liệu tĩnh |
| **Others** | ⚠️ Check use case | Tùy vào mục đích sử dụng trong file cụ thể |

**QUAN TRỌNG:** Không đánh đồng cả hook. Mỗi file cần check riêng!

### 🔍 Checklist: Chuyển useAll → API Filter / Meilisearch

Với **mỗi FILE** dùng `useAllXxx`, check USE CASE CỤ THỂ trong file đó:

```
1. File đó dùng useAll cho mục đích gì?
   ├── Dropdown nhỏ (< 100 items)? → Giữ nguyên
   ├── Search box? → Meilisearch
   ├── Table/List view? → API Filter + pagination
   └── Export all data? → Giữ nguyên (lazy load)

2. useAll có filter params không?
   └── YES → API Filter

3. useAll có client-side .filter() không?
   └── YES → API Filter
```

### ⚠️ LƯU Ý QUAN TRỌNG

> **PHẢI check USE CASE CỤ THỂ trong từng file!**
>
> KHÔNG đánh đồng cả hook. Ví dụ:
> - `useAllEmployees` có thể OK trong file A (dropdown nhỏ)
> - `useAllEmployees` cần migrate trong file B (table view)
>
> **Meilisearch CHỈ khi:**
> - Cần fuzzy search (typo tolerance)
> - Cần search nhanh (< 50ms)
> - Search phức tạp (nhiều fields)
>
> **API Filter khi:**
> - Cần filter/params cụ thể
> - Table/List view với pagination
> - Client-side filter đang dùng `useAllXxx.filter()`

---

## CHECKLIST ĐÁNH GIÁ

### 1. Phân loại Entity

| Entity | Loại | Decision |
|--------|------|----------|
| branches, departments, units, pricing, taxes, payment methods, etc. | Settings | ✅ `useAllXxx` OK |
| products, customers, employees, suppliers, orders, shipments, warranties, payments, receipts, etc. | Others | 🔴 API Filter → Meilisearch |

### 2. Đếm files sử dụng

```bash
# Đếm số files sử dụng mỗi hook
grep -r "useAllEmployees" --include="*.tsx" features/ | wc -l
```

| Files | Mức độ ưu tiên |
|-------|----------------|
| 1-2 | Thấp - có thể migrate từ từ |
| 3-10 | Trung bình - nên migrate sớm |
| 10+ | Cao - ƯU TIÊN cao nhất |

### 3. Use case analysis

| Use case | Pattern | Giải pháp |
|----------|---------|-----------|
| Dropdown/Select nhỏ (< 100 items) | Chọn từ list | ✅ `useAllXxx` OK |
| Table/List view | Phân trang | 🔴 API Filter + pagination |
| Autocomplete/Search | Debounced search | 🔴 API Filter hoặc Meilisearch |
| Combobox với nhiều items | Filter + Select | 🔴 API Filter → Meilisearch |

### 4. Quick Decision

```typescript
// CÓ dùng filter/search không?
const { data } = useAllEmployees({ /* có params filter/search? */ })

// YES → API Filter
const { data } = useEmployees({ department: "Kỹ thuật", status: "ACTIVE" })

// Cần fuzzy search?
const { data } = useMeiliEmployeeSearch({ query: "nguyen" })

// NO, chỉ dropdown nhỏ?
const { data } = useAllEmployees() // Giữ nguyên
```

---

## BÁO CÁO TEMPLATE

```markdown
# useAllXxx Audit Report

**Date:** {date}
**Project:** HRM2

## QUY TẮC ĐƠN GIẢN

| Loại | Decision |
|------|----------|
| Settings | ✅ useAllXxx OK |
| Others | 🔴 Meilisearch |

## Tổng quan

| Hook | Type | Files | Priority |
|------|------|-------|----------|
| useAllEmployees | Others | {N} | 🔴 CAO |
| useAllProducts | Others | {N} | 🔴 CAO |
| useAllCustomers | Others | {N} | 🔴 CAO |
| useAllSuppliers | Others | {N} | 🟡 TRUNG |
| useAllBranches | Settings | {N} | ✅ OK |
```

## Chi tiết từng hook

### useAll{Entity} ({count} records, {N} files)

**Vấn đề:**
- Load {count}+ records dù dropdown chỉ hiện 10
- Client-side search chậm
- Memory bloat

**Giải pháp:**
1. Check dữ liệu thực tế
2. Nếu 500+ → Migrate sang Meilisearch
3. Nếu < 500 → Giữ nguyên

**Ưu tiên:** {🔴/🟡/🟢}

---

## MIGRATION DECISION TREE

```
10,000+ records?
├── YES → ✅ Meilisearch TRỰC TIẾP (skip useAll)
│         • Indexed fuzzy search
│         • Built-in filter
│         • Fast (< 50ms response)
│
├── 1,000 - 10,000 records?
│   ├── Cần fuzzy search? → ✅ Meilisearch
│   └── Chỉ exact filter? → 🟡 API Filter (có thể dùng)
│
└── < 1,000 records?
    ├── Settings (branches, departments...) → ✅ useAll OK
    └── Others → 🟡 Meilisearch hoặc API Filter
```

### Với 10,000+ records - Migration path

```typescript
// BƯỚC 1: useAll (HIỆN TẠI) - ❌ Load 10,000 records
const { data } = useAllEmployees()

// BƯỚC 2: KHÔNG CẦN API Filter - vì Meilisearch đã là filter + search
// SKIP luôn bước này!

// BƯỚC 3: Meilisearch TRỰC TIẾP - ✅ Chỉ load 20 records
const { data } = useMeiliEmployeeSearch({
  query: "search term",       // Fuzzy search
  filters: { department: "Kỹ thuật" }  // Filter
})
```

### Khi nào API Filter VẪN hữu ích

| Trường hợp | Giải pháp |
|------------|-----------|
| Meilisearch down | ✅ Fallback sang API Filter |
| Dữ liệu < 1,000 records, không cần fuzzy | 🟡 API Filter OK |
| Cần relational data phức tạp (joins) | ✅ API Filter |

---

## MIGRATION GUIDE

### Pattern 1: Dropdown với Search

**TRƯỚC:**
```tsx
const { data: employees } = useAllEmployees()

return (
  <Select>
    {employees.map(e => (
      <SelectOption key={e.systemId} value={e.systemId}>
        {e.fullName}
      </SelectOption>
    ))}
  </Select>
)
```

**SAU:**
```tsx
const [query, setQuery] = useState('')
const { data: searchResult } = useMeiliEmployeeSearch({ query, limit: 20 })
const employees = searchResult?.data || []

return (
  <Combobox>
    <ComboboxInput onChange={e => setQuery(e.target.value)} />
    <ComboboxOptions>
      {employees.map(e => (
        <ComboboxOption key={e.systemId} value={e.systemId}>
          {e.fullName}
        </ComboboxOption>
      ))}
    </ComboboxOptions>
  </Combobox>
)
```

### Pattern 2: Infinite Scroll List

**TRƯỚC:**
```tsx
const { data: products } = useAllProducts()

return (
  <div>
    {products.map(p => <ProductCard key={p.systemId} product={p} />)}
  </div>
)
```

**SAU:**
```tsx
const {
  data: searchResult,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteMeiliProductSearch({ query: '' })

const products = searchResult?.pages.flatMap(p => p.data) || []

useEffect(() => {
  if (hasNextPage && !isFetchingNextPage) {
    fetchNextPage()
  }
}, [hasNextPage, isFetchingNextPage, fetchNextPage])

return (
  <div>
    {products.map(p => <ProductCard key={p.systemId} product={p} />)}
  </div>
)
```

### Pattern 3: Autocomplete

**TRƯỚC:**
```tsx
const { data: customers } = useAllCustomers()
const filtered = useMemo(() => 
  customers.filter(c => c.name.includes(search)), [customers, search])
```

**SAU:**
```tsx
const { data: searchResult } = useMeiliCustomerSearch({ 
  query: search,
  debounceMs: 150,
})
const customers = searchResult?.data || []
```

---

## PRIORITY MATRIX

|  | Settings | Others (Products, Customers, Employees...) |
|--|---------|-------------------------------------------|
| **Nhiều files (10+)** | 🟢 Thấp | 🔴 CAO - Ưu tiên ngay |
| **Ít files (<10)** | 🟢 Thấp | 🟡 TRUNG - Lên kế hoạch |

### Immediate Actions (Priority 🔴)

1. **useAllEmployees** - 60+ files, Others
2. **useAllProducts** - 4 files, Others
3. **useAllCustomers** - 5 files, Others

### Plan Soon (Priority 🟡)

1. **useAllSuppliers** - 4 files, Others
2. **useAllShipments** - 2 files, Others
3. **useAllOrders** - Others

### OK (Priority 🟢)

- **useAllBranches** - Settings
- **useAllDepartments** - Settings
- **useAllUnits** - Settings
- **useAllPricingPolicies** - Settings
- Tất cả settings hooks khác - Settings

---

## ESTIMATED EFFORT

| Hook | Files | Estimated Time |
|------|-------|----------------|
| useAllEmployees | 60 | 3-5 days |
| useAllProducts | 4 | 1-2 days |
| useAllCustomers | 5 | 1-2 days |
| useAllSuppliers | 4 | 0.5 day |

---

## LƯU Ý

1. **Branches, Pricing Policies** - Dưới 100 records, giữ nguyên OK
2. **Settings hooks** - Không cần Meilisearch
3. **Order-related** - Có thể reuse `useMeiliOrderSearch`
4. **Meilisearch down?** - Cần Prisma fallback
