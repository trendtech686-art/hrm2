/**
 * Mobile Card for Payroll Batch
 * Hiển thị thông tin batch ở mobile view
 */

'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { MoreHorizontal, Eye, Lock, Unlock, Trash2 } from 'lucide-react';

import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { MobileCard, MobileCardBody, MobileCardHeader } from '../../../components/mobile/mobile-card';
import type { PayrollBatch } from '../../../lib/payroll-types';
import { ROUTES } from '../../../lib/router';
import { formatDateForDisplay } from '@/lib/date-utils';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) =>
  typeof value === 'number' ? currencyFormatter.format(value) : '—';

const formatMonthKey = (monthKey: string) => {
  if (!monthKey) return '—';
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  return formatDateForDisplay(value);
};

const getStatusVariant = (status: PayrollBatch['status']): 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'locked':
      return 'default';
    case 'reviewed':
      return 'secondary';
    case 'draft':
    default:
      return 'outline';
  }
};

const getStatusLabel = (status: PayrollBatch['status']): string => {
  switch (status) {
    case 'locked':
      return 'Đã khóa';
    case 'reviewed':
      return 'Đã duyệt';
    case 'draft':
    default:
      return 'Nháp';
  }
};

type BatchCardActions = {
  onLock?: (systemId: string) => void;
  onUnlock?: (systemId: string) => void;
  onCancel?: (systemId: string) => void;
};

interface BatchCardProps {
  batch: PayrollBatch;
  actions?: BatchCardActions;
}

export function BatchCard({ batch, actions }: BatchCardProps) {
  const router = useRouter();
  const isLocked = batch.status === 'locked';

  const handleClick = () => {
    router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', batch.systemId));
  };

  return (
    <MobileCard onClick={handleClick}>
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Bảng lương</div>
          <div className="mt-0.5 text-sm font-semibold text-foreground truncate">{batch.title}</div>
          <div className="text-xs text-muted-foreground font-mono truncate">{batch.id}</div>
        </div>
        <div className="flex items-start gap-1 shrink-0">
          <div className="text-right">
            <div className="text-lg font-bold leading-none text-primary">{formatCurrency(batch.totalNet)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Tổng thực lĩnh</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 -mr-2 -mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isLocked && actions?.onLock && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onLock?.(batch.systemId);
                  }}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Khóa bảng lương
                </DropdownMenuItem>
              )}
              {isLocked && actions?.onUnlock && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    actions.onUnlock?.(batch.systemId);
                  }}
                >
                  <Unlock className="mr-2 h-4 w-4" />
                  Mở khóa
                </DropdownMenuItem>
              )}
              {!isLocked && actions?.onCancel && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      actions.onCancel?.(batch.systemId);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Hủy bảng lương
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Tháng áp dụng</dt>
            <dd className="font-medium">{formatMonthKey(batch.referenceAttendanceMonthKeys[0])}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngày trả</dt>
            <dd className="font-medium">{formatDate(batch.payrollDate)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Số nhân viên</dt>
            <dd className="font-medium">{batch.payslipSystemIds?.length ?? 0}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Trạng thái</dt>
            <dd>
              <Badge variant={getStatusVariant(batch.status)} className="text-xs">
                {getStatusLabel(batch.status)}
              </Badge>
            </dd>
          </div>
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}
