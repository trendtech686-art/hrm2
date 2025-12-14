# 🏭 SUPPLIERS MODULE - PHÂN TÍCH & ĐỀ XUẤT NÂNG CẤP

> **Ngày rà soát**: 29/11/2025  
> **Module**: Suppliers (Quản lý nhà cung cấp)  
> **Trạng thái**: ✅ Đang thực hiện  
> **Mục tiêu**: Nâng cấp lên shadcn + mobile-first + Prisma/PostgreSQL + Next.js

---

## 📋 MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Phân tích hiện trạng](#2-phân-tích-hiện-trạng)
3. [Đánh giá logic nghiệp vụ](#3-đánh-giá-logic-nghiệp-vụ)
4. [Phân tích liên kết module](#4-phân-tích-liên-kết-module)
5. [Prisma Schema](#5-prisma-schema)
6. [API Routes (Next.js)](#6-api-routes-nextjs)
7. [React Query Hooks](#7-react-query-hooks)
8. [UI Components](#8-ui-components)
9. [Kế hoạch triển khai](#9-kế-hoạch-triển-khai)
10. [Checklist](#10-checklist)

---

## 1. TỔNG QUAN

### 1.1. Vai trò của module
Suppliers là **module quản lý nhà cung cấp** trong hệ thống HRM2, quản lý thông tin nhà cung cấp và công nợ với nhà cung cấp.

### 1.2. Tính năng chính
- ✅ CRUD nhà cung cấp với dual-ID (systemId/businessId)
- ✅ Quản lý trạng thái (Đang giao dịch / Ngừng giao dịch)
- ✅ Quản lý công nợ (currentDebt)
- ✅ Thông tin ngân hàng
- ✅ Thông tin liên hệ
- ✅ Soft delete

---

## 2. PHÂN TÍCH HIỆN TRẠNG

### 2.1. Cấu trúc files

```
features/suppliers/
├── types.ts              ✅ Supplier, SupplierStatus types
├── store.ts              ✅ Zustand store với search
├── data.ts               ✅ Initial data
├── columns.tsx           ✅ DataTable columns
├── page.tsx              ✅ Main list page
├── detail-page.tsx       ✅ Detail view
├── form-page.tsx         ✅ Form page
├── supplier-form.tsx     ✅ Form component
├── supplier-card.tsx     ✅ Card component (mobile)
├── trash-columns.tsx     ✅ Trash columns
└── trash-page.tsx        ✅ Trash page
```

### 2.2. Đánh giá code quality

#### ✅ Điểm mạnh
1. **Simple & Clean**: Module đơn giản, dễ hiểu
2. **Type Safety**: Types đầy đủ với dual-ID
3. **CRUD Complete**: Full CRUD operations
4. **Search**: Fuse.js search implemented
5. **Bulk Operations**: updateStatus, bulkDelete

#### ⚠️ Điểm cần cải thiện
1. **Validation**: Chưa có Zod schemas
2. **Debt Tracking**: Chưa có chi tiết debt transactions như Customers
3. **Database**: Chưa có Prisma schema
4. **API**: Chưa có API routes
5. **React Query**: Chưa implement
6. **Statistics**: Chưa track purchase history, ratings
7. **Documents**: Chưa có quản lý hợp đồng/documents

---

## 3. ĐÁNH GIÁ LOGIC NGHIỆP VỤ

### 3.1. Supplier Type

```typescript
type Supplier = {
  systemId: SystemId;
  id: BusinessId;           // NCC001
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  website?: string;
  accountManager: string;   // Employee's full name
  status: SupplierStatus;   // "Đang Giao Dịch" | "Ngừng Giao Dịch"
  currentDebt?: number;     // Công nợ với NCC (số tiền chưa trả)
  
  // Banking
  bankAccount?: string;
  bankName?: string;
  
  // Contact
  contactPerson?: string;
  notes?: string;
  
  // Audit
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  isDeleted?: boolean;
  createdBy?: SystemId;
  updatedBy?: SystemId;
};
```

### 3.2. Business Logic

#### A. Supplier Status
```typescript
"Đang Giao Dịch": Active supplier
"Ngừng Giao Dịch": Inactive supplier (cannot create new POs)
```

#### B. Debt Management
```typescript
currentDebt: Tổng tiền nợ NCC chưa trả

Flow:
1. Purchase Order created → currentDebt += amount
2. Payment to supplier → currentDebt -= amount
3. Purchase Return → currentDebt -= refundAmount
```

#### C. Store Operations
```typescript
✅ searchSuppliers(query, page, limit)
   - Fuse.js search by name, id, phone
   - Pagination support

✅ updateStatus(systemIds[], status)
   - Bulk update supplier status

✅ bulkDelete(systemIds[])
   - Soft delete multiple suppliers
```

---

## 4. PHÂN TÍCH LIÊN KẾT MODULE

### 4.1. Products
```typescript
Product.primarySupplierSystemId → Supplier.systemId
- Link product to primary supplier
```

### 4.2. Purchase-Orders
```typescript
PurchaseOrder.supplierSystemId → Supplier.systemId
PurchaseOrder.totalAmount → Supplier.currentDebt

Flow:
- PO created → Supplier.currentDebt += amount
- PO payment → Supplier.currentDebt -= payment
```

### 4.3. Purchase-Returns
```typescript
PurchaseReturn.supplierSystemId → Supplier.systemId
PurchaseReturn.refundAmount → Supplier.currentDebt

Flow:
- Return goods → Supplier.currentDebt -= refundAmount
```

### 4.4. Employees
```typescript
Supplier.accountManager → Employee.fullName
Supplier.createdBy → Employee.systemId
Supplier.updatedBy → Employee.systemId
```

### 4.5. Cashbook
```typescript
// Payment to supplier
PaymentVoucher.supplierSystemId → Supplier.systemId
PaymentVoucher.amount → Supplier.currentDebt

Flow:
- Payment voucher → Supplier.currentDebt -= amount
```

---

## 5. PRISMA SCHEMA

```prisma
// ═══════════════════════════════════════════════════════════════
// SUPPLIERS
// ═══════════════════════════════════════════════════════════════

enum SupplierStatus {
  ACTIVE         // "Đang Giao Dịch"
  INACTIVE       // "Ngừng Giao Dịch"
}

enum SupplierRating {
  EXCELLENT
  GOOD
  FAIR
  POOR
}

model Supplier {
  // IDs
  systemId            String            @id @default(cuid())
  id                  String            @unique // NCC001
  
  // Basic Info
  name                String
  taxCode             String
  phone               String
  email               String
  address             String            @db.Text
  website             String?
  status              SupplierStatus    @default(ACTIVE)
  
  // Contact
  contactPerson       String?
  contactPhone        String?
  contactEmail        String?
  
  // Banking
  bankName            String?
  bankAccount         String?
  bankBranch          String?
  
  // Debt Management
  currentDebt         Decimal           @default(0) @db.Decimal(18, 2)
  maxCredit           Decimal?          @db.Decimal(18, 2) // Credit limit from supplier
  
  // Payment Terms
  paymentTermsDays    Int?              @default(30) // NET30
  
  // Rating & Performance
  rating              SupplierRating?
  totalPurchases      Int               @default(0)
  totalPurchaseValue  Decimal           @default(0) @db.Decimal(18, 2)
  lastPurchaseDate    DateTime?
  onTimeDeliveryRate  Decimal?          @db.Decimal(5, 2) // 0-100%
  qualityRating       Decimal?          @db.Decimal(3, 2) // 0-5.0
  
  // Account Management
  accountManagerId    String?
  accountManager      Employee?         @relation("SupplierAccountManager", fields: [accountManagerId], references: [systemId])
  
  // Contract
  contractNumber      String?
  contractStartDate   DateTime?
  contractEndDate     DateTime?
  contractFileUrl     String?
  
  // Notes & Documents
  notes               String?           @db.Text
  tags                String[]
  
  // Audit
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  deletedAt           DateTime?
  isDeleted           Boolean           @default(false)
  
  createdById         String?
  createdBy           Employee?         @relation("SupplierCreatedBy", fields: [createdById], references: [systemId])
  
  updatedById         String?
  updatedBy           Employee?         @relation("SupplierUpdatedBy", fields: [updatedById], references: [systemId])
  
  // Relations
  products            Product[]         @relation("SupplierProducts")
  purchaseOrders      PurchaseOrder[]
  purchaseReturns     PurchaseReturn[]
  payments            Payment[]
  
  @@index([id])
  @@index([name])
  @@index([taxCode])
  @@index([status])
  @@index([isDeleted])
  @@map("suppliers")
}

// ═══════════════════════════════════════════════════════════════
// SUPPLIER CONTACTS (Multiple contacts per supplier)
// ═══════════════════════════════════════════════════════════════
model SupplierContact {
  id              String    @id @default(cuid())
  
  supplierId      String
  supplier        Supplier  @relation(fields: [supplierId], references: [systemId], onDelete: Cascade)
  
  name            String
  role            String    // "Sales", "Accountant", "Technical Support"
  phone           String?
  email           String?
  isPrimary       Boolean   @default(false)
  
  notes           String?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([supplierId])
  @@map("supplier_contacts")
}
```

---

## 6. API ROUTES (NEXT.JS)

### 6.1. Supplier CRUD

```typescript
// app/api/suppliers/route.ts
GET    /api/suppliers              // List with filters, pagination, search
POST   /api/suppliers              // Create new supplier

// app/api/suppliers/[systemId]/route.ts
GET    /api/suppliers/:systemId    // Get by ID
PATCH  /api/suppliers/:systemId    // Update
DELETE /api/suppliers/:systemId    // Soft delete

// app/api/suppliers/[systemId]/restore/route.ts
POST   /api/suppliers/:systemId/restore  // Restore deleted
```

### 6.2. Supplier Operations

```typescript
// Update debt
PATCH /api/suppliers/:systemId/debt
{
  operation: 'increase' | 'decrease',
  amount: number,
  note?: string
}

// Bulk operations
POST /api/suppliers/bulk-update-status
{
  systemIds: string[],
  status: 'ACTIVE' | 'INACTIVE'
}

POST /api/suppliers/bulk-delete
{
  systemIds: string[]
}
```

### 6.3. Supplier Analytics

```typescript
// Supplier performance
GET /api/suppliers/:systemId/performance
{
  totalPurchases,
  totalPurchaseValue,
  onTimeDeliveryRate,
  qualityRating,
  currentDebt,
  ...
}

// Supplier comparison
GET /api/suppliers/comparison?productId=xxx
```

### 6.4. Import/Export

```typescript
// Export
GET /api/suppliers/export?format=xlsx|csv

// Import
POST /api/suppliers/import
FormData: { file: File }
```

---

## 7. REACT QUERY HOOKS

### 7.1. Query Hooks

```typescript
// hooks/use-suppliers.ts
export function useSuppliers(filters?: SupplierFilters) {
  return useQuery({
    queryKey: ['suppliers', filters],
    queryFn: () => fetchSuppliers(filters),
  });
}

export function useSupplier(systemId: string) {
  return useQuery({
    queryKey: ['suppliers', systemId],
    queryFn: () => fetchSupplier(systemId),
    enabled: !!systemId,
  });
}

export function useSupplierPerformance(systemId: string) {
  return useQuery({
    queryKey: ['suppliers', systemId, 'performance'],
    queryFn: () => fetchSupplierPerformance(systemId),
  });
}
```

### 7.2. Mutation Hooks

```typescript
// hooks/use-supplier-mutations.ts
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateSupplierInput) => createSupplier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Tạo nhà cung cấp thành công');
    },
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ systemId, data }: UpdateSupplierInput) => 
      updateSupplier(systemId, data),
    onSuccess: (_, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', systemId] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Cập nhật nhà cung cấp thành công');
    },
  });
}

export function useUpdateSupplierDebt() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateSupplierDebtInput) => updateSupplierDebt(data),
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers', supplierId] });
    },
  });
}
```

---

## 8. UI COMPONENTS

### 8.1. List View (Mobile-First)

```typescript
// app/suppliers/page.tsx
export default function SuppliersPage() {
  const { data, isLoading } = useSuppliers(filters);
  
  return (
    <div className="container py-6">
      {/* Mobile: Cards */}
      <div className="md:hidden">
        {data?.items.map(supplier => (
          <SupplierCard key={supplier.systemId} supplier={supplier} />
        ))}
      </div>
      
      {/* Desktop: Table */}
      <div className="hidden md:block">
        <DataTable 
          columns={supplierColumns} 
          data={data?.items ?? []} 
        />
      </div>
    </div>
  );
}
```

### 8.2. Supplier Card (Mobile)

```typescript
// components/suppliers/supplier-card.tsx
export function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Card>
      <div className="flex gap-3">
        <Avatar>
          <AvatarFallback>{supplier.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{supplier.name}</h3>
          <p className="text-sm text-muted-foreground">{supplier.id}</p>
          
          <div className="flex gap-2 mt-2">
            <Badge variant={supplier.status === 'ACTIVE' ? 'success' : 'secondary'}>
              {supplier.status === 'ACTIVE' ? 'Đang giao dịch' : 'Ngừng giao dịch'}
            </Badge>
          </div>
          
          {supplier.currentDebt > 0 && (
            <div className="mt-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Công nợ:</span>
                <span className="font-semibold ml-1">
                  {formatCurrency(supplier.currentDebt)}
                </span>
              </p>
            </div>
          )}
          
          <div className="mt-2 text-sm">
            <p className="text-muted-foreground">
              {supplier.phone} • {supplier.email}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

### 8.3. Supplier Form

```typescript
// components/suppliers/supplier-form.tsx
export function SupplierForm({ supplier }: { supplier?: Supplier }) {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: supplier ?? defaultValues,
  });
  
  return (
    <Form {...form}>
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="banking">Ngân hàng</TabsTrigger>
          <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <BasicInfoFields />
        </TabsContent>
        
        <TabsContent value="banking">
          <BankingFields />
        </TabsContent>
        
        <TabsContent value="performance">
          <PerformanceFields />
        </TabsContent>
      </Tabs>
    </Form>
  );
}
```

---

## 9. KẾ HOẠCH TRIỂN KHAI

### Phase 1: Database & API (Tuần 1)
- [ ] Tạo Prisma schema cho Suppliers
- [ ] Tạo Zod validation schemas
- [ ] Tạo migration
- [ ] Implement API routes (CRUD)
- [ ] Implement debt operations API

### Phase 2: React Query Integration (Tuần 2)
- [ ] Implement query hooks
- [ ] Implement mutation hooks
- [ ] Replace Zustand with React Query
- [ ] Add optimistic updates

### Phase 3: UI Components (Tuần 3)
- [ ] Rebuild list page (mobile-first)
- [ ] Rebuild form page với tabs
- [ ] Add performance tracking
- [ ] Add debt management widget

### Phase 4: Advanced Features (Tuần 4)
- [ ] Implement bulk operations
- [ ] Implement import/export
- [ ] Add supplier comparison
- [ ] Add supplier rating system
- [ ] Add contract management

### Phase 5: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] UAT
- [ ] Production deployment

---

## 10. CHECKLIST

### ✅ Code Quality
- [x] Types đầy đủ với SystemId/BusinessId
- [ ] Validation với Zod schemas
- [x] Store với business logic
- [ ] No TypeScript errors
- [ ] ESLint passed

### ✅ Business Logic
- [x] Status management
- [x] Debt tracking (basic)
- [ ] Performance tracking
- [ ] Rating system
- [ ] Contract management

### ⏳ Database
- [ ] Prisma schema defined
- [ ] Relations mapped
- [ ] Indexes optimized
- [ ] Migration scripts

### ⏳ API
- [ ] CRUD endpoints
- [ ] Debt operations
- [ ] Performance analytics
- [ ] Import/Export

### ⏳ React Query
- [ ] Query hooks
- [ ] Mutation hooks
- [ ] Optimistic updates
- [ ] Error handling

### ✅ UI/UX
- [x] Responsive design
- [x] Mobile-first
- [x] shadcn/ui components
- [ ] Loading states
- [ ] Error boundaries

### ⏳ Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests

---

**Tài liệu tạo**: 29/11/2025  
**Phiên bản**: 1.0  
**Trạng thái**: ✅ Hoàn thành phân tích
