/**
 * Payroll Batch Mobile Card
 * Hiển thị thông tin batch trên mobile
 */

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Wallet, MoreHorizontal, Eye, Lock, Unlock, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { TouchButton } from '../../../components/mobile/touch-button.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu.tsx';
import { PayrollStatusBadge } from './status-badge.tsx';
import { ROUTES } from '../../../lib/router.ts';
import type { PayrollBatch } from '../../../lib/payroll-types.ts';
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

type BatchMobileCardProps = {
  batch: PayrollBatch;
  onDelete?: (systemId: string) => void;
  onLock?: (systemId: string) => void;
  onUnlock?: (systemId: string) => void;
};

export function BatchMobileCard({ batch, onDelete, onLock, onUnlock }: BatchMobileCardProps) {
  const navigate = useNavigate();
  const isLocked = batch.status === 'locked';

  const handleCardClick = () => {
    navigate(ROUTES.PAYROLL.DETAIL.replace(':systemId', batch.systemId));
  };

  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Header: ID + Status + Actions */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-body-xs text-muted-foreground">{batch.id}</p>
            <p className="font-medium text-body-sm truncate">{batch.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <PayrollStatusBadge status={batch.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {!isLocked && onLock && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onLock(batch.systemId);
                    }}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Khóa bảng lương
                  </DropdownMenuItem>
                )}
                {isLocked && onUnlock && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlock(batch.systemId);
                    }}
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    Mở khóa
                  </DropdownMenuItem>
                )}
                {!isLocked && onDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(batch.systemId);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Info rows */}
        <div className="space-y-2 text-body-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatMonthKey(batch.referenceAttendanceMonthKeys[0])}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Trả: {formatDate(batch.payrollDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{batch.payslipSystemIds?.length ?? 0} nhân viên</span>
          </div>
        </div>

        {/* Financial summary */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span className="text-body-xs">Thực lĩnh:</span>
          </div>
          <span className="font-semibold text-primary">
            {formatCurrency(batch.totalNet)}
          </span>
        </div>

        {/* Quick actions */}
        <div className="mt-3 flex gap-2">
          <TouchButton
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-body-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            <Eye className="h-3 w-3 mr-1.5" />
            Chi tiết
          </TouchButton>
        </div>
      </CardContent>
    </Card>
  );
}
