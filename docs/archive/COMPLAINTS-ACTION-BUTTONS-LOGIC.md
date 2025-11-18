# LOGIC CÁC NÚT ACTION KHIẾU NẠI# Complaints Module - Action Buttons Logic



> **Ngày**: 11/11/2025  ## 📋 Tổng quan

> **Mục đích**: Tư vấn logic reversal cho các action buttons: Hủy, Mở lại, Kết thúc, Đổi sang SaiTài liệu này mô tả logic hiển thị action buttons trong trang chi tiết khiếu nại dựa trên trạng thái của complaint.



---## 🎯 Luồng trạng thái (Status Flow)



## 📊 HIỆN TRẠNG```

pending (Chờ xử lý)

### **Các nút action hiện có:**    ↓ [Bắt đầu xử lý]

investigating (Đang điều tra)

| Nút | Điều kiện hiện | Action hiện tại | Vấn đề |    ↓ [Xác nhận đúng/sai] hoặc [Kết thúc]

|-----|---------------|-----------------|---------|resolved (Đã giải quyết) ← hoặc → rejected (Đã từ chối/hủy)

| **Xác nhận Đúng** | Pending verification | Tạo phiếu chi + phiếu thu + điều chỉnh kho | ✅ OK |    ↓ [Mở lại nếu cần]

| **Xác nhận Sai** | Pending verification | Upload bằng chứng, từ chối | ✅ OK |investigating (Quay lại điều tra)

| **Đổi sang Đúng** | Đã verify Sai | Chuyển sang Đúng | ⚠️ Không tạo phiếu |```

| **Đổi sang Sai** | Đã verify Đúng | Chuyển sang Sai | ⚠️ **KHÔNG HỦY PHIẾU ĐÃ TẠO** |

| **Hủy khiếu nại** | Chưa resolved/rejected | Chuyển status → rejected | ⚠️ **KHÔNG HỦY PHIẾU** |## 🔘 Action Buttons theo Trạng thái

| **Mở lại** | Resolved/Rejected | Chuyển status → investigating | ⚠️ **KHÔNG HỦY PHIẾU** |

| **Kết thúc** | Đã verify | Chuyển status → resolved | ✅ OK |### 1. **pending** (Chờ xử lý)

- ✅ **Sửa** - Chỉnh sửa thông tin khiếu nại

---- ✅ **Hủy khiếu nại** - Hủy bỏ khiếu nại (chuyển sang rejected)

- ✅ **Quay lại** - Về danh sách

## 🎯 LOGIC MỚI ĐỀ XUẤT

**Logic:**

### **1. Nguyên tắc thiết kế:**- Mới tạo, chưa xử lý → cho phép sửa và hủy

- Chưa xác minh → không hiện nút "Kết thúc"

#### **A. Phiếu thu/chi & Kho là "Side Effects"**

```---

Xác nhận Đúng → Tạo:

  ├─ Phiếu chi (bù trừ khách)### 2. **investigating** (Đang điều tra)

  ├─ Phiếu thu (phạt nhân viên) - ✅ **Xác nhận đúng** - Mở dialog chọn giải pháp (Chuyển khoản/Bù đơn sau)

  └─ Điều chỉnh kho- ✅ **Xác nhận sai** - Mở dialog tải bằng chứng

- ✅ **Kết thúc** - Kết thúc khiếu nại (chuyển sang resolved)

→ Khi REVERT, phải HỦY tất cả side effects này!- ✅ **Hủy khiếu nại** - Hủy bỏ khiếu nại (chuyển sang rejected)

```- ✅ **Quay lại** - Về danh sách



#### **B. Audit Trail - Không xóa dữ liệu****Logic:**

```- Đang xử lý → cho phép xác minh đúng/sai

❌ SAI: Xóa phiếu chi/thu- Đã xác minh (`verification !== "pending-verification"`) → hiện nút "Kết thúc"

✅ ĐÚNG: Đánh dấu phiếu là "cancelled" + tạo phiếu reverse- Vẫn có thể hủy nếu phát hiện khiếu nại không hợp lệ

```

---

#### **C. State Machine - Chỉ cho phép chuyển đổi hợp lý**

```### 3. **resolved** (Đã giải quyết)

Pending → Investigating → Verified (Đúng/Sai) → Resolved/Rejected- ✅ **Mở lại** - Mở lại khiếu nại (chuyển về investigating)

- ✅ **Quay lại** - Về danh sách

Reversal paths:

  Resolved → Investigating (Mở lại)**Logic:**

  Verified Đúng → Verified Sai (Đổi verification)- Đã hoàn thành → không cho sửa, không cho hủy, không cho kết thúc lại

```- Chỉ có thể mở lại nếu phát hiện sai sót hoặc khách hàng phản hồi thêm



------



## 🔧 LOGIC CHI TIẾT### 4. **rejected** (Đã từ chối/hủy)

- ✅ **Mở lại** - Mở lại khiếu nại (chuyển về investigating)

### **ACTION 1: Mở lại khiếu nại (Reopen)** ⭐ QUAN TRỌNG NHẤT- ✅ **Quay lại** - Về danh sách



#### **Kịch bản:****Logic:**

```- Đã hủy → không cho sửa, không cho hủy lại

Complaint đã Resolved/Rejected- Có thể mở lại nếu phát hiện đã hủy nhầm

→ Phát hiện sai sót, cần mở lại xử lý

→ Cần hủy các phiếu đã tạo + khôi phục kho---

```

## 💻 Code Logic

#### **Flow chart:**

```### Check Button Visibility

[Mở lại] ```typescript

   ↓const isVerified = complaint.verification !== "pending-verification";

Check: Đã tạo phiếu chi/thu?const canEnd = complaint.status !== "resolved" && complaint.status !== "rejected" && isVerified;

   ├─ Có → Confirm dialog: "Sẽ hủy phiếu & khôi phục kho"const canEdit = complaint.status !== "resolved" && complaint.status !== "rejected";

   │         ├─ Cancel → Returnconst canReopen = complaint.status === "resolved" || complaint.status === "rejected";

   │         └─ OK → Continue```

   └─ Không → Continue

   ↓### Action Buttons Rendering

Lazy load: VoucherStore, ProductStore```typescript

   ↓// 1. Hủy khiếu nại (chỉ khi chưa resolved/rejected)

Hủy phiếu chi (status = cancelled)if (complaint.status !== "resolved" && complaint.status !== "rejected") {

   ↓  actions.push(<Button>Hủy khiếu nại</Button>);

Hủy phiếu thu (status = cancelled)}

   ↓

Khôi phục kho (reverse quantity: + thành -, - thành +)// 2. Sửa (chỉ khi chưa resolved/rejected)

   ↓if (canEdit) {

Update complaint:  actions.push(<Button>Sửa</Button>);

  - status = investigating}

  - verification = pending-verification

  - Clear: resolution, compensationAmount, inventoryAdjustment// 3. Quay lại (luôn hiện)

  - Add timeline actionactions.push(<Button>Quay lại</Button>);

   ↓

Toast: "Đã mở lại & khôi phục"// 4. Kết thúc (chỉ khi đã xác minh và chưa resolved/rejected)

```if (canEnd) {

  actions.push(<Button>Kết thúc</Button>);

#### **Code implementation:**}



```typescript// 5. Mở lại (chỉ khi resolved hoặc rejected)

const handleReopenComplaint = React.useCallback(async () => {if (canReopen) {

  if (!complaint) return;  actions.push(<Button>Mở lại</Button>);

  }

  // Step 1: Kiểm tra đã tạo phiếu chưa```

  const verifyAction = complaint.timeline.find(a => a.actionType === 'verified-correct');

  const hasPaymentVoucher = verifyAction?.metadata?.paymentVoucherId;## 🔄 Handler Functions

  const hasReceiptVoucher = verifyAction?.metadata?.receiptVoucherId;

  const hasVouchers = hasPaymentVoucher || hasReceiptVoucher;### handleEndComplaint

  const hasInventoryAdj = complaint.inventoryAdjustment?.adjusted;```typescript

  const handleEndComplaint = () => {

  if (hasVouchers || hasInventoryAdj) {  // Kiểm tra đã xác minh chưa

    // Hiển thị dialog xác nhận  if (complaint.verification === "pending-verification") {

    setConfirmDialogConfig({    toast.error("Vui lòng xác minh khiếu nại trước khi kết thúc");

      title: "Xác nhận mở lại khiếu nại",    return;

      description: (  }

        <div className="space-y-2 text-sm">

          <p>Khiếu nại này đã được xử lý. Mở lại sẽ:</p>  // Tính ngày xóa file (15 ngày sau)

          <ul className="list-disc pl-5 space-y-1">  const deletionDate = new Date();

            {hasPaymentVoucher && <li>Hủy phiếu chi bù trừ khách hàng</li>}  deletionDate.setDate(deletionDate.getDate() + 15);

            {hasReceiptVoucher && <li>Hủy phiếu thu phạt nhân viên</li>}

            {hasInventoryAdj && <li>Khôi phục số lượng tồn kho đã điều chỉnh</li>}  // Lấy danh sách file cần xóa

          </ul>  const filesToDelete = [

          <p className="font-medium text-destructive mt-3">    ...complaint.images.filter(img => img.type === "initial").map(img => img.url),

            ⚠️ Các phiếu chi/thu sẽ bị đánh dấu HỦY (không xóa vĩnh viễn)    ...complaint.evidenceImages,

          </p>  ];

          <p>Bạn có chắc muốn tiếp tục?</p>

        </div>  // Cập nhật trạng thái

      ),  updateComplaint(complaint.systemId, {

      confirmText: "Mở lại & Hủy phiếu",    status: "resolved",

      variant: "destructive",    endedBy: "USER_001",

      onConfirm: async () => {    endedAt: new Date(),

        try {    scheduledDeletionAt: deletionDate.toISOString(),

          // Step 2: Lazy load stores    filesToDelete,

          const { useVoucherStore } = await import('../vouchers/store.ts');    timeline: [...complaint.timeline, newAction],

          const { useProductStore } = await import('../products/store.ts');  });

          const voucherStore = useVoucherStore.getState();

          const { updateInventory } = useProductStore.getState();  toast.success("Đã kết thúc khiếu nại. Các file sẽ bị xóa sau 15 ngày");

          };

          const cancelledVouchers: string[] = [];```

          

          // Step 3: Hủy phiếu chi### handleCancelComplaint

          if (hasPaymentVoucher) {```typescript

            const paymentVoucher = voucherStore.data.find(v => v.systemId === hasPaymentVoucher);const handleCancelComplaint = () => {

              if (window.confirm("Bạn có chắc muốn hủy khiếu nại này?")) {

            if (paymentVoucher && paymentVoucher.status !== 'cancelled') {    // Tương tự handleEndComplaint nhưng status = "rejected"

              voucherStore.update(hasPaymentVoucher, {    updateComplaint(complaint.systemId, {

                status: 'cancelled',      status: "rejected",

                cancelledBy: currentUser.systemId,      cancelledBy: "USER_001",

                cancelledAt: new Date(),      cancelledAt: new Date(),

                cancellationNote: `Hủy do mở lại khiếu nại ${complaint.id}`,      scheduledDeletionAt: deletionDate.toISOString(),

              } as any);      filesToDelete,

                    timeline: [...complaint.timeline, newAction],

              cancelledVouchers.push(`Phiếu chi ${paymentVoucher.id}`);    });

            }

          }    toast.success("Đã hủy khiếu nại. Các file sẽ bị xóa sau 15 ngày");

            }

          // Step 4: Hủy phiếu thu};

          if (hasReceiptVoucher) {```

            const receiptVoucher = voucherStore.data.find(v => v.systemId === hasReceiptVoucher);

            ### handleReopenComplaint (NEW)

            if (receiptVoucher && receiptVoucher.status !== 'cancelled') {```typescript

              voucherStore.update(hasReceiptVoucher, {const handleReopenComplaint = () => {

                status: 'cancelled',  if (window.confirm("Bạn có chắc muốn mở lại khiếu nại này?")) {

                cancelledBy: currentUser.systemId,    const newAction: ComplaintAction = {

                cancelledAt: new Date(),      id: `action_${Date.now()}`,

                cancellationNote: `Hủy do mở lại khiếu nại ${complaint.id}`,      actionType: "reopened",

              } as any);      performedBy: "USER_001",

                    performedAt: new Date(),

              cancelledVouchers.push(`Phiếu thu ${receiptVoucher.id}`);      note: "Mở lại khiếu nại",

            }    };

          }

              updateComplaint(complaint.systemId, {

          // Step 5: Khôi phục kho      status: "investigating",

          const reversedProducts: string[] = [];      reopenedBy: "USER_001",

          if (hasInventoryAdj) {      reopenedAt: new Date(),

            const inventoryAdj = complaint.inventoryAdjustment!;      scheduledDeletionAt: null, // Hủy lịch xóa file

            inventoryAdj.items.forEach(item => {      filesToDelete: null,

              // Reverse: Cộng thì trừ, trừ thì cộng      timeline: [...complaint.timeline, newAction],

              const reverseQuantity = -item.quantityAdjusted;    });

              updateInventory(item.productSystemId, item.branchSystemId, reverseQuantity);

                  toast.success("Đã mở lại khiếu nại");

              reversedProducts.push(  }

                `${item.productId}: ${reverseQuantity > 0 ? '+' : ''}${reverseQuantity}`};

              );```

            });

          }## 🎨 Timeline Display

          

          // Step 6: Update complaint### Action Types

          const newAction: ComplaintAction = {```typescript

            id: `action_${Date.now()}`,actionType: 

            actionType: "reopened",  | "created"          // Tạo khiếu nại

            performedBy: currentUser.name,  | "assigned"         // Giao việc

            performedAt: new Date(),  | "investigated"     // Kiểm tra

            note: [  | "verified"         // Xác minh

              "Mở lại khiếu nại",  | "verified-correct" // Xác minh đúng

              cancelledVouchers.length > 0 ? `Đã hủy: ${cancelledVouchers.join(', ')}` : null,  | "verified-incorrect" // Xác minh sai

              reversedProducts.length > 0 ? `Khôi phục kho: ${reversedProducts.join(', ')}` : null,  | "resolved"         // Giải quyết

            ].filter(Boolean).join('\n'),  | "rejected"         // Từ chối

            metadata: {  | "cancelled"        // Hủy

              cancelledPaymentVoucherId: hasPaymentVoucher,  | "ended"            // Kết thúc

              cancelledReceiptVoucherId: hasReceiptVoucher,  | "reopened"         // Mở lại (NEW)

              reversedInventoryItems: reversedProducts.length,  | "status-changed"   // Thay đổi trạng thái

            }  | "commented"        // Bình luận

          };```

          

          updateComplaint(complaint.systemId, {### Icons

            status: "investigating",```typescript

            // Xóa các trường ended/resolvedconst getActionIcon = (actionType: string) => {

            endedBy: undefined,  switch (actionType) {

            endedAt: undefined,    case "created": return <FileText />;

            resolvedBy: undefined,    case "assigned": return <User />;

            resolvedAt: undefined,    case "investigated": return <AlertCircle />;

            cancelledBy: undefined,    case "verified-correct": return <CheckCircle className="text-green-600" />;

            cancelledAt: undefined,    case "verified-incorrect": return <XCircle className="text-red-600" />;

            // Reset verification về pending    case "resolved":

            verification: "pending-verification",    case "ended": return <CheckCircle className="text-green-600" />;

            isVerifiedCorrect: undefined,    case "rejected":

            resolution: undefined,    case "cancelled": return <XCircle className="text-red-600" />;

            compensationAmount: undefined,    case "reopened": return <AlertCircle className="text-blue-600" />; // NEW

            incurredCost: undefined,    case "status-changed": return <Clock />;

            resolutionNote: undefined,    default: return <FileText />;

            // Clear inventory adjustment  }

            inventoryAdjustment: undefined,};

            // Thêm thông tin reopen```

            reopenedBy: currentUser.systemId,

            reopenedAt: new Date(),### Labels

            reopenCount: ((complaint as any).reopenCount || 0) + 1,```typescript

            timeline: [...complaint.timeline, newAction],const actionLabels: Record<string, string> = {

          } as any);  created: "Tạo khiếu nại",

            assigned: "Giao việc",

          toast.success(  investigated: "Kiểm tra",

            <div className="space-y-1">  verified: "Xác minh",

              <div className="font-semibold">✅ Đã mở lại khiếu nại</div>  "verified-correct": "Xác minh đúng",

              {cancelledVouchers.length > 0 && (  "verified-incorrect": "Xác minh sai",

                <div className="text-xs">Đã hủy {cancelledVouchers.length} phiếu</div>  resolved: "Giải quyết",

              )}  rejected: "Từ chối",

              {reversedProducts.length > 0 && (  cancelled: "Hủy",

                <div className="text-xs">Đã khôi phục {reversedProducts.length} sản phẩm</div>  ended: "Kết thúc",

              )}  reopened: "Mở lại", // NEW

            </div>  "status-changed": "Thay đổi trạng thái",

          );  commented: "Bình luận",

        } catch (error) {};

          console.error("Lỗi khi mở lại khiếu nại:", error);```

          toast.error("Có lỗi xảy ra. Vui lòng thử lại hoặc liên hệ admin.");

        }## 📊 Use Cases

      }

    });### Case 1: Khiếu nại mới tạo

    setConfirmDialogOpen(true);- **Trạng thái**: pending

  } else {- **Actions**: Sửa, Hủy, Quay lại

    // Không có phiếu/kho → Mở lại đơn giản- **Lý do**: Mới tạo, chưa xử lý → cho phép chỉnh sửa hoặc hủy

    const newAction: ComplaintAction = {

      id: `action_${Date.now()}`,### Case 2: Đang xử lý, chưa xác minh

      actionType: "reopened",- **Trạng thái**: investigating, verification = "pending-verification"

      performedBy: currentUser.name,- **Actions**: Xác nhận đúng, Xác nhận sai, Hủy, Quay lại

      performedAt: new Date(),- **Lý do**: Đang xử lý nhưng chưa xác minh → không hiện "Kết thúc"

      note: "Mở lại khiếu nại (chưa tạo phiếu)",

    };### Case 3: Đang xử lý, đã xác minh

    - **Trạng thái**: investigating, verification = "verified-correct"

    updateComplaint(complaint.systemId, {- **Actions**: Kết thúc, Hủy, Quay lại

      status: "investigating",- **Lý do**: Đã xác minh → có thể kết thúc hoặc hủy

      endedBy: undefined,

      endedAt: undefined,### Case 4: Đã hoàn thành

      resolvedBy: undefined,- **Trạng thái**: resolved

      resolvedAt: undefined,- **Actions**: Mở lại, Quay lại

      cancelledBy: undefined,- **Lý do**: Đã xong → chỉ có thể xem hoặc mở lại nếu cần

      cancelledAt: undefined,

      verification: "pending-verification",### Case 5: Đã hủy

      reopenedBy: currentUser.systemId,- **Trạng thái**: rejected

      reopenedAt: new Date(),- **Actions**: Mở lại, Quay lại

      timeline: [...complaint.timeline, newAction],- **Lý do**: Đã hủy → chỉ có thể mở lại nếu nhầm

    } as any);

    ### Case 6: Mở lại sau khi hoàn thành/hủy

    toast.success("Đã mở lại khiếu nại");- **Trạng thái**: investigating (sau khi mở lại)

  }- **Actions**: Xác nhận đúng, Xác nhận sai, Kết thúc, Hủy, Quay lại

}, [complaint, updateComplaint, currentUser, setConfirmDialogConfig, setConfirmDialogOpen]);- **Lý do**: Đã mở lại → xử lý như bình thường

```- **Đặc biệt**: `scheduledDeletionAt` và `filesToDelete` được xóa (hủy lịch xóa file)



---## 🐛 Bug Fixes



### **ACTION 2: Hủy khiếu nại (Cancel)**### Problem: Khi resolved vẫn hiện nút "Kết thúc" và "Hủy"

**Root Cause**: Logic check sai

#### **Logic tương tự Reopen:**```typescript

// ❌ SAI

```typescriptconst canEnd = isVerified && complaint.status !== "resolved";

const handleCancelComplaint = React.useCallback(async () => {// Chỉ check resolved, không check rejected

  if (!complaint) return;

  // ✅ ĐÚNG

  const verifyAction = complaint.timeline.find(a => a.actionType === 'verified-correct');const canEnd = isVerified && 

  const hasVouchers = verifyAction?.metadata?.paymentVoucherId || verifyAction?.metadata?.receiptVoucherId;  complaint.status !== "resolved" && 

  const hasInventoryAdj = complaint.inventoryAdjustment?.adjusted;  complaint.status !== "rejected";

  ```

  setConfirmDialogConfig({

    title: "Xác nhận hủy khiếu nại",### Solution: Sửa logic check và thêm nút "Mở lại"

    description: hasVouchers || hasInventoryAdj ? (1. ✅ Sửa `canEnd` để check cả resolved và rejected

      <div className="space-y-2 text-sm">2. ✅ Thêm `canReopen` để check khi nào hiện nút "Mở lại"

        <p>Khiếu nại này đã được xử lý. Hủy sẽ:</p>3. ✅ Thêm handler `handleReopenComplaint`

        <ul className="list-disc pl-5 space-y-1">4. ✅ Thêm action type "reopened" vào types

          {hasVouchers && <li>Hủy các phiếu chi/thu đã tạo</li>}5. ✅ Thêm icon và label cho "reopened" trong timeline

          {hasInventoryAdj && <li>Khôi phục số lượng tồn kho</li>}

        </ul>## 📝 Testing Checklist

        <p>Bạn có chắc muốn hủy?</p>

      </div>### Trạng thái pending

    ) : "Bạn có chắc muốn hủy khiếu nại này?",- [ ] Hiện nút: Sửa, Hủy, Quay lại

    confirmText: "Hủy khiếu nại",- [ ] Không hiện nút: Kết thúc, Mở lại

    variant: "destructive",- [ ] Click Sửa → chuyển đến form edit

    onConfirm: async () => {- [ ] Click Hủy → confirm → status = rejected

      try {

        // Nếu đã có phiếu → Hủy phiếu + khôi phục kho (giống Reopen)### Trạng thái investigating (chưa xác minh)

        if (hasVouchers || hasInventoryAdj) {- [ ] Hiện nút: Xác nhận đúng, Xác nhận sai, Hủy, Quay lại

          // [Copy logic từ Reopen]- [ ] Không hiện nút: Sửa, Kết thúc, Mở lại

          // ...- [ ] Click Xác nhận đúng → mở dialog

        }- [ ] Click Xác nhận sai → mở dialog

        

        // Update complaint status### Trạng thái investigating (đã xác minh)

        const newAction: ComplaintAction = {- [ ] Hiện nút: Kết thúc, Hủy, Quay lại

          id: `action_${Date.now()}`,- [ ] Không hiện nút: Sửa, Mở lại

          actionType: "cancelled",- [ ] Click Kết thúc → status = resolved, schedule file deletion

          performedBy: currentUser.name,- [ ] Click Hủy → status = rejected, schedule file deletion

          performedAt: new Date(),

          note: hasVouchers ? "Hủy khiếu nại. Đã hủy phiếu & khôi phục kho" : "Hủy khiếu nại",### Trạng thái resolved

        };- [ ] Hiện nút: Mở lại, Quay lại

        - [ ] Không hiện nút: Sửa, Kết thúc, Hủy

        updateComplaint(complaint.systemId, {- [ ] Click Mở lại → confirm → status = investigating, cancel scheduled deletion

          status: "rejected",

          cancelledBy: currentUser.systemId,### Trạng thái rejected

          cancelledAt: new Date(),- [ ] Hiện nút: Mở lại, Quay lại

          timeline: [...complaint.timeline, newAction],- [ ] Không hiện nút: Sửa, Kết thúc, Hủy

        } as any);- [ ] Click Mở lại → confirm → status = investigating, cancel scheduled deletion

        

        toast.success("Đã hủy khiếu nại");### Timeline

      } catch (error) {- [ ] Mở lại → hiện entry "Mở lại" với icon AlertCircle màu xanh

        console.error("Lỗi khi hủy khiếu nại:", error);- [ ] Entry hiển thị đúng người thực hiện và thời gian

        toast.error("Có lỗi xảy ra");

      }## 📚 Related Documentation

    }- [Complaints Compensation and File Deletion](./COMPLAINTS-COMPENSATION-AND-FILE-DELETION.md)

  });- [How to Add New Page](./how-to-add-new-page.md)

  setConfirmDialogOpen(true);

}, [complaint, updateComplaint, currentUser]);---

```

**Last Updated**: November 7, 2025

---**Implemented By**: AI Assistant

**Status**: ✅ Complete

### **ACTION 3: Đổi sang Sai (Verified Correct → Incorrect)**

#### **Logic:**

```typescript
const handleChangeToIncorrect = React.useCallback(() => {
  if (!complaint || complaint.verification !== 'verified-correct') return;
  
  // Hiển thị warning trước
  setConfirmDialogConfig({
    title: "Đổi sang: Khiếu nại Sai",
    description: (
      <div className="space-y-2 text-sm">
        <p>Khiếu nại này đã được xác nhận <strong>Đúng</strong> và tạo phiếu. Đổi sang Sai sẽ:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Hủy phiếu chi/thu đã tạo</li>
          <li>Khôi phục tồn kho</li>
          <li>Yêu cầu upload bằng chứng khách sai</li>
        </ul>
        <p className="font-medium">Bạn có chắc muốn tiếp tục?</p>
      </div>
    ),
    confirmText: "Tiếp tục",
    variant: "destructive",
    onConfirm: () => {
      // Mở verification dialog với mode "incorrect"
      setVerificationMode("incorrect");
      setVerificationDialogOpen(true);
    }
  });
  setConfirmDialogOpen(true);
}, [complaint]);

// Trong handleSubmitIncorrectEvidence, thêm logic hủy phiếu
const handleSubmitIncorrectEvidence = React.useCallback(async (
  stagingFiles: StagingFile[], 
  videoLinks: string[], 
  note: string
) => {
  if (!complaint) return;
  
  try {
    // Step 1: Nếu đổi từ Correct → Incorrect, hủy phiếu
    if (complaint.verification === 'verified-correct') {
      const { useVoucherStore } = await import('../vouchers/store.ts');
      const { useProductStore } = await import('../products/store.ts');
      const voucherStore = useVoucherStore.getState();
      const { updateInventory } = useProductStore.getState();
      
      const verifyAction = complaint.timeline.find(a => a.actionType === 'verified-correct');
      
      // Hủy phiếu chi
      if (verifyAction?.metadata?.paymentVoucherId) {
        const voucher = voucherStore.data.find(v => v.systemId === verifyAction.metadata.paymentVoucherId);
        if (voucher && voucher.status !== 'cancelled') {
          voucherStore.update(voucher.systemId, {
            status: 'cancelled',
            cancelledBy: currentUser.systemId,
            cancelledAt: new Date(),
            cancellationNote: `Hủy do đổi xác minh sang Sai - Khiếu nại ${complaint.id}`,
          } as any);
        }
      }
      
      // Hủy phiếu thu
      if (verifyAction?.metadata?.receiptVoucherId) {
        const voucher = voucherStore.data.find(v => v.systemId === verifyAction.metadata.receiptVoucherId);
        if (voucher && voucher.status !== 'cancelled') {
          voucherStore.update(voucher.systemId, {
            status: 'cancelled',
            cancelledBy: currentUser.systemId,
            cancelledAt: new Date(),
            cancellationNote: `Hủy do đổi xác minh sang Sai - Khiếu nại ${complaint.id}`,
          } as any);
        }
      }
      
      // Khôi phục kho
      const inventoryAdj = complaint.inventoryAdjustment;
      if (inventoryAdj?.adjusted && inventoryAdj.items?.length > 0) {
        inventoryAdj.items.forEach(item => {
          const reverseQuantity = -item.quantityAdjusted;
          updateInventory(item.productSystemId, item.branchSystemId, reverseQuantity);
        });
      }
    }
    
    // Step 2: Upload bằng chứng (logic hiện tại)
    let confirmedFiles: any[] = [];
    if (stagingFiles.length > 0) {
      const sessionId = stagingFiles[0]?.sessionId;
      if (sessionId) {
        confirmedFiles = await FileUploadAPI.confirmStagingFiles(
          sessionId,
          complaint.systemId,
          'complaint',
          'employee-images'
        );
      }
    }
    
    // Step 3: Update complaint
    const existingEmployeeImages = (complaint as any).employeeImages || [];
    const newEmployeeImages = confirmedFiles.map((file, idx) => ({
      id: `emp_img_${Date.now()}_${idx}`,
      url: file.url,
      uploadedBy: currentUser.systemId,
      uploadedAt: new Date(),
      type: "evidence" as const,
    }));
    
    const newAction: ComplaintAction = {
      id: `action_${Date.now()}`,
      actionType: "verified-incorrect",
      performedBy: currentUser.name,
      performedAt: new Date(),
      note: complaint.verification === 'verified-correct'
        ? `Đổi xác minh từ Đúng → Sai. Đã hủy phiếu & khôi phục kho. Bằng chứng: ${confirmedFiles.length} file(s)`
        : `Khách hàng phản hồi sai. Bằng chứng: ${confirmedFiles.length} file(s)`,
      metadata: {
        changedFrom: complaint.verification,
        filesCount: confirmedFiles.length,
        videoLinksCount: videoLinks.length,
      },
    };
    
    updateComplaint(complaint.systemId, {
      isVerifiedCorrect: false,
      verification: "verified-incorrect",
      resolution: "rejected",
      resolutionNote: note || "Khách hàng phản hồi sai",
      evidenceVideoLinks: videoLinks,
      employeeImages: [...existingEmployeeImages, ...newEmployeeImages],
      // Clear các thông tin verification Đúng cũ
      compensationAmount: undefined,
      incurredCost: undefined,
      inventoryAdjustment: undefined,
      timeline: [...complaint.timeline, newAction],
    } as any);
    
    toast.success("✅ Đã đổi sang Sai & khôi phục trạng thái");
  } catch (error) {
    console.error("Error:", error);
    toast.error("Có lỗi xảy ra");
  }
}, [complaint, updateComplaint, currentUser]);
```

---

## 📋 CHECKLIST IMPLEMENTATION

### **1. Update Types:**

```typescript
// features/complaints/types.ts

interface Complaint {
  // ... existing fields
  
  // Tracking reopens
  reopenCount?: number;
  reopenedBy?: string;
  reopenedAt?: Date;
}

// features/vouchers/types.ts

interface Voucher {
  // ... existing fields
  
  status: 'draft' | 'completed' | 'cancelled'; // ⚡ Thêm status
  cancelledBy?: string;
  cancelledAt?: Date;
  cancellationNote?: string;
}
```

### **2. Create Utility:**

```typescript
// features/complaints/utils/voucher-reversal.ts

export async function cancelVouchersAndRestoreInventory(
  complaint: Complaint,
  currentUser: { systemId: string; name: string }
): Promise<{
  cancelledVouchers: string[];
  reversedProducts: string[];
}> {
  const { useVoucherStore } = await import('../../vouchers/store.ts');
  const { useProductStore } = await import('../../products/store.ts');
  
  const voucherStore = useVoucherStore.getState();
  const { updateInventory } = useProductStore.getState();
  
  const verifyAction = complaint.timeline.find(a => a.actionType === 'verified-correct');
  const cancelledVouchers: string[] = [];
  const reversedProducts: string[] = [];
  
  // Cancel payment voucher
  if (verifyAction?.metadata?.paymentVoucherId) {
    const systemId = verifyAction.metadata.paymentVoucherId;
    const voucher = voucherStore.data.find(v => v.systemId === systemId);
    
    if (voucher && voucher.status !== 'cancelled') {
      voucherStore.update(systemId, {
        status: 'cancelled',
        cancelledBy: currentUser.systemId,
        cancelledAt: new Date(),
        cancellationNote: `Hủy do thao tác trên khiếu nại ${complaint.id}`,
      } as any);
      
      cancelledVouchers.push(`Phiếu chi ${voucher.id}`);
    }
  }
  
  // Cancel receipt voucher
  if (verifyAction?.metadata?.receiptVoucherId) {
    const systemId = verifyAction.metadata.receiptVoucherId;
    const voucher = voucherStore.data.find(v => v.systemId === systemId);
    
    if (voucher && voucher.status !== 'cancelled') {
      voucherStore.update(systemId, {
        status: 'cancelled',
        cancelledBy: currentUser.systemId,
        cancelledAt: new Date(),
        cancellationNote: `Hủy do thao tác trên khiếu nại ${complaint.id}`,
      } as any);
      
      cancelledVouchers.push(`Phiếu thu ${voucher.id}`);
    }
  }
  
  // Restore inventory
  const inventoryAdj = complaint.inventoryAdjustment;
  if (inventoryAdj?.adjusted && inventoryAdj.items?.length > 0) {
    inventoryAdj.items.forEach(item => {
      const reverseQuantity = -item.quantityAdjusted;
      updateInventory(item.productSystemId, item.branchSystemId, reverseQuantity);
      
      reversedProducts.push(
        `${item.productId}: ${reverseQuantity > 0 ? '+' : ''}${reverseQuantity}`
      );
    });
  }
  
  return { cancelledVouchers, reversedProducts };
}
```

---

## 🎯 PRIORITY

1. ⭐⭐⭐ **Mở lại khiếu nại** - ✅ IMPLEMENTED
2. ⭐⭐ **Hủy khiếu nại** - ✅ IMPLEMENTED
3. ⭐ **Đổi sang Sai** - ⏳ TODO (ít dùng)

---

## 🎉 IMPLEMENTATION COMPLETE

**Date**: November 11, 2025  
**Status**: ✅ **IMPLEMENTED & BUILD SUCCESSFUL**

### ✅ Files Created/Modified:

#### 1. **`features/complaints/utils/voucher-reversal.ts`** (NEW - 174 lines)
- Utility function `cancelVouchersAndRestoreInventory()`
- Pattern học từ Warranty (features/warranty/warranty-detail-page.tsx lines 400-750)
- **Logic phiếu:**
  - `status === 'completed'` → Mark as 'cancelled' (giữ audit trail)
  - `status !== 'completed'` → Delete (xóa hẳn)
- **Logic kho:** Reverse quantity (cộng → trừ, trừ → cộng)
- Returns: `{ cancelledVouchers[], deletedVouchers[], reversedProducts[], totalAmount }`

#### 2. **`features/complaints/detail-page.tsx`** (UPDATED)

**handleReopenComplaint()** - Lines ~668-772 (105 lines)
```typescript
✅ Check phiếu & kho trước khi reopen
✅ Build description string với chi tiết warnings
✅ Call cancelVouchersAndRestoreInventory()
✅ Show separate toasts cho vouchers & inventory
✅ Reset verification về "pending-verification"
✅ Clear inventory adjustment
✅ Add detailed timeline note
```

**handleCancelComplaint()** - Lines ~638-724 (87 lines)
```typescript
✅ Check phiếu & kho trước khi cancel
✅ Build description string với chi tiết warnings
✅ Call cancelVouchersAndRestoreInventory()
✅ Show separate toasts cho vouchers & inventory
✅ Update status to "rejected"
✅ Add detailed timeline note
```

### ✅ Build Status:
```bash
$ npm run build
✓ 5206 modules transformed
✓ built in 24.50s
✓ No TypeScript errors
⚠️ Dynamic import warnings (expected - lazy loading)
```

### 🔑 Key Features:

#### **1. Smart Voucher Handling**
```typescript
// Pattern từ Warranty
if (voucher.status === 'completed') {
  voucherStore.update(createSystemId(voucher.systemId), {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
  });
  result.cancelledVouchers.push(`Phiếu ${voucher.id}`);
} else {
  voucherStore.remove(createSystemId(voucher.systemId));
  result.deletedVouchers.push(`Phiếu ${voucher.id}`);
}
```

#### **2. Inventory Reversal**
```typescript
// Reverse logic
const reverseQuantity = -item.quantityAdjusted;
// Đã trừ -5 → Cộng lại +5
// Đã cộng +3 → Trừ lại -3
productStore.updateInventory(
  item.productSystemId, 
  item.branchSystemId, 
  reverseQuantity
);
```

#### **3. User Experience**
- ⚠️ **Warning dialog** khi có phiếu/kho (build description string)
- 🎯 **Separate toasts** cho vouchers & inventory với duration khác nhau
- 📝 **Timeline note** với đầy đủ thông tin reversal
- 🔍 **Console logs** để debug (pattern từ Warranty)

### 🧪 Testing Checklist:

```
Manual Tests Required:
[ ] Reopen complaint có phiếu completed
    → Check voucher.status = 'cancelled'
    → Toast: "Giữ audit: 1 | Đã xóa: 0"
    
[ ] Reopen complaint có phiếu pending
    → Check voucher deleted
    → Toast: "Giữ audit: 0 | Đã xóa: 1"
    
[ ] Reopen complaint có inventory adjustment
    → Check product inventory reversed
    → Toast: "X sản phẩm đã được khôi phục"
    
[ ] Cancel complaint (same tests as Reopen)
    → Status = 'rejected'
    → Same reversal logic
    
[ ] Reopen/Cancel không có phiếu/kho
    → Simple confirmation dialog
    → No warnings
```

### 📚 References:

**100% follow Warranty pattern:**
- `features/warranty/warranty-detail-page.tsx`
  - `handleCancelTicket()` - Lines 400-575
  - `handleReopenFromReturned()` - Lines 660-750
- **Key learnings:**
  - ✅ Separate paid/unpaid vouchers
  - ✅ Never delete paid vouchers (audit trail)
  - ✅ Lazy load stores (performance)
  - ✅ Detailed logging & user feedback
  - ✅ Use SystemId type correctly (createSystemId wrapper)

---

## 📝 TODO (Lower Priority):

### **3. Đổi verification Đúng → Sai** ⭐ (Lines 222-341 in this doc)
- Handler: `handleChangeToIncorrect()`
- Logic: Cancel vouchers TRƯỚC KHI upload evidence mới
- Implementation: Tương tự Reopen, nhưng trong callback của verification dialog
- Estimate: 2 giờ

---

**Anh có thể test ngay bây giờ! Mở complaint đã có phiếu chi/thu và thử Reopen/Cancel xem có hủy phiếu + khôi phục kho không nhé! 🚀**

