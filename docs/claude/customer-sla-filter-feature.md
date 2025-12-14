# Customer SLA & Debt Filter Feature

**Ngày tạo:** 2025-11-29  
**Ngày cập nhật:** 2025-11-29 (Added Debt Filter)
**Phiên bản:** 2.0  
**Tác giả:** AI Assistant (Claude)

---

## Tổng quan

Tính năng cho phép người dùng click vào các card thông báo SLA và Debt để lọc và hiển thị danh sách khách hàng tương ứng cần xử lý.

## Các card SLA

1. **Cần liên hệ (Follow-up)** - `followUp`
   - Icon: Clock
   - Màu: Blue
   - Hiển thị khách hàng cần liên hệ theo lịch

2. **Kích hoạt lại (Re-engagement)** - `reengage`
   - Icon: UserX
   - Màu: Orange
   - Hiển thị khách hàng cần được kích hoạt lại

3. **Công nợ cảnh báo (Debt Alert)** - `debt`
   - Icon: CreditCard
   - Màu: Rose
   - Hiển thị khách hàng có công nợ cần theo dõi

4. **Rủi ro churn (Health Alert)** - `health`
   - Icon: HeartPulse
   - Màu: Purple
   - Hiển thị khách hàng có nguy cơ rời bỏ

## Các card Debt (NEW)

1. **Tổng công nợ quá hạn** - `totalOverdue`
   - Icon: DollarSign
   - Màu: Destructive (Red)
   - Hiển thị tổng số tiền công nợ quá hạn và số khách hàng

2. **Quá hạn thanh toán** - `overdue`
   - Icon: AlertTriangle
   - Màu: Destructive (Red)
   - Hiển thị số khách hàng có công nợ quá hạn

3. **Sắp đến hạn** - `dueSoon`
   - Icon: Clock
   - Màu: Orange
   - Hiển thị số khách hàng có công nợ sắp đến hạn trong 1-3 ngày

4. **Tổng KH có công nợ** - `hasDebt`
   - Icon: TrendingUp
   - Màu: Muted
   - Hiển thị tổng số khách hàng đang có công nợ

## Cách hoạt động

### 1. Click vào card
- Khi click vào card SLA hoặc Debt, hệ thống sẽ:
  - Thêm `slaFilter` hoặc `debtFilter` vào state với giá trị tương ứng
  - Reset pagination về trang 1
  - Highlight card đang được chọn với border màu tương ứng và shadow
  - Hiển thị badge "Đang lọc" trên card

### 2. Filter được áp dụng

**SLA Filter:**
- Filter sử dụng SLA index từ `useCustomerSlaEngineStore`
- Lấy danh sách systemId từ mảng alerts tương ứng:
  - `followUp` → `slaIndex.followUpAlerts`
  - `reengage` → `slaIndex.reEngagementAlerts`
  - `debt` → `slaIndex.debtAlerts`
  - `health` → `slaIndex.healthAlerts`

**Debt Filter:**
- Filter dựa trên `debtReminders` và `currentDebt` của customer:
  - `totalOverdue` / `overdue` → Khách hàng có reminder quá hạn (dueDate < now)
  - `dueSoon` → Khách hàng có reminder đến hạn trong 1-3 ngày
  - `hasDebt` → Khách hàng có `currentDebt > 0`

### 3. Hiển thị trạng thái filter
- **Desktop:** 
  - Badge SLA với variant "secondary" và icon X để clear
  - Badge Debt với variant "destructive" và icon X để clear
- **Mobile:** 
  - Badge hiển thị trong section riêng với button X để clear
  - SLA badge: màu secondary với border primary
  - Debt badge: màu secondary với border destructive
- Badge text:
  - **SLA:**
    - `followUp` → "Lọc: Cần liên hệ"
    - `reengage` → "Lọc: Kích hoạt lại"
    - `debt` → "Lọc: Công nợ cảnh báo"
    - `health` → "Lọc: Rủi ro churn"
  - **Debt:**
    - `totalOverdue` → "Lọc: Tổng công nợ quá hạn"
    - `overdue` → "Lọc: Quá hạn thanh toán"
    - `dueSoon` → "Lọc: Sắp đến hạn"
    - `hasDebt` → "Lọc: Có công nợ"

### 4. Clear filter
Có 3 cách để clear filter:
1. Click lại vào card đang được chọn
2. Click vào icon X trên badge filter (desktop)
3. Click vào button X bên cạnh badge (mobile)

## Thay đổi kỹ thuật

### 1. Types & Interfaces

**File:** `customer-service.ts`
```typescript
export interface CustomerQueryParams {
  // ... existing fields
  slaFilter: 'all' | 'followUp' | 'reengage' | 'debt' | 'health';
  debtFilter: 'all' | 'totalOverdue' | 'overdue' | 'dueSoon' | 'hasDebt';
}
```

### 2. Filter Logic

**File:** `customer-service.ts`
```typescript
function applyFilters(customers: Customer[], params: CustomerQueryParams) {
  // ... existing filters
  
  // Apply SLA filter
  if (slaFilter !== 'all') {
    const slaIndex = useCustomerSlaEngineStore.getState().index;
    // ... filter logic
  }

  // Apply Debt filter
  if (debtFilter !== 'all') {
    if (debtFilter === 'totalOverdue' || debtFilter === 'overdue') {
      dataset = dataset.filter(customer => {
        // Check for overdue reminders
      });
    } else if (debtFilter === 'dueSoon') {
      dataset = dataset.filter(customer => {
        // Check for due soon reminders (1-3 days)
      });
    } else if (debtFilter === 'hasDebt') {
      dataset = dataset.filter(customer => (customer.currentDebt || 0) > 0);
    }
  }
}
```

### 3. Widget Updates

**File:** `debt-overview-widget.tsx`

**Props Interface:**
```typescript
interface DebtOverviewWidgetProps {
  activeFilter?: 'all' | 'totalOverdue' | 'overdue' | 'dueSoon' | 'hasDebt';
  onFilterChange?: (filter: ...) => void;
}
```

**Card với click handler:**
```tsx
<Card 
  className={cn(
    "cursor-pointer transition-all",
    activeFilter === 'overdue'
      ? "border-destructive shadow-md ring-2 ring-destructive/20"
      : "border-dashed hover:shadow-md hover:border-solid"
  )}
  onClick={() => handleCardClick('overdue')}
>
  {/* Smaller card content with text-xs and text-xl */}
  {activeFilter === 'overdue' && <Badge>Đang lọc</Badge>}
</Card>
```

### 4. UI Updates

**File:** `page.tsx`

**SLA Card (smaller):**
```tsx
<Card onClick={() => toggleFilter()}>
  <CardContent className="flex items-center justify-between p-3">
    <div className="flex-1 min-w-0">
      <p className="text-xs uppercase tracking-wide text-muted-foreground truncate">
        {label}
      </p>
      <p className="text-xl font-semibold mt-0.5">{value}</p>
      {isActive && <Badge className="mt-1 text-xs">Đang lọc</Badge>}
    </div>
    <Icon className="h-5 w-5 flex-shrink-0 ml-2" />
  </CardContent>
</Card>
```

**Debt Widget Integration:**
```tsx
<DebtOverviewWidget 
  activeFilter={tableState.debtFilter}
  onFilterChange={(filter) => {
    updateTableState(prev => ({
      ...prev,
      debtFilter: filter,
      pagination: { ...prev.pagination, pageIndex: 0 }
    }));
  }}
/>
```

**Filter badges:**
```tsx
{/* SLA Badge */}
{tableState.slaFilter !== 'all' && (
  <Badge variant="secondary">
    Lọc: {/* label */}
    <X onClick={() => clearFilter()} />
  </Badge>
)}

{/* Debt Badge */}
{tableState.debtFilter !== 'all' && (
  <Badge variant="destructive">
    Lọc: {/* label */}
    <X onClick={() => clearFilter()} />
  </Badge>
)}
```

### 4. Query Updates

**File:** `use-customers-query.ts`
```typescript
// Subscribe to SLA index changes
const slaLastEvaluated = useCustomerSlaEngineStore(state => state.lastEvaluatedAt);

return useQuery({
  queryKey: ['customers', params, ..., slaLastEvaluated],
  // ...
});
```

## Design Changes (v2.0)

### Card Size Reduction
- **Before:** `p-4`, `text-2xl`, `h-6 w-6` icon
- **After:** `p-3`, `text-xl`, `h-5 w-5` icon
- **Header:** `text-sm` → `text-xs`
- **Description:** Remains `text-xs`

### Layout
- Cards arranged in 2x4 grid on large screens
- Debt cards first (4 cards)
- SLA cards second (4 cards)
- Gap reduced from `gap-4` to `gap-3`

### Color Coding
- **SLA Cards:** Primary/Blue/Orange/Purple based on type
- **Debt Cards:** Destructive/Orange/Primary based on urgency
  - Overdue: Red border when active
  - Due Soon: Orange border when active
  - Has Debt: Primary border when active

## UX Flow

```
1. User vào trang khách hàng
   ↓
2. Thấy 8 card: 4 Debt + 4 SLA với số lượng alerts
   ↓
3. Click vào card (ví dụ: "Quá hạn thanh toán")
   ↓
4. Card được highlight với border đỏ, badge "Đang lọc" xuất hiện
   ↓
5. Danh sách bên dưới chỉ hiển thị khách hàng quá hạn thanh toán
   ↓
6. Thấy badge filter đỏ ở thanh filter
   ↓
7. Có thể:
   - Click X để clear filter
   - Click lại card để toggle off
   - Click vào card khác để switch filter
   - Kết hợp với các filter khác (status, type, search)
```

## Testing

### Manual Test Cases

**SLA Filter:**
1. ✅ Click vào từng card SLA và verify danh sách hiển thị đúng
2. ✅ Click lại card đã active để clear filter
3. ✅ Click X trên badge để clear filter
4. ✅ Kết hợp SLA filter với status filter
5. ✅ Kết hợp SLA filter với type filter
6. ✅ Kết hợp SLA filter với search
7. ✅ Kết hợp SLA filter với date range

**Debt Filter:**
8. ✅ Click "Tổng công nợ quá hạn" → hiển thị KH có công nợ quá hạn
9. ✅ Click "Quá hạn thanh toán" → hiển thị KH có reminder quá hạn
10. ✅ Click "Sắp đến hạn" → hiển thị KH có reminder đến hạn trong 1-3 ngày
11. ✅ Click "Tổng KH có công nợ" → hiển thị tất cả KH có currentDebt > 0
12. ✅ Verify badge destructive cho debt filter
13. ✅ Clear debt filter bằng X hoặc re-click

**Combined:**
14. ✅ Kết hợp cả SLA và Debt filter (chỉ 1 active tại 1 thời điểm)
15. ✅ Switch giữa SLA và Debt filter
16. ✅ Verify pagination reset về trang 1 khi filter
17. ✅ Verify responsive trên mobile
18. ✅ Verify card size nhỏ hơn (text-xl thay vì text-2xl)

### Edge Cases

- ❓ SLA index chưa được evaluate → SLA filter không available
- ❓ Không có debt reminders → Debt filter return empty
- ❓ Card có 0 items → vẫn có thể click, list sẽ empty
- ❓ Customer có cả SLA alert và debt → xuất hiện trong cả 2 filter

## Performance Considerations

- ✅ Filter sử dụng Set lookup (O(1)) thay vì array includes (O(n))
- ✅ SLA index được cache trong localStorage
- ✅ Query key subscribe đến `slaLastEvaluated` để tránh stale data
- ✅ Local filtering thay vì API call để performance tốt hơn

## Future Enhancements

1. **Combine filters:** Cho phép chọn nhiều SLA filter cùng lúc
2. **Sort by urgency:** Sort khách hàng theo mức độ ưu tiên trong mỗi category
3. **Quick actions:** Thêm quick actions ngay trên card (ví dụ: "Gọi điện ngay")
4. **Filter presets:** Save filter combinations làm preset
5. **Export filtered list:** Export danh sách đã filter ra Excel

## Related Files

- `features/customers/page.tsx` - Main page component
- `features/customers/customer-service.ts` - Filter logic
- `features/customers/sla/store.ts` - SLA engine store
- `features/customers/sla/types.ts` - SLA type definitions
- `features/customers/hooks/use-customers-query.ts` - Query hook

---

## Changelog

### v1.0 - 2025-11-29
- ✨ Initial implementation
- ✨ Click-to-filter on SLA cards
- ✨ Visual feedback (highlight, badges)
- ✨ Clear filter options (re-click, X button)
- ✨ Mobile responsive design
