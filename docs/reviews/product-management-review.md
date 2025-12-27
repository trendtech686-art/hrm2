# Product Management Feature Review

**Ngày review:** 28/11/2025  
**Phạm vi:** `features/products/`  
**Phiên bản:** Current  

---

## 1. Tổng quan kiến trúc ⭐

### 1.1 Cấu trúc thư mục
```
features/products/
├── types.ts                 # Product type definitions
├── store.ts                 # Zustand store + inventory actions
├── validation.ts            # Zod schema + business rules
├── product-service.ts       # Query/filter service
├── product-importer.ts      # Import Excel/CSV logic
├── combo-utils.ts           # Combo product utilities
├── stock-alert-utils.ts     # Inventory alert utilities
├── image-store.ts           # Staging/permanent image management
├── data.ts                  # Seed data
├── columns.tsx              # DataTable columns
├── trash-columns.tsx        # Trash view columns
├── page.tsx                 # List page
├── detail-page.tsx          # Detail view
├── form-page.tsx            # Create/Edit page
├── form.tsx                 # Form component (deprecated?)
├── product-form.tsx         # Main form component
├── product-form-complete.tsx # Enhanced form with tabs
├── trash-page.tsx           # Soft-deleted products
├── components/              # Sub-components
│   ├── combo-section.tsx
│   ├── combo-product-search.tsx
│   ├── committed-stock-dialog.tsx
│   ├── in-transit-stock-dialog.tsx
│   ├── quick-add-product-dialog.tsx
│   └── stock-alert-badges.tsx
├── hooks/
│   └── use-products-query.ts
└── __tests__/
    ├── product-importer.test.ts
    └── product-service.test.ts
```

### 1.2 Điểm mạnh ✅

| Aspect | Đánh giá |
|--------|----------|
| **Type Safety** | Excellent - SystemId/BusinessId branded types |
| **Inventory Model** | Advanced - Multi-branch, committed, in-transit tracking |
| **Combo Support** | Comprehensive - Sapo-like combo với virtual inventory |
| **Stock Alerts** | Complete - Out of stock, low stock, safety, over stock |
| **Image Management** | Staging/Permanent pattern giống employee documents |
| **Search** | Fuse.js fuzzy search + pagination |
| **Import/Export** | Flexible branch inventory mapping |
| **Validation** | Comprehensive Zod schema với business rules |

---

## 2. Phân tích chi tiết các module 📋

### 2.1 Types (`types.ts`) ✅ Excellent

**Điểm mạnh:**
```typescript
// Branded types cho type safety
systemId: SystemId;
id: BusinessId; // User-facing SKU

// Multi-branch inventory model
inventoryByBranch: Record<SystemId, number>;
committedByBranch: Record<SystemId, number>;
inTransitByBranch: Record<SystemId, number>;

// Combo product support
comboItems?: ComboItem[];
comboPricingType?: ComboPricingType;
comboDiscount?: number;
```

**Đầy đủ fields:**
- Basic info: name, description, SEO fields
- Classification: type, category, brand, storage location
- Pricing: prices by policy, cost, min, suggested retail
- Inventory: multi-branch, reorder level, safety stock, max stock
- Logistics: weight, dimensions, barcode
- Lifecycle: launched date, discontinued date, warranty
- Analytics: totalSold, totalRevenue, viewCount
- Audit: createdAt, updatedAt, createdBy, updatedBy

### 2.2 Store (`store.ts`) ✅ Excellent

**Inventory Actions:**
```typescript
updateInventory()      // Direct stock adjustment
commitStock()          // Reserve for order
uncommitStock()        // Release reservation
dispatchStock()        // Ship (decreases inventory, increases inTransit)
completeDelivery()     // Confirm delivered (decreases inTransit)
returnStockFromTransit() // Return failed delivery
updateLastPurchasePrice() // Update from PO
searchProducts()       // Fuse.js async search
```

**Điểm mạnh:**
- Immutable state updates
- Comprehensive stock lifecycle
- Fresh Fuse instance per search (tránh stale data)
- Persistence với localStorage

### 2.3 Validation (`validation.ts`) ✅ Excellent

**Business Rules Implemented:**
1. ✅ SKU format: `^[A-Z0-9-]+$`
2. ✅ Barcode format validation
3. ✅ Combo validation: min 2, max 20 items
4. ✅ No duplicate products in combo
5. ✅ No nested combos
6. ✅ Combo pricing type required when type='combo'
7. ✅ Discount percentage ≤ 100%
8. ✅ Cost price ≤ min selling price (warning)
9. ✅ Safety stock ≤ reorder level

**Unique Validation Helpers:**
```typescript
validateUniqueId()      // Check SKU uniqueness
validateUniqueBarcode() // Check barcode uniqueness
```

### 2.4 Combo Utilities (`combo-utils.ts`) ✅ Excellent

**Tham khảo Sapo:**
- MAX_COMBO_ITEMS = 20
- MIN_COMBO_ITEMS = 2
- Combo stock = MIN(child_available / quantity_in_combo)
- No nested combos allowed

**Functions:**
```typescript
isComboProduct()              // Type check
canAddToCombo()               // Validate addable
validateComboItems()          // Full validation
calculateComboStock()         // Virtual inventory
calculateComboStockAllBranches()
calculateComboPrice()         // By pricing type
calculateComboCostPrice()     // Sum of child costs
calculateComboLastPurchasePrice()
calculateComboMinPrice()
calculateComboPricesByPolicy()
getComboSummary()
hasComboStock()
getComboBottleneckProducts()  // Find limiting products
```

### 2.5 Stock Alert Utilities (`stock-alert-utils.ts`) ✅ Excellent

**Alert Types:**
| Type | Severity | Condition |
|------|----------|-----------|
| out_of_stock | critical | available ≤ 0 |
| low_stock | warning | available < reorderLevel |
| below_safety | warning | available < safetyStock |
| over_stock | info | onHand > maxStock |

**Functions:**
```typescript
getTotalAvailableStock()      // onHand - committed
getTotalOnHandStock()         // Sum of inventory
getProductStockAlerts()       // Get all alerts
getProductStockAlertsByBranch()
getMostSevereAlert()          // For display
needsReorder()                // For reports
isOutOfStock()                // Quick check
getSuggestedOrderQuantity()   // Auto-suggest PO qty
```

### 2.6 Product Service (`product-service.ts`) ✅ Good

**Query Params:**
- search, statusFilter, typeFilter, categoryFilter
- dateRange
- pagination, sorting

**Pipeline:**
1. Filter by status, type, category
2. Filter by date range
3. Fuse.js search
4. Sort
5. Paginate

---

## 3. Vấn đề cần cải thiện ⚠️

### 3.1 Multiple Form Components (MEDIUM)
**File:** `form.tsx`, `product-form.tsx`, `product-form-complete.tsx`

**Vấn đề:**
- 3 file form gây confusion
- `form.tsx` có thể deprecated
- Logic bị phân tán

**Đề xuất:**
```
features/products/
├── form/
│   ├── product-form.tsx         # Main form
│   ├── basic-info-section.tsx
│   ├── pricing-section.tsx
│   ├── inventory-section.tsx
│   ├── combo-section.tsx        # Move from components/
│   ├── images-section.tsx
│   └── index.ts
```

### 3.2 Missing isStockTracked Logic (MEDIUM) ✅ FIXED
**File:** `store.ts`, `stock-alert-utils.ts`

**Đã triển khai (2024-11-28):**
- Thêm `canModifyStock()` helper function trong `store.ts`
- Guard tất cả 6 inventory operations: `updateInventory`, `commitStock`, `uncommitStock`, `dispatchStock`, `completeDelivery`, `returnStockFromTransit`
- Check `isStockTracked !== false && type !== 'combo'`

```typescript
// store.ts
const canModifyStock = (product: Product | undefined): boolean => {
  if (!product) return false;
  if (product.isStockTracked === false) return false;
  if (product.type === 'combo') return false; // Combo has virtual stock
  return true;
};
```

### 3.3 Price Policy Coupling (LOW) ✅ FIXED
**File:** `columns.tsx`, `detail-page.tsx`

**Đã triển khai (2024-11-28):**
- Tạo `features/products/hooks/use-product-pricing.ts`
- Exports: `useDefaultSellingPolicy`, `useSalesPolicies`, `useProductPrice`, `useProductPrices`
- Sử dụng React hooks pattern thay vì `getState()` trong render

```typescript
// Thay vì:
const { data: pricingPolicies } = usePricingPolicyStore.getState();

// Sử dụng:
const defaultPolicy = useDefaultSellingPolicy();
const price = useProductPrice(product, defaultPolicy?.systemId);
```

### 3.4 Image Store Separation (LOW)
**File:** `image-store.ts`

**Vấn đề:**
- Image store tách riêng khỏi product store
- Có thể sync issues giữa staging và product.thumbnailImage/galleryImages

**Đề xuất:**
- Đảm bảo clear staging images khi save thành công
- Thêm method `syncPermanentToProduct()` để update product record

### 3.5 Missing Barcode Validation on Import (MEDIUM)
**File:** `product-importer.ts`

**Vấn đề:**
- Import không validate barcode uniqueness
- Có thể tạo duplicate barcodes

**Đề xuất:**
```typescript
export function transformImportedRows(rows, options) {
  const existingBarcodes = new Set(
    useProductStore.getState().data.map(p => p.barcode?.toUpperCase())
  );
  
  return rows.map((item, index) => {
    if (item.barcode && existingBarcodes.has(item.barcode.toUpperCase())) {
      throw new Error(`Row ${index + 1}: Barcode "${item.barcode}" already exists`);
    }
    // ...
  });
}
```

### 3.6 Combo Stock Not Reactive (MEDIUM) ✅ FIXED
**File:** `detail-page.tsx`, `columns.tsx`

**Đã triển khai (2024-11-28):**
- Tạo `features/products/hooks/use-combo-stock.ts`
- Exports: `useComboStock`, `useComboStockAllBranches`, `useComboStockWithBranches`, `useComboBottlenecks`, `useTotalComboStock`, `useHasComboStock`, `useComboItemsWithStock`
- Tự động re-render khi child product inventory thay đổi

```typescript
// Thay vì tính tại render:
const comboStock = calculateComboStock(product.comboItems, allProducts, branchId);

// Sử dụng reactive hook:
const comboStock = useComboStock(product, branchId);
```

### 3.7 No Combo Price in prices Record (LOW) ✅ FIXED
**File:** `types.ts`, `product-form-complete.tsx`, `combo-utils.ts`

**Đã triển khai (2024-11-28):**
- Thêm `calculateFinalComboPricesByPolicy()` trong `combo-utils.ts`
- Tính giá combo WITH discount và lưu vào `prices` record
- Form auto-update `prices` khi `comboItems`, `comboPricingType`, hoặc `comboDiscount` thay đổi

```typescript
// combo-utils.ts
export function calculateFinalComboPricesByPolicy(
  comboItems, allProducts, comboPricingType, comboDiscount, defaultPolicyId
): Record<string, number>

// product-form-complete.tsx - 2 separate useEffects:
// 1. Update base prices (cost, lastPurchase, min) when comboItems change
// 2. Update final prices with discount when comboPricingType/comboDiscount change
```

### 3.8 Form Size Complexity (MEDIUM) ⏳ DEFERRED
**File:** `product-form-complete.tsx`

**Vấn đề:**
- File có 1286 dòng với nhiều sections
- Khó maintain và test

**Status (2024-11-28):**
- Đã xác nhận KHÔNG còn file orphan (`form.tsx`, `product-form.tsx` đã được xóa)
- Chỉ còn `product-form-complete.tsx` và `form-page.tsx`
- Refactor tách tab components sẽ thực hiện sau

---

## 4. Tính năng tốt cần giữ 🌟

### 4.1 Stock Alert System
```typescript
// Comprehensive alert types với severity levels
// Badge component cho UI indication
// Suggested order quantity calculation
```

### 4.2 Combo Implementation
```typescript
// Sapo-reference architecture
// Virtual inventory calculation
// Bottleneck product detection
// Multiple pricing strategies
```

### 4.3 Import Flexibility
```typescript
// Branch inventory mapping via identifiers
// Normalized field key matching
// Fallback inventory keys
```

### 4.4 Multi-Branch Inventory
```typescript
// On-hand, committed, in-transit tracking
// Branch-specific stock operations
// Aggregate calculations
```

---

## 5. Security Considerations 🔒

### 5.1 Input Sanitization ✅ FIXED
**File:** `product-form.tsx`, `form-page.tsx`, `detail-page.tsx`

**Đã triển khai (2024-11-28):**
- Tạo `lib/sanitize.ts` với các utilities:
  - `sanitizeHtml()` - Sanitize HTML cho dangerouslySetInnerHTML
  - `sanitizeToText()` - Strip HTML tags, trả về plain text
  - `sanitizeTipTapContent()` - Cho TipTap editor content
  - `isHtmlSafe()` - Validation helper

- Áp dụng trong `detail-page.tsx`:
```typescript
import { sanitizeHtml } from '@/lib/sanitize.ts';

// Trước:
<div dangerouslySetInnerHTML={{ __html: product.description }} />

// Sau:
<div dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
```

### 5.2 Image Upload Validation (PARTIAL)
**File:** `form-page.tsx`

**Đề xuất thêm:**
- Validate file types
- Limit file size
- Check image dimensions

---

## 6. Testing Coverage 📊

### 6.1 Existing Tests ✅
- `product-importer.test.ts` - Import logic
- `product-service.test.ts` - Query/filter

### 6.2 New Tests Added (2024-11-28) ✅
- `combo-utils.test.ts` - **32 tests** covering:
  - `isComboProduct`, `canAddToCombo`
  - `validateComboItems` edge cases
  - `calculateComboStock`, `calculateComboStockAllBranches`
  - `calculateComboPrice` với các pricing types
  - `calculateComboCostPrice`, `calculateComboPricesByPolicy`
  - `calculateFinalComboPricesByPolicy` (new function)
  - `hasComboStock`, `getComboBottleneckProducts`

- `stock-alert-utils.test.ts` - **28 tests** covering:
  - `getTotalOnHandStock`, `getTotalAvailableStock`
  - `getProductStockAlerts` tất cả alert types
  - `getProductStockAlertsByBranch`
  - `getMostSevereAlert` priority logic
  - `needsReorder`, `isOutOfStock`
  - `getSuggestedOrderQuantity`

**Total: 60 tests PASS ✅**

### 6.3 Still Missing Tests
- [ ] Validation schema edge cases
- [ ] Store inventory operations
- [ ] Image store staging/permanent flow

---

## 7. Performance Considerations ⚡

### 7.1 Fuse.js Instance Creation (OK)
```typescript
// Fresh instance per search - correct for data freshness
const fuse = new Fuse(allProducts, fuseOptions);
```

### 7.2 Large Product List (POTENTIAL)
**Đề xuất:**
- Virtual scrolling cho list > 1000 products
- Debounce search input
- Lazy load images

### 7.3 Combo Stock Calculation (OK)
```typescript
// useMemo với correct dependencies
const comboStockByBranch = React.useMemo(() => {
  return calculateComboStock(comboItems, allProducts, branchSystemId);
}, [comboItems, allProducts, branchSystemId]);
```

---

## 8. Recommendations Summary

### Immediate Actions (Sprint này)
1. ✅ Consolidate form components
2. ⚠️ Add barcode uniqueness check on import
3. ⚠️ Add isStockTracked check in store operations

### Short-term (1-2 sprints)
1. Add DOMPurify for HTML content
2. Add combo utilities tests
3. Refactor form into tab components

### Long-term (Backlog)
1. Virtual scrolling for large lists
2. Computed combo prices cached in store
3. Real-time stock sync via WebSocket (khi có backend)

---

## 9. Score Card

| Criteria | Score | Notes |
|----------|-------|-------|
| Type Safety | ⭐⭐⭐⭐⭐ | Excellent branded types |
| Code Organization | ⭐⭐⭐⭐ | Good but form needs cleanup |
| Business Logic | ⭐⭐⭐⭐⭐ | Comprehensive combo + stock alerts |
| Validation | ⭐⭐⭐⭐⭐ | Complete with business rules |
| Error Handling | ⭐⭐⭐⭐ | Good but missing some edge cases |
| Testing | ⭐⭐⭐ | Basic - needs more coverage |
| Security | ⭐⭐⭐ | Missing HTML sanitization |
| Performance | ⭐⭐⭐⭐ | Good, ready for optimization |

**Overall: 4.1/5** - Production-ready với một số improvements cần thiết

---

*Review bởi: AI Assistant*  
*Thời gian review: ~45 phút*
