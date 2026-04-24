# AUDIT REPORT: Notification System Issues
**Date:** 2026-04-24
**Auditor:** Claude
**Status:** DRAFT

---

## Executive Summary

Hệ thống notification có cấu trúc tốt với:
- Central helper: `lib/notifications.ts`
- API routes đầy đủ: GET, POST, PATCH, DELETE, unread-counts, mark-all-read
- Prisma model đúng
- Settings system với caching (60s TTL)

**Tuy nhiên**, có **5 vấn đề chính** cần fix.

---

## 1. MISSING SETTINGS KEY IN NOTIFICATION_SETTINGS_MAP

### Severity: HIGH

### Problem
Nhiều `settingsKey` được sử dụng nhưng **KHÔNG tồn tại** trong `NOTIFICATION_SETTINGS_MAP` (`lib/notifications.ts:150-182`).

### Missing Keys Found

| settingsKey | File | Line | Module |
|-------------|------|------|--------|
| `task:created` | `app/api/tasks/route.ts` | 247 | Task |
| `task:status` | `app/api/tasks/[taskId]/route.ts` | 209 | Task |
| `task:assigned` | `app/api/tasks/[taskId]/route.ts` | 225 | Task |
| `task:overdue` | `app/api/cron/task-reminders/route.ts` | 172 | Task |
| `complaint:created` | `app/api/complaints/route.ts` | 190 | Complaint |
| `complaint:assigned` | `app/api/complaints/[systemId]/route.ts` | 369 | Complaint |
| `complaint:status` | `app/api/complaints/[systemId]/route.ts` | 389 | Complaint |
| `complaint:overdue` | `app/api/cron/complaint-reminders/route.ts` | 152 | Complaint |
| `warranty:created` | `app/api/warranties/route.ts` | 314 | Warranty |
| `warranty:status` | `app/api/warranties/[systemId]/route.ts` | 275 | Warranty |
| `warranty:assigned` | `app/api/warranties/[systemId]/route.ts` | 301 | Warranty |
| `warranty:overdue` | `app/api/cron/warranty-reminders/route.ts` | 181 | Warranty |

### Root Cause Analysis

Khi `settingsKey` không có trong `NOTIFICATION_SETTINGS_MAP`, code fallback vào logic ở `lib/notifications.ts:227-231`:

```typescript
// Check module-level inAppNotifications (task:*, complaint:*, warranty:*)
const prefix = settingsKey.split(':')[0] as ModulePrefix
if (prefix === 'task' || prefix === 'complaint' || prefix === 'warranty') {
  return isModuleInAppEnabled(prefix)
}
```

**Hậu quả:**
- Task notifications chỉ kiểm tra `TaskNotificationSettings.inAppNotifications`
- KHÔNG kiểm tra các flag cụ thể như `emailOnCreate`, `emailOnAssign`, `emailOnOverdue`
- Behavior không nhất quán với Sales/Warehouse/HR modules

### Recommended Fix

**Option A:** Thêm các missing keys vào `NOTIFICATION_SETTINGS_MAP`:

```typescript
// Add to NOTIFICATION_SETTINGS_MAP
'task:created': { reader: asReader(getTaskNotificationSettings), field: 'emailOnCreate' },
'task:status': { reader: asReader(getTaskNotificationSettings), field: 'emailOnCreate' },
'task:assigned': { reader: asReader(getTaskNotificationSettings), field: 'emailOnAssign' },
'task:overdue': { reader: asReader(getTaskNotificationSettings), field: 'emailOnOverdue' },
// ... similar for complaint and warranty
```

**Option B:** Thêm Task/Complaint/Warranty readers vào settings mapping system.

---

## 2. MISSING inAppNotifications IN SystemNotificationSettings

### Severity: MEDIUM

### Problem
`SystemNotificationSettings` (`features/settings/notifications/types.ts:93-99`) **thiếu** `inAppNotifications` field:

```typescript
export interface SystemNotificationSettings {
  paymentReceived: boolean;
  paymentOverdue: boolean;
  receiptUpdated: boolean;
  commentCreated: boolean;
  dailySummaryEmail: boolean;
  // MISSING: inAppNotifications: boolean;
}
```

### Root Cause
Code trong `lib/notifications.ts:187-192` kiểm tra `inAppNotifications` cho task/complaint/warranty:

```typescript
async function isModuleInAppEnabled(prefix: ModulePrefix): Promise<boolean> {
  switch (prefix) {
    case 'task': return (await getTaskNotificationSettings()).inAppNotifications
    case 'complaint': return (await getComplaintNotificationSettings()).inAppNotifications
    case 'warranty': return (await getWarrantyNotificationSettings()).inAppNotifications
  }
}
```

Nhưng KHÔNG có handler cho `system` prefix. Khi notification có settingsKey như `payment:received`, `comment:created`, code sẽ:
1. Tìm trong `NOTIFICATION_SETTINGS_MAP` → `systemReader` → `SystemNotificationSettings`
2. Check `'inAppNotifications' in settings` → FALSE (vì field không tồn tại)
3. Check event-level toggle → `settings['paymentReceived']`

**Nhưng** nếu muốn toggle OFF tất cả in-app notifications cho system module (giữ email), không có cách nào làm điều này.

### Recommended Fix

Thêm `inAppNotifications` vào `SystemNotificationSettings`:

```typescript
export interface SystemNotificationSettings {
  paymentReceived: boolean;
  paymentOverdue: boolean;
  receiptUpdated: boolean;
  commentCreated: boolean;
  dailySummaryEmail: boolean;
  inAppNotifications: boolean; // ADD THIS
}
```

---

## 3. NOTIFICATION WITHOUT settingsKey (Inconsistent Behavior)

### Severity: MEDIUM

### Problem
Một số `createNotification()` calls **KHÔNG có `settingsKey`**, trong khi các calls khác trong cùng module có.

### Examples

**Payments module** - Mixed:
```typescript
// app/api/payments/route.ts:309 - NO settingsKey
createNotification({
  type: 'payment',
  title: 'Phiếu chi mới',
  // settingsKey is MISSING
  recipientId: payment.recipientSystemId,
})

// app/api/payments/[systemId]/route.ts:230 - NO settingsKey  
createNotification({
  type: 'payment',
  title: 'Phiếu chi cập nhật',
  // settingsKey is MISSING
  recipientId: payment.createdBy,
})
```

**Customers module** - NO settingsKey:
```typescript
// app/api/customers/route.ts:243
createNotification({
  type: 'customer',
  title: 'Khách hàng mới được giao',
  // settingsKey is MISSING - notification always sent if general.enabled = true
  recipientId: customer.accountManagerId,
})
```

**Orders module** - Mixed:
```typescript
// app/api/orders/route.ts:929 - HAS settingsKey
createNotification({
  type: 'order',
  settingsKey: 'order:created',
  ...
})

// app/api/orders/[systemId]/packaging/[packagingId]/confirm/route.ts:132 - NO settingsKey
createNotification({
  type: 'order',
  // settingsKey is MISSING
  ...
})
```

### Root Cause
Không có enforcement về việc phải truyền `settingsKey`. Developer phải tự nhớ thêm vào.

### Recommended Fix
1. Thêm TypeScript enforcement trong `CreateNotificationInput`
2. Tạo ESLint rule để cảnh báo missing settingsKey
3. Hoặc backward compatible: nếu settingsKey missing, mặc định check general.enabled

---

## 4. POTENTIAL RACE CONDITION IN TASKS UPDATE

### Severity: MEDIUM

### Problem
Trong `app/api/tasks/[taskId]/route.ts:199-210`, notification được gọi trong vòng `for` loop:

```typescript
const uniqueRecipients = [...new Set(recipients)];
for (const recipientId of uniqueRecipients) {
  createNotification({
    type: 'task',
    ...
    settingsKey: 'task:status',
  }).catch(e => logError('[Tasks] Status notification failed', e));
}
```

### Issue
- Mỗi iteration tạo một promise không được awaited
- Nếu function return trước khi promises complete, có thể có race condition
- Tuy nhiên, `.catch()` được thêm nên lỗi được handle

### Recommended Fix
Hoặc:
1. Dùng `Promise.all()` để đợi tất cả notifications
2. Hoặc thêm comment giải thích đây là intentional fire-and-forget

---

## 5. INCONSISTENT ERROR HANDLING

### Severity: LOW

### Problem
Một số `createNotification()` calls KHÔNG có `.catch()` handler:

### Files WITHOUT .catch()

```typescript
// app/api/orders/route.ts:929
createNotification({
  type: 'order',
  settingsKey: 'order:created',
  ...
}) // NO .catch()

// app/api/stock-transfers/route.ts:202
createNotification({
  type: 'stock_transfer',
  settingsKey: 'stock-transfer:updated',
  ...
}) // NO .catch()

// app/api/employees/route.ts:291
createNotification({
  type: 'employee',
  settingsKey: 'employee:created',
  ...
}) // NO .catch()
```

### Root Cause
Không có standard pattern được enforce. Một số developer thêm `.catch()`, một số không.

### Recommended Fix
1. Thêm `.catch()` vào tất cả fire-and-forget calls
2. Hoặc wrap trong `void` expression: `void createNotification(...)`

---

## 6. CustomerCreated SETTINGS KEY MISMATCH

### Severity: MEDIUM

### Problem
Trong `lib/notifications.ts:160`:
```typescript
'customer:new': { reader: salesReader, field: 'customerCreated' },
```

Nhưng trong `app/api/customers/route.ts:244`, notification được gọi mà KHÔNG có settingsKey, nên settings check không được thực hiện.

---

## Summary of Issues

| # | Issue | Severity | Files Affected |
|---|-------|----------|-----------------|
| 1 | Missing settingsKey in NOTIFICATION_SETTINGS_MAP | HIGH | 12 files |
| 2 | Missing inAppNotifications in SystemNotificationSettings | MEDIUM | 1 interface |
| 3 | Inconsistent settingsKey usage | MEDIUM | Multiple files |
| 4 | Potential race condition | MEDIUM | 1 file |
| 5 | Inconsistent error handling | LOW | Multiple files |
| 6 | customer:new settingsKey mismatch | MEDIUM | 1 file |

---

## Recommendations Priority

### Priority 1 (Critical)
1. Fix `NOTIFICATION_SETTINGS_MAP` - thêm các missing keys cho Task/Complaint/Warranty

### Priority 2 (High)
2. Thêm `inAppNotifications` vào `SystemNotificationSettings`
3. Thêm settingsKey vào các notification calls đang thiếu

### Priority 3 (Medium)
4. Standardize error handling với `.catch()`
5. Add TypeScript types/enforcement cho settingsKey

---

## Test Checklist

- [ ] Task notifications work (created, assigned, status change, overdue)
- [ ] Complaint notifications work (created, assigned, status change, overdue)
- [ ] Warranty notifications work (created, assigned, status change, overdue)
- [ ] Settings toggles correctly block/enable notifications
- [ ] Payment/receipt/comment notifications respect SystemNotificationSettings
- [ ] Bulk notifications work correctly
- [ ] Unread count API returns correct values
- [ ] Mark as read works
