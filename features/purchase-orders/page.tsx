import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router.ts';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, toISODate } from '../../lib/date-utils.ts';
import { usePurchaseOrderStore } from "./store.ts"
import { useBranchStore } from '../settings/branches/store.ts';
import { getColumns } from "./columns.tsx"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx"
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
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
import { useEmployeeStore } from '../employees/store.ts';
// REMOVED: Voucher type no longer exists
// import type { Voucher } from '../vouchers/types.ts';
import { usePurchaseReturnStore } from "../purchase-returns/store.ts";
import { useToast } from "../../hooks/use-toast.ts";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export function PurchaseOrdersPage() {
  const { data: purchaseOrders, cancelOrder, processInventoryReceipt, bulkCancel, printPurchaseOrders, syncAllPurchaseOrderStatuses } = usePurchaseOrderStore();
  const { data: branches } = useBranchStore();
  const { data: suppliers } = useSupplierStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isMobile } = useBreakpoint();
  
  // Sync payment statuses when component mounts hoặc khi vouchers thay đổi
  React.useEffect(() => {
    syncAllPurchaseOrderStatuses();
  }, [syncAllPurchaseOrderStatuses]);
  
  usePageHeader({
    actions: [
      <Button key="add" onClick={() => navigate(ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Tạo đơn nhập hàng
      </Button>
    ]
  });
  
  // Data stores for actions
  const { data: allPayments } = usePaymentStore();
  const { data: allReceipts, add: addInventoryReceipt } = useInventoryReceiptStore();
  const { updateInventory, findById: findProductById } = useProductStore();
  const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
  const { accounts } = useCashbookStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  const loggedInUser = useEmployeeStore().data[0];
  const { add: addPurchaseReturn, data: allPurchaseReturns } = usePurchaseReturnStore();


  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [cancelDialogState, setCancelDialogState] = React.useState<{
    isOpen: boolean;
    po: PurchaseOrder | null;
    willCreateReturn?: boolean;
    totalPaid?: number;
  }>({ isOpen: false, po: null });

  const [isBulkPayAlertOpen, setIsBulkPayAlertOpen] = React.useState(false);
  const [isBulkReceiveAlertOpen, setIsBulkReceiveAlertOpen] = React.useState(false);
  
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'orderDate', desc: true });
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
    // Calculate total paid using Payment transactions
    const poSupplier = suppliers.find(s => s.systemId === po.supplierSystemId);
    const totalPaid = allPayments.reduce((sum: number, payment: Payment) => {
        if (payment.status === 'completed' && 
            payment.recipientType === 'Nhà cung cấp' &&
            payment.recipientName === poSupplier?.name) {
            return sum + payment.amount;
        }
        return sum;
    }, 0);

    const hasBeenDelivered = po.deliveryStatus !== 'Chưa nhập';

    setCancelDialogState({ 
        isOpen: true, 
        po: po, 
        totalPaid: totalPaid,
        willCreateReturn: hasBeenDelivered 
    });
  }, [allPayments, suppliers]);

  const confirmCancel = () => {
    if (!cancelDialogState.po) return;
    const po = cancelDialogState.po;

    if (cancelDialogState.willCreateReturn) {
        const receiptsForPO = allReceipts.filter(r => r.purchaseOrderId === po.systemId); // ✅ Fixed: Use systemId
        const returnsForPO = allPurchaseReturns.filter(pr => pr.purchaseOrderId === po.systemId); // ✅ Fixed: Use systemId

        const returnItems = po.lineItems
            .map(item => {
                const totalReceived = receiptsForPO.reduce((sum, receipt) => {
                    const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
                    return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
                }, 0);
                const totalReturned = returnsForPO.reduce((sum, pr) => {
                    const returnItem = pr.items.find(i => i.productSystemId === item.productSystemId);
                    return sum + (returnItem ? returnItem.returnQuantity : 0);
                }, 0);
                const returnableQuantity = totalReceived - totalReturned;
                
                return {
                    productSystemId: item.productSystemId,
                    productId: item.productId,
                    productName: item.productName,
                    orderedQuantity: item.quantity,
                    returnQuantity: returnableQuantity,
                    unitPrice: item.unitPrice,
                };
            })
            .filter(item => item.returnQuantity > 0);

        if (returnItems.length > 0) {
            const totalReturnValue = returnItems.reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0);
            
            addPurchaseReturn({
                id: '',
                purchaseOrderId: po.systemId, // ✅ Fixed: Use systemId for foreign key
                supplierSystemId: po.supplierSystemId,
                supplierName: po.supplierName,
                branchSystemId: po.branchSystemId,
                branchName: po.branchName,
                returnDate: toISODate(getCurrentDate()),
                reason: `Tự động tạo khi hủy đơn nhập hàng ${po.id}`,
                items: returnItems,
                totalReturnValue: totalReturnValue,
                refundAmount: 0, // Refund is handled by PO cancel logic, this is just for inventory.
                refundMethod: '',
                creatorName: loggedInUser.fullName,
            });
        }
    }

    cancelOrder(po.systemId, loggedInUser.systemId, loggedInUser.fullName);
    setCancelDialogState({ isOpen: false, po: null });
  };

  const handlePrint = React.useCallback((po: PurchaseOrder) => {
    printPurchaseOrders([po.systemId]);
    toast({
      description: `Đang in đơn nhập hàng ${po.id}`,
    });
  }, [printPurchaseOrders, toast]);

  const handlePayment = React.useCallback((po: PurchaseOrder) => {
    // TODO: Implement payment dialog/modal
    navigate(`/purchase-orders/${po.systemId}`);
    toast({
      description: `Mở trang thanh toán cho đơn ${po.id}`,
    });
  }, [navigate, toast]);

  const handleReceiveGoods = React.useCallback((po: PurchaseOrder) => {
    // Process inventory receipt
    processInventoryReceipt(po.systemId);
    toast({
      title: 'Thành công',
      description: `Đã nhập hàng cho đơn ${po.id}`,
    });
  }, [processInventoryReceipt, toast]);

  // Bulk actions
  const handleBulkPrint = () => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast({
        title: 'Chưa chọn đơn hàng',
        description: 'Vui lòng chọn ít nhất một đơn hàng',
        variant: 'destructive',
      });
      return;
    }
    printPurchaseOrders(selectedIds);
    toast({
      description: `Đang in ${selectedIds.length} đơn nhập hàng`,
    });
    setRowSelection({});
  };

  const handleBulkCancel = () => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    if (selectedIds.length === 0) {
      toast({
        title: 'Chưa chọn đơn hàng',
        description: 'Vui lòng chọn ít nhất một đơn hàng',
        variant: 'destructive',
      });
      return;
    }
    bulkCancel(selectedIds, loggedInUser.systemId, loggedInUser.fullName);
    toast({
      title: 'Đã hủy',
      description: `Đã hủy ${selectedIds.length} đơn nhập hàng`,
    });
    setRowSelection({});
  };

  const allSelectedRows = React.useMemo(() => 
    purchaseOrders.filter(po => rowSelection[po.systemId]),
  [purchaseOrders, rowSelection]);

  const numSelected = Object.keys(rowSelection).length;

  const confirmBulkPay = () => {
    const paymentCategory = paymentTypes.find(pt => pt.name === 'Thanh toán cho đơn nhập hàng');
    const { add: addPayment } = usePaymentStore.getState();
    
    allSelectedRows.forEach(po => {
        const poSupplier = suppliers.find(s => s.systemId === po.supplierSystemId);
        const totalPaid = allPayments.reduce((sum: number, payment: Payment) => {
            if (payment.status === 'completed' && 
                payment.recipientType === 'Nhà cung cấp' &&
                payment.recipientName === poSupplier?.name) {
                return sum + payment.amount;
            }
            return sum;
        }, 0);

        const amountRemaining = po.grandTotal - totalPaid;

        if (amountRemaining > 0) {
            const account = accounts.find(acc => acc.type === 'bank' && acc.branchSystemId === po.branchSystemId) || accounts.find(acc => acc.type === 'bank');
            if (!account) {
                console.error(`Không tìm thấy tài khoản ngân hàng cho chi nhánh ${po.branchName}`);
                return;
            }

            const newPayment: Omit<Payment, 'systemId'> = {
                id: '' as any,
                status: 'completed',
                date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                amount: amountRemaining,
                recipientType: 'Nhà cung cấp',
                recipientName: po.supplierName,
                description: `Thanh toán toàn bộ cho đơn nhập hàng ${po.id}`,
                paymentMethod: 'Chuyển khoản',
                accountSystemId: account.systemId,
                originalDocumentId: po.systemId,
                createdBy: loggedInUser.fullName,
                branchSystemId: po.branchSystemId,
                branchName: po.branchName,
                createdAt: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
                affectsDebt: true,
                category: 'supplier_payment',
                paymentReceiptTypeSystemId: paymentCategory?.systemId || '',
                paymentReceiptTypeName: paymentCategory?.name || 'Thanh toán cho đơn nhập hàng',
            };
            addPayment(newPayment);
        }
    });

    setRowSelection({});
    setIsBulkPayAlertOpen(false);
  };

  const confirmBulkReceive = () => {
    allSelectedRows.forEach(po => {
        if (po.deliveryStatus === 'Đã nhập') return;

        const getAlreadyReceivedQty = (productSystemId: string) => {
          return allReceipts
            .filter(r => r.purchaseOrderId === po.systemId) // ✅ Fixed: Use systemId
            .reduce((total, receipt) => {
              const item = receipt.items.find(i => i.productSystemId === productSystemId);
              return total + (item ? Number(item.receivedQuantity) : 0);
            }, 0);
        };
    
        const itemsToReceive = po.lineItems.map(item => {
          const alreadyReceived = getAlreadyReceivedQty(item.productSystemId);
          const remaining = item.quantity - alreadyReceived;
          return {
            productSystemId: item.productSystemId,
            productId: item.productId,
            productName: item.productName,
            orderedQuantity: item.quantity,
            receivedQuantity: remaining > 0 ? remaining : 0,
            unitPrice: item.unitPrice,
          };
        }).filter(item => item.receivedQuantity > 0);
    
        if (itemsToReceive.length === 0) return;
        
        const receiptData = {
          id: '',
          purchaseOrderId: po.systemId, // ✅ Fixed: Use systemId for foreign key
          supplierSystemId: po.supplierSystemId,
          supplierName: po.supplierName,
          receivedDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
          receiverSystemId: loggedInUser.systemId,
          receiverName: loggedInUser.fullName,
          notes: `Nhập hàng toàn bộ tự động cho đơn hàng ${po.id}`,
          items: itemsToReceive,
        };
        
        const newReceiptId = `PN-${Date.now()}`; // Generate receipt ID
        addInventoryReceipt(receiptData);
    
        receiptData.items.forEach(item => {
          const productBeforeUpdate = findProductById(item.productSystemId as any);
          const oldStock = productBeforeUpdate?.inventoryByBranch[po.branchSystemId] || 0;
          
          updateInventory(item.productSystemId as any, po.branchSystemId as any, item.receivedQuantity);
          
          addStockHistoryEntry({
            productId: item.productId,
            date: new Date().toISOString(),
            employeeName: loggedInUser.fullName,
            action: 'Nhập hàng từ NCC',
            quantityChange: item.receivedQuantity,
            newStockLevel: oldStock + item.receivedQuantity,
            documentId: newReceiptId,
            branch: po.branchName,
            branchSystemId: po.branchSystemId,
          });
        });
        
        processInventoryReceipt(po.systemId); // ✅ Fixed: Use systemId
    });

    setRowSelection({});
    setIsBulkReceiveAlertOpen(false);
  };

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
      onSelect: () => setIsBulkReceiveAlertOpen(true)
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
            <p className="text-sm text-muted-foreground">Tổng đặt hàng</p>
            <p className="text-2xl font-semibold">{poStats.totalOrdered} SP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Đã nhận</p>
            <p className="text-2xl font-semibold text-green-600">
              {poStats.totalReceived} SP
              <span className="text-sm text-muted-foreground ml-2">({poStats.receivedRate}%)</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Đã trả lại</p>
            <p className="text-2xl font-semibold text-orange-600">
              {poStats.totalReturned} SP
              <span className="text-sm text-muted-foreground ml-2">({poStats.returnedRate}%)</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tồn kho thực</p>
            <p className={`text-2xl font-semibold ${poStats.netInStock >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {poStats.netInStock > 0 ? '+' : ''}{poStats.netInStock} SP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Input 
          placeholder="Tìm kiếm đơn nhập hàng..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-8 w-full sm:w-[250px]"
        />
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="h-8 w-full sm:w-[180px]">
            <SelectValue placeholder="Chi nhánh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 w-full sm:w-[180px]">
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
          <SelectTrigger className="h-8 w-full sm:w-[180px]">
            <SelectValue placeholder="Thanh toán" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
            <SelectItem value="Thanh toán một phần">Thanh toán một phần</SelectItem>
            <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto">
          <DataTableColumnCustomizer
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
          />
        </div>
      </div>
      
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
              <span className="text-sm">Đang tải thêm...</span>
            </div>
          ) : sortedData.length > 20 ? (
            <p className="text-sm text-muted-foreground">
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
            <AlertDialogCancel onClick={() => setCancelDialogState({ isOpen: false, po: null })}>Thoát</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction>
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
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkPay}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkReceiveAlertOpen} onOpenChange={setIsBulkReceiveAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nhập hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn nhập hàng toàn bộ cho {numSelected} đơn hàng đã chọn không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkReceive}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
