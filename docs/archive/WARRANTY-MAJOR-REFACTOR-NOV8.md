# Warranty Detail Page - Major Refactor (Nov 8, 2025)

## 🎯 Changes Implemented

### 1. ✅ Removed Get Link Button
**Before:** Had two Get Link buttons (one in PageHeader, one in actions)  
**After:** Removed both Get Link buttons

**Reason:** User feedback - không cần thiết, link tracking đã có trong Ticket Info card

---

### 2. ✅ Moved Status Badge to PageHeader
**Before:** Status badge displayed in page body below header  
**After:** Status badge integrated into PageHeader title

**Changes:**
```tsx
// PageHeader title now includes badge
<div className="flex items-center gap-2">
  <span>Phiếu bảo hành {ticket.id}</span>
  <Badge className={WARRANTY_STATUS_COLORS[ticket.status]}>
    {WARRANTY_STATUS_LABELS[ticket.status]}
  </Badge>
  <Button onClick={() => window.print()}>
    <Printer className="h-4 w-4 mr-2" />
    In
  </Button>
</div>
```

**Benefits:**
- ✅ Cleaner page layout
- ✅ Status always visible in header
- ✅ More professional appearance

---

### 3. ✅ Added Public Tracking Link Field
**Location:** Ticket Info card  
**Display:** Full URL with copy button

**Implementation:**
```tsx
{ticket.publicTrackingCode && (
  <div className="col-span-2">
    <p className="text-xs text-muted-foreground">Link theo dõi công khai</p>
    <div className="flex items-center gap-2">
      <a 
        href={`${window.location.origin}/warranty/tracking/${ticket.publicTrackingCode}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline truncate"
      >
        {`${window.location.origin}/warranty/tracking/${ticket.publicTrackingCode}`}
      </a>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0"
        onClick={() => {
          const trackingUrl = `${window.location.origin}/warranty/tracking/${ticket.publicTrackingCode}`;
          navigator.clipboard.writeText(trackingUrl);
          toast.success('Đã copy link tracking');
        }}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  </div>
)}
```

**Features:**
- ✅ Clickable link (opens in new tab)
- ✅ Copy button for quick sharing
- ✅ Only shows if publicTrackingCode exists
- ✅ Spans 2 columns for full URL visibility

---

### 4. ✅ All Status Buttons in PageHeader
**Before:** Some buttons in body, some in header  
**After:** ALL status change buttons in PageHeader actions

**Current Flow:**
- Print button: Always in PageHeader title (left side)
- Status buttons: Always in PageHeader actions (right side)
- Edit/Cancel: Always in PageHeader actions (right side)

---

### 5. ✅ Enhanced SLA Time Formatting
**Before:** `3d 5h` (abbreviated)  
**After:** `3d 5h 30m` (full detail)

**Changes in `warranty-sla-utils.ts`:**
```typescript
export function formatTimeLeft(minutes: number): string {
  const abs = Math.abs(minutes);
  const totalHours = Math.floor(abs / 60);
  const mins = Math.floor(abs % 60);
  
  if (abs < 60) {
    return `${mins} phút`;
  }
  if (totalHours < 24) {
    return mins > 0 ? `${totalHours}h ${mins}m` : `${totalHours}h`;
  }
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  
  // Always show format: Xd Xh Xm
  if (remainingHours > 0 && mins > 0) {
    return `${days}d ${remainingHours}h ${mins}m`;
  } else if (remainingHours > 0) {
    return `${days}d ${remainingHours}h`;
  } else if (mins > 0) {
    return `${days}d ${mins}m`;
  } else {
    return `${days}d`;
  }
}
```

**Examples:**
- `45 phút` (< 1 hour)
- `2h 30m` (< 1 day)
- `1d 4h 15m` (> 1 day with all components)
- `3d 5h` (> 1 day, no minutes)
- `2d` (exactly N days)

---

### 6. ✅ Comprehensive Action Button Logic Refactor

#### 6.1 Cancelled State Logic

**Before:**
- Cancelled tickets could still be edited
- Cancel button always visible
- Other actions not properly blocked

**After:**
```typescript
if (ticket?.cancelledAt) {
  // If cancelled, ONLY show "Mở lại" button
  actionButtons.push(
    <Button 
      key="reopen" 
      size="sm" 
      variant="outline"
      className="text-green-600 hover:text-green-700"
      onClick={() => {
        update(ticket.systemId, {
          cancelledAt: undefined,
          status: 'new', // Reset to new when reopening
        });
        toast.success('Đã mở lại phiếu bảo hành');
      }}
    >
      Mở lại
    </Button>
  );
}
```

**Blocked Actions When Cancelled:**
- ✅ Edit button hidden
- ✅ Cancel button hidden
- ✅ Status change buttons hidden
- ✅ Remind button hidden
- ✅ Templates button hidden
- ✅ Comments disabled (`disabled={isReturned || !!ticket.cancelledAt}`)

#### 6.2 Returned State Logic

**Before:** No way to reopen returned tickets

**After:**
```typescript
if (ticket?.status === 'returned') {
  // If returned, show "Mở lại" to go back to processed
  actionButtons.push(
    <Button 
      key="reopen-from-returned" 
      size="sm" 
      variant="outline"
      className="text-orange-600 hover:text-orange-700"
      onClick={() => {
        update(ticket.systemId, {
          status: 'processed',
          returnedAt: undefined,
        });
        toast.success('Đã mở lại phiếu từ trạng thái Đã trả');
      }}
    >
      Mở lại
    </Button>
  );
}
```

#### 6.3 Normal Status Flow

```typescript
// new → pending
if (ticket?.status === 'new') {
  <Button onClick={() => handleStatusChange('pending')}>
    Chuyển sang Chưa xử lý
  </Button>
}

// pending → processed  
if (ticket?.status === 'pending') {
  <Button onClick={() => handleStatusChange('processed')}>
    Đánh dấu Đã xử lý
  </Button>
}

// processed → returned (with order selection)
if (ticket?.status === 'processed') {
  <Button onClick={() => setShowReturnDialog(true)}>
    Đã trả hàng cho khách
  </Button>
}
```

#### 6.4 Edit Button Logic

**Before:**
```typescript
if (!isReturned) {
  // Show edit
}
```

**After:**
```typescript
if (!isReturned && !ticket?.cancelledAt) {
  // Show edit only if not returned AND not cancelled
}
```

#### 6.5 Cancel Button Logic

**Before:**
```typescript
// Always show cancel button
```

**After:**
```typescript
if (!ticket?.cancelledAt) {
  // Only show if not already cancelled
}
```

#### 6.6 Cancel Handler - No Navigation

**Before:**
```typescript
const handleCancel = React.useCallback(async () => {
  update(ticket.systemId, { cancelledAt: toISODateTime(getCurrentDate()) });
  setShowCancelDialog(false);
  toast.success('Đã hủy phiếu bảo hành');
  navigate('/warranty'); // ❌ Navigates away
}, [ticket, update, navigate]);
```

**After:**
```typescript
const handleCancel = React.useCallback(async () => {
  update(ticket.systemId, { cancelledAt: toISODateTime(getCurrentDate()) });
  setShowCancelDialog(false);
  toast.success('Đã hủy phiếu bảo hành');
  // ✅ Don't navigate away - stay on page to show cancelled state
}, [ticket, update]);
```

**Reason:** Stay on page so user can see cancelled state and use "Mở lại" button if needed

---

## 📊 Button Visibility Matrix

| Status | Cancelled? | Buttons Visible |
|--------|-----------|----------------|
| **new** | ❌ No | Print, Remind, Templates, Chuyển sang Chưa xử lý, Edit, Cancel |
| **new** | ✅ Yes | Print, Mở lại |
| **pending** | ❌ No | Print, Remind, Templates, Đánh dấu Đã xử lý, Edit, Cancel |
| **pending** | ✅ Yes | Print, Mở lại |
| **processed** | ❌ No | Print, Remind, Templates, Đã trả hàng cho khách, Edit, Cancel |
| **processed** | ✅ Yes | Print, Mở lại |
| **returned** | ❌ No | Print, Mở lại |
| **returned** | ✅ Yes | Print, Mở lại |

**Note:** 
- Remind only shows for non-returned, non-cancelled
- Templates only shows for non-cancelled
- Edit only shows for non-returned, non-cancelled
- Cancel only shows if not already cancelled
- Comments disabled when returned OR cancelled

---

## 🎨 UI/UX Improvements

### Status Badge Colors (Already Defined)
```typescript
export const WARRANTY_STATUS_COLORS: Record<WarrantyStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  processed: 'bg-green-100 text-green-800',
  returned: 'bg-gray-100 text-gray-800',
};
```

### Button Colors
- **Mở lại** (from cancelled): Green (`text-green-600`)
- **Mở lại** (from returned): Orange (`text-orange-600`)
- **Cancel**: Red (`text-destructive`)
- **Normal actions**: Default outline

### Timestamp Display
- **Cancelled timestamp**: Red color (`text-red-600`)
- Other timestamps: Default color
- All timestamps show in Ticket Info card

---

## 🔄 Status Flow Diagram

```
┌─────────────────────────────────────────────┐
│              NORMAL FLOW                     │
└─────────────────────────────────────────────┘
    new
     │
     ├──[Chuyển sang Chưa xử lý]──> pending
     │                                  │
     │                                  ├──[Đánh dấu Đã xử lý]──> processed
     │                                  │                              │
     │                                  │                              ├──[Đã trả hàng]──> returned
     │                                  │                              │                        │
     │                                  │                              │                        └──[Mở lại]──> processed
     │                                  │                              │
     └──[Hủy]──────────────────────────┴──────────────────────────────┴──> CANCELLED
                                                                              │
                                                                              └──[Mở lại]──> new

┌─────────────────────────────────────────────┐
│            REOPEN SCENARIOS                  │
└─────────────────────────────────────────────┘
• Cancelled → Mở lại → new (reset to beginning)
• Returned → Mở lại → processed (go back one step)
```

---

## 🐛 Bug Fixes

### 1. Comments Not Working When Returned
**Before:** `disabled={isReturned}`  
**After:** `disabled={isReturned || !!ticket.cancelledAt}`

**Fix:** Disable comments for both returned AND cancelled tickets

### 2. Navigation After Cancel
**Before:** Navigates to `/warranty` list page  
**After:** Stays on detail page

**Reason:** Allow user to see cancelled state and reopen if needed

### 3. Action Buttons Not Respecting Cancelled State
**Before:** Could still edit/change status after cancelling  
**After:** All actions blocked except "Mở lại"

---

## 📝 Files Modified

### 1. `features/warranty/warranty-detail-page.tsx`
**Changes:**
- Removed Get Link button from actions
- Moved status badge to PageHeader title
- Added public tracking link field to Ticket Info card
- Refactored action button logic with cancelled state handling
- Added "Mở lại" buttons for cancelled and returned states
- Updated handleCancel to stay on page
- Disabled comments when cancelled
- Updated dependencies in useMemo

**Lines Changed:** ~150 lines

### 2. `features/warranty/warranty-sla-utils.ts`
**Changes:**
- Enhanced `formatTimeLeft()` to show full day/hour/minute breakdown

**Lines Changed:** ~20 lines

---

## ✅ Testing Checklist

### Normal Flow
- [ ] Create new ticket → Status shows "Mới" badge in PageHeader
- [ ] Click "Chuyển sang Chưa xử lý" → Status changes to "Chưa xử lý"
- [ ] Click "Đánh dấu Đã xử lý" → Status changes to "Đã xử lý"
- [ ] Click "Đã trả hàng cho khách" → Dialog opens, select order, confirm
- [ ] Status changes to "Đã trả" → Badge shows in PageHeader

### Cancelled State
- [ ] Click "Hủy" button → Dialog opens
- [ ] Confirm cancel → Stays on page (doesn't navigate away)
- [ ] Toast shows "Đã hủy phiếu bảo hành"
- [ ] cancelledAt timestamp appears in Ticket Info (red text)
- [ ] Only "Print" and "Mở lại" buttons visible
- [ ] Edit button hidden
- [ ] Cancel button hidden
- [ ] Status change buttons hidden
- [ ] Remind button hidden
- [ ] Templates button hidden
- [ ] Comments section disabled (grey out, can't add comments)

### Reopen from Cancelled
- [ ] Click "Mở lại" (green button)
- [ ] Status changes to "Mới"
- [ ] cancelledAt cleared (disappears from Ticket Info)
- [ ] All normal buttons reappear
- [ ] Comments section enabled again

### Reopen from Returned
- [ ] Ticket in "Đã trả" status
- [ ] Click "Mở lại" (orange button)
- [ ] Status changes to "Đã xử lý"
- [ ] returnedAt cleared
- [ ] Can continue normal flow

### Public Tracking Link
- [ ] Link appears in Ticket Info card (if publicTrackingCode exists)
- [ ] Click link → Opens in new tab at `/warranty/tracking/{code}`
- [ ] Click copy button → Toast shows "Đã copy link tracking"
- [ ] Paste → Full URL copied correctly

### SLA Time Display
- [ ] SLA metrics show in PageHeader
- [ ] Format shows "Xd Xh Xm" (e.g., "2d 5h 30m")
- [ ] Updates when status changes
- [ ] Colors change based on urgency (green/yellow/red)

---

## 🎯 User Requirements Met

1. ✅ **Bỏ nút Get Link** - Removed both Get Link buttons
2. ✅ **Chuyển trạng thái phiếu bảo hành lên PageHeader** - Badge now in PageHeader title
3. ✅ **Thêm Link theo dõi công khai** - Added to Ticket Info card with copy button
4. ✅ **Các trạng thái lên PageHeader** - All status buttons in PageHeader actions
5. ✅ **SLA ghi rõ ngày giờ phút** - Format updated to show "Xd Xh Xm"
6. ✅ **Xem lại logic Chỉnh Sửa/Hủy** - Complete refactor:
   - Added "Kết thúc" logic (return with order)
   - Added "Mở lại" buttons (from cancelled and returned)
   - Fixed cancelled state blocking all actions
   - Stay on page after cancel
7. ✅ **Kiểm tra navigation** - No navigation after cancel, stays on page

---

## 🚀 Next Steps (Optional Enhancements)

### 1. Add Cancelled Status Type
Currently using `cancelledAt` flag. Consider adding to WarrantyStatus enum:
```typescript
export type WarrantyStatus = 
  | 'new'
  | 'pending'
  | 'processed'
  | 'returned'
  | 'cancelled'; // NEW
```

**Benefits:**
- Cleaner data model
- Easier filtering/reporting
- Consistent with other status types

### 2. Add Confirmation for Reopen
Currently reopens immediately. Consider adding confirmation dialog:
```tsx
<AlertDialog>
  <AlertDialogTitle>Xác nhận mở lại phiếu?</AlertDialogTitle>
  <AlertDialogDescription>
    Phiếu sẽ được đặt lại về trạng thái ban đầu. Bạn có chắc chắn?
  </AlertDialogDescription>
</AlertDialog>
```

### 3. Add History Entry for Reopen
Track when tickets are reopened:
```typescript
addHistory(
  ticket.systemId,
  'Mở lại phiếu',
  currentUser.name,
  `Từ ${previousStatus} về ${newStatus}`
);
```

### 4. Add Bulk Actions
Allow cancelling/reopening multiple tickets from list page

### 5. Add Cancelled Reason Field
```typescript
interface WarrantyTicket {
  // ...
  cancelledReason?: string; // Why was it cancelled?
  cancelledBy?: string;      // Who cancelled it?
}
```

---

**Date:** November 8, 2025  
**Status:** ✅ COMPLETE  
**Developer:** GitHub Copilot  
**Files Modified:** 2 files  
**Lines Changed:** ~170 lines  
**Impact:** Major UX improvement + Bug fixes
