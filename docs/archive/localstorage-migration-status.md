# localStorage to Database Migration Status

## Tổng quan

Dự án đang trong quá trình migrate từ localStorage sang PostgreSQL database. Zustand stores sử dụng `persist` middleware với localStorage để cache, nhưng source of truth là database qua API routes.

## Pattern đã implement

### 1. store-factory.ts (createCrudStore)
- Đã thêm `apiEndpoint` option để tự động sync với database
- Các CRUD operations (add, update, remove, restore) sẽ call API để sync
- Có `loadFromAPI()` method để load data từ database lần đầu

### 2. settings-config-store.ts (createSettingsConfigStore)
- Đã thêm `apiEndpoint` option
- Các setters sẽ sync to API trong background
- Có `loadFromAPI()` method

## Trạng thái các stores

### ✅ ĐÃ HOÀN THÀNH (Có API sync)

| Store | API Endpoint | Notes |
|-------|-------------|-------|
| employees | /api/employees | Custom persistence adapter |
| customers | /api/customers | Custom persistence adapter |
| products | /api/products | Custom persistence adapter |
| orders | /api/orders | Custom persistence adapter |
| departments | /api/departments | Via apiEndpoint option |
| job-titles | /api/job-titles | Via apiEndpoint option |
| branches | /api/branches | Via apiEndpoint option |
| inventory-receipts | /api/inventory-receipts | Via apiEndpoint option |
| inventory-checks | /api/inventory-checks | Via apiEndpoint option |
| tasks | /api/tasks | Via apiEndpoint option |
| customer-groups | /api/settings/customers | Via apiEndpoint option |
| customer-types | /api/settings/customers | Via apiEndpoint option |
| customer-sources | /api/settings/customers | Via apiEndpoint option |
| payment-terms | /api/settings/customers | Via apiEndpoint option |
| credit-ratings | /api/settings/customers | Via apiEndpoint option |
| lifecycle-stages | /api/settings/customers | Via apiEndpoint option |
| sla-settings | /api/settings/customers | Via apiEndpoint option |
| appearance | /api/user-preferences/appearance | Custom sync |
| trendtech | /api/settings/trendtech | Custom sync |
| pkgx | /api/settings/pkgx | Custom sync |
| wiki | /api/wiki | Custom sync |
| global-settings | Via bulkSaveSettingsToAPI | Via settings-sync-helper |
| stock-transfers | /api/stock-transfers | Has loadFromAPI |
| stock-history | /api/stock-history | Has loadFromAPI |
| receipts | /api/receipts | Has loadFromAPI |
| payments | /api/payments | Has loadFromAPI |
| payroll-batch | /api/payroll | Has loadFromAPI |
| payroll-template | /api/payroll/templates | Has loadFromAPI |
| employee-comp | /api/employees | Has loadFromAPI |
| employee-documents | /api/employee-documents | Has loadFromAPI |
| cashbook | /api/cash-transactions | Has loadFromAPI |
| audit-log | /api/audit-logs | Has loadFromAPI |
| attendance | /api/attendance | Has loadFromAPI |
| shipping-settings | /api/shipping-config | Has loadFromAPI |
| employee-settings | /api/settings/employees | Has loadFromAPI |
| payment-methods | /api/settings/payment-methods | Has loadFromAPI |

### ⚠️ CẦN MIGRATION (Còn dùng localStorage, chưa có API sync đầy đủ)

| Store | Cần tạo API | Cần Prisma Model | Priority |
|-------|------------|------------------|----------|
| task-templates | ✅ | ✅ | Medium |
| recurring-tasks | ✅ | ✅ | Medium |
| custom-fields | ✅ | ⚠️ (file trống) | Medium |
| suppliers | ⚠️ Kiểm tra | Có | High |
| stock-locations | ⚠️ Kiểm tra | Có | High |
| units | ✅ | ✅ | Low |
| target-groups | ✅ | ✅ | Low |
| shipping-partners | ⚠️ Kiểm tra | Có | Medium |
| sales-channels | ✅ | ✅ | Low |
| receipt-types | ✅ | ✅ | Low |
| provinces/districts/wards | Có thể dùng seed | Có | Low |
| taxes | ⚠️ Kiểm tra | Có | Medium |
| pricing | ✅ | ✅ | Medium |
| penalties | ✅ | ✅ | Low |
| payment-types | ⚠️ Kiểm tra | Có | Medium |
| sales-returns | ⚠️ Kiểm tra | Có | High |
| purchase-returns | ⚠️ Kiểm tra | Có | High |
| purchase-orders | ⚠️ Kiểm tra | Có | High |
| leaves | ⚠️ Kiểm tra | Có | Medium |
| warranty | ⚠️ Kiểm tra | Có | Medium |

### 📝 Notes

1. **localStorage vẫn được dùng làm cache**: Giúp app load nhanh lần đầu, sau đó `loadFromAPI()` sẽ sync data mới nhất từ DB

2. **Cách thêm API sync cho store mới**:
   ```typescript
   const store = createCrudStore<Entity>(data, 'entity-type', {
     persistKey: 'hrm-entity',
     apiEndpoint: '/api/entity',
   });
   ```

3. **Cách gọi loadFromAPI**:
   ```typescript
   // Trong component hoặc useEffect
   useEffect(() => {
     useStore.getState().loadFromAPI();
   }, []);
   ```

4. **API Routes cần có**:
   - GET / - List all
   - POST / - Create
   - GET /[id] - Get by ID
   - PATCH /[id] - Update
   - DELETE /[id] - Delete (soft or hard)

## Files đã tạo/sửa trong session này

### Created:
- `prisma/schema/settings/customer-setting.prisma` - Prisma model cho customer settings
- `app/api/settings/customers/route.ts` - API route cho customer settings
- `app/api/settings/customers/[systemId]/route.ts` - API route cho single customer setting
- `app/api/tasks/route.ts` - Full CRUD API cho tasks
- `app/api/tasks/[taskId]/route.ts` - Single task API

### Modified:
- `lib/store-factory.ts` - Added apiEndpoint option
- `features/settings/settings-config-store.ts` - Added apiEndpoint option, loadFromAPI
- `features/settings/departments/store.ts` - Added apiEndpoint
- `features/settings/job-titles/store.ts` - Added apiEndpoint
- `features/settings/branches/store.ts` - Added apiEndpoint
- `features/inventory-receipts/store.ts` - Added apiEndpoint
- `features/inventory-checks/store.ts` - Added apiEndpoint
- `features/tasks/store.ts` - Added apiEndpoint
- `features/settings/customers/*.ts` - Added apiEndpoint cho tất cả customer settings stores

## Next Steps

1. Tạo Prisma models cho: TaskTemplate, RecurringTask, Unit, TargetGroup, SalesChannel, ReceiptType, Penalty, PricingPolicy

2. Tạo API routes cho các entities còn thiếu

3. Add `apiEndpoint` option cho các stores còn lại

4. Test toàn bộ CRUD operations để đảm bảo data sync đúng
