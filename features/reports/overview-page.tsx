/**
 * Reports Overview Dashboard
 * 
 * Trang tổng quan báo cáo — hiển thị KPI chính, mini charts, quick links
 */

'use client'

import * as React from 'react';
import Link from 'next/link';
import { format, startOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { formatCurrency } from '@/lib/format-utils';
import { fetchReportsOverview } from '@/features/reports/api/reports-api';
import type { SalesReportSummary } from './business-activity/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Package,
  Wallet,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Truck,
  Undo2,
  Warehouse,
} from 'lucide-react';
// Helper: percent change
function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current > 0 ? 100 : null;
  return Math.round(((current - previous) / previous) * 100);
}

// KPI Card
function KpiCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  subtitle,
  href,
  color = 'text-primary',
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: number | null;
  subtitle?: string;
  href?: string;
  color?: string;
}) {
  const content = (
    <Card className="relative overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle size="sm" className="text-muted-foreground font-medium">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg bg-muted ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          {trend != null && (
            <span className={`flex items-center text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
              {trend > 0 && '+'}{trend}%
            </span>
          )}
          {subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
        </div>
        {href && (
          <ArrowRight className="absolute bottom-4 right-4 h-4 w-4 text-muted-foreground/50" />
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
}

// Mini bar chart (pure CSS, no recharts dependency)
function MiniBarChart({ data, maxValue }: { data: { label: string; value: number }[]; maxValue: number }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-primary/80 rounded-t-sm min-h-0.5 transition-all"
            style={{ height: maxValue > 0 ? `${(item.value / maxValue) * 100}%` : '2px' }}
          />
        </div>
      ))}
    </div>
  );
}

const EMPTY_SALES_SUMMARY: SalesReportSummary = {
  orderCount: 0,
  productAmount: 0,
  returnAmount: 0,
  taxAmount: 0,
  shippingFee: 0,
  revenue: 0,
  grossProfit: 0,
};

export function ReportsOverviewPage() {
  const overviewMonthKey = format(startOfMonth(new Date()), 'yyyy-MM');

  const { data, isLoading } = useQuery({
    queryKey: ['reports', 'overview', overviewMonthKey],
    queryFn: fetchReportsOverview,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const currentSales = data?.sales.currentMonth ?? EMPTY_SALES_SUMMARY;
  const previousSales = data?.sales.previousMonth ?? EMPTY_SALES_SUMMARY;
  const miniChartData = React.useMemo(
    () => data?.sales.last14Days ?? [],
    [data?.sales.last14Days],
  );
  const currentPaymentSummary = data?.payments.currentMonth ?? {
    totalAmount: 0,
    transactionCount: 0,
  };
  const inventoryBlock = data?.inventory ?? {
    outOfStockCount: 0,
    lowStockCount: 0,
    alertItems: [] as { productSystemId: string; productName: string; available: number; stockStatus: 'out_of_stock' | 'low_stock' }[],
  };
  const lowStockItems = inventoryBlock.alertItems;
  const inventorySummary = {
    outOfStockCount: inventoryBlock.outOfStockCount,
    lowStockCount: inventoryBlock.lowStockCount,
  };

  // Computed KPIs
  const revenueChange = React.useMemo(
    () => percentChange(currentSales.revenue, previousSales.revenue),
    [currentSales.revenue, previousSales.revenue]
  );
  const orderChange = React.useMemo(
    () => percentChange(currentSales.orderCount, previousSales.orderCount),
    [currentSales.orderCount, previousSales.orderCount]
  );
  const profitChange = React.useMemo(
    () => percentChange(currentSales.grossProfit, previousSales.grossProfit),
    [currentSales.grossProfit, previousSales.grossProfit]
  );



  const miniChartMax = React.useMemo(
    () => Math.max(...miniChartData.map((d) => d.value), 1),
    [miniChartData],
  );

  const totalAlertSkus =
    inventorySummary.outOfStockCount + inventorySummary.lowStockCount;
  const moreAlertsCount = totalAlertSkus > 8 ? totalAlertSkus - 8 : 0;

  const currentMonthLabel = format(new Date(), 'MMMM yyyy', { locale: vi });

  usePageHeader({
    title: 'Tổng quan Báo cáo',
    subtitle: `Dữ liệu ${currentMonthLabel}`,
    actions: [],
  });

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Row */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-32 mb-2" /><Skeleton className="h-3 w-20" /></CardContent>
            </Card>
          ))}
        </div>
      ) : (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Doanh thu tháng"
          value={formatCurrency(currentSales.revenue)}
          icon={DollarSign}
          trend={revenueChange}
          subtitle="so với tháng trước"
          href={ROUTES.REPORTS.SALES_BY_TIME}
          color="text-green-600"
        />
        <KpiCard
          title="Đơn hàng"
          value={currentSales.orderCount.toLocaleString('vi-VN')}
          icon={ShoppingCart}
          trend={orderChange}
          subtitle="so với tháng trước"
          href={ROUTES.REPORTS.SALES_BY_ORDER}
          color="text-blue-600"
        />
        <KpiCard
          title="Lợi nhuận gộp"
          value={formatCurrency(currentSales.grossProfit)}
          icon={TrendingUp}
          trend={profitChange}
          subtitle="so với tháng trước"
          href={ROUTES.REPORTS.SALES_BY_TIME}
          color="text-emerald-600"
        />
        <KpiCard
          title="Thanh toán"
          value={formatCurrency(currentPaymentSummary.totalAmount)}
          icon={Wallet}
          subtitle={`${currentPaymentSummary.transactionCount} giao dịch`}
          href={ROUTES.REPORTS.PAYMENT_BY_TIME}
          color="text-purple-600"
        />
      </div>
      )}

      {/* Charts + Alerts Row */}
      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-56 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-36 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : (
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Mini Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Doanh thu 14 ngày gần nhất</CardTitle>
                <CardDescription>Tổng: {formatCurrency(miniChartData.reduce((s, d) => s + d.value, 0))}</CardDescription>
              </div>
              <Link href={ROUTES.REPORTS.SALES_BY_TIME}>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Xem chi tiết
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <MiniBarChart data={miniChartData} maxValue={miniChartMax} />
            <div className="flex justify-between mt-1">
              {miniChartData.length > 0 && (
                <>
                  <span className="text-xs text-muted-foreground">{miniChartData[0]?.label}</span>
                  <span className="text-xs text-muted-foreground">{miniChartData[miniChartData.length - 1]?.label}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Cảnh báo tồn kho</CardTitle>
              <Link href={ROUTES.REPORTS.INVENTORY_BY_PRODUCT}>
                <Button variant="ghost" size="sm">Xem tất cả</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {totalAlertSkus === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">Không có cảnh báo</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {lowStockItems.map(item => (
                  <div key={item.productSystemId} className="flex items-center justify-between text-sm py-1.5 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-muted-foreground">Có sẵn: {item.available}</p>
                    </div>
                    <Badge variant={item.stockStatus === 'out_of_stock' ? 'destructive' : 'default'} className="ml-2 shrink-0">
                      {item.stockStatus === 'out_of_stock' ? 'Hết' : 'Sắp hết'}
                    </Badge>
                  </div>
                ))}
                {moreAlertsCount > 0 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{moreAlertsCount.toLocaleString('vi-VN')} sản phẩm khác cần xem
                  </p>
                )}
              </div>
            )}
            <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                <span>{inventorySummary.outOfStockCount} hết hàng</span>
              </div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />
                <span>{inventorySummary.lowStockCount} sắp hết</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      )}

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <QuickLinkCard
          title="Bán hàng"
          count={9}
          icon={TrendingUp}
          color="text-green-600 bg-green-100 dark:bg-green-900/30"
          href={ROUTES.REPORTS.SALES_BY_TIME}
          description="Doanh thu, sản phẩm, nhân viên"
        />
        <QuickLinkCard
          title="Giao hàng"
          count={8}
          icon={Truck}
          color="text-blue-600 bg-blue-100 dark:bg-blue-900/30"
          href={ROUTES.REPORTS.DELIVERY_BY_TIME}
          description="Vận đơn, đối tác, tỷ lệ"
        />
        <QuickLinkCard
          title="Trả hàng"
          count={2}
          icon={Undo2}
          color="text-orange-600 bg-orange-100 dark:bg-orange-900/30"
          href={ROUTES.REPORTS.RETURNS_BY_ORDER}
          description="Đơn trả, sản phẩm trả"
        />
        <QuickLinkCard
          title="Thanh toán"
          count={3}
          icon={Wallet}
          color="text-purple-600 bg-purple-100 dark:bg-purple-900/30"
          href={ROUTES.REPORTS.PAYMENT_BY_TIME}
          description="Dòng tiền, phương thức"
        />
        <QuickLinkCard
          title="Tồn kho"
          count={3}
          icon={Warehouse}
          color="text-amber-600 bg-amber-100 dark:bg-amber-900/30"
          href={ROUTES.REPORTS.INVENTORY_BY_PRODUCT}
          description="Tồn kho, chi nhánh, danh mục"
        />
      </div>
    </div>
  );
}

function QuickLinkCard({ title, count, icon: Icon, color, href, description }: {
  title: string;
  count: number;
  icon: React.ElementType;
  color: string;
  href: string;
  description: string;
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{title}</h3>
              <span className="text-xs text-muted-foreground">{count} báo cáo</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default ReportsOverviewPage;
