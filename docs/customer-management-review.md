# Customer Management Feature Review

**Ngày review:** 2024-11-28
**Reviewer:** AI Assistant (Claude)
**Version:** 1.0

---

## 1. Tổng quan 📋

### 1.1 Mô tả chức năng
Quản lý khách hàng toàn diện với các tính năng nâng cao:
- CRUD khách hàng (cá nhân/doanh nghiệp)
- Quản lý địa chỉ đa cấp (2-level/3-level)
- Quản lý công nợ và hạn mức
- Customer Intelligence (RFM, Health Score, Churn Risk)
- Debt Tracking với reminder system
- Customer Lifecycle Management

### 1.2 File Structure
```
features/customers/
├── columns.tsx                    # Table columns with intelligence badges
├── components/
│   ├── address-bidirectional-converter.tsx
│   ├── address-conversion-dialog.tsx
│   ├── address-form-dialog.tsx
│   └── bulk-action-confirm-dialog.tsx
├── credit-utils.ts               # Credit alert utilities
├── customer-addresses.tsx        # Address management component
├── customer-form.tsx             # Main form (1504 lines)
├── customer-form-page.tsx        # Form page wrapper
├── customer-service.ts           # Query/filter service
├── data.ts                       # Sample data
├── debt-overview-widget.tsx      # Dashboard widget
├── debt-tracking-utils.ts        # Debt status utilities
├── detail-page.tsx               # Detail view (884 lines)
├── hooks/
│   └── use-customers-query.ts    # TanStack Query hook
├── intelligence-utils.ts         # RFM, Health Score, Churn Risk
├── lifecycle-utils.ts            # Lifecycle stage calculation
├── page.tsx                      # List page (739 lines)
├── store.ts                      # Zustand store with augmented methods
├── trash-columns.tsx
├── trash-page.tsx
├── types/
│   └── enhanced-address.ts       # Dual-level address types
├── types.ts                      # Main type definitions
├── utils/
│   └── address-conversion-helper.ts
├── validation.ts                 # Zod schemas
└── __tests__/
    ├── customers-page-loop.test.tsx
    └── customers-page-persistence.test.tsx
```

### 1.3 Đánh giá tổng thể

| Tiêu chí | Điểm | Ghi chú |
|----------|------|---------|
| Code Organization | 4.0/5 | Tốt, có phân tách utils rõ ràng |
| Type Safety | 4.5/5 | Comprehensive types với SystemId/BusinessId |
| Business Logic | 4.5/5 | RFM, Lifecycle, Debt tracking xuất sắc |
| UI/UX | 4.0/5 | Dashboard widgets, badges đầy đủ |
| Testing | 2.5/5 | Chỉ có 2 test files cơ bản |
| Security | 3.5/5 | Cần sanitization cho notes/description |
| Performance | 4.0/5 | Fuse.js search, TanStack Query |

**Điểm trung bình: 3.9/5** ⭐⭐⭐⭐

---

## 2. Phân tích chi tiết 🔍

### 2.1 Types (`types.ts`) ✅ Excellent

**Customer Type Fields:**
- **Basic Info:** id, name, email, phone, company, status
- **Tax/Business:** taxCode, representative, position
- **Addresses:** Multiple addresses với enhanced-address support
- **Banking:** zaloPhone, bankName, bankAccount
- **Debt Management:** currentDebt, maxDebt, debtTransactions[], debtReminders[]
- **Classification:** type, customerGroup, lifecycleStage
- **Intelligence:** rfmScores, segment, healthScore, churnRisk
- **Source Tracking:** source, campaign, referredBy
- **Contacts:** Multiple contacts với roles
- **Payment:** paymentTerms, creditRating, allowCredit, defaultDiscount, pricingLevel
- **Contract:** number, dates, value, status, fileUrl
- **Social:** facebook, linkedin, website
- **Statistics:** totalOrders, totalSpent, lastPurchaseDate, failedDeliveries
- **Audit:** createdAt, updatedAt, deletedAt, isDeleted, createdBy, updatedBy

**CustomerLifecycleStage:**
```typescript
| "Khách tiềm năng"    // Lead - Chưa mua
| "Khách mới"          // First-time
| "Khách quay lại"     // Repeat (2-4 lần)
| "Khách thân thiết"   // Loyal (>= 5 lần)
| "Khách VIP"          // Top 10% spending
| "Không hoạt động"    // Dormant (> 180 ngày)
| "Mất khách"          // Churned (> 365 ngày)
```

**DebtStatus:**
```typescript
| "Chưa đến hạn"       | "Sắp đến hạn" (1-3 ngày)
| "Đến hạn hôm nay"    | "Quá hạn 1-7 ngày"
| "Quá hạn 8-15 ngày"  | "Quá hạn 16-30 ngày"
| "Quá hạn > 30 ngày"
```

### 2.2 Store (`store.ts`) ✅ Excellent

**Augmented Methods:**
```typescript
searchCustomers()              // Fuse.js async search with pagination
updateDebt()                   // Adjust debt amount
incrementOrderStats()          // Track orders/spending
decrementOrderStats()          // Handle order cancellation
incrementReturnStats()         // Track returns
incrementFailedDeliveryStats() // Track failed deliveries
addDebtTransaction()           // Add new debt record
updateDebtTransactionPayment() // Partial/full payment
removeDebtTransaction()        // Remove debt record
getHighRiskDebtCustomers()     // Get danger/exceeded debt
updateCustomerIntelligence()   // Batch RFM/health update
getCustomersBySegment()        // Filter by segment
getOverdueDebtCustomers()      // Get overdue list
getDueSoonCustomers()          // Get due soon list
removeMany()                   // Bulk soft delete
updateManyStatus()             // Bulk status update
restoreMany()                  // Bulk restore
```

**Auto-calculations on add/update:**
- `lifecycleStage` auto-calculated từ order stats

### 2.3 Intelligence Utilities (`intelligence-utils.ts`) ✅ Excellent

**RFM Scoring:**
- Recency: Days since last purchase (5 = recent, 1 = old)
- Frequency: Total orders (5 = frequent, 1 = rare)
- Monetary: Total spending (5 = high, 1 = low)
- Percentile-based scoring

**Customer Segments (11 types):**
| Segment | Mô tả | Badge |
|---------|-------|-------|
| Champions | RFM 5-5-5, best customers | success |
| Loyal Customers | RFM 4-4-4, stable | success |
| Potential Loyalist | High potential | default |
| New Customers | High recency, low frequency | secondary |
| Promising | Good recency, moderate frequency | default |
| Need Attention | Moderate scores | warning |
| About To Sleep | Low frequency | warning |
| At Risk | Low recency, good history | destructive |
| Cannot Lose Them | Low recency, high value | destructive |
| Hibernating | Low recency and frequency | destructive |
| Lost | Lowest scores | destructive |

**Health Score (0-100):**
- Recency: 30 points
- Frequency: 25 points
- Monetary: 25 points
- Engagement: 10 points
- Payment behavior: 10 points

**Churn Risk:**
- Low: Active, within normal cycle
- Medium: > 1.5x average cycle
- High: > 2x average cycle or > 365 days

### 2.4 Debt Tracking (`debt-tracking-utils.ts`) ✅ Excellent

**Functions:**
```typescript
calculateDueDate()            // Order date + payment terms
parsePaymentTerms()           // "NET30" → 30
calculateDaysOverdue()        // Days past due
calculateDaysUntilDue()       // Days remaining
getDebtStatus()               // Status từ dueDate
getDebtStatusVariant()        // Badge variant
calculateDebtTrackingInfo()   // Full tracking info
getOverdueDebtCustomers()     // Sort by priority
getDueSoonCustomers()         // 1-3 days list
calculateTotalOverdueDebt()   // Sum overdue
calculateTotalDueSoonDebt()   // Sum due soon
```

### 2.5 Credit Utilities (`credit-utils.ts`) ✅ Good

**Alert Levels:**
| Level | Condition | Action |
|-------|-----------|--------|
| safe | < 70% of maxDebt | No action |
| warning | >= 70% | Monitor |
| danger | >= 90% | Alert |
| exceeded | >= 100% | Block |

**`canCreateOrder()` check:**
- Kiểm tra allowCredit và currentDebt
- Kiểm tra newDebt vs maxDebt

### 2.6 Lifecycle Utilities (`lifecycle-utils.ts`) ✅ Good

**Auto-calculation Logic:**
```typescript
if (totalOrders === 0) → "Khách tiềm năng"
if (daysSinceLastPurchase > 365) → "Mất khách"
if (daysSinceLastPurchase > 180) → "Không hoạt động"
if (totalSpent >= 50M && totalOrders >= 5) → "Khách VIP"
if (totalOrders >= 5) → "Khách thân thiết"
if (totalOrders >= 2) → "Khách quay lại"
else → "Khách mới"
```

### 2.7 Address System (`enhanced-address.ts`) ✅ Excellent

**Dual-Level Support:**
- 2-level: Province + Ward (theo luật 2025)
- 3-level: Province + District + Ward (cũ, cho API vận chuyển)
- Auto-fill district từ wardId
- Bidirectional conversion

**Address Flags:**
- isDefaultShipping
- isDefaultBilling
- inputLevel: '2-level' | '3-level'
- autoFilled: boolean

### 2.8 Validation (`validation.ts`) ✅ Good

**Validation Rules:**
- Phone: Vietnam format (0|+84)[3-9][0-9]{8}
- Email: Standard email regex
- Tax Code: 10-13 digits
- Bank Account: 9-20 digits
- Name: 2-200 chars
- Notes: max 500 chars

---

## 3. Vấn đề cần cải thiện ⚠️

### 3.1 Form Size Complexity (MEDIUM)
**File:** `customer-form.tsx` (1504 lines)

**Vấn đề:**
- File quá lớn, khó maintain
- Nhiều sections (basic, address, contacts, contract, etc.)

**Đề xuất:**
```
features/customers/form/
├── customer-form.tsx           # Main form container
├── basic-info-section.tsx      # Name, phone, email, company
├── classification-section.tsx  # Type, group, lifecycle
├── address-section.tsx         # Multiple addresses
├── contacts-section.tsx        # Multiple contacts
├── financial-section.tsx       # Debt, credit, payment terms
├── contract-section.tsx        # Contract info
├── social-section.tsx          # Social links
└── index.ts
```

### 3.2 Missing updateCustomerIntelligence Call (MEDIUM) ✅ COMPLETED
**File:** `store.ts`

**Vấn đề:**
- `updateCustomerIntelligence()` chỉ tính RFM khi gọi manually
- Không auto-update khi order stats thay đổi

**Giải pháp đã thực hiện:**
- Đã cập nhật `incrementOrderStats()` và `decrementOrderStats()` trong store.ts
- Tự động tính toán RFM, segment, healthScore, churnRisk, lifecycleStage sau khi cập nhật order stats
- Không cần gọi `updateCustomerIntelligence()` manually nữa

### 3.3 Debt Reminder Missing Store Methods (MEDIUM) ✅ COMPLETED
**File:** `store.ts`, `types.ts`

**Vấn đề:**
- Có `debtReminders` trong type nhưng không có store method để add/update

**Giải pháp đã thực hiện:**
- Đã thêm `addDebtReminder()` vào store
- Đã thêm `updateDebtReminder()` vào store  
- Đã thêm `removeDebtReminder()` vào store

### 3.4 Intelligence Not Reactive (LOW) ✅ COMPLETED
**File:** `columns.tsx`

**Vấn đề:**
- Tính toán inline trong render

**Giải pháp đã thực hiện:**
- Đã tạo `hooks/use-customer-intelligence.ts` với các hooks reactive:
  - `useCustomerIntelligence()` - Full intelligence data
  - `useCustomerRFM()` - RFM scores và segment
  - `useCustomerHealthScore()` - Health score với level
  - `useCustomerChurnRisk()` - Churn risk prediction
  - `useCustomerLifecycleStage()` - Lifecycle stage

### 3.5 Missing Hooks for Common Operations (LOW) ✅ COMPLETED
**File:** `hooks/`

**Hiện tại:**
- `use-customers-query.ts`
- `use-customer-intelligence.ts` ✨ NEW
- `use-customer-debt.ts` ✨ NEW
- `use-high-risk-customers.ts` ✨ NEW

**Hooks mới:**
```typescript
// hooks/use-customer-intelligence.ts
useCustomerIntelligence(customer) - All intelligence data
useCustomerRFM(customer) - RFM scores
useCustomerHealthScore(customer) - Health score
useCustomerChurnRisk(customer) - Churn risk
useCustomerLifecycleStage(customer) - Lifecycle

// hooks/use-customer-debt.ts
useCustomerDebt(customer) - Comprehensive debt info
useCustomerDebtTransactions(customer) - Enriched transactions
useDebtReminders(customer) - Sorted reminders
useCanCreateOrder(customer, amount) - Order eligibility check

// hooks/use-high-risk-customers.ts
useHighRiskDebtCustomers() - High debt risk customers
useOverdueDebtCustomers() - Overdue debt list
useDueSoonCustomers() - Due in 1-3 days
useCustomersBySegment(segment) - Filter by RFM segment
useAtRiskCustomers() - Churn risk customers
useCustomerStats() - Summary statistics
```

### 3.6 Detail Page Size (MEDIUM)
**File:** `detail-page.tsx` (884 lines)

**Vấn đề:**
- Quá nhiều tabs và sections
- Khó maintain

**Đề xuất tách:**
```
features/customers/detail/
├── detail-page.tsx           # Main page
├── customer-info-card.tsx    # Basic info
├── customer-stats-card.tsx   # Statistics
├── debt-history-tab.tsx      # Debt transactions
├── orders-tab.tsx            # Related orders
├── warranty-tab.tsx          # Warranty tickets
└── addresses-tab.tsx
```

### 3.7 No Input Sanitization (MEDIUM) ✅ COMPLETED
**File:** `customer-form.tsx`, `detail-page.tsx`

**Vấn đề:**
- `notes` field không có sanitization
- Có thể XSS nếu render raw

**Giải pháp đã thực hiện:**
- Đã import `sanitizeToText` từ `@/lib/sanitize` trong detail-page.tsx
- Đã áp dụng `sanitizeToText(customer.notes)` khi render notes
- Notes được sanitize để loại bỏ HTML tags trước khi hiển thị

### 3.8 Missing Batch Intelligence Update UI (LOW)
**Vấn đề:**
- Có `updateCustomerIntelligence()` nhưng không có UI trigger

**Đề xuất:**
- Thêm button "Cập nhật điểm KH" trong page actions
- Hoặc scheduled job chạy hàng ngày

---

## 4. Tính năng tốt cần giữ 🌟

### 4.1 RFM Analysis System
```typescript
// Comprehensive RFM với percentile-based scoring
// 11 customer segments với actions rõ ràng
// Health Score và Churn Risk predictions
```

### 4.2 Debt Tracking System
```typescript
// Transaction-level debt tracking
// Reminder system với customer response
// Due date calculation từ payment terms
// Overdue prioritization
```

### 4.3 Dual-Level Address System
```typescript
// Support cả 2-level và 3-level
// Auto-fill district từ ward
// Bidirectional conversion
// API compatibility cho shipping
```

### 4.4 Customer Lifecycle Management
```typescript
// Auto-calculate từ order behavior
// 7 lifecycle stages
// Visual badges trong list/detail
```

### 4.5 Comprehensive Statistics
```typescript
// totalOrders, totalSpent
// totalQuantityPurchased, totalQuantityReturned
// lastPurchaseDate, failedDeliveries
```

---

## 5. Security Considerations 🔒

### 5.1 Input Sanitization ⚠️ NOT IMPLEMENTED
**File:** `customer-form.tsx`, `detail-page.tsx`

**Cần thêm:**
```typescript
import { sanitizeHtml, sanitizeToText } from '@/lib/sanitize';

// Cho notes và description fields
const sanitizedNotes = sanitizeToText(customer.notes);
```

### 5.2 Data Validation ✅ IMPLEMENTED
- Zod validation đầy đủ
- Phone, email, taxCode format checks
- Business ID uniqueness check

### 5.3 Audit Trail ✅ IMPLEMENTED
- createdAt, updatedAt, deletedAt
- createdBy, updatedBy (SystemId)

---

## 6. Testing Coverage 📊

### 6.1 Existing Tests
- `customers-page-loop.test.tsx` - Page rendering
- `customers-page-persistence.test.tsx` - State persistence

### 6.2 Missing Tests ⚠️
- [ ] Intelligence utilities (RFM, health score)
- [ ] Debt tracking utilities
- [ ] Credit utilities
- [ ] Lifecycle utilities
- [ ] Address conversion logic
- [ ] Store augmented methods
- [ ] Validation edge cases

**Đề xuất test files:**
```
__tests__/
├── intelligence-utils.test.ts
├── debt-tracking-utils.test.ts
├── credit-utils.test.ts
├── lifecycle-utils.test.ts
├── address-conversion.test.ts
└── customer-store.test.ts
```

---

## 7. Performance Considerations ⚡

### 7.1 Fuse.js Search ✅ OK
```typescript
// Fresh instance per search - correct
const fuse = new Fuse(dataset, fuseOptions);
```

### 7.2 Intelligence Calculation ⚠️ POTENTIAL
- RFM calculation loops through all customers
- May slow down với > 10000 customers

**Đề xuất:**
- Cache RFM scores
- Background calculation
- Debounce batch updates

### 7.3 TanStack Query ✅ OK
- Proper staleTime (30s)
- Query key includes data dependencies

---

## 8. Recommendations Summary 📝

### High Priority
1. **Thêm input sanitization** cho notes/description fields
2. **Thêm debt reminder store methods** (addDebtReminder, updateDebtReminder)
3. **Auto-update intelligence** sau order stats change

### Medium Priority
4. **Tách customer-form.tsx** thành sections
5. **Tách detail-page.tsx** thành tabs
6. **Thêm tests** cho utilities (intelligence, debt, credit)

### Low Priority
7. **Tạo reactive hooks** cho intelligence
8. **Thêm batch update UI** cho customer intelligence
9. **Performance optimization** cho large datasets

---

## 9. Migration Path 🛤️

### Phase 1: Security & Stability
- [ ] Add sanitization to lib/sanitize.ts (if not exists)
- [ ] Apply sanitization to customer notes/description
- [ ] Add debt reminder store methods

### Phase 2: Code Organization
- [ ] Split customer-form.tsx into sections
- [ ] Split detail-page.tsx into tabs
- [ ] Create additional hooks

### Phase 3: Testing
- [ ] Add unit tests for all utilities
- [ ] Add integration tests for store methods
- [ ] Add E2E tests for critical flows

### Phase 4: Performance
- [ ] Cache intelligence calculations
- [ ] Implement background updates
- [ ] Virtual scrolling for large lists

---

**Kết luận:** Chức năng quản lý khách hàng được xây dựng rất toàn diện với nhiều tính năng nâng cao (RFM, Debt Tracking, Lifecycle). Cần cải thiện về testing coverage, input sanitization, và code organization để dễ maintain hơn.
