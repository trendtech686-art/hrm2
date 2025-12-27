# Page Layout Guidelines - Quy Tac Bo Cuc Trang

> **Tai lieu chuan hoa:** Breadcrumb, Header, Actions, Toolbar, Filters, Router
> **Trang mau:** `/employees` - Danh sach nhan vien

---

## Tong Quan Cau Truc

Moi trang danh sach trong he thong co bo cuc **3 tang**:

```
+------------------------------------------------------------------+
|  HANG 1: PAGE HEADER (Breadcrumb + Title + Actions)              |
|  +--------------------------------------------------------------+|
|  | [Home] Trang chu > Nhan vien       [Trash2] Thung rac  [Plus]||
|  | Danh sach nhan vien                                          ||
|  +--------------------------------------------------------------+|
+------------------------------------------------------------------+
|  HANG 2: TOOLBAR (Import/Export + Column Toggle)                 |
|  +--------------------------------------------------------------+|
|  | [Upload] Nhap file  [Download] Xuat file    [Settings2] Dieu ||
|  +--------------------------------------------------------------+|
+------------------------------------------------------------------+
|  HANG 3: FILTERS (Search + Faceted Filters)                      |
|  +--------------------------------------------------------------+|
|  | [Search] Tim kiem...  Chi nhanh   Phong ban   Trang thai     ||
|  +--------------------------------------------------------------+|
+------------------------------------------------------------------+
|  HANG 4: DATA TABLE                                              |
|  +--------------------------------------------------------------+|
|  |  [ ] | Ho va ten | SDT | Email | Chi nhanh | ... | Hanh dong ||
|  +--------------------------------------------------------------+|
+------------------------------------------------------------------+
```

---

## 1. ROUTER - Cau Hinh Dinh Tuyen

### 1.1 File Router Chinh

**File:** `lib/router.ts`

```typescript
export const ROUTES = {
  // HRM
  HRM: {
    EMPLOYEES: '/employees',
    EMPLOYEE_NEW: '/employees/new',
    EMPLOYEE_EDIT: '/employees/:systemId/edit',
    EMPLOYEE_VIEW: '/employees/:systemId',
  },
  
  // Sales
  SALES: {
    CUSTOMERS: '/customers',
    CUSTOMER_NEW: '/customers/new', 
    CUSTOMER_EDIT: '/customers/:systemId/edit',
    CUSTOMER_VIEW: '/customers/:systemId',
  },
  // ...
};
```

### 1.2 Quy Tac URL Pattern

| Loai Trang | URL Pattern | Vi du |
|------------|-------------|-------|
| **List** | `/{module}` | `/employees`, `/customers` |
| **New** | `/{module}/new` | `/employees/new` |
| **Detail** | `/{module}/:systemId` | `/employees/NV00000001` |
| **Edit** | `/{module}/:systemId/edit` | `/employees/NV00000001/edit` |
| **Trash** | `/{module}/trash` | `/employees/trash` |

### 1.3 Su Dung generatePath

```typescript
import { ROUTES, generatePath } from '../../lib/router.ts';

// Navigate to detail page
navigate(generatePath(ROUTES.HRM.EMPLOYEE_VIEW, { systemId: employee.systemId }));

// Navigate to edit page  
navigate(generatePath(ROUTES.HRM.EMPLOYEE_EDIT, { systemId: employee.systemId }));

// Link trong table
<Link to={generatePath(ROUTES.SALES.CUSTOMER_VIEW, { systemId: row.systemId })}>
  {row.name}
</Link>
```

---

## 2. PAGE HEADER - Tieu De Trang

### 2.1 Cau Truc

- **Vi tri:** Render trong `layout.tsx` boi `<PageHeader />` component
- **Cau hinh:** Su dung hook `usePageHeader()` trong moi page

### 2.2 Thanh Phan

| Thanh Phan | Mo Ta | Vi Tri |
|------------|-------|--------|
| **Breadcrumb** | Duong dan dieu huong | Tren cung, ben trai |
| **Title** | Tieu de trang | Duoi breadcrumb |
| **Badge** | Trang thai (canh title) | Ngay sau title |
| **Actions** | Nut hanh dong chinh | Ben phai |

**LUU Y QUAN TRONG:**
- ❌ **KHONG dung subtitle** - Bo hoan toan
- ❌ **KHONG dung docLink** - Bo link external (vd: "Chuoi HR Attendance")
- ❌ **KHONG dung emoji** - Chi dung Lucide icons

### 2.3 Quy Tac Title Theo Loai Trang

| Loai Trang | Title Format | Vi Du |
|------------|--------------|-------|
| **List** | `Danh sach {module}` | "Danh sach nhan vien" |
| **New** | `Them {module} moi` | "Them nhan vien moi" |
| **Detail** | `{Ten entity}` | "Le Van C" (KHONG dung "Chi tiet NV00000003") |
| **Edit** | `Chinh sua {Ten entity}` | "Chinh sua Le Van C" |
| **Trash** | `Thung rac {module}` | "Thung rac nhan vien" |

**QUAN TRONG:** 
- Detail/Edit page PHAI hien thi TEN thuc te, KHONG dung ma ID
- Dung: "Le Van C", "Nguyen Van A", "Cong ty ABC"  
- Sai: "Chi tiet NV00000003", "Khach hang KH00000001"

### 2.4 Quy Tac Breadcrumb

| Loai Trang | Breadcrumb Format | Vi Du |
|------------|-------------------|-------|
| **List** | `Trang chu > {Module}` | Trang chu > Nhan vien |
| **New** | `Trang chu > {Module} > Them moi` | Trang chu > Nhan vien > Them moi |
| **Detail** | `Trang chu > {Module} > {Ten}` | Trang chu > Nhan vien > Le Van C |
| **Edit** | `Trang chu > {Module} > {Ten} > Chinh sua` | Trang chu > Nhan vien > Le Van C > Chinh sua |
| **Trash** | `Trang chu > {Module} > Thung rac` | Trang chu > Nhan vien > Thung rac |

### 2.5 Cach Su Dung usePageHeader

```typescript
import { usePageHeader } from '../../contexts/page-header-context.tsx';

// LIST PAGE
usePageHeader({
  title: 'Danh sach nhan vien',
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Nhan vien', href: '/employees', isCurrent: true },
  ],
  actions: [
    <Button key="trash" variant="outline" onClick={() => navigate('/employees/trash')}>
      <Trash2 className="mr-2 h-4 w-4" />
      Thung rac ({deletedCount})
    </Button>,
    <Button key="add" onClick={() => navigate('/employees/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Them nhan vien
    </Button>
  ],
  showBackButton: false,
});

// DETAIL PAGE - Hien thi TEN, khong dung ID
usePageHeader({
  title: employee.fullName, // "Le Van C" - KHONG dung "Chi tiet NV00000003"
  subtitle: `${employee.jobTitle} - ${employee.department}`,
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Nhan vien', href: '/employees', isCurrent: false },
    { label: employee.fullName, href: `/employees/${employee.systemId}`, isCurrent: true },
  ],
  actions: [
    <Button key="edit" variant="outline" onClick={() => navigate(`/employees/${employee.systemId}/edit`)}>
      <Edit className="mr-2 h-4 w-4" />
      Chinh sua
    </Button>
  ],
  showBackButton: true,
});

// EDIT PAGE
usePageHeader({
  title: `Chinh sua ${employee.fullName}`, // "Chinh sua Le Van C"
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Nhan vien', href: '/employees', isCurrent: false },
    { label: employee.fullName, href: `/employees/${employee.systemId}`, isCurrent: false },
    { label: 'Chinh sua', href: `/employees/${employee.systemId}/edit`, isCurrent: true },
  ],
  showBackButton: true,
});

// NEW PAGE
usePageHeader({
  title: 'Them nhan vien moi',
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Nhan vien', href: '/employees', isCurrent: false },
    { label: 'Them moi', href: '/employees/new', isCurrent: true },
  ],
  showBackButton: true,
});
```

### 2.6 Quy Tac Actions

| Loai Action | Variant | Icon (Lucide) | Vi Tri |
|-------------|---------|---------------|--------|
| **Thung rac** | `outline` | `Trash2` | Trai |
| **Them moi** | `default` | `PlusCircle` | Phai (cuoi) |
| **In / Export** | `outline` | `Printer` / `Download` | Giua |
| **Chinh sua** | `outline` | `Edit` | - |
| **Xoa** | `destructive` | `Trash2` | - |

**Quy Tac Icon:**
- Chi su dung icon tu thu vien `lucide-react`
- KHONG su dung emoji trong UI
- Icon phai co `className="mr-2 h-4 w-4"` khi di kem text

### 2.7 QUAN TRONG: PHAN BIET ACTION CHINH VA ACTION PHU

> **ACTION PHU KHONG DUOC NAM TRONG PAGEHEADER**

#### Action CHINH (duoc phep trong PageHeader):
- **Trang List:** "Them moi", "Thung rac"
- **Trang Detail:** "Chinh sua", "Xoa", "Huy", Cac action nghiep vu chinh (Duyet, Tu choi, Hoan thanh...)
- **Trang Form:** "Luu", "Huy"

#### Action PHU (PHAI dat trong Toolbar, KHONG DUOC trong PageHeader):
- Xuat file / Nhap file
- Dieu chinh cot
- Bao cao / Thong ke
- Luong nghiep vu (vd: "Luong phieu thu/chi")
- Link external (vd: "Chuoi HR Attendance")
- Bat ky action khong truc tiep tao/sua/xoa entity

#### Vi du SAI - Trang So Quy hien tai:
```tsx
// SAI - Qua nhieu action trong PageHeader
usePageHeader({
  title: 'So quy',
  subtitle: '12 giao dich...',              // SAI - khong dung subtitle
  actions: [
    <Button>Luong phieu thu/chi</Button>,   // SAI - action phu
    <Button>Xuat file</Button>,              // SAI - phai o toolbar
    <Button>Dieu chinh cot</Button>,         // SAI - phai o toolbar  
    <Button>Bao cao</Button>,                // SAI - phai o toolbar
    <Button>Lap Phieu Chi</Button>,          // DUNG - action chinh
    <Button>Lap Phieu Thu</Button>,          // DUNG - action chinh
  ]
});
```

#### Vi du DUNG:
```tsx
// DUNG - Chi action chinh trong PageHeader
usePageHeader({
  title: 'So quy',
  // KHONG co subtitle
  actions: [
    <Button variant="outline">Lap Phieu Chi</Button>,
    <Button>Lap Phieu Thu</Button>,
  ]
});

// Action phu dat trong Toolbar (trong component)
<PageToolbar
  leftActions={
    <>
      <Button variant="outline" size="sm">
        <ExternalLink className="mr-2 h-4 w-4" />
        Luong phieu thu/chi
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Xuat file
      </Button>
      <Button variant="outline" size="sm">
        <BarChart3 className="mr-2 h-4 w-4" />
        Bao cao
      </Button>
    </>
  }
  rightActions={
    <DataTableColumnCustomizer ... />
  }
/>
```

### 2.8 Vi Tri Nut In / Sao Chep / Badge

Tren trang detail, thu tu hien thi:

```
[<- Back] [Printer In] [Copy Sao chep]  TITLE  [BADGE]     [Actions]
```

- **Nut In, Sao chep:** Dat BEN TRAI cua title
- **Badge:** Dat NGAY SAU title (ben phai)
- **Actions chinh:** Dat BEN PHAI cung

---

## 3. TOOLBAR (PageToolbar)

### 3.1 Cau Truc

- **Component:** `<PageToolbar />`
- **File:** `components/layout/page-toolbar.tsx`
- **Chi hien thi:** Desktop only (`!isMobile`)

### 3.2 Bo Cuc

```
+--------------------------------------------------------------+
|  [Upload] Nhap file  [Download] Xuat file   [Settings2] Dieu |
|  <- leftActions                              rightActions ->  |
+--------------------------------------------------------------+
```

### 3.3 Cach Su Dung

```typescript
import { PageToolbar } from "../../components/layout/page-toolbar.tsx";
import { DataTableImportDialog } from "../../components/data-table/data-table-import-dialog.tsx";
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";

// Chi render tren Desktop
{!isMobile && (
  <PageToolbar
    leftActions={
      <>
        <DataTableImportDialog config={importConfig} />
        <DataTableExportDialog 
          allData={employees} 
          filteredData={sortedData} 
          pageData={paginatedData} 
          config={exportConfig} 
        />
      </>
    }
    rightActions={
      <DataTableColumnCustomizer
        columns={columns}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        onResetToDefault={resetColumnLayout}
      />
    }
  />
)}
```

---

## 4. FILTERS (PageFilters)

### 4.1 Cau Truc

- **Component:** `<PageFilters />`
- **File:** `components/layout/page-filters.tsx`

### 4.2 Bo Cuc

```
+--------------------------------------------------------------+
|  [Search] Tim kiem nhan vien...  [Chi nhanh] [Phong ban] ... |
|  <- Search                       <- Filters (children) ->    |
+--------------------------------------------------------------+
```

### 4.3 Cach Su Dung

```typescript
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";

<PageFilters
  searchValue={globalFilter}
  onSearchChange={setGlobalFilter}
  searchPlaceholder="Tim kiem nhan vien (ten, ma, email, SDT)..."
>
  {/* Select Filter - Chi nhanh */}
  <Select value={branchFilter} onValueChange={setBranchFilter}>
    <SelectTrigger className="w-full sm:w-[180px] h-9">
      <SelectValue placeholder="Tat ca chi nhanh" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Tat ca chi nhanh</SelectItem>
      {branches.map(b => (
        <SelectItem key={b.systemId} value={b.systemId}>
          {b.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>

  {/* Faceted Filter - Phong ban */}
  <DataTableFacetedFilter
    title="Phong ban"
    options={departmentOptions}
    selectedValues={departmentFilter}
    onSelectedValuesChange={setDepartmentFilter}
  />

  {/* Faceted Filter - Trang thai */}
  <DataTableFacetedFilter
    title="Trang thai"
    options={statusOptions}
    selectedValues={statusFilter}
    onSelectedValuesChange={setStatusFilter}
  />
</PageFilters>
```

### 4.4 Loai Filter

| Loai | Component | Use Case |
|------|-----------|----------|
| **Select** | `<Select>` | Single choice, co "Tat ca" option |
| **Faceted** | `<DataTableFacetedFilter>` | Multi-choice, badge count |
| **Date Range** | `<DateRangePicker>` | Loc theo khoang thoi gian |

---

## 5. DATA IMPORT/EXPORT

### 5.1 Export Dialog

```typescript
const exportConfig = {
  fileName: 'Danh_sach_Nhan_vien', // Ten file xuat
  columns, // Columns de chon xuat
}

<DataTableExportDialog 
  allData={employees}        // Tat ca data
  filteredData={sortedData}  // Data sau filter
  pageData={paginatedData}   // Data tren trang hien tai
  config={exportConfig} 
/>
```

**Tinh nang:**
- Chon scope: Tat ca / Da loc / Trang hien tai
- Chon cot muon xuat
- Xuat file `.xlsx`

### 5.2 Import Dialog

```typescript
const importConfig: ImportConfig<Employee> = {
  importer: (items) => addMultiple(items),
  fileName: 'Mau_Nhap_Nhan_vien',     // Ten file mau
  existingData: employees,             // Data hien co (check duplicate)
  getUniqueKey: (item) => item.id || item.nationalId || item.workEmail
}

<DataTableImportDialog config={importConfig} />
```

**Tinh nang:**
- Drag & drop hoac chon file
- Preview data truoc khi import
- Hien thi trang thai: Moi / Cap nhat / Trung
- Chon rows muon import
- Tai file mau

---

## 6. DIEU CHINH COT (Column Customizer)

### 6.1 Cau Hinh State

```typescript
const COLUMN_LAYOUT_STORAGE_KEY = 'employees-column-layout';

// State
const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

// Persist to localStorage
React.useEffect(() => {
  window.localStorage.setItem(COLUMN_LAYOUT_STORAGE_KEY, JSON.stringify({
    visibility: columnVisibility,
    order: columnOrder,
    pinned: pinnedColumns,
  }));
}, [columnVisibility, columnOrder, pinnedColumns]);

// Reset handler
const resetColumnLayout = React.useCallback(() => {
  setColumnVisibility(buildDefaultVisibility());
  setColumnOrder(buildDefaultOrder());
  setPinnedColumns([]);
  window.localStorage.removeItem(COLUMN_LAYOUT_STORAGE_KEY);
  toast.success('Da khoi phuc bo cuc cot mac dinh');
}, []);
```

### 6.2 Component

```typescript
<DataTableColumnCustomizer
  columns={columns}
  columnVisibility={columnVisibility}
  setColumnVisibility={setColumnVisibility}
  columnOrder={columnOrder}
  setColumnOrder={setColumnOrder}
  pinnedColumns={pinnedColumns}
  setPinnedColumns={setPinnedColumns}
  onResetToDefault={resetColumnLayout}
/>
```

**Tinh nang:**
- Bat/tat cot (Checkbox)
- Ghim cot - Pin (Pin icon)
- Keo tha doi thu tu (GripVertical icon)
- Tim kiem cot (Search icon)
- Khoi phuc mac dinh (RotateCcw icon)

---

## 7. BREADCRUMB SYSTEM

### 7.1 File Cau Hinh

**File:** `lib/breadcrumb-system.ts`

### 7.2 Module Definitions

Moi module duoc dinh nghia trong `MODULES` object voi cau truc:

```typescript
EMPLOYEES: {
  key: 'employees',
  name: 'Nhan vien',
  icon: 'User',           // Ten icon tu lucide-react
  list: {
    title: 'Danh sach nhan vien',
    description: 'Quan ly thong tin va ho so nhan vien'
  },
  detail: {
    title: (name) => name ? `Ho so ${name}` : 'Chi tiet nhan vien',
    description: 'Thong tin chi tiet va lich su lam viec'
  },
  edit: {
    title: (name) => name ? `Chinh sua ${name}` : 'Chinh sua nhan vien',
    description: 'Cap nhat thong tin nhan vien'
  },
  new: {
    title: 'Them nhan vien moi',
    description: 'Tao ho so nhan vien moi trong he thong'
  }
}
```

### 7.3 Context Name Priority

Khi hien thi ten trong breadcrumb/title, he thong uu tien:

1. **context.fullName** - Ten day du (nhan vien)
2. **context.name** - Ten (khach hang, san pham)
3. **context.title** - Tieu de (bai viet, wiki)
4. **context.displayName** - Ten hien thi
5. **context.id** - Ma code (NV001, KH001) - chi dung khi khong co ten

**Vi du:**
```typescript
// Truyen context voi ten thuc te
usePageHeader({
  context: {
    fullName: employee.fullName,  // "Le Van C"
    id: employee.id               // "NV00000003"
  }
});
// => Breadcrumb se hien thi "Le Van C", khong phai "NV00000003"
```

---

## 8. RESPONSIVE

### 8.1 Desktop vs Mobile

| Thanh Phan | Desktop | Mobile |
|------------|---------|--------|
| Page Header | Full | Full |
| Toolbar | Hien thi | An |
| Filters | 1 hang | Stack |
| Table | Table view | Card view |

### 8.2 Check Mobile

```typescript
import { useMediaQuery } from "../../lib/use-media-query.ts";

const isMobile = !useMediaQuery("(min-width: 768px)");

{!isMobile && <PageToolbar ... />}
```

---

## 9. LUCIDE ICONS - Danh Sach Icon Thuong Dung

### 9.1 Navigation & Actions

| Icon | Ten | Su Dung |
|------|-----|---------|
| `Home` | Trang chu | Breadcrumb |
| `ArrowLeft` | Quay lai | Back button |
| `PlusCircle` | Them moi | Add action |
| `Edit` | Chinh sua | Edit action |
| `Trash2` | Xoa | Delete action |
| `MoreHorizontal` | Menu | Dropdown trigger |

### 9.2 Toolbar

| Icon | Ten | Su Dung |
|------|-----|---------|
| `Upload` | Nhap file | Import |
| `Download` | Xuat file | Export |
| `Settings2` | Cai dat | Column customizer |
| `Search` | Tim kiem | Search input |
| `Filter` | Loc | Filter |

### 9.3 Status

| Icon | Ten | Su Dung |
|------|-----|---------|
| `CheckCircle2` | Thanh cong | Success status |
| `XCircle` | That bai | Error status |
| `AlertCircle` | Canh bao | Warning status |
| `Clock` | Cho xu ly | Pending status |

### 9.4 Cach Su Dung

```typescript
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Upload, 
  Download,
  Settings2 
} from 'lucide-react';

// Voi text
<Button>
  <PlusCircle className="mr-2 h-4 w-4" />
  Them moi
</Button>

// Chi icon
<Button variant="ghost" size="icon">
  <Edit className="h-4 w-4" />
</Button>
```

---

## 10. FILE STRUCTURE

```
features/[module]/
  page.tsx          # List page voi day du layout
  columns.tsx       # Column definitions
  types.ts          # TypeScript types
  store.ts          # Zustand store
  detail-page.tsx   # Chi tiet entity
  form-page.tsx     # Create/Edit form
  trash-page.tsx    # Thung rac
```

---

## 10.5 DROPDOWN MENU HANH DONG (Action Menu trong Table)

### Quy Tac Chung

Dropdown menu hanh dong (cot "Hanh dong" trong table) can tuan thu:

#### 10.5.1 KHONG dung icon trong menu items

```tsx
// SAI - Co icon trong dropdown menu
<DropdownMenuItem>
  <Printer className="mr-2 h-4 w-4" />
  In Phieu Dong Goi
</DropdownMenuItem>

// DUNG - Chi text, khong co icon
<DropdownMenuItem>
  In Phieu Dong Goi
</DropdownMenuItem>
```

#### 10.5.2 KHONG can nut "Xem chi tiet"

- Click vao row hoac click vao MA (link) da mo trang chi tiet
- Khong can them action "Xem chi tiet" trong dropdown

```tsx
// SAI - Thua nut xem chi tiet
<DropdownMenuContent>
  <DropdownMenuItem>Xem chi tiet</DropdownMenuItem>  // KHONG CAN
  <DropdownMenuItem>Chinh sua</DropdownMenuItem>
  <DropdownMenuItem>Xoa</DropdownMenuItem>
</DropdownMenuContent>

// DUNG - Chi cac action thuc su can thiet
<DropdownMenuContent>
  <DropdownMenuItem>Chinh sua</DropdownMenuItem>
  <DropdownMenuItem>In phieu</DropdownMenuItem>
  <DropdownMenuSeparator />
  <DropdownMenuItem className="text-destructive">Huy yeu cau</DropdownMenuItem>
</DropdownMenuContent>
```

#### 10.5.3 Cau truc Dropdown Menu chuan

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="h-8 w-8">
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    {/* Action chinh sua */}
    <DropdownMenuItem onClick={() => navigate(`/module/${id}/edit`)}>
      Chinh sua
    </DropdownMenuItem>
    
    {/* Cac action khac */}
    <DropdownMenuItem onClick={handlePrint}>
      In phieu
    </DropdownMenuItem>
    
    {/* Separator truoc action nguy hiem */}
    <DropdownMenuSeparator />
    
    {/* Action nguy hiem (xoa, huy) */}
    <DropdownMenuItem 
      className="text-destructive"
      onClick={handleDelete}
    >
      Xoa
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### 10.5.4 Thu tu action trong dropdown

1. **Chinh sua** (neu co)
2. **Cac action nghiep vu** (In, Sao chep, Duyet, Tu choi...)
3. `<DropdownMenuSeparator />`
4. **Action nguy hiem** (Xoa, Huy) - class `text-destructive`

---

## 11. CHECKLIST KHI TAO TRANG MOI

### List Page
- [ ] Cau hinh `usePageHeader()` voi breadcrumb + actions
- [ ] Them `<PageToolbar>` voi Import/Export/Column Toggle
- [ ] Them `<PageFilters>` voi search + filters
- [ ] Cau hinh `exportConfig` va `importConfig`
- [ ] Setup column visibility/order/pinned state
- [ ] Persist layout to localStorage
- [ ] Handle mobile responsive

### Detail Page
- [ ] Title = TEN entity (khong dung ID)
- [ ] Breadcrumb co ten entity co the click duoc
- [ ] showBackButton = true
- [ ] Actions: Chinh sua, Xoa (neu can)

### Edit Page
- [ ] Title = "Chinh sua {Ten entity}"
- [ ] Breadcrumb: Module > Ten entity > Chinh sua
- [ ] showBackButton = true

### New Page
- [ ] Title = "Them {module} moi"
- [ ] Breadcrumb: Module > Them moi
- [ ] showBackButton = true

---

## 12. VI DU HOAN CHINH - TRANG KHACH HANG

### 12.1 List Page (`/customers`)

```typescript
// Title: "Danh sach khach hang"
// Breadcrumb: Trang chu > Khach hang

usePageHeader({
  title: 'Danh sach khach hang',
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Khach hang', href: '/customers', isCurrent: true },
  ],
  actions: [
    <Button key="trash" variant="outline">
      <Trash2 className="mr-2 h-4 w-4" />
      Thung rac (5)
    </Button>,
    <Button key="add">
      <PlusCircle className="mr-2 h-4 w-4" />
      Them khach hang
    </Button>
  ],
});
```

### 12.2 Detail Page (`/customers/KH00000001`)

```typescript
// Title: "Nguyen Van A" (TEN, khong phai ID!)
// Breadcrumb: Trang chu > Khach hang > Nguyen Van A

usePageHeader({
  title: customer.name,  // "Nguyen Van A"
  subtitle: customer.phone,
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Khach hang', href: '/customers', isCurrent: false },
    { label: customer.name, href: `/customers/${customer.systemId}`, isCurrent: true },
  ],
  showBackButton: true,
  actions: [
    <Button key="edit" variant="outline">
      <Edit className="mr-2 h-4 w-4" />
      Chinh sua
    </Button>
  ],
});
```

### 12.3 Edit Page (`/customers/KH00000001/edit`)

```typescript
// Title: "Chinh sua Nguyen Van A"
// Breadcrumb: Trang chu > Khach hang > Nguyen Van A > Chinh sua

usePageHeader({
  title: `Chinh sua ${customer.name}`,  // "Chinh sua Nguyen Van A"
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Khach hang', href: '/customers', isCurrent: false },
    { label: customer.name, href: `/customers/${customer.systemId}`, isCurrent: false },
    { label: 'Chinh sua', href: `/customers/${customer.systemId}/edit`, isCurrent: true },
  ],
  showBackButton: true,
});
```

### 12.4 New Page (`/customers/new`)

```typescript
// Title: "Them khach hang moi"
// Breadcrumb: Trang chu > Khach hang > Them moi

usePageHeader({
  title: 'Them khach hang moi',
  breadcrumb: [
    { label: 'Trang chu', href: '/', isCurrent: false },
    { label: 'Khach hang', href: '/customers', isCurrent: false },
    { label: 'Them moi', href: '/customers/new', isCurrent: true },
  ],
  showBackButton: true,
});
```

---

## 13. REVIEW & KE HOACH XU LY - CHUAN HOA TITLE

### 13.1 Tong Quan Van De

Hien tai nhieu trang detail dang hien thi **MA ID** thay vi **TEN** trong title va breadcrumb.

**Quy tac chuan:**
- Entity co TEN (nhan vien, khach hang, san pham, nha cung cap): Hien thi TEN
- Entity chi co MA (don hang, phieu thu/chi, phieu chuyen kho): Hien thi MA

### 13.2 Phan Loai Entity

#### A. Entity CO TEN - Phai hien thi TEN

| Module | Entity | Field Ten | Hien Tai | Can Sua |
|--------|--------|-----------|----------|---------|
| employees | Nhan vien | `fullName` | "Chi tiet Nhan vien NV001" | "Le Van C" |
| customers | Khach hang | `name` | "Chi tiet Khach hang KH001" | "Nguyen Van A" |
| products | San pham | `name` | ? | "{Ten san pham}" |
| suppliers | Nha cung cap | `name` | ? | "{Ten NCC}" |
| wiki | Bai viet | `title` | ? | "{Tieu de bai viet}" |

#### B. Entity CHI CO MA - Giu nguyen MA

| Module | Entity | Field Ma | Title Chuan |
|--------|--------|----------|-------------|
| orders | Don hang | `id` | "Don hang DH000005" |
| purchase-orders | Don mua hang | `id` | "Don mua hang PO000003" |
| receipts | Phieu thu | `id` | "Phieu thu PT000001" |
| payments | Phieu chi | `id` | "Phieu chi PC000001" |
| stock-transfers | Chuyen kho | `id` | "Phieu chuyen kho CK000001" |
| cost-adjustments | Dieu chinh gia | `id` | "Phieu dieu chinh DC000001" |
| inventory-checks | Kiem hang | `id` | "Phieu kiem hang KH000001" |
| leaves | Nghi phep | `id` | "Don nghi phep NP000001" |
| payroll | Bang luong | `id` | "Bang luong BL202411" |
| warranty | Bao hanh | `id` | "Phieu bao hanh BH000001" |
| tasks | Cong viec | `id` | "Cong viec CV000001" |
| penalties | Phieu phat | `id` | "Phieu phat PP000001" |
| packaging | Dong goi | `id` | "Phieu dong goi DG000001" |
| shipments | Van don | `id` | "Van don VD000001" |
| sales-returns | Tra hang ban | `id` | "Phieu tra hang TH000001" |
| purchase-returns | Tra hang nhap | `id` | "Phieu tra NCC TN000001" |
| inventory-receipts | Nhap kho | `id` | "Phieu nhap kho PNK000001" |
| complaints | Khieu nai | `id` | "Khieu nai KN000001" |

### 13.3 Chi Tiet Cac File Can Sua

#### NHOM 1: Entity co TEN - CAN SUA NGAY (Uu tien cao)

| # | File | Hien Tai | Can Sua Thanh |
|---|------|----------|---------------|
| 1 | `features/employees/detail-page.tsx:279` | `Chi tiet Nhan vien ${employee.id}` | `${employee.fullName}` |
| 2 | `features/customers/detail-page.tsx:289` | `Chi tiet Khach hang ${customer.id}` | `${customer.name}` |
| 3 | `features/suppliers/detail-page.tsx` | Kiem tra | `${supplier.name}` |
| 4 | `features/products/detail-page.tsx` | Kiem tra | `${product.name}` |

#### NHOM 2: Entity chi co MA - GIU NGUYEN (Khong can sua)

| # | File | Title Hien Tai | Trang Thai |
|---|------|----------------|------------|
| 1 | `features/orders/order-detail-page.tsx:1368` | `Don hang ${order.id}` | OK |
| 2 | `features/purchase-orders/detail-page.tsx:792` | `${purchaseOrder.id}` | OK (can them prefix) |
| 3 | `features/receipts/detail-page.tsx:80` | `Phieu thu ${receipt.id}` | OK |
| 4 | `features/payments/detail-page.tsx:81` | `Phieu chi ${payment.id}` | OK |
| 5 | `features/stock-transfers/detail-page.tsx:232` | `Phieu chuyen kho ${transfer.id}` | OK |
| 6 | `features/cost-adjustments/detail-page.tsx:208` | `Phieu dieu chinh ${adjustment.id}` | OK |
| 7 | `features/inventory-checks/detail-page.tsx:160` | `Phieu kiem hang ${check.id}` | OK |
| 8 | `features/leaves/detail-page.tsx:47` | `Don nghi phep ${request.id}` | OK |
| 9 | `features/payroll/detail-page.tsx:376` | `Bang luong ${batch.id}` | OK |
| 10 | `features/warranty/warranty-detail-page.tsx` | Kiem tra | - |
| 11 | `features/tasks/detail-page.tsx` | Kiem tra | - |
| 12 | `features/packaging/detail-page.tsx:199` | `Phieu dong goi ${packaging.id}` | OK |
| 13 | `features/shipments/detail-page.tsx:199` | `Van don ${packaging.id}` | OK |
| 14 | `features/sales-returns/detail-page.tsx:83` | `Phieu tra hang ${salesReturn.id}` | OK |
| 15 | `features/purchase-returns/detail-page.tsx:77` | `Phieu tra hang ${purchaseReturn.id}` | OK |
| 16 | `features/inventory-receipts/detail-page.tsx:85` | `Chi tiet phieu nhap ${receipt.id}` | OK (bo "Chi tiet") |
| 17 | `features/settings/penalties/detail-page.tsx:52` | `Phieu phat ${penalty.id}` | OK |

### 13.4 TODO - Ke Hoach Xu Ly

#### Buoc 1: Sua Entity co TEN (Uu tien 1)
- [x] `employees/detail-page.tsx` - Sua title thanh `employee.fullName` ✓ DA XONG
- [x] `employees/detail-page.tsx` - Sua breadcrumb thanh `employee.fullName` ✓ DA XONG
- [x] `customers/detail-page.tsx` - Sua title thanh `customer.name` ✓ DA XONG
- [x] `customers/detail-page.tsx` - Sua breadcrumb thanh `customer.name` ✓ DA XONG
- [x] `suppliers/detail-page.tsx` - Da dung san - chi sua breadcrumb ✓ DA XONG
- [x] `products/detail-page.tsx` - Da dung san, dung `product.name` ✓ KHONG CAN SUA

#### Buoc 2: Kiem tra cac file khac
- [x] `warranty/warranty-detail-page.tsx` - Da dung san, dung ticket.id ✓ OK
- [x] `tasks/detail-page.tsx` - Da sua breadcrumb dung task.title ✓ DA XONG
- [x] `wiki/detail-page.tsx` - Da dung san, dung article.title ✓ OK

#### Buoc 3: Chuan hoa prefix cho entity chi co MA
- [x] `purchase-orders/detail-page.tsx` - Them prefix "Don nhap hang" ✓ DA XONG
- [x] `inventory-receipts/detail-page.tsx` - Bo "Chi tiet", giu "Phieu nhap kho" ✓ DA XONG

#### Buoc 4: Cap nhat Edit pages tuong ung
- [x] `employees/employee-form-page.tsx` - Sua title edit dung fullName ✓ DA XONG
- [x] `customers/customer-form-page.tsx` - Sua title edit dung name ✓ DA XONG
- [x] `settings/departments/department-form-page.tsx` - Bo subtitle ✓ DA XONG
- [x] Cac form page khac da kiem tra ✓ DA XONG

#### Buoc 5: Bo subtitle va docLink khoi cac trang
- [x] `attendance/page.tsx` - Khong co subtitle/docLink ✓ KHONG CAN SUA
- [x] `cashbook/page.tsx` - Bo subtitle va docLink ✓ DA XONG
- [x] `payments/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `receipts/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `wiki/page.tsx` - Bo subtitle va docLink ✓ DA XONG
- [x] `suppliers/page.tsx` - Bo subtitle va docLink ✓ DA XONG
- [x] `tasks/page.tsx` - Bo subtitle va docLink ✓ DA XONG
- [x] `complaints/page.tsx` - Bo subtitle va docLink ✓ DA XONG
- [x] `sales-returns/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `purchase-returns/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `purchase-orders/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `products/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `packaging/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `leaves/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `inventory-receipts/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `dashboard/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `shipments/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `stock-locations/page.tsx` - Bo subtitle va docLink ✓ DA XONG
- [x] `reconciliation/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `reports/customer-sla-report/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `reports/sales-report/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `reports/product-sla-report/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `reports/inventory-report/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/inventory/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/penalties/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/shipping/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/provinces/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/pricing/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/departments/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/customers/page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/other-page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/tasks/tasks-settings-page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/taxes-page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/templates/workflow-templates-page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/system/import-export-logs-page.tsx` - Bo subtitle ✓ DA XONG
- [x] `settings/system/system-logs-page.tsx` - Bo subtitle ✓ DA XONG
- [x] Cac detail-page.tsx, form-page.tsx da duoc cap nhat ✓ DA XONG

#### Buoc 6: Chuyen action phu tu PageHeader xuong Toolbar
- [x] `cashbook/page.tsx` - Chuyen: Xuat file, Dieu chinh cot, Bao cao xuong PageToolbar ✓ DA XONG
- [x] `inventory-checks/page.tsx` - Chuyen: Xuat file, Dieu chinh cot xuong PageToolbar ✓ DA XONG
- [x] `attendance/page.tsx` - Bo headerSubtitle khong su dung ✓ DA XONG
- [x] `suppliers/page.tsx` - Chuyen: Dieu chinh cot xuong PageToolbar ✓ DA XONG
- [x] `leaves/page.tsx` - Chuyen: Dieu chinh cot xuong PageToolbar ✓ DA XONG
- [x] `tasks/page.tsx` - Chuyen: Dieu chinh cot xuong PageToolbar ✓ DA XONG
- [x] `purchase-orders/page.tsx` - Chuyen: Dieu chinh cot xuong PageToolbar ✓ DA XONG
- [x] `reconciliation/page.tsx` - Chuyen: Dieu chinh cot xuong PageToolbar ✓ DA XONG
- Ghi chu: Cac trang settings (provinces, departments/organization-chart) co Nhap/Xuat file trong headerActions duoc giu nguyen vi day la cac trang cau hinh dac biet

#### Buoc 7: Chuan hoa Dropdown Menu Hanh Dong
- [x] `cashbook/columns.tsx` - Bo icon va "Xem chi tiet" ✓ DA XONG
- [x] `stock-transfers/columns.tsx` - Bo "Xem chi tiet" ✓ DA XONG
- [x] `cost-adjustments/columns.tsx` - Bo icon va "Xem chi tiet" ✓ DA XONG
- [x] `tasks/columns.tsx` - Bo "Xem chi tiet" ✓ DA XONG
- [x] `settings/penalties/columns.tsx` - Bo "Xem chi tiet" ✓ DA XONG
- [x] `payments/columns.tsx` - Bo icon va "Xem chi tiet" ✓ DA XONG
- [x] `receipts/columns.tsx` - Bo icon va "Xem chi tiet" ✓ DA XONG
- [x] `inventory-checks/columns.tsx` - Bo icon va "Xem chi tiet" ✓ DA XONG
- [x] `reports/customer-sla-report/columns.tsx` - Bo icon va "Xem chi tiet" ✓ DA XONG

---

*Cap nhat lan cuoi: 28/11/2025*
