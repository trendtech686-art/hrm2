# 📋 PROMPT RÀ SOÁT TOÀN BỘ CHỨC NĂNG HRM2

> Tài liệu hướng dẫn prompt để rà soát từng chức năng trong hệ thống
> Mục tiêu: shadcn + mobile-first + Prisma/PostgreSQL + Next.js + VPS deployment

---

## 🚦 Tiến độ triển khai

| Module | Trạng thái | Tài liệu |
|--------|-----------|----------|
| **Settings** | ✅ Đã rà soát | [settings-upgrade.md](./settings-upgrade.md) |
| **Employees** | ✅ Đã rà soát | [employees-upgrade.md](./employees-upgrade.md) |

---

## 🗂️ MỤC LỤC

1. [Sơ đồ liên kết tổng quan](#sơ-đồ-liên-kết-tổng-quan)
2. [Ma trận liên kết chi tiết](#ma-trận-liên-kết-chi-tiết)
3. [Prompts theo từng chức năng](#prompts-theo-từng-chức-năng)
4. [Prompts kiểm tra liên kết](#prompts-kiểm-tra-liên-kết)
5. [Checklist rà soát](#checklist-rà-soát)

---

## 🔗 SƠ ĐỒ LIÊN KẾT TỔNG QUAN

```
                                    ┌─────────────┐
                                    │  SETTINGS   │
                                    │  (master)   │
                                    └──────┬──────┘
                                           │
              ┌────────────────────────────┼────────────────────────────┐
              │                            │                            │
              ▼                            ▼                            ▼
      ┌───────────────┐           ┌───────────────┐           ┌───────────────┐
      │   EMPLOYEES   │           │   PRODUCTS    │           │   CUSTOMERS   │
      │   (HR core)   │           │  (Inventory)  │           │   (CRM core)  │
      └───────┬───────┘           └───────┬───────┘           └───────┬───────┘
              │                           │                           │
    ┌─────────┼─────────┐        ┌────────┼────────┐        ┌─────────┼─────────┐
    │         │         │        │        │        │        │         │         │
    ▼         ▼         ▼        ▼        ▼        ▼        ▼         ▼         ▼
┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐┌───────┐┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│LEAVES │ │ATTEND-│ │PAYROLL│ │STOCK  ││STOCK  ││INVENT-│ │ORDERS │ │COMPLA-│ │WARRAN-│
│       │ │ANCE   │ │       │ │TRANS- ││LOCAT- ││ORY    │ │       │ │INTS   │ │TY     │
└───────┘ └───────┘ └───────┘ │FERS   ││IONS   ││CHECKS │ └───┬───┘ └───┬───┘ └───┬───┘
                              └───────┘└───────┘└───────┘     │         │         │
                                                              │         │         │
                              ┌────────────────────────────────┤         │         │
                              │                                │         │         │
                              ▼                                ▼         ▼         ▼
                      ┌───────────────┐               ┌─────────────────────────────────┐
                      │   SUPPLIERS   │               │         CASHBOOK/PAYMENTS       │
                      └───────┬───────┘               │    (Thu chi, Công nợ, Receipts) │
                              │                       └─────────────────────────────────┘
                              ▼
                      ┌───────────────┐
                      │PURCHASE-ORDERS│──────────► INVENTORY-RECEIPTS
                      └───────────────┘
                              │
                              ▼
                      ┌───────────────┐
                      │PURCHASE-RETURN│
                      └───────────────┘


                      ┌───────────────┐
                      │    TASKS      │◄──────────── (Giao việc cho Employees)
                      └───────────────┘
```

---

## 📊 MA TRẬN LIÊN KẾT CHI TIẾT

| Chức năng | Liên kết với | Loại liên kết |
|-----------|--------------|---------------|
| **Orders** | Customers, Products, Employees, Cashbook, Shipments, Sales-Returns, Warranty, Complaints | FK, Triggers |
| **Customers** | Orders, Complaints, Warranty, Sales-Returns, Cashbook (debt) | FK, Aggregations |
| **Products** | Orders, Purchase-Orders, Inventory-Checks, Stock-Transfers, Warranty, Sales-Returns | FK, Stock updates |
| **Employees** | Tasks, Leaves, Attendance, Payroll, Orders (salesperson), all (createdBy/updatedBy) | FK, Audit |
| **Suppliers** | Purchase-Orders, Purchase-Returns, Cashbook (debt) | FK |
| **Warranty** | Orders, Customers, Products, Cashbook (settlements) | FK, Payments |
| **Complaints** | Orders, Customers, Products, Inventory-Checks, Cashbook | FK, Adjustments |
| **Purchase-Orders** | Suppliers, Products, Inventory-Receipts, Cashbook | FK, Stock in |
| **Stock-Transfers** | Products, Branches (settings) | FK, Stock move |
| **Inventory-Checks** | Products, Branches (settings), Complaints | FK, Stock adjust |
| **Cashbook** | Orders, Purchase-Orders, Warranty, Complaints, Customers, Suppliers | FK, Transactions |
| **Tasks** | Employees (assignees), Settings (task types) | FK |
| **Leaves** | Employees, Settings (leave types) | FK |
| **Attendance** | Employees, Settings (shifts) | FK |
| **Payroll** | Employees, Attendance, Leaves | FK, Calculations |

---

## 📝 PROMPTS THEO TỪNG CHỨC NĂNG

### 1. CUSTOMERS (Khách hàng)

```
Rà soát chức năng Customers (features/customers):

A. FILES CẦN KIỂM TRA:
- types.ts, validation.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, customer-form.tsx
- hooks/, components/, sla/, utils/
- intelligence-utils.ts, credit-utils.ts, debt-tracking-utils.ts, lifecycle-utils.ts

B. LOGIC CẦN ĐÁNH GIÁ:
1. Customer CRUD với dual-ID (systemId/businessId)
2. Debt management (công nợ, transactions, reminders)
3. Customer Intelligence (RFM scores, segments, health score, churn risk)
4. SLA evaluation
5. Lifecycle stage tracking
6. Credit rating & alerts

C. LIÊN KẾT:
- Orders: totalOrders, totalSpent, lastPurchaseDate
- Complaints: linked by customerSystemId
- Warranty: linked by customerSystemId
- Sales-Returns: linked by customerSystemId
- Cashbook: debt transactions

D. ĐỀ XUẤT:
- Prisma schema với relations
- React Query hooks
- Mobile-first UI components
- API routes (Next.js)

Output: docs/new/customers-upgrade.md
```

---

### 2. EMPLOYEES (Nhân viên)

```
Rà soát chức năng Employees (features/employees):

A. FILES CẦN KIỂM TRA:
- types.ts, validation.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, employee-form.tsx
- roles.ts, permissions.ts
- document-store.ts, employee-comp-store.ts

B. LOGIC CẦN ĐÁNH GIÁ:
1. Employee CRUD với dual-ID
2. Address management (2-level / 3-level)
3. Role & Permission system
4. Document management
5. Compensation tracking
6. Account linking (auth)

C. LIÊN KẾT:
- Tasks: assignees
- Leaves: leave requests
- Attendance: check-in/out
- Payroll: salary calculations
- Orders: salesperson
- All modules: createdBy/updatedBy audit

D. ĐỀ XUẤT:
- Prisma schema với User relation
- Permission-based access control
- Employee self-service portal
- Mobile attendance app

Output: docs/new/employees-upgrade.md
```

---

### 3. PRODUCTS (Sản phẩm)

```
Rà soát chức năng Products (features/products):

A. FILES CẦN KIỂM TRA:
- types.ts, validation.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, form-page.tsx
- product-form-complete.tsx, product-service.ts, product-importer.ts
- combo-utils.ts, stock-alert-utils.ts
- hooks/, components/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Product CRUD với dual-ID
2. Product types (physical, service, digital, combo)
3. Multi-branch inventory (inventoryByBranch, committedByBranch, inTransitByBranch)
4. Pricing policies (multiple price tiers)
5. Combo products logic
6. Stock alerts (reorderLevel, safetyStock, maxStock)
7. Image gallery management
8. SEO fields (ktitle, seoDescription)

C. LIÊN KẾT:
- Orders: line items, stock out
- Purchase-Orders: line items, stock in
- Stock-Transfers: inter-branch movement
- Inventory-Checks: stock adjustment
- Warranty: product warranty period
- Sales-Returns: returned items
- Settings: categories, brands, units, storage locations

D. ĐỀ XUẤT:
- Prisma schema với inventory tracking
- Real-time stock updates
- Barcode/QR scanning
- Bulk import/export

Output: docs/new/products-upgrade.md
```

---

### 4. ORDERS (Đơn hàng)

```
Rà soát chức năng Orders (features/orders):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, order-detail-page.tsx, order-form-page.tsx
- order-card.tsx, order-search-api.ts
- shipping-partners-config.ts
- hooks/, components/, utils/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Order CRUD với dual-ID
2. Multi-status tracking (main, payment, delivery, print, stockOut, return)
3. Line items với discount (percentage/fixed)
4. Packaging management
5. Shipment integration (GHTK webhooks)
6. Payment tracking (multiple payments)
7. Service fees
8. Exchange orders (linked to Sales-Returns)

C. LIÊN KẾT:
- Customers: customerSystemId, debt updates
- Products: stock out (committedByBranch → inventoryByBranch)
- Employees: salesperson
- Cashbook: payment receipts
- Sales-Returns: linked returns
- Warranty: order-based warranty
- Complaints: order-based complaints
- Shipments: packaging & delivery

D. ĐỀ XUẤT:
- Order state machine
- Real-time shipment tracking
- Payment gateway integration
- Mobile order management

Output: docs/new/orders-upgrade.md
```

---

### 5. SUPPLIERS (Nhà cung cấp)

```
Rà soát chức năng Suppliers (features/suppliers):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, form-page.tsx
- supplier-form.tsx, supplier-card.tsx

B. LOGIC CẦN ĐÁNH GIÁ:
1. Supplier CRUD với dual-ID
2. Status management (Đang giao dịch / Ngừng giao dịch)
3. Debt tracking (currentDebt)
4. Banking info
5. Contact management

C. LIÊN KẾT:
- Purchase-Orders: supplierSystemId
- Purchase-Returns: supplier returns
- Products: primarySupplierSystemId
- Cashbook: supplier payments

D. ĐỀ XUẤT:
- Supplier portal
- Purchase history analytics
- Payment terms management
- Supplier rating system

Output: docs/new/suppliers-upgrade.md
```

---

### 6. PURCHASE-ORDERS (Đơn nhập hàng)

```
Rà soát chức năng Purchase-Orders (features/purchase-orders):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, form-page.tsx
- purchase-order-card.tsx, payment-utils.ts
- components/

B. LOGIC CẦN ĐÁNH GIÁ:
1. PO CRUD với dual-ID
2. Multi-status (main, delivery, payment, return, refund)
3. Line items với tax, discount
4. Payment tracking
5. Inventory receipt linking
6. Activity history

C. LIÊN KẾT:
- Suppliers: supplierSystemId
- Products: line items, stock in
- Inventory-Receipts: receiving goods
- Purchase-Returns: returns to supplier
- Cashbook: payments to supplier
- Employees: buyer, creator

D. ĐỀ XUẤT:
- Auto-reorder based on stock levels
- Supplier price comparison
- Approval workflow
- Cost tracking & analytics

Output: docs/new/purchase-orders-upgrade.md
```

---

### 7. INVENTORY-CHECKS (Kiểm kê)

```
Rà soát chức năng Inventory-Checks (features/inventory-checks):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, form-page.tsx
- card.tsx
- components/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Inventory check CRUD với dual-ID
2. Status (draft, balanced, cancelled)
3. Item-level tracking (system vs actual quantity)
4. Difference reasons (damaged, wear, return, transfer, production)
5. Stock adjustment on balance
6. Activity history

C. LIÊN KẾT:
- Products: stock adjustment
- Branches: branch-specific checks
- Complaints: linked inventory adjustments
- Employees: createdBy, balancedBy

D. ĐỀ XUẤT:
- Barcode scanning for counting
- Cycle counting schedules
- Variance reports
- Mobile counting app

Output: docs/new/inventory-checks-upgrade.md
```

---

### 8. STOCK-TRANSFERS (Chuyển kho)

```
Rà soát chức năng Stock-Transfers (features/stock-transfers):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, form-page.tsx, edit-page.tsx
- stock-transfer-card.tsx
- components/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Transfer CRUD với dual-ID
2. Status flow (pending → transferring → completed/cancelled)
3. From/To branch management
4. Item tracking (quantity vs receivedQuantity)
5. In-transit stock tracking (inTransitByBranch)

C. LIÊN KẾT:
- Products: stock movement between branches
- Branches: fromBranch, toBranch
- Employees: createdBy, transferredBy, receivedBy

D. ĐỀ XUẤT:
- Transfer request workflow
- Real-time tracking
- Partial receiving
- Transfer cost allocation

Output: docs/new/stock-transfers-upgrade.md
```

---

### 9. SALES-RETURNS (Trả hàng bán)

```
Rà soát chức năng Sales-Returns (features/sales-returns):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, form-page.tsx
- components/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Sales return CRUD với dual-ID
2. Return items tracking
3. Exchange items (new order)
4. Multiple payment/refund methods
5. Inventory receiving (isReceived)
6. Linked vouchers (payment/receipt)

C. LIÊN KẾT:
- Orders: original order, exchange order
- Customers: customerSystemId
- Products: returned items, exchange items, stock in
- Cashbook: refund payments, customer payments
- Branches: branchSystemId

D. ĐỀ XUẤT:
- Return policy enforcement
- RMA (Return Merchandise Authorization) workflow
- Refund automation
- Return analytics

Output: docs/new/sales-returns-upgrade.md
```

---

### 10. COMPLAINTS (Khiếu nại)

```
Rà soát chức năng Complaints (features/complaints):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx, form-page.tsx
- complaint-card.tsx, complaint-card-context-menu.tsx
- public-tracking-page.tsx, statistics-page.tsx
- sla-utils.ts, notification-utils.ts, tracking-utils.ts
- handlers/, hooks/, components/, constants/, utils/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Complaint CRUD với dual-ID + publicTrackingCode
2. Type classification (wrong-product, missing-items, etc.)
3. Status flow (pending → investigating → resolved/cancelled/ended)
4. Verification (verified-correct, verified-incorrect)
5. Resolution types (refund, return-shipping, advice-only, rejected)
6. Affected products tracking
7. Inventory adjustment
8. SLA tracking
9. Public tracking page

C. LIÊN KẾT:
- Orders: orderSystemId, orderValue
- Customers: customerSystemId
- Products: affectedProducts
- Inventory-Checks: inventoryAdjustment
- Cashbook: compensation payments
- Employees: assignedTo, createdBy

D. ĐỀ XUẤT:
- Complaint workflow automation
- SLA enforcement & alerts
- Customer notification integration
- Analytics dashboard

Output: docs/new/complaints-upgrade.md
```

---

### 11. WARRANTY (Bảo hành)

```
Rà soát chức năng Warranty (features/warranty):

A. FILES CẦN KIỂM TRA:
- types.ts, types/ folder
- store.ts, store/ folder
- warranty-list-page.tsx, warranty-detail-page.tsx, warranty-form-page.tsx
- warranty-card.tsx, warranty-card-context-menu.tsx
- warranty-tracking-page.tsx, warranty-statistics-page.tsx
- warranty-sla-utils.ts, notification-utils.ts, tracking-utils.ts
- public-warranty-api.ts
- hooks/, components/, utils/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Warranty ticket CRUD với dual-ID
2. Status flow (incomplete → pending → processed → returned → completed/cancelled)
3. Settlement management (multiple methods)
4. Resolution types (return, replace, deduct, out_of_stock)
5. Warranty items tracking
6. SLA tracking
7. Public tracking page

C. LIÊN KẾT:
- Orders: linked order, warranty period
- Customers: customerSystemId
- Products: warranty items
- Cashbook: settlement payments
- Employees: handlers

D. ĐỀ XUẤT:
- Warranty claim automation
- Parts inventory for repairs
- Technician assignment
- Customer notification integration

Output: docs/new/warranty-upgrade.md
```

---

### 12. TASKS (Công việc)

```
Rà soát chức năng Tasks (features/tasks):

A. FILES CẦN KIỂM TRA:
- types.ts, types-filter.ts
- store.ts, custom-fields-store.ts, recurring-store.ts, template-store.ts
- page.tsx, detail-page.tsx, task-form-page.tsx
- kanban-view.tsx, calendar-view.tsx
- dashboard-page.tsx, user-tasks-page.tsx
- recurring-page.tsx, templates-page.tsx, field-management-page.tsx
- task-card.tsx
- components/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Task CRUD với dual-ID
2. Multiple assignees với roles (owner, contributor, reviewer)
3. Status flow với approval
4. Priority management
5. Time tracking
6. Subtasks management
7. Comments & Attachments
8. Completion evidence & approval
9. Recurring tasks
10. Task templates
11. Custom fields

C. LIÊN KẾT:
- Employees: assignees, assigner
- Settings: task types

D. ĐỀ XUẤT:
- Kanban board optimization
- Calendar integration
- Mobile task app
- Team workload analytics
- Automation rules

Output: docs/new/tasks-upgrade.md
```

---

### 13. LEAVES (Nghỉ phép)

```
Rà soát chức năng Leaves (features/leaves):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, detail-page.tsx
- leave-form.tsx, leave-form-schema.ts
- leave-quota-service.ts, leave-sync-service.ts

B. LOGIC CẦN ĐÁNH GIÁ:
1. Leave request CRUD với dual-ID
2. Status flow (Chờ duyệt → Đã duyệt / Đã từ chối)
3. Leave type integration (paid/unpaid, requires attachment)
4. Quota management
5. Date range calculation

C. LIÊN KẾT:
- Employees: employeeSystemId
- Settings: leave types
- Payroll: leave deductions
- Attendance: absence tracking

D. ĐỀ XUẤT:
- Leave calendar view
- Approval workflow
- Quota auto-calculation
- Manager dashboard
- Mobile leave requests

Output: docs/new/leaves-upgrade.md
```

---

### 14. ATTENDANCE (Chấm công)

```
Rà soát chức năng Attendance (features/attendance):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx
- components/
- utils.ts

B. LOGIC CẦN ĐÁNH GIÁ:
1. Attendance CRUD
2. Check-in/Check-out tracking
3. Shift management
4. Overtime calculation
5. Late/Early tracking

C. LIÊN KẾT:
- Employees: employeeSystemId
- Settings: shifts, work schedules
- Leaves: absence correlation
- Payroll: attendance-based calculations

D. ĐỀ XUẤT:
- Mobile check-in với GPS
- Face recognition
- QR code scanning
- Real-time dashboard
- Integration với máy chấm công

Output: docs/new/attendance-upgrade.md
```

---

### 15. PAYROLL (Bảng lương)

```
Rà soát chức năng Payroll (features/payroll):

A. FILES CẦN KIỂM TRA:
- payroll-batch-store.ts, payroll-template-store.ts
- list-page.tsx, detail-page.tsx, run-page.tsx, template-page.tsx
- components/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Payroll batch management
2. Salary template configuration
3. Payroll run process
4. Deductions & Allowances
5. Tax calculations
6. Net salary calculation

C. LIÊN KẾT:
- Employees: employee data, compensation
- Attendance: working days, overtime
- Leaves: leave deductions
- Settings: salary components, tax rates

D. ĐỀ XUẤT:
- Payroll automation
- Bank file generation
- Payslip generation (PDF)
- Tax reporting
- Compliance checks

Output: docs/new/payroll-upgrade.md
```

---

### 16. CASHBOOK (Sổ quỹ)

```
Rà soát chức năng Cashbook (features/cashbook):

A. FILES CẦN KIỂM TRA:
- types.ts, store.ts
- columns.tsx, page.tsx, reports-page.tsx

B. LOGIC CẦN ĐÁNH GIÁ:
1. Receipt/Payment voucher CRUD
2. Cash flow tracking
3. Account management
4. Balance calculation
5. Reports generation

C. LIÊN KẾT:
- Orders: customer payments
- Purchase-Orders: supplier payments
- Customers: debt payments
- Suppliers: debt payments
- Warranty: settlements
- Complaints: compensation
- Sales-Returns: refunds

D. ĐỀ XUẤT:
- Bank reconciliation
- Auto-voucher generation
- Cash flow forecasting
- Financial reports
- Audit trail

Output: docs/new/cashbook-upgrade.md
```

---

### 17. SETTINGS (Cài đặt)

```
Rà soát chức năng Settings (features/settings):

A. FOLDERS CẦN KIỂM TRA:
- branches/, departments/, job-titles/
- customers/ (types, sources, ratings, payment terms, pricing)
- employees/ (leave types, documents, benefits)
- inventory/ (categories, brands, units, storage locations)
- payments/, receipt-types/
- sales/, sales-channels/, shipping/
- tasks/, warranty/, complaints/
- taxes/, penalties/
- templates/, provinces/, system/

B. LOGIC CẦN ĐÁNH GIÁ:
1. CRUD cho từng setting type
2. Active/Inactive management
3. Default values
4. Ordering/Sorting
5. Dependencies between settings

C. LIÊN KẾT:
- All modules use settings as master data

D. ĐỀ XUẤT:
- Settings sync across instances
- Import/Export settings
- Version control for settings
- Role-based settings access

Output: docs/new/settings-upgrade.md
```

---

### 18. DASHBOARD

```
Rà soát chức năng Dashboard (features/dashboard):

A. FILES CẦN KIỂM TRA:
- page.tsx
- debt-alert-widget.tsx

B. LOGIC CẦN ĐÁNH GIÁ:
1. KPI widgets
2. Charts & Graphs
3. Real-time data
4. Role-based views

C. LIÊN KẾT:
- All modules for aggregated data

D. ĐỀ XUẤT:
- Customizable dashboard
- Widget library
- Real-time updates
- Mobile dashboard
- Export to PDF/Excel

Output: docs/new/dashboard-upgrade.md
```

---

### 19. REPORTS

```
Rà soát chức năng Reports (features/reports):

A. FOLDERS CẦN KIỂM TRA:
- sales-report/
- inventory-report/
- customer-sla-report/
- product-sla-report/

B. LOGIC CẦN ĐÁNH GIÁ:
1. Report generation
2. Filters & Parameters
3. Export formats
4. Scheduling

C. LIÊN KẾT:
- All modules for report data

D. ĐỀ XUẤT:
- Report builder
- Scheduled reports
- Email distribution
- Custom report templates
- Interactive charts

Output: docs/new/reports-upgrade.md
```

---

## 🔗 PROMPTS KIỂM TRA LIÊN KẾT

### Liên kết Orders ↔ Customers ↔ Cashbook

```
Phân tích flow thanh toán đơn hàng:
1. Order tạo → Customer debt tăng
2. Customer thanh toán → Cashbook receipt → Order payment status update → Customer debt giảm
3. Kiểm tra consistency giữa 3 modules
4. Tìm gaps và race conditions
```

### Liên kết Orders ↔ Products ↔ Stock

```
Phân tích flow xuất kho:
1. Order confirmed → Products committed (committedByBranch)
2. Packaging → Stock out (inventoryByBranch giảm, committedByBranch giảm)
3. Cancel order → Rollback stock
4. Kiểm tra consistency
```

### Liên kết Purchase-Orders ↔ Products ↔ Suppliers

```
Phân tích flow nhập kho:
1. PO created → Expected stock
2. Inventory Receipt → Stock in (inventoryByBranch tăng)
3. Purchase Return → Stock out, Supplier refund
4. Kiểm tra consistency
```

### Liên kết Warranty ↔ Orders ↔ Cashbook

```
Phân tích flow bảo hành:
1. Warranty từ Order → Check warranty period
2. Settlement types → Cashbook vouchers
3. Customer debt impact
4. Kiểm tra consistency
```

### Liên kết Complaints ↔ Orders ↔ Inventory

```
Phân tích flow khiếu nại:
1. Complaint từ Order
2. Investigation → Inventory adjustment
3. Resolution → Cashbook compensation
4. Kiểm tra consistency
```

---

## ✅ CHECKLIST RÀ SOÁT

### A. Code Quality
- [ ] Types đầy đủ, sử dụng SystemId/BusinessId
- [ ] Validation với Zod schemas
- [ ] Store actions đầy đủ CRUD + business logic
- [ ] Error handling
- [ ] Loading states
- [ ] No TypeScript errors

### B. UI/UX
- [ ] Responsive design (mobile-first)
- [ ] shadcn/ui components
- [ ] Consistent styling
- [ ] Accessibility (a11y)
- [ ] Loading skeletons
- [ ] Error boundaries
- [ ] Toast notifications

### C. Performance
- [ ] Component splitting (< 500 lines per file)
- [ ] Lazy loading
- [ ] Memoization where needed
- [ ] Virtual scrolling for large lists

### D. Database Ready
- [ ] Prisma schema defined
- [ ] Relations mapped
- [ ] Indexes identified
- [ ] Migration strategy

### E. API Ready
- [ ] API routes designed
- [ ] React Query hooks
- [ ] Error handling
- [ ] Pagination support

---

## 📅 THỨ TỰ ƯU TIÊN RÀ SOÁT

| Priority | Module | Reason |
|----------|--------|--------|
| 1 | **Settings** | Master data, foundation for all |
| 2 | **Employees** | Core HR, audit trail |
| 3 | **Products** | Inventory foundation |
| 4 | **Customers** | CRM foundation |
| 5 | **Suppliers** | Purchasing foundation |
| 6 | **Orders** | Core business, complex |
| 7 | **Purchase-Orders** | Stock in flow |
| 8 | **Cashbook** | Financial tracking |
| 9 | **Stock-Transfers** | Inventory movement |
| 10 | **Inventory-Checks** | Stock adjustment |
| 11 | **Sales-Returns** | Return handling |
| 12 | **Complaints** | Customer service |
| 13 | **Warranty** | After-sales |
| 14 | **Tasks** | Workflow management |
| 15 | **Leaves** | HR operations |
| 16 | **Attendance** | HR operations |
| 17 | **Payroll** | HR operations |
| 18 | **Dashboard** | Analytics |
| 19 | **Reports** | Business intelligence |

---

*Document created: 2025-11-29*
*Version: 1.0*
