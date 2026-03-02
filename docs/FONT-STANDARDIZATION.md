# Font Standardization Guide

## 📋 Quy tắc chuẩn hóa Font

### Font System

Dự án sử dụng 3 font families được định nghĩa trong `globals.css`:

```css
:root {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: Georgia, 'Times New Roman', Times, serif;
  --font-mono: ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace;
}
```

### Quy tắc sử dụng

| Loại dữ liệu | Font Class | Ví dụ |
|-------------|------------|-------|
| **ID, mã hệ thống** | `font-mono` ✅ | `#123`, `TKN-001`, `ORD-2024-001` |
| **Tracking code, OTP** | `font-mono` ✅ | `ABC123DEF`, `123456` |
| **Slug, URL paths** | `font-mono` ✅ | `/category/electronics`, `my-product-slug` |
| **Code snippet, JSON** | `font-mono` ✅ | `{ "key": "value" }` |
| **Technical prefixes** | `font-mono` ✅ | `PO-`, `INV-`, `SKU-` |
| **Thời gian** | ❌ Mặc định | `08:30`, `14:00:00` |
| **Ngày tháng** | ❌ Mặc định | `25/02/2024` |
| **Giá tiền, số tiền** | ❌ Mặc định | `100,000₫`, `$1,500.00` |
| **Số lượng** | ❌ Mặc định | `50 sản phẩm`, `25 items` |
| **Text thông thường** | ❌ Mặc định | Mọi text khác |

### ❌ Các pattern cần FIX

```tsx
// ❌ SAI - Giá tiền không nên dùng font-mono
<p className="font-mono">{formatCurrency(price)}</p>

// ✅ ĐÚNG
<p className="font-medium">{formatCurrency(price)}</p>
```

```tsx
// ❌ SAI - Thời gian không nên dùng font-mono
<TableCell className="font-mono">{row.checkIn}</TableCell>

// ✅ ĐÚNG
<TableCell>{row.checkIn}</TableCell>
```

```tsx
// ❌ SAI - Số lượng thông thường không cần font-mono
<span className="font-mono">{totalStock}</span>

// ✅ ĐÚNG
<span className="font-medium">{totalStock}</span>
```

### ✅ Các pattern HỢP LÝ

```tsx
// ✅ ID hệ thống
<span className="font-mono text-muted-foreground">#{id}</span>

// ✅ Tracking code
<span className="font-mono font-semibold">{trackingCode}</span>

// ✅ Slug
<p className="text-sm font-mono">{slug}</p>

// ✅ OTP
<span className="font-mono font-bold">123456</span>

// ✅ System prefix/badges
<Badge variant="outline" className="font-mono">{prefix}</Badge>
```

## 📊 Thống kê hiện tại

- Tổng số lần sử dụng `font-mono`: ~191 occurrences
- Cần fix: ~20-30 occurrences (thời gian, giá tiền, số lượng)
- Hợp lý: ~160+ occurrences (ID, mã, slug)

## 🔧 Migration Checklist

- [ ] Attendance import dialog - thời gian check-in/out
- [ ] Combo section - giá tiền formatCurrency
- [ ] Các file khác có formatCurrency với font-mono
- [ ] Các số lượng stock không phải ID

## Tham khảo

- [Tailwind Typography](https://tailwindcss.com/docs/font-family)
- [shadcn/ui Design System](https://ui.shadcn.com/docs)
