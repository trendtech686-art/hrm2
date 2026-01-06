/**
 * Hook tổng hợp handlers cho PurchaseOrders page
 * Kết hợp receive workflow, cancel workflow, và print handlers
 * Sử dụng để giảm kích thước page.tsx < 300 lines
 */
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { PurchaseOrder } from '@/lib/types/prisma-extended';
import { usePurchaseOrderStore } from '../store';
import { useAllPayments } from '@/features/payments/hooks/use-all-payments';
import { usePaymentStore } from '@/features/payments/store';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useAllPaymentTypes } from '@/features/settings/payments/types/hooks/use-all-payment-types';
import { usePurchaseReturnStore } from '@/features/purchase-returns/store';
import { useAuth } from '@/contexts/auth-context';
import { sumPaymentsForPurchaseOrder } from '../payment-utils';
import type { Payment } from '@/features/payments/types';

// Import sub-workflows
import { usePurchaseOrderReceiveWorkflow, type ReceiveDialogState, type ReceiveLineItemForm } from './use-po-receive-workflow';
import { usePurchaseOrderCancelWorkflow, type CancelPODialogState } from './use-po-cancel-workflow';
import { usePurchaseOrderPrintHandlers } from './use-po-print-handlers';

export type { ReceiveDialogState, ReceiveLineItemForm, CancelPODialogState };

/**
 * Main hook combining all PurchaseOrders page handlers
 */
export function usePurchaseOrdersPageHandlers() {
  const router = useRouter();
  const { data: purchaseOrders, bulkCancel, syncAllPurchaseOrderStatuses } = usePurchaseOrderStore();
  const { data: allPayments } = useAllPayments();
  const { accounts } = useAllCashAccounts();
  const { data: paymentTypes } = useAllPaymentTypes();
  const { data: allPurchaseReturns } = usePurchaseReturnStore();
  const { employee: loggedInUser } = useAuth();
  
  const currentUserSystemId = loggedInUser?.systemId ?? 'SYSTEM';
  const currentUserName = loggedInUser?.fullName ?? 'Hệ thống';

  // Sub-workflows
  const receiveWorkflow = usePurchaseOrderReceiveWorkflow();
  const cancelWorkflow = usePurchaseOrderCancelWorkflow();
  const printHandlers = usePurchaseOrderPrintHandlers();

  // Row selection state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkPayAlertOpen, setIsBulkPayAlertOpen] = React.useState(false);

  // Computed values
  const selectedOrders = React.useMemo(() => {
    return purchaseOrders.filter(o => rowSelection[o.systemId]);
  }, [purchaseOrders, rowSelection]);

  const numSelected = Object.keys(rowSelection).filter(k => rowSelection[k]).length;

  // Handler: Start cancel request
  const handleCancelRequest = React.useCallback((po: PurchaseOrder) => {
    cancelWorkflow.handleCancelRequest(po);
  }, [cancelWorkflow]);

  // Handler: Start receive goods
  const handleReceiveGoods = React.useCallback((po: PurchaseOrder) => {
    receiveWorkflow.beginReceiveFlow([po]);
  }, [receiveWorkflow]);

  // Handler: View payment details
  const handlePayment = React.useCallback((po: PurchaseOrder) => {
    router.push(`/purchase-orders/${po.systemId}`);
    toast(`Mở trang thanh toán cho đơn ${po.id}`);
  }, [router]);

  // Handler: Print single
  const handlePrint = React.useCallback((po: PurchaseOrder) => {
    printHandlers.handlePrint(po);
  }, [printHandlers]);

  // Bulk actions
  const handleBulkPrint = React.useCallback(() => {
    if (numSelected === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    printHandlers.openBulkPrintDialog(selectedOrders);
  }, [numSelected, selectedOrders, printHandlers]);

  const handleBulkCancel = React.useCallback(() => {
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

  const handleBulkReceive = React.useCallback(() => {
    if (numSelected === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    receiveWorkflow.beginReceiveFlow(selectedOrders);
  }, [numSelected, selectedOrders, receiveWorkflow]);

  const confirmBulkPay = React.useCallback(() => {
    const paymentCategory = paymentTypes.find(pt => pt.name === 'Thanh toán cho đơn nhập hàng');
    const { add: addPayment } = usePaymentStore.getState();
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
          console.error(`Không tìm thấy tài khoản ngân hàng cho chi nhánh ${po.branchName}`);
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
          purchaseOrderSystemId: asSystemId(po.systemId),
          purchaseOrderId: asBusinessId(po.id),
          originalDocumentId: po.id,
        } satisfies Omit<Payment, 'systemId'>;
        addPayment(newPayment);
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
  }, [selectedOrders, allPayments, allPurchaseReturns, accounts, paymentTypes, currentUserSystemId, syncAllPurchaseOrderStatuses]);

  // Print dialog handlers
  const handlePrintConfirm = React.useCallback((options: Parameters<typeof printHandlers.handlePrintConfirm>[0]) => {
    printHandlers.handlePrintConfirm(options);
    setRowSelection({});
  }, [printHandlers]);

  // Cancel dialog handlers
  const handleConfirmCancel = React.useCallback(() => {
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
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });

  // Mobile infinite scroll state
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [globalFilter, branchFilter, statusFilter, paymentStatusFilter]);

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
    pagination,
    setPagination,
    mobileLoadedCount,
    setMobileLoadedCount,
  };
}

/**
 * Hook for import/export dialog state
 */
export function usePurchaseOrdersImportExport() {
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  return {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
  };
}
