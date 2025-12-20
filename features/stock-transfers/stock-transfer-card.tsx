'use client'

import * as React from 'react';
import { useNavigate } from '@/lib/next-compat';
import type { StockTransfer } from './types';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Truck, ArrowRight, Package, Calendar, User, MoreHorizontal, Eye, Edit, XCircle } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

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
  const navigate = useNavigate();
  const isPending = transfer.status === 'pending';
  const totalQuantity = transfer.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-primary">{transfer.id}</span>
              <Badge variant={getStatusVariant(transfer.status)}>
                {getStatusLabel(transfer.status)}
              </Badge>
            </div>
            {transfer.referenceCode && (
              <p className="text-body-xs text-muted-foreground">
                Mã tham chiếu: {transfer.referenceCode}
              </p>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate(`/stock-transfers/${transfer.systemId}`)}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
              {isPending && (
                <>
                  <DropdownMenuItem onClick={() => navigate(`/stock-transfers/${transfer.systemId}/edit`)}>
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

        {/* Branch Transfer Info */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-md">
          <div className="flex-1 text-center">
            <p className="text-body-xs text-muted-foreground">Từ</p>
            <p className="font-medium text-body-sm">{transfer.fromBranchName}</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <div className="flex-1 text-center">
            <p className="text-body-xs text-muted-foreground">Đến</p>
            <p className="font-medium text-body-sm">{transfer.toBranchName}</p>
          </div>
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-3 gap-2 text-body-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            <span>{transfer.items?.length || 0} SP</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>{totalQuantity} SL</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(transfer.createdDate)}</span>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-1 mt-2 text-body-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{transfer.createdByName}</span>
        </div>

        {/* Note */}
        {transfer.note && (
          <p className="mt-2 text-body-xs text-muted-foreground line-clamp-2">
            {transfer.note}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
