'use client';
/**
 * Payments Page - Thin Page Pattern
 * Target: < 300 lines
 */
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { usePayments, usePaymentMutations, usePaymentStats, type PaymentStats } from './hooks/use-payments';
import { useDebounce } from '@/hooks/use-debounce';
import { useAllPayments } from './hooks/use-all-payments';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useAllPaymentTypes } from '@/features/settings/payments/types/hooks/use-all-payment-types';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { useMeiliEmployeeSearch } from '@/hooks/use-meilisearch';
import type { Payment, PaymentStatus } from '@/lib/types/prisma-extended';
import { usePageHeader } from '@/contexts/page-header-context';
import { ResponsiveDataTable, type BulkAction } from '@/components/data-table/responsive-data-table';
import { Button } from '@/components/ui/button';
import { Minus, ReceiptText, Printer, FileSpreadsheet, Download, Settings, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { useMediaQuery } from '@/lib/use-media-query';
import { ROUTES, generatePath } from '@/lib/router';
import { toast } from 'sonner';

import { getColumns } from './columns';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { MobilePaymentCard } from './card';
import { usePrint } from '@/lib/use-print';
import { convertPaymentForPrint, mapPaymentToPrintData, createStoreSettings } from '@/lib/print/payment-print-helper';
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from '@/hooks/use-column-visibility';
import { StatsBar } from "@/components/shared/stats-bar"
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { formatCurrency, formatNumber } from "@/lib/format-utils"
import { cn } from '@/lib/utils'
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';

const PaymentImportDialog = dynamic(() => import('./components/payment-import-export-dialogs').then(m => ({ default: m.PaymentImportDialog })), { ssr: false });
const PaymentExportDialog = dynamic(() => import('./components/payment-import-export-dialogs').then(m => ({ default: m.PaymentExportDialog })), { ssr: false });

// Props from Server Component
export interface PaymentsPageProps {
  initialStats?: PaymentStats;
}

export function PaymentsPage({ initialStats }: PaymentsPageProps = {}) {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Stats from server component
  const { data: stats } = usePaymentStats(initialStats);
  
  // Search state - for server-side search
  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedFilter = useDebounce(globalFilter, 300);
  const [pagination, setPagination] = usePaginationWithGlobalDefault();

  // Reset pagination when any filter changes
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<SystemId | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = useState(false);
  const [sorting, setSorting] = useState({ id: 'createdAt', desc: true });
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('payments', {});
  const [columnOrder, setColumnOrder] = useColumnOrder('payments');
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('payments', ['select', 'id']);
  const [branchFilter, setBranchFilter] = useState<'all' | SystemId>('all');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<Set<string>>(new Set());
  const [customerFilter, setCustomerFilter] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined] | undefined>();
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [itemsToPrint, setItemsToPrint] = useState<Payment[]>([]);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  // Reset pagination when any filter changes
  useEffect(() => { setPagination(prev => ({ ...prev, pageIndex: 0 })); }, [debouncedFilter, branchFilter, statusFilter, dateRange, setPagination]);
  
  // Derive server-side status filter (single value for API)
  const serverStatus = useMemo(() => statusFilter.size === 1 ? [...statusFilter][0] : undefined, [statusFilter]);

  // Server-side search + filters - API handles filtering & sorting
  const { data: paymentsResponse, isLoading, isFetching } = usePayments({ 
    search: debouncedFilter || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    status: serverStatus as PaymentStatus | undefined,
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    startDate: dateRange?.[0],
    endDate: dateRange?.[1],
    sortBy: sorting.id || 'createdAt',
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });
  const payments = useMemo(() => paymentsResponse?.data ?? [], [paymentsResponse?.data]);
  const serverTotal = paymentsResponse?.pagination?.total ?? 0;
  const serverTotalPages = paymentsResponse?.pagination?.totalPages ?? 1;
  const { cancel: cancelMutation } = usePaymentMutations({
    onCancelSuccess: () => toast.success('Đã hủy phiếu chi'),
    onError: (error) => toast.error(`Lỗi: ${error.message}`),
  });
  // Lazy-load all data only for import/export
  const dialogsOpen = showImportDialog || showExportDialog;
  const { data: allPayments } = useAllPayments({ enabled: dialogsOpen });
  const { accounts } = useAllCashAccounts();
  const { data: branches } = useAllBranches();
  const { data: paymentTypes } = useAllPaymentTypes();
  const { data: employeesData } = useMeiliEmployeeSearch({ query: '', limit: 100 });
  const employees = employeesData?.data ?? [];
  const { print, printMultiple } = usePrint();
  const {  employee, can } = useAuth();
  const canCreate = can('create_payments');
  const _canDelete = can('delete_payments');
  const _canEdit = can('edit_payments');
  const canEditSettings = can('edit_settings');

  // Header actions
  usePageHeader({ title: 'Danh sách phiếu chi', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Phiếu chi', href: '/payments', isCurrent: true }], showBackButton: false, actions: [
    <Button key="cashbook" variant="outline" size="sm" className="gap-2" onClick={() => router.push(ROUTES.FINANCE.CASHBOOK)}><ReceiptText className="h-4 w-4" />Nhật ký quỹ</Button>,
    canCreate && <Button key="add" size="sm" className="gap-2" onClick={() => router.push(ROUTES.FINANCE.PAYMENT_NEW)}><Minus className="mr-2 h-4 w-4" />Tạo phiếu chi</Button>
  ] });

  // Handlers
  const handleCancel = useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  const handleRowClick = useCallback((p: Payment) => router.push(generatePath(ROUTES.FINANCE.PAYMENT_VIEW, { systemId: p.systemId })), [router]);
  const handleSinglePrint = useCallback(async (p: Payment) => { 
    const { storeInfo } = await fetchPrintData();
    const b = branches.find(x => x.systemId === p.branchSystemId); 
    print('payment', { data: mapPaymentToPrintData(convertPaymentForPrint(p, {}), createStoreSettings(b || storeInfo)), lineItems: [] }); 
  }, [branches, print]);
  const confirmCancel = () => { if (idToDelete) { cancelMutation.mutate({ systemId: idToDelete }); } setIsAlertOpen(false); };
  const isCancelling = cancelMutation.isPending;
  const confirmBulkCancel = () => { Object.keys(rowSelection).map(id => asSystemId(id)).forEach(id => cancelMutation.mutate({ systemId: id })); toast.success(`Đã hủy ${Object.keys(rowSelection).length} phiếu chi`); setRowSelection({}); setIsBulkDeleteAlertOpen(false); };

  // Columns
  const columns = useMemo(() => getColumns(accounts, handleCancel, router.push, handleSinglePrint, employees), [accounts, handleCancel, router, handleSinglePrint, employees]);
  const initRef = useRef(false);
  useEffect(() => { if (initRef.current || !columns.length) return; const defaults = ['id', 'date', 'amount', 'recipientName', 'recipientTypeName', 'paymentMethodName', 'accountSystemId', 'paymentReceiptTypeName', 'status', 'branchName', 'description', 'originalDocumentId', 'customerName', 'createdBy', 'createdAt']; const v: Record<string, boolean> = {}; columns.forEach(c => { v[c.id!] = c.id === 'select' || c.id === 'actions' || defaults.includes(c.id!); }); setColumnVisibility(v); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); initRef.current = true; }, [columns, setColumnVisibility, setColumnOrder]);

  // Filter options
  const statusOptions = useMemo(() => [{ value: 'completed', label: 'Hoàn thành' }, { value: 'cancelled', label: 'Đã hủy' }], []);
  const typeOptions = useMemo(() => paymentTypes.map(pt => ({ value: pt.systemId, label: pt.name })), [paymentTypes]);
  // Derive customer filter options from current page data (avoid loading all 4500+ customers)
  const customerOptions = useMemo(() => {
    const seen = new Map<string, string>();
    payments.forEach(p => {
      if (p.customerSystemId && p.customerName && !seen.has(p.customerSystemId)) {
        seen.set(p.customerSystemId, p.customerName);
      }
    });
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [payments]);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('payments');
  const filterConfigs: FilterConfig[] = useMemo(() => [
    { id: 'branch', label: 'Chi nhánh', type: 'select' as const, options: [{ value: 'all', label: 'Tất cả' }, ...branches.map(b => ({ value: b.systemId, label: b.name }))] },
    { id: 'status', label: 'Trạng thái', type: 'multi-select' as const, options: statusOptions },
    { id: 'type', label: 'Loại phiếu', type: 'multi-select' as const, options: typeOptions },
    { id: 'customer', label: 'Khách hàng', type: 'multi-select' as const, options: customerOptions },
    { id: 'dateRange', label: 'Khoảng ngày', type: 'date-range' as const },
  ], [branches, statusOptions, typeOptions, customerOptions]);
  const panelValues = useMemo(() => ({
    branch: branchFilter !== 'all' ? branchFilter : null,
    status: Array.from(statusFilter),
    type: Array.from(typeFilter),
    customer: Array.from(customerFilter),
    dateRange: dateRange ? { from: dateRange[0], to: dateRange[1] } : null,
  }), [branchFilter, statusFilter, typeFilter, customerFilter, dateRange]);
  const handlePanelApply = useCallback((v: Record<string, unknown>) => {
    setBranchFilter(((v.branch as string) || 'all') === 'all' ? 'all' : asSystemId(v.branch as string));
    setStatusFilter(new Set((v.status as string[]) ?? []));
    setTypeFilter(new Set((v.type as string[]) ?? []));
    setCustomerFilter(new Set((v.customer as string[]) ?? []));
    const dr = v.dateRange as { from?: string; to?: string } | null;
    setDateRange(dr ? [dr.from, dr.to] : undefined);
  }, []);

  // ✅ Server-side pagination: only apply lightweight client-side facet filters (type, customer) on current page
  const filteredData = useMemo(() => {
    let r = payments;
    if (typeFilter.size > 0) r = r.filter(p => p.paymentReceiptTypeSystemId && typeFilter.has(p.paymentReceiptTypeSystemId));
    if (customerFilter.size > 0) r = r.filter(p => p.customerSystemId && customerFilter.has(p.customerSystemId));
    return r;
  }, [payments, typeFilter, customerFilter]);

  const allSelectedRows = useMemo(() => payments.filter(v => rowSelection[v.systemId]), [payments, rowSelection]);
  const selectedPayments = useMemo(() => payments.filter(p => rowSelection[p.systemId]), [payments, rowSelection]);

  // Bulk print - ⚡ OPTIMIZED: Lazy load print data only when printing
  const handleBulkPrint = useCallback((rows: Payment[]) => { setItemsToPrint(rows); setPrintDialogOpen(true); }, []);
  const handlePrintConfirm = useCallback(async (opts: SimplePrintOptionsResult) => { if (!itemsToPrint.length) return; const { storeInfo } = await fetchPrintData(); const items = itemsToPrint.map(p => { const b = opts.branchSystemId ? branches.find(x => x.systemId === opts.branchSystemId) : branches.find(x => x.systemId === p.branchSystemId); return { data: mapPaymentToPrintData(convertPaymentForPrint(p, {}), createStoreSettings(b || storeInfo)), lineItems: [], paperSize: opts.paperSize }; }); printMultiple('payment', items); toast.success(`Đang in ${itemsToPrint.length} phiếu chi`); setItemsToPrint([]); setPrintDialogOpen(false); }, [itemsToPrint, branches, printMultiple]);
  const bulkActions: BulkAction<Payment>[] = useMemo(() => [{ label: 'In phiếu', icon: Printer, onSelect: handleBulkPrint }], [handleBulkPrint]);

  // Get mutations for import
  const { create: createMutation, update: updateMutation } = usePaymentMutations();

  // Import handler
  const handleImport = useCallback(async (imported: Partial<Payment>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
    let added = 0, updated = 0, skipped = 0; const errors: Array<{ row: number; message: string }> = [];
    for (let i = 0; i < imported.length; i++) {
      const p = imported[i];
      try {
        const ex = allPayments.find(x => x.id.toLowerCase() === (p.id || '').toLowerCase());
        if (ex) {
          if (mode === 'update-only' || mode === 'upsert') {
            await updateMutation.mutateAsync({ systemId: ex.systemId, data: { ...ex, ...p, systemId: ex.systemId } as Payment });
            updated++;
          } else skipped++;
        } else {
          if (mode === 'insert-only' || mode === 'upsert') {
            await createMutation.mutateAsync(p as Omit<Payment, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>);
            added++;
          } else skipped++;
        }
      } catch (e) { errors.push({ row: i + 1, message: (e as Error).message }); }
    }
    if (added > 0 || updated > 0) toast.success(`Đã import: ${added > 0 ? `${added} phiếu chi mới` : ''}${updated > 0 ? `, ${updated} phiếu cập nhật` : ''}`);
    return { success: added + updated, failed: errors.length, inserted: added, updated, skipped, errors };
  }, [allPayments, createMutation, updateMutation]);

  const pageCount = serverTotalPages;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        className="mb-2"
        items={[
          { key: 'total', label: 'Tổng phiếu chi', value: formatNumber(stats?.total ?? 0) },
          { key: 'totalAmount', label: 'Tổng chi', value: formatCurrency(stats?.totalAmount ?? 0) },
          { key: 'completed', label: 'Đã hoàn thành', value: formatNumber(stats?.completed ?? 0) },
          { key: 'cancelled', label: 'Đã hủy', value: formatNumber(stats?.cancelled ?? 0) },
        ]}
      />

      {!isMobile && <PageToolbar leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/payments')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={[<DataTableColumnCustomizer key="c" columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />]} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã phiếu, người nhận, chứng từ...">
        <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      <div className={cn('w-full py-4', isFetching && !isLoading && 'opacity-70 transition-opacity')}><ResponsiveDataTable columns={columns} data={filteredData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={serverTotal} isLoading={isLoading} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} renderMobileCard={p => <MobilePaymentCard payment={p} onCancel={handleCancel} navigate={path => router.push(path)} handleRowClick={handleRowClick} />} mobileInfiniteScroll /></div>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy phiếu chi?</AlertDialogTitle><AlertDialogDescription>Phiếu chi sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" disabled={isCancelling} onClick={confirmCancel}>{isCancelling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang hủy...</> : 'Hủy phiếu'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy {Object.keys(rowSelection).length} phiếu chi?</AlertDialogTitle><AlertDialogDescription>Các phiếu chi sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" disabled={isCancelling} onClick={confirmBulkCancel}>{isCancelling ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang hủy...</> : 'Hủy tất cả'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={itemsToPrint.length} title="In phiếu chi" />
      <PaymentImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={allPayments} onImport={handleImport} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
      <PaymentExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={allPayments} filteredData={filteredData} currentPageData={filteredData} selectedData={selectedPayments} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
