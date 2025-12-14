# 👥 CUSTOMERS MODULE - PHÂN TÍCH & ĐỀ XUẤT NÂNG CẤP

> **Ngày rà soát**: 29/11/2025  
> **Module**: Customers (Quản lý khách hàng)  
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
Customers là **module CRM cốt lõi** trong hệ thống HRM2, quản lý toàn bộ thông tin khách hàng, công nợ, và phân tích hành vi mua hàng.

### 1.2. Tính năng chính
- ✅ CRUD khách hàng với dual-ID (systemId/businessId)
- ✅ Quản lý công nợ (debt tracking, reminders)
- ✅ Customer Intelligence (RFM scores, segments, health score)
- ✅ Lifecycle stage tracking (Lead → VIP → Churned)
- ✅ Credit rating & alerts
- ✅ SLA evaluation
- ✅ Multiple addresses (shipping/billing)
- ✅ Multiple contacts
- ✅ Contract management
- ✅ Soft delete

---

## 2. PHÂN TÍCH HIỆN TRẠNG

### 2.1. Cấu trúc files

#### A. Core Files ✅
```
features/customers/
├── types.ts              ✅ Customer, DebtTransaction, DebtReminder types
├── types/
│   └── enhanced-address.ts  ✅ Enhanced address type
├── validation.ts         ✅ Zod schemas với address validation
├── store.ts              ✅ Zustand store với intelligence methods
├── data.ts               ✅ Initial data
├── columns.tsx           ✅ DataTable columns
├── page.tsx              ✅ Main list page
├── detail-page.tsx       ✅ Detail view
├── customer-form.tsx     ✅ Form component
└── customer-form-page.tsx ✅ Form page wrapper
```

#### B. Business Logic Files ✅
```
├── intelligence-utils.ts     ✅ RFM, segmentation, health score
├── debt-tracking-utils.ts    ✅ Debt status, overdue calculation
├── credit-utils.ts           ✅ Credit alerts, risk assessment
├── lifecycle-utils.ts        ✅ Lifecycle stage calculation
└── customer-service.ts       ✅ Query & filter service
```

#### C. Components ✅
```
components/
├── customer-addresses.tsx    ✅ Address management
├── debt-overview-widget.tsx  ✅ Debt summary widget
```

#### D. SLA System ✅
```
sla/
├── types.ts          ✅ SLA types
├── store.ts          ✅ SLA store
├── evaluator.ts      ✅ SLA evaluation logic
├── hooks.ts          ✅ SLA hooks
├── constants.ts      ✅ SLA constants
└── ack-storage.ts    ✅ Acknowledgement storage
```

#### E. Utilities ✅
```
utils/
└── address-conversion-helper.ts  ✅ Address conversion helpers
```

#### F. Hooks ✅
```
hooks/
└── use-high-risk-customers.ts   ✅ High risk customers hook
```

### 2.2. Đánh giá code quality

#### ✅ Điểm mạnh
1. **Type Safety**: Types rất đầy đủ với dual-ID
2. **Validation**: Zod schemas chi tiết
3. **Intelligence**: RFM, segmentation, churn risk đầy đủ
4. **Debt Tracking**: Hệ thống công nợ hoàn chỉnh
5. **SLA System**: Đánh giá SLA tự động
6. **Address Management**: Hỗ trợ multiple addresses
7. **Lifecycle Tracking**: Theo dõi vòng đời khách hàng

#### ⚠️ Điểm cần cải thiện
1. **Database**: Chưa có Prisma schema
2. **API**: Chưa có API routes (Next.js)
3. **React Query**: Chưa implement React Query hooks
4. **Real-time**: Chưa có real-time debt updates
5. **Notifications**: Chưa có auto notifications cho debt reminders
6. **Analytics Dashboard**: Chưa có customer analytics dashboard
7. **Export**: Chưa có export customer reports

---

## 3. ĐÁNH GIÁ LOGIC NGHIỆP VỤ

### 3.1. Customer Lifecycle Stages

```typescript
type CustomerLifecycleStage = 
  | "Khách tiềm năng"    // Lead - Chưa mua lần nào
  | "Khách mới"          // First-time - Mua lần đầu
  | "Khách quay lại"     // Repeat - Mua 2-4 lần
  | "Khách thân thiết"   // Loyal - Mua >= 5 lần, RFM score cao
  | "Khách VIP"          // VIP - Top 10% spending
  | "Không hoạt động"    // Dormant - Không mua > 180 ngày
  | "Mất khách";         // Churned - Không mua > 365 ngày

Logic tính toán (lifecycle-utils.ts):
- Khách tiềm năng: totalOrders = 0
- Khách mới: totalOrders = 1
- Khách quay lại: totalOrders 2-4
- Khách thân thiết: totalOrders >= 5 && RFM > 3
- Khách VIP: Top 10% totalSpent
- Không hoạt động: > 180 ngày không mua
- Mất khách: > 365 ngày không mua
```

### 3.2. Customer Intelligence (RFM Analysis)

#### A. RFM Scores (intelligence-utils.ts)
```typescript
type RFMScore = {
  recency: 1-5;      // 5 = Best (mua gần đây)
  frequency: 1-5;    // 5 = Best (mua thường xuyên)
  monetary: 1-5;     // 5 = Best (chi tiêu nhiều)
};

Tính toán:
- Recency: Số ngày từ lần mua cuối (invert: càng thấp càng tốt)
- Frequency: Tổng số đơn hàng (càng cao càng tốt)
- Monetary: Tổng chi tiêu (càng cao càng tốt)
- Score dựa trên percentile (1-5)
```

#### B. Customer Segments
```typescript
type CustomerSegment = 
  | 'Champions'           // RFM: 5-5-5 - Khách hàng tốt nhất
  | 'Loyal Customers'     // RFM: 4-4-4 - Khách thân thiết
  | 'Potential Loyalist'  // RFM: 4-3-* - Tiềm năng
  | 'New Customers'       // RFM: 5-1-* - Khách mới
  | 'Promising'           // RFM: 4-2-* - Đầy hứa hẹn
  | 'Need Attention'      // RFM: 3-2-* - Cần chú ý
  | 'About To Sleep'      // RFM: 3-1-* - Sắp ngủ đông
  | 'At Risk'             // RFM: 2-5-* - Có nguy cơ
  | 'Cannot Lose Them'    // RFM: 1-5-5 - Không thể mất
  | 'Hibernating'         // RFM: 2-1-* - Ngủ đông
  | 'Lost';               // RFM: 1-1-* - Đã mất

Phân loại theo matrix RFM chuẩn
```

#### C. Health Score (0-100)
```typescript
calculateHealthScore(customer):
- RFM average: 30%
- Purchase frequency: 20%
- Debt status: 20%
- Return rate: 15%
- Delivery success: 15%

Result: 0-100
- 80-100: Excellent
- 60-79: Good
- 40-59: Fair
- 20-39: Poor
- 0-19: Critical
```

#### D. Churn Risk
```typescript
type ChurnRisk = 'low' | 'medium' | 'high';

Factors:
- Days since last purchase
- Purchase frequency trend
- Debt overdue status
- Failed deliveries
- Return rate

Result: 
- low: Healthy customer
- medium: Needs attention
- high: At risk of churn
```

### 3.3. Debt Management

#### A. Debt Transactions
```typescript
type DebtTransaction = {
  systemId: SystemId;
  orderId: BusinessId;
  orderDate: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
  paidDate?: string;
  paidAmount?: number;
  remainingAmount?: number;
  notes?: string;
};

Flow:
1. Order created → Add debt transaction
2. Payment received → Update paidAmount
3. Full payment → isPaid = true
```

#### B. Debt Status
```typescript
type DebtStatus = 
  | "Chưa đến hạn"       // Trong hạn thanh toán
  | "Sắp đến hạn"        // Còn 1-3 ngày
  | "Đến hạn hôm nay"    // Ngày đến hạn
  | "Quá hạn 1-7 ngày"   // Nhắc nhẹ
  | "Quá hạn 8-15 ngày"  // Nhắc mạnh
  | "Quá hạn 16-30 ngày" // Cảnh báo nghiêm trọng
  | "Quá hạn > 30 ngày"; // Nguy cơ khó thu hồi

Auto-calculated based on oldestDebtDueDate
```

#### C. Debt Reminders
```typescript
type DebtReminder = {
  systemId: SystemId;
  reminderDate: string;
  reminderType: 'Gọi điện' | 'SMS' | 'Email' | 'Gặp trực tiếp' | 'Khác';
  reminderBy: SystemId;
  reminderByName?: string;
  customerResponse?: 'Hứa trả' | 'Từ chối' | 'Không liên lạc được' | 'Đã trả' | 'Khác';
  promisePaymentDate?: string;
  notes?: string;
  createdAt?: string;
};

Tracking lịch sử nhắc nợ
```

#### D. Credit Alerts
```typescript
type CreditAlertLevel = 'safe' | 'warning' | 'danger' | 'exceeded';

Calculation:
- safe: < 70% of maxDebt
- warning: 70-89% of maxDebt
- danger: 90-99% of maxDebt
- exceeded: >= 100% of maxDebt

canCreateOrder(): Check if new order exceeds credit limit
```

### 3.4. Store Operations

#### A. Intelligence Updates
```typescript
✅ updateCustomerIntelligence()
   - Batch update RFM scores
   - Update segments
   - Update health scores
   - Update churn risk
   - Update lifecycle stages

Auto-called after:
- Order created/cancelled
- Payment received
- Scheduled batch job
```

#### B. Debt Operations
```typescript
✅ updateDebt(systemId, amountChange)
   - Update currentDebt
   
✅ addDebtTransaction(systemId, transaction)
   - Add new debt record
   
✅ updateDebtTransactionPayment(systemId, orderId, amountPaid)
   - Update payment on transaction
   - Auto-calculate remainingAmount
   - Mark as paid if fully paid
   
✅ removeDebtTransaction(systemId, orderId)
   - Remove debt record (when order cancelled)
   
✅ addDebtReminder(systemId, reminder)
   - Log debt reminder
   
✅ updateDebtReminder(systemId, reminderId, updates)
   - Update reminder status/response
   
✅ removeDebtReminder(systemId, reminderId)
   - Remove reminder
```

#### C. Statistics Updates
```typescript
✅ incrementOrderStats(systemId, orderValue)
   - Increment totalOrders
   - Add to totalSpent
   - Update lastPurchaseDate
   - Auto-update intelligence
   
✅ decrementOrderStats(systemId, orderValue)
   - Decrement totalOrders (when order cancelled)
   - Subtract from totalSpent
   - Auto-update intelligence
   
✅ incrementReturnStats(systemId, quantity)
   - Increment totalQuantityReturned
   
✅ incrementFailedDeliveryStats(systemId)
   - Increment failedDeliveries
```

#### D. Query Operations
```typescript
✅ getHighRiskDebtCustomers()
   - Get customers with danger/exceeded credit level
   
✅ getOverdueDebtCustomers()
   - Get customers with overdue debt
   - Sort by days overdue (desc)
   
✅ getDueSoonCustomers()
   - Get customers with debt due in 1-3 days
   
✅ getCustomersBySegment(segment)
   - Get customers by RFM segment
```

### 3.5. SLA System

```typescript
SLA Metrics:
- First Response Time (FRT)
- Resolution Time
- Customer Satisfaction Score (CSAT)
- Net Promoter Score (NPS)

Evaluation:
- Auto-calculate SLA compliance
- Track SLA breaches
- Generate alerts
```

---

## 4. PHÂN TÍCH LIÊN KẾT MODULE

### 4.1. Settings (Master Data)
```typescript
// Customer Classification
type → CustomerType.systemId
customerGroup → CustomerGroup.systemId
source → CustomerSource.systemId
creditRating → CreditRating.systemId
paymentTerms → PaymentTerm.systemId

// Pricing
pricingLevel → PricingPolicy
```

### 4.2. Orders
```typescript
// Khi tạo order
Order.customerSystemId → Customer.systemId
→ incrementOrderStats(orderValue)
→ addDebtTransaction() if payment method = 'Công nợ'
→ updateDebt(+orderValue)

// Khi thanh toán
Payment received
→ updateDebtTransactionPayment(orderId, amount)
→ updateDebt(-amount)

// Khi hủy order
Order cancelled
→ decrementOrderStats(orderValue)
→ removeDebtTransaction(orderId)
→ updateDebt(-orderValue)
```

### 4.3. Complaints
```typescript
Complaint.customerSystemId → Customer.systemId
- Link complaints to customer
- Affect health score
```

### 4.4. Warranty
```typescript
Warranty.customerSystemId → Customer.systemId
- Link warranty tickets to customer
```

### 4.5. Sales-Returns
```typescript
SalesReturn.customerSystemId → Customer.systemId
→ incrementReturnStats(quantity)
- Affect health score
- May trigger refund → update debt
```

### 4.6. Cashbook
```typescript
// Customer payment
Receipt.customerSystemId → Customer.systemId
Receipt.type = 'debt_payment'
→ updateDebt(-amount)
→ updateDebtTransactionPayment()
```

### 4.7. Employees
```typescript
Customer.accountManagerId → Employee.systemId
Customer.createdBy → Employee.systemId
Customer.updatedBy → Employee.systemId
DebtReminder.reminderBy → Employee.systemId
```

---

## 5. PRISMA SCHEMA

```prisma
// ═══════════════════════════════════════════════════════════════
// CUSTOMERS
// ═══════════════════════════════════════════════════════════════

enum CustomerStatus {
  ACTIVE         // "Đang giao dịch"
  INACTIVE       // "Ngừng Giao Dịch"
}

enum CustomerLifecycleStage {
  LEAD           // "Khách tiềm năng"
  FIRST_TIME     // "Khách mới"
  REPEAT         // "Khách quay lại"
  LOYAL          // "Khách thân thiết"
  VIP            // "Khách VIP"
  DORMANT        // "Không hoạt động"
  CHURNED        // "Mất khách"
}

enum PricingLevel {
  RETAIL
  WHOLESALE
  VIP
  PARTNER
}

model Customer {
  // IDs
  systemId            String               @id @default(cuid())
  id                  String               @unique // Business ID
  
  // Basic Info
  name                String
  email               String?
  phone               String?
  company             String?
  status              CustomerStatus       @default(ACTIVE)
  
  // Tax & Business
  taxCode             String?
  representative      String?              // Người đại diện
  position            String?              // Chức vụ
  
  // Contact & Banking
  zaloPhone           String?
  bankName            String?
  bankAccount         String?
  
  // Addresses (One-to-Many)
  addresses           CustomerAddress[]
  
  // Legacy flat address fields (deprecated but kept for compatibility)
  shippingAddress_street    String?
  shippingAddress_ward      String?
  shippingAddress_district  String?
  shippingAddress_province  String?
  billingAddress_street     String?
  billingAddress_ward       String?
  billingAddress_district   String?
  billingAddress_province   String?
  
  // Debt Management
  currentDebt         Decimal              @default(0) @db.Decimal(18, 2)
  maxDebt             Decimal?             @db.Decimal(18, 2) // Credit limit
  
  // Debt Tracking (Auto-calculated)
  oldestDebtDueDate   DateTime?
  maxDaysOverdue      Int?
  debtStatus          String?              // DebtStatus enum as string
  
  // Classification
  typeId              String?
  type                CustomerTypeSetting? @relation(fields: [typeId], references: [systemId])
  
  groupId             String?
  group               CustomerGroup?       @relation(fields: [groupId], references: [systemId])
  
  lifecycleStage      CustomerLifecycleStage?
  
  // Customer Intelligence (Auto-calculated)
  rfmRecency          Int?                 @db.SmallInt // 1-5
  rfmFrequency        Int?                 @db.SmallInt // 1-5
  rfmMonetary         Int?                 @db.SmallInt // 1-5
  segment             String?              // CustomerSegment
  healthScore         Int?                 @db.SmallInt // 0-100
  churnRisk           String?              // 'low' | 'medium' | 'high'
  
  // Source & Campaign
  sourceId            String?
  source              CustomerSource?      @relation(fields: [sourceId], references: [systemId])
  
  campaign            String?
  referredById        String?
  referredBy          Customer?            @relation("CustomerReferrals", fields: [referredById], references: [systemId])
  referrals           Customer[]           @relation("CustomerReferrals")
  
  // Contacts (One-to-Many)
  contacts            CustomerContact[]
  
  // Payment Terms & Credit
  paymentTermsId      String?
  paymentTerms        PaymentTerm?         @relation(fields: [paymentTermsId], references: [systemId])
  
  creditRatingId      String?
  creditRating        CreditRating?        @relation(fields: [creditRatingId], references: [systemId])
  
  allowCredit         Boolean              @default(true)
  
  // Discount & Pricing
  defaultDiscount     Decimal?             @db.Decimal(5, 2) // 0-100%
  pricingLevel        PricingLevel?
  
  // Contract (JSON or separate table)
  contractNumber      String?
  contractStartDate   DateTime?
  contractEndDate     DateTime?
  contractValue       Decimal?             @db.Decimal(18, 2)
  contractStatus      String?              // 'Active' | 'Expired' | 'Pending' | 'Cancelled'
  contractFileUrl     String?
  contractDetails     String?              @db.Text
  
  // Tags
  tags                String[]
  
  // Images
  images              String[]
  
  // Social Media
  socialFacebook      String?
  socialLinkedin      String?
  socialWebsite       String?
  
  // Notes
  notes               String?              @db.Text
  
  // Account Management
  accountManagerId    String?
  accountManager      Employee?            @relation("CustomerAccountManager", fields: [accountManagerId], references: [systemId])
  
  // Statistics
  totalOrders         Int                  @default(0)
  totalSpent          Decimal              @default(0) @db.Decimal(18, 2)
  totalQuantityPurchased Int               @default(0)
  totalQuantityReturned  Int               @default(0)
  lastPurchaseDate    DateTime?
  failedDeliveries    Int                  @default(0)
  
  // Relationship tracking
  lastContactDate     DateTime?
  nextFollowUpDate    DateTime?
  followUpReason      String?
  followUpAssigneeId  String?
  followUpAssignee    Employee?            @relation("CustomerFollowUpAssignee", fields: [followUpAssigneeId], references: [systemId])
  
  // Audit
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
  deletedAt           DateTime?
  isDeleted           Boolean              @default(false)
  
  createdById         String?
  createdBy           Employee?            @relation("CustomerCreatedBy", fields: [createdById], references: [systemId])
  
  updatedById         String?
  updatedBy           Employee?            @relation("CustomerUpdatedBy", fields: [updatedById], references: [systemId])
  
  // Relations
  orders              Order[]
  debtTransactions    DebtTransaction[]
  debtReminders       DebtReminder[]
  complaints          Complaint[]
  warrantyTickets     Warranty[]
  salesReturns        SalesReturn[]
  
  @@index([id])
  @@index([name])
  @@index([phone])
  @@index([email])
  @@index([status])
  @@index([lifecycleStage])
  @@index([segment])
  @@index([isDeleted])
  @@index([createdAt])
  @@map("customers")
}

// ═══════════════════════════════════════════════════════════════
// CUSTOMER ADDRESSES
// ═══════════════════════════════════════════════════════════════
model CustomerAddress {
  id                  String    @id @default(cuid())
  
  customerId          String
  customer            Customer  @relation(fields: [customerId], references: [systemId], onDelete: Cascade)
  
  label               String    // "Nhà riêng", "Văn phòng", etc.
  street              String
  contactName         String?
  contactPhone        String?
  
  inputLevel          String?   // '2-level' | '3-level'
  autoFilled          Boolean   @default(false)
  
  province            String
  provinceId          String
  district            String
  districtId          Int
  ward                String
  wardId              String
  
  isDefaultShipping   Boolean   @default(false)
  isDefaultBilling    Boolean   @default(false)
  
  notes               String?
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@index([customerId])
  @@map("customer_addresses")
}

// ═══════════════════════════════════════════════════════════════
// CUSTOMER CONTACTS
// ═══════════════════════════════════════════════════════════════
model CustomerContact {
  id                  String    @id @default(cuid())
  
  customerId          String
  customer            Customer  @relation(fields: [customerId], references: [systemId], onDelete: Cascade)
  
  name                String
  role                String    // "Giám đốc", "Kế toán", etc.
  phone               String?
  email               String?
  isPrimary           Boolean   @default(false)
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@index([customerId])
  @@map("customer_contacts")
}

// ═══════════════════════════════════════════════════════════════
// DEBT TRANSACTIONS
// ═══════════════════════════════════════════════════════════════
model DebtTransaction {
  systemId            String    @id @default(cuid())
  
  customerId          String
  customer            Customer  @relation(fields: [customerId], references: [systemId])
  
  orderId             String    // Business ID of order
  order               Order     @relation(fields: [orderId], references: [id])
  
  orderDate           DateTime
  amount              Decimal   @db.Decimal(18, 2)
  dueDate             DateTime
  
  isPaid              Boolean   @default(false)
  paidDate            DateTime?
  paidAmount          Decimal?  @db.Decimal(18, 2)
  remainingAmount     Decimal?  @db.Decimal(18, 2)
  
  notes               String?
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@index([customerId])
  @@index([orderId])
  @@index([dueDate])
  @@index([isPaid])
  @@map("debt_transactions")
}

// ═══════════════════════════════════════════════════════════════
// DEBT REMINDERS
// ═══════════════════════════════════════════════════════════════
enum ReminderType {
  PHONE
  SMS
  EMAIL
  IN_PERSON
  OTHER
}

enum CustomerResponse {
  PROMISED
  REFUSED
  NO_CONTACT
  PAID
  OTHER
}

model DebtReminder {
  systemId            String            @id @default(cuid())
  
  customerId          String
  customer            Customer          @relation(fields: [customerId], references: [systemId])
  
  reminderDate        DateTime
  reminderType        ReminderType
  
  reminderById        String
  reminderBy          Employee          @relation(fields: [reminderById], references: [systemId])
  reminderByName      String?
  
  customerResponse    CustomerResponse?
  promisePaymentDate  DateTime?
  notes               String?           @db.Text
  
  createdAt           DateTime          @default(now())
  updatedAt           DateTime          @updatedAt
  
  @@index([customerId])
  @@index([reminderDate])
  @@map("debt_reminders")
}
```

---

## 6. API ROUTES (NEXT.JS)

### 6.1. Customer CRUD

```typescript
// app/api/customers/route.ts
GET    /api/customers              // List with filters, pagination, search
POST   /api/customers              // Create new customer

// app/api/customers/[systemId]/route.ts
GET    /api/customers/:systemId    // Get by ID
PATCH  /api/customers/:systemId    // Update
DELETE /api/customers/:systemId    // Soft delete

// app/api/customers/[systemId]/restore/route.ts
POST   /api/customers/:systemId/restore  // Restore deleted
```

### 6.2. Intelligence Operations

```typescript
// Update intelligence
POST /api/customers/:systemId/intelligence/update
→ Recalculate RFM, segment, health score, churn risk

// Batch update all customers
POST /api/customers/intelligence/batch-update

// Get by segment
GET /api/customers/segments/:segment
```

### 6.3. Debt Operations

```typescript
// Debt transactions
GET  /api/customers/:systemId/debt-transactions
POST /api/customers/:systemId/debt-transactions
{
  orderId: string,
  amount: number,
  dueDate: string
}

PATCH /api/customers/:systemId/debt-transactions/:transactionId/payment
{
  amountPaid: number
}

DELETE /api/customers/:systemId/debt-transactions/:transactionId

// Debt reminders
GET  /api/customers/:systemId/debt-reminders
POST /api/customers/:systemId/debt-reminders
{
  reminderType: string,
  customerResponse?: string,
  promisePaymentDate?: string,
  notes?: string
}

PATCH /api/customers/:systemId/debt-reminders/:reminderId
DELETE /api/customers/:systemId/debt-reminders/:reminderId

// Debt alerts
GET /api/customers/debt/overdue
GET /api/customers/debt/due-soon
GET /api/customers/debt/high-risk
```

### 6.4. Statistics Operations

```typescript
// Update statistics (called from Orders module)
POST /api/customers/:systemId/stats/order
{
  action: 'increment' | 'decrement',
  orderValue: number
}

POST /api/customers/:systemId/stats/return
{
  quantity: number
}

POST /api/customers/:systemId/stats/failed-delivery
```

### 6.5. Address & Contact Management

```typescript
// Addresses
GET    /api/customers/:systemId/addresses
POST   /api/customers/:systemId/addresses
PATCH  /api/customers/:systemId/addresses/:addressId
DELETE /api/customers/:systemId/addresses/:addressId

// Contacts
GET    /api/customers/:systemId/contacts
POST   /api/customers/:systemId/contacts
PATCH  /api/customers/:systemId/contacts/:contactId
DELETE /api/customers/:systemId/contacts/:contactId
```

### 6.6. Reports & Analytics

```typescript
// Customer analytics
GET /api/customers/analytics/overview
GET /api/customers/analytics/segments
GET /api/customers/analytics/lifecycle
GET /api/customers/analytics/churn

// Export
GET /api/customers/export?format=xlsx|csv&segment=Champions
```

---

## 7. REACT QUERY HOOKS

### 7.1. Query Hooks

```typescript
// hooks/use-customers.ts
export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => fetchCustomers(filters),
  });
}

export function useCustomer(systemId: string) {
  return useQuery({
    queryKey: ['customers', systemId],
    queryFn: () => fetchCustomer(systemId),
    enabled: !!systemId,
  });
}

export function useCustomerIntelligence(systemId: string) {
  return useQuery({
    queryKey: ['customers', systemId, 'intelligence'],
    queryFn: () => fetchCustomerIntelligence(systemId),
  });
}

export function useCustomerDebtTransactions(systemId: string) {
  return useQuery({
    queryKey: ['customers', systemId, 'debt-transactions'],
    queryFn: () => fetchDebtTransactions(systemId),
  });
}

export function useCustomerDebtReminders(systemId: string) {
  return useQuery({
    queryKey: ['customers', systemId, 'debt-reminders'],
    queryFn: () => fetchDebtReminders(systemId),
  });
}

export function useCustomersBySegment(segment: string) {
  return useQuery({
    queryKey: ['customers', 'segments', segment],
    queryFn: () => fetchCustomersBySegment(segment),
  });
}

export function useOverdueDebtCustomers() {
  return useQuery({
    queryKey: ['customers', 'debt', 'overdue'],
    queryFn: () => fetchOverdueDebtCustomers(),
  });
}

export function useDueSoonCustomers() {
  return useQuery({
    queryKey: ['customers', 'debt', 'due-soon'],
    queryFn: () => fetchDueSoonCustomers(),
  });
}

export function useHighRiskCustomers() {
  return useQuery({
    queryKey: ['customers', 'debt', 'high-risk'],
    queryFn: () => fetchHighRiskCustomers(),
  });
}
```

### 7.2. Mutation Hooks

```typescript
// hooks/use-customer-mutations.ts
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCustomerInput) => createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Tạo khách hàng thành công');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ systemId, data }: UpdateCustomerInput) => 
      updateCustomer(systemId, data),
    onSuccess: (_, { systemId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', systemId] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Cập nhật khách hàng thành công');
    },
  });
}

export function useUpdateCustomerIntelligence() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (systemId: string) => updateCustomerIntelligence(systemId),
    onSuccess: (_, systemId) => {
      queryClient.invalidateQueries({ queryKey: ['customers', systemId] });
    },
  });
}

export function useAddDebtTransaction() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, data }: AddDebtTransactionInput) => 
      addDebtTransaction(customerId, data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'debt-transactions'] });
    },
  });
}

export function useUpdateDebtPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateDebtPaymentInput) => updateDebtPayment(data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId] });
      queryClient.invalidateQueries({ queryKey: ['customers', 'debt'] });
    },
  });
}

export function useAddDebtReminder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ customerId, data }: AddDebtReminderInput) => 
      addDebtReminder(customerId, data),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: ['customers', customerId, 'debt-reminders'] });
    },
  });
}
```

---

## 8. UI COMPONENTS

### 8.1. List View (Mobile-First)

```typescript
// app/customers/page.tsx
export default function CustomersPage() {
  const { data, isLoading } = useCustomers(filters);
  
  return (
    <div className="container py-6">
      {/* Filters */}
      <CustomerFilters />
      
      {/* Mobile: Cards */}
      <div className="md:hidden">
        {data?.items.map(customer => (
          <CustomerCard key={customer.systemId} customer={customer} />
        ))}
      </div>
      
      {/* Desktop: Table */}
      <div className="hidden md:block">
        <DataTable 
          columns={customerColumns} 
          data={data?.items ?? []} 
        />
      </div>
    </div>
  );
}
```

### 8.2. Customer Card (Mobile)

```typescript
// components/customers/customer-card.tsx
export function CustomerCard({ customer }: { customer: Customer }) {
  const creditAlert = getCreditAlertLevel(customer);
  const debtInfo = calculateDebtTrackingInfo(customer);
  
  return (
    <Card>
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={customer.images?.[0]} />
          <AvatarFallback>{customer.name[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h3 className="font-semibold">{customer.name}</h3>
          <p className="text-sm text-muted-foreground">{customer.id}</p>
          
          <div className="flex gap-2 mt-2">
            <Badge variant={getSegmentVariant(customer.segment)}>
              {customer.segment}
            </Badge>
            <Badge variant={getLifecycleVariant(customer.lifecycleStage)}>
              {customer.lifecycleStage}
            </Badge>
          </div>
          
          {/* Debt Info */}
          {customer.currentDebt > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Công nợ:</span>
                <span className="font-semibold">
                  {formatCurrency(customer.currentDebt)}
                </span>
              </div>
              
              {debtInfo.debtStatus && (
                <Badge variant={getDebtStatusVariant(debtInfo.debtStatus)}>
                  {debtInfo.debtStatus}
                </Badge>
              )}
            </div>
          )}
          
          {/* Stats */}
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Đơn hàng:</span>
              <span className="font-semibold ml-1">{customer.totalOrders}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Chi tiêu:</span>
              <span className="font-semibold ml-1">
                {formatCurrency(customer.totalSpent)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
```

### 8.3. Customer Form

```typescript
// components/customers/customer-form.tsx
export function CustomerForm({ customer }: { customer?: Customer }) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer ?? defaultValues,
  });
  
  return (
    <Form {...form}>
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
          <TabsTrigger value="contacts">Liên hệ</TabsTrigger>
          <TabsTrigger value="financial">Tài chính</TabsTrigger>
          <TabsTrigger value="intelligence">Phân tích</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <BasicInfoFields />
        </TabsContent>
        
        <TabsContent value="addresses">
          <AddressesSection />
        </TabsContent>
        
        <TabsContent value="contacts">
          <ContactsSection />
        </TabsContent>
        
        <TabsContent value="financial">
          <FinancialSection />
        </TabsContent>
        
        <TabsContent value="intelligence">
          <IntelligenceSection />
        </TabsContent>
      </Tabs>
    </Form>
  );
}
```

### 8.4. Debt Tracking Widget

```typescript
// components/customers/debt-tracking-widget.tsx
export function DebtTrackingWidget({ customer }: { customer: Customer }) {
  const { data: transactions } = useCustomerDebtTransactions(customer.systemId);
  const { data: reminders } = useCustomerDebtReminders(customer.systemId);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Công nợ</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <DebtSummary customer={customer} />
          
          {/* Transactions */}
          <div>
            <h4 className="font-semibold mb-2">Giao dịch nợ</h4>
            <DebtTransactionList transactions={transactions} />
          </div>
          
          {/* Reminders */}
          <div>
            <h4 className="font-semibold mb-2">Lịch sử nhắc nợ</h4>
            <DebtReminderList reminders={reminders} />
            <Button onClick={() => openAddReminderDialog()}>
              Thêm lịch nhắc
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 8.5. Customer Intelligence Dashboard

```typescript
// components/customers/intelligence-dashboard.tsx
export function IntelligenceDashboard({ customer }: { customer: Customer }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* RFM Scores */}
      <Card>
        <CardHeader>
          <CardTitle>RFM Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <RFMChart rfmScores={customer.rfmScores} />
        </CardContent>
      </Card>
      
      {/* Segment */}
      <Card>
        <CardHeader>
          <CardTitle>Phân khúc</CardTitle>
        </CardHeader>
        <CardContent>
          <SegmentBadge segment={customer.segment} />
          <SegmentDescription segment={customer.segment} />
        </CardContent>
      </Card>
      
      {/* Health Score */}
      <Card>
        <CardHeader>
          <CardTitle>Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <HealthScoreGauge score={customer.healthScore} />
        </CardContent>
      </Card>
      
      {/* Churn Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Nguy cơ mất khách</CardTitle>
        </CardHeader>
        <CardContent>
          <ChurnRiskIndicator risk={customer.churnRisk} />
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 9. KẾ HOẠCH TRIỂN KHAI

### Phase 1: Database & API (Tuần 1)
- [ ] Tạo Prisma schema cho Customers
- [ ] Tạo migration
- [ ] Implement API routes (CRUD)
- [ ] Implement debt operations API
- [ ] Implement intelligence operations API

### Phase 2: React Query Integration (Tuần 2)
- [ ] Implement query hooks
- [ ] Implement mutation hooks
- [ ] Replace Zustand with React Query
- [ ] Add optimistic updates
- [ ] Add real-time sync

### Phase 3: UI Components (Tuần 3)
- [ ] Rebuild list page (mobile-first)
- [ ] Rebuild form page với tabs
- [ ] Implement debt tracking widget
- [ ] Implement intelligence dashboard
- [ ] Add address management
- [ ] Add contact management

### Phase 4: Advanced Features (Tuần 4)
- [ ] Implement bulk operations
- [ ] Implement import/export
- [ ] Add customer analytics dashboard
- [ ] Add automated debt reminders
- [ ] Add email/SMS notifications
- [ ] Mobile app optimization

### Phase 5: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance testing
- [ ] UAT
- [ ] Production deployment

---

## 10. CHECKLIST

### ✅ Code Quality
- [x] Types đầy đủ với SystemId/BusinessId
- [x] Validation với Zod schemas
- [x] Store với business logic
- [x] Intelligence utils hoàn chỉnh
- [x] Debt tracking utils
- [x] Credit utils
- [ ] No TypeScript errors
- [ ] ESLint passed

### ✅ Business Logic
- [x] Lifecycle stage tracking
- [x] RFM analysis
- [x] Customer segmentation
- [x] Health score calculation
- [x] Churn risk assessment
- [x] Debt tracking
- [x] Credit alerts
- [x] SLA evaluation
- [ ] Real-time updates

### ⏳ Database
- [ ] Prisma schema defined
- [ ] Relations mapped
- [ ] Indexes optimized
- [ ] Migration scripts

### ⏳ API
- [ ] CRUD endpoints
- [ ] Intelligence operations
- [ ] Debt operations
- [ ] Statistics updates
- [ ] Analytics endpoints
- [ ] Import/Export

### ⏳ React Query
- [ ] Query hooks
- [ ] Mutation hooks
- [ ] Optimistic updates
- [ ] Error handling
- [ ] Cache invalidation

### ✅ UI/UX
- [x] Responsive design
- [x] Mobile-first
- [x] shadcn/ui components
- [ ] Intelligence dashboard
- [ ] Loading states
- [ ] Error boundaries

### ⏳ Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Performance tests

---

**Tài liệu tạo**: 29/11/2025  
**Phiên bản**: 1.0  
**Trạng thái**: ✅ Hoàn thành phân tích
