'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { StockTransfer } from '@/lib/types/prisma-extended';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, MoreHorizontal, Eye, Edit, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';

const getStatusVariant = (status: string): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'transferring': return 'default';
    case 'completed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Chờ chuyển';
    case 'transferring': return 'Đang chuyển';
    case 'completed': return 'Hoàn thành';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

interface StockTransferCardProps {
  transfer: StockTransfer;
  onDelete?: (systemId: string) => void;
}

export function StockTransferCard({ transfer, onDelete }: StockTransferCardProps) {
  const router = useRouter();
  const isPending = transfer.status === 'pending';
  const totalQuantity = transfer.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <MobileCard onClick={() => router.push(`/stock-transfers/${transfer.systemId}`)}>
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Chuyển kho</div>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="text-sm font-semibold text-foreground truncate font-mono">{transfer.id}</div>
            <Badge variant={getStatusVariant(transfer.status)} className="text-xs shrink-0">
              {getStatusLabel(transfer.status)}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-1 shrink-0">
          <div className="text-right">
            <div className="text-2xl font-bold leading-none">{totalQuantity}</div>
            <div className="mt-1 text-xs text-muted-foreground">Tổng SL</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 -mr-2 -mt-1" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/stock-transfers/${transfer.systemId}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {isPending && (
                <>
                  <DropdownMenuItem onClick={() => router.push(`/stock-transfers/${transfer.systemId}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => onDelete?.(transfer.systemId)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy phiếu
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Tuyến</dt>
            <dd className="font-medium flex items-center gap-1.5">
              <span className="truncate">{transfer.fromBranchName}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{transfer.toBranchName}</span>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Số sản phẩm</dt>
            <dd className="font-medium">{transfer.items?.length || 0}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngày tạo</dt>
            <dd className="font-medium">{formatDate(transfer.createdDate)}</dd>
          </div>
          {transfer.createdByName && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Người tạo</dt>
              <dd className="font-medium truncate">{transfer.createdByName}</dd>
            </div>
          )}
          {transfer.referenceCode && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Mã tham chiếu</dt>
              <dd className="font-medium truncate font-mono">{transfer.referenceCode}</dd>
            </div>
          )}
          {transfer.note && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Ghi chú</dt>
              <dd className="font-medium line-clamp-2">{transfer.note}</dd>
            </div>
          )}
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}
