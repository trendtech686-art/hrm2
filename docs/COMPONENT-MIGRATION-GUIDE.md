# Component Migration Guide

## Overview
This guide helps migrate components from Zustand stores to React Query hooks.

## Store Usage Count (as of Dec 22, 2024)
| Store | Usages | Priority |
|-------|--------|----------|
| `useBranchStore` | 114 | High |
| `useEmployeeStore` | 109 | High |
| `useProductStore` | 62 | High |
| `useCustomerStore` | 49 | Medium |
| `useOrderStore` | 36 | Medium |

## Migration Pattern

### Before (Zustand)
```tsx
import { useOrderStore } from './store';

function OrdersPage() {
  const orderStore = useOrderStore();
  const orders = orderStore.data ?? [];
  
  // Find single item
  const order = orderStore.findById(id);
  
  // Mutations
  const handleCreate = () => orderStore.add(data);
  const handleUpdate = () => orderStore.update(id, data);
  const handleDelete = () => orderStore.remove(id);
}
```

### After (React Query)
```tsx
import { useOrders, useOrder } from './hooks/use-orders';
import { useOrderMutations } from './hooks/use-order-mutations';

function OrdersPage() {
  // Paginated list
  const { data, isLoading, error } = useOrders({ page: 1, limit: 50 });
  const orders = data?.data ?? [];
  
  // Single item
  const { data: order } = useOrder(id);
  
  // Mutations
  const { create, update, remove } = useOrderMutations({
    onSuccess: () => toast.success('Success!'),
  });
  
  const handleCreate = () => create.mutate(data);
  const handleUpdate = () => update.mutate({ id, ...data });
  const handleDelete = () => remove.mutate(id);
}
```

## Available Hooks by Feature

### Orders
- `useOrders(params)` - List with pagination
- `useOrder(id)` - Single order
- `useOrderStats()` - Dashboard stats
- `useOrderMutations()` - create, update, remove
- `useOrderActions()` - cancel, addPayment, updateStatus, etc.

### Customers
- `useCustomers(params)` - List
- `useCustomerById(id)` - Single customer
- `useCustomerMutations()` - CRUD

### Products
- `useProducts(params)` - List
- `useProductById(id)` - Single product
- `useProductMutations()` - CRUD

### Employees
- `useEmployees(params)` - List
- `useEmployeeById(id)` - Single employee
- `useEmployeeMutations()` - CRUD

### Branches
- `useBranches(params)` - List
- `useBranchById(id)` - Single branch
- `useBranchMutations()` - CRUD

## Common Patterns

### 1. Replace findById
```tsx
// Before
const { findById } = useCustomerStore();
const customer = findById(customerId);

// After
const { data: customer } = useCustomerById(customerId);
```

### 2. Replace data loading
```tsx
// Before
useEffect(() => {
  orderStore.loadAll();
}, []);
const orders = orderStore.data ?? [];

// After (automatic loading)
const { data, isLoading } = useOrders({ page: 1 });
const orders = data?.data ?? [];
```

### 3. Replace mutations
```tsx
// Before
const { add, update, remove } = useOrderStore();

// After
const { create, update, remove } = useOrderMutations();
// use create.mutate(data), update.mutate({id, data}), etc.
```

### 4. Handle loading states
```tsx
// Before
const { loading } = useOrderStore();
if (loading) return <Spinner />;

// After
const { isLoading, isPending, isFetching } = useOrders();
if (isLoading) return <Spinner />;
```

### 5. Handle errors
```tsx
// Before (usually no error handling)

// After
const { data, error, isError } = useOrders();
if (isError) return <ErrorMessage error={error} />;
```

## Migration Checklist

For each component:
- [ ] Replace store import with hook import
- [ ] Replace `store.data` with `data?.data`
- [ ] Replace `store.findById` with individual query hook
- [ ] Replace `store.add/update/remove` with mutation hooks
- [ ] Add loading states with `isLoading`
- [ ] Add error handling with `error`
- [ ] Test all functionality
- [ ] Remove old store import

## Files to Migrate (Priority Order)

### P0 - Critical (affects main flows)
1. `features/orders/page.tsx`
2. `features/orders/order-detail-page.tsx`
3. `features/orders/order-form-page.tsx`
4. `features/dashboard/page.tsx`

### P1 - High (frequently used)
1. `features/products/page.tsx`
2. `features/customers/page.tsx`
3. `features/employees/page.tsx`

### P2 - Medium (secondary features)
1. `features/complaints/page.tsx`
2. `features/warranty/page.tsx`
3. `features/sales-returns/page.tsx`

### P3 - Low (settings, admin)
1. All settings pages
2. Report pages
