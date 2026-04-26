'use client'

/**
 * DeliveryShipmentReport Page
 *
 * Báo cáo giao hàng chi tiết vận đơn — phân trang server.
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, DELIVERY_REPORT_GLOSSARY } from '../components/report-header-actions';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { formatCurrency } from '@/lib/format-utils';
import { useDeliveryShipmentReport } from '../hooks/use-delivery-report';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, DeliveryShipmentReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Package, Truck, TrendingUp, Filter } from 'lucide-react';

// ✅ FIX: Use useMemo to ensure consistent rendering
export function useDefaultDateRange(): ReportDateRange {
  return React.useMemo(() => ({
    from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  }), []);
}

const getColumns = (): ColumnDef<DeliveryShipmentReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'shipmentId',
    accessorKey: 'shipmentId',
    header: 'Mã vận đơn',
    size: 140,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : row.shipmentId}
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
    id: 'carrierName',
    accessorKey: 'carrierName',
    header: 'Đối tác VC',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.carrierName || '-')}</span>,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.status || '-')}</span>,
  },
  {
    id: 'codAmount',
    accessorKey: 'codAmount',
    header: 'COD',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.codAmount)}</span>,
  },
  {
    id: 'shippingFee',
    accessorKey: 'shippingFee',
    header: 'Phí VC',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.shippingFee)}</span>,
  },
  {
    id: 'customerName',
    accessorKey: 'customerName',
    header: 'Khách hàng',
    size: 150,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.customerName || '-')}</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'codAmount', label: 'COD', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'shippingFee', label: 'Phí VC', color: 'var(--chart-2)', type: 'line' as const }
];

export function DeliveryShipmentReportPage() {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(defaultRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['codAmount', 'shippingFee']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'orderId', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  React.useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [dateRange.from, dateRange.to]);

  const { data, summary, pagination: serverPagination, isLoading, isError, error } = useDeliveryShipmentReport(
    dateRange,
    undefined,
    { page: pagination.pageIndex + 1, pageSize: pagination.pageSize },
  );

  const tableData = React.useMemo(() => {
    const summaryRow: DeliveryShipmentReportRow & { systemId: SystemId; _isSummary: boolean } = {
      shipmentId: 'Tổng',
      orderId: '',
      carrierName: '',
      status: '',
      createdDate: '',
      deliveredDate: '',
      codAmount: summary.codAmount,
      shippingFee: summary.shippingFee ?? 0,
      customerName: '',
      deliveryAddress: '',
      shipmentSystemId: '__summary__' as unknown as SystemId,
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.shipmentSystemId,
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
      name: row.shipmentSystemId as string,
      label: row.shipmentId,
      codAmount: row.codAmount,
      shippingFee: row.shippingFee,
    }));
  }, [data]);

  const dynamicChartConfig = React.useMemo(() => ({
    bars: DISPLAY_OPTIONS.filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color })),
    lines: DISPLAY_OPTIONS.filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 })),
  }), [selectedChartOptions]);

  const exportColumns = React.useMemo(() => [
    { key: 'shipmentId', label: 'Mã vận đơn', selected: true },
    { key: 'orderId', label: 'Mã đơn hàng', selected: true },
    { key: 'carrierName', label: 'Đối tác VC', selected: true },
    { key: 'status', label: 'Trạng thái', selected: true },
    { key: 'codAmount', label: 'COD', selected: true },
    { key: 'shippingFee', label: 'Phí VC', selected: true },
    { key: 'customerName', label: 'Khách hàng', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số vận đơn', value: summary.totalShipments, icon: Package },
    { title: 'Tổng COD', value: formatCurrency(summary.codAmount), icon: Truck },
    { title: 'Tổng phí VC', value: formatCurrency(summary.shippingFee ?? 0), icon: TrendingUp }
  ], [summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo giao hàng chi tiết vận đơn"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={DELIVERY_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo giao hàng chi tiết vận đơn',
    subtitle: 'Chi tiết từng vận đơn giao hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Chi tiết vận đơn', href: ROUTES.REPORTS.DELIVERY_BY_SHIPMENT, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: DeliveryShipmentReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.shipmentId}
        </span>
        <Badge variant="secondary">{row.status || 'VĐ'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Mã đơn hàng:</span> {row.orderId}</div>
        <div><span className="text-muted-foreground">Đối tác VC:</span> {row.carrierName}</div>
        <div><span className="text-muted-foreground">Trạng thái:</span> {row.status}</div>
        <div><span className="text-muted-foreground">COD:</span> {formatCurrency(row.codAmount)}</div>
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
              Biểu đồ theo dữ liệu trang hiện tại ({data.length} vận đơn).
            </p>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Chi tiết vận đơn</CardTitle>
                <Button variant="outline" size="sm" type="button">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc ({totalRows})
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {totalRows === 0 ? (
                <div className="p-6">
                  <ReportEmptyState title="Không có vận đơn" />
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

export default DeliveryShipmentReportPage;
