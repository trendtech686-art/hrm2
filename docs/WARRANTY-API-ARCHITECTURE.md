# Warranty API Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React + Next.js)                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               React Query Hooks                              │   │
│  │  • useWarranties() - List warranties                         │   │
│  │  • useWarranty(id) - Get single warranty                     │   │
│  │  • useWarrantyMutations() - CRUD operations                  │   │
│  │  • useWarrantyStockMutations() - Stock operations            │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │               API Client (warranties-api.ts)                 │   │
│  │  • fetchWarranties() - GET /api/warranties                   │   │
│  │  • createWarranty() - POST /api/warranties                   │   │
│  │  • completeWarranty() - POST /api/warranties/:id/complete    │   │
│  │  • cancelWarranty() - POST /api/warranties/:id/cancel        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             ▼                                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     BACKEND (Next.js API Routes)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                    API Routes                                │   │
│  │                                                              │   │
│  │  POST   /api/warranties                                      │   │
│  │  GET    /api/warranties                                      │   │
│  │  GET    /api/warranties/:systemId                            │   │
│  │  PATCH  /api/warranties/:systemId                            │   │
│  │  DELETE /api/warranties/:systemId                            │   │
│  │  POST   /api/warranties/:systemId/complete  ⭐ NEW           │   │
│  │  POST   /api/warranties/:systemId/cancel    ⭐ NEW           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │            Validation Layer (Zod Schemas)                    │   │
│  │  • createWarrantySchema                                      │   │
│  │  • updateWarrantySchema                                      │   │
│  │  • completeWarrantySchema                                    │   │
│  │  • cancelWarrantySchema                                      │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             ▼                                         │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │          Transaction Logic (Prisma Transactions)             │   │
│  │                                                              │   │
│  │  prisma.$transaction(async (tx) => {                        │   │
│  │    1. Update warranty status                                │   │
│  │    2. Commit/Deduct/Uncommit stock                          │   │
│  │    3. Create inventory transaction                          │   │
│  │    4. Create stock history                                  │   │
│  │    // If ANY step fails, ENTIRE transaction rolls back      │   │
│  │  })                                                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                             ▼                                         │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         DATABASE (PostgreSQL)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │    Warranty      │  │  ProductWarehouse│  │  Inventory       │   │
│  │                  │  │                  │  │  Transaction     │   │
│  │  • systemId      │  │  • onHand        │  │  • type          │   │
│  │  • id            │  │  • committedQty  │  │  • quantity      │   │
│  │  • status        │  │  • inTransit     │  │  • reference     │   │
│  │  • customerId    │  └──────────────────┘  └──────────────────┘   │
│  │  • productId     │                                              │   │
│  │  • stockDeducted │                                              │   │
│  └──────────────────┘                                              │   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Stock Management Flow

### CREATE WARRANTY (with replacement)

```
┌──────────────┐
│   Frontend   │
│ Form Submit  │
└──────┬───────┘
       │ POST /api/warranties
       │ { isReplacement: true, replacementProductId, ... }
       ▼
┌──────────────────────────────────┐
│   API Route Handler              │
│   /api/warranties/route.ts       │
└──────┬───────────────────────────┘
       │ Validate product exists
       │ Check stock availability
       ▼
┌──────────────────────────────────┐
│   Prisma Transaction             │
│   prisma.$transaction()          │
├──────────────────────────────────┤
│  1. Create Warranty              │
│     status = 'RECEIVED'          │
│                                  │
│  2. COMMIT Stock                 │
│     ProductWarehouse.update({    │
│       committedQuantity++        │
│     })                           │
│                                  │
│  3. Create History               │
│     'Stock committed for         │
│      warranty replacement'       │
└──────┬───────────────────────────┘
       │ Return warranty
       ▼
┌──────────────┐
│   Frontend   │
│ Toast Success│
│ Redirect     │
└──────────────┘
```

### COMPLETE WARRANTY

```
┌──────────────┐
│   Frontend   │
│ Click        │
│ "Complete"   │
└──────┬───────┘
       │ POST /api/warranties/:id/complete
       │ { actualCost, completionNotes, ... }
       ▼
┌──────────────────────────────────┐
│   API Route Handler              │
│   .../complete/route.ts          │
└──────┬───────────────────────────┘
       │ Validate status = PROCESSING
       │ Check not already completed
       ▼
┌──────────────────────────────────┐
│   Prisma Transaction             │
│   prisma.$transaction()          │
├──────────────────────────────────┤
│  1. Update Warranty              │
│     status = 'COMPLETED'         │
│     completedAt = now            │
│     stockDeducted = true         │
│                                  │
│  2. DEDUCT Stock                 │
│     ProductWarehouse.update({    │
│       onHand--                   │
│       committedQuantity--        │
│     })                           │
│                                  │
│  3. Create InventoryTransaction  │
│     type = 'WARRANTY_REPLACEMENT'│
│     quantity = -1                │
│                                  │
│  4. Create Stock History         │
│     'Stock deducted for          │
│      warranty completion'        │
└──────┬───────────────────────────┘
       │ Return updated warranty
       ▼
┌──────────────┐
│   Frontend   │
│ Toast Success│
│ Invalidate   │
│ Queries      │
└──────────────┘
```

### CANCEL WARRANTY

```
┌──────────────┐
│   Frontend   │
│ Click        │
│ "Cancel"     │
└──────┬───────┘
       │ POST /api/warranties/:id/cancel
       │ { cancellationReason, notes, ... }
       ▼
┌──────────────────────────────────┐
│   API Route Handler              │
│   .../cancel/route.ts            │
└──────┬───────────────────────────┘
       │ Validate not completed
       │ Check not already cancelled
       ▼
┌──────────────────────────────────┐
│   Prisma Transaction             │
│   prisma.$transaction()          │
├──────────────────────────────────┤
│  1. Update Warranty              │
│     status = 'CANCELLED'         │
│     cancelledAt = now            │
│     cancelReason = ...           │
│                                  │
│  2. UNCOMMIT Stock               │
│     ProductWarehouse.update({    │
│       committedQuantity--        │
│     })                           │
│     (Release reservation)        │
│                                  │
│  3. Cancel Related Vouchers      │
│     (if payment system exists)   │
│                                  │
│  4. Create History               │
│     'Warranty cancelled,         │
│      stock uncommitted'          │
└──────┬───────────────────────────┘
       │ Return updated warranty
       ▼
┌──────────────┐
│   Frontend   │
│ Toast Success│
│ Invalidate   │
│ Queries      │
└──────────────┘
```

---

## Query Invalidation Strategy

When a warranty operation completes, React Query automatically invalidates:

```
POST /api/warranties (create)
  ├─ Invalidates: ['warranties']
  ├─ Invalidates: ['warranties', 'stats']
  └─ Invalidates: ['inventory']

POST /api/warranties/:id/complete
  ├─ Invalidates: ['warranties', 'detail', systemId]
  ├─ Invalidates: ['warranties']
  ├─ Invalidates: ['warranties', 'stats']
  ├─ Invalidates: ['inventory']
  ├─ Invalidates: ['products']
  └─ Invalidates: ['stock-history']

POST /api/warranties/:id/cancel
  ├─ Invalidates: ['warranties', 'detail', systemId]
  ├─ Invalidates: ['warranties']
  ├─ Invalidates: ['warranties', 'stats']
  ├─ Invalidates: ['inventory']
  └─ Invalidates: ['products']

PATCH /api/warranties/:id
  ├─ Invalidates: ['warranties', 'detail', systemId]
  ├─ Invalidates: ['warranties']
  └─ Invalidates: ['warranties', 'stats']
```

This ensures all related data stays fresh across the application!

---

## Error Handling Flow

```
┌──────────────┐
│   Frontend   │
│ Action       │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│   API Route Handler              │
│   Validation                     │
└──────┬───────────────────────────┘
       │
       ├─ ✅ Valid ──────────────────┐
       │                             │
       └─ ❌ Invalid                 │
          │                          ▼
          ▼                     ┌──────────────────┐
   ┌──────────────────┐         │  Transaction     │
   │  Return 400      │         │  Logic           │
   │  { error: msg }  │         └──────┬───────────┘
   └──────────────────┘                │
          │                             ├─ ✅ Success
          │                             │   │
          │                             │   ▼
          │                             │ ┌──────────────┐
          │                             │ │ Return 200   │
          │                             │ │ { data: ... }│
          │                             │ └──────┬───────┘
          │                             │        │
          │                             └─ ❌ Error
          │                                │
          │                                ▼
          │                          ┌──────────────────┐
          │                          │ ROLLBACK         │
          │                          │ Return 500       │
          │                          │ { error: msg }   │
          │                          └──────┬───────────┘
          │                                 │
          ▼                                 ▼
┌─────────────────────────────────────────────────┐
│              React Query                        │
│              onError Callback                   │
└──────┬──────────────────────────────────────────┘
       │
       ▼
┌──────────────┐
│   Toast      │
│   Error      │
│   Message    │
└──────────────┘
```

---

## Data Flow: Complete Warranty Example

```typescript
// 1. USER ACTION
<Button onClick={() => handleComplete()}>
  Complete Warranty
</Button>

// 2. REACT HOOK
const { complete } = useWarrantyMutations();

const handleComplete = () => {
  complete.mutate({
    systemId: 'WAR001',
    data: {
      actualCost: 150000,
      completionNotes: 'Screen replaced',
    }
  });
};

// 3. API CLIENT
async function completeWarranty(systemId, data) {
  const res = await fetch(`/api/warranties/${systemId}/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// 4. API ROUTE HANDLER
export async function POST(request, { params }) {
  const { systemId } = await params;
  const body = await request.json();
  
  // 5. PRISMA TRANSACTION
  const result = await prisma.$transaction(async (tx) => {
    // 5a. Update warranty
    const warranty = await tx.warranty.update({
      where: { systemId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        stockDeducted: true,
      },
    });
    
    // 5b. Deduct stock
    await tx.productWarehouse.update({
      where: { 
        productSystemId_warehouseId: {
          productSystemId: warranty.productId,
          warehouseId: warranty.branchSystemId,
        }
      },
      data: {
        onHand: { decrement: 1 },
        committedQuantity: { decrement: 1 },
      },
    });
    
    // 5c. Create inventory transaction
    await tx.inventoryTransaction.create({
      data: {
        type: 'WARRANTY_REPLACEMENT',
        productSystemId: warranty.productId,
        quantity: -1,
        referenceType: 'WARRANTY',
        referenceId: warranty.systemId,
      },
    });
    
    return warranty;
  });
  
  // 6. RETURN RESPONSE
  return NextResponse.json({ data: result });
}

// 7. REACT QUERY CALLBACK
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['warranties'] });
  queryClient.invalidateQueries({ queryKey: ['inventory'] });
  toast.success('Bảo hành đã hoàn tất');
}

// 8. UI UPDATE
// - Warranty list refreshes
// - Inventory data refreshes
// - Success toast shows
// - Page redirects (optional)
```

---

## Security & Authorization

```
┌──────────────┐
│  HTTP        │
│  Request     │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────┐
│  requireAuth()                   │
│  • Check session exists          │
│  • Verify JWT token              │
│  • Load user permissions         │
└──────┬───────────────────────────┘
       │
       ├─ ✅ Authenticated ─────────┐
       │                            │
       └─ ❌ Unauthorized            │
          │                         ▼
          ▼                    ┌────────────────┐
   ┌──────────────┐            │ Business Logic │
   │ Return 401   │            │ • Validate     │
   │ Unauthorized │            │ • Transaction  │
   └──────────────┘            │ • Response     │
                               └────────────────┘
```

---

## Performance Optimizations

1. **Query Caching** (React Query)
   - `staleTime: 30_000` (30 seconds)
   - `gcTime: 5 * 60 * 1000` (5 minutes)
   - `placeholderData: keepPreviousData`

2. **Database Indexes** (Recommended)
   ```sql
   CREATE INDEX idx_warranty_status ON warranties(status);
   CREATE INDEX idx_warranty_customer ON warranties(customer_id);
   CREATE INDEX idx_warranty_product ON warranties(product_id);
   CREATE INDEX idx_warranty_branch ON warranties(branch_system_id);
   CREATE INDEX idx_warranty_created ON warranties(created_at DESC);
   ```

3. **Pagination**
   - Default: 20 items
   - Max: 100 items
   - Uses `skip` and `take` for efficient queries

4. **Selective Fetching**
   - Use `select` to fetch only needed fields
   - Include related data only when necessary

5. **Optimistic Updates**
   - Delete mutation uses optimistic UI
   - Instant feedback without waiting for server

---

## Migration Path

### Phase 1: API Implementation ✅ COMPLETE
- [x] Create API routes
- [x] Add validation schemas
- [x] Implement transactions
- [x] Create React Query hooks

### Phase 2: Schema Update 🔄 PENDING
- [ ] Add ProductWarehouse model to schema
- [ ] Add InventoryTransaction model to schema
- [ ] Run Prisma migrations
- [ ] Uncomment stock logic in API routes

### Phase 3: Frontend Migration 📅 PLANNED
- [ ] Replace Zustand store calls with React Query hooks
- [ ] Update warranty forms
- [ ] Update warranty detail pages
- [ ] Update warranty list pages

### Phase 4: Testing & Deployment 📅 PLANNED
- [ ] Write unit tests
- [ ] Write integration tests
- [ ] E2E testing
- [ ] Production deployment

---

Generated: 2026-01-11  
Status: Architecture Complete ✅
