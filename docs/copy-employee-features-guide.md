# Hướng dẫn Copy UI và Chức năng từ Nhân viên sang Module khác

## Tổng quan

Trang **Nhân viên** (Employees) là reference implementation chuẩn cho tất cả các trang quản lý danh sách trong hệ thống. Document này hướng dẫn cách copy các tính năng UI và UX từ Employees sang các module khác.

## Các tính năng chính cần copy

### 1. Header & Breadcrumb System

#### 1.1. Cấu hình Module trong `breadcrumb-system.ts`

**FILE**: `d:\hrm2\lib\breadcrumb-system.ts`
**VỊ TRÍ**: Tìm object `MODULES` → Thêm/sửa section của module
**DÒNG THAM KHẢO**: Xem EMPLOYEES ở dòng ~29-50

Mỗi module cần có đầy đủ 4 actions: `list`, `detail`, `edit`, `new`

```typescript
EMPLOYEES: {
  key: 'employees',
  name: 'Nhân viên',
  icon: 'User',
  list: {
    title: 'Danh sách nhân viên',
    description: 'Quản lý thông tin và hồ sơ nhân viên'
  },
  detail: {
    title: (name) => name ? `Hồ sơ ${name}` : 'Chi tiết nhân viên',
    description: 'Thông tin chi tiết và lịch sử làm việc'
  },
  edit: {
    title: (name) => name ? `Chỉnh sửa ${name}` : 'Chỉnh sửa nhân viên',
    description: 'Cập nhật thông tin nhân viên'
  },
  new: {
    title: 'Thêm nhân viên mới',
    description: 'Tạo hồ sơ nhân viên mới trong hệ thống'
  }
}
```

**Lưu ý quan trọng**:
- `detail` và `edit` nhận parameter động (name/code) để hiển thị tên cụ thể
- **PHẢI có đủ 4 actions** để auto-generate title hoạt động đúng
- ⚠️ **VÍ DỤ LỖI**: RECEIPTS và PAYMENTS ban đầu chỉ có `list`, `detail`, `new` → thiếu `edit` → header không hiện!

#### 1.2. Đăng ký PATH_PATTERNS

**FILE**: `d:\hrm2\lib\breadcrumb-system.ts`
**VỊ TRÍ**: Tìm object `const PATH_PATTERNS` (dòng ~687)
**THÊM VÀO**: Sau các routes của module khác

```typescript
const PATH_PATTERNS = {
  // List page
  '/employees': { module: 'HRM', section: 'EMPLOYEES', action: 'list' },
  
  // Create new
  '/employees/new': { module: 'HRM', section: 'EMPLOYEES', action: 'new' },
  
  // Trash (optional)
  '/employees/trash': { module: 'HRM', section: 'EMPLOYEES', action: 'trash' },
  
  // Detail/View - Hỗ trợ cả 2 patterns
  '/employees/view/:id': { module: 'HRM', section: 'EMPLOYEES', action: 'detail' },
  '/employees/:id': { module: 'HRM', section: 'EMPLOYEES', action: 'detail' },
  
  // Edit - Hỗ trợ cả 2 patterns
  '/employees/:id/edit': { module: 'HRM', section: 'EMPLOYEES', action: 'edit' },
  '/employees/edit/:id': { module: 'HRM', section: 'EMPLOYEES', action: 'edit' },
}
```

**Pattern đúng**:
- ✅ `/employees/:id/edit` - Chuẩn RESTful
- ✅ `/employees/edit/:id` - Backward compatibility
- ⚠️ **VÍ DỤ LỖI**: RECEIPTS ban đầu chỉ có `/receipts/:id` → thiếu edit routes → không generate title được!

#### 1.3. Khai báo Routes Constants

**FILE**: `d:\hrm2\lib\router.ts`
**VỊ TRÍ**: Tìm object `ROUTES` → Thêm vào section phù hợp
**DÒNG THAM KHẢO**: Xem ROUTES.HRM.EMPLOYEES ở dòng ~15-22

```typescript
export const ROUTES = {
  HRM: {
    EMPLOYEES: '/employees',
    EMPLOYEE_NEW: '/employees/new',
    EMPLOYEE_EDIT: '/employees/:id/edit',
    EMPLOYEE_VIEW: '/employees/:id',
    EMPLOYEE_TRASH: '/employees/trash',
  },
  FINANCE: {
    RECEIPTS: '/receipts',
    RECEIPT_NEW: '/receipts/new',
    RECEIPT_EDIT: '/receipts/:id/edit',  // ← QUAN TRỌNG: Phải match với PATH_PATTERNS
    RECEIPT_VIEW: '/receipts/:id',
  }
  // ...
}
```

**Lưu ý**: Route pattern ở đây PHẢI KHỚP với PATH_PATTERNS trong breadcrumb-system.ts

#### 1.4. Route Definitions với Breadcrumb

**FILE**: `d:\hrm2\lib\route-definitions.tsx`
**VỊ TRÍ**: Tìm array `routes` → Thêm route mới
**DÒNG THAM KHẢO**: Xem EMPLOYEE routes ở dòng ~183-208

```typescript
{
  path: ROUTES.HRM.EMPLOYEE_EDIT,
  element: <EmployeeFormPage />,
  meta: {
    title: 'Chỉnh sửa nhân viên',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Nhân viên', href: '/employees' },
      'Chỉnh sửa'
    ],
    requiresAuth: true,
  }
}
```

**Lưu ý**:
- Breadcrumb **PHẢI có "Trang chủ"** ở đầu (VÍ DỤ LỖI: RECEIPTS ban đầu thiếu → breadcrumb không hiện!)
- Format: Array of `{ label, href }` hoặc `string`
- String sẽ tự động convert thành current item

#### 1.5. Sử dụng Header trong Component

**FILE**: `d:\hrm2\features\[your-module]\page.tsx` (List page)
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~450-490

**Pattern cho List Page** (`page.tsx`):

```typescript
import { usePageHeader } from '../../contexts/page-header-context.tsx';

export function EmployeesPage() {
  // Header actions (buttons ở góc phải)
  const actions = React.useMemo(() => [
    <Button key="export" variant="outline">
      <Download className="mr-2 h-4 w-4" />
      Xuất Excel
    </Button>,
    <Button key="import" variant="outline">
      <Upload className="mr-2 h-4 w-4" />
      Nhập Excel
    </Button>,
    <Button key="add" onClick={() => navigate('/employees/new')}>
      <Plus className="mr-2 h-4 w-4" />
      Thêm nhân viên
    </Button>
  ], [navigate]);

  // ✅ CHỈ truyền actions - Title & Breadcrumb tự động generate
  usePageHeader({ actions });
  
  return (
    // Component content...
  );
}
```

**Pattern cho Form Page** (`form-page.tsx`):

**FILE**: `d:\hrm2\features\[your-module]\form-page.tsx` (Create/Edit page)
**THAM KHẢO**: `d:\hrm2\features\employees\employee-form-page.tsx` dòng ~36-56

```typescript
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta';

export function EmployeeFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const routeMeta = useRouteMeta();
  const employee = findById(systemId);

  const actions = React.useMemo(() => [
    <Button key="cancel" variant="outline" onClick={() => navigate('/employees')}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button key="save" type="submit" form="employee-form">
      <Edit className="mr-2 h-4 w-4" />
      Lưu
    </Button>
  ], [navigate]);

  // ✅ Dynamic breadcrumb khi có data, fallback về routeMeta
  usePageHeader({ 
    actions,
    breadcrumb: employee ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: employee.fullName, href: `/employees/${systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: '', isCurrent: true }
    ] : routeMeta?.breadcrumb as any
  });

  return (
    // Form content...
  );
}
```

**Quy tắc vàng**:
- ✅ List page: Chỉ truyền `actions` - Title & Breadcrumb tự động từ PATH_PATTERNS
- ✅ Form page: Truyền `actions` + `breadcrumb` (dynamic nếu có data, hoặc routeMeta)
- ✅ KHÔNG truyền `title` - để hệ thống auto-generate từ MODULES config
- ⚠️ **VÍ DỤ LỖI**: RECEIPTS form-page truyền cả title → override auto-generation → sai!

---

### 2. Data Table với Responsive & Sticky Features

#### 2.1. Sử dụng ResponsiveDataTable

**COMPONENT**: `d:\hrm2\components\data-table\responsive-data-table.tsx`
**SỬ DỤNG TRONG**: `d:\hrm2\features\[your-module]\page.tsx`
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~598-630

```typescript
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx";

<ResponsiveDataTable
  // Data
  columns={columns}
  data={paginatedData}
  
  // Mobile card rendering
  renderMobileCard={(employee, index) => (
    <EmployeeCard 
      employee={employee} 
      onEdit={() => handleEdit(employee)}
      onDelete={() => handleDelete(employee.systemId)}
    />
  )}
  
  // Pagination
  pageCount={pageCount}
  pagination={pagination}
  setPagination={setPagination}
  rowCount={filteredData.length}
  
  // Selection
  rowSelection={rowSelection}
  setRowSelection={setRowSelection}
  allSelectedRows={allSelectedRows}
  
  // Bulk actions
  onBulkDelete={handleBulkDelete}
  bulkActions={bulkActions}
  
  // Sorting
  sorting={sorting}
  setSorting={setSorting}
  
  // Column customization
  columnVisibility={columnVisibility}
  setColumnVisibility={setColumnVisibility}
  columnOrder={columnOrder}
  setColumnOrder={setColumnOrder}
  pinnedColumns={pinnedColumns}
  setPinnedColumns={setPinnedColumns}
  
  // States
  isLoading={isLoading}
  emptyTitle="Không có nhân viên"
  emptyDescription="Thêm nhân viên đầu tiên để bắt đầu"
/>
```

**Tính năng tự động**:
- ✅ Desktop (≥768px): Render `DataTable` với sticky header + sticky scrollbar
- ✅ Mobile (<768px): Render card layout
- ✅ Loading skeleton tự động
- ✅ Empty state tự động

#### 2.2. Desktop: Sticky Scrollbar (Thanh cuộn ngang dính đáy màn hình)

**TÍNH NĂNG**: Thanh cuộn ngang **luôn hiển thị ở đáy viewport** (không bị cuộn mất), giúp scroll bảng rộng dễ dàng

**CƠ CHẾ HOẠT ĐỘNG**:
1. `ResponsiveDataTable` (desktop) → render `DataTable` 
2. `DataTable` (line 518) → built-in render `<StickyScrollbar>`
3. `StickyScrollbar`:
   - Position: `fixed bottom-0` (dính đáy màn hình)
   - Z-index: `z-[100]` (trên tất cả elements)
   - Width: Sync với table width (ResizeObserver)
   - Scroll position: Sync 2 chiều với table (requestAnimationFrame)
   - Visibility: Chỉ hiện khi `scrollWidth > clientWidth` (có horizontal scroll)

**FILE LIÊN QUAN**:
- Table component: `d:\hrm2\components\data-table\data-table.tsx` (line 518)
- Scrollbar component: `d:\hrm2\components\data-table\sticky-scrollbar.tsx` (toàn bộ logic)
- Native scrollbar hidden: line 277, 400 trong data-table.tsx (`[&::-webkit-scrollbar]:hidden`)

**CODE TRONG STICKY-SCROLLBAR.TSX**:

```typescript
// d:\hrm2\components\data-table\sticky-scrollbar.tsx

export function StickyScrollbar({ targetRef }: { targetRef: React.RefObject<HTMLDivElement> }) {
  const scrollbarRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const target = targetRef.current;
    const scrollbar = scrollbarRef.current;
    if (!target || !scrollbar) return;

    // 1. Sync width khi table resize
    const updateWidth = () => {
      scrollbar.style.width = `${target.scrollWidth}px`;
    };
    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(target);

    // 2. Sync scroll: Table → Scrollbar
    const handleTableScroll = () => {
      if (!scrollbar) return;
      scrollbar.scrollLeft = target.scrollLeft;
    };
    target.addEventListener('scroll', handleTableScroll);

    // 3. Sync scroll: Scrollbar → Table
    const handleScrollbarScroll = () => {
      if (!target) return;
      requestAnimationFrame(() => {
        target.scrollLeft = scrollbar.scrollLeft;
      });
    };
    scrollbar.addEventListener('scroll', handleScrollbarScroll);

    return () => {
      resizeObserver.disconnect();
      target.removeEventListener('scroll', handleTableScroll);
      scrollbar.removeEventListener('scroll', handleScrollbarScroll);
    };
  }, [targetRef]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] overflow-x-auto">
      <div ref={scrollbarRef} className="h-3 bg-transparent" />
    </div>
  );
}
```

**TẠI SAO NATIVE SCROLLBAR BỊ ẨN?**
- Native scrollbar của table bị ẩn: `[&::-webkit-scrollbar]:hidden`
- Chỉ hiển thị StickyScrollbar ở đáy màn hình
- Lý do: Native scrollbar bị cuộn mất khi scroll trang xuống → khó sử dụng
- StickyScrollbar luôn ở đáy → dễ tiếp cận hơn

**Sticky scrollbar tự động hoạt động nếu**:
1. ✅ Có đủ nhiều cột để tạo horizontal scroll
2. ✅ `ResponsiveDataTable` tự render `DataTable` khi desktop
3. ✅ `DataTable` có built-in `StickyScrollbar` component

**⚠️ VẤN ĐỀ THƯỜNG GẶP**: Sticky scrollbar không xuất hiện

**NGUYÊN NHÂN**: Chỉ hiển thị 5-8 cột → không đủ rộng → không có horizontal scroll

**GIẢI PHÁP**: Đảm bảo có horizontal scroll

```typescript
// ✅ Hiển thị NHIỀU cột mặc định (15+ cột)
React.useEffect(() => {
  const defaultVisibleColumns = [
    'id', 'fullName', 'workEmail', 'phone', 'branch', 'department', 
    'jobTitle', 'hireDate', 'employmentStatus', 'dateOfBirth', 'gender',
    'nationalId', 'address', 'bankName', 'bankAccountNumber', 'basicSalary',
    'contractType', 'annualLeaveBalance', 'sickLeaveBalance'
  ];
  
  const initialVisibility: Record<string, boolean> = {};
  columns.forEach(c => {
    if (c.id === 'select' || c.id === 'actions') {
      initialVisibility[c.id!] = true;
    } else {
      initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
    }
  });
  
  setColumnVisibility(initialVisibility);
  setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
}, []);
```


#### 2.3. Desktop: Sticky Table Header

**FILE**: `d:\hrm2\components\data-table\data-table.tsx`
**VỊ TRÍ**: Line 277 - className của TableHeader

**Tự động có** khi dùng `DataTable`:
- Header sticky tại `top-32` (dưới page header)
- CSS: `sticky top-32 z-30`
- Không cần config thêm

#### 2.4. Column Definition Best Practices

**FILE TẠO**: `d:\hrm2\features\[your-module]\columns.tsx`
**THAM KHẢO**: `d:\hrm2\features\employees\columns.tsx` (toàn bộ file)

```typescript
import type { ColumnDef } from '../../components/data-table/types.ts';

export const getColumns = (
  onDelete: (systemId: string) => void,
  onEdit: (employee: Employee) => void,
  navigate: (path: string) => void,
): ColumnDef<Employee>[] => [
  // 1. Select column - ALWAYS sticky left
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll(!!value)}
        />
      </div>
    ),
    cell: ({ isSelected, onToggleSelect }) => (
      <div className="flex items-center justify-center">
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </div>
    ),
    size: 48,
    meta: { displayName: "Chọn", sticky: "left" },
  },
  
  // 2. ID column - sticky left, clickable
  {
    id: "id",
    accessorKey: "id",
    header: "Mã NV",
    cell: ({ row }) => (
      <div 
        className="font-medium text-primary cursor-pointer hover:underline" 
        onClick={() => navigate(`/employees/${row.systemId}`)}
      >
        {row.id}
      </div>
    ),
    meta: { displayName: "Mã nhân viên" },
  },
  
  // 3. Data columns
  {
    id: "fullName",
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => row.fullName,
    meta: { displayName: "Họ và tên" },
  },
  
  // ... more columns
  
  // N. Actions column - ALWAYS sticky right
  {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/employees/${row.systemId}`)}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(row)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive" 
              onClick={() => onDelete(row.systemId)}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    meta: { displayName: "Hành động", sticky: "right" },
    size: 90,
  },
];
```

**Best practices**:
- ✅ `select` column: sticky left, size 48px
- ✅ `id` column: Clickable, navigate to detail
- ✅ `actions` column: sticky right, size 90px
- ✅ All columns có `meta.displayName` cho column customizer

---

### 3. Mobile Infinite Scroll

#### 3.1. State Management

**FILE**: `d:\hrm2\features\[your-module]\page.tsx`
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~90-95

```typescript
// Mobile infinite scroll state
const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

// Reset về 20 khi filter thay đổi
React.useEffect(() => {
  setMobileLoadedCount(20);
}, [
  searchQuery,
  statusFilter,
  departmentFilter,
  // ... các filter khác
]);
```

#### 3.2. Scroll Listener

**FILE**: `d:\hrm2\features\[your-module]\page.tsx`
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~104-120

```typescript
// Scroll listener for mobile infinite scroll
React.useEffect(() => {
  if (!isMobile) return;

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollPosition / documentHeight) * 100;

    // Load more when scroll 80%
    if (scrollPercentage > 80 && mobileLoadedCount < filteredData.length) {
      setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, [isMobile, mobileLoadedCount, filteredData.length]);
```

**Nguyên lý**:
- Scroll đến 80% trang → load thêm 20 items
- Không vượt quá tổng số items

#### 3.3. Data Slicing cho Mobile

```typescript
// Mobile: Slice data for infinite scroll
const displayData = isMobile 
  ? filteredData.slice(0, mobileLoadedCount)
  : paginatedData; // Desktop dùng pagination

// Pass to ResponsiveDataTable
<ResponsiveDataTable
  data={displayData}
  // ... other props
/>
```

#### 3.4. Loading Indicator & End Message

```typescript
{isMobile && (
  <div className="py-6 text-center">
    {mobileLoadedCount < filteredData.length ? (
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm">Đang tải thêm...</span>
      </div>
    ) : filteredData.length > 20 ? (
      <p className="text-sm text-muted-foreground">
        Đã hiển thị tất cả {filteredData.length} kết quả
      </p>
    ) : null}
  </div>
)}
```

#### 3.5. QUAN TRỌNG: Không có Pagination trên Mobile

**LƯU Ý**:
- ❌ KHÔNG tự tạo pagination controls trong mobile view
- ✅ `ResponsiveDataTable` đã tự động ẩn pagination khi isMobile
- ✅ Mobile chỉ có infinite scroll, desktop mới có pagination
- ⚠️ **VÍ DỤ SAI**: Tự render TouchButton Previous/Next trong mobile

```typescript
// ❌ SAI - Đừng làm thế này
{isMobile && (
  <div>
    <TouchButton>Previous</TouchButton>
    <TouchButton>Next</TouchButton>
  </div>
)}

// ✅ ĐÚNG - ResponsiveDataTable đã handle
<ResponsiveDataTable
  data={displayData}  // displayData đã slice theo mobileLoadedCount
  // pagination props chỉ dùng cho desktop
/>
```

**FILE THAM KHẢO**: 
- `d:\hrm2\components\data-table\responsive-data-table.tsx` line 150-185 (mobile view - KHÔNG có pagination)
- `d:\hrm2\features\employees\page.tsx` dòng ~640-660 (loading indicator)

---

### 4. Desktop Pagination

#### 4.1. Pagination State

```typescript
const [pagination, setPagination] = React.useState({ 
  pageIndex: 0, 
  pageSize: 20 
});

// Calculate pagination
const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
const paginatedData = React.useMemo(() => {
  const start = pagination.pageIndex * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filteredData.slice(start, end);
}, [filteredData, pagination.pageIndex, pagination.pageSize]);
```

#### 4.2. DataTable Pagination Controls

**Tự động có** khi dùng `ResponsiveDataTable` → `DataTable`:
- Nút Previous/Next
- Page size selector: 20/40/50/100
- Current page info: "Trang 1/10"
- Row count: "1-20 trong 185 kết quả"

**Không cần config thêm** - chỉ truyền props:

```typescript
<ResponsiveDataTable
  pageCount={pageCount}
  pagination={pagination}
  setPagination={setPagination}
  rowCount={filteredData.length}
/>
```

---

### 5. Bulk Actions & Selection

#### 5.1. Selection State

```typescript
const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

// Get selected rows
const allSelectedRows = React.useMemo(() => 
  Object.keys(rowSelection)
    .filter(key => rowSelection[key])
    .map(systemId => filteredData.find(item => item.systemId === systemId))
    .filter(Boolean) as Employee[],
  [rowSelection, filteredData]
);
```

#### 5.2. Bulk Actions Menu

```typescript
const bulkActions = [
  {
    label: 'Xuất Excel đã chọn',
    icon: Download,
    onSelect: (selectedRows: Employee[]) => {
      handleExportSelected(selectedRows);
    }
  },
  {
    label: 'In danh sách',
    icon: Printer,
    onSelect: (selectedRows: Employee[]) => {
      handlePrintSelected(selectedRows);
    }
  }
];

<ResponsiveDataTable
  rowSelection={rowSelection}
  setRowSelection={setRowSelection}
  allSelectedRows={allSelectedRows}
  onBulkDelete={handleBulkDelete}
  bulkActions={bulkActions}
  showBulkDeleteButton={true}
/>
```

#### 5.3. Bulk Delete Handler

```typescript
const handleBulkDelete = React.useCallback(() => {
  if (allSelectedRows.length === 0) return;
  
  const confirmMessage = `Bạn có chắc muốn xóa ${allSelectedRows.length} nhân viên đã chọn?`;
  if (!confirm(confirmMessage)) return;
  
  allSelectedRows.forEach(row => {
    deleteEmployee(row.systemId);
  });
  
  setRowSelection({});
  toast.success(`Đã xóa ${allSelectedRows.length} nhân viên`);
}, [allSelectedRows, deleteEmployee]);
```

---

### 6. Column Customization

#### 6.1. Column Visibility

```typescript
const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
const [columnOrder, setColumnOrder] = React.useState<string[]>([]);

// Set default visibility on mount
React.useEffect(() => {
  const defaultVisibleColumns = ['id', 'fullName', 'workEmail', 'phone', ...];
  
  const initialVisibility: Record<string, boolean> = {};
  columns.forEach(c => {
    if (c.id === 'select' || c.id === 'actions') {
      initialVisibility[c.id!] = true; // Always visible
    } else {
      initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
    }
  });
  
  setColumnVisibility(initialVisibility);
  setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
}, []); // ✅ Empty deps - run ONCE
```

#### 6.2. Column Customizer Component

```typescript
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";

// In actions array
const actions = React.useMemo(() => [
  // ... other buttons
  <DataTableColumnCustomizer
    key="columns"
    columns={columns}
    columnVisibility={columnVisibility}
    setColumnVisibility={setColumnVisibility}
    columnOrder={columnOrder}
    setColumnOrder={setColumnOrder}
  />
], [columns, columnVisibility, columnOrder]);
```

#### 6.3. Pinned Columns

```typescript
const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);

<ResponsiveDataTable
  pinnedColumns={pinnedColumns}
  setPinnedColumns={setPinnedColumns}
/>
```

**Default pins**:
- `select`: Checkbox column (left)
- `id`: ID column (left)
- `actions`: Actions column (right) - auto sticky

---

### 7. Filtering & Search

#### 7.1. Search với Fuse.js

**FILE**: `d:\hrm2\features\[your-module]\page.tsx`
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~133-180
**PACKAGE**: `fuse.js` (đã installed trong project)

```typescript
import Fuse from 'fuse.js';

const fuse = React.useMemo(() => new Fuse(employees, { 
  keys: ['id', 'fullName', 'workEmail', 'phone', 'nationalId'],
  threshold: 0.3,
  includeScore: true,
}), [employees]);

const filteredData = React.useMemo(() => {
  let result = employees;
  
  // 1. Search
  if (searchQuery) {
    result = fuse.search(searchQuery).map(r => r.item);
  }
  
  // 2. Filters
  if (statusFilter && statusFilter !== 'all') {
    result = result.filter(e => e.employmentStatus === statusFilter);
  }
  
  if (departmentFilter && departmentFilter !== 'all') {
    result = result.filter(e => e.department === departmentFilter);
  }
  
  // 3. Sorting
  if (sorting) {
    result = [...result].sort((a, b) => {
      const aValue = a[sorting.id];
      const bValue = b[sorting.id];
      
      if (aValue < bValue) return sorting.desc ? 1 : -1;
      if (aValue > bValue) return sorting.desc ? -1 : 1;
      return 0;
    });
  }
  
  return result;
}, [employees, searchQuery, statusFilter, departmentFilter, sorting, fuse]);
```

#### 7.2. Filter UI Components

**COMPONENT**: `d:\hrm2\components\data-table\data-table-faceted-filter.tsx`
**SỬ DỤNG TRONG**: `d:\hrm2\features\[your-module]\page.tsx`
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~527-550

```typescript
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx";

<DataTableFacetedFilter
  title="Trạng thái"
  selectedValue={statusFilter}
  onSelect={setStatusFilter}
  options={[
    { label: 'Tất cả', value: 'all' },
    { label: 'Đang làm việc', value: 'Đang làm việc' },
    { label: 'Nghỉ việc', value: 'Nghỉ việc' },
  ]}
/>
```

---

### 8. Import/Export

#### 8.1. Export Dialog

**COMPONENT**: `d:\hrm2\components\data-table\data-table-export-dialog.tsx`
**SỬ DỤNG TRONG**: Header actions của page.tsx
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~480-488

```typescript
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";

<DataTableExportDialog 
  data={filteredData}
  filename="danh-sach-nhan-vien"
  sheetName="Nhân viên"
  columns={[
    { header: 'Mã NV', key: 'id' },
    { header: 'Họ và tên', key: 'fullName' },
    { header: 'Email', key: 'workEmail' },
    // ... more columns
  ]}
/>
```

#### 8.2. Import Dialog

**COMPONENT**: `d:\hrm2\components\data-table\data-table-import-dialog.tsx`
**SỬ DỤNG TRONG**: Header actions của page.tsx
**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~393-420 (importConfig), dòng ~479

```typescript
import { DataTableImportDialog, type ImportConfig } from "../../components/data-table/data-table-import-dialog.tsx";

const importConfig: ImportConfig = {
  templateColumns: [
    { header: 'Mã NV*', key: 'id', required: true },
    { header: 'Họ và tên*', key: 'fullName', required: true },
    { header: 'Email', key: 'workEmail' },
  ],
  onImport: async (data) => {
    const processed = data.map(row => ({
      ...row,
      systemId: generateId('EMP'),
    }));
    
    bulkAdd(processed);
    toast.success(`Đã nhập ${processed.length} nhân viên`);
  },
  validateRow: (row) => {
    if (!row.id || !row.fullName) {
      return 'Thiếu mã NV hoặc họ tên';
    }
    return null;
  }
};

<DataTableImportDialog config={importConfig} />
```

---

## Checklist khi Copy sang Module mới

### Phase 1: Cấu hình cơ bản (Breadcrumb & Router)

**FILE 1**: `d:\hrm2\lib\breadcrumb-system.ts`
- [ ] Thêm module definition vào `MODULES` (dòng ~29+) - ĐỦ 4 actions: list/detail/edit/new
- [ ] Thêm PATH_PATTERNS (dòng ~687+) cho TẤT CẢ routes: 
  - [ ] `/your-module` → list
  - [ ] `/your-module/new` → new
  - [ ] `/your-module/:id` → detail
  - [ ] `/your-module/:id/edit` → edit
  - [ ] `/your-module/edit/:id` → edit (backward compatibility)

**FILE 2**: `d:\hrm2\lib\router.ts`
- [ ] Thêm ROUTES constants vào object `ROUTES` (dòng ~15+)
- [ ] Pattern: `YOUR_MODULE: '/your-module'`, `YOUR_MODULE_EDIT: '/your-module/:id/edit'`

**FILE 3**: `d:\hrm2\lib\route-definitions.tsx`
- [ ] Thêm routes vào array `routes` (dòng ~183+)
- [ ] Mỗi route có `path`, `element`, `meta.breadcrumb`
- [ ] ⚠️ **QUAN TRỌNG**: Breadcrumb PHẢI có `{ label: 'Trang chủ', href: '/' }` ở đầu

### Phase 2: Components

**TẠO CÁC FILE SAU** trong `d:\hrm2\features\[your-module]\`:

- [ ] `page.tsx` - List page
  - Import: `usePageHeader`, `ResponsiveDataTable`, filters, export/import
  - usePageHeader: CHỈ truyền `{ actions }` - KHÔNG truyền title
  - Tham khảo: `d:\hrm2\features\employees\page.tsx`

- [ ] `form-page.tsx` - Create/Edit form
  - Import: `usePageHeader`, `useRouteMeta`
  - usePageHeader: truyền `{ actions, breadcrumb: routeMeta?.breadcrumb }`
  - Tham khảo: `d:\hrm2\features\employees\employee-form-page.tsx`

- [ ] `columns.tsx` - Column definitions
  - select column: sticky left, size 48
  - actions column: sticky right, size 90
  - All có meta.displayName
  - Tham khảo: `d:\hrm2\features\employees\columns.tsx`

- [ ] `card.tsx` - Mobile card component
  - Dùng cho renderMobileCard prop của ResponsiveDataTable
  - Tham khảo: `d:\hrm2\features\employees\employee-card.tsx`

- [ ] `types.ts` - TypeScript types
- [ ] `store.ts` - Zustand store (nếu dùng local state)

### Phase 3: Data Table Setup

**TRONG FILE**: `d:\hrm2\features\[your-module]\page.tsx`

- [ ] Import `ResponsiveDataTable` từ `../../components/data-table/responsive-data-table.tsx`
- [ ] ⚠️ **KHÔNG import DataTable trực tiếp** - Chỉ dùng ResponsiveDataTable
- [ ] Set defaultVisibleColumns với **15-20 cột** (không phải 5-8 cột)
  - ⚠️ **LỖI THƯỜNG GẶP**: Chỉ 8 cột → không có horizontal scroll → sticky scrollbar không hiện
  - ✅ **ĐÚNG**: 15+ cột → có scroll → sticky scrollbar tự động xuất hiện
- [ ] Config pinnedColumns: `['select', 'id']`
- [ ] Truyền đầy đủ props: 
  - columns, data, renderMobileCard
  - pagination, setPagination, pageCount, rowCount
  - sorting, setSorting
  - rowSelection, setRowSelection
  - columnVisibility, setColumnVisibility
  - columnOrder, setColumnOrder
  - pinnedColumns, setPinnedColumns

**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~598-630

### Phase 4: Mobile Features

**TRONG FILE**: `d:\hrm2\features\[your-module]\page.tsx`

- [ ] Add `mobileLoadedCount` state - khởi tạo = 20
  - Code: `const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);`
  
- [ ] Add scroll listener - load thêm khi scroll 80%
  - Tham khảo dòng ~104-120 trong employees/page.tsx
  - Trigger: `scrollPercentage > 80`
  - Action: `setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length))`
  
- [ ] Reset mobileLoadedCount khi filter change
  - useEffect với deps: [searchQuery, statusFilter, ...các filter khác]
  - Code: `setMobileLoadedCount(20);`
  
- [ ] Slice data cho mobile: `const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;`

- [ ] Add loading indicator
  - Render sau ResponsiveDataTable
  - Tham khảo dòng ~640-660 trong employees/page.tsx
  
- [ ] ⚠️ **KHÔNG tự tạo pagination buttons** trong mobile
  - ResponsiveDataTable đã tự động ẩn pagination khi isMobile

**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~90-120, ~640-660

### Phase 5: Desktop Features

**TRONG FILE**: `d:\hrm2\features\[your-module]\page.tsx`

- [ ] Pagination state: `const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });`
- [ ] Calculate pageCount: `const pageCount = Math.ceil(filteredData.length / pagination.pageSize);`
- [ ] Calculate paginatedData: `const paginatedData = filteredData.slice(start, end);`
- [ ] Sticky scrollbar - **TỰ ĐỘNG** nếu có 15+ cột visible
- [ ] Sticky header - **TỰ ĐỘNG** từ DataTable

**LƯU Ý**: Không cần code thêm cho sticky features, chỉ cần đảm bảo đủ cột!

**THAM KHẢO**: `d:\hrm2\features\employees\page.tsx` dòng ~75-88

### Phase 6: Advanced Features

**TRONG FILE**: `d:\hrm2\features\[your-module]\page.tsx`

- [ ] Search với Fuse.js
  - Import: `import Fuse from 'fuse.js';`
  - Config keys: ['id', 'name', ...]
  - Tham khảo dòng ~133 trong employees/page.tsx
  
- [ ] Filters với DataTableFacetedFilter
  - Import từ `../../components/data-table/data-table-faceted-filter.tsx`
  - Tham khảo dòng ~527-550 trong employees/page.tsx
  
- [ ] Bulk actions với dropdown menu
  - Config bulkActions array
  - handleBulkDelete function
  - Tham khảo dòng ~350-390 trong employees/page.tsx
  
- [ ] Export dialog
  - Import DataTableExportDialog
  - Thêm vào header actions
  - Tham khảo dòng ~480-488 trong employees/page.tsx
  
- [ ] Import dialog
  - Import DataTableImportDialog
  - Config importConfig với validateRow
  - Tham khảo dòng ~393-420, ~479 trong employees/page.tsx
  
- [ ] Column customizer
  - Import DataTableColumnCustomizer
  - Thêm vào header actions
  - Tham khảo dòng ~490-496 trong employees/page.tsx

---

## Ví dụ Implementation hoàn chỉnh

### File structure mẫu:

```
d:\hrm2\features\
  your-module\
    page.tsx          # List page với ResponsiveDataTable + infinite scroll
    form-page.tsx     # Create/Edit form với dynamic breadcrumb
    columns.tsx       # Column definitions (select left, actions right)
    types.ts          # TypeScript types
    store.ts          # Zustand store (optional)
    card.tsx          # Mobile card component
```

### TEMPLATE: `d:\hrm2\features\[your-module]\page.tsx`

**COPY TỪ**: `d:\hrm2\features\employees\page.tsx` (toàn bộ file)
**SỬA ĐỔI**:

```typescript
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { Plus, Download, Upload } from 'lucide-react';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { DataTableExportDialog } from '../../components/data-table/data-table-export-dialog.tsx';
import { DataTableImportDialog } from '../../components/data-table/data-table-import-dialog.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useBreakpoint } from '../../contexts/breakpoint-context.tsx';
import { useYourStore } from './store.ts';
import { getColumns } from './columns.tsx';
import { YourCard } from './card.tsx';

export function YourPage() {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { data, add, update, remove } = useYourStore();
  
  // States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState({ id: 'id', desc: false });
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  
  // Columns
  const columns = React.useMemo(() => 
    getColumns(remove, (item) => navigate(`/your-module/${item.systemId}/edit`), navigate),
    [remove, navigate]
  );
  
  // Default column visibility - RUN ONCE
  React.useEffect(() => {
    const defaultVisibleColumns = ['id', 'name', 'status', /* ... 15-20 columns */];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, []);
  
  // Search & Filter
  const fuse = React.useMemo(() => new Fuse(data, { 
    keys: ['id', 'name'],
    threshold: 0.3,
  }), [data]);
  
  const filteredData = React.useMemo(() => {
    let result = data;
    if (searchQuery) result = fuse.search(searchQuery).map(r => r.item);
    if (statusFilter !== 'all') result = result.filter(item => item.status === statusFilter);
    return result;
  }, [data, searchQuery, statusFilter, fuse]);
  
  // Pagination
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination]);
  
  // Mobile infinite scroll
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [searchQuery, statusFilter]);
  
  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const scrollPercentage = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      if (scrollPercentage > 80 && mobileLoadedCount < filteredData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredData.length]);
  
  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;
  
  // Header actions
  const actions = React.useMemo(() => [
    <DataTableExportDialog key="export" data={filteredData} filename="export" />,
    <DataTableImportDialog key="import" config={importConfig} />,
    <DataTableColumnCustomizer 
      key="columns"
      columns={columns}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      columnOrder={columnOrder}
      setColumnOrder={setColumnOrder}
    />,
    <Button key="add" onClick={() => navigate('/your-module/new')}>
      <Plus className="mr-2 h-4 w-4" />
      Thêm mới
    </Button>
  ], [filteredData, columns, columnVisibility, columnOrder, navigate]);
  
  usePageHeader({ actions });
  
  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex gap-2">
        <Input 
          placeholder="Tìm kiếm..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <DataTableFacetedFilter
          title="Trạng thái"
          selectedValue={statusFilter}
          onSelect={setStatusFilter}
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Hoạt động', value: 'active' },
          ]}
        />
      </div>
      
      {/* Data Table */}
      <ResponsiveDataTable
        columns={columns}
        data={displayData}
        renderMobileCard={(item) => <YourCard item={item} />}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
      />
      
      {/* Mobile loading indicator */}
      {isMobile && mobileLoadedCount < filteredData.length && (
        <div className="text-center py-4">Đang tải thêm...</div>
      )}
    </div>
  );
}
```

---

## Tổng kết

### ⚠️ 3 LỖI THƯỜNG GẶP NHẤT (Đã fix cho Receipts/Payments)

#### Lỗi 1: Header/Breadcrumb không hiển thị
**NGUYÊN NHÂN**:
- Thiếu `edit` action trong MODULES (breadcrumb-system.ts)
- Thiếu PATH_PATTERNS cho `/your-module/:id/edit`
- Breadcrumb thiếu `{ label: 'Trang chủ', href: '/' }` ở đầu

**FIX CHO RECEIPTS** (commit nãy):
```typescript
// File: d:\hrm2\lib\breadcrumb-system.ts

// ❌ TRƯỚC (thiếu edit):
RECEIPTS: {
  list: { title: '...' },
  detail: { title: '...' },
  new: { title: '...' }
  // THIẾU edit!
}

// ✅ SAU (đã thêm edit):
RECEIPTS: {
  list: { title: '...' },
  detail: { title: '...' },
  edit: {  // ← THÊM DÒNG NÀY
    title: (code) => code ? `Chỉnh sửa ${code}` : 'Chỉnh sửa phiếu thu',
    description: 'Cập nhật thông tin phiếu thu'
  },
  new: { title: '...' }
}

// ❌ TRƯỚC (thiếu PATH_PATTERNS):
'/receipts/:id': { module: 'FINANCE', section: 'RECEIPTS', action: 'detail' },
// THIẾU edit routes!

// ✅ SAU (đã thêm):
'/receipts/:id': { module: 'FINANCE', section: 'RECEIPTS', action: 'detail' },
'/receipts/:id/edit': { module: 'FINANCE', section: 'RECEIPTS', action: 'edit' },  // ← THÊM
'/receipts/edit/:id': { module: 'FINANCE', section: 'RECEIPTS', action: 'edit' },  // ← THÊM

// ❌ TRƯỚC (breadcrumb thiếu Trang chủ):
breadcrumb: [
  { label: 'Phiếu thu', href: '/receipts' },
  'Chỉnh sửa'
]

// ✅ SAU:
breadcrumb: [
  { label: 'Trang chủ', href: '/' },  // ← THÊM DÒNG NÀY
  { label: 'Phiếu thu', href: '/receipts' },
  'Chỉnh sửa'
]
```

**FILE ĐÃ SỬA**:
- `d:\hrm2\lib\breadcrumb-system.ts` (line ~291-331: thêm edit section)
- `d:\hrm2\lib\breadcrumb-system.ts` (line ~755-762: thêm PATH_PATTERNS)
- `d:\hrm2\lib\route-definitions.tsx` (line ~612-680: thêm Trang chủ vào breadcrumb)

---

#### Lỗi 2: Sticky Scrollbar không xuất hiện
**NGUYÊN NHÂN**: Chỉ hiển thị 5-8 cột → không đủ rộng → không có horizontal scroll

**FIX CHO RECEIPTS** (commit nãy):
```typescript
// File: d:\hrm2\features\receipts\page.tsx (line ~120)

// ❌ TRƯỚC (chỉ 8 cột):
const defaultVisibleColumns = [
  'id', 'date', 'amount', 'targetName', 
  'voucherCategoryName', 'branchName', 'status', 'createdBy'
];

// ✅ SAU (15 cột - đủ để scroll):
const defaultVisibleColumns = [
  'id', 'voucherCategoryName', 'date', 'createdAt', 'recognitionDate', 
  'status', 'amount', 'runningBalance', 'targetName', 'affectsDebt',
  'branchName', 'originalDocumentId', 'createdBy', 'paymentMethod', 'accountId'
];
```

**GIẢI THÍCH**:
- StickyScrollbar component đã tồn tại trong DataTable (line 518)
- Chỉ hiện khi `table.scrollWidth > table.clientWidth`
- 8 cột không đủ rộng trên màn hình lớn → không scroll → không hiện scrollbar
- 15 cột chắc chắn tạo scroll → scrollbar xuất hiện

**FILE ĐÃ SỬA**:
- `d:\hrm2\features\receipts\page.tsx` (line ~120-126)
- `d:\hrm2\features\payments\page.tsx` (line ~120-126)

---

#### Lỗi 3: Mobile có pagination buttons (SAI!)
**NGUYÊN NHÂN**: Tự tạo TouchButton Previous/Next trong mobile view

**ĐÚNG**: ResponsiveDataTable tự động ẩn pagination khi isMobile

```typescript
// ❌ SAI - Đừng tự tạo pagination trong mobile:
{isMobile && (
  <div>
    <TouchButton>Previous</TouchButton>
    <TouchButton>Next</TouchButton>
  </div>
)}

// ✅ ĐÚNG - Chỉ infinite scroll:
{isMobile && mobileLoadedCount < filteredData.length && (
  <div className="text-center py-4">
    <div className="animate-spin..." />
    Đang tải thêm...
  </div>
)}
```

**FILE THAM KHẢO**:
- `d:\hrm2\components\data-table\responsive-data-table.tsx` (line 150-185: mobile KHÔNG có pagination)
- `d:\hrm2\features\employees\page.tsx` (line ~640-660: chỉ có loading indicator)

---

### ✅ QUY TẮC VÀNG khi Copy từ Employees

1. **Header/Breadcrumb**:
   - ✅ PHẢI có đủ 4 actions trong MODULES: `list`, `detail`, `edit`, `new`
   - ✅ PHẢI có PATH_PATTERNS cho TẤT CẢ routes (kể cả :id/edit và edit/:id)
   - ✅ Breadcrumb PHẢI có "Trang chủ" ở đầu
   - ✅ List page: CHỈ truyền `actions` cho usePageHeader
   - ✅ Form page: Truyền `actions` + `breadcrumb`

2. **Sticky Scrollbar**:
   - ✅ Hiển thị 15-20 cột mặc định (không phải 5-8)
   - ✅ Dùng ResponsiveDataTable (không dùng DataTable trực tiếp)
   - ✅ Không cần code thêm - scrollbar tự động render

3. **Mobile Infinite Scroll**:
   - ✅ Load 20 items ban đầu
   - ✅ Scroll listener trigger ở 80%
   - ✅ Reset về 20 khi filter change
   - ✅ KHÔNG tự tạo pagination buttons
   - ✅ Chỉ cần loading indicator

4. **File References**:
   - ✅ Copy từ `d:\hrm2\features\employees\page.tsx` → thay đổi tên entity
   - ✅ Breadcrumb config ở `d:\hrm2\lib\breadcrumb-system.ts`
   - ✅ Routes ở `d:\hrm2\lib\router.ts` và `d:\hrm2\lib\route-definitions.tsx`

---

### 📁 Quick Reference - File Locations

**Cấu hình cơ bản** (sửa 3 files):
1. `d:\hrm2\lib\breadcrumb-system.ts` - MODULES + PATH_PATTERNS
2. `d:\hrm2\lib\router.ts` - ROUTES constants
3. `d:\hrm2\lib\route-definitions.tsx` - Route array với breadcrumb

**Components** (tạo trong `d:\hrm2\features\[your-module]\`):
1. `page.tsx` - List page (copy từ employees/page.tsx)
2. `form-page.tsx` - Form page (copy từ employees/employee-form-page.tsx)
3. `columns.tsx` - Columns (copy từ employees/columns.tsx)
4. `card.tsx` - Mobile card (copy từ employees/employee-card.tsx)
5. `types.ts`, `store.ts` - Types & Store

**Shared components** (đã có, chỉ import):
- `d:\hrm2\components\data-table\responsive-data-table.tsx`
- `d:\hrm2\components\data-table\data-table-faceted-filter.tsx`
- `d:\hrm2\components\data-table\data-table-column-toggle.tsx`
- `d:\hrm2\components\data-table\data-table-export-dialog.tsx`
- `d:\hrm2\components\data-table\data-table-import-dialog.tsx`

---

## 🚀 CÁCH VIẾT PROMPT ĐỂ COPILOT TỰ ĐỘNG COPY

### Template Prompt Chuẩn:

```
Đọc file `d:\hrm2\docs\copy-employee-features-guide.md` và áp dụng TẤT CẢ 
tính năng từ Employees vào module [TÊN MODULE].

Yêu cầu:
1. Header & Breadcrumb (4 actions: list, detail, edit, new)
2. Sticky scrollbar (15-20 cột visible)
3. Mobile infinite scroll
4. Desktop pagination
5. Bulk actions & selection
6. Import/Export
7. Column customizer
8. Search & Filters

Module info:
- Tên: [TÊN TIẾNG VIỆT] (ví dụ: Sản phẩm)
- Path: /[path] (ví dụ: /products)
- Section: [SECTION] trong ROUTES (ví dụ: INVENTORY)
- Entity type: [Type] (ví dụ: Product)

Làm theo đúng checklist trong document, bao gồm:
- Phase 1: Sửa 3 files breadcrumb/router
- Phase 2-6: Tạo components mới
- Test sau khi hoàn thành
```

### Ví dụ Prompt Cụ Thể:

**Prompt 1: Copy toàn bộ cho Products**
```
Đọc file `d:\hrm2\docs\copy-employee-features-guide.md` và áp dụng TẤT CẢ 
tính năng từ Employees vào module Sản phẩm (Products).

Module info:
- Tên: Sản phẩm
- Path: /products
- Section: INVENTORY.PRODUCTS trong breadcrumb-system.ts
- Entity: Product với fields: id, name, sku, price, category, stock

Làm đầy đủ 6 phases, đặc biệt chú ý:
- 15 cột visible để có sticky scrollbar
- Breadcrumb có "Trang chủ"
- Mobile infinite scroll 20 items
```

**Prompt 2: Chỉ update Header/Breadcrumb**
```
Đọc phần "1. Header & Breadcrumb System" trong file 
`d:\hrm2\docs\copy-employee-features-guide.md` và fix cho module Khách hàng.

Chỉ làm Phase 1:
- Thêm CUSTOMERS vào MODULES với 4 actions (list, detail, edit, new)
- Thêm PATH_PATTERNS cho /customers/:id/edit
- Sửa route-definitions.tsx thêm "Trang chủ" vào breadcrumb
```

**Prompt 3: Chỉ update Sticky Scrollbar**
```
Đọc phần "2.2. Desktop: Sticky Scrollbar" trong file 
`d:\hrm2\docs\copy-employee-features-guide.md` và fix cho module Đơn hàng.

Tăng defaultVisibleColumns từ 8 lên 15 cột theo hướng dẫn để sticky scrollbar xuất hiện.
File cần sửa: d:\hrm2\features\orders\page.tsx
```

**Prompt 4: Chỉ thêm Mobile Infinite Scroll**
```
Đọc phần "3. Mobile Infinite Scroll" trong file 
`d:\hrm2\docs\copy-employee-features-guide.md` và thêm cho module Nhà cung cấp.

Làm Phase 4:
- Add mobileLoadedCount state
- Add scroll listener (80% trigger)
- Reset khi filter change
- Loading indicator
- Slice data: displayData = isMobile ? slice : paginatedData
```

### Pattern chung:

```
Đọc [PHẦN CỤ THỂ] trong file `d:\hrm2\docs\copy-employee-features-guide.md` 
và [HÀNH ĐỘNG] cho module [TÊN MODULE].

[CHI TIẾT YÊU CẦU]
```

### Các từ khóa quan trọng trong prompt:

- ✅ "Đọc file `d:\hrm2\docs\copy-employee-features-guide.md`" → Copilot sẽ load document
- ✅ "Áp dụng TẤT CẢ tính năng" → Copy full features
- ✅ "Làm theo checklist" → Follow từng phase
- ✅ "Theo hướng dẫn trong document" → Reference guide
- ✅ "Tham khảo ví dụ lỗi" → Tránh lỗi thường gặp

### Khi nào dùng prompt nào?

| Tình huống | Prompt Type | Ví dụ |
|------------|-------------|-------|
| **Tạo module hoàn toàn mới** | Copy toàn bộ (Full) | "Copy TẤT CẢ từ Employees sang Products" |
| **Module có sẵn, thiếu header** | Chỉ Phase 1 | "Fix header/breadcrumb cho Customers" |
| **Có table nhưng thiếu sticky scrollbar** | Chỉ Phase 3 | "Tăng cột visible cho Orders" |
| **Desktop OK, thiếu mobile scroll** | Chỉ Phase 4 | "Thêm infinite scroll cho Suppliers" |
| **Thiếu import/export** | Chỉ Phase 6 | "Thêm import/export cho Invoices" |

---

## 🎯 QUY TRÌNH LÀM VIỆC VỚI COPILOT

### Bước 1: Xác định cần gì
- ❓ Tạo module mới từ đầu? → Full copy
- ❓ Module có sẵn nhưng thiếu tính năng? → Partial copy
- ❓ Chỉ fix 1 bug cụ thể? → Đọc phần tương ứng

### Bước 2: Viết prompt
```
Đọc file `d:\hrm2\docs\copy-employee-features-guide.md` và [YÊU CẦU CỤ THỂ]
```

### Bước 3: Copilot thực hiện
- Copilot sẽ đọc document
- Follow checklist từng phase
- Apply code từ examples
- Tránh lỗi thường gặp (có trong document)

### Bước 4: Verify
```
✅ Header hiển thị đúng?
✅ Breadcrumb có "Trang chủ"?
✅ Sticky scrollbar xuất hiện khi scroll ngang?
✅ Mobile có infinite scroll (không có pagination)?
✅ Desktop có pagination?
```

---

**Copy từ Employees** là cách an toàn và nhanh nhất để có UI/UX nhất quán! ✨
