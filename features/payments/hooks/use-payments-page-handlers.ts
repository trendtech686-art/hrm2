/**
 * Hooks for payments page handlers
 * Extracted to reduce page.tsx size
 */
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { isBefore, isSameDay, differenceInMilliseconds } from 'date-fns';
import { usePayments, usePaymentMutations } from './use-payments';
import { useAllReceipts } from '@/features/receipts/hooks/use-all-receipts';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { usePrint } from '@/lib/use-print';
import type { Payment } from '@/lib/types/prisma-extended';
import type { Receipt } from '@/features/receipts/types';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { ROUTES, generatePath } from '@/lib/router';
import { 
  convertPaymentForPrint,
  mapPaymentToPrintData,
  createStoreSettings,
} from '@/lib/print/payment-print-helper';
import type { SimplePrintOptionsResult } from '@/components/shared/simple-print-options-dialog';

/**
 * Hook for payment page filters
 */
export function usePaymentFilters() {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  
  // Filters
  const [branchFilter, setBranchFilter] = React.useState<'all' | SystemId>('all');
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
 * Hook for payment actions (cancel, delete, print)
 */
export function usePaymentActions() {
  const router = useRouter();
  const { cancel: cancelMutation } = usePaymentMutations({
    onCancelSuccess: () => toast.success("Đã hủy phiếu chi"),
    onError: (error) => toast.error(`Lỗi: ${error.message}`),
  });
  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false);
  
  // Print dialog state
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<Payment[]>([]);

  const handleCancel = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleEdit = React.useCallback((payment: Payment) => {
    router.push(generatePath(ROUTES.FINANCE.PAYMENT_EDIT, { systemId: payment.systemId }));
  }, [router]);
  
  const handleRowClick = React.useCallback((payment: Payment) => {
    router.push(generatePath(ROUTES.FINANCE.PAYMENT_VIEW, { systemId: payment.systemId }));
  }, [router]);

  const handleSinglePrint = React.useCallback((payment: Payment) => {
    const branch = branches.find(b => b.systemId === payment.branchSystemId);
    const storeSettings = branch 
      ? createStoreSettings(branch)
      : createStoreSettings(storeInfo);
    const paymentData = convertPaymentForPrint(payment, {});
    
    print('payment', {
      data: mapPaymentToPrintData(paymentData, storeSettings),
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
    toast.success(`Đã hủy ${idsToCancel.length} phiếu chi`);
    setIsBulkDeleteAlertOpen(false);
  }, [cancelMutation]);

  const handleBulkPrint = React.useCallback((selectedPayments: Payment[]) => {
    if (selectedPayments.length === 0) {
      toast.error('Chưa chọn phiếu chi');
      return;
    }
    setItemsToPrint(selectedPayments);
    setPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const printOptionsList = itemsToPrint.map(payment => {
      const branch = options.branchSystemId 
        ? branches.find(b => b.systemId === options.branchSystemId)
        : branches.find(b => b.systemId === payment.branchSystemId);
      const storeSettings = branch 
        ? createStoreSettings(branch)
        : createStoreSettings(storeInfo);
      const paymentData = convertPaymentForPrint(payment, {});
      
      return {
        data: mapPaymentToPrintData(paymentData, storeSettings),
        lineItems: [],
        paperSize: options.paperSize,
      };
    });
    
    printMultiple('payment', printOptionsList);
    
    toast.success('Đã gửi lệnh in', {
      description: itemsToPrint.map(p => p.id).join(', ')
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
 * Hook for running balance calculation
 */
export function usePaymentRunningBalance(
  filteredData: Payment[],
  branchFilter: 'all' | SystemId,
  dateRange: [string | undefined, string | undefined] | undefined
) {
  const { data: paymentsResponse } = usePayments({ limit: 1000 });
  const payments = React.useMemo(() => paymentsResponse?.data ?? [], [paymentsResponse?.data]);
  const { data: receipts } = useAllReceipts();
  const { accounts } = useAllCashAccounts();

  const filteredPaymentIds = React.useMemo(
    () => new Set(filteredData.map(p => p.systemId)),
    [filteredData]
  );

  const runningBalanceByPayment = React.useMemo(() => {
    if (filteredPaymentIds.size === 0) {
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

    const receiptTransactions: BalanceTransaction[] = (receipts ?? [])
      .filter(r => r && r.accountSystemId && r.date && matchesBranch(r.branchSystemId))
      .map(r => ({ ...r, kind: 'receipt' as const }));

    const paymentTransactions: BalanceTransaction[] = payments
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
      } else {
        aggregateRunningBalance -= transaction.amount;
        if (filteredPaymentIds.has(transaction.systemId)) {
          runningBalances.set(transaction.systemId, aggregateRunningBalance);
        }
      }
    });

    return runningBalances;
  }, [filteredPaymentIds, payments, receipts, accounts, branchFilter, dateRange]);

  return runningBalanceByPayment;
}

/**
 * Hook for import/export dialogs
 */
export function usePaymentImportExport() {
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  return {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
  };
}
