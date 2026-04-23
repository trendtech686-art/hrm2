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
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { usePayrollBatches, payrollKeys } from './hooks/use-payroll';
import { usePayrollStats } from './hooks/use-payroll';
import { fetchPayrollById } from './api/payroll-api';
import { PayrollSummaryCards, type PayrollSummaryCard } from './components/summary-cards';
import type { PayrollBatch } from '@/lib/payroll-types';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { PageFilters } from '@/components/layout/page-filters';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { getBatchColumns } from './components/batch-columns';
import { BatchCard } from './components/batch-card';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { useDefaultPageSize } from '../settings/global/hooks/use-global-settings';
import {
  usePayrollBatchActions,
  usePayrollPrint,
  formatMonthKey,
} from './hooks/use-payroll-list-handlers';
import { useAuth } from '@/contexts/auth-context';
import { useQueryClient } from '@tanstack/react-query';
import { ListPageShell } from '@/components/layout/page-section';

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
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canCreate = can('create_payroll');
  const canApprove = can('approve_payroll');
  const canEditSettings = can('edit_settings');
  const defaultPageSize = useDefaultPageSize();

  // Filter presets
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('payroll');

  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
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
  }, [advancedFilters]);

  // useTransition for non-urgent filter updates
  const [isFilterPending] = React.useTransition();

  // Server-side query
  const { data: payrollData, isLoading: isLoadingPayroll, isFetching } = usePayrollBatches({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: (advancedFilters.status as string) || undefined,
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

  // Advanced filter configs
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [
      { value: 'draft', label: 'Nháp' },
      { value: 'reviewed', label: 'Đã duyệt' },
      { value: 'locked', label: 'Đã khóa' },
      { value: 'cancelled', label: 'Đã hủy' },
    ] },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], []);

  const panelValues = React.useMemo(() => ({
    status: advancedFilters.status ?? null,
    dateRange: advancedFilters.dateRange ?? null,
  }), [advancedFilters]);

  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);

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
    canCreate && <Button key="run" className="h-9" size="sm" onClick={() => router.push(ROUTES.PAYROLL.RUN)}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Chạy bảng lương
    </Button>,
  ].filter(Boolean), [router, canCreate]);

  const allSelectedRows = React.useMemo(() =>
    batches.filter(batch => rowSelection[batch.systemId]),
    [batches, rowSelection]
  );

  // Bulk actions
  const bulkActions = React.useMemo(() => [
    { label: 'In bảng lương', icon: Printer, onSelect: () => printState.handleBulkPrint(allSelectedRows) },
    ...(canApprove ? [{ label: 'Hủy bảng lương', icon: XCircle, onSelect: () => { actions.handleBulkCancel(allSelectedRows); setRowSelection({}); }, variant: 'destructive' as const }] : []),
  ], [printState, allSelectedRows, actions, canApprove]);

  const handleRowClick = (row: PayrollBatch) => {
    router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', row.systemId));
  };

  const handleRowHover = React.useCallback((row: PayrollBatch) => {
    queryClient.prefetchQuery({
      queryKey: payrollKeys.detail(row.systemId),
      queryFn: () => fetchPayrollById(row.systemId),
      staleTime: 60_000,
    });
  }, [queryClient]);

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
    <ListPageShell>
      <PayrollSummaryCards items={summaryCards} />
      
      {canEditSettings && <PageToolbar leftActions={<Button variant="outline" size="sm" onClick={() => router.push('/settings/employees')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>} />}

      <PageFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm bảng lương (mã, tiêu đề)..."
      >
        <AdvancedFilterPanel
          filters={filterConfigs}
          values={panelValues}
          onApply={handlePanelApply}
          presets={presets.map(p => ({ ...p, filters: p.filters }))}
          onSavePreset={(preset) => savePreset(preset.name, panelValues)}
          onDeletePreset={deletePreset}
          onUpdatePreset={updatePreset}
        />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={cn((isFetching || isFilterPending) && 'opacity-60 pointer-events-none transition-opacity')}>
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
          onRowHover={handleRowHover}
          bulkActions={bulkActions}
          emptyTitle="Chưa có bảng lương nào"
          emptyDescription="Bắt đầu chạy bảng lương để tạo batch mới"
          isLoading={isLoadingPayroll}
        />
      </div>
      </div>

      <SimplePrintOptionsDialog
        open={printState.isPrintDialogOpen}
        onOpenChange={printState.setIsPrintDialogOpen}
        onConfirm={(options) => { printState.handlePrintConfirm(options); setRowSelection({}); }}
        selectedCount={printState.pendingPrintBatches.length}
        title="In bảng lương"
      />
    </ListPageShell>
  );
}
