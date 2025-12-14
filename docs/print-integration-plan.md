# Kế Hoạch Tích Hợp Chức Năng In

## Tổng Quan

Mapping dữ liệu từ các trang chi tiết sang mẫu in tương ứng.

---

## 1. Đơn Bán Hàng (Order) ✅ Template có sẵn

**File:** `features/orders/order-detail-page.tsx`  
**Template:** `order`  
**Nút In:** Dòng 2332 - hiện chưa hoạt động ("Chức năng đang phát triển")

### Mapping dữ liệu:

| Variable | Source Field | Mô tả |
|----------|-------------|-------|
| `{store_logo}` | `settings.storeLogo` | Logo cửa hàng |
| `{store_name}` | `settings.storeName` | Tên cửa hàng |
| `{store_address}` | `settings.storeAddress` | Địa chỉ |
| `{store_phone_number}` | `settings.storePhone` | SĐT |
| `{store_email}` | `settings.storeEmail` | Email |
| `{order_code}` | `order.code` | Mã đơn hàng |
| `{created_on}` | `order.createdAt` | Ngày tạo |
| `{created_on_time}` | `order.createdAt` | Giờ tạo |
| `{account_name}` | `order.createdBy` | Người tạo |
| `{customer_name}` | `order.customer.name` | Tên KH |
| `{customer_code}` | `order.customer.code` | Mã KH |
| `{customer_phone_number}` | `order.customer.phone` | SĐT KH |
| `{customer_group}` | `order.customer.group` | Nhóm KH |
| `{billing_address}` | `order.billingAddress` | Địa chỉ hóa đơn |
| `{shipping_address}` | `order.shippingAddress` | Địa chỉ giao |
| `{line_*}` | `order.items[i].*` | Thông tin từng sản phẩm (loop) |
| `{total_quantity}` | `order.totalQuantity` | Tổng SL |
| `{total}` | `order.subtotal` | Tổng tiền hàng |
| `{total_discount}` | `order.totalDiscount` | Tổng CK |
| `{total_tax}` | `order.totalTax` | Tổng thuế |
| `{delivery_fee}` | `order.deliveryFee` | Phí ship |
| `{total_amount}` | `order.total` | Tổng cộng |
| `{total_text}` | `numberToWords(order.total)` | Bằng chữ |
| `{payment_name}` | `order.paymentMethod` | PTTT |
| `{payment_customer}` | `order.paidAmount` | Tiền đưa |
| `{money_return}` | `order.changeAmount` | Tiền thừa |
| `{order_note}` | `order.note` | Ghi chú |

---

## 2. Phiếu Thu (Receipt) ✅ Template có sẵn

**File:** `features/receipts/` (cần kiểm tra)  
**Template:** `receipt`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{receipt_voucher_code}` | `receipt.code` |
| `{created_on}` | `receipt.createdAt` |
| `{object_name}` | `receipt.payerName` |
| `{description}` | `receipt.description` |
| `{amount}` | `receipt.amount` |
| `{amount_text}` | `numberToWords(receipt.amount)` |
| `{payment_method}` | `receipt.paymentMethod` |
| `{note}` | `receipt.note` |
| `{account_name}` | `receipt.createdBy` |

---

## 3. Phiếu Chi (Payment) ✅ Template có sẵn

**File:** `features/payments/`  
**Template:** `payment`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{payment_voucher_code}` | `payment.code` |
| `{created_on}` | `payment.createdAt` |
| `{object_name}` | `payment.recipientName` |
| `{description}` | `payment.description` |
| `{amount}` | `payment.amount` |
| `{amount_text}` | `numberToWords(payment.amount)` |
| `{payment_method}` | `payment.paymentMethod` |
| `{note}` | `payment.note` |
| `{account_name}` | `payment.createdBy` |

---

## 4. Phiếu Bảo Hành (Warranty) ✅ Template có sẵn

**File:** `features/warranty/warranty-detail-page.tsx`  
**Template:** `warranty`  
**Nút In:** Dòng 250, 479

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{warranty_code}` | `ticket.code` |
| `{created_on}` | `ticket.createdAt` |
| `{customer_name}` | `ticket.customerName` |
| `{customer_phone_number}` | `ticket.customerPhone` |
| `{line_product_name}` | `ticket.productName` |
| `{line_variant}` | `ticket.variantName` |
| `{serial_number}` | `ticket.serialNumber` |
| `{warranty_period}` | `ticket.warrantyPeriod` |
| `{warranty_end_date}` | `ticket.warrantyEndDate` |
| `{issue_description}` | `ticket.issueDescription` |
| `{warranty_note}` | `ticket.note` |
| `{account_name}` | `ticket.createdBy` |

---

## 5. Phiếu Kiểm Kho (Inventory Check) ✅ Template có sẵn

**File:** `features/inventory-checks/`  
**Template:** `inventory-check`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{inventory_code}` | `check.code` |
| `{created_on}` | `check.createdAt` |
| `{location_name}` | `check.locationName` |
| `{line_variant_code}` | `item.variantCode` |
| `{line_product_name}` | `item.productName` |
| `{line_on_hand}` | `item.onHand` |
| `{line_real_quantity}` | `item.realQuantity` |
| `{line_difference}` | `item.difference` |
| `{line_note}` | `item.note` |
| `{inventory_note}` | `check.note` |
| `{account_name}` | `check.createdBy` |

---

## 6. Phiếu Chuyển Kho (Stock Transfer) ✅ Template có sẵn

**File:** `features/stock-transfers/detail-page.tsx`  
**Template:** `stock-transfer`  
**Nút In:** Dòng 249

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{transfer_code}` | `transfer.code` |
| `{created_on}` | `transfer.createdAt` |
| `{source_location_name}` | `transfer.sourceLocation` |
| `{target_location_name}` | `transfer.targetLocation` |
| `{line_variant_code}` | `item.variantCode` |
| `{line_product_name}` | `item.productName` |
| `{line_unit}` | `item.unit` |
| `{line_quantity}` | `item.quantity` |
| `{transfer_note}` | `transfer.note` |
| `{account_name}` | `transfer.createdBy` |

---

## 7. Đơn Đổi Trả (Sales Return) ✅ Template có sẵn

**File:** `features/sales-returns/`  
**Template:** `sales-return`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{order_return_code}` | `return.code` |
| `{created_on}` | `return.createdAt` |
| `{order_code}` | `return.orderCode` |
| `{customer_name}` | `return.customerName` |
| `{customer_phone_number}` | `return.customerPhone` |
| `{line_product_name}` | `item.productName` |
| `{line_variant}` | `item.variantName` |
| `{line_quantity}` | `item.quantity` |
| `{line_price}` | `item.price` |
| `{line_amount}` | `item.amount` |
| `{reason_return}` | `return.reason` |
| `{refund_status}` | `return.refundStatus` |
| `{total_refund}` | `return.totalRefund` |
| `{account_name}` | `return.createdBy` |

---

## 8. Đơn Đặt Hàng Nhập (Purchase Order) ✅ Template có sẵn

**File:** `features/purchase-orders/`  
**Template:** `purchase-order`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{order_supplier_code}` | `po.code` |
| `{created_on}` | `po.createdAt` |
| `{expected_on}` | `po.expectedDate` |
| `{supplier_name}` | `po.supplierName` |
| `{supplier_address}` | `po.supplierAddress` |
| `{supplier_phone_number}` | `po.supplierPhone` |
| `{line_variant_code}` | `item.variantCode` |
| `{line_product_name}` | `item.productName` |
| `{line_unit}` | `item.unit` |
| `{line_quantity}` | `item.quantity` |
| `{line_price}` | `item.price` |
| `{line_amount}` | `item.amount` |
| `{total_quantity}` | `po.totalQuantity` |
| `{total_amount}` | `po.total` |
| `{order_supplier_note}` | `po.note` |
| `{account_name}` | `po.createdBy` |

---

## 9. Phiếu Đóng Gói (Packing) ✅ Template có sẵn

**File:** `features/packaging/`  
**Template:** `packing`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{fulfillment_code}` | `pack.code` |
| `{created_on}` | `pack.createdAt` |
| `{order_code}` | `pack.orderCode` |
| `{customer_name}` | `pack.customerName` |
| `{customer_phone_number}` | `pack.customerPhone` |
| `{shipping_address}` | `pack.shippingAddress` |
| `{line_variant_code}` | `item.variantCode` |
| `{line_product_name}` | `item.productName` |
| `{line_variant}` | `item.variantName` |
| `{line_quantity}` | `item.quantity` |
| `{bin_location}` | `item.binLocation` |
| `{cod}` | `pack.codAmount` |
| `{packing_note}` | `pack.note` |
| `{account_name}` | `pack.createdBy` |

---

## 10. Phiếu Giao Hàng (Delivery) ✅ Template có sẵn

**File:** `features/shipments/columns.tsx`  
**Template:** `delivery`  
**Nút In:** Dòng 108-109

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{fulfillment_code}` | `shipment.code` |
| `{created_on}` | `shipment.createdAt` |
| `{order_code}` | `shipment.orderCode` |
| `{shipment_code}` | `shipment.trackingCode` |
| `{carrier_name}` | `shipment.carrierName` |
| `{customer_name}` | `shipment.recipientName` |
| `{customer_phone_number}` | `shipment.recipientPhone` |
| `{shipping_address}` | `shipment.address` |
| `{line_product_name}` | `item.productName` |
| `{line_variant}` | `item.variantName` |
| `{line_quantity}` | `item.quantity` |
| `{cod}` | `shipment.codAmount` |
| `{delivery_note}` | `shipment.note` |
| `{account_name}` | `shipment.createdBy` |

---

## 11. Nhãn Giao Hàng (Shipping Label) ✅ Template có sẵn

**File:** `features/shipments/`  
**Template:** `shipping-label`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{store_name}` | `settings.storeName` |
| `{store_phone_number}` | `settings.storePhone` |
| `{store_address}` | `settings.storeAddress` |
| `{order_code}` | `shipment.orderCode` |
| `{shipment_code}` | `shipment.trackingCode` |
| `{carrier_name}` | `shipment.carrierName` |
| `{customer_name}` | `shipment.recipientName` |
| `{customer_phone_number}` | `shipment.recipientPhone` |
| `{shipping_address}` | `shipment.address` |
| `{cod}` | `shipment.codAmount` |
| `{total_quantity}` | `shipment.totalItems` |
| `{weight_kg}` | `shipment.weight` |
| `{delivery_note}` | `shipment.note` |

---

## 12. Phiếu Nhập Kho (Stock In) ✅ Template có sẵn

**File:** `features/inventory-receipts/`  
**Template:** `stock-in`

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{stock_in_code}` | `receipt.code` |
| `{created_on}` | `receipt.createdAt` |
| `{supplier_name}` | `receipt.supplierName` |
| `{location_name}` | `receipt.locationName` |
| `{order_supplier_code}` | `receipt.poCode` |
| `{line_variant_code}` | `item.variantCode` |
| `{line_product_name}` | `item.productName` |
| `{line_unit}` | `item.unit` |
| `{line_quantity}` | `item.orderedQuantity` |
| `{line_received_quantity}` | `item.receivedQuantity` |
| `{line_price}` | `item.price` |
| `{line_amount}` | `item.amount` |
| `{total_quantity}` | `receipt.totalQuantity` |
| `{total_amount}` | `receipt.total` |
| `{stock_in_note}` | `receipt.note` |
| `{account_name}` | `receipt.createdBy` |

---

## 13. Phiếu Trả Hàng NCC (Supplier Return) ✅ Template có sẵn

**File:** `features/purchase-returns/detail-page.tsx`  
**Template:** `supplier-return`  
**Nút In:** Dòng 121

### Mapping dữ liệu:

| Variable | Source Field |
|----------|-------------|
| `{return_supplier_code}` | `return.code` |
| `{created_on}` | `return.createdAt` |
| `{supplier_name}` | `return.supplierName` |
| `{supplier_address}` | `return.supplierAddress` |
| `{line_variant_code}` | `item.variantCode` |
| `{line_product_name}` | `item.productName` |
| `{line_variant}` | `item.variantName` |
| `{line_quantity}` | `item.quantity` |
| `{line_price}` | `item.price` |
| `{line_amount}` | `item.amount` |
| `{reason_return}` | `return.reason` |
| `{total_quantity}` | `return.totalQuantity` |
| `{total_amount}` | `return.total` |
| `{account_name}` | `return.createdBy` |

---

## 14. Phiếu Báo Giá (Quote) ✅ Template có sẵn

**File:** Cần tạo hoặc tích hợp vào Order  
**Template:** `quote`

---

## 15. Phiếu Khiếu Nại (Complaint) ✅ Template có sẵn

**File:** `features/complaints/`  
**Template:** `complaint`

---

## 16. Phiếu Phạt (Penalty) ✅ Template có sẵn

**File:** Cần tạo feature  
**Template:** `penalty`

---

## Kế Hoạch Triển Khai

### Phase 1: Tạo Print Service (shared)
1. Tạo `lib/print-service.ts` - service xử lý in
2. Hỗ trợ: lấy template, replace variables, render HTML, gọi print

### Phase 2: Tích hợp từng trang (ưu tiên)
1. ✅ Đơn bán hàng (Order) - trang được dùng nhiều nhất
2. ✅ Phiếu giao hàng (Delivery)
3. ✅ Nhãn giao hàng (Shipping Label)
4. ✅ Phiếu bảo hành (Warranty)
5. ✅ Phiếu thu/chi (Receipt/Payment)

### Phase 3: Các trang còn lại
- Phiếu kiểm kho
- Phiếu chuyển kho
- Đơn đặt hàng nhập
- Phiếu nhập kho
- Phiếu trả hàng NCC
- Đơn đổi trả
- Phiếu đóng gói

---

## Helper Functions Cần Tạo

```typescript
// lib/print-service.ts

// Format số tiền
formatCurrency(amount: number): string

// Chuyển số sang chữ
numberToWords(amount: number): string

// Format ngày
formatDate(date: string | Date): string

// Format giờ
formatTime(date: string | Date): string

// Lấy template và replace variables
generatePrintContent(templateType: TemplateType, data: Record<string, any>): string

// In với template
printDocument(templateType: TemplateType, data: Record<string, any>, paperSize?: PaperSize): void
```

---

## Ước Lượng Thời Gian

| Task | Thời gian |
|------|-----------|
| Print Service | 2-3 giờ |
| Đơn bán hàng | 2 giờ |
| Phiếu giao hàng + Nhãn | 2 giờ |
| Phiếu bảo hành | 1 giờ |
| Phiếu thu/chi | 1 giờ |
| Các trang còn lại | 4-5 giờ |
| **Tổng** | **~15 giờ** |
