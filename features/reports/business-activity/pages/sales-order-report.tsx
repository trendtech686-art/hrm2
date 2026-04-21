'use client'

/**
 * Sales Order Report Page
 * 
 * B�o c�o b�n h�ng theo don h�ng
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, SALES_REPORT_GLOSSARY } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { ReportQueryBoundary, ReportEmptyState } from '../components/report-page-states';
import { useCustomerFinder } from '@/features/customers/hooks/use-all-customers';
import { useOrdersByDateRange } from '../hooks/use-report-data';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, SalesOrderReportRow } from '../types';
import type { SystemId } from '@/lib/id-types';
import { ShoppingCart, DollarSign, TrendingUp, Filter, FileText } from 'lucide-react';
import { parseISO, isWithinInterval } from 'date-fns';

const getDefaultDateRange = (): ReportDateRange => ({
  from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
});

const getColumns = (): ColumnDef<SalesOrderReportRow & { systemId: string; _isSummary?: boolean }>[] => [
  {
    id: 'orderId',
    accessorKey: 'orderId',
    header: 'M� don h�ng',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={row._isSummary ? 'font-semibold' : 'text-primary font-medium'}>
        {row._isSummary ? 'T?ng' : row.orderId}
      </span>
    ),
  },
  {
    id: 'orderDate',
    accessorKey: 'orderDate',
    header: 'Ng�y d?t',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : (row.orderDate ? format(parseISO(row.orderDate), 'dd/MM/yyyy') : '-'),
  },
  {
    id: 'customerName',
    accessorKey: 'customerName',
    header: 'Kh�ch h�ng',
    size: 180,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : row.customerName,
  },
  {
    id: 'employeeName',
    accessorKey: 'employeeName',
    header: 'Nh�n vi�n',
    size: 150,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : (row.employeeName || '-'),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Tr?ng th�i',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => {
      if (row._isSummary) return '';
      const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        'completed': { label: 'Ho�n th�nh', variant: 'default' },
        'pending': { label: 'Ch? x? l�', variant: 'secondary' },
        'cancelled': { label: 'D� h?y', variant: 'destructive' },
        'processing': { label: 'Dang x? l�', variant: 'outline' },
      };
      const statusKey = row.status ?? '';
      const s = statusMap[statusKey] || { label: row.status || 'N/A', variant: 'secondary' as const };
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  },
  {
    id: 'productAmount',
    accessorKey: 'productAmount',
    header: 'Ti?n h�ng',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.productAmount)}</span>,
  },
  {
    id: 'discountAmount',
    accessorKey: 'discountAmount',
    header: 'Gi?m gi�',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={`text-right block ${row.discountAmount > 0 ? 'text-orange-500' : ''}`}>
        {row.discountAmount > 0 ? `-${formatCurrency(row.discountAmount)}` : '0'}
      </span>
    ),
  },
  {
    id: 'totalAmount',
    accessorKey: 'totalAmount',
    header: 'T?ng ti?n',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.totalAmount)}</span>,
  },
];

export function SalesOrderReportPage() {
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(getDefaultDateRange);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'orderDate', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  const { data: orders = [], isLoading, isError, error } = useOrdersByDateRange(dateRange);
  const { findById: findCustomerById } = useCustomerFinder();
  
  // Process data
  const { data, summary } = React.useMemo(() => {
    const interval = {
      start: parseISO(dateRange.from),
      end: parseISO(dateRange.to),
    };
    
    const filteredOrders = orders.filter(order => {
      const orderDate = order.createdAt ? parseISO(order.createdAt) : null;
      return orderDate && isWithinInterval(orderDate, interval);
    });
    
    const reportData: SalesOrderReportRow[] = filteredOrders.map(order => {
      const customer = order.customerSystemId ? findCustomerById(order.customerSystemId) : null;
      
      const productAmount = order.lineItems?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
      const discountAmount = order.orderDiscount || 0;
      const totalAmount = order.grandTotal || productAmount - discountAmount;
      const paidAmount = order.paidAmount || 0;
      
      return {
        orderSystemId: order.systemId as SystemId,
        orderId: order.id,
        orderDate: order.createdAt || '',
        customerSystemId: order.customerSystemId,
        customerName: customer?.name || order.customerName || 'Kh�ch l?',
        employeeSystemId: order.salespersonSystemId,
        employeeName: order.salesperson || undefined,
        status: order.status || 'pending',
        itemCount: order.lineItems?.length || 0,
        productAmount,
        discountAmount,
        taxAmount: order.tax || 0,
        shippingFee: order.shippingFee || 0,
        totalAmount,
        costOfGoods: 0,
        grossProfit: 0,
        paidAmount,
        debtAmount: totalAmount - paidAmount,
      };
    });
    
    const summaryData = {
      orderCount: reportData.length,
      productAmount: reportData.reduce((sum, r) => sum + r.productAmount, 0),
      returnAmount: 0,
      taxAmount: reportData.reduce((sum, r) => sum + r.taxAmount, 0),
      shippingFee: reportData.reduce((sum, r) => sum + r.shippingFee, 0),
      revenue: reportData.reduce((sum, r) => sum + r.totalAmount, 0),
      grossProfit: 0,
    };
    
    return { data: reportData, summary: summaryData };
  }, [orders, dateRange, findCustomerById]);
  
  const tableData = React.useMemo(() => {
    const summaryRow: SalesOrderReportRow & { systemId: SystemId; _isSummary: boolean } = {
      orderSystemId: '__summary__' as SystemId,
      orderId: 'T?ng',
      orderDate: '',
      customerName: '',
      employeeName: '',
      status: '',
      itemCount: data.reduce((sum, r) => sum + r.itemCount, 0),
      productAmount: summary.productAmount,
      discountAmount: data.reduce((sum, r) => sum + r.discountAmount, 0),
      taxAmount: summary.taxAmount,
      shippingFee: summary.shippingFee,
      totalAmount: summary.revenue,
      costOfGoods: 0,
      grossProfit: 0,
      paidAmount: data.reduce((sum, r) => sum + r.paidAmount, 0),
      debtAmount: data.reduce((sum, r) => sum + r.debtAmount, 0),
      systemId: '__summary__' as SystemId,
      _isSummary: true,
    };
    
    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.orderSystemId,
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
  
  const exportColumns = React.useMemo(() => [
    { key: 'orderId', label: 'M� don h�ng', selected: true },
    { key: 'orderDate', label: 'Ng�y d?t', selected: true },
    { key: 'customerName', label: 'Kh�ch h�ng', selected: true },
    { key: 'employeeName', label: 'Nh�n vi�n', selected: true },
    { key: 'status', label: 'Tr?ng th�i', selected: true },
    { key: 'productAmount', label: 'Ti?n h�ng', selected: true },
    { key: 'discountAmount', label: 'Gi?m gi�', selected: true },
    { key: 'totalAmount', label: 'T?ng ti?n', selected: true },
  ], []);
  
  const summaryCards = React.useMemo(() => [
    { title: 'T?ng don h�ng', value: summary.orderCount, icon: FileText },
    { title: 'Ti?n h�ng', value: formatCurrency(summary.productAmount), icon: ShoppingCart },
    { title: 'T?ng doanh thu', value: formatCurrency(summary.revenue), icon: TrendingUp },
    { title: 'D� thu', value: formatCurrency(data.reduce((sum, r) => sum + r.paidAmount, 0)), icon: DollarSign },
  ], [summary, data]);
  
  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="B�o c�o b�n h�ng theo don h�ng"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);
  
  usePageHeader({
    title: 'B�o c�o b�n h�ng theo don h�ng',
    subtitle: 'Chi ti?t t?ng don h�ng trong k?',
    breadcrumb: [
      { label: 'Trang ch?', href: ROUTES.ROOT },
      { label: 'B�o c�o', href: ROUTES.REPORTS.INDEX },
      { label: 'B�n h�ng theo don h�ng', href: ROUTES.REPORTS.SALES_BY_ORDER, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });
  
  const columns = React.useMemo(() => getColumns(), []);
  
  const renderMobileCard = (row: SalesOrderReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : 'text-primary'}`}>
          {row._isSummary ? 'T?ng c?ng' : row.orderId}
        </span>
        {!row._isSummary && row.status && (
          <Badge variant={row.status === 'completed' ? 'default' : 'secondary'}>
            {row.status === 'completed' ? 'Ho�n th�nh' : row.status}
          </Badge>
        )}
      </div>
      {!row._isSummary && (
        <div className="text-sm text-muted-foreground">
          {row.customerName} . {row.orderDate ? format(parseISO(row.orderDate), 'dd/MM/yyyy') : '-'}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Ti?n h�ng:</span> {formatCurrency(row.productAmount)}</div>
        <div><span className="text-muted-foreground">Gi?m gi�:</span> {formatCurrency(row.discountAmount)}</div>
        <div className="font-medium"><span className="text-muted-foreground">T?ng:</span> {formatCurrency(row.totalAmount)}</div>
        <div><span className="text-muted-foreground">D� thu:</span> {formatCurrency(row.paidAmount)}</div>
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
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Chi ti?t don h�ng</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              L?c ({data.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {data.length === 0 ? (
            <div className="p-6">
              <ReportEmptyState title="Không có đơn hàng trong khoảng thời gian đã chọn" />
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

export default SalesOrderReportPage;
