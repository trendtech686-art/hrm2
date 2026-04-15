'use client'

/**
 * SalesTaxReport Page
 *
 * Báo cáo bán hàng theo thuế
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, SALES_REPORT_GLOSSARY } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { useSalesTaxReport } from '../hooks/use-sales-report';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, SalesTaxReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Receipt, DollarSign, TrendingUp, ShoppingCart, Filter } from 'lucide-react';

const getDefaultDateRange = (): ReportDateRange => ({
  from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
});

const getColumns = (): ColumnDef<SalesTaxReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'taxRateLabel',
    accessorKey: 'taxRateLabel',
    header: 'Thuế suất',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : row.taxRateLabel}
      </div>
    ),
  },
  {
    id: 'orderCount',
    accessorKey: 'orderCount',
    header: 'SL đơn hàng',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.orderCount}</span>,
  },
  {
    id: 'productAmount',
    accessorKey: 'productAmount',
    header: 'Tiền hàng',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.productAmount)}</span>,
  },
  {
    id: 'taxAmount',
    accessorKey: 'taxAmount',
    header: 'Tiền thuế',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.taxAmount)}</span>,
  },
  {
    id: 'revenue',
    accessorKey: 'revenue',
    header: 'Doanh thu',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.revenue)}</span>,
  },
  {
    id: 'grossProfit',
    accessorKey: 'grossProfit',
    header: 'Lợi nhuận gộp',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={`text-right block font-medium ${row.grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {formatCurrency(row.grossProfit)}
      </span>
    ),
  }
];

const DISPLAY_OPTIONS = [
  { key: 'revenue', label: 'Doanh thu', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'taxAmount', label: 'Tiền thuế', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'grossProfit', label: 'Lợi nhuận gộp', color: 'var(--chart-3)', type: 'line' as const },
  { key: 'orderCount', label: 'Số đơn hàng', color: 'var(--chart-5)', type: 'line' as const }
];

export function SalesTaxReportPage() {
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(getDefaultDateRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['revenue', 'taxAmount']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'revenue', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const { data, summary } = useSalesTaxReport(dateRange);

  const tableData = React.useMemo(() => {
    const summaryRow: SalesTaxReportRow & { systemId: SystemId; _isSummary: boolean } = {
      taxRate: -1,
      taxRateLabel: 'Tổng',
      orderCount: summary.orderCount,
      productAmount: summary.productAmount,
      taxAmount: summary.taxAmount,
      revenue: summary.revenue,
      grossProfit: summary.grossProfit,
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: (row.taxRate as unknown as SystemId),
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
      name: String(row.taxRate),
      label: row.taxRateLabel,
      revenue: row.revenue,
      taxAmount: row.taxAmount,
      grossProfit: row.grossProfit,
      orderCount: row.orderCount,
    }));
  }, [data]);

  const dynamicChartConfig = React.useMemo(() => ({
    bars: DISPLAY_OPTIONS.filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color })),
    lines: DISPLAY_OPTIONS.filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 })),
  }), [selectedChartOptions]);

  const exportColumns = React.useMemo(() => [
    { key: 'taxRateLabel', label: 'Thuế suất', selected: true },
    { key: 'orderCount', label: 'SL đơn hàng', selected: true },
    { key: 'productAmount', label: 'Tiền hàng', selected: true },
    { key: 'taxAmount', label: 'Tiền thuế', selected: true },
    { key: 'revenue', label: 'Doanh thu', selected: true },
    { key: 'grossProfit', label: 'Lợi nhuận gộp', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số mức thuế', value: data.length, icon: Receipt },
    { title: 'Tổng đơn hàng', value: summary.orderCount, icon: ShoppingCart },
    { title: 'Doanh thu', value: formatCurrency(summary.revenue), icon: TrendingUp },
    { title: 'Tổng thuế', value: formatCurrency(summary.taxAmount), icon: DollarSign }
  ], [data, summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo bán hàng theo thuế"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo bán hàng theo thuế',
    subtitle: 'Phân tích doanh thu theo thuế suất',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Bán hàng theo thuế', href: ROUTES.REPORTS.SALES_BY_TAX, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: SalesTaxReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.taxRateLabel}
        </span>
        <Badge variant="secondary">{row.orderCount + ' đơn'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Tiền hàng:</span> {formatCurrency(row.productAmount)}</div>
        <div><span className="text-muted-foreground">Tiền thuế:</span> {formatCurrency(row.taxAmount)}</div>
        <div><span className="text-muted-foreground">Doanh thu:</span> {formatCurrency(row.revenue)}</div>
        <div className={row.grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}>
          <span className="text-muted-foreground">LN gộp:</span> {formatCurrency(row.grossProfit)}
        </div>
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
            <CardTitle>Chi tiết theo thuế suất</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc ({data.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesTaxReportPage;
