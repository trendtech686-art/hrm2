'use client';

/**
 * Financial summary component for warranty tracking page
 */
import * as React from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { PublicWarrantyProduct } from '../public-warranty-api';
import {
  calculateTotalWarrantyValue,
  calculateReturnedValue,
  calculateReplacedValue,
  calculateOutOfStockValue,
  calculateTotalQuantity,
  calculateQuantityByResolution,
  calculateGrandTotal,
  formatCurrency,
} from '../utils/warranty-tracking-helpers';

interface WarrantyFinancialSummaryProps {
  products: PublicWarrantyProduct[];
  shippingFee?: number;
}

/**
 * Financial summary card showing warranty totals
 */
export function WarrantyFinancialSummary({ products, shippingFee }: WarrantyFinancialSummaryProps) {
  if (products.length === 0) return null;

  const totalValue = calculateTotalWarrantyValue(products);
  const { value: returnedValue, quantity: returnedQty } = calculateReturnedValue(products);
  const { value: replacedValue, quantity: replacedQty } = calculateReplacedValue(products);
  const outOfStockValue = calculateOutOfStockValue(products);
  const totalQuantity = calculateTotalQuantity(products);
  const grandTotal = calculateGrandTotal(products, shippingFee);

  return (
    <Card>
      <CardHeader className="pb-3 px-3 pt-3 sm:px-4 sm:pt-4 md:px-6 md:pt-6">
        <CardTitle className="flex items-center gap-2 text-h4">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
          Tổng kết bảo hành
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-2.5 md:space-y-3 px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-6">
        {/* Tổng giá trị bảo hành */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-muted-foreground">Tổng giá trị bảo hành</span>
          <span className="font-semibold text-xs sm:text-sm">
            {formatCurrency(totalValue)} đ
          </span>
        </div>

        <Separator />

        {/* Tổng giá trị trả lại */}
        {returnedQty > 0 && (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Tổng giá trị trả lại</span>
              <span className="font-medium text-xs sm:text-sm">
                {formatCurrency(returnedValue)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng giá trị đổi mới */}
        {replacedQty > 0 && (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Tổng giá trị đổi mới</span>
              <span className="font-medium text-xs sm:text-sm">
                {formatCurrency(replacedValue)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng hàng trừ */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-muted-foreground">Tổng hàng trừ</span>
          <span className="font-medium text-xs sm:text-sm">
            {formatCurrency(outOfStockValue)} đ
          </span>
        </div>

        <Separator />

        {/* Phí ship gửi về */}
        {shippingFee !== undefined && shippingFee > 0 && (
          <>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Phí ship gửi về (shop ko chịu phí cước này sẽ thu thêm)
              </span>
              <span className="font-medium text-xs sm:text-sm">
                {formatCurrency(shippingFee)} đ
              </span>
            </div>
            <Separator />
          </>
        )}

        {/* Tổng cộng */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-semibold text-sm sm:text-base">Tổng cộng</span>
          <span className="text-base sm:text-lg font-bold text-destructive">
            {formatCurrency(grandTotal)} đ
          </span>
        </div>

        <Separator />

        {/* Tổng số lượng */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-muted-foreground">Tổng số lượng</span>
          <span className="font-medium text-xs sm:text-sm">{totalQuantity}</span>
        </div>

        {/* Số lượng đổi mới */}
        <div className="flex items-center justify-between gap-3 pl-3 sm:pl-4">
          <span className="text-xs text-muted-foreground">↳ Đổi mới</span>
          <span className="text-xs font-medium">
            {calculateQuantityByResolution(products, 'replace')}
          </span>
        </div>

        {/* Số lượng trả lại */}
        <div className="flex items-center justify-between gap-3 pl-3 sm:pl-4">
          <span className="text-xs text-muted-foreground">↳ Trả lại</span>
          <span className="text-xs font-medium">
            {calculateQuantityByResolution(products, 'return')}
          </span>
        </div>

        {/* Số lượng hết hàng */}
        <div className="flex items-center justify-between gap-3 pl-3 sm:pl-4">
          <span className="text-xs text-muted-foreground">↳ Hết hàng</span>
          <span className="text-xs font-medium">
            {calculateQuantityByResolution(products, 'out_of_stock')}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
