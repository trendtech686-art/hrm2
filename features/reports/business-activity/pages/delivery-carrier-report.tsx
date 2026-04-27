'use client'

/**
 * DeliveryCarrierReport Page
 *
 * Báo cáo giao hàng theo đối tác vận chuyển
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
import { useDeliveryCarrierReport } from '../hooks/use-delivery-report';
import { useDefaultDateRange } from '../hooks/use-report-hooks';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, DeliveryCarrierReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Truck, TrendingUp, Filter } from 'lucide-react';

const getColumns = (): ColumnDef<DeliveryCarrierReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'carrierName',
    accessorKey: 'carrierName',
    header: 'Đối tác vận chuyển',
    size: 180,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : row.carrierName}
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
    id: 'totalCod',
    accessorKey: 'totalCod',
    header: 'Tổng COD',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.totalCod)}</span>,
  },
  {
    id: 'totalShippingFee',
    accessorKey: 'totalShippingFee',
    header: 'Tổng phí VC',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.totalShippingFee)}</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'totalShipments', label: 'Tổng vận đơn', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'deliveredCount', label: 'Giao thành công', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'failedCount', label: 'Thất bại', color: 'var(--chart-3)', type: 'line' as const },
  { key: 'deliveryRate', label: 'Tỷ lệ giao', color: 'var(--chart-4)', type: 'line' as const }
];

export function DeliveryCarrierReportPage() {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(defaultRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['totalShipments', 'deliveredCount']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'totalShipments', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const { data, isLoading, isError, error } = useDeliveryCarrierReport(dateRange);

  const tableData = React.useMemo(() => {
    const summaryRow: DeliveryCarrierReportRow & { systemId: SystemId; _isSummary: boolean } = {
      carrierName: 'Tổng',
      totalShipments: data.reduce((s, r) => s + (r.totalShipments || 0), 0),
      deliveredCount: data.reduce((s, r) => s + (r.deliveredCount || 0), 0),
      pendingCount: data.reduce((s, r) => s + (r.pendingCount || 0), 0),
      failedCount: data.reduce((s, r) => s + (r.failedCount || 0), 0),
      deliveryRate: 0,
      totalCod: data.reduce((s, r) => s + (r.totalCod || 0), 0),
      totalShippingFee: data.reduce((s, r) => s + (r.totalShippingFee || 0), 0),
      carrierSystemId: '__summary__' as unknown as SystemId,
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.carrierSystemId,
      _isSummary: false,
    }))];
  }, [data]);

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
      name: row.carrierSystemId as string,
      label: row.carrierName,
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
    { key: 'carrierName', label: 'Đối tác vận chuyển', selected: true },
    { key: 'totalShipments', label: 'Tổng vận đơn', selected: true },
    { key: 'deliveredCount', label: 'Giao thành công', selected: true },
    { key: 'pendingCount', label: 'Đang giao', selected: true },
    { key: 'failedCount', label: 'Thất bại', selected: true },
    { key: 'deliveryRate', label: 'Tỷ lệ giao', selected: true },
    { key: 'totalCod', label: 'Tổng COD', selected: true },
    { key: 'totalShippingFee', label: 'Tổng phí VC', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số bản ghi', value: data.length, icon: Truck },
    { title: 'Tổng vận đơn', value: data.reduce((s, r) => s + (r.totalShipments || 0), 0), icon: Truck },
    { title: 'Tổng COD', value: formatCurrency(data.reduce((s, r) => s + (r.totalCod || 0), 0)), icon: TrendingUp }
  ], [data]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo giao hàng theo đối tác vận chuyển"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={DELIVERY_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo giao hàng theo đối tác vận chuyển',
    subtitle: 'Tình hình giao hàng theo từng đối tác',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Giao hàng theo ĐTVC', href: ROUTES.REPORTS.DELIVERY_BY_CARRIER, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: DeliveryCarrierReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.carrierName}
        </span>
        <Badge variant="secondary">{row.totalShipments + ' vận đơn'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Tổng vận đơn:</span> {row.totalShipments}</div>
        <div><span className="text-muted-foreground">Giao thành công:</span> {row.deliveredCount}</div>
        <div><span className="text-muted-foreground">Đang giao:</span> {row.pendingCount}</div>
        <div><span className="text-muted-foreground">Thất bại:</span> {row.failedCount}</div>
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
            <CardTitle>Chi tiết theo đối tác</CardTitle>
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

export default DeliveryCarrierReportPage;
