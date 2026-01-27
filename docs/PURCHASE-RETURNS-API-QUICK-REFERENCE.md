# Purchase Returns API - Quick Reference Guide

## 🚀 Quick Start

### Import Hooks
```typescript
import { 
  usePurchaseReturns, 
  usePurchaseReturn, 
  usePurchaseReturnMutations,
  usePurchaseReturnStats 
} from '@/features/purchase-returns/hooks/use-purchase-returns';
```

---

## 📋 Common Operations

### 1. List All Purchase Returns
```typescript
const { data, isLoading, error } = usePurchaseReturns({
  page: 1,
  limit: 20,
  status: 'PENDING',
  supplierId: 'SUP_001'
});

// Access data
const returns = data?.data || [];
const total = data?.total || 0;
```

### 2. Get Single Return
```typescript
const { data: purchaseReturn, isLoading } = usePurchaseReturn(systemId);

// Access properties
const items = purchaseReturn?.items || [];
const supplier = purchaseReturn?.suppliers;
const status = purchaseReturn?.status;
```

### 3. Create Purchase Return
```typescript
const { create } = usePurchaseReturnMutations({
  onCreateSuccess: (data) => {
    console.log('Created:', data.id);
    router.push(`/purchase-returns/${data.systemId}`);
  },
  onError: (error) => {
    toast.error(error.message);
  }
});

// Create return
create.mutate({
  purchaseOrderSystemId: 'PO_123',
  reason: 'Damaged goods',
  items: [
    {
      productSystemId: 'PROD_456',
      returnQuantity: 10,
      unitPrice: 50.00,
      note: 'Broken packaging'
    }
  ],
  refundAmount: 500,
  refundMethod: 'Chuyển khoản',
  accountSystemId: 'ACC_001',
  branchSystemId: 'BRANCH_001'
});

// Check loading state
if (create.isPending) {
  return <Spinner />;
}
```

### 4. Approve/Reject Return
```typescript
const { update } = usePurchaseReturnMutations({
  onUpdateSuccess: () => {
    toast.success('Return approved');
  }
});

// Approve
update.mutate({
  systemId: 'PRETURN_789',
  data: {
    status: 'APPROVED',
    approvalNotes: 'Approved by John Doe'
  }
});

// Reject
update.mutate({
  systemId: 'PRETURN_789',
  data: {
    status: 'CANCELLED',
    approvalNotes: 'Rejected - invalid reason'
  }
});
```

### 5. Process Approved Return
```typescript
const { process } = usePurchaseReturnMutations({
  onProcessSuccess: (data) => {
    toast.success('Return processed successfully');
  }
});

process.mutate('PRETURN_789');
```

### 6. Delete Return
```typescript
const { remove } = usePurchaseReturnMutations({
  onDeleteSuccess: () => {
    toast.success('Return deleted');
    router.push('/purchase-returns');
  }
});

// Only works for DRAFT or CANCELLED status
remove.mutate('PRETURN_789');
```

### 7. Get Statistics
```typescript
const { data: stats } = usePurchaseReturnStats({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  supplierId: 'SUP_001'
});

// Access stats
const totalReturns = stats?.total || 0;
const totalValue = stats?.totalValue || 0;
const totalRefund = stats?.totalRefund || 0;
const byStatus = stats?.byStatus || [];
const recent = stats?.recent || [];
```

---

## 🎯 Filter Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 20) |
| `search` | string | Search by ID, reason, supplier name |
| `status` | string | Filter by status (DRAFT/PENDING/APPROVED/COMPLETED/CANCELLED) |
| `supplierId` | string | Filter by supplier system ID |
| `purchaseOrderId` | string | Filter by purchase order system ID |
| `branchId` | string | Filter by branch system ID |
| `startDate` | string | Filter by return date (from) |
| `endDate` | string | Filter by return date (to) |

---

## 🔄 Status Transitions

```
DRAFT ──────────────┐
  │                 │
  v                 v
PENDING ────────> CANCELLED
  │                 ^
  v                 │
APPROVED ──────────┤
  │                 │
  v                 │
COMPLETED ─────────┘
```

**Valid Transitions**:
- DRAFT → PENDING, CANCELLED
- PENDING → APPROVED, CANCELLED
- APPROVED → COMPLETED, CANCELLED

**Note**: COMPLETED and CANCELLED are terminal states (no transitions out).

---

## 📦 Data Structures

### Purchase Return Object
```typescript
{
  systemId: string;                // System ID
  id: string;                      // Business ID (TH000001)
  purchaseOrderSystemId: string;   // PO system ID
  purchaseOrderBusinessId: string; // PO business ID
  supplierSystemId: string;        // Supplier system ID
  supplierName: string;            // Supplier name
  branchSystemId?: string;         // Branch system ID
  branchName?: string;             // Branch name
  returnDate: Date;                // Return date
  status: PurchaseReturnStatus;    // Current status
  reason?: string;                 // Return reason
  items: PurchaseReturnItem[];     // Line items
  returnItems: Json;               // Items as JSON
  totalReturnValue: number;        // Total value
  refundAmount: number;            // Refund amount
  refundMethod?: string;           // Refund method
  accountSystemId?: string;        // Cash account ID
  creatorName?: string;            // Creator name
  activityHistory?: Json;          // Activity log
  createdAt: Date;
  updatedAt: Date;
}
```

### Purchase Return Item
```typescript
{
  systemId: string;
  returnId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  reason?: string;
}
```

---

## ⚡ Performance Tips

### 1. Use Pagination
```typescript
// Good: Paginated
const { data } = usePurchaseReturns({ 
  page: currentPage, 
  limit: 20 
});

// Bad: Load all at once
const { data } = usePurchaseReturns({ limit: 1000 });
```

### 2. Use Specific Queries
```typescript
// Good: Use specific hooks
const { data } = usePurchaseReturnsBySupplier(supplierId);

// Less optimal: Filter on client
const { data: all } = usePurchaseReturns();
const filtered = all?.data.filter(r => r.supplierId === supplierId);
```

### 3. Enable Query When Ready
```typescript
// Good: Only fetch when ID is available
const { data } = usePurchaseReturn(selectedId);
// Hook automatically disables when selectedId is null/undefined

// Bad: Fetch unconditionally
const { data } = usePurchaseReturn(''); // Will fail
```

---

## 🛡️ Error Handling

### Handle Mutation Errors
```typescript
const { create } = usePurchaseReturnMutations({
  onError: (error) => {
    // Display user-friendly error
    if (error.message.includes('not found')) {
      toast.error('Purchase order not found');
    } else if (error.message.includes('exceeds')) {
      toast.error('Return quantity exceeds ordered quantity');
    } else {
      toast.error('Failed to create return. Please try again.');
    }
    
    // Log for debugging
    console.error('Create return error:', error);
  }
});
```

### Handle Query Errors
```typescript
const { data, error, isError } = usePurchaseReturns();

if (isError) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error.message || 'Failed to load purchase returns'}
      </AlertDescription>
    </Alert>
  );
}
```

---

## 🎨 Common Patterns

### Loading States
```typescript
const { data, isLoading, isFetching } = usePurchaseReturns();

if (isLoading) {
  return <Skeleton />; // Initial load
}

return (
  <div>
    {isFetching && <LoadingOverlay />} {/* Refetching */}
    <DataTable data={data?.data || []} />
  </div>
);
```

### Optimistic Updates
```typescript
const { update } = usePurchaseReturnMutations({
  onMutate: async (variables) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ 
      queryKey: ['purchase-returns', variables.systemId] 
    });
    
    // Snapshot previous value
    const previous = queryClient.getQueryData(['purchase-returns', variables.systemId]);
    
    // Optimistically update
    queryClient.setQueryData(['purchase-returns', variables.systemId], (old: any) => ({
      ...old,
      ...variables.data
    }));
    
    return { previous };
  },
  onError: (error, variables, context) => {
    // Rollback on error
    queryClient.setQueryData(
      ['purchase-returns', variables.systemId],
      context?.previous
    );
  }
});
```

### Invalidation After Mutation
```typescript
// Already handled by usePurchaseReturnMutations!
// Automatically invalidates:
// - purchase-returns list
// - specific purchase-return detail
// - purchase-returns stats
// - related purchase-orders
// - inventory
// - suppliers
```

---

## 🔍 Testing

### Example Test
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { usePurchaseReturns } from './use-purchase-returns';

test('fetches purchase returns', async () => {
  const { result } = renderHook(() => usePurchaseReturns());
  
  await waitFor(() => {
    expect(result.current.isSuccess).toBe(true);
  });
  
  expect(result.current.data?.data).toBeInstanceOf(Array);
});
```

---

## 📚 Additional Resources

- **Full Documentation**: [PURCHASE-RETURNS-API-IMPLEMENTATION.md](./PURCHASE-RETURNS-API-IMPLEMENTATION.md)
- **API Routes**: `/app/api/purchase-returns/`
- **React Query Docs**: https://tanstack.com/query/latest
- **Prisma Transactions**: https://www.prisma.io/docs/concepts/components/prisma-client/transactions

---

## 🆘 Troubleshooting

### "Purchase order not found"
- Verify purchase order exists in database
- Check systemId is correct (not businessId)

### "Return quantity exceeds ordered quantity"
- Verify product is in purchase order
- Check ordered quantity in PurchaseOrderItem

### "Invalid status transition"
- Check current status of return
- Verify transition is valid (see status diagram)
- Only DRAFT/CANCELLED can be deleted

### "Cannot process return with status X"
- Process endpoint requires APPROVED status
- Update status to APPROVED first

---

## 💡 Best Practices

1. ✅ Always use React Query hooks, never direct fetch
2. ✅ Handle loading and error states in UI
3. ✅ Use optimistic updates for better UX
4. ✅ Invalidate related queries after mutations
5. ✅ Provide clear error messages to users
6. ✅ Use pagination for large datasets
7. ✅ Enable queries conditionally when dependencies ready
8. ✅ Test edge cases (validation, errors, etc.)
