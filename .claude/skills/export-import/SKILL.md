# Skill: Export/Import Dialog

## Mục đích

Hướng dẫn cách implement export/import dialog đúng chuẩn HRM2.

---

## Cấu trúc Import/Export

```
features/[feature]/components/
  └── [feature]-import-export-dialogs.tsx  # Wrapper dialog

components/shared/
  ├── generic-import-dialog-v2.tsx         # Import dialog chung
  └── generic-export-dialog-v2.tsx         # Export dialog chung

lib/import-export/
  ├── configs/[feature].config.ts           # Config cho từng entity
  ├── types.ts                            # Types chung
  └── hooks/use-import-export-logs.ts     # Log import/export
```

---

## Export Dialog - 3 Scope Options

### Data Sources

| Prop | Ý nghĩa | Nguồn |
|------|----------|-------|
| `allData` | Tất cả records (không filter) | `useAllXxx()` |
| `filteredData` | Records theo filter UI | `useXxx(params)` |
| `currentPageData` | Records trên trang hiện tại | `useXxx(params).data` |
| `selectedData` | Records đã tick chọn | `rowSelection` |

### Export Scope Radio Options

```tsx
type ExportScope = 'all' | 'filtered' | 'current-page' | 'selected';

// UI
<RadioGroup value={exportScope} onValueChange={setExportScope}>
  <RadioGroupItem value="all" label={`Tất cả (${allData.length})`} />
  {filteredData.length < allData.length && (
    <RadioGroupItem value="filtered" label={`Đã lọc (${filteredData.length})`} />
  )}
  <RadioGroupItem value="current-page" label={`Trang hiện tại (${currentPageData.length})`} />
  {selectedData.length > 0 && (
    <RadioGroupItem value="selected" label={`Đã chọn (${selectedData.length})`} />
  )}
</RadioGroup>
```

### Data Selection Logic

```tsx
const getDataByScope = (scope: ExportScope): T[] => {
  switch (scope) {
    case 'all':          return allData;
    case 'filtered':     return filteredData;
    case 'current-page': return currentPageData;
    case 'selected':     return selectedData;
  }
};
```

---

## Sự khác nhau: List Page vs Export Page

### List Page (Pagination)

```tsx
// Page dùng API có pagination - KHÔNG load all
const { data } = useXxx({
  page: pagination.pageIndex + 1,
  limit: pagination.pageSize,
  ...filters,
});

// filteredData = data.data (chỉ page hiện tại)
```

### Export Page (All Data)

```tsx
// Export dùng useAllXxx - load ALL với filter từ UI
const { data: allData } = useAllXxx({
  enabled: exportDialogOpen,
  ...currentFilters, // filters từ UI
});
```

---

## ⚠️ QUAN TRỌNG: Performance Warning

### Vấn đề: "Tất cả" có thể rất chậm

| Scenario | Records | Thời gian ước tính |
|----------|---------|---------------------|
| Orders (có filter) | 500 | ~2-3s |
| Orders (tất cả, không filter) | 50,000 | ~30-60s ❌ |
| Receipts (tất cả) | 100,000 | ~1-2 phút ❌ |

### Giải pháp: Thêm Warning cho "Tất cả"

```tsx
// Trong export dialog
const showWarning = exportScope === 'all' && allData.length > 5000;

return (
  <>
    {/* Export scope radio */}
    <RadioGroup value={exportScope} ...>
      <RadioGroupItem value="all" />
    </RadioGroup>

    {/* Warning nếu quá nhiều records */}
    {showWarning && (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Đang xuất {allData.length.toLocaleString()} records.
          Có thể mất 30-60 giây. Khuyến nghị dùng "Kết quả đã lọc".
        </AlertDescription>
      </Alert>
    )}
  </>
);
```

---

## Column Selection

### Grouped Fields

```tsx
// Config trong [feature].config.ts
export const orderConfig: ImportExportConfig<Order> = {
  entityType: 'orders',
  entityDisplayName: 'đơn hàng',
  fields: [
    // Group: Thông tin cơ bản
    { key: 'id', label: 'Mã đơn hàng', group: 'Thông tin cơ bản' },
    { key: 'orderDate', label: 'Ngày đặt', group: 'Thông tin cơ bản' },
    
    // Group: Khách hàng
    { key: 'customerName', label: 'Tên khách hàng', group: 'Khách hàng' },
    { key: 'customerPhone', label: 'SĐT khách hàng', group: 'Khách hàng' },
    
    // Group: Thông tin thanh toán
    { key: 'totalAmount', label: 'Tổng tiền', group: 'Thanh toán' },
    { key: 'paymentStatus', label: 'Trạng thái thanh toán', group: 'Thanh toán' },
  ],
};
```

### Column Selection UI

```tsx
<div className="space-y-4">
  {/* Toggle all */}
  <Button onClick={toggleAll}>
    {selectedColumns.length === allColumns.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
  </Button>

  {/* Grouped checkboxes */}
  {Object.entries(groupedFields).map(([group, fields]) => (
    <div key={group}>
      <Checkbox
        checked={isGroupSelected(fields)}
        onCheckedChange={() => toggleGroup(fields)}
      />
      <Label>{group}</Label>
      
      <div className="ml-6">
        {fields.map(field => (
          <Checkbox
            key={field.key}
            checked={selectedColumns.includes(field.key)}
            onCheckedChange={() => toggleColumn(field.key)}
          />
        ))}
      </div>
    </div>
  ))}
</div>
```

---

## Import Config

### Import Modes

| Mode | Mô tả | Use case |
|------|--------|----------|
| `insert-only` | Chỉ thêm mới | Import dữ liệu mới |
| `update-only` | Chỉ cập nhật | Cập nhật giá từ NCC |
| `upsert` | Thêm mới hoặc cập nhật | Sync data |

### Validation Rules

```tsx
// Config validation
export const productImportConfig = {
  // Required fields - thiếu sẽ fail
  requiredFields: ['sku', 'name', 'categoryId'],
  
  // Unique fields - check trùng lặp
  uniqueFields: ['sku'],
  
  // Validation rules
  validators: {
    price: (v) => v >= 0 || 'Giá phải >= 0',
    quantity: (v) => Number.isInteger(v) || 'Số lượng phải là số nguyên',
  },
  
  // Transform before save
  transforms: {
    name: (v) => v.trim().toUpperCase(),
  },
};
```

---

## Import/Export Logging

### Log Structure

```tsx
interface ImportExportLog {
  id: string;
  type: 'import' | 'export';
  entityType: string;
  entityDisplayName: string;
  fileName: string;
  fileSize: number;
  totalRows: number;
  successRows: number;
  failedRows?: number;
  scope: 'all' | 'filtered' | 'current-page' | 'selected';
  columnsExported?: string[];
  filters?: Record<string, unknown>;
  performedBy: string;
  performedById: string;
  performedAt: string;
  status: 'success' | 'failed';
  errorMessage?: string;
}
```

### Log Usage

```tsx
// Trong export handler
await addExport.mutateAsync({
  entityType: config.entityType,
  entityDisplayName: config.entityDisplayName,
  fileName,
  fileSize: blob.size,
  totalRows: dataToExport.length,
  scope: exportScope,
  columnsExported: selectedColumns,
  filters: appliedFilters,
  performedBy: currentUser.name,
  performedById: currentUser.systemId,
  performedAt: new Date().toISOString(),
  status: 'success',
});
```

---

## Checklist khi thêm Export/Import cho Feature mới

### 1. Tạo Config

- [ ] `lib/import-export/configs/[feature].config.ts`
- [ ] Định nghĩa `fields` với `group`
- [ ] Định nghĩa `transforms` cho export
- [ ] Định nghĩa `validators` cho import

### 2. Tạo Wrapper Dialog

- [ ] `features/[feature]/components/[feature]-import-export-dialogs.tsx`
- [ ] Export dialog wrapper
- [ ] Import dialog wrapper (nếu cần)

### 3. Update Page

- [ ] Thêm state `exportDialogOpen`
- [ ] Dùng `useAllXxx({ enabled: exportDialogOpen, ...filters })`
- [ ] Pass đúng props vào dialog

### 4. Update Import Handler

- [ ] Hook xử lý import
- [ ] Validation logic
- [ ] Error handling

---

## Ví dụ: Full Implementation

### Step 1: Config

```tsx
// lib/import-export/configs/receipt.config.ts
import type { ImportExportConfig } from '../types';
import type { Receipt } from '@/lib/types/prisma-extended';

export const receiptImportExportConfig: ImportExportConfig<Receipt> = {
  entityType: 'receipts',
  entityDisplayName: 'phiếu thu',
  fields: [
    { key: 'id', label: 'Mã phiếu thu', group: 'Thông tin cơ bản' },
    { key: 'receiptDate', label: 'Ngày thu', group: 'Thông tin cơ bản' },
    { key: 'amount', label: 'Số tiền', group: 'Thông tin cơ bản' },
    { key: 'category', label: 'Loại phiếu', group: 'Phân loại' },
    { key: 'branchName', label: 'Chi nhánh', group: 'Đối tượng' },
    { key: 'payerName', label: 'Người nộp', group: 'Đối tượng' },
  ],
};
```

### Step 2: Wrapper Dialog

```tsx
// features/receipts/components/receipt-import-export-dialogs.tsx
interface ReceiptExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allData: Receipt[];
  filteredData: Receipt[];
  currentPageData: Receipt[];
  selectedData: Receipt[];
  currentUser: { systemId: string; name: string };
}

export function ReceiptExportDialog(props: ReceiptExportDialogProps) {
  return (
    <GenericExportDialogV2
      {...props}
      config={receiptImportExportConfig}
    />
  );
}
```

### Step 3: Page Integration

```tsx
// features/receipts/page.tsx
export function ReceiptsPage() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  // Export data - load ALL với filter từ UI
  const { data: allReceipts } = useAllReceipts({
    enabled: exportDialogOpen,
    startDate: dateRange?.[0],
    endDate: dateRange?.[1],
    branchId: selectedBranch,
  });
  
  return (
    <>
      <Button onClick={() => setExportDialogOpen(true)}>
        Xuất Excel
      </Button>
      
      {exportDialogOpen && (
        <ReceiptExportDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          allData={allReceipts}
          filteredData={allReceipts} // Vì đã filter rồi
          currentPageData={paginatedReceipts}
          selectedData={selectedReceipts}
          currentUser={currentUser}
        />
      )}
    </>
  );
}
```

---

## Lưu ý quan trọng

1. **Dynamic Import**: Dialog components phải dùng `dynamic()` để lazy load
2. **Performance**: "Tất cả dữ liệu" có thể rất chậm - thêm warning
3. **Filters**: Filters áp dụng cho `filteredData`, KHÔNG ảnh hưởng `allData`
4. **Logging**: Luôn log import/export để track usage
5. **Memory**: Với >10,000 records, cân nhắc streaming/chunking
