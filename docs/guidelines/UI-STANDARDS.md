# Tiêu chuẩn UI HRM2 - dựa trên shadcn/ui

> Tài liệu này định nghĩa các tiêu chuẩn UI thống nhất cho toàn bộ ứng dụng HRM2, dựa trên shadcn/ui default theme và nguyên tắc Mobile-First.

## 1. Màu sắc (Colors)

### 1.1 CSS Variables - Light Mode

```css
:root {
  --background: oklch(1 0 0);           /* Trắng - Nền chính */
  --foreground: oklch(0.145 0 0);       /* Đen - Chữ chính */
  
  --card: oklch(1 0 0);                 /* Trắng - Card background */
  --card-foreground: oklch(0.145 0 0);  /* Đen - Card text */
  
  --popover: oklch(1 0 0);              /* Trắng - Popover background */
  --popover-foreground: oklch(0.145 0 0); /* Đen - Popover text */
  
  --primary: oklch(0.205 0 0);          /* Đen - Primary buttons, links */
  --primary-foreground: oklch(0.985 0 0); /* Trắng - Text trên primary */
  
  --secondary: oklch(0.97 0 0);         /* Xám nhạt - Secondary background */
  --secondary-foreground: oklch(0.205 0 0); /* Đen - Secondary text */
  
  --muted: oklch(0.97 0 0);             /* Xám nhạt - Muted background */
  --muted-foreground: oklch(0.556 0 0); /* Xám - Muted text, placeholders */
  
  --accent: oklch(0.97 0 0);            /* Xám nhạt - Hover states */
  --accent-foreground: oklch(0.205 0 0); /* Đen - Accent text */
  
  --destructive: oklch(0.577 0.245 27.325); /* Đỏ - Destructive actions */
  --destructive-foreground: oklch(0.985 0 0); /* Trắng - Text trên destructive */
  
  --border: oklch(0.922 0 0);           /* Xám nhạt - Border */
  --input: oklch(0.922 0 0);            /* Xám nhạt - Input border */
  --ring: oklch(0.708 0 0);             /* Xám - Focus ring */
  
  --radius: 0.5rem;                     /* 8px - Border radius mặc định */
}
```

### 1.2 CSS Variables - Dark Mode

```css
.dark {
  --background: oklch(0.18 0.007 264.5);
  --foreground: oklch(0.98 0 0);
  
  --card: oklch(0.18 0.007 264.5);
  --card-foreground: oklch(0.98 0 0);
  
  --popover: oklch(0.18 0.007 264.5);
  --popover-foreground: oklch(0.98 0 0);
  
  --primary: oklch(0.98 0 0);
  --primary-foreground: oklch(0.22 0.007 264.5);
  
  --secondary: oklch(0.27 0.007 264.5);
  --secondary-foreground: oklch(0.98 0 0);
  
  --muted: oklch(0.27 0.007 264.5);
  --muted-foreground: oklch(0.68 0.007 264.5);
  
  --accent: oklch(0.27 0.007 264.5);
  --accent-foreground: oklch(0.98 0 0);
  
  --destructive: oklch(0.45 0.18 29.234);
  --destructive-foreground: oklch(0.98 0 0);
  
  --border: oklch(0.27 0.007 264.5);
  --input: oklch(0.27 0.007 264.5);
  --ring: oklch(0.98 0 0);
}
```

### 1.3 Semantic Colors Usage

| Mục đích | Class |
|----------|-------|
| Nền trang | `bg-background` |
| Chữ chính | `text-foreground` |
| Chữ phụ/placeholder | `text-muted-foreground` |
| Card background | `bg-card` |
| Primary button | `bg-primary text-primary-foreground` |
| Secondary button | `bg-secondary text-secondary-foreground` |
| Destructive button | `bg-destructive text-destructive-foreground` |
| Border | `border-border` |
| Input border | `border-input` |
| Focus ring | `ring-ring` |

---

## 2. Typography

### 2.1 Font Family

```css
--font-sans: "Inter";      /* Font chính cho UI */
--font-serif: "Source Serif 4"; /* Font cho nội dung dài */
--font-mono: "Geist Mono";  /* Font cho code */
```

### 2.2 Font Sizes - Mobile First

| Token | Mobile (< 640px) | Desktop (≥ 640px) | Usage |
|-------|------------------|-------------------|-------|
| `text-xs` | 12px (0.75rem) | 12px | Labels nhỏ, badges |
| `text-sm` | 14px (0.875rem) | 14px | Body text, table cells |
| `text-base` | 16px (1rem) | 16px | Body text default |
| `text-lg` | 18px (1.125rem) | 18px | Section titles |
| `text-xl` | 20px (1.25rem) | 20px | Card titles |
| `text-2xl` | 24px (1.5rem) | 24px | Page titles |
| `text-3xl` | 30px (1.875rem) | 30px | Hero text |

### 2.3 Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, buttons |
| `font-semibold` | 600 | Headings, important text |
| `font-bold` | 700 | Page titles |

### 2.4 Line Height

| Class | Value | Usage |
|-------|-------|-------|
| `leading-none` | 1 | Single-line text |
| `leading-tight` | 1.25 | Headings |
| `leading-normal` | 1.5 | Body text |
| `leading-relaxed` | 1.625 | Long-form content |

---

## 3. Spacing

### 3.1 Base Spacing Scale (Tailwind)

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0px | - |
| `0.5` | 2px | Micro spacing |
| `1` | 4px | Inline spacing |
| `1.5` | 6px | - |
| `2` | 8px | Small gap |
| `2.5` | 10px | - |
| `3` | 12px | Medium gap |
| `4` | 16px | Standard padding |
| `5` | 20px | - |
| `6` | 24px | Section padding |
| `8` | 32px | Large gap |
| `10` | 40px | - |
| `12` | 48px | Extra large |

### 3.2 Component Spacing Guidelines

| Component | Mobile | Desktop |
|-----------|--------|---------|
| Page padding | `p-4` (16px) | `p-6` (24px) |
| Card padding | `p-4` (16px) | `p-6` (24px) |
| Card header padding | `p-4 pb-2` | `p-6 pb-3` |
| Card content padding | `p-4 pt-0` | `p-6 pt-0` |
| Form field gap | `space-y-4` | `space-y-4` |
| Button group gap | `gap-2` | `gap-3` |
| Section gap | `space-y-6` | `space-y-8` |

---

## 4. Border Radius

```css
--radius: 0.5rem;  /* 8px - Base radius */
```

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | calc(var(--radius) - 4px) = 4px | Small badges |
| `rounded-md` | calc(var(--radius) - 2px) = 6px | Buttons, inputs |
| `rounded-lg` | var(--radius) = 8px | Cards, modals |
| `rounded-xl` | 12px | Large cards |
| `rounded-full` | 9999px | Avatars, pills |

---

## 5. Components

### 5.1 Buttons

#### Variants & Sizes

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| `default` | `bg-primary` | `text-primary-foreground` | - |
| `secondary` | `bg-secondary` | `text-secondary-foreground` | - |
| `outline` | `bg-transparent` | `text-foreground` | `border border-input` |
| `ghost` | `bg-transparent` | `text-foreground` | - |
| `destructive` | `bg-destructive` | `text-destructive-foreground` | - |
| `link` | `bg-transparent` | `text-primary underline` | - |

| Size | Height | Padding | Font Size |
|------|--------|---------|-----------|
| `sm` | 32px (h-8) | `px-3` | `text-xs` |
| `default` | 36px (h-9) | `px-4` | `text-sm` |
| `lg` | 40px (h-10) | `px-8` | `text-sm` |
| `icon` | 36px (h-9 w-9) | - | - |

#### Touch Target (Mobile)

```css
--touch-target: 44px;      /* Minimum touch target */
--touch-target-lg: 48px;   /* Large touch target */
```

### 5.2 Inputs

| Property | Value |
|----------|-------|
| Height | `h-9` (36px) - Desktop, `h-10` (40px) - Mobile |
| Padding | `px-3 py-2` |
| Border | `border border-input` |
| Border Radius | `rounded-md` |
| Font Size | `text-sm` |
| Focus | `ring-2 ring-ring ring-offset-2` |
| Placeholder | `text-muted-foreground` |

### 5.3 Cards

```jsx
<Card className="bg-card text-card-foreground rounded-lg border shadow-sm">
  <CardHeader className="p-6 pb-3">
    <CardTitle className="text-lg font-semibold">Tiêu đề</CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Mô tả
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    {/* Content */}
  </CardContent>
  <CardFooter className="p-6 pt-0">
    {/* Actions */}
  </CardFooter>
</Card>
```

### 5.4 Labels

```jsx
<Label className="text-sm font-medium leading-none">
  Nhãn trường
</Label>
```

### 5.5 Badges

| Variant | Background | Text |
|---------|------------|------|
| `default` | `bg-primary` | `text-primary-foreground` |
| `secondary` | `bg-secondary` | `text-secondary-foreground` |
| `outline` | `bg-transparent` | `text-foreground` + border |
| `destructive` | `bg-destructive` | `text-destructive-foreground` |

```jsx
<Badge className="text-xs px-2 py-0.5 rounded-full">
  Label
</Badge>
```

### 5.6 Tables

```jsx
<Table>
  <TableHeader>
    <TableRow className="border-b">
      <TableHead className="h-10 px-4 text-left text-sm font-medium text-muted-foreground">
        Header
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="border-b hover:bg-muted/50">
      <TableCell className="p-4 text-sm">
        Cell content
      </TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

## 6. Page Layout

### 6.1 Page Header

```jsx
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  <div>
    <h1 className="text-2xl font-bold tracking-tight">Page Title</h1>
    <p className="text-sm text-muted-foreground">Description</p>
  </div>
  <div className="flex gap-2">
    {/* Actions */}
  </div>
</div>
```

### 6.2 Customer/Entity Detail Page (Reference: /customers/CUST000001)

```jsx
<div className="space-y-6">
  {/* Header với Title + Status Badges */}
  <div className="flex items-start justify-between">
    <div>
      <h1 className="text-2xl font-bold">Entity Name</h1>
      <div className="flex flex-wrap gap-2 mt-2">
        <Badge variant="secondary">Status Badge</Badge>
        <Badge variant="outline">Tag</Badge>
      </div>
    </div>
    <div className="flex gap-2">
      <Button variant="outline" className="text-destructive">
        Chuyển vào thùng rác
      </Button>
      <Button>Chỉnh sửa</Button>
    </div>
  </div>

  {/* Stats Cards Row */}
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
    <Card className="p-4">
      <p className="text-xs text-muted-foreground">Label</p>
      <p className="text-xl font-bold">Value</p>
      <p className="text-xs text-muted-foreground">Sub info</p>
    </Card>
  </div>

  {/* Tabs Navigation */}
  <Tabs defaultValue="info">
    <TabsList className="w-full justify-start border-b bg-transparent p-0">
      <TabsTrigger value="info" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary">
        Thông tin
      </TabsTrigger>
      {/* More tabs */}
    </TabsList>
    
    <TabsContent value="info" className="space-y-6 mt-6">
      {/* Section Cards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Section Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Label</p>
              <p className="text-sm font-medium">Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
```

---

## 7. Mobile-First Responsive Design

### 7.1 Breakpoints

```js
screens: {
  'xs': '475px',     // Extra small phones
  'sm': '640px',     // Small tablets and large phones (landscape)
  'md': '768px',     // Small tablets (portrait)
  'lg': '1024px',    // Tablets (landscape) and small laptops
  'xl': '1280px',    // Laptops and desktops
  '2xl': '1536px',   // Large desktops
  
  // Utility breakpoints
  'mobile': {'max': '767px'},
  'tablet': {'min': '768px', 'max': '1023px'},
  'desktop': {'min': '1024px'},
}
```

### 7.2 Mobile-First Pattern

```jsx
// Always start with mobile styles, then add responsive modifiers
<div className="
  flex flex-col gap-4           // Mobile: vertical stack
  sm:flex-row sm:items-center   // Tablet+: horizontal
  lg:gap-6                      // Desktop: larger gap
">
```

### 7.3 Touch Targets

```css
/* Minimum 44x44px cho touch targets trên mobile */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}
```

### 7.4 Safe Areas (iOS)

```css
:root {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
}
```

---

## 8. Shadows

```css
--shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);  /* Default subtle shadow */
```

| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation |
| `shadow` | Default cards |
| `shadow-md` | Dropdowns, popovers |
| `shadow-lg` | Modals, dialogs |

---

## 9. Data Display Patterns

### 9.1 Info Field (Read-only data)

```jsx
<div>
  <p className="text-sm text-muted-foreground mb-1">Label</p>
  <p className="text-sm font-medium flex items-center gap-2">
    Value
    <Button variant="ghost" size="icon" className="h-6 w-6">
      <Copy className="h-3 w-3" />
    </Button>
  </p>
</div>
```

### 9.2 Stats Card

```jsx
<Card className="p-4">
  <div className="flex items-center justify-between">
    <p className="text-xs text-muted-foreground uppercase tracking-wide">
      Label
    </p>
    <Icon className="h-4 w-4 text-muted-foreground" />
  </div>
  <p className="text-2xl font-bold mt-2">
    Value
  </p>
  <p className="text-xs text-muted-foreground mt-1">
    +20% so với tháng trước
  </p>
</Card>
```

### 9.3 Empty State

```jsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <Icon className="h-12 w-12 text-muted-foreground/50 mb-4" />
  <h3 className="text-lg font-semibold">Không có dữ liệu</h3>
  <p className="text-sm text-muted-foreground mt-1 max-w-sm">
    Mô tả giải thích tại sao không có dữ liệu
  </p>
  <Button className="mt-4">
    Action
  </Button>
</div>
```

---

## 10. Animation & Transitions

### 10.1 Default Transition

```jsx
className="transition-colors duration-200"
```

### 10.2 Common Animations

| Animation | Duration | Easing |
|-----------|----------|--------|
| Hover color | 150ms | `ease-in-out` |
| Modal open | 200ms | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Dropdown | 150ms | `ease-out` |
| Toast | 200ms | `ease-out` |

---

## 11. Accessibility

### 11.1 Focus States

```jsx
// Tất cả interactive elements phải có focus visible
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

### 11.2 Color Contrast

- Text trên background: Tối thiểu 4.5:1
- Large text: Tối thiểu 3:1
- Interactive elements: Tối thiểu 3:1

### 11.3 Screen Reader

```jsx
// Ẩn visual nhưng accessible cho screen reader
<span className="sr-only">Description for screen reader</span>
```

---

## 12. Checklist UI Review

Khi review UI, kiểm tra các điểm sau:

### Typography
- [ ] Font sizes consistent với design system
- [ ] Font weights đúng (medium cho labels, semibold cho headings)
- [ ] Line heights phù hợp
- [ ] Color contrast đủ

### Spacing
- [ ] Padding consistent (4, 6 cho cards/sections)
- [ ] Gap giữa elements phù hợp
- [ ] Mobile spacing không quá chật

### Components
- [ ] Buttons có đúng size và variant
- [ ] Inputs có đủ height cho touch
- [ ] Cards có proper padding và border-radius
- [ ] Tables responsive trên mobile

### Colors
- [ ] Sử dụng semantic colors (primary, secondary, muted...)
- [ ] Dark mode hoạt động đúng
- [ ] Destructive actions dùng màu đỏ

### Responsive
- [ ] Mobile-first approach
- [ ] Touch targets ≥ 44px
- [ ] Layout responsive với breakpoints
- [ ] Text không bị cut off

### Accessibility
- [ ] Focus states visible
- [ ] Screen reader labels
- [ ] Proper heading hierarchy
