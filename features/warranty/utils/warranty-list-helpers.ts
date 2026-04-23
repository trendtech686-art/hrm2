import type { WarrantyTicket } from '../types';
import { checkWarrantyOverdue, type WarrantySLATargets } from '../warranty-sla-utils';
import type { CardColorSettings } from '../../settings/warranty/hooks/use-warranty-settings';

/**
 * Parse Tailwind color class to CSS style
 */
export function parseColorClass(colorClass: string): React.CSSProperties {
  if (!colorClass || typeof colorClass !== 'string') {
    return {};
  }
  
  /* eslint-disable hrm-theme/no-raw-palette-class -- chuỗi class từ settings thẻ → backgroundColor */
  const colorMap: Record<string, string> = {
    'bg-info/10': 'color-mix(in oklch, var(--info) 12%, transparent)',
    'bg-success/10': 'color-mix(in oklch, var(--success) 12%, transparent)',
    'bg-warning/10': 'color-mix(in oklch, var(--warning) 14%, transparent)',
    'bg-warning/15': 'color-mix(in oklch, var(--warning) 18%, transparent)',
    'bg-warning/20': 'color-mix(in oklch, var(--warning) 24%, transparent)',
    'bg-destructive/10': 'color-mix(in oklch, var(--destructive) 12%, transparent)',
    'bg-destructive/15': 'color-mix(in oklch, var(--destructive) 16%, transparent)',
    'bg-yellow-50': '#fefce8',
    'bg-blue-50': '#eff6ff',
    'bg-green-50': '#f0fdf4',
    'bg-gray-50': 'var(--muted)',
    'bg-amber-50': '#fffbeb',
    'bg-orange-50': '#fff7ed',
    'bg-red-50': '#fef2f2',
    'bg-red-100': '#fee2e2',
    'bg-slate-50': 'var(--muted)',
    'bg-muted': 'var(--muted)',
  };
  /* eslint-enable hrm-theme/no-raw-palette-class */
  
  const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-'));
  const hexColor = bgClass ? colorMap[bgClass] : null;
  
  if (!hexColor) return {};
  
  return {
    backgroundColor: hexColor,
  };
}

/**
 * Get row style based on overdue/status
 */
export function getWarrantyRowStyle(
  ticket: WarrantyTicket,
  cardColors: CardColorSettings,
  slaTargets?: WarrantySLATargets,
): React.CSSProperties {
  // Check if overdue and overdue color is enabled (Priority 1)
  const overdueStatus = checkWarrantyOverdue(ticket, slaTargets);
  const isOverdue = overdueStatus.isOverdueResponse || 
                    overdueStatus.isOverdueProcessing || 
                    overdueStatus.isOverdueReturn;
  
  if (cardColors.enableOverdueColor && isOverdue) {
    const colorClass = cardColors.overdueColor;
    return parseColorClass(colorClass || '');
  }
  
  // Check status color if enabled (Priority 2)
  if (cardColors.enableStatusColors) {
    const colorClass = cardColors.statusColors[ticket.status];
    if (colorClass) {
      return parseColorClass(colorClass);
    }
  }
  
  return {};
}

/**
 * Calculate warranty statistics
 */
export function calculateWarrantyStats(tickets: WarrantyTicket[], slaTargets?: WarrantySLATargets) {
  return tickets.reduce(
    (acc, ticket) => {
      acc.total += 1;
      if (ticket.status === 'RECEIVED') acc.received += 1;
      if (ticket.status === 'PROCESSING') acc.processing += 1;
      if (ticket.status === 'WAITING_PARTS') acc.waitingParts += 1;
      if (ticket.status === 'COMPLETED') acc.completed += 1;
      if (ticket.status === 'RETURNED') acc.returned += 1;
      if (ticket.status === 'CANCELLED') acc.cancelled += 1;
      const overdue = checkWarrantyOverdue(ticket, slaTargets);
      if (overdue.isOverdueResponse || overdue.isOverdueProcessing || overdue.isOverdueReturn) {
        acc.overdue += 1;
      }
      return acc;
    },
    { total: 0, received: 0, processing: 0, waitingParts: 0, completed: 0, returned: 0, cancelled: 0, overdue: 0 }
  );
}

/**
 * Export selected tickets to CSV
 */
export function exportTicketsToCsv(tickets: WarrantyTicket[], statusLabels: Record<string, string>) {
  const dataToExport = tickets.map((ticket) => ({
    'Mã phiếu': ticket.id,
    'Khách hàng': ticket.customerName,
    'SĐT': ticket.customerPhone,
    'Địa chỉ': ticket.customerAddress,
    'Mã vận đơn': ticket.trackingCode,
    'Phí vận chuyển': ticket.shippingFee,
    'Trạng thái': statusLabels[ticket.status],
    'Số SP': ticket.summary.totalProducts,
    'SP đổi mới': ticket.summary.totalReplaced,
    'SP trả lại': ticket.summary.totalReturned,
    'SP hết hàng': ticket.summary.totalOutOfStock,
    'Tiền bù trừ': ticket.summary.totalDeduction,
    'Ngày tạo': ticket.createdAt,
  }));

  const csv = [
    Object.keys(dataToExport[0]).join(','),
    ...dataToExport.map((row) => Object.values(row).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `warranty-export-${new Date().toISOString()}.csv`;
  link.click();
}
