# Tóm tắt: Logic thanh toán Bảo hành

## 🔴 VẤN ĐỀ NGHIÊM TRỌNG

**Hệ thống hiện tại KHÔNG tạo phiếu thu/chi tự động!**

```
❌ Flow hiện tại:
Chọn "Trả tiền mặt" → Lưu Settlement → XONG
                                        ↑
                                   Thiếu phiếu chi!

✅ Flow đúng:
Chọn "Trả tiền mặt" → Tạo Phiếu Chi (PC) → Lưu Settlement → Link PC
                         ↓
                    Kế toán thấy PC
                    → Xuất tiền
                    → Complete
```

## ⚡ PHẢI LÀM NGAY (Phase 1 - Tuần này)

### 1. Tạo Phiếu Thu/Chi tự động

**A. Update type:**
```typescript
// cashbook/types.ts
category: 'warranty_refund'  // NEW
linkedWarrantyId?: string    // NEW
status: 'pending_approval' | 'pending' | 'completed'
```

**B. Tạo function:**
```typescript
// warranty/utils/create-payment-voucher.ts
createWarrantyPaymentVoucher({
  warrantyId,
  amount,
  paymentMethod,
  customer,
})
→ Return: PaymentVoucher với ID (PC000123)
```

**C. Update dialog:**
```typescript
// WarrantySettlementDialog
if (type === 'cash' || type === 'transfer') {
  voucher = await createPaymentVoucher(...);
  settlement.paymentVoucherId = voucher.systemId;
  toast("Đã tạo phiếu chi PC000123");
}
```

**D. Hiển thị link:**
```tsx
// warranty-detail-page
{settlement.paymentVoucherId && (
  <Button onClick={() => navigate(`/cashbook/${paymentVoucherId}`)}>
    Xem phiếu chi {paymentVoucherId}
  </Button>
)}
```

**Timeline**: 2-3 ngày

---

## 🟡 LÀM TIẾP (Phase 2 - Tuần sau)

### 2. Xử lý đơn không đủ tiền

**Tình huống:**
```
Tổng BH: 22.100.000đ
Đơn:        650.000đ
────────────────────
Thiếu:  21.450.000đ ❌
```

**Solution: Mixed Settlement**
```typescript
{
  settlementType: 'mixed',
  methods: [
    {
      type: 'order_deduction',
      amount: 650000,
      status: 'completed',
      linkedOrderId: 'DH240001'
    },
    {
      type: 'cash',
      amount: 21450000,
      status: 'pending',
      paymentVoucherId: 'PC000123'  // Auto-created
    }
  ]
}
```

**UI: InsufficientBalanceDialog**
```
⚠️ Đơn không đủ để bù trừ

Thiếu: 21.450.000đ

❓ Xử lý thế nào?
⚪ Bù trừ đơn + Chi tiền mặt  (Recommended)
⚪ Chỉ chi tiền mặt
⚪ Ghi nợ (trả sau)

[Hủy]  [Xác nhận]
```

**Timeline**: 3-4 ngày

---

## 🟢 LÀM SAU (Phase 3 - 2 tuần sau)

### 3. Scope cần xác định lại

- Kế hoạch approval flow với ngưỡng >10M/>50M đã bị loại bỏ.
- Phase 3 hiện chỉ là placeholder để bàn tiếp sau khi Phase 2 hoàn thiện.
- Gợi ý: ưu tiên đánh giá nhu cầu thực tế (ví dụ log bổ sung, cảnh báo, workflow thủ công) trước khi tái định nghĩa.

**Timeline**: TBD

---

## 📊 SO SÁNH PHƯƠNG THỨC

| Phương thức | Khi nào dùng? | Có tạo PC? | Approval? |
|-------------|---------------|------------|-----------|
| **cash** | Trả tiền mặt ngay | ✅ Có | Thủ công (nếu team yêu cầu) |
| **transfer** | Chuyển khoản | ✅ Có | Thủ công (nếu team yêu cầu) |
| **order_deduction** | Đơn đủ tiền | ❌ Không | ❌ Không |
| **mixed** | Đơn không đủ | ✅ Có (1 phần) | Thủ công (nếu team yêu cầu) |
| **debt** | Trả sau | ❌ Không | ❌ Không |
| **voucher** | Tạo voucher | ❌ Không | ❌ Không |

---

## ✅ CHECKLIST TRIỂN KHAI

### Tuần này (Phase 1):
- [ ] Update `cashbook/types.ts`
- [ ] Tạo `warranty/utils/create-payment-voucher.ts`
- [ ] Update `WarrantySettlementDialog` (tạo PC tự động)
- [ ] Update `warranty-detail-page` (hiển thị link PC)
- [ ] Test: Tạo warranty → Chọn cash → Check cashbook có PC

### Tuần sau (Phase 2):
- [ ] Tạo `validateOrderBalance()`
- [ ] Tạo `InsufficientBalanceDialog`
- [ ] Implement mixed settlement
- [ ] UI hiển thị mixed settlement
- [ ] Test các case đơn không đủ

### 2 tuần sau (Phase 3):
- [ ] (TBD) Đang chờ scope mới sau khi bỏ luồng duyệt tự động

---

## ❓ CÂU HỎI CẦN TRẢ LỜI

1. **Cashbook store đã có chưa?**
   - Nếu chưa → Tạo trước khi làm Phase 1
   - Nếu có → Xem structure để integrate

2. **Ai được tạo phiếu chi?**
   - Tất cả nhân viên?
   - Hay chỉ quản lý?
   - **Suggest**: Nhân viên tạo được nhưng cần duyệt

3. **Có cần approval tự động không?**
  - Tạm thời không áp dụng ngưỡng cố định; sẽ bàn lại nếu phát sinh nhu cầu.

4. **Có in phiếu chi không?**
   - Nếu có → Cần template

5. **Xử lý khi khách từ chối nhận tiền?**
   - Chuyển voucher?
   - Ghi nợ?

---

## 🎯 KẾT LUẬN

### Ưu tiên CAO NHẤT: Phase 1 (Tạo phiếu thu/chi tự động)

**Lý do:**
- ✅ Đảm bảo audit trail tài chính
- ✅ Kế toán biết phải xuất tiền
- ✅ Tránh mất tiền, gian lận
- ✅ Báo cáo tài chính chính xác

**Rủi ro nếu không làm:**
- ❌ Mất track giao dịch tiền mặt
- ❌ Kế toán không biết phải trả khách
- ❌ Không đối soát được
- ❌ Audit fail

### Roadmap tổng thể:
```
Week 1: Phase 1 (Tạo PC tự động) ← BẮT ĐẦU TỪ ĐÂY
Week 2: Phase 2 (Mixed settlement)
Week 3-4: Phase 3 (Approval flow)
Week 5+: Phase 4 (Reports, notifications)
```

---

**Prepared by**: AI Assistant  
**Date**: 2025-11-08  
**Status**: 🔥 CẤP BÁCH - Cần làm ngay  
**Next action**: Review với team → Start Phase 1
