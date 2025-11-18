# Logic xử lý: Đơn hàng không đủ giá trị để bù trừ

## 📋 Tổng quan

Xử lý trường hợp khi khách hàng chọn đơn hàng để bù trừ phiếu bảo hành, nhưng giá trị đơn hàng không đủ để chi trả toàn bộ chi phí bảo hành. **Hệ thống cần tự động tạo phiếu thu/chi** để ghi nhận giao dịch tài chính.

---

## 🔍 Phân tích hệ thống hiện tại

### ✅ Những gì đã có:

1. **Settlement Types** (6 loại):
   ```typescript
   - 'cash'            // Trả tiền mặt ngay
   - 'transfer'        // Chuyển khoản
   - 'debt'            // Ghi công nợ
   - 'voucher'         // Tạo voucher
   - 'order_deduction' // Trừ vào tiền hàng
   - 'mixed'           // Kết hợp nhiều phương thức ✨
   ```

2. **SettlementMethod[]** cho mixed settlement:
   ```typescript
   {
     type, amount, status,
     paymentVoucherId,    // Link tới phiếu thu/chi
     linkedOrderId,       // Link tới đơn hàng
     debtTransactionId,   // Link tới công nợ
     voucherCode,         // Mã voucher
     ...
   }
   ```

3. **Warranty Settlement Dialog**:
   - Hiển thị danh sách sản phẩm hết hàng
   - Chọn phương thức bù trừ
   - Tính tổng tiền cần bù trừ

### ⚠️ Vấn đề cần giải quyết:

1. **Không tự động tạo phiếu thu/chi** khi chọn cash/transfer
2. **Không xử lý trường hợp đơn không đủ** (thiếu validation)
3. **Không link với module Cashbook** (phiếu thu/chi)
4. **Không có approval flow** cho số tiền lớn
5. **Mixed settlement chưa được implement** đầy đủ

---

## 💡 Đề xuất nâng cấp

### 1️⃣ **Tự động tạo Phiếu Thu/Chi (QUAN TRỌNG)**

#### A. Khi chọn "Trả tiền mặt" / "Chuyển khoản":

**Flow hiện tại:**
```
Chọn settlement → Lưu WarrantySettlement → Xong (❌ Thiếu phiếu chi)
```

**Flow đề xuất:**
```
Chọn settlement 
  ↓
Validate số tiền
  ↓
Tạo Phiếu Chi (PC) ✨
  - Loại: "Chi khác"
  - Lý do: "Hoàn tiền bảo hành {warrantyId}"
  - Số tiền: {amount}
  - Khách hàng: {customerName}
  - Trạng thái: "pending" (Chờ xuất tiền)
  - Link warranty: {warrantyId}
  ↓
Lưu WarrantySettlement (với paymentVoucherId)
  ↓
Thông báo: "Đã tạo phiếu chi PC00000123 - Chờ xuất tiền"
```

#### B. Module Cashbook cần có:

```typescript
// features/cashbook/types.ts
export interface PaymentVoucher {
  systemId: string;
  id: string;  // PC00000123
  type: 'receipt' | 'payment';
  category: 
    | 'warranty_refund'      // ✨ MỚI: Hoàn tiền bảo hành
    | 'purchase'
    | 'expense'
    | 'other';
  
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'e_wallet';
  
  // Link references
  linkedWarrantyId?: string;  // ✨ MỚI: Link tới phiếu BH
  linkedOrderId?: string;
  linkedSupplierId?: string;
  
  customer?: {
    name: string;
    phone: string;
  };
  
  status: 
    | 'pending'     // Chờ xuất tiền
    | 'approved'    // Đã duyệt (nếu cần)
    | 'completed'   // Đã xuất tiền
    | 'cancelled';
  
  approvedBy?: string;
  approvedAt?: string;
  
  reason: string;
  notes?: string;
  
  createdBy: string;
  createdAt: string;
  completedAt?: string;
}
```

---

### 2️⃣ **Xử lý trường hợp đơn không đủ tiền bù trừ**

### 2️⃣ **Xử lý trường hợp đơn không đủ tiền bù trừ**

#### Tình huống:
```
Tổng tiền bảo hành:  22.100.000đ
Giá trị đơn hàng:       650.000đ
Phí ship khách nợ:            0đ
─────────────────────────────────
Còn thiếu:          21.450.000đ ❌
```

#### Logic xử lý:

**Bước 1: Validation khi chọn đơn**
```typescript
function validateOrderBalance(warrantyTotal: number, orderValue: number): {
  isSufficient: boolean;
  shortage: number;
  recommendedAction: 'order_only' | 'mixed_settlement' | 'cash_only';
} {
  const shortage = Math.max(0, warrantyTotal - orderValue);
  
  if (shortage === 0) {
    return { 
      isSufficient: true, 
      shortage: 0,
      recommendedAction: 'order_only' 
    };
  }
  
  // Nếu đơn chiếm > 50% → Dùng mixed (bù trừ đơn + chi tiền mặt)
  if (orderValue / warrantyTotal > 0.5) {
    return {
      isSufficient: false,
      shortage,
      recommendedAction: 'mixed_settlement'
    };
  }
  
  // Nếu đơn < 50% → Không nên bù trừ đơn, chỉ chi tiền mặt
  return {
    isSufficient: false,
    shortage,
    recommendedAction: 'cash_only'
  };
}
```

**Bước 2: Hiển thị dialog cảnh báo**

```
┌───────────────────────────────────────────────┐
│  ⚠️ Đơn hàng không đủ giá trị để bù trừ       │
├───────────────────────────────────────────────┤
│                                               │
│  Tổng tiền bảo hành:       22.100.000đ       │
│  Giá trị đơn hàng:            650.000đ       │
│  ─────────────────────────────────────────    │
│  Còn thiếu:               21.450.000đ        │
│                                               │
│  💡 Gợi ý: Không nên bù trừ đơn này           │
│  (Đơn chỉ chiếm 2.9% tổng giá trị)           │
│                                               │
│  ❓ Bạn muốn xử lý như thế nào?               │
│                                               │
│  ⚪ Bù trừ đơn + Chi tiền mặt (21.450.000đ)   │
│     [Hình thức chi] [Tiền mặt ▼]             │
│     ☐ Cần phê duyệt (> 10.000.000đ)          │
│                                               │
│  ⚪ Chỉ chi tiền mặt (22.100.000đ)            │
│     Không bù trừ đơn hàng                     │
│     [Hình thức chi] [Chuyển khoản ▼]         │
│                                               │
│  ⚪ Tạm ghi nợ (xử lý sau)                    │
│     Khách sẽ mua hàng để bù trừ               │
│                                               │
│  Ghi chú:                                     │
│  ┌─────────────────────────────────────┐     │
│  │                                     │     │
│  └─────────────────────────────────────┘     │
│                                               │
├───────────────────────────────────────────────┤
│           [Hủy]  [Xác nhận]                  │
└───────────────────────────────────────────────┘
```

**Bước 3: Tạo Settlement phù hợp**

##### Option 1: Mixed Settlement (Bù trừ + Chi tiền)
```typescript
{
  settlementType: 'mixed',
  totalAmount: 22100000,
  settledAmount: 0,  // Chưa hoàn thành
  remainingAmount: 22100000,
  status: 'pending',
  
  methods: [
    {
      systemId: 'SM000001',
      type: 'order_deduction',
      amount: 650000,
      status: 'completed',  // Bù trừ đơn ngay
      linkedOrderId: 'DH240001',
      createdAt: '...'
    },
    {
      systemId: 'SM000002',
      type: 'cash',
      amount: 21450000,
      status: 'pending',  // Chờ xuất tiền
      paymentVoucherId: 'PC000123',  // ✨ Link tới phiếu chi
      notes: 'Hoàn tiền mặt phần còn thiếu',
      createdAt: '...'
    }
  ]
}
```

##### Option 2: Cash Only (Không bù trừ đơn)
```typescript
{
  settlementType: 'cash',
  totalAmount: 22100000,
  settledAmount: 0,
  remainingAmount: 22100000,
  status: 'pending',
  
  paymentVoucherId: 'PC000123',  // ✨ Link tới phiếu chi
  notes: 'Không bù trừ đơn - Chi tiền mặt toàn bộ'
}
```

##### Option 3: Debt (Ghi nợ)
```typescript
{
  settlementType: 'debt',
  totalAmount: 22100000,
  settledAmount: 0,
  remainingAmount: 22100000,
  status: 'pending',
  
  debtTransactionId: 'DT000456',  // Link tới công nợ
  notes: 'Khách sẽ mua hàng để bù trừ sau'
}
```

---

### 3️⃣ **Approval Flow (Phê duyệt cho số tiền lớn)**

#### Quy tắc:
```typescript
const APPROVAL_RULES = {
  warranty_refund: {
    threshold: 10_000_000,  // > 10M cần duyệt
    approvers: ['manager', 'accountant'],
    requireBoth: false  // Chỉ cần 1 trong 2
  },
  warranty_refund_urgent: {
    threshold: 50_000_000,  // > 50M cần 2 người duyệt
    approvers: ['manager', 'accountant'],
    requireBoth: true
  }
};
```

#### Flow với approval:
```
Tạo phiếu chi (amount > 10M)
  ↓
Status: "pending_approval" ⏸️
  ↓
Thông báo cho Manager/Kế toán
  ↓
─────┬─────────────────┬─────────
     │                 │
   Approve          Reject
     │                 │
     ↓                 ↓
 "pending"        "cancelled"
(Chờ xuất)       (Hủy bỏ)
     ↓
 Kế toán xuất tiền
     ↓
 "completed" ✅
```

#### Badge hiển thị:
```typescript
- 🟣 "Chờ duyệt" (pending_approval)
- 🟡 "Đã duyệt - Chờ xuất" (pending)
- 🟢 "Đã xuất tiền" (completed)
- 🔴 "Bị từ chối" (rejected)
```

---

### 4️⃣ **Tích hợp với Module Cashbook**

#### A. Link 2 chiều:

**Từ Warranty → Cashbook:**
```typescript
// warranty-detail-page.tsx
<Button onClick={() => navigate(`/cashbook/payment/${paymentVoucherId}`)}>
  Xem phiếu chi PC000123
</Button>
```

**Từ Cashbook → Warranty:**
```typescript
// cashbook/payment-detail-page.tsx
{voucher.linkedWarrantyId && (
  <div>
    <span>Phiếu bảo hành:</span>
    <Link to={`/warranty/${linkedWarrantyId}`}>
      {linkedWarrantyId}
    </Link>
  </div>
)}
```

#### B. Tự động tạo phiếu chi:

```typescript
// features/warranty/utils/create-payment-voucher.ts
export async function createWarrantyPaymentVoucher({
  warrantyId,
  amount,
  paymentMethod,
  customer,
  notes,
  requireApproval
}: {
  warrantyId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'e_wallet';
  customer: { name: string; phone: string };
  notes?: string;
  requireApproval: boolean;
}): Promise<PaymentVoucher> {
  
  const voucher: PaymentVoucher = {
    systemId: generateSystemId('payment-voucher'),
    id: generateBusinessId('payment'),
    type: 'payment',
    category: 'warranty_refund',
    
    amount,
    paymentMethod,
    
    linkedWarrantyId: warrantyId,
    customer,
    
    status: requireApproval ? 'pending_approval' : 'pending',
    
    reason: `Hoàn tiền bảo hành ${warrantyId}`,
    notes: notes || `Hoàn tiền cho khách ${customer.name}`,
    
    createdBy: getCurrentUser().systemId,
    createdAt: toISODateTime(new Date())
  };
  
  // Save to cashbook store
  await cashbookStore.addPaymentVoucher(voucher);
  
  // Send notification if approval required
  if (requireApproval) {
    await notificationService.notifyApprovers(voucher);
  }
  
  return voucher;
}
```

---

### 5️⃣ **Cải thiện UI/UX**

#### A. Trong danh sách Warranty:

```
┌────────────────────────────────────────────────────────┐
│ BH00000006  │  2025-11-08  │  Nguyễn Văn A            │
│             │              │  0987654321              │
├─────────────┴──────────────┴──────────────────────────┤
│ 🟡 Đã trả hàng - Chờ xuất tiền 21.450.000đ            │
│ 📄 PC000123 (Chờ duyệt)                               │
└────────────────────────────────────────────────────────┘
```

#### B. Trong chi tiết Warranty:

```
┌────────────────────────────────────────────────────────┐
│  💰 Thanh toán                                         │
├────────────────────────────────────────────────────────┤
│                                                        │
│  Phương thức: Bù trừ đơn + Chi tiền mặt               │
│                                                        │
│  1️⃣ Bù trừ đơn DH240001                               │
│     Số tiền: 650.000đ                                 │
│     Trạng thái: ✅ Đã bù trừ                          │
│                                                        │
│  2️⃣ Chi tiền mặt                                      │
│     Số tiền: 21.450.000đ                              │
│     Phiếu chi: PC000123 [Xem chi tiết →]             │
│     Trạng thái: 🟡 Chờ xuất tiền                      │
│                                                        │
│  ─────────────────────────────────────────────────    │
│  Tổng: 22.100.000đ                                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

#### C. Timeline/Activity Log:

```
📅 2025-11-08 10:30  ✅ Tạo phiếu bảo hành
📅 2025-11-08 11:00  ✅ Xử lý sản phẩm (10 SP)
📅 2025-11-08 14:00  ✅ Trả hàng cho khách
                      💰 Tạo settlement (mixed)
                      📄 Tạo phiếu chi PC000123
📅 2025-11-08 14:05  🟡 Chờ phê duyệt phiếu chi
📅 2025-11-08 15:00  ✅ Manager đã duyệt
📅 2025-11-08 16:00  ⏳ Chờ kế toán xuất tiền...
```

---

---

## 📊 Đánh giá hệ thống hiện tại

### ✅ Điểm mạnh:

1. **Kiến trúc tốt**:
   - Đã có `mixed` settlement type
   - Đã có `SettlementMethod[]` để track nhiều phương thức
   - Đã có các fields cần thiết (paymentVoucherId, linkedOrderId, etc.)

2. **UI/UX hiện tại ổn**:
   - Có dialog chọn phương thức bù trừ
   - Hiển thị danh sách sản phẩm hết hàng rõ ràng
   - Tính toán tổng tiền chính xác

3. **Type safety**:
   - TypeScript đầy đủ
   - Enums có labels tiếng Việt

### ⚠️ Điểm yếu cần cải thiện:

1. **NGHIÊM TRỌNG: Không tạo phiếu thu/chi tự động**
   - Chọn "cash" nhưng không tạo PC trong cashbook
   - Không có audit trail cho giao dịch tài chính
   - Kế toán không biết cần xuất tiền bao nhiêu

2. **Thiếu validation đơn không đủ tiền**
   - Cho phép chọn đơn bất kỳ mà không cảnh báo
   - Không gợi ý mixed settlement khi cần

3. **Không có approval flow**
   - Số tiền lớn (>10M) nên cần duyệt
   - Risk về gian lận

4. **Không link với Cashbook**
   - Không thể xem phiếu chi từ warranty
   - Không thể track từ cashbook về warranty

5. **Mixed settlement chưa hoàn thiện**
   - UI chưa support nhập nhiều phương thức
   - Logic tạo methods[] chưa có

---

## 🎯 Roadmap triển khai (theo độ ưu tiên)

### Phase 1: CẤP BÁCHCritical) - Tuần 1

**Mục tiêu**: Đảm bảo tài chính chính xác

1. ✅ **Tạo type PaymentVoucher trong Cashbook**
   - File: `features/cashbook/types.ts`
   - Thêm category: `warranty_refund`
   - Thêm field: `linkedWarrantyId`

2. ✅ **Tạo hàm tự động tạo phiếu chi**
   - File: `features/warranty/utils/create-payment-voucher.ts`
   - Integrate với cashbook store
   - Return paymentVoucherId

3. ✅ **Update WarrantySettlementDialog**
   - Khi chọn cash/transfer → Auto tạo PC
   - Lưu paymentVoucherId vào settlement
   - Hiển thị toast: "Đã tạo phiếu chi PC000123"

4. ✅ **Hiển thị link phiếu chi trong warranty detail**
   - Card "Thanh toán" hiển thị PC000123
   - Button "Xem phiếu chi" navigate to cashbook

**Estimate**: 2-3 ngày

---

### Phase 2: QUAN TRỌNG (High Priority) - Tuần 2

**Mục tiêu**: Xử lý đơn không đủ tiền

1. ✅ **Validation đơn hàng**
   - Function `validateOrderBalance()`
   - Tính shortage, recommend action

2. ✅ **Dialog cảnh báo đơn không đủ**
   - Component: `InsufficientBalanceDialog`
   - 3 options: Mixed / Cash only / Debt
   - Auto-calculate số tiền mỗi phần

3. ✅ **Implement mixed settlement**
   - Tạo 2 methods: order_deduction + cash
   - Tạo 2 giao dịch: Bù trừ đơn + Phiếu chi
   - Status tracking cho từng method

4. ✅ **UI hiển thị mixed settlement**
   - Card "Thanh toán" list 2 methods
   - Mỗi method có status riêng
   - Link đến đơn hàng và phiếu chi

**Estimate**: 3-4 ngày

---

### Phase 3: NÂNG CAO (Medium Priority) - Tuần 3

**Mục tiêu**: Approval và security

1. ✅ **Approval flow**
   - Rules: >10M cần 1 duyệt, >50M cần 2 duyệt
   - Status: pending_approval → approved → completed
   - Notification cho approvers

2. ✅ **Permission check**
   - Ai được tạo phiếu chi?
   - Ai được approve?
   - Ai được complete (xuất tiền)?

3. ✅ **Audit log**
   - Log mọi thay đổi settlement
   - Log approval/rejection
   - Log payment completion

**Estimate**: 3-4 ngày

---

### Phase 4: HOÀN THIỆN (Low Priority) - Tuần 4+

**Mục tiêu**: UX và báo cáo

1. ✅ **Timeline/Activity log**
   - Hiển thị lịch sử settlement
   - Icon + color coding
   - Link to related documents

2. ✅ **Reports**
   - Báo cáo warranty chưa thanh toán
   - Báo cáo phiếu chi pending
   - Thống kê theo phương thức thanh toán

3. ✅ **Notifications**
   - Thông báo cho kế toán khi có PC mới
   - Thông báo cho manager khi cần duyệt
   - SMS/Email cho khách khi có tiền hoàn

4. ✅ **Partial payment**
   - Cho phép trả nhiều lần
   - Track balance remaining
   - Auto-complete khi đủ

**Estimate**: 1-2 tuần

---

## 🚀 Bắt đầu triển khai ngay

### Bước 1: Update Types (5 phút)

```typescript
// features/cashbook/types.ts
export interface PaymentVoucher {
  // ... existing fields ...
  
  category: 
    | 'warranty_refund'  // ✨ NEW
    | 'purchase'
    | 'expense'
    | 'other';
  
  linkedWarrantyId?: string;  // ✨ NEW
  
  status:
    | 'pending_approval'  // ✨ NEW
    | 'pending'
    | 'approved'          // ✨ NEW
    | 'completed'
    | 'cancelled';
}
```

### Bước 2: Tạo utility function (30 phút)

```typescript
// features/warranty/utils/create-payment-voucher.ts
export async function createWarrantyPaymentVoucher(params) {
  // Implementation từ section 4️⃣ phía trên
}
```

### Bước 3: Update WarrantySettlementDialog (1 giờ)

```typescript
// features/warranty/components/warranty-settlement-dialog.tsx
const onFormSubmit = async (values) => {
  // Nếu chọn cash/transfer → Tạo phiếu chi
  if (values.settlementType === 'cash' || values.settlementType === 'transfer') {
    const voucher = await createWarrantyPaymentVoucher({
      warrantyId,
      amount: totalAmount,
      paymentMethod: values.settlementType === 'cash' ? 'cash' : 'bank_transfer',
      customer: { name: customerName, phone: '...' },
      requireApproval: totalAmount > 10_000_000
    });
    
    settlement.paymentVoucherId = voucher.systemId;
  }
  
  onSubmit(settlement);
};
```

---

## 📝 Checklist triển khai

### Phase 1 (Tuần này):
- [ ] Update PaymentVoucher type
- [ ] Tạo `create-payment-voucher.ts`
- [ ] Update WarrantySettlementDialog
- [ ] Thêm link "Xem phiếu chi" trong detail page
- [ ] Test end-to-end: Tạo warranty → Settlement → Check cashbook

### Phase 2 (Tuần sau):
- [ ] Tạo `validateOrderBalance()`
- [ ] Tạo `InsufficientBalanceDialog`
- [ ] Implement mixed settlement logic
- [ ] UI cho mixed settlement
- [ ] Test với các trường hợp đơn không đủ

### Phase 3 (2 tuần sau):
- [ ] Approval rules
- [ ] Permission checks
- [ ] Audit log
- [ ] Notifications

---

## 💬 Câu hỏi cần trả lời

1. **Ai có quyền tạo phiếu chi từ warranty?**
   - Tất cả nhân viên? Hay chỉ quản lý?
   - Suggestion: Nhân viên tạo được nhưng status = pending_approval

2. **Threshold approval là bao nhiêu?**
   - Suggestion: >10M cần manager duyệt, >50M cần cả manager + kế toán

3. **Cashbook store đã có chưa?**
   - Nếu chưa → Cần tạo store trước
   - Nếu có → Cần xem structure để integrate

4. **Có cần in phiếu chi không?**
   - Nếu có → Cần template in cho warranty refund

5. **Xử lý thế nào khi khách từ chối nhận tiền?**
   - Chuyển sang voucher?
   - Ghi nợ để mua hàng sau?

---

**Last updated**: 2025-11-08  
**Status**: ✅ Đã phân tích chi tiết - Sẵn sàng triển khai  
**Priority**: 🔥 CẤP BÁCH - Cần làm ngay Phase 1
