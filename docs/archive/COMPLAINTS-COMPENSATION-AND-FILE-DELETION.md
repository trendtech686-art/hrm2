# Complaints Module - Compensation Tracking & Scheduled File Deletion

## 📋 Overview
This document describes the implementation of compensation tracking and scheduled file deletion features for the complaints module.

## ✅ Implemented Features

### 1. Compensation Amount & Reason Fields
**Location**: `features/complaints/verification-dialog.tsx`

When verifying a complaint as "correct" and selecting either "Chuyển khoản" (transfer) or "Bù đơn sau" (replacement later), the system now requires:

- **Số tiền bù trừ** (Compensation Amount): Currency input field
- **Lý do bù trừ** (Compensation Reason): Textarea field

**Validation**:
- Amount must be greater than 0
- Reason cannot be empty

**Data Storage**:
```typescript
{
  compensationAmount: number,
  compensationReason: string,
  resolutionNote: string, // Includes formatted amount and reason
}
```

**Timeline Entry**:
```
"Phương án: Chuyển khoản. Chi phí: 500,000 đ. Lý do: Sản phẩm bị lỗi"
```

### 2. Scheduled File Deletion (15-Day Grace Period)
**Location**: `features/complaints/detail-page.tsx`

When ending or canceling a complaint, the system now:

1. **Calculates deletion date** (current date + 15 days)
2. **Collects all media files**:
   - Customer images (`complaint.images` with type "initial")
   - Staff evidence images (`complaint.evidenceImages`)
3. **Stores deletion metadata**:
   ```typescript
   {
     scheduledDeletionAt: string, // ISO date string
     filesToDelete: string[], // Array of file URLs/paths
   }
   ```
4. **Shows toast notification** with deletion date:
   ```
   "Đã kết thúc khiếu nại. Các file sẽ bị xóa sau 15 ngày (31/12/2024)"
   ```

## 🔧 Technical Details

### Modified Files

#### 1. `features/complaints/verification-dialog.tsx`
**Changes**:
- Added `resolutionReason` state
- Updated `onSubmitCorrect` signature: `(method, cost, reason) => void`
- Added "Lý do bù trừ" textarea field
- Updated labels: "Chi phí phát sinh" → "Số tiền bù trừ"
- Updated placeholders with clear instructions
- Added validation for reason field

**Interface Update**:
```typescript
interface VerificationDialogProps {
  onSubmitCorrect: (method: "refund" | "replace", cost: number, reason: string) => void;
}
```

#### 2. `features/complaints/detail-page.tsx`
**Changes in `handleSubmitCorrectResolution`**:
- Added `reason` parameter
- Added validation for reason field
- Updated action note to include reason
- Stored `compensationAmount` and `compensationReason` in complaint record
- Updated `resolutionNote` to include both amount and reason

**Changes in `handleEndComplaint`**:
- Calculate deletion date (15 days from now)
- Collect all customer and staff images
- Store `scheduledDeletionAt` and `filesToDelete` fields
- Update toast message to show deletion date

**Changes in `handleCancelComplaint`**:
- Same deletion scheduling logic as `handleEndComplaint`
- Consistent user notification

## 📊 Data Structure Updates

### Complaint Type Extensions
```typescript
interface Complaint {
  // ... existing fields

  // Compensation tracking
  compensationAmount?: number;
  compensationReason?: string;

  // Scheduled deletion
  scheduledDeletionAt?: string; // ISO date string
  filesToDelete?: string[]; // File URLs/paths to delete
}
```

### ComplaintAction Metadata
```typescript
{
  metadata: {
    method: "refund" | "replace",
    cost: number,
    reason: string, // NEW
  }
}
```

## 🎯 User Experience

### Compensation Flow
1. User clicks "Xác nhận đúng" button
2. Dialog appears with resolution options
3. User selects "Chuyển khoản" or "Bù đơn sau"
4. User enters compensation amount (VND format)
5. User enters reason for compensation (required)
6. System validates both fields
7. On submit, data is saved to complaint record and timeline

### File Deletion Flow
1. User clicks "Kết thúc" or "Hủy khiếu nại"
2. System calculates deletion date (15 days later)
3. System collects all media files
4. System saves deletion schedule
5. Toast notification shows: "Đã kết thúc khiếu nại. Các file sẽ bị xóa sau 15 ngày (DD/MM/YYYY)"
6. **Backend job** (not implemented yet) will delete files on scheduled date

## 🚀 Next Steps (Backend Implementation Needed)

### 1. Database Schema Update
Add fields to complaints table:
```sql
ALTER TABLE complaints
ADD COLUMN compensationAmount DECIMAL(10,2),
ADD COLUMN compensationReason TEXT,
ADD COLUMN scheduledDeletionAt TIMESTAMP,
ADD COLUMN filesToDelete JSON;
```

### 2. Scheduled Deletion Job
Create a cron job/scheduled task to:
- Query complaints with `scheduledDeletionAt <= NOW()`
- Delete physical files from storage
- Remove file references from database
- Log deletion activity

**Recommended Implementation**:
```typescript
// Run daily at midnight
cron.schedule('0 0 * * *', async () => {
  const complaintsToClean = await db.complaints.findMany({
    where: {
      scheduledDeletionAt: { lte: new Date() },
      filesToDelete: { not: null }
    }
  });

  for (const complaint of complaintsToClean) {
    // Delete physical files
    for (const filePath of complaint.filesToDelete) {
      await deleteFile(filePath);
    }

    // Update database
    await db.complaints.update({
      where: { id: complaint.id },
      data: {
        images: [], // Clear customer images
        evidenceImages: [], // Clear evidence images
        filesToDelete: null,
        scheduledDeletionAt: null,
        filesDeletedAt: new Date()
      }
    });
  }
});
```

### 3. Optional: Deletion Cancellation
Add admin feature to cancel scheduled deletion:
```typescript
const cancelScheduledDeletion = (complaintId: string) => {
  updateComplaint(complaintId, {
    scheduledDeletionAt: null,
    filesToDelete: null
  });
  toast.success("Đã hủy lịch xóa file");
};
```

## 📝 Testing Checklist

### Compensation Tracking
- [ ] Open verification dialog for correct complaint
- [ ] Select "Chuyển khoản", enter amount and reason
- [ ] Verify validation (empty amount/reason)
- [ ] Submit and check timeline entry
- [ ] Repeat for "Bù đơn sau"
- [ ] Verify data saved in complaint record

### File Deletion Scheduling
- [ ] End a complaint with images
- [ ] Verify toast shows 15-day countdown
- [ ] Check database for `scheduledDeletionAt` field
- [ ] Verify `filesToDelete` contains correct file paths
- [ ] Cancel a complaint with images
- [ ] Same verification as above

## 🐛 Known Limitations

1. **Backend Implementation**: File deletion is scheduled but not executed (needs cron job)
2. **No Deletion UI Indicator**: Users can't see which files are scheduled for deletion
3. **No Cancellation Feature**: Once scheduled, deletion can't be canceled (consider adding)
4. **Hardcoded User ID**: Uses "USER_001" instead of actual logged-in user

## 📚 Related Documentation
- [Complaints Module Implementation](./COMPLAINTS-IMPLEMENTATION.md)
- [How to Add New Page](./how-to-add-new-page.md)
- [Generic Trash Page Guide](./generic-trash-page-guide.md)

---

**Last Updated**: 2024
**Implemented By**: AI Assistant
**Status**: ✅ Frontend Complete, ⚠️ Backend Pending
