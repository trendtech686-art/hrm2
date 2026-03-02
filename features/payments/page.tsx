'use client';
/**
 * Payments Page - Thin Page Pattern
 * Target: < 300 lines
 */
import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { usePayments, usePaymentMutations, usePaymentStats, type PaymentStats } from './hooks/use-payments';
import { useAllPayments } from './hooks/use-all-payments';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useAllPaymentTypes } from '@/features/settings/payments/types/hooks/use-all-payment-types';
import { useAllCustomers } from '@/features/customers/hooks/use-all-customers';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import type { Payment, PaymentStatus } from '@/lib/types/prisma-extended';
import { usePageHeader } from '@/contexts/page-header-context';
import { ResponsiveDataTable, type BulkAction } from '@/components/data-table/responsive-data-table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Minus, ReceiptText, Printer, FileSpreadsheet, Download, CreditCard, DollarSign, CalendarDays, TrendingUp, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useColumnVisibility } from '@/hooks/use-column-visibility';
import { StatsCard, StatsCardGrid } from "@/components/shared/stats-card"
import { formatCurrency, formatNumber } from "@/lib/format-utils"

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
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedFilter, setDebouncedFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  
  // Debounce search
  React.useEffect(() => { const t = setTimeout(() => setDebouncedFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  // State
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('payments', {});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  const [branchFilter, setBranchFilter] = React.useState<'all' | SystemId>('all');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
  const [customerFilter, setCustomerFilter] = React.useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<Payment[]>([]);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  // Reset pagination when any filter changes
  React.useEffect(() => { setPagination(prev => ({ ...prev, pageIndex: 0 })); }, [debouncedFilter, branchFilter, statusFilter, dateRange]);
  
  // Derive server-side status filter (single value for API)
  const serverStatus = React.useMemo(() => statusFilter.size === 1 ? [...statusFilter][0] : undefined, [statusFilter]);

  // Server-side search + filters - API handles filtering & sorting
  const { data: paymentsResponse, isLoading } = usePayments({ 
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
  const payments = React.useMemo(() => paymentsResponse?.data ?? [], [paymentsResponse?.data]);
  const serverTotal = paymentsResponse?.pagination?.total ?? 0;
  const serverTotalPages = paymentsResponse?.pagination?.totalPages ?? 1;
  const { cancel: cancelMutation } = usePaymentMutations({
    onCancelSuccess: () => toast.success('Đã hủy phiếu chi'),
    onError: (error) => toast.error(`Lỗi: ${error.message}`),
  });
  // Lazy-load all data only for import/export
  const { data: allPayments } = useAllPayments({ enabled: showImportDialog || showExportDialog });
  const { accounts } = useAllCashAccounts();
  const { data: branches } = useAllBranches();
  const { data: paymentTypes } = useAllPaymentTypes();
  const { data: customers } = useAllCustomers();
  const { info: storeInfo } = useStoreInfoData();
  const { data: employees } = useAllEmployees();
  const { print, printMultiple } = usePrint();
  const { employee } = useAuth();

  // Header actions
  usePageHeader({ title: 'Danh sách phiếu chi', breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Phiếu chi', href: '/payments', isCurrent: true }], showBackButton: false, actions: [
    <Button key="cashbook" variant="outline" size="sm" className="h-9 gap-2" onClick={() => router.push(ROUTES.FINANCE.CASHBOOK)}><ReceiptText className="h-4 w-4" />Nhật ký quỹ</Button>,
    <Button key="add" size="sm" className="h-9 gap-2" onClick={() => router.push(ROUTES.FINANCE.PAYMENT_NEW)}><Minus className="mr-2 h-4 w-4" />Tạo phiếu chi</Button>
  ] });

  // Handlers
  const handleCancel = React.useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  const handleRowClick = React.useCallback((p: Payment) => router.push(generatePath(ROUTES.FINANCE.PAYMENT_VIEW, { systemId: p.systemId })), [router]);
  const handleSinglePrint = React.useCallback((p: Payment) => { const b = branches.find(x => x.systemId === p.branchSystemId); print('payment', { data: mapPaymentToPrintData(convertPaymentForPrint(p, {}), createStoreSettings(b || storeInfo)), lineItems: [] }); }, [branches, storeInfo, print]);
  const confirmCancel = () => { if (idToDelete) { cancelMutation.mutate({ systemId: idToDelete }); } setIsAlertOpen(false); };
  const confirmBulkCancel = () => { Object.keys(rowSelection).map(id => asSystemId(id)).forEach(id => cancelMutation.mutate({ systemId: id })); toast.success(`Đã hủy ${Object.keys(rowSelection).length} phiếu chi`); setRowSelection({}); setIsBulkDeleteAlertOpen(false); };

  // Columns
  const columns = React.useMemo(() => getColumns(accounts, handleCancel, router.push, handleSinglePrint, employees), [accounts, handleCancel, router, handleSinglePrint, employees]);
  const initRef = React.useRef(false);
  React.useEffect(() => { if (initRef.current || !columns.length) return; const defaults = ['id', 'date', 'amount', 'recipientName', 'recipientTypeName', 'paymentMethodName', 'accountSystemId', 'paymentReceiptTypeName', 'status', 'branchName', 'description', 'originalDocumentId', 'customerName', 'createdBy', 'createdAt']; const v: Record<string, boolean> = {}; columns.forEach(c => { v[c.id!] = c.id === 'select' || c.id === 'actions' || defaults.includes(c.id!); }); setColumnVisibility(v); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); initRef.current = true; }, [columns, setColumnVisibility]);

  // Filter options
  const statusOptions = [{ value: 'completed', label: 'Hoàn thành' }, { value: 'cancelled', label: 'Đã hủy' }];
  const typeOptions = React.useMemo(() => paymentTypes.map(pt => ({ value: pt.systemId, label: pt.name })), [paymentTypes]);
  const customerOptions = React.useMemo(() => customers.map(c => ({ value: c.systemId, label: c.name })), [customers]);

  // ✅ Server-side pagination: only apply lightweight client-side facet filters (type, customer) on current page
  const filteredData = React.useMemo(() => {
    let r = payments;
    if (typeFilter.size > 0) r = r.filter(p => p.paymentReceiptTypeSystemId && typeFilter.has(p.paymentReceiptTypeSystemId));
    if (customerFilter.size > 0) r = r.filter(p => p.customerSystemId && customerFilter.has(p.customerSystemId));
    return r;
  }, [payments, typeFilter, customerFilter]);

  const allSelectedRows = React.useMemo(() => payments.filter(v => rowSelection[v.systemId]), [payments, rowSelection]);
  const selectedPayments = React.useMemo(() => payments.filter(p => rowSelection[p.systemId]), [payments, rowSelection]);

  // Bulk print
  const handleBulkPrint = React.useCallback((rows: Payment[]) => { setItemsToPrint(rows); setPrintDialogOpen(true); }, []);
  const handlePrintConfirm = React.useCallback((opts: SimplePrintOptionsResult) => { if (!itemsToPrint.length) return; const items = itemsToPrint.map(p => { const b = opts.branchSystemId ? branches.find(x => x.systemId === opts.branchSystemId) : branches.find(x => x.systemId === p.branchSystemId); return { data: mapPaymentToPrintData(convertPaymentForPrint(p, {}), createStoreSettings(b || storeInfo)), lineItems: [], paperSize: opts.paperSize }; }); printMultiple('payment', items); toast.success(`Đang in ${itemsToPrint.length} phiếu chi`); setItemsToPrint([]); setPrintDialogOpen(false); }, [itemsToPrint, branches, storeInfo, printMultiple]);
  const bulkActions: BulkAction<Payment>[] = React.useMemo(() => [{ label: 'In phiếu', icon: Printer, onSelect: handleBulkPrint }], [handleBulkPrint]);

  // Get mutations for import
  const { create: createMutation, update: updateMutation } = usePaymentMutations();

  // Import handler
  const handleImport = React.useCallback(async (imported: Partial<Payment>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
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

  // Mobile scroll
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.pageYOffset + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < filteredData.length) setMobileLoadedCount(p => Math.min(p + 20, filteredData.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, filteredData.length]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedFilter, branchFilter, statusFilter, typeFilter, customerFilter, dateRange]);

  const pageCount = serverTotalPages;

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Stats Cards - instant display from Server Component */}
      <StatsCardGrid columns={4} className="mb-2">
        <StatsCard
          title="Tổng phiếu chi"
          value={stats?.total ?? 0}
          icon={CreditCard}
          formatValue={(v) => formatNumber(Number(v))}
        />
        <StatsCard
          title="Tổng chi"
          value={stats?.totalAmount ?? 0}
          icon={TrendingUp}
          formatValue={(v) => formatCurrency(Number(v))}
          variant="danger"
        />
        <StatsCard
          title="Đã hoàn thành"
          value={stats?.completed ?? 0}
          icon={CalendarDays}
          formatValue={(v) => formatNumber(Number(v))}
          variant="info"
        />
        <StatsCard
          title="Đã hủy"
          value={stats?.cancelled ?? 0}
          icon={DollarSign}
          formatValue={(v) => formatNumber(Number(v))}
          variant="warning"
        />
      </StatsCardGrid>

      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => router.push('/settings/payments')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button><Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={[<DataTableColumnCustomizer key="c" columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />]} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã phiếu, người nhận, chứng từ..." leftFilters={<DataTableDateFilter value={dateRange} onChange={setDateRange} />} rightFilters={<><Select value={branchFilter} onValueChange={v => setBranchFilter(v === 'all' ? 'all' : asSystemId(v))}><SelectTrigger className="h-9 w-37.5"><SelectValue placeholder="Chi nhánh" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select><DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /><DataTableFacetedFilter title="Loại phiếu" options={typeOptions} selectedValues={typeFilter} onSelectedValuesChange={setTypeFilter} /><DataTableFacetedFilter title="Khách hàng" options={customerOptions} selectedValues={customerFilter} onSelectedValuesChange={setCustomerFilter} /></>} />
      {isMobile ? <div className="space-y-2 flex-1 overflow-y-auto">{filteredData.length === 0 && !isLoading ? <Card><CardContent className="p-8 text-center text-muted-foreground">Không tìm thấy phiếu chi nào</CardContent></Card> : <>{filteredData.slice(0, mobileLoadedCount).map(p => <MobilePaymentCard key={p.systemId} payment={p} onCancel={handleCancel} navigate={path => router.push(path)} handleRowClick={handleRowClick} />)}{mobileLoadedCount < filteredData.length && <Card><CardContent className="p-4 text-center text-muted-foreground"><div className="flex items-center justify-center gap-2"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" /><span>Đang tải thêm...</span></div></CardContent></Card>}</>}</div> : <div className="w-full py-4"><ResponsiveDataTable columns={columns} data={filteredData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={serverTotal} isLoading={isLoading} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={allSelectedRows} bulkActions={bulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} renderMobileCard={p => <MobilePaymentCard payment={p} onCancel={handleCancel} navigate={path => router.push(path)} handleRowClick={handleRowClick} />} /></div>}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy phiếu chi?</AlertDialogTitle><AlertDialogDescription>Phiếu chi sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmCancel}>Hủy phiếu</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy {Object.keys(rowSelection).length} phiếu chi?</AlertDialogTitle><AlertDialogDescription>Các phiếu chi sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmBulkCancel}>Hủy tất cả</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={itemsToPrint.length} title="In phiếu chi" />
      <PaymentImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={allPayments} onImport={handleImport} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
      <PaymentExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={allPayments} filteredData={filteredData} currentPageData={filteredData} selectedData={selectedPayments} currentUser={{ name: employee?.fullName || 'Hệ thống', systemId: employee?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
