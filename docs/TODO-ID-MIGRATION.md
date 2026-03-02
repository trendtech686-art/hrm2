# TODO: Migration ID System từ Date.now() sang ID System chuẩn

> **Mục tiêu**: Chuyển tất cả các nơi dùng `Date.now()` để sinh ID sang hệ thống ID chuẩn (`generateNextIdsWithTx`, `generateNextIds` từ `@/lib/id-system`)

## Nguyên tắc Migration

1. **Dùng `generateNextIdsWithTx`** cho code trong transaction
2. **Dùng `generateNextIds`** cho code không có transaction
3. **Entity type** phải có trong `ID_CONFIG` (`lib/id-config-constants.ts`)
4. **Nếu entity chưa có** trong ID_CONFIG → thêm vào trước

---

## NHÓM 1: app/actions (Ưu tiên cao - Business Logic)

### 1.1 Finance & Payments
- [ ] `app/actions/payments.ts` ✅ ĐÃ FIX
- [ ] `app/actions/receipts.ts` - Kiểm tra có dùng Date.now() không
- [ ] `app/actions/settings/cash-accounts.ts:341` - `txId: CTX-${Date.now()}`
- [ ] `app/actions/settings/payment-types.ts:160` - `id: PT_${Date.now()}`

### 1.2 Tasks & Templates
- [ ] `app/actions/task-templates.ts:258-259` - `systemId/id: TASK_TEMPLATES_${Date.now()}`
- [ ] `app/actions/recurring-tasks.ts:249-250` - `systemId/id: RECURRING_TASKS_${Date.now()}`
- [ ] `app/actions/tasks.ts:329` - `id: comment_${Date.now()}`

### 1.3 Purchasing
- [ ] `app/actions/purchase-returns.ts:64` - `id: PR-${Date.now()}`

### 1.4 Settings Actions
- [ ] `app/actions/settings/appearance.ts:93-94, 135-136` - appearance IDs
- [ ] `app/actions/settings/employee-settings.ts:109-110` - employee settings IDs
- [ ] `app/actions/settings/inventory-settings.ts:74-75, 229-230, 435-436` - nhiều chỗ

---

## NHÓM 2: app/api (API Routes)

### 2.1 Core Entities
- [ ] `app/api/users/route.ts:90` - `USR${Date.now()}`
- [ ] `app/api/roles/route.ts:67` - `ROLE${Date.now()}`
- [ ] `app/api/stock-locations/route.ts:58` - `SLOC${Date.now()}`
- [ ] `app/api/stock-history/route.ts:141` - `SH${Date.now()}`
- [ ] `app/api/workflow-templates/route.ts:69` - `SET${Date.now()}`

### 2.2 Products & Inventory
- [ ] `app/api/products/route.ts:238` - fallback Date.now()
- [ ] `app/api/products/[systemId]/inventory/route.ts:123` - `STH${Date.now()}`
- [ ] `app/api/purchase-orders/route.ts:229` - `POI${Date.now()}`
- [ ] `app/api/purchase-orders/[systemId]/route.ts:199` - `POI${Date.now()}`

### 2.3 Settings API
- [ ] `app/api/settings/route.ts:89, 135` - `SET${Date.now()}`
- [ ] `app/api/settings/global/route.ts:52` - `SET_GLOBAL_${Date.now()}`
- [ ] `app/api/settings/shipping/route.ts:57` - `SET_SHIP_${Date.now()}`
- [ ] `app/api/settings/trendtech/route.ts:70` - `SET_TREND_${Date.now()}`
- [ ] `app/api/settings/taxes/route.ts:89-90` - `TAX_${Date.now()}`
- [ ] `app/api/settings/sales-channels/route.ts:81-82` - `SC_${Date.now()}`
- [ ] `app/api/settings/payment-methods/route.ts:55-56` - `PM_${Date.now()}`
- [ ] `app/api/settings/print-templates/route.ts:101` - `tpl-${Date.now()}`
- [ ] `app/api/settings/print-templates/[systemId]/duplicate/route.ts:52`
- [ ] `app/api/settings/roles/route.ts:61` - `SET_ROLE_${Date.now()}`
- [ ] `app/api/settings/payroll-templates/route.ts:76` - `SET_PAYTPL_${Date.now()}`
- [ ] `app/api/settings/pkgx/route.ts:70` - `SET_PKGX_${Date.now()}`
- [ ] `app/api/employee-documents/route.ts:81, 118` - `SET_DOCS_${Date.now()}`
- [ ] `app/api/employee-payroll-profiles/[employeeSystemId]/route.ts:53`

---

## NHÓM 3: features/ (Frontend Stores & Components)

### 3.1 Settings Stores
- [ ] `features/settings/complaints/complaints-settings-page.tsx:261, 531`
- [ ] `features/settings/employees/hooks/use-role-settings.ts:62` - `role_${Date.now()}`
- [ ] `features/settings/other/website-tab.tsx:211`
- [ ] `features/settings/other/email-template-tab.tsx:357`

### 3.2 Employee Features
- [ ] `features/employees/document-store.ts:191, 242` - `doc-${Date.now()}`

### 3.3 Orders & Purchase
- [ ] `features/orders/components/order-form-page.tsx:764` - temp ID
- [ ] `features/orders/components/customer-address-selector.tsx:309` - `addr_${Date.now()}`
- [ ] `features/orders/components/shipping-integration.tsx:917`
- [ ] `features/purchase-orders/components/order-summary-card.tsx:112, 133, 160`

### 3.4 Products
- [ ] `features/products/product-form-complete.tsx:95, 114, 127, 136` - URL IDs

### 3.5 Warranty & Complaints
- [ ] `features/warranty/warranty-form-page-simple.tsx:112, 123` - received/processed IDs

### 3.6 Brands
- [ ] `features/brands/page.tsx:149` - `BRAND-${Date.now()}`

### 3.7 Customer SLA
- [ ] `features/customers/sla/ack-storage.ts:161`

---

## NHÓM 4: components/ (Shared Components)

- [ ] `components/DatabaseComments.tsx:76` - `temp-${Date.now()}`
- [ ] `components/shared/advanced-filter-panel.tsx:595` - `preset-${Date.now()}`
- [ ] `components/ui/notification-center.tsx:96, 318` - notification IDs

---

## NHÓM 5: lib/ (Utilities)

- [ ] `lib/activity-history-helper.ts:84` - `history-${Date.now()}`
- [ ] `lib/utils/shipping-config-migration.ts:145` - `acc_${Date.now()}`

---

## NHÓM 6: scripts/ & prisma/seeds/ (Có thể bỏ qua hoặc để sau)

- [ ] `scripts/seed-employee-settings.ts` - seed data
- [ ] `prisma/seeds/seed-employee-settings.ts` - seed data

---

## Cách thêm Entity mới vào ID_CONFIG

Nếu entity chưa có trong `lib/id-config-constants.ts`:

```typescript
// 1. Thêm vào EntityType
export type EntityType = 
  // ... existing types
  | 'new-entity';

// 2. Thêm config vào ID_CONFIG
export const ID_CONFIG: Record<EntityType, EntityConfig> = {
  // ... existing configs
  'new-entity': { 
    prefix: 'NE',           // Vietnamese prefix for business ID
    systemIdPrefix: 'NEWENT', // English prefix for system ID
    digitCount: 6, 
    displayName: 'Entity mới', 
    category: 'settings' 
  },
};
```

---

## Progress Tracking

| Nhóm | Tổng files | Đã xong | % |
|------|-----------|---------|---|
| 1. app/actions | 12 | 1 | 8% |
| 2. app/api | 20 | 0 | 0% |
| 3. features/ | 15 | 0 | 0% |
| 4. components/ | 3 | 0 | 0% |
| 5. lib/ | 2 | 0 | 0% |
| 6. scripts/seeds | 2 | - | - |
| **TỔNG** | **54** | **1** | **2%** |

---

## Notes

- **Ưu tiên**: Nhóm 1 > Nhóm 2 > Nhóm 3 > Nhóm 4 > Nhóm 5
- **Bỏ qua**: docs/, .bak files, scripts/seeds (chỉ dùng cho dev)
- **Test sau khi migrate**: Tạo mới entity để verify ID được generate đúng
