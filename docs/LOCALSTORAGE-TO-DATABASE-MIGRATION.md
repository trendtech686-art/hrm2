# LocalStorage to Database Migration Plan

> **Mục tiêu**: Loại bỏ xung đột giữa Client-side (localStorage) và Server-side (Database).  
> **Nguyên tắc**: Tất cả user preferences và settings phải được lưu trữ trên Database thông qua React Query hooks.

## 📊 Tổng quan

| Trạng thái | Mô tả |
|------------|-------|
| ✅ Done | Đã migrate sang React Query hooks |
| 🔄 In Progress | Đang thực hiện |
| ⏳ Pending | Chưa bắt đầu |
| 🔒 Keep | Giữ nguyên (có lý do hợp lệ) |

---

## 1️⃣ Column Visibility & Layout (✅ DONE)

Tất cả các trang đã được migrate sang `useColumnVisibility` hoặc `useColumnLayout` hook.

| File | Storage Key | Hook | Status |
|------|-------------|------|--------|
| `features/suppliers/page.tsx` | `suppliers-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/tasks/page.tsx` | `tasks-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/stock-locations/page.tsx` | `stock-locations-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/reconciliation/page.tsx` | `reconciliation-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/sales-returns/page.tsx` | `sales-returns-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/employees/page.tsx` | `employees-column-layout` | `useColumnLayout` | ✅ Done |
| `features/stock-transfers/page.tsx` | `stock-transfers-column-layout` | `useColumnLayout` | ✅ Done |
| `features/brands/page.tsx` | `brands-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/purchase-orders/page.tsx` | `purchase-orders-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/products/page.tsx` | `products-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/receipts/page.tsx` | `receipts-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/purchase-returns/page.tsx` | `purchase-returns-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/settings/penalties/page.tsx` | `penalties-column-layout` | `useColumnLayout` | ✅ Done |
| `features/orders/page.tsx` | `orders-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/payments/page.tsx` | `payments-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/customers/page.tsx` | `customers-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/categories/page.tsx` | `categories-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/cashbook/page.tsx` | `cashbook-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/inventory-receipts/page.tsx` | `inventory-receipts-column-visibility` | `useColumnVisibility` | ✅ Done |
| `features/cost-adjustments/page.tsx` | `cost-adjustments-column-layout` | `useColumnLayout` | ✅ Done |

**Hooks đã tạo:**
- `hooks/use-column-visibility.ts` - `useColumnVisibility(tableName, defaults)`
- `hooks/use-column-visibility.ts` - `useColumnLayout(tableName, defaults)` (combined)

---

## 2️⃣ Comments & Entity Data (✅ DONE)

| File | Storage Key | Hook | Status |
|------|-------------|------|--------|
| `features/*/detail-page.tsx` (15+ files) | `{entity}-comments` | `useComments` | ✅ Done |

**Hook đã tạo:**
- `hooks/use-comments.ts` - `useComments(entityType, entityId)`

---

## 3️⃣ Active Timer (✅ DONE)

| File | Storage Key | Hook/API | Status |
|------|-------------|----------|--------|
| `features/tasks/store.ts` | `active-timer` | `/api/active-timer` | ✅ Done |

---

## 4️⃣ Templates (✅ DONE)

| File | Storage Key | Hook | Status |
|------|-------------|------|--------|
| `features/complaints/components/detail-page.tsx` | `complaints-templates` | `useComplaintTemplates` | ✅ Done |
| `features/complaints/components/verification-dialog.tsx` | `complaints-templates` | Removed (unused) | ✅ Done |
| `features/warranty/hooks/use-warranty-reminders.ts` | `warranty_reminder_templates` | `useWarrantyReminderTemplates` | ✅ Done |
| `features/settings/printer/workflow-templates-page.tsx` | `workflow_templates_v4` | `useWorkflowTemplates` | ✅ Done |

**Hooks đã tạo:**
- `features/complaints/hooks/use-complaint-templates.ts` - `useComplaintTemplates()`
- `hooks/use-reminder-settings.ts` - `useWarrantyReminderTemplates()`
- `hooks/use-workflow-templates.ts` - `useWorkflowTemplates()`

---

## 5️⃣ Settings & Configuration (✅ DONE)

### 5.1 System Settings (`features/settings/other-page.tsx`)

| Storage Key | Mô tả | Hook/API | Status |
|-------------|-------|----------|--------|
| `general-settings` | Cài đặt chung | `/api/user-preferences` | ✅ Done |
| `security-settings` | Cài đặt bảo mật | `/api/user-preferences` | ✅ Done |
| `media-settings` | Cài đặt media | `/api/user-preferences` | ✅ Done |
| `integration-settings` | Cài đặt tích hợp | `/api/user-preferences` | ✅ Done |
| `feature-flags` | Feature flags | - | ⏳ Pending |
| `website-settings` | Cài đặt website | - | ⏳ Pending |
| `redirects-301` | Redirects 301 | - | ⏳ Pending |

**Hooks đã tạo:**
- `hooks/use-system-settings.ts`:
  - `useGeneralSettings()`
  - `useSecuritySettings()`
  - `useMediaSettings()`
  - `useIntegrationSettings()`

### 5.2 Appearance Settings

| File | Storage Key | Status |
|------|-------------|--------|
| `features/settings/appearance/store.ts` | `hrm-appearance-storage` | ⏳ Pending |
| `app/layout.tsx` | `hrm-appearance-storage` | ⏳ Pending |

**Note:** Appearance cần xử lý đặc biệt vì cần load trước khi React hydrate để tránh flash.

---

## 6️⃣ SLA & Notifications (✅ DONE)

### 6.1 Warranty Module

| File | Storage Key | Hook | Status |
|------|-------------|------|--------|
| `features/warranty/warranty-sla-utils.ts` | `warranty-sla-targets` | `useWarrantySLASettings` | ✅ Done |
| `features/warranty/use-realtime-updates.ts` | `warranty-version` | - | 🔒 Keep (version tracking) |
| `features/warranty/tracking-utils.ts` | `warranty-tracking-settings` | - | ⏳ Pending |
| `features/warranty/notification-utils.ts` | `warranty-notification-settings` | `useWarrantyNotificationSettings` | ✅ Done |

### 6.2 Complaints Module

| File | Storage Key | Hook | Status |
|------|-------------|------|--------|
| `features/complaints/use-realtime-updates.ts` | `complaints-version` | - | 🔒 Keep (version tracking) |
| `features/complaints/tracking-utils.ts` | `complaints-tracking-settings` | - | ⏳ Pending |
| `features/complaints/sla-utils.ts` | `complaints-sla-settings` | `useComplaintsSLASettings` | ✅ Done |
| `features/complaints/notification-utils.ts` | `complaints-notification-settings` | `useComplaintsNotificationSettings` | ✅ Done |
| `features/complaints/hooks/use-complaint-reminders.ts` | `complaints-reminder-settings` | `useComplaintReminderSettings` | ✅ Done |

**Hooks đã tạo:**
- `hooks/use-sla-notification-settings.ts`:
  - `useWarrantySLASettings()`
  - `useComplaintsSLASettings()`
  - `useWarrantyNotificationSettings()`
  - `useComplaintsNotificationSettings()`
- `hooks/use-reminder-settings.ts`:
  - `useComplaintReminderSettings()`

### 6.3 Customer SLA (✅ DONE)

| File | Storage Key | Mô tả | Hook/API | Status |
|------|-------------|-------|----------|--------|
| `features/customers/sla/ack-storage.ts` | `customer-sla-acknowledgements` | SLA acknowledgements | `/api/user-preferences` | ✅ Done |
| `features/customers/sla/ack-storage.ts` | `customer-sla-activity-log` | Activity log | `/api/user-preferences` | ✅ Done |
| `features/customers/sla/store.ts` | `customer-sla-evaluation` | SLA evaluation cache | `/api/user-preferences` | ✅ Done |
| `features/customers/sla/store.ts` | `customer-sla-last-run` | Last run timestamp | `/api/user-preferences` | ✅ Done |

**Files migrated:**
- `features/customers/sla/ack-storage.ts` - Moved to API with debounced saves
- `features/customers/sla/store.ts` - Added `loadCachedIndex()` and API-backed persistence

---

## 7️⃣ Print Options (✅ DONE)

| File | Storage Key | Hook | Status |
|------|-------------|------|--------|
| `components/shared/print-options-dialog.tsx` | `print-options-default` | `usePrintOptions` | ✅ Done |
| `components/shared/simple-print-options-dialog.tsx` | `simple-print-options-default` | `useSimplePrintOptions` | ✅ Done |

**Hooks đã tạo:**
- `hooks/use-print-options.ts`:
  - `usePrintOptions()`
  - `useSimplePrintOptions()`

---

## 8️⃣ Comment Drafts (⏳ PENDING)

| File | Storage Key | Status |
|------|-------------|--------|
| `components/Comments.tsx` | `comment-draft-{entityType}-{entityId}` | ⏳ Pending |

**Note:** Comment drafts là temporary data, có thể giữ localStorage hoặc migrate sang IndexedDB.

---

## 🔒 Giữ nguyên localStorage (Có lý do hợp lệ)

| File | Storage Key | Lý do |
|------|-------------|-------|
| `features/orders/components/shipping/service-config-form.tsx` | `ghtk-services-cache` | External API cache với TTL 30 phút |
| `features/auth/otp-verification-page.tsx` | `user` | Auth session token |
| `features/tasks/types-filter.ts` | `currentUser`, `employee` | Auth context (đọc từ auth) |
| `components/settings/data-migration-tool.tsx` | Dynamic | Tool để migrate data |

---

## 📋 Implementation Priority

### Phase 1 - High Priority (User Preferences) ✅ COMPLETED
1. ✅ System Settings (`other-page.tsx`)
2. ✅ Print Options
3. ✅ Warranty/Complaints SLA settings

### Phase 2 - Medium Priority (Templates) ✅ COMPLETED
4. ✅ Warranty reminder templates
5. ✅ Printer workflow templates

### Phase 3 - Low Priority (Operational Data) ✅ COMPLETED
6. ✅ Customer SLA acknowledgements/evaluation
7. 🔒 Version tracking (warranty/complaints) - Keep as localStorage

### Phase 4 - Optional
8. ⏳ Comment drafts (có thể giữ localStorage hoặc IndexedDB)
9. ⏳ Appearance settings (cần xử lý đặc biệt)
10. ⏳ Feature flags, website settings, redirects

---

## 🛠️ Hooks đã tạo

| Hook | File | Mô tả |
|------|------|-------|
| `useColumnVisibility` | `hooks/use-column-visibility.ts` | Column visibility cho data tables |
| `useColumnLayout` | `hooks/use-column-visibility.ts` | Combined visibility + order + pinned |
| `useColumnOrder` | `hooks/use-column-visibility.ts` | Column order |
| `usePinnedColumns` | `hooks/use-column-visibility.ts` | Pinned columns |
| `useComments` | `hooks/use-comments.ts` | Entity comments |
| `useActiveTimer` | `hooks/use-active-timer.ts` | Task timer |
| `useComplaintTemplates` | `features/complaints/hooks/use-complaint-templates.ts` | Complaint response templates |
| `usePrintOptions` | `hooks/use-print-options.ts` | Print options dialog |
| `useSimplePrintOptions` | `hooks/use-print-options.ts` | Simple print options dialog |
| `useWarrantyReminderTemplates` | `hooks/use-reminder-settings.ts` | Warranty reminder templates |
| `useComplaintReminderSettings` | `hooks/use-reminder-settings.ts` | Complaint reminder settings |
| `useWarrantySLASettings` | `hooks/use-sla-notification-settings.ts` | Warranty SLA targets |
| `useComplaintsSLASettings` | `hooks/use-sla-notification-settings.ts` | Complaints SLA targets |
| `useWarrantyNotificationSettings` | `hooks/use-sla-notification-settings.ts` | Warranty notifications |
| `useComplaintsNotificationSettings` | `hooks/use-sla-notification-settings.ts` | Complaints notifications |
| `useWorkflowTemplates` | `hooks/use-workflow-templates.ts` | Workflow templates (CRUD) |
| `useGeneralSettings` | `hooks/use-system-settings.ts` | General system settings |
| `useSecuritySettings` | `hooks/use-system-settings.ts` | Security settings |
| `useMediaSettings` | `hooks/use-system-settings.ts` | Media settings |
| `useIntegrationSettings` | `hooks/use-system-settings.ts` | Integration settings |

---

## 📝 Notes

1. **API Endpoint Pattern**: Tất cả user preferences đều sử dụng `/api/user-preferences` với schema:
   ```ts
   {
     userId: string;
     key: string;      // e.g., 'suppliers-column-visibility'
     value: any;       // JSON data
     category: string; // 'ui' | 'templates' | 'settings'
   }
   ```

2. **Debounce**: Tất cả hooks đều có debounce 1000ms để tránh spam API calls

3. **Fallback**: Khi user chưa login hoặc API fail, hooks sẽ sử dụng default values

4. **Migration Strategy**: 
   - Không cần migrate data cũ từ localStorage
   - Khi user truy cập trang, hook sẽ tạo preferences mới nếu chưa có
   - localStorage cũ có thể xóa sau khi deploy

---

*Last updated: 2025-01-02*
