'use client'

import { Separator } from '@/components/ui/separator'
import { formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils'
import type { SupplierStats } from '../hooks/use-supplier-stats'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)

interface SupplierStatsSectionProps {
  stats: SupplierStats
  /** Hiển thị compact (chỉ 3 dòng financial) hay full (order + warranty stats) */
  variant?: 'compact' | 'full'
}

/**
 * Shared supplier stats display used across PO detail, warranty detail,
 * purchase-returns, supplier-selection-card, etc.
 */
export function SupplierStatsSection({ stats, variant = 'full' }: SupplierStatsSectionProps) {
  return (
    <div className="space-y-2 text-sm">
      <Separator />
      {/* Financial stats — 3-column grid */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Nợ hiện tại</p>
          <p className="font-semibold text-foreground">{formatCurrency(stats.financial.debtBalance)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tổng đơn nhập</p>
          <p className="font-semibold text-foreground">{formatCurrency(stats.financial.totalPurchases)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Trả hàng</p>
          <p className="font-semibold text-foreground">{formatCurrency(stats.financial.totalReturns)}</p>
        </div>
      </div>

      {variant === 'full' && (
        <>
          {/* Order stats */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng số đơn đặt:</span>
            <span>
              {stats.purchaseOrders.ordered} đặt hàng, {stats.purchaseOrders.inProgress} đang giao dịch, {stats.purchaseOrders.completed} hoàn thành, {stats.purchaseOrders.cancelled} đã hủy
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng SL đặt:</span>
            <span className="font-medium">{stats.products?.totalQuantityOrdered?.toLocaleString('vi-VN') || 0}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng SL trả:</span>
            <span className="font-medium">{stats.products?.totalQuantityReturned?.toLocaleString('vi-VN') || 0}</span>
          </div>

          {/* Warranty stats (conditional) */}
          {stats.warranties.total > 0 && (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bảo hành:</span>
                <span>
                  {stats.warranties.sent + stats.warranties.confirmed} chưa trả, {stats.warranties.completed} đã trả
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tổng SL SP bảo hành:</span>
                <span className="font-medium">
                  {stats.warranties.totalSentQty.toLocaleString('vi-VN')} gửi đi / {stats.warranties.totalWarrantyProductQty.toLocaleString('vi-VN')} được BH / {stats.warranties.totalNonWarrantyQty.toLocaleString('vi-VN')} trả lại
                </span>
              </div>
              {stats.warranties.totalWarrantyDeduction > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng tiền trừ BH:</span>
                  <span className="font-medium">
                    {stats.warranties.totalWarrantyProductQty.toLocaleString('vi-VN')} SP — {formatCurrency(stats.warranties.totalWarrantyDeduction)}
                  </span>
                </div>
              )}
            </>
          )}

          {/* Last order date */}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lần đặt đơn gần nhất:</span>
            <span>
              {stats.purchaseOrders.lastOrderDate
                ? formatDateCustom(parseDate(stats.purchaseOrders.lastOrderDate) || getCurrentDate(), 'dd/MM/yyyy')
                : 'Chưa có'}
            </span>
          </div>
        </>
      )}
    </div>
  )
}
