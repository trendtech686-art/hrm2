import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router.ts';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, toISODate } from '../../lib/date-utils.ts';
import { usePurchaseOrderStore } from "./store.ts"
import { sumPaymentsForPurchaseOrder } from "./payment-utils.ts"
import { useBranchStore } from '../settings/branches/store.ts';
import { getColumns } from "./columns.tsx"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx"
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { PageToolbar } from "../../components/layout/page-toolbar.tsx"
import { PageFilters } from "../../components/layout/page-filters.tsx"
import { Input } from "../../components/ui/input.tsx"
import { PurchaseOrderCard } from "./purchase-order-card.tsx"
import { useBreakpoint } from "../../contexts/breakpoint-context.tsx";
import { Card, CardContent } from "../../components/ui/card.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx"
import { Button } from "../../components/ui/button.tsx"
import { PlusCircle, Printer, XCircle, CreditCard, PackageCheck } from "lucide-react"
import Fuse from "fuse.js"
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import type { PurchaseOrder } from "./types.ts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import type { Payment } from '../payments/types.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useInventoryReceiptStore } from '../inventory-receipts/store.ts';
import { useProductStore } from '../products/store.ts';
import { useStockHistoryStore } from '../stock-history/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { usePaymentTypeStore } from '../settings/payments/types/store.ts';
// REMOVED: Voucher type no longer exists
// import type { Voucher } from '../vouchers/types.ts';
import { usePurchaseReturnStore } from "../purchase-returns/store.ts";
import type { PurchaseReturnLineItem } from "../purchase-returns/types.ts";
import { toast } from 'sonner';
import { useAuth } from "../../contexts/auth-context.tsx";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../components/ui/dialog.tsx";
import { Label } from "../../components/ui/label.tsx";
import { Textarea } from "../../components/ui/textarea.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table.tsx";
import { asBusinessId, asSystemId } from "@/lib/id-types";
import type { SystemId } from "@/lib/id-types";
import { useStoreInfoStore } from '../settings/store-info/store-info-store.ts';
import { usePrint } from '../../lib/use-print.ts';
import { 
  convertPurchaseOrderForPrint,
  mapPurchaseOrderToPrintData,
  mapPurchaseOrderLineItems,
  createStoreSettings,
} from '../../lib/print/purchase-order-print-helper.ts';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog.tsx';
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2.tsx";
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2.tsx";
import { purchaseOrderImportExportConfig, flattenPurchaseOrdersForExport } from "../../lib/import-export/configs/purchase-order.config.ts";
import { FileSpreadsheet, Download } from "lucide-react";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

type ReceiveLineItemForm = {
  productSystemId: SystemId;
  productId: string;
  productName: string;
  orderedQuantity: number;
  remainingQuantity: number;
  receiveQuantity: number;
  unitPrice: number;
};

type ReceiveDialogState = {
  isOpen: boolean;
  purchaseOrder: PurchaseOrder | null;
  receivedDate: string;
  targetBranchSystemId: SystemId | null;
  targetBranchName: string;
  warehouseName: string;
  documentCode: string;
  notes: string;
  items: ReceiveLineItemForm[];
};

export function PurchaseOrdersPage() {
  const { data: purchaseOrders, cancelOrder, processInventoryReceipt, bulkCancel, syncAllPurchaseOrderStatuses } = usePurchaseOrderStore();
  const { data: branches, findById: findBranchById } = useBranchStore();
  const { data: suppliers, findById: findSupplierById } = useSupplierStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { print } = usePrint();
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  
  // Sync payment statuses when component mounts hoặc khi vouchers thay đổi
  React.useEffect(() => {
    syncAllPurchaseOrderStatuses();
  }, [syncAllPurchaseOrderStatuses]);
  
  const headerActions = React.useMemo(() => [
    <Button
      key="add"
      className="h-9"
      size="sm"
      onClick={() => navigate(ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW)}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Tạo đơn nhập hàng
    </Button>
  ], [navigate]);

  usePageHeader({
    title: "Đơn nhập hàng",
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS, isCurrent: true }
    ],
    actions: headerActions,
    showBackButton: false
  });
  
  // Data stores for actions
  const { data: allPayments } = usePaymentStore();
  const { data: allReceipts, add: addInventoryReceipt } = useInventoryReceiptStore();
  const { updateInventory, findById: findProductById } = useProductStore();
  const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
  const { accounts } = useCashbookStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  const { employee: loggedInUser } = useAuth();
  const { add: addPurchaseReturn, data: allPurchaseReturns } = usePurchaseReturnStore();
  const currentUserSystemId = loggedInUser?.systemId ?? 'SYSTEM';
  const currentUserName = loggedInUser?.fullName ?? 'Hệ thống';


  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [cancelDialogState, setCancelDialogState] = React.useState<{
    isOpen: boolean;
    po: PurchaseOrder | null;
    willCreateReturn?: boolean;
    totalPaid?: number;
  }>({ isOpen: false, po: null });

  const [isBulkPayAlertOpen, setIsBulkPayAlertOpen] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [receiveDialogState, setReceiveDialogState] = React.useState<ReceiveDialogState>({
    isOpen: false,
    purchaseOrder: null,
    receivedDate: '',
    targetBranchSystemId: null,
    targetBranchName: '',
    warehouseName: '',
    documentCode: '',
    notes: '',
    items: [],
  });
  const [pendingReceiveQueue, setPendingReceiveQueue] = React.useState<PurchaseOrder[]>([]);
  const [isSubmittingReceive, setIsSubmittingReceive] = React.useState(false);
  
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'purchase-orders-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, () => {}, () => {}, []);
    const allColumnIds = cols.map(c => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every(id => id in parsed)) return parsed;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  
  React.useEffect(() => {
    localStorage.setItem('purchase-orders-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  // Mobile infinite scroll state
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [globalFilter, branchFilter, statusFilter, paymentStatusFilter]);

  const handleCancelRequest = React.useCallback((po: PurchaseOrder) => {
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);

    const hasBeenDelivered = po.deliveryStatus !== 'Chưa nhập';

    setCancelDialogState({ 
        isOpen: true, 
        po: po, 
        totalPaid: totalPaid,
        willCreateReturn: hasBeenDelivered 
    });
  }, [allPayments]);

  const confirmCancel = () => {
    if (!cancelDialogState.po) return;
    const po = cancelDialogState.po;

    if (cancelDialogState.willCreateReturn) {
        const poSystemId = asSystemId(po.systemId);
        const receiptsForPO = allReceipts.filter(r => r.purchaseOrderSystemId === poSystemId);
        const returnsForPO = allPurchaseReturns.filter(pr => pr.purchaseOrderSystemId === poSystemId);

        const returnItems = po.lineItems
          .map<PurchaseReturnLineItem | null>(item => {
            const totalReceived = receiptsForPO.reduce((sum, receipt) => {
              const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
              return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
            }, 0);
            const totalReturned = returnsForPO.reduce((sum, pr) => {
              const returnItem = pr.items.find(i => i.productSystemId === item.productSystemId);
              return sum + (returnItem ? returnItem.returnQuantity : 0);
            }, 0);
            const returnableQuantity = totalReceived - totalReturned;

            if (returnableQuantity <= 0) {
              return null;
            }

            return {
              productSystemId: asSystemId(item.productSystemId),
              productId: asBusinessId(item.productId),
              productName: item.productName,
              orderedQuantity: item.quantity,
              returnQuantity: returnableQuantity,
              unitPrice: item.unitPrice,
            } satisfies PurchaseReturnLineItem;
          })
          .filter((item): item is PurchaseReturnLineItem => Boolean(item));

        if (returnItems.length > 0) {
          const totalReturnValue = returnItems.reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0);

          addPurchaseReturn({
            id: asBusinessId(''),
            purchaseOrderSystemId: asSystemId(po.systemId),
            purchaseOrderId: asBusinessId(po.id),
            supplierSystemId: asSystemId(po.supplierSystemId),
            supplierName: po.supplierName,
            branchSystemId: asSystemId(po.branchSystemId),
            branchName: po.branchName,
            returnDate: toISODate(getCurrentDate()),
            reason: `Tự động tạo khi hủy đơn nhập hàng ${po.id}`,
            items: returnItems,
            totalReturnValue,
            refundAmount: 0,
            refundMethod: '',
            creatorName: currentUserName,
          });
        }
    }

    cancelOrder(po.systemId, currentUserSystemId, currentUserName);
    setCancelDialogState({ isOpen: false, po: null });
  };

  const requireLoggedInEmployee = React.useCallback(() => {
    if (!loggedInUser) {
      toast.error('Chưa xác định người nhận', {
        description: 'Vui lòng đăng nhập để ghi nhận người nhập hàng.',
      });
      return false;
    }
    return true;
  }, [loggedInUser, toast]);

  const computeReceivableItems = React.useCallback((po: PurchaseOrder): ReceiveLineItemForm[] => {
    const relatedReceipts = allReceipts.filter(r => r.purchaseOrderSystemId === asSystemId(po.systemId));
    return po.lineItems
      .map(item => {
        const receivedQty = relatedReceipts.reduce((sum, receipt) => {
          const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
          return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
        }, 0);
        const remaining = Math.max(item.quantity - receivedQty, 0);
        return {
          productSystemId: asSystemId(item.productSystemId),
          productId: item.productId,
          productName: item.productName,
          orderedQuantity: item.quantity,
          remainingQuantity: remaining,
          receiveQuantity: remaining,
          unitPrice: item.unitPrice,
        };
      })
      .filter(item => item.remainingQuantity > 0);
  }, [allReceipts]);

  const openReceiveDialogForOrder = React.useCallback((po: PurchaseOrder, presetItems?: ReceiveLineItemForm[]) => {
    const computedItems = presetItems ?? computeReceivableItems(po);
    if (computedItems.length === 0) {
      toast.error('Đơn đã nhận đủ', {
        description: `Đơn ${po.id} không còn số lượng cần nhập`,
      });
      return false;
    }
    const branchMatch = branches.find(b => b.systemId === po.branchSystemId);
    const fallbackBranch = branchMatch ?? branches[0];
    const targetBranchId: SystemId | null =
      fallbackBranch?.systemId ?? (po.branchSystemId ? asSystemId(po.branchSystemId) : null);
    const targetBranchName = fallbackBranch?.name || po.branchName || 'Chưa xác định';

    setReceiveDialogState({
      isOpen: true,
      purchaseOrder: po,
      receivedDate: formatDateCustom(new Date(), "yyyy-MM-dd'T'HH:mm"),
      targetBranchSystemId: targetBranchId,
      targetBranchName,
      warehouseName: po.branchName ? `Kho ${po.branchName}` : '',
      documentCode: '',
      notes: '',
      items: computedItems,
    });
    return true;
  }, [branches, computeReceivableItems, toast]);

  const closeReceiveDialog = React.useCallback(() => {
    setReceiveDialogState({
      isOpen: false,
      purchaseOrder: null,
      receivedDate: '',
      targetBranchSystemId: null,
      targetBranchName: '',
      warehouseName: '',
      documentCode: '',
      notes: '',
      items: [],
    });
    setPendingReceiveQueue([]);
  }, []);

  const beginReceiveFlow = React.useCallback((orders: PurchaseOrder[]) => {
    if (!requireLoggedInEmployee()) return;
    const receivableEntries = orders
      .map(po => ({ po, items: computeReceivableItems(po) }))
      .filter(entry => entry.items.length > 0);

    if (receivableEntries.length === 0) {
      toast('Không có đơn hợp lệ', {
        description: 'Các đơn đã chọn đều đã nhập đủ hàng.',
      });
      return;
    }

    const [firstEntry, ...restEntries] = receivableEntries;
    setPendingReceiveQueue(restEntries.map(entry => entry.po));
    openReceiveDialogForOrder(firstEntry.po, firstEntry.items);
  }, [computeReceivableItems, openReceiveDialogForOrder, requireLoggedInEmployee, toast]);

  const handleReceiveQuantityChange = React.useCallback((productSystemId: SystemId, value: number) => {
    setReceiveDialogState(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productSystemId === productSystemId
          ? { ...item, receiveQuantity: Math.min(Math.max(value, 0), item.remainingQuantity) }
          : item
      )
    }));
  }, []);

  const handleReceiveFieldChange = React.useCallback((field: 'documentCode' | 'receivedDate' | 'warehouseName' | 'notes', value: string) => {
    setReceiveDialogState(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleReceiveBranchChange = React.useCallback((branchSystemId: string) => {
    const branch = branches.find(b => b.systemId === branchSystemId);
    const nextSystemId = branch?.systemId ?? (branchSystemId ? asSystemId(branchSystemId) : null);
    setReceiveDialogState(prev => ({
      ...prev,
      targetBranchSystemId: nextSystemId,
      targetBranchName: branch?.name || prev.targetBranchName,
    }));
  }, [branches]);

  const handleSubmitReceiveDialog = React.useCallback(() => {
    if (!receiveDialogState.purchaseOrder || !requireLoggedInEmployee()) {
      return;
    }

    if (!receiveDialogState.targetBranchSystemId) {
      toast.error('Chưa chọn chi nhánh', {
        description: 'Vui lòng chọn chi nhánh nhận hàng trước khi lưu phiếu.',
      });
      return;
    }

    const itemsToReceive = receiveDialogState.items
      .filter(item => item.receiveQuantity > 0)
      .map(item => ({
        productSystemId: item.productSystemId,
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: item.orderedQuantity,
        receivedQuantity: item.receiveQuantity,
        unitPrice: item.unitPrice,
      }));

    if (itemsToReceive.length === 0) {
      toast.error('Chưa chọn số lượng', {
        description: 'Vui lòng nhập số lượng thực nhận cho ít nhất một sản phẩm.',
      });
      return;
    }

    setIsSubmittingReceive(true);
    try {
      const normalizedDate = receiveDialogState.receivedDate
        ? receiveDialogState.receivedDate.replace('T', ' ')
        : formatDateCustom(new Date(), 'yyyy-MM-dd HH:mm');

        const branchSystemId = receiveDialogState.targetBranchSystemId;
        const receiptPayload = {
          id: asBusinessId(receiveDialogState.documentCode?.trim() || ''),
          purchaseOrderSystemId: asSystemId(receiveDialogState.purchaseOrder.systemId),
          purchaseOrderId: asBusinessId(
            receiveDialogState.purchaseOrder.id || receiveDialogState.purchaseOrder.systemId,
          ),
          supplierSystemId: asSystemId(receiveDialogState.purchaseOrder.supplierSystemId),
          supplierName: receiveDialogState.purchaseOrder.supplierName,
          receivedDate: normalizedDate,
          receiverSystemId: asSystemId(currentUserSystemId),
          receiverName: currentUserName,
          notes: receiveDialogState.notes,
          branchSystemId,
          branchName: receiveDialogState.targetBranchName,
          warehouseName: receiveDialogState.warehouseName,
          items: itemsToReceive.map(item => ({
            productSystemId: item.productSystemId,
            productId: asBusinessId(item.productId || ''),
            productName: item.productName,
            orderedQuantity: item.orderedQuantity,
            receivedQuantity: item.receivedQuantity,
            unitPrice: item.unitPrice,
          })),
        };

          const createdReceipt = addInventoryReceipt(receiptPayload);

          itemsToReceive.forEach(item => {
            const productBeforeUpdate = findProductById(item.productSystemId);
            const oldStock = productBeforeUpdate?.inventoryByBranch?.[branchSystemId] || 0;

            updateInventory(item.productSystemId, branchSystemId, item.receivedQuantity);

        addStockHistoryEntry({
          productId: item.productSystemId,
          date: new Date().toISOString(),
          employeeName: currentUserName,
          action: `Nhập hàng từ NCC (${receiveDialogState.purchaseOrder?.id})`,
          quantityChange: item.receivedQuantity,
          newStockLevel: oldStock + item.receivedQuantity,
          documentId: createdReceipt.id,
          branch: receiveDialogState.targetBranchName,
              branchSystemId,
        });
      });

      processInventoryReceipt(receiveDialogState.purchaseOrder.systemId);
      toast.success('Đã lưu phiếu nhập', {
        description: `Hoàn tất nhập hàng cho đơn ${receiveDialogState.purchaseOrder.id}.`,
      });

      if (pendingReceiveQueue.length > 0) {
        const [next, ...rest] = pendingReceiveQueue;
        setPendingReceiveQueue(rest);
        openReceiveDialogForOrder(next);
      } else {
        closeReceiveDialog();
      }
    } finally {
      setIsSubmittingReceive(false);
    }
  }, [receiveDialogState, requireLoggedInEmployee, currentUserSystemId, currentUserName, addInventoryReceipt, findProductById, updateInventory, addStockHistoryEntry, processInventoryReceipt, toast, pendingReceiveQueue, openReceiveDialogForOrder, closeReceiveDialog]);

  const handlePrint = React.useCallback((po: PurchaseOrder) => {
    // Use helper to prepare print data
    const branch = findBranchById(po.branchSystemId);
    const supplier = findSupplierById(po.supplierSystemId);
    const storeSettings = branch 
      ? createStoreSettings(branch)
      : createStoreSettings(storeInfo);
    const poData = convertPurchaseOrderForPrint(po, { branch, supplier });
    
    print('purchase-order', {
      data: mapPurchaseOrderToPrintData(poData, storeSettings),
      lineItems: mapPurchaseOrderLineItems(poData.items),
    });
    toast(`Đang in đơn nhập hàng ${po.id}`);
  }, [findBranchById, findSupplierById, storeInfo, print]);

  const handlePayment = React.useCallback((po: PurchaseOrder) => {
    // TODO: Implement payment dialog/modal
    navigate(`/purchase-orders/${po.systemId}`);
    toast(`Mở trang thanh toán cho đơn ${po.id}`);
  }, [navigate, toast]);

  const handleReceiveGoods = React.useCallback((po: PurchaseOrder) => {
    beginReceiveFlow([po]);
  }, [beginReceiveFlow]);

  // Print dialog state
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintPOs, setPendingPrintPOs] = React.useState<PurchaseOrder[]>([]);
  const { printMultiple } = usePrint();

  // Bulk actions - open print dialog
  const handleBulkPrint = () => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn hàng',
      });
      return;
    }
    const selectedPOs = purchaseOrders.filter(p => selectedIds.includes(p.systemId));
    setPendingPrintPOs(selectedPOs);
    setIsPrintDialogOpen(true);
  };

  // Handle print confirm from dialog
  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const { branchSystemId, paperSize } = options;
    
    const printOptionsList = pendingPrintPOs.map(po => {
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(po.branchSystemId);
      const supplier = findSupplierById(po.supplierSystemId);
      const storeSettings = branch 
        ? createStoreSettings(branch)
        : createStoreSettings(storeInfo);
      const poData = convertPurchaseOrderForPrint(po, { branch, supplier });
      
      return {
        data: mapPurchaseOrderToPrintData(poData, storeSettings),
        lineItems: mapPurchaseOrderLineItems(poData.items),
        paperSize,
      };
    });
    
    printMultiple('purchase-order', printOptionsList);
    
    toast.success('Đã gửi lệnh in', {
      description: pendingPrintPOs.map(p => p.id).join(', ')
    });
    setRowSelection({});
    setPendingPrintPOs([]);
  }, [pendingPrintPOs, findBranchById, findSupplierById, storeInfo, printMultiple]);

  const handleBulkCancel = () => {
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
  };

  const allSelectedRows = React.useMemo(() => 
    purchaseOrders.filter(po => rowSelection[po.systemId]),
  [purchaseOrders, rowSelection]);

  const selectedOrders = React.useMemo(() => {
    return purchaseOrders.filter(o => rowSelection[o.systemId]);
  }, [purchaseOrders, rowSelection]);

  const numSelected = Object.keys(rowSelection).length;

  const confirmBulkPay = () => {
    const paymentCategory = paymentTypes.find(pt => pt.name === 'Thanh toán cho đơn nhập hàng');
    const { add: addPayment } = usePaymentStore.getState();
    const paymentMethodName = 'Chuyển khoản';
    const paymentMethodSystemId = 'BANK_TRANSFER';
    let totalPaymentsCreated = 0;
    
    allSelectedRows.forEach(po => {
        const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);
        const totalReturnValue = allPurchaseReturns
          .filter(r => r.purchaseOrderSystemId === asSystemId(po.systemId))
          .reduce((sum, r) => sum + r.totalReturnValue, 0);
        const actualDebt = Math.max(po.grandTotal - totalReturnValue, 0);
        const amountRemaining = actualDebt - totalPaid;

        if (amountRemaining > 0) {
            const account = accounts.find(acc => acc.type === 'bank' && acc.branchSystemId === po.branchSystemId) || accounts.find(acc => acc.type === 'bank');
            if (!account) {
                console.error(`Không tìm thấy tài khoản ngân hàng cho chi nhánh ${po.branchName}`);
                return;
            }

            const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
            const newPayment: Omit<Payment, 'systemId'> = {
              id: '' as any,
                date: now,
                amount: amountRemaining,
                recipientTypeSystemId: 'NHACUNGCAP',
                recipientTypeName: 'Nhà cung cấp',
                recipientName: po.supplierName,
                recipientSystemId: po.supplierSystemId,
                description: `Thanh toán toàn bộ cho đơn nhập hàng ${po.id}`,
                paymentMethodSystemId,
                paymentMethodName,
                accountSystemId: account.systemId,
                paymentReceiptTypeSystemId: paymentCategory?.systemId || '',
                paymentReceiptTypeName: paymentCategory?.name || 'Thanh toán cho đơn nhập hàng',
                branchSystemId: po.branchSystemId,
                branchName: po.branchName,
                createdBy: currentUserName,
                createdAt: now,
                status: 'completed',
                category: 'supplier_payment',
                affectsDebt: true,
                purchaseOrderSystemId: po.systemId,
                purchaseOrderId: po.id,
                originalDocumentId: po.id,
            } as any;
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
  };

  // Import handler
  const handleImport = React.useCallback(async (
    importedOrders: Partial<PurchaseOrder>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
    _branchId?: string
  ) => {
    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;
    const errors: Array<{ row: number; message: string }> = [];
    
    // Get add and update from store
    const storeState = usePurchaseOrderStore.getState();
    
    importedOrders.forEach((order, index) => {
      try {
        const existing = purchaseOrders.find(o => 
          o.id.toLowerCase() === (order.id || '').toLowerCase()
        );
        
        if (existing) {
          if (mode === 'update-only' || mode === 'upsert') {
            storeState.update(asSystemId(existing.systemId), { ...existing, ...order, systemId: existing.systemId } as PurchaseOrder);
            updatedCount++;
          } else {
            skippedCount++;
          }
        } else {
          if (mode === 'insert-only' || mode === 'upsert') {
            storeState.add(order as PurchaseOrder);
            addedCount++;
          } else {
            skippedCount++;
          }
        }
      } catch (error) {
        errors.push({ row: index + 1, message: (error as Error).message });
      }
    });
    
    if (addedCount > 0 || updatedCount > 0) {
      const messages = [];
      if (addedCount > 0) messages.push(`${addedCount} đơn nhập hàng mới`);
      if (updatedCount > 0) messages.push(`${updatedCount} đơn cập nhật`);
      toast.success(`Đã import: ${messages.join(', ')}`);
    }
    
    return {
      success: addedCount + updatedCount,
      failed: errors.length,
      inserted: addedCount,
      updated: updatedCount,
      skipped: skippedCount,
      errors,
    };
  }, [purchaseOrders]);

  const handleBulkReceiveStart = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Chưa chọn đơn hàng', {
        description: 'Vui lòng chọn ít nhất một đơn nhập hàng cần nhập kho.',
      });
      return;
    }

    const targetOrders = allSelectedRows.filter(po => po.deliveryStatus !== 'Đã nhập');
    if (targetOrders.length === 0) {
      toast('Tất cả đơn đã nhập', {
        description: 'Các đơn đã chọn đều đã hoàn tất nhập kho.',
      });
      return;
    }

    setRowSelection({});
    beginReceiveFlow(targetOrders);
  }, [allSelectedRows, beginReceiveFlow, toast]);

  const columns = React.useMemo(() => getColumns(handleCancelRequest, handlePrint, handlePayment, handleReceiveGoods, branches as any), [handleCancelRequest, handlePrint, handlePayment, handleReceiveGoods, branches]);
  
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'supplierName', 'branchName', 'buyer', 'orderDate', 'deliveryDate', 
      'shippingFee', 'tax', 'discount', 'notes', 'creatorName', 'grandTotal',
      'status', 'deliveryStatus', 'paymentStatus', 'returnStatus', 'refundStatus'
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
  }, [columns]);
  
  const fuse = React.useMemo(() => new Fuse(purchaseOrders, { keys: ["id", "supplierName", "status"] }), [purchaseOrders]);
  
  const filteredData = React.useMemo(() => {
    let data = purchaseOrders;
    if (branchFilter !== 'all') {
      data = data.filter(po => po.branchSystemId === branchFilter);
    }
    if (statusFilter !== 'all') {
      data = data.filter(po => po.status === statusFilter);
    }
    if (paymentStatusFilter !== 'all') {
      data = data.filter(po => po.paymentStatus === paymentStatusFilter);
    }
    if (globalFilter) {
        data = fuse.search(globalFilter, { limit: data.length }).map(result => result.item);
    }
    return data;
  }, [purchaseOrders, globalFilter, fuse, branchFilter, statusFilter, paymentStatusFilter]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'orderDate') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // Mobile infinite scroll listener
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      // Load more when scroll 80%
      if (scrollPercentage > 80 && mobileLoadedCount < sortedData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, sortedData.length]);

  // Display data: mobile uses infinite scroll, desktop uses pagination
  const displayData = isMobile 
    ? sortedData.slice(0, mobileLoadedCount)
    : paginatedData;

  const hasValidReceiveQuantity = React.useMemo(
    () => receiveDialogState.items.some(item => item.receiveQuantity > 0),
    [receiveDialogState.items]
  );

  const bulkActions = [
    {
      label: "In đơn nhập hàng",
      onSelect: handleBulkPrint
    },
    {
      label: "Thanh toán",
      onSelect: () => setIsBulkPayAlertOpen(true)
    },
    {
      label: "Nhập hàng",
      onSelect: handleBulkReceiveStart
    },
    {
      label: "Hủy đơn",
      onSelect: handleBulkCancel
    }
  ];

  const handleRowClick = (row: PurchaseOrder) => {
    navigate(`/purchase-orders/${row.systemId}`);
  };

  // Calculate statistics for POs with receipts and returns
  const poStats = React.useMemo(() => {
    const stats = new Map<string, { 
      totalOrdered: number; 
      totalReceived: number; 
      totalReturned: number;
      variance: number;
    }>();

    // Collect all PO IDs
    purchaseOrders.forEach(po => {
      const totalOrdered = po.lineItems.reduce((sum, item) => sum + item.quantity, 0);
      stats.set(po.id, { totalOrdered, totalReceived: 0, totalReturned: 0, variance: totalOrdered });
    });

    // Add received quantities
    allReceipts.forEach(receipt => {
      if (receipt.purchaseOrderId && stats.has(receipt.purchaseOrderId)) {
        const totalReceived = receipt.items.reduce((sum, item) => sum + item.receivedQuantity, 0);
        const current = stats.get(receipt.purchaseOrderId)!;
        current.totalReceived += totalReceived;
        current.variance = current.totalOrdered - current.totalReceived + current.totalReturned;
      }
    });

    // Add returned quantities
    allPurchaseReturns.forEach(ret => {
      if (ret.purchaseOrderId && stats.has(ret.purchaseOrderId)) {
        const totalReturned = ret.items.reduce((sum, item) => sum + item.returnQuantity, 0);
        const current = stats.get(ret.purchaseOrderId)!;
        current.totalReturned += totalReturned;
        current.variance = current.totalOrdered - current.totalReceived + current.totalReturned;
      }
    });

    // Calculate totals
    let totalOrdered = 0;
    let totalReceived = 0;
    let totalReturned = 0;
    stats.forEach(stat => {
      totalOrdered += stat.totalOrdered;
      totalReceived += stat.totalReceived;
      totalReturned += stat.totalReturned;
    });

    return { 
      totalOrdered, 
      totalReceived, 
      totalReturned,
      netInStock: totalReceived - totalReturned,
      receivedRate: totalOrdered > 0 ? ((totalReceived / totalOrdered) * 100).toFixed(1) : '0',
      returnedRate: totalReceived > 0 ? ((totalReturned / totalReceived) * 100).toFixed(1) : '0'
    };
  }, [purchaseOrders, allReceipts, allPurchaseReturns]);

  return (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-muted-foreground">Tổng đặt hàng</p>
            <p className="text-h3">{poStats.totalOrdered} SP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-muted-foreground">Đã nhận</p>
            <p className="text-h3 text-green-600">
              {poStats.totalReceived} SP
              <span className="text-body-sm text-muted-foreground ml-2">({poStats.receivedRate}%)</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-muted-foreground">Đã trả lại</p>
            <p className="text-h3 text-orange-600">
              {poStats.totalReturned} SP
              <span className="text-body-sm text-muted-foreground ml-2">({poStats.returnedRate}%)</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-body-sm text-muted-foreground">Tồn kho thực</p>
            <p className={`text-h3 ${poStats.netInStock >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {poStats.netInStock > 0 ? '+' : ''}{poStats.netInStock} SP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* PageToolbar - Desktop only */}
      {!isMobile && (
        <PageToolbar
          rightActions={
            <>
              <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Nhập file
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
              <DataTableColumnCustomizer
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
              />
            </>
          }
        />
      )}

      {/* PageFilters */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm đơn nhập hàng..."
      >
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="Chi nhánh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Đặt hàng">Đặt hàng</SelectItem>
            <SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem>
            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
            <SelectItem value="Kết thúc">Kết thúc</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="Thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
            <SelectItem value="Thanh toán một phần">Thanh toán một phần</SelectItem>
            <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
          </SelectContent>
        </Select>
      </PageFilters>
      
      {/* Responsive Data Table */}
      <ResponsiveDataTable 
        columns={columns}
        data={displayData}
        renderMobileCard={(po) => (
          <PurchaseOrderCard 
            purchaseOrder={po}
            onCancel={handleCancelRequest}
            onPrint={handlePrint}
            onPayment={handlePayment}
            onReceiveGoods={handleReceiveGoods}
            onClick={handleRowClick}
          />
        )}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        onRowClick={handleRowClick}
        showBulkDeleteButton={false}
        bulkActions={bulkActions}
        allSelectedRows={allSelectedRows}
        expanded={{}}
        setExpanded={() => {}}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
      />

      {/* Mobile Loading Indicator */}
      {isMobile && (
        <div className="py-6 text-center">
          {mobileLoadedCount < sortedData.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-body-sm">Đang tải thêm...</span>
            </div>
          ) : sortedData.length > 20 ? (
            <p className="text-body-sm text-muted-foreground">
              Đã hiển thị tất cả {sortedData.length} kết quả
            </p>
          ) : null}
        </div>
      )}
      
      <AlertDialog open={cancelDialogState.isOpen} onOpenChange={(open) => setCancelDialogState(s => ({ ...s, isOpen: open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn hủy đơn hàng này?</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelDialogState.willCreateReturn ? (
                <>
                  Đơn hàng này đã có sản phẩm được nhập kho. Hủy đơn sẽ tự động tạo một <strong>Phiếu Xuất trả hàng</strong> cho các sản phẩm đã nhận.
                  {cancelDialogState.totalPaid && cancelDialogState.totalPaid > 0 ? (
                    ` Đồng thời, một Phiếu Thu hoàn tiền ${formatCurrency(cancelDialogState.totalPaid)} sẽ được tạo.`
                  ) : ''}
                  {' '}Hành động này không thể hoàn tác.
                </>
              ) : cancelDialogState.totalPaid && cancelDialogState.totalPaid > 0 ? (
                <>
                  Đơn hàng này đã được thanh toán <strong>{formatCurrency(cancelDialogState.totalPaid)}</strong>. 
                  Việc hủy đơn sẽ tự động tạo một <strong>Phiếu Thu</strong> ghi nhận khoản tiền này là "Nhà cung cấp cần hoàn lại". 
                  Hành động này không thể hoàn tác.
                </>
              ) : (
                'Hành động này sẽ chuyển trạng thái đơn hàng thành "Đã hủy" và không thể hoàn tác.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9" onClick={() => setCancelDialogState({ isOpen: false, po: null })}>Thoát</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkPayAlertOpen} onOpenChange={setIsBulkPayAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận thanh toán?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn thanh toán toàn bộ cho {numSelected} đơn hàng đã chọn không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmBulkPay}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={receiveDialogState.isOpen} onOpenChange={(open) => {
        if (!open) {
          closeReceiveDialog();
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Nhập hàng cho {receiveDialogState.purchaseOrder?.id || 'đơn hàng'}</DialogTitle>
            <DialogDescription>
              Chọn chi nhánh, kho nhận và nhập số lượng thực nhận cho từng sản phẩm theo guideline dual ID.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {pendingReceiveQueue.length > 0 && (
              <div className="rounded-md bg-blue-50 px-3 py-2 text-body-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
                Còn {pendingReceiveQueue.length} đơn trong hàng đợi sẽ được mở tiếp sau khi lưu phiếu này.
              </div>
            )}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mã phiếu nhập</Label>
                <Input
                  placeholder="Ví dụ: PNK000123"
                  className="h-9"
                  value={receiveDialogState.documentCode}
                  onChange={(event) => handleReceiveFieldChange('documentCode', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Ngày nhận hàng</Label>
                <Input
                  type="datetime-local"
                  className="h-9"
                  value={receiveDialogState.receivedDate}
                  onChange={(event) => handleReceiveFieldChange('receivedDate', event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Chi nhánh nhận</Label>
                <Select value={receiveDialogState.targetBranchSystemId || undefined} onValueChange={handleReceiveBranchChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn chi nhánh" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(branch => (
                      <SelectItem key={branch.systemId} value={branch.systemId}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Kho nhận</Label>
                <Input
                  placeholder="Kho chính, Kho lẻ..."
                  className="h-9"
                  value={receiveDialogState.warehouseName}
                  onChange={(event) => handleReceiveFieldChange('warehouseName', event.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                placeholder="Ví dụ: Nhập đợt 1, bao gồm phiếu vận chuyển số..."
                value={receiveDialogState.notes}
                onChange={(event) => handleReceiveFieldChange('notes', event.target.value)}
              />
            </div>
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Số lượng đặt</TableHead>
                    <TableHead>Còn lại</TableHead>
                    <TableHead className="w-48">Nhập lần này</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receiveDialogState.items.map(item => (
                    <TableRow key={item.productSystemId}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-body-sm font-medium">{item.productName}</span>
                          <span className="text-body-xs text-muted-foreground">{item.productId}</span>
                        </div>
                      </TableCell>
                      <TableCell>{item.orderedQuantity}</TableCell>
                      <TableCell>{item.remainingQuantity}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={item.remainingQuantity}
                          className="h-9"
                          value={item.receiveQuantity}
                          onChange={(event) => handleReceiveQuantityChange(item.productSystemId, Number(event.target.value))}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {receiveDialogState.items.length === 0 && (
                <p className="p-4 text-body-sm text-muted-foreground">Tất cả sản phẩm trong đơn này đã được nhập đủ.</p>
              )}
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" className="h-9" onClick={closeReceiveDialog} disabled={isSubmittingReceive}>
              Hủy
            </Button>
            <Button
              type="button"
              className="h-9"
              onClick={handleSubmitReceiveDialog}
              disabled={isSubmittingReceive || !hasValidReceiveQuantity || !receiveDialogState.targetBranchSystemId}
            >
              {isSubmittingReceive
                ? 'Đang lưu...'
                : pendingReceiveQueue.length > 0
                  ? 'Lưu & chuyển đơn tiếp theo'
                  : 'Lưu phiếu nhập'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={pendingPrintPOs.length}
        title="In đơn nhập hàng"
      />

      {/* Import Dialog */}
      <GenericImportDialogV2<PurchaseOrder>
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        config={purchaseOrderImportExportConfig}
        branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))}
        existingData={purchaseOrders}
        onImport={handleImport}
        currentUser={{
          name: loggedInUser?.fullName || 'Hệ thống',
          systemId: loggedInUser?.systemId || asSystemId('SYSTEM'),
        }}
      />

      {/* Export Dialog */}
      <GenericExportDialogV2<PurchaseOrder>
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        config={purchaseOrderImportExportConfig}
        allData={purchaseOrders}
        filteredData={sortedData}
        currentPageData={paginatedData}
        selectedData={selectedOrders}
        currentUser={{
          name: loggedInUser?.fullName || 'Hệ thống', 
          systemId: loggedInUser?.systemId || asSystemId('SYSTEM'),
        }}
      />
      
    </div>
  )
}
