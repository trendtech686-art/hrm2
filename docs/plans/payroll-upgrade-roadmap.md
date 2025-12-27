# 📋 PAYROLL UPGRADE ROADMAP

> Ngày tạo: 09/12/2025  
> Trạng thái: 📝 Planning  
> Mục tiêu: Nâng cấp chức năng bảng lương với khả năng chỉnh sửa, tích hợp in ấn, và liên kết với các module khác

---

## 🎯 TÓM TẮT YÊU CẦU

| # | Yêu cầu | Đánh giá | Độ phức tạp |
|---|---------|----------|-------------|
| 1 | Cho phép sửa bảng lương sau khi chạy | ✅ Hợp lý | 🟡 Medium |
| 2 | Tích hợp nút in vào bảng lương | ✅ Hợp lý (đã có sẵn cơ sở) | 🟢 Low |
| 3 | Tích hợp vào chi tiết nhân viên | ✅ Hợp lý (đã có cơ bản) | 🟢 Low |
| 4 | Tích hợp vào phiếu chi/thu | ✅ Hợp lý | 🟡 Medium |

---

## 📊 PHÂN TÍCH CHI TIẾT

### 1. ✏️ Cho phép sửa bảng lương (DRAFT/REVIEWED)

**Hiện trạng:**
- Bảng lương có 3 trạng thái: `draft` → `reviewed` → `locked`
- Chỉ khi `locked` mới không cho sửa
- **NHƯNG**: Hiện tại không có UI để sửa từng payslip

**Đề xuất giải pháp:**

```
┌─────────────────────────────────────────────────────────────┐
│  PAYROLL EDITING FLOW                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  DRAFT ──────────────────────────────────────────► REVIEWED │
│    │                                                    │   │
│    │ ✅ Có thể sửa:                                    │   │
│    │   - Sửa từng payslip (earnings, deductions)      │   │
│    │   - Thêm/xóa nhân viên khỏi batch                │   │
│    │   - Thay đổi penalty deductions                   │   │
│    │                                                    │   │
│    │ ✅ Có thể sửa:                                    │   │
│    │   - Sửa từng payslip                              │   │
│    │   - Chưa khóa → vẫn edit được                    │   │
│    │                                                    │   │
│    └──────────────────────────────────────────────────┘    │
│                                                             │
│  LOCKED ────────────────────────────────────────────────────│
│    │                                                        │
│    │ ❌ Không cho sửa                                      │
│    │ ✅ Chỉ xem, in, xuất                                  │
│    │                                                        │
└─────────────────────────────────────────────────────────────┘
```

**Cần tạo:**
1. `PayslipEditDialog` - Dialog sửa từng phiếu lương
2. Nút "Sửa" trong bảng payslip (chỉ hiện khi status ≠ locked)
3. Function `updatePayslip` trong `payroll-batch-store.ts`
4. Tính năng "Tính lại" (recalculate) cho payslip đã sửa

**Quy tắc nghiệp vụ:**
- ✅ `draft`: Sửa thoải mái
- ✅ `reviewed`: Vẫn sửa được (nhưng có warning)
- ❌ `locked`: Không cho sửa, cần tạo batch mới

---

### 2. 🖨️ Tích hợp nút in vào bảng lương

**Hiện trạng:**
- Đã có `usePrint` hook và `payroll-print-helper.ts`
- Đã có nút Print trong `detail-page.tsx` (line 3: `Printer` icon imported)
- Cần kiểm tra xem đã hoạt động chưa

**Cần làm:**
1. ✅ Verify print helper đang hoạt động
2. Thêm in từng phiếu lương (payslip) riêng lẻ
3. Thêm in danh sách payslip theo department
4. Template in đẹp hơn với header công ty

**Print options:**
```typescript
type PayrollPrintOption = 
  | 'batch-summary'      // Tổng hợp batch
  | 'all-payslips'       // Tất cả phiếu lương
  | 'single-payslip'     // 1 phiếu lương
  | 'department-summary' // Tổng hợp theo phòng ban
```

---

### 3. 👤 Tích hợp vào chi tiết nhân viên

**Hiện trạng (đã có):**
```tsx
// features/employees/detail-page.tsx - Line 273
const { batches: payrollBatches, payslips: payrollPayslips } = usePayrollBatchStore();
const payrollHistory = React.useMemo(() => {
    // Đã filter payslips theo employee
    // Đã join với batch
    // Đã sort by date
}, [employee, payrollPayslips, payrollBatches]);
```

**Cần nâng cấp:**
1. Thêm tab "Bảng lương" riêng trong employee detail
2. Hiển thị lịch sử đầy đủ với filtering/sorting
3. Thêm nút xem chi tiết payslip từng kỳ
4. Thêm tổng hợp thu nhập theo năm (YTD summary)
5. **Thêm nút in phiếu lương từ employee detail**

**UI đề xuất:**
```
┌─────────────────────────────────────────────────────────────┐
│ Tab: Bảng lương                                             │
├─────────────────────────────────────────────────────────────┤
│ 📊 Tổng hợp năm 2025                                        │
│ ┌─────────┬─────────┬─────────┬─────────┐                  │
│ │ Tổng TN │ Khấu trừ│ Thực lĩnh│ Số kỳ   │                  │
│ │ 84.0M   │ 8.4M    │ 75.6M   │ 12      │                  │
│ └─────────┴─────────┴─────────┴─────────┘                  │
│                                                             │
│ 📋 Lịch sử bảng lương                                       │
│ ┌────────┬──────────┬──────────┬────────┬────────┐         │
│ │ Kỳ     │ Thu nhập │ Thực lĩnh│ Trạng  │ Actions│         │
│ ├────────┼──────────┼──────────┼────────┼────────┤         │
│ │ 11/2025│ 7.0M     │ 6.3M     │ Locked │ 🔍 🖨️  │         │
│ │ 10/2025│ 7.0M     │ 6.3M     │ Locked │ 🔍 🖨️  │         │
│ └────────┴──────────┴──────────┴────────┴────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

### 4. 💰 Tích hợp vào phiếu chi/thu

**Hiện trạng:**
- Payment đã có `category: 'salary'` (Chi lương)
- Payment có thể link đến employee qua `recipientSystemId`
- **CHƯA CÓ**: Link trực tiếp đến PayrollBatch/Payslip

**Đề xuất giải pháp:**

#### A. Thêm fields vào Payment type:
```typescript
// features/payments/types.ts - Thêm
export type Payment = {
  // ... existing fields
  
  // NEW: Link to Payroll
  linkedPayrollBatchSystemId?: SystemId;    // Link to PayrollBatch
  linkedPayslipSystemId?: SystemId;         // Link to Payslip (nếu chi từng người)
};
```

#### B. Tạo phiếu chi từ bảng lương:
```
┌─────────────────────────────────────────────────────────────┐
│  PAYROLL → PAYMENT FLOW                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PayrollBatch (status: locked)                              │
│        │                                                    │
│        ▼                                                    │
│  ┌──────────────────────────────────────┐                  │
│  │ Nút "Tạo phiếu chi lương"            │                  │
│  │ - 1 phiếu chi / batch (tổng)         │ ◄── Option 1     │
│  │ - N phiếu chi / từng nhân viên       │ ◄── Option 2     │
│  └──────────────────────────────────────┘                  │
│        │                                                    │
│        ▼                                                    │
│  Payment(s) created with:                                   │
│  - category: 'salary'                                       │
│  - recipientTypeSystemId: NHANVIEN                         │
│  - linkedPayrollBatchSystemId: batch.systemId              │
│  - linkedPayslipSystemId: payslip.systemId (if per-person) │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### C. Hiển thị trong Payroll Detail:
- Badge "Đã tạo phiếu chi" nếu có payment linked
- Link đến phiếu chi liên quan
- Tổng tiền đã chi vs tổng lương batch

---

## ✅ TODO LIST

### Phase 1: Sửa bảng lương (Priority: HIGH)
- [ ] **1.1** Tạo `PayslipEditDialog` component
  - [ ] Form sửa earnings (các component)
  - [ ] Form sửa deductions
  - [ ] Preview thay đổi trước khi save
- [ ] **1.2** Thêm function `updatePayslip` trong `payroll-batch-store.ts`
  - [ ] Validate status !== 'locked'
  - [ ] Update payslip data
  - [ ] Recalculate batch totals
  - [ ] Log audit action
- [ ] **1.3** Thêm function `recalculatePayslip` 
  - [ ] Call payrollEngine.calculateSingle()
  - [ ] Update payslip với result mới
- [ ] **1.4** UI: Thêm nút "Sửa" và "Tính lại" trong PayslipTable
- [ ] **1.5** UI: Warning khi sửa batch đang ở trạng thái 'reviewed'

### Phase 2: Nút in bảng lương (Priority: MEDIUM)
- [ ] **2.1** Verify print functionality đang hoạt động
- [ ] **2.2** Tạo `PayslipPrintTemplate` component (in từng phiếu)
- [ ] **2.3** Tạo `DepartmentSummaryPrintTemplate` 
- [ ] **2.4** Thêm dropdown "In" với options:
  - [ ] In tổng hợp batch
  - [ ] In tất cả phiếu lương
  - [ ] In theo phòng ban
- [ ] **2.5** Thêm nút in trong mỗi row của PayslipTable

### Phase 3: Tích hợp Employee Detail (Priority: MEDIUM)
- [ ] **3.1** Tạo component `EmployeePayrollTab`
- [ ] **3.2** Thêm YTD Summary cards
- [ ] **3.3** Thêm table lịch sử payslip với pagination
- [ ] **3.4** Thêm nút xem chi tiết và in từng payslip
- [ ] **3.5** Tích hợp tab mới vào employee detail-page

### Phase 4: Tích hợp Payments (Priority: LOW)
- [ ] **4.1** Update Payment type với payroll fields
- [ ] **4.2** Tạo function `createSalaryPayments` trong payment store
- [ ] **4.3** UI: Nút "Tạo phiếu chi lương" trong payroll detail
  - [ ] Dialog chọn: 1 phiếu tổng / nhiều phiếu riêng
  - [ ] Chọn tài khoản chi
  - [ ] Preview trước khi tạo
- [ ] **4.4** UI: Hiển thị linked payments trong payroll detail
- [ ] **4.5** UI: Hiển thị linked payroll trong payment detail
- [ ] **4.6** Validation: Không cho tạo duplicate payment cho cùng batch

---

## 📁 FILES CẦN TẠO/SỬA

### Tạo mới:
```
features/payroll/components/
├── payslip-edit-dialog.tsx      # Dialog sửa payslip
├── payslip-print-template.tsx   # Template in payslip
├── department-print-template.tsx # Template in theo dept
└── create-payment-dialog.tsx    # Dialog tạo phiếu chi

features/employees/
└── employee-payroll-tab.tsx     # Tab bảng lương trong employee detail
```

### Sửa đổi:
```
features/payroll/
├── payroll-batch-store.ts       # Thêm updatePayslip, recalculatePayslip
├── detail-page.tsx              # Thêm edit buttons, payment integration
└── components/payslip-table.tsx # Thêm action buttons (edit, print)

features/payments/
├── types.ts                     # Thêm payroll link fields
└── store.ts                     # Thêm createSalaryPayments

features/employees/
└── detail-page.tsx              # Thêm EmployeePayrollTab

lib/
└── print/payroll-print-helper.ts # Extend print helpers
```

---

## 🔄 DATA FLOW

```
┌──────────────────────────────────────────────────────────────────┐
│                        PAYROLL MODULE                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │   RUN PAGE  │───►│ BATCH STORE │◄───│DETAIL PAGE  │          │
│  │ (Create)    │    │             │    │(View/Edit)  │          │
│  └─────────────┘    └──────┬──────┘    └──────┬──────┘          │
│                            │                   │                  │
│              ┌─────────────┼───────────────────┼─────────────┐   │
│              │             │                   │             │   │
│              ▼             ▼                   ▼             ▼   │
│       ┌──────────┐  ┌──────────┐       ┌──────────┐  ┌──────────┐
│       │ EMPLOYEE │  │ PAYMENTS │       │  PRINT   │  │  AUDIT   │
│       │  DETAIL  │  │(Chi lương)│      │ SYSTEM   │  │   LOG    │
│       └──────────┘  └──────────┘       └──────────┘  └──────────┘
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

1. **Audit Trail**: Mọi thay đổi payslip phải được log
2. **Locked Status**: TUYỆT ĐỐI không cho sửa khi đã locked
3. **Recalculate**: Khi sửa component, cần recalculate totals
4. **Payment Link**: 1 batch có thể có nhiều payment (nếu chi riêng từng người)
5. **ID Governance**: Tuân thủ ID-GOVERNANCE.md khi tạo entities mới

---

## 📅 TIMELINE DỰ KIẾN

| Phase | Ước tính | Dependencies |
|-------|----------|--------------|
| Phase 1 (Edit) | 2-3 ngày | None |
| Phase 2 (Print) | 1-2 ngày | Phase 1 |
| Phase 3 (Employee) | 1 ngày | None |
| Phase 4 (Payment) | 2-3 ngày | Phase 1 |

**Tổng: 6-9 ngày**

---

## 🚀 BẮT ĐẦU TỪ ĐÂU?

**Recommend:** Bắt đầu từ **Phase 1** (Sửa bảng lương) vì:
1. Là yêu cầu quan trọng nhất
2. Các phase sau phụ thuộc vào store changes ở phase này
3. Sau khi có edit, có thể test flow hoàn chỉnh

Anh muốn em bắt đầu từ phase nào?
