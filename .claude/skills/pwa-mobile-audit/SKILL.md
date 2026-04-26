# Skill: Rà soát PWA Mobile App

## Mục đích
Kiểm tra ứng dụng web để đảm bảo tích hợp PWA và trải nghiệm mobile tối ưu cho hệ thống HRM2.

## Tiêu chí kiểm tra

### 1. PWA Manifest
```
Dấu hiệu SAI:
- Thiếu manifest.json hoặc manifest không đầy đủ
- icons không đúng kích thước (192x192, 512x512)
- start_url, display, theme_color, background_color không khai báo
- Short name quá dài (>12 ký tự)

Dấu hiệu ĐÚNG:
- manifest.json đầy đủ với tất cả required fields
- Icons ở nhiều kích thước (PNG, WebP)
- Standalone display mode cho mobile app feel
- Dark/light theme phù hợp
```

### 2. Service Worker
```
Dấu hiệu SAI:
- Không có service worker
- SW không cache static assets
- SW không handle offline fallback
- Cache không có version strategy

Dấu hiệu ĐÚNG:
- next-pwa hoặc custom SW với Workbox
- Cache static assets (JS, CSS, fonts, images)
- Network-first cho API calls
- Offline page/component cho graceful degradation
- Cache strategy phù hợp (StaleWhileRevalidate cho data)
```

### 3. Offline Support
```
Dấu hiệu SAI:
- API call fail ngay khi offline
- Không có offline indicator
- Form submit không có queue

Dấu hiệu ĐÚNG:
- useOffline hook để track connectivity
- Offline banner/indicator khi mất mạng
- Optimistic UI với queue cho mutations
- IndexedDB cho local storage
```

### 4. Mobile Responsive
```
Dấu hiệu SAI:
- Touch targets < 44x44px
- Text < 16px không zoom được
- Horizontal scroll trên mobile
- Fixed width elements

Dấu hiệu ĐÚNG:
- Tailwind breakpoints (sm:, md:, lg:)
- Touch targets tối thiểu h-10 w-10
- Font size tối thiểu 16px
- Viewport meta tag đúng
- Horizontal scroll với overflow-x-auto
```

### 5. Mobile Navigation
```
Dấu hiệu SAI:
- Desktop sidebar không collapse trên mobile
- Bottom navigation không sticky
- Hamburger menu không dễ tap

Dấu hiệu ĐÚNG:
- Mobile: Bottom tab bar hoặc hamburger + slide-out
- Sticky header với hành động chính
- Pull-to-refresh cho lists
- Swipe gestures cho common actions
```

### 6. Mobile Forms
```
Dấu hiệu SAI:
- Input không auto-focus hoặc zoom viewport
- Date picker không native trên mobile
- Validation errors không visible trên mobile
- Submit button bị keyboard che

Dấu hiệu ĐÚNG:
- inputMode phù hợp (numeric, email, tel)
- Native date/time pickers với proper types
- Form scrollIntoView khi có lỗi
- Keyboard-aware scrolling
- Auto-save draft cho forms dài
```

### 7. Performance Mobile
```
Dấu hiệu SAI:
- Bundle > 250KB gzipped
- Không lazy load images
- Font không preload
- Large layout shift khi load

Dấu hiệu ĐÚNG:
- Code splitting theo route
- next/image với sizes chính xác
- next/font hoặc font-display: swap
- Skeleton loaders thay vì spinners
- Virtual scrolling cho long lists
```

### 8. Native Feel
```
Dấu hiệu SAI:
- Scroll không smooth
- Back button không hoạt động đúng
- Không có haptic feedback
- App không request permissions đúng cách

Dấu hiệu ĐÚNG:
- -webkit-overflow-scrolling: touch
- History API / useRouter() properly
- CSS transitions cho navigation
- Safe area insets cho notched devices
- PWA install prompt handling
```

### 9. Push Notifications
```
Dấu hiệu SAI:
- Notification permission không requested gracefully
- Không có notification click handler

Dấu hiệu ĐÚNG:
- VAPID keys configured
- Permission request sau user interaction
- Notification click navigates to relevant page
- Badge count management
```

### 10. Storage Strategy
```
Dấu hiệu SAI:
- localStorage cho sensitive data
- Không có storage quota check
- Data không sync khi online

Dấu hiệu ĐÚNG:
- IndexedDB cho structured data
- Encrypted storage cho sensitive info
- Storage quota monitoring
- Background sync khi reconnect
```

## Checklist Output Format

```typescript
{
  file: string,
  line?: number,
  issue: string,
  severity: 'error' | 'warning' | 'info',
  suggestion: string,
  category: 'pwa-manifest' | 'service-worker' | 'offline' | 'responsive' | 'mobile-nav' | 'mobile-forms' | 'performance' | 'native-feel' | 'notifications' | 'storage'
}
```

## Priority Levels

1. **CRITICAL** (P0): PWA installable, offline fallback, auth flows
2. **HIGH** (P1): Mobile responsive, touch targets, navigation
3. **MEDIUM** (P2): Performance, forms, native feel
4. **LOW** (P3): Polish, animations, haptic feedback
