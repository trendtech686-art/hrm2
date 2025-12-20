/**
 * Sales Product Report Page
 * 
 * Báo cáo bán hàng theo sản phẩm
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { 
  ReportChart, 
  ReportFilters, 
  ReportSummaryCards,
  ReportHeaderActions,
  SALES_REPORT_GLOSSARY,
  formatCurrency,
} from '../components/index';
import { useSalesProductReport } from '../hooks/index';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, SalesProductReportRow, ChartType } from '../types';
import { Package, DollarSign, TrendingUp, Filter, ShoppingCart } from 'lucide-react';

const getDefaultDateRange = (): ReportDateRange => ({
  from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
});

const getColumns = (): ColumnDef<SalesProductReportRow & { systemId: string; _isSummary?: boolean }>[] => [
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
    cell: ({ row }) => row._isSummary ? '' : (row.categoryName || '-'),
  },
  {
    id: 'quantitySold',
    accessorKey: 'quantitySold',
    header: 'SL bán',
    size: 80,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.quantitySold}</span>,
  },
  {
    id: 'quantityReturned',
    accessorKey: 'quantityReturned',
    header: 'SL trả',
    size: 80,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={`text-right block ${row.quantityReturned > 0 ? 'text-red-500' : ''}`}>
        {row.quantityReturned > 0 ? `-${row.quantityReturned}` : '0'}
      </span>
    ),
  },
  {
    id: 'netQuantity',
    accessorKey: 'netQuantity',
    header: 'SL thực',
    size: 80,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{row.netQuantity}</span>,
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
  },
  {
    id: 'averagePrice',
    accessorKey: 'averagePrice',
    header: 'Giá TB',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.averagePrice)}</span>,
  },
];

const DISPLAY_OPTIONS = [
  { key: 'revenue', label: 'Doanh thu', color: 'hsl(var(--chart-1))', type: 'bar' as const },
  { key: 'grossProfit', label: 'Lợi nhuận gộp', color: 'hsl(var(--chart-2))', type: 'line' as const },
  { key: 'quantitySold', label: 'SL bán', color: 'hsl(var(--chart-3))', type: 'bar' as const },
  { key: 'netQuantity', label: 'SL thực', color: 'hsl(var(--chart-5))', type: 'line' as const },
];

export function SalesProductReportPage() {
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(getDefaultDateRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['revenue', 'grossProfit']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'revenue', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  const { data, summary } = useSalesProductReport(dateRange);
  
  const tableData = React.useMemo(() => {
    const summaryRow: SalesProductReportRow & { systemId: string; _isSummary: boolean } = {
      productSystemId: '__summary__' as any,
      productName: 'Tổng',
      productCode: '',
      sku: '',
      categoryName: '',
      brandName: '',
      quantitySold: data.reduce((sum, r) => sum + r.quantitySold, 0),
      quantityReturned: data.reduce((sum, r) => sum + r.quantityReturned, 0),
      netQuantity: data.reduce((sum, r) => sum + r.netQuantity, 0),
      productAmount: summary.productAmount,
      returnAmount: summary.returnAmount,
      revenue: summary.revenue,
      grossProfit: summary.grossProfit,
      averagePrice: 0,
      systemId: '__summary__',
      _isSummary: true,
    };
    
    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.productSystemId as string,
      _isSummary: false,
    }))];
  }, [data, summary]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...tableData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        if (a._isSummary) return -1;
        if (b._isSummary) return 1;
        const aVal = (a as any)[sorting.id];
        const bVal = (b as any)[sorting.id];
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
      name: row.productSystemId as string,
      label: row.productName.length > 20 ? row.productName.substring(0, 20) + '...' : row.productName,
      revenue: row.revenue,
      grossProfit: row.grossProfit,
      quantitySold: row.quantitySold,
      netQuantity: row.netQuantity,
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
    { key: 'quantitySold', label: 'SL bán', selected: true },
    { key: 'quantityReturned', label: 'SL trả', selected: true },
    { key: 'netQuantity', label: 'SL thực', selected: true },
    { key: 'productAmount', label: 'Tiền hàng', selected: true },
    { key: 'revenue', label: 'Doanh thu', selected: true },
    { key: 'grossProfit', label: 'Lợi nhuận gộp', selected: true },
    { key: 'averagePrice', label: 'Giá TB', selected: true },
  ], []);
  
  const summaryCards = React.useMemo(() => [
    { title: 'Số sản phẩm', value: data.length, icon: Package },
    { title: 'SL bán ra', value: data.reduce((sum, r) => sum + r.netQuantity, 0), icon: ShoppingCart },
    { title: 'Doanh thu', value: formatCurrency(summary.revenue), icon: TrendingUp },
    { title: 'Lợi nhuận gộp', value: formatCurrency(summary.grossProfit), icon: DollarSign,
      className: summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-500' },
  ], [data, summary]);
  
  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo bán hàng theo sản phẩm"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);
  
  usePageHeader({
    title: 'Báo cáo bán hàng theo sản phẩm',
    subtitle: 'Doanh thu và số lượng bán từng sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Bán hàng theo sản phẩm', href: ROUTES.REPORTS.SALES_BY_PRODUCT, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });
  
  const columns = React.useMemo(() => getColumns(), []);
  
  const renderMobileCard = (row: SalesProductReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className={row._isSummary ? 'font-semibold' : ''}>
          {row._isSummary ? 'Tổng cộng' : (
            <div>
              <div className="font-medium">{row.productName}</div>
              {row.sku && <div className="text-xs text-muted-foreground">{row.sku}</div>}
            </div>
          )}
        </div>
        <Badge variant="secondary">{row.netQuantity} SP</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Bán:</span> {row.quantitySold}</div>
        <div><span className="text-muted-foreground">Trả:</span> {row.quantityReturned}</div>
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
            <CardTitle className="text-base font-medium">Chi tiết theo sản phẩm</CardTitle>
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

export default SalesProductReportPage;
