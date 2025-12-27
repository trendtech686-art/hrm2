/**
 * Mobile Card for Payroll Batch
 * Hiển thị thông tin batch ở mobile view
 */

'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, Wallet, MoreHorizontal, Eye, Lock, Unlock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
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
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        {/* Header: Title + Code + Menu */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-body-medium truncate">{batch.title}</h3>
            </div>
            <span className="text-body-xs text-muted-foreground font-mono">{batch.id}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
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

        {/* Reference Month */}
        <div className="text-body-xs text-muted-foreground mb-3 flex items-center">
          <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span>{formatMonthKey(batch.referenceAttendanceMonthKeys[0])}</span>
        </div>

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Info rows */}
        <div className="space-y-2">
          {/* Ngày trả & Số NV */}
          <div className="flex items-center justify-between text-body-xs">
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1.5" />
              <span>Ngày trả: {formatDate(batch.payrollDate)}</span>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="h-3 w-3 mr-1.5" />
              <span>{batch.payslipSystemIds?.length ?? 0} NV</span>
            </div>
          </div>

          {/* Tổng thực lĩnh & Status */}
          <div className="flex items-center justify-between text-body-xs pt-1">
            <div className="flex items-center font-semibold text-primary">
              <Wallet className="h-3 w-3 mr-1.5" />
              <span>{formatCurrency(batch.totalNet)}</span>
            </div>
            <Badge variant={getStatusVariant(batch.status)} className="text-body-xs">
              {getStatusLabel(batch.status)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
