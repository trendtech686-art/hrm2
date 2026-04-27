'use client'

/**
 * InventoryProductReport Page
 *
 * Báo cáo tồn kho theo sản phẩm
 */

import * as React from 'react';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { useInventoryProductReport } from '../hooks/use-inventory-report';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { InventoryProductReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Package, Warehouse, AlertTriangle, DollarSign, Filter } from 'lucide-react';

const getColumns = (): ColumnDef<InventoryProductReportRow & { systemId: string; _isSummary?: boolean }>[] => [
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
    id: 'categoryName',
    accessorKey: 'categoryName',
    header: 'Danh mục',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.categoryName || '-')}</span>,
  },
  {
    id: 'unit',
    accessorKey: 'unit',
    header: 'ĐVT',
    size: 70,
    enableSorting: true,
    cell: ({ row }) => <span>{row._isSummary ? '' : (row.unit || '-')}</span>,
  },
  {
    id: 'onHand',
    accessorKey: 'onHand',
    header: 'Tồn kho',
    size: 90,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.onHand}</span>,
  },
  {
    id: 'committed',
    accessorKey: 'committed',
    header: 'Đang giữ',
    size: 90,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.committed}</span>,
  },
  {
    id: 'available',
    accessorKey: 'available',
    header: 'Có thể bán',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.available}</span>,
  },
  {
    id: 'costPrice',
    accessorKey: 'costPrice',
    header: 'Giá vốn',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.costPrice)}</span>,
  },
  {
    id: 'inventoryValue',
    accessorKey: 'inventoryValue',
    header: 'Giá trị tồn',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.inventoryValue)}</span>,
  },
  {
    id: 'stockStatus',
    accessorKey: 'stockStatus',
    header: 'Trạng thái',
    size: 110,
    enableSorting: true,
    cell: ({ row }) => {
      if (row._isSummary) return null;
      const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        normal: { label: 'Bình thường', variant: 'default' },
        low_stock: { label: 'Sắp hết', variant: 'secondary' },
        out_of_stock: { label: 'Hết hàng', variant: 'destructive' },
        over_stock: { label: 'Tồn nhiều', variant: 'outline' },
      };
      const s = statusMap[row.stockStatus] || { label: row.stockStatus, variant: 'default' as const };
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  }
];

const DISPLAY_OPTIONS = [
  { key: 'onHand', label: 'Tồn kho', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'available', label: 'Có thể bán', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'inventoryValue', label: 'Giá trị tồn', color: 'var(--chart-3)', type: 'line' as const }
];

export function InventoryProductReportPage() {
  
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['onHand', 'available']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'inventoryValue', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const { data, summary, isLoading, isError, error } = useInventoryProductReport();

  const tableData = React.useMemo(() => {
    const summaryRow: InventoryProductReportRow & { systemId: SystemId; _isSummary: boolean } = {
      productSystemId: '__summary__' as SystemId,
      productName: 'Tổng',
      productCode: '',
      sku: '',
      categoryName: '',
      brandName: '',
      unit: '',
      onHand: summary.totalOnHand,
      committed: summary.totalCommitted,
      inTransit: 0,
      inDelivery: 0,
      available: summary.totalAvailable,
      costPrice: 0,
      inventoryValue: summary.totalInventoryValue,
      reorderLevel: 0,
      stockStatus: 'normal' as const,
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
      onHand: row.onHand,
      available: row.available,
      inventoryValue: row.inventoryValue,
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
    { key: 'categoryName', label: 'Danh mục', selected: true },
    { key: 'unit', label: 'ĐVT', selected: true },
    { key: 'onHand', label: 'Tồn kho', selected: true },
    { key: 'committed', label: 'Đang giữ', selected: true },
    { key: 'available', label: 'Có thể bán', selected: true },
    { key: 'costPrice', label: 'Giá vốn', selected: true },
    { key: 'inventoryValue', label: 'Giá trị tồn', selected: true },
    { key: 'stockStatus', label: 'Trạng thái', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số sản phẩm', value: summary.totalProducts, icon: Package },
    { title: 'Tổng tồn kho', value: summary.totalOnHand, icon: Warehouse },
    { title: 'Giá trị tồn', value: formatCurrency(summary.totalInventoryValue), icon: DollarSign },
    { title: 'Hết hàng', value: summary.outOfStockCount, icon: AlertTriangle }
  ], [summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo tồn kho theo sản phẩm"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo tồn kho theo sản phẩm',
    subtitle: 'Tình hình tồn kho chi tiết theo sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Tồn kho theo SP', href: ROUTES.REPORTS.INVENTORY_BY_PRODUCT, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: InventoryProductReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.productName}
        </span>
        <Badge variant="secondary">{row.onHand + ' ' + (row.unit || 'SP')}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Có thể bán:</span> {row.available}</div>
        <div><span className="text-muted-foreground">Đang giữ:</span> {row.committed}</div>
        <div><span className="text-muted-foreground">Giá vốn:</span> {formatCurrency(row.costPrice)}</div>
        <div><span className="text-muted-foreground">Giá trị:</span> {formatCurrency(row.inventoryValue)}</div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
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
            <CardTitle>Chi tiết tồn kho theo sản phẩm</CardTitle>
            <Button variant="outline" size="sm" type="button">
              <Filter className="h-4 w-4 mr-2" />
              Lọc ({data.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="p-6">
              <ReportEmptyState title="Không có dữ liệu tồn kho" />
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

export default InventoryProductReportPage;
