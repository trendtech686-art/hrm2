# Next.js Routing Guide

## Overview

Dự án này sử dụng **Next.js App Router** với file-based routing. 

⚠️ **KHÔNG SỬ DỤNG** React Router (react-router-dom).

## Key Imports

```tsx
// ✅ ĐÚNG - Next.js 
import { useRouter, useParams, useSearchParams, usePathname } from 'next/navigation';
import Link from 'next/link';

// ❌ SAI - React Router (ĐÃ LOẠI BỎ)
// import { useNavigate, useParams, Link } from 'react-router-dom';
```

## Navigation Patterns

### Programmatic Navigation

```tsx
// ✅ Next.js App Router
const router = useRouter();

// Navigate to a page
router.push('/employees');
router.push('/employees/new');
router.push(`/employees/${systemId}/edit`);

// Navigate back
router.back();

// Replace current history entry
router.replace('/employees');

// Prefetch for faster navigation
router.prefetch('/employees');
```

### Link Component

```tsx
import Link from 'next/link';

// ✅ Next.js Link
<Link href="/employees">Danh sách nhân viên</Link>
<Link href={`/employees/${systemId}`}>Chi tiết</Link>

// With styles
<Link href="/employees" className="text-blue-600 hover:underline">
  Nhân viên
</Link>
```

### Get Route Parameters

```tsx
// ✅ Next.js - useParams returns object directly
const { systemId } = useParams<{ systemId: string }>();
const { slug } = useParams<{ slug: string[] }>(); // Catch-all routes

// ✅ Usage
console.log(systemId); // 'EMP000001'
```

### Get Query Parameters

```tsx
// ✅ Next.js
const searchParams = useSearchParams();
const page = searchParams.get('page');
const filter = searchParams.get('filter');
```

### Get Current Pathname

```tsx
// ✅ Next.js
const pathname = usePathname();
console.log(pathname); // '/employees/EMP000001'
```

## Route Helpers

File `lib/router.ts` cung cấp constants và helpers cho route paths:

```tsx
import { ROUTES, generatePath } from '@/lib/router';

// Route constants
router.push(ROUTES.HRM.EMPLOYEES);        // '/employees'
router.push(ROUTES.FINANCE.RECEIPTS);     // '/receipts'
router.push(ROUTES.SETTINGS.STORE_INFO);  // '/settings/store-info'

// Dynamic routes with parameters
const path = generatePath(ROUTES.HRM.EMPLOYEE_VIEW, { systemId: 'EMP000001' });
// => '/employees/EMP000001'

const editPath = generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId });
// => '/receipts/RCP000001/edit'
```

## File-Based Routing Structure

```
app/
  (authenticated)/        # Route group (no URL segment)
    employees/
      page.tsx           # /employees
      new/
        page.tsx         # /employees/new
      [systemId]/
        page.tsx         # /employees/:systemId
        edit/
          page.tsx       # /employees/:systemId/edit
    receipts/
      page.tsx           # /receipts
      [systemId]/
        page.tsx         # /receipts/:systemId
```

## Common Patterns

### Detail Page

```tsx
'use client'

import { useParams, useRouter } from 'next/navigation';
import { usePageHeader } from '@/contexts/page-header-context';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit } from 'lucide-react';

export function EmployeeDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  
  const headerActions = React.useMemo(() => [
    <Button 
      key="back" 
      variant="outline" 
      onClick={() => router.push('/employees')}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    <Button 
      key="edit" 
      onClick={() => router.push(`/employees/${systemId}/edit`)}
    >
      <Edit className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </Button>
  ], [router, systemId]);
  
  usePageHeader({
    actions: headerActions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Nhân viên', href: '/employees' },
      { label: 'Chi tiết', href: '', isCurrent: true }
    ]
  });
  
  return <div>{/* Content */}</div>;
}
```

### List Page with Actions

```tsx
'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function EmployeesPage() {
  const router = useRouter();
  
  const handleRowClick = (employee: Employee) => {
    router.push(`/employees/${employee.systemId}`);
  };
  
  return (
    <div>
      <Button onClick={() => router.push('/employees/new')}>
        Thêm nhân viên
      </Button>
      
      <DataTable 
        data={employees}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
```

## Migration from React Router

| React Router | Next.js |
|--------------|---------|
| `useNavigate()` | `useRouter()` |
| `navigate('/path')` | `router.push('/path')` |
| `navigate(-1)` | `router.back()` |
| `navigate('/path', { replace: true })` | `router.replace('/path')` |
| `useParams()` | `useParams()` (from next/navigation) |
| `useLocation().pathname` | `usePathname()` |
| `useLocation().search` | `useSearchParams()` |
| `<Link to="/path">` | `<Link href="/path">` |
| `<Navigate to="/path" />` | `redirect('/path')` (server) or `router.push()` (client) |

## Best Practices

1. **Always use `'use client'`** for pages with hooks like useRouter, useParams
2. **Memoize actions** to prevent unnecessary re-renders
3. **Use Link component** for static navigation (SEO, prefetching)
4. **Use router.push()** for programmatic navigation (after form submit, etc.)
5. **Use ROUTES constants** from `lib/router.ts` for maintainability
