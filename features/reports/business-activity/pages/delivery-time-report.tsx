'use client'

/**
 * DeliveryTimeReport Page
 *
 * Báo cáo giao hàng theo thời gian
 */

import * as React from 'react';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, DELIVERY_REPORT_GLOSSARY } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { useDeliveryTimeReport } from '../hooks/use-delivery-report';
import { useDefaultDateRange } from '../hooks/use-report-hooks';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, DeliveryTimeReportRow, ChartType, TimeGrouping } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Clock, Truck, TrendingUp, CheckCircle, Filter } from 'lucide-react';

const getColumns = (): ColumnDef<DeliveryTimeReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'label',
    accessorKey: 'label',
    header: 'Thời gian',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : row.label}
      </div>
    ),
  },
  {
    id: 'totalShipments',
    accessorKey: 'totalShipments',
    header: 'Tổng vận đơn',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.totalShipments}</span>,
  },
  {
    id: 'deliveredCount',
    accessorKey: 'deliveredCount',
    header: 'Giao thành công',
    size: 110,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.deliveredCount}</span>,
  },
  {
    id: 'pendingCount',
    accessorKey: 'pendingCount',
    header: 'Đang giao',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.pendingCount}</span>,
  },
  {
    id: 'failedCount',
    accessorKey: 'failedCount',
    header: 'Thất bại',
    size: 90,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.failedCount}</span>,
  },
  {
    id: 'deliveryRate',
    accessorKey: 'deliveryRate',
    header: 'Tỷ lệ giao',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.deliveryRate.toFixed(1)}%</span>,
  },
  {
    id: 'totalAmount',
    accessorKey: 'totalAmount',
    header: 'Tổng tiền',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.totalAmount)}</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'totalShipments', label: 'Tổng vận đơn', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'deliveredCount', label: 'Giao thành công', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'failedCount', label: 'Thất bại', color: 'var(--chart-4)', type: 'line' as const },
  { key: 'deliveryRate', label: 'Tỷ lệ giao (%)', color: 'var(--chart-3)', type: 'line' as const }
];

export function DeliveryTimeReportPage() {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(defaultRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['totalShipments', 'deliveredCount']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'totalAmount', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [timeGrouping, setTimeGrouping] = React.useState<TimeGrouping>('day');

  const { data, summary, isLoading, isError, error } = useDeliveryTimeReport(dateRange, timeGrouping);

  const tableData = React.useMemo(() => {
    const summaryRow: DeliveryTimeReportRow & { systemId: SystemId; _isSummary: boolean } = {
      key: '__summary__',
      label: 'Tổng',
      totalShipments: summary.totalShipments,
      deliveredCount: summary.deliveredCount,
      pendingCount: summary.pendingCount,
      failedCount: summary.failedCount,
      returnedCount: summary.returnedCount,
      totalAmount: summary.totalAmount,
      codAmount: summary.codAmount,
      shippingFee: summary.shippingFee,
      deliveryRate: summary.deliveryRate,
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: (row.key as unknown as SystemId),
      _isSummary: false,
    }))];
  }, [data, summary]);

  const sortedData = React.useMemo(() => {
    const sorted = [...tableData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        if (a._isSummary) return -1;
        if (b._isSummary) return 1;
        const aVal = (a as unknown as Record<string, unknown>)[sorting.id];
        const bVal = (b as unknown as Record<string, unknown>)[sorting.id];
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        const comparison = aVal < bVal ? -1 : 1;
        return sorting.desc ? -comparison : comparison;
      });
    }
    return sorted;
  }, [tableData, sorting]);

  const paginatedData = React.useMemo(() => {
    const summaryRow = sortedData[0];
    const dataRows = sortedData.slice(1);
    const start = pagination.pageIndex * pagination.pageSize;
    return [summaryRow, ...dataRows.slice(start, start + pagination.pageSize)];
  }, [sortedData, pagination]);

  const pageCount = Math.ceil(data.length / pagination.pageSize);

  const chartData = React.useMemo(() => {
    return data.map(row => ({
      name: row.key as string,
      label: row.label,
      totalShipments: row.totalShipments,
      deliveredCount: row.deliveredCount,
      failedCount: row.failedCount,
      deliveryRate: row.deliveryRate,
    }));
  }, [data]);

  const dynamicChartConfig = React.useMemo(() => ({
    bars: DISPLAY_OPTIONS.filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color })),
    lines: DISPLAY_OPTIONS.filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 })),
  }), [selectedChartOptions]);

  const exportColumns = React.useMemo(() => [
    { key: 'label', label: 'Thời gian', selected: true },
    { key: 'totalShipments', label: 'Tổng vận đơn', selected: true },
    { key: 'deliveredCount', label: 'Giao thành công', selected: true },
    { key: 'pendingCount', label: 'Đang giao', selected: true },
    { key: 'failedCount', label: 'Thất bại', selected: true },
    { key: 'deliveryRate', label: 'Tỷ lệ giao (%)', selected: true },
    { key: 'totalAmount', label: 'Tổng tiền', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Tổng vận đơn', value: summary.totalShipments, icon: Truck },
    { title: 'Giao thành công', value: summary.deliveredCount, icon: CheckCircle },
    { title: 'Tỷ lệ giao', value: summary.deliveryRate.toFixed(1) + '%', icon: TrendingUp },
    { title: 'Tổng tiền', value: formatCurrency(summary.totalAmount), icon: Clock }
  ], [summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo giao hàng theo thời gian"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={DELIVERY_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo giao hàng theo thời gian',
    subtitle: 'Tình hình giao hàng theo ngày/tuần/tháng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Giao hàng theo thời gian', href: ROUTES.REPORTS.DELIVERY_BY_TIME, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: DeliveryTimeReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.label}
        </span>
        <Badge variant="secondary">{row.totalShipments + ' vận đơn'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Thành công:</span> {row.deliveredCount}</div>
        <div><span className="text-muted-foreground">Thất bại:</span> {row.failedCount}</div>
        <div><span className="text-muted-foreground">Tỷ lệ:</span> {row.deliveryRate.toFixed(1) + '%'}</div>
        <div><span className="text-muted-foreground">Tổng tiền:</span> {formatCurrency(row.totalAmount)}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        showTimeGrouping={true}
        timeGrouping={timeGrouping}
        onTimeGroupingChange={setTimeGrouping}
        showGroupBy={false}
      />

      <ReportQueryBoundary isLoading={isLoading} isError={isError} error={error}>
      <ReportSummaryCards cards={summaryCards} />

      <ReportChart
        data={chartData}
        config={dynamicChartConfig}
        chartType={chartType}
        onChartTypeChange={setChartType}
        displayOptions={DISPLAY_OPTIONS}
        selectedOptions={selectedChartOptions}
        onOptionsChange={setSelectedChartOptions}
        height={350}
        isCollapsible={true}
      />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Chi tiết theo thời gian</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc ({data.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="p-6">
              <ReportEmptyState title="Không có dữ liệu trong khoảng thời gian đã chọn" />
            </div>
          ) : (
          <ResponsiveDataTable
            columns={columns}
            data={paginatedData}
            rowCount={data.length + 1}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            sorting={sorting}
            setSorting={setSorting}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            renderMobileCard={renderMobileCard}
          />
          )}
        </CardContent>
      </Card>
      </ReportQueryBoundary>
    </div>
  );
}

export default DeliveryTimeReportPage;
