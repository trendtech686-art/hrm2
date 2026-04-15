'use client'

/**
 * PaymentBranchReport Page
 *
 * Báo cáo thanh toán theo chi nhánh
 */

import * as React from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { DynamicReportChart as ReportChart } from '../components/dynamic-report-chart';
import { ReportFilters } from '../components/report-filters';
import { ReportSummaryCards } from '../components/report-summary-cards';
import { ReportHeaderActions, PAYMENT_REPORT_GLOSSARY } from '../components/report-header-actions';
import { formatCurrency } from '@/lib/format-utils';
import { usePaymentBranchReport } from '../hooks/use-payment-report';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ColumnDef } from '@/components/data-table/types';
import type { ReportDateRange, PaymentBranchReportRow, ChartType } from '../types';
import type { SystemId } from '@/lib/id-types';
import { Building2, DollarSign, TrendingUp, CreditCard, Filter } from 'lucide-react';

const getDefaultDateRange = (): ReportDateRange => ({
  from: format(startOfMonth(subMonths(new Date(), 1)), 'yyyy-MM-dd'),
  to: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
});

const getColumns = (): ColumnDef<PaymentBranchReportRow & { systemId: string; _isSummary?: boolean }>[] => [
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
    id: 'transactionCount',
    accessorKey: 'transactionCount',
    header: 'SL giao dịch',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{row.transactionCount}</span>,
  },
  {
    id: 'totalAmount',
    accessorKey: 'totalAmount',
    header: 'Tổng tiền',
    size: 130,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block font-medium">{formatCurrency(row.totalAmount)}</span>,
  },
  {
    id: 'cashAmount',
    accessorKey: 'cashAmount',
    header: 'Tiền mặt',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.cashAmount)}</span>,
  },
  {
    id: 'cardAmount',
    accessorKey: 'cardAmount',
    header: 'Thẻ',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.cardAmount)}</span>,
  },
  {
    id: 'bankTransferAmount',
    accessorKey: 'bankTransferAmount',
    header: 'Chuyển khoản',
    size: 120,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.bankTransferAmount)}</span>,
  },
  {
    id: 'otherAmount',
    accessorKey: 'otherAmount',
    header: 'Khác',
    size: 100,
    enableSorting: true,
    cell: ({ row }) => <span className="text-right block">{formatCurrency(row.otherAmount)}</span>,
  }
];

const DISPLAY_OPTIONS = [
  { key: 'totalAmount', label: 'Tổng tiền', color: 'var(--chart-1)', type: 'bar' as const },
  { key: 'cashAmount', label: 'Tiền mặt', color: 'var(--chart-2)', type: 'bar' as const },
  { key: 'bankTransferAmount', label: 'Chuyển khoản', color: 'var(--chart-3)', type: 'bar' as const },
  { key: 'transactionCount', label: 'SL giao dịch', color: 'var(--chart-5)', type: 'line' as const }
];

export function PaymentBranchReportPage() {
  const [dateRange, setDateRange] = React.useState<ReportDateRange>(getDefaultDateRange);
  const [chartType, setChartType] = React.useState<ChartType>('combo');
  const [selectedChartOptions, setSelectedChartOptions] = React.useState<string[]>(['totalAmount', 'cashAmount']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'totalAmount', desc: true });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const { data, summary } = usePaymentBranchReport(dateRange);

  const tableData = React.useMemo(() => {
    const summaryRow: PaymentBranchReportRow & { systemId: SystemId; _isSummary: boolean } = {
      branchSystemId: '__summary__' as SystemId,
      branchName: 'Tổng',
      transactionCount: summary.transactionCount,
      totalAmount: summary.totalAmount,
      cashAmount: data.reduce((s, r) => s + r.cashAmount, 0),
      cardAmount: data.reduce((s, r) => s + r.cardAmount, 0),
      bankTransferAmount: data.reduce((s, r) => s + r.bankTransferAmount, 0),
      otherAmount: data.reduce((s, r) => s + r.otherAmount, 0),
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
      totalAmount: row.totalAmount,
      cashAmount: row.cashAmount,
      bankTransferAmount: row.bankTransferAmount,
      transactionCount: row.transactionCount,
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
    { key: 'transactionCount', label: 'SL giao dịch', selected: true },
    { key: 'totalAmount', label: 'Tổng tiền', selected: true },
    { key: 'cashAmount', label: 'Tiền mặt', selected: true },
    { key: 'cardAmount', label: 'Thẻ', selected: true },
    { key: 'bankTransferAmount', label: 'Chuyển khoản', selected: true },
    { key: 'otherAmount', label: 'Khác', selected: true }
  ], []);

  const summaryCards = React.useMemo(() => [
    { title: 'Số chi nhánh', value: data.length, icon: Building2 },
    { title: 'SL giao dịch', value: summary.transactionCount, icon: CreditCard },
    { title: 'Tổng tiền', value: formatCurrency(summary.totalAmount), icon: TrendingUp },
    { title: 'TB/giao dịch', value: formatCurrency(summary.averageAmount), icon: DollarSign }
  ], [data, summary]);

  const headerActions = React.useMemo(() => (
    <ReportHeaderActions
      title="Báo cáo thanh toán theo chi nhánh"
      data={data as unknown as Record<string, unknown>[]}
      columns={exportColumns}
      glossary={PAYMENT_REPORT_GLOSSARY}
    />
  ), [data, exportColumns]);

  usePageHeader({
    title: 'Báo cáo thanh toán theo chi nhánh',
    subtitle: 'Tình hình thanh toán theo từng chi nhánh',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Báo cáo', href: ROUTES.REPORTS.INDEX },
      { label: 'Thanh toán theo CN', href: ROUTES.REPORTS.PAYMENT_BY_BRANCH, isCurrent: true },
    ],
    showBackButton: true,
    actions: [headerActions],
  });

  const columns = React.useMemo(() => getColumns(), []);

  const renderMobileCard = (row: PaymentBranchReportRow & { systemId: string; _isSummary?: boolean }) => (
    <div className={`p-4 space-y-3 ${row._isSummary ? 'bg-muted/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-medium ${row._isSummary ? 'text-base' : ''}`}>
          {row._isSummary ? 'Tổng cộng' : row.branchName}
        </span>
        <Badge variant="secondary">{row.transactionCount + ' GD'}</Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div><span className="text-muted-foreground">Tổng tiền:</span> {formatCurrency(row.totalAmount)}</div>
        <div><span className="text-muted-foreground">Tiền mặt:</span> {formatCurrency(row.cashAmount)}</div>
        <div><span className="text-muted-foreground">Chuyển khoản:</span> {formatCurrency(row.bankTransferAmount)}</div>
        <div><span className="text-muted-foreground">Thẻ:</span> {formatCurrency(row.cardAmount)}</div>
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
            <CardTitle>Chi tiết theo chi nhánh</CardTitle>
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

export default PaymentBranchReportPage;
