/**
 * 🍞 BREADCRUMB SYSTEM v2.0 - Next.js Native
 * 
 * Simple breadcrumb generation from pathname + metadata
 * No dependency on Prisma/stores - works in both client & server
 * 
 * Features:
 * - Route metadata from pathname
 * - Optional entity data from page props
 * - Zero runtime dependencies
 * - Client & Server compatible
 * 
 * @example
 * ```typescript
 * // Server Component
 * const breadcrumbs = getBreadcrumbsFromPath('/categories/CATEGORY000001')
 * 
 * // With entity data
 * const breadcrumbs = getBreadcrumbsFromPath(pathname, { name: 'Điện tử' })
 * ```
 * 
 * @version 2.0.0
 * @date 2026-01-20
 */

// Route metadata registry - static configuration
const ROUTE_METADATA: Record<string, { label: string; icon?: string }> = {
  '/': { label: 'Trang chủ' },
  '/dashboard': { label: 'Dashboard' },
  '/categories': { label: 'Danh mục sản phẩm' },
  '/products': { label: 'Sản phẩm' },
  '/brands': { label: 'Thương hiệu' },
  '/customers': { label: 'Khách hàng' },
  '/suppliers': { label: 'Nhà cung cấp' },
  '/orders': { label: 'Đơn hàng' },
  '/receipts': { label: 'Phiếu thu' },
  '/payments': { label: 'Phiếu chi' },
  '/employees': { label: 'Nhân viên' },
  '/departments': { label: 'Phòng ban' },
  '/branches': { label: 'Chi nhánh' },
  '/attendance': { label: 'Chấm công' },
  '/penalties': { label: 'Phiếu phạt' },
  '/leaves': { label: 'Nghỉ phép' },
  '/warranty': { label: 'Bảo hành' },
  '/settings': { label: 'Cài đặt' },
};

/**
 * Breadcrumb item interface
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

/**
 * Generate breadcrumbs from pathname
 * 
 * @param pathname - Current route pathname (from usePathname() or params)
 * @param entityData - Optional entity data (name, id) to display
 * @returns Array of breadcrumb items
 * 
 * @example
 * ```tsx
 * // Simple usage
 * const crumbs = getBreadcrumbsFromPath('/categories')
 * 
 * // With entity data (pass from page props)
 * const crumbs = getBreadcrumbsFromPath('/categories/CAT001', { 
 *   name: 'Điện tử',
 *   id: 'DM000001' 
 * })
 * ```
 */
export function getBreadcrumbsFromPath(
  pathname: string,
  entityData?: { name?: string; id?: string }
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return [{ label: 'Trang chủ', href: '/', isCurrent: true }];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', href: '/', isCurrent: false }
  ];

  let currentPath = '';
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;
    const isCurrent = i === segments.length - 1;

    // Check if segment is an entity ID (uppercase letters + numbers)
    const isEntityId = /^[A-Z]+\d+$/.test(segment);

    if (isEntityId) {
      // Display entity data if provided, otherwise show ID
      const label = entityData?.name || entityData?.id || segment;
      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrent
      });
    } else if (segment === 'edit') {
      breadcrumbs.push({
        label: 'Chỉnh sửa',
        href: currentPath,
        isCurrent
      });
    } else if (segment === 'new') {
      breadcrumbs.push({
        label: 'Tạo mới',
        href: currentPath,
        isCurrent
      });
    } else {
      // Use route metadata or format segment
      const metadata = ROUTE_METADATA[currentPath];
      const label = metadata?.label || formatSegmentLabel(segment);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        isCurrent
      });
    }
  }

  return breadcrumbs;
}

/**
 * Format segment into readable label
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * React hook for breadcrumbs (client-side)
 * Use with usePathname() from next/navigation
 * 
 * @example
 * ```tsx
 * 'use client'
 * import { usePathname } from 'next/navigation'
 * import { useBreadcrumbs } from '@/lib/breadcrumb-generator'
 * 
 * function MyPage({ category }) {
 *   const pathname = usePathname()
 *   const breadcrumbs = useBreadcrumbs(pathname, category)
 *   // ...
 * }
 * ```
 */
export function useBreadcrumbs(
  pathname: string,
  entityData?: { name?: string; id?: string }
): BreadcrumbItem[] {
  return getBreadcrumbsFromPath(pathname, entityData);
}

// Legacy exports for backward compatibility
export function generateDetailBreadcrumb(pathname: string, entityData?: { name?: string }): BreadcrumbItem[] {
  return getBreadcrumbsFromPath(pathname, entityData);
}

export function generateFormBreadcrumb(pathname: string): BreadcrumbItem[] {
  return getBreadcrumbsFromPath(pathname);
}

export function getEntityDisplayInfo() {
  return { name: '', id: '' };
}

// No-op for legacy compatibility
export function registerBreadcrumbStore(_name?: string, _getState?: () => unknown) {}
export function clearBreadcrumbStores() {}
export function getRegisteredStores() {
  return {};
}
