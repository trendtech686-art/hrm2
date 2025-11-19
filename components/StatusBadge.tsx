import * as React from 'react';
import { Badge } from './ui/badge';
import type { BadgeProps } from './ui/badge';
import { cn } from '../lib/utils';

export type StatusVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';

export interface StatusConfig {
  label: string;
  variant: StatusVariant;
  className?: string;
}

interface StatusBadgeProps {
  status: string;
  statusMap: Record<string, StatusConfig>;
  className?: string;
  defaultVariant?: StatusVariant;
  defaultLabel?: string;
}

/**
 * Generic Status Badge Component
 * 
 * Dùng chung cho: Orders, Warranty, Complaints, Shipments...
 * 
 * Features:
 * - Customizable status mappings
 * - Consistent styling across features
 * - Fallback for unknown statuses
 * - Type-safe with TypeScript
 * 
 * Usage:
 * ```tsx
 * // Define status map
 * const ORDER_STATUS_MAP: Record<string, StatusConfig> = {
 *   'Đặt hàng': { label: 'Đặt hàng', variant: 'secondary' },
 *   'Hoàn thành': { label: 'Hoàn thành', variant: 'success' },
 *   'Đã hủy': { label: 'Đã hủy', variant: 'destructive' },
 * };
 * 
 * // Use in component
 * <StatusBadge status={order.status} statusMap={ORDER_STATUS_MAP} />
 * ```
 */
export function StatusBadge({
  status,
  statusMap,
  className,
  defaultVariant = 'secondary',
  defaultLabel,
}: StatusBadgeProps) {
  const config = statusMap[status] || {
    label: defaultLabel || status,
    variant: defaultVariant,
  };

  return (
    <Badge 
      variant={config.variant as any}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}

// ============================================
// PRESET STATUS MAPS - Common use cases
// ============================================

/**
 * Order Main Status
 */
export const ORDER_MAIN_STATUS_MAP: Record<string, StatusConfig> = {
  'Đặt hàng': { label: 'Đặt hàng', variant: 'secondary' },
  'Đang giao dịch': { label: 'Đang giao dịch', variant: 'warning' },
  'Hoàn thành': { label: 'Hoàn thành', variant: 'success' },
  'Đã hủy': { label: 'Đã hủy', variant: 'destructive' },
};

/**
 * Payment Status
 */
export const PAYMENT_STATUS_MAP: Record<string, StatusConfig> = {
  'Chưa thanh toán': { label: 'Chưa thanh toán', variant: 'warning' },
  'Thanh toán 1 phần': { label: 'Thanh toán 1 phần', variant: 'warning' },
  'Thanh toán toàn bộ': { label: 'Thanh toán toàn bộ', variant: 'success' },
};

/**
 * Delivery Status
 */
export const DELIVERY_STATUS_MAP: Record<string, StatusConfig> = {
  'Chờ đóng gói': { label: 'Chờ đóng gói', variant: 'secondary' },
  'Đã đóng gói': { label: 'Đã đóng gói', variant: 'default' },
  'Chờ lấy hàng': { label: 'Chờ lấy hàng', variant: 'warning' },
  'Đang giao hàng': { label: 'Đang giao hàng', variant: 'warning' },
  'Đã giao hàng': { label: 'Đã giao hàng', variant: 'success' },
  'Chờ giao lại': { label: 'Chờ giao lại', variant: 'destructive' },
  'Đã hủy': { label: 'Đã hủy', variant: 'destructive' },
};

/**
 * Print Status
 */
export const PRINT_STATUS_MAP: Record<string, StatusConfig> = {
  'Đã in': { label: 'Đã in', variant: 'success' },
  'Chưa in': { label: 'Chưa in', variant: 'secondary' },
};

/**
 * Stock Out Status
 */
export const STOCK_OUT_STATUS_MAP: Record<string, StatusConfig> = {
  'Chưa xuất kho': { label: 'Chưa xuất kho', variant: 'secondary' },
  'Xuất kho toàn bộ': { label: 'Xuất kho toàn bộ', variant: 'success' },
};

/**
 * Return Status
 */
export const RETURN_STATUS_MAP: Record<string, StatusConfig> = {
  'Chưa trả hàng': { label: 'Chưa trả hàng', variant: 'secondary' },
  'Trả hàng một phần': { label: 'Trả hàng một phần', variant: 'warning' },
  'Trả hàng toàn bộ': { label: 'Trả hàng toàn bộ', variant: 'destructive' },
};

/**
 * Warranty Status
 */
export const WARRANTY_STATUS_MAP: Record<string, StatusConfig> = {
  'incomplete': { label: 'Chưa đầy đủ', variant: 'warning' },
  'pending': { label: 'Chưa xử lý', variant: 'secondary' },
  'processed': { label: 'Đã xử lý', variant: 'default' },
  'returned': { label: 'Đã trả', variant: 'success' },
  'completed': { label: 'Kết thúc', variant: 'success' },
  'cancelled': { label: 'Đã hủy', variant: 'destructive' },
};

/**
 * Warranty Resolution
 */
export const WARRANTY_RESOLUTION_MAP: Record<string, StatusConfig> = {
  'return': { 
    label: 'Trả lại', 
    variant: 'success',
    className: 'bg-green-100 text-green-800 border-green-300'
  },
  'replace': { 
    label: 'Đổi mới', 
    variant: 'default',
    className: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  'deduct': { 
    label: 'Trừ tiền', 
    variant: 'warning',
    className: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  'out_of_stock': { 
    label: 'Hết hàng', 
    variant: 'destructive',
    className: 'bg-red-100 text-red-800 border-red-300'
  },
};

/**
 * Complaint Status
 */
export const COMPLAINT_STATUS_MAP: Record<string, StatusConfig> = {
  'pending': { label: 'Chờ xử lý', variant: 'warning' },
  'investigating': { label: 'Đang kiểm tra', variant: 'warning' },
  'resolved': { label: 'Đã giải quyết', variant: 'success' },
  'cancelled': { label: 'Đã hủy', variant: 'destructive' },
  'ended': { label: 'Kết thúc', variant: 'secondary' },
};

/**
 * Complaint Priority
 */
export const COMPLAINT_PRIORITY_MAP: Record<string, StatusConfig> = {
  'low': { label: 'Thấp', variant: 'secondary' },
  'medium': { label: 'Trung bình', variant: 'default' },
  'high': { label: 'Cao', variant: 'warning' },
  'urgent': { label: 'Khẩn cấp', variant: 'destructive' },
};

/**
 * Packaging Status
 */
export const PACKAGING_STATUS_MAP: Record<string, StatusConfig> = {
  'Chờ đóng gói': { label: 'Chờ đóng gói', variant: 'secondary' },
  'Đã đóng gói': { label: 'Đã đóng gói', variant: 'success' },
  'Hủy đóng gói': { label: 'Hủy đóng gói', variant: 'destructive' },
};

/**
 * Reconciliation Status
 */
export const RECONCILIATION_STATUS_MAP: Record<string, StatusConfig> = {
  'Chưa đối soát': { label: 'Chưa đối soát', variant: 'secondary' },
  'Đã đối soát': { label: 'Đã đối soát', variant: 'success' },
};

/**
 * Active/Inactive Status
 */
export const ACTIVE_STATUS_MAP: Record<string, StatusConfig> = {
  'Đang hoạt động': { label: 'Đang hoạt động', variant: 'success' },
  'Ngừng hoạt động': { label: 'Ngừng hoạt động', variant: 'destructive' },
  'active': { label: 'Active', variant: 'success' },
  'inactive': { label: 'Inactive', variant: 'destructive' },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Create custom status map for specific use case
 */
export function createStatusMap(
  statuses: string[],
  getConfig: (status: string) => StatusConfig
): Record<string, StatusConfig> {
  return statuses.reduce((map, status) => {
    map[status] = getConfig(status);
    return map;
  }, {} as Record<string, StatusConfig>);
}

/**
 * Warranty remaining days badge (time-based status)
 */
export function getWarrantyDaysStatusConfig(daysRemaining: number): StatusConfig {
  if (daysRemaining < 0) {
    return { label: 'Hết hạn', variant: 'destructive' };
  } else if (daysRemaining <= 7) {
    return { label: `Còn ${daysRemaining} ngày`, variant: 'destructive' };
  } else if (daysRemaining <= 30) {
    return { label: `Còn ${daysRemaining} ngày`, variant: 'warning' };
  } else {
    return { label: `Còn ${daysRemaining} ngày`, variant: 'success' };
  }
}
