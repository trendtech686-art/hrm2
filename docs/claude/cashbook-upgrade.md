# 📘 Cashbook Module - Đánh Giá & Nâng Cấp

> **Trạng thái**: ✅ Đã rà soát  
> **Ngày rà soát**: 2024  
> **Module**: Cashbook (Sổ quỹ tiền mặt & ngân hàng)  
> **Thư mục**: `features/cashbook/`  
> **Độ ưu tiên**: 🔴 CAO (Core financial module)

---

## 📋 TỔNG QUAN MODULE

### Mô tả chức năng
Module Cashbook quản lý sổ quỹ tiền mặt và tài khoản ngân hàng, tổng hợp từ **Receipts** (phiếu thu) và **Payments** (phiếu chi). Đây là module trung tâm quản lý dòng tiền của toàn hệ thống.

### Vai trò trong hệ thống
- **Central Financial Hub**: Tổng hợp toàn bộ giao dịch thu/chi từ các module khác
- **Cash Flow Tracking**: Theo dõi dòng tiền theo tài khoản, chi nhánh, thời gian
- **Balance Management**: Quản lý số dư, cảnh báo tối thiểu/tối đa
- **Financial Reporting**: Báo cáo tài chính tổng hợp

### Mối liên hệ với modules khác
**Dependencies (Phụ thuộc vào)**:
- ✅ **Receipts**: Nguồn dữ liệu phiếu thu
- ✅ **Payments**: Nguồn dữ liệu phiếu chi
- ✅ **Branches**: Phân bổ tài khoản theo chi nhánh
- ✅ **Settings (Receipt Types, Payment Types, Payment Methods)**: Phân loại giao dịch

**Dependents (Modules phụ thuộc vào Cashbook)**:
- ✅ **Orders**: Customer payments link to accounts
- ✅ **Purchase-Orders**: Supplier payments link to accounts
- ✅ **Warranty**: Settlement transactions (direct payment, mixed payment)
- ✅ **Complaints**: Refund/penalty transactions
- ✅ **Sales-Returns**: Refund transactions
- ✅ **Customers**: Debt payment tracking
- ✅ **Suppliers**: Debt payment tracking

---

## 🗂️ CẤU TRÚC MODULE

### Cấu trúc files (6 files - SIMPLE)
```
features/cashbook/
├── types.ts           # CashAccount type definition
├── store.ts           # Zustand store with CRUD operations
├── data.ts            # Seed data (3 accounts)
├── columns.tsx        # DataTable columns for transactions
├── page.tsx           # Main cashbook page (709 lines - transaction list with running balance)
└── reports-page.tsx   # Reports page (485 lines - charts & analytics)
```

### Đánh giá độ phức tạp
| Tiêu chí | Đánh giá | Ghi chú |
|----------|----------|---------|
| **Số lượng files** | ⭐⭐ (6 files) | Rất đơn giản, chỉ quản lý accounts |
| **Business logic** | ⭐⭐⭐⭐ (Complex) | Running balance calculation, multi-account aggregation |
| **UI components** | ⭐⭐⭐ (Moderate) | 2 pages: transaction list + reports with charts |
| **Store modules** | ⭐ (Single store) | Chỉ 1 store cho CashAccount |
| **External integrations** | ⭐⭐⭐⭐⭐ (Critical) | Central hub for ALL financial transactions |
| **Độ phức tạp tổng thể** | ⭐⭐⭐⭐ | **HIGH** - Simple structure but complex business logic |

**So sánh**:
- **Simpler than**: Warranty (5 stores), Tasks (4 stores), Complaints (50+ files)
- **Similar to**: Inventory-Checks (simple structure)
- **More complex in**: Financial calculation logic, multi-module integration

---

## 🔍 CHI TIẾT KỸ THUẬT

### 1️⃣ TYPES DEFINITION (`types.ts`)

#### CashAccount Interface
```typescript
export type CashAccount = {
  // Core identity
  systemId: SystemId;
  id: BusinessId;        // TK000001 (Tài Khoản)
  name: string;
  
  // Account details
  initialBalance: number;
  type: 'cash' | 'bank';
  
  // Bank-specific fields (optional)
  bankAccountNumber?: string;
  bankBranch?: string;
  bankName?: string;
  bankCode?: string;
  accountHolder?: string;
  
  // Balance warnings
  minBalance?: number;   // Cảnh báo số dư tối thiểu
  maxBalance?: number;   // Cảnh báo số dư tối đa
  
  // Branch & status
  branchSystemId: SystemId;
  isActive: boolean;
  isDefault: boolean;    // Default account per type (cash/bank)
  
  // Audit fields
  createdAt: string;
  updatedAt: string;
  createdBy: SystemId;
  updatedBy: SystemId;
  
  // Optional management
  managedBy?: SystemId;  // Employee responsible for account
};
```

#### Key Features
✅ **Dual-ID System**: SystemId + BusinessId (TK000001)  
✅ **Type Separation**: Cash vs Bank accounts  
✅ **Balance Warnings**: Min/max thresholds  
✅ **Default Account Logic**: One default per type  
✅ **Branch Linking**: Multi-branch support  

---

### 2️⃣ ZUSTAND STORE (`store.ts`)

#### Store Structure
```typescript
type CashbookStore = {
  accounts: CashAccount[];
  isLoading: boolean;
  
  // CRUD operations
  add: (account: Omit<CashAccount, 'systemId' | 'id'>) => CashAccount;
  update: (systemId: SystemId, updates: Partial<CashAccount>) => void;
  remove: (systemId: SystemId) => void;
  
  // Utility
  getAccountById: (id: BusinessId) => CashAccount | undefined;
  setDefault: (systemId: SystemId) => void;  // Set default account per type
};
```

#### Key Operations
1. **add()**: Auto-generate SystemId + BusinessId (TK000001, TK000002...)
2. **update()**: Standard update with updatedAt/updatedBy tracking
3. **remove()**: Simple array filter
4. **setDefault()**: Unset all defaults of same type, set new default
5. **getAccountById()**: Find by BusinessId (not SystemId)

#### Persistence
```typescript
persist(
  (set, get) => ({ /* store */ }),
  {
    name: 'hrm-cashbook-storage',
    // Persists to localStorage
  }
)
```

---

### 3️⃣ TRANSACTION PAGE (`page.tsx` - 709 lines)

#### Core Logic
**Cashbook không tạo transaction** - chỉ **tổng hợp từ Receipts + Payments**:

```typescript
const transactions = React.useMemo<CashbookTransaction[]>(() => {
  const validReceipts = (receipts || [])
    .filter(r => r.systemId && r.id && r.date && r.accountSystemId && r.status !== 'cancelled')
    .map(r => ({ ...r, type: 'receipt' as const }));
  
  const validPayments = (payments || [])
    .filter(p => p.systemId && p.id && p.date && p.accountSystemId && p.status !== 'cancelled')
    .map(p => ({ ...p, type: 'payment' as const }));
  
  return [...validReceipts, ...validPayments];
}, [receipts, payments]);
```

#### Running Balance Calculation (Key Feature)
```typescript
const { openingBalance, totalReceipts, totalPayments, closingBalance, filteredTransactions } = 
  React.useMemo(() => {
    // 1. Calculate opening balances per account (initialBalance + transactions before dateRange)
    const openingBalancesByAccount = new Map<SystemId, number>();
    
    filteredAccounts.forEach(account => {
      let balance = account.initialBalance;
      
      // Add transactions BEFORE date range start
      const accountTxs = transactions.filter(t => 
        t.accountSystemId === account.systemId && 
        (startDate ? new Date(t.date) < startDate : false)
      );
      
      accountTxs.forEach(t => {
        balance += (t.type === 'receipt' ? t.amount : -t.amount);
      });
      
      openingBalancesByAccount.set(account.systemId, balance);
    });
    
    // 2. Get transactions WITHIN date range
    let periodTransactions = transactions.filter(t => {
      if (!filteredAccountIds.has(t.accountSystemId)) return false;
      const txDate = new Date(t.date);
      if (startDate && txDate < startDate) return false;
      if (endDate && txDate > endDate) return false;
      return true;
    });
    
    // 3. Calculate running balance for each transaction
    const chronologicalTxs = [...periodTransactions].sort((a, b) => 
      differenceInMilliseconds(new Date(a.date), new Date(b.date))
    );
    
    const runningBalancesByAccount = new Map(openingBalancesByAccount);
    let aggregateRunningBalance = /* sum of all opening balances */;
    const runningBalanceByTransaction = new Map<SystemId, number>();
    
    chronologicalTxs.forEach(t => {
      const delta = t.type === 'receipt' ? t.amount : -t.amount;
      const currentAccountBalance = runningBalancesByAccount.get(t.accountSystemId) ?? 0;
      const updatedAccountBalance = currentAccountBalance + delta;
      
      runningBalancesByAccount.set(t.accountSystemId, updatedAccountBalance);
      aggregateRunningBalance += delta;
      
      runningBalanceByTransaction.set(
        t.systemId,
        accountFilter === 'all' ? aggregateRunningBalance : updatedAccountBalance
      );
    });
    
    // 4. Enhance transactions with running balance
    const enhancedTransactions = periodTransactions.map(t => ({
      ...t,
      runningBalance: runningBalanceByTransaction.get(t.systemId)
    }));
    
    return {
      openingBalance: aggregateRunningBalance - totalInPeriod + totalOutPeriod,
      totalReceipts,
      totalPayments,
      closingBalance: aggregateRunningBalance,
      filteredTransactions: enhancedTransactions
    };
  }, [filteredAccounts, transactions, dateRange, accountFilter]);
```

#### Filters
- **Branch Filter**: Filter by branch
- **Account Filter**: Filter by specific account or 'all'
- **Type Filter**: Receipt vs Payment
- **Date Range Filter**: Start/end date with opening balance calculation
- **Global Search**: Fuse.js search on id, description, payerName, recipientName

#### UI Features
✅ **Running Balance Column**: Shows balance after each transaction  
✅ **Summary Cards**: Opening/Closing balance, Total receipts/payments  
✅ **Multi-select**: Bulk operations (not yet implemented)  
✅ **Cancel Transaction**: Redirects to Receipt/Payment edit page  
✅ **Mobile-responsive**: Touch-optimized with lazy loading  

---

### 4️⃣ REPORTS PAGE (`reports-page.tsx` - 485 lines)

#### Report Types
1. **Summary Stats**:
   - Total Receipts / Total Payments
   - Net Balance (Receipts - Payments)
   - Transaction count

2. **Revenue by Day** (Line/Area Chart):
   ```typescript
   const revenueByDay = React.useMemo(() => {
     const dayMap = new Map<string, { date: string; receipts: number; payments: number }>();
     
     filteredVouchers.forEach(v => {
       const day = formatDateCustom(new Date(v.date), 'dd/MM');
       const existing = dayMap.get(day) || { date: day, receipts: 0, payments: 0 };
       
       if (v.type === 'receipt') existing.receipts += v.amount;
       else existing.payments += v.amount;
       
       dayMap.set(day, existing);
     });
     
     return Array.from(dayMap.values()).sort(/* by date */);
   }, [filteredVouchers]);
   ```

3. **Other Charts** (Implementation details in page):
   - Payment methods distribution (Pie chart)
   - Transaction types distribution (Bar chart)
   - Top customers/suppliers

#### Filters
- Branch filter
- Date range filter (default: current month)

---

### 5️⃣ TABLE COLUMNS (`columns.tsx`)

#### CashbookTransaction Type
```typescript
type CashbookTransaction = 
  | (Receipt & { type: 'receipt' }) 
  | (Payment & { type: 'payment' });
```

#### Key Columns
| Column | Description | Features |
|--------|-------------|----------|
| **type** | Receipt/Payment badge | Green/Red color coding |
| **id** | Transaction ID | PT000001 or PC000001 |
| **date** | Transaction date | Sortable |
| **amount** | Amount with +/- | +green for receipts, -red for payments |
| **targetName** | Payer/Recipient | payerName or recipientName |
| **paymentMethodName** | Payment method | Cached from settings |
| **accountSystemId** | Account name | Lookup from accounts array |
| **paymentReceiptTypeName** | Transaction type | Receipt Type or Payment Type |
| **status** | Status badge | completed/cancelled |
| **branchName** | Branch name | Cached |
| **description** | Description | Truncated with tooltip |
| **runningBalance** | Running balance | Calculated in page logic |
| **actions** | Edit/Cancel | Dropdown menu |

#### Responsive Features
✅ **Column groups**: "Thông tin chung", "Thông tin giao dịch", etc.  
✅ **Sticky columns**: Select + Actions  
✅ **Sortable columns**: date, amount, createdAt  

---

## 🔗 INTEGRATIONS

### Receipt Module Integration
**File**: `features/receipts/form-page.tsx`, `receipts/page.tsx`
```typescript
import { useCashbookStore } from '../cashbook/store';

const { accounts } = useCashbookStore();

// In form: select account
<Select value={accountSystemId}>
  {accounts.filter(a => a.isActive && a.type === selectedPaymentMethod.accountType)
    .map(account => (
      <SelectItem value={account.systemId}>{account.name}</SelectItem>
    ))}
</Select>
```

**Link**: `Receipt.accountSystemId` → `CashAccount.systemId`

---

### Payment Module Integration
**File**: `features/payments/form-page.tsx`, `payments/page.tsx`
```typescript
import { useCashbookStore } from '../cashbook/store';

const { accounts } = useCashbookStore();

// Same pattern as Receipts
```

**Link**: `Payment.accountSystemId` → `CashAccount.systemId`

---

### Warranty Module Integration
**File**: `features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx`

**Scenarios**:
1. **Direct Payment** (Hoàn tiền trực tiếp):
   ```typescript
   const cashPayment: Omit<Payment, 'systemId'> = {
     id: asBusinessId(''),
     date: isoNow,
     amount: cashAmount,
     accountSystemId: selectedAccount.systemId,  // ← Link to CashAccount
     category: 'warranty_refund',
     linkedWarrantySystemId: warrantySystemId,
     // ...
   };
   addPayment(cashPayment);
   ```

2. **Order Deduction** (Bù trừ đơn hàng):
   ```typescript
   // No cash account needed (virtual transaction)
   const orderDeductionPayment: Omit<Payment, 'systemId'> = {
     accountSystemId: asSystemId(''),  // Empty for order deduction
     linkedOrderSystemId: order.systemId,
     category: 'warranty_refund',
     // ...
   };
   ```

3. **Mixed Settlement** (Kết hợp):
   ```typescript
   // Part 1: Order deduction (no account)
   // Part 2: Cash payment (with account)
   ```

**Balance Warnings**: 
- Warranty dialog checks `account.currentBalance` before payment
- Shows warning if `currentBalance < minBalance` after payment

---

### Settings/Cash-Accounts Integration
**File**: `features/settings/cash-accounts/page-content.tsx`

**Features**:
1. **Current Balance Calculation**:
   ```typescript
   const accountsWithBalance = React.useMemo(() => {
     return accounts.map(account => {
       const accountReceipts = receipts.filter(r => r.accountSystemId === account.systemId);
       const accountPayments = payments.filter(p => p.accountSystemId === account.systemId);
       
       const totalIn = accountReceipts.reduce((sum, r) => sum + r.amount, 0);
       const totalOut = accountPayments.reduce((sum, p) => sum + p.amount, 0);
       const currentBalance = account.initialBalance + totalIn - totalOut;
       
       // Check warnings
       const isLowBalance = account.minBalance && currentBalance < account.minBalance;
       const isHighBalance = account.maxBalance && currentBalance > account.maxBalance;
       
       return { ...account, currentBalance, isLowBalance, isHighBalance };
     });
   }, [accounts, receipts, payments]);
   ```

2. **Balance Warning Badges**:
   - Red badge: `currentBalance < minBalance`
   - Yellow badge: `currentBalance > maxBalance`

---

### Orders Integration
**Indirect via Payments**:
```typescript
// features/orders/handlers/payment.ts (hypothetical)
const orderPayment: Omit<Receipt, 'systemId'> = {
  id: asBusinessId(''),
  amount: paymentAmount,
  accountSystemId: selectedAccount.systemId,  // ← Link to CashAccount
  category: 'sale',
  payerSystemId: order.customerSystemId,
  linkedOrderSystemId: order.systemId,
  // ...
};
addReceipt(orderPayment);

// Order tracks payments:
order.payments.push({
  systemId: receipt.systemId,
  date: receipt.date,
  amount: paymentAmount,
  method: selectedPaymentMethod.name,
});
```

---

### Purchase-Orders Integration
**Indirect via Payments**:
```typescript
// features/purchase-orders/handlers/payment.ts (hypothetical)
const purchasePayment: Omit<Payment, 'systemId'> = {
  id: asBusinessId(''),
  amount: paymentAmount,
  accountSystemId: selectedAccount.systemId,  // ← Link to CashAccount
  category: 'purchase',
  recipientSystemId: purchaseOrder.supplierSystemId,
  linkedPurchaseOrderSystemId: purchaseOrder.systemId,
  // ...
};
addPayment(purchasePayment);
```

---

## 📊 PRISMA SCHEMA DESIGN

### CashAccount Table
```prisma
model CashAccount {
  // Primary keys
  systemId     String   @id @default(uuid()) @map("system_id")
  id           String   @unique @map("business_id") // TK000001
  
  // Core fields
  name         String
  initialBalance Decimal @default(0) @map("initial_balance") @db.Decimal(15, 2)
  type         AccountType
  
  // Bank details (optional)
  bankAccountNumber String?  @map("bank_account_number")
  bankBranch        String?  @map("bank_branch")
  bankName          String?  @map("bank_name")
  bankCode          String?  @map("bank_code")
  accountHolder     String?  @map("account_holder")
  
  // Balance thresholds
  minBalance   Decimal? @map("min_balance") @db.Decimal(15, 2)
  maxBalance   Decimal? @map("max_balance") @db.Decimal(15, 2)
  
  // Status & defaults
  isActive     Boolean  @default(true) @map("is_active")
  isDefault    Boolean  @default(false) @map("is_default")
  
  // Management
  managedBy    String?  @map("managed_by") // Employee SystemId
  
  // Relations
  branchId     String   @map("branch_id")
  branch       Branch   @relation(fields: [branchId], references: [systemId])
  
  // Audit
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
  createdBy    String   @map("created_by")
  updatedBy    String   @map("updated_by")
  
  // Reverse relations
  receipts     Receipt[]
  payments     Payment[]
  
  @@map("cash_accounts")
  @@index([branchId])
  @@index([type])
  @@index([isActive])
  @@index([isDefault])
}

enum AccountType {
  CASH
  BANK
  
  @@map("account_type")
}
```

### Receipt Table (Update to link CashAccount)
```prisma
model Receipt {
  systemId     String   @id @default(uuid()) @map("system_id")
  id           String   @unique @map("business_id") // PT000001
  date         DateTime
  amount       Decimal  @db.Decimal(15, 2)
  
  // Payer
  payerTypeId       String  @map("payer_type_id")
  payerTypeName     String  @map("payer_type_name")
  payerName         String  @map("payer_name")
  payerSystemId     String? @map("payer_system_id")
  
  description       String
  
  // Payment method
  paymentMethodId   String @map("payment_method_id")
  paymentMethodName String @map("payment_method_name")
  
  // Account (Link to CashAccount)
  accountId         String      @map("account_id")
  account           CashAccount @relation(fields: [accountId], references: [systemId])
  
  // Receipt type
  receiptTypeId     String @map("receipt_type_id")
  receiptTypeName   String @map("receipt_type_name")
  
  // Branch
  branchId          String @map("branch_id")
  branchName        String @map("branch_name")
  branch            Branch @relation(fields: [branchId], references: [systemId])
  
  // Status & category
  status            ReceiptStatus
  category          ReceiptCategory?
  
  // Linking
  linkedOrderId     String? @map("linked_order_id")
  linkedComplaintId String? @map("linked_complaint_id")
  linkedWarrantyId  String? @map("linked_warranty_id")
  
  // Debt tracking
  affectsDebt       Boolean @default(false) @map("affects_debt")
  
  // Audit
  createdAt         DateTime @default(now()) @map("created_at")
  createdBy         String   @map("created_by")
  
  @@map("receipts")
  @@index([date])
  @@index([accountId])
  @@index([branchId])
  @@index([status])
  @@index([category])
}

enum ReceiptStatus {
  COMPLETED
  CANCELLED
  
  @@map("receipt_status")
}

enum ReceiptCategory {
  SALE
  COMPLAINT_PENALTY
  WARRANTY_ADDITIONAL
  CUSTOMER_PAYMENT
  OTHER
  
  @@map("receipt_category")
}
```

### Payment Table (Update to link CashAccount)
```prisma
model Payment {
  systemId          String   @id @default(uuid()) @map("system_id")
  id                String   @unique @map("business_id") // PC000001
  date              DateTime
  amount            Decimal  @db.Decimal(15, 2)
  
  // Recipient
  recipientTypeId       String  @map("recipient_type_id")
  recipientTypeName     String  @map("recipient_type_name")
  recipientName         String  @map("recipient_name")
  recipientSystemId     String? @map("recipient_system_id")
  
  description           String
  
  // Payment method
  paymentMethodId       String @map("payment_method_id")
  paymentMethodName     String @map("payment_method_name")
  
  // Account (Link to CashAccount)
  accountId             String      @map("account_id")
  account               CashAccount @relation(fields: [accountId], references: [systemId])
  
  // Payment type
  paymentTypeId         String @map("payment_type_id")
  paymentTypeName       String @map("payment_type_name")
  
  // Branch
  branchId              String @map("branch_id")
  branchName            String @map("branch_name")
  branch                Branch @relation(fields: [branchId], references: [systemId])
  
  // Status & category
  status                PaymentStatus
  category              PaymentCategory?
  
  // Linking
  linkedOrderId         String? @map("linked_order_id")
  linkedPurchaseOrderId String? @map("linked_purchase_order_id")
  linkedComplaintId     String? @map("linked_complaint_id")
  linkedWarrantyId      String? @map("linked_warranty_id")
  
  // Debt tracking
  affectsDebt           Boolean @default(false) @map("affects_debt")
  
  // Audit
  createdAt             DateTime @default(now()) @map("created_at")
  createdBy             String   @map("created_by")
  
  @@map("payments")
  @@index([date])
  @@index([accountId])
  @@index([branchId])
  @@index([status])
  @@index([category])
}

enum PaymentStatus {
  COMPLETED
  CANCELLED
  
  @@map("payment_status")
}

enum PaymentCategory {
  PURCHASE
  COMPLAINT_REFUND
  WARRANTY_REFUND
  SALARY
  EXPENSE
  SUPPLIER_PAYMENT
  OTHER
  
  @@map("payment_category")
}
```

---

## 🔄 API ROUTES DESIGN

### Cash Accounts API

#### `GET /api/cash-accounts`
**Query params**:
- `branchId?: string` - Filter by branch
- `type?: 'cash' | 'bank'` - Filter by type
- `isActive?: boolean` - Filter active/inactive

**Response**:
```typescript
{
  success: true,
  data: CashAccount[]
}
```

---

#### `GET /api/cash-accounts/:id`
**Response**:
```typescript
{
  success: true,
  data: CashAccount & {
    currentBalance: number;
    isLowBalance: boolean;
    isHighBalance: boolean;
    recentTransactions: Array<{
      systemId: string;
      id: string;
      date: string;
      amount: number;
      type: 'receipt' | 'payment';
      description: string;
    }>;
  }
}
```

---

#### `POST /api/cash-accounts`
**Body**:
```typescript
{
  name: string;
  initialBalance: number;
  type: 'cash' | 'bank';
  bankAccountNumber?: string;
  bankBranch?: string;
  bankName?: string;
  bankCode?: string;
  accountHolder?: string;
  minBalance?: number;
  maxBalance?: number;
  branchId: string;
  isActive: boolean;
  isDefault: boolean;
  managedBy?: string;
}
```

**Validation**:
- ✅ `name`: required, min 3 chars
- ✅ `initialBalance`: required, >= 0
- ✅ `type`: required, enum ['cash', 'bank']
- ✅ If `type === 'bank'`: require `bankAccountNumber`, `bankName`, `accountHolder`
- ✅ `minBalance`: if provided, >= 0 and < initialBalance
- ✅ `maxBalance`: if provided, > minBalance
- ✅ `branchId`: must exist
- ✅ If `isDefault === true`: unset other defaults of same type

**Response**:
```typescript
{
  success: true,
  data: CashAccount
}
```

---

#### `PATCH /api/cash-accounts/:id`
**Body**: Partial updates

**Validation**: Same as POST

**Response**:
```typescript
{
  success: true,
  data: CashAccount
}
```

---

#### `DELETE /api/cash-accounts/:id`
**Validation**:
- ❌ Cannot delete if has linked receipts/payments
- ✅ Soft delete: set `isActive = false` instead

**Response**:
```typescript
{
  success: true,
  message: 'Account deactivated successfully'
}
```

---

#### `POST /api/cash-accounts/:id/set-default`
**Description**: Set as default account for its type

**Logic**:
```typescript
const account = await prisma.cashAccount.findUnique({ where: { systemId: id } });
if (!account) throw new Error('Account not found');

// Unset other defaults of same type
await prisma.cashAccount.updateMany({
  where: { type: account.type, isDefault: true },
  data: { isDefault: false }
});

// Set new default
await prisma.cashAccount.update({
  where: { systemId: id },
  data: { isDefault: true }
});
```

**Response**:
```typescript
{
  success: true,
  data: CashAccount
}
```

---

### Cashbook Transactions API

#### `GET /api/cashbook/transactions`
**Query params**:
- `branchId?: string`
- `accountId?: string` - CashAccount SystemId
- `type?: 'receipt' | 'payment'`
- `startDate?: string` (ISO date)
- `endDate?: string` (ISO date)
- `search?: string` - Search in description, payer/recipient
- `page?: number`
- `limit?: number`

**Response**:
```typescript
{
  success: true,
  data: {
    transactions: Array<Receipt | Payment & { type: 'receipt' | 'payment', runningBalance: number }>;
    summary: {
      openingBalance: number;
      totalReceipts: number;
      totalPayments: number;
      closingBalance: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }
}
```

**Logic**:
1. Fetch receipts + payments matching filters
2. Calculate opening balance (initialBalance + transactions before startDate)
3. Sort transactions chronologically
4. Calculate running balance for each transaction
5. Return paginated result with summary

---

#### `GET /api/cashbook/reports`
**Query params**:
- `branchId?: string`
- `startDate?: string`
- `endDate?: string`

**Response**:
```typescript
{
  success: true,
  data: {
    summary: {
      totalReceipts: number;
      totalPayments: number;
      netBalance: number;
      receiptCount: number;
      paymentCount: number;
    };
    revenueByDay: Array<{ date: string; receipts: number; payments: number }>;
    paymentMethods: Array<{ name: string; receipts: number; payments: number }>;
    transactionTypes: Array<{ name: string; amount: number; count: number }>;
    topAccounts: Array<{ 
      accountId: string; 
      accountName: string; 
      totalIn: number; 
      totalOut: number; 
      netFlow: number;
    }>;
  }
}
```

---

## ✅ VALIDATION SCHEMAS (Zod)

### CashAccount Validation
```typescript
import { z } from 'zod';

export const cashAccountSchema = z.object({
  name: z.string().min(3, 'Tên tài khoản phải có ít nhất 3 ký tự'),
  initialBalance: z.number().min(0, 'Số dư ban đầu không thể âm'),
  type: z.enum(['cash', 'bank']),
  
  // Bank fields (conditional)
  bankAccountNumber: z.string().optional(),
  bankBranch: z.string().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountHolder: z.string().optional(),
  
  minBalance: z.number().min(0).optional(),
  maxBalance: z.number().optional(),
  
  branchId: z.string().uuid('Branch ID không hợp lệ'),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
  
  managedBy: z.string().uuid().optional(),
}).refine(
  (data) => {
    if (data.type === 'bank') {
      return !!data.bankAccountNumber && !!data.bankName && !!data.accountHolder;
    }
    return true;
  },
  {
    message: 'Tài khoản ngân hàng phải có số tài khoản, tên ngân hàng và chủ tài khoản',
    path: ['type'],
  }
).refine(
  (data) => {
    if (data.minBalance && data.maxBalance) {
      return data.maxBalance > data.minBalance;
    }
    return true;
  },
  {
    message: 'Số dư tối đa phải lớn hơn số dư tối thiểu',
    path: ['maxBalance'],
  }
);

export type CashAccountFormData = z.infer<typeof cashAccountSchema>;
```

---

## 🎯 ĐÁNH GIÁ FRONTEND

### Điểm mạnh
✅ **Clear separation of concerns**: Accounts vs Transactions  
✅ **Running balance calculation**: Complex but well-implemented  
✅ **Multi-account aggregation**: Handles multiple accounts seamlessly  
✅ **Date range filtering**: Proper opening balance calculation  
✅ **Reports page**: Good visualization with Recharts  
✅ **Mobile-responsive**: Touch-optimized transaction list  
✅ **Balance warnings**: Min/max threshold alerts  
✅ **Default account logic**: One default per type  

### Điểm cần cải thiện
⚠️ **No create/edit forms**: Transactions are read-only (by design)  
⚠️ **No bulk operations**: Multi-select not implemented  
⚠️ **No export**: Missing CSV/Excel export for reports  
⚠️ **No reconciliation**: No bank reconciliation features  
⚠️ **No account transfers**: Cannot transfer between accounts  
⚠️ **Limited reporting**: Only basic charts, no custom date grouping  

### Mức độ sẵn sàng
**Frontend: 85%** ✅  
**Backend: 0%** ❌

---

## 🚀 KẾ HOẠCH IMPLEMENTATION

### Phase 1: Backend Foundation (Priority: HIGH)
1. ✅ Create Prisma schema for CashAccount
2. ✅ Add `accountId` foreign key to Receipt/Payment tables
3. ✅ Implement Cash Accounts CRUD API
4. ✅ Implement Cashbook Transactions API (aggregation logic)
5. ✅ Implement Cashbook Reports API

**Estimated time**: 5-6 days

---

### Phase 2: Advanced Features (Priority: MEDIUM)
1. ✅ Account transfers API (`POST /api/cash-accounts/transfer`)
   - Create paired Payment (from account) + Receipt (to account)
2. ✅ Export transactions to CSV/Excel
3. ✅ Bank reconciliation UI + API
4. ✅ Advanced reporting (custom date grouping, comparison)

**Estimated time**: 4-5 days

---

### Phase 3: Integration Testing (Priority: HIGH)
1. ✅ Test Orders → Receipts → Cashbook flow
2. ✅ Test Purchase-Orders → Payments → Cashbook flow
3. ✅ Test Warranty settlements → Cashbook
4. ✅ Test Complaints refunds/penalties → Cashbook
5. ✅ Test multi-branch scenarios
6. ✅ Test balance warnings & alerts

**Estimated time**: 3-4 days

---

## 📝 MIGRATION NOTES

### Data Migration
```typescript
// Step 1: Create cash accounts from existing transactions
const uniqueAccounts = new Set<string>();
receipts.forEach(r => uniqueAccounts.add(r.accountSystemId));
payments.forEach(p => uniqueAccounts.add(p.accountSystemId));

// Step 2: Generate CashAccount entries
uniqueAccounts.forEach(accountId => {
  const account: CashAccount = {
    systemId: accountId,
    id: generateBusinessId('TK'),
    name: `Account ${accountId.slice(-3)}`,  // Placeholder name
    initialBalance: 0,  // Will need manual input
    type: 'cash',  // Default to cash
    branchSystemId: defaultBranch.systemId,
    isActive: true,
    isDefault: false,
    createdAt: new Date().toISOString(),
    // ...
  };
  
  await prisma.cashAccount.create({ data: account });
});

// Step 3: Link existing receipts/payments to cash accounts
// (Already have accountSystemId, just verify references exist)
```

---

## 🐛 KNOWN ISSUES & FIXES

### Issue 1: Running balance calculation performance
**Problem**: Recalculating running balance on every render for large datasets  
**Solution**: 
- Implement pagination on backend
- Cache opening balance per page
- Use virtualized list for mobile

---

### Issue 2: Date filtering complexity
**Problem**: Opening balance calculation requires ALL transactions before date range  
**Solution**:
- Backend API returns pre-calculated opening balance
- Frontend only handles pagination & display

---

### Issue 3: No transaction locking
**Problem**: Concurrent transactions can cause race conditions  
**Solution**:
- Implement optimistic locking with version field
- Use database transactions for multi-step operations

---

## 📚 REFERENCES

### Related Documentation
- ✅ `docs/new/warranty-upgrade.md` - Warranty settlement integration
- ✅ `docs/new/complaints-upgrade.md` - Complaint refund integration
- ✅ `docs/DEVELOPMENT-GUIDELINES-V2.md` - General dev guidelines

### Code References
- ✅ `features/receipts/` - Receipt module
- ✅ `features/payments/` - Payment module
- ✅ `features/warranty/components/dialogs/warranty-payment-voucher-dialog.tsx` - Settlement logic
- ✅ `features/settings/cash-accounts/` - Account management UI

---

## 🎬 CONCLUSION

Module **Cashbook** là **trung tâm tài chính** của toàn hệ thống, tổng hợp từ Receipts và Payments. 

**Đặc điểm nổi bật**:
- ⭐ **Simple structure** (6 files only)
- ⭐ **Complex business logic** (Running balance, multi-account aggregation)
- ⭐ **Critical integrations** (ALL financial modules depend on it)
- ⭐ **Well-implemented frontend** (85% ready)

**Priority**: 🔴 **CAO** - Core financial module, must implement early

**Next steps**: 
1. Create Prisma schema
2. Implement backend APIs
3. Test integrations with Orders, Warranty, Complaints
4. Add advanced features (transfers, reconciliation)

---

**Người rà soát**: AI Assistant  
**Trạng thái**: ✅ Hoàn thành  
**Cần review**: Backend implementation approach, performance optimization for large datasets
