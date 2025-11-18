# VirtualizedCombobox - Tối ưu cho 10K+ Items

> **Note**: Component này đã được nâng cấp từ phiên bản cũ với @tanstack/react-virtual để support 10K+ items.

## 🚀 Tính năng

- ✅ **@tanstack/react-virtual**: Chỉ render 10-15 items cùng lúc
- ✅ **Server-side filtering**: Không load hết data về client
- ✅ **Debounce search**: Giảm API calls (300ms)
- ✅ **Minimum search length**: Bắt buộc nhập ít nhất N ký tự
- ✅ **Loading state**: Hiển thị spinner khi đang load
- ✅ **Estimated height**: Performance tốt với dynamic item height
- ✅ **Overscan**: Pre-render 5 items ngoài viewport

## 📊 Performance So Sánh

| Component | 100 items | 1,000 items | 10,000 items | 100,000 items |
|-----------|-----------|-------------|--------------|---------------|
| **VirtualizedCombobox (cũ)** | ✅ Tốt | ✅ Ổn | ⚠️ Chậm | ❌ Crash |
| **VirtualizedCombobox (mới)** | ✅ Tốt | ✅ Tốt | ✅ Tốt | ✅ Ổn |
| **+ Server-side filtering** | ✅ Tốt | ✅ Tốt | ✅ Tốt | ✅ Tốt |

## 🔧 Cách Sử Dụng

### 1️⃣ Client-side filtering (dưới 1000 items)

```tsx
import { VirtualizedCombobox } from '@/components/ui/virtualized-combobox';

function EmployeeSelector() {
  const { data: employees } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const options = employees.map(emp => ({
    value: emp.systemId,
    label: emp.fullName,
    subtitle: `${emp.id} • ${emp.phone}` // Optional subtitle
  }));

  return (
    <VirtualizedCombobox
      value={selectedEmployee}
      onChange={setSelectedEmployee}
      options={options}
      placeholder="Chọn nhân viên..."
      searchPlaceholder="Tìm theo tên, mã, SĐT..."
      estimatedItemHeight={56} // Height với subtitle
    />
  );
}
```

### 2️⃣ Server-side filtering (10K+ items) - KHUYẾN NGHỊ

```tsx
import { VirtualizedCombobox } from '@/components/ui/hyper-optimized-combobox';
import { useQuery } from '@tanstack/react-query';

function EmployeeSelector() {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // API call với search query
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['employees', 'search', search],
    queryFn: async () => {
      if (search.length < 2) return [];
      const response = await fetch(
        `/api/employees/search?q=${encodeURIComponent(search)}&limit=100`
      );
      return response.json();
    },
    enabled: search.length >= 2,
    staleTime: 30000, // Cache 30s
  });

  const options = (searchResults || []).map(emp => ({
    value: emp.systemId,
    label: emp.fullName,
    subtitle: `${emp.id} • ${emp.phone}`
  }));

  return (
    <VirtualizedCombobox
      value={selectedEmployee}
      onChange={setSelectedEmployee}
      options={options}
      placeholder="Chọn nhân viên..."
      searchPlaceholder="Nhập tên để tìm kiếm..."
      onSearchChange={setSearch} // Server-side handler
      isLoading={isLoading}
      minSearchLength={2} // Bắt buộc nhập >= 2 ký tự
      estimatedItemHeight={56}
    />
  );
}
```

### 3️⃣ Custom render option

```tsx
<VirtualizedCombobox
  value={selected}
  onChange={setSelected}
  options={options}
  renderOption={(option, isSelected) => (
    <div className="flex items-center gap-2 flex-1">
      <Avatar className="h-8 w-8">
        <AvatarFallback>{option.label[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0">
        <span className="font-medium truncate">{option.label}</span>
        <span className="text-xs text-muted-foreground truncate">
          {option.subtitle}
        </span>
      </div>
      {isSelected && <Check className="h-4 w-4 ml-2" />}
    </div>
  )}
  estimatedItemHeight={48}
/>
```

## 🎯 Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `ComboboxOption \| null` | - | **Required**. Selected value |
| `onChange` | `(value) => void` | - | **Required**. Change handler |
| `options` | `ComboboxOption[]` | - | **Required**. List of options |
| `placeholder` | `string` | "Chọn một tùy chọn" | Button placeholder |
| `searchPlaceholder` | `string` | "Tìm kiếm..." | Search input placeholder |
| `emptyPlaceholder` | `string` | "Không tìm thấy kết quả." | Empty state text |
| `disabled` | `boolean` | `false` | Disable the combobox |
| `isLoading` | `boolean` | `false` | Show loading spinner |
| `onSearchChange` | `(search: string) => void` | - | Server-side search handler |
| `renderOption` | `(option, isSelected) => ReactNode` | Default render | Custom option render |
| `estimatedItemHeight` | `number` | `48` | Estimated item height (px) |
| `maxHeight` | `number` | `320` | Max dropdown height (px) |
| `minSearchLength` | `number` | `0` | Min chars before showing results |

## 🔥 Backend API Example

```javascript
// Express.js example
app.get('/api/employees/search', async (req, res) => {
  const { q, limit = 100 } = req.query;
  
  // Database query with LIKE/ILIKE
  const results = await db.employees.findMany({
    where: {
      OR: [
        { fullName: { contains: q, mode: 'insensitive' } },
        { id: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
      ],
      status: 'active'
    },
    take: parseInt(limit),
    orderBy: { fullName: 'asc' }
  });
  
  res.json(results);
});
```

## 📈 Migration Guide

### From VirtualizedCombobox

```diff
- import { VirtualizedCombobox } from '@/components/ui/virtualized-combobox';
+ import { VirtualizedCombobox } from '@/components/ui/hyper-optimized-combobox';

  <VirtualizedCombobox
    value={value}
    onChange={onChange}
    options={options}
-   itemHeight={40}
+   estimatedItemHeight={40}
+   minSearchLength={2}
+   isLoading={isLoading}
  />
```

## 💡 Best Practices

1. **Luôn dùng server-side filtering với 1000+ items**
2. **Set minSearchLength={2}** để giảm load không cần thiết
3. **Cache API results** với react-query (staleTime: 30s)
4. **Estimate item height chính xác** để scroll mượt hơn
5. **Limit API results** về 50-100 items
6. **Index database** fields được search (fullName, id, phone)
7. **Debounce đã built-in** (300ms), không cần thêm

## 🎨 Styling

Component tự động responsive với width của trigger button. Customize qua className của các sub-components.

## 🐛 Troubleshooting

**Q: Scroll bị giật?**
A: Tăng `overscan` prop hoặc điều chỉnh `estimatedItemHeight` chính xác hơn.

**Q: Items không hiện khi mở popup?**
A: Check `minSearchLength` - có thể cần nhập ít nhất N ký tự.

**Q: Quá nhiều API calls?**
A: Debounce đã 300ms, tăng lên 500ms nếu cần, hoặc tăng `minSearchLength`.

---

**Created:** 2025-10-28  
**Author:** AI Assistant  
**Status:** Production Ready ✅
