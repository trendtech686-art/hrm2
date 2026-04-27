'use client'

/**
 * InventoryBranchReport Page
 *
 * Báo cáo tồn kho theo chi nhánh
 */

import * as React from 'react';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { useInventoryBranchReport } from '../hooks/use-inventory-report';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { InventoryBranchReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Building2, Package, AlertTriangle, DollarSign, Filter } from 'lucide-react';

const getColumns = (): ColumnDef<InventoryBranchReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    size: 180,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'Tổng' : row.branchName}
      </div>
    ),
  },
  {
    id: 'totalProducts',
    accessorKey: 'totalProducts',
    header: 'Số SP',
    size: 90,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.totalProducts}</span>,
  },
  {
    id: 'totalOnHand',
    accessorKey: 'totalOnHand',
    header: 'Tồn kho',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.totalOnHand}</span>,
  },
  {
    id: 'totalCommitted',
    accessorKey: 'totalCommitted',
    header: 'Đang giữ',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.totalCommitted}</span>,
  },
  {
    id: 'totalAvailable',
    accessorKey: 'totalAvailable',
    header: 'Có thể bán',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.totalAvailable}</span>,
  },
  {
    id: 'totalInventoryValue',
    accessorKey: 'totalInventoryValue',
    header: 'Giá trị tồn',
    size: 140,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.totalInventoryValue)}</span>,
  },
  {
    id: 'outOfStockCount',
    accessorKey: 'outOfStockCount',
    header: 'Hết hàng',
    size: 90,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.outOfStockCount}</span>,
  },
  {
    id: 'lowStockCount',
    accessorKey: 'lowStockCount',
    header: 'Sắp hết',
    size: 90,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.lowStockCount}</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'totalOnHand', label: 'Tồn kho', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'totalAvailable', label: 'Có thể bán', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'totalInventoryValue', label: 'Giá trị tồn', color: 'var(--chart-3)', type: 'line' as const },
  { key: 'outOfStockCount', label: 'Hết hàng', color: 'var(--chart-4)', type: 'line' as const }
];

export function InventoryBranchReportPage() {
  
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['totalOnHand', 'totalAvailable']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'totalInventoryValue', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const { data, summary, isLoading, isError, error } = useInventoryBranchReport();

  const tableData = React.useMemo(() => {
    const summaryRow: InventoryBranchReportRow & { systemId: SystemId; _isSummary: boolean } = {
      branchSystemId: '__summary__' as SystemId,
      branchName: 'Tổng',
      totalProducts: data.reduce((s, r) => s + r.totalProducts, 0),
      totalOnHand: summary.totalOnHand,
      totalCommitted: data.reduce((s, r) => s + r.totalCommitted, 0),
      totalAvailable: data.reduce((s, r) => s + r.totalAvailable, 0),
      totalInventoryValue: summary.totalInventoryValue,
      outOfStockCount: summary.totalOutOfStock,
      lowStockCount: data.reduce((s, r) => s + r.lowStockCount, 0),
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };

    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.branchSystemId,
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
      name: row.branchSystemId as string,
      label: row.branchName,
      totalOnHand: row.totalOnHand,
      totalAvailable: row.totalAvailable,
      totalInventoryValue: row.totalInventoryValue,
      outOfStockCount: row.outOfStockCount,
    }));
  }, [data]);

  const dynamicChartConfig = React.useMemo(() => ({
    bars: DISPLAY_OPTIONS.filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color })),
    lines: DISPLAY_OPTIONS.filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 })),
  }), [selectedChartOptions]);

  const exportColumns = React.useMemo(() => [
    { key: 'branchName', label: 'Chi nhánh', selected: true },
    { key: 'totalProducts', label: 'Số SP', selected: true },
    { key: 'totalOnHand', label: 'Tồn kho', selected: true },
    { key: 'totalCommitted', label: 'Đang giữ', selected: true },
    { key: 'totalAvailable', label: 'Có thể bán', selected: true },
    { key: 'totalInventoryValue', label: 'Giá trị tồn', selected: true },
    { key: 'outOfStockCount', label: 'Hết hàng', selected: true },
    { key: 'lowStockCount', label: 'Sắp hết', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số chi nhánh', value: summary.totalBranches, icon: Building2 },
    { title: 'Tổng tồn kho', value: summary.totalOnHand, icon: Package },
    { title: 'Giá trị tồn', value: formatCurrency(summary.totalInventoryValue), icon: DollarSign },
    { title: 'Hết hàng', value: summary.totalOutOfStock, icon: AlertTriangle }
  ], [summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo tồn kho theo chi nhánh"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo tồn kho theo chi nhánh',
    subtitle: 'Tình hình tồn kho theo từng chi nhánh',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Tồn kho theo CN', href: ROUTES.REPORTS.INVENTORY_BY_BRANCH, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: InventoryBranchReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.branchName}
        </span>
        <Badge variant="secondary">{row.totalProducts + ' SP'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Tồn kho:</span> {row.totalOnHand}</div>
        <div><span className="text-muted-foreground">Có thể bán:</span> {row.totalAvailable}</div>
        <div><span className="text-muted-foreground">Giá trị:</span> {formatCurrency(row.totalInventoryValue)}</div>
        <div><span className="text-muted-foreground">Hết hàng:</span> {row.outOfStockCount}</div>
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
            <CardTitle>Chi tiết tồn kho theo chi nhánh</CardTitle>
            <Button variant="outline" size="sm">
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

export default InventoryBranchReportPage;
