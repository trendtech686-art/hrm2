import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Separator } from '../../../../components/ui/separator';
import { Badge } from '../../../../components/ui/badge';
import { Link } from '@/lib/next-compat';
import type { WarrantyProduct } from '../../types';
import type { WarrantySettlementState } from '../../hooks/use-warranty-settlement';
import { SETTLEMENT_STATUS_LABELS, SETTLEMENT_TYPE_LABELS } from '../../types';

interface WarrantySummaryCardProps {
  products: WarrantyProduct[];
  shippingFee: number;
  settlement: WarrantySettlementState;
}

/**
 * Card thanh toán cho trang chi tiết - Hiển thị tóm tắt thanh toán
 * Khác với WarrantySummary (dùng cho form), component này nhận props trực tiếp
 */
export const WarrantySummaryCard = React.memo(function WarrantySummaryCard({ 
  products, 
  shippingFee, 
  settlement,
}: WarrantySummaryCardProps) {
  const currencyFormatter = React.useMemo(() => new Intl.NumberFormat('vi-VN'), []);
  const {
    totalPayment: settlementTotal,
    remainingAmount,
    processingState,
    settlementSnapshot,
    settlementMethods,
    snapshotSettledAmount,
    snapshotRemainingAmount,
  } = settlement;

  const summary = React.useMemo(() => {
    const totalQuantity = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.unitPrice || 0)), 0);
    
    // Group by resolution
    const byResolution = {
      return: { qty: 0, value: 0 },
      replace: { qty: 0, value: 0 },
      deduct: { qty: 0, value: 0, deduction: 0 },
      out_of_stock: { qty: 0, value: 0 }
    };
    
    products.forEach((p) => {
      const qty = p.quantity || 0;
      const value = qty * (p.unitPrice || 0);
      const resolution = p.resolution;
      
      if (byResolution[resolution as keyof typeof byResolution]) {
        byResolution[resolution as keyof typeof byResolution].qty += qty;
        byResolution[resolution as keyof typeof byResolution].value += value;
        if (resolution === 'deduct') {
          byResolution.deduct.deduction += p.deductionAmount || 0;
        }
      }
    });

    return {
      totalQuantity,
      totalValue,
      returnedQty: byResolution.return.qty,
      returnedValue: byResolution.return.value,
      replacedQty: byResolution.replace.qty,
      replacedValue: byResolution.replace.value,
      deductedQty: byResolution.deduct.qty,
      outOfStockQty: byResolution.out_of_stock.qty,
      totalDeduction: byResolution.deduct.deduction,
      outOfStockValue: byResolution.out_of_stock.value,
    };
  }, [products, shippingFee]);

  const settlementTotalForDisplay = settlementSnapshot?.totalAmount ?? settlementTotal;
  const totalSettlementAbsolute = Math.abs(settlementTotalForDisplay);
  const settlementDirection = settlementTotalForDisplay > 0
    ? 'refund'
    : settlementTotalForDisplay < 0
      ? 'collect'
      : 'neutral';
  const settlementIsRefund = settlementDirection === 'refund';
  const settlementIsCollect = settlementDirection === 'collect';
  const resolvedAmount = settlementSnapshot
    ? snapshotSettledAmount
    : settlementIsRefund
      ? processingState.warrantyPayments.reduce((sum, payment) =>
          payment.status !== 'cancelled' ? sum + payment.amount : sum,
        0)
      : processingState.warrantyReceipts.reduce((sum, receipt) =>
          receipt.status !== 'cancelled' ? sum + receipt.amount : sum,
        0);

  const remainingLabel = settlementIsRefund ? 'Còn phải trả' : 'Còn phải thu';
  const resolvedLabel = settlementIsRefund ? 'Đã trả' : 'Đã thu';
  const totalLabel = settlementIsRefund
    ? 'Cần chi cho khách'
    : settlementIsCollect
      ? 'Cần thu thêm'
      : 'Không phát sinh thanh toán';
  const totalClass = settlementIsRefund
    ? 'text-body-md font-bold text-red-600'
    : settlementIsCollect
      ? 'text-body-md font-bold text-emerald-600'
      : 'text-body-md font-bold';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h4">Thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {/* Tổng giá trị bảo hành */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted-foreground">Tổng giá trị bảo hành</span>
          <span className="font-bold text-body-md">
            {currencyFormatter.format(summary.totalValue)} đ
          </span>
        </div>

        <Separator />

        {/* Tổng giá trị trả lại */}
        {summary.returnedQty > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-muted-foreground">Tổng giá trị trả lại</span>
              <span className="font-semibold">
                {currencyFormatter.format(summary.returnedValue)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng giá trị đổi mới */}
        {summary.replacedQty > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-muted-foreground">Tổng giá trị đổi mới</span>
              <span className="font-semibold">
                {currencyFormatter.format(summary.replacedValue)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng hàng trừ */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted-foreground">Tổng hàng trừ</span>
          <span className="font-semibold">
            {currencyFormatter.format(summary.outOfStockValue)} đ
          </span>
        </div>

        <Separator />

        {/* Phí ship gửi về */}
        {shippingFee > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-muted-foreground">Phí ship gửi về</span>
              <span className="font-semibold">
                {currencyFormatter.format(shippingFee)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng cần bù trừ */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm font-semibold">{totalLabel}</span>
          <span className={totalClass}>
            {currencyFormatter.format(totalSettlementAbsolute)} đ
          </span>
        </div>

        {totalSettlementAbsolute > 0 && (
          <div className="space-y-1.5 text-body-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{resolvedLabel}</span>
              <span className="font-semibold">
                {currencyFormatter.format(resolvedAmount)} đ
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{remainingLabel}</span>
              <span className="font-semibold">
                {currencyFormatter.format(
                  settlementSnapshot ? snapshotRemainingAmount : Math.max(remainingAmount, 0),
                )} đ
              </span>
            </div>
          </div>
        )}

        <Separator />

        {settlementMethods.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-body-sm font-semibold">Phương thức bù trừ</span>
            <div className="space-y-2">
              {settlementMethods.map(method => {
                const typeLabel = SETTLEMENT_TYPE_LABELS[method.type];
                const statusLabel = SETTLEMENT_STATUS_LABELS[method.status];
                const statusVariant = method.status === 'completed'
                  ? 'default'
                  : method.status === 'partial'
                    ? 'outline'
                    : 'secondary';

                return (
                  <div
                    key={method.systemId}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-body-xs">
                          {typeLabel}
                        </Badge>
                        <Badge variant={statusVariant} className="text-body-xs">
                          {statusLabel}
                        </Badge>
                      </div>
                      <span className={`text-body-sm font-semibold ${settlementIsRefund ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {currencyFormatter.format(method.amount)} đ
                      </span>
                    </div>

                    {method.notes && (
                      <p className="mt-1 text-body-xs text-muted-foreground">
                        {method.notes}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-3 text-body-xs text-muted-foreground">
                      {method.paymentVoucherId && (
                        <Link
                          to={`/payments/${method.paymentVoucherId}`}
                          className="text-primary hover:underline"
                        >
                          Xem phiếu chi
                        </Link>
                      )}
                      {method.linkedOrderSystemId && (
                        <Link
                          to={`/orders/${method.linkedOrderSystemId}`}
                          className="text-primary hover:underline"
                        >
                          Xem đơn hàng
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <Separator />
          </div>
        )}

        {/* Tổng số lượng */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted-foreground">Tổng số lượng</span>
          <span className="font-semibold">{summary.totalQuantity}</span>
        </div>

        {/* Số lượng đổi mới */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-body-xs text-muted-foreground">↳ Đổi mới</span>
          <span className="text-body-xs">{summary.replacedQty}</span>
        </div>

        {/* Số lượng trả lại */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-body-xs text-muted-foreground">↳ Trả lại</span>
          <span className="text-body-xs">{summary.returnedQty}</span>
        </div>

        {/* Số lượng hết hàng */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-body-xs text-muted-foreground">↳ Hết hàng</span>
          <span className="text-body-xs">{summary.outOfStockQty}</span>
        </div>
      </CardContent>
    </Card>
  );
});
