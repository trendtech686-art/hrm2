'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { CostAdjustment } from '@/lib/types/prisma-extended';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { TrendingUp, TrendingDown, MoreHorizontal, Eye, CheckCircle, XCircle, Printer } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { MobileCard, MobileCardBody, MobileCardHeader } from '../../components/mobile/mobile-card';
import { cn } from '@/lib/utils';

const getStatusVariant = (status: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'draft': return 'secondary';
    case 'confirmed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'draft': return 'Nháp';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

interface CostAdjustmentCardProps {
  adjustment: CostAdjustment;
  onConfirm?: (systemId: string) => void;
  onCancel?: (systemId: string) => void;
}

export function CostAdjustmentCard({ adjustment, onConfirm, onCancel }: CostAdjustmentCardProps) {
  const router = useRouter();
  const isDraft = adjustment.status === 'draft';
  
  // Calculate totals
  const totalOldValue = adjustment.items?.reduce((sum, item) => sum + item.oldCostPrice, 0) || 0;
  const totalNewValue = adjustment.items?.reduce((sum, item) => sum + item.newCostPrice, 0) || 0;
  const totalDifference = totalNewValue - totalOldValue;
  const isPositive = totalDifference > 0;
  const isNegative = totalDifference < 0;

  const diffSign = isPositive ? '+' : '';
  return (
    <MobileCard onClick={() => router.push(`/cost-adjustments/${adjustment.systemId}`)}>
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Điều chỉnh giá vốn</div>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="text-sm font-semibold text-foreground truncate font-mono">{adjustment.id}</div>
            <Badge variant={getStatusVariant(adjustment.status)} className="text-xs shrink-0">
              {getStatusLabel(adjustment.status)}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-1 shrink-0">
          <div className="text-right">
            <div className={cn(
              'text-lg font-bold leading-none flex items-center gap-1 justify-end',
              isPositive && 'text-emerald-600',
              isNegative && 'text-destructive',
            )}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : isNegative ? <TrendingDown className="h-4 w-4" /> : null}
              {diffSign}{formatCurrency(totalDifference)}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Chênh lệch</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2 -mt-1" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/cost-adjustments/${adjustment.systemId}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {isDraft && (
                <>
                  <DropdownMenuItem onClick={() => onConfirm?.(adjustment.systemId)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Xác nhận
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onCancel?.(adjustment.systemId)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy phiếu
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem onClick={() => router.push(`/cost-adjustments/${adjustment.systemId}`)}>
                <Printer className="mr-2 h-4 w-4" />
                In phiếu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Giá vốn cũ</dt>
            <dd className="font-medium">{formatCurrency(totalOldValue)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Giá vốn mới</dt>
            <dd className="font-medium">{formatCurrency(totalNewValue)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Số sản phẩm</dt>
            <dd className="font-medium">{adjustment.items?.length || 0}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngày tạo</dt>
            <dd className="font-medium">{formatDate(adjustment.createdDate)}</dd>
          </div>
          {adjustment.createdByName && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Người tạo</dt>
              <dd className="font-medium truncate">{adjustment.createdByName}</dd>
            </div>
          )}
          {adjustment.referenceCode && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Mã tham chiếu</dt>
              <dd className="font-medium truncate font-mono">{adjustment.referenceCode}</dd>
            </div>
          )}
          {adjustment.reason && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Lý do</dt>
              <dd className="font-medium line-clamp-2">{adjustment.reason}</dd>
            </div>
          )}
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}
