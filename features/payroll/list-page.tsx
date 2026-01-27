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
import { AlertTriangle, ClipboardList, PlusCircle, ShieldCheck, Wallet, Printer, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { useAllPayrollBatches } from './hooks/use-payroll';
import { PayrollSummaryCards, type PayrollSummaryCard } from './components/summary-cards';
import type { PayrollBatch } from '@/lib/payroll-types';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { PageFilters } from '@/components/layout/page-filters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBatchColumns } from './components/batch-columns';
import { BatchCard } from './components/batch-card';
import { useDefaultPageSize } from '../settings/global/hooks/use-global-settings';
import {
  usePayrollFilters,
  usePayrollBatchActions,
  usePayrollPrint,
  matchesKeyword,
  matchesMonthFilter,
  matchesStatusFilter,
  getMonthKey,
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

export function PayrollListPage() {
  const router = useRouter();
  const { data: batches, isLoading: _isLoading } = useAllPayrollBatches();
  const defaultPageSize = useDefaultPageSize();

  // Use extracted hooks
  const filterState = usePayrollFilters();
  const actions = usePayrollBatchActions();
  const printState = usePayrollPrint();

  // Update pageSize from settings
  React.useEffect(() => {
    filterState.setPagination(p => ({ ...p, pageSize: defaultPageSize }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPageSize]);

  // Columns with actions
  const columns = React.useMemo(() => getBatchColumns({
    navigate: router.push,
    onLock: actions.handleLock,
    onUnlock: actions.handleUnlock,
    onCancel: actions.handleCancel,
  }), [router.push, actions.handleLock, actions.handleUnlock, actions.handleCancel]);

  // Summary cards
  const summaryCards = React.useMemo<PayrollSummaryCard[]>(() => {
    const now = new Date();
    const currentMonthKey = getMonthKey(now);
    const previousMonthKey = getMonthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    const currentMonthTotal = batches
      .filter((batch) => batch.referenceAttendanceMonthKeys.includes(currentMonthKey))
      .reduce((sum, batch) => sum + batch.totalNet, 0);

    const draftCount = batches.filter((batch) => batch.status === 'draft').length;
    const reviewedCount = batches.filter((batch) => batch.status === 'reviewed').length;
    const previousMonthLocked = batches.some(
      (batch) => batch.referenceAttendanceMonthKeys.includes(previousMonthKey) && batch.status === 'locked'
    );

    return [
      { id: 'current-month-total', title: 'Tổng chi phí kỳ hiện tại', value: formatCurrency(currentMonthTotal), description: `Theo ${formatMonthKey(currentMonthKey)}`, icon: Wallet },
      { id: 'pending-review', title: 'Batch cần duyệt', value: draftCount, description: 'Đang ở trạng thái Nháp', icon: ClipboardList },
      { id: 'awaiting-lock', title: 'Chờ khóa', value: reviewedCount, description: 'Đã duyệt, chờ khóa', icon: ShieldCheck },
      previousMonthLocked
        ? { id: 'previous-month-locked', title: 'Kỳ trước đã khóa', value: 'Đã hoàn tất', description: formatMonthKey(previousMonthKey), icon: ShieldCheck }
        : { id: 'previous-month-warning', title: 'Cảnh báo: chưa khóa kỳ trước', value: 'Chưa khóa', description: formatMonthKey(previousMonthKey), icon: AlertTriangle, className: 'border-amber-300 bg-amber-50 dark:bg-amber-950/40' },
    ];
  }, [batches]);

  // Header actions
  const headerActions = React.useMemo(() => [
    <Button key="run" className="h-9" size="sm" onClick={() => router.push(ROUTES.PAYROLL.RUN)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Chạy bảng lương
    </Button>,
  ], [router]);

  // Process and filter batches
  const processedBatches = React.useMemo(() => {
    let result = batches
      .filter((batch) => matchesStatusFilter(batch, filterState.filters.status))
      .filter((batch) => matchesMonthFilter(batch, filterState.filters.monthKey));
    
    if (filterState.debouncedGlobalFilter) {
      result = result.filter((batch) => matchesKeyword(batch, filterState.debouncedGlobalFilter));
    }
    
    if (filterState.sorting.id) {
      result = [...result].sort((a, b) => {
        const aValue = (a as unknown as Record<string, unknown>)[filterState.sorting.id];
        const bValue = (b as unknown as Record<string, unknown>)[filterState.sorting.id];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        if (filterState.sorting.id === 'createdAt' || filterState.sorting.id === 'payrollDate') {
          const aTime = aValue ? new Date(aValue as string | number | Date).getTime() : 0;
          const bTime = bValue ? new Date(bValue as string | number | Date).getTime() : 0;
          return filterState.sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue < bValue) return filterState.sorting.desc ? 1 : -1;
        if (aValue > bValue) return filterState.sorting.desc ? -1 : 1;
        return 0;
      });
    }
    
    return result;
  }, [batches, filterState.filters.status, filterState.filters.monthKey, filterState.debouncedGlobalFilter, filterState.sorting]);

  // Reset pagination on filter change
  React.useEffect(() => {
    filterState.setPagination(p => ({ ...p, pageIndex: 0 }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState.debouncedGlobalFilter, filterState.filters.status, filterState.filters.monthKey]);

  // Pagination
  const pageCount = Math.ceil(processedBatches.length / filterState.pagination.pageSize);
  const paginatedBatches = React.useMemo(() => {
    const start = filterState.pagination.pageIndex * filterState.pagination.pageSize;
    return processedBatches.slice(start, start + filterState.pagination.pageSize);
  }, [processedBatches, filterState.pagination]);

  const allSelectedRows = React.useMemo(() =>
    batches.filter(batch => filterState.rowSelection[batch.systemId]),
    [batches, filterState.rowSelection]
  );

  // Month options for filter
  const monthOptions = React.useMemo(() => {
    const months = new Set<string>();
    batches.forEach(batch => batch.referenceAttendanceMonthKeys.forEach(mk => months.add(mk)));
    return Array.from(months).sort().reverse();
  }, [batches]);

  // Bulk actions
  const bulkActions = React.useMemo(() => [
    { label: 'In bảng lương', icon: Printer, onSelect: () => printState.handleBulkPrint(allSelectedRows) },
    { label: 'Hủy bảng lương', icon: XCircle, onSelect: () => { actions.handleBulkCancel(allSelectedRows); filterState.setRowSelection({}); }, variant: 'destructive' as const },
  ], [printState, allSelectedRows, actions, filterState]);

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
      
      <PageFilters
        searchValue={filterState.globalFilter}
        onSearchChange={filterState.setGlobalFilter}
        searchPlaceholder="Tìm kiếm bảng lương (mã, tiêu đề)..."
      >
        <Select
          value={filterState.filters.status}
          onValueChange={(value) => filterState.setFilters(f => ({ ...f, status: value as 'all' | 'draft' | 'reviewed' | 'locked' | 'cancelled' }))}
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
        
        <Select
          value={filterState.filters.monthKey ?? 'all'}
          onValueChange={(value) => filterState.setFilters(f => ({ ...f, monthKey: value === 'all' ? undefined : value }))}
        >
          <SelectTrigger className="w-full sm:w-40 h-9">
            <SelectValue placeholder="Tháng tham chiếu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tháng</SelectItem>
            {monthOptions.map(mk => (
              <SelectItem key={mk} value={mk}>{formatMonthKey(mk)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageFilters>

      <div className="w-full py-4">
        <ResponsiveDataTable
          columns={columns}
          data={paginatedBatches}
          renderMobileCard={(batch) => (
            <BatchCard batch={batch} actions={{ onLock: actions.handleLock, onUnlock: actions.handleUnlock, onCancel: actions.handleCancel }} />
          )}
          pageCount={pageCount}
          pagination={filterState.pagination}
          setPagination={filterState.setPagination}
          rowCount={processedBatches.length}
          rowSelection={filterState.rowSelection}
          setRowSelection={filterState.setRowSelection}
          allSelectedRows={allSelectedRows}
          expanded={filterState.expanded}
          setExpanded={filterState.setExpanded}
          sorting={filterState.sorting}
          setSorting={filterState.setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>}
          columnVisibility={filterState.columnVisibility}
          setColumnVisibility={filterState.setColumnVisibility}
          columnOrder={filterState.columnOrder}
          setColumnOrder={filterState.setColumnOrder}
          pinnedColumns={filterState.pinnedColumns}
          setPinnedColumns={filterState.setPinnedColumns}
          onRowClick={handleRowClick}
          bulkActions={bulkActions}
          emptyTitle="Chưa có bảng lương nào"
          emptyDescription="Bắt đầu chạy bảng lương để tạo batch mới"
        />
      </div>

      <SimplePrintOptionsDialog
        open={printState.isPrintDialogOpen}
        onOpenChange={printState.setIsPrintDialogOpen}
        onConfirm={(options) => { printState.handlePrintConfirm(options); filterState.setRowSelection({}); }}
        selectedCount={printState.pendingPrintBatches.length}
        title="In bảng lương"
      />
    </div>
  );
}
