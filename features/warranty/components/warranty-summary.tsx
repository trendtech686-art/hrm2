import * as React from 'react';
import { useFormContext, useWatch, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';

interface WarrantySummaryProps {
  disabled?: boolean;
}

/**
 * Card thanh toán - Hiển thị đầy đủ thông tin bảo hành + Bù trừ gộp chung
 * ✅ Real-time calculation với useMemo
 */
export function WarrantySummary({ disabled = false }: WarrantySummaryProps) {
  const { control, watch, setValue } = useFormContext();
  const products = useWatch({ control, name: 'products' }) || [];
  const shippingFee = useWatch({ control, name: 'shippingFee' }) || 0;
  const settlementMethod = watch('settlementMethod') || '';
  
  // ✅ OPTIMIZATION: Group products by resolution once instead of filtering 4 times
  const summary = React.useMemo(() => {
    const totalQuantity = products.reduce((sum: number, p: any) => sum + (p.quantity || 0), 0);
    const totalValue = products.reduce((sum: number, p: any) => sum + ((p.quantity || 0) * (p.unitPrice || 0)), 0);
    
    // ✅ Group by resolution in single pass - 4x faster!
    const byResolution = {
      return: { qty: 0, value: 0 },
      replace: { qty: 0, value: 0 },
      deduct: { qty: 0, value: 0, deduction: 0 },
      out_of_stock: { qty: 0, value: 0 }
    };
    
    products.forEach((p: any) => {
      const qty = p.quantity || 0;
      const value = qty * (p.unitPrice || 0);
      const resolution = p.resolution;
      
      if (byResolution[resolution]) {
        byResolution[resolution].qty += qty;
        byResolution[resolution].value += value;
        if (resolution === 'deduct') {
          byResolution.deduct.deduction += p.deductionAmount || 0;
        }
      }
    });

    // Tổng thanh toán = Hàng hết + Phí cước
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
        <CardTitle className="text-h4">Thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {/* Tổng giá trị bảo hành */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted-foreground">Tổng giá trị bảo hành</span>
          <span className="font-bold text-body-md">
            {new Intl.NumberFormat('vi-VN').format(summary.totalValue)} đ
          </span>
        </div>

        <Separator />


        {/* Tổng giá trị trả lại */}
        {summary.returnedQty > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-muted-foreground">Tổng giá trị trả lại</span>
              <span className="font-semibold text-green-600">
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
              <span className="text-body-sm text-muted-foreground">Tổng giá trị đổi mới</span>
              <span className="font-semibold text-blue-600">
                {new Intl.NumberFormat('vi-VN').format(summary.replacedValue)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng hàng trừ - Sum of out_of_stock products */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted-foreground">Tổng hàng trừ</span>
          <span className="font-semibold text-red-600">
            {new Intl.NumberFormat('vi-VN').format(summary.outOfStockValue)} đ
          </span>
        </div>

        <Separator />
        {/* Phí cước - READ ONLY, displayed from form field */}
        {shippingFee > 0 && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-body-sm text-muted-foreground">Phí ship gửi về</span>
              <span className="font-semibold text-orange-600">
                {new Intl.NumberFormat('vi-VN').format(shippingFee)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng cộng = Tổng hàng trừ + Phí ship */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm font-semibold">Tổng cộng</span>
          <span className="text-body-md font-bold text-primary">
            {new Intl.NumberFormat('vi-VN').format(summary.totalPayment)} đ
          </span>
        </div>

        <Separator />

        {/* Tổng số lượng */}
        <div className="flex items-center justify-between">
          <span className="text-body-sm text-muted-foreground">Tổng số lượng</span>
          <span className="font-semibold">{summary.totalQuantity}</span>
        </div>

        {/* Số lượng đổi mới */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-body-xs text-muted-foreground">↳ Đổi mới</span>
          <span className="text-body-xs text-blue-600">{summary.replacedQty}</span>
        </div>

        {/* Số lượng trả lại */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-body-xs text-muted-foreground">↳ Trả lại</span>
          <span className="text-body-xs text-green-600">{summary.returnedQty}</span>
        </div>

        {/* Số lượng hết hàng */}
        <div className="flex items-center justify-between pl-4">
          <span className="text-body-xs text-muted-foreground">↳ Hết hàng</span>
          <span className="text-body-xs text-red-600">{summary.outOfStockQty}</span>
        </div>

        <Separator />

        {/* Info text */}
        <div className="text-body-xs text-muted-foreground bg-muted/50 p-2 rounded">
          <p>Sau khi tạo phiếu, bạn có thể thêm sản phẩm và xử lý bảo hành trong trang chi tiết.</p>
        </div>
      </CardContent>
    </Card>
  );
}
