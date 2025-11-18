# Complaints Module - Realtime Updates, SLA Timer & Context Menu

**Date:** November 8, 2025  
**Status:** ✅ Completed  
**Version:** 1.0.0

---

## 📋 TÓM TẮT CẬP NHẬT

Đã nâng cấp module Complaints với 3 tính năng chính:

1. **SLA Timer Live Countdown** - Đếm ngược thời gian SLA real-time
2. **Realtime Updates** - Tự động phát hiện và thông báo cập nhật mới
3. **Context Menu cho Card** - Right-click menu với quick actions

---

## 🎯 TÍNH NĂNG ĐÃ TRIỂN KHAI

### 1. **SLA TIMER LIVE COUNTDOWN** ⏱️

#### Component: `sla-timer.tsx`

**Chức năng:**
- ✅ Đếm ngược thời gian SLA theo từng phút
- ✅ Hiển thị màu cảnh báo theo mức độ khẩn cấp:
  - 🔴 **Đỏ** + animation pulse: Quá hạn hoặc < 1 giờ
  - 🟠 **Cam**: < 3 giờ
  - ⚫ **Xám**: Bình thường
- ✅ Tự động update mỗi 60 giây
- ✅ Ưu tiên hiển thị:
  1. Quá hạn phản hồi (nếu chưa phản hồi)
  2. Quá hạn giải quyết (nếu chưa giải quyết)
  3. Sắp đến hạn phản hồi (< 6h)
  4. Sắp đến hạn giải quyết (< 12h)
  5. Thời gian còn lại đến deadline

**Format hiển thị:**
```typescript
// Ví dụ:
"Quá hạn phản hồi: 2h 30m"
"Phản hồi: 45m"
"Giải quyết: 1d 5h"
"Còn 3h 15m"
```

**Props:**
```typescript
interface SlaTimerProps {
  complaint: Complaint;
  className?: string;
}
```

**Usage trong Card:**
```tsx
<SlaTimer complaint={complaint} className="mb-2" />
```

---

### 2. **REALTIME UPDATES** 🔄

#### Hook: `use-realtime-updates.ts`

**Chức năng:**
- ✅ Polling mỗi 30 giây để check updates
- ✅ Phát hiện thay đổi data qua localStorage version
- ✅ Hiển thị toast notification khi có update mới
- ✅ Button "Làm mới" trong notification
- ✅ Toggle Live/Manual mode
- ✅ Animation spinning khi polling active

**API:**
```typescript
// Hook usage
const { hasUpdates, isPolling, refresh, togglePolling } = useRealtimeUpdates(
  dataVersion,      // Current data version
  onRefresh,        // Callback when refresh
  30000            // Polling interval (ms)
);

// Trigger update after action
triggerDataUpdate();

// Get current version
const version = getDataVersion();
```

**UI Integration:**
```tsx
<Button
  variant={isPolling ? "default" : "outline"}
  size="sm"
  onClick={togglePolling}
>
  <RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />
  {isPolling ? "Live" : "Manual"}
</Button>
```

**Toast Notification:**
- Message: "Có cập nhật mới từ hệ thống"
- Action button: "Làm mới"
- Duration: 10 seconds
- Position: top-right

**Trigger Points:**
Tự động gọi `triggerDataUpdate()` sau các actions:
- ✅ Kết thúc khiếu nại
- ✅ Mở lại khiếu nại
- ✅ Hủy khiếu nại
- ✅ Bulk operations

---

### 3. **CONTEXT MENU CHO CARD** 🖱️

#### Component: `complaint-card-context-menu.tsx`

**Chức năng:**
- ✅ Right-click trên card để mở menu
- ✅ 5 actions chính:
  1. **Sửa** (Pencil icon)
  2. **Get Link** (Link2 icon)
  3. **Kết thúc** (CheckCircle icon) - Hiện khi chưa closed
  4. **Mở lại** (FolderOpen icon) - Hiện khi đã closed
  5. **Hủy** (Ban icon) - Màu đỏ

**Props:**
```typescript
interface ComplaintCardContextMenuProps {
  complaint: Complaint;
  onEdit: (systemId: string) => void;
  onGetLink: (systemId: string) => void;
  onFinish: (systemId: string) => void;
  onOpen: (systemId: string) => void;
  onCancel: (systemId: string) => void;
  children: React.ReactNode;
}
```

**Usage:**
```tsx
<ComplaintCardContextMenu
  complaint={complaint}
  onEdit={handleEdit}
  onGetLink={handleGetLink}
  onFinish={handleFinish}
  onOpen={handleOpen}
  onCancel={handleCancel}
>
  <Card>
    {/* Card content */}
  </Card>
</ComplaintCardContextMenu>
```

**Logic hiển thị:**
- Nếu `status === 'resolved' || 'rejected'` → Hiện "Mở lại"
- Nếu status khác → Hiện "Kết thúc"
- "Hủy" luôn hiển thị (màu destructive)

---

## 📁 CẤU TRÚC FILE

```
features/complaints/
├── page.tsx                              # ✅ Updated - Main page
├── sla-timer.tsx                         # ✨ New - SLA countdown component
├── complaint-card-context-menu.tsx       # ✨ New - Context menu wrapper
├── use-realtime-updates.ts               # ✨ New - Realtime updates hook
├── sla-utils.ts                          # Existing - SLA calculations
├── types.ts                              # Existing - Type definitions
└── store.ts                              # Existing - Zustand store
```

---

## 🔧 INTEGRATION TRONG PAGE.TSX

### Import statements:
```typescript
import { RefreshCw } from "lucide-react";
import { SlaTimer } from "./sla-timer.tsx";
import { ComplaintCardContextMenu } from "./complaint-card-context-menu.tsx";
import { useRealtimeUpdates, getDataVersion, triggerDataUpdate } from "./use-realtime-updates.ts";
```

### State management:
```typescript
// Realtime updates
const [dataVersion, setDataVersion] = React.useState(() => getDataVersion());
const { hasUpdates, isPolling, refresh, togglePolling } = useRealtimeUpdates(
  dataVersion,
  () => {
    setDataVersion(getDataVersion());
    const newVersion = Date.now();
    setDataVersion(newVersion);
  },
  30000
);
```

### KanbanColumn Props (Updated):
```typescript
function KanbanColumn({
  status,
  complaints,
  onComplaintClick,
  employees,
  onEdit,        // ✨ New
  onGetLink,     // ✨ New
  onFinish,      // ✨ New
  onOpen,        // ✨ New
  onCancel,      // ✨ New
})
```

### Card rendering:
```tsx
<ComplaintCardContextMenu
  complaint={complaint}
  onEdit={onEdit}
  onGetLink={onGetLink}
  onFinish={onFinish}
  onOpen={onOpen}
  onCancel={onCancel}
>
  <Card>
    {/* ... */}
    <SlaTimer complaint={complaint} className="mb-2" />
    {/* ... */}
  </Card>
</ComplaintCardContextMenu>
```

### Toolbar (Updated):
```tsx
{/* Row 1: Settings + Realtime */}
<div className="flex items-center justify-end gap-2">
  <Button
    variant={isPolling ? "default" : "outline"}
    size="sm"
    onClick={togglePolling}
  >
    <RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />
    {isPolling ? "Live" : "Manual"}
  </Button>
  <Button variant="outline" size="sm" onClick={() => navigate('/settings/complaints')}>
    <Settings className="h-4 w-4 mr-2" />
    Cài đặt
  </Button>
</div>
```

---

## 🎨 UI/UX IMPROVEMENTS

### SLA Timer Colors:
| Trạng thái | Màu | Class | Animation |
|-----------|-----|-------|-----------|
| Quá hạn | 🔴 Đỏ | `text-destructive` | `animate-pulse` |
| < 1 giờ | 🔴 Đỏ | `text-destructive` | `animate-pulse` |
| < 3 giờ | 🟠 Cam | `text-orange-500` | - |
| Bình thường | ⚫ Xám | `text-muted-foreground` | - |

### Context Menu:
- **Position:** Xuất hiện tại vị trí chuột
- **Auto-adjust:** Tự động điều chỉnh nếu tràn màn hình
- **Keyboard:** ESC để đóng
- **Click outside:** Đóng khi click ra ngoài
- **Smooth animation:** fade-in + zoom-in

### Realtime Button:
- **Live mode:** Background primary + spinning icon
- **Manual mode:** Outline variant + static icon
- **Tooltip:** Hover để xem trạng thái

---

## 🚀 USER FLOW

### 1. Xem SLA Timer:
```
User mở Kanban view
  → Mỗi card hiển thị SLA timer
  → Timer tự động update mỗi phút
  → Màu thay đổi theo độ khẩn cấp
  → Animation pulse khi critical
```

### 2. Sử dụng Context Menu:
```
User right-click vào card
  → Context menu xuất hiện
  → Chọn action:
      - Sửa → Navigate to edit page
      - Get Link → Copy link to clipboard
      - Kết thúc/Mở → Show confirm dialog
      - Hủy → Show confirm dialog
  → Action thực hiện
  → triggerDataUpdate() được gọi
```

### 3. Realtime Updates:
```
Page load
  → Realtime polling bắt đầu (30s interval)
  → Check localStorage version
  
User thực hiện action (finish/open/cancel)
  → triggerDataUpdate() tăng version
  
Polling detect changes
  → Toast notification xuất hiện
  → User click "Làm mới"
  → Data refresh
  → UI update
```

### 4. Toggle Polling:
```
User click "Live" button
  → Chuyển sang "Manual" mode
  → Polling dừng
  → Icon dừng quay
  
User click "Manual" button
  → Chuyển sang "Live" mode
  → Polling tiếp tục
  → Icon quay
```

---

## ⚙️ CONFIGURATION

### SLA Settings:
Đọc từ localStorage theo priority:
```typescript
{
  low: { responseTime: 240, resolveTime: 48 },
  medium: { responseTime: 120, resolveTime: 24 },
  high: { responseTime: 60, resolveTime: 12 },
  urgent: { responseTime: 30, resolveTime: 4 }
}
```

### Polling Interval:
```typescript
const DEFAULT_INTERVAL = 30000; // 30 seconds
```

### Toast Duration:
```typescript
const TOAST_DURATION = 10000; // 10 seconds
```

---

## 🧪 TESTING CHECKLIST

### SLA Timer:
- [x] Timer hiển thị đúng format
- [x] Màu thay đổi theo thời gian
- [x] Animation pulse khi critical
- [x] Update mỗi phút
- [x] Không hiển thị khi resolved/rejected

### Context Menu:
- [x] Right-click mở menu
- [x] Menu xuất hiện đúng vị trí
- [x] Auto-adjust khi tràn màn hình
- [x] Actions hoạt động đúng
- [x] ESC đóng menu
- [x] Click outside đóng menu
- [x] Show/hide actions theo status

### Realtime Updates:
- [x] Polling chạy đúng interval
- [x] Detect version changes
- [x] Toast notification hiển thị
- [x] Refresh button hoạt động
- [x] Toggle Live/Manual
- [x] triggerDataUpdate() sau actions

---

## 🐛 KNOWN ISSUES

Không có lỗi TypeScript.

---

## 🔮 FUTURE ENHANCEMENTS

### Phase 2:
1. **WebSocket Integration** - Thay polling bằng WebSocket cho realtime thực sự
2. **Multi-tab Sync** - Đồng bộ giữa nhiều tab
3. **Offline Support** - Cache và sync khi online lại
4. **Sound Notification** - Âm thanh khi có update mới
5. **Badge Count** - Số lượng updates chưa xem

### Phase 3:
1. **SLA History Chart** - Biểu đồ lịch sử SLA
2. **Custom SLA Alerts** - Cảnh báo tùy chỉnh
3. **Keyboard Shortcuts** - Phím tắt cho context menu
4. **Bulk Context Menu** - Menu cho multiple selection

---

## 📚 API REFERENCE

### `useRealtimeUpdates()`
```typescript
function useRealtimeUpdates(
  dataVersion: number,
  onRefresh: () => void,
  interval?: number
): {
  hasUpdates: boolean;
  isPolling: boolean;
  refresh: () => void;
  togglePolling: () => void;
}
```

### `triggerDataUpdate()`
```typescript
function triggerDataUpdate(): void
// Tăng version trong localStorage để trigger polling detect
```

### `getDataVersion()`
```typescript
function getDataVersion(): number
// Lấy version hiện tại từ localStorage
```

---

## 📝 CHANGELOG

### Version 1.0.0 (Nov 8, 2025)
- ✨ Thêm SLA Timer với live countdown
- ✨ Thêm Realtime Updates với polling
- ✨ Thêm Context Menu cho cards
- ✅ Tích hợp vào Kanban view
- ✅ Không có TypeScript errors

---

## 👨‍💻 DEVELOPMENT NOTES

### Dependencies:
```json
{
  "react": "^18.x",
  "sonner": "^1.x", // Toast notifications
  "lucide-react": "^0.x" // Icons
}
```

### Performance:
- SLA Timer: Update mỗi 60s (không ảnh hưởng performance)
- Polling: 30s interval (có thể điều chỉnh)
- Context Menu: Event-based (không overhead)

### Browser Support:
- Chrome/Edge: ✅
- Firefox: ✅
- Safari: ✅
- Mobile: ✅ (context menu = long press)

---

**Document Version:** 1.0.0  
**Last Updated:** November 8, 2025  
**Author:** AI Assistant
