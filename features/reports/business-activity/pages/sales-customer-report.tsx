'use client'

/**
 * Sales Customer Report Page
 * 
 * B�o c�o b�n h�ng theo kh�ch h�ng
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
import { useSalesCustomerReport } from '../hooks/use-sales-report';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, SalesCustomerReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Users, DollarSign, TrendingUp, Filter, ShoppingCart } from 'lucide-react';

const getDefaultDateRange = (): ReportDateRange => ({
  from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
});

const getColumns = (): ColumnDef<SalesCustomerReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'customerName',
    accessorKey: 'customerName',
    header: 'Kh�ch h�ng',
    size: 200,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'T?ng' : (
          <div>
            <div className="font-medium">{row.customerName}</div>
            {row.customerCode && <div className="text-xs text-muted-foreground">{row.customerCode}</div>}
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'customerGroup',
    accessorKey: 'customerGroup',
    header: 'Nh�m KH',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : (row.customerGroup || '-'),
  },
  {
    id: 'orderCount',
    accessorKey: 'orderCount',
    header: 'SL don h�ng',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.orderCount}</span>,
  },
  {
    id: 'productAmount',
    accessorKey: 'productAmount',
    header: 'Ti?n h�ng',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.productAmount)}</span>,
  },
  {
    id: 'returnAmount',
    accessorKey: 'returnAmount',
    header: 'Ti?n tr? l?i',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={`text-right block ${row.returnAmount < 0 ? 'text-red-500' : ''}`}>
        {row.returnAmount !== 0 ? `-${formatCurrency(Math.abs(row.returnAmount))}` : '0'}
      </span>
    ),
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
    header: 'L?i nhu?n g?p',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={`text-right block font-medium ${row.grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
        {formatCurrency(row.grossProfit)}
      </span>
    ),
  },
];

const DISPLAY_OPTIONS = [
  { key: 'revenue', label: 'Doanh thu', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'grossProfit', label: 'L?i nhu?n g?p', color: 'var(--chart-2)', type: 'line' as const },
  { key: 'productAmount', label: 'Ti?n h�ng', color: 'var(--chart-3)', type: 'bar' as const },
  { key: 'orderCount', label: 'S? don h�ng', color: 'var(--chart-5)', type: 'line' as const },
];

export function SalesCustomerReportPage() {
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(getDefaultDateRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['revenue', 'grossProfit']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'revenue', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  const { data, summary } = useSalesCustomerReport(dateRange);
  
  const tableData = React.useMemo(() => {
    const summaryRow: SalesCustomerReportRow & { systemId: SystemId; _isSummary: boolean } = {
      customerSystemId: '__summary__' as SystemId,
      customerName: 'T?ng',
      customerCode: '',
      customerGroup: '',
      orderCount: summary.orderCount,
      productAmount: summary.productAmount,
      returnAmount: summary.returnAmount,
      taxAmount: summary.taxAmount,
      shippingFee: summary.shippingFee,
      revenue: summary.revenue,
      grossProfit: summary.grossProfit,
      averageOrderValue: 0,
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };
    
    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.customerSystemId,
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
    return data.slice(0, 10).map(row => ({
      name: row.customerSystemId as string,
      label: row.customerName.length > 15 ? row.customerName.substring(0, 15) + '...' : row.customerName,
      revenue: row.revenue,
      grossProfit: row.grossProfit,
      productAmount: row.productAmount,
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
    { key: 'customerName', label: 'Kh�ch h�ng', selected: true },
    { key: 'customerCode', label: 'M� KH', selected: true },
    { key: 'customerGroup', label: 'Nh�m KH', selected: true },
    { key: 'orderCount', label: 'SL don h�ng', selected: true },
    { key: 'productAmount', label: 'Ti?n h�ng', selected: true },
    { key: 'returnAmount', label: 'Ti?n tr? l?i', selected: true },
    { key: 'revenue', label: 'Doanh thu', selected: true },
    { key: 'grossProfit', label: 'L?i nhu?n g?p', selected: true },
  ], []);
  
  const summaryCards = React.useMemo(() => [
    { title: 'S? kh�ch h�ng', value: data.length, icon: Users },
    { title: 'T?ng don h�ng', value: summary.orderCount, icon: ShoppingCart },
    { title: 'Doanh thu', value: formatCurrency(summary.revenue), icon: TrendingUp },
    { title: 'L?i nhu?n g?p', value: formatCurrency(summary.grossProfit), icon: DollarSign,
      className: summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-500' },
  ], [data.length, summary]);
  
  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="B�o c�o b�n h�ng theo kh�ch h�ng"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);
  
  usePageHeader({
    title: 'B�o c�o b�n h�ng theo kh�ch h�ng',
    subtitle: 'Ph�n t�ch doanh thu t? t?ng kh�ch h�ng',
    breadcrumb: [
      { label: 'Trang ch?', href: ROUTES.ROOT },
      { label: 'B�o c�o', href: ROUTES.REPORTS.INDEX },
      { label: 'B�n h�ng theo kh�ch h�ng', href: ROUTES.REPORTS.SALES_BY_CUSTOMER, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });
  
  const columns = React.useMemo(() => getColumns(), []);
  
  const renderMobileCard = (row: SalesCustomerReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className={row._isSummary ? 'font-semibold' : ''}>
          {row._isSummary ? 'T?ng c?ng' : (
            <div>
              <div className="font-medium">{row.customerName}</div>
              {row.customerGroup && <div className="text-xs text-muted-foreground">{row.customerGroup}</div>}
            </div>
          )}
        </div>
        <Badge variant="secondary">{row.orderCount} don</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Ti?n h�ng:</span> {formatCurrency(row.productAmount)}</div>
        <div><span className="text-muted-foreground">Doanh thu:</span> {formatCurrency(row.revenue)}</div>
        <div><span className="text-muted-foreground">Tr? l?i:</span> {formatCurrency(row.returnAmount)}</div>
        <div className={row.grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}>
          <span className="text-muted-foreground">LN g?p:</span> {formatCurrency(row.grossProfit)}
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
            <CardTitle>Chi ti?t theo kh�ch h�ng</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              L?c ({data.length})
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

export default SalesCustomerReportPage;
