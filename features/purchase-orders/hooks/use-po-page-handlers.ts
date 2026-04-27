/**
 * Hook tổng hợp handlers cho PurchaseOrders page
 * Kết hợp receive workflow, cancel workflow, và print handlers
 * Sử dụng để giảm kích thước page.tsx < 300 lines
 * 
 * ⚡ PERFORMANCE NOTE: Bulk payment workflow needs all payments data.
 * This is intentional - when user selects multiple POs for bulk pay,
 * we need to calculate remaining amount for each. Data is loaded 
 * only when bulk pay dialog is opened.
 */
import { useMemo, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { usePurchaseOrderMutations } from '../hooks/use-purchase-orders';
import { useAllPayments } from '@/features/payments/hooks/use-all-payments';
import { usePaymentMutations } from '@/features/payments/hooks/use-payments';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllPaymentTypes } from '@/features/settings/payments/types/hooks/use-all-payment-types';
import { useAllPurchaseReturns } from '@/features/purchase-returns/hooks/use-all-purchase-returns';
import { useAuth } from '@/contexts/auth-context';
import { sumPaymentsForPurchaseOrder } from '../payment-utils';
import type { Payment } from '@/features/payments/types';

// Import sub-workflows
import { usePurchaseOrderReceiveWorkflow, type ReceiveDialogState, type ReceiveLineItemForm } from './use-po-receive-workflow';
import { usePurchaseOrderCancelWorkflow, type CancelPODialogState } from './use-po-cancel-workflow';
import { usePurchaseOrderPrintHandlers } from './use-po-print-handlers';
import { logError } from '@/lib/logger'
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';

export type { ReceiveDialogState, ReceiveLineItemForm, CancelPODialogState };

interface PageHandlersOptions {
  /** Paginated data from the page - used for row selection. Pass this to avoid loading ALL data */
  paginatedData?: PurchaseOrder[];
}

/**
 * Main hook combining all PurchaseOrders page handlers
 * 
 * @param options.paginatedData - REQUIRED: Pass paginated data to avoid loading ALL purchase orders
 */
export function usePurchaseOrdersPageHandlers(options?: PageHandlersOptions) {
  const router = useRouter();
  // ⚡ OPTIMIZED: Use paginated data from page instead of loading all data
  const paginatedData = useMemo(() => options?.paginatedData || [], [options?.paginatedData]);
  const { update: updatePO } = usePurchaseOrderMutations({});
  
  // Row selection state - defined early so we can conditionally load payments
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isBulkPayAlertOpen, setIsBulkPayAlertOpen] = useState(false);
  
  // ⚡ PERFORMANCE: Only load bulk-pay data when dialog is open
  const { data: allPayments } = useAllPayments({ enabled: isBulkPayAlertOpen });
  const { accounts } = useAllCashAccounts({ enabled: isBulkPayAlertOpen });
  const { data: paymentTypes } = useAllPaymentTypes({ enabled: isBulkPayAlertOpen });
  const { data: allPurchaseReturns } = useAllPurchaseReturns({ enabled: isBulkPayAlertOpen });
  const { employee: loggedInUser } = useAuth();
  
  const { create: createPayment } = usePaymentMutations({});
  
  const currentUserSystemId = loggedInUser?.systemId ?? 'SYSTEM';
  const currentUserName = loggedInUser?.fullName ?? 'Hệ thống';
  
  // Helper functions
  const bulkCancel = useCallback((systemIds: string[], userId: string, _userName: string) => {
    systemIds.forEach(id => updatePO.mutate({ 
      systemId: id, 
      data: { 
        status: 'cancelled', 
        updatedBy: userId 
      } 
    }));
  }, [updatePO]);
  
  const syncAllPurchaseOrderStatuses = useCallback(() => {
    // Note: This is handled by React Query invalidation
  }, []);

  // ⚡ Track if receive action is in progress to lazy-load inventory receipts data
  const [isReceiveActive, setIsReceiveActive] = useState(false);

  // Sub-workflows - print handlers always enabled (common action), receive lazy-loaded
  const receiveWorkflow = usePurchaseOrderReceiveWorkflow({ enabled: isReceiveActive });
  const cancelWorkflow = usePurchaseOrderCancelWorkflow();
  const printHandlers = usePurchaseOrderPrintHandlers(); // Default enabled for quick print

  // Computed values - use paginated data instead of all data
  const selectedOrders = useMemo(() => {
    return paginatedData.filter(o => rowSelection[o.systemId]);
  }, [paginatedData, rowSelection]);

  const numSelected = Object.keys(rowSelection).filter(k => rowSelection[k]).length;

  // Handler: Start cancel request
  const handleCancelRequest = useCallback((po: PurchaseOrder) => {
    cancelWorkflow.handleCancelRequest(po);
  }, [cancelWorkflow]);

  // Handler: Start receive goods - enable lazy loading first
  const handleReceiveGoods = useCallback((po: PurchaseOrder) => {
    setIsReceiveActive(true);
    // Small delay to let data load before opening dialog
    setTimeout(() => receiveWorkflow.beginReceiveFlow([po]), 50);
  }, [receiveWorkflow]);

  // Handler: View payment details
  const handlePayment = useCallback((po: PurchaseOrder) => {
    router.push(`/purchase-orders/${po.systemId}`);
    toast(`Mở trang thanh toán cho đơn ${po.id}`);
  }, [router]);

  // Handler: Print single
  const handlePrint = useCallback((po: PurchaseOrder) => {
    printHandlers.handlePrint(po);
  }, [printHandlers]);

  // Bulk actions
  const handleBulkPrint = useCallback(() => {
    if (numSelected === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    printHandlers.openBulkPrintDialog(selectedOrders);
  }, [numSelected, selectedOrders, printHandlers]);

  const handleBulkCancel = useCallback(() => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    bulkCancel(selectedIds, currentUserSystemId, currentUserName);
    toast.success('Đã hủy', {
      description: `Đã hủy ${selectedIds.length} đơn nhập hàng`,
    });
    setRowSelection({});
  }, [rowSelection, bulkCancel, currentUserSystemId, currentUserName]);

  const handleBulkReceive = useCallback(() => {
    if (numSelected === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    receiveWorkflow.beginReceiveFlow(selectedOrders);
  }, [numSelected, selectedOrders, receiveWorkflow]);

  const confirmBulkPay = useCallback(() => {
    const paymentCategory = paymentTypes.find(pt => pt.name === 'Thanh toán cho đơn nhập hàng');
    const paymentMethodName = 'Chuyển khoản';
    const paymentMethodSystemId = 'BANK_TRANSFER';
    let totalPaymentsCreated = 0;
    
    selectedOrders.forEach(po => {
      const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);
      const totalReturnValue = allPurchaseReturns
        .filter(r => r.purchaseOrderSystemId === asSystemId(po.systemId))
        .reduce((sum, r) => sum + r.totalReturnValue, 0);
      const actualDebt = Math.max(po.grandTotal - totalReturnValue, 0);
      const amountRemaining = actualDebt - totalPaid;

      if (amountRemaining > 0) {
        const account = accounts.find(acc => acc.type === 'bank' && acc.branchSystemId === po.branchSystemId) 
          || accounts.find(acc => acc.type === 'bank');
        if (!account) {
          logError(`Không tìm thấy tài khoản ngân hàng cho chi nhánh ${po.branchName}`, null);
          return;
        }

        const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
        const newPayment = {
          id: '' as Payment['id'],
          date: now,
          amount: amountRemaining,
          recipientTypeSystemId: asSystemId('NHACUNGCAP'),
          recipientTypeName: 'Nhà cung cấp',
          recipientName: po.supplierName,
          recipientSystemId: asSystemId(po.supplierSystemId),
          description: `Thanh toán toàn bộ cho đơn nhập hàng ${po.id}`,
          paymentMethodSystemId: asSystemId(paymentMethodSystemId),
          paymentMethodName,
          accountSystemId: asSystemId(account.systemId),
          paymentReceiptTypeSystemId: asSystemId(paymentCategory?.systemId || ''),
          paymentReceiptTypeName: paymentCategory?.name || 'Thanh toán cho đơn nhập hàng',
          branchSystemId: asSystemId(po.branchSystemId),
          branchName: po.branchName,
          createdBy: asSystemId(currentUserSystemId),
          createdAt: now,
          status: 'completed' as const,
          category: 'supplier_payment' as const,
          affectsDebt: true,
          affectsBusinessReport: false,
          purchaseOrderSystemId: asSystemId(po.systemId),
          purchaseOrderId: asBusinessId(po.id),
          originalDocumentId: po.id,
        } satisfies Omit<Payment, 'systemId'>;
        createPayment.mutate(newPayment);
        totalPaymentsCreated += 1;
      }
    });

    if (totalPaymentsCreated > 0) {
      syncAllPurchaseOrderStatuses();
      toast.success('Đã tạo phiếu chi', {
        description: `Hoàn tất ${totalPaymentsCreated} phiếu chi cho đơn nhập hàng đã chọn.`,
      });
    }

    setRowSelection({});
    setIsBulkPayAlertOpen(false);
  }, [selectedOrders, allPayments, allPurchaseReturns, accounts, paymentTypes, currentUserSystemId, createPayment, syncAllPurchaseOrderStatuses]);

  // Print dialog handlers
  const handlePrintConfirm = useCallback((options: Parameters<typeof printHandlers.handlePrintConfirm>[0]) => {
    printHandlers.handlePrintConfirm(options);
    setRowSelection({});
  }, [printHandlers]);

  // Cancel dialog handlers
  const handleConfirmCancel = useCallback(() => {
    cancelWorkflow.confirmCancel();
    setRowSelection({});
  }, [cancelWorkflow]);

  return {
    // State
    rowSelection,
    setRowSelection,
    isBulkPayAlertOpen,
    setIsBulkPayAlertOpen,
    numSelected,
    selectedOrders,
    
    // Individual actions
    handleCancelRequest,
    handleReceiveGoods,
    handlePayment,
    handlePrint,
    
    // Bulk actions  
    handleBulkPrint,
    handleBulkCancel,
    handleBulkReceive,
    confirmBulkPay,
    
    // Receive workflow state & handlers
    receiveDialogState: receiveWorkflow.receiveDialogState,
    isSubmittingReceive: receiveWorkflow.isSubmittingReceive,
    handleReceiveQuantityChange: receiveWorkflow.handleReceiveQuantityChange,
    handleReceiveFieldChange: receiveWorkflow.handleReceiveFieldChange,
    handleReceiveBranchChange: receiveWorkflow.handleReceiveBranchChange,
    handleSubmitReceiveDialog: receiveWorkflow.handleSubmitReceiveDialog,
    closeReceiveDialog: receiveWorkflow.closeReceiveDialog,
    
    // Cancel workflow state & handlers
    cancelDialogState: cancelWorkflow.cancelDialogState,
    closeCancelDialog: cancelWorkflow.closeCancelDialog,
    handleConfirmCancel,
    
    // Print workflow state & handlers
    isPrintDialogOpen: printHandlers.isPrintDialogOpen,
    pendingPrintPOs: printHandlers.pendingPrintPOs,
    handlePrintConfirm,
    closePrintDialog: printHandlers.closePrintDialog,
  };
}

/**
 * Hook for filter state management
 */
export function usePurchaseOrdersFilters() {
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: string; to?: string } | null>(null);
  const [pagination, setPagination] = usePaginationWithGlobalDefault();

  return {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    branchFilter,
    setBranchFilter,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    supplierFilter,
    setSupplierFilter,
    dateRange,
    setDateRange,
    pagination,
    setPagination,
  };
}

/**
 * Hook for import/export dialog state
 */
export function usePurchaseOrdersImportExport() {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);

  return {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
  };
}
