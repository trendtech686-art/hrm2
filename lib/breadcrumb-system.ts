/**
 * Breadcrumb System
 * 
 * Central exports for breadcrumb functionality.
 * Re-exports from breadcrumb-generator.ts with additional types.
 */

// Re-export functions that still make sense
export {
  generateDetailBreadcrumb,
  generateFormBreadcrumb,
  useBreadcrumb,
  getEntityDisplayInfo,
  registerBreadcrumbStore,
  clearBreadcrumbStores,
  getRegisteredStores,
} from './breadcrumb-generator';

/**
 * Breadcrumb Item Interface
 * Used for page header breadcrumb navigation
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** Route href for navigation */
  href: string;
  /** Whether this is the current/active page */
  isCurrent?: boolean;
}

/**
 * Generate breadcrumb items from pathname
 * 
 * @param pathname - Current route pathname  
 * @param context - Optional context data for entity lookup
 * @returns Array of BreadcrumbItem
 */
export function generateBreadcrumb(
  pathname: string,
  context?: Record<string, any>
): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return [{ label: 'Trang chủ', href: '/', isCurrent: true }];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Trang chủ', href: '/', isCurrent: false }
  ];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Get display label for segment
    const label = getSegmentLabel(segment, context, isLast);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrent: isLast
    });
  });

  return breadcrumbs;
}

/**
 * Get display label for a route segment
 */
function getSegmentLabel(segment: string, context?: Record<string, any>, isLast?: boolean): string {
  // Check if context provides entity name
  if (context?.name && isLast) {
    return context.name;
  }
  if (context?.title && isLast) {
    return context.title;
  }
  if (context?.id && isLast) {
    return context.id;
  }

  // Route to label mapping
  const routeLabelMap: Record<string, string> = {
    // Core
    'dashboard': 'Tổng quan',
    'employees': 'Nhân viên',
    'customers': 'Khách hàng',
    'products': 'Sản phẩm',
    'orders': 'Đơn hàng',
    'suppliers': 'Nhà cung cấp',
    'receipts': 'Phiếu thu',
    'payments': 'Phiếu chi',
    'cashbook': 'Sổ quỹ',
    'purchase-orders': 'Đơn mua hàng',
    'purchase-returns': 'Trả hàng NCC',
    'sales-returns': 'Trả hàng',
    'inventory-receipts': 'Nhập kho',
    'inventory-checks': 'Kiểm kho',
    'stock-transfers': 'Chuyển kho',
    'stock-locations': 'Vị trí kho',
    'stock-history': 'Lịch sử kho',
    'cost-adjustments': 'Điều chỉnh giá vốn',
    
    // Settings
    'settings': 'Cài đặt',
    'store-info': 'Thông tin cửa hàng',
    'appearance': 'Giao diện',
    'taxes': 'Thuế',
    'pricing': 'Bảng giá',
    'shipping': 'Vận chuyển',
    'inventory': 'Kho hàng',
    'print-templates': 'Mẫu in',
    'employee-roles': 'Phân quyền',
    'workflow-templates': 'Quy trình',
    'id-counters': 'Mã tự động',
    'provinces': 'Tỉnh thành',
    'sales-config': 'Cấu hình bán hàng',
    'system-logs': 'Nhật ký hệ thống',
    'import-export-logs': 'Nhật ký nhập/xuất',
    
    // Operations
    'warranty': 'Bảo hành',
    'complaints': 'Khiếu nại',
    'tasks': 'Công việc',
    'wiki': 'Wiki',
    'shipments': 'Vận đơn',
    'packaging': 'Đóng gói',
    'attendance': 'Chấm công',
    'leaves': 'Nghỉ phép',
    'payroll': 'Bảng lương',
    
    // Reports
    'reports': 'Báo cáo',
    
    // Forms
    'new': 'Thêm mới',
    'edit': 'Chỉnh sửa',
    
    // Categories
    'categories': 'Danh mục',
    'brands': 'Thương hiệu',
  };
  
  return routeLabelMap[segment] || segment;
}

/**
 * Generate page title from pathname and context
 * 
 * @param pathname - Current route pathname
 * @param context - Optional context with entity data
 * @returns Object with title and optional subtitle
 */
export function generatePageTitle(
  pathname: string,
  context?: Record<string, any>
): { title: string; subtitle?: string } {
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];
  const secondLastSegment = segments[segments.length - 2];
  
  // Check for entity display name in context
  if (context) {
    const displayName = context.name || context.title || context.id;
    if (displayName) {
      // Determine page type
      if (lastSegment === 'edit') {
        return { title: `Chỉnh sửa ${displayName}` };
      }
      if (lastSegment === 'new') {
        const entityLabel = getSegmentLabel(secondLastSegment);
        return { title: `Thêm ${entityLabel} mới` };
      }
      // Detail page
      return { title: displayName };
    }
  }
  
  // Default title from route
  const title = getSegmentLabel(lastSegment, context);
  return { title };
}
