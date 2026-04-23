'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/date-utils';
import type { Penalty, PenaltyStatus } from './types';
import { Badge } from '../../../components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Button } from '../../../components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  MobileCard,
  MobileCardBody,
  MobileCardHeader,
} from '../../../components/mobile/mobile-card';

interface PenaltyCardProps {
  penalty: Penalty;
  onDelete?: (id: string) => void;
}

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const statusVariants: Record<PenaltyStatus, 'warning' | 'success' | 'secondary'> = {
  'Chưa thanh toán': 'warning',
  'Đã thanh toán': 'success',
  'Đã hủy': 'secondary',
};

export function PenaltyCard({ penalty, onDelete }: PenaltyCardProps) {
  const router = useRouter();

  return (
    <MobileCard onClick={() => router.push(`/penalties/${penalty.systemId}`)}>
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Phiếu phạt</div>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="text-sm font-semibold text-foreground truncate font-mono">{penalty.id}</div>
            <Badge variant={statusVariants[penalty.status]} className="text-xs shrink-0">
              {penalty.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-1 shrink-0">
          <div className="text-right">
            <div className="text-lg font-bold leading-none text-destructive">{formatCurrency(penalty.amount)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Số tiền phạt</div>
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
                  router.push(`/penalties/${penalty.systemId}`);
                }}
              >
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/penalties/${penalty.systemId}/edit`);
                }}
              >
                Chỉnh sửa
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(penalty.systemId);
                  }}
                >
                  Xóa
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Nhân viên</dt>
            <dd className="font-medium truncate">{penalty.employeeName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngày lập</dt>
            <dd className="font-medium">{formatDate(penalty.issueDate)}</dd>
          </div>
          {penalty.issuerName && (
            <div>
              <dt className="text-xs text-muted-foreground">Người lập</dt>
              <dd className="font-medium truncate">{penalty.issuerName}</dd>
            </div>
          )}
          {penalty.reason && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Lý do</dt>
              <dd className="font-medium line-clamp-2">{penalty.reason}</dd>
            </div>
          )}
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}
