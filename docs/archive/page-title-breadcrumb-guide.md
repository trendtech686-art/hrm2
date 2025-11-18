# 📚 Hướng dẫn sử dụng Page Title & Breadcrumb System

## 🎯 Tổng quan

Hệ thống tự động generate **document title** và **breadcrumb** dựa trên:
- **URL path**: Phân tích route hiện tại
- **Context data**: Thông tin động từ component (tên nhân viên, mã đơn hàng, etc.)

## ✅ Cách sử dụng cơ bản

### 1. **Auto-generate từ URL** (Không cần code gì)

Chỉ cần URL đúng format → tự động có title + breadcrumb!

```tsx
// URL: /hrm/employees
// ✅ Auto result:
// - Title: "Danh sách nhân viên | HRM System"
// - Breadcrumb: "Trang chủ > HRM > Nhân viên"
```

### 2. **Thêm context cho detail/edit pages**

```tsx
import { usePageTitle } from '../../hooks/use-page-title.ts';

function EmployeeDetailPage() {
  const { employee } = useEmployeeStore();

  // 🎯 Set context data
  usePageTitle({
    employeeName: employee.fullName,
    employeeCode: employee.systemId
  });

  // Result:
  // - Title: "Nguyễn Văn A (NV001) | HRM System"
  // - Breadcrumb: "Trang chủ > HRM > Nhân viên > Nguyễn Văn A (NV001)"

  return <div>...</div>;
}
```

### 3. **Override title thủ công** (nếu cần)

```tsx
import { useDocumentTitle } from '../../hooks/use-page-title.ts';

function CustomPage() {
  // Force set custom title
  useDocumentTitle('Báo cáo đặc biệt');

  // Result: "Báo cáo đặc biệt | HRM System"
}
```

### 4. **Combined hook** (title + context)

```tsx
import { usePageMeta } from '../../hooks/use-page-title.ts';

function OrderDetailPage() {
  const { order } = useOrderStore();

  usePageMeta({
    context: { 
      orderCode: order.code,
      customerName: order.customerName 
    },
    title: `Đơn hàng ${order.code}`, // Optional: override
  });
}
```

---

## 🎨 Context Keys hỗ trợ

### HRM Module
```tsx
usePageTitle({
  // Employee
  employeeName: 'Nguyễn Văn A',
  employeeCode: 'NV001',
  
  // Department
  departmentName: 'Phòng Kinh Doanh',
  departmentCode: 'PKD',
  
  // Payroll
  periodName: 'Tháng 10/2024',
  
  // Leave
  leaveCode: 'NP001',
});
```

### Sales Module
```tsx
usePageTitle({
  // Customer
  customerName: 'Công ty ABC',
  customerCode: 'KH001',
  
  // Product
  productName: 'Laptop Dell',
  productCode: 'SP001',
  
  // Order
  orderCode: 'DH123',
  orderTotal: 15000000,
});
```

### Procurement Module
```tsx
usePageTitle({
  // Supplier
  supplierName: 'NCC XYZ',
  supplierCode: 'NCC001',
  
  // Purchase Order
  purchaseOrderCode: 'PO123',
});
```

### Finance Module
```tsx
usePageTitle({
  // Receipt
  receiptCode: 'PT001',
  receiptAmount: 5000000,
  
  // Payment
  paymentCode: 'PC001',
  paymentAmount: 3000000,
});
```

### Internal Module
```tsx
usePageTitle({
  // Task
  taskTitle: 'Chuẩn bị báo cáo Q4',
  taskCode: 'TASK001',
  
  // Wiki
  wikiTitle: 'Quy trình onboarding',
  
  // Complaint
  complaintCode: 'KN001',
});
```

---

## 🔧 Advanced Usage

### 1. **Conditional title**

```tsx
function EmployeeDetailPage() {
  const { employee, isLoading } = useEmployeeStore();

  usePageTitle(
    isLoading 
      ? undefined // Không set context khi loading
      : { 
          employeeName: employee.fullName,
          employeeCode: employee.systemId 
        }
  );
}
```

### 2. **Dynamic context update**

```tsx
function OrderDetailPage() {
  const { order } = useOrderStore();

  // Auto update khi order thay đổi
  usePageTitle({
    orderCode: order.code,
    customerName: order.customerName,
    orderStatus: order.status // Dynamic field
  });
}
```

### 3. **Remove app name suffix**

```tsx
useDocumentTitle('Landing Page', false);
// Result: "Landing Page" (không có "| HRM System")
```

---

## 📋 Checklist khi tạo page mới

- [ ] **URL path** theo convention: `/module/section/action`
- [ ] **Thêm route** vào `lib/router.ts` ROUTES constants
- [ ] **Thêm pattern** vào `lib/breadcrumb-system.ts` PATH_PATTERNS (optional - sẽ tự động sau)
- [ ] **Call `usePageTitle()`** trong component (nếu có context)
- [ ] **Test** breadcrumb và document title

---

## 🎯 Best Practices

### ✅ DO

```tsx
// ✅ Use hook at component top level
function MyPage() {
  usePageTitle({ employeeName: 'John' });
  return <div>...</div>;
}

// ✅ Conditional context
usePageTitle(employee ? { employeeName: employee.name } : undefined);

// ✅ Clean context keys
usePageTitle({ 
  employeeName: 'Nguyễn Văn A', // Clear, specific
  employeeCode: 'NV001' 
});
```

### ❌ DON'T

```tsx
// ❌ Don't use in useEffect
useEffect(() => {
  usePageTitle({ ... }); // Wrong!
}, []);

// ❌ Don't use complex objects
usePageTitle({ 
  employee: entireEmployeeObject // Too much!
});

// ❌ Don't set duplicate context
usePageTitle({ name: 'A' });
usePageTitle({ name: 'B' }); // Conflict!
```

---

## 🚀 Migration từ old system

### Old way (sẽ bị deprecated)
```tsx
// ❌ Old
usePageContext({
  name: employee?.fullName,
  id: employee?.systemId,
  displayName: employee?.fullName
});
```

### New way
```tsx
// ✅ New
usePageTitle({
  employeeName: employee?.fullName,
  employeeCode: employee?.systemId
});
```

---

## 🔍 Troubleshooting

### Issue: Title không update
```tsx
// ❌ Wrong: Forgot dependency
const employee = useEmployeeStore().find(id);
usePageTitle({ employeeName: 'Static' });

// ✅ Fix: Dynamic context
usePageTitle({ employeeName: employee?.fullName });
```

### Issue: Breadcrumb không hiện tên
```tsx
// ❌ Wrong: Key name không match convention
usePageTitle({ name: 'John' });

// ✅ Fix: Dùng đúng key
usePageTitle({ employeeName: 'John' });
```

### Issue: Title bị duplicate app name
```tsx
// ❌ Wrong
useDocumentTitle('My Page | HRM System');
// Result: "My Page | HRM System | HRM System"

// ✅ Fix
useDocumentTitle('My Page');
// Result: "My Page | HRM System"
```

---

## 📊 Context Key Convention

Quy ước đặt tên context keys:

| Entity Type | Name Key | Code Key | Other Keys |
|------------|----------|----------|------------|
| Employee | `employeeName` | `employeeCode` | - |
| Customer | `customerName` | `customerCode` | - |
| Product | `productName` | `productCode` | - |
| Order | - | `orderCode` | `orderTotal`, `customerName` |
| Receipt | - | `receiptCode` | `receiptAmount` |
| Payment | - | `paymentCode` | `paymentAmount` |
| Supplier | `supplierName` | `supplierCode` | - |
| Task | `taskTitle` | `taskCode` | - |
| Wiki | `wikiTitle` | - | - |

---

## 🎓 Examples

### Full example: Employee Detail Page

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEmployeeStore } from './store.ts';
import { usePageTitle } from '../../hooks/use-page-title.ts';

export function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { employees } = useEmployeeStore();
  
  const employee = employees.find(e => e.systemId === id);

  // 🎯 Auto page title + breadcrumb
  usePageTitle({
    employeeName: employee?.fullName,
    employeeCode: employee?.systemId
  });

  if (!employee) {
    return <div>Không tìm thấy nhân viên</div>;
  }

  return (
    <div>
      <h1>{employee.fullName}</h1>
      {/* Page content */}
    </div>
  );
}
```

### Full example: Order Edit Page

```tsx
import { useParams } from 'react-router-dom';
import { useOrderStore } from './store.ts';
import { usePageTitle } from '../../hooks/use-page-title.ts';

export function OrderEditPage() {
  const { id } = useParams();
  const { orders } = useOrderStore();
  
  const order = orders.find(o => o.id === id);

  // 🎯 Edit page context
  usePageTitle({
    orderCode: order?.code,
    customerName: order?.customerName
  });
  
  // Result:
  // - Title: "Chỉnh sửa DH123 | HRM System"
  // - Breadcrumb: "Trang chủ > Sales > Đơn hàng > DH123 > Chỉnh sửa"

  return (
    <form>
      {/* Edit form */}
    </form>
  );
}
```

---

## 🎉 Summary

- ✅ **Zero config** cho list pages (tự động từ URL)
- ✅ **One hook call** cho detail/edit pages với context
- ✅ **Type-safe** với TypeScript
- ✅ **SEO-friendly** với proper document title
- ✅ **Consistent** naming convention
- ✅ **Auto cleanup** khi unmount

Happy coding! 🚀
