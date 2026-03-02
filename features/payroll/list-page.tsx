'use client'

/**
 * PayrollListPage - Refactored thin page for payroll list
 * Handlers extracted to hooks/use-payroll-list-handlers.ts
 * 
 * @see Thin Page Pattern - page.tsx < 300 lines
 */

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ClipboardList, PlusCircle, ShieldCheck, Wallet, Printer, XCircle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { usePayrollBatches } from './hooks/use-payroll';
import { usePayrollStats } from './hooks/use-payroll';
import { PayrollSummaryCards, type PayrollSummaryCard } from './components/summary-cards';
import type { PayrollBatch } from '@/lib/payroll-types';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { PageFilters } from '@/components/layout/page-filters';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBatchColumns } from './components/batch-columns';
import { BatchCard } from './components/batch-card';
import { useDefaultPageSize } from '../settings/global/hooks/use-global-settings';
import {
  usePayrollBatchActions,
  usePayrollPrint,
  formatMonthKey,
} from './hooks/use-payroll-list-handlers';

// Dynamic import for print dialog
const SimplePrintOptionsDialog = dynamic(
  () => import('@/components/shared/simple-print-options-dialog').then(mod => ({ default: mod.SimplePrintOptionsDialog })),
  { ssr: false }
);

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) =>
  typeof value === 'number' ? currencyFormatter.format(value) : '—';

import type { PayrollStatsData } from '@/lib/data/payroll';

export interface PayrollListPageProps {
  initialStats?: PayrollStatsData;
}

export function PayrollListPage({ initialStats }: PayrollListPageProps = {}) {
  const router = useRouter();
  const defaultPageSize = useDefaultPageSize();

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'draft' | 'reviewed' | 'locked' | 'cancelled'>('all');
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: defaultPageSize });
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [statusFilter]);

  // Server-side query
  const { data: payrollData, isLoading: isLoadingPayroll } = usePayrollBatches({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  const batches = React.useMemo(() => payrollData?.data ?? [], [payrollData?.data]);
  const totalRows = payrollData?.pagination?.total ?? 0;
  const pageCount = Math.ceil(totalRows / pagination.pageSize);

  // Lightweight stats API for summary cards
  const { data: stats } = usePayrollStats(initialStats as Record<string, unknown> | undefined);

  // Use extracted hooks
  const actions = usePayrollBatchActions();
  const printState = usePayrollPrint();

  // Update pageSize from settings
  React.useEffect(() => {
    setPagination(p => ({ ...p, pageSize: defaultPageSize }));
  }, [defaultPageSize]);

  // Columns with actions
  const columns = React.useMemo(() => getBatchColumns({
    navigate: router.push,
    onLock: actions.handleLock,
    onUnlock: actions.handleUnlock,
    onCancel: actions.handleCancel,
  }), [router.push, actions.handleLock, actions.handleUnlock, actions.handleCancel]);

  // Summary cards - uses lightweight stats API
  const summaryCards = React.useMemo<PayrollSummaryCard[]>(() => {
    const currentMonthKey = stats?.currentMonthKey ?? '';
    const previousMonthKey = stats?.previousMonthKey ?? '';
    const previousMonthLocked = stats?.previousMonthLocked ?? false;

    return [
      { id: 'current-month-total', title: 'Tổng chi phí kỳ hiện tại', value: formatCurrency(stats?.currentMonthTotal ?? 0), description: `Theo ${formatMonthKey(currentMonthKey)}`, icon: Wallet },
      { id: 'pending-review', title: 'Batch cần duyệt', value: stats?.draftCount ?? 0, description: 'Đang ở trạng thái Nháp', icon: ClipboardList },
      { id: 'awaiting-lock', title: 'Chờ khóa', value: stats?.reviewedCount ?? 0, description: 'Đã duyệt, chờ khóa', icon: ShieldCheck },
      previousMonthLocked
        ? { id: 'previous-month-locked', title: 'Kỳ trước đã khóa', value: 'Đã hoàn tất', description: formatMonthKey(previousMonthKey), icon: ShieldCheck }
        : { id: 'previous-month-warning', title: 'Cảnh báo: chưa khóa kỳ trước', value: 'Chưa khóa', description: formatMonthKey(previousMonthKey), icon: AlertTriangle, className: 'border-amber-300 bg-amber-50 dark:bg-amber-950/40' },
    ];
  }, [stats]);

  // Header actions
  const headerActions = React.useMemo(() => [
    <Button key="run" className="h-9" size="sm" onClick={() => router.push(ROUTES.PAYROLL.RUN)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Chạy bảng lương
    </Button>,
  ], [router]);

  const allSelectedRows = React.useMemo(() =>
    batches.filter(batch => rowSelection[batch.systemId]),
    [batches, rowSelection]
  );

  // Bulk actions
  const bulkActions = React.useMemo(() => [
    { label: 'In bảng lương', icon: Printer, onSelect: () => printState.handleBulkPrint(allSelectedRows) },
    { label: 'Hủy bảng lương', icon: XCircle, onSelect: () => { actions.handleBulkCancel(allSelectedRows); setRowSelection({}); }, variant: 'destructive' as const },
  ], [printState, allSelectedRows, actions]);

  const handleRowClick = (row: PayrollBatch) => {
    router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', row.systemId));
  };

  usePageHeader({
    title: 'Danh sách bảng lương',
    subtitle: 'Theo dõi trạng thái batch, khóa kỳ trước và điều phối chạy lương mỗi tháng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD },
      { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
    ],
    showBackButton: false,
    actions: headerActions,
  });

  return (
    <div className="flex flex-col w-full h-full">
      <PayrollSummaryCards items={summaryCards} />
      
      <PageToolbar leftActions={<Button variant="outline" size="sm" onClick={() => router.push('/settings/employees')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>} />

      <PageFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm bảng lương (mã, tiêu đề)..."
      >
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as 'all' | 'draft' | 'reviewed' | 'locked' | 'cancelled')}
        >
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="reviewed">Đã duyệt</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </PageFilters>

      <div className="w-full py-4">
        <ResponsiveDataTable
          columns={columns}
          data={batches}
          renderMobileCard={(batch) => (
            <BatchCard batch={batch} actions={{ onLock: actions.handleLock, onUnlock: actions.handleUnlock, onCancel: actions.handleCancel }} />
          )}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={totalRows}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={allSelectedRows}
          expanded={expanded}
          setExpanded={setExpanded}
          sorting={sorting}
          setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
          onRowClick={handleRowClick}
          bulkActions={bulkActions}
          emptyTitle="Chưa có bảng lương nào"
          emptyDescription="Bắt đầu chạy bảng lương để tạo batch mới"
          isLoading={isLoadingPayroll}
        />
      </div>

      <SimplePrintOptionsDialog
        open={printState.isPrintDialogOpen}
        onOpenChange={printState.setIsPrintDialogOpen}
        onConfirm={(options) => { printState.handlePrintConfirm(options); setRowSelection({}); }}
        selectedCount={printState.pendingPrintBatches.length}
        title="In bảng lương"
      />
    </div>
  );
}
