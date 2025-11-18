import * as React from "react";
import { Card, CardContent } from "../../components/ui/card.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { TouchButton } from "../../components/mobile/touch-button.tsx";
import { Building2, Calendar, DollarSign, MoreHorizontal, Package, User, FileText } from "lucide-react";
import type { PurchaseReturn } from "./types.ts";
import { formatDate } from "../../lib/date-utils.ts";

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface PurchaseReturnCardProps {
  purchaseReturn: PurchaseReturn;
  onClick: (pr: PurchaseReturn) => void;
}

export function PurchaseReturnCard({ 
  purchaseReturn: pr, 
  onClick 
}: PurchaseReturnCardProps) {
  const totalItems = pr.items.reduce((sum, item) => sum + item.returnQuantity, 0);

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(pr)}
    >
      <CardContent className="p-4">
        {/* Header: Code + Menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="font-semibold text-sm font-mono">{pr.id}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TouchButton
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </TouchButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onClick(pr); 
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Xem chi tiết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* PO Reference */}
        {pr.purchaseOrderId && (
          <div className="text-xs text-muted-foreground mb-2">
            Đơn nhập: <span className="font-mono">{pr.purchaseOrderId}</span>
          </div>
        )}

        {/* Supplier + Branch */}
        <div className="text-sm font-medium mb-1">{pr.supplierName}</div>
        <div className="text-xs text-muted-foreground mb-3 flex items-center">
          <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span className="truncate">{pr.branchName}</span>
        </div>

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Date & Items Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span>Ngày trả: {formatDate(pr.returnDate)}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Package className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span>Số lượng: {totalItems} SP</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span>{pr.creatorName}</span>
          </div>
        </div>

        {/* Reason */}
        {pr.reason && (
          <div className="mb-3">
            <p className="text-xs text-muted-foreground line-clamp-2">
              Lý do: {pr.reason}
            </p>
          </div>
        )}

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Amount */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Giá trị trả:</span>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="font-semibold text-sm text-orange-600">{formatCurrency(pr.totalReturnValue)}</span>
          </div>
        </div>

        {/* Refund Amount */}
        {pr.refundAmount > 0 && (
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-muted-foreground">Hoàn tiền:</span>
            <span className="text-xs font-medium">{formatCurrency(pr.refundAmount)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
