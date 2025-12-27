# Activity History / Audit Log - Kiểm tra & TODO

> Ngày tạo: 2024-12-04
> Cập nhật: 2024-12-04
> Mục đích: Kiểm tra các module có ActivityHistory và đánh giá mức độ hoàn thiện ghi log actions

---

## 📊 Tổng quan

| Trạng thái | Ý nghĩa |
|------------|---------|
| ✅ | Đã có ActivityHistory UI + Store ghi log đầy đủ |
| ⚠️ | Có UI hiển thị nhưng Store chưa ghi log actions |
| ❌ | Chưa có ActivityHistory |

---

## 📋 Danh sách các Module

### 1. QUẢN LÝ NHÂN SỰ (HR)

| Module | ActivityHistory UI | Store ghi log | Trạng thái | Ghi chú |
|--------|-------------------|---------------|------------|---------|
| **Nhân viên (Employees)** | ✅ Có | ✅ Có | ✅ | [DONE 2024-12-04] Store ghi log add/update |
| **Nghỉ phép (Leaves)** | ✅ Có | ❌ Không | ⚠️ | `detail-page.tsx` có UI, store không ghi log |
| **Chấm công (Attendance)** | ❌ Không | ❌ Không | ❌ | Chưa có hệ thống history |
| **Bảng lương (Payroll)** | ❌ Không | ❌ Không | ❌ | Có `PayrollAuditLog` type nhưng chưa implement UI |

### 2. KINH DOANH & BÁN HÀNG (Sales & CRM)

| Module | ActivityHistory UI | Store ghi log | Trạng thái | Ghi chú |
|--------|-------------------|---------------|------------|---------|
| **Đơn hàng (Orders)** | ✅ Có | ✅ Có | ✅ | [DONE 2024-12-04] Store ghi log add/cancelOrder/addPayment/completeDelivery |
| **Khách hàng (Customers)** | ✅ Có | ✅ Có | ✅ | [DONE 2024-12-04] Store ghi log add/update |
| **Trả hàng bán (Sales Returns)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị `activityHistory`, store không ghi |
| **Khiếu nại (Complaints)** | ✅ Có | ✅ Có | ✅ | Dùng `timeline` thay vì `activityHistory`, store ghi đầy đủ các actions |
| **Vận đơn (Shipments)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị, store không ghi |
| **Đóng gói (Packaging)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị, store không ghi |

### 3. SẢN PHẨM & KHO (Products & Inventory)

| Module | ActivityHistory UI | Store ghi log | Trạng thái | Ghi chú |
|--------|-------------------|---------------|------------|---------|
| **Sản phẩm (Products)** | ✅ Có | ✅ Có | ✅ | [DONE 2024-12-04] Store ghi log add/update |
| **Kiểm kho (Inventory Checks)** | ✅ Có | ✅ Có | ✅ | Store ghi `activityHistory` khi approve/cancel |
| **Chuyển kho (Stock Transfers)** | ✅ Có | ❌ Không | ⚠️ | UI build history từ data, store không ghi |
| **Điều chỉnh giá vốn (Cost Adjustments)** | ✅ Có | ❌ Không | ⚠️ | UI build history từ data |
| **Nhập kho (Inventory Receipts)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị, store không ghi |

### 4. MUA HÀNG (Purchasing)

| Module | ActivityHistory UI | Store ghi log | Trạng thái | Ghi chú |
|--------|-------------------|---------------|------------|---------|
| **Đơn mua hàng (Purchase Orders)** | ✅ Có | ✅ Có | ✅ | Store ghi đầy đủ: update, receive, cancel |
| **Trả hàng NCC (Purchase Returns)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị, store không ghi |
| **Nhà cung cấp (Suppliers)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị, store không ghi |

### 5. TÀI CHÍNH (Finance)

| Module | ActivityHistory UI | Store ghi log | Trạng thái | Ghi chú |
|--------|-------------------|---------------|------------|---------|
| **Thanh toán (Payments)** | ✅ Có | ✅ Có | ✅ | Store ghi log khi update status |
| **Phiếu thu/chi (Receipts)** | ✅ Có | ✅ Có | ✅ | Store ghi log khi update status |
| **Sổ quỹ (Cashbook)** | ❌ Không | ❌ Không | ❌ | Chưa có history |

### 6. CÔNG VIỆC & DỰ ÁN (Tasks & Projects)

| Module | ActivityHistory UI | Store ghi log | Trạng thái | Ghi chú |
|--------|-------------------|---------------|------------|---------|
| **Công việc (Tasks)** | ✅ Có | ✅ Có | ✅ | Dùng `ActivityTimeline`, store ghi `activities` đầy đủ |
| **Bảo hành (Warranty)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị với hook `useWarrantyHistory`, store không ghi trực tiếp |

### 7. CÀI ĐẶT (Settings)

| Module | ActivityHistory UI | Store ghi log | Trạng thái | Ghi chú |
|--------|-------------------|---------------|------------|---------|
| **Hình phạt (Penalties)** | ✅ Có | ❌ Không | ⚠️ | UI hiển thị, store không ghi |

---

## 🔧 TODO - Cần bổ sung ghi log

### Ưu tiên cao (Core Business) - ĐÃ HOÀN THÀNH

- [x] **Orders** - Đã thêm ghi log vào store cho các actions:
  - `created` - Tạo đơn hàng
  - `cancelled` - Hủy đơn hàng
  - `payment_made` - Thanh toán
  - `status_changed` - Giao hàng thành công

- [x] **Customers** - Đã thêm ghi log vào store:
  - `created` - Tạo khách hàng
  - `updated` - Cập nhật thông tin
  - `status_changed` - Thay đổi trạng thái

- [x] **Employees** - Đã thêm ghi log vào store:
  - `created` - Tạo nhân viên
  - `updated` - Cập nhật thông tin

- [x] **Products** - Đã thêm ghi log vào store:
  - `created` - Tạo sản phẩm
  - `updated` - Cập nhật thông tin
  - `status_changed` - Thay đổi trạng thái

### Ưu tiên trung bình - CẦN LÀM
  - `assigned` - Thay đổi phòng ban/chi nhánh

- [ ] **Products** - Thêm ghi log vào store:
  - `created` - Tạo sản phẩm
  - `updated` - Cập nhật thông tin
  - `status_changed` - Thay đổi trạng thái

### Ưu tiên trung bình

- [ ] **Sales Returns** - Thêm ghi log cho các status changes
- [ ] **Purchase Returns** - Thêm ghi log cho các status changes
- [ ] **Stock Transfers** - Thêm ghi log cho approve/reject/cancel
- [ ] **Shipments** - Thêm ghi log cho status changes
- [ ] **Suppliers** - Thêm ghi log cho CRUD operations
- [ ] **Leaves** - Thêm ghi log cho approve/reject
- [ ] **Inventory Receipts** - Thêm ghi log cho status changes

### Ưu tiên thấp

- [ ] **Packaging** - Thêm ghi log
- [ ] **Warranty** - Thêm ghi log trực tiếp vào store
- [ ] **Cost Adjustments** - Thêm ghi log
- [ ] **Penalties** - Thêm ghi log

### Cần implement mới

- [ ] **Attendance** - Tạo ActivityHistory component và store logging
- [ ] **Payroll** - Implement UI cho PayrollAuditLog
- [ ] **Cashbook** - Tạo hệ thống history

---

## 📝 Mẫu code ghi Activity History

### 1. Thêm type vào entity

```typescript
// types.ts
import type { HistoryEntry } from '../../components/ActivityHistory.tsx';

export type YourEntity = {
  // ... existing fields
  activityHistory?: HistoryEntry[];
};
```

### 2. Ghi log trong store

```typescript
// store.ts
import type { HistoryEntry } from '../../components/ActivityHistory.tsx';
import { useAuthStore } from '../auth/store.ts';

// Helper function
function createHistoryEntry(
  action: HistoryEntry['action'],
  description: string,
  metadata?: HistoryEntry['metadata']
): HistoryEntry {
  const currentUser = useAuthStore.getState().user;
  return {
    id: `history-${Date.now()}`,
    action,
    timestamp: new Date(),
    user: {
      systemId: currentUser?.systemId || 'system',
      name: currentUser?.fullName || 'Hệ thống',
      avatar: currentUser?.avatarUrl,
    },
    description,
    metadata,
  };
}

// Usage in action
updateEntity: (systemId, updates) => {
  const entity = get().entities.find(e => e.systemId === systemId);
  if (!entity) return;
  
  const historyEntry = createHistoryEntry(
    'updated',
    'Cập nhật thông tin',
    { oldValue: entity.status, newValue: updates.status, field: 'status' }
  );
  
  set((state) => ({
    entities: state.entities.map(e => 
      e.systemId === systemId 
        ? { 
            ...e, 
            ...updates,
            activityHistory: [...(e.activityHistory || []), historyEntry]
          }
        : e
    ),
  }));
},
```

### 3. Hiển thị trong detail page

```tsx
// detail-page.tsx
import { ActivityHistory } from '../../components/ActivityHistory.tsx';

// In component
<ActivityHistory
  history={entity.activityHistory || []}
  title="Lịch sử thao tác"
  showFilters
  groupByDate
/>
```

---

## ✅ Modules đã hoàn thiện (Có thể tham khảo)

1. **Purchase Orders** (`features/purchase-orders/store.ts`) - Mẫu tốt nhất
2. **Payments** (`features/payments/store.ts`)
3. **Receipts** (`features/receipts/store.ts`)
4. **Inventory Checks** (`features/inventory-checks/store.ts`)
5. **Tasks** (`features/tasks/store.ts`) - Dùng `activities` thay vì `activityHistory`
6. **Complaints** (`features/complaints/store.ts`) - Dùng `timeline`

---

## 📊 Thống kê

- **Tổng modules có detail page**: ~25
- **Có ActivityHistory UI**: 20
- **Store ghi log đầy đủ**: 6 (24%)
- **Cần bổ sung**: 14 (56%)
- **Chưa có history**: 5 (20%)
