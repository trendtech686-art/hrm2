import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Separator } from '../../../components/ui/separator.tsx';
import type { WarrantyProduct } from '../types.ts';

interface WarrantySummaryDetailProps {
  products: WarrantyProduct[];
  shippingFee: number;
  ticketStatus?: string;
  warrantyId: string;
  warrantySystemId: string;
  customer: {
    name: string;
    phone: string;
  };
}

/**
 * Card thanh toán cho trang chi tiết - Hiển thị tóm tắt thanh toán
 * Khác với WarrantySummary (dùng cho form), component này nhận props trực tiếp
 */
export const WarrantySummaryDetail = React.memo(function WarrantySummaryDetail({ 
  products, 
  shippingFee, 
  ticketStatus, 
  warrantyId,
  warrantySystemId,
  customer,
}: WarrantySummaryDetailProps) {
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

    // Tổng thanh toán = Hàng hết + Phí ship
    const totalPayment = byResolution.out_of_stock.value + (shippingFee || 0);
    
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
      totalPayment,
    };
  }, [products, shippingFee]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {/* Tổng giá trị bảo hành */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tổng giá trị bảo hành</span>
          <span className="font-bold text-base">
            {new Intl.NumberFormat('vi-VN').format(summary.totalValue)} đ
          </span>
        </div>

        <Separator />

        {/* Tổng giá trị trả lại */}
        {summary.returnedQty > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng giá trị trả lại</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('vi-VN').format(summary.returnedValue)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng giá trị đổi mới */}
        {summary.replacedQty > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Tổng giá trị đổi mới</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('vi-VN').format(summary.replacedValue)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng hàng trừ */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tổng hàng trừ</span>
          <span className="font-semibold">
            {new Intl.NumberFormat('vi-VN').format(summary.outOfStockValue)} đ
          </span>
        </div>

        <Separator />

        {/* Phí ship gửi về */}
        {shippingFee > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Phí ship gửi về</span>
              <span className="font-semibold">
                {new Intl.NumberFormat('vi-VN').format(shippingFee)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng cộng */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Tổng cộng</span>
          <span className="text-base font-bold text-red-600">
            {new Intl.NumberFormat('vi-VN').format(summary.totalPayment)} đ
          </span>
        </div>

        <Separator />

        {/* Tổng số lượng */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tổng số lượng</span>
          <span className="font-semibold">{summary.totalQuantity}</span>
        </div>

        {/* Số lượng đổi mới */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-xs text-muted-foreground">↳ Đổi mới</span>
          <span className="text-xs">{summary.replacedQty}</span>
        </div>

        {/* Số lượng trả lại */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-xs text-muted-foreground">↳ Trả lại</span>
          <span className="text-xs">{summary.returnedQty}</span>
        </div>

        {/* Số lượng hết hàng */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-xs text-muted-foreground">↳ Hết hàng</span>
          <span className="text-xs">{summary.outOfStockQty}</span>
        </div>
      </CardContent>
    </Card>
  );
});
