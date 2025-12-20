/**
 * Sales Order Report Page
 * 
 * Báo cáo bán hàng theo đơn hàng
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { 
  ReportFilters, 
  ReportSummaryCards,
  ReportHeaderActions,
  SALES_REPORT_GLOSSARY,
  formatCurrency,
} from '../components/index';
import { useOrderStore } from '@/features/orders/store';
import { useCustomerStore } from '@/features/customers/store';
import { useEmployeeStore } from '@/features/employees/store';
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
    header: 'Mã đơn hàng',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => (
      <span className={row._isSummary ? 'font-semibold' : 'text-primary font-medium'}>
        {row._isSummary ? 'Tổng' : row.orderId}
      </span>
    ),
  },
  {
    id: 'orderDate',
    accessorKey: 'orderDate',
    header: 'Ngày đặt',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : (row.orderDate ? format(parseISO(row.orderDate), 'dd/MM/yyyy') : '-'),
  },
  {
    id: 'customerName',
    accessorKey: 'customerName',
    header: 'Khách hàng',
    size: 180,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : row.customerName,
  },
  {
    id: 'employeeName',
    accessorKey: 'employeeName',
    header: 'Nhân viên',
    size: 150,
    enableSorting: true,
    cell: ({ row }) => row._isSummary ? '' : (row.employeeName || '-'),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => {
      if (row._isSummary) return '';
      const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
        'completed': { label: 'Hoàn thành', variant: 'default' },
        'pending': { label: 'Chờ xử lý', variant: 'secondary' },
        'cancelled': { label: 'Đã hủy', variant: 'destructive' },
        'processing': { label: 'Đang xử lý', variant: 'outline' },
      };
      const s = statusMap[row.status] || { label: row.status, variant: 'secondary' as const };
      return <Badge variant={s.variant}>{s.label}</Badge>;
    },
  },
  {
    id: 'productAmount',
    accessorKey: 'productAmount',
    header: 'Tiền hàng',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.productAmount)}</span>,
  },
  {
    id: 'discountAmount',
    accessorKey: 'discountAmount',
    header: 'Giảm giá',
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
    header: 'Tổng tiền',
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
  
  const { data: orders } = useOrderStore();
  const { findById: findCustomerById } = useCustomerStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  
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
      const employee = order.employeeSystemId ? findEmployeeById(order.employeeSystemId) : null;
      
      const productAmount = order.items?.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) || 0;
      const discountAmount = order.discount || 0;
      const totalAmount = order.total || productAmount - discountAmount;
      const paidAmount = order.paidAmount || 0;
      
      return {
        orderSystemId: order.systemId as SystemId,
        orderId: order.id,
        orderDate: order.createdAt || '',
        customerSystemId: order.customerSystemId,
        customerName: customer?.name || order.customerName || 'Khách lẻ',
        employeeSystemId: order.employeeSystemId,
        employeeName: employee?.fullName,
        status: order.status || 'pending',
        itemCount: order.items?.length || 0,
        productAmount,
        discountAmount,
        taxAmount: order.taxAmount || 0,
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
  }, [orders, dateRange, findCustomerById, findEmployeeById]);
  
  const tableData = React.useMemo(() => {
    const summaryRow: SalesOrderReportRow & { systemId: string; _isSummary: boolean } = {
      orderSystemId: '__summary__' as any,
      orderId: 'Tổng',
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
      systemId: '__summary__',
      _isSummary: true,
    };
    
    return [summaryRow, ...data.map(row => ({
      ...row,
      systemId: row.orderSystemId as string,
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
  
  const exportColumns = React.useMemo(() => [
    { key: 'orderId', label: 'Mã đơn hàng', selected: true },
    { key: 'orderDate', label: 'Ngày đặt', selected: true },
    { key: 'customerName', label: 'Khách hàng', selected: true },
    { key: 'employeeName', label: 'Nhân viên', selected: true },
    { key: 'status', label: 'Trạng thái', selected: true },
    { key: 'productAmount', label: 'Tiền hàng', selected: true },
    { key: 'discountAmount', label: 'Giảm giá', selected: true },
    { key: 'totalAmount', label: 'Tổng tiền', selected: true },
  ], []);
  
  const summaryCards = React.useMemo(() => [
    { title: 'Tổng đơn hàng', value: summary.orderCount, icon: FileText },
    { title: 'Tiền hàng', value: formatCurrency(summary.productAmount), icon: ShoppingCart },
    { title: 'Tổng doanh thu', value: formatCurrency(summary.revenue), icon: TrendingUp },
    { title: 'Đã thu', value: formatCurrency(data.reduce((sum, r) => sum + r.paidAmount, 0)), icon: DollarSign },
  ], [summary, data]);
  
  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo bán hàng theo đơn hàng"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={SALES_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);
  
  usePageHeader({
    title: 'Báo cáo bán hàng theo đơn hàng',
    subtitle: 'Chi tiết từng đơn hàng trong kỳ',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Bán hàng theo đơn hàng', href: ROUTES.REPORTS.SALES_BY_ORDER, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });
  
  const columns = React.useMemo(() => getColumns(), []);
  
  const renderMobileCard = (row: SalesOrderReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : 'text-primary'}`}>
          {row._isSummary ? 'Tổng cộng' : row.orderId}
        </span>
        {!row._isSummary && row.status && (
          <Badge variant={row.status === 'completed' ? 'default' : 'secondary'}>
            {row.status === 'completed' ? 'Hoàn thành' : row.status}
          </Badge>
        )}
      </div>
      {!row._isSummary && (
        <div className="text-sm text-muted-foreground">
          {row.customerName} • {row.orderDate ? format(parseISO(row.orderDate), 'dd/MM/yyyy') : '-'}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Tiền hàng:</span> {formatCurrency(row.productAmount)}</div>
        <div><span className="text-muted-foreground">Giảm giá:</span> {formatCurrency(row.discountAmount)}</div>
        <div className="font-medium"><span className="text-muted-foreground">Tổng:</span> {formatCurrency(row.totalAmount)}</div>
        <div><span className="text-muted-foreground">Đã thu:</span> {formatCurrency(row.paidAmount)}</div>
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
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Chi tiết đơn hàng</CardTitle>
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

export default SalesOrderReportPage;
