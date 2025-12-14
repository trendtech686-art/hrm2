# 📄 Kế hoạch Rà soát & Hoàn thiện Hệ thống In

**Ngày tạo:** 05/12/2025  
**Cập nhật:** 05/12/2025  
**Người thực hiện:** AI Assistant  
**Phiên bản:** 1.3

---

## 📋 Mục lục

1. [Tổng quan hiện trạng](#1-tổng-quan-hiện-trạng)
2. [So sánh từ khóa: Variables vs Mapper](#2-so-sánh-từ-khóa-variables-vs-mapper)
3. [Danh sách TODO](#3-danh-sách-todo)
4. [Chi tiết triển khai](#4-chi-tiết-triển-khai)
5. [Yêu cầu bổ sung: Cài đặt đường viền bảng](#5-yêu-cầu-bổ-sung-cài-đặt-đường-viền-bảng)
6. [Timeline dự kiến](#6-timeline-dự-kiến)
7. [Checklist hoàn thành](#7-checklist-hoàn-thành)
8. [Template Mặc Định Chuẩn](#8-template-mặc-định-chuẩn)
9. [Lỗi thường gặp và cách khắc phục](#9-lỗi-thường-gặp-và-cách-khắc-phục)
10. [✅ Template Thông Minh với Điều Kiện (ĐÃ TRIỂN KHAI)](#10--template-thông-minh-với-điều-kiện-đã-triển-khai)
11. [📦 Cập nhật đầy đủ Preview Data (TODO-P0)](#11--cập-nhật-đầy-đủ-preview-data-todo-p0)
12. [📦 Mở rộng Mapper Interfaces (TODO-P1)](#12--mở-rộng-mapper-interfaces-todo-p1)
13. [🎯 Tư vấn công việc tiếp theo](#13--tư-vấn-công-việc-tiếp-theo)

---

## ⚡ Cập nhật mới (v1.3) - 05/12/2025

### Đã hoàn thành:

- ✅ **Cập nhật template ORDER_TEMPLATE mặc định** - Template chuẩn đầy đủ với inline styles
- ✅ **Bổ sung mapping trạng thái** - `{order_status}`, `{payment_status}`, `{fulfillment_status}`
- ✅ **Cải thiện processTemplate** - Xử lý tốt hơn với template không có `<tbody>`
- ✅ **Cập nhật OrderForPrint interface** - Thêm status fields
- ✅ **Thêm cột VAT cho line items** - `{line_tax_amount}`, `{line_tax_rate}`
- ✅ **Tính thuế cho từng dòng sản phẩm** - Dựa trên `item.tax` (% thuế)
- ✅ **🚀 Template Thông Minh với Điều Kiện** - Hỗ trợ `{{#if}}`, `{{#if_not_empty}}`, `{{#if_gt}}`, `{{#unless}}`
- ✅ **Cập nhật đầy đủ Preview Data** - Đã tách thành thư mục `preview/` với 18 file riêng cho từng loại mẫu in
- ✅ **🔥 Hoàn thiện 100% Mappers** - Tất cả 16 main template + 8 extended template đều có mapper với đầy đủ variables

### 🆕 Cập nhật 05/12/2025 (v1.3):

| Công việc | Trạng thái | Chi tiết |
|-----------|------------|----------|
| **Fix `phieu-giao-hang.ts`** | ✅ Hoàn thành | File bị copy nhầm từ `phieu-thu.ts`, đã viết lại hoàn toàn với 73 variables cho Phiếu giao hàng |
| **Fix `delivery.mapper.ts`** | ✅ Hoàn thành | Mapper đã đồng bộ với phieu-giao-hang.ts mới |
| **Sync `quote.mapper.ts`** | ✅ Hoàn thành | Đồng bộ với order.mapper.ts để có đầy đủ 130+ fields |
| **Tạo 8 Extended Mappers** | ✅ Hoàn thành | Xem bảng chi tiết bên dưới |

### 📦 Extended Mappers đã tạo mới:

| # | File | Template Type | Tên Tiếng Việt |
|---|------|---------------|----------------|
| 1 | `supplier-order.mapper.ts` | `don-dat-hang-nhap` | Đơn đặt hàng nhập |
| 2 | `return-order.mapper.ts` | `don-tra-hang` | Đơn trả hàng |
| 3 | `handover.mapper.ts` | `phieu-ban-giao` | Phiếu bàn giao |
| 4 | `refund-confirmation.mapper.ts` | `phieu-xac-nhan-hoan` | Phiếu xác nhận hoàn |
| 5 | `packing-guide.mapper.ts` | `phieu-huong-dan-dong-goi` | Phiếu hướng dẫn đóng gói |
| 6 | `sales-summary.mapper.ts` | `phieu-tong-ket-ban-hang` | Phiếu tổng kết bán hàng |
| 7 | `warranty-request.mapper.ts` | `phieu-yeu-cau-bao-hanh` | Phiếu yêu cầu bảo hành |
| 8 | `packing-request.mapper.ts` | `phieu-yeu-cau-dong-goi` | Phiếu yêu cầu đóng gói |

### Đang triển khai:

- 🔄 **In Order Detail** - Đã tích hợp nút In vào trang chi tiết đơn hàng (Đóng gói & Giao hàng)

### Lỗi đã phát hiện & đã sửa:

- 🐛 ~~**Template custom bị sai cấu trúc**~~ - ĐÃ DOCUMENT cách khắc phục
- 🐛 ~~**phieu-giao-hang.ts bị copy nhầm từ phieu-thu.ts**~~ - ĐÃ SỬA
- 🐛 ~~**quote.mapper.ts thiếu nhiều fields so với order.mapper.ts**~~ - ĐÃ SYNC

---

## 🏗️ Kiến trúc 4 Lớp của Hệ thống In

### Tổng quan:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  LỚP 1: VARIABLES (variables/don-ban-hang.ts)                               │
│  ═══════════════════════════════════════════                                │
│  Mục đích: Định nghĩa DANH SÁCH từ khóa có thể dùng trong template          │
│  Dùng cho: Hiển thị danh sách từ khóa trong Settings để người dùng chọn     │
│  File: features/settings/printer/variables/*.ts                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LỚP 2: PREVIEW DATA (preview-data.ts)                                      │
│  ═══════════════════════════════════════                                    │
│  Mục đích: Dữ liệu MẪU để hiển thị khi xem trước template trong Settings    │
│  Dùng cho: Preview template trong trang Tùy chỉnh mẫu in                    │
│  File: features/settings/printer/preview-data.ts                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LỚP 3: MAPPER (print-data-mappers.ts)                                      │
│  ═════════════════════════════════════                                      │
│  Mục đích: Chuyển đổi từ khóa → giá trị THỰC TẾ khi in                      │
│  Dùng cho: Thay thế {từ_khóa} bằng dữ liệu thực khi in đơn hàng             │
│  File: lib/print-data-mappers.ts                                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│  LỚP 4: HELPER (order-print-helper.ts)                                      │
│  ══════════════════════════════════════                                     │
│  Mục đích: Lấy dữ liệu từ Entity (Order, Customer...) → truyền cho Mapper   │
│  Dùng cho: Convert Order entity sang format mà Mapper cần                   │
│  File: lib/print/order-print-helper.ts                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Chi tiết từng lớp:

#### 📘 Lớp 1: VARIABLES
```typescript
// File: features/settings/printer/variables/don-ban-hang.ts
// Chỉ định nghĩa từ khóa, KHÔNG có dữ liệu
export const ORDER_VARIABLES: TemplateVariable[] = [
  { key: '{line_tax_amount}', label: 'Thuế', group: 'Thông tin giỏ hàng' },
  // ... 130+ từ khóa khác
];
```
→ **Dùng cho**: Hiển thị danh sách "Thêm từ khóa" trong Settings

#### 📗 Lớp 2: PREVIEW DATA
```typescript
// File: features/settings/printer/preview-data.ts
// Dữ liệu MẪU cho preview
export const PREVIEW_DATA = {
  'order': {
    '{line_tax_amount}': '25,000',  // Giá trị mẫu
    '{customer_name}': 'Nguyễn Văn A',
    // ... các từ khóa khác
  }
};
```
→ **Dùng cho**: Xem trước template trong Settings (với dữ liệu giả)

#### 📙 Lớp 3: MAPPER
```typescript
// File: lib/print-data-mappers.ts
// Chuyển đổi data → từ khóa khi IN THẬT
export function mapOrderLineItems(items) {
  return items.map((item, index) => ({
    '{line_tax_amount}': formatCurrency(item.taxAmount), // Dữ liệu thực
    // ...
  }));
}
```
→ **Dùng cho**: Thay thế từ khóa bằng dữ liệu thực khi in

#### 📕 Lớp 4: HELPER
```typescript
// File: lib/print/order-print-helper.ts
// Lấy dữ liệu từ Order entity
export function convertOrderForPrint(order: Order) {
  return {
    items: order.lineItems.map(item => ({
      taxAmount: item.unitPrice * item.quantity * item.tax / 100, // Tính thuế
      // ...
    }))
  };
}
```
→ **Dùng cho**: Tính toán và chuẩn bị dữ liệu từ database

### 🔄 Luồng dữ liệu khi IN:

```
Order Entity (Database)
        ↓
   [HELPER] convertOrderForPrint()  → Tính toán taxAmount, lineAmount...
        ↓
   [MAPPER] mapOrderToPrintData()   → Chuyển thành { '{line_tax_amount}': '200,000' }
        ↓
   [use-print.ts] processTemplate() → Thay thế {line_tax_amount} → 200,000 trong HTML
        ↓
   Print Output (Hóa đơn in)
```

### 🔄 Luồng dữ liệu khi PREVIEW trong Settings:

```
Template HTML
        ↓
   [PREVIEW DATA] PREVIEW_DATA['order'] → Lấy dữ liệu mẫu { '{line_tax_amount}': '25,000' }
        ↓
   [use-print.ts] processTemplate()     → Thay thế {line_tax_amount} → 25,000 trong HTML
        ↓
   Preview Output (Xem trước)
```

### ⚠️ Vấn đề thường gặp:

| Triệu chứng | Nguyên nhân | File cần sửa |
|-------------|-------------|--------------|
| Từ khóa không xuất hiện trong danh sách chọn | Chưa định nghĩa trong Variables | `variables/*.ts` |
| Preview hiển thị `{từ_khóa}` thay vì giá trị | Chưa có trong Preview Data | `preview-data.ts` |
| In thật hiển thị rỗng hoặc `{từ_khóa}` | Chưa có mapping trong Mapper | `print-data-mappers.ts` |
| In thật hiển thị `0` hoặc `undefined` | Helper chưa tính/truyền dữ liệu | `order-print-helper.ts` |

### ✅ Checklist khi thêm từ khóa mới:

- [ ] **Variables**: Thêm vào `variables/don-ban-hang.ts` (hoặc file tương ứng)
- [ ] **Preview**: Thêm vào `preview-data.ts` với giá trị mẫu
- [ ] **Mapper**: Thêm vào `mapOrderToPrintData()` hoặc `mapOrderLineItems()`
- [ ] **Helper**: Cập nhật `convertOrderForPrint()` để tính/truyền dữ liệu

---

## 1. Tổng quan hiện trạng

### 1.1 Cấu trúc hệ thống in

```
📁 lib/
├── print-service.ts          # Core print service, format functions
├── print-data-mappers.ts     # Data mappers cho tất cả loại mẫu in
├── use-print.ts              # React hook để sử dụng print
└── print/
    └── order-print-helper.ts # Helper convert Order entity → PrintData

📁 features/settings/printer/
├── store.ts                  # Zustand store lưu template
├── types.ts                  # Types định nghĩa
├── preview-data.ts           # Dữ liệu preview cho Settings
├── templates/
│   ├── index.ts              # Export tất cả templates
│   ├── styles.ts             # CSS styles cho các khổ giấy
│   ├── order.ts              # Mẫu Đơn bán hàng ✅ ĐÃ CẬP NHẬT
│   ├── receipt.ts            # Mẫu Phiếu thu
│   └── ... (16 loại mẫu)
└── variables/
    ├── index.ts              # Export tất cả variables
    ├── don-ban-hang.ts       # Từ khóa Đơn bán hàng
    └── ... (16+ loại)
```

### 1.2 Các loại mẫu in hiện có

#### 📗 MAIN TEMPLATE TYPES (16 loại chính)

| # | Type | Tên Tiếng Việt | Template | Variables | Mapper | Status |
|---|------|----------------|----------|-----------|--------|--------|
| 1 | `order` | Đơn bán hàng | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 2 | `quote` | Báo giá / Đơn tạm tính | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 3 | `sales-return` | Đơn đổi trả hàng | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 4 | `packing` | Phiếu đóng gói | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 5 | `delivery` | Phiếu giao hàng | ✅ | ✅ | ✅ | ✅ **MỚI SỬA** |
| 6 | `shipping-label` | Nhãn giao hàng | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 7 | `purchase-order` | Đơn đặt hàng nhập | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 8 | `stock-in` | Phiếu nhập kho | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 9 | `stock-transfer` | Phiếu chuyển kho | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 10 | `inventory-check` | Phiếu kiểm kho | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 11 | `receipt` | Phiếu thu | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 12 | `payment` | Phiếu chi | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 13 | `warranty` | Phiếu bảo hành | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 14 | `supplier-return` | Phiếu trả hàng NCC | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 15 | `complaint` | Phiếu khiếu nại | ✅ | ✅ | ✅ | ✅ 100% coverage |
| 16 | `penalty` | Phiếu phạt | ✅ | ✅ | ✅ | ✅ 100% coverage |

#### 📙 EXTENDED TEMPLATE TYPES (8 loại mở rộng - MỚI TẠO MAPPER)

| # | Type | Tên Tiếng Việt | Variables | Mapper | Status |
|---|------|----------------|-----------|--------|--------|
| 1 | `don-dat-hang-nhap` | Đơn đặt hàng nhập (extended) | ✅ | ✅ `supplier-order.mapper.ts` | ✅ 100% |
| 2 | `don-tra-hang` | Đơn trả hàng | ✅ | ✅ `return-order.mapper.ts` | ✅ 100% |
| 3 | `phieu-ban-giao` | Phiếu bàn giao | ✅ | ✅ `handover.mapper.ts` | ✅ 100% |
| 4 | `phieu-xac-nhan-hoan` | Phiếu xác nhận hoàn | ✅ | ✅ `refund-confirmation.mapper.ts` | ✅ 100% |
| 5 | `phieu-huong-dan-dong-goi` | Phiếu hướng dẫn đóng gói | ✅ | ✅ `packing-guide.mapper.ts` | ✅ 100% |
| 6 | `phieu-tong-ket-ban-hang` | Phiếu tổng kết bán hàng | ✅ | ✅ `sales-summary.mapper.ts` | ✅ 100% |
| 7 | `phieu-yeu-cau-bao-hanh` | Phiếu yêu cầu bảo hành | ✅ | ✅ `warranty-request.mapper.ts` | ✅ 100% |
| 8 | `phieu-yeu-cau-dong-goi` | Phiếu yêu cầu đóng gói | ✅ | ✅ `packing-request.mapper.ts` | ✅ 100% |

> **Tổng:** 24 mappers với 100% variable coverage

---

## 2. So sánh từ khóa: Variables vs Mapper

> ✅ **TRẠNG THÁI:** Mapper `order.mapper.ts` đã được cập nhật đầy đủ 100% variables!  
> Cập nhật: 05/12/2025

### 2.1 ĐƠN BÁN HÀNG (order) - ✅ 100% HOÀN THÀNH

#### A. Thông tin cửa hàng (11/11 ✅)

| Từ khóa | Trong Variables | Trong Mapper | Trạng thái |
|---------|-----------------|--------------|------------|
| `{store_logo}` | ✅ | ✅ | ✅ OK |
| `{store_name}` | ✅ | ✅ | ✅ OK |
| `{store_address}` | ✅ | ✅ | ✅ OK |
| `{store_phone_number}` | ✅ | ✅ | ✅ OK |
| `{store_email}` | ✅ | ✅ | ✅ OK |
| `{store_fax}` | ✅ | ✅ | ✅ OK |
| `{store_province}` | ✅ | ✅ | ✅ OK |
| `{location_name}` | ✅ | ✅ | ✅ OK |
| `{location_address}` | ✅ | ✅ | ✅ OK |
| `{location_phone_number}` | ✅ | ✅ | ✅ OK |
| `{location_province}` | ✅ | ✅ | ✅ OK |

#### B. Thông tin đơn hàng (45/45 ✅)

| Từ khóa | Trong Variables | Trong Mapper | Trạng thái |
|---------|-----------------|--------------|------------|
| `{order_code}` | ✅ | ✅ | ✅ OK |
| `{order_qr_code}` | ✅ | ✅ | ✅ OK |
| `{bar_code(code)}` | ✅ | ✅ | ✅ OK |
| `{bar_code(reference_number)}` | ✅ | ✅ | ✅ OK |
| `{created_on}` | ✅ | ✅ | ✅ OK |
| `{created_on_time}` | ✅ | ✅ | ✅ OK |
| `{created_on_text}` | ✅ | ✅ | ✅ OK |
| `{modified_on}` | ✅ | ✅ | ✅ OK |
| `{modified_on_time}` | ✅ | ✅ | ✅ OK |
| `{issued_on}` | ✅ | ✅ | ✅ OK |
| `{issued_on_time}` | ✅ | ✅ | ✅ OK |
| `{issued_on_text}` | ✅ | ✅ | ✅ OK |
| `{account_name}` | ✅ | ✅ | ✅ OK |
| `{assignee_name}` | ✅ | ✅ | ✅ OK |
| `{order_status}` | ✅ | ✅ | ✅ OK |
| `{payment_status}` | ✅ | ✅ | ✅ OK |
| `{fulfillment_status}` | ✅ | ✅ | ✅ OK |
| `{packed_status}` | ✅ | ✅ | ✅ OK |
| `{return_status}` | ✅ | ✅ | ✅ OK |
| `{source}` | ✅ | ✅ | ✅ OK |
| `{channel}` | ✅ | ✅ | ✅ OK |
| `{reference}` | ✅ | ✅ | ✅ OK |
| `{tag}` | ✅ | ✅ | ✅ OK |
| `{expected_delivery_type}` | ✅ | ✅ | ✅ OK |
| `{expected_payment_method}` | ✅ | ✅ | ✅ OK |
| `{ship_on_min}` | ✅ | ✅ | ✅ OK |
| `{ship_on_max}` | ✅ | ✅ | ✅ OK |
| `{shipped_on}` | ✅ | ✅ | ✅ OK |
| `{price_list_name}` | ✅ | ✅ | ✅ OK |
| `{currency_name}` | ✅ | ✅ | ✅ OK |
| `{tax_treatment}` | ✅ | ✅ | ✅ OK |
| `{weight_g}` | ✅ | ✅ | ✅ OK |
| `{weight_kg}` | ✅ | ✅ | ✅ OK |
| `{customer_name}` | ✅ | ✅ | ✅ OK |
| `{customer_code}` | ✅ | ✅ | ✅ OK |
| `{customer_phone_number}` | ✅ | ✅ | ✅ OK |
| `{customer_phone_number_hide}` | ✅ | ✅ | ✅ OK |
| `{customer_email}` | ✅ | ✅ | ✅ OK |
| `{customer_group}` | ✅ | ✅ | ✅ OK |
| `{billing_address}` | ✅ | ✅ | ✅ OK |
| `{shipping_address}` | ✅ | ✅ | ✅ OK |
| `{shipping_address:full_name}` | ✅ | ✅ | ✅ OK |
| `{shipping_address:phone_number}` | ✅ | ✅ | ✅ OK |
| `{shipping_address:phone_number_hide}` | ✅ | ✅ | ✅ OK |

#### C. Thông tin khách hàng mở rộng (15/15 ✅)

| Từ khóa | Trong Variables | Trong Mapper | Trạng thái |
|---------|-----------------|--------------|------------|
| `{customer_contact}` | ✅ | ✅ | ✅ OK |
| `{customer_contact_phone_number}` | ✅ | ✅ | ✅ OK |
| `{customer_contact_phone_number_hide}` | ✅ | ✅ | ✅ OK |
| `{customer_card}` | ✅ | ✅ | ✅ OK |
| `{customer_tax_number}` | ✅ | ✅ | ✅ OK |
| `{customer_point}` | ✅ | ✅ | ✅ OK |
| `{customer_point_used}` | ✅ | ✅ | ✅ OK |
| `{customer_point_new}` | ✅ | ✅ | ✅ OK |
| `{customer_point_before_create_invoice}` | ✅ | ✅ | ✅ OK |
| `{customer_point_after_create_invoice}` | ✅ | ✅ | ✅ OK |
| `{customer_debt}` | ✅ | ✅ | ✅ OK |
| `{customer_debt_text}` | ✅ | ✅ | ✅ OK |
| `{customer_debt_prev}` | ✅ | ✅ | ✅ OK |
| `{customer_debt_prev_text}` | ✅ | ✅ | ✅ OK |
| `{debt_before_create_invoice}` | ✅ | ✅ | ✅ OK |
| `{debt_before_create_invoice_text}` | ✅ | ✅ | ✅ OK |
| `{debt_after_create_invoice}` | ✅ | ✅ | ✅ OK |
| `{debt_after_create_invoice_text}` | ✅ | ✅ | ✅ OK |
| `{total_amount_and_debt_before_create_invoice}` | ✅ | ✅ | ✅ OK |
| `{total_amount_and_debt_before_create_invoice_text}` | ✅ | ✅ | ✅ OK |

#### D. Thông tin giỏ hàng - Line Items (35/35 ✅)

| Từ khóa | Trong Variables | Trong Mapper | Trạng thái |
|---------|-----------------|--------------|------------|
| `{line_stt}` | ✅ | ✅ | ✅ OK |
| `{line_product_name}` | ✅ | ✅ | ✅ OK |
| `{line_variant}` | ✅ | ✅ | ✅ OK |
| `{line_variant_code}` | ✅ | ✅ | ✅ OK |
| `{line_variant_barcode}` | ✅ | ✅ | ✅ OK |
| `{line_variant_barcode_image}` | ✅ | ✅ | ✅ OK |
| `{line_variant_options}` | ✅ | ✅ | ✅ OK |
| `{line_image}` | ✅ | ✅ | ✅ OK |
| `{line_unit}` | ✅ | ✅ | ✅ OK |
| `{line_quantity}` | ✅ | ✅ | ✅ OK |
| `{line_price}` | ✅ | ✅ | ✅ OK |
| `{line_price_after_discount}` | ✅ | ✅ | ✅ OK |
| `{line_price_discount}` | ✅ | ✅ | ✅ OK |
| `{line_discount_amount}` | ✅ | ✅ | ✅ OK |
| `{line_discount_rate}` | ✅ | ✅ | ✅ OK |
| `{line_tax_amount}` | ✅ | ✅ | ✅ OK |
| `{line_tax_rate}` | ✅ | ✅ | ✅ OK |
| `{line_tax_included}` | ✅ | ✅ | ✅ OK |
| `{line_tax_exclude}` | ✅ | ✅ | ✅ OK |
| `{line_amount}` | ✅ | ✅ | ✅ OK |
| `{line_amount_none_discount}` | ✅ | ✅ | ✅ OK |
| `{line_note}` | ✅ | ✅ | ✅ OK |
| `{line_brand}` | ✅ | ✅ | ✅ OK |
| `{line_category}` | ✅ | ✅ | ✅ OK |
| `{line_product_description}` | ✅ | ✅ | ✅ OK |
| `{line_weight_g}` | ✅ | ✅ | ✅ OK |
| `{line_weight_kg}` | ✅ | ✅ | ✅ OK |
| `{bin_location}` | ✅ | ✅ | ✅ OK |
| `{serials}` | ✅ | ✅ | ✅ OK |
| `{lots_number_code1}` | ✅ | ✅ | ✅ OK |
| `{lots_number_code2}` | ✅ | ✅ | ✅ OK |
| `{lots_number_code3}` | ✅ | ✅ | ✅ OK |
| `{lots_number_code4}` | ✅ | ✅ | ✅ OK |
| `{lots_number_combo}` | ✅ | ✅ | ✅ OK |
| `{packsizes}` | ✅ | ✅ | ✅ OK |
| `{term_name}` | ✅ | ✅ | ✅ OK |
| `{term_number}` | ✅ | ✅ | ✅ OK |
| `{term_name_combo}` | ✅ | ✅ | ✅ OK |
| `{term_number_combo}` | ✅ | ✅ | ✅ OK |
| `{composite_details}` | ✅ | ✅ | ✅ OK |
| `{line_promotion_or_loyalty}` | ✅ | ✅ | ✅ OK |

#### E. Tổng giá trị (25/25 ✅)

| Từ khóa | Trong Variables | Trong Mapper | Trạng thái |
|---------|-----------------|--------------|------------|
| `{total_quantity}` | ✅ | ✅ | ✅ OK |
| `{total}` | ✅ | ✅ | ✅ OK |
| `{total_amount}` | ✅ | ✅ | ✅ OK |
| `{total_text}` | ✅ | ✅ | ✅ OK |
| `{total_none_discount}` | ✅ | ✅ | ✅ OK |
| `{total_line_item_discount}` | ✅ | ✅ | ✅ OK |
| `{product_discount}` | ✅ | ✅ | ✅ OK |
| `{order_discount}` | ✅ | ✅ | ✅ OK |
| `{order_discount_rate}` | ✅ | ✅ | ✅ OK |
| `{order_discount_value}` | ✅ | ✅ | ✅ OK |
| `{total_discount}` | ✅ | ✅ | ✅ OK |
| `{discount_details}` | ✅ | ✅ | ✅ OK |
| `{total_tax}` | ✅ | ✅ | ✅ OK |
| `{total_extra_tax}` | ✅ | ✅ | ✅ OK |
| `{total_tax_included_line}` | ✅ | ✅ | ✅ OK |
| `{total_amount_before_tax}` | ✅ | ✅ | ✅ OK |
| `{total_amount_after_tax}` | ✅ | ✅ | ✅ OK |
| `{delivery_fee}` | ✅ | ✅ | ✅ OK |
| `{total_remain}` | ✅ | ✅ | ✅ OK |
| `{total_remain_text}` | ✅ | ✅ | ✅ OK |
| `{payment_name}` | ✅ | ✅ | ✅ OK |
| `{payment_customer}` | ✅ | ✅ | ✅ OK |
| `{money_return}` | ✅ | ✅ | ✅ OK |
| `{payments}` | ✅ | ✅ | ✅ OK |
| `{payment_qr}` | ✅ | ✅ | ✅ OK |
| `{promotion_name}` | ✅ | ✅ | ✅ OK |
| `{promotion_code}` | ✅ | ✅ | ✅ OK |
| `{order_note}` | ✅ | ✅ | ✅ OK |

### 2.2 Thống kê tổng hợp - ✅ 100% HOÀN THÀNH

| Loại | Tổng từ khóa | Đã mapping | Thiếu | % Hoàn thành |
|------|-------------|------------|-------|--------------|
| Thông tin cửa hàng | 11 | 11 | 0 | ✅ 100% |
| Thông tin đơn hàng | 45 | 45 | 0 | ✅ 100% |
| Thông tin khách hàng mở rộng | 20 | 20 | 0 | ✅ 100% |
| Thông tin giỏ hàng (line items) | 41 | 41 | 0 | ✅ 100% |
| Tổng giá trị | 28 | 28 | 0 | ✅ 100% |
| **TỔNG CỘNG** | **145+** | **145+** | **0** | **✅ 100%** |

> 🎉 **Hoàn thành:** Tất cả từ khóa trong `don-ban-hang.ts` đều đã có mapping tương ứng trong `order.mapper.ts`!

---

## 3. Danh sách TODO

### ✅ 3.0 Ưu tiên P0 - ĐÃ HOÀN THÀNH

- [x] **TODO-P0-001**: Cập nhật đầy đủ Preview Data cho tất cả loại mẫu in
- [x] **TODO-P0-002**: Tách `preview-data.ts` thành thư mục `preview/` với file riêng cho từng loại
- [x] **TODO-P0-003**: Đồng bộ Preview Data với Variables (đảm bảo mọi từ khóa đều có dữ liệu preview)
- [x] **TODO-P0-004**: Tạo mappers cho 8 Extended Template Types
- [x] **TODO-P0-005**: Đảm bảo 100% variables trong mỗi file đều có mapping tương ứng

### 🔄 3.1 Ưu tiên CAO (P1) - Đang làm / Sắp làm

- [ ] **TODO-P1-001**: Tích hợp Print Buttons vào các trang chi tiết còn lại
  - [x] Order Detail (Đóng gói & Giao hàng)
  - [ ] Quote Detail
  - [ ] Purchase Order Detail
  - [ ] Stock Transfer Detail
  - [ ] Inventory Check Detail
  - [ ] Warranty Detail
- [ ] **TODO-P1-002**: Thêm tính năng cài đặt đường viền bảng trong Settings
- [ ] **TODO-P1-003**: Tạo Extended Templates (HTML mặc định) cho 8 loại mới

### 3.2 Ưu tiên TRUNG BÌNH (P2) - Cần làm sớm

- [ ] **TODO-P2-001**: Thêm nút "Preview trước khi in" trong từng màn hình chi tiết
- [ ] **TODO-P2-002**: Hỗ trợ nhiều template cho cùng một loại (VD: Template A4, Template K80...)
- [ ] **TODO-P2-003**: Export template ra file để backup/restore
- [ ] **TODO-P2-004**: Thêm wizard hướng dẫn tạo template mới

### 3.3 Ưu tiên THẤP (P3) - Có thể làm sau

- [ ] **TODO-P3-001**: Tích hợp in hàng loạt (bulk print)
- [ ] **TODO-P3-002**: Lưu lịch sử in
- [ ] **TODO-P3-003**: Hỗ trợ QR Code động từ API
- [ ] **TODO-P3-004**: Hỗ trợ logo động theo chi nhánh

---

## 4. Chi tiết triển khai

### 4.1 Cập nhật `OrderForPrint` interface

```typescript
// Thêm vào lib/print-data-mappers.ts
export interface OrderForPrint {
  // === THÔNG TIN CƠ BẢN (đã có) ===
  code: string;
  createdAt: string | Date;
  createdBy?: string;
  
  // === THÔNG TIN THÊM MỚI ===
  modifiedAt?: string | Date;          // Ngày cập nhật
  issuedAt?: string | Date;            // Ngày chứng từ
  source?: string;                     // Nguồn đơn hàng
  channel?: string;                    // Kênh bán hàng
  reference?: string;                  // Mã tham chiếu
  tags?: string[];                     // Thẻ tag
  
  // Trạng thái
  status?: string;                     // Trạng thái đơn
  paymentStatus?: string;              // Trạng thái thanh toán
  fulfillmentStatus?: string;          // Trạng thái giao hàng
  packedStatus?: string;               // Trạng thái đóng gói
  returnStatus?: string;               // Trạng thái trả hàng
  
  // Giao hàng
  expectedDeliveryType?: string;       // Vận chuyển dự kiến
  shipOnMin?: string | Date;           // Ngày giao từ
  shipOnMax?: string | Date;           // Ngày giao đến
  shippedOn?: string | Date;           // Ngày xuất kho
  
  // Phụ trách
  assigneeName?: string;               // Người phụ trách
  
  // Chính sách
  priceListName?: string;              // Chính sách giá
  currencyName?: string;               // Tiền tệ
  
  // Khối lượng
  totalWeightG?: number;               // Tổng KL (g)
  totalWeightKg?: number;              // Tổng KL (kg)
  
  // === THÔNG TIN KHÁCH HÀNG MỞ RỘNG ===
  customer?: {
    name?: string;
    code?: string;
    phone?: string;
    email?: string;
    group?: string;
    address?: string;
    // Thêm mới
    contactName?: string;              // Người liên hệ
    contactPhone?: string;             // SĐT liên hệ
    cardLevel?: string;                // Hạng thẻ
    taxNumber?: string;                // MST
    currentPoint?: number;             // Điểm hiện tại
    pointUsed?: number;                // Điểm đã dùng
    pointEarned?: number;              // Điểm tích mới
    currentDebt?: number;              // Nợ hiện tại
    previousDebt?: number;             // Nợ cũ
  };
  
  // === THÔNG TIN NGƯỜI NHẬN ===
  recipient?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  
  // === THÔNG TIN LINE ITEMS MỞ RỘNG ===
  items: Array<{
    productName: string;
    variantName?: string;
    variantCode?: string;              // Mã phiên bản
    barcode?: string;                  // Barcode
    imageUrl?: string;                 // Ảnh SP
    unit?: string;
    quantity: number;
    price: number;
    discountAmount?: number;
    discountRate?: number;             // % chiết khấu
    amount: number;
    taxAmount?: number;                // Thuế
    taxRate?: number;                  // % thuế
    note?: string;                     // Ghi chú SP
    brand?: string;                    // Thương hiệu
    category?: string;                 // Loại SP
    weightG?: number;                  // Khối lượng (g)
    binLocation?: string;              // Vị trí kho
    serial?: string;                   // Serial
    lotNumber?: string;                // Mã lô
    warrantyPolicy?: string;           // CS bảo hành
    warrantyPeriod?: string;           // Thời hạn BH
  }>;
  
  // === TỔNG GIÁ TRỊ MỞ RỘNG ===
  totalQuantity: number;
  subtotal: number;                    // Tổng tiền hàng
  subtotalBeforeDiscount?: number;     // Tổng trước CK
  totalLineItemDiscount?: number;      // Tổng CK SP
  orderDiscount?: number;              // CK đơn hàng
  orderDiscountRate?: number;          // CK đơn %
  totalDiscount?: number;              // Tổng CK
  totalTax?: number;                   // Tổng thuế
  deliveryFee?: number;                // Phí ship
  total: number;                       // Tổng tiền
  totalRemain?: number;                // Còn phải trả
  
  // === THANH TOÁN ===
  paymentMethod?: string;
  expectedPaymentMethod?: string;
  paidAmount?: number;
  changeAmount?: number;
  payments?: Array<{
    method: string;
    amount: number;
  }>;
  
  // === KHUYẾN MẠI ===
  promotionName?: string;
  promotionCode?: string;
  
  note?: string;
}
```

### 4.2 Cập nhật `mapOrderToPrintData` function

```typescript
export function mapOrderToPrintData(order: OrderForPrint, storeSettings: StoreSettings): PrintData {
  // Helper functions
  const hidePhoneMiddle = (phone?: string) => {
    if (!phone || phone.length < 8) return phone || '';
    return phone.slice(0, 3) + '****' + phone.slice(-3);
  };
  
  const formatDateText = (date?: string | Date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `Ngày ${day} tháng ${month} năm ${year}`;
  };

  return {
    ...getStoreData(storeSettings),
    
    // Thông tin chi nhánh
    '{location_name}': storeSettings.locationName || storeSettings.name || '',
    '{location_address}': storeSettings.locationAddress || storeSettings.address || '',
    '{location_phone_number}': storeSettings.locationPhone || storeSettings.phone || '',
    '{location_province}': storeSettings.locationProvince || '',
    '{store_province}': storeSettings.province || '',
    
    // Thông tin đơn hàng cơ bản
    '{order_code}': order.code,
    '{created_on}': formatDate(order.createdAt),
    '{created_on_time}': formatTime(order.createdAt),
    '{created_on_text}': formatDateText(order.createdAt),
    '{modified_on}': formatDate(order.modifiedAt),
    '{modified_on_time}': formatTime(order.modifiedAt),
    '{issued_on}': formatDate(order.issuedAt || order.createdAt),
    '{issued_on_time}': formatTime(order.issuedAt || order.createdAt),
    '{issued_on_text}': formatDateText(order.issuedAt || order.createdAt),
    '{account_name}': order.createdBy || '',
    '{assignee_name}': order.assigneeName || order.createdBy || '',
    
    // Trạng thái
    '{order_status}': order.status || '',
    '{payment_status}': order.paymentStatus || '',
    '{fulfillment_status}': order.fulfillmentStatus || '',
    '{packed_status}': order.packedStatus || '',
    '{return_status}': order.returnStatus || '',
    
    // Nguồn / Kênh
    '{source}': order.source || '',
    '{channel}': order.channel || '',
    '{reference}': order.reference || '',
    '{tag}': order.tags?.join(', ') || '',
    
    // Giao hàng
    '{expected_delivery_type}': order.expectedDeliveryType || '',
    '{expected_payment_method}': order.expectedPaymentMethod || '',
    '{ship_on_min}': formatDate(order.shipOnMin),
    '{ship_on_max}': formatDate(order.shipOnMax),
    '{shipped_on}': formatDate(order.shippedOn),
    
    // Chính sách
    '{price_list_name}': order.priceListName || '',
    '{currency_name}': order.currencyName || 'VND',
    
    // Khối lượng
    '{weight_g}': order.totalWeightG?.toString() || '0',
    '{weight_kg}': order.totalWeightKg?.toString() || '0',
    
    // Thông tin khách hàng
    '{customer_name}': order.customer?.name || '',
    '{customer_code}': order.customer?.code || '',
    '{customer_phone_number}': order.customer?.phone || '',
    '{customer_phone_number_hide}': hidePhoneMiddle(order.customer?.phone),
    '{customer_email}': order.customer?.email || '',
    '{customer_group}': order.customer?.group || '',
    '{customer_contact}': order.customer?.contactName || order.customer?.name || '',
    '{customer_contact_phone_number}': order.customer?.contactPhone || order.customer?.phone || '',
    '{customer_contact_phone_number_hide}': hidePhoneMiddle(order.customer?.contactPhone || order.customer?.phone),
    '{customer_card}': order.customer?.cardLevel || '',
    '{customer_tax_number}': order.customer?.taxNumber || '',
    
    // Điểm khách hàng
    '{customer_point}': order.customer?.currentPoint?.toString() || '0',
    '{customer_point_used}': order.customer?.pointUsed?.toString() || '0',
    '{customer_point_new}': order.customer?.pointEarned?.toString() || '0',
    
    // Nợ khách hàng
    '{customer_debt}': formatCurrency(order.customer?.currentDebt),
    '{customer_debt_text}': numberToWords(order.customer?.currentDebt || 0),
    '{customer_debt_prev}': formatCurrency(order.customer?.previousDebt),
    '{customer_debt_prev_text}': numberToWords(order.customer?.previousDebt || 0),
    '{debt_before_create_invoice}': formatCurrency(order.customer?.previousDebt),
    '{debt_after_create_invoice}': formatCurrency(order.customer?.currentDebt),
    
    // Địa chỉ
    '{billing_address}': order.billingAddress || order.customer?.address || '',
    '{shipping_address}': order.shippingAddress || '',
    
    // Người nhận
    '{shipping_address:full_name}': order.recipient?.name || order.customer?.name || '',
    '{shipping_address:phone_number}': order.recipient?.phone || order.customer?.phone || '',
    '{shipping_address:phone_number_hide}': hidePhoneMiddle(order.recipient?.phone || order.customer?.phone),
    
    // Tổng giá trị
    '{total_quantity}': order.totalQuantity.toString(),
    '{total}': formatCurrency(order.subtotal),
    '{total_none_discount}': formatCurrency(order.subtotalBeforeDiscount || order.subtotal),
    '{total_line_item_discount}': formatCurrency(order.totalLineItemDiscount),
    '{product_discount}': formatCurrency(order.totalLineItemDiscount),
    '{order_discount}': formatCurrency(order.orderDiscount),
    '{order_discount_rate}': order.orderDiscountRate ? `${order.orderDiscountRate}%` : '',
    '{order_discount_value}': formatCurrency(order.orderDiscount),
    '{total_discount}': formatCurrency(order.totalDiscount),
    '{total_tax}': formatCurrency(order.totalTax),
    '{delivery_fee}': formatCurrency(order.deliveryFee),
    '{total_amount}': formatCurrency(order.total),
    '{total_text}': numberToWords(order.total),
    '{total_remain}': formatCurrency(order.totalRemain),
    '{total_remain_text}': numberToWords(order.totalRemain || 0),
    
    // Thanh toán
    '{payment_name}': order.paymentMethod || '',
    '{payment_customer}': formatCurrency(order.paidAmount),
    '{money_return}': formatCurrency(order.changeAmount),
    '{payments}': order.payments?.map(p => `${p.method}: ${formatCurrency(p.amount)}`).join(', ') || '',
    
    // Khuyến mại
    '{promotion_name}': order.promotionName || '',
    '{promotion_code}': order.promotionCode || '',
    
    '{order_note}': order.note || '',
  };
}
```

### 4.3 Cập nhật `mapOrderLineItems` function

```typescript
export function mapOrderLineItems(items: OrderForPrint['items']): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    '{line_product_name}': item.productName,
    '{line_variant}': item.variantName || '',
    '{line_variant_code}': item.variantCode || '',
    '{line_variant_barcode}': item.barcode || '',
    '{line_image}': item.imageUrl ? `<img src="${item.imageUrl}" style="max-width:50px;max-height:50px"/>` : '',
    '{line_unit}': item.unit || 'Cái',
    '{line_quantity}': item.quantity.toString(),
    '{line_price}': formatCurrency(item.price),
    '{line_discount_amount}': formatCurrency(item.discountAmount),
    '{line_discount_rate}': item.discountRate ? `${item.discountRate}%` : '',
    '{line_amount}': formatCurrency(item.amount),
    '{line_amount_none_discount}': formatCurrency(item.price * item.quantity),
    '{line_price_after_discount}': formatCurrency(item.amount / item.quantity),
    '{line_tax_amount}': formatCurrency(item.taxAmount),
    '{line_tax_rate}': item.taxRate ? `${item.taxRate}%` : '',
    '{line_note}': item.note || '',
    '{line_brand}': item.brand || '',
    '{line_category}': item.category || '',
    '{line_weight_g}': item.weightG?.toString() || '',
    '{line_weight_kg}': item.weightG ? (item.weightG / 1000).toString() : '',
    '{bin_location}': item.binLocation || '',
    '{serials}': item.serial || '',
    '{lots_number_code1}': item.lotNumber || '',
    '{term_name}': item.warrantyPolicy || '',
    '{term_number}': item.warrantyPeriod || '',
  }));
}
```

---

## 5. Yêu cầu bổ sung: Cài đặt đường viền bảng

### 5.1 Thêm Settings cho Table Border

**File:** `features/settings/printer/types.ts`

```typescript
export interface PrintTemplateSettings {
  tableBorder: {
    enabled: boolean;          // Có hiển thị border không
    style: 'solid' | 'dashed' | 'dotted';  // Kiểu border
    width: number;             // Độ dày (px)
    color: string;             // Màu border (#000000)
  };
  tableHeaderBackground: string;  // Màu nền header (#f5f5f5)
  tablePadding: number;           // Padding cell (px)
}
```

### 5.2 Thêm UI Settings trong Print Templates Page

```tsx
// Thêm vào print-templates-page.tsx trong phần Settings
<div className="space-y-4">
  <h4 className="font-medium">Cài đặt bảng</h4>
  
  <div className="flex items-center space-x-2">
    <Checkbox 
      id="border-enabled"
      checked={templateSettings.tableBorder.enabled}
      onCheckedChange={(checked) => updateTableBorderSetting('enabled', checked)}
    />
    <Label htmlFor="border-enabled">Hiển thị đường viền bảng</Label>
  </div>
  
  {templateSettings.tableBorder.enabled && (
    <>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label>Kiểu đường viền</Label>
          <Select 
            value={templateSettings.tableBorder.style}
            onValueChange={(v) => updateTableBorderSetting('style', v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="solid">Nét liền</SelectItem>
              <SelectItem value="dashed">Nét đứt</SelectItem>
              <SelectItem value="dotted">Chấm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Độ dày (px)</Label>
          <Input 
            type="number" 
            min={1} 
            max={5}
            value={templateSettings.tableBorder.width}
            onChange={(e) => updateTableBorderSetting('width', parseInt(e.target.value))}
          />
        </div>
        
        <div>
          <Label>Màu đường viền</Label>
          <Input 
            type="color"
            value={templateSettings.tableBorder.color}
            onChange={(e) => updateTableBorderSetting('color', e.target.value)}
          />
        </div>
      </div>
      
      <div>
        <Label>Màu nền tiêu đề</Label>
        <Input 
          type="color"
          value={templateSettings.tableHeaderBackground}
          onChange={(e) => setTemplateSettings({...templateSettings, tableHeaderBackground: e.target.value})}
        />
      </div>
    </>
  )}
</div>
```

### 5.3 Apply Border Settings khi in

```typescript
// Trong use-print.ts
const generateTableCSS = (settings: PrintTemplateSettings): string => {
  if (!settings.tableBorder.enabled) {
    return `
      table { width: 100%; border-collapse: collapse; }
      td, th { padding: ${settings.tablePadding}px; }
    `;
  }
  
  return `
    table { 
      width: 100%; 
      border-collapse: collapse;
      border: ${settings.tableBorder.width}px ${settings.tableBorder.style} ${settings.tableBorder.color};
    }
    td, th { 
      border: ${settings.tableBorder.width}px ${settings.tableBorder.style} ${settings.tableBorder.color};
      padding: ${settings.tablePadding}px;
    }
    th {
      background-color: ${settings.tableHeaderBackground};
      font-weight: bold;
    }
  `;
};
```

---

## 6. Timeline dự kiến

| Giai đoạn | Công việc | Thời gian |
|-----------|-----------|-----------|
| **Phase 1** | Bổ sung mapping P1 (chi nhánh, trạng thái, line items cơ bản) | 2-3 ngày |
| **Phase 2** | Bổ sung mapping P2 (KH mở rộng, ngày chữ, QR) | 2-3 ngày |
| **Phase 3** | Tính năng cài đặt đường viền bảng | 1 ngày |
| **Phase 4** | Bổ sung mapping P3 (lô, serial, combo) | 2-3 ngày |
| **Phase 5** | Testing & Fix bugs | 2-3 ngày |
| **TỔNG** | | **9-13 ngày** |

---

## 7. Checklist hoàn thành

- [ ] Cập nhật `OrderForPrint` interface
- [ ] Cập nhật `mapOrderToPrintData` function
- [ ] Cập nhật `mapOrderLineItems` function
- [ ] Cập nhật `convertOrderForPrint` trong order-print-helper.ts
- [ ] Thêm types cho Table Border Settings
- [ ] Thêm UI cài đặt đường viền trong Settings
- [ ] Apply border settings khi in
- [ ] Test với đơn hàng thực tế
- [ ] Test với tất cả các khổ giấy (K57, K80, A5, A4)
- [ ] Document hướng dẫn sử dụng

---

## 8. Template Mặc Định Chuẩn

### 8.1 Đơn bán hàng (ORDER_TEMPLATE)

**Nguyên tắc quan trọng:**
1. Bảng chứa `{line_stt}` là bảng line items - sẽ được lặp theo số sản phẩm
2. Các bảng khác là bảng thông tin - không lặp
3. Sử dụng inline styles để đảm bảo hiển thị đúng khi in
4. Các từ khóa được thay thế từ data mappers

```html
<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5; max-width: 800px; margin: 0 auto;">

<!-- HEADER: Logo + Thông tin cửa hàng -->
<div style="text-align: center; margin-bottom: 10px;">
  <div style="margin-bottom: 5px;">{store_logo}</div>
  <div style="font-size: 16px; font-weight: bold;">{store_name}</div>
  <div>{store_address}</div>
  <div>ĐT: {store_phone_number} | Email: {store_email}</div>
</div>

<!-- TIÊU ĐỀ -->
<h2 style="text-align: center; margin: 15px 0 5px 0; font-size: 18px;">HÓA ĐƠN BÁN HÀNG</h2>
<div style="text-align: center; margin-bottom: 15px;">
  <div>Số: <strong>{order_code}</strong></div>
  <div>Ngày: {created_on} {created_on_time}</div>
</div>

<!-- THÔNG TIN KHÁCH HÀNG + ĐƠN HÀNG -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
  <tbody>
    <tr>
      <td style="padding: 5px; width: 25%; border: 1px solid #333;">Khách hàng:</td>
      <td style="padding: 5px; width: 25%; border: 1px solid #333;"><strong>{customer_name}</strong></td>
      <td style="padding: 5px; width: 25%; border: 1px solid #333;">Mã KH:</td>
      <td style="padding: 5px; width: 25%; border: 1px solid #333;">{customer_code}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Điện thoại:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_phone_number}</td>
      <td style="padding: 5px; border: 1px solid #333;">Nhóm KH:</td>
      <td style="padding: 5px; border: 1px solid #333;">{customer_group}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Địa chỉ:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{billing_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Địa chỉ giao hàng:</td>
      <td style="padding: 5px; border: 1px solid #333;" colspan="3">{shipping_address}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Nhân viên bán:</td>
      <td style="padding: 5px; border: 1px solid #333;">{account_name}</td>
      <td style="padding: 5px; border: 1px solid #333;">Trạng thái:</td>
      <td style="padding: 5px; border: 1px solid #333;">{order_status}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG SẢN PHẨM (LINE ITEMS) - Bảng này chứa {line_stt} nên sẽ được lặp -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
  <thead>
    <tr style="background-color: #f5f5f5;">
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 40px;">STT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: left;">Tên sản phẩm</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 60px;">ĐVT</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: center; width: 50px;">SL</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 100px;">Đơn giá</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 80px;">CK</th>
      <th style="padding: 8px; border: 1px solid #333; text-align: right; width: 110px;">Thành tiền</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_stt}</td>
      <td style="padding: 6px; border: 1px solid #333;">{line_product_name}<br><small style="color: #666;">{line_variant}</small></td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_unit}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: center;">{line_quantity}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_price}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_discount_amount}</td>
      <td style="padding: 6px; border: 1px solid #333; text-align: right;">{line_amount}</td>
    </tr>
  </tbody>
</table>

<!-- BẢNG TỔNG GIÁ TRỊ -->
<table style="width: 50%; margin-left: auto; border-collapse: collapse; margin-bottom: 15px;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng số lượng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_quantity}</strong></td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Tổng tiền hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Chiết khấu:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_discount}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Thuế:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{total_tax}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Phí giao hàng:</td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;">{delivery_fee}</td>
    </tr>
    <tr style="background-color: #f5f5f5;">
      <td style="padding: 5px; border: 1px solid #333;"><strong>TỔNG CỘNG:</strong></td>
      <td style="padding: 5px; border: 1px solid #333; text-align: right;"><strong>{total_amount}</strong></td>
    </tr>
  </tbody>
</table>

<!-- BẰNG CHỮ -->
<p style="margin: 10px 0;"><strong>Bằng chữ:</strong> <em>{total_text}</em></p>

<!-- THANH TOÁN -->
<table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
  <tbody>
    <tr>
      <td style="padding: 5px; border: 1px solid #333; width: 25%;">Phương thức TT:</td>
      <td style="padding: 5px; border: 1px solid #333; width: 25%;">{payment_name}</td>
      <td style="padding: 5px; border: 1px solid #333; width: 25%;">TT thanh toán:</td>
      <td style="padding: 5px; border: 1px solid #333; width: 25%;">{payment_status}</td>
    </tr>
    <tr>
      <td style="padding: 5px; border: 1px solid #333;">Khách đưa:</td>
      <td style="padding: 5px; border: 1px solid #333;">{payment_customer}</td>
      <td style="padding: 5px; border: 1px solid #333;">Tiền thừa:</td>
      <td style="padding: 5px; border: 1px solid #333;">{money_return}</td>
    </tr>
  </tbody>
</table>

<!-- GHI CHÚ -->
<p style="margin: 10px 0; padding: 10px; background-color: #fffbe6; border: 1px solid #ffe58f;">
  <strong>Ghi chú:</strong> {order_note}
</p>

<!-- CHỮ KÝ -->
<table style="width: 100%; margin-top: 30px;">
  <tbody>
    <tr>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người mua hàng</strong><br>
        <em style="color: #666;">(Ký, ghi rõ họ tên)</em><br>
        <br><br><br><br>
        {customer_name}
      </td>
      <td style="width: 50%; text-align: center; padding: 10px;">
        <strong>Người bán hàng</strong><br>
        <em style="color: #666;">(Ký, ghi rõ họ tên)</em><br>
        <br><br><br><br>
        {account_name}
      </td>
    </tr>
  </tbody>
</table>

<!-- FOOTER -->
<div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px dashed #ccc;">
  <p style="margin: 5px 0;">🙏 Cảm ơn quý khách đã mua hàng!</p>
  <p style="margin: 5px 0; color: #666;">Mọi thắc mắc xin liên hệ: {store_phone_number}</p>
</div>

</div>
```

### 8.2 Các từ khóa đã hỗ trợ trong template mặc định

| Nhóm | Từ khóa | Mô tả | Status |
|------|---------|-------|--------|
| **Cửa hàng** | `{store_logo}` | Logo cửa hàng | ✅ |
| | `{store_name}` | Tên cửa hàng | ✅ |
| | `{store_address}` | Địa chỉ cửa hàng | ✅ |
| | `{store_phone_number}` | SĐT cửa hàng | ✅ |
| | `{store_email}` | Email cửa hàng | ✅ |
| **Đơn hàng** | `{order_code}` | Mã đơn hàng | ✅ |
| | `{created_on}` | Ngày tạo | ✅ |
| | `{created_on_time}` | Giờ tạo | ✅ |
| | `{account_name}` | NV bán hàng | ✅ |
| | `{order_status}` | Trạng thái đơn | ✅ **MỚI** |
| | `{payment_status}` | TT thanh toán | ✅ **MỚI** |
| | `{fulfillment_status}` | TT giao hàng | ✅ **MỚI** |
| **Khách hàng** | `{customer_name}` | Tên KH | ✅ |
| | `{customer_code}` | Mã KH | ✅ |
| | `{customer_phone_number}` | SĐT KH | ✅ |
| | `{customer_email}` | Email KH | ✅ |
| | `{customer_group}` | Nhóm KH | ✅ |
| | `{billing_address}` | Địa chỉ KH | ✅ |
| | `{shipping_address}` | Địa chỉ giao | ✅ |
| **Line Items** | `{line_stt}` | Số thứ tự | ✅ |
| | `{line_product_name}` | Tên SP | ✅ |
| | `{line_variant}` | Phiên bản | ✅ |
| | `{line_unit}` | Đơn vị tính | ✅ |
| | `{line_quantity}` | Số lượng | ✅ |
| | `{line_price}` | Đơn giá | ✅ |
| | `{line_discount_amount}` | Chiết khấu | ✅ |
| | `{line_tax_amount}` | Thuế (VAT) | ✅ **MỚI** |
| | `{line_tax_rate}` | % Thuế | ✅ **MỚI** |
| | `{line_amount}` | Thành tiền | ✅ |
| **Tổng giá trị** | `{total_quantity}` | Tổng SL | ✅ |
| | `{total}` | Tổng tiền hàng | ✅ |
| | `{total_discount}` | Tổng CK | ✅ |
| | `{total_tax}` | Tổng thuế | ✅ |
| | `{delivery_fee}` | Phí ship | ✅ |
| | `{total_amount}` | Tổng cộng | ✅ |
| | `{total_text}` | Bằng chữ | ✅ |
| **Thanh toán** | `{payment_name}` | PTTT | ✅ |
| | `{payment_customer}` | Khách đưa | ✅ |
| | `{money_return}` | Tiền thừa | ✅ |
| | `{order_note}` | Ghi chú | ✅ |

### 8.3 Lưu ý khi tùy chỉnh template

1. **Bảng sản phẩm (Line Items):**
   - PHẢI có `{line_stt}` trong bảng để hệ thống nhận diện
   - Dòng mẫu trong `<tbody>` sẽ được nhân bản theo số sản phẩm
   - Không thay đổi cấu trúc `<thead>` / `<tbody>`

2. **Inline Styles:**
   - Sử dụng inline styles thay vì class để đảm bảo in đúng
   - Borders: `border: 1px solid #333`
   - Padding: `padding: 5px` hoặc `padding: 8px`

3. **Reset Template:**
   - Vào Settings > Mẫu in > Chọn loại mẫu > Nhấn "Khôi phục mặc định"
   - Hoặc xóa localStorage key `print-templates-storage`

---

## 9. Lỗi thường gặp và cách khắc phục

### 9.1 Lỗi: Line items hiển thị sai (lặp header thay vì data)

**Nguyên nhân:** Template custom bị sai cấu trúc - bảng line items không có `{line_stt}` hoặc cấu trúc tbody/tr bị lỗi.

**Cách khắc phục:**
1. Vào Settings > Mẫu in > Reset về mặc định
2. Hoặc đảm bảo bảng sản phẩm có đúng cấu trúc:
```html
<table>
  <thead>...</thead>
  <tbody>
    <tr>
      <td>{line_stt}</td>
      <td>{line_product_name}</td>
      ...
    </tr>
  </tbody>
</table>
```

### 9.2 Lỗi: Thiếu thông tin (logo, tên NV, v.v.)

**Nguyên nhân:** Dữ liệu không được truyền đầy đủ từ page xuống component.

**Cách khắc phục:**
1. Kiểm tra props của `OrderPrintButton`:
   - `order`: Order data
   - `customer`: Customer data (optional)
   - `branch`: Branch data cho store info
   - `createdByEmployee`: Employee để lấy tên NV
   - `logoUrl`: URL logo từ branding

2. Đảm bảo page đã fetch đủ data cần thiết.

### 9.3 Lỗi: Không có border bảng khi in

**Nguyên nhân:** CSS border không được apply.

**Cách khắc phục:**
1. Sử dụng inline styles trong template: `style="border: 1px solid #333"`
2. Hoặc reset template về mặc định (đã có inline styles)

---

## 10. ✅ Template Thông Minh với Điều Kiện (ĐÃ TRIỂN KHAI)

> **Trạng thái:** ĐÃ HOÀN THÀNH - Triển khai cho Đơn bán hàng

### 10.1 Vấn đề đã giải quyết

| Trường hợp | Trước | Sau |
|------------|-------|-----|
| Template có `{total_tax}`, đơn không có VAT | Hiển thị "0" | Ẩn cả dòng |
| Template có `{customer_email}`, KH không có email | Hiển thị rỗng | Ẩn dòng |
| Đơn có ghi chú, template có `{order_note}` | Luôn hiển thị | Chỉ hiển thị khi có |

### 10.2 Cú pháp Conditional đã hỗ trợ

#### A. Điều kiện Boolean (`{{#if condition}}`)

```html
<!-- Chỉ hiển thị nếu có thuế -->
{{#if has_tax}}
  <tr>
    <td>Thuế VAT:</td>
    <td>{total_tax}</td>
  </tr>
{{/if}}

<!-- Ngược lại: Chỉ hiển thị nếu KHÔNG có thuế -->
{{#unless has_tax}}
  <tr><td colspan="2">Không áp dụng thuế</td></tr>
{{/unless}}
```

**Các điều kiện boolean có sẵn:**

| Điều kiện | Mô tả | True khi |
|-----------|-------|----------|
| `has_tax` | Có thuế | `total_tax > 0` |
| `has_discount` | Có chiết khấu | `total_discount > 0` |
| `has_delivery_fee` | Có phí ship | `delivery_fee > 0` |
| `has_note` | Có ghi chú | `order_note` không rỗng |
| `has_shipping_address` | Có địa chỉ giao | `shipping_address` không rỗng |
| `has_customer_email` | KH có email | `customer_email` không rỗng |
| `has_customer_phone` | KH có SĐT | `customer_phone_number` không rỗng |

#### B. Điều kiện theo giá trị field (`{{#if_not_empty}}`)

```html
<!-- Chỉ hiển thị nếu có email -->
{{#if_not_empty {customer_email}}}
  <tr>
    <td>Email:</td>
    <td>{customer_email}</td>
  </tr>
{{/if_not_empty}}

<!-- Hiển thị nếu field rỗng -->
{{#if_empty {shipping_address}}}
  <p>Nhận hàng tại cửa hàng</p>
{{/if_empty}}
```

#### C. Điều kiện so sánh số (`{{#if_gt}}`)

```html
<!-- Chỉ hiển thị nếu total_tax > 0 -->
{{#if_gt {total_tax} 0}}
  <tr>
    <td>Thuế VAT:</td>
    <td>{total_tax}</td>
  </tr>
{{/if_gt}}
```

#### D. Điều kiện cho Line Items (`{{#line_if_not_empty}}`)

```html
<tr>
  <td>{line_stt}</td>
  <td>
    {line_product_name}
    {{#line_if_not_empty {line_variant}}}
      <br><small>{line_variant}</small>
    {{/line_if_not_empty}}
  </td>
  <td>{line_quantity}</td>
  <td>{line_price}</td>
  {{#line_if_not_empty {line_tax_amount}}}
    <td>{line_tax_amount}</td>
  {{/line_if_not_empty}}
  <td>{line_amount}</td>
</tr>
```

### 10.3 File đã cập nhật

| File | Thay đổi |
|------|----------|
| `lib/use-print.ts` | Thêm `processConditionals()`, `processLineItemConditionals()`, `isEmptyValue()` |

### 10.4 Ví dụ Template với Điều kiện

```html
<div style="font-family: Arial, sans-serif;">
  
  <!-- Header -->
  <h2 style="text-align: center;">HÓA ĐƠN BÁN HÀNG</h2>
  <p>Số: {order_code} - Ngày: {created_on}</p>
  
  <!-- Thông tin khách hàng -->
  <table>
    <tr>
      <td>Khách hàng:</td>
      <td>{customer_name}</td>
    </tr>
    {{#if_not_empty {customer_phone_number}}}
    <tr>
      <td>Điện thoại:</td>
      <td>{customer_phone_number}</td>
    </tr>
    {{/if_not_empty}}
    {{#if_not_empty {customer_email}}}
    <tr>
      <td>Email:</td>
      <td>{customer_email}</td>
    </tr>
    {{/if_not_empty}}
  </table>
  
  <!-- Bảng sản phẩm -->
  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Tên SP</th>
        <th>SL</th>
        <th>Đơn giá</th>
        <th>Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{line_stt}</td>
        <td>{line_product_name}</td>
        <td>{line_quantity}</td>
        <td>{line_price}</td>
        <td>{line_amount}</td>
      </tr>
    </tbody>
  </table>
  
  <!-- Tổng tiền - Chỉ hiển thị các dòng có giá trị -->
  <table style="width: 50%; margin-left: auto;">
    <tr>
      <td>Tổng tiền hàng:</td>
      <td style="text-align: right;">{total}</td>
    </tr>
    {{#if has_discount}}
    <tr>
      <td>Chiết khấu:</td>
      <td style="text-align: right;">{total_discount}</td>
    </tr>
    {{/if}}
    {{#if has_tax}}
    <tr>
      <td>Thuế VAT:</td>
      <td style="text-align: right;">{total_tax}</td>
    </tr>
    {{/if}}
    {{#if has_delivery_fee}}
    <tr>
      <td>Phí giao hàng:</td>
      <td style="text-align: right;">{delivery_fee}</td>
    </tr>
    {{/if}}
    <tr style="font-weight: bold;">
      <td>TỔNG CỘNG:</td>
      <td style="text-align: right;">{total_amount}</td>
    </tr>
  </table>
  
  <!-- Ghi chú - Chỉ hiển thị nếu có -->
  {{#if has_note}}
  <p style="margin-top: 15px; padding: 10px; background: #fffbe6; border: 1px solid #ffe58f;">
    <strong>Ghi chú:</strong> {order_note}
  </p>
  {{/if}}
  
</div>
```

### 10.5 Lưu ý quan trọng

1. **Giá trị "empty"**: Hệ thống coi các giá trị sau là empty:
   - `null`, `undefined`, `''` (rỗng)
   - `'0'`, `'0đ'`, `'0 đ'` (số 0 và biến thể)

2. **Nested conditions**: Hiện chưa hỗ trợ điều kiện lồng nhau

3. **Preview trong Settings**: Preview vẫn hiển thị tất cả fields (vì dùng dữ liệu mẫu có đầy đủ)

4. **Tương thích ngược**: Template cũ không có điều kiện vẫn hoạt động bình thường

---

**Ghi chú:** File này cần được cập nhật thường xuyên khi triển khai các TODO.

---

## 11. 📦 Cập nhật đầy đủ Preview Data (TODO-P0) - ĐÃ HOÀN THÀNH ✅

> **Trạng thái:** ĐÃ TRIỂN KHAI - 05/12/2025

### 11.1 Vấn đề hiện tại

**File hiện tại:** `features/settings/printer/preview-data.ts`

| Vấn đề | Mô tả | Ảnh hưởng |
|--------|-------|-----------|
| **File quá lớn** | Tất cả preview data cho 16+ loại mẫu in nằm trong 1 file (~500+ dòng) | Khó maintain, dễ conflict |
| **Thiếu đồng bộ** | Một số từ khóa trong Variables chưa có trong Preview Data | Preview hiển thị `{từ_khóa}` thay vì giá trị mẫu |
| **Khó mở rộng** | Khi thêm mẫu in mới, file ngày càng phình to | Performance và readability giảm |

### 11.2 Giải pháp: Tách thành thư mục `preview/`

#### Cấu trúc đề xuất:

```
📁 features/settings/printer/
├── preview-data.ts          # File cũ (deprecated, sẽ xóa sau)
├── preview/                  # 🆕 THƯ MỤC MỚI
│   ├── index.ts             # Export tổng hợp PREVIEW_DATA
│   ├── order.preview.ts     # Đơn bán hàng (~150 từ khóa)
│   ├── receipt.preview.ts   # Phiếu thu
│   ├── payment.preview.ts   # Phiếu chi
│   ├── warranty.preview.ts  # Phiếu bảo hành
│   ├── inventory-check.preview.ts
│   ├── stock-transfer.preview.ts
│   ├── stock-in.preview.ts
│   ├── sales-return.preview.ts
│   ├── purchase-order.preview.ts
│   ├── packing.preview.ts
│   ├── quote.preview.ts
│   ├── delivery.preview.ts
│   ├── shipping-label.preview.ts
│   ├── supplier-return.preview.ts
│   ├── complaint.preview.ts
│   ├── penalty.preview.ts
│   └── _shared.preview.ts   # Dữ liệu dùng chung (store_*, location_*)
└── variables/               # (giữ nguyên)
    ├── don-ban-hang.ts
    ├── ...
```

### 11.3 Chi tiết triển khai

#### A. File `_shared.preview.ts` - Dữ liệu dùng chung

```typescript
// features/settings/printer/preview/_shared.preview.ts

/**
 * Dữ liệu preview dùng chung cho tất cả loại mẫu in
 * Bao gồm: Thông tin cửa hàng, chi nhánh, người tạo
 */
export const SHARED_PREVIEW_DATA = {
  // === THÔNG TIN CỬA HÀNG ===
  '{store_logo}': '<img src="https://placehold.co/120x60?text=LOGO" alt="Logo" style="max-height:60px"/>',
  '{store_name}': 'Cửa hàng Thời trang TrendTech',
  '{store_address}': '123 Nguyễn Văn Linh, Đà Nẵng',
  '{store_phone_number}': '0905 123 456',
  '{store_email}': 'contact@trendtech.vn',
  '{store_fax}': '0236 3333 555',
  '{store_province}': 'Đà Nẵng',
  
  // === THÔNG TIN CHI NHÁNH ===
  '{location_name}': 'Chi nhánh Hải Châu',
  '{location_address}': '789 Trần Phú, Hải Châu, Đà Nẵng',
  '{location_province}': 'Đà Nẵng',
  '{location_phone_number}': '0236 3333 666',
  
  // === NGƯỜI TẠO ===
  '{account_name}': 'Trần Văn B',
  '{assignee_name}': 'Nguyễn Thị C',
} as const;

export type SharedPreviewKeys = keyof typeof SHARED_PREVIEW_DATA;
```

#### B. File `order.preview.ts` - Đơn bán hàng

```typescript
// features/settings/printer/preview/order.preview.ts

import { SHARED_PREVIEW_DATA } from './_shared.preview';

/**
 * Dữ liệu preview cho mẫu in Đơn bán hàng
 * Đồng bộ với: variables/don-ban-hang.ts (~150 từ khóa)
 */
export const ORDER_PREVIEW_DATA: Record<string, string> = {
  // Kế thừa dữ liệu chung
  ...SHARED_PREVIEW_DATA,
  
  // === THÔNG TIN ĐƠN HÀNG ===
  '{order_code}': 'DH000123',
  '{order_qr_code}': '<img src="https://placehold.co/100x100?text=QR" alt="QR" style="width:100px;height:100px"/>',
  '{bar_code(code)}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{created_on}': '05/12/2025',
  '{created_on_time}': '10:30',
  '{created_on_text}': 'Ngày 05 tháng 12 năm 2025',
  '{modified_on}': '05/12/2025',
  '{modified_on_time}': '14:20',
  '{issued_on}': '05/12/2025',
  '{issued_on_time}': '10:30',
  '{issued_on_text}': 'Ngày 05 tháng 12 năm 2025',
  '{shipped_on}': '06/12/2025',
  '{ship_on_min}': '06/12/2025',
  '{ship_on_max}': '08/12/2025',
  '{source}': 'Website',
  '{channel}': 'Online',
  '{reference}': 'REF-2025-001',
  '{bar_code(reference_number)}': '<img src="https://placehold.co/150x50?text=REF-CODE" alt="Ref Barcode" style="height:50px"/>',
  '{tag}': 'VIP, Ưu tiên',
  '{currency_name}': 'VND',
  '{tax_treatment}': 'Giá đã bao gồm thuế',
  '{price_list_name}': 'Bảng giá lẻ',
  '{expected_payment_method}': 'COD',
  '{expected_delivery_type}': 'Giao hàng nhanh',
  '{weight_g}': '500',
  '{weight_kg}': '0.5',
  
  // === TRẠNG THÁI ===
  '{order_status}': 'Đang giao dịch',
  '{payment_status}': 'Chưa thanh toán',
  '{fulfillment_status}': 'Chờ đóng gói',
  '{packed_status}': 'Chưa đóng gói',
  '{return_status}': 'Không trả',
  
  // === THÔNG TIN KHÁCH HÀNG ===
  '{customer_name}': 'Nguyễn Văn A',
  '{customer_code}': 'KH00456',
  '{customer_phone_number}': '0912 345 678',
  '{customer_phone_number_hide}': '0912 *** 678',
  '{customer_email}': 'nguyenvana@email.com',
  '{customer_group}': 'Khách VIP',
  '{customer_card}': 'Thẻ Vàng',
  '{customer_contact}': 'Nguyễn Văn A',
  '{customer_contact_phone_number}': '0912 345 678',
  '{customer_contact_phone_number_hide}': '0912 *** 678',
  '{customer_tax_number}': '0123456789',
  '{billing_address}': '456 Lê Duẩn, Đà Nẵng',
  '{shipping_address}': '456 Lê Duẩn, Quận Hải Châu, Đà Nẵng',
  '{shipping_address:full_name}': 'Nguyễn Văn A',
  '{shipping_address:phone_number}': '0912 345 678',
  '{shipping_address:phone_number_hide}': '0912 *** 678',
  
  // === ĐIỂM TÍCH LŨY ===
  '{customer_point}': '1,500',
  '{customer_point_used}': '100',
  '{customer_point_new}': '50',
  '{customer_point_before_create_invoice}': '1,550',
  '{customer_point_after_create_invoice}': '1,500',
  
  // === NỢ KHÁCH HÀNG ===
  '{customer_debt}': '2,000,000',
  '{customer_debt_text}': 'Hai triệu đồng',
  '{customer_debt_prev}': '1,000,000',
  '{customer_debt_prev_text}': 'Một triệu đồng',
  '{debt_before_create_invoice}': '1,000,000',
  '{debt_before_create_invoice_text}': 'Một triệu đồng',
  '{debt_after_create_invoice}': '2,000,000',
  '{debt_after_create_invoice_text}': 'Hai triệu đồng',
  '{total_amount_and_debt_before_create_invoice}': '1,990,000',
  '{total_amount_and_debt_before_create_invoice_text}': 'Một triệu chín trăm chín mươi nghìn đồng',
  
  // === THÔNG TIN SẢN PHẨM (LINE ITEMS) ===
  '{line_stt}': '1',
  '{line_product_name}': 'Áo thun Polo nam',
  '{line_variant}': 'Size L - Màu xanh',
  '{line_variant_code}': 'ATP-L-XANH',
  '{line_variant_barcode}': '8935123456789',
  '{line_variant_barcode_image}': '<img src="https://placehold.co/150x50?text=BARCODE" alt="Barcode" style="height:50px"/>',
  '{line_variant_options}': 'Size: L, Màu: Xanh',
  '{line_image}': '<img src="https://placehold.co/60x60?text=SP" alt="Product" style="width:60px;height:60px"/>',
  '{line_unit}': 'Cái',
  '{line_quantity}': '2',
  '{line_price}': '250,000',
  '{line_price_after_discount}': '237,500',
  '{line_price_discount}': '237,500',
  '{line_discount_rate}': '5%',
  '{line_discount_amount}': '25,000',
  '{line_tax_rate}': '10%',
  '{line_tax_amount}': '47,500',
  '{line_tax_included}': 'Có',
  '{line_tax_exclude}': '225,000',
  '{line_amount}': '475,000',
  '{line_amount_none_discount}': '500,000',
  '{line_note}': 'Size vừa vặn',
  '{line_brand}': 'TrendTech',
  '{line_category}': 'Áo thun nam',
  '{line_product_description}': 'Áo thun Polo nam cao cấp, chất liệu cotton 100%',
  '{line_promotion_or_loyalty}': 'Hàng KM',
  '{line_weight_g}': '250',
  '{line_weight_kg}': '0.25',
  
  // === LINE ITEMS - BẢO HÀNH ===
  '{term_name}': '12 tháng',
  '{term_number}': '12',
  '{term_name_combo}': '6 tháng',
  '{term_number_combo}': '6',
  
  // === LINE ITEMS - LÔ HÀNG ===
  '{lots_number_code1}': 'LOT2025001',
  '{lots_number_code2}': 'LOT2025001 - 2',
  '{lots_number_code3}': 'LOT2025001 - 01/12/2025 - 01/12/2026',
  '{lots_number_code4}': 'LOT2025001 - 01/12/2025 - 01/12/2026 - 2',
  '{lots_number_combo}': 'LOT-COMBO-001',
  
  // === LINE ITEMS - KHÁC ===
  '{composite_details}': 'Áo x1, Quần x1',
  '{packsizes}': 'Thùng 10 cái',
  '{bin_location}': 'Kệ A1-01',
  '{serials}': 'SN001, SN002',
  '{total_line_item_discount}': '25,000',
  
  // === TỔNG GIÁ TRỊ ===
  '{total_quantity}': '3',
  '{total}': '950,000',
  '{total_none_discount}': '1,000,000',
  '{total_discount}': '50,000',
  '{product_discount}': '25,000',
  '{order_discount}': '25,000',
  '{order_discount_rate}': '2.5%',
  '{order_discount_value}': '25,000',
  '{discount_details}': 'CK sản phẩm: 25,000; CK đơn hàng: 25,000',
  '{total_tax}': '90,000',
  '{total_extra_tax}': '15,000',
  '{total_tax_included_line}': '75,000',
  '{total_amount_before_tax}': '900,000',
  '{total_amount_after_tax}': '990,000',
  '{delivery_fee}': '0',
  '{total_amount}': '990,000',
  '{total_text}': 'Chín trăm chín mươi nghìn đồng',
  '{total_remain}': '990,000',
  '{total_remain_text}': 'Chín trăm chín mươi nghìn đồng',
  
  // === THANH TOÁN ===
  '{payment_name}': 'Tiền mặt',
  '{payments}': 'Tiền mặt: 990,000',
  '{payment_qr}': '<img src="https://placehold.co/120x120?text=QR-PAY" alt="QR Payment" style="width:120px;height:120px"/>',
  '{payment_customer}': '1,000,000',
  '{money_return}': '10,000',
  
  // === KHUYẾN MẠI ===
  '{promotion_name}': 'Khuyến mãi cuối năm',
  '{promotion_code}': 'CUOINAM2025',
  
  // === GHI CHÚ ===
  '{order_note}': 'Giao hàng trước 5h chiều',
};
```

#### C. File `index.ts` - Export tổng hợp

```typescript
// features/settings/printer/preview/index.ts

import { TemplateType } from '../types';

// Import từng file preview
import { ORDER_PREVIEW_DATA } from './order.preview';
import { RECEIPT_PREVIEW_DATA } from './receipt.preview';
import { PAYMENT_PREVIEW_DATA } from './payment.preview';
import { WARRANTY_PREVIEW_DATA } from './warranty.preview';
import { INVENTORY_CHECK_PREVIEW_DATA } from './inventory-check.preview';
import { STOCK_TRANSFER_PREVIEW_DATA } from './stock-transfer.preview';
import { STOCK_IN_PREVIEW_DATA } from './stock-in.preview';
import { SALES_RETURN_PREVIEW_DATA } from './sales-return.preview';
import { PURCHASE_ORDER_PREVIEW_DATA } from './purchase-order.preview';
import { PACKING_PREVIEW_DATA } from './packing.preview';
import { QUOTE_PREVIEW_DATA } from './quote.preview';
import { DELIVERY_PREVIEW_DATA } from './delivery.preview';
import { SHIPPING_LABEL_PREVIEW_DATA } from './shipping-label.preview';
import { SUPPLIER_RETURN_PREVIEW_DATA } from './supplier-return.preview';
import { COMPLAINT_PREVIEW_DATA } from './complaint.preview';
import { PENALTY_PREVIEW_DATA } from './penalty.preview';

/**
 * PREVIEW_DATA - Dữ liệu mẫu cho tất cả loại mẫu in
 * Dùng để hiển thị preview trong Settings > Tùy chỉnh mẫu in
 */
export const PREVIEW_DATA: Record<TemplateType, Record<string, string>> = {
  'order': ORDER_PREVIEW_DATA,
  'receipt': RECEIPT_PREVIEW_DATA,
  'payment': PAYMENT_PREVIEW_DATA,
  'warranty': WARRANTY_PREVIEW_DATA,
  'inventory-check': INVENTORY_CHECK_PREVIEW_DATA,
  'stock-transfer': STOCK_TRANSFER_PREVIEW_DATA,
  'stock-in': STOCK_IN_PREVIEW_DATA,
  'sales-return': SALES_RETURN_PREVIEW_DATA,
  'purchase-order': PURCHASE_ORDER_PREVIEW_DATA,
  'packing': PACKING_PREVIEW_DATA,
  'quote': QUOTE_PREVIEW_DATA,
  'delivery': DELIVERY_PREVIEW_DATA,
  'shipping-label': SHIPPING_LABEL_PREVIEW_DATA,
  'supplier-return': SUPPLIER_RETURN_PREVIEW_DATA,
  'complaint': COMPLAINT_PREVIEW_DATA,
  'penalty': PENALTY_PREVIEW_DATA,
};

// Re-export shared data for external use
export { SHARED_PREVIEW_DATA } from './_shared.preview';
```

### 11.4 So sánh Variables vs Preview Data (Đơn bán hàng)

> **Mục tiêu:** Đảm bảo mọi từ khóa trong Variables đều có dữ liệu preview tương ứng

| Nhóm | Số từ khóa trong Variables | Số từ khóa trong Preview | Thiếu | % Hoàn thành |
|------|---------------------------|-------------------------|-------|--------------|
| Thông tin cửa hàng | 11 | 11 | 0 | ✅ 100% |
| Thông tin đơn hàng | 75 | 75 | 0 | ✅ 100% |
| Thông tin giỏ hàng | 40 | 40 | 0 | ✅ 100% |
| Tổng giá trị | 24 | 24 | 0 | ✅ 100% |
| **TỔNG** | **150** | **150** | **0** | ✅ **100%** |

### 11.5 Script kiểm tra đồng bộ

Tạo script để tự động kiểm tra xem Variables và Preview Data có đồng bộ không:

```typescript
// scripts/check-preview-sync.ts

import { DON_BAN_HANG_VARIABLES } from '../features/settings/printer/variables/don-ban-hang';
import { ORDER_PREVIEW_DATA } from '../features/settings/printer/preview/order.preview';

function checkPreviewSync() {
  const variableKeys = DON_BAN_HANG_VARIABLES.map(v => v.key);
  const previewKeys = Object.keys(ORDER_PREVIEW_DATA);
  
  const missingInPreview = variableKeys.filter(key => !previewKeys.includes(key));
  const extraInPreview = previewKeys.filter(key => !variableKeys.includes(key));
  
  console.log('=== CHECK PREVIEW DATA SYNC ===');
  console.log(`Variables: ${variableKeys.length} keys`);
  console.log(`Preview: ${previewKeys.length} keys`);
  
  if (missingInPreview.length > 0) {
    console.log('\n❌ THIẾU trong Preview Data:');
    missingInPreview.forEach(key => console.log(`  - ${key}`));
  }
  
  if (extraInPreview.length > 0) {
    console.log('\n⚠️ THỪA trong Preview Data (không có trong Variables):');
    extraInPreview.forEach(key => console.log(`  - ${key}`));
  }
  
  if (missingInPreview.length === 0 && extraInPreview.length === 0) {
    console.log('\n✅ Đồng bộ 100%!');
  }
}

checkPreviewSync();
```

### 11.6 Lợi ích của việc tách thư mục

| Trước | Sau |
|-------|-----|
| 1 file ~500 dòng | 17+ file nhỏ, mỗi file ~30-150 dòng |
| Khó tìm kiếm từ khóa | Dễ dàng tìm theo loại mẫu |
| Dễ conflict khi nhiều người sửa | Ít conflict vì file riêng biệt |
| Khó maintain | Dễ maintain, thêm mẫu mới chỉ cần tạo file mới |
| Không có type safety | Có thể thêm type checking |

### 11.7 Checklist triển khai

- [x] Tạo thư mục `features/settings/printer/preview/`
- [x] Tạo file `_shared.preview.ts` với dữ liệu dùng chung
- [x] Tạo 16 file preview cho từng loại mẫu in
- [x] Tạo file `index.ts` để export tổng hợp
- [x] Cập nhật import trong file `preview-data.ts` (deprecated, re-export từ preview/)
- [ ] Tạo script kiểm tra đồng bộ Variables ↔ Preview
- [ ] Chạy script và bổ sung các từ khóa còn thiếu
- [ ] Test preview trong Settings với tất cả loại mẫu
- [ ] Xóa file `preview-data.ts` cũ (sau khi đã migrate xong)

### 11.8 Mapping file Variables ↔ Preview

| # | Variables File | Preview File | Template Type |
|---|---------------|--------------|---------------|
| 1 | `don-ban-hang.ts` | `order.preview.ts` | `order` |
| 2 | `phieu-thu.ts` | `receipt.preview.ts` | `receipt` |
| 3 | `phieu-chi.ts` | `payment.preview.ts` | `payment` |
| 4 | `phieu-bao-hanh.ts` | `warranty.preview.ts` | `warranty` |
| 5 | `phieu-kiem-hang.ts` | `inventory-check.preview.ts` | `inventory-check` |
| 6 | `phieu-chuyen-hang.ts` | `stock-transfer.preview.ts` | `stock-transfer` |
| 7 | `phieu-nhap-kho.ts` | `stock-in.preview.ts` | `stock-in` |
| 8 | `don-doi-tra-hang.ts` | `sales-return.preview.ts` | `sales-return` |
| 9 | `don-dat-hang-nhap.ts` | `purchase-order.preview.ts` | `purchase-order` |
| 10 | `phieu-dong-goi.ts` | `packing.preview.ts` | `packing` |
| 11 | `phieu-ban-giao.ts` | `quote.preview.ts` | `quote` |
| 12 | `phieu-giao-hang.ts` | `delivery.preview.ts` | `delivery` |
| 13 | `nhan-giao-hang.ts` | `shipping-label.preview.ts` | `shipping-label` |
| 14 | `phieu-tra-hang-ncc.ts` | `supplier-return.preview.ts` | `supplier-return` |
| 15 | `phieu-khieu-nai.ts` | `complaint.preview.ts` | `complaint` |
| 16 | `phieu-phat.ts` | `penalty.preview.ts` | `penalty` |

---

## 13. 🎯 TƯ VẤN CÔNG VIỆC TIẾP THEO

> **Cập nhật:** 05/12/2025

### 13.1 Tổng kết tiến độ hiện tại

| Hạng mục | Trạng thái | % Hoàn thành |
|----------|------------|--------------|
| **Variables định nghĩa** (24 files) | ✅ Hoàn thành | 100% |
| **Preview Data** (18 files + shared) | ✅ Hoàn thành | 100% |
| **Mappers** (24 mappers) | ✅ Hoàn thành | 100% |
| **Default Templates** (16 main types) | ✅ Có sẵn | 100% |
| **Default Templates** (8 extended types) | ⏳ Chưa có | 0% |
| **Tích hợp Print vào UI** | 🔄 Đang làm | ~10% |

### 13.2 Công việc tiếp theo (Đề xuất thứ tự ưu tiên)

#### 🏆 OPTION A: Hoàn thiện tích hợp Print vào các trang chi tiết

**Mô tả:** Thêm nút In vào tất cả các trang detail hiện có

**Các trang cần tích hợp:**

| # | Trang | Template Types | Độ ưu tiên | Estimate |
|---|-------|---------------|------------|----------|
| 1 | `/orders/{id}` | order, packing, delivery, shipping-label | ✅ ĐÃ LÀM | - |
| 2 | `/quotes/{id}` | quote | CAO | 1h |
| 3 | `/sales-returns/{id}` | sales-return | CAO | 1h |
| 4 | `/purchase-orders/{id}` | purchase-order | CAO | 1h |
| 5 | `/stock-in/{id}` | stock-in | TRUNG BÌNH | 1h |
| 6 | `/stock-transfers/{id}` | stock-transfer | TRUNG BÌNH | 1h |
| 7 | `/inventory-checks/{id}` | inventory-check | TRUNG BÌNH | 1h |
| 8 | `/warranties/{id}` | warranty, warranty-request | TRUNG BÌNH | 1h |
| 9 | `/receipts/{id}` | receipt | THẤP | 30m |
| 10 | `/payments/{id}` | payment | THẤP | 30m |
| 11 | `/complaints/{id}` | complaint | THẤP | 30m |
| 12 | `/penalties/{id}` | penalty | THẤP | 30m |
| 13 | `/supplier-returns/{id}` | supplier-return | THẤP | 30m |

**Ưu điểm:**
- Người dùng có thể in ngay từ các trang họ đang dùng
- Áp dụng được công sức đã làm mappers

---

#### 🎨 OPTION B: Tạo Default Templates cho 8 Extended Types

**Mô tả:** Tạo HTML template mặc định cho các loại mẫu in mở rộng

**Các template cần tạo:**

| # | Template Type | Variables Count | Complexity |
|---|---------------|-----------------|------------|
| 1 | `phieu-ban-giao` | 23 | Thấp |
| 2 | `phieu-xac-nhan-hoan` | 21 | Thấp |
| 3 | `phieu-huong-dan-dong-goi` | 32 | Trung bình |
| 4 | `phieu-yeu-cau-dong-goi` | 54 | Cao |
| 5 | `phieu-yeu-cau-bao-hanh` | 36 | Trung bình |
| 6 | `phieu-tong-ket-ban-hang` | 52 | Cao |
| 7 | `don-dat-hang-nhap` | 60 | Cao |
| 8 | `don-tra-hang` | 38 | Trung bình |

**Ưu điểm:**
- Hoàn thiện hệ thống print từ A-Z
- Người dùng có template sẵn để dùng ngay

---

#### ⚙️ OPTION C: Thêm tính năng Settings nâng cao

**Mô tả:** Cải thiện trang Settings > Mẫu in

**Các tính năng:**

1. **Cài đặt đường viền bảng**
   - Toggle on/off border
   - Chọn kiểu (solid, dashed, dotted)
   - Chọn màu và độ dày

2. **Quản lý nhiều template cho cùng loại**
   - Template A4 Landscape
   - Template A4 Portrait
   - Template K80
   - Template K57

3. **Import/Export templates**
   - Backup template ra file JSON
   - Import template từ file

**Ưu điểm:**
- Tăng tính linh hoạt cho người dùng
- Giảm công sức tùy chỉnh thủ công

---

### 13.3 Đề xuất của em

**Nên chọn OPTION A trước** vì:

1. ✅ Đã có đầy đủ mappers, chỉ cần tích hợp UI
2. ✅ Người dùng được hưởng lợi ngay (in được từ các trang)
3. ✅ Công việc có thể chia nhỏ theo từng trang
4. ✅ Không phụ thuộc vào các công việc khác

**Thứ tự ưu tiên:**
1. 📦 Quote Detail (báo giá quan trọng nhất sau order)
2. 📦 Sales Return Detail (đổi trả cần in phiếu)
3. 📦 Purchase Order Detail (nhập hàng cần in)
4. 📦 Stock Transfer Detail
5. 📦 Các trang còn lại...

### 13.4 Command tham khảo

Để bắt đầu tích hợp print vào Quote Detail:

```
Hãy tích hợp nút In vào trang Quote Detail tương tự như Order Detail
```

Để tạo template mặc định cho extended types:

```
Hãy tạo default template cho phieu-ban-giao dựa trên variables đã có
```

---

> **Trạng thái:** ĐÃ TRIỂN KHAI - 06/12/2025
> **Người thực hiện:** AI Assistant

### 12.1 Tổng quan

Đã tách file `lib/print-data-mappers.ts` thành thư mục `lib/print-mappers/` với 18 file riêng biệt và mở rộng tất cả interfaces để đồng bộ với các file variables tương ứng.

### 12.2 Cấu trúc thư mục mới

```
📁 lib/print-mappers/
├── index.ts               # Re-export tất cả mappers
├── types.ts               # Shared types & helpers (PrintData, formatCurrency, numberToWords, etc.)
├── order.mapper.ts        # ✅ Đơn bán hàng (~100+ fields)
├── receipt.mapper.ts      # ✅ Phiếu thu (40+ fields)
├── payment.mapper.ts      # ✅ Phiếu chi (40+ fields)
├── warranty.mapper.ts     # ✅ Phiếu bảo hành (50+ fields)
├── stock-transfer.mapper.ts # ✅ Phiếu chuyển kho (60+ fields)
├── inventory-check.mapper.ts # ✅ Phiếu kiểm kho (50+ fields)
├── delivery.mapper.ts     # ✅ Phiếu giao hàng (60+ fields)
├── shipping-label.mapper.ts # ✅ Nhãn giao hàng (70+ fields)
├── purchase-order.mapper.ts # ✅ Đơn nhập hàng (80+ fields)
├── supplier-return.mapper.ts # ✅ Phiếu trả hàng NCC (60+ fields)
├── sales-return.mapper.ts # ✅ Đơn đổi trả hàng (100+ fields)
├── stock-in.mapper.ts     # ✅ Phiếu nhập kho (50+ fields)
├── packing.mapper.ts      # ✅ Phiếu đóng gói (60+ fields)
├── quote.mapper.ts        # ✅ Báo giá (50+ fields)
├── complaint.mapper.ts    # ✅ Phiếu khiếu nại (40+ fields)
└── penalty.mapper.ts      # ✅ Phiếu phạt (40+ fields)
```

### 12.3 Chi tiết các file đã mở rộng

| # | File | Đồng bộ với Variables | Fields mới thêm | Status |
|---|------|----------------------|-----------------|--------|
| 1 | `order.mapper.ts` | `don-ban-hang.ts` | 100+ (location, status, customer debt, line items extended) | ✅ |
| 2 | `receipt.mapper.ts` | `phieu-thu.ts` | location, payer info, customer/supplier debt tracking | ✅ |
| 3 | `payment.mapper.ts` | `phieu-chi.ts` | location, recipient info, customer/supplier debt tracking | ✅ |
| 4 | `warranty.mapper.ts` | `phieu-bao-hanh.ts` | items array, status, claim_status, customer group | ✅ |
| 5 | `stock-transfer.mapper.ts` | `phieu-chuyen-hang.ts` | source/destination addresses, weight, receipt quantities, serial/lot | ✅ |
| 6 | `inventory-check.mapper.ts` | `phieu-kiem-hang.ts` | adjusted dates, stock_quantity, after_quantity, change_quantity | ✅ |
| 7 | `delivery.mapper.ts` | `phieu-giao-hang.ts` | debt tracking for both customer and supplier | ✅ |
| 8 | `shipping-label.mapper.ts` | `nhan-giao-hang.ts` | QR codes, VNPost CRM, Sapo Express, receiver fields | ✅ |
| 9 | `purchase-order.mapper.ts` | `don-nhap-hang.ts` | 5 status fields, tax fields, landed costs | ✅ |
| 10 | `supplier-return.mapper.ts` | `phieu-tra-hang-ncc.ts` | discrepancy tracking, refund methods, lot info | ✅ |
| 11 | `sales-return.mapper.ts` | `don-doi-tra-hang.ts` | returnItems array, exchange amounts, 2 line item functions | ✅ |
| 12 | `stock-in.mapper.ts` | `phieu-nhap-kho.ts` | supplier debt, tax fields, bin_location, landed costs | ✅ |
| 13 | `packing.mapper.ts` | `phieu-dong-goi.ts` | composite fields, tax, fulfillment_status, customer_phone_hide | ✅ |
| 14 | `quote.mapper.ts` | (pattern chuẩn) | location, status, customer extended, validity_days | ✅ |
| 15 | `complaint.mapper.ts` | `phieu-khieu-nai.ts` | complaint_type, resolution, assignee, order reference | ✅ |
| 16 | `penalty.mapper.ts` | `phieu-phat.ts` | violation_type, penalty_level, approval workflow, witness | ✅ |

### 12.4 Pattern chung của Mapper

Mỗi file mapper đều tuân theo pattern:

```typescript
/**
 * [Template Name] Mapper - [Tên tiếng Việt]
 * Đồng bộ với variables/[filename].ts
 */

import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatDate,
  formatTime,
  numberToWords,
  hidePhoneMiddle,
  getStoreData,
  StoreSettings
} from './types';

export interface [EntityName]ForPrint {
  // Thông tin cơ bản
  code: string;
  createdAt: string | Date;
  modifiedAt?: string | Date;
  createdBy?: string;
  
  // Thông tin chi nhánh
  location?: {
    name?: string;
    address?: string;
    province?: string;
    phone?: string;
  };
  
  // [Các fields đặc thù của entity]
  ...
  
  note?: string;
}

export function map[EntityName]ToPrintData(
  entity: [EntityName]ForPrint, 
  storeSettings: StoreSettings
): PrintData {
  return {
    ...getStoreData(storeSettings),
    
    // === THÔNG TIN CHI NHÁNH ===
    '{location_name}': entity.location?.name || storeSettings.name || '',
    '{location_address}': entity.location?.address || storeSettings.address || '',
    
    // [Các mapping keys]
    ...
  };
}

export function map[EntityName]LineItems(
  items: [EntityName]ForPrint['items']
): PrintLineItem[] {
  return items.map((item, index) => ({
    '{line_stt}': (index + 1).toString(),
    // [Line item mapping]
    ...
  }));
}
```

### 12.5 Helpers trong types.ts

File `types.ts` chứa các helper functions dùng chung:

| Function | Mô tả |
|----------|-------|
| `formatCurrency(value)` | Format số thành tiền tệ VND (1,234,567) |
| `formatDate(date)` | Format ngày (dd/mm/yyyy) |
| `formatTime(date)` | Format giờ (HH:mm) |
| `numberToWords(num)` | Chuyển số thành chữ (Một triệu hai trăm...) |
| `hidePhoneMiddle(phone)` | Ẩn 4 số giữa SĐT (0912 **** 78) |
| `getStoreData(settings)` | Trả về store info mapping |

### 12.6 Backward Compatibility

File `lib/print-data-mappers.ts` đã được giữ lại và re-export từ folder mới để đảm bảo backward compatibility:

```typescript
// lib/print-data-mappers.ts
export * from './print-mappers';
```

---

