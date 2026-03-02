'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, generatePath } from '@/lib/router';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useAllCashbookData } from './hooks/use-all-cashbook-data';
import { useReceiptMutations } from '../receipts/hooks/use-receipts';
import { usePaymentMutations } from '../payments/hooks/use-payments';
import { useAllCashAccounts } from './hooks/use-all-cash-accounts';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useAllReceiptTypes } from '../settings/receipt-types/hooks/use-all-receipt-types';
import { useAllPaymentTypes } from '../settings/payments/types/hooks/use-all-payment-types';
import { getColumns } from './columns';
import type { CashbookTransaction } from './columns';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { DataTableExportDialog } from '@/components/data-table/data-table-export-dialog';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Minus, BarChart3, Settings } from 'lucide-react';
import { usePageHeader } from '@/contexts/page-header-context';
import { MobileTransactionCard } from './components/mobile-transaction-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMediaQuery } from '@/lib/use-media-query';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { useColumnVisibility } from '@/hooks/use-column-visibility';
import type { CashbookStatsData } from '@/lib/data/cashbook';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

export interface CashbookPageProps {
  initialStats?: CashbookStatsData;
}

export function CashbookPage({ initialStats }: CashbookPageProps = {}) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Filter states - declare first so they can be used in data hooks
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [accountFilter, setAccountFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>(undefined);
  
  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  // ✅ Auto-paginated: fetches ALL transactions for the filtered date range
  const { data: cashbookData, isLoading } = useAllCashbookData({
    startDate: dateRange?.[0],
    endDate: dateRange?.[1],
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    accountId: accountFilter !== 'all' ? accountFilter : undefined,
    search: debouncedGlobalFilter || undefined,
  });

  // Settings data — auto-paginated
  const { accounts } = useAllCashAccounts();
  const { data: branches } = useAllBranches();
  const { data: receiptTypes } = useAllReceiptTypes();
  const { data: paymentTypes } = useAllPaymentTypes();

  // Extract transactions from server response
  const transactions = React.useMemo<CashbookTransaction[]>(() => {
    if (!cashbookData?.transactions) return [];
    let filtered = cashbookData.transactions as CashbookTransaction[];
    // Apply type filter client-side (simple filter on already server-filtered data)
    if (typeFilter.size > 0) {
      filtered = filtered.filter(t => typeFilter.has(t.type));
    }
    return filtered;
  }, [cashbookData?.transactions, typeFilter]);

  // Extract summary from server (with initialStats fallback for instant display)
  const { openingBalance, totalReceipts, totalPayments, closingBalance } = React.useMemo(() => {
    if (cashbookData?.summary) {
      return cashbookData.summary;
    }
    if (initialStats) {
      return initialStats;
    }
    return { openingBalance: 0, totalReceipts: 0, totalPayments: 0, closingBalance: 0 };
  }, [cashbookData?.summary, initialStats]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('cashbook', {});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'type', 'id']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 50 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  const handleCancel = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleEdit = React.useCallback((t: CashbookTransaction) => { const isR = t.type === 'receipt'; router.push(generatePath(isR ? ROUTES.FINANCE.RECEIPT_EDIT : ROUTES.FINANCE.PAYMENT_EDIT, { systemId: t.systemId })); }, [router]);
  const columns = React.useMemo(() => getColumns(accounts, handleCancel, router.push), [accounts, handleCancel, router]);

  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => { if (columnDefaultsInitialized.current || !columns.length) return; const dv = ['type', 'id', 'date', 'amount', 'targetName', 'paymentMethodName', 'accountSystemId', 'paymentReceiptTypeName', 'status', 'branchName', 'description', 'runningBalance', 'createdBy', 'createdAt']; const iv: Record<string, boolean> = {}; columns.forEach(c => { iv[c.id!] = c.id === 'select' || c.id === 'actions' || dv.includes(c.id!); }); setColumnVisibility(iv); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); columnDefaultsInitialized.current = true; }, [columns, setColumnVisibility]);

  const { cancel: cancelReceipt } = useReceiptMutations({
    onCancelSuccess: () => toast.success("Đã hủy giao dịch"),
    onError: (err) => toast.error(err.message || "Lỗi khi hủy giao dịch")
  });
  const { cancel: cancelPayment } = usePaymentMutations({
    onCancelSuccess: () => toast.success("Đã hủy giao dịch"),
    onError: (err) => toast.error(err.message || "Lỗi khi hủy giao dịch")
  });

  const confirmCancel = () => { 
    if (idToDelete) { 
      const isR = transactions.some(t => t.systemId === idToDelete && t.type === 'receipt'); 
      if (isR) cancelReceipt.mutate({ systemId: idToDelete }); 
      else cancelPayment.mutate({ systemId: idToDelete }); 
    } 
    setIsAlertOpen(false); 
  };
  const confirmBulkCancel = () => { 
    Object.keys(rowSelection).forEach(s => { 
      const sysId = asSystemId(s); 
      const isR = transactions.some(t => t.systemId === sysId && t.type === 'receipt'); 
      if (isR) cancelReceipt.mutate({ systemId: sysId }); 
      else cancelPayment.mutate({ systemId: sysId }); 
    }); 
    toast.success(`Đã hủy ${Object.keys(rowSelection).length} giao dịch`); 
    setRowSelection({}); 
    setIsBulkDeleteAlertOpen(false); 
  };

  const typeOptions = React.useMemo(() => [{ value: 'receipt', label: 'Phiếu thu' }, { value: 'payment', label: 'Phiếu chi' }], []);

  // Data from server is already filtered, just need to sort client-side
  const sortedData = React.useMemo(() => { 
    const s = [...transactions]; 
    if (sorting.id) s.sort((a, b) => { 
      const av = (a as unknown as Record<string, unknown>)[sorting.id], bv = (b as unknown as Record<string, unknown>)[sorting.id]; 
      if (sorting.id === 'createdAt' || sorting.id === 'date') { 
        const at = av ? new Date(av as string | Date).getTime() : 0, bt = bv ? new Date(bv as string | Date).getTime() : 0; 
        if (at === bt) { 
          const an = parseInt(a.systemId.replace(/\D/g, '')) || 0, bn = parseInt(b.systemId.replace(/\D/g, '')) || 0; 
          return sorting.desc ? bn - an : an - bn; 
        } 
        return sorting.desc ? bt - at : at - bt; 
      } 
      const as = String(av ?? ''), bs = String(bv ?? ''); 
      return sorting.desc ? bs.localeCompare(as) : as.localeCompare(bs); 
    }); 
    return s; 
  }, [transactions, sorting]);

  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, branchFilter, accountFilter, typeFilter, dateRange]);
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < sortedData.length) setMobileLoadedCount(p => Math.min(p + 20, sortedData.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, sortedData.length]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const exportConfig = React.useMemo(() => ({ fileName: 'So_quy', columns }), [columns]);

  const headerActions = React.useMemo(() => [<Button key="pay" variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.FINANCE.PAYMENT_NEW)}><Minus className="mr-2 h-4 w-4" />Lập Phiếu Chi</Button>, <Button key="rec" size="sm" className="h-9" onClick={() => router.push(ROUTES.FINANCE.RECEIPT_NEW)}><Plus className="mr-2 h-4 w-4" />Lập Phiếu Thu</Button>], [router]);
  const breadcrumb = React.useMemo(() => [{ label: 'Trang chủ', href: ROUTES.ROOT }, { label: 'Sổ quỹ', href: ROUTES.FINANCE.CASHBOOK }], []);
  usePageHeader({ title: 'Sổ quỹ', showBackButton: false, breadcrumb, actions: headerActions });

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Số dư đầu kỳ</p><p className="text-h2 font-semibold">{formatCurrency(openingBalance)}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng thu</p><p className="text-h2 font-semibold text-green-600">{formatCurrency(totalReceipts)}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng chi</p><p className="text-h2 font-semibold text-red-600">{formatCurrency(totalPayments)}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tồn cuối kỳ</p><p className="text-h2 font-semibold">{formatCurrency(closingBalance)}</p></CardContent></Card></div>
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => router.push('/settings/payments')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button><DataTableExportDialog allData={transactions} filteredData={sortedData} pageData={paginatedData} config={exportConfig} /><Button variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.FINANCE.CASHBOOK_REPORTS)}><BarChart3 className="mr-2 h-4 w-4" />Báo cáo</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã phiếu, người nhận/chi, chứng từ..."><Select value={branchFilter} onValueChange={setBranchFilter}><SelectTrigger className="h-9 w-full sm:w-45"><SelectValue placeholder="Chi nhánh" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select><Select value={accountFilter} onValueChange={setAccountFilter}><SelectTrigger className="h-9 w-full sm:w-45"><SelectValue placeholder="Tài khoản quỹ" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả tài khoản</SelectItem>{accounts.map(a => <SelectItem key={a.systemId} value={a.systemId}>{a.name}</SelectItem>)}</SelectContent></Select><DataTableFacetedFilter title="Loại phiếu" options={typeOptions} selectedValues={typeFilter} onSelectedValuesChange={setTypeFilter} /><DataTableDateFilter value={dateRange} onChange={setDateRange} title="Khoảng thời gian" /></PageFilters>
      {isMobile ? (<div className="space-y-4"><div className="space-y-2">{sortedData.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">{isLoading ? 'Đang tải...' : 'Không tìm thấy giao dịch nào.'}</CardContent></Card> : sortedData.slice(0, mobileLoadedCount).map(t => <MobileTransactionCard key={t.systemId} transaction={t} branches={branches} receiptTypes={receiptTypes} paymentTypes={paymentTypes} onEdit={handleEdit} onCancel={handleCancel} />)}</div>{sortedData.length > 0 && <div className="py-6 text-center">{mobileLoadedCount < sortedData.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải thêm...</span></div> : sortedData.length > 20 && <p className="text-sm text-muted-foreground">Đã hiển thị tất cả {sortedData.length} giao dịch</p>}</div>}</div>) : <ResponsiveDataTable columns={columns} data={paginatedData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} isLoading={isLoading} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={sortedData.filter(v => rowSelection[v.systemId])} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={r => router.push(generatePath(r.type === 'receipt' ? ROUTES.FINANCE.RECEIPT_VIEW : ROUTES.FINANCE.PAYMENT_VIEW, { systemId: r.systemId }))} renderMobileCard={r => <MobileTransactionCard transaction={r} branches={branches} receiptTypes={receiptTypes} paymentTypes={paymentTypes} onEdit={handleEdit} onCancel={handleCancel} />} />}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy giao dịch này?</AlertDialogTitle><AlertDialogDescription>Giao dịch sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmCancel}>Hủy giao dịch</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy {Object.keys(rowSelection).length} giao dịch?</AlertDialogTitle><AlertDialogDescription>Các giao dịch sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmBulkCancel}>Hủy tất cả</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
