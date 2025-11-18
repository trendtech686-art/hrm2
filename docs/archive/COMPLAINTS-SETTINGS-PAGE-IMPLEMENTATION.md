# Complaints Settings Page - Implementation Guide

**Created:** November 7, 2025  
**Module:** Complaints Management - Settings Integration  
**Route:** `/settings/complaints`

---

## 📋 Tổng quan

Đã tích hợp trang cài đặt khiếu nại vào hệ thống Settings chính tại `/settings` với 4 tabs chính:
1. **SLA** - Cấu hình thời gian phản hồi và giải quyết theo mức độ ưu tiên
2. **Mẫu phản hồi** - CRUD templates để trả lời nhanh khách hàng
3. **Thông báo** - Cấu hình email/SMS/in-app notifications
4. **Tracking công khai** - Cho phép khách hàng theo dõi khiếu nại qua link

---

## ✅ Các file đã tạo/chỉnh sửa

### 1. **features/settings/page.tsx** (MODIFIED)
**Thay đổi:**
- Import `MessageSquareWarning` icon
- Thêm card "Khiếu nại" vào section `operationalSettings`
- Badge "new" để highlight tính năng mới
- Icon màu đỏ (`text-red-600`) để phân biệt

**Code:**
```typescript
{ 
  icon: MessageSquareWarning, 
  title: 'Khiếu nại', 
  description: 'Cấu hình SLA, mẫu phản hồi và thông báo khiếu nại', 
  href: '/settings/complaints',
  badge: 'new' as const,
  iconColor: 'text-red-600'
}
```

---

### 2. **features/settings/complaints-settings-page.tsx** (NEW - 870 lines)
**Component chính:** `ComplaintsSettingsPage`

#### Interfaces:
```typescript
interface SLASettings {
  low: { responseTime: number; resolveTime: number };
  medium: { responseTime: number; resolveTime: number };
  high: { responseTime: number; resolveTime: number };
  urgent: { responseTime: number; resolveTime: number };
}

interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: 'general' | 'product-defect' | 'shipping-delay' | 'wrong-item' | 'customer-service';
  order: number;
}

interface NotificationSettings {
  emailOnCreate: boolean;
  emailOnAssign: boolean;
  emailOnVerified: boolean;
  emailOnResolved: boolean;
  emailOnOverdue: boolean;
  smsOnOverdue: boolean;
  inAppNotifications: boolean;
}

interface PublicTrackingSettings {
  enabled: boolean;
  allowCustomerComments: boolean;
  showEmployeeName: boolean;
  showTimeline: boolean;
}
```

#### LocalStorage Keys:
```typescript
const STORAGE_KEYS = {
  SLA: 'complaints-sla-settings',
  TEMPLATES: 'complaints-templates',
  NOTIFICATIONS: 'complaints-notification-settings',
  PUBLIC_TRACKING: 'complaints-public-tracking-settings',
};
```

#### Tab 1: SLA Settings
- 4 priority levels: Low, Medium, High, Urgent
- Mỗi priority có 2 fields:
  * `responseTime` (phút) - Thời gian phản hồi tối đa
  * `resolveTime` (giờ) - Thời gian giải quyết tối đa
- Màu sắc phân biệt: Green, Yellow, Orange, Red
- Buttons: "Lưu cài đặt", "Đặt lại mặc định"

**Default values:**
```typescript
low: { responseTime: 240, resolveTime: 48 },     // 4h / 48h
medium: { responseTime: 120, resolveTime: 24 },  // 2h / 24h
high: { responseTime: 60, resolveTime: 12 },     // 1h / 12h
urgent: { responseTime: 30, resolveTime: 4 },    // 30m / 4h
```

#### Tab 2: Response Templates
- Table view: Name, Category, Actions
- CRUD: Add, Edit, Delete templates
- Inline editing form (appears below table)
- Fields:
  * Name: Tên mẫu (VD: "Xin lỗi - Lỗi sản phẩm")
  * Category: Dropdown với 5 options
  * Content: Textarea (8 rows)
- 3 default templates được tạo sẵn

**Categories:**
- `general` - Chung
- `product-defect` - Lỗi sản phẩm
- `shipping-delay` - Giao hàng chậm
- `wrong-item` - Sai hàng
- `customer-service` - Dịch vụ khách hàng

#### Tab 3: Notifications
**Email notifications:**
- Khi khiếu nại mới được tạo
- Khi được phân công xử lý
- Khi khiếu nại được xác minh
- Khi khiếu nại được giải quyết
- Khi khiếu nại quá hạn SLA

**SMS notifications:**
- Cảnh báo quá hạn SLA

**In-app notifications:**
- Bật thông báo in-app (bell icon)

**Defaults:**
```typescript
emailOnCreate: true,
emailOnAssign: true,
emailOnVerified: false,
emailOnResolved: true,
emailOnOverdue: true,
smsOnOverdue: false,
inAppNotifications: true,
```

#### Tab 4: Public Tracking
- **Bật tính năng:** Master toggle
- **Cho phép comment:** Khách hàng có thể thêm bình luận
- **Hiển thị nhân viên:** Show tên nhân viên xử lý
- **Hiển thị timeline:** Show lịch sử xử lý chi tiết
- **Example URL:** `https://yoursite.com/complaint-tracking/abc123xyz`

**Defaults:**
```typescript
enabled: false,
allowCustomerComments: false,
showEmployeeName: true,
showTimeline: true,
```

---

### 3. **lib/route-definitions.tsx** (MODIFIED)
**Thay đổi:**
- Import `ComplaintsSettingsPage`
- Thêm route `/settings/complaints`

**Code:**
```typescript
{
  path: '/settings/complaints',
  element: ComplaintsSettingsPage,
  meta: {
    breadcrumb: ['Cài đặt', 'Khiếu nại']
  }
}
```

---

### 4. **features/complaints/sla-utils.ts** (MODIFIED)
**Thay đổi:**
- Thêm function `loadSLASettings()` để load từ localStorage
- Update `checkOverdue()` để sử dụng settings từ localStorage thay vì hardcode
- Fallback to `defaultSLA` nếu không có trong localStorage

**Code:**
```typescript
function loadSLASettings() {
  try {
    const stored = localStorage.getItem('complaints-sla-settings');
    return stored ? JSON.parse(stored) : defaultSLA;
  } catch {
    return defaultSLA;
  }
}

export function checkOverdue(complaint: Complaint): OverdueStatus {
  // ... existing code ...
  
  // Load SLA from localStorage instead of hardcode
  const slaSettings = loadSLASettings();
  const sla = slaSettings[priority as keyof typeof defaultSLA] || slaSettings.medium;
  
  // ... rest of logic ...
}
```

---

## 🎨 UI/UX Features

### Desktop View:
- 4 tabs trên 1 hàng
- Grid layout responsive (md:grid-cols-2 cho inputs)
- Full text labels

### Mobile View:
- Tabs grid 2 columns
- Icons + text (text-xs)
- Single column layout
- Padding optimized (sm)

### Components sử dụng:
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`
- `Input`, `Textarea`, `Select`, `Switch`
- `Table` (cho templates)
- `Button`, `Label`, `Badge`
- Icons: `Clock`, `MessageSquare`, `Bell`, `Link`, `Save`, `Plus`, `Trash2`

---

## 💾 LocalStorage Structure

### 1. SLA Settings
**Key:** `complaints-sla-settings`
```json
{
  "low": { "responseTime": 240, "resolveTime": 48 },
  "medium": { "responseTime": 120, "resolveTime": 24 },
  "high": { "responseTime": 60, "resolveTime": 12 },
  "urgent": { "responseTime": 30, "resolveTime": 4 }
}
```

### 2. Templates
**Key:** `complaints-templates`
```json
[
  {
    "id": "1",
    "name": "Xin lỗi - Lỗi sản phẩm",
    "content": "Kính chào Anh/Chị...",
    "category": "product-defect",
    "order": 1
  }
]
```

### 3. Notifications
**Key:** `complaints-notification-settings`
```json
{
  "emailOnCreate": true,
  "emailOnAssign": true,
  "emailOnVerified": false,
  "emailOnResolved": true,
  "emailOnOverdue": true,
  "smsOnOverdue": false,
  "inAppNotifications": true
}
```

### 4. Public Tracking
**Key:** `complaints-public-tracking-settings`
```json
{
  "enabled": false,
  "allowCustomerComments": false,
  "showEmployeeName": true,
  "showTimeline": true
}
```

---

## 🔗 Integration Points

### 1. SLA System
- `checkOverdue()` in `sla-utils.ts` now loads from localStorage
- Changes in settings page immediately affect overdue calculations
- No need to refresh, localStorage is read on each check

### 2. Templates (TODO - Phase 2)
- Need to add dropdown in comment section of detail-page.tsx
- Load templates from localStorage
- Quick insert on select

### 3. Notifications (TODO - Phase 3)
- Backend integration required for email/SMS
- In-app notification bell icon (global header)
- Trigger notifications on complaint events

### 4. Public Tracking (TODO - Phase 3)
- Generate `publicId` when creating complaint
- Create page at `/complaint-tracking/:publicId` (no auth)
- Email template with tracking link
- Customer can view status, timeline, add comments

---

## 📊 Access & Navigation

### Cách truy cập:
1. **Từ Settings dashboard:** http://localhost:5173/settings → Click "Khiếu nại"
2. **Direct URL:** http://localhost:5173/settings/complaints
3. **Breadcrumb:** Trang chủ > Cài đặt > Khiếu nại

### Vị trí trong settings:
- **Section:** Cài đặt vận hành (Operational Settings)
- **Thứ tự:** Sau "Cài đặt vận chuyển", trước "Quy trình"
- **Badge:** "Mới" (new)
- **Icon:** MessageSquareWarning (màu đỏ)

---

## ✅ Testing Checklist

### SLA Tab:
- [ ] Nhập số liệu và lưu → Kiểm tra localStorage có đúng không
- [ ] Đặt lại mặc định → Xác nhận values về default
- [ ] Thay đổi SLA → Kiểm tra kanban có update overdue status không

### Templates Tab:
- [ ] Thêm mẫu mới → Kiểm tra xuất hiện trong table
- [ ] Sửa mẫu → Kiểm tra nội dung đã update
- [ ] Xóa mẫu → Confirm mẫu biến mất
- [ ] Validation: Không điền tên/content → Hiện error toast

### Notifications Tab:
- [ ] Toggle switches → Kiểm tra localStorage
- [ ] Lưu cài đặt → Confirm toast hiện

### Public Tracking Tab:
- [ ] Bật/tắt master toggle → Kiểm tra sub-options show/hide
- [ ] Toggle các options → Kiểm tra localStorage
- [ ] Example URL có hiển thị đúng không

### Mobile:
- [ ] Tabs responsive (2 columns)
- [ ] Forms single column
- [ ] Text size readable
- [ ] Touch targets đủ lớn

---

## 🚀 Next Steps (Phase 2)

### High Priority:
1. **Add template selector to comment box**
   - Dropdown trên textarea in detail-page.tsx
   - Load templates từ localStorage
   - Insert content on select

2. **Update Complaint type with priority field**
   - Add `priority: 'low' | 'medium' | 'high' | 'urgent'` to types.ts
   - Remove `(complaint as any).priority` workarounds
   - Add priority selector in form-page.tsx

3. **Email notifications**
   - Backend endpoints for sending emails
   - Trigger on create/assign/verify/resolve events
   - Load settings from localStorage

### Medium Priority:
4. **Public tracking page**
   - Generate publicId on create
   - Create `/complaint-tracking/:publicId` route
   - Show timeline, allow comments if enabled

5. **In-app notifications**
   - Notification bell icon in header
   - Store notifications in backend
   - Mark as read functionality

### Low Priority:
6. **SMS notifications**
   - Integrate Twilio/Nexmo
   - Send on overdue events
   - Cost considerations

---

## 🐛 Known Issues

1. **Priority field missing from Complaint type**
   - Currently using `(complaint as any).priority`
   - Need to update types.ts and form-page.tsx

2. **Templates not integrated yet**
   - Settings page complete
   - Need to add selector to detail page

3. **Notifications are frontend-only**
   - No backend integration yet
   - Email/SMS requires server-side code

4. **Public tracking not implemented**
   - Settings page ready
   - Need to build public tracking page

---

## 💡 Usage Examples

### Load Templates in Detail Page:
```typescript
function loadTemplates(): ResponseTemplate[] {
  try {
    const stored = localStorage.getItem('complaints-templates');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// In component:
const templates = loadTemplates();
<Select onValueChange={(id) => {
  const template = templates.find(t => t.id === id);
  if (template) setComment(template.content);
}}>
  {templates.map(t => (
    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
  ))}
</Select>
```

### Check SLA in any component:
```typescript
import { checkOverdue, formatTimeLeft } from './sla-utils';

const overdueStatus = checkOverdue(complaint);
if (overdueStatus.isOverdueResponse) {
  console.log(`Quá hạn phản hồi: ${formatTimeLeft(overdueStatus.responseTimeLeft)}`);
}
```

### Load notification settings:
```typescript
function loadNotificationSettings() {
  try {
    const stored = localStorage.getItem('complaints-notification-settings');
    return stored ? JSON.parse(stored) : defaultNotifications;
  } catch {
    return defaultNotifications;
  }
}

// Use in backend:
const settings = loadNotificationSettings();
if (settings.emailOnCreate) {
  await sendEmail(complaint);
}
```

---

## 📝 Summary

✅ **Đã hoàn thành:**
- Tích hợp trang settings vào `/settings` chính
- 4 tabs đầy đủ: SLA, Templates, Notifications, Public Tracking
- LocalStorage persistence
- Mobile responsive
- SLA utils đã load từ localStorage
- Route và breadcrumb hoàn chỉnh

⏳ **Đang chờ triển khai:**
- Template selector trong comment box
- Email/SMS backend integration
- Public tracking page
- Priority field trong Complaint type
- In-app notification system

🎯 **Mức độ hoàn thiện:** 70%
- Settings UI: 100%
- SLA integration: 100%
- Templates CRUD: 100% (UI only, chưa integrate vào detail page)
- Notifications: 50% (UI done, backend pending)
- Public tracking: 30% (settings done, page chưa có)

---

**End of documentation** ✨
