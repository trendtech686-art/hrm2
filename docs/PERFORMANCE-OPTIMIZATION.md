# Performance Optimization Guide

## Đã thực hiện

### 1. Dynamic Imports (Code Splitting)
- `ProductSelectionDialog` - lazy load khi cần (~50KB)
- `AddServiceDialog` - lazy load khi mở
- `ApplyPromotionDialog` - lazy load khi mở
- `LineItemsTable` - lazy load (700+ lines, heavy calculations)
- `ShippingCard` - lazy load (1200+ lines, nhiều API calls)
- Các dialog trong order-detail-page đã có dynamic imports

### 2. React Concurrent Features
- `useDeferredValue` cho `allProducts` - defer heavy array
- `useDeferredValue` cho `lineItems` calculations
- `startTransition` cho order total calculations
- `React.memo` cho `OrderCalculations` component

### 3. Callback Memoization
- `useCallback` cho `handleSelectProducts` - prevent re-renders
- `useCallback` cho `handleApplyPromotion` - prevent re-renders

### 4. Loading States
- Improved skeleton loading với animation
- Visual feedback với Loader2 spinner
- Loading placeholders cho lazy components

### 5. React Query Optimizations (Đã có)
- `staleTime: 60_000` cho products, employees (1 phút)
- `gcTime: 10 * 60 * 1000` (10 phút cache)
- `placeholderData: keepPreviousData` để tránh flicker

### 6. Next.js Config Optimizations
- `optimizePackageImports` cho tree-shaking tốt hơn
- `turbopackFileSystemCacheForDev` cho dev build nhanh hơn
- `reactStrictMode: true` để catch issues sớm

## Đề xuất cải thiện thêm

### 1. Virtual Scrolling cho danh sách lớn
```bash
pnpm add @tanstack/react-virtual
```

Áp dụng cho:
- `LineItemsTable` khi có nhiều sản phẩm (>20 items)
- Product selection dialog
- Customer list

### 2. Giảm số lượng useAll* hooks
Thay vì fetch ALL data, sử dụng:
- `useProductSearch` cho autocomplete (đã có)
- Pagination cho danh sách
- Search-as-you-type với debounce

### 3. React Query Optimizations
```typescript
// Tăng staleTime để giảm refetch
const { data } = useAllProducts({
  staleTime: 5 * 60 * 1000, // 5 phút
  cacheTime: 30 * 60 * 1000, // 30 phút
});
```

### 4. Image Lazy Loading
```tsx
<img loading="lazy" src={imageUrl} />
```

### 5. Bundle Analysis
```bash
pnpm add -D @next/bundle-analyzer
```

```js
// next.config.ts
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer(nextConfig);
```

### 6. Prefetching critical routes
```tsx
// Prefetch order detail khi hover
<Link href={`/orders/${id}`} prefetch={true}>
```

## Monitoring Performance

### React DevTools Profiler
1. Mở React DevTools
2. Tab "Profiler"
3. Record và check component render times

### Core Web Vitals
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1

## Quick Wins

1. ✅ Dynamic imports cho dialogs
2. ✅ useDeferredValue cho heavy data
3. ✅ startTransition cho calculations
4. ✅ Virtual scrolling (không cần - đã có server pagination)
5. ✅ Reduce useAll* hook usage (removed useAllOrders)
6. ✅ Image lazy loading (LazyImage component)
7. ✅ Prefetch critical routes
8. ⏳ Bundle analyzer (cài thủ công: `pnpm add -D @next/bundle-analyzer`)
