import * as React from 'react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { MoreHorizontal, Phone, Mail, Eye } from 'lucide-react';
import type { ColumnDef } from '../../../components/data-table/types';
import type { CustomerSlaAlert, DebtAlert, CustomerHealthAlert, SlaAlertLevel } from './types';
import { formatDaysRemaining } from './sla-utils';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Link } from '@/lib/next-compat';
import { ROUTES } from '../../../lib/router';

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND',
    maximumFractionDigits: 0 
  }).format(value);
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), 'dd/MM/yyyy', { locale: vi });
  } catch {
    return dateStr;
  }
};

const getAlertBadge = (level: SlaAlertLevel) => {
  switch (level) {
    case 'overdue':
      return <Badge variant="destructive">Quá hạn</Badge>;
    case 'critical':
      return <Badge className="bg-orange-500 hover:bg-orange-600">Nghiêm trọng</Badge>;
    case 'warning':
      return <Badge variant="outline" className="border-yellow-500 text-yellow-600">Cảnh báo</Badge>;
    default:
      return <Badge variant="secondary">Bình thường</Badge>;
  }
};

const getChurnRiskBadge = (risk: 'low' | 'medium' | 'high') => {
  switch (risk) {
    case 'high':
      return <Badge variant="destructive">Rủi ro cao</Badge>;
    case 'medium':
      return <Badge className="bg-orange-500 hover:bg-orange-600">Rủi ro TB</Badge>;
    default:
      return <Badge variant="secondary">Rủi ro thấp</Badge>;
  }
};

// ============================================
// FOLLOW-UP & RE-ENGAGEMENT COLUMNS
// ============================================

export function getSlaAlertColumns(): ColumnDef<CustomerSlaAlert>[] {
  return [
    {
      id: 'customer',
      header: 'Khách hàng',
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <Link 
            to={ROUTES.SALES.CUSTOMER_VIEW.replace(':systemId', row.customer.systemId)}
            className="font-medium text-primary hover:underline"
          >
            {row.customer.name}
          </Link>
          <div className="text-xs text-muted-foreground">{row.customer.id}</div>
        </div>
      ),
      meta: { displayName: 'Khách hàng' },
    },
    {
      id: 'contact',
      header: 'Liên hệ',
      cell: ({ row }) => (
        <div className="text-sm">
          <div>{row.customer.phone || '—'}</div>
          <div className="text-xs text-muted-foreground truncate max-w-[150px]">
            {row.customer.email || '—'}
          </div>
        </div>
      ),
      meta: { displayName: 'Liên hệ' },
    },
    {
      id: 'slaName',
      header: 'SLA',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-xs">
          {row.slaName}
        </Badge>
      ),
      meta: { displayName: 'SLA' },
    },
    {
      id: 'lastActivity',
      header: 'Hoạt động cuối',
      cell: ({ row }) => formatDate(row.lastActivityDate),
      meta: { displayName: 'Hoạt động cuối' },
    },
    {
      id: 'daysRemaining',
      header: 'Thời gian',
      cell: ({ row }) => (
        <span className={row.daysRemaining < 0 ? 'text-red-600 font-medium' : ''}>
          {formatDaysRemaining(row.daysRemaining)}
        </span>
      ),
      meta: { displayName: 'Thời gian' },
    },
    {
      id: 'alertLevel',
      header: 'Trạng thái',
      cell: ({ row }) => getAlertBadge(row.alertLevel),
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'assignee',
      header: 'Phụ trách',
      cell: ({ row }) => row.assignee || '—',
      meta: { displayName: 'Phụ trách' },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.customer.phone && (
              <DropdownMenuItem asChild>
                <a href={`tel:${row.customer.phone}`}>
                  Gọi điện
                </a>
              </DropdownMenuItem>
            )}
            {row.customer.email && (
              <DropdownMenuItem asChild>
                <a href={`mailto:${row.customer.email}`}>
                  Gửi email
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: { displayName: 'Thao tác' },
      size: 60,
    },
  ];
}

// ============================================
// DEBT ALERT COLUMNS
// ============================================

export function getDebtAlertColumns(): ColumnDef<DebtAlert>[] {
  return [
    {
      id: 'customer',
      header: 'Khách hàng',
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <Link 
            to={ROUTES.SALES.CUSTOMER_VIEW.replace(':systemId', row.customer.systemId)}
            className="font-medium text-primary hover:underline"
          >
            {row.customer.name}
          </Link>
          <div className="text-xs text-muted-foreground">{row.customer.id}</div>
        </div>
      ),
      meta: { displayName: 'Khách hàng' },
    },
    {
      id: 'contact',
      header: 'Liên hệ',
      cell: ({ row }) => (
        <div className="text-sm">
          <div>{row.customer.phone || '—'}</div>
        </div>
      ),
      meta: { displayName: 'Liên hệ' },
    },
    {
      id: 'totalDebt',
      header: 'Tổng nợ',
      cell: ({ row }) => (
        <span className="font-medium">{formatCurrency(row.totalDebt)}</span>
      ),
      meta: { displayName: 'Tổng nợ' },
    },
    {
      id: 'overdueAmount',
      header: 'Nợ quá hạn',
      cell: ({ row }) => (
        <span className={row.overdueAmount > 0 ? 'text-red-600 font-medium' : ''}>
          {formatCurrency(row.overdueAmount)}
        </span>
      ),
      meta: { displayName: 'Nợ quá hạn' },
    },
    {
      id: 'daysOverdue',
      header: 'Quá hạn',
      cell: ({ row }) => (
        row.daysOverdue > 0 ? (
          <Badge variant="destructive">{row.daysOverdue} ngày</Badge>
        ) : (
          <Badge variant="secondary">Chưa quá hạn</Badge>
        )
      ),
      meta: { displayName: 'Quá hạn' },
    },
    {
      id: 'debtStatus',
      header: 'Trạng thái',
      cell: ({ row }) => {
        const status = row.debtStatus;
        if (status.includes('Quá hạn')) {
          return <Badge variant="destructive">{status}</Badge>;
        }
        if (status === 'Sắp đến hạn' || status === 'Đến hạn hôm nay') {
          return <Badge className="bg-orange-500">{status}</Badge>;
        }
        return <Badge variant="outline">{status}</Badge>;
      },
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'oldestDueDate',
      header: 'Hạn sớm nhất',
      cell: ({ row }) => formatDate(row.oldestDueDate),
      meta: { displayName: 'Hạn sớm nhất' },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.customer.phone && (
              <DropdownMenuItem asChild>
                <a href={`tel:${row.customer.phone}`}>
                  Gọi điện
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: { displayName: 'Thao tác' },
      size: 60,
    },
  ];
}

// ============================================
// HEALTH ALERT COLUMNS
// ============================================

export function getHealthAlertColumns(): ColumnDef<CustomerHealthAlert>[] {
  return [
    {
      id: 'customer',
      header: 'Khách hàng',
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <Link 
            to={ROUTES.SALES.CUSTOMER_VIEW.replace(':systemId', row.customer.systemId)}
            className="font-medium text-primary hover:underline"
          >
            {row.customer.name}
          </Link>
          <div className="text-xs text-muted-foreground">{row.customer.id}</div>
        </div>
      ),
      meta: { displayName: 'Khách hàng' },
    },
    {
      id: 'segment',
      header: 'Phân khúc',
      cell: ({ row }) => (
        <Badge variant="outline">{row.segment || 'Chưa phân loại'}</Badge>
      ),
      meta: { displayName: 'Phân khúc' },
    },
    {
      id: 'healthScore',
      header: 'Điểm sức khỏe',
      cell: ({ row }) => {
        const score = row.healthScore;
        const colorClass = score >= 70 ? 'text-green-600' : score >= 40 ? 'text-yellow-600' : 'text-red-600';
        return <span className={`font-medium ${colorClass}`}>{score}/100</span>;
      },
      meta: { displayName: 'Điểm sức khỏe' },
    },
    {
      id: 'churnRisk',
      header: 'Rủi ro rời bỏ',
      cell: ({ row }) => getChurnRiskBadge(row.churnRisk),
      meta: { displayName: 'Rủi ro rời bỏ' },
    },
    {
      id: 'daysSinceLastPurchase',
      header: 'Không mua hàng',
      cell: ({ row }) => (
        <span className={row.daysSinceLastPurchase > 90 ? 'text-red-600' : ''}>
          {row.daysSinceLastPurchase} ngày
        </span>
      ),
      meta: { displayName: 'Không mua hàng' },
    },
    {
      id: 'totalOrders',
      header: 'Tổng đơn',
      cell: ({ row }) => row.totalOrders,
      meta: { displayName: 'Tổng đơn' },
    },
    {
      id: 'totalSpent',
      header: 'Tổng chi tiêu',
      cell: ({ row }) => formatCurrency(row.totalSpent),
      meta: { displayName: 'Tổng chi tiêu' },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.customer.phone && (
              <DropdownMenuItem asChild>
                <a href={`tel:${row.customer.phone}`}>
                  Gọi điện
                </a>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: { displayName: 'Thao tác' },
      size: 60,
    },
  ];
}
