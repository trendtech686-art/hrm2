# Customer SLA Review & Recommendations

> **Ngày review:** 26/11/2025  
> **Reviewer:** GitHub Copilot  
> **Module:** features/customers

---

## 1. Tổng quan hiện trạng

### 1.1. Các tính năng SLA đã có trong hệ thống

| Component | Mục đích | File |
|-----------|----------|------|
| `SlaTimer` | Generic countdown timer | `components/SlaTimer.tsx` |
| `WARRANTY_SLA_CONFIGS` | SLA configs cho bảo hành | `components/SlaTimer.tsx` |
| `ORDER_SLA_CONFIGS` | SLA configs cho đơn hàng | `components/SlaTimer.tsx` |
| `COMPLAINT_SLA_CONFIGS` | SLA configs cho khiếu nại | `components/SlaTimer.tsx` |
| `SUPPORT_SLA_CONFIGS` | SLA configs cho hỗ trợ | `components/SlaTimer.tsx` |

### 1.2. Các tính năng tracking đã có cho Customer

| Tính năng | Mô tả | File |
|-----------|-------|------|
| **Debt Tracking** | Theo dõi công nợ, quá hạn | `debt-tracking-utils.ts` |
| **Credit Alert** | Cảnh báo vượt hạn mức tín dụng | `credit-utils.ts` |
| **RFM Analysis** | Phân tích Recency/Frequency/Monetary | `intelligence-utils.ts` |
| **Health Score** | Điểm sức khỏe khách hàng (0-100) | `intelligence-utils.ts` |
| **Churn Risk** | Dự đoán nguy cơ mất khách | `intelligence-utils.ts` |
| **Lifecycle Stage** | Giai đoạn vòng đời khách hàng | `lifecycle-utils.ts` |

---

## 2. Đánh giá: Cần SLA gì cho Customer?

### 2.1. ❌ Không cần SLA Timer truyền thống

Customer **KHÔNG phải** là ticket/task có thời hạn xử lý cố định như:
- Warranty (2h phản hồi, 24h xử lý)
- Complaint (1h phản hồi, 24h giải quyết)
- Order (2h đóng gói, 24h giao hàng)

Customer là **đối tượng quan hệ dài hạn**, cần các chỉ số tracking khác.

### 2.2. ✅ Các loại "SLA" phù hợp cho Customer

| Loại SLA | Mục đích | Trạng thái |
|----------|----------|------------|
| **Debt Payment SLA** | Theo dõi công nợ quá hạn | ✅ Đã có (`DebtStatus`) |
| **Follow-up SLA** | Nhắc liên hệ khách hàng định kỳ | ⚠️ Chưa có |
| **Re-engagement SLA** | Nhắc kích hoạt khách không hoạt động | ⚠️ Chưa có |
| **Contract Renewal SLA** | Nhắc gia hạn hợp đồng | ⚠️ Chưa có |
| **Response Time SLA** | Thời gian phản hồi yêu cầu KH | ⚠️ Chưa có |

---

## 3. Đề xuất triển khai

### 3.1. Customer Activity SLA (Recommended)

**Mục đích:** Nhắc nhở nhân viên liên hệ khách hàng khi:
- Khách không mua hàng quá X ngày
- Khách có công nợ sắp đến hạn
- Hợp đồng sắp hết hạn

**Đề xuất fields trong Customer type:**
```typescript
// Thêm vào Customer type
lastContactDate?: string;           // Ngày liên hệ cuối
nextFollowUpDate?: string;          // Ngày cần liên hệ tiếp
followUpReason?: string;            // Lý do cần follow-up
followUpAssignee?: SystemId;        // NV được giao follow-up
```

**Đề xuất SLA Configs:**
```typescript
export const CUSTOMER_SLA_CONFIGS = {
  // Nhắc liên hệ khách không hoạt động
  inactive_followup: {
    targetDays: 30,  // Sau 30 ngày không mua hàng
    thresholds: { warning: 7, critical: 3 }, // 7 ngày và 3 ngày trước deadline
  },
  // Nhắc debt collection
  debt_reminder: {
    targetDays: 3,   // 3 ngày trước hạn thanh toán
    thresholds: { warning: 3, critical: 1 },
  },
  // Nhắc gia hạn hợp đồng
  contract_renewal: {
    targetDays: 30,  // 30 ngày trước khi hết hạn HĐ
    thresholds: { warning: 14, critical: 7 },
  },
} as const;
```

### 3.2. Customer Follow-up Widget (Dashboard)

**Hiển thị:**
- Khách cần liên hệ hôm nay
- Khách quá hạn liên hệ (màu đỏ)
- Khách sắp hết hạn hợp đồng
- Khách có công nợ sắp đến hạn

### 3.3. Customer Task/Reminder System

**Tự động tạo task khi:**
- Khách không mua > 60 ngày → Task "Re-engagement"
- Công nợ sắp đến hạn → Task "Debt reminder"
- Hợp đồng còn 30 ngày → Task "Contract renewal"
- Health Score giảm mạnh → Task "Relationship check"

---

## 4. So sánh với hệ thống hiện tại

| Tính năng | Hiện tại | Đề xuất |
|-----------|----------|---------|
| Debt tracking | ✅ Có đầy đủ | Giữ nguyên |
| Debt SLA | ⚠️ Chỉ có trạng thái | + Thêm SLA reminder |
| Activity tracking | ✅ lastPurchaseDate | + lastContactDate |
| Follow-up | ❌ Không có | + nextFollowUpDate |
| Contract SLA | ❌ Không có | + contract renewal reminder |
| Dashboard widget | ✅ DebtOverviewWidget | + CustomerFollowUpWidget |
| Auto-task | ❌ Không có | + Auto-generate tasks |

---

## 5. Kết luận & Ưu tiên

### 5.1. Đã tốt - Không cần thay đổi
- ✅ Debt tracking system hoàn chỉnh
- ✅ Credit alert system
- ✅ RFM analysis & Health Score
- ✅ Churn Risk prediction
- ✅ Lifecycle stage tracking

### 5.2. Nên bổ sung (Ưu tiên cao)

| # | Tính năng | Lý do | Effort |
|---|-----------|-------|--------|
| 1 | `lastContactDate` + `nextFollowUpDate` | Theo dõi hoạt động chăm sóc KH | Low |
| 2 | Customer Follow-up Widget | Dashboard nhắc việc | Medium |
| 3 | Auto-task for re-engagement | Tự động nhắc KH không hoạt động | Medium |

### 5.3. Cân nhắc bổ sung (Ưu tiên trung bình)

| # | Tính năng | Lý do | Effort |
|---|-----------|-------|--------|
| 4 | Contract renewal SLA | Nhắc gia hạn HĐ | Low |
| 5 | Response time tracking | Đo lường thời gian phản hồi | Medium |
| 6 | Customer activity log | Lịch sử tương tác chi tiết | High |

### 5.4. Không cần thiết
- ❌ SlaTimer cho Customer (không phù hợp với bản chất quan hệ khách hàng)
- ❌ Resolution time (Customer không phải ticket)

---

## 6. Implementation Roadmap

### Phase 1: Basic Follow-up (1-2 ngày)
1. Thêm fields `lastContactDate`, `nextFollowUpDate` vào Customer type
2. Thêm UI nhập/hiển thị trong form và detail page
3. Thêm cột "Ngày liên hệ cuối" trong danh sách

### Phase 2: Dashboard Widget (2-3 ngày)
1. Tạo `CustomerFollowUpWidget` tương tự `DebtOverviewWidget`
2. Hiển thị: Khách cần liên hệ, quá hạn, sắp hết HĐ
3. Quick actions: Gọi điện, gửi email, tạo task

### Phase 3: Auto Tasks (3-5 ngày)
1. Tạo cron job kiểm tra khách hàng hàng ngày
2. Auto-generate tasks khi đủ điều kiện
3. Notification cho nhân viên phụ trách

---

## 7. Tóm tắt

**Customer SLA** khác với **Ticket SLA**:
- Ticket SLA: Countdown timer, deadline cứng, xử lý trong X giờ
- Customer SLA: Reminder-based, follow-up định kỳ, relationship tracking

**Hệ thống hiện tại đã tốt** với:
- Debt tracking & credit alert
- RFM analysis & health score
- Lifecycle stage management

**Nên bổ sung:**
- Follow-up tracking (lastContactDate, nextFollowUpDate)
- Dashboard widget nhắc việc
- Auto-task generation cho re-engagement

---

*Document generated by GitHub Copilot - 26/11/2025*
