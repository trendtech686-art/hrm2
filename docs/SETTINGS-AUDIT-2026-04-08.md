# Settings Audit Report — 08/04/2026

> Rà soát lại toàn bộ settings sau nhiều đợt fix.
> Mỗi field được xác minh bằng cách tìm consumer thực tế (không tính settings page / API route lưu).

---

## Tổng quan

| Trạng thái | Ý nghĩa | Số fields |
|-----------|---------|-----------|
| ✅ ALIVE | Lưu + backend/frontend đọc & dùng | 95 |
| ⚠️ PARTIAL | Lưu, inject nhưng chưa có template/logic dùng | 3 |
| ❌ DEAD | Lưu vào DB nhưng KHÔNG code nào đọc | 14 |

**Tỷ lệ alive: ~85%** (cải thiện từ ~65% trước khi fix)

---

## 1. Sales Management Settings

**Storage**: `Setting(key='sales-management-settings', group='sales')`

| Field | Status | Consumer |
|-------|--------|----------|
| allowCancelAfterExport | ✅ | `app/actions/orders.ts`, `app/api/orders/[systemId]/cancel/route.ts` |
| allowNegativeOrder | ✅ | `features/orders/components/order-form-page.tsx` (stock check at draft) |
| allowNegativeApproval | ✅ | `features/orders/components/order-form-page.tsx` (stock check at approval) |
| allowNegativePacking | ✅ | `app/api/orders/.../confirm/route.ts` |
| allowNegativeStockOut | ✅ | `dispatch/route.ts`, `in-store-pickup/confirm/route.ts`, `sales-returns/route.ts` |
| printCopies | ✅ | `features/orders/hooks/use-order-print-handlers.ts` → `printMultiple()` khi copies > 1 |

**Verdict: 6/6 ALIVE ✅** — Đã fix `printCopies` (session gần đây)

---

## 2. Complaints SLA Settings

**Storage**: `Setting(key='complaints_sla_settings', group='complaints')`

| Field | Status | Consumer |
|-------|--------|----------|
| LOW.responseTime | ✅ | `app/api/cron/complaint-reminders/route.ts` (reads from DB) |
| LOW.resolveTime | ✅ | `features/complaints/components/kanban-column.tsx` (via `useComplaintsSettings()`) |
| MEDIUM.responseTime | ✅ | Same |
| MEDIUM.resolveTime | ✅ | Same |
| HIGH.* | ✅ | Same |
| CRITICAL.* | ✅ | Same |

**Verdict: 8/8 ALIVE ✅** — Cron đọc từ DB, UI dùng React Query

---

## 3. Complaints Reminder Settings

**Storage**: `Setting(key='complaints_reminder_settings', group='complaints')`

| Field | Status | Consumer |
|-------|--------|----------|
| enabled | ✅ | `app/api/cron/complaint-reminders/route.ts` → skip nếu `!reminders.enabled` |
| firstReminderHours | ✅ | Cron dùng (inherited from SLA timing) |
| secondReminderHours | ✅ | Cron dùng |
| escalationHours | ✅ | Cron dùng để classify escalation |

**Verdict: 4/4 ALIVE ✅** — Đã fix (session gần đây, tạo cron)

---

## 4. Complaints Notification Settings

**Storage**: `Setting(key='complaints_notification_settings', group='complaints')`

| Field | Status | Consumer |
|-------|--------|----------|
| emailOnCreate | ✅ | `lib/complaint-notifications.ts` |
| emailOnAssign | ✅ | `lib/complaint-notifications.ts` |
| emailOnVerified | ✅ | `notifyComplaintStatusChanged()` maps `IN_PROGRESS → emailOnVerified` |
| emailOnResolved | ✅ | `notifyComplaintStatusChanged()` maps `RESOLVED → emailOnResolved` |
| emailOnOverdue | ✅ | `notifyComplaintOverdue()` checks setting; called from cron |
| inAppNotifications | ✅ | `lib/notifications.ts` → `isModuleInAppEnabled('complaint')` |

**Verdict: 6/6 ALIVE ✅** — emailOnVerified/Resolved đã alive từ trước (statusToggle mapping)

---

## 5. Warranty SLA Settings

**Storage**: `Setting(key='warranty_sla_targets', group='warranty')`

| Field | Status | Consumer |
|-------|--------|----------|
| low/medium/high/urgent responseTime | ⚠️ PARTIAL | Cron `warranty-reminders` đọc từ DB ✅, nhưng UI (`use-warranty-time-tracking.ts`) dùng **HARDCODED** `DEFAULT_WARRANTY_SLA_TARGETS` |
| low/medium/high/urgent resolveTime | ⚠️ PARTIAL | Same — cron alive, UI hardcoded |

**Chi tiết vấn đề**:
- `warranty-sla-utils.ts` export `WARRANTY_SLA_TARGETS = { response: 120, processing: 1440, return: 2880 }` (hardcoded minutes)
- `use-warranty-time-tracking.ts` import từ file trên → **KHÔNG đọc DB**
- `loadWarrantySLATargets()` marked `@deprecated` nhưng vẫn trả hardcoded defaults
- `app/api/cron/warranty-reminders/route.ts` → **ĐỌC TỪ DB** ✅

**Verdict: Cron ALIVE, UI DEAD** — Cần refactor `warranty-sla-utils.ts` để đọc từ DB hoặc React Query hook

---

## 6. Warranty Notification Settings

**Storage**: `Setting(key='warranty_notification_settings', group='warranty')`

| Field | Status | Consumer |
|-------|--------|----------|
| emailOnCreate | ✅ | `lib/warranty-notifications.ts` |
| emailOnAssign | ✅ | `lib/warranty-notifications.ts` |
| emailOnInspected | ✅ | `notifyWarrantyStatusChanged()` maps `PROCESSING → emailOnInspected` |
| emailOnApproved | ✅ | Maps `COMPLETED/RETURNED → emailOnApproved` |
| emailOnRejected | ✅ | Maps `CANCELLED → emailOnRejected` |
| emailOnOverdue | ✅ | `notifyWarrantyOverdue()` checks setting; called from cron |
| inAppNotifications | ✅ | `lib/notifications.ts` → `isModuleInAppEnabled('warranty')` |
| reminderNotifications | ✅ | `app/api/cron/warranty-reminders/route.ts` → skip nếu disabled |

**Verdict: 8/8 ALIVE ✅**

---

## 7. Task SLA Settings

**Storage**: `Setting(key='tasks_sla_settings', group='tasks')`

| Field | Status | Consumer |
|-------|--------|----------|
| SLA per priority | ✅ | `features/tasks/components/detail-page.tsx` (deadline calc), `app/api/cron/task-reminders/route.ts` |

**Verdict: ALIVE ✅**

---

## 8. Task Reminder Settings

**Storage**: `Setting(key='tasks_reminder_settings', group='tasks')`

| Field | Status | Consumer |
|-------|--------|----------|
| enabled | ✅ | `app/api/cron/task-reminders/route.ts` |
| firstReminderHours | ✅ | Cron |
| secondReminderHours | ✅ | Cron |
| escalationHours | ✅ | Cron |

**Verdict: 4/4 ALIVE ✅** — Đã fix (session gần đây, tạo cron)

---

## 9. Task Notification Settings

**Storage**: `Setting(key='tasks_notification_settings', group='tasks')`

| Field | Status | Consumer |
|-------|--------|----------|
| emailOnCreate | ✅ | `lib/task-notifications.ts` → `notifyTaskCreated()` |
| emailOnAssign | ✅ | `lib/task-notifications.ts` → `notifyTaskAssigned()` |
| emailOnComplete | ✅ | `lib/task-notifications.ts` → `notifyTaskCompleted()` |
| emailOnOverdue | ✅ | `lib/task-notifications.ts` → `notifyTaskOverdue()` |
| emailOnApprovalPending | ✅ | `lib/task-notifications.ts` → `notifyTaskApprovalPending()` |
| inAppNotifications | ✅ | `lib/notifications.ts` → `isModuleInAppEnabled('task')` |

**Verdict: 6/6 ALIVE ✅** — emailOnCreate + emailOnApprovalPending đã fix (session gần đây)

---

## 10. Sales/Warehouse/HR/System Notification Settings

**Storage**: `Setting(group='system-notifications')` — đọc bởi `shouldNotify()` trong `lib/notifications.ts`

### Sales Notifications
| Field | Status | Consumer |
|-------|--------|----------|
| orderCreated | ✅ | `NOTIFICATION_SETTINGS_MAP['order:created']` |
| orderStatusChanged | ✅ | `NOTIFICATION_SETTINGS_MAP['order:status']` |
| orderAssigned | ✅ | Map |
| orderCancelled | ✅ | Map |
| packagingUpdated | ✅ | Map |
| shipmentUpdated | ✅ | Map |
| deliveryUpdated | ✅ | Map |
| salesReturnUpdated | ✅ | Map |
| customerCreated | ✅ | Map |
| reconciliationUpdated | ✅ | Map |
| inAppNotifications | ✅ | `shouldNotify()` checks |

### Warehouse Notifications
| Field | Status | Consumer |
|-------|--------|----------|
| stockTransferUpdated | ✅ | Map |
| inventoryCheckUpdated | ✅ | Map |
| costAdjustmentUpdated | ✅ | Map |
| priceAdjustmentUpdated | ✅ | Map |
| purchaseOrderUpdated | ✅ | Map |
| purchaseReturnUpdated | ✅ | Map |
| inventoryReceiptUpdated | ✅ | Map |
| lowStockAlert | ✅ | Map + `app/api/cron/stock-alerts/route.ts` |
| lowStockThreshold | ✅ | `cron/stock-alerts/route.ts` |
| inAppNotifications | ✅ | `shouldNotify()` |

### HR Notifications
| Field | Status | Consumer |
|-------|--------|----------|
| employeeCreated | ✅ | Map |
| attendanceUpdated | ✅ | Map |
| leaveUpdated | ✅ | Map |
| payrollUpdated | ✅ | Map |
| penaltyUpdated | ✅ | Map |
| inAppNotifications | ✅ | `shouldNotify()` |

### System Notifications
| Field | Status | Consumer |
|-------|--------|----------|
| paymentReceived | ✅ | Map |
| paymentOverdue | ✅ | Map |
| receiptUpdated | ✅ | Map |
| commentCreated | ✅ | Map |
| dailySummaryEmail | ✅ | `app/api/cron/daily-summary/route.ts` |

**Verdict: ALL ALIVE ✅** — Tất cả đều qua `shouldNotify()` → `readSetting()` → DB

---

## 11. Inventory SLA Settings

**Storage**: `Setting(key='inventory-sla-settings', group='inventory')`

| Field | Status | Consumer |
|-------|--------|----------|
| defaultReorderLevel | ✅ | `app/api/cron/stock-alerts/route.ts`, `features/products/stock-alert-utils.ts` |
| defaultSafetyStock | ✅ | `stock-alert-utils.ts` |
| defaultMaxStock | ✅ | `stock-alert-utils.ts` |
| slowMovingDays | ❌ DEAD | Không có consumer (cần migration `lastSoldAt`) |
| deadStockDays | ❌ DEAD | Không có consumer |
| enableEmailAlerts | ❌ DEAD | Cron dùng warehouse notification settings riêng |
| alertEmailRecipients | ❌ DEAD | Không có consumer |
| alertFrequency | ❌ DEAD | Không có consumer |
| showOnDashboard | ❌ DEAD | Không có consumer |
| dashboardAlertTypes | ❌ DEAD | Không có consumer |

**Verdict: 3/10 ALIVE, 7/10 DEAD ❌**

---

## 12. Store Info Settings

**Storage**: `Setting(key='store-info', group='store')`

| Field | Status | Consumer |
|-------|--------|----------|
| companyName | ✅ | `lib/print-service.ts` → `{store_name}` |
| brandName | ✅ | Print helpers fallback |
| logo | ✅ | `{store_logo}` trong tất cả print templates |
| taxCode | ✅ | `{store_tax_code}` |
| hotline | ✅ | `{store_phone_number}`, `{store_hotline}` |
| email | ✅ | `{store_email}` |
| website | ✅ | `{store_website}` |
| headquartersAddress | ✅ | `{store_address}` |
| province | ✅ | `warranty-print-helper.ts` → StoreSettings |
| representativeName | ✅ | `{store_representative}` trong `sales-contract.ts`, `goods-handover-report.ts` |
| representativeTitle | ✅ | `{store_representative_title}` trong 2 templates trên |
| bankAccountName | ✅ | `{store_bank_account_name}` + payment-dialog.tsx |
| bankAccountNumber | ✅ | `{store_bank_account_number}` + payment-dialog.tsx |
| bankName | ✅ | `{store_bank_name}` + payment-dialog.tsx |
| ward | ❌ DEAD | Không có consumer |
| district | ❌ DEAD | Không có consumer |
| note | ❌ DEAD | Không có consumer |
| registrationNumber | ⚠️ PARTIAL | Interface `StoreInfo` có field nhưng không inject vào print variable |

**Verdict: 14/18 ALIVE, 3 DEAD, 1 PARTIAL**

---

## 13. Trang "Cài đặt khác" (Other Settings)

### Tab "Cài đặt chung" (General)

| Setting Group | Storage | Status | Consumer |
|--------------|---------|--------|----------|
| defaultRole | UserPreference | ❌ DEAD | Không enforce khi tạo user |
| Logo/Favicon upload | Setting(group='general') | ✅ | `app/api/branding/route.ts` |
| Timezone | UserPreference | ❌ DEAD | `lib/date-utils.ts` có `getGeneralSettingsSync()` nhưng chỉ đọc cache, không đọc UserPreference |
| dateFormat/timeFormat | UserPreference | ❌ DEAD | UI-only formatting display |
| currency | UserPreference | ❌ DEAD | Hardcoded VND |
| Password Rules | Setting(key='password_rules', group='security') | ✅ | `lib/password-rules.ts` → enforce tại 6 endpoints |
| File Size Limits | Setting(key='file_size_limits', group='media') | ✅ | `lib/file-size-limits.ts` → enforce tại upload routes |
| OTP Login | Setting(key='otp_login', group='security') | ❌ DEAD | Chưa implement |

### Tab "Tích hợp" (Integration)

| Setting | Status | Consumer |
|---------|--------|----------|
| SMTP Settings | ✅ | `lib/email.ts` → `getSmtpConfig()` → dùng cho mọi `sendEmail()` |

### Tab "Website"

| Setting | Status | Consumer |
|---------|--------|----------|
| Website domain/settings | ❌ DEAD | Không có routing engine đọc |
| 301 Redirects | ❌ DEAD | Không có middleware xử lý redirects |

---

## 14. Customer SLA Settings

**Storage**: `CustomerSetting(type='sla-setting')`

| Field | Status | Consumer |
|-------|--------|----------|
| follow-up SLA | ✅ | `app/api/cron/customer-sla-reminders/route.ts` |
| re-engagement SLA | ✅ | Cron |
| debt-payment SLA | ✅ | Cron |

**Verdict: 3/3 ALIVE ✅** — Đã fix (session gần đây, tạo cron)

---

## 15. Roles/Permissions, Printer, Employee Settings

| Module | Status |
|--------|--------|
| Roles/Permissions | ✅ ALL ALIVE — `hasPermission()`, middleware, sidebar |
| Printer/Templates | ✅ ALL ALIVE — `lib/use-print.ts`, `providers.tsx` |
| Leave Types/Salary Components | ✅ ALL ALIVE — `features/leaves/`, `features/payroll/` |
| Integration (PKGX/Trendtech) | ✅ ALL ALIVE — `lib/pkgx/`, `lib/trendtech/` |
| Shipping Settings | ✅ ALL ALIVE — `shipping-integration.tsx`, `lib/ghtk-sync.ts` |

---

## Tóm tắt Dead Code còn lại

### 🔴 Dead Fields (14 fields)

| # | Module | Field | Lý do dead |
|---|--------|-------|-----------|
| 1 | Inventory SLA | slowMovingDays | Cần migration `lastSoldAt` trên Product |
| 2 | Inventory SLA | deadStockDays | Same |
| 3 | Inventory SLA | enableEmailAlerts | Cron dùng warehouse notification settings riêng |
| 4 | Inventory SLA | alertEmailRecipients | Không consumer |
| 5 | Inventory SLA | alertFrequency | Không consumer |
| 6 | Inventory SLA | showOnDashboard | Không consumer |
| 7 | Inventory SLA | dashboardAlertTypes | Không consumer |
| 8 | Store Info | ward | Không dùng trong print/logic |
| 9 | Store Info | district | Không dùng trong print/logic |
| 10 | Store Info | note | Không consumer |
| 11 | Other/General | defaultRole | Không enforce |
| 12 | Other/General | timezone/dateFormat/currency | UI-only |
| 13 | Other/General | OTP Login | Chưa implement |
| 14 | Other/Website | Website + 301 Redirects | Không middleware |

### ⚠️ Partial (cần refactor)

| # | Module | Vấn đề | Fix đề xuất |
|---|--------|--------|-------------|
| 1 | Warranty SLA | UI dùng hardcoded `WARRANTY_SLA_TARGETS`, cron đọc DB | Refactor `warranty-sla-utils.ts` → hook đọc từ DB |
| 2 | Store Info | registrationNumber có interface nhưng không có print variable | Thêm `{store_registration_number}` vào `print-service.ts` |

---

## Đề xuất hành động

### Ưu tiên cao (giá trị business, effort thấp)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | **Warranty SLA → DB**: Refactor `warranty-sla-utils.ts` để hook đọc từ React Query thay vì hardcoded | 2h | Cao — SLA chính xác theo config |
| 2 | **registrationNumber → print**: Thêm `{store_registration_number}` vào print-service.ts | 15min | Thấp |

### Ưu tiên trung bình (nên làm khi có thời gian)

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 3 | **slowMoving/deadStock**: Migration thêm `lastSoldAt`, implement stock aging logic | 4h | TB — analytics |
| 4 | **Ẩn dead inventory SLA fields**: Hide 5 fields dead (enableEmailAlerts, alertEmailRecipients, alertFrequency, showOnDashboard, dashboardAlertTypes) | 30min | Thấp — tránh confuse user |
| 5 | **Ẩn website tab** trong "Cài đặt khác": Toàn bộ dead | 15min | Thấp |

### Ưu tiên thấp / Roadmap

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 6 | defaultRole → enforce khi tạo employee | 1h | Thấp |
| 7 | OTP Login implementation | 16h+ | Cao (security) |
| 8 | 301 Redirects middleware | 4h | TB (SEO) |
| 9 | Email Templates → DB-driven | 8h | TB (customization) |

---

## So sánh trước/sau fix

| Metric | Trước fix | Sau fix | Thay đổi |
|--------|-----------|---------|----------|
| Tổng settings fields (approx) | 112 | 112 | — |
| ALIVE | ~73 (65%) | ~95 (85%) | **+22 fields** |
| DEAD | ~35 (31%) | ~14 (12%) | **-21 fields** |
| PARTIAL | ~4 (4%) | ~3 (3%) | -1 |

### Các fix đã thực hiện (sessions gần đây)

1. ✅ Tạo `complaint-reminders` cron — đọc SLA + reminder settings từ DB
2. ✅ Tạo `task-reminders` cron — đọc SLA + reminder settings từ DB
3. ✅ Tạo `customer-sla-reminders` cron — đọc CustomerSetting từ DB
4. ✅ Tạo `warranty-reminders` cron — đọc SLA + notification settings từ DB
5. ✅ Connect `notifyComplaintOverdue()` → complaint cron gọi email
6. ✅ Connect `notifyWarrantyOverdue()` → warranty cron gọi email
7. ✅ Thêm `notifyTaskCreated()` — checks emailOnCreate
8. ✅ Thêm `notifyTaskApprovalPending()` — checks emailOnApprovalPending
9. ✅ Password validation enforce tại 4 endpoints (employees POST/PATCH, users POST/PATCH)
10. ✅ printCopies → `use-order-print-handlers.ts` đọc từ settings
11. ✅ 30+ premature toast handlers fixed
12. ✅ 45+ dead files deleted
