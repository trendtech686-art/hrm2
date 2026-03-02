# 📦 KIỂM TRA & CẢI TIẾN HỆ THỐNG TỒN KHO SẢN PHẨM

> **Ngày tạo:** 03/02/2026  
> **Mục đích:** Rà soát toàn bộ logic tồn kho, StockHistory và các chức năng liên quan đến sản phẩm

---

## 📊 1. TỔNG QUAN MÔ HÌNH TỒN KHO

### 1.1 ProductInventory Schema
```prisma
model ProductInventory {
  productId  String
  branchId   String
  onHand     Int      @default(0)  // Tồn kho thực tế
  committed  Int      @default(0)  // Đang GD - đã đặt hàng, chờ xuất
  inTransit  Int      @default(0)  // Đang về - hàng đang chuyển về kho
  inDelivery Int      @default(0)  // Đang giao - hàng đã xuất, đang ship
  
  @@id([productId, branchId])
}
```

### 1.2 Công thức tính toán
| Chỉ số | Công thức | Ý nghĩa |
|--------|-----------|---------|
| **Có thể bán** | `onHand - committed` | Số lượng có thể đặt thêm |
| **Tồn thực tế** | `onHand + inDelivery` | Tổng hàng thuộc shop (kể cả đang ship) |
| **Hàng sắp có** | `inTransit` | Hàng đang về từ nhập/chuyển kho |

---

## 📋 2. TRẠNG THÁI HIỆN TẠI CỦA CÁC API

### 2.1 Order Flows (Đơn hàng)

| API | Action | onHand | committed | inTransit | inDelivery | StockHistory |
|-----|--------|:------:|:---------:|:---------:|:----------:|:------------:|
| `POST /api/orders` | Tạo đơn | - | ✅ +qty | - | - | ✅ |
| `POST .../cancel` | Hủy đơn | ✅ +qty (if restock) | ✅ -qty | - | ✅ -qty (if restock) | ✅ (if restock) |
| `POST .../dispatch` | Xuất kho | ✅ -qty | ✅ -qty | - | ✅ +qty | ✅ |
| `POST .../confirm-pickup` | Khách nhận | ✅ -qty | ✅ -qty | - | - | ✅ |
| `POST .../complete-delivery` | Giao thành công | - | - | - | ✅ -qty | ✅ |
| `POST .../cancel-delivery` | Hủy giao hàng | ✅ +qty | - | - | ✅ -qty | ✅ |
| `POST .../in-store-pickup/confirm` | Nhận tại cửa hàng | ✅ -qty | ✅ -qty | - | - | ✅ |

### 2.2 Sales Returns Flows (Trả/Đổi hàng)

| API | Action | onHand | committed | inTransit | inDelivery | StockHistory |
|-----|--------|:------:|:---------:|:---------:|:----------:|:------------:|
| `POST /api/sales-returns` | Nhận hàng trả | ✅ +qty | - | - | - | ✅ |
| `POST /api/sales-returns` | Xuất hàng đổi | ✅ -qty | - | - | - | ✅ |
| `POST .../receive` | Nhận hàng trả | ✅ +qty | - | - | - | ✅ |
| `POST .../exchange` | Đổi hàng (nhập cũ) | ✅ +qty | - | - | - | ✅ |
| `POST .../exchange` | Đổi hàng (xuất mới) | ✅ -qty | - | - | - | ✅ |

### 2.3 Purchase Returns Flows (Trả hàng NCC)

| API | Action | onHand | committed | inTransit | inDelivery | StockHistory |
|-----|--------|:------:|:---------:|:---------:|:----------:|:------------:|
| `POST /api/purchase-returns` | Trả hàng NCC | ✅ -qty | - | - | - | ✅ |
| `PATCH .../[systemId]` | Hủy trả NCC | ✅ +qty | - | - | - | ✅ |
| `DELETE .../[systemId]` | Xóa trả NCC | ✅ +qty | - | - | - | ✅ |

### 2.4 Stock Transfers Flows (Chuyển kho) ✅ **ĐÃ SỬA**

| API | Action | onHand | committed | inTransit | inDelivery | StockHistory |
|-----|--------|:------:|:---------:|:---------:|:----------:|:------------:|
| `POST .../start` | Bắt đầu chuyển | ✅ -qty | - | ✅ +qty | - | ✅ |
| `POST .../complete` | Hoàn tất chuyển | ✅ +qty (dest) | - | ✅ -qty | - | ✅ |
| `POST .../cancel` | Hủy chuyển | ✅ +qty | - | ✅ -qty | - | ✅ |

### 2.5 Purchase Orders / Inventory Receipts (Nhập hàng)

| API | Action | onHand | committed | inTransit | inDelivery | StockHistory |
|-----|--------|:------:|:---------:|:---------:|:----------:|:------------:|
| `POST /api/products` | Tạo SP mới | ✅ create | - | - | - | ✅ |
| `PATCH .../inventory` | Cập nhật tồn kho | ✅ update | - | - | - | ✅ |

---

## 🔴 3. CÁC LỖI ĐÃ SỬA

### 3.1 ✅ Stock Transfers - ĐÃ SỬA (03/02/2026)
**Files đã sửa:**
- `app/api/stock-transfers/[systemId]/start/route.ts`
- `app/api/stock-transfers/[systemId]/complete/route.ts`
- `app/api/stock-transfers/[systemId]/cancel/route.ts`

**Thay đổi:**
- Chuyển từ `Product.inventoryByBranch` sang `ProductInventory` table
- Thêm `StockHistory` records cho tất cả actions

---

### 3.2 ✅ StockHistory khi tạo đơn hàng - ĐÃ SỬA (03/02/2026)
**File:** `app/api/orders/route.ts`

**Thay đổi:**
- Thêm `StockHistory` với action "Đặt hàng" khi tăng committed

---

### 3.3 ✅ StockHistory khi giao hàng thành công - ĐÃ SỬA (03/02/2026)
**File:** `app/api/orders/[systemId]/packaging/[packagingId]/complete-delivery/route.ts`

**Thay đổi:**
- Thêm `StockHistory` với action "Giao hàng thành công" khi giảm inDelivery

---

## 🟡 4. CÁC VẤN ĐỀ ĐÃ XEM XÉT VÀ SỬA

### 4.1 ✅ Logic đổi hàng tăng committed - ĐÃ SỬA (03/02/2026)
**File:** `app/api/sales-returns/[systemId]/exchange/route.ts`

**Trước:**
```typescript
data: {
  onHand: { decrement: newQuantity },
  committed: { increment: newQuantity }, // ⚠️ Sai - không cần
}
```

**Sau:**
```typescript
data: {
  onHand: { decrement: newQuantity },
  // Bỏ committed - vì hàng đã xuất trực tiếp cho khách
}
```

---

### 4.2 ✅ Inventory Receipt tự động cập nhật - ĐÃ SỬA (03/02/2026)
**File:** `app/api/inventory-receipts/route.ts`

**Trước:** Tạo phiếu nhập nhưng không tự động cập nhật `ProductInventory`

**Sau:**
```typescript
// Auto-update ProductInventory for each item
for (const item of items) {
  await tx.productInventory.upsert({
    where: { productId_branchId: { productId: item.productId, branchId } },
    update: { onHand: { increment: item.quantity } },
    create: { productId: item.productId, branchId, onHand: item.quantity }
  });
  
  await tx.stockHistory.create({
    data: {
      productId: item.productId,
      branchId,
      action: 'Nhập kho',
      quantityChange: item.quantity,
      reference: `Phiếu nhập ${receipt.id}`,
      referenceId: receipt.systemId
    }
  });
}
```

---

## ✅ 5. CÁC CHỨC NĂNG ĐÃ HOẠT ĐỘNG TỐT

| Chức năng | File | Trạng thái |
|-----------|------|------------|
| Xuất kho giao hàng | dispatch/route.ts | ✅ OK |
| Hủy đơn hàng | cancel/route.ts | ✅ OK |
| Hủy giao hàng | cancel-delivery/route.ts | ✅ OK |
| Nhận hàng tại cửa hàng | in-store-pickup/confirm/route.ts | ✅ OK |
| Nhận hàng trả | receive/route.ts | ✅ OK |
| Đổi hàng | exchange/route.ts | ✅ OK (cần xem xét committed) |
| Trả hàng NCC | purchase-returns/route.ts | ✅ OK |
| Hủy/Xóa trả NCC | purchase-returns/[systemId]/route.ts | ✅ OK |

---

## 📝 6. DANH SÁCH ACTION TRONG STOCK HISTORY

| Action | Mô tả | quantityChange |
|--------|-------|----------------|
| `Khởi tạo sản phẩm` | Import/tạo mới SP | 0 hoặc + |
| `Nhập kho` | Nhập từ NCC | + |
| `Đặt hàng` | Giữ hàng cho đơn (chỉ tăng committed) | 0 |
| `Xuất kho giao hàng` | Đơn hàng xuất đi | - |
| `Giao hàng thành công` | Shipper đã giao | 0 |
| `Xuất kho khách nhận` | Khách nhận tại cửa hàng | - |
| `Nhập kho trả hàng` | Khách trả lại | + |
| `Nhập kho hủy đơn` | Hủy đơn, nhập lại | + |
| `Xuất kho đổi hàng` | Đổi hàng mới cho khách | - |
| `Nhập kho đổi hàng` | Nhận hàng cũ từ khách | + |
| `Chuyển kho (xuất)` | Chuyển sang chi nhánh khác | - |
| `Chuyển kho (nhập)` | Nhận từ chi nhánh khác | + |
| `Điều chỉnh tăng` | Kiểm kê phát hiện thừa | + |
| `Điều chỉnh giảm` | Kiểm kê phát hiện thiếu | - |
| `Xuất kho trả NCC` | Trả hàng cho nhà cung cấp | - |
| `Nhập kho hủy trả NCC` | Hủy trả NCC | + |

---

## 📐 7. UI HIỂN THỊ TỒN KHO

### 7.1 Bảng Tồn kho (theo chi nhánh)
| Cột | Nguồn dữ liệu | Công thức |
|-----|---------------|-----------|
| Tồn kho | `ProductInventory.onHand` | - |
| Giá vốn | `onHand × costPrice` | - |
| Có thể bán | `onHand - committed` | - |
| Đang GD | `ProductInventory.committed` | - |
| Đang về | `ProductInventory.inTransit` | - |
| Đang giao | `ProductInventory.inDelivery` | - |
| Tổng đã bán | `Product.totalSold` | - |
| Tồn tối thiểu | `Product.reorderLevel` | - |
| Tồn tối đa | `Product.maxStock` | - |
| Điểm lưu kho | `Product.warehouseLocation` | - |

### 7.2 Cảnh báo
| Điều kiện | Icon | Màu |
|-----------|------|-----|
| `onHand = 0` | 🔴 | Red - Hết hàng |
| `onHand ≤ reorderLevel` | 🟠 | Orange - Sắp hết |
| `onHand > maxStock` | 🔵 | Blue - Tồn cao |
| `onHand < 0` | ⚠️ | Yellow - Lỗi dữ liệu |

---

## 🎯 8. CHECKLIST THỰC HIỆN

### Phase 1: Sửa lỗi Critical
- [x] Fix Stock Transfers dùng ProductInventory thay vì Product fields ✅ **DONE**
- [x] Thêm StockHistory cho Stock Transfers ✅ **DONE**
- [x] Thêm StockHistory cho tạo đơn hàng (committed) ✅ **DONE**
- [x] Thêm StockHistory cho complete-delivery ✅ **DONE**

### Phase 2: Cải thiện
- [x] Xem xét lại logic committed trong exchange ✅ **FIXED** - Bỏ increment committed
- [x] Auto-update ProductInventory trong inventory-receipts ✅ **DONE**

### Phase 3: UI/UX
- [x] Hiển thị cảnh báo tồn kho trên product detail ✅ **DONE** - Màu + icon cho hết/sắp hết/tồn cao/âm
- [x] Click vào "Đang GD" hiện danh sách đơn hàng liên quan ✅ **ĐÃ CÓ** - CommittedStockDialog
- [x] Click vào "Đang về" hiện danh sách phiếu chuyển kho ✅ **DONE** - InTransitStockDialog rewritten

---

## 📚 9. THAM KHẢO

- Schema: `prisma/schema/inventory/product-inventory.prisma`
- API Products: `app/api/products/`
- API Orders: `app/api/orders/`
- API Sales Returns: `app/api/sales-returns/`
- API Stock Transfers: `app/api/stock-transfers/`
- UI Product Detail: `features/products/detail-page.tsx`
