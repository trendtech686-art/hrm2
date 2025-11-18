# Complaints Module - Update Summary (Nov 7, 2025)

## ✅ Hoàn thành

### 1. Sửa logic: Không cho check workflow nếu chưa xác minh ✅
**Vấn đề:** Có thể hoàn thành toàn bộ quy trình xử lý mà chưa xác minh khiếu nại (đúng/sai)

**Giải pháp:**
- Set `readonly={complaint.verification === "pending-verification"}`  
- Thêm toast error khi cố gắng check: "Vui lòng xác minh khiếu nại (đúng/sai) trước khi thực hiện quy trình xử lý"
- Chỉ cho phép check workflow sau khi đã xác minh

**File:** `features/complaints/detail-page.tsx` lines 763-770

---

### 2. Cảnh báo quá hạn (SLA) ✅
**Tạo mới:**
- File: `features/complaints/sla-utils.ts` - Utility functions cho SLA

**Tính năng:**
- ✅ Default SLA theo priority (low, medium, high, urgent)
- ✅ Check overdue theo 2 tiêu chí:
  * **Response Time**: Thời gian phản hồi lần đầu (phút)
  * **Resolve Time**: Thời gian giải quyết hoàn toàn (giờ)
- ✅ Hiển thị badge đỏ "Quá hạn" trên kanban card
- ✅ Highlight border màu đỏ cho card quá hạn
- ✅ Hiển thị thời gian còn lại/quá: "Còn 2 giờ" / "Quá 3 ngày"

**SLA Mặc định:**
| Priority | Response Time | Resolve Time |
|----------|---------------|--------------|
| Low | 4 giờ (240 phút) | 2 ngày (48 giờ) |
| Medium | 2 giờ (120 phút) | 1 ngày (24 giờ) |
| High | 1 giờ (60 phút) | 12 giờ |
| Urgent | 30 phút | 4 giờ |

**File thay đổi:**
- `features/complaints/page.tsx` - Thêm import và logic check overdue
- `features/complaints/sla-utils.ts` - NEW file

---

### 3. Upload video qua link (YouTube, Google Drive...) ✅
**File:** `features/complaints/verification-dialog.tsx`

**Thêm mới:**
- Textarea để dán link video (mỗi link một dòng)
- Parse links khi submit (split by newline)
- Lưu vào array `videoLinks[]`
- Handler nhận parameter `videoLinks: string[]`

**Lợi ích:**
- Tiết kiệm dung lượng server
- Upload video lớn dễ dàng
- Hỗ trợ nhiều nền tảng

---

### 4. Validation đầy đủ ✅

#### A. Dialog "Xác nhận đúng"
```typescript
if (resolutionCost <= 0) alert("Vui lòng nhập số tiền bù trừ");
if (!resolutionReason.trim()) alert("Vui lòng nhập lý do bù trừ");
```

#### B. Dialog "Xác nhận sai"
```typescript
if (evidenceFiles.length === 0 && 
    videoLinks.length === 0 && 
    !evidenceNote.trim()) {
  alert("Vui lòng tải file hoặc dán link video hoặc ghi chú");
}
```

#### C. Workflow trước khi xác minh
```typescript
const completedCount = workflow.filter(s => s.completed).length;
if (completedCount < totalCount) {
  confirm("Quy trình xử lý chưa hoàn thành (3/5 bước). Bạn có chắc?");
}
```

---

## 🚧 Đang triển khai (Phase 2)

### 1. Realtime Notifications
- [ ] In-app notification (bell icon)
- [ ] Email notification
- [ ] Telegram/Zalo bot

### 2. SLA Settings Page
- [ ] Tạo page: `/settings/complaints`
- [ ] Tab "SLA & Thời gian" - Cấu hình response/resolve time
- [ ] Tab "Templates phản hồi" - Soạn sẵn câu trả lời mẫu
- [ ] Tab "Thông báo" - Bật/tắt email/SMS
- [ ] Tab "Public Tracking" - Cấu hình link công khai

### 3. Liên kết Đơn hàng
- [ ] Link trực tiếp đến chi tiết đơn hàng
- [ ] Xem lịch sử khiếu nại của đơn hàng
- [ ] Cập nhật trạng thái đơn khi khiếu nại resolved
- [ ] Hủy đơn/Hoàn tiền trực tiếp từ khiếu nại

### 4. Liên kết Khách hàng
- [ ] Customer Profile với lịch sử khiếu nại
- [ ] Tỷ lệ khiếu nại / tổng đơn hàng
- [ ] Điểm uy tín khách hàng
- [ ] Ghi chú đặc biệt

### 5. Liên kết Sản phẩm
- [ ] Sản phẩm bị khiếu nại nhiều nhất
- [ ] Lô hàng có vấn đề
- [ ] Cảnh báo sản phẩm lỗi cao
- [ ] Tự động ngừng bán sản phẩm lỗi

### 6. Public Tracking Link
- [ ] Generate link công khai: `https://site.com/complaint-tracking/{publicId}`
- [ ] Trang tracking không cần đăng nhập
- [ ] Khách hàng comment trực tiếp
- [ ] Gửi link qua email/SMS

### 7. Templates phản hồi
- [ ] CRUD templates trong settings
- [ ] Dropdown chọn template khi comment
- [ ] Categories: product-defect, shipping-delay, general, etc.
- [ ] Quick insert vào comment box

---

## 📝 Todo List

### **High Priority** (Tuần tới)
1. [ ] Tạo Settings Page (`/settings/complaints`)
   - [ ] Tab SLA với form cấu hình time
   - [ ] Tab Templates với CRUD
   - [ ] Tab Notifications switches
   - [ ] Tab Public Tracking settings
2. [ ] Implement Save to localStorage
3. [ ] Load settings từ localStorage trong `sla-utils.ts`
4. [ ] Add "Cài đặt" link trong complaints page header

### **Medium Priority** (2 tuần tới)
1. [ ] Public Tracking Page (`/complaint-tracking/:publicId`)
2. [ ] Generate publicId khi tạo khiếu nại
3. [ ] Email template khi resolved (gửi tracking link)
4. [ ] Template selector trong comment box

### **Low Priority** (1 tháng)
1. [ ] Link to order detail page
2. [ ] Link to customer profile page
3. [ ] Product issue tracking
4. [ ] Email notifications (real backend)
5. [ ] SMS notifications (Twilio/Nexmo)

---

## 🎯 UX Improvements

### Hiện tại
- ✅ Badge "Quá hạn" màu đỏ trên card
- ✅ Border đỏ cho card quá hạn
- ✅ Hiển thị thời gian: "Còn 2h" / "Quá 3 ngày"
- ✅ Validation toàn bộ form/dialog
- ✅ Readonly workflow khi chưa xác minh

### Đề xuất thêm
- [ ] Tooltip hover: "SLA: Phản hồi trong 2h, Giải quyết trong 24h"
- [ ] Progress bar cho SLA (0-100%)
- [ ] Sort theo độ ưu tiên (quá hạn lên đầu)
- [ ] Filter "Chỉ xem quá hạn"
- [ ] Countdown timer realtime (cập nhật mỗi phút)

---

## 📊 Data Structure Updates

### Complaint Type (Extended)
```typescript
interface Complaint {
  // ... existing fields
  
  // NEW fields
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  evidenceVideoLinks?: string[]; // Array of YouTube/Drive links
  publicId?: string; // For public tracking
  compensationAmount?: number;
  incurredCost?: number;
  compensationReason?: string;
  scheduledDeletionAt?: string;
  filesToDelete?: string[];
}
```

### Settings Storage (localStorage)
```typescript
interface ComplaintSettings {
  sla: ComplaintSLA[];
  templates: ResponseTemplate[];
  notifications: {
    emailOnCreate: boolean;
    emailOnAssign: boolean;
    emailOnVerified: boolean;
    emailOnResolved: boolean;
    smsOnOverdue: boolean;
  };
  publicTracking: {
    enabled: boolean;
    allowCustomerComment: boolean;
    showEmployeeName: boolean;
  };
}

// Stored at: localStorage.getItem('complaint-settings')
```

---

## 🔧 Technical Notes

### SLA Check Logic
```typescript
// Response overdue: Chưa có bất kỳ comment/investigated action nào
const hasResponse = complaint.timeline?.some(
  (action) => action.actionType === 'commented' || action.actionType === 'investigated'
);
const isOverdueResponse = !hasResponse && responseTimeLeft < 0;

// Resolve overdue: Chưa đạt status resolved/rejected
const isResolved = complaint.status === 'resolved' || complaint.status === 'rejected';
const isOverdueResolve = !isResolved && resolveTimeLeft < 0;
```

### Video Links Parsing
```typescript
const videoLinks = evidenceVideoLinks
  .split('\n')
  .map(link => link.trim())
  .filter(link => link.length > 0);
```

### Workflow Readonly
```typescript
<SubtaskList
  readonly={complaint.verification === "pending-verification"}
  onToggleComplete={(id, completed) => {
    if (complaint.verification === "pending-verification") {
      toast.error("Vui lòng xác minh khiếu nại trước...");
      return;
    }
    // ... proceed
  }}
/>
```

---

## 🐛 Known Issues

1. **Priority field chưa có trong Complaint type**
   - Workaround: Dùng `(complaint as any).priority`
   - TODO: Update types.ts

2. **SLA settings chưa persist**
   - Hiện tại: Dùng defaultSLA hardcoded
   - TODO: Read from localStorage trong `sla-utils.ts`

3. **Settings page chưa tạo**
   - TODO: Tạo file `features/complaints/settings-page.tsx`
   - TODO: Add route `/settings/complaints`

---

## 📚 Related Documentation

- [COMPLAINTS-ACTION-BUTTONS-LOGIC.md](./COMPLAINTS-ACTION-BUTTONS-LOGIC.md)
- [COMPLAINTS-COMPENSATION-AND-FILE-DELETION.md](./COMPLAINTS-COMPENSATION-AND-FILE-DELETION.md)
- [COMPLAINTS-FEATURE-SUGGESTIONS.md](./COMPLAINTS-FEATURE-SUGGESTIONS.md)

---

**Last Updated**: November 7, 2025
**Status**: ✅ Phase 1 Complete, 🚧 Phase 2 In Progress
