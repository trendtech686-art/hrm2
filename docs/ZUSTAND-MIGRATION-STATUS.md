# Zustand to React Query Migration Status

> **Ngày tạo**: 24/12/2024  
> **Mục tiêu**: Chuyển server data từ Zustand stores sang React Query để tối ưu performance với dữ liệu lớn (hàng triệu records)

---

## 📋 Tổng quan

### Tại sao cần migrate?

| Zustand (hiện tại) | React Query (mục tiêu) |
|-------------------|------------------------|
| Lưu toàn bộ data trong RAM browser | Chỉ cache data cần thiết |
| Fetch all → filter client | Server pagination + filter |
| Không tự động refetch | Auto refetch, stale-while-revalidate |
| Phải tự handle loading/error | Built-in loading/error states |

### Nguyên tắc sau migrate

```
┌─────────────────────────────────────┐
│         Zustand Store               │
│  ✅ UI State only:                  │
│  - Filters, search terms            │
│  - Selected rows                    │
│  - Modal open/close                 │
│  - Form draft data                  │
│                                     │
│  ❌ KHÔNG lưu:                      │
│  - Danh sách employees, orders...   │
│  - Server data                      │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│         React Query                 │
│  ✅ Server Data:                    │
│  - Fetch với pagination             │
│  - Auto cache + invalidation        │
│  - Mutations với optimistic update  │
└─────────────────────────────────────┘
```

---

## 📊 Trạng thái Migration

### 🔴 HIGH PRIORITY - Core Business Data

| # | Feature | Store File | React Query Hook | Status | Notes |
|---|---------|------------|------------------|--------|-------|
| 1 | Orders | `features/orders/store.ts` | ✅ Có `hooks.ts` | ⏳ Pending | **1985 lines** - File lớn nhất |
| 2 | Products | `features/products/store.ts` | ✅ Có `hooks.ts` | ⏳ Pending | Inventory tracking |
| 3 | Employees | `features/employees/store.ts` | ✅ Có `hooks.ts` | ⏳ Pending | Core HR |
| 4 | Customers | `features/customers/store.ts` | ✅ Có `hooks.ts` | ⏳ Pending | Debt + RFM |

### 🟡 MEDIUM PRIORITY - Financial

| # | Feature | Store File | React Query Hook | Status | Notes |
|---|---------|------------|------------------|--------|-------|
| 5 | Payments | `features/payments/store.ts` | ❌ Cần tạo | ⏳ Pending | Phiếu chi |
| 6 | Receipts | `features/receipts/store.ts` | ❌ Cần tạo | ⏳ Pending | Phiếu thu |
| 7 | Cashbook | `features/cashbook/store.ts` | ❌ Cần tạo | ⏳ Pending | Sổ quỹ |
| 8 | Purchase Orders | `features/purchase-orders/store.ts` | ❌ Cần tạo | ⏳ Pending | Đơn nhập |

### 🟠 LOWER PRIORITY - Inventory/Operations

| # | Feature | Store File | React Query Hook | Status | Notes |
|---|---------|------------|------------------|--------|-------|
| 9 | Stock Transfers | `features/stock-transfers/store.ts` | ✅ Có | ⏳ Pending | |
| 10 | Stock History | `features/stock-history/store.ts` | ✅ Có | ⏳ Pending | |
| 11 | Stock Locations | `features/stock-locations/store.ts` | ✅ Có | ⏳ Pending | |
| 12 | Inventory Receipts | `features/inventory-receipts/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 13 | Inventory Checks | `features/inventory-checks/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 14 | Sales Returns | `features/sales-returns/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 15 | Purchase Returns | `features/purchase-returns/store.ts` | ❌ Cần tạo | ⏳ Pending | |

### 🔵 HR Related

| # | Feature | Store File | React Query Hook | Status | Notes |
|---|---------|------------|------------------|--------|-------|
| 16 | Attendance | `features/attendance/store.ts` | ✅ Có | ⏳ Pending | Chấm công |
| 17 | Leaves | `features/leaves/store.ts` | ✅ Có | ⏳ Pending | Nghỉ phép |
| 18 | Payroll | `features/payroll/store.ts` | ✅ Có | ⏳ Pending | Bảng lương |

### ⚪ Other Features

| # | Feature | Store File | React Query Hook | Status | Notes |
|---|---------|------------|------------------|--------|-------|
| 19 | Suppliers | `features/suppliers/store.ts` | ✅ Có | ⏳ Pending | |
| 20 | Tasks | `features/tasks/store.ts` | ✅ Có | ⏳ Pending | Timer logic |
| 21 | Warranty | `features/warranty/store.ts` | ✅ Có | ⏳ Pending | |
| 22 | Shipments | `features/shipments/store.ts` | ✅ Có | ⏳ Pending | Seed data cứng |
| 23 | Wiki | `features/wiki/store.ts` | ✅ Có | ⏳ Pending | |
| 24 | Complaints | `features/complaints/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 25 | Audit Log | `features/audit-log/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 26 | Cost Adjustments | `features/cost-adjustments/store.ts` | ❌ Cần tạo | ⏳ Pending | |

### ⚙️ Settings Stores

| # | Feature | Store File | React Query Hook | Status | Notes |
|---|---------|------------|------------------|--------|-------|
| 27 | Branches | `features/settings/branches/store.ts` | ✅ Có | ⏳ Pending | |
| 28 | Departments | `features/settings/departments/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 29 | Job Titles | `features/settings/job-titles/store.ts` | ✅ Có | ⏳ Pending | |
| 30 | Units | `features/settings/units/store.ts` | ✅ Có | ⏳ Pending | |
| 31 | Taxes | `features/settings/taxes/store.ts` | ✅ Có | ⏳ Pending | |
| 32 | Receipt Types | `features/settings/receipt-types/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 33 | Payment Methods | `features/settings/payments/methods/store.ts` | ❌ Cần tạo | ⏳ Pending | |
| 34 | Shipping | `features/settings/shipping/store.ts` | ❌ Cần tạo | ⏳ Pending | |

### 🟢 GIỮ NGUYÊN (UI State Only)

| # | Feature | Store File | Lý do |
|---|---------|------------|-------|
| 1 | Appearance | `features/settings/appearance/store.ts` | Pure UI state (theme, font) |
| 2 | Customer SLA | `features/customers/sla/store.ts` | Computed/cached UI state |

---

## 📈 Thống kê

| Loại | Số lượng |
|------|----------|
| 🔴 Cần migrate (có hook sẵn) | 17 |
| 🟡 Cần migrate + tạo hook | 16 |
| 🟢 Giữ nguyên | 2 |
| **TỔNG CỘNG** | **35 stores** |

---

## 📝 Migration Pattern

### Trước (Zustand lưu server data)
```tsx
// store.ts
const useEmployeeStore = create((set) => ({
  employees: [],  // ❌ Server data trong store
  isLoading: false,
  
  fetchEmployees: async () => {
    set({ isLoading: true });
    const data = await api.getEmployees();
    set({ employees: data, isLoading: false });
  },
}));

// Component
function EmployeeList() {
  const { employees, isLoading, fetchEmployees } = useEmployeeStore();
  useEffect(() => { fetchEmployees(); }, []);
  // ...
}
```

### Sau (React Query cho server data)
```tsx
// hooks.ts
export function useEmployees(filters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeeApi.getList(filters),
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: employeeApi.create,
    onSuccess: () => queryClient.invalidateQueries(['employees']),
  });
}

// store.ts (chỉ còn UI state)
const useEmployeeStore = create((set) => ({
  filters: {},  // ✅ UI state
  selectedIds: [],  // ✅ UI state
  setFilters: (filters) => set({ filters }),
}));

// Component
function EmployeeList() {
  const { filters } = useEmployeeStore();
  const { data, isLoading } = useEmployees(filters);  // React Query
  // ...
}
```

---

## ✅ Checklist cho mỗi migration

- [ ] Tạo/cập nhật file `hooks.ts` với useQuery và useMutation
- [ ] Xóa `data: []` khỏi Zustand store
- [ ] Giữ lại UI state trong store (filters, selections)
- [ ] Cập nhật components để dùng hooks thay vì store
- [ ] Test pagination, filtering, CRUD
- [ ] Xóa code fetch cũ trong store

---

## 📅 Lịch sử cập nhật

| Ngày | Thay đổi |
|------|----------|
| 24/12/2024 | Tạo file, liệt kê 35 stores cần review |

