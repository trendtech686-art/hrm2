# 🔔 Notification System - Architecture & Extension Guide

> **Global Notification System** - Hệ thống thông báo toàn cục cho tất cả modules trong HRM2

---

## 📋 Tổng quan

### ✅ Đã hoàn thành (Phase 1)
- [x] Notification Store với Zustand + localStorage persist
- [x] NotificationPopover component (Bell icon + Badge + Popover)
- [x] Integration vào **App Header** (hiển thị trên mọi trang)
- [x] Support cho Tasks Warranty module (@mentions, comments)
- [x] Basic notification types: `mention`, `comment`, `task_assigned`, `status_change`

### 🎯 Mục tiêu thiết kế
1. **Global & Centralized**: Một notification center cho toàn bộ hệ thống
2. **Module-agnostic**: Dễ dàng thêm notification từ bất kỳ module nào
3. **Type-safe**: TypeScript với IntelliSense đầy đủ
4. **Persistent**: Lưu trữ qua localStorage (sau này có thể nâng cấp lên API)
5. **Scalable**: Dễ mở rộng thêm notification types mới

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│           App Header (Global)                   │
│  ┌───────────────────────────────────────────┐  │
│  │  🔔 NotificationPopover                   │  │
│  │  - Badge with unread count                │  │
│  │  - Popover with notification list         │  │
│  │  - Filter by userId                       │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│     notification-store.ts (Zustand)             │
│  - Global state for all notifications           │
│  - localStorage persistence                     │
│  - Methods: add, markAsRead, delete, etc.       │
└─────────────────────────────────────────────────┘
                      ↑
        ┌─────────────┼─────────────┐
        ↓             ↓             ↓
   ┌────────┐   ┌──────────┐   ┌─────────┐
   │ Tasks  │   │ Orders   │   │ Leaves  │
   │Warranty│   │          │   │         │
   └────────┘   └──────────┘   └─────────┘
   
   Any module can call:
   useNotificationStore().addNotification(...)
```

---

## 📦 Core Components

### 1. **NotificationStore** (`features/tasks-warranty/notification-store.ts`)

**Location**: `d:\hrm2\features\tasks-warranty\notification-store.ts`

> **TODO**: Di chuyển lên `lib/notification-store.ts` để trở thành global store

```typescript
// Current location (temporary)
import { useNotificationStore } from '../features/tasks-warranty/notification-store';

// Future location (recommended)
import { useNotificationStore } from '../lib/notification-store';
```

**State Structure**:
```typescript
interface Notification {
  id: string;                    // Unique ID (uuidv4)
  type: NotificationType;        // See notification types below
  taskId?: string;               // Optional: Related task/order/leave ID
  taskTitle?: string;            // Optional: Title for display
  fromUserId: string;            // Who triggered the notification
  fromUserName: string;          // Display name
  toUserId: string;              // Recipient
  message: string;               // Notification message
  isRead: boolean;               // Read status
  createdAt: Date;               // Timestamp
  link: string;                  // Navigation link (e.g., /tasks-warranty/uuid-123)
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Methods
  addNotification: (notification: Omit<Notification, 'id' | 'isRead' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAll: () => void;
  getUnreadCount: (userId: string) => number;
  getUserNotifications: (userId: string) => Notification[];
}
```

**Key Methods**:

```typescript
// 1. Add notification
const { addNotification } = useNotificationStore();
addNotification({
  type: 'order_status_change',
  taskId: order.id,
  taskTitle: `Đơn hàng #${order.orderNumber}`,
  fromUserId: currentUser.id,
  fromUserName: currentUser.name,
  toUserId: order.assigneeId,
  message: `đã cập nhật trạng thái đơn hàng thành "Đang xử lý"`,
  link: `/orders/${order.id}`,
});

// 2. Mark as read
const { markAsRead } = useNotificationStore();
markAsRead(notificationId);

// 3. Get unread count
const { getUnreadCount } = useNotificationStore();
const unreadCount = getUnreadCount(currentUser.id); // Returns number

// 4. Get user's notifications
const { getUserNotifications } = useNotificationStore();
const notifications = getUserNotifications(currentUser.id); // Returns Notification[]
```

---

### 2. **NotificationPopover** (`features/tasks-warranty/components/notification-popover.tsx`)

**Location**: `d:\hrm2\features\tasks-warranty\components\notification-popover.tsx`

> **TODO**: Di chuyển lên `components/notifications/notification-popover.tsx`

**Integration trong App Header** (`components/layout/header.tsx`):

```tsx
import { NotificationPopover } from '../../features/tasks-warranty/components/notification-popover.tsx';

export function Header() {
  const { user, employee } = useAuth();
  
  return (
    <header>
      <div className="flex items-center gap-2">
        {/* Global Notification - works across all modules */}
        <NotificationPopover userId={employee?.id || user?.employeeId || user?.email || 'guest'} />
        
        {/* User menu dropdown */}
        <DropdownMenu>...</DropdownMenu>
      </div>
    </header>
  );
}
```

**Features**:
- 🔴 **Badge**: Red badge with unread count (9+ if > 9)
- 📋 **Popover**: 400px wide, 400px tall ScrollArea
- 🎨 **Emoji Icons**: Visual indicators per notification type
- ✅ **Actions**: Mark as read, Delete, Mark all as read
- 🔗 **Navigation**: Click notification → auto navigate + mark as read

---

## 📝 Notification Types

### Current Types (Phase 1)
```typescript
type NotificationType = 
  | 'mention'              // @mention in comments
  | 'comment'              // New comment added
  | 'task_assigned'        // Task assigned to user
  | 'status_change';       // Task/Order status changed
```

### Extended Types (Phase 2 - Recommended)

```typescript
type NotificationType = 
  // ============= TASKS & WARRANTY =============
  | 'task_mention'              // 🏷️ @mention trong task comment
  | 'task_comment'              // 💬 Comment mới trong task
  | 'task_assigned'             // 📋 Task được giao
  | 'task_status_change'        // 🔄 Trạng thái task thay đổi
  | 'task_overdue'              // ⏰ Task quá hạn
  | 'task_deadline_approaching' // ⚠️ Sắp đến deadline
  
  // ============= ORDERS =============
  | 'order_assigned'            // 📦 Đơn hàng được giao
  | 'order_status_change'       // 🔄 Trạng thái đơn hàng thay đổi
  | 'order_payment_received'    // 💰 Nhận được thanh toán
  | 'order_shipped'             // 🚚 Đơn hàng đã gửi
  | 'order_delivered'           // ✅ Đơn hàng đã giao
  | 'order_cancelled'           // ❌ Đơn hàng bị hủy
  | 'order_return_requested'    // 🔙 Yêu cầu trả hàng
  
  // ============= CUSTOMERS =============
  | 'customer_assigned'         // 👤 Khách hàng được giao
  | 'customer_feedback'         // 💬 Feedback từ khách hàng
  | 'customer_complaint'        // 😤 Khiếu nại từ khách hàng
  | 'customer_milestone'        // 🎉 Milestone (VIP, 1 năm, etc.)
  
  // ============= PROCUREMENT =============
  | 'purchase_order_approved'   // ✅ Đơn nhập hàng được duyệt
  | 'purchase_order_rejected'   // ❌ Đơn nhập hàng bị từ chối
  | 'supplier_response'         // 📧 NCC phản hồi
  | 'inventory_low_stock'       // ⚠️ Sắp hết hàng
  
  // ============= HR =============
  | 'leave_approved'            // ✅ Nghỉ phép được duyệt
  | 'leave_rejected'            // ❌ Nghỉ phép bị từ chối
  | 'leave_request'             // 📝 Yêu cầu nghỉ phép mới
  | 'payroll_ready'             // 💰 Bảng lương đã sẵn sàng
  | 'attendance_reminder'       // ⏰ Nhắc chấm công
  | 'kpi_review'                // 📊 Đánh giá KPI
  
  // ============= FINANCE =============
  | 'invoice_paid'              // 💰 Hóa đơn đã thanh toán
  | 'invoice_overdue'           // ⚠️ Hóa đơn quá hạn
  | 'payment_received'          // 💵 Nhận được thanh toán
  | 'payment_pending'           // ⏳ Chờ thanh toán
  
  // ============= SHIPMENTS =============
  | 'shipment_created'          // 📦 Vận đơn mới
  | 'shipment_in_transit'       // 🚚 Đang vận chuyển
  | 'shipment_delivered'        // ✅ Đã giao hàng
  | 'shipment_failed'           // ❌ Giao hàng thất bại
  | 'shipment_returned'         // 🔙 Hàng bị trả lại
  
  // ============= SYSTEM =============
  | 'system_announcement'       // 📢 Thông báo hệ thống
  | 'system_maintenance'        // 🔧 Bảo trì hệ thống
  | 'system_update';            // 🆕 Cập nhật hệ thống
```

### Emoji Mapping (for NotificationPopover)

```typescript
const notificationEmojis: Record<NotificationType, string> = {
  // Tasks & Warranty
  'task_mention': '🏷️',
  'task_comment': '💬',
  'task_assigned': '📋',
  'task_status_change': '🔄',
  'task_overdue': '⏰',
  'task_deadline_approaching': '⚠️',
  
  // Orders
  'order_assigned': '📦',
  'order_status_change': '🔄',
  'order_payment_received': '💰',
  'order_shipped': '🚚',
  'order_delivered': '✅',
  'order_cancelled': '❌',
  'order_return_requested': '🔙',
  
  // Customers
  'customer_assigned': '👤',
  'customer_feedback': '💬',
  'customer_complaint': '😤',
  'customer_milestone': '🎉',
  
  // Procurement
  'purchase_order_approved': '✅',
  'purchase_order_rejected': '❌',
  'supplier_response': '📧',
  'inventory_low_stock': '⚠️',
  
  // HR
  'leave_approved': '✅',
  'leave_rejected': '❌',
  'leave_request': '📝',
  'payroll_ready': '💰',
  'attendance_reminder': '⏰',
  'kpi_review': '📊',
  
  // Finance
  'invoice_paid': '💰',
  'invoice_overdue': '⚠️',
  'payment_received': '💵',
  'payment_pending': '⏳',
  
  // Shipments
  'shipment_created': '📦',
  'shipment_in_transit': '🚚',
  'shipment_delivered': '✅',
  'shipment_failed': '❌',
  'shipment_returned': '🔙',
  
  // System
  'system_announcement': '📢',
  'system_maintenance': '🔧',
  'system_update': '🆕',
};
```

---

## 🔧 Integration Guide

### Step 1: Import Notification Store

```tsx
import { useNotificationStore } from '../../features/tasks-warranty/notification-store';
// Future: import { useNotificationStore } from '../../lib/notification-store';

function MyModule() {
  const { addNotification } = useNotificationStore();
  const currentUser = { id: 'NV001', name: 'Nguyễn Văn An' };
  
  // Your component logic...
}
```

### Step 2: Trigger Notification

#### Example 1: Order Status Change
```tsx
const handleStatusChange = (order: Order, newStatus: string) => {
  // Update order status
  updateOrder(order.id, { status: newStatus });
  
  // Send notification to assignee
  addNotification({
    type: 'order_status_change',
    taskId: order.id,
    taskTitle: `Đơn hàng #${order.orderNumber}`,
    fromUserId: currentUser.id,
    fromUserName: currentUser.name,
    toUserId: order.assigneeId, // Person who should receive notification
    message: `đã cập nhật trạng thái đơn hàng thành "${newStatus}"`,
    link: `/orders/${order.id}`, // Navigation link
  });
  
  toast.success(`Đã gửi thông báo đến ${order.assigneeName}`);
};
```

#### Example 2: Leave Request
```tsx
const handleLeaveRequest = (leave: Leave) => {
  // Create leave request
  createLeaveRequest(leave);
  
  // Notify manager
  const manager = getManager(currentUser.departmentId);
  addNotification({
    type: 'leave_request',
    taskId: leave.id,
    taskTitle: `Nghỉ phép ${leave.leaveType}`,
    fromUserId: currentUser.id,
    fromUserName: currentUser.name,
    toUserId: manager.id,
    message: `đã gửi yêu cầu nghỉ phép từ ${formatDate(leave.startDate)} đến ${formatDate(leave.endDate)}`,
    link: `/leaves/${leave.id}`,
  });
  
  toast.success('Đã gửi yêu cầu nghỉ phép đến quản lý');
};
```

#### Example 3: Low Stock Alert
```tsx
const checkInventory = (product: Product) => {
  if (product.stock < product.minStockLevel) {
    // Notify inventory manager
    const inventoryManager = getInventoryManager();
    addNotification({
      type: 'inventory_low_stock',
      taskId: product.id,
      taskTitle: product.name,
      fromUserId: 'system',
      fromUserName: 'Hệ thống',
      toUserId: inventoryManager.id,
      message: `Sản phẩm "${product.name}" sắp hết hàng (còn ${product.stock} sản phẩm)`,
      link: `/products/${product.id}`,
    });
  }
};
```

#### Example 4: Bulk Notifications (Multiple Users)
```tsx
const notifyTeam = (task: Task, teamMembers: User[]) => {
  teamMembers.forEach(member => {
    addNotification({
      type: 'task_assigned',
      taskId: task.id,
      taskTitle: task.title,
      fromUserId: currentUser.id,
      fromUserName: currentUser.name,
      toUserId: member.id,
      message: `đã thêm bạn vào task "${task.title}"`,
      link: `/tasks-warranty/${task.systemId}`,
    });
  });
  
  toast.success(`Đã gửi thông báo đến ${teamMembers.length} thành viên`);
};
```

---

## 📊 Best Practices

### 1. **Luôn cung cấp link navigation**
```tsx
// ✅ GOOD - User có thể click vào notification để xem chi tiết
addNotification({
  // ...
  link: `/orders/${order.id}`,
});

// ❌ BAD - User không biết phải làm gì
addNotification({
  // ...
  link: '/',
});
```

### 2. **Message rõ ràng và ngắn gọn**
```tsx
// ✅ GOOD
message: `đã cập nhật trạng thái đơn hàng thành "Đang xử lý"`

// ❌ BAD - quá dài
message: `đã thực hiện việc cập nhật trạng thái cho đơn hàng của bạn từ trạng thái cũ là "Chờ xử lý" sang trạng thái mới là "Đang xử lý"`
```

### 3. **Chỉ gửi notification khi cần thiết**
```tsx
// ✅ GOOD - Only notify if assignee changed
if (oldAssigneeId !== newAssigneeId) {
  addNotification({ /* ... */ });
}

// ❌ BAD - Spam notifications on every save
onSave(() => {
  addNotification({ /* ... */ }); // Tạo nhiều notification không cần thiết
});
```

### 4. **Không gửi notification cho chính mình**
```tsx
// ✅ GOOD
if (toUserId !== currentUser.id) {
  addNotification({ /* ... */ });
}

// ❌ BAD - Tự gửi notification cho mình
addNotification({
  toUserId: currentUser.id, // ❌ Không cần thiết
});
```

### 5. **Combine với Toast messages**
```tsx
// ✅ GOOD - User experience tốt hơn
addNotification({ /* ... */ });
toast.success('Đã gửi thông báo thành công');

// ✅ ALSO GOOD - Show who was notified
addNotification({ /* ... */ });
toast.success(`Đã gửi thông báo đến ${assignee.name}`);
```

---

## 🚀 Phase 2 Enhancements

### 1. **Move to Global Location**
```bash
# Current (temporary)
d:\hrm2\features\tasks-warranty\notification-store.ts
d:\hrm2\features\tasks-warranty\components\notification-popover.tsx

# Future (recommended)
d:\hrm2\lib\notification-store.ts
d:\hrm2\components\notifications\notification-popover.tsx
```

### 2. **Add Notification Preferences**
```typescript
interface NotificationPreferences {
  userId: string;
  email: boolean;              // Email notifications
  push: boolean;               // Push notifications (future)
  desktop: boolean;            // Desktop notifications (future)
  channels: {
    tasks: boolean;
    orders: boolean;
    hr: boolean;
    finance: boolean;
    system: boolean;
  };
}
```

### 3. **Real-time with WebSocket**
```typescript
// Add WebSocket support for instant notifications
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('notification', (notification: Notification) => {
  addNotification(notification);
  toast(`Thông báo mới từ ${notification.fromUserName}`);
});
```

### 4. **Email Notifications**
```typescript
// Send email when user is offline or prefers email
const sendEmailNotification = async (notification: Notification) => {
  const user = await getUserById(notification.toUserId);
  if (user.notificationPreferences.email) {
    await fetch('/api/notifications/email', {
      method: 'POST',
      body: JSON.stringify({
        to: user.email,
        subject: `Thông báo mới từ HRM2`,
        body: notification.message,
        link: notification.link,
      }),
    });
  }
};
```

### 5. **Notification Center Page**
```tsx
// Full-page notification center
// Route: /notifications
export function NotificationCenterPage() {
  const { notifications, markAsRead, deleteNotification } = useNotificationStore();
  const { user } = useAuth();
  const userNotifications = getUserNotifications(user.id);
  
  return (
    <div>
      <h1>Trung tâm thông báo</h1>
      <Tabs>
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="unread">Chưa đọc</TabsTrigger>
          <TabsTrigger value="tasks">Công việc</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="hr">Nhân sự</TabsTrigger>
        </TabsList>
        {/* ... */}
      </Tabs>
    </div>
  );
}
```

### 6. **Notification Groups**
```typescript
// Group notifications by type or date
const groupedNotifications = groupBy(notifications, 'type');
const notificationsByDate = groupBy(notifications, (n) => 
  formatDate(n.createdAt, 'dd/MM/yyyy')
);
```

### 7. **Mark All As Read per Type**
```typescript
const markAllAsReadByType = (type: NotificationType) => {
  notifications
    .filter(n => n.type === type && !n.isRead)
    .forEach(n => markAsRead(n.id));
};
```

### 8. **Notification Sound**
```typescript
const playNotificationSound = () => {
  const audio = new Audio('/sounds/notification.mp3');
  audio.play();
};

// In store
addNotification: (notification) => {
  // ... add to state
  playNotificationSound();
  
  // Desktop notification (if permission granted)
  if (Notification.permission === 'granted') {
    new Notification(notification.message, {
      icon: '/logo.png',
      body: `Từ ${notification.fromUserName}`,
    });
  }
};
```

---

## 📝 Testing Checklist

### Unit Tests
- [ ] NotificationStore adds notification correctly
- [ ] NotificationStore marks as read
- [ ] NotificationStore filters by userId
- [ ] NotificationStore calculates unread count
- [ ] NotificationStore persists to localStorage

### Integration Tests
- [ ] NotificationPopover displays unread count
- [ ] NotificationPopover shows correct notifications
- [ ] Clicking notification navigates correctly
- [ ] Clicking notification marks as read
- [ ] Delete notification removes from store
- [ ] Mark all as read works correctly

### E2E Tests
- [ ] Create task → assignee receives notification
- [ ] @mention user → user receives notification
- [ ] Change order status → assignee receives notification
- [ ] Notification persists after page refresh
- [ ] Notification center accessible from header
- [ ] Notification preferences saved

---

## 📚 Related Documentation

- [Comments & Mentions Implementation](./COMMENTS-MENTIONS-IMPLEMENTATION.md)
- [Tasks Warranty Page Guide](./how-to-add-new-page.md)
- [State Management with Zustand](../lib/ui-store.ts)

---

## ❓ FAQ

### Q: Tại sao notification store vẫn ở trong `features/tasks-warranty/`?
**A**: Đây là implementation ban đầu. Nên di chuyển lên `lib/notification-store.ts` để trở thành global store.

### Q: Làm sao để notification không bị mất khi refresh page?
**A**: Zustand persist middleware tự động lưu vào localStorage với key `'hrm-notifications'`.

### Q: Có thể gửi notification cho nhiều người cùng lúc không?
**A**: Có, dùng `forEach` hoặc `Promise.all`:
```typescript
teamMembers.forEach(member => addNotification({ toUserId: member.id, ... }));
```

### Q: Notification có hỗ trợ real-time không?
**A**: Hiện tại chưa. Phase 2 sẽ thêm WebSocket support.

### Q: Có thể tùy chỉnh sound notification không?
**A**: Phase 2 enhancement. Hiện tại chưa hỗ trợ.

---

**Last Updated**: 2025-11-04  
**Version**: 1.0.0  
**Status**: ✅ Phase 1 Complete, 🚧 Phase 2 Planning
