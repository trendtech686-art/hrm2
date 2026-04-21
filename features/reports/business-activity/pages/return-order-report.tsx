'use client'

/**
 * ReturnOrderReport Page
 *
 * Báo cáo trả hàng theo đơn — phân trang server.
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, SALES_REPORT_GLOSSARY } from '../components/report-header-actions';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { formatCurrency } from '@/lib/format-utils';
import { useReturnOrderReport } from '../hooks/use-return-report';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, ReturnOrderReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { RotateCcw, Package, DollarSign, TrendingDown, Filter } from 'lucide-react';

const getDefaultDateRange = (): ReportDateRange => ({
  from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
});

const getColumns = (): ColumnDef<ReturnOrderReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'returnId',
    accessorKey: 'returnId',
    header: 'Mã phiếu trả',
    size: 140,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : row.returnId}
      </div>
    ),
  },
  {
    id: 'orderId',
    accessorKey: 'orderId',
    header: 'Mã đơn hàng',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.orderId || '-')}</span>,
  },
  {
    id: 'returnDate',
    accessorKey: 'returnDate',
    header: 'Ngày trả',
    size: 110,
    enableSorting: true,
    cell: ({ row }) => <span>{row.returnDate ? format(new Date(row.returnDate), 'dd/MM/yyyy') : '-'}</span>,
  },
  {
    id: 'customerName',
    accessorKey: 'customerName',
    header: 'Khách hàng',
    size: 150,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.customerName || '-')}</span>,
  },
  {
    id: 'employeeName',
    accessorKey: 'employeeName',
    header: 'Nhân viên',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.employeeName || '-')}</span>,
  },
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.branchName || '-')}</span>,
  },
  {
    id: 'itemCount',
    accessorKey: 'itemCount',
    header: 'SL SP',
    size: 80,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.itemCount}</span>,
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
    id: 'refundAmount',
    accessorKey: 'refundAmount',
    header: 'Tiền hoàn',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.refundAmount)}</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'returnAmount', label: 'Tiền trả', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'refundAmount', label: 'Tiền hoàn', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'itemCount', label: 'SL sản phẩm', color: 'var(--chart-3)', type: 'line' as const }
];

export function ReturnOrderReportPage() {
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(getDefaultDateRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['returnAmount', 'refundAmount']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'returnAmount', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [dateRange.from, dateRange.to]);

  const { data, summary, pagination: serverPagination, isLoading, isError, error } = useReturnOrderReport(
    dateRange,
    pagination.pageIndex + 1,
    pagination.pageSize,
  );

  const tableData = React.useMemo(() => {
    const summaryRow: ReturnOrderReportRow & { systemId: SystemId; _isSummary: boolean } = {
      returnSystemId: '__summary__' as SystemId,
      returnId: 'Tổng',
      orderId: '',
      orderSystemId: '__summary__' as SystemId,
      returnDate: '',
      customerName: '',
      employeeName: '',
      branchName: '',
      itemCount: summary.totalItems,
      returnAmount: summary.totalReturnAmount,
      refundAmount: summary.totalRefundAmount,
      reason: '',
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.returnSystemId,
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

  const totalRows = serverPagination?.total ?? 0;
  const pageCount = Math.max(1, serverPagination?.totalPages ?? 1);
  const rowCount = totalRows + 1;

  const chartData = React.useMemo(() => {
    return data.map(row => ({
      name: row.returnSystemId as string,
      label: row.returnId,
      returnAmount: row.returnAmount,
      refundAmount: row.refundAmount,
      itemCount: row.itemCount,
    }));
  }, [data]);

  const dynamicChartConfig = React.useMemo(() => ({
    bars: DISPLAY_OPTIONS.filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color })),
    lines: DISPLAY_OPTIONS.filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 })),
  }), [selectedChartOptions]);

  const exportColumns = React.useMemo(() => [
    { key: 'returnId', label: 'Mã phiếu trả', selected: true },
    { key: 'orderId', label: 'Mã đơn hàng', selected: true },
    { key: 'returnDate', label: 'Ngày trả', selected: true },
    { key: 'customerName', label: 'Khách hàng', selected: true },
    { key: 'employeeName', label: 'Nhân viên', selected: true },
    { key: 'branchName', label: 'Chi nhánh', selected: true },
    { key: 'itemCount', label: 'SL SP', selected: true },
    { key: 'returnAmount', label: 'Tiền trả', selected: true },
    { key: 'refundAmount', label: 'Tiền hoàn', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số phiếu trả', value: summary.totalReturns, icon: RotateCcw },
    { title: 'SL sản phẩm', value: summary.totalItems, icon: Package },
    { title: 'Tiền trả', value: formatCurrency(summary.totalReturnAmount), icon: DollarSign },
    { title: 'Tiền hoàn', value: formatCurrency(summary.totalRefundAmount), icon: TrendingDown }
  ], [summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo trả hàng theo đơn"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo trả hàng theo đơn',
    subtitle: 'Chi tiết từng đơn trả hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Trả hàng theo đơn', href: ROUTES.REPORTS.RETURNS_BY_ORDER, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: ReturnOrderReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.returnId}
        </span>
        <Badge variant="secondary">{row.itemCount + ' SP'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Đơn hàng:</span> {row.orderId || '-'}</div>
        <div><span className="text-muted-foreground">Khách hàng:</span> {row.customerName || '-'}</div>
        <div><span className="text-muted-foreground">Tiền trả:</span> {formatCurrency(row.returnAmount)}</div>
        <div><span className="text-muted-foreground">Tiền hoàn:</span> {formatCurrency(row.refundAmount)}</div>
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

          <div className="space-y-1">
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
            <p className="text-xs text-muted-foreground px-1">
              Biểu đồ theo dữ liệu trang hiện tại ({data.length} phiếu).
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết đơn trả hàng</CardTitle>
                <Button variant="outline" size="sm" type="button">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc ({totalRows})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {totalRows === 0 ? (
                <div className="p-6">
                  <ReportEmptyState title="Không có phiếu trả hàng" />
                </div>
              ) : (
                <ResponsiveDataTable
                  columns={columns}
                  data={sortedData}
                  rowCount={rowCount}
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

export default ReturnOrderReportPage;
