'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES, generatePath } from '@/lib/router';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { isAfter, isBefore, isSameDay, differenceInMilliseconds } from 'date-fns';
import { useReceiptStore } from '../receipts/store';
import { useAllReceipts } from '../receipts/hooks/use-all-receipts';
import { usePaymentStore } from '../payments/store';
import { useCashbookStore } from './store';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useAllReceiptTypes } from '../settings/receipt-types/hooks/use-all-receipt-types';
import { useAllPaymentTypes } from '../settings/payments/types/hooks/use-all-payment-types';
import { getColumns } from './columns';
import type { CashbookTransaction } from './columns';
import type { Receipt } from '../receipts/types';
import type { Payment } from '../payments/types';
import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter';
import { DataTableDateFilter } from '@/components/data-table/data-table-date-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { DataTableExportDialog } from '@/components/data-table/data-table-export-dialog';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Plus, Minus, BarChart3 } from 'lucide-react';
import { useFuseFilter } from '@/hooks/use-fuse-search';
import { usePageHeader } from '@/contexts/page-header-context';
import { MobileTransactionCard } from './components/mobile-transaction-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMediaQuery } from '@/lib/use-media-query';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { useColumnVisibility } from '@/hooks/use-column-visibility';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
type CashbookTransactionWithBalance = CashbookTransaction & { runningBalance?: number };

export function CashbookPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: receipts } = useAllReceipts();
  const { data: payments } = usePaymentStore();
  const { accounts } = useCashbookStore();
  const { data: branches } = useAllBranches();
  const { data: receiptTypes } = useAllReceiptTypes();
  const { data: paymentTypes } = useAllPaymentTypes();

  const transactions = React.useMemo<CashbookTransaction[]>(() => [...(receipts || []).filter(r => r?.systemId && r.id && r.date && r.accountSystemId && r.status !== 'cancelled').map(r => ({ ...r, type: 'receipt' as const })), ...(payments || []).filter(p => p?.systemId && p.id && p.date && p.accountSystemId && p.status !== 'cancelled').map(p => ({ ...p, type: 'payment' as const }))], [receipts, payments]);

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [accountFilter, setAccountFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('cashbook', {});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'type', 'id']);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 50 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const handleCancel = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleEdit = React.useCallback((t: Receipt | Payment) => { const isR = 'payerType' in t; router.push(generatePath(isR ? ROUTES.FINANCE.RECEIPT_EDIT : ROUTES.FINANCE.PAYMENT_EDIT, { systemId: t.systemId })); }, [router]);
  const columns = React.useMemo(() => getColumns(accounts, handleCancel, router.push), [accounts, handleCancel, router]);

  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => { if (columnDefaultsInitialized.current || !columns.length) return; const dv = ['type', 'id', 'date', 'amount', 'targetName', 'paymentMethodName', 'accountSystemId', 'paymentReceiptTypeName', 'status', 'branchName', 'description', 'runningBalance', 'createdBy', 'createdAt']; const iv: Record<string, boolean> = {}; columns.forEach(c => { iv[c.id!] = c.id === 'select' || c.id === 'actions' || dv.includes(c.id!); }); setColumnVisibility(iv); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); columnDefaultsInitialized.current = true; }, [columns, setColumnVisibility]);

  const fuseOpts = React.useMemo(() => ({ keys: ["id", "description", "targetName", "originalDocumentId", "createdBy"], threshold: 0.3, ignoreLocation: true }), []);
  const searchedTransactions = useFuseFilter(transactions, debouncedGlobalFilter, fuseOpts);

  const confirmCancel = () => { if (idToDelete) { const isR = receipts.some(r => r.systemId === idToDelete); if (isR) useReceiptStore.getState().cancel(idToDelete); else usePaymentStore.getState().cancel(idToDelete); toast.success("Đã hủy giao dịch"); } setIsAlertOpen(false); };
  const confirmBulkCancel = () => { Object.keys(rowSelection).forEach(s => { const sysId = asSystemId(s); const isR = receipts.some(r => r.systemId === sysId); if (isR) useReceiptStore.getState().cancel(sysId); else usePaymentStore.getState().cancel(sysId); }); toast.success(`Đã hủy ${Object.keys(rowSelection).length} giao dịch`); setRowSelection({}); setIsBulkDeleteAlertOpen(false); };

  const typeOptions = React.useMemo(() => [{ value: 'receipt', label: 'Phiếu thu' }, { value: 'payment', label: 'Phiếu chi' }], []);
  const filteredAccounts = React.useMemo(() => { let r = accountFilter === 'all' ? accounts : accounts.filter(a => a.systemId === accountFilter); if (branchFilter !== 'all') r = r.filter(a => a.branchSystemId === branchFilter); return r; }, [accounts, accountFilter, branchFilter]);
  const filteredAccountIds = React.useMemo(() => filteredAccounts.map(a => a.systemId), [filteredAccounts]);

  const { openingBalance, totalReceipts, totalPayments, closingBalance, filteredTransactions } = React.useMemo(() => {
    if (!filteredAccounts.length || !filteredAccountIds.length) return { openingBalance: 0, totalReceipts: 0, totalPayments: 0, closingBalance: 0, filteredTransactions: [] as CashbookTransactionWithBalance[] };
    const startDate = dateRange?.[0] ? new Date(dateRange[0]) : null, endDate = dateRange?.[1] ? new Date(dateRange[1]) : null;
    const oByAcc = new Map<string, number>(); filteredAccounts.forEach(a => oByAcc.set(a.systemId, a.initialBalance));
    const branchAware = transactions.filter(t => filteredAccountIds.includes(t.accountSystemId)).filter(t => branchFilter === 'all' || t.branchSystemId === branchFilter).sort((a, b) => differenceInMilliseconds(new Date(a.date), new Date(b.date)));
    if (startDate) branchAware.forEach(t => { if (isBefore(new Date(t.date), startDate)) { const d = t.type === 'receipt' ? t.amount : -t.amount; oByAcc.set(t.accountSystemId, (oByAcc.get(t.accountSystemId) ?? 0) + d); } });
    const aggOpening = Array.from(oByAcc.values()).reduce((s, v) => s + v, 0);
    let period = branchAware.filter(t => { const d = new Date(t.date); const ms = startDate ? isSameDay(d, startDate) || isAfter(d, startDate) : true, me = endDate ? isSameDay(d, endDate) || isBefore(d, endDate) : true; return ms && me; });
    if (typeFilter.size > 0) period = period.filter(t => typeFilter.has(t.type));
    if (debouncedGlobalFilter) { const ids = new Set(searchedTransactions.map(t => t.systemId)); period = period.filter(t => ids.has(t.systemId)); }
    let tR = 0, tP = 0; period.forEach(t => { if (t.type === 'receipt') tR += t.amount; else tP += t.amount; });
    const rByAcc = new Map(oByAcc); let aggR = aggOpening; const rByT = new Map<string, number>();
    [...period].sort((a, b) => differenceInMilliseconds(new Date(a.date), new Date(b.date))).forEach(t => { const d = t.type === 'receipt' ? t.amount : -t.amount; const u = (rByAcc.get(t.accountSystemId) ?? 0) + d; rByAcc.set(t.accountSystemId, u); aggR += d; rByT.set(t.systemId, accountFilter === 'all' ? aggR : u); });
    const enhanced: CashbookTransactionWithBalance[] = period.map(t => ({ ...t, runningBalance: rByT.get(t.systemId) ?? (accountFilter === 'all' ? aggOpening : oByAcc.get(t.accountSystemId) ?? 0) }));
    return { openingBalance: aggOpening, totalReceipts: tR, totalPayments: tP, closingBalance: aggR, filteredTransactions: enhanced };
  }, [filteredAccounts, filteredAccountIds, branchFilter, transactions, dateRange, typeFilter, debouncedGlobalFilter, searchedTransactions, accountFilter]);

  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, branchFilter, accountFilter, typeFilter, dateRange]);
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < filteredTransactions.length) setMobileLoadedCount(p => Math.min(p + 20, filteredTransactions.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, filteredTransactions.length]);

  const sortedData = React.useMemo(() => { const s = [...filteredTransactions]; if (sorting.id) s.sort((a, b) => { const av = (a as Record<string, unknown>)[sorting.id], bv = (b as Record<string, unknown>)[sorting.id]; if (sorting.id === 'createdAt' || sorting.id === 'date') { const at = av ? new Date(av as string | Date).getTime() : 0, bt = bv ? new Date(bv as string | Date).getTime() : 0; if (at === bt) { const an = parseInt(a.systemId.replace(/\D/g, '')) || 0, bn = parseInt(b.systemId.replace(/\D/g, '')) || 0; return sorting.desc ? bn - an : an - bn; } return sorting.desc ? bt - at : at - bt; } const as = String(av ?? ''), bs = String(bv ?? ''); return sorting.desc ? bs.localeCompare(as) : as.localeCompare(bs); }); return s; }, [filteredTransactions, sorting]);
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const exportConfig = React.useMemo(() => ({ fileName: 'So_quy', columns }), [columns]);

  const headerActions = React.useMemo(() => [<Button key="pay" variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.FINANCE.PAYMENT_NEW)}><Minus className="mr-2 h-4 w-4" />Lập Phiếu Chi</Button>, <Button key="rec" size="sm" className="h-9" onClick={() => router.push(ROUTES.FINANCE.RECEIPT_NEW)}><Plus className="mr-2 h-4 w-4" />Lập Phiếu Thu</Button>], [router]);
  usePageHeader({ title: 'Sổ quỹ', showBackButton: false, breadcrumb: [{ label: 'Trang chủ', href: ROUTES.ROOT }, { label: 'Sổ quỹ', href: ROUTES.FINANCE.CASHBOOK }], actions: headerActions });

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Số dư đầu kỳ</p><p className="text-h5 font-semibold">{formatCurrency(openingBalance)}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Tổng thu</p><p className="text-h5 font-semibold text-emerald-600">{formatCurrency(totalReceipts)}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Tổng chi</p><p className="text-h5 font-semibold text-destructive">{formatCurrency(totalPayments)}</p></CardContent></Card><Card><CardContent className="p-4"><p className="text-h5 font-bold">{formatCurrency(closingBalance)}</p><p className="text-sm text-muted-foreground">Tồn cuối kỳ</p></CardContent></Card></div>
      {!isMobile && <PageToolbar leftActions={<><DataTableExportDialog allData={transactions} filteredData={sortedData} pageData={paginatedData} config={exportConfig} /><Button variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.FINANCE.CASHBOOK_REPORTS)}><BarChart3 className="mr-2 h-4 w-4" />Báo cáo</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} />}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã phiếu, người nhận/chi, chứng từ..."><Select value={branchFilter} onValueChange={setBranchFilter}><SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Chi nhánh" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent></Select><Select value={accountFilter} onValueChange={setAccountFilter}><SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Tài khoản quỹ" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả tài khoản</SelectItem>{accounts.map(a => <SelectItem key={a.systemId} value={a.systemId}>{a.name}</SelectItem>)}</SelectContent></Select><DataTableFacetedFilter title="Loại phiếu" options={typeOptions} selectedValues={typeFilter} onSelectedValuesChange={setTypeFilter} /><DataTableDateFilter value={dateRange} onChange={setDateRange} title="Khoảng thời gian" /></PageFilters>
      {isMobile ? (<div className="space-y-4"><div className="space-y-2">{filteredTransactions.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">Không tìm thấy giao dịch nào.</CardContent></Card> : filteredTransactions.slice(0, mobileLoadedCount).map(t => <MobileTransactionCard key={t.systemId} transaction={t} branches={branches} receiptTypes={receiptTypes} paymentTypes={paymentTypes} onEdit={handleEdit} onCancel={handleCancel} />)}</div>{filteredTransactions.length > 0 && <div className="py-6 text-center">{mobileLoadedCount < filteredTransactions.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải thêm...</span></div> : filteredTransactions.length > 20 && <p className="text-sm text-muted-foreground">Đã hiển thị tất cả {filteredTransactions.length} giao dịch</p>}</div>}</div>) : <ResponsiveDataTable columns={columns} data={paginatedData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={() => setIsBulkDeleteAlertOpen(true)} sorting={sorting} setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} allSelectedRows={sortedData.filter(v => rowSelection[v.systemId])} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={r => router.push(generatePath(r.type === 'receipt' ? ROUTES.FINANCE.RECEIPT_VIEW : ROUTES.FINANCE.PAYMENT_VIEW, { systemId: r.systemId }))} renderMobileCard={r => <MobileTransactionCard transaction={r} branches={branches} receiptTypes={receiptTypes} paymentTypes={paymentTypes} onEdit={handleEdit} onCancel={handleCancel} />} />}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy giao dịch này?</AlertDialogTitle><AlertDialogDescription>Giao dịch sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmCancel}>Hủy giao dịch</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy {Object.keys(rowSelection).length} giao dịch?</AlertDialogTitle><AlertDialogDescription>Các giao dịch sẽ được chuyển sang trạng thái "Đã hủy".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel className="h-9">Đóng</AlertDialogCancel><AlertDialogAction className="h-9" onClick={confirmBulkCancel}>Hủy tất cả</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
