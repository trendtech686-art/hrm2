import * as React from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { TouchButton } from "../../components/mobile/touch-button";
import { Building2, Calendar, DollarSign, MoreHorizontal, Package, Printer, XCircle, CreditCard, PackageCheck } from "lucide-react";
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { formatDate } from "../../lib/date-utils";

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface PurchaseOrderCardProps {
  purchaseOrder: PurchaseOrder;
  onCancel: (po: PurchaseOrder) => void;
  onPrint: (po: PurchaseOrder) => void;
  onPayment: (po: PurchaseOrder) => void;
  onReceiveGoods: (po: PurchaseOrder) => void;
  onClick: (po: PurchaseOrder) => void;
}

export function PurchaseOrderCard({ 
  purchaseOrder: po, 
  onCancel, 
  onPrint, 
  onPayment, 
  onReceiveGoods,
  onClick 
}: PurchaseOrderCardProps) {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Đặt hàng': 'secondary',
      'Đang giao dịch': 'default',
      'Hoàn thành': 'default',
      'Đã hủy': 'destructive',
      'Kết thúc': 'outline'
    };
    return map[status] || 'default';
  };

  const getDeliveryStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Chưa nhập': 'secondary',
      'Nhập một phần': 'default',
      'Đã nhập': 'default'
    };
    return map[status] || 'default';
  };

  const getPaymentStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      'Chưa thanh toán': 'secondary',
      'Thanh toán một phần': 'default',
      'Đã thanh toán': 'default'
    };
    return map[status] || 'default';
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(po)}
    >
      <CardContent className="p-4">
        {/* Header: Code + Status + Menu */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-body-sm font-medium font-mono">{po.id}</span>
              <Badge variant={getStatusVariant(po.status)} className="text-body-xs">
                {po.status}
              </Badge>
            </div>
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
                  onPrint(po); 
                }}
              >
                <Printer className="mr-2 h-4 w-4" />
                In đơn hàng
              </DropdownMenuItem>
              {po.status !== 'Đã hủy' && po.status !== 'Kết thúc' && (
                <>
                  {po.paymentStatus !== 'Đã thanh toán' && (
                    <DropdownMenuItem 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onPayment(po); 
                      }}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Thanh toán
                    </DropdownMenuItem>
                  )}
                  {po.deliveryStatus !== 'Đã nhập' && (
                    <DropdownMenuItem 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        onReceiveGoods(po); 
                      }}
                    >
                      <PackageCheck className="mr-2 h-4 w-4" />
                      Nhập hàng
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      onCancel(po); 
                    }}
                    className="text-destructive"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Hủy đơn
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Supplier + Branch */}
        <div className="text-body-sm font-medium mb-1">{po.supplierName}</div>
        <div className="text-body-xs text-muted-foreground mb-3 flex items-center">
          <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span className="truncate">{po.branchName}</span>
        </div>

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Date Info */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center text-body-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span>Đặt hàng: {formatDate(po.orderDate)}</span>
          </div>
          {po.deliveryDate && (
            <div className="flex items-center text-body-xs text-muted-foreground">
              <Package className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span>Dự kiến: {formatDate(po.deliveryDate)}</span>
            </div>
          )}
        </div>

        {/* Delivery & Payment Status */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <Badge variant={getDeliveryStatusVariant(po.deliveryStatus)} className="text-body-xs">
            {po.deliveryStatus}
          </Badge>
          <Badge variant={getPaymentStatusVariant(po.paymentStatus)} className="text-body-xs">
            {po.paymentStatus}
          </Badge>
        </div>

        {/* Divider */}
        <div className="border-t mb-3" />

        {/* Amount */}
        <div className="flex items-center justify-between">
          <span className="text-body-xs text-muted-foreground">Tổng tiền:</span>
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <span className="text-body-sm font-semibold">{formatCurrency(po.grandTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
