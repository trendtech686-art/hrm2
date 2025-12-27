# Development Guidelines - HRM2 System

> **Cập nhật:** 12/11/2025  
> **Mục đích:** Quy tắc bắt buộc khi phát triển hệ thống HRM2

---

## 📋 Quick Reference

| Vấn đề | Quy tắc | File liên quan |
|--------|---------|----------------|
| **systemId** | Key nội bộ, KHÔNG hiển thị, dùng cho queries & URLs | All entities |
| **id (Business ID)** | Dùng làm Title, Breadcump, Hiển thị cho user, có thể sửa được | All entities |
| **Navigation** | LUÔN dùng `systemId` trong URL | All pages |
| **Foreign Keys** | CHỈ dùng `systemId`, KHÔNG dùng business `id` | All stores |
| **UI Components** | Chỉ dùng shadcn/ui components | `components/ui/*` |
| **Button & Input Height** | LUÔN dùng `className="h-9"` | All forms |
| **Styling** | Tailwind CSS Chuẩn | All pages |
| **Icons** | Lucide React, KHÔNG emoji | All pages |
| **Language** | 100% tiếng Việt | UI, toast, comments |
| **Page Header Title** | Chi tiết: "Chi tiết Nhân viên NV000001"<br>Chỉnh sửa: "Chỉnh sửa Nhân viên NV000001"<br>Thêm mới: "Thêm mới Nhân viên"<br>Danh sách: "Danh sách nhân viên" | All pages |
| **Breadcrumb** | Chi tiết: "Trang chủ > Phiếu chi > PC000002"<br>Danh sách: "Trang chủ > Nhân viên"<br>Chỉnh sửa: "Trang chủ > Nhân viên > Lê Văn C > Chỉnh sửa"<br>Thêm mới: "Trang chủ > Nhân viên > Thêm mới" | All pages |
| **Trạng Thái Badge** | Nằm dưới Title trong pageHeader | All pages |
| **Typography** | Tuân theo shadcn/ui standards với font sizes consistent | All pages |

---

## 1. ⚡ Dual ID System (Quan trọng nhất)

### Khái niệm

Mọi entity có **2 loại ID**:

| Loại | Field | Mục đích | Đặc điểm | Ví dụ |
|------|-------|----------|----------|-------|
| **System ID** | `systemId` | Key nội bộ | - Không thể sửa<br>- Dùng queries & URLs<br>- Auto tạo<br>- Format: `PREFIX000001` | `EMP000001`<br>`ORDER000001` |
| **Business ID** | `id` | Hiển thị user | - Có thể sửa<br>- Hiển thị UI<br>- User nhập hoặc auto<br>- Format tiếng Việt | `NV000001`<br>`DH000001` |

### Quy tắc vàng

```typescript
// ✅ ĐÚNG - Query với systemId
const order = orders.find(o => o.systemId === orderSystemId);

// ✅ ĐÚNG - Display với business id
<span>Đơn hàng: {order.id}</span>

// ✅ ĐÚNG - Navigation với systemId
<Link to={`/orders/${order.systemId}`}>{order.id}</Link>

// ❌ SAI - Query với business id
const order = orders.find(o => o.id === orderId);  // id có thể đổi!

// ❌ SAI - Navigation với business id
<Link to={`/orders/${order.id}`}>  // URL sẽ broken!
```

### Foreign Keys

**Foreign Keys CHỈ dùng `systemId` - TUYỆT ĐỐI không dùng business `id`**

```typescript
// ✅ ĐÚNG - Foreign Key với systemId
interface Voucher {
  systemId: string;
  id: string;
  
  // Foreign Keys - CHỈ systemId
  linkedOrderSystemId?: string;      // ✅ Relationship
  linkedWarrantySystemId?: string;   // ✅ Relationship
  
  // Display Cache - Denormalization OK
  description?: string;              // ✅ "Trả bảo hành BH000123"
  customerName?: string;             // ✅ Cached display
}

// ❌ SAI - Foreign Key với business id
interface VoucherWrong {
  linkedOrderId?: string;      // ❌ TUYỆT ĐỐI KHÔNG
  linkedWarrantyId?: string;   // ❌ TUYỆT ĐỐI KHÔNG
}
```

### Usage

```typescript
// ✅ Query với Foreign Key
const order = orders.find(o => o.systemId === voucher.linkedOrderSystemId);

// ✅ Navigation với systemId
<Link to={`/orders/${voucher.linkedOrderSystemId}`}>
  Xem đơn hàng
</Link>

// ✅ Display với cached info
<p>{voucher.description}</p>  // "Trả bảo hàng BH000123"

// ❌ SAI - Query/Navigate với business ID
const order = orders.find(o => o.id === voucher.linkedOrderId);  // Field không tồn tại!
<Link to={`/orders/${voucher.linkedOrderId}`}>  // Sai!
```

### Tạo entity mới

```typescript
// Store tự động tạo cả systemId và id
const newEmployee = {
  id: '',  // Để trống = auto tạo NV000001
  fullName: 'Nguyễn Văn A',
  // ...
};

employeeStore.add(newEmployee);
// Result: { systemId: 'EMP000001', id: 'NV000001', ... }
```

---

## 2. 🎨 UI Components & Styling

### Quy tắc

✅ **Chỉ dùng shadcn/ui components**  
✅ **Styling với Tailwind CSS**  
✅ **Icons từ lucide-react**  
✅ **Buttons và Inputs luôn có `className="h-9"`** (consistent height)  
❌ **KHÔNG dùng HTML thuần**  
❌ **KHÔNG dùng emoji**

### Component pattern

```tsx
// ✅ ĐÚNG - Shadcn components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';

<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Shield className="h-5 w-5" />
      Thông tin đăng nhập
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Badge variant="secondary">Nhân viên</Badge>
    <Input className="h-9" placeholder="Nhập tên..." />
    <Button className="h-9" size="sm">Lưu thay đổi</Button>
  </CardContent>
</Card>

// ❌ SAI - HTML thuần + emoji
<div className="card">
  <h3>🔐 Thông tin đăng nhập</h3>
  <span className="badge">Nhân viên</span>
  <input placeholder="Nhập tên..." />
  <button>Lưu</button>
</div>
```

### Button & Input Heights (Quan trọng!)

**QUY TẮC:** Tất cả buttons và inputs PHẢI có `className="h-9"` để đảm bảo consistent height.

```tsx
// ✅ ĐÚNG
<Button className="h-9">Lưu</Button>
<Input className="h-9" placeholder="Email" />
<Select>
  <SelectTrigger className="h-9">
    <SelectValue />
  </SelectTrigger>
</Select>

// ❌ SAI - Thiếu height
<Button>Lưu</Button>
<Input placeholder="Email" />
<SelectTrigger>
  <SelectValue />
</SelectTrigger>
```

**Lý do:**
- ✅ Đồng nhất UI across toàn bộ hệ thống
- ✅ Dễ maintenance và debugging
- ✅ Better UX với consistent spacing

### Tailwind classes

```tsx
// Spacing
className="space-y-6"        // Vertical spacing
className="gap-4"            // Grid/Flex gap
className="p-4"              // Padding

// Colors với dark mode
className="bg-muted/50"
className="bg-blue-50 dark:bg-blue-950"
className="text-blue-600 dark:text-blue-400"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
className="text-sm md:text-base"
```

### Icons (Lucide React)

```tsx
import { 
  CheckCircle,   // Success
  XCircle,       // Error
  AlertCircle,   // Warning
  Shield,        // Security
  Edit,          // Edit
  Trash2,        // Delete
  Plus,          // Add
} from 'lucide-react';

// Standard sizes
className="h-4 w-4"  // Small (buttons)
className="h-5 w-5"  // Medium (cards)
className="h-6 w-6"  // Large (headers)
```

### Typography Standards

**QUY TẮC:** Sử dụng consistent font sizes theo shadcn/ui standards để đảm bảo visual hierarchy rõ ràng.

| Element | Tailwind Class | Pixel Size | Font Weight | Use Case |
|---------|---------------|------------|-------------|----------|
| **Page Title** | `text-2xl font-semibold` | 24px | 600 | Business ID display (NV000001) |
| **Card Title** | `text-lg font-semibold` | 18px | 600 | Section headings ("Thông tin phiếu thu") |
| **Breadcrumb** | `text-sm` | 14px | 400 | Navigation path |
| **Badge** | `text-xs font-medium` | 12px | 500 | Status badges |
| **Form Label** | `text-sm font-medium` | 14px | 500 | Input labels |
| **Body Text** | `text-base leading-7` | 16px | 400 | Main content, paragraphs |
| **Table Header** | `text-xs font-medium uppercase` | 12px | 500 | Column headers |
| **Table Cell** | `text-sm` | 14px | 400 | Cell content |
| **Button Text** | `text-sm font-medium` | 14px | 500 | Action buttons |
| **Helper Text** | `text-sm text-muted-foreground` | 14px | 400 | Form helpers, descriptions |
| **Large** | `text-lg font-semibold` | 18px | 600 | Emphasis text |
| **Small** | `text-sm font-medium leading-none` | 14px | 500 | Compact labels |
| **Muted** | `text-sm text-muted-foreground` | 14px | 400 | Secondary information |

**Examples:**

```tsx
// ✅ ĐÚNG - Page title với business ID
<h1 className="text-2xl font-semibold">NV000001</h1>

// ✅ ĐÚNG - Card title
<CardTitle className="text-lg font-semibold">Thông tin phiếu thu</CardTitle>

// ✅ ĐÚNG - Breadcrumb
<span className="text-sm">Trang chủ > Nhân viên > Chi tiết</span>

// ✅ ĐÚNG - Badge
<Badge className="text-xs font-medium">Hoàn thành</Badge>

// ✅ ĐÚNG - Form label
<FormLabel className="text-sm font-medium">Họ tên</FormLabel>

// ✅ ĐÚNG - Body text
<p className="text-base leading-7">Nội dung mô tả chi tiết...</p>

// ✅ ĐÚNG - Table header
<th className="text-xs font-medium uppercase">Mã nhân viên</th>

// ✅ ĐÚNG - Helper text
<p className="text-sm text-muted-foreground">Nhập email của bạn</p>

// ❌ SAI - Inconsistent sizes
<h1 className="text-4xl">NV000001</h1>  // Quá lớn
<CardTitle className="text-base">Thông tin</CardTitle>  // Quá nhỏ
<span className="text-lg">Trang chủ</span>  // Không phù hợp
```

**Lý do:**
- ✅ **Visual Hierarchy**: Người dùng dễ phân biệt thông tin quan trọng
- ✅ **Readability**: text-base (16px) cho body text dễ đọc nhất
- ✅ **Consistency**: Tuân theo shadcn/ui standards
- ✅ **Accessibility**: Font sizes đảm bảo đọc được trên mọi thiết bị

---

## 3. 📄 Page Structure

### Page Header & Breadcrumb Rules

**QUY TẮC:** Mỗi loại page có format title và breadcrumb riêng theo pattern nhất quán.

#### Title Format

| Page Type | Title Format | Example |
|-----------|--------------|----------|
| **Chi tiết** | `Hồ sơ [BusinessID]` hoặc `[Entity Name] [BusinessID]` | "Hồ sơ NV000001" (Employees)<br>"Khiếu nại KN000001" (Complaints) |
| **Chỉnh sửa** | `Chỉnh sửa [BusinessID]` hoặc `Chỉnh sửa [Entity Name] [BusinessID]` | "Chỉnh sửa NV000001"<br>"Chỉnh sửa Khiếu nại KN000001" |
| **Thêm mới** | `Thêm [entity] mới` | "Thêm nhân viên mới" |
| **Danh sách** | `Danh sách [entity]` | "Danh sách nhân viên" |

**Lưu ý:**
- Entity name: Viết hoa chữ cái đầu tiên ("Nhân viên", "Phiếu chi", "Đơn hàng")
- BusinessID: Dùng `entity.id` (business ID), KHÔNG dùng `entity.systemId`
- Danh sách: Entity name viết thường ("nhân viên", "phiếu chi")

#### Breadcrumb Format

| Page Type | Breadcrumb Format | Example |
|-----------|-------------------|----------|
| **Chi tiết** | `Trang chủ > [Entity] > [Name/BusinessID]` | "Trang chủ > Nhân viên > Lê Văn C"<br>"Trang chủ > Khiếu nại > KN000001" |
| **Danh sách** | `Trang chủ > [Entity]` | "Trang chủ > Nhân viên"<br>"Trang chủ > Quản lý Khiếu nại" |
| **Chỉnh sửa** | `Trang chủ > [Entity] > [Name/ID] > Chỉnh sửa` | "Trang chủ > Nhân viên > Lê Văn C > Chỉnh sửa" |
| **Thêm mới** | `Trang chủ > [Entity] > Thêm mới` | "Trang chủ > Nhân viên > Thêm mới"<br>"Trang chủ > Quản lý Khiếu nại > Tạo mới" |

**Lưu ý:**
- Entity trong breadcrumb: Viết hoa chữ cái đầu tiên ("Nhân viên", "Phiếu chi", "Đơn hàng")
- BusinessID: Giữ nguyên format gốc ("PC000002", "NV000001", "DH000001")
- Luôn bắt đầu với "Trang chủ"
- Breadcrumb href dùng `systemId`, chỉ label dùng business ID hoặc tên

#### Badge Position

**QUY TẮC:** Status Badge luôn nằm **dưới Title**, không nằm cạnh title.

```tsx
usePageHeader({
  title: "Chi tiết Nhân viên NV000001",
  badge: <Badge variant="default">Hoàn thành</Badge>,  // Render dưới title
  actions: headerActions
});
```

### Setup page header

#### Detail Page Example

```tsx
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { ArrowLeft, Edit } from 'lucide-react';

export function EmployeeDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById } = useEmployeeStore();
  
  const employee = React.useMemo(() => 
    systemId ? findById(systemId) : null, 
    [systemId, findById]
  );
  
  // Helper function cho status badge
  const getStatusBadge = (status: string) => {
    const variants = {
      active: { label: 'Đang làm', variant: 'default' as const },
      inactive: { label: 'Nghỉ việc', variant: 'secondary' as const },
    };
    const config = variants[status] || { label: status, variant: 'secondary' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Actions - Memoize để tránh re-render
  const headerActions = React.useMemo(() => [
    <Button 
      key="back" 
      variant="outline" 
      size="sm"
      className="h-9"
      onClick={() => router.push('/employees')}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    <Button 
      key="edit" 
      size="sm"
      className="h-9"
      onClick={() => router.push(`/employees/${systemId}/edit`)}  // systemId!
    >
      <Edit className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </Button>
  ], [router, systemId]);
  
  // Page header - title tự động generate từ breadcrumb-system.ts
  usePageHeader({
    // KHÔNG truyền title - để auto-generate thành "Hồ sơ NV000001"
    badge: employee ? getStatusBadge(employee.status) : undefined,  // Badge dưới title
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: employee?.fullName || employee?.id || 'Chi tiết', href: '', isCurrent: true }  // "Lê Văn C"
    ]
  });
  
  return (
    <div className="space-y-6">
      {/* Content */}
    </div>
  );
}
```

#### List Page Example

```tsx
import { useRouter } from 'next/navigation';

export function EmployeesPage() {
  const router = useRouter();
  
  const headerActions = React.useMemo(() => [
    <Button 
      key="add" 
      size="sm"
      className="h-9"
      onClick={() => router.push('/employees/new')}
    >
      <Plus className="mr-2 h-4 w-4" />
      Thêm nhân viên
    </Button>
  ], [router]);
  
  usePageHeader({ 
    title: 'Danh sách nhân viên',  // Chữ thường
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: true }
    ]
  });
  
  return <div>{/* Content */}</div>;
}
```

#### Form Page Example (Create/Edit)

```tsx
import { useParams, useRouter } from 'next/navigation';

export function EmployeeFormPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById } = useEmployeeStore();
  const isEditing = !!systemId;
  
  const employee = React.useMemo(() => 
    systemId ? findById(systemId) : null, 
    [systemId, findById]
  );
  
  const handleCancel = React.useCallback(() => {
    router.push('/employees');
  }, [router]);
  
  const headerActions = React.useMemo(() => [
    <Button 
      key="cancel" 
      type="button"
      variant="outline"
      className="h-9"
      onClick={handleCancel}
    >
      Hủy
    </Button>,
    <Button 
      key="save" 
      type="submit"
      form="employee-form"
      className="h-9"
    >
      Lưu
    </Button>
  ], [handleCancel]);
  
  // KHÔNG truyền title - để auto-generate từ breadcrumb-system.ts
  // Edit: "Chỉnh sửa NV000001", New: "Thêm nhân viên mới"
  usePageHeader({ 
    actions: headerActions,
    breadcrumb: isEditing ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: employee?.fullName || employee?.id || 'Chi tiết', href: `/employees/${systemId}`, isCurrent: false },  // systemId trong href
      { label: 'Chỉnh sửa', href: '', isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: 'Thêm mới', href: '', isCurrent: true }
    ]
  });
  
  return (
    <form id="employee-form" onSubmit={handleSubmit}>
      <Input className="h-9" placeholder="Họ tên" />
      <Button type="submit" className="h-9">Lưu</Button>
    </form>
  );
}
```

### Router config

```tsx
// lib/router.ts
export const ROUTES = {
  EMPLOYEES: {
    ROOT: '/employees',
    NEW: '/employees/new',
    EDIT: '/employees/:systemId/edit',     // :systemId param
    VIEW: '/employees/:systemId',          // :systemId param
  }
} as const;

// lib/route-definitions.tsx
import { EmployeeDetailPage } from '../features/employees/detail-page';

{
  path: ROUTES.EMPLOYEES.VIEW,  // /employees/:systemId
  element: EmployeeDetailPage,
  meta: {
    breadcrumb: ['Nhân viên', 'Chi tiết']
  }
}
```

### Lưu ý quan trọng

✅ **Title format:** Chi tiết/Chỉnh sửa có BusinessID, Thêm mới/Danh sách không có  
✅ **Breadcrumb:** Entity name viết hoa chữ cái đầu tiên, BusinessID giữ nguyên format gốc  
✅ **Badge position:** Luôn dưới title, không cạnh title  
✅ **Actions array phải memoize** với `React.useMemo()`  
✅ **Mỗi Button cần `key` prop**  
✅ **URL params dùng `:systemId`** không phải `:id`  
✅ **Breadcrumb href dùng systemId**, label dùng business ID hoặc name  
✅ **Submit button có `form="form-id"` attribute**  
✅ **Cancel button có `type="button"`**  
✅ **Buttons có `className="h-9"`**

---

## 4. 📝 Naming Convention

### Quy tắc viết hoa

**QUY TẮC CHUẨN:** Chỉ viết hoa chữ cái đầu tiên, các chữ sau viết thường.

| Element | Rule | Example |
|---------|------|----------|
| **Router Path** | Lowercase English | `/employees`, `/orders`, `/payments` |
| **EntityType** | Lowercase English | `'employees'`, `'orders'`, `'payments'` |
| **displayName (id-config)** | Viết hoa chữ cái đầu tiên | "Nhân viên", "Phiếu chi", "Đơn hàng" |
| **Breadcrumb Label** | Viết hoa chữ cái đầu tiên | "Nhân viên", "Phiếu chi", "Đơn hàng" |
| **Page Title** | Format theo breadcrumb-system.ts | "Hồ sơ NV000001" (detail)<br>"Chỉnh sửa NV000001" (edit)<br>"Thêm nhân viên mới" (new)<br>"Danh sách nhân viên" (list) |
| **BusinessID** | Giữ nguyên format gốc | `PC000001`, `NV000001`, `DH000001` |

**Examples:**

```tsx
// ✅ ĐÚNG - id-config.ts
export const ID_CONFIG = {
  'employees': {
    displayName: 'Nhân viên',  // Chỉ viết hoa chữ "N"
    prefix: 'NV'
  },
  'payments': {
    displayName: 'Phiếu chi',  // Chỉ viết hoa chữ "P"
    prefix: 'PC'
  },
  'orders': {
    displayName: 'Đơn hàng',   // Chỉ viết hoa chữ "Đ"
    prefix: 'DH'
  }
};

// ✅ ĐÚNG - route-definitions.tsx
meta: {
  breadcrumb: ['Nhân viên', 'Chi tiết']  // Chỉ viết hoa chữ đầu
}

// ✅ ĐÚNG - Page component
usePageHeader({
  title: `Chi tiết Nhân viên ${employee.id}`,  // "Chi tiết Nhân viên NV000001"
  breadcrumb: [
    { label: 'Trang chủ', href: '/' },
    { label: 'Nhân viên', href: '/employees' },  // Chỉ viết hoa chữ đầu
    { label: employee.id, href: '' }             // BusinessID format gốc
  ]
});

// ❌ SAI - Viết hoa mỗi từ
displayName: 'Nhân Viên'           // ❌ Sai
displayName: 'Phiếu Chi'           // ❌ Sai
title: 'Chi tiết Nhân Viên'        // ❌ Sai
breadcrumb: ['Nhân Viên']          // ❌ Sai

// ❌ SAI - Viết thường hết
displayName: 'nhân viên'           // ❌ Sai (phải viết hoa chữ đầu)
title: 'chi tiết nhân viên'        // ❌ Sai (phải viết hoa chữ đầu)
```

**Lưu ý:**
- ✅ Router path luôn lowercase English: `/employees`, `/payments`
- ✅ EntityType luôn lowercase English: `'employees'`, `'payments'`
- ✅ DisplayName & Breadcrumb: **CHỈ viết hoa chữ cái đầu tiên**
- ✅ BusinessID: Giữ nguyên format từ prefix (PC000001, NV000001)
- ❌ KHÔNG viết hoa mỗi từ ("Nhân Viên" ❌, "Phiếu Chi" ❌)

---

## 5. 🌐 Language & Localization

### Quy tắc

**TẤT CẢ text phải tiếng Việt:**

```tsx
// ✅ ĐÚNG
<Button className="h-9">Thêm nhân viên</Button>
toast.success('Lưu thành công');
console.log('Kết nối database thành công');
// Xử lý logic tạo nhân viên

// ❌ SAI
<Button>Add Employee</Button>
toast.success('Saved successfully');
console.log('Database connected');
// Handle employee creation logic
```

### Toast vs Dialog

**Toast:** Thông báo kết quả action

```tsx
toast.success('Lưu thành công');
toast.error('Lỗi kết nối mạng');
toast.warning('Dung lượng file quá lớn');
```

**Dialog:** Confirmation, forms, complex interactions

```tsx
// ✅ ĐÚNG - AlertDialog cho confirmation
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogCancel, 
  AlertDialogAction
} from '@/components/ui/alert-dialog';

<AlertDialog>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
      <AlertDialogDescription>
        Bạn có chắc muốn xóa nhân viên này?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
      <AlertDialogAction className="h-9" onClick={handleDelete}>Xóa</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// ❌ SAI - alert/confirm native
alert('Xóa thành công');
confirm('Bạn có chắc?');
```

---

## 6. ✅ Checklist

### Trước khi commit

- [ ] Tất cả queries dùng `systemId`
- [ ] Navigation URLs dùng `systemId` (không dùng business `id`)
- [ ] Display dùng business `id`
- [ ] **Foreign Keys CHỈ dùng `systemId`** (TUYỆT ĐỐI không lưu business `id`)
- [ ] UI dùng shadcn components (không HTML thuần)
- [ ] Styling dùng Tailwind CSS
- [ ] **Buttons và Inputs có `className="h-9"`** (consistent height)
- [ ] **Typography tuân theo standards** (Page title: text-2xl, Card title: text-lg, etc.)
- [ ] Mobile-first responsive
- [ ] Dark mode support
- [ ] **Page header title đúng format** (Chi tiết/Chỉnh sửa có BusinessID)
- [ ] **Breadcrumb đúng format** (Entity viết hoa chữ cái đầu, BusinessID viết thường chữ cái đầu viết hoa)
- [ ] **Badge nằm dưới title**, không cạnh title
- [ ] **Actions được memoize với `React.useMemo()`**
- [ ] **KHÔNG dùng emoji** (gây encoding issues)
- [ ] **TẤT CẢ text phải tiếng Việt** (UI, toast, comments)
- [ ] No compile errors
- [ ] No console errors

### Code review focus

```typescript
// ❌ REJECT - Những pattern này
crypto.randomUUID()
Date.now()
navigate(`/path/${entity.id}`)               // Business id trong URL
find(e => e.id === selectedId)                // Query với business id
linkedOrderId                                 // Business id trong Foreign Key
alert(), confirm()                            // Native dialogs
<Button>Text</Button>                         // Thiếu h-9

// ✅ APPROVE - Patterns đúng
navigate(`/path/${entity.systemId}`)                    // SystemId trong URL
find(e => e.systemId === selectedSystemId)              // Query với systemId
linkedOrderSystemId                                     // SystemId trong Foreign Key
description, customerName                               // Display cache OK
usePageHeader({ 
  title: `Chi tiết Nhân viên ${employee.id}`,          // Title có BusinessID
  badge: <Badge/>,                                      // Badge dưới title
  breadcrumb: [{ label: 'PC000002', ... }]             // BusinessID format gốc
})
<AlertDialog>                                           // Shadcn Dialog
<Button className="h-9">Text</Button>                  // Có h-9
```

---

## 7. 🧪 Testing & CI Requirements

### Workflow bắt buộc trước khi mở PR/merge

1. `npm run lint` – bảo đảm rule eslint + tailwind hoạt động đầy đủ, không skip warning.
2. `npx tsx scripts/verify-branded-ids.ts --skip-json` – xác nhận hệ thống Dual ID không lẫn `systemId`/`id` và seed data đã chuẩn hóa.
3. `npx tsc --noEmit` – chạy đúng cấu hình mà CI dùng; chỉ merge khi lệnh này xanh 100%.
4. `npm run test` (hoặc `npm run vitest -- --run` nếu chưa alias) – ít nhất chạy smoke test/tsd cho domain đã sửa.

> **Tip:** Hãy gom các lệnh trên thành `npm run ci:local` nếu cần, nhưng tuyệt đối không bỏ qua bất kỳ bước nào trước khi push.

### Quy định chất lượng

- Không được merge nếu CI đỏ, kể cả chỉ một job (`lint`, `verify ids`, `tsc`, `test`).
- Với màn hình high-risk (complaints, warranty, orders, inventory), cần ghi lại checklist QA thủ công sau khi sửa và đính kèm vào PR.
- Nếu thêm entity hoặc thay đổi schema, cập nhật luôn `scripts/verify-branded-ids.ts`, dataset fixtures và guideline này.
- Trường hợp cần skip test tạm thời phải tạo issue tương ứng và gắn TODO với deadline rõ ràng.

### Khi CI thất bại

- Ưu tiên đọc log job đỏ → sửa tại local → rerun `npm run lint && npx tsx scripts/verify-branded-ids.ts --skip-json && npx tsc --noEmit && npm run test` trước khi push lại.
- Nếu lỗi do môi trường (cache, node version), ghi chú cụ thể trong PR và ping phụ trách DevOps để cùng xử lý, tuyệt đối không tắt rule.

---

## 8. 🚀 Migration & Platform Upgrades

### Thứ tự ưu tiên

1. **Ổn định Vite branch hiện tại**: hoàn tất backlog còn dang dở, giữ CI xanh liên tục, có checklist QA smoke cho các module chính.
2. **Proof-of-Concept Next.js**: thực hiện trên branch riêng hoặc repo sandbox. Chỉ merge vào main khi đã có kế hoạch route/layout rõ ràng và QA xác nhận không mất tính năng.
3. **Kết nối database thật (Prisma/Drizzle + PostgreSQL/MySQL)**: chỉ bắt đầu sau khi Next.js POC đạt chuẩn và mock stores đã được mapping đủ nghiệp vụ.
4. **Triển khai VPS/Infra**: chuẩn bị Dockerfile, pipeline deploy, monitoring sau khi các bước trên ổn định.

### Nguyên tắc thực hiện

- Không migrate Next.js song song với việc vá CI; mọi thay đổi nền tảng phải chờ khi các bước ở mục 7 được thực thi ổn định.
- Khi bật DB thật hay deploy VPS, bắt buộc cập nhật README/Wiki với hướng dẫn setup mới, đồng thời giữ lại fallback mock đến khi production chạy ổn định.
- Mọi thay đổi platform cần kế hoạch rollback, owner rõ ràng và thông báo cho QA/PO trước tối thiểu 1 sprint.

---

## 9. 📚 Reference

### Key Files

- **Store Factory**: `lib/store-factory.ts` - Dual ID system, counter management
- **ID Utils**: `lib/id-utils.ts` - ID generation helpers
- **Page Header Context**: `contexts/page-header-context.tsx` - Page header management
- **Router**: `lib/router.ts` - Route constants
- **Route Definitions**: `lib/route-definitions.tsx` - Route metadata
- **UI Components**: `components/ui/` - Shadcn components

### Documentation

- **Shadcn UI**: https://ui.shadcn.com
- **Tailwind CSS**: https://tailwindcss.com
- **Lucide Icons**: https://lucide.dev
- **React Router**: https://reactrouter.com



---

**Last Updated:** November 13, 2025  
**Version:** 3.1
