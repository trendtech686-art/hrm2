'use client'

import * as React from 'react';
import { PackageX, Building2, User, FileText } from 'lucide-react';
import { formatDateCustom, parseDate } from '../../../lib/date-utils';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
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
    <div 
      className="rounded-xl border border-border/50 bg-card p-4 active:scale-[0.98] transition-transform touch-manipulation cursor-pointer"
      onClick={() => onClick(purchaseReturn)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-orange-100 text-orange-600">
            <PackageX className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold">{purchaseReturn.id}</h3>
          <p className="text-xs text-muted-foreground">
            {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
          </p>

          <div className="space-y-1 mt-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{purchaseReturn.supplierName}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">{purchaseReturn.branchName}</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <FileText className="h-3 w-3 mr-1.5 shrink-0" />
              <span className="truncate">ĐH: {purchaseReturn.purchaseOrderId}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
            <div className="text-xs">
              <span className="text-muted-foreground">SL: </span>
              <span className="font-semibold">{totalQty}</span>
            </div>
            <div className="text-xs">
              <span className="text-orange-600 font-semibold">
                {formatCurrency(purchaseReturn.totalReturnValue)}
              </span>
            </div>
            {purchaseReturn.refundAmount > 0 && (
              <div className="text-xs">
                <span className="text-green-600 font-semibold">
                  Hoàn: {formatCurrency(purchaseReturn.refundAmount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
