# UI Standardization Checklist

## 📊 Kết quả Audit

### Font Usage
- ✅ Font system được định nghĩa trong `globals.css` 
- ✅ `font-mono` chỉ nên dùng cho ID, mã code, slug
- ✅ Đã fix 10+ trường hợp dùng sai `font-mono` cho giá tiền, thời gian

### Component Variants (shadcn/ui)

| Component | Variants | Count | Status |
|-----------|----------|-------|--------|
| Button | default, destructive, outline, secondary, ghost, link | 554 | ✅ Chuẩn |
| Badge | default, secondary, destructive, outline, success, warning | 501 | ✅ Chuẩn |
| CardTitle | sm, default, lg | - | ✅ Mới thêm |

### Spacing System

| Pattern | Count | Quy tắc |
|---------|-------|---------|
| `p-4` | 340 | Standard card padding |
| `p-3` | 346 | Compact card/section |
| `p-2` | 197 | Tight spacing |
| `gap-2` | 1175 | Standard inline gap |
| `gap-4` | 396 | Section gap |
| `gap-1` | 378 | Tight gap |

### Border Radius System

| Pattern | Count | Usage |
|---------|-------|-------|
| `rounded-lg` | 512 | Cards, dialogs |
| `rounded-md` | 245 | Buttons, inputs |
| `rounded-full` | 189 | Avatars, badges |
| `rounded-sm` | 27 | Small elements |

### Shadow System  

| Pattern | Count | Usage |
|---------|-------|-------|
| `shadow-md` | 71 | Dropdowns, popovers |
| `shadow-sm` | 32 | Cards |
| `shadow-lg` | 28 | Dialogs, modals |

## ✅ Quy tắc chuẩn shadcn/ui

### 1. Spacing

```tsx
// Cards
<Card className="p-4">          // Standard
<Card className="p-3">          // Compact
<Card className="p-6">          // Large sections

// Gaps
<div className="flex gap-2">    // Inline items
<div className="flex gap-4">    // Sections
<div className="space-y-4">     // Vertical stack
```

### 2. Border Radius

```tsx
// Elements
<Card className="rounded-lg">        // Cards
<Button className="rounded-md">      // Buttons (default)
<Avatar className="rounded-full">    // Avatars
<Input className="rounded-md">       // Inputs
```

### 3. Shadows

```tsx
// Elevation levels
className="shadow-sm"     // Level 1: Cards
className="shadow-md"     // Level 2: Dropdowns
className="shadow-lg"     // Level 3: Modals
```

### 4. Typography

```tsx
// Headings - sử dụng CardTitle với size variants
<CardTitle size="lg">Page Title</CardTitle>
<CardTitle>Section Title</CardTitle>
<CardTitle size="sm">Card Title</CardTitle>

// Body text
<p className="text-sm">Standard text</p>
<p className="text-xs text-muted-foreground">Secondary text</p>

// Font families
<span className="font-mono">#{id}</span>     // IDs, codes only
<p className="font-medium">Emphasis</p>       // Bold text
```

### 5. Colors

```tsx
// Semantic colors
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="destructive">Error</Badge>

// Text colors
<p className="text-foreground">Primary text</p>
<p className="text-muted-foreground">Secondary text</p>
<p className="text-destructive">Error text</p>
```

## 🔧 Migration Scripts

Các script đã tạo:
- `scripts/migrate-card-titles.ps1` - CardTitle size standardization
- `docs/FONT-STANDARDIZATION.md` - Font usage rules

## 📝 Todo

- [x] Chuẩn hóa CardTitle với size variants (153 files)
- [x] Fix font-mono usage cho giá tiền/thời gian
- [ ] Review các Button size không chuẩn
- [ ] Review các shadow không chuẩn  
- [ ] Thêm more Badge variants nếu cần

## 🎯 Best Practices

1. **Luôn dùng shadcn components** thay vì custom styles
2. **Sử dụng cva variants** cho custom components
3. **Tránh inline styles** - dùng Tailwind classes
4. **Tuân thủ spacing scale** - 1, 2, 3, 4, 6, 8
5. **Consistent border-radius** - sm, md, lg, full
