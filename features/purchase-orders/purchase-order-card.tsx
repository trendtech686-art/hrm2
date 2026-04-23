import * as React from "react";
import { Badge } from "../../components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { TouchButton } from "../../components/mobile/touch-button";
import { MobileCard, MobileCardBody, MobileCardHeader } from "../../components/mobile/mobile-card";
import { MoreHorizontal, Printer, XCircle, CreditCard, PackageCheck } from "lucide-react";
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
    <MobileCard onClick={() => onClick(po)}>
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Đơn mua hàng</div>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="text-sm font-semibold text-foreground truncate font-mono">{po.id}</div>
            <Badge variant={getStatusVariant(po.status)} className="text-xs shrink-0">
              {po.status}
            </Badge>
          </div>
        </div>
        <div className="flex items-start gap-1 shrink-0">
          <div className="text-right">
            <div className="text-lg font-bold leading-none text-primary">{formatCurrency(po.grandTotal)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Tổng tiền</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <TouchButton
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 -mr-2 -mt-1"
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
      </MobileCardHeader>

      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Nhà cung cấp</dt>
            <dd className="font-medium truncate">{po.supplierName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Chi nhánh</dt>
            <dd className="font-medium truncate">{po.branchName}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Ngày đặt</dt>
            <dd className="font-medium">{formatDate(po.orderDate)}</dd>
          </div>
          {po.deliveryDate && (
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Dự kiến nhận</dt>
              <dd className="font-medium">{formatDate(po.deliveryDate)}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs text-muted-foreground">Giao hàng</dt>
            <dd>
              <Badge variant={getDeliveryStatusVariant(po.deliveryStatus)} className="text-xs">
                {po.deliveryStatus}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Thanh toán</dt>
            <dd>
              <Badge variant={getPaymentStatusVariant(po.paymentStatus)} className="text-xs">
                {po.paymentStatus}
              </Badge>
            </dd>
          </div>
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}
