'use client'

import * as React from 'react';
import { PackageX, Building2, User, FileText } from 'lucide-react';
import { formatDateCustom, parseDate } from '../../../lib/date-utils';
import { Card, CardContent } from '../../../components/ui/card';
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
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onClick(purchaseReturn)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-body-sm">
              <PackageX className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <h3 className="text-body-sm font-semibold">{purchaseReturn.id}</h3>
                <p className="text-body-xs text-muted-foreground">
                  {formatDateCustom(parseDate(purchaseReturn.returnDate)!, 'dd/MM/yyyy')}
                </p>
              </div>
            </div>

            <div className="space-y-1.5 mt-2">
              <div className="flex items-center text-body-xs text-muted-foreground">
                <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{purchaseReturn.supplierName}</span>
              </div>
              <div className="flex items-center text-body-xs text-muted-foreground">
                <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{purchaseReturn.branchName}</span>
              </div>
              <div className="flex items-center text-body-xs text-muted-foreground">
                <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">ĐH: {purchaseReturn.purchaseOrderId}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <div className="text-body-xs">
                <span className="text-muted-foreground">SL: </span>
                <span className="font-semibold">{totalQty}</span>
              </div>
              <div className="text-body-xs">
                <span className="text-orange-600 font-semibold">
                  {formatCurrency(purchaseReturn.totalReturnValue)}
                </span>
              </div>
              {purchaseReturn.refundAmount > 0 && (
                <div className="text-body-xs">
                  <span className="text-green-600 font-semibold">
                    Hoàn: {formatCurrency(purchaseReturn.refundAmount)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
