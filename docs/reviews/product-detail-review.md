# Review: Trang Chi tiết Sản phẩm (Product Detail Page)

**URL**: `http://localhost:5173/products/:systemId`  
**File**: `features/products/detail-page.tsx`  
**Ngày review**: 26/11/2025

---

## 📋 Tổng quan

Trang chi tiết sản phẩm hiển thị đầy đủ thông tin về một sản phẩm, bao gồm:
- Thông tin cơ bản (tên, mô tả, loại, tags...)
- Hình ảnh (thumbnail + gallery)
- Giá & tồn kho
- Logistics (trọng lượng, kích thước, nhà cung cấp)
- Phân tích bán hàng
- Tồn kho theo chi nhánh
- Lịch sử xuất nhập kho

---

## ✅ Các chức năng đã có

### 1. Hiển thị thông tin sản phẩm
- [x] Thông tin cơ bản: tên, SKU, loại, đơn vị, mã vạch
- [x] Mô tả ngắn + mô tả chi tiết (HTML)
- [x] Tags
- [x] SEO title (ktitle)

### 2. Quản lý hình ảnh
- [x] Hiển thị thumbnail
- [x] Hiển thị gallery (tối đa 9 ảnh)
- [x] Image preview dialog (click để xem lớn)
- [x] Lazy loading images
- [x] Cache images trong store (TTL 2 phút)

### 3. Giá & Tồn kho
- [x] Giá vốn, giá nhập gần nhất
- [x] Bảng giá theo pricing policy
- [x] Tổng tồn kho
- [x] Mức đặt hàng lại (reorderLevel)
- [x] Tồn kho an toàn (safetyStock)
- [x] Mức tồn tối đa (maxStock)

### 4. Tồn kho theo chi nhánh
- [x] On-hand (tồn thực tế)
- [x] Committed (đang giao dịch) - có dialog xem chi tiết
- [x] Available (có thể bán)
- [x] In-transit (hàng đang về) - có dialog xem chi tiết
- [x] Đang giao
- [x] Giá trị tồn

### 5. Lịch sử kho
- [x] Hiển thị lịch sử xuất nhập
- [x] Filter theo chi nhánh
- [x] Liên kết đến chứng từ gốc (PO, Receipt, Order...)
- [x] Export

### 6. Thông tin bổ sung
- [x] Logistics (trọng lượng, kích thước)
- [x] Nhà cung cấp chính (link đến detail)
- [x] Phân tích bán hàng (tổng bán, doanh thu, lượt xem)
- [x] Thông tin hệ thống (ngày tạo, người tạo...)

---

## ❌ Các chức năng CHƯA CÓ

### 1. ⚠️ SLA / Cảnh báo Tồn kho

| Tính năng | Trạng thái | Mô tả |
|-----------|------------|-------|
| Cảnh báo hết hàng | ❌ CHƯA CÓ | Không có alert khi tồn = 0 |
| Cảnh báo sắp hết | ❌ CHƯA CÓ | Không có alert khi tồn < reorderLevel |
| Cảnh báo tồn kho an toàn | ❌ CHƯA CÓ | Không có alert khi tồn < safetyStock |
| Cảnh báo tồn kho quá mức | ❌ CHƯA CÓ | Không có alert khi tồn > maxStock |
| SLA Settings cho sản phẩm | ❌ CHƯA CÓ | Không có cài đặt ngưỡng cảnh báo riêng |

### 2. ⚠️ Thiếu trang/báo cáo

| Tính năng | Trạng thái | Mô tả |
|-----------|------------|-------|
| Product SLA Report | ❌ CHƯA CÓ | Báo cáo sản phẩm cần đặt hàng lại |
| Low Stock Alert Page | ❌ CHƯA CÓ | Trang cảnh báo hàng sắp hết |
| Dead Stock Report | ❌ CHƯA CÓ | Báo cáo hàng tồn lâu không bán |
| Fast Moving Report | ❌ CHƯA CÓ | Báo cáo hàng bán chạy |

### 3. Các tính năng khác chưa có

| Tính năng | Trạng thái | Mô tả |
|-----------|------------|-------|
| Warranty info | ⚠️ THIẾU | Chỉ có field `warrantyPeriodMonths` nhưng không hiển thị |
| Price history | ❌ CHƯA CÓ | Lịch sử thay đổi giá |
| Comments/Notes | ❌ CHƯA CÓ | Ghi chú nội bộ về sản phẩm |
| Activity Timeline | ❌ CHƯA CÓ | Timeline hoạt động của sản phẩm |

---

## 📊 So sánh với Customer SLA

| Tính năng | Customer | Product |
|-----------|----------|---------|
| SLA Settings | ✅ Có | ❌ Chưa có |
| Alert Types | 3 loại | 0 loại |
| SLA Report Page | ✅ Có | ❌ Chưa có |
| Dashboard Alerts | ❓ | ❓ |

---

## 🎯 Đề xuất phát triển

### Priority 1: Cảnh báo tồn kho cơ bản
1. **Hiển thị badge cảnh báo** trên detail page khi:
   - Tồn kho = 0 → Badge đỏ "Hết hàng"
   - Tồn kho < reorderLevel → Badge vàng "Cần đặt hàng"
   - Tồn kho < safetyStock → Badge cam "Dưới mức an toàn"
   - Tồn kho > maxStock → Badge xanh "Tồn kho cao"

2. **Hiển thị trên bảng tồn kho theo chi nhánh**
   - Highlight hàng có vấn đề

### Priority 2: Product SLA Settings
Tạo tab mới trong `/settings/inventory`:
- Ngưỡng cảnh báo hết hàng (days without stock)
- Ngưỡng cảnh báo tồn lâu (days without sale)
- Email notification settings

### Priority 3: Product SLA Report
Tạo trang `/reports/product-sla` với các tab:
1. **Cần đặt hàng lại**: Sản phẩm có tồn < reorderLevel
2. **Sắp hết hàng**: Sản phẩm có tồn < safetyStock
3. **Hết hàng**: Sản phẩm có tồn = 0
4. **Tồn kho cao**: Sản phẩm có tồn > maxStock
5. **Hàng tồn lâu**: Sản phẩm không bán > X ngày

### Priority 4: Các tính năng bổ sung
- Hiển thị thời hạn bảo hành
- Price history chart
- Activity timeline

---

## 📁 Files liên quan

```
features/products/
├── detail-page.tsx          # Trang chi tiết hiện tại
├── types.ts                 # Product type (đã có reorderLevel, safetyStock, maxStock)
├── store.ts                 # Product store
├── components/
│   ├── committed-stock-dialog.tsx
│   └── in-transit-stock-dialog.tsx
└── ...

features/settings/inventory/
├── page.tsx                 # Settings page (chưa có SLA settings)
└── types.ts                 # Product types settings

features/reports/
├── inventory-report/        # Báo cáo tồn kho cơ bản
└── (product-sla-report/)    # CHƯA CÓ - cần tạo mới
```

---

## 🔧 Kết luận

**Điểm mạnh:**
- UI chi tiết đầy đủ thông tin
- Quản lý hình ảnh tốt
- Tồn kho theo chi nhánh rõ ràng
- Lịch sử kho liên kết với chứng từ

**Điểm cần cải thiện:**
- ⚠️ **THIẾU SLA/Cảnh báo** - Đây là điểm quan trọng cần bổ sung
- Thiếu warranty display
- Thiếu báo cáo phân tích sản phẩm

**Đề xuất ưu tiên:**
1. Thêm badge cảnh báo tồn kho trên detail page
2. Tạo Product SLA Settings
3. Tạo Product SLA Report page

---

## 📦 Tính năng mới: Sản phẩm Combo (Product Bundle)

> Tham khảo: [Sapo - Quản lý sản phẩm Combo](https://help.sapo.vn/san-pham-combo)

### Khái niệm
**Combo/Bundle** là sản phẩm ảo được tạo từ nhiều sản phẩm đơn lẻ, bán với giá ưu đãi.

**Ví dụ:**
- Combo "Set Gaming Pro" = Bàn phím (1.2tr) + Chuột (450k) + Tai nghe (800k) → Bán 2.2tr (tiết kiệm 250k)

### Nguyên tắc cốt lõi (theo Sapo)

| Quy tắc | Mô tả |
|---------|-------|
| **Combo KHÔNG có kho thực tế** | Tồn kho = MIN(tồn kho SP con / số lượng trong combo) |
| **Tối đa 20 thành phần** | Một combo chứa tối đa 20 sản phẩm con |
| **Combo không chứa combo** | Không được lồng combo vào combo |
| **Số lượng thành phần >= 1** | Không cho phép số lẻ hoặc < 1 |
| **Thuế tính theo SP con** | Mỗi SP con có thuế riêng |
| **Phí vận chuyển theo SP con** | Tính trên thông tin các SP thành phần |

### Ví dụ tính tồn kho Combo

```
Sản phẩm A: có thể bán = 20 (chi nhánh 1)
Sản phẩm B: có thể bán = 11 (chi nhánh 2)
Combo (1A + 1B) → Có thể bán = MIN(20/1, 11/1) = 11
```

### Thiết kế đề xuất

#### Cập nhật Product Type

```typescript
export type ProductType = 'physical' | 'service' | 'digital' | 'combo';

export type ComboItem = {
  productSystemId: SystemId;  // SP con (không phải combo)
  quantity: number;           // Số lượng trong combo (>= 1)
};

export type ComboPricingType = 
  | 'fixed'                   // Giá cố định
  | 'sum_discount_percent'    // Tổng giá - giảm %
  | 'sum_discount_amount';    // Tổng giá - giảm số tiền

export type Product = {
  // ... existing fields ...
  
  // Combo fields (chỉ khi type = 'combo')
  comboItems?: ComboItem[];              // Tối đa 20 items
  comboPricingType?: ComboPricingType;   
  comboDiscount?: number;                // % hoặc VND
};
```

#### Logic tính tồn kho Combo

```typescript
function getComboAvailableStock(
  combo: Product,
  allProducts: Product[],
  branchSystemId: SystemId
): number {
  if (combo.type !== 'combo' || !combo.comboItems?.length) return 0;
  
  const availablePerItem = combo.comboItems.map(item => {
    const product = allProducts.find(p => p.systemId === item.productSystemId);
    if (!product) return 0;
    
    const onHand = product.inventoryByBranch?.[branchSystemId] || 0;
    const committed = product.committedByBranch?.[branchSystemId] || 0;
    const available = onHand - committed;
    
    return Math.floor(available / item.quantity);
  });
  
  return Math.min(...availablePerItem);
}
```

### UI Form tạo Combo

```
┌─────────────────────────────────────────────────────────────────┐
│ Tạo sản phẩm Combo                                              │
├─────────────────────────────────────────────────────────────────┤
│ Loại: [● Combo]                                                 │
│ Tên:  [Set Gaming Pro_________________________]                 │
│                                                                 │
│ ═══ THÀNH PHẦN COMBO (tối đa 20) ═══                            │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Sản phẩm              │ SL │ Giá đơn vị │ Thành tiền      │   │
│ ├───────────────────────────────────────────────────────────┤   │
│ │ Bàn phím cơ RGB K1    │ 1  │ 1,200,000  │ 1,200,000       │   │
│ │ Chuột gaming M5       │ 1  │   450,000  │   450,000       │   │
│ │ Tai nghe H7 Pro       │ 1  │   800,000  │   800,000       │   │
│ ├───────────────────────────────────────────────────────────┤   │
│ │                              TỔNG GIÁ GỐC: 2,450,000      │   │
│ └───────────────────────────────────────────────────────────┘   │
│ [+ Thêm sản phẩm]                                               │
│                                                                 │
│ ═══ CÁCH TÍNH GIÁ ═══                                           │
│ ○ Giá cố định:  [2,200,000___] → Tiết kiệm 250,000 (10%)        │
│ ● Giảm theo %:  [10_________] % → 2,205,000                     │
│ ○ Giảm tiền:    [250,000____] → 2,200,000                       │
│                                                                 │
│ 📊 Tồn kho dự kiến: 8 combo                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Các trường hợp đặc biệt

| Tình huống | Xử lý |
|------------|-------|
| SP con bị xóa | Cảnh báo + yêu cầu cập nhật combo |
| SP con ngừng KD | Cảnh báo khi tạo đơn |
| SP con hết hàng | Combo = 0 tại chi nhánh đó |
| Trả hàng combo | Cho phép trả từng SP hoặc cả combo |
| Bảo hành combo | BH theo từng SP con |
| Khuyến mại | Phải set riêng cho combo |

### Checklist triển khai

#### Phase 1: Cơ bản ✅ HOÀN THÀNH
- [x] Thêm type `combo` vào ProductType → `types.ts`
- [x] Thêm fields `comboItems`, `comboPricingType`, `comboDiscount` → `types.ts`
- [x] Tạo `combo-utils.ts` (tính tồn kho, giá, validation)
- [x] Validation: không lồng combo, max 20 items, qty >= 1 → `validation.ts`

**Files đã tạo/sửa:**
```
features/products/
├── types.ts          # Thêm ComboItem, ComboPricingType, combo fields
├── combo-utils.ts    # NEW - Utilities: calculateComboStock, validateComboItems...
└── validation.ts     # Thêm combo validation rules
```

#### Phase 2: UI Form ✅ HOÀN THÀNH
- [x] Tạo `ComboSection` component
- [x] Thêm option "Combo" vào Select loại sản phẩm
- [x] Product selector (loại trừ combo và sản phẩm đã chọn)
- [x] Tính giá realtime (3 cách: cố định, giảm %, giảm tiền)
- [x] Hiển thị tồn kho dự kiến
- [x] Tích hợp vào `product-form.tsx`

**Files đã tạo/sửa:**
```
features/products/
├── product-form.tsx              # Thêm ComboSection, combo default values
└── components/
    └── combo-section.tsx         # NEW - UI component cho combo items
```

**Tính năng ComboSection:**
- Bảng thành phần combo với Sản phẩm, Số lượng, Đơn giá, Thành tiền
- Combobox tìm kiếm sản phẩm (loại trừ combo và SP đã chọn)
- 3 cách tính giá: Giá cố định / Giảm % / Giảm tiền
- Summary: Giá gốc, Giá combo, Tiết kiệm, Tồn kho dự kiến

#### Phase 3: Tích hợp ✅ HOÀN THÀNH
- [x] Hiển thị combo trong danh sách SP (badge "Combo", cột Loại, cột Tồn kho = "Ảo")
- [x] Detail page cho combo (ComboItemsCard: thành phần, giá, tồn kho theo chi nhánh)
- [x] Thêm 2 combo mẫu vào `data.ts` để test
- [x] Tạo đơn hàng với combo (trừ kho SP con) ✅

**Files đã tạo/sửa:**
```
features/products/
├── columns.tsx       # Badge "Combo" trong name, loại type, tồn kho "Ảo"
├── detail-page.tsx   # ComboItemsCard component hiển thị chi tiết combo
└── data.ts           # Thêm 2 combo mẫu: COMBO001, COMBO002

features/orders/
└── store.ts          # Xử lý kho combo trong tất cả các thao tác đơn hàng
```

**Xử lý kho combo trong đơn hàng (`orders/store.ts`):**
- ✅ Helper function `getComboStockItems()`: mở rộng combo thành các SP con
- ✅ `add()`: khi tạo đơn, commit kho SP con thay vì combo
- ✅ `cancelOrder()`: hoàn trả committed về kho SP con
- ✅ `confirmInStorePickup()`: dispatch + complete từ kho SP con
- ✅ `dispatchFromWarehouse()`: chuyển kho SP con sang transit
- ✅ `completeDelivery()`: ghi nhận xuất kho từ SP con
- ✅ `failDelivery()`: trả kho SP con từ transit
- ✅ `cancelDelivery()`: trả kho SP con từ transit
- ✅ GHTK Webhook: dispatch/complete/return xử lý SP con

#### Phase 4: Báo cáo tồn kho Combo ✅ HOÀN THÀNH
- [x] Cập nhật types với fields mới (isCombo, comboAvailable, bottleneckProducts)
- [x] Thêm Tabs filter: Tất cả / SP đơn / Combo
- [x] Hiển thị badge "Combo" trong danh sách
- [x] Tồn kho combo hiển thị "Ảo (số lượng)" với tooltip
- [x] Cột "Có thể bán" hiển thị combo available với warning icon nếu hết hàng
- [x] Hiển thị SP bottleneck trong tooltip khi combo = 0
- [x] Link tên sản phẩm đến detail page
- [x] Summary stats tách biệt cho combo

**Files đã sửa:**
```
features/reports/inventory-report/
├── types.ts    # Thêm isCombo, comboAvailable, bottleneckProducts, ProductTypeFilter
├── columns.tsx # Badge Combo, tooltip, warning icon, link to detail
└── page.tsx    # Tabs filter, tính toán combo stock, summary stats
```

#### Phase 5: Trả hàng Combo ✅ HOÀN THÀNH
- [x] Helper function `getReturnStockItems()`: mở rộng combo return thành SP con
- [x] Cập nhật `addWithSideEffects()`: khi trả combo, cộng kho cho SP con
- [x] Cập nhật `confirmReceipt()`: khi xác nhận nhận hàng combo, cộng kho cho SP con

**File đã sửa:**
```
features/sales-returns/
└── store.ts    # Import isComboProduct, getReturnStockItems helper
```

#### Phase 6: Product SLA / Cảnh báo tồn kho ✅ HOÀN THÀNH
- [x] Tạo `stock-alert-utils.ts` - utilities cho stock alerts
- [x] Tạo `components/stock-alert-badges.tsx` - UI component badges
- [x] Thêm Stock Alerts Card vào detail page
- [x] Thêm stock alert badge vào product list (columns)
- [x] Tạo Product SLA Report page (`/reports/product-sla`)
- [x] Thêm route và navigation

**Files đã tạo:**
```
features/products/
├── stock-alert-utils.ts              # Core utilities: getProductStockAlerts, getSuggestedOrderQuantity...
└── components/
    └── stock-alert-badges.tsx        # StockAlertBadges, StockAlertBadge components

features/reports/product-sla-report/  # NEW folder
├── types.ts                          # StockAlertReportRow, StockAlertFilter
├── columns.tsx                       # Table columns với badge, tooltip, icons
└── page.tsx                          # Report page với summary cards, tabs, table
```

**Files đã sửa:**
```
features/products/
├── detail-page.tsx   # Import stock-alert-utils, StockAlertBadges, hiển thị Alert Card
└── columns.tsx       # Import StockAlertBadge, hiển thị trong cột name

lib/
├── router.ts              # Thêm ROUTES.REPORTS.PRODUCT_SLA
└── route-definitions.tsx  # Thêm route ProductSlaReportPage
```

**Tính năng Stock Alerts:**

1. **4 loại cảnh báo:**
   - 🔴 `out_of_stock` - Hết hàng (available = 0)
   - 🟡 `low_stock` - Sắp hết (available < reorderLevel)
   - 🟠 `below_safety` - Dưới mức an toàn (available < safetyStock)
   - 🔵 `over_stock` - Tồn kho cao (onHand > maxStock)

2. **Detail Page:**
   - Card cảnh báo màu vàng với badges
   - Mô tả chi tiết từng cảnh báo
   - Đề xuất số lượng đặt thêm

3. **Product List:**
   - Badge cảnh báo bên cạnh tên SP
   - Tooltip hiển thị chi tiết

4. **Product SLA Report (/reports/product-sla):**
   - 4 Summary cards (Hết hàng, Sắp hết, Dưới an toàn, Tồn cao)
   - Tabs filter theo loại cảnh báo
   - Table với đầy đủ thông tin: SP, cảnh báo, tồn kho, đề xuất đặt...
   - Link đến chi tiết SP
   - Export báo cáo


#### Phase 7: ProductCategory + SLA Settings ✅ HOÀN THÀNH
- [x] Nâng cấp ProductCategory theo WordPress (SEO fields)
- [x] Hỗ trợ 3 cấp danh mục (max level = 2)
- [x] Form dialog với tabs Basic/SEO
- [x] Auto-generate slug từ tên
- [x] Thêm tab "Cảnh báo tồn kho" trong Settings
- [x] Store lưu SLA settings

**Files đã tạo:**
```
features/settings/inventory/
└── sla-settings-store.ts   # Zustand store cho ProductSlaSettings
```

**Files đã sửa:**
```
features/settings/inventory/
├── types.ts                   # ProductCategory SEO fields, ProductSlaSettings interface
├── setting-form-dialogs.tsx   # ProductCategoryFormDialog với tabs Basic/SEO
└── page.tsx                   # Thêm SlaSettingsTabContent, tab "Cảnh báo tồn kho"
```

**ProductCategory Fields (WordPress-like):**
```typescript
interface ProductCategory {
  // Basic
  systemId, id, name, slug
  // SEO (NEW)
  seoTitle         // Title tag cho SEO
  metaDescription  // Meta description cho Google
  shortDescription // Mô tả ngắn (hiển thị đầu trang)
  longDescription  // Mô tả chi tiết (cuối trang, HTML)
  thumbnailImage   // Ảnh đại diện
  // Hierarchy
  parentId, path, level  // max 3 cấp: 0, 1, 2
  // Display
  color, icon, sortOrder, isActive
}
```

**SLA Settings Tab:**
- **Ngưỡng mặc định:**
  - Mức đặt hàng lại (defaultReorderLevel)
  - Tồn kho an toàn (defaultSafetyStock)
  - Tồn kho tối đa (defaultMaxStock)
- **Cảnh báo hàng tồn lâu:**
  - Hàng chậm bán (slowMovingDays, default: 30)
  - Hàng chết (deadStockDays, default: 90)
- **Thông báo email:**
  - Bật/tắt email alerts
  - Tần suất: realtime / daily / weekly
  - Danh sách email nhận
- **Dashboard:**
  - Hiển thị widget cảnh báo
  - Chọn loại cảnh báo hiển thị
