'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import { ROUTES } from '../../lib/router';
import { formatDateTime, formatDateCustom, parseDate, getCurrentDate, getDaysDiff, toISODate } from '@/lib/date-utils';
import { usePurchaseOrder } from './hooks/use-purchase-orders';
import { usePurchaseOrderMutations } from './hooks/use-purchase-orders';
import { useSupplierFinder } from '../suppliers/hooks/use-all-suppliers';
import { useSupplierStats } from '../suppliers/hooks/use-supplier-stats';
import { SupplierStatsSection } from '../suppliers/components/supplier-stats-section';
import { usePurchaseOrderPayments, usePurchaseOrderInventoryReceipts, usePurchaseOrderReceipts } from './hooks/use-po-related-data';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table';
import { Users, FileWarning, Package, Truck, CheckCircle2, Edit, Printer, Undo2, Trash2, AlertCircle, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useInventoryReceiptMutations } from '../inventory-receipts/hooks/use-inventory-receipts';
import { useProductFinder } from '../products/hooks/use-all-products';
import { useStockHistoryMutations } from '../stock-history/hooks/use-stock-history';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import { DetailField } from '../../components/ui/detail-field';
import { Tabs, TabsContent } from '../../components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger, mobileBleedCardClass } from '@/components/layout/page-section';
import type { InventoryReceipt } from '@/lib/types/prisma-extended';
// ✅ Heavy components - lazy loaded
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell } from '@/components/layout/page-section';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';
const Comments = dynamic(
  () => import('../../components/Comments').then(m => ({ default: m.Comments })),
  { ssr: false }
);
import { useComments } from '@/hooks/use-comments';
import { usePurchaseReturnMutations } from '../purchase-returns/hooks/use-purchase-returns';
import { usePurchaseReturnsByPO } from '../purchase-returns/hooks/use-purchase-returns';
import type { PurchaseReturn, PurchaseReturnLineItem } from '../purchase-returns/types';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/auth-context';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import type { PurchaseOrder, PurchaseOrderPaymentStatus as PaymentStatus, Payment } from '@/lib/types/prisma-extended';
import { getPaymentsForPurchaseOrder, getReceiptsForPurchaseOrder, sumPaymentsForPurchaseOrder } from './payment-utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { useProductTypeFinder } from '../settings/inventory/hooks/use-all-product-types';
import { usePrint } from '../../lib/use-print';
// ✅ Print helpers - lazy loaded when print is triggered
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { 
  formatCurrency,
  formatTime,
  numberToWords,
  StoreSettings
} from '../../lib/print-mappers/types';
import { PurchaseOrderPaymentItem } from './components/payment-item';
import { usePaymentMutations } from '../payments/hooks/use-payments';
import { useEmployeeFinder, useAllEmployees } from '../employees/hooks/use-all-employees';
import type { PaymentForPrint } from '../../lib/print-mappers/payment.mapper';
import type { ReceiptForPrint } from '../../lib/print-mappers/receipt.mapper';
// ✅ Supplier return print helper - lazy loaded

// Import extracted components
import { 
  StatusTimeline,
  StockHistoryTab,
  type PaymentConfirmationFormValues,
} from './detail';

// Dynamic import for PaymentConfirmationDialog (code-splitting)
const PaymentConfirmationDialog = dynamic(() => import('./detail').then(mod => ({ default: mod.PaymentConfirmationDialog })), { ssr: false });

// ✅ Stock-in print helper - lazy loaded

export function PurchaseOrderDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { data: purchaseOrder, isLoading: isLoadingPO } = usePurchaseOrder(systemId);
  // Don't add onSuccess/onError here - we handle them in mutate() options to avoid duplicate toasts
  const { update: updatePO } = usePurchaseOrderMutations({});
  
  // Helper functions using mutations
  const cancelOrder = React.useCallback((poSystemId: string, _userId: string, _userName: string) => {
    updatePO.mutate(
      { systemId: poSystemId, data: { status: 'Đã hủy' } },
      {
        onSuccess: () => {
          toast.success('Thành công', { description: 'Đơn hàng đã được hủy' });
        },
        onError: (error: Error) => {
          toast.error('Lỗi', { description: error?.message || 'Không thể hủy đơn hàng' });
        },
      }
    );
  }, [updatePO]);
  
  const finishOrder = React.useCallback((poSystemId: string, _userId: string, _userName: string) => {
    updatePO.mutate({ systemId: poSystemId, data: { status: 'Hoàn thành' } });
  }, [updatePO]);
  
  const _processInventoryReceipt = React.useCallback((poSystemId: string) => {
    updatePO.mutate({ systemId: poSystemId, data: { deliveryStatus: 'Đã nhập' } });
  }, [updatePO]);
  
  // All hooks must be called before any early returns (React hooks rules)
  // Move all hook calls here before the conditional return
  const { findById: findSupplierById } = useSupplierFinder();
  
  // ✅ Use server-calculated supplier stats instead of computing locally
  const { data: supplierStats } = useSupplierStats(purchaseOrder?.supplierSystemId);
  
  // ⚡ PERFORMANCE: Only fetch data for this specific PO
  const { data: poPayments, refetch: refetchPayments } = usePurchaseOrderPayments(systemId);
  const { data: poInventoryReceipts } = usePurchaseOrderInventoryReceipts(systemId);
  const { data: poReceiptsFinancial } = usePurchaseOrderReceipts(systemId);
  
  // Create aliases for backwards compatibility with existing code
  const allPayments = poPayments;
  const allReceipts = poInventoryReceipts;
  const allReceiptsFinancial = poReceiptsFinancial;
  
  const allTransactions = React.useMemo(() => [...poPayments], [poPayments]);
  
  const queryClient = useQueryClient();
  const { create: createInventoryReceipt } = useInventoryReceiptMutations({
    onCreateSuccess: () => {
      // Hook already calls invalidateRelated(qc, 'inventory-receipts')
      // which covers: products, price-history, suppliers, purchase-orders, stock-history
    },
    onError: (err) => toast.error(err.message)
  });
  const { findById: findProductById } = useProductFinder();
  const { create: _createStockHistory } = useStockHistoryMutations({
    onSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  const { data: purchaseReturnsForPO } = usePurchaseReturnsByPO(systemId);
  // Create alias for backwards compatibility
  const allPurchaseReturns = React.useMemo(() => {
    const returns = purchaseReturnsForPO?.data ?? purchaseReturnsForPO ?? [];
    return Array.isArray(returns) ? returns : [];
  }, [purchaseReturnsForPO]);
  const { create: createPurchaseReturn } = usePurchaseReturnMutations({
    onCreateSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  const { create: createPayment } = usePaymentMutations({
    onCreateSuccess: async (payment) => {
      toast.dismiss();
      toast.success(`Đã tạo phiếu chi ${payment.id} - ${formatCurrency(Number(payment.amount))}`);
      setIsPaymentConfirmationOpen(false);
      
      // ✅ Force refetch payments to get fresh data
      const refetchResult = await refetchPayments();
      const freshPayments = refetchResult.data || [];
      
      // ✅ Update paymentStatus based on FRESH data from refetch
      if (purchaseOrder) {
        const totalPaidNow = sumPaymentsForPurchaseOrder(freshPayments as Payment[], purchaseOrder);
        
        // Calculate returned value inline (since totalReturnedValue is defined later)
        const returns = Array.isArray(allPurchaseReturns) ? allPurchaseReturns : [];
        const returnedValue = returns.reduce((sum, pr) => sum + Number(pr.totalReturnValue || 0), 0);
        const debt = (purchaseOrder.grandTotal || 0) - returnedValue;
        
        let newStatus = purchaseOrder.status;
        let newPaymentStatus: string;
        
        if (totalPaidNow >= debt) {
          newPaymentStatus = 'Đã thanh toán';
          // Auto-complete if also fully received
          if (purchaseOrder.deliveryStatus === 'Đã nhập') {
            newStatus = 'Hoàn thành';
          }
        } else if (totalPaidNow > 0) {
          newPaymentStatus = 'Thanh toán một phần';
        } else {
          newPaymentStatus = 'Chưa thanh toán';
        }
        
        // Update PO if status changed — await to ensure DB writes before refetch
        if (newPaymentStatus !== purchaseOrder.paymentStatus || newStatus !== purchaseOrder.status) {
          try {
            await updatePO.mutateAsync({ 
              systemId: purchaseOrder.systemId, 
              data: { 
                status: newStatus,
                paymentStatus: newPaymentStatus,
              } 
            });
          } catch {
            // Silently continue — auto-complete useEffect will handle as fallback
          }
        }
        
        // ✅ Final invalidation to ensure UI reflects all changes
        await queryClient.invalidateQueries({ 
          queryKey: ['purchase-orders'],
          refetchType: 'all',
        });
      }
    },
    onError: (err) => {
      toast.dismiss();
      toast.error(err.message || 'Không thể tạo phiếu chi');
      console.error('[Payment] Error creating payment:', err);
    }
  });
  const { employee: authEmployee, can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();
  const currentUserSystemId = asSystemId(authEmployee?.systemId ?? 'SYSTEM');
  const currentUserName = authEmployee?.fullName ?? 'Hệ thống';
  const { findById: findProductTypeById } = useProductTypeFinder();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { findById: findBranchById } = useBranchFinder();
  const { data: employees } = useAllEmployees();

  const getProductTypeName = React.useCallback((productTypeSystemId: string) => {
    const productType = findProductTypeById(asSystemId(productTypeSystemId));
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);
  
  // Resolve branch name from branchSystemId if branchName is missing
  const resolvedBranchName = React.useMemo(() => {
    if (purchaseOrder?.branchName) return purchaseOrder.branchName;
    if (purchaseOrder?.branchSystemId) {
      const branch = findBranchById(asSystemId(purchaseOrder.branchSystemId));
      return branch?.name || '-';
    }
    return '-';
  }, [purchaseOrder?.branchName, purchaseOrder?.branchSystemId, findBranchById]);
  
  // Resolve buyer name from buyerSystemId if buyer is missing
  const resolvedBuyerName = React.useMemo(() => {
    if (purchaseOrder?.buyer) return purchaseOrder.buyer;
    if (purchaseOrder?.buyerSystemId) {
      const employee = findEmployeeById(asSystemId(purchaseOrder.buyerSystemId));
      return employee?.fullName || '-';
    }
    return '-';
  }, [purchaseOrder?.buyer, purchaseOrder?.buyerSystemId, findEmployeeById]);

  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = React.useState(false);
  const [isReceiveConfirmationOpen, setIsReceiveConfirmationOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const [cancelDialogState, setCancelDialogState] = React.useState<{
    isOpen: boolean;
    po: PurchaseOrder | null;
    willCreateReturn?: boolean;
    totalPaid?: number;
  }>({ isOpen: false, po: null });

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('purchase_order', systemId || '');

  const comments = React.useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId,
      content: c.content,
      author: {
        systemId: c.createdBy || 'system',
        name: c.createdByName || 'Hệ thống',
        avatar: undefined,
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const handleAddComment = (content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  };

  const handleUpdateComment = (_commentId: string, _content: string) => {
  };

  const handleDeleteComment = (commentId: string) => {
    dbDeleteComment(commentId);
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentUserSystemId,
    name: currentUserName,
    avatar: authEmployee?.avatar,
  }), [currentUserSystemId, currentUserName, authEmployee?.avatar]);

  const purchaseReturns = React.useMemo(() => {
    if (!purchaseOrder) return [];
    // purchaseReturnsForPO is PurchaseReturnsResponse { data: PurchaseReturn[] }
    const returns = purchaseReturnsForPO?.data ?? purchaseReturnsForPO ?? [];
    return Array.isArray(returns) ? returns : [];
  }, [purchaseReturnsForPO, purchaseOrder]);
  const poReceipts = React.useMemo(
    () => (purchaseOrder ? allReceipts.filter(r => r.purchaseOrderSystemId === purchaseOrder.systemId) : []),
    [purchaseOrder, allReceipts]
  );
  
  const canReturn = React.useMemo(() => {
    if (!purchaseOrder || !purchaseOrder.lineItems) return false;
    
    // Cho phép hoàn trả nếu đã nhập kho (bất kể đã trả bao nhiêu)
    const hasReceived = purchaseOrder.deliveryStatus === 'Đã nhập';
    const isNotCancelled = purchaseOrder.status !== 'Đã hủy' && purchaseOrder.status !== 'Kết thúc';
    
    if (!hasReceived || !isNotCancelled) return false;

    // Simplified check: allow return if deliveryStatus indicates goods were received
    // Detailed quantity check can be done on the return page itself
    const totalReturned = allPurchaseReturns
      .filter(pr => pr.purchaseOrderSystemId === purchaseOrder.systemId)
      .reduce((acc, pr) => acc + pr.items.reduce((sum, item) => sum + item.returnQuantity, 0), 0);

    // Total ordered quantity
    const totalOrdered = purchaseOrder.lineItems.reduce((acc, item) => acc + item.quantity, 0);

    // Can return if not all items have been returned
    return totalOrdered > totalReturned;
  }, [purchaseOrder, allPurchaseReturns]);
  
  // Track if auto-complete has been attempted to prevent infinite loop
  const autoCompleteAttemptedRef = React.useRef<string | null>(null);
  
  // Auto-complete order when both fully paid AND fully received
  React.useEffect(() => {
    if (!purchaseOrder || !allPayments) return;
    
    // Skip if already attempted for this order
    if (autoCompleteAttemptedRef.current === purchaseOrder.systemId) return;
    
    const isAlreadyComplete = purchaseOrder.status === 'Hoàn thành' || purchaseOrder.status === 'Kết thúc' || purchaseOrder.status === 'Đã hủy';
    if (isAlreadyComplete) return;
    
    const isFullyReceived = purchaseOrder.deliveryStatus === 'Đã nhập';
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, purchaseOrder);
    const isFullyPaid = totalPaid >= purchaseOrder.grandTotal;
    
    if (isFullyReceived && isFullyPaid) {
      // Mark as attempted to prevent infinite loop
      autoCompleteAttemptedRef.current = purchaseOrder.systemId;
      
      updatePO.mutate({ 
        systemId: purchaseOrder.systemId, 
        data: { 
          status: 'Hoàn thành',
          paymentStatus: 'Đã thanh toán'
        } 
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseOrder?.systemId, purchaseOrder?.status, purchaseOrder?.deliveryStatus, purchaseOrder?.grandTotal, allPayments]);

  // Tính xem còn sản phẩm nào cần nhập thêm không (sau khi đã nhập và trả hàng)
  const hasRemainingItemsToReceive = React.useMemo(() => {
    if (!purchaseOrder || !purchaseOrder.lineItems) return false;
    
    // Tính số lượng đã nhập cho mỗi sản phẩm
    const getAlreadyReceivedQty = (productSystemId: string) => {
      return poReceipts.reduce((total, receipt) => {
        const item = receipt.items.find(i => i.productSystemId === productSystemId);
        return total + (item ? Number(item.receivedQuantity) : 0);
      }, 0);
    };
    
    // Kiểm tra xem còn sản phẩm nào cần nhập không
    return purchaseOrder.lineItems.some(item => {
      const alreadyReceived = getAlreadyReceivedQty(item.productSystemId);
      const remaining = item.quantity - alreadyReceived;
      return remaining > 0;
    });
  }, [purchaseOrder, poReceipts]);
  
  const canBeFinished = React.useMemo(() => {
    if (!purchaseOrder) return false;
    const isFinanciallySettled = purchaseOrder.paymentStatus === 'Đã thanh toán';
    const isLogisticallySettled = purchaseOrder.deliveryStatus === 'Đã nhập';
    const isFullyReturned = purchaseOrder.returnStatus === 'Hoàn hàng toàn bộ';
    const isTerminal = purchaseOrder.status === 'Kết thúc' || purchaseOrder.status === 'Đã hủy';
    
    return !isTerminal && ((isFinanciallySettled && isLogisticallySettled) || isFullyReturned);
  }, [purchaseOrder]);
  
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
            
            createPurchaseReturn.mutate({
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

  const { info: storeInfo } = useStoreInfoData();
  const { print } = usePrint(purchaseOrder?.branchSystemId);

  const handlePrint = React.useCallback(async () => {
    if (!purchaseOrder) return;

    // ✅ Lazy load print helper
    const { 
      convertPurchaseOrderForPrint,
      mapPurchaseOrderToPrintData, 
      mapPurchaseOrderLineItems,
      createStoreSettings,
    } = await import('../../lib/print/purchase-order-print-helper');

    const branch = findBranchById(purchaseOrder.branchSystemId);
    const supplierForPrint = findSupplierById(purchaseOrder.supplierSystemId as unknown as import('@/lib/id-types').SystemId);

    // Use helper to prepare print data
    const storeSettings = createStoreSettings(storeInfo);
    const poForPrint = convertPurchaseOrderForPrint(purchaseOrder, { 
      branch: branch || undefined, 
      supplier: supplierForPrint || undefined,
    });

    // Calculate payment totals
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, purchaseOrder);
    poForPrint.totalTransactionAmount = totalPaid;
    poForPrint.totalRemain = purchaseOrder.grandTotal - totalPaid;

    const printData = mapPurchaseOrderToPrintData(poForPrint, storeSettings);
    const lineItems = mapPurchaseOrderLineItems(poForPrint.items);

    // Inject extra fields
    printData['amount_text'] = numberToWords(purchaseOrder.grandTotal);

    print('purchase-order', {
      data: printData,
      lineItems: lineItems
    });
  }, [purchaseOrder, findBranchById, storeInfo, print, findSupplierById, allPayments]);

  // Handle print for inventory receipt (phiếu nhập kho)
  const handlePrintReceipt = React.useCallback(async (receipt: InventoryReceipt) => {
    if (!purchaseOrder) return;

    // ✅ Lazy load print helper
    const { 
      convertStockInForPrint,
      mapStockInToPrintData,
      mapStockInLineItems,
      createStoreSettings: createStockInStoreSettings,
    } = await import('../../lib/print/stock-in-print-helper');

    const branch = findBranchById(purchaseOrder.branchSystemId);
    const supplierData = findSupplierById(purchaseOrder.supplierSystemId as unknown as import('@/lib/id-types').SystemId);

    // Use stock-in print helper to prepare data
    const storeSettings = createStockInStoreSettings(storeInfo);
    const stockInForPrint = convertStockInForPrint(receipt, {
      branch: branch || undefined,
      supplier: supplierData ? { 
        id: supplierData.id, 
        name: supplierData.name, 
        phone: supplierData.phone,
        email: supplierData.email,
      } : undefined,
      purchaseOrder: purchaseOrder ? {
        id: purchaseOrder.id,
        code: purchaseOrder.id,
      } : undefined,
    });

    const printData = mapStockInToPrintData(stockInForPrint, storeSettings);
    const lineItems = mapStockInLineItems(stockInForPrint.items);

    // Inject extra fields
    const totalValue = receipt.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) * Number(item.unitPrice)), 0);
    printData['amount_text'] = numberToWords(totalValue);

    print('stock-in', {
      data: printData,
      lineItems: lineItems
    });
  }, [purchaseOrder, findBranchById, storeInfo, print, findSupplierById]);

  // Handle print for purchase return (phiếu trả hàng NCC)
  const handlePrintPurchaseReturn = React.useCallback(async (purchaseReturn: PurchaseReturn) => {
    if (!purchaseOrder) return;

    // ✅ Lazy load print helper
    const { 
      convertSupplierReturnForPrint,
      mapSupplierReturnToPrintData, 
      mapSupplierReturnLineItems,
      createStoreSettings: createSupplierReturnStoreSettings,
    } = await import('../../lib/print/supplier-return-print-helper');

    const branch = findBranchById(purchaseOrder.branchSystemId);
    const supplierData = findSupplierById(purchaseOrder.supplierSystemId as unknown as import('@/lib/id-types').SystemId);

    // Use supplier-return print helper to prepare data
    const storeSettings = createSupplierReturnStoreSettings(storeInfo);
    const returnForPrint = convertSupplierReturnForPrint(purchaseReturn, {
      branch: branch || undefined,
      supplier: supplierData || undefined,
      purchaseOrder: purchaseOrder || undefined,
    });

    const printData = mapSupplierReturnToPrintData(returnForPrint, storeSettings);
    const lineItems = mapSupplierReturnLineItems(returnForPrint.items);

    // Inject extra fields
    printData['amount_text'] = numberToWords(purchaseReturn.totalReturnValue);

    print('supplier-return', {
      data: printData,
      lineItems: lineItems
    });
  }, [purchaseOrder, findBranchById, storeInfo, print, findSupplierById]);

  const _printButton = React.useMemo(() => (
    <Button variant="outline" size="sm" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" /> In
    </Button>
  ), [handlePrint]);

  const statusBadgeVariant = React.useMemo(() => {
    if (!purchaseOrder) return 'secondary' as const;
    switch (purchaseOrder.status) {
      case 'Hoàn thành':
      case 'Kết thúc':
        return 'success' as const;
      case 'Đã hủy':
      case 'Đã trả hàng':
        return 'destructive' as const;
      case 'Đang giao dịch':
        return 'warning' as const;
      default:
        return 'secondary' as const;
    }
  }, [purchaseOrder]);

  const actions = React.useMemo(() => {
    if (!purchaseOrder) return [];
    const isTerminalStatus = purchaseOrder.status === 'Kết thúc' || purchaseOrder.status === 'Đã hủy';
    const _isCompleted = purchaseOrder.status === 'Hoàn thành';
    
    // Theo chuẩn Sapo: Chỉ cho phép sửa/hủy đơn CHƯA nhập kho
    const canEdit = !isTerminalStatus && purchaseOrder.deliveryStatus === 'Chưa nhập' && (isAdmin || can('edit_purchase_orders'));
    const canCancel = !isTerminalStatus && purchaseOrder.deliveryStatus === 'Chưa nhập';

    // Nhóm nút bên trái (In đơn) - Sao chép đã chuyển sang gần badge
    const leftButtons: React.ReactNode[] = [];

    leftButtons.push(
      <Button key="print" variant="outline" size="sm" onClick={handlePrint} className="h-9">
        <Printer className="mr-2 h-4 w-4" />
        In đơn
      </Button>
    );

    // Nhóm nút bên phải (Sửa, Hoàn trả, Hoàn tất, Hủy)
    const actionButtons = [...leftButtons];

    if (!isTerminalStatus && canBeFinished) {
      actionButtons.push(
        <Button key="finish" size="sm" onClick={() => finishOrder(purchaseOrder.systemId, currentUserSystemId, currentUserName)} className="h-9">
          Hoàn tất
        </Button>
      );
    }

    if (canEdit) {
      actionButtons.push(
        <Button key="edit" variant="outline" size="sm" onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}/edit`)} className="h-9">
          <Edit className="mr-2 h-4 w-4" />
          Sửa
        </Button>
      );
    }

    if (canReturn) {
      actionButtons.push(
        <Button key="return" variant="outline" size="sm" onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}/return`)} className="h-9">
          <Undo2 className="mr-2 h-4 w-4" />
          Hoàn trả
        </Button>
      );
    }

    if (canCancel) {
      actionButtons.push(
        <Button key="cancel" variant="destructive" size="sm" onClick={() => handleCancelRequest(purchaseOrder)} className="h-9">
          <Trash2 className="mr-2 h-4 w-4" />
          Hủy đơn
        </Button>
      );
    }

    return actionButtons;
  }, [router, purchaseOrder, canBeFinished, canReturn, finishOrder, currentUserSystemId, currentUserName, handleCancelRequest, handlePrint, can, isAdmin]);

  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || !purchaseOrder) return [];
    const isTerminalStatus = purchaseOrder.status === 'Kết thúc' || purchaseOrder.status === 'Đã hủy';
    const canEdit = !isTerminalStatus && purchaseOrder.deliveryStatus === 'Chưa nhập' && (isAdmin || can('edit_purchase_orders'));
    const canCancelOrder = !isTerminalStatus && purchaseOrder.deliveryStatus === 'Chưa nhập';
    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            In đơn
          </DropdownMenuItem>
          {!isTerminalStatus && canBeFinished && (
            <DropdownMenuItem onClick={() => finishOrder(purchaseOrder.systemId, currentUserSystemId, currentUserName)}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Hoàn tất
            </DropdownMenuItem>
          )}
          {canEdit && (
            <DropdownMenuItem onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
          )}
          {canReturn && (
            <DropdownMenuItem onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}/return`)}>
              <Undo2 className="mr-2 h-4 w-4" />
              Hoàn trả
            </DropdownMenuItem>
          )}
          {canCancelOrder && (
            <DropdownMenuItem onClick={() => handleCancelRequest(purchaseOrder)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Hủy đơn
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [isMobile, purchaseOrder, canBeFinished, canReturn, isAdmin, can, finishOrder, currentUserSystemId, currentUserName, handleCancelRequest, handlePrint, router]);

  // Badge with copy button next to it
  const badgeWithCopy = React.useMemo(() => {
    if (!purchaseOrder) return undefined;
    const isTerminalStatus = purchaseOrder.status === 'Kết thúc' || purchaseOrder.status === 'Đã hủy';
    const returnStatusVariant = purchaseOrder.returnStatus === 'Hoàn hàng toàn bộ' ? 'destructive' : 
                                 purchaseOrder.returnStatus === 'Hoàn hàng một phần' ? 'warning' : null;
    return (
      <div className="flex items-center gap-2">
        <Badge variant={statusBadgeVariant}>{purchaseOrder.status}</Badge>
        {returnStatusVariant && (
          <Badge variant={returnStatusVariant}>{purchaseOrder.returnStatus}</Badge>
        )}
        {!isTerminalStatus && (
          <Button 
            variant="outline" 
            size="sm" 
            className="h-7"
            onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW}?copy=${purchaseOrder.systemId}`)}
          >
            Sao chép
          </Button>
        )}
      </div>
    );
  }, [purchaseOrder, statusBadgeVariant, router]);

  usePageHeader({ 
    actions: isMobile ? mobileHeaderActions : actions,
    title: purchaseOrder?.id ? `Đơn nhập hàng ${purchaseOrder.id}` : 'Chi tiết đơn nhập hàng',
    badge: badgeWithCopy,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS, isCurrent: false },
      { label: purchaseOrder?.id || 'Chi tiết', href: `${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder?.systemId || ''}`, isCurrent: true }
    ],
    showBackButton: true,
    backPath: ROUTES.PROCUREMENT.PURCHASE_ORDERS
  });
  
  const supplier = React.useMemo(() => {
    if (!purchaseOrder) return null;
    // Fallback: try supplierSystemId first, then supplierId (from API relation)
    const supplierId = purchaseOrder.supplierSystemId || (purchaseOrder as unknown as { supplierId?: string })?.supplierId;
    if (!supplierId) return null;
    return findSupplierById(supplierId as unknown as import('@/lib/id-types').SystemId);
  }, [purchaseOrder, findSupplierById]);

  const handlePrintPayment = React.useCallback(async (e: React.MouseEvent, item: { type: 'payment' | 'refund'; amount: number; id: string; date: string; method: string; creator: string; description: string }) => {
      if (!purchaseOrder) return;
      e.stopPropagation();
      
      // ✅ Lazy load print mappers
      const { mapPaymentToPrintData } = await import('../../lib/print-mappers/payment.mapper');
      const { mapReceiptToPrintData } = await import('../../lib/print-mappers/receipt.mapper');
      
      const isPayment = item.type === 'payment';
      const amount = Math.abs(item.amount);
      
      // Get branch info
      const branch = findBranchById(purchaseOrder.branchSystemId);

      // Prepare store settings
      const storeSettings: StoreSettings = {
          name: storeInfo?.brandName || storeInfo?.companyName || '',
          address: storeInfo?.headquartersAddress,
          phone: storeInfo?.hotline,
          email: storeInfo?.email,
          province: storeInfo?.province,
      };

      const creator = (() => {
          const bySystemId = findEmployeeById(item.creator);
          if (bySystemId) return bySystemId;
          return employees.find(e => e.id === (item.creator as unknown as string));
      })();

      let printData;

      if (isPayment) {
          const paymentData: PaymentForPrint = {
              code: item.id,
              createdAt: item.date,
              issuedAt: item.date,
              createdBy: creator?.fullName || item.creator,
              recipientName: supplier?.name || 'Nhà cung cấp',
              recipientPhone: supplier?.phone || '',
              recipientAddress: supplier?.address || '',
              recipientType: 'Nhà cung cấp',
              amount: amount,
              description: item.description,
              paymentMethod: item.method,
              documentRootCode: purchaseOrder.id,
              note: item.description,
              location: branch ? {
                  name: branch.name,
                  address: branch.address,
                  province: branch.province
              } : undefined
          };
          
          printData = mapPaymentToPrintData(paymentData, storeSettings);
      } else {
          // Refund (Receipt)
           const receiptData: ReceiptForPrint = {
              code: item.id,
              createdAt: item.date,
              issuedAt: item.date,
              createdBy: creator?.fullName || item.creator,
              payerName: supplier?.name || 'Nhà cung cấp',
              payerPhone: supplier?.phone || '',
              payerAddress: supplier?.address || '',
              payerType: 'Nhà cung cấp',
              amount: amount,
              description: item.description,
              paymentMethod: item.method,
              documentRootCode: purchaseOrder.id,
              note: item.description,
              location: branch ? {
                  name: branch.name,
                  address: branch.address,
                  province: branch.province
              } : undefined
          };
          
          printData = mapReceiptToPrintData(receiptData, storeSettings);
      }

      printData['amount_text'] = numberToWords(amount);
      printData['print_date'] = formatDateTime(new Date());
      printData['print_time'] = formatTime(new Date());
      
      print(isPayment ? 'payment' : 'receipt', { data: printData });
  }, [purchaseOrder, supplier, findBranchById, storeInfo, print, findEmployeeById, employees]);

  
    const { totalPaidOnThisOrder, financialHistory } = React.useMemo(() => {
    if (!purchaseOrder) return { totalPaidOnThisOrder: 0, financialHistory: [] };

    const paymentsForOrder = getPaymentsForPurchaseOrder(allPayments, purchaseOrder);
    const paymentTransactions = paymentsForOrder.map(p => ({
      type: 'payment' as const,
      systemId: p.systemId,
      id: p.id,
      date: p.date,
      amount: p.amount,
      method: p.paymentMethodName || (p as unknown as { paymentMethod?: string }).paymentMethod || 'Không xác định',
      creator: p.createdBy,
      description: p.description,
      category: p.category, // supplier_payment or expense
    }));

    const receiptsForOrder = getReceiptsForPurchaseOrder(allReceiptsFinancial, purchaseOrder);
    const refundTransactions = receiptsForOrder.map(r => ({
      type: 'refund' as const,
      systemId: r.systemId,
      id: r.id,
      date: r.date,
      amount: r.amount,
      method: r.paymentMethodName || (r as unknown as { paymentMethod?: string }).paymentMethod || 'Không xác định',
      creator: r.createdBy,
      description: r.description,
    }));

    const combinedHistory = [...paymentTransactions, ...refundTransactions].sort((a, b) => getDaysDiff(parseDate(b.date), parseDate(a.date)));
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, purchaseOrder);
    
    return { totalPaidOnThisOrder: totalPaid, financialHistory: combinedHistory };
    }, [purchaseOrder, allPayments, allReceiptsFinancial]);
  
  const totalReturnedValue = React.useMemo(() => {
    const returns = Array.isArray(purchaseReturns) ? purchaseReturns : [];
    return returns.reduce((sum, pr) => sum + Number(pr.totalReturnValue || 0), 0);
  }, [purchaseReturns]);

  const actualDebt = (purchaseOrder?.grandTotal || 0) - totalReturnedValue;
  const amountRemainingOnThisOrder = actualDebt - totalPaidOnThisOrder;

  const localPaymentStatus: PaymentStatus = React.useMemo(() => {
    if (!purchaseOrder) return 'Chưa thanh toán';
    if (totalPaidOnThisOrder >= actualDebt) {
        return 'Đã thanh toán';
    } else if (totalPaidOnThisOrder > 0) {
        return 'Thanh toán một phần';
    } else {
        return 'Chưa thanh toán';
    }
  }, [purchaseOrder, totalPaidOnThisOrder, actualDebt]);

  const canPay = amountRemainingOnThisOrder > 0 && purchaseOrder?.status !== 'Đã hủy' && purchaseOrder?.status !== 'Kết thúc';

  // Early return if loading - after all hooks have been called
  if (isLoadingPO) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Early return if purchase order not found
  if (!purchaseOrder) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-h2 mb-4">Không tìm thấy đơn hàng</h2>
          <p className="text-sm text-muted-foreground mb-6">Đơn hàng với mã {systemId} không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => router.push('/purchase-orders')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }
  
  const handleSupplierClick = () => {
    if (supplier) {
      router.push(`${ROUTES.PROCUREMENT.SUPPLIERS}/${supplier.systemId}`);
    }
  };
  
   const handleReceiveAllItems = () => {
    if (!purchaseOrder) {
      toast.error('Không tìm thấy đơn nhập hàng để nhận.');
      return;
    }

    if (purchaseOrder.deliveryStatus === 'Đã nhập') {
      toast.info('Đơn hàng đã được nhập kho đầy đủ.');
      return;
    }

    if (!purchaseOrder.branchSystemId || !purchaseOrder.branchName) {
      toast.error('Đơn hàng này chưa được gán cho chi nhánh. Vui lòng cập nhật thông tin chi nhánh trước khi nhập.');
      return;
    }

    // Mở dialog xác nhận
    setIsReceiveConfirmationOpen(true);
  };

  const handleConfirmReceive = () => {
    if (!purchaseOrder) return;

    const getAlreadyReceivedQty = (productSystemId: string) => {
      const receiptsForPO = allReceipts.filter(r => r.purchaseOrderSystemId === purchaseOrder.systemId);
      return receiptsForPO.reduce((total, receipt) => {
        const item = receipt.items.find(i => i.productSystemId === productSystemId);
        return total + (item ? Number(item.receivedQuantity) : 0);
      }, 0);
    };

    const itemsToReceive = (purchaseOrder.lineItems || []).map(item => {
      const alreadyReceived = getAlreadyReceivedQty(item.productSystemId);
      const remaining = item.quantity - alreadyReceived;
      return {
        productSystemId: asSystemId(item.productSystemId),
        productId: asBusinessId(item.productId),
        productName: item.productName,
        orderedQuantity: item.quantity,
        receivedQuantity: remaining > 0 ? remaining : 0,
        unitPrice: item.unitPrice,
      };
    }).filter(item => item.receivedQuantity > 0);

    if (itemsToReceive.length === 0) {
      toast.info('Không có sản phẩm nào cần nhập thêm.');
      setIsReceiveConfirmationOpen(false);
      return;
    }
    
    const receiptData = {
      type: 'PURCHASE' as const,
      branchId: purchaseOrder.branchSystemId,
      purchaseOrderSystemId: asSystemId(purchaseOrder.systemId),
      purchaseOrderId: asBusinessId(purchaseOrder.id || purchaseOrder.systemId),
      supplierSystemId: asSystemId(purchaseOrder.supplierSystemId),
      supplierName: purchaseOrder.supplierName,
      receiptDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
      branchSystemId: asSystemId(purchaseOrder.branchSystemId),
      branchName: purchaseOrder.branchName,
      notes: 'Nhập kho tự động toàn bộ sản phẩm còn lại.',
      items: itemsToReceive.map(item => ({
        productId: item.productSystemId,
        productSku: item.productId,
        productName: item.productName,
        quantity: item.receivedQuantity,
        unitCost: item.unitPrice,
      })),
    };

    // Luôn set là 'Đã nhập' vì chỉ nhập 1 lần
    const newDeliveryStatus = 'Đã nhập';

    createInventoryReceipt.mutate(receiptData, {
      onSuccess: () => {
        // Update PO delivery status after successful receipt creation
        // Also auto-complete if fully paid
        const totalPaid = sumPaymentsForPurchaseOrder(allPayments, purchaseOrder);
        const isFullyPaid = totalPaid >= purchaseOrder.grandTotal;
        
        const updateData: Partial<PurchaseOrder> = { 
          deliveryStatus: newDeliveryStatus,
          receivedDate: new Date().toISOString(),
        };
        
        // Auto-complete if fully received AND fully paid
        if (newDeliveryStatus === 'Đã nhập' && isFullyPaid && purchaseOrder.status !== 'Hoàn thành') {
          updateData.status = 'Hoàn thành';
          updateData.paymentStatus = 'Đã thanh toán';
        }
        
        updatePO.mutate(
          { systemId: purchaseOrder.systemId, data: updateData },
          {
            onSuccess: () => {
              setIsReceiveConfirmationOpen(false);
              if (updateData.status === 'Hoàn thành') {
                toast.success(`Đã nhập kho và hoàn thành đơn hàng ${purchaseOrder.id}.`);
              } else {
                toast.success(`Đã nhập kho thành công ${itemsToReceive.length} sản phẩm còn lại.`);
              }
            }
          }
        );
      },
      onError: (err) => {
        toast.error('Lỗi', { description: err.message || 'Không thể tạo phiếu nhập kho' });
      }
    });
  };

  const handlePaymentConfirmationSubmit = (values: PaymentConfirmationFormValues) => {
    
    if (!purchaseOrder) {
      toast.error('Không tìm thấy đơn nhập hàng');
      return;
    }
    
    if (!supplier) {
      toast.error('Không tìm thấy nhà cung cấp');
      return;
    }

    toast.loading('Đang tạo phiếu chi...');
    
    // Create payment via API mutation - API validation is flexible, cast to bypass strict TS checks
    createPayment.mutate({
      amount: values.amount,
      description: `Thanh toán cho đơn nhập hàng ${purchaseOrder.id}${values.reference ? ` - ${values.reference}` : ''}`,
      recipientName: supplier.name,
      recipientSystemId: supplier.systemId,
      supplierId: supplier.systemId,
      // ✅ Use correct field name for server action
      purchaseOrderSystemId: purchaseOrder.systemId,
      branchSystemId: purchaseOrder.branchSystemId,
      branchId: purchaseOrder.branchSystemId,
      branchName: purchaseOrder.branchName,
      createdBy: currentUserSystemId,
      paymentMethodName: values.paymentMethod,
      paymentMethod: values.paymentMethod === 'Chuyển khoản' ? 'BANK_TRANSFER' : 'CASH',
      accountSystemId: values.accountSystemId,
      paymentReceiptTypeName: 'Thanh toán cho đơn nhập hàng',
      recipientTypeName: 'Nhà cung cấp',
      affectsDebt: true,
      date: values.paymentDate,
      status: 'completed',
      category: 'supplier_payment',
    } as unknown as Parameters<typeof createPayment.mutate>[0]);
  };
  
  const canReceiveItems = purchaseOrder.deliveryStatus !== 'Đã nhập' && purchaseOrder.status !== 'Đã hủy' && purchaseOrder.status !== 'Kết thúc' && hasRemainingItemsToReceive;
  
  let paymentSection;
  
  const paymentDetails = (
      <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 sm:p-4 rounded-md text-sm">
          {purchaseOrder.grandTotal === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">Đơn hàng chưa có sản phẩm hoặc tổng tiền bằng 0</p>
              </div>
              <p className="mt-2 text-sm text-amber-700 dark:text-amber-400">
                Vui lòng kiểm tra lại danh sách sản phẩm trong đơn hàng.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng tiền ĐH:</span>
                  <span className="font-medium">{formatCurrency(purchaseOrder.grandTotal)}</span>
              </div>
              
              {totalReturnedValue > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá trị hàng đã trả:</span>
                  <span className="font-medium text-amber-600">-{formatCurrency(totalReturnedValue)}</span>
                </div>
              )}
              
              {totalReturnedValue > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Công nợ thực tế:</span>
                  <span className="font-semibold">{formatCurrency(actualDebt)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                  <span className="text-muted-foreground">Đã trả:</span>
                  <span className="font-medium">{totalPaidOnThisOrder > 0 ? formatCurrency(totalPaidOnThisOrder) : '0'}</span>
              </div>
              
              <div className="border-t my-1" />
              
              <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold">Còn phải trả:</span>
                  <span className={cn(
                      "font-bold text-lg",
                      amountRemainingOnThisOrder > 0 ? 'text-red-500' : amountRemainingOnThisOrder < 0 ? 'text-green-600' : 'text-foreground'
                  )}>{amountRemainingOnThisOrder >= 0 ? formatCurrency(amountRemainingOnThisOrder) : formatCurrency(0)}</span>
              </div>
              {amountRemainingOnThisOrder < 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">NCC cần hoàn lại:</span>
                  <span className="font-bold">{formatCurrency(Math.abs(amountRemainingOnThisOrder))}</span>
                </div>
              )}
            </>
          )}
      </div>
  );

  switch(localPaymentStatus) {
      case 'Chưa thanh toán':
      case 'Thanh toán một phần':
          paymentSection = (
              <Card className={mobileBleedCardClass}>
                  <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2">
                              <FileWarning className="h-5 w-5 text-amber-500 shrink-0" />
                              <CardTitle>
                                {localPaymentStatus === 'Chưa thanh toán' 
                                  ? 'Đơn hàng chờ thanh toán' 
                                  : `Đơn hàng thanh toán ${localPaymentStatus.toLowerCase()}`}
                              </CardTitle>
                          </div>
                          {canPay && amountRemainingOnThisOrder > 0 && (
                            <Button size="sm" onClick={() => setIsPaymentConfirmationOpen(true)}>
                              Thanh toán
                            </Button>
                          )}
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {paymentDetails}
                      {financialHistory.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {[...financialHistory].reverse().map((item, index) => (
                            <PurchaseOrderPaymentItem 
                                key={`${item.systemId}-${index}`} 
                                item={item} 
                                onPrint={handlePrintPayment} 
                            />
                          ))}
                        </div>
                      )}
                  </CardContent>
              </Card>
          );
          break;
      case 'Đã thanh toán':
          paymentSection = (
              <Card className={mobileBleedCardClass}>
                  <CardHeader>
                      <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                          <CardTitle>
                            Đơn hàng thanh toán thanh toán toàn bộ
                          </CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {paymentDetails}
                      {financialHistory.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {[...financialHistory].reverse().map((item, index) => (
                            <PurchaseOrderPaymentItem 
                                key={`${item.systemId}-${index}`} 
                                item={item} 
                                onPrint={handlePrintPayment} 
                            />
                          ))}
                        </div>
                      )}
                  </CardContent>
              </Card>
          );
          break;
  }
  
  let receivingSection;

  // Nếu đã nhập đủ (không còn sản phẩm cần nhập) thì coi như đã nhập kho
  const isEffectivelyReceived = purchaseOrder.deliveryStatus === 'Đã nhập' || !hasRemainingItemsToReceive;

  if (isEffectivelyReceived) {
      receivingSection = (
          <Card className={mobileBleedCardClass}>
              <CardHeader>
                  <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <CardTitle size="lg">Nhập hàng: Đã nhập kho</CardTitle>
                  </div>
              </CardHeader>
          </Card>
      );
  } else { // 'Chưa nhập'
      receivingSection = (
          <Card className={mobileBleedCardClass}>
              <CardHeader>
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-amber-500" />
                          <CardTitle size="lg">Nhập hàng: Chưa nhập kho</CardTitle>
                      </div>
                      {canReceiveItems && (
                        <Button size="sm" onClick={handleReceiveAllItems}>
                          <Truck className="mr-2 h-4 w-4" />
                          Nhập hàng
                        </Button>
                      )}
                  </div>
              </CardHeader>
          </Card>
      );
  }
  
  const _statusVariants = {
    "Đặt hàng": "secondary", "Đang giao dịch": "warning", "Hoàn thành": "success", "Đã hủy": "destructive", "Kết thúc": "default", "Đã trả hàng": "destructive"
  }
  const _paymentStatusVariants = {
    "Chưa thanh toán": "warning", "Thanh toán một phần": "warning", "Đã thanh toán": "success"
  }

  return (
      <DetailPageShell gap="lg">
          <StatusTimeline
            status={purchaseOrder.status}
            deliveryStatus={purchaseOrder.deliveryStatus}
            orderDate={purchaseOrder.orderDate}
            receivedDate={purchaseOrder.receivedDate ?? poReceipts[0]?.receivedDate ?? poReceipts[0]?.createdAt ?? null}
            completedDate={purchaseOrder.status === 'Hoàn thành' || purchaseOrder.status === 'Kết thúc' ? purchaseOrder.updatedAt : null}
          />

          {/* Thông tin NCC và Đơn hàng */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                  <Card className={mobileBleedCardClass}>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <CardTitle size="lg">Thông tin nhà cung cấp</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="overflow-y-auto" style={{maxHeight: 'calc(400px - 80px)'}}>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-h3 text-primary cursor-pointer hover:underline" role="button" tabIndex={0} onClick={handleSupplierClick} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSupplierClick(); }}>
                                {purchaseOrder.supplierName}
                              </p>
                              {supplierStats?.supplier?.phone && (
                                <p className="text-sm text-muted-foreground">{supplierStats.supplier.phone}</p>
                              )}
                              <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                                <p>Địa chỉ: {supplierStats?.supplier?.address || supplier?.address || '-'}</p>
                              </div>
                            </div>
                          </div>
                          {supplierStats && (
                            <SupplierStatsSection stats={supplierStats} />
                          )}
                        </div>
                      </CardContent>
                  </Card>
              </div>

              <div className="lg:col-span-1">
                  <Card className={cn("flex flex-col", mobileBleedCardClass)}>
                      <CardHeader>
                        <CardTitle size="lg">Thông tin đơn nhập hàng</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto text-sm space-y-3">
                          <DetailField label="Chi nhánh" value={resolvedBranchName} />
                          <DetailField label="Chính sách giá" value="Giá nhập" />
                          <DetailField label="Nhân viên phụ trách" value={resolvedBuyerName} />
                          <DetailField label="Ngày đặt" value={formatDateCustom(parseDate(purchaseOrder.orderDate) || getCurrentDate(), 'dd/MM/yyyy')} />
                          <DetailField label="Ngày giao" value={formatDateCustom(parseDate(purchaseOrder.deliveryDate ?? '') || getCurrentDate(), 'dd/MM/yyyy')} />
                          <DetailField label="Tham chiếu" value={purchaseOrder.reference || '-'} />
                          <Button variant="link" className="p-0 h-auto text-sm" onClick={handleSupplierClick}>Xem lịch sử đơn nhập hàng</Button>
                      </CardContent>
                  </Card>
              </div>
          </div>

          {/* Trạng thái hàng và thanh toán - Full width mỗi hàng */}
          <div className="space-y-4">
              {receivingSection}
              {paymentSection}
          </div>

          <Card className={mobileBleedCardClass}>
              <CardHeader>
                  <CardTitle size="lg">Thông tin sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="hidden md:block border rounded-md overflow-x-auto">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="w-12.5 text-center">STT</TableHead>
                                  <TableHead className="w-15">Ảnh</TableHead>
                                  <TableHead className="min-w-50">Tên sản phẩm</TableHead>
                                  <TableHead className="w-25">Loại SP</TableHead>
                                  <TableHead className="w-20">Đơn vị</TableHead>
                                  <TableHead className="w-20 text-center">SL nhập</TableHead>
                                  <TableHead className="w-32.5 text-right">Đơn giá nhập</TableHead>
                                  <TableHead className="w-32.5 text-right">Giá vốn</TableHead>
                                  <TableHead className="w-20 text-right">Thuế</TableHead>
                                  <TableHead className="w-25 text-right">Chiết khấu</TableHead>
                                  <TableHead className="w-32.5 text-right">Thành tiền</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {(purchaseOrder.lineItems || []).map((item, index) => {
                                  const lineGross = item.quantity * item.unitPrice;
                                  const discountAmount = item.discountType === 'percentage'
                                    ? lineGross * (item.discount / 100)
                                    : item.discount;
                                  const lineTotal = lineGross - discountAmount;
                                  const product = findProductById(item.productSystemId);
                                  const productTypeName = product?.productTypeSystemId 
                                    ? getProductTypeName(product.productTypeSystemId)
                                    : 'Hàng hóa';
                                  
                                  // Tính giá vốn cho lô này = Giá nhập + Phí phân bổ
                                  const totalQty = (purchaseOrder.lineItems || []).reduce((sum, i) => sum + i.quantity, 0);
                                  const totalFees = Number(purchaseOrder.shippingFee || 0) + Number(purchaseOrder.tax || 0);
                                  const feePerUnit = totalQty > 0 ? totalFees / totalQty : 0;
                                  const itemCostPrice = Math.round(item.unitPrice + feePerUnit);
                                  
                                  return (
                                  <TableRow key={item.productSystemId}>
                                      <TableCell className="text-center">{index + 1}</TableCell>
                                      <TableCell>
                                        <ProductThumbnailCell
                                          productSystemId={item.productSystemId}
                                          product={product}
                                          productName={item.productName}
                                          itemThumbnailImage={item.imageUrl}
                                          onPreview={(url, title) => setPreviewImage({ url, title })}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex flex-col gap-1">
                                          <Link href={`/products/${item.productSystemId}`} 
                                            className="text-sm font-medium text-primary hover:underline"
                                          >
                                            {item.productName}
                                          </Link>
                                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Link href={`/products/${item.productSystemId}`} 
                                              className="text-primary hover:underline"
                                            >
                                              {item.sku || item.productId}
                                            </Link>
                                          </div>
                                          {item.note && (
                                            <p className="text-xs text-muted-foreground italic">• {item.note}</p>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-sm text-muted-foreground">{productTypeName}</TableCell>
                                      <TableCell>{item.unit || '-'}</TableCell>
                                      <TableCell className="text-center">{item.quantity}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                      <TableCell className="text-right text-muted-foreground">{formatCurrency(itemCostPrice)}</TableCell>
                                      <TableCell className="text-right">{item.taxRate}%</TableCell>
                                      <TableCell className="text-right">
                                        {item.discountType === 'percentage' ? `${item.discount || 0}%` : formatCurrency(item.discount || 0)}
                                      </TableCell>
                                      <TableCell className="text-sm font-semibold text-right">{formatCurrency(lineTotal)}</TableCell>
                                  </TableRow>
                              )})}
                          </TableBody>
                          <TableFooter>
                              <TableRow>
                                  <TableCell colSpan={5} className="text-right font-bold">Tổng cộng</TableCell>
                                  <TableCell className="text-center font-bold">
                                    {(purchaseOrder.lineItems || []).reduce((sum, item) => sum + item.quantity, 0)}
                                  </TableCell>
                                  <TableCell colSpan={4} />
                                  <TableCell className="text-sm font-bold text-right">
                                    {formatCurrency(
                                      (purchaseOrder.lineItems || []).reduce((sum, item) => {
                                        const lineGross = item.quantity * item.unitPrice;
                                        const discountAmount = item.discountType === 'percentage'
                                          ? lineGross * (item.discount / 100)
                                          : item.discount;
                                        return sum + (lineGross - discountAmount);
                                      }, 0)
                                    )}
                                  </TableCell>
                              </TableRow>
                              
                              <TableRow>
                                  <TableCell colSpan={10} className="text-right text-muted-foreground">Tổng tiền hàng</TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(
                                      (purchaseOrder.lineItems || []).reduce((sum, item) => {
                                        const lineGross = item.quantity * item.unitPrice;
                                        const discountAmount = item.discountType === 'percentage'
                                          ? lineGross * (item.discount / 100)
                                          : item.discount;
                                        return sum + (lineGross - discountAmount);
                                      }, 0)
                                    )}
                                  </TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={10} className="text-right text-muted-foreground">
                                    Chiết khấu {purchaseOrder.discountType === 'percentage' && (purchaseOrder.discount ?? 0) > 0 ? `(${purchaseOrder.discount}%)` : ''}
                                  </TableCell>
                                  <TableCell className="text-right text-red-600">
                                    {(() => {
                                      const discountValue = purchaseOrder.discountType === 'percentage'
                                        ? ((purchaseOrder.subtotal || 0) * (purchaseOrder.discount ?? 0) / 100)
                                        : (purchaseOrder.discount ?? 0);
                                      return discountValue > 0 ? `-${formatCurrency(discountValue)}` : formatCurrency(0);
                                    })()}
                                  </TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={10} className="text-right text-muted-foreground">Phí vận chuyển</TableCell>
                                  <TableCell className="text-right">{formatCurrency(purchaseOrder.shippingFee)}</TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={10} className="text-right text-muted-foreground">Chi phí khác</TableCell>
                                  <TableCell className="text-right">{formatCurrency(purchaseOrder.tax)}</TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={10} className="text-h3 font-bold text-right">Thành tiền</TableCell>
                                  <TableCell className="text-h3 font-bold text-right">
                                    {formatCurrency(purchaseOrder.grandTotal)}
                                  </TableCell>
                              </TableRow>
                          </TableFooter>
                      </Table>
                  </div>

                  {/* Mobile: card stack */}
                  <div className="md:hidden space-y-3">
                    {(purchaseOrder.lineItems || []).map((item, index) => {
                      const lineGross = item.quantity * item.unitPrice;
                      const discountAmount = item.discountType === 'percentage'
                        ? lineGross * (item.discount / 100)
                        : item.discount;
                      const lineTotal = lineGross - discountAmount;
                      const product = findProductById(item.productSystemId);
                      const productTypeName = product?.productTypeSystemId
                        ? getProductTypeName(product.productTypeSystemId)
                        : 'Hàng hóa';
                      const totalQty = (purchaseOrder.lineItems || []).reduce((sum, i) => sum + i.quantity, 0);
                      const totalFees = Number(purchaseOrder.shippingFee || 0) + Number(purchaseOrder.tax || 0);
                      const feePerUnit = totalQty > 0 ? totalFees / totalQty : 0;
                      const itemCostPrice = Math.round(item.unitPrice + feePerUnit);
                      const discountLabel = item.discountType === 'percentage'
                        ? `${item.discount || 0}%`
                        : formatCurrency(item.discount || 0);

                      return (
                        <MobileCard key={item.productSystemId} inert>
                          <MobileCardHeader className="items-start justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-start gap-3">
                              <ProductThumbnailCell
                                productSystemId={item.productSystemId}
                                product={product}
                                productName={item.productName}
                                itemThumbnailImage={item.imageUrl}
                                onPreview={(url, title) => setPreviewImage({ url, title })}
                              />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs text-muted-foreground">#{index + 1}</div>
                                <Link
                                  href={`/products/${item.productSystemId}`}
                                  className="mt-0.5 block text-sm font-semibold text-primary hover:underline line-clamp-2"
                                >
                                  {item.productName}
                                </Link>
                                <Link
                                  href={`/products/${item.productSystemId}`}
                                  className="mt-0.5 block text-xs text-muted-foreground hover:underline"
                                >
                                  {item.sku || item.productId}
                                </Link>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-xs uppercase tracking-wide text-muted-foreground">Thành tiền</div>
                              <div className="mt-0.5 text-sm font-semibold">{formatCurrency(lineTotal)}</div>
                            </div>
                          </MobileCardHeader>
                          <MobileCardBody>
                            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
                              <div>
                                <dt className="text-xs text-muted-foreground">SL nhập</dt>
                                <dd className="font-medium">{item.quantity} {item.unit || ''}</dd>
                              </div>
                              <div>
                                <dt className="text-xs text-muted-foreground">Đơn giá nhập</dt>
                                <dd className="font-medium">{formatCurrency(item.unitPrice)}</dd>
                              </div>
                              <div>
                                <dt className="text-xs text-muted-foreground">Giá vốn</dt>
                                <dd className="font-medium">{formatCurrency(itemCostPrice)}</dd>
                              </div>
                              <div>
                                <dt className="text-xs text-muted-foreground">Loại SP</dt>
                                <dd className="font-medium truncate">{productTypeName}</dd>
                              </div>
                              <div>
                                <dt className="text-xs text-muted-foreground">Thuế</dt>
                                <dd className="font-medium">{item.taxRate}%</dd>
                              </div>
                              <div>
                                <dt className="text-xs text-muted-foreground">Chiết khấu</dt>
                                <dd className="font-medium">{discountLabel}</dd>
                              </div>
                            </dl>
                            {item.note && (
                              <p className="mt-3 text-xs italic text-muted-foreground">• {item.note}</p>
                            )}
                          </MobileCardBody>
                        </MobileCard>
                      );
                    })}

                    {/* Mobile totals */}
                    <div className="rounded-xl border border-border/50 bg-card p-4 space-y-2 text-sm">
                      {(() => {
                        const subtotal = (purchaseOrder.lineItems || []).reduce((sum, item) => {
                          const lineGross = item.quantity * item.unitPrice;
                          const discountAmount = item.discountType === 'percentage'
                            ? lineGross * (item.discount / 100)
                            : item.discount;
                          return sum + (lineGross - discountAmount);
                        }, 0);
                        const totalQuantity = (purchaseOrder.lineItems || []).reduce((sum, item) => sum + item.quantity, 0);
                        const orderDiscount = purchaseOrder.discountType === 'percentage'
                          ? ((purchaseOrder.subtotal || 0) * (purchaseOrder.discount ?? 0) / 100)
                          : (purchaseOrder.discount ?? 0);
                        return (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Tổng SL</span>
                              <span className="font-medium">{totalQuantity}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Tổng tiền hàng</span>
                              <span className="font-medium">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Chiết khấu {purchaseOrder.discountType === 'percentage' && (purchaseOrder.discount ?? 0) > 0 ? `(${purchaseOrder.discount}%)` : ''}
                              </span>
                              <span className="text-red-600">
                                {orderDiscount > 0 ? `-${formatCurrency(orderDiscount)}` : formatCurrency(0)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Phí vận chuyển</span>
                              <span>{formatCurrency(purchaseOrder.shippingFee)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Chi phí khác</span>
                              <span>{formatCurrency(purchaseOrder.tax)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-border/50 pt-2">
                              <span className="text-h3 font-bold">Thành tiền</span>
                              <span className="text-h3 font-bold">{formatCurrency(purchaseOrder.grandTotal)}</span>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
              </CardContent>
          </Card>

          <Tabs defaultValue="stock_history">
              <MobileTabsList>
                  <MobileTabsTrigger value="stock_history">Lịch sử kho ({poReceipts.length + (Array.isArray(purchaseReturns) ? purchaseReturns.length : 0)})</MobileTabsTrigger>
              </MobileTabsList>
              <TabsContent value="stock_history" className="mt-4">
                 <StockHistoryTab 
                   poReceipts={poReceipts} 
                   purchaseReturns={(Array.isArray(purchaseReturns) ? purchaseReturns : []) as PurchaseReturn[]} 
                   allTransactions={allTransactions}
                   onPrintReceipt={handlePrintReceipt}
                   onPrintReturn={handlePrintPurchaseReturn}
                 />
              </TabsContent>
          </Tabs>

          {/* Comments */}
          <Comments
            entityType="purchase-order"
            entityId={purchaseOrder.systemId}
            comments={comments}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            currentUser={commentCurrentUser}
            title="Bình luận"
            placeholder="Thêm bình luận về đơn nhập hàng..."
          />

          {/* Activity History */}
          <EntityActivityTable entityType="purchase_order" entityId={systemId} />

           <PaymentConfirmationDialog
              isOpen={isPaymentConfirmationOpen}
              onOpenChange={setIsPaymentConfirmationOpen}
              amountRemaining={amountRemainingOnThisOrder}
              onSubmit={handlePaymentConfirmationSubmit}
          />
          
          <AlertDialog open={isReceiveConfirmationOpen} onOpenChange={setIsReceiveConfirmationOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận nhập hàng</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn nhập kho <strong>toàn bộ sản phẩm</strong> còn lại trong đơn hàng này không?
                  <br /><br />
                  Hệ thống sẽ tạo phiếu nhập kho (PNK) và cập nhật tồn kho tự động.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmReceive}>
                  Xác nhận nhập hàng
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
                <AlertDialogCancel onClick={() => setCancelDialogState({ isOpen: false, po: null })}>Thoát</AlertDialogCancel>
                <AlertDialogAction onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <ImagePreviewDialog
          images={previewImage ? [previewImage.url] : []}
          open={!!previewImage}
          onOpenChange={(open) => !open && setPreviewImage(null)}
          title={previewImage?.title}
        />
      </DetailPageShell>
  );
}
