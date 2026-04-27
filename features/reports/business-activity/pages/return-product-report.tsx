'use client'

/**
 * ReturnProductReport Page
 *
 * Báo cáo trả hàng theo sản phẩm
 */

import * as React from 'react';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, SALES_REPORT_GLOSSARY } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { useReturnProductReport } from '../hooks/use-return-report';
import { useDefaultDateRange } from '../hooks/use-report-hooks';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, ReturnProductReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Package, RotateCcw, DollarSign, Filter } from 'lucide-react';

const getColumns = (): ColumnDef<ReturnProductReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'productName',
    accessorKey: 'productName',
    header: 'Sản phẩm',
    size: 200,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : (
          <div>
            <div className="font-medium">{row.productName}</div>
            {row.sku && <div className="text-xs text-muted-foreground">{row.sku}</div>}
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'returnCount',
    accessorKey: 'returnCount',
    header: 'Số lần trả',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.returnCount}</span>,
  },
  {
    id: 'quantityReturned',
    accessorKey: 'quantityReturned',
    header: 'SL trả',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.quantityReturned}</span>,
  },
  {
    id: 'returnAmount',
    accessorKey: 'returnAmount',
    header: 'Tiền trả',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.returnAmount)}</span>,
  },
  {
    id: 'returnRate',
    accessorKey: 'returnRate',
    header: 'Tỷ lệ trả',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.returnRate.toFixed(1)}%</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'returnAmount', label: 'Tiền trả', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'quantityReturned', label: 'SL trả', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'returnRate', label: 'Tỷ lệ trả (%)', color: 'var(--chart-3)', type: 'line' as const },
  { key: 'returnCount', label: 'Số lần trả', color: 'var(--chart-5)', type: 'line' as const }
];

export function ReturnProductReportPage() {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(defaultRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['returnAmount', 'quantityReturned']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'returnAmount', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const { data, summary, isLoading, isError, error } = useReturnProductReport(dateRange);

  const tableData = React.useMemo(() => {
    const summaryRow: ReturnProductReportRow & { systemId: SystemId; _isSummary: boolean } = {
      productSystemId: '__summary__' as SystemId,
      productName: 'Tổng',
      productCode: '',
      sku: '',
      returnCount: data.reduce((s, r) => s + r.returnCount, 0),
      quantityReturned: summary.totalQuantityReturned,
      returnAmount: summary.totalReturnAmount,
      returnRate: 0,
      topReasons: [],
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.productSystemId,
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
    return data.slice(0, 20).map(row => ({
      name: row.productSystemId as string,
      label: row.productName.length > 20 ? row.productName.substring(0, 20) + '...' : row.productName,
      returnAmount: row.returnAmount,
      quantityReturned: row.quantityReturned,
      returnRate: row.returnRate,
      returnCount: row.returnCount,
    }));
  }, [data]);

  const dynamicChartConfig = React.useMemo(() => ({
    bars: DISPLAY_OPTIONS.filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color })),
    lines: DISPLAY_OPTIONS.filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 })),
  }), [selectedChartOptions]);

  const exportColumns = React.useMemo(() => [
    { key: 'productName', label: 'Sản phẩm', selected: true },
    { key: 'sku', label: 'SKU', selected: true },
    { key: 'returnCount', label: 'Số lần trả', selected: true },
    { key: 'quantityReturned', label: 'SL trả', selected: true },
    { key: 'returnAmount', label: 'Tiền trả', selected: true },
    { key: 'returnRate', label: 'Tỷ lệ trả (%)', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số sản phẩm', value: summary.totalProducts, icon: Package },
    { title: 'SL trả', value: summary.totalQuantityReturned, icon: RotateCcw },
    { title: 'Tiền trả', value: formatCurrency(summary.totalReturnAmount), icon: DollarSign }
  ], [summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo trả hàng theo sản phẩm"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo trả hàng theo sản phẩm',
    subtitle: 'Phân tích tình hình trả hàng theo sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Trả hàng theo SP', href: ROUTES.REPORTS.RETURNS_BY_PRODUCT, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: ReturnProductReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.productName}
        </span>
        <Badge variant="secondary">{row.quantityReturned + ' SP'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Số lần trả:</span> {row.returnCount}</div>
        <div><span className="text-muted-foreground">SL trả:</span> {row.quantityReturned}</div>
        <div><span className="text-muted-foreground">Tiền trả:</span> {formatCurrency(row.returnAmount)}</div>
        <div><span className="text-muted-foreground">Tỷ lệ:</span> {row.returnRate.toFixed(1) + '%'}</div>
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
            <CardTitle>Chi tiết theo sản phẩm</CardTitle>
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

export default ReturnProductReportPage;
