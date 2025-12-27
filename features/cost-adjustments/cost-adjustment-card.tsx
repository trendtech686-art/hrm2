'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { CostAdjustment } from '@/lib/types/prisma-extended';
import { Card, CardContent, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { TrendingUp, TrendingDown, Package, Calendar, User, MoreHorizontal, Eye, CheckCircle, XCircle, Printer } from 'lucide-react';
import { formatDate } from '@/lib/date-utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';

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

  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="font-semibold text-sm text-primary">{adjustment.id}</CardTitle>
              <Badge variant={getStatusVariant(adjustment.status)}>
                {getStatusLabel(adjustment.status)}
              </Badge>
            </div>
            {adjustment.referenceCode && (
              <p className="text-xs text-muted-foreground">
                Mã tham chiếu: {adjustment.referenceCode}
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

        {/* Price Change Summary */}
        <div className="flex items-center gap-2 mb-3 p-2 bg-muted/50 rounded-md">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Giá vốn cũ</p>
            <p className="font-medium text-sm">{formatCurrency(totalOldValue)}</p>
          </div>
          <div className="flex items-center">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            ) : isNegative ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : null}
          </div>
          <div className="flex-1 text-right">
            <p className="text-xs text-muted-foreground">Giá vốn mới</p>
            <p className="font-medium text-sm">{formatCurrency(totalNewValue)}</p>
          </div>
        </div>

        {/* Difference */}
        <div className={`text-center p-2 rounded-md mb-3 ${
          isPositive ? 'bg-emerald-500/10 text-emerald-600' : 
          isNegative ? 'bg-destructive/10 text-destructive' : 
          'bg-gray-50 text-gray-700'
        }`}>
          <span className="text-sm font-medium">
            Chênh lệch: {isPositive ? '+' : ''}{formatCurrency(totalDifference)}
          </span>
        </div>

        {/* Info Row */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Package className="h-3.5 w-3.5" />
            <span>{adjustment.items?.length || 0} sản phẩm</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(adjustment.createdDate)}</span>
          </div>
        </div>

        {/* Creator */}
        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          <span>{adjustment.createdByName}</span>
        </div>

        {/* Reason */}
        {adjustment.reason && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
            Lý do: {adjustment.reason}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
