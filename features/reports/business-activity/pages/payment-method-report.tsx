'use client'

/**
 * PaymentMethodReport Page
 *
 * Báo cáo thanh toán theo phương thức
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
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { usePaymentMethodReport } from '../hooks/use-payment-report';
import { useDefaultDateRange } from '../hooks/use-report-hooks';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, PaymentMethodReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { CreditCard, DollarSign, TrendingUp, Filter } from 'lucide-react';

const getColumns = (): ColumnDef<PaymentMethodReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'methodName',
    accessorKey: 'methodName',
    header: 'Phương thức TT',
    size: 180,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : row.methodName}
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
    id: 'percentage',
    accessorKey: 'percentage',
    header: 'Tỷ trọng',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.percentage.toFixed(1)}%</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'totalAmount', label: 'Tổng tiền', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'transactionCount', label: 'SL giao dịch', color: 'var(--chart-2)', type: 'line' as const },
  { key: 'percentage', label: 'Tỷ trọng (%)', color: 'var(--chart-3)', type: 'line' as const }
];

export function PaymentMethodReportPage() {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(defaultRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['totalAmount', 'transactionCount']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'totalAmount', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const { data, summary, isLoading, isError, error } = usePaymentMethodReport(dateRange);

  const tableData = React.useMemo(() => {
    const summaryRow: PaymentMethodReportRow & { systemId: SystemId; _isSummary: boolean } = {
      methodId: '__summary__',
      methodName: 'Tổng',
      transactionCount: summary.transactionCount,
      totalAmount: summary.totalAmount,
      percentage: 100,
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: (row.methodId as unknown as SystemId),
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
      name: row.methodId as string,
      label: row.methodName,
      totalAmount: row.totalAmount,
      transactionCount: row.transactionCount,
      percentage: row.percentage,
    }));
  }, [data]);

  const dynamicChartConfig = React.useMemo(() => ({
    bars: DISPLAY_OPTIONS.filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color })),
    lines: DISPLAY_OPTIONS.filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 })),
  }), [selectedChartOptions]);

  const exportColumns = React.useMemo(() => [
    { key: 'methodName', label: 'Phương thức TT', selected: true },
    { key: 'transactionCount', label: 'SL giao dịch', selected: true },
    { key: 'totalAmount', label: 'Tổng tiền', selected: true },
    { key: 'percentage', label: 'Tỷ trọng (%)', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số phương thức', value: data.length, icon: CreditCard },
    { title: 'SL giao dịch', value: summary.transactionCount, icon: DollarSign },
    { title: 'Tổng tiền', value: formatCurrency(summary.totalAmount), icon: TrendingUp }
  ], [data, summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo thanh toán theo phương thức"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={PAYMENT_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo thanh toán theo phương thức',
    subtitle: 'Phân tích thanh toán theo phương thức thanh toán',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Thanh toán theo PTTT', href: ROUTES.REPORTS.PAYMENT_BY_METHOD, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: PaymentMethodReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.methodName}
        </span>
        <Badge variant="secondary">{row.transactionCount + ' GD'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Tổng tiền:</span> {formatCurrency(row.totalAmount)}</div>
        <div><span className="text-muted-foreground">Tỷ trọng:</span> {row.percentage.toFixed(1) + '%'}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        showTimeGrouping={false}
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
            <CardTitle>Chi tiết theo phương thức</CardTitle>
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

export default PaymentMethodReportPage;
