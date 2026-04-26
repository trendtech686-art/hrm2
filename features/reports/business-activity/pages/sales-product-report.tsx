'use client'

/**
 * Sales Product Report Page
 * 
 * B�o c�o b�n h�ng theo s?n ph?m
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
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { useSalesProductReport } from '../hooks/use-sales-report';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, SalesProductReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Package, DollarSign, TrendingUp, Filter, ShoppingCart } from 'lucide-react';
import { ProductImage } from '@/features/products/components/product-image';

// FIX: Use useMemo to ensure consistent rendering
export function useDefaultDateRange(): ReportDateRange {
  return React.useMemo(() => ({
    from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
    to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
  }), []);
}

const getColumns = (): ColumnDef<SalesProductReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'productName',
    accessorKey: 'productName',
    header: 'S?n ph?m',
    size: 200,
    enableSorting: true,
    cell: ({ row }) => (
      <div className={row._isSummary ? 'font-semibold' : ''}>
        {row._isSummary ? 'T?ng' : (
          <div className="flex items-center gap-2">
            <ProductImage
              productSystemId={row.productSystemId}
              productData={{ thumbnailImage: row.thumbnailImage ?? undefined }}
              size="sm"
            />
            <div className="min-w-0">
              <div className="font-medium truncate">{row.productName}</div>
              {row.sku && <div className="text-xs text-muted-foreground">{row.sku}</div>}
            </div>
          </div>
        )}
      </div>
    ),
  },
  {
    id: 'categoryName',
    accessorKey: 'categoryName',
    header: 'Danh m?c',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : (row.categoryName || '-'),
  },
  {
    id: 'quantitySold',
    accessorKey: 'quantitySold',
    header: 'SL b�n',
    size: 80,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.quantitySold}</span>,
  },
  {
    id: 'quantityReturned',
    accessorKey: 'quantityReturned',
    header: 'SL tr?',
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
    header: 'SL th?c',
    size: 80,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{row.netQuantity}</span>,
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
  {
    id: 'averagePrice',
    accessorKey: 'averagePrice',
    header: 'Gi� TB',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.averagePrice)}</span>,
  },
];

const DISPLAY_OPTIONS = [
  { key: 'revenue', label: 'Doanh thu', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'grossProfit', label: 'L?i nhu?n g?p', color: 'var(--chart-2)', type: 'line' as const },
  { key: 'quantitySold', label: 'SL b�n', color: 'var(--chart-3)', type: 'bar' as const },
  { key: 'netQuantity', label: 'SL th?c', color: 'var(--chart-5)', type: 'line' as const },
];

export function SalesProductReportPage() {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(defaultRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['revenue', 'grossProfit']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'revenue', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [productFilter, setProductFilter] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('__all__');
  const [showFilters, setShowFilters] = React.useState(false);
  
  const { data, summary, isLoading, isError, error } = useSalesProductReport(dateRange);
  
  // Unique categories from data
  const categories = React.useMemo(() => {
    const set = new Set<string>();
    data.forEach(r => { if (r.categoryName) set.add(r.categoryName); });
    return Array.from(set).sort();
  }, [data]);
  
  // Filter data
  const filteredData = React.useMemo(() => {
    let result = data;
    if (productFilter) {
      const q = productFilter.toLowerCase();
      result = result.filter(r =>
        r.productName.toLowerCase().includes(q) ||
        (r.sku && r.sku.toLowerCase().includes(q)) ||
        (r.productCode && r.productCode.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== '__all__') {
      result = result.filter(r => (r.categoryName || '-') === categoryFilter);
    }
    return result;
  }, [data, productFilter, categoryFilter]);
  
  // Filtered summary
  const filteredSummary = React.useMemo(() => ({
    productAmount: filteredData.reduce((sum, r) => sum + r.productAmount, 0),
    returnAmount: filteredData.reduce((sum, r) => sum + r.returnAmount, 0),
    revenue: filteredData.reduce((sum, r) => sum + r.revenue, 0),
    grossProfit: filteredData.reduce((sum, r) => sum + r.grossProfit, 0),
  }), [filteredData]);
  
  const tableData = React.useMemo(() => {
    const summaryRow: SalesProductReportRow & { systemId: SystemId; _isSummary: boolean } = {
      productSystemId: '__summary__' as SystemId,
      productName: 'T?ng',
      productCode: '',
      sku: '',
      categoryName: '',
      brandName: '',
      quantitySold: filteredData.reduce((sum, r) => sum + r.quantitySold, 0),
      quantityReturned: filteredData.reduce((sum, r) => sum + r.quantityReturned, 0),
      netQuantity: filteredData.reduce((sum, r) => sum + r.netQuantity, 0),
      productAmount: filteredSummary.productAmount,
      returnAmount: filteredSummary.returnAmount,
      revenue: filteredSummary.revenue,
      grossProfit: filteredSummary.grossProfit,
      averagePrice: 0,
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };
    
    return [summaryRow, ...filteredData.map(row => ({
      ...row,
      systemId: row.productSystemId,
      _isSummary: false,
    }))];
  }, [filteredData, filteredSummary]);
  
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
  
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  
  // Reset page when filter changes
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [productFilter, categoryFilter]);
  
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
    { key: 'productName', label: 'S?n ph?m', selected: true },
    { key: 'sku', label: 'SKU', selected: true },
    { key: 'categoryName', label: 'Danh m?c', selected: true },
    { key: 'quantitySold', label: 'SL b�n', selected: true },
    { key: 'quantityReturned', label: 'SL tr?', selected: true },
    { key: 'netQuantity', label: 'SL th?c', selected: true },
    { key: 'productAmount', label: 'Ti?n h�ng', selected: true },
    { key: 'revenue', label: 'Doanh thu', selected: true },
    { key: 'grossProfit', label: 'L?i nhu?n g?p', selected: true },
    { key: 'averagePrice', label: 'Gi� TB', selected: true },
  ], []);
  
  const summaryCards = React.useMemo(() => [
    { title: 'S? s?n ph?m', value: data.length, icon: Package },
    { title: 'SL b�n ra', value: data.reduce((sum, r) => sum + r.netQuantity, 0), icon: ShoppingCart },
    { title: 'Doanh thu', value: formatCurrency(summary.revenue), icon: TrendingUp },
    { title: 'L?i nhu?n g?p', value: formatCurrency(summary.grossProfit), icon: DollarSign,
      className: summary.grossProfit >= 0 ? 'text-green-600' : 'text-red-500' },
  ], [data, summary]);
  
  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="B�o c�o b�n h�ng theo s?n ph?m"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);
  
  usePageHeader({
    title: 'B�o c�o b�n h�ng theo s?n ph?m',
    subtitle: 'Doanh thu v� s? l??ng b�n t?ng s?n ph?m',
    breadcrumb: [
      { label: 'Trang ch?', href: ROUTES.ROOT },
      { label: 'B�o c�o', href: ROUTES.REPORTS.INDEX },
      { label: 'B�n h�ng theo s?n ph?m', href: ROUTES.REPORTS.SALES_BY_PRODUCT, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });
  
  const columns = React.useMemo(() => getColumns(), []);
  
  const renderMobileCard = (row: SalesProductReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className={row._isSummary ? 'font-semibold' : ''}>
          {row._isSummary ? 'T?ng c?ng' : (
            <div>
              <div className="font-medium">{row.productName}</div>
              {row.sku && <div className="text-xs text-muted-foreground">{row.sku}</div>}
            </div>
          )}
        </div>
        <Badge variant="secondary">{row.netQuantity} SP</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">B�n:</span> {row.quantitySold}</div>
        <div><span className="text-muted-foreground">Tr?:</span> {row.quantityReturned}</div>
        <div><span className="text-muted-foreground">Doanh thu:</span> {formatCurrency(row.revenue)}</div>
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
            <CardTitle>Chi ti?t theo s?n ph?m</CardTitle>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              L?c ({filteredData.length})
            </Button>
          </div>
          {showFilters && (
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t">
              <div className="flex-1 min-w-50 max-w-75">
                <Input
                  placeholder="T�m s?n ph?m, m� SP..."
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
              <div className="w-45">
                <UiSelect value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="T?t c? danh m?c" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">T?t c? danh m?c</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </UiSelect>
              </div>
              {(productFilter || categoryFilter !== '__all__') && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => { setProductFilter(''); setCategoryFilter('__all__'); }}
                >
                  X�a l?c
                </Button>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {filteredData.length === 0 ? (
            <div className="p-6">
              <ReportEmptyState
                title={data.length === 0 ? 'Kh�ng c� d? li?u trong kho?ng th?i gian ?� ch?n' : 'Kh�ng c� d�ng ph� h?p b? l?c'}
              />
            </div>
          ) : (
          <ResponsiveDataTable
            columns={columns}
            data={paginatedData}
            rowCount={filteredData.length + 1}
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

export default SalesProductReportPage;
