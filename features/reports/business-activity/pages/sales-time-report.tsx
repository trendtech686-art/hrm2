/**
 * Sales Time Report Page
 * 
 * Báo cáo hoạt động kinh doanh - Bán hàng theo thời gian
 * UI theo mẫu: biểu đồ combo (cột + đường) + bảng dữ liệu
 */

'use client'

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { useNavigate } from '@/lib/next-compat';
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
import { useSalesTimeReport } from '../hooks/index';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { 
  ReportDateRange, 
  TimeGrouping, 
  GroupByOption,
  SalesTimeReportRow,
  ChartType,
} from '../types';
import { 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  RotateCcw,
  Filter,
  ArrowLeft,
} from 'lucide-react';

// Default date range: current month
const getDefaultDateRange = (): ReportDateRange => ({
  from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
});

// Columns configuration
const getColumns = (showSummary: boolean): ColumnDef<SalesTimeReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'label',
    accessorKey: 'label',
    header: 'Ngày',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={row._isSummary ? 'font-semibold' : 'text-primary'}>
        {row._isSummary ? 'Tổng' : row.label}
      </span>
    ),
  },
  {
    id: 'orderCount',
    accessorKey: 'orderCount',
    header: 'SL đơn hàng',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-right block">{formatCurrency(row.orderCount)}</span>
    ),
  },
  {
    id: 'productAmount',
    accessorKey: 'productAmount',
    header: 'Tiền hàng',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-right block">{formatCurrency(row.productAmount)}</span>
    ),
  },
  {
    id: 'returnAmount',
    accessorKey: 'returnAmount',
    header: 'Tiền hàng trả lại',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={`text-right block ${row.returnAmount < 0 ? 'text-red-500' : ''}`}>
        {row.returnAmount !== 0 ? `-${formatCurrency(Math.abs(row.returnAmount))}` : '0'}
      </span>
    ),
  },
  {
    id: 'taxAmount',
    accessorKey: 'taxAmount',
    header: 'Tiền thuế',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-right block">{formatCurrency(row.taxAmount)}</span>
    ),
  },
  {
    id: 'shippingFee',
    accessorKey: 'shippingFee',
    header: 'Phí giao hàng',
    size: 110,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-right block">{formatCurrency(row.shippingFee)}</span>
    ),
  },
  {
    id: 'revenue',
    accessorKey: 'revenue',
    header: 'Doanh thu',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => (
      <span className="text-right block font-medium">{formatCurrency(row.revenue)}</span>
    ),
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
];

// Chart config
const CHART_CONFIG = {
  bars: [
    { dataKey: 'revenue', name: 'Doanh thu', color: 'hsl(var(--chart-1))' },
  ],
  lines: [
    { dataKey: 'grossProfit', name: 'Lợi nhuận gộp', color: 'hsl(var(--chart-2))', strokeWidth: 2 },
  ],
};

const DISPLAY_OPTIONS = [
  { key: 'revenue', label: 'Doanh thu', color: 'hsl(var(--chart-1))', type: 'bar' as const },
  { key: 'grossProfit', label: 'Lợi nhuận gộp', color: 'hsl(var(--chart-2))', type: 'line' as const },
  { key: 'productAmount', label: 'Tiền hàng', color: 'hsl(var(--chart-3))', type: 'bar' as const },
  { key: 'returnAmount', label: 'Tiền trả lại', color: 'hsl(var(--chart-4))', type: 'bar' as const },
];

export function SalesTimeReportPage() {
  const navigate = useNavigate();
  
  // State
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(getDefaultDateRange);
  const [timeGrouping, setTimeGrouping] = React.useState<TimeGrouping>('day');
  const [groupBy, setGroupBy] = React.useState<GroupByOption>('time');
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['revenue', 'grossProfit']);
  
  // Table state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'label', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  // Get report data
  const { data, summary } = useSalesTimeReport(dateRange, timeGrouping);
  
  // Prepare data for table (add systemId and summary row)
  const tableData = React.useMemo(() => {
    const summaryRow: SalesTimeReportRow & { systemId: string; _isSummary: boolean } = {
      ...summary,
      key: '__summary__',
      label: 'Tổng',
      systemId: '__summary__',
      _isSummary: true,
    };
    
    const dataWithId = data.map(row => ({
      ...row,
      systemId: row.key,
      _isSummary: false,
    }));
    
    return [summaryRow, ...dataWithId];
  }, [data, summary]);
  
  // Sorting
  const sortedData = React.useMemo(() => {
    const sorted = [...tableData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        // Keep summary row at top
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
  
  // Pagination
  const paginatedData = React.useMemo(() => {
    // Summary row is always included
    const summaryRow = sortedData[0];
    const dataRows = sortedData.slice(1);
    
    const start = pagination.pageIndex * pagination.pageSize;
    const pageData = dataRows.slice(start, start + pagination.pageSize);
    
    return [summaryRow, ...pageData];
  }, [sortedData, pagination]);
  
  const pageCount = Math.ceil((data.length) / pagination.pageSize);
  
  // Chart data
  const chartData = React.useMemo(() => {
    return data.map(row => ({
      name: row.key,
      label: row.label,
      revenue: row.revenue,
      grossProfit: row.grossProfit,
      productAmount: row.productAmount,
      returnAmount: Math.abs(row.returnAmount),
    }));
  }, [data]);
  
  // Dynamic chart config based on selected options
  const dynamicChartConfig = React.useMemo(() => {
    const bars = DISPLAY_OPTIONS
      .filter(o => o.type === 'bar' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color }));
    
    const lines = DISPLAY_OPTIONS
      .filter(o => o.type === 'line' && selectedChartOptions.includes(o.key))
      .map(o => ({ dataKey: o.key, name: o.label, color: o.color, strokeWidth: 2 }));
    
    return { bars, lines };
  }, [selectedChartOptions]);
  
  // Export columns
  const exportColumns = React.useMemo(() => [
    { key: 'label', label: 'Ngày', selected: true },
    { key: 'orderCount', label: 'SL đơn hàng', selected: true },
    { key: 'productAmount', label: 'Tiền hàng', selected: true },
    { key: 'returnAmount', label: 'Tiền hàng trả lại', selected: true },
    { key: 'taxAmount', label: 'Tiền thuế', selected: true },
    { key: 'shippingFee', label: 'Phí giao hàng', selected: true },
    { key: 'revenue', label: 'Doanh thu', selected: true },
    { key: 'grossProfit', label: 'Lợi nhuận gộp', selected: true },
  ], []);
  
  // Summary cards
  const summaryCards = React.useMemo(() => [
    {
      title: 'Tổng đơn hàng',
      value: summary.orderCount,
      icon: ShoppingCart,
    },
    {
      title: 'Tiền hàng',
      value: formatCurrency(summary.productAmount),
      icon: DollarSign,
    },
    {
      title: 'Doanh thu',
      value: formatCurrency(summary.revenue),
      icon: TrendingUp,
    },
    {
      title: 'Lợi nhuận gộp',
      value: formatCurrency(summary.grossProfit),
      icon: TrendingUp,
      className: summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-500',
    },
  ], [summary]);
  
  // Header actions
  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo hoạt động kinh doanh"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);
  
  // Page header
  usePageHeader({
    title: 'Báo cáo bán hàng theo thời gian',
    subtitle: 'Ghi nhận theo ngày giao hàng thành công',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Bán hàng theo thời gian', href: ROUTES.REPORTS.SALES_BY_TIME, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });
  
  // Columns
  const columns = React.useMemo(() => getColumns(true), []);
  
  // Mobile card renderer
  const renderMobileCard = (row: SalesTimeReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : 'text-primary'}`}>
          {row._isSummary ? 'Tổng cộng' : row.label}
        </span>
        <Badge variant="secondary">{row.orderCount} đơn</Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span className="text-muted-foreground">Tiền hàng:</span>
          <span className="ml-2 font-medium">{formatCurrency(row.productAmount)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Trả lại:</span>
          <span className="ml-2 text-red-500">{row.returnAmount !== 0 ? `-${formatCurrency(Math.abs(row.returnAmount))}` : '0'}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Doanh thu:</span>
          <span className="ml-2 font-medium">{formatCurrency(row.revenue)}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Lợi nhuận:</span>
          <span className={`ml-2 font-medium ${row.grossProfit >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {formatCurrency(row.grossProfit)}
          </span>
        </div>
      </div>
    </div>
  );
  
  // Handle group by change - navigate to different report
  const handleGroupByChange = (newGroupBy: GroupByOption) => {
    setGroupBy(newGroupBy);
    // Could navigate to different page based on groupBy
    // For now, just update state
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* Filters - inline without card wrapper */}
      <ReportFilters
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        groupBy={groupBy}
        onGroupByChange={handleGroupByChange}
        reportCategory="sales"
        timeGrouping={timeGrouping}
        onTimeGroupingChange={setTimeGrouping}
        showReportType={false}
      />
      
      {/* Chart */}
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
      
      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">
              Chi tiết theo {timeGrouping === 'day' ? 'ngày' : timeGrouping === 'week' ? 'tuần' : timeGrouping === 'month' ? 'tháng' : timeGrouping}
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Lọc kết quả ({data.length})
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

export default SalesTimeReportPage;
