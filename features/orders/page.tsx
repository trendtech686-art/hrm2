'use client'

import * as React from "react"
import { useNavigate, useLocation } from '@/lib/next-compat';
import { useOrderStore } from "./store"
import { getColumns } from "./columns"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter"
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle"
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2"
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2"
import { orderImportExportConfig, flattenOrdersForExport } from "../../lib/import-export/configs/order.config"
import { sapoOrderImportConfig } from "../../lib/import-export/configs/order-sapo.config"
import type { TemplateType, PaperSize } from "../settings/printer/types"
import type { PrintOptions } from "../../lib/use-print"
import { 
  Card, 
  CardContent, 
} from "../../components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog"
import type { Order, OrderMainStatus, OrderPaymentStatus, OrderDeliveryStatus, OrderPrintStatus, OrderStockOutStatus, OrderReturnStatus } from "./types"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Checkbox } from "../../components/ui/checkbox"
import { Textarea } from "../../components/ui/textarea"
import { PlusCircle, FileText, FileUp, Download } from "lucide-react"
import { PrintOptionsDialog, type PrintOptionsResult, type OrderPrintTemplateType } from "../../components/shared/print-options-dialog"
import Fuse from "fuse.js"
import { usePageHeader } from "../../contexts/page-header-context"
import { useMediaQuery } from "../../lib/use-media-query"
import { OrderCard } from "./order-card"
import { PageFilters } from "../../components/layout/page-filters"
import { PageToolbar } from "../../components/layout/page-toolbar"
// ✅ REMOVED: import { generateNextId } - not used in this file
// ✅ REMOVED: Unused imports - ProductQuickViewCard and OrderFormDialog (components don't exist and are never used)
import { toast } from "sonner"
import { useAuth } from "../../contexts/auth-context"
import { asBusinessId, asSystemId, type SystemId } from "../../lib/id-types"
// Print imports
import { usePrint } from "../../lib/use-print"
import { useCustomerStore } from "../customers/store"
import { useBranchStore } from "../settings/branches/store"
import { useProductStore } from "../products/store"
import { useEmployeeStore } from "../employees/store"
import { 
  convertOrderForPrint,
  convertPackagingToDeliveryForPrint,
  convertToShippingLabelForPrint,
  convertToPackingForPrint,
  mapOrderToPrintData,
  mapOrderLineItems,
  mapDeliveryToPrintData,
  mapDeliveryLineItems,
  mapShippingLabelToPrintData,
  mapPackingToPrintData,
  mapPackingLineItems,
  createStoreSettings,
} from "../../lib/print/order-print-helper"


const statusOptions = (Object.keys({
    "Đặt hàng": "", "Đang giao dịch": "", "Hoàn thành": "", "Đã hủy": ""
}) as OrderMainStatus[]).map(status => ({
    value: status,
    label: status,
}));

export function OrdersPage() {
  const orderStore = useOrderStore();
  const orders: Order[] = orderStore.data ?? [];
  const navigate = useNavigate();
  const location = useLocation();
  const { employee: authEmployee } = useAuth();
  const currentEmployeeName = authEmployee?.fullName ?? 'Hệ thống';
  const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // Stores for print and import lookup
  const customerStore = useCustomerStore();
  const branchStore = useBranchStore();
  const productStore = useProductStore();
  const employeeStore = useEmployeeStore();
  const { findById: findCustomerById } = customerStore;
  const { findById: findBranchById } = branchStore;
  const { print, printMultiple, printMixedDocuments } = usePrint();
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false)
  const [idToCancel, setIdToCancel] = React.useState<SystemId | null>(null)
  const [cancelReason, setCancelReason] = React.useState('')
  const [restockItems, setRestockItems] = React.useState(true)

  // Print options dialog state
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false)
  const [pendingPrintOrders, setPendingPrintOrders] = React.useState<Order[]>([])
  const [initialPrintTemplateType, setInitialPrintTemplateType] = React.useState<OrderPrintTemplateType>('order')

  // Import/Export dialog states
  const [isImportOpen, setIsImportOpen] = React.useState(false)
  const [isExportOpen, setIsExportOpen] = React.useState(false)
  const [isSapoImportOpen, setIsSapoImportOpen] = React.useState(false)

  const resetCancelForm = React.useCallback(() => {
    setCancelReason('')
    setRestockItems(true)
  }, [])

  React.useEffect(() => {
    if (!isCancelAlertOpen) {
      resetCancelForm()
    }
  }, [isCancelAlertOpen, resetCancelForm])
  
  // Table state - Sort by systemId (newer orders have higher systemId)
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'orders-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {});
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
    localStorage.setItem('orders-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  
  // Mobile infinite scroll
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    if (status) {
      setStatusFilter(new Set([status]));
    }
  }, [location.search]);
  
  // Reset mobile count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [searchQuery, statusFilter]);

  const handleCancelRequest = React.useCallback((systemId: SystemId) => {
    setIdToCancel(systemId)
    setIsCancelAlertOpen(true)
  }, [])

  const orderPendingCancel = React.useMemo(() => {
    if (!idToCancel) return null
    return orders.find(order => order.systemId === idToCancel) ?? null
  }, [idToCancel, orders])

  const pendingCancelQuantity = React.useMemo(() => {
    if (!orderPendingCancel) return 0
    return orderPendingCancel.lineItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [orderPendingCancel])
  
  // === PRINT HANDLERS ===
  const handlePrintOrder = React.useCallback((order: Order) => {
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const orderData = convertOrderForPrint(order, { customer });
    
    print('order', {
      data: mapOrderToPrintData(orderData, storeSettings),
      lineItems: mapOrderLineItems(orderData.items),
    });
    toast.success(`Đang in đơn hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  const handlePrintPacking = React.useCallback((order: Order) => {
    const packaging = order.packagings?.[order.packagings.length - 1];
    if (!packaging) {
      toast.error('Đơn hàng chưa có phiếu đóng gói');
      return;
    }
    
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const packingData = convertToPackingForPrint(order, packaging, { customer });
    
    print('packing', {
      data: mapPackingToPrintData(packingData, storeSettings),
      lineItems: mapPackingLineItems(packingData.items),
    });
    toast.success(`Đang in phiếu đóng gói ${packaging.id}`);
  }, [findCustomerById, findBranchById, print]);

  const handlePrintShippingLabel = React.useCallback((order: Order) => {
    const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
    if (!packaging) {
      toast.error('Đơn hàng chưa có đóng gói xác nhận');
      return;
    }
    
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const labelData = convertToShippingLabelForPrint(order, packaging, { customer });
    
    print('shipping-label', {
      data: mapShippingLabelToPrintData(labelData, storeSettings),
    });
    toast.success(`Đang in nhãn giao hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  const handlePrintDelivery = React.useCallback((order: Order) => {
    const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
    if (!packaging) {
      toast.error('Đơn hàng chưa có đóng gói xác nhận');
      return;
    }
    
    const customer = findCustomerById(order.customerSystemId);
    const branch = findBranchById(order.branchSystemId);
    const storeSettings = createStoreSettings(branch);
    const deliveryData = convertPackagingToDeliveryForPrint(order, packaging, { customer });
    
    print('delivery', {
      data: mapDeliveryToPrintData(deliveryData, storeSettings),
      lineItems: mapDeliveryLineItems(deliveryData.items),
    });
    toast.success(`Đang in phiếu giao hàng ${order.id}`);
  }, [findCustomerById, findBranchById, print]);

  const printActions = React.useMemo(() => ({
    onPrintOrder: handlePrintOrder,
    onPrintPacking: handlePrintPacking,
    onPrintShippingLabel: handlePrintShippingLabel,
    onPrintDelivery: handlePrintDelivery,
  }), [handlePrintOrder, handlePrintPacking, handlePrintShippingLabel, handlePrintDelivery]);
  
  const columns = React.useMemo(() => getColumns(handleCancelRequest, navigate, printActions), [handleCancelRequest, navigate, printActions]);
  
  // Set default visible columns - 15+ để có sticky scrollbar
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'customerName', 'orderDate', 'branchName', 'salesperson', 
      'grandTotal', 'totalPaid', 'debt', 'codAmount', 'status', 
      'paymentStatus', 'packagingStatus', 'deliveryStatus', 'printStatus', 'stockOutStatus'
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

  const fuse = React.useMemo(() => new Fuse(orders, { 
    keys: ["id", "customerName", "salesperson"],
    threshold: 0.3 
  }), [orders]);
  
  const confirmCancel = () => {
    if (!idToCancel) return

    if (!orderPendingCancel) {
      toast.error('Không tìm thấy đơn hàng cần hủy. Vui lòng tải lại danh sách.')
      setIsCancelAlertOpen(false)
      return
    }

    const finalReason = cancelReason.trim()
    if (!finalReason) {
      toast.error('Vui lòng nhập lý do hủy đơn hàng.')
      return
    }

    orderStore.cancelOrder(idToCancel, currentEmployeeSystemId, {
      reason: finalReason,
      restock: restockItems,
    })
    const updatedOrder = orderStore.findById?.(idToCancel)
    if (updatedOrder?.status === 'Đã hủy') {
      toast.success(`Đơn ${updatedOrder.id} đã được cập nhật trạng thái hủy.`)
    } else {
      toast.info('Không thể hủy đơn hàng vì đã vượt điều kiện cho phép. Vui lòng kiểm tra cấu hình hoặc trạng thái giao hàng.')
    }
    setIsCancelAlertOpen(false)
    setIdToCancel(null)
    resetCancelForm()
  }
  
  const filteredData = React.useMemo(() => {
    let data = orders;
    
    // Search
    if (searchQuery) {
      data = fuse.search(searchQuery).map(result => result.item);
    }
    
    // Status filter
    if (statusFilter.size > 0) {
      data = data.filter(order => statusFilter.has(order.status));
    }
    
    return data;
  }, [orders, searchQuery, fuse, statusFilter]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        // Special handling for date columns - parse as Date for proper comparison
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
  
  // Mobile: Display data with infinite scroll
  const displayData = isMobile 
    ? sortedData.slice(0, mobileLoadedCount)
    : paginatedData;
  
  const allSelectedRows = React.useMemo(() => 
    sortedData.filter(o => rowSelection[o.systemId]),
  [sortedData, rowSelection]);
  
  // Mobile infinite scroll listener
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      if (scrollPercentage > 80 && mobileLoadedCount < sortedData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, sortedData.length]);

  const handleRowClick = (row: Order) => {
    navigate(`/orders/${row.systemId}`);
  };
  
  const handleBulkDelete = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    
    const confirmMessage = `Bạn có chắc muốn hủy ${allSelectedRows.length} đơn hàng đã chọn?`;
    if (!confirm(confirmMessage)) return;
    
    allSelectedRows.forEach(order => {
      (orderStore as any).cancelOrder(order.systemId, currentEmployeeSystemId, {
        reason: 'Hủy hàng loạt',
        restock: true,
      });
    });
    
    setRowSelection({});
  }, [allSelectedRows, orderStore, currentEmployeeSystemId]);
  
  // === BULK PRINT HANDLERS - Mở dialog với initial template type ===
  const handleBulkPrintWithOptions = React.useCallback((selectedRows: Order[], templateType: OrderPrintTemplateType = 'order') => {
    setPendingPrintOrders(selectedRows);
    setInitialPrintTemplateType(templateType);
    setIsPrintDialogOpen(true);
  }, []);

  // Xử lý khi xác nhận tùy chọn in từ dialog
  const handlePrintConfirm = React.useCallback((options: PrintOptionsResult) => {
    const { branchSystemId, paperSize, printOrder, printDelivery, printPacking, printShippingLabel } = options;
    const ordersToProcess = pendingPrintOrders;
    const printMessages: string[] = [];

    // Mảng chứa tất cả documents để in gộp 1 lần
    const allDocuments: Array<{ type: TemplateType; options: PrintOptions }> = [];

    // Helper để tạo print options cho order
    const createOrderPrintOptions = (order: Order) => {
      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const orderData = convertOrderForPrint(order, { customer });
      
      return {
        data: mapOrderToPrintData(orderData, storeSettings),
        lineItems: mapOrderLineItems(orderData.items),
        paperSize,
      };
    };

    // Helper để tạo print options cho delivery
    const createDeliveryPrintOptions = (order: Order) => {
      const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói') 
        ?? order.packagings?.[order.packagings.length - 1];
      if (!packaging) return null;

      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const deliveryData = convertPackagingToDeliveryForPrint(order, packaging, { customer });
      
      return {
        data: mapDeliveryToPrintData(deliveryData, storeSettings),
        lineItems: mapDeliveryLineItems(deliveryData.items),
        paperSize,
      };
    };

    // Helper để tạo print options cho packing
    const createPackingPrintOptions = (order: Order) => {
      const packaging = order.packagings?.[order.packagings.length - 1];
      if (!packaging) return null;

      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const packingData = convertToPackingForPrint(order, packaging, { customer });
      
      return {
        data: mapPackingToPrintData(packingData, storeSettings),
        lineItems: mapPackingLineItems(packingData.items),
        paperSize,
      };
    };

    // Helper để tạo print options cho shipping label
    const createShippingLabelPrintOptions = (order: Order) => {
      const packaging = order.packagings?.find(p => p.status === 'Đã đóng gói');
      if (!packaging) return null;

      const customer = findCustomerById(order.customerSystemId);
      const branch = branchSystemId 
        ? findBranchById(branchSystemId)
        : findBranchById(order.branchSystemId);
      const storeSettings = createStoreSettings(branch);
      const labelData = convertToShippingLabelForPrint(order, packaging, { customer });
      
      return {
        data: mapShippingLabelToPrintData(labelData, storeSettings),
        paperSize,
      };
    };

    // Thu thập tất cả documents cần in
    ordersToProcess.forEach(order => {
      // In đơn hàng
      if (printOrder) {
        const printOptions = createOrderPrintOptions(order);
        allDocuments.push({ type: 'order', options: printOptions });
      }

      // In phiếu đóng gói
      if (printPacking && order.packagings?.length > 0) {
        const printOptions = createPackingPrintOptions(order);
        if (printOptions) {
          allDocuments.push({ type: 'packing', options: printOptions });
        }
      }

      // In phiếu giao hàng
      if (printDelivery && order.packagings?.length > 0) {
        const printOptions = createDeliveryPrintOptions(order);
        if (printOptions) {
          allDocuments.push({ type: 'delivery', options: printOptions });
        }
      }

      // In nhãn giao hàng
      if (printShippingLabel && order.packagings?.some(p => p.status === 'Đã đóng gói')) {
        const printOptions = createShippingLabelPrintOptions(order);
        if (printOptions) {
          allDocuments.push({ type: 'shipping-label', options: printOptions });
        }
      }
    });

    // Tạo message thống kê
    if (printOrder) printMessages.push(`${ordersToProcess.length} đơn hàng`);
    const ordersWithPackaging = ordersToProcess.filter(o => o.packagings?.length > 0);
    if (printPacking && ordersWithPackaging.length > 0) printMessages.push(`${ordersWithPackaging.length} phiếu đóng gói`);
    if (printDelivery && ordersWithPackaging.length > 0) printMessages.push(`${ordersWithPackaging.length} phiếu giao hàng`);
    const ordersWithConfirmedPackaging = ordersToProcess.filter(o => o.packagings?.some(p => p.status === 'Đã đóng gói'));
    if (printShippingLabel && ordersWithConfirmedPackaging.length > 0) printMessages.push(`${ordersWithConfirmedPackaging.length} nhãn giao hàng`);

    // In gộp 1 lần duy nhất
    if (allDocuments.length > 0) {
      printMixedDocuments(allDocuments);
      toast.success(`Đang in ${printMessages.join(', ')}`);
    } else {
      toast.error('Không có dữ liệu phù hợp để in');
    }

    // Reset state
    setPendingPrintOrders([]);
  }, [pendingPrintOrders, findCustomerById, findBranchById, printMixedDocuments]);

  // Bulk Actions for DataTable - Gộp thành 1 nút In hàng loạt
  const bulkActions = React.useMemo(() => [
    {
      label: 'In hàng loạt',
      icon: FileText,
      onSelect: (rows: Order[]) => handleBulkPrintWithOptions(rows, 'order'),
    },
  ], [handleBulkPrintWithOptions]);
  
  // Prepare orderImportExportConfig with stores for lookup
  const orderConfigWithStores = React.useMemo(() => ({
    ...orderImportExportConfig,
    storeContext: {
      customerStore,
      productStore,
      branchStore,
      employeeStore,
    },
  }), [customerStore, productStore, branchStore, employeeStore]);

  // Prepare sapoOrderImportConfig with stores for lookup
  const sapoOrderConfigWithStores = React.useMemo(() => ({
    ...sapoOrderImportConfig,
    storeContext: {
      customerStore,
      productStore,
      branchStore,
      employeeStore,
    },
  }), [customerStore, productStore, branchStore, employeeStore]);

  // Flatten orders for export (multi-line per product) - cast to Order[] for component compatibility
  const ordersForExport = React.useMemo(() => flattenOrdersForExport(orders) as unknown as Order[], [orders]);
  const filteredOrdersForExport = React.useMemo(() => flattenOrdersForExport(sortedData) as unknown as Order[], [sortedData]);
  const pageOrdersForExport = React.useMemo(() => flattenOrdersForExport(paginatedData) as unknown as Order[], [paginatedData]);
  const selectedOrdersForExport = React.useMemo(() => flattenOrdersForExport(allSelectedRows) as unknown as Order[], [allSelectedRows]);

  // Import handler for GenericImportDialogV2
  const handleImport = React.useCallback(async (
    data: Partial<Order>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
    branchId?: string
  ) => {
    const results = {
      success: 0,
      failed: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [] as Array<{ row: number; message: string }>,
    };

    try {
      for (let i = 0; i < data.length; i++) {
        const order = data[i] as Order;
        
        // Tất cả đơn import đều là insert mới
        if (mode === 'update-only') {
          results.skipped++;
          continue;
        }

        try {
          // Add order to store
          orderStore.add(order);
          results.inserted++;
          results.success++;
        } catch (err) {
          results.failed++;
          results.errors.push({
            row: i + 1,
            message: err instanceof Error ? err.message : 'Lỗi không xác định',
          });
        }
      }

      if (results.inserted > 0) {
        toast.success(`Đã nhập ${results.inserted} đơn hàng thành công`);
      }
      if (results.skipped > 0) {
        toast.info(`Bỏ qua ${results.skipped} đơn (chế độ update-only)`);
      }
      if (results.failed > 0) {
        toast.error(`${results.failed} đơn nhập thất bại`);
      }

      return results;
    } catch (error) {
      console.error('[Orders Import] Error:', error);
      throw error;
    }
  }, [orderStore]);
  
  // Header actions - Chỉ còn nút Tạo đơn hàng
  const headerActions = React.useMemo(() => [
    <Button key="add" size="sm" className="h-9" onClick={() => navigate('/orders/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Tạo đơn hàng
    </Button>
  ], [navigate]);
  
  usePageHeader({
    title: 'Danh sách đơn hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Đơn hàng', href: '/orders', isCurrent: true },
    ],
    showBackButton: false,
    actions: headerActions,
  });

  return (
    <>
      {/* HÀNG 2: TOOLBAR - Export/Import/Column Customizer (Desktop only) */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                Nhập file
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsSapoImportOpen(true)}>
                <FileUp className="mr-2 h-4 w-4" />
                Import Sapo
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </>
          }
          rightActions={
            <DataTableColumnCustomizer
              columns={columns}
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

      {/* HÀNG 3: FILTERS - Search & Status Filter */}
      <PageFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm kiếm đơn hàng..."
      >
        <DataTableFacetedFilter
          title="Trạng thái"
          selectedValues={statusFilter}
          onSelectedValuesChange={setStatusFilter}
          options={[
            { label: 'Đặt hàng', value: 'Đặt hàng' },
            { label: 'Đang giao dịch', value: 'Đang giao dịch' },
            { label: 'Hoàn thành', value: 'Hoàn thành' },
            { label: 'Đã hủy', value: 'Đã hủy' },
          ]}
        />
      </PageFilters>

      {/* Data Table - Không có padding wrapper */}
      <div className="pb-4">
        <ResponsiveDataTable
        columns={columns}
        data={displayData}
        renderMobileCard={(order) => (
          <OrderCard 
            order={order} 
            onCancel={handleCancelRequest}
          />
        )}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={sortedData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        allSelectedRows={allSelectedRows}
        onBulkDelete={handleBulkDelete}
        bulkActions={bulkActions}
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        onRowClick={handleRowClick}
        emptyTitle="Không có đơn hàng"
        emptyDescription="Tạo đơn hàng đầu tiên để bắt đầu"
      />
      </div>
      
      {/* Mobile loading indicator */}
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
      
      {/* Cancel Alert Dialog */}
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn hủy đơn hàng?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 text-left">
              <div className="space-y-2 text-body-sm">
                <p>Thao tác sẽ cập nhật trạng thái đơn thành "Đã hủy" và áp dụng các bước sau:</p>
                <ul className="ml-4 list-disc space-y-1">
                  <li>Hoàn kho các sản phẩm (nếu bạn giữ tùy chọn này)</li>
                  <li>Hủy vận đơn và chứng từ liên quan</li>
                  <li>Tính lại công nợ khách hàng và đối tác vận chuyển</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orders-cancel-reason" className="text-body-sm font-semibold">
                  Lý do hủy (bắt buộc)
                </Label>
                <Textarea
                  id="orders-cancel-reason"
                  value={cancelReason}
                  onChange={(event) => setCancelReason(event.target.value)}
                  placeholder="Nhập rõ lý do hủy để đội vận hành nắm được..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-body-sm font-semibold">Tùy chọn bổ sung</Label>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 rounded-md border p-3">
                    <Checkbox
                      id="orders-cancel-restock"
                      checked={restockItems}
                      onCheckedChange={(checked) => setRestockItems(checked === true)}
                    />
                    <div className="space-y-1">
                      <Label htmlFor="orders-cancel-restock" className="text-body-sm font-medium">
                        Hoàn kho {pendingCancelQuantity} sản phẩm
                      </Label>
                      <p className="text-body-xs text-muted-foreground">
                        Nếu bỏ chọn, bạn sẽ tự xử lý tồn kho thủ công.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Thoát</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Options Dialog */}
      <PrintOptionsDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={pendingPrintOrders.length}
        initialTemplateType={initialPrintTemplateType}
      />

      {/* Import Dialog V2 */}
      <GenericImportDialogV2<Order>
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        config={orderConfigWithStores}
        existingData={orders}
        onImport={handleImport}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : undefined}
      />

      {/* Export Dialog V2 */}
      <GenericExportDialogV2<Order>
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        config={orderImportExportConfig}
        allData={ordersForExport}
        filteredData={filteredOrdersForExport}
        currentPageData={pageOrdersForExport}
        selectedData={selectedOrdersForExport}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : { systemId: asSystemId('SYSTEM'), name: 'System' }}
      />

      {/* Sapo Import Dialog V2 */}
      <GenericImportDialogV2<Order>
        open={isSapoImportOpen}
        onOpenChange={setIsSapoImportOpen}
        config={sapoOrderConfigWithStores}
        existingData={orders}
        onImport={handleImport}
        currentUser={authEmployee ? {
          systemId: authEmployee.systemId,
          name: authEmployee.fullName || authEmployee.id,
        } : undefined}
      />
    </>
  )
}
