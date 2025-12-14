import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES, generatePath } from '../../lib/router.ts';
import { asSystemId, type SystemId } from '../../lib/id-types.ts';
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils.ts';
import { isAfter, isBefore, isSameDay, differenceInMilliseconds } from 'date-fns';
import { useReceiptStore } from '../receipts/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import { useCashbookStore } from './store.ts';
import { useBranchStore } from "../settings/branches/store.ts";
import { useReceiptTypeStore } from "../settings/receipt-types/store.ts";
import { usePaymentTypeStore } from "../settings/payments/types/store.ts";
import { getColumns } from "./columns.tsx";
import type { CashbookTransaction } from "./columns.tsx";
import type { Receipt } from "../receipts/types.ts";
import type { Payment } from "../payments/types.ts";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx";
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardTitle,
} from "../../components/ui/card.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx";
import { Button } from "../../components/ui/button.tsx";
import { Plus, Minus, DollarSign, CreditCard, Calendar, User, Building2, FileText, MoreHorizontal, Trash, Edit, Eye, BarChart3, Download, Upload } from "lucide-react";
// REMOVED: Voucher type no longer exists
// import type { Voucher } from "../vouchers/types.ts";
import Fuse from "fuse.js";
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
import { MobileSearchBar } from "../../components/mobile/mobile-search-bar.tsx";
import { TouchButton } from "../../components/mobile/touch-button.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Avatar, AvatarFallback } from "../../components/ui/avatar.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import { PageToolbar } from "../../components/layout/page-toolbar.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

type CashbookTransactionWithBalance = CashbookTransaction & { runningBalance?: number };

export function CashbookPage() {
  const { data: receipts } = useReceiptStore();
  const { data: payments, remove: removePayment } = usePaymentStore();
  const transactions = React.useMemo<CashbookTransaction[]>(() => {
    const validReceipts = (receipts || [])
      .filter(r => r && r.systemId && r.id && r.date && r.accountSystemId && r.status !== 'cancelled')
      .map(r => ({ ...r, type: 'receipt' as const }));
    const validPayments = (payments || [])
      .filter(p => p && p.systemId && p.id && p.date && p.accountSystemId && p.status !== 'cancelled')
      .map(p => ({ ...p, type: 'payment' as const }));
    return [...validReceipts, ...validPayments];
  }, [receipts, payments]);
  const remove = (systemId: SystemId) => {
    const isReceipt = receipts.some(r => r.systemId === systemId);
    if (isReceipt) {
      useReceiptStore.getState().remove(systemId);
    } else {
      removePayment(systemId);
    }
  };
  const { accounts } = useCashbookStore();
  const { data: branches } = useBranchStore();
  const { data: receiptTypes } = useReceiptTypeStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);

  // Table state
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [accountFilter, setAccountFilter] = React.useState('all');
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>(undefined);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    // ✅ Always use default visibility (don't load from localStorage)
    const cols = getColumns(accounts, () => {}, navigate);
    const initial: Record<string, boolean> = {};
    cols.forEach((c: any) => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'type', 'id']);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 50 });

  React.useEffect(() => {
    localStorage.setItem('cashbook-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // ✅ Mobile infinite scroll state
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // ✅ Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  const handleCancel = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleEdit = React.useCallback((transaction: Receipt | Payment) => {
    const isReceipt = 'payerType' in transaction;
    const editRoute = isReceipt ? ROUTES.FINANCE.RECEIPT_EDIT : ROUTES.FINANCE.PAYMENT_EDIT;
    navigate(generatePath(editRoute, { systemId: transaction.systemId }));
  }, [navigate]);

  const columns = React.useMemo(() => getColumns(accounts, handleCancel, navigate), [accounts, handleCancel, navigate]);

  // ✅ Set default column visibility - Run ONCE on mount
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'type', 'id', 'date', 'amount', 'targetName', 'paymentMethodName',
      'accountSystemId', 'paymentReceiptTypeName', 'status', 'branchName',
      'description', 'runningBalance', 'createdBy', 'createdAt'
    ];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, [columns]); // ✅ Depends on columns

  const fuse = React.useMemo(() => new Fuse(transactions, {
    keys: ["id", "description", "targetName", "originalDocumentId", "createdBy"],
    threshold: 0.3,
    ignoreLocation: true
  }), [transactions]);

  const confirmCancel = () => {
    if (idToDelete) {
      const isReceipt = receipts.some(r => r.systemId === idToDelete);
      if (isReceipt) {
        useReceiptStore.getState().cancel(idToDelete);
      } else {
        usePaymentStore.getState().cancel(idToDelete);
      }
      toast.success("Đã hủy giao dịch");
    }
    setIsAlertOpen(false);
  };

  const confirmBulkCancel = () => {
    const idsToCancel = Object.keys(rowSelection);
    idsToCancel.forEach(systemId => {
      const sysId = asSystemId(systemId);
      const isReceipt = receipts.some(r => r.systemId === sysId);
      if (isReceipt) {
        useReceiptStore.getState().cancel(sysId);
      } else {
        usePaymentStore.getState().cancel(sysId);
      }
    });
    toast.success(`Đã hủy ${idsToCancel.length} giao dịch`);
    setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  };

  // ✅ Filter options
  const typeOptions = React.useMemo(() => [
    { value: 'receipt', label: 'Phiếu thu' },
    { value: 'payment', label: 'Phiếu chi' }
  ], []);

  const accountOptions = React.useMemo(() =>
    accounts.map(acc => ({ value: acc.systemId, label: acc.name }))
  , [accounts]);

  const filteredAccounts = React.useMemo(() => {
    const byAccount = accountFilter === 'all'
      ? accounts
      : accounts.filter(acc => acc.systemId === accountFilter);

    if (branchFilter === 'all') {
      return byAccount;
    }

    return byAccount.filter(acc => acc.branchSystemId === branchFilter);
  }, [accounts, accountFilter, branchFilter]);

  const filteredAccountIds = React.useMemo(
    () => filteredAccounts.map(acc => acc.systemId),
    [filteredAccounts]
  );

  // Calculate summary stats
  const { openingBalance, totalReceipts, totalPayments, closingBalance, filteredTransactions } = React.useMemo(() => {
    if (filteredAccounts.length === 0 || filteredAccountIds.length === 0) {
      return {
        openingBalance: 0,
        totalReceipts: 0,
        totalPayments: 0,
        closingBalance: 0,
        filteredTransactions: [] as CashbookTransactionWithBalance[]
      };
    }

    const startDate = dateRange?.[0] ? new Date(dateRange[0]) : null;
    const endDate = dateRange?.[1] ? new Date(dateRange[1]) : null;

    const openingBalancesByAccount = new Map<string, number>();
    filteredAccounts.forEach(acc => {
      openingBalancesByAccount.set(acc.systemId, acc.initialBalance);
    });

    const branchAwareTransactions = transactions
      .filter(t => filteredAccountIds.includes(t.accountSystemId))
      .filter(t => branchFilter === 'all' || t.branchSystemId === branchFilter)
      .sort((a, b) => differenceInMilliseconds(new Date(a.date), new Date(b.date)));

    // Bring balances forward with transactions before the selected period
    if (startDate) {
      branchAwareTransactions.forEach(t => {
        if (isBefore(new Date(t.date), startDate)) {
          const delta = t.type === 'receipt' ? t.amount : -t.amount;
          const current = openingBalancesByAccount.get(t.accountSystemId) ?? 0;
          openingBalancesByAccount.set(t.accountSystemId, current + delta);
        }
      });
    }

    const aggregateOpeningBalance = Array.from(openingBalancesByAccount.values()).reduce((sum, value) => sum + value, 0);

    let periodTransactions = branchAwareTransactions.filter(t => {
      const tDate = new Date(t.date);
      const matchesStart = startDate ? isSameDay(tDate, startDate) || isAfter(tDate, startDate) : true;
      const matchesEnd = endDate ? isSameDay(tDate, endDate) || isBefore(tDate, endDate) : true;
      return matchesStart && matchesEnd;
    });

    if (typeFilter.size > 0) {
      periodTransactions = periodTransactions.filter(t => typeFilter.has(t.type));
    }

    if (debouncedGlobalFilter) {
      const searchResults = fuse.search(debouncedGlobalFilter);
      const searchIds = new Set(searchResults.map(r => r.item.systemId));
      periodTransactions = periodTransactions.filter(t => searchIds.has(t.systemId));
    }

    let totalReceipts = 0;
    let totalPayments = 0;

    periodTransactions.forEach(t => {
      if (t.type === 'receipt') {
        totalReceipts += t.amount;
      } else {
        totalPayments += t.amount;
      }
    });

    const runningBalancesByAccount = new Map(openingBalancesByAccount);
    let aggregateRunningBalance = aggregateOpeningBalance;
    const runningBalanceByTransaction = new Map<string, number>();

    const chronologicalTransactions = [...periodTransactions].sort((a, b) =>
      differenceInMilliseconds(new Date(a.date), new Date(b.date))
    );

    chronologicalTransactions.forEach(t => {
      const delta = t.type === 'receipt' ? t.amount : -t.amount;
      const currentAccountBalance = runningBalancesByAccount.get(t.accountSystemId) ?? 0;
      const updatedAccountBalance = currentAccountBalance + delta;
      runningBalancesByAccount.set(t.accountSystemId, updatedAccountBalance);
      aggregateRunningBalance += delta;
      runningBalanceByTransaction.set(
        t.systemId,
        accountFilter === 'all' ? aggregateRunningBalance : updatedAccountBalance
      );
    });

    const enhancedTransactions: CashbookTransactionWithBalance[] = periodTransactions.map(t => ({
      ...t,
      runningBalance: runningBalanceByTransaction.get(t.systemId) ?? (accountFilter === 'all'
        ? aggregateOpeningBalance
        : openingBalancesByAccount.get(t.accountSystemId) ?? 0)
    }));

    return {
      openingBalance: aggregateOpeningBalance,
      totalReceipts,
      totalPayments,
      closingBalance: aggregateRunningBalance,
      filteredTransactions: enhancedTransactions
    };
  }, [filteredAccounts, filteredAccountIds, branchFilter, transactions, dateRange, typeFilter, debouncedGlobalFilter, fuse, accountFilter]);

  // ✅ Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [debouncedGlobalFilter, branchFilter, accountFilter, typeFilter, dateRange]);

  // ✅ Mobile infinite scroll listener
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      // Load more when scroll 80%
      if (scrollPercentage > 80 && mobileLoadedCount < filteredTransactions.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, filteredTransactions.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredTransactions.length]);

  // ✅ Sort data
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredTransactions];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        // Special handling for date columns - parse as Date for proper comparison
        if (sorting.id === 'createdAt' || sorting.id === 'date') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          // Nếu thời gian bằng nhau, sort theo systemId (ID mới hơn = số lớn hơn)
          if (aTime === bTime) {
            const aNum = parseInt(a.systemId.replace(/\D/g, '')) || 0;
            const bNum = parseInt(b.systemId.replace(/\D/g, '')) || 0;
            return sorting.desc ? bNum - aNum : aNum - bNum;
          }
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredTransactions, sorting]);

  // ✅ Paginate data for desktop
  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => 
    sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
    [sortedData, pagination]
  );

  // ✅ Export configuration
  const exportConfig = React.useMemo(() => ({
    fileName: 'So_quy',
    columns: columns as any,
  }), [columns]);

  // ✅ Memoize header actions - CHỈ action chính (tạo phiếu)
  const headerActions = React.useMemo(() => [
    <Button key="payment" variant="outline" size="sm" className="h-9" onClick={() => navigate(ROUTES.FINANCE.PAYMENT_NEW)}>
      <Minus className="mr-2 h-4 w-4" />
      Lập Phiếu Chi
    </Button>,
    <Button key="receipt" size="sm" className="h-9" onClick={() => navigate(ROUTES.FINANCE.RECEIPT_NEW)}>
      <Plus className="mr-2 h-4 w-4" />
      Lập Phiếu Thu
    </Button>
  ], [navigate]);

  const breadcrumb = React.useMemo(() => ([
    { label: 'Trang chủ', href: ROUTES.ROOT },
    { label: 'Sổ quỹ', href: ROUTES.FINANCE.CASHBOOK },
  ]), []);

  // Set page header with actions - Bỏ subtitle và docLink theo guidelines
  usePageHeader({
    title: 'Sổ quỹ',
    showBackButton: false,
    breadcrumb,
    actions: headerActions
  });

  // ✅ Mobile card component
  const MobileTransactionCard = ({ transaction }: { transaction: CashbookTransactionWithBalance }) => {
    const branch = branches.find(b => b.systemId === transaction.branchSystemId);
    const isReceipt = transaction.type === 'receipt';
    const voucherType = isReceipt
      ? receiptTypes.find(rt => rt.systemId === (transaction as Receipt).paymentReceiptTypeSystemId)
      : paymentTypes.find(pt => pt.systemId === (transaction as Payment).paymentReceiptTypeSystemId);

    const viewRoute = isReceipt ? ROUTES.FINANCE.RECEIPT_VIEW : ROUTES.FINANCE.PAYMENT_VIEW;

    return (
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => navigate(generatePath(viewRoute, { systemId: transaction.systemId }))}
      >
        <CardContent className="p-4">
          {/* Header: Icon + ID + Type + Menu */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar className={`h-8 w-8 flex-shrink-0 ${isReceipt ? 'bg-emerald-500/10' : 'bg-destructive/10'}`}>
                <AvatarFallback className={isReceipt ? 'bg-emerald-500/10 text-emerald-600' : 'bg-destructive/10 text-destructive'}>
                  {isReceipt ? <DollarSign className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <CardTitle className="font-semibold text-sm">{transaction?.id || 'N/A'}</CardTitle>
                <Badge variant={isReceipt ? "default" : "destructive"} className="text-xs">
                  {isReceipt ? 'Thu' : 'Chi'}
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </TouchButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(generatePath(viewRoute, { systemId: transaction.systemId })); }}>
                  <Eye className="mr-2 h-4 w-4" />
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(transaction); }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleCancel(transaction.systemId); }} className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  Hủy giao dịch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Amount + Date */}
          <div className="mb-3">
            <div className={`text-lg font-bold ${isReceipt ? 'text-emerald-600' : 'text-destructive'}`}>
              {isReceipt ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
            <div className="text-xs text-muted-foreground flex items-center mt-1">
              <Calendar className="h-3 w-3 mr-1.5" />
              {formatDateCustom(new Date(transaction.date), 'dd/MM/yyyy')}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t mb-3" />

          {/* Details */}
          <div className="space-y-2">
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="h-3 w-3 mr-1.5 flex-shrink-0" />
              <span className="truncate">{isReceipt ? (transaction as Receipt).payerName : (transaction as Payment).recipientName}</span>
            </div>
            {voucherType && (
              <div className="flex items-center text-xs text-muted-foreground">
                <FileText className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{voucherType.name}</span>
              </div>
            )}
            {branch && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{branch.name}</span>
              </div>
            )}
            {transaction.originalDocumentId && (
              <div className="text-xs text-muted-foreground">
                CT: <span className="font-mono font-medium">{transaction.originalDocumentId}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Số dư đầu kỳ</p>
            <p className="text-h5 font-semibold">{formatCurrency(openingBalance)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng thu</p>
            <p className="text-h5 font-semibold text-emerald-600">{formatCurrency(totalReceipts)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tổng chi</p>
            <p className="text-h5 font-semibold text-destructive">{formatCurrency(totalPayments)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-h5 font-bold">{formatCurrency(closingBalance)}</p>
            <p className="text-sm text-muted-foreground">Tồn cuối kỳ</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar - Action phụ (Desktop only) */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <DataTableExportDialog
                allData={transactions}
                filteredData={sortedData}
                pageData={paginatedData}
                config={exportConfig}
              />
              <Button variant="outline" size="sm" className="h-9" onClick={() => navigate(ROUTES.FINANCE.CASHBOOK_REPORTS)}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Báo cáo
              </Button>
            </>
          }
          rightActions={
            <DataTableColumnCustomizer
              columns={columns as any}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
            />
          }
        />
      )}

      {/* Filters */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm theo mã phiếu, người nhận/chi, chứng từ..."
      >
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="Chi nhánh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branches.map(b => (
              <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={accountFilter} onValueChange={setAccountFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="Tài khoản quỹ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tài khoản</SelectItem>
            {accounts.map(acc => (
              <SelectItem key={acc.systemId} value={acc.systemId}>{acc.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DataTableFacetedFilter
          title="Loại phiếu"
          options={typeOptions}
          selectedValues={typeFilter}
          onSelectedValuesChange={setTypeFilter}
        />

        <DataTableDateFilter
          value={dateRange}
          onChange={setDateRange}
          title="Khoảng thời gian"
        />
      </PageFilters>

      {/* Mobile View - Cards with Infinite Scroll */}
      {isMobile ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {filteredTransactions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Không tìm thấy giao dịch nào.
                </CardContent>
              </Card>
            ) : (
              filteredTransactions.slice(0, mobileLoadedCount).map((transaction) => (
                <MobileTransactionCard key={transaction.systemId} transaction={transaction} />
              ))
            )}
          </div>

          {/* Loading indicator & End message */}
          {filteredTransactions.length > 0 && (
            <div className="py-6 text-center">
              {mobileLoadedCount < filteredTransactions.length ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span className="text-sm">Đang tải thêm...</span>
                </div>
              ) : filteredTransactions.length > 20 ? (
                <p className="text-sm text-muted-foreground">
                  Đã hiển thị tất cả {filteredTransactions.length} giao dịch
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        /* Desktop View - ResponsiveDataTable */
        <ResponsiveDataTable
          columns={columns as any}
          data={paginatedData}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={sortedData.length}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onBulkDelete={() => setIsBulkDeleteAlertOpen(true)}
          sorting={sorting}
          setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>}
          allSelectedRows={sortedData.filter(v => rowSelection[v.systemId])}
          expanded={{}}
          setExpanded={() => {}}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
          onRowClick={(row) => {
            const viewRoute = row.type === 'receipt' ? ROUTES.FINANCE.RECEIPT_VIEW : ROUTES.FINANCE.PAYMENT_VIEW;
            navigate(generatePath(viewRoute, { systemId: row.systemId }));
          }}
          renderMobileCard={(row) => <MobileTransactionCard transaction={row} />}
        />
      )}

      {/* Delete Single Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy giao dịch này?</AlertDialogTitle>
            <AlertDialogDescription>
              Giao dịch sẽ được chuyển sang trạng thái "Đã hủy". Bạn có thể xem lại giao dịch đã hủy trong danh sách.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Đóng</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmCancel}>Hủy giao dịch</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert */}
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy {Object.keys(rowSelection).length} giao dịch?</AlertDialogTitle>
            <AlertDialogDescription>
              Các giao dịch sẽ được chuyển sang trạng thái "Đã hủy".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Đóng</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmBulkCancel}>Hủy tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
