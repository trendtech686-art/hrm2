/**
 * Hooks for receipts page handlers
 * Extracted to reduce page.tsx size
 */
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isBefore, isSameDay, differenceInMilliseconds } from 'date-fns';
import { useReceipts, useReceiptMutations } from './use-receipts';
import { useAllPayments } from '@/features/payments/hooks/use-all-payments';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { usePrint } from '@/lib/use-print';
import type { Receipt } from '../types';
import type { Payment } from '@/features/payments/types';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '@/lib/router';
import { 
  convertReceiptForPrint,
  mapReceiptToPrintData,
  createStoreSettings,
} from '@/lib/print/receipt-print-helper';
import type { SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';

/**
 * Hook for receipt page filters
 */
export function useReceiptFilters() {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  
  // Filters
  const [branchFilter, setBranchFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
  const [customerFilter, setCustomerFilter] = React.useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
  
  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);

  return {
    rowSelection,
    setRowSelection,
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    debouncedGlobalFilter,
    pagination,
    setPagination,
    mobileLoadedCount,
    setMobileLoadedCount,
    columnOrder,
    setColumnOrder,
    pinnedColumns,
    setPinnedColumns,
    branchFilter,
    setBranchFilter,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    customerFilter,
    setCustomerFilter,
    dateRange,
    setDateRange,
  };
}

/**
 * Hook for receipt actions (cancel, delete, print)
 */
export function useReceiptActions() {
  const router = useRouter();
  const { cancel: cancelMutation } = useReceiptMutations({
    onCancelSuccess: () => {
      toast.success("Đã hủy phiếu thu");
    },
    onError: (error) => {
      toast.error(error.message || "Hủy phiếu thu thất bại");
    }
  });
  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  
  // Print dialog state
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<Receipt[]>([]);

  const handleCancel = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleEdit = React.useCallback((receipt: Receipt) => {
    router.push(generatePath(ROUTES.FINANCE.RECEIPT_EDIT, { systemId: receipt.systemId }));
  }, [router]);
  
  const handleRowClick = React.useCallback((receipt: Receipt) => {
    router.push(generatePath(ROUTES.FINANCE.RECEIPT_VIEW, { systemId: receipt.systemId }));
  }, [router]);

  const handleSinglePrint = React.useCallback((receipt: Receipt) => {
    const branch = branches.find(b => b.systemId === receipt.branchSystemId);
    const storeSettings = branch 
      ? createStoreSettings(branch)
      : createStoreSettings(storeInfo);
    const receiptData = convertReceiptForPrint(receipt, {});
    
    print('receipt', {
      data: mapReceiptToPrintData(receiptData, storeSettings),
      lineItems: [],
    });
  }, [branches, storeInfo, print]);

  const confirmCancel = React.useCallback(() => { 
    if (idToDelete) {
      cancelMutation.mutate({ systemId: idToDelete });
    }
    setIsAlertOpen(false); 
  }, [idToDelete, cancelMutation]);

  const confirmBulkCancel = React.useCallback((rowSelection: Record<string, boolean>) => {
    const idsToCancel = Object.keys(rowSelection).map(id => asSystemId(id));
    idsToCancel.forEach(id => cancelMutation.mutate({ systemId: id }));
    toast.success(`Đã hủy ${idsToCancel.length} phiếu thu`);
    setIsBulkDeleteAlertOpen(false);
  }, [cancelMutation]);

  const handleBulkPrint = React.useCallback((selectedReceipts: Receipt[]) => {
    if (selectedReceipts.length === 0) {
      toast.error('Chưa chọn phiếu thu');
      return;
    }
    setItemsToPrint(selectedReceipts);
    setPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const printOptionsList = itemsToPrint.map(receipt => {
      const branch = options.branchSystemId 
        ? branches.find(b => b.systemId === options.branchSystemId)
        : branches.find(b => b.systemId === receipt.branchSystemId);
      const storeSettings = branch 
        ? createStoreSettings(branch)
        : createStoreSettings(storeInfo);
      const receiptData = convertReceiptForPrint(receipt, {});
      
      return {
        data: mapReceiptToPrintData(receiptData, storeSettings),
        lineItems: [],
        paperSize: options.paperSize,
      };
    });
    
    printMultiple('receipt', printOptionsList);
    
    toast.success('Đã gửi lệnh in', {
      description: itemsToPrint.map(r => r.id).join(', ')
    });
    setItemsToPrint([]);
    setPrintDialogOpen(false);
  }, [itemsToPrint, branches, storeInfo, printMultiple]);

  return {
    isAlertOpen,
    setIsAlertOpen,
    idToDelete,
    isBulkDeleteAlertOpen,
    setIsBulkDeleteAlertOpen,
    printDialogOpen,
    setPrintDialogOpen,
    itemsToPrint,
    handleCancel,
    handleEdit,
    handleRowClick,
    handleSinglePrint,
    confirmCancel,
    confirmBulkCancel,
    handleBulkPrint,
    handlePrintConfirm,
  };
}

/**
 * Hook for running balance calculation (receipts)
 */
export function useReceiptRunningBalance(
  filteredData: Receipt[],
  branchFilter: 'all' | SystemId,
  dateRange: [string | undefined, string | undefined] | undefined
) {
  const { data: receiptsData } = useReceipts({ limit: 1000 });
  const receipts = React.useMemo(() => (receiptsData as any)?.items ?? (Array.isArray(receiptsData) ? receiptsData : []), [receiptsData]);
  const { data: payments } = useAllPayments();
  const { accounts } = useAllCashAccounts();

  const filteredReceiptIds = React.useMemo(
    () => new Set(filteredData.map(r => r.systemId)),
    [filteredData]
  );

  const runningBalanceByReceipt = React.useMemo(() => {
    if (filteredReceiptIds.size === 0) {
      return new Map<SystemId, number>();
    }

    const startDate = dateRange?.[0] ? new Date(dateRange[0]) : null;
    const _endDate = dateRange?.[1] ? new Date(dateRange[1]) : null;

    const trackedAccounts = branchFilter === 'all'
      ? accounts
      : accounts.filter(acc => acc.branchSystemId === branchFilter);

    const accountBalances = new Map<SystemId, number>();
    trackedAccounts.forEach(account => {
      accountBalances.set(account.systemId, account.initialBalance);
    });

    let aggregateRunningBalance = 0;
    accountBalances.forEach(value => {
      aggregateRunningBalance += value;
    });

    const ensureAccountTracked = (accountId?: SystemId): SystemId | null => {
      if (!accountId) return null;
      if (!accountBalances.has(accountId)) {
        const fallback = accounts.find(acc => acc.systemId === accountId);
        const initial = fallback?.initialBalance ?? 0;
        accountBalances.set(accountId, initial);
        aggregateRunningBalance += initial;
      }
      return accountId;
    };

    const matchesBranch = (branchId?: SystemId) => branchFilter === 'all' || branchId === branchFilter;

    type BalanceTransaction = (Receipt & { kind: 'receipt' }) | (Payment & { kind: 'payment' });

    const receiptTransactions: BalanceTransaction[] = receipts
      .filter(r => r && r.accountSystemId && r.date && matchesBranch(r.branchSystemId))
      .map(r => ({ ...r, kind: 'receipt' as const }));

    const paymentTransactions: BalanceTransaction[] = (payments ?? [])
      .filter(p => p && p.accountSystemId && p.date && matchesBranch(p.branchSystemId))
      .map(p => ({ ...p, kind: 'payment' as const }));

    const transactions = [...receiptTransactions, ...paymentTransactions].sort((a, b) => {
      const primary = differenceInMilliseconds(new Date(a.date), new Date(b.date));
      if (primary !== 0) return primary;
      const aCreated = ('createdAt' in a && a.createdAt) ? new Date(a.createdAt) : new Date(a.date);
      const bCreated = ('createdAt' in b && b.createdAt) ? new Date(b.createdAt) : new Date(b.date);
      return differenceInMilliseconds(aCreated, bCreated);
    });

    const runningBalances = new Map<SystemId, number>();

    transactions.forEach(transaction => {
      const accountId = ensureAccountTracked(transaction.accountSystemId);
      if (!accountId) return;

      const transactionDate = new Date(transaction.date);

      if (startDate && isBefore(transactionDate, startDate) && !isSameDay(transactionDate, startDate)) {
        if (transaction.kind === 'receipt') {
          aggregateRunningBalance += transaction.amount;
        } else {
          aggregateRunningBalance -= transaction.amount;
        }
        return;
      }

      if (transaction.kind === 'receipt') {
        aggregateRunningBalance += transaction.amount;
        if (filteredReceiptIds.has(transaction.systemId)) {
          runningBalances.set(transaction.systemId, aggregateRunningBalance);
        }
      } else {
        aggregateRunningBalance -= transaction.amount;
      }
    });

    return runningBalances;
  }, [filteredReceiptIds, receipts, payments, accounts, branchFilter, dateRange]);

  return runningBalanceByReceipt;
}

/**
 * Hook for import/export dialogs
 */
export function useReceiptImportExport() {
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  return {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
  };
}
