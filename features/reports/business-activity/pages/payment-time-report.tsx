'use client'

/**
 * PaymentTimeReport Page
 *
 * Báo cáo thanh toán theo thời gian
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, PAYMENT_REPORT_GLOSSARY } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { usePaymentTimeReport } from '../hooks/use-payment-report';
import { useDefaultDateRange } from '../hooks/use-report-hooks';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, PaymentTimeReportRow, ChartType, TimeGrouping } from '../types';
import type { SystemId } from '@/lib/id-types';
import { CreditCard, TrendingUp, DollarSign, Filter } from 'lucide-react';

const getColumns = (): ColumnDef<PaymentTimeReportRow & { systemId: string; _isSummary?: boolean }>[] => [
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
    id: 'transactionCount',
    accessorKey: 'transactionCount',
    header: 'SL giao dịch',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.transactionCount}</span>,
  },
  {
    id: 'totalAmount',
    accessorKey: 'totalAmount',
    header: 'Tổng tiền',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.totalAmount)}</span>,
  },
  {
    id: 'completedCount',
    accessorKey: 'completedCount',
    header: 'Hoàn thành',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.completedCount}</span>,
  },
  {
    id: 'completedAmount',
    accessorKey: 'completedAmount',
    header: 'Tiền hoàn thành',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.completedAmount)}</span>,
  },
  {
    id: 'pendingCount',
    accessorKey: 'pendingCount',
    header: 'Chờ xử lý',
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
  }
];

const DISPLAY_OPTIONS = [
  { key: 'totalAmount', label: 'Tổng tiền', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'completedAmount', label: 'Tiền hoàn thành', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'transactionCount', label: 'SL giao dịch', color: 'var(--chart-3)', type: 'line' as const }
];

export function PaymentTimeReportPage() {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(defaultRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['totalAmount', 'completedAmount']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'totalAmount', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [timeGrouping, setTimeGrouping] = React.useState<TimeGrouping>('day');

  const { data, summary, isLoading, isError, error } = usePaymentTimeReport(dateRange, timeGrouping);

  const tableData = React.useMemo(() => {
    const summaryRow: PaymentTimeReportRow & { systemId: SystemId; _isSummary: boolean } = {
      key: '__summary__',
      label: 'Tổng',
      transactionCount: summary.transactionCount,
      totalAmount: summary.totalAmount,
      completedCount: data.reduce((s, r) => s + r.completedCount, 0),
      completedAmount: data.reduce((s, r) => s + r.completedAmount, 0),
      pendingCount: data.reduce((s, r) => s + r.pendingCount, 0),
      pendingAmount: data.reduce((s, r) => s + r.pendingAmount, 0),
      failedCount: data.reduce((s, r) => s + r.failedCount, 0),
      failedAmount: data.reduce((s, r) => s + r.failedAmount, 0),
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
      totalAmount: row.totalAmount,
      completedAmount: row.completedAmount,
      transactionCount: row.transactionCount,
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
    { key: 'transactionCount', label: 'SL giao dịch', selected: true },
    { key: 'totalAmount', label: 'Tổng tiền', selected: true },
    { key: 'completedCount', label: 'Hoàn thành', selected: true },
    { key: 'completedAmount', label: 'Tiền hoàn thành', selected: true },
    { key: 'pendingCount', label: 'Chờ xử lý', selected: true },
    { key: 'failedCount', label: 'Thất bại', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'SL giao dịch', value: summary.transactionCount, icon: CreditCard },
    { title: 'Tổng tiền', value: formatCurrency(summary.totalAmount), icon: DollarSign },
    { title: 'TB/giao dịch', value: formatCurrency(summary.averageAmount), icon: TrendingUp }
  ], [summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo thanh toán theo thời gian"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={PAYMENT_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo thanh toán theo thời gian',
    subtitle: 'Tình hình thanh toán theo ngày/tuần/tháng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Thanh toán theo thời gian', href: ROUTES.REPORTS.PAYMENT_BY_TIME, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: PaymentTimeReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.label}
        </span>
        <Badge variant="secondary">{row.transactionCount + ' GD'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Tổng tiền:</span> {formatCurrency(row.totalAmount)}</div>
        <div><span className="text-muted-foreground">Hoàn thành:</span> {row.completedCount}</div>
        <div><span className="text-muted-foreground">Chờ xử lý:</span> {row.pendingCount}</div>
        <div><span className="text-muted-foreground">Thất bại:</span> {row.failedCount}</div>
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
            <Button variant="outline" size="sm" type="button">
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

export default PaymentTimeReportPage;
