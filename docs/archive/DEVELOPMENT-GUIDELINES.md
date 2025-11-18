# Development Guidelines - HRM2 System# Development Guidelines - HRM2 System



> **Cập nhật:** 12/11/2025  > **Cập nhật:** 12/11/2025  

> **Mục đích:** Quy tắc bắt buộc khi phát triển hệ thống HRM2> **Mục đích:** Quy tắc bắt buộc khi phát triển hệ thống HRM2



------



## 📋 Quick Reference## 📋 Quy tắc quan trọng



| Vấn đề | Quy tắc | File liên quan || Vấn đề | Quy tắc | File liên quan |

|--------|---------|----------------||--------|---------|----------------|

| **systemId** | Key nội bộ, KHÔNG hiển thị, dùng cho queries & URLs | All entities || **systemId** | Key nội bộ, KHÔNG hiển thị, dùng cho queries & URLs | All entities |

| **id (Business ID)** | Hiển thị cho user, có thể sửa được | All entities || **id (Business ID)** | Hiển thị cho user, có thể sửa được | All entities |

| **Navigation** | LUÔN dùng `systemId` trong URL | All pages || **Navigation** | LUÔN dùng `systemId` trong URL | All pages |

| **Foreign Keys** | CHỈ dùng `systemId`, KHÔNG dùng business `id` | All stores || **Relationships** | Foreign Keys CHỈ dùng `systemId` | All stores |

| **UI Components** | Chỉ dùng shadcn/ui components | `components/ui/*` || **UI Components** | Chỉ dùng shadcn/ui components | `components/ui/*` |

| **Styling** | Tailwind CSS only | All pages || **Styling** | Tailwind CSS only | All pages |

| **Icons** | Lucide React, KHÔNG emoji | All pages || **Icons** | Lucide React, KHÔNG emoji | All pages |

| **Language** | 100% tiếng Việt | UI, toast, comments || **Language** | 100% tiếng Việt | UI, toast, comments |



------



## 1. ⚡ Dual ID System## 1. ⚡ Dual ID System (Quan trọng nhất)



### Khái niệm### Khái niệm



Mọi entity có **2 loại ID**:Mọi entity có **2 loại ID**:



| Loại | Field | Mục đích | Đặc điểm | Ví dụ || Loại | Field | Mục đích | Đặc điểm | Ví dụ |

|------|-------|----------|----------|-------||------|-------|----------|----------|-------|

| **System ID** | `systemId` | Key nội bộ | Không thể sửa, dùng queries & URLs | `EMP000001` || **System ID** | `systemId` | Key nội bộ | - Không thể sửa<br>- Dùng queries & URLs<br>- Auto tạo<br>- Format: `PREFIX000001` | `EMP000001`<br>`ORDER000001` |

| **Business ID** | `id` | Hiển thị user | Có thể sửa, hiển thị UI | `NV000001` || **Business ID** | `id` | Hiển thị user | - Có thể sửa<br>- Hiển thị UI<br>- User nhập hoặc auto<br>- Format tiếng Việt | `NV000001`<br>`DH000001` |



### Quy tắc### Quy tắc vàng



```typescript```typescript

// ✅ ĐÚNG// ✅ ĐÚNG - Query với systemId

const order = orders.find(o => o.systemId === orderSystemId);  // Queryconst order = orders.find(o => o.systemId === orderSystemId);

<Link to={`/orders/${order.systemId}`}>{order.id}</Link>       // Navigation

<span>Đơn hàng: {order.id}</span>                              // Display// ✅ ĐÚNG - Display với business id

<span>Đơn hàng: {order.id}</span>

// ❌ SAI

const order = orders.find(o => o.id === orderId);              // Query với business id// ✅ ĐÚNG - Navigation với systemId

<Link to={`/orders/${order.id}`}>                              // Navigation với business id<Link to={`/orders/${order.systemId}`}>{order.id}</Link>

```

// ✅ ĐÚNG - Foreign Key với systemId

### Foreign Keysinterface Voucher {

  linkedOrderSystemId?: string;  // ✅ Relationship

```typescript  description?: string;          // ✅ Display cache OK

// ✅ ĐÚNG - CHỈ dùng systemId}

interface Voucher {

  linkedOrderSystemId?: string;      // Foreign Key// ❌ SAI - Query với business id

  linkedWarrantySystemId?: string;   // Foreign Keyconst order = orders.find(o => o.id === orderId);  // id có thể đổi!

  description?: string;              // Display cache OK

  customerName?: string;             // Display cache OK// ❌ SAI - Navigation với business id

}<Link to={`/orders/${order.id}`}>  // URL sẽ broken!



// ❌ SAI - Business id trong Foreign Key// ❌ SAI - Foreign Key với business id

interface Voucher {interface Voucher {

  linkedOrderId?: string;      // ❌ TUYỆT ĐỐI KHÔNG  linkedOrderId?: string;  // ❌ TUYỆT ĐỐI KHÔNG

  linkedWarrantyId?: string;   // ❌ TUYỆT ĐỐI KHÔNG}

}```

```

### Tạo entity mới

---

```typescript

## 2. 🎨 UI Components// Store tự động tạo cả systemId và id

const newEmployee = {

### Quy tắc  id: '',  // Để trống = auto tạo NV000001

  fullName: 'Nguyễn Văn A',

✅ Chỉ dùng **shadcn/ui components**    // ...

✅ Styling với **Tailwind CSS**  };

✅ Icons từ **lucide-react**  

❌ KHÔNG dùng HTML thuần  employeeStore.add(newEmployee);

❌ KHÔNG dùng emoji  // Result: { systemId: 'EMP000001', id: 'NV000001', ... }

```

### Pattern

---

```tsx

// ✅ ĐÚNG## 2. 🎨 UI Components & Styling

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { Button } from '@/components/ui/button';### Quy tắc

import { Shield } from 'lucide-react';

✅ **Chỉ dùng shadcn/ui components**  

<Card>✅ **Styling với Tailwind CSS**  

  <CardHeader>✅ **Icons từ lucide-react**  

    <CardTitle className="flex items-center gap-2">❌ **KHÔNG dùng HTML thuần**  

      <Shield className="h-5 w-5" />❌ **KHÔNG dùng emoji**

      Thông tin

    </CardTitle>### Component pattern

  </CardHeader>

  <CardContent>```tsx

    <Button size="sm">Lưu</Button>// ✅ ĐÚNG - Shadcn components

  </CardContent>import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

</Card>import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

// ❌ SAIimport { Shield } from 'lucide-react';

<div className="card">

  <h3>🔐 Thông tin</h3>  {/* Emoji */}<Card>

  <button>Lưu</button>    {/* HTML thuần */}  <CardHeader>

</div>    <CardTitle className="flex items-center gap-2">

```      <Shield className="h-5 w-5" />

      Thông tin đăng nhập

### Tailwind classes thông dụng    </CardTitle>

  </CardHeader>

```tsx  <CardContent className="space-y-4">

// Spacing    <Badge variant="secondary">Nhân viên</Badge>

className="space-y-6"         // Vertical spacing    <Button size="sm">Lưu thay đổi</Button>

className="gap-4"             // Grid/Flex gap  </CardContent>

</Card>

// Colors với dark mode

className="bg-muted/50"// ❌ SAI - HTML thuần + emoji

className="text-blue-600 dark:text-blue-400"<div className="card">

  <h3>🔐 Thông tin đăng nhập</h3>

// Responsive  <span className="badge">Nhân viên</span>

className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"  <button>Lưu</button>

```</div>

```

### Icons (Lucide React)

### Tailwind classes

```tsx

import { CheckCircle, XCircle, Edit, Trash2, Plus } from 'lucide-react';```tsx

// Spacing

// SizesclassName="space-y-6"        // Vertical spacing

className="h-4 w-4"  // Small (buttons)className="gap-4"            // Grid/Flex gap

className="h-5 w-5"  // Medium (cards)className="p-4"              // Padding

className="h-6 w-6"  // Large (headers)

```// Colors với dark mode

className="bg-muted/50"

---className="bg-blue-50 dark:bg-blue-950"

className="text-blue-600 dark:text-blue-400"

## 3. 📄 Page Structure

// Responsive

### Page Header + ActionsclassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

className="text-sm md:text-base"

```tsx```

import { usePageHeader } from '../../contexts/page-header-context.tsx';

import { Button } from '../../components/ui/button.tsx';### Icons (Lucide React)

import { ArrowLeft, Edit } from 'lucide-react';

```tsx

export function EmployeeDetailPage() {import { 

  const { systemId } = useParams<{ systemId: string }>();  CheckCircle,   // Success

  const navigate = useNavigate();  XCircle,       // Error

  const { findById } = useEmployeeStore();  AlertCircle,   // Warning

    Shield,        // Security

  const employee = React.useMemo(() =>   Edit,          // Edit

    systemId ? findById(systemId) : null,   Trash2,        // Delete

    [systemId, findById]  Plus,          // Add

  );} from 'lucide-react';

  

  // Actions - PHẢI memoize// Standard sizes

  const headerActions = React.useMemo(() => [className="h-4 w-4"  // Small (buttons)

    <Button className="h-5 w-5"  // Medium (cards)

      key="back" className="h-6 w-6"  // Large (headers)

      variant="outline" ```

      size="sm" 

      onClick={() => navigate('/employees')}---

    >

      <ArrowLeft className="mr-2 h-4 w-4" />## 3. 🔗 Relationships & Foreign Keys

      Quay lại

    </Button>,### Quy tắc vàng

    <Button 

      key="edit" **Foreign Keys CHỈ dùng `systemId` - TUYỆT ĐỐI không dùng business `id`**

      size="sm" 

      onClick={() => navigate(`/employees/${systemId}/edit`)}```typescript

    >// ✅ ĐÚNG - Foreign Key dùng systemId

      <Edit className="mr-2 h-4 w-4" />interface Voucher {

      Chỉnh sửa  systemId: string;

    </Button>  id: string;

  ], [navigate, systemId]);  

    // Foreign Keys - CHỈ systemId

  // Breadcrumb  linkedOrderSystemId?: string;      // ✅ Queries & relationships

  usePageHeader({  linkedWarrantySystemId?: string;   // ✅ Queries & relationships

    actions: headerActions,  

    breadcrumb: [  // Display Cache - Denormalization OK

      { label: 'Trang chủ', href: '/', isCurrent: false },  description?: string;              // ✅ "Trả bảo hành BH000123"

      { label: 'Nhân viên', href: '/employees', isCurrent: false },  customerName?: string;             // ✅ Cached display

      { label: employee?.fullName || 'Chi tiết', href: '', isCurrent: true }}

    ]

  });// ❌ SAI - Business ID trong Foreign Key

  interface VoucherWrong {

  return <div className="space-y-6">{/* Content */}</div>;  linkedOrderId?: string;      // ❌ TUYỆT ĐỐI KHÔNG

}  linkedWarrantyId?: string;   // ❌ Business ID không được dùng trong FK

```}

```

### Router config

### Usage

```tsx

// lib/router.ts```typescript

export const ROUTES = {// ✅ Query với Foreign Key

  EMPLOYEES: {const order = orders.find(o => o.systemId === voucher.linkedOrderSystemId);

    ROOT: '/employees',

    NEW: '/employees/new',// ✅ Navigation với systemId

    EDIT: '/employees/:systemId/edit',  // :systemId<Link to={`/orders/${voucher.linkedOrderSystemId}`}>

    VIEW: '/employees/:systemId',       // :systemId  Xem đơn hàng

  }</Link>

} as const;

```// ✅ Display với cached info

<p>{voucher.description}</p>  // "Trả bảo hành BH000123"

### Lưu ý

// ❌ SAI - Query/Navigate với business ID

✅ Actions array PHẢI memoize với `React.useMemo()`  const order = orders.find(o => o.id === voucher.linkedOrderId);  // Field không tồn tại!

✅ Mỗi Button PHẢI có `key` prop  <Link to={`/orders/${voucher.linkedOrderId}`}>  // Sai!

✅ URL params dùng `:systemId` không phải `:id`  ```

✅ Submit button có `form="form-id"` attribute  

✅ Cancel button có `type="button"`  ---



---## 4. 📄 Page Structure (Router, Breadcrumb, Header)



## 4. 🌐 Language & Localization### Setup page header



### Quy tắc```tsx

import { usePageHeader } from '../../contexts/page-header-context.tsx';

**TẤT CẢ text phải tiếng Việt:**import { Button } from '../../components/ui/button.tsx';

import { ArrowLeft, Edit } from 'lucide-react';

```tsx

// ✅ ĐÚNGexport function EmployeeDetailPage() {

<Button>Thêm nhân viên</Button>  const { systemId } = useParams<{ systemId: string }>();

toast.success('Lưu thành công');  const navigate = useNavigate();

console.log('Kết nối database thành công');  const { findById } = useEmployeeStore();

// Xử lý logic tạo nhân viên  

  const employee = React.useMemo(() => 

// ❌ SAI    systemId ? findById(systemId) : null, 

<Button>Add Employee</Button>    [systemId, findById]

toast.success('Saved successfully');  );

console.log('Database connected');  

// Handle employee creation logic  // Actions - Memoize để tránh re-render

```  const headerActions = React.useMemo(() => [

    <Button 

### Toast vs Dialog      key="back" 

      variant="outline" 

**Toast:** Thông báo kết quả action      size="sm" 

      onClick={() => navigate('/employees')}

```tsx    >

toast.success('Lưu thành công');      <ArrowLeft className="mr-2 h-4 w-4" />

toast.error('Lỗi kết nối mạng');      Quay lại

toast.warning('Dung lượng file quá lớn');    </Button>,

```    <Button 

      key="edit" 

**Dialog:** Confirmation, forms, complex interactions      size="sm" 

      onClick={() => navigate(`/employees/${systemId}/edit`)}  // systemId!

```tsx    >

// ✅ ĐÚNG - AlertDialog cho confirmation      <Edit className="mr-2 h-4 w-4" />

import {       Chỉnh sửa

  AlertDialog,    </Button>

  AlertDialogContent,  ], [navigate, systemId]);

  AlertDialogHeader,  

  AlertDialogTitle,  // Breadcrumb - systemId trong href

  AlertDialogDescription,  usePageHeader({

  AlertDialogFooter,    actions: headerActions,

  AlertDialogCancel,    breadcrumb: [

  AlertDialogAction      { label: 'Trang chủ', href: '/', isCurrent: false },

} from '@/components/ui/alert-dialog';      { label: 'Nhân viên', href: '/employees', isCurrent: false },

      { label: employee?.fullName || 'Chi tiết', href: '', isCurrent: true }

<AlertDialog>    ]

  <AlertDialogContent>  });

    <AlertDialogHeader>  

      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>  return (

      <AlertDialogDescription>    <div className="space-y-6">

        Bạn có chắc muốn xóa nhân viên này?      {/* Content */}

      </AlertDialogDescription>    </div>

    </AlertDialogHeader>  );

    <AlertDialogFooter>}

      <AlertDialogCancel>Hủy</AlertDialogCancel>```

      <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>

    </AlertDialogFooter>### Router config

  </AlertDialogContent>

</AlertDialog>```tsx

// lib/router.ts

// ❌ SAI - alert/confirm nativeexport const ROUTES = {

alert('Xóa thành công');  EMPLOYEES: {

confirm('Bạn có chắc?');    ROOT: '/employees',

```    NEW: '/employees/new',

    EDIT: '/employees/:systemId/edit',     // :systemId param

---    VIEW: '/employees/:systemId',          // :systemId param

  }

## 5. ✅ Checklist} as const;



### Trước khi commit// lib/route-definitions.tsx

import { EmployeeDetailPage } from '../features/employees/detail-page';

- [ ] Tất cả queries dùng `systemId`

- [ ] Navigation URLs dùng `systemId` (không dùng business `id`){

- [ ] Display dùng business `id`  path: ROUTES.EMPLOYEES.VIEW,  // /employees/:systemId

- [ ] **Foreign Keys CHỈ dùng `systemId`** (TUYỆT ĐỐI không lưu business `id`)  element: EmployeeDetailPage,

- [ ] UI dùng shadcn components (không HTML thuần)  meta: {

- [ ] Styling dùng Tailwind CSS    breadcrumb: ['Nhân viên', 'Chi tiết']

- [ ] Mobile-first responsive  }

- [ ] Dark mode support}

- [ ] Page header có actions + breadcrumb```

- [ ] Actions được memoize với `React.useMemo()`

- [ ] **KHÔNG dùng emoji** (gây encoding issues)### Lưu ý quan trọng

- [ ] **TẤT CẢ text phải tiếng Việt** (UI, toast, comments)

- [ ] No compile errors✅ **Actions array phải memoize** với `React.useMemo()`  

- [ ] No console errors✅ **Mỗi Button cần `key` prop**  

✅ **URL params dùng `:systemId`** không phải `:id`  

### Code review focus✅ **Breadcrumb href dùng systemId**  

✅ **Submit button có `form="form-id"` attribute**  

```typescript✅ **Cancel button có `type="button"`**

// ❌ REJECT - Những pattern này

crypto.randomUUID()---

Date.now()
navigate(`/path/${entity.id}`)               // Business id trong URL
find(e => e.id === selectedId)                // Query với business id
linkedOrderId                                 // Business id trong Foreign Key

// ✅ APPROVE - Patterns đúng
navigate(`/path/${entity.systemId}`)          // SystemId trong URL
find(e => e.systemId === selectedSystemId)    // Query với systemId
linkedOrderSystemId                           // SystemId trong Foreign Key
description, customerName                     // Display cache OK
```

---

## 6. 📚 Reference

### Key Files

- Smart Prefix System: `lib/store-factory.ts`
- ID Utils: `lib/id-utils.ts`
- Page Header Context: `contexts/page-header-context.tsx`
- UI Components: `components/ui/`

### Documentation

- Shadcn UI: https://ui.shadcn.com
- Tailwind CSS: https://tailwindcss.com
- Lucide Icons: https://lucide.dev

---

**Last Updated:** November 12, 2025
