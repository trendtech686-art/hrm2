# SystemId vs ID - Quy Tắc Sử Dụng & Migration Guide

> **⭐ OFFICIAL DOCUMENTATION - Version 2.0**  
> **Date:** November 11, 2025  
> **Status:** ✅ Current & Accurate
>
> **Format:** Both SystemId AND BusinessId use **6 digits**
> - SystemId: `EMP000001`, `CUST000001`, `BRANCH000001` (English prefix, 6 digits)
> - BusinessId: `NV000001`, `KH000001`, `CN000001` (Vietnamese prefix, 6 digits)
>
> **Related Docs:**
> - Complete Guide: `ID-MANAGEMENT-SYSTEM-GUIDE.md`
> - Implementation: `ID-SYSTEM-IMPLEMENTATION-SUMMARY.md`

---

## 📋 TÓM TẮT

Sau khi migrate sang 6-digit format, hệ thống có **2 loại ID**:
- **`systemId`**: Internal unique key (EMP000001, ORD000001) - Dùng prefix **TIẾNG ANH**, 6 digits
- **`id`**: Business display ID (NV000001, DH000001) - Dùng prefix **TIẾNG VIỆT**, 6 digits

**VÍ DỤ:**
- Employee: systemId = `EMP000001`, id = `NV000001`
- Order: systemId = `ORD000001`, id = `DH000001`
- Product: systemId = `PROD000001`, id = `SP000001`
- Customer: systemId = `CUST000001`, id = `KH000001`

⚠️ **VẤN ĐỀ NGHIÊM TRỌNG**: Nhiều chức năng vẫn dùng `.id` cho logic → GÂY LỖI TÌM KIẾM & LIÊN KẾT!

---

## 🎯 QUY TẮC VÀNG

### ✅ **LUÔN DÙNG `systemId`** cho:

#### 1. **Foreign Key References** (CRITICAL!)
```typescript
// ❌ SAI - Sẽ không tìm thấy!
{
  purchaseOrderId: order.id,           // ❌ Dùng business ID
  supplierSystemId: supplier.systemId  // ✅ Đúng
}

// ✅ ĐÚNG
{
  purchaseOrderId: order.systemId,     // ✅ Dùng systemId
  supplierSystemId: supplier.systemId
}
```

**Các trường foreign key CẦN FIX:**
- `purchaseOrderId`
- `orderSystemId` (đã đúng ✅)
- `customerSystemId` (đã đúng ✅)
- `employeeSystemId` (đã đúng ✅)
- `branchSystemId` (đã đúng ✅)
- `supplierSystemId` (đã đúng ✅)
- `productSystemId` (đã đúng ✅)
- `originalDocumentId` ⚠️ (đang dùng `.id`)
- `linkedOrderId` ⚠️ (đang dùng `.id`)
- `linkedSalesReturnId` ⚠️ (đang dùng `.id`)

#### 2. **Store Queries** (find, filter, update, delete)
```typescript
// ❌ SAI
const order = orders.find(o => o.id === searchId);
const receipts = allReceipts.filter(r => r.purchaseOrderId === po.id);
store.update(item.id, updatedData);

// ✅ ĐÚNG
const order = orders.find(o => o.systemId === searchId);
const receipts = allReceipts.filter(r => r.purchaseOrderId === po.systemId);
store.update(item.systemId, updatedData);
```

#### 3. **Navigation & Routing**
```typescript
// ❌ SAI
navigate(`/employees/${employee.id}`)
<Link to={`/orders/${order.id}`}>

// ✅ ĐÚNG
navigate(`/employees/${employee.systemId}`)
<Link to={`/orders/${order.systemId}`}>
```

#### 4. **URL Parameters**
```typescript
// Route: /orders/:systemId
const { systemId } = useParams();
const order = useOrderStore(state => state.findById(systemId)); // ✅ findById uses systemId
```

#### 5. **Document References trong Vouchers**
```typescript
// ❌ SAI
{
  originalDocumentId: purchaseOrder.id,  // ❌
  linkedOrderId: order.id                // ❌
}

// ✅ ĐÚNG
{
  originalDocumentId: purchaseOrder.systemId,  // ✅
  linkedOrderId: order.systemId                // ✅
}
```

---

### 🎨 **CHỈ DÙNG `id`** cho:

#### 1. **UI Display** (Table cells, badges, breadcrumbs)
```typescript
// ✅ ĐÚNG - Hiển thị trong UI
<TableCell>{order.id}</TableCell>
<Badge>{employee.id}</Badge>
<Breadcrumb label={voucher.id} />
```

#### 2. **User Input** (Form fields)
```typescript
// ✅ ĐÚNG - Cho phép user nhập custom ID
<Input 
  name="id" 
  value={formData.id}
  placeholder="Để trống = tự động tạo"
/>
```

#### 3. **Logging & Debug**
```typescript
// ✅ ĐÚNG - Hiển thị cho user/developer
console.log('Processing order:', order.id);
toast.success(`Đã tạo phiếu ${voucher.id}`);
```

---

## 🔴 CÁC LỖI PHỔ BIẾN

### Lỗi 1: Foreign Key dùng `.id`
**File:** `purchase-orders/form-page.tsx:489`
```typescript
// ❌ SAI
const receiptData = {
  purchaseOrderId: createdOrder.id,  // ❌ Sẽ không tìm thấy khi filter
  ...
}

// ✅ SỬA
const receiptData = {
  purchaseOrderId: createdOrder.systemId,  // ✅
  ...
}
```

### Lỗi 2: Store Query dùng `.id`
**File:** `purchase-orders/page.tsx:130`
```typescript
// ❌ SAI
const allocation = voucher.allocations.find(a => a.purchaseOrderId === po.id);

// ✅ SỬA
const allocation = voucher.allocations.find(a => a.purchaseOrderId === po.systemId);
```

### Lỗi 3: Navigation dùng `.id`
**File:** `employees/employee-form-page.tsx:100`
```typescript
// ❌ SAI
employeeId: employeeData.id || employee?.id

// ✅ SỬA
employeeId: employeeData.systemId || employee?.systemId
```

### Lỗi 4: Document Reference dùng `.id`
**File:** `orders/store.ts:178`
```typescript
// ❌ SAI
{
  originalDocumentId: order.id,  // ❌ Voucher sẽ không link được
  description: `Thanh toán cho đơn hàng ${order.id}`,  // ✅ OK - display only
}

// ✅ SỬA
{
  originalDocumentId: order.systemId,  // ✅ Dùng systemId
  description: `Thanh toán cho đơn hàng ${order.id}`,  // ✅ Display vẫn dùng .id
}
```

---

## 🎯 EXCEPTION - KHI NÀO DÙNG `.id` CHO LOGIC?

### 1. **Products** - `.id` = SKU (Business Key)
```typescript
// ✅ ĐÚNG - Product.id là SKU, dùng được cho logic
const product = products.find(p => p.id === 'SP123456');  // ✅ OK
const product = products.find(p => p.systemId === 'SP000001');  // ✅ Cũng OK

// Product có cả 2:
// - systemId: Internal key (SP000001)
// - id: SKU/Business key (SP123456) - User có thể nhập custom
```

### 2. **UI Components** - `doc.id`, `file.id`, `column.id`
```typescript
// ✅ ĐÚNG - Component internal IDs
const permanentFiles = getPermanentFiles(doc.id, doc.title);  // doc.id = 'id-card'
const columnIds = columns.map(c => c.id);  // c.id = 'select', 'actions', etc.
```

### 3. **Province/District/Ward** - Static Data
```typescript
// ✅ ĐÚNG - Địa danh dùng numeric ID
const province = provinces.find(p => p.id === '01');  // ✅ OK
const wards = getWardsByProvinceId(province.id);      // ✅ OK
```

---

## 📊 MIGRATION CHECKLIST

### Phase 1: CRITICAL Fixes (Làm ngay! 🔴)

#### A. Foreign Keys trong Store Logic
- [ ] `purchase-orders/form-page.tsx:489` - `purchaseOrderId: createdOrder.id` → `.systemId`
- [ ] `purchase-orders/form-page.tsx:531` - `processInventoryReceipt(createdOrder.id)` → `.systemId`
- [ ] `purchase-returns/form-page.tsx:396` - `purchaseOrderId: po.id` → `.systemId`
- [ ] `orders/store.ts:178` - `originalDocumentId: order.id` → `.systemId`
- [ ] `sales-returns/store.ts:210` - `originalDocumentId: newItemData.id` → `.systemId` hoặc giữ nguyên nếu đây là business ID
- [ ] `sales-returns/store.ts:282` - `documentId: newReturn.id` → `.systemId`
- [ ] `warranty/store.ts` - Multiple places với `documentId`, `linkedOrderId`

#### B. Store Queries (find, filter, some)
- [ ] `purchase-orders/page.tsx:130` - `a.purchaseOrderId === po.id` → `.systemId`
- [ ] `purchase-orders/page.tsx:153` - `r.purchaseOrderId === po.id` → `.systemId`
- [ ] `purchase-orders/page.tsx:154` - `pr.purchaseOrderId === po.id` → `.systemId`
- [ ] `purchase-orders/detail-page.tsx:633` - `findByPurchaseOrderId(purchaseOrder.id)` → `.systemId`
- [ ] `purchase-orders/detail-page.tsx:634` - `r.purchaseOrderId === purchaseOrder.id` → `.systemId`
- [ ] `vouchers/detail-page.tsx:208` - `p.id === alloc.purchaseOrderId` → `p.systemId`
- [ ] `vouchers/detail-page.tsx:219` - `po.id === voucher.originalDocumentId` → `po.systemId`

#### C. Navigation & Links
- [ ] `employees/employee-form-page.tsx:100` - `employeeId: employeeData.id` → `.systemId`

### Phase 2: HIGH Priority (Làm sau CRITICAL ⚠️)

#### D. Document References
- [ ] Review tất cả `originalDocumentId` xem đang dùng `.id` hay `.systemId`
- [ ] Review tất cả `linkedOrderId` 
- [ ] Review `voucher.allocations` với `purchaseOrderId`

#### E. Process Functions
- [ ] `processInventoryReceipt(id)` - Đảm bảo nhận systemId
- [ ] `confirmReceipt(id)` - Đảm bảo nhận systemId
- [ ] `addWithSideEffects` - Check tất cả foreign keys

### Phase 3: Testing (Sau khi fix ✅)

- [ ] Test tạo Purchase Order → Tạo Receipt → Verify link
- [ ] Test tạo Order → Tạo Payment → Verify link trong Voucher
- [ ] Test tạo Sales Return → Verify link với Order gốc
- [ ] Test tạo Warranty → Tạo Payment → Verify link
- [ ] Test navigation: Click vào table row → Đúng detail page
- [ ] Test filter: Lọc vouchers theo originalDocumentId
- [ ] Test delete cascade: Xóa order → Check related records

---

## 🛠️ CÁCH FIX NHANH

### Template 1: Foreign Key Assignment
```typescript
// Find: (\w+Id): (\w+)\.id([,\s])
// Replace: $1: $2.systemId$3

// Before:
purchaseOrderId: order.id,
supplierSystemId: supplier.systemId,

// After:
purchaseOrderId: order.systemId,
supplierSystemId: supplier.systemId,
```

### Template 2: Store Queries
```typescript
// Find: === (\w+)\.id\)
// Replace: === $1.systemId)

// Before:
.find(a => a.purchaseOrderId === po.id)
.filter(r => r.purchaseOrderId === po.id)

// After:
.find(a => a.purchaseOrderId === po.systemId)
.filter(r => r.purchaseOrderId === po.systemId)
```

### Template 3: Process Functions
```typescript
// Find: process\w+\((\w+)\.id\)
// Replace: process...$1.systemId)

// Before:
processInventoryReceipt(order.id);

// After:
processInventoryReceipt(order.systemId);
```

---

## 🎓 BEST PRACTICES

### 1. Khi tạo Entity mới
```typescript
// ✅ Template chuẩn
const newEntity = {
  systemId: '',  // ← Store sẽ generate (EMP00000001, ORD00000001) - Prefix TIẾNG ANH
  id: '',        // ← Store sẽ generate (NV000001, DH000001) - Prefix TIẾNG VIỆT, HOẶC user input
  name: 'Example',
  relatedEntitySystemId: relatedEntity.systemId,  // ✅ Luôn dùng systemId
  // ...
}

// VÍ DỤ CỤ THỂ:
// Employee: systemId = 'EMP00000005', id = 'NV000005'
// Order: systemId = 'ORD00000123', id = 'DH000123'
// Product: systemId = 'PROD00000456', id = 'SP000456'
```

### 2. Khi lưu Foreign Key
```typescript
// ✅ Convention: *SystemId = Internal reference
{
  orderSystemId: order.systemId,        // ✅ Naming rõ ràng
  customerSystemId: customer.systemId,
  branchSystemId: branch.systemId,
}

// ❌ TRÁNH: *Id không rõ ràng
{
  orderId: ???,           // ❌ Không biết là systemId hay business ID?
  customerId: ???,        // ❌ Gây confusion
}

// ⚠️ EXCEPTION: Backward compatibility
{
  purchaseOrderId: order.systemId,  // ⚠️ Naming cũ, nhưng giá trị phải là systemId
}
```

### 3. Khi query/filter
```typescript
// ✅ Luôn dùng systemId
const filtered = allOrders.filter(o => o.customerSystemId === customer.systemId);
const found = allVouchers.find(v => v.originalDocumentId === order.systemId);
const related = receipts.filter(r => r.purchaseOrderId === po.systemId);
```

### 4. Khi navigate
```typescript
// ✅ Luôn dùng systemId trong URL
navigate(`/orders/${order.systemId}`);
<Link to={`/employees/${employee.systemId}`} />

// ✅ Display ID trong text
<span>Đơn hàng {order.id}</span>
<Link to={`/orders/${order.systemId}`}>{order.id}</Link>
```

---

## 📝 NOTES

### Tại sao cần `id` nếu đã có `systemId`?

1. **UX**: User muốn thấy ID ngắn gọn (DH00001, NV001, PT002)
2. **Custom ID**: Một số nghiệp vụ cho phép user nhập ID tùy chỉnh
3. **Migration**: Hệ thống cũ dùng business ID, cần maintain backward compatibility
4. **Display**: Breadcrumbs, logs, exports cần ID dễ đọc

### Tại sao không merge 2 field thành 1?

**Đã cân nhắc nhưng KHÔNG KHẢ THI vì:**
- Store factory cần `systemId` as unique key
- URL routing cần stable identifier
- Cascade updates phức tạp nếu user đổi business ID
- Foreign keys cần immutable reference

### Hệ quả nếu dùng sai?

```typescript
// ❌ SAI: Dùng .id cho foreign key
{
  purchaseOrderId: order.id  // = "DH000005"
}

// Khi query:
receipts.filter(r => r.purchaseOrderId === order.systemId)
// Tìm: purchaseOrderId = "DH0000005" (systemId)
// Trong DB: purchaseOrderId = "DH000005" (business ID)
// → KHÔNG MATCH! → Mất link!
```

---

## 🚀 TRIỂN KHAI

### Bước 1: Fix CRITICAL (1-2 giờ)
1. Fix foreign keys trong store logic
2. Fix store queries (find, filter)
3. Test basic flow: Create → Link → Query

### Bước 2: Fix HIGH (1 giờ)
1. Fix navigation
2. Fix document references
3. Test navigation flow

### Bước 3: Testing (1 giờ)
1. Test từng module theo checklist
2. Verify links không bị broken
3. Check console errors

### Bước 4: Document (30 phút)
1. Update type definitions nếu cần
2. Add JSDoc comments cho clarity
3. Create migration completion doc

---

**Total Time Estimate:** 3.5 - 4.5 hours

**Priority Order:**
1. 🔴 Foreign keys (GÂY LỖI NGAY)
2. 🟠 Store queries (GÂY LỖI KHI FILTER)
3. 🟡 Navigation (UX issue)
4. 🟢 Documentation (Clarity)

---

## 📞 CONTACT

**Issues/Questions:**
- Không chắc field nào? → Check type definition
- Không biết fix như nào? → Tham khảo templates ở trên
- Test failed? → Check console errors, verify data migration

**Last Updated:** November 11, 2025
