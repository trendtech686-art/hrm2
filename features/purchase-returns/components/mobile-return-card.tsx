'use client'

import * as React from 'react';
import { PackageX } from 'lucide-react';
import { formatDateCustom, parseDate } from '../../../lib/date-utils';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import {
  MobileCard,
  MobileCardBody,
  MobileCardHeader,
} from '../../../components/mobile/mobile-card';
import type { PurchaseReturn } from '@/lib/types/prisma-extended';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface MobileReturnCardProps {
  purchaseReturn: PurchaseReturn;
  onClick: (purchaseReturn: PurchaseReturn) => void;
}

export function MobileReturnCard({ purchaseReturn, onClick }: MobileReturnCardProps) {
  const totalQty = purchaseReturn.items.reduce((sum, item) => sum + item.returnQuantity, 0);

  return (
    <MobileCard onClick={() => onClick(purchaseReturn)}>
      <MobileCardHeader className="items-start justify-between">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-orange-100 text-orange-600">
              <PackageX className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Phiếu trả NCC</div>
            <div className="mt-0.5 text-sm font-semibold text-foreground truncate font-mono">
              {purchaseReturn.id}
            </div>
            <div className="text-xs text-muted-foreground">
              {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold leading-none text-orange-600">
            {formatCurrency(purchaseReturn.totalReturnValue)}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Giá trị trả</div>
        </div>
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Nhà cung cấp</dt>
            <dd className="font-medium truncate">{purchaseReturn.supplierName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Chi nhánh</dt>
            <dd className="font-medium truncate">{purchaseReturn.branchName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Số lượng SP</dt>
            <dd className="font-medium">{totalQty}</dd>
          </div>
          {purchaseReturn.purchaseOrderId && (
            <div>
              <dt className="text-xs text-muted-foreground">Đơn mua hàng</dt>
              <dd className="font-medium truncate font-mono">{purchaseReturn.purchaseOrderId}</dd>
            </div>
          )}
          {purchaseReturn.refundAmount > 0 && (
            <div>
              <dt className="text-xs text-muted-foreground">Đã hoàn</dt>
              <dd className="font-medium text-green-600">{formatCurrency(purchaseReturn.refundAmount)}</dd>
            </div>
          )}
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}
