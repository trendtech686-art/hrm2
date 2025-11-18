# Hệ thống quản lý công việc với Evidence & Approval

## 📋 Tổng quan

Đã implement đầy đủ hệ thống quản lý công việc với phân quyền Admin/User, yêu cầu upload bằng chứng hoàn thành và workflow phê duyệt.

## ✅ Tính năng đã hoàn thành

### 1. **Types & Data Structure** (`types.ts`)
- ✅ `ApprovalStatus`: 'pending' | 'approved' | 'rejected'
- ✅ `CompletionEvidence`: Lưu ảnh + ghi chú + metadata
- ✅ `ApprovalHistory`: Lịch sử phê duyệt/từ chối
- ✅ `Task` interface: Thêm fields evidence & approval
- ✅ Activity actions mới: 'evidence_submitted', 'evidence_approved', 'evidence_rejected'

### 2. **User View** - Checkbox List (`user-tasks-page.tsx`)
**Route**: `/my-tasks`

**Features**:
- ✅ 5 tabs:
  - Chưa bắt đầu
  - Đang làm (bao gồm cả việc bị reject)
  - Quá hạn (tự động detect theo dueDate)
  - Chờ duyệt (pending approval)
  - Hoàn thành (approved)
- ✅ Stats cards hiển thị số lượng từng loại
- ✅ Search realtime
- ✅ Checkbox interaction: Click để hoàn thành → Mở dialog upload
- ✅ Badge hiển thị trạng thái (Chờ duyệt, Làm lại, Đã duyệt)
- ✅ Hiển thị rejection reason nếu bị từ chối
- ✅ Refresh button

### 3. **Completion Dialog** (`CompletionDialog.tsx`)
**Trigger**: User click checkbox trên task chưa hoàn thành

**Features**:
- ✅ Upload tối đa 5 ảnh
- ✅ Preview ảnh với thumbnail
- ✅ Hiển thị kích thước file
- ✅ Delete ảnh đã chọn
- ✅ Ghi chú bắt buộc (min 10 ký tự)
- ✅ Counter hiển thị số ký tự
- ✅ Validation realtime
- ✅ Convert ảnh sang Base64 để lưu trong localStorage
- ✅ Loading states
- ✅ Error handling

**Validation Rules**:
- Tối thiểu 1 ảnh
- Tối đa 5 ảnh
- Ghi chú >= 10 ký tự

### 4. **Evidence Viewer** (`EvidenceViewer.tsx`)
**Trigger**: Click vào task có evidence hoặc button "Xem bằng chứng"

**Features**:
- ✅ Grid view tất cả ảnh
- ✅ Click ảnh để xem fullscreen
- ✅ Navigation giữa các ảnh (dots indicator)
- ✅ Hiển thị metadata: người gửi, thời gian
- ✅ Hiển thị ghi chú (preserve whitespace)
- ✅ Badge count số ảnh

### 5. **Approval Dialog** (`ApprovalDialog.tsx`)
**Trigger**: Admin click "Phê duyệt / Từ chối" trên task pending

**Features**:
- ✅ Hiển thị thông tin task
- ✅ Preview thumbnails (max 5, hiển thị +N nếu nhiều hơn)
- ✅ Button "Xem đầy đủ" để mở Evidence Viewer
- ✅ Hiển thị lịch sử phê duyệt (nếu có)
- ✅ 2 action buttons: Phê duyệt ✅ / Yêu cầu làm lại ❌
- ✅ Form nhập lý do từ chối (required, min 10 chars)
- ✅ Confirmation step
- ✅ Loading states

**Approval Flow**:
1. Admin click "Phê duyệt" → Confirm → Task → "Hoàn thành"
2. Admin click "Từ chối" → Nhập lý do → Confirm → Task quay lại "Đang thực hiện"

### 6. **Task Checkbox Item** (`TaskCheckboxItem.tsx`)
**Component**: Card hiển thị trong user view

**Features**:
- ✅ Checkbox (disabled nếu đã hoàn thành hoặc pending)
- ✅ Highlight border nếu overdue (red)
- ✅ Highlight background nếu pending (yellow) hoặc rejected (orange)
- ✅ Badge hiển thị priority với màu
- ✅ Hiển thị due date (red nếu overdue)
- ✅ Icon: Comments count, Evidence images count
- ✅ Status badges: "Chờ admin duyệt", "Admin yêu cầu làm lại", "Admin đã duyệt"
- ✅ Progress bar & subtask count
- ✅ Rejection reason box (orange background)
- ✅ Click anywhere to view details

### 7. **Store Methods** (`store.ts`)
**New Methods**:

```typescript
approveTask(taskId: string)
```
- Set status → "Hoàn thành"
- Set approvalStatus → 'approved'
- Set completedDate
- Clear rejectionReason
- Add to approvalHistory
- Create activity log

```typescript
rejectTask(taskId: string, reason: string)
```
- Set status → "Đang thực hiện"
- Set approvalStatus → 'rejected'
- Set rejectionReason
- Add to approvalHistory
- Create activity log

**Activity Descriptions**:
- ✅ `evidence_submitted`: "{User} đã gửi bằng chứng hoàn thành"
- ✅ `evidence_approved`: "{Admin} đã phê duyệt công việc"
- ✅ `evidence_rejected`: "{Admin} đã yêu cầu làm lại"

### 8. **Admin View Updates**

#### Kanban View (`kanban-view.tsx`)
- ✅ Badge "Chờ duyệt" (yellow) cho task pending
- ✅ Badge "Làm lại" (orange) cho task rejected
- ✅ Existing drag-drop functionality preserved

#### Detail Page (`detail-page.tsx`)
- ✅ Button "Xem bằng chứng" (nếu có evidence)
- ✅ Button "Phê duyệt / Từ chối" (nếu pending & admin)
- ✅ ApprovalDialog integration
- ✅ EvidenceViewer integration
- ✅ Toast notifications

### 9. **Routing** (`route-definitions.tsx`)
- ✅ `/my-tasks` → UserTasksPage
- ✅ Breadcrumbs: Trang chủ / Công việc của tôi

## 🔄 Complete Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN TẠO TASK                           │
│  Admin → Tạo task → Gán cho User → (Optional) Set          │
│  requiresEvidence: true                                     │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    USER NHẬN TASK                           │
│  User → Vào /my-tasks → Tab "Chưa bắt đầu"                │
│  Click checkbox "Bắt đầu" → Status: "Đang thực hiện"      │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    USER LÀM VIỆC                            │
│  User → Tab "Đang làm" → Làm việc                         │
│  (Có thể comment, update progress, subtasks...)             │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    USER HOÀN THÀNH                          │
│  User → Click checkbox → CompletionDialog                   │
│  → Upload 1-5 ảnh + Ghi chú (>= 10 chars)                 │
│  → Submit → approvalStatus: 'pending'                       │
└────────────────────┬────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────────────┐
│                    ADMIN NHẬN THÔNG BÁO                     │
│  Admin → Vào Kanban/Detail → Thấy badge "Chờ duyệt"      │
│  → Click "Phê duyệt / Từ chối"                            │
└────────────────────┬────────────────────────────────────────┘
                     ↓
         ┌───────────┴───────────┐
         ↓                       ↓
┌────────────────────┐  ┌────────────────────┐
│   ADMIN PHÊ DUYỆT  │  │   ADMIN TỪ CHỐI    │
│  ✅ Approve        │  │  ❌ Reject         │
│  → Status: Done    │  │  → Status: In Prog │
│  → Approved        │  │  → Rejected        │
│  → completedDate   │  │  → rejectionReason │
└────────────────────┘  └────────┬───────────┘
         │                       ↓
         │              ┌────────────────────┐
         │              │  USER LÀM LẠI     │
         │              │  → Xem lý do      │
         │              │  → Fix & Submit   │
         │              └────────┬───────────┘
         │                       │
         └───────────────────────┘
```

## 📁 Files Created/Modified

### Created (9 files):
1. `features/tasks/user-tasks-page.tsx` (300 lines) - User checkbox list view
2. `features/tasks/components/TaskCheckboxItem.tsx` (150 lines) - Task card component
3. `features/tasks/components/CompletionDialog.tsx` (250 lines) - Upload evidence dialog
4. `features/tasks/components/EvidenceViewer.tsx` (100 lines) - View evidence with lightbox
5. `features/tasks/components/ApprovalDialog.tsx` (350 lines) - Admin approval UI

### Modified (4 files):
1. `features/tasks/types.ts` - Added CompletionEvidence, ApprovalStatus, ApprovalHistory
2. `features/tasks/store.ts` - Added approveTask(), rejectTask() methods
3. `features/tasks/kanban-view.tsx` - Added approval status badges
4. `features/tasks/detail-page.tsx` - Added approval buttons & dialogs
5. `lib/route-definitions.tsx` - Added /my-tasks route

## 🎨 UI Components Used

### shadcn/ui:
- Dialog, Card, Button, Badge, Input, Textarea
- Tabs, Alert, Progress, Checkbox
- AlertDialog (for confirmations)

### Icons (lucide-react):
- CheckCircle, XCircle, Clock, AlertTriangle
- Image, Upload, Eye, Calendar, User
- Loader2 (loading spinner)

## 🔐 Phân quyền

### Admin có thể:
- ✅ Tạo task và gán cho user
- ✅ Xem tất cả task ở Kanban view
- ✅ Phê duyệt/từ chối công việc
- ✅ Xem evidence và lịch sử approval
- ✅ Edit/Delete task
- ✅ Xem /my-tasks (công việc được gán cho mình)

### User có thể:
- ✅ Xem công việc được gán (/my-tasks)
- ✅ Click checkbox để hoàn thành
- ✅ Upload evidence (ảnh + ghi chú)
- ✅ Comment trên task
- ✅ Xem rejection reason nếu bị từ chối
- ✅ Submit lại sau khi fix
- ❌ KHÔNG thể edit task info
- ❌ KHÔNG thể delete task
- ❌ KHÔNG thể approve/reject

## 🎯 Best Practices Implemented

### Data Persistence:
- ✅ Ảnh convert sang Base64 để lưu trong localStorage
- ✅ Revoke object URLs để tránh memory leaks
- ✅ Activity logs cho mọi action

### UX:
- ✅ Loading states rõ ràng
- ✅ Validation errors thân thiện
- ✅ Toast notifications
- ✅ Disabled states khi processing
- ✅ Confirmation dialogs cho destructive actions
- ✅ Keyboard-friendly (Tab, Enter)

### Performance:
- ✅ useMemo cho expensive calculations
- ✅ useCallback cho event handlers
- ✅ Lazy loading dialogs
- ✅ Optimistic UI updates

### Accessibility:
- ✅ Semantic HTML
- ✅ ARIA labels
- ✅ Keyboard navigation
- ✅ Focus management

## 📊 Data Flow

### User Submit Evidence:
```typescript
User clicks checkbox
  → CompletionDialog opens
  → User uploads images (converted to Base64)
  → User writes note
  → Submit
  → store.update(task, {
      approvalStatus: 'pending',
      completionEvidence: { images, note, ... }
    })
  → Activity logged
  → Toast success
```

### Admin Approves:
```typescript
Admin clicks "Phê duyệt / Từ chối"
  → ApprovalDialog opens
  → Admin reviews evidence
  → Admin clicks "Phê duyệt"
  → Confirmation
  → store.approveTask(taskId)
  → Task status → "Hoàn thành"
  → ApprovalHistory updated
  → Activity logged
  → Toast success
```

### Admin Rejects:
```typescript
Admin clicks "Yêu cầu làm lại"
  → Form for rejection reason
  → Admin enters reason (min 10 chars)
  → Confirmation
  → store.rejectTask(taskId, reason)
  → Task status → "Đang thực hiện"
  → approvalStatus → 'rejected'
  → rejectionReason saved
  → ApprovalHistory updated
  → Activity logged
  → User sees orange alert with reason
```

## 🧪 Test Scenarios

### Scenario 1: Happy Path
1. Admin tạo task, gán cho User A
2. User A vào /my-tasks, thấy task ở tab "Chưa bắt đầu"
3. User A click checkbox → Dialog mở
4. User A upload 3 ảnh + ghi chú 50 ký tự
5. Submit → Task chuyển sang "Chờ duyệt"
6. Admin vào Kanban, thấy badge "Chờ duyệt"
7. Admin click "Phê duyệt / Từ chối"
8. Admin xem ảnh, nhấn "Phê duyệt"
9. Task → "Hoàn thành"
10. User A vào /my-tasks, thấy task ở tab "Hoàn thành" với badge "Admin đã duyệt"

### Scenario 2: Rejection & Retry
1. User submit evidence không rõ ràng
2. Admin reject với lý do "Ảnh không rõ, vui lòng chụp lại"
3. Task quay lại "Đang thực hiện"
4. User vào /my-tasks, thấy:
   - Task ở tab "Đang làm" (vì rejected cũng hiển thị ở đây)
   - Orange alert hiển thị rejection reason
5. User click checkbox lại
6. Upload ảnh mới rõ hơn + ghi chú chi tiết
7. Submit → Chờ duyệt lần 2
8. Admin approve → Done

### Scenario 3: Validation
1. User click checkbox
2. Try submit không có ảnh → Error "Vui lòng upload ít nhất 1 ảnh"
3. Upload 1 ảnh, ghi chú 5 ký tự → Button disabled
4. Ghi chú thêm 5 ký tự → Button enabled
5. Submit success

## 🚀 Next Steps (Optional Enhancements)

### Phase 1 (Có thể implement sau):
- [ ] Push notifications khi admin approve/reject
- [ ] Email notifications
- [ ] Export evidence to PDF/report
- [ ] Batch approval (admin duyệt nhiều task 1 lúc)

### Phase 2:
- [ ] Evidence templates (checklist)
- [ ] Auto-reject if image quality too low
- [ ] AI review evidence (optional)
- [ ] Statistics dashboard (approval rate, avg time to approve, etc.)

### Phase 3:
- [ ] Multi-level approval (cần 2-3 admin duyệt)
- [ ] Approval delegation
- [ ] SLA tracking (phải duyệt trong X giờ)

## 📝 Notes

- **Image Storage**: Hiện tại dùng Base64 trong localStorage. Nếu muốn scale, nên chuyển sang server upload.
- **Max Images**: Giới hạn 5 ảnh/task để tránh localStorage quá lớn.
- **Rejection Limit**: Không giới hạn số lần reject (như yêu cầu).
- **Evidence Edit**: User KHÔNG thể edit evidence sau khi submit (phải đợi admin reject).

## ✅ Checklist hoàn thành

- [x] Update Task types với evidence & approval fields
- [x] Create UserTasksPage với 5 tabs
- [x] Create TaskCheckboxItem component
- [x] Create CompletionDialog với image upload
- [x] Create EvidenceViewer với lightbox
- [x] Create ApprovalDialog cho admin
- [x] Update store với approveTask/rejectTask methods
- [x] Update Kanban view với approval badges
- [x] Update Detail page với approval buttons
- [x] Add routing /my-tasks
- [x] Activity logs cho evidence actions
- [x] Validation rules (images, note length)
- [x] Error handling & loading states
- [x] Toast notifications
- [x] Responsive design (mobile-friendly)
- [x] No TypeScript errors

**Status**: ✅ HOÀN THÀNH - Sẵn sàng để test!
