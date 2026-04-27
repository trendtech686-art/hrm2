'use client'

import { useState, useEffect, useMemo, useCallback, useRef, useTransition } from "react"
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner"
import { PlusCircle, FileUp, Download, FileText, CheckCircle, DollarSign, Settings, ScanLine } from "lucide-react"
import { QrScannerDialog } from '@/components/shared/qr-scanner-dialog'

import { useOrders, useOrderStats, orderKeys } from "./hooks/use-orders"
import { fetchOrder } from "./api/orders-api"
import { useQueryClient, useInfiniteQuery } from "@tanstack/react-query"
import { cn } from "@/lib/utils"
import { useOrderImportHandler } from "./hooks/use-order-import-handler"
import { useOrderDetailActions } from "./hooks/use-order-detail-actions"
import { getColumns } from "./columns"
import { usePageHeader } from "@/contexts/page-header-context"
import { useMediaQuery } from "@/lib/use-media-query"
import { useAuth } from "@/contexts/auth-context"
import { asSystemId, type SystemId } from "@/lib/id-types"
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from "@/hooks/use-column-visibility"
import { fetchCustomers } from "../customers/api/customers-api"
import { useAllCustomers } from "../customers/hooks/use-all-customers"
import { useAllBranches } from "../settings/branches/hooks/use-all-branches"
import { fetchProducts } from "../products/api/products-api"
import { useAllProducts } from "../products/hooks/use-all-products"
import { useAllEmployees } from "../employees/hooks/use-all-employees"
import { useOrderPrintHandlers } from "./hooks/use-order-print-handlers"
import type { Order } from '@/lib/types/prisma-extended'
import type { OrderStatsResponse } from './api/orders-api'

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter"
import { PrintOptionsDialog, type PrintOptionsResult, type OrderPrintTemplateType } from "@/components/shared/print-options-dialog"
import { PageFilters } from "@/components/layout/page-filters"
import { PageToolbar } from "@/components/layout/page-toolbar"
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel'
import type { ComboboxOption } from '@/components/ui/virtualized-combobox'
import { useFilterPresets } from '@/hooks/use-filter-presets'
import { OrderCard } from "./components/order-card"
import { formatCurrency } from "@/lib/format-utils"
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS, DELIVERY_STATUS_LABELS, DELIVERY_METHOD_LABELS, STOCK_OUT_STATUS_LABELS, RETURN_STATUS_LABELS, PRINT_STATUS_LABELS } from '@/lib/constants/order-enums'
import { packagingStatusLabels } from '@/lib/constants/order-status-labels'
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { FAB } from '@/components/mobile/fab';
import { PullToRefresh } from '@/components/shared/pull-to-refresh';

const OrderImportDialog = dynamic(() => import("./components/order-import-export-dialogs").then(mod => ({ default: mod.OrderImportDialog })), { ssr: false });
const OrderExportDialog = dynamic(() => import("./components/order-import-export-dialogs").then(mod => ({ default: mod.OrderExportDialog })), { ssr: false });
const SapoOrderImportDialog = dynamic(() => import("./components/order-import-export-dialogs").then(mod => ({ default: mod.SapoOrderImportDialog })), { ssr: false });
const loadFlattenOrdersForExport = () => import("./components/order-import-export-dialogs").then(mod => mod.flattenOrdersForExport);

// Workflow card definitions for the 9 status cards
const WORKFLOW_CARDS = [
  { key: 'pendingApproval', label: 'Chờ duyệt', filter: { status: 'PENDING' } },
  { key: 'pendingPayment', label: 'Chờ thanh toán', filter: { paymentStatus: 'UNPAID', statusNotIn: 'CANCELLED,COMPLETED' } },
  { key: 'pendingPack', label: 'Chờ đóng gói', filter: { deliveryStatus: 'PENDING_PACK', statusNotIn: 'CANCELLED,COMPLETED,PENDING' } },
  { key: 'pendingPickup', label: 'Chờ lấy hàng', filter: { deliveryStatus: 'PENDING_SHIP', statusNotIn: 'CANCELLED,COMPLETED' } },
  { key: 'shipping', label: 'Đang giao hàng', filter: { deliveryStatus: 'SHIPPING', statusNotIn: 'CANCELLED,COMPLETED' } },
  { key: 'packed', label: 'Đã đóng gói', filter: { deliveryStatus: 'PACKED', statusNotIn: 'CANCELLED,COMPLETED' } },
  { key: 'rescheduled', label: 'Chờ giao lại', filter: { deliveryStatus: 'RESCHEDULED', statusNotIn: 'CANCELLED,COMPLETED' } },
  { key: 'pendingReturn', label: 'Chờ nhận hàng hoàn', filter: { returnStatus: 'PARTIAL_RETURN,FULL_RETURN', statusNotIn: 'CANCELLED,COMPLETED' } },
  { key: 'pendingCod', label: 'Chờ thu hộ COD', filter: { codPending: 'true' } },
] as const;

type WorkflowFilterKey = typeof WORKFLOW_CARDS[number]['key'];

// Props interface for server-side data
export interface OrdersPageProps {
  initialStats?: OrderStatsResponse;
}

export function OrdersPage({ initialStats }: OrdersPageProps = {}) {
  // Stats from server component
  const { data: stats } = useOrderStats(initialStats);
  const queryClient = useQueryClient();
  const [isFilterPending, startFilterTransition] = useTransition();
  
  // Search and filter state for server-side query
  const [searchQuery, setSearchQuery] = useState('');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [activeCard, setActiveCard] = useState<WorkflowFilterKey | null>(null);
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined]>();
  const [employeeFilter, setEmployeeFilter] = useState<string>('');
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, unknown>>({});
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [sorting, setSorting] = useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  
  // Debounce search query for API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to page 1 on search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, setPagination]);
  
// Reset to page 1 when filter changes
useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [statusFilter, activeCard, dateRange, employeeFilter, advancedFilters, setPagination]);

  // Build filter params from active card or manual filters
  const cardFilter = useMemo(() => {
    if (!activeCard) return {};
    const card = WORKFLOW_CARDS.find(c => c.key === activeCard);
    return card?.filter ?? {};
  }, [activeCard]);

  // Convert Vietnamese labels to enum values for API
  const statusEnums = useMemo(() => {
    if (statusFilter.size === 0) return undefined;
    const enums: string[] = [];
    for (const label of statusFilter) {
      // Reverse map: find all enum keys whose label matches
      for (const [enumKey, enumLabel] of Object.entries(ORDER_STATUS_LABELS)) {
        if (enumLabel === label && !enums.includes(enumKey)) enums.push(enumKey);
      }
    }
    return enums.length > 0 ? enums.join(',') : undefined;
  }, [statusFilter]);

  // Build advanced filter params for API
  const advancedApiParams = useMemo(() => {
    const params: Record<string, string | undefined> = {};
    if (advancedFilters.branch) params.branchId = advancedFilters.branch as string;
    if (advancedFilters.customer) {
      const c = advancedFilters.customer as ComboboxOption;
      params.customerSystemId = c.value;
    }
    if (advancedFilters.product) {
      const p = advancedFilters.product as ComboboxOption;
      params.productSystemId = p.value;
    }
    if (advancedFilters.paymentStatus) params.paymentStatus = advancedFilters.paymentStatus as string;
    if (advancedFilters.deliveryStatus) params.deliveryStatus = advancedFilters.deliveryStatus as string;
    if (advancedFilters.stockOutStatus) params.stockOutStatus = advancedFilters.stockOutStatus as string;
    if ((advancedFilters.returnStatus as string[] | undefined)?.length) params.returnStatus = (advancedFilters.returnStatus as string[]).join(',');
    if (advancedFilters.codPending) params.codPending = 'true';
    if (advancedFilters.createdBy) params.createdBy = advancedFilters.createdBy as string;
    if (advancedFilters.deliveryMethod) params.deliveryMethod = advancedFilters.deliveryMethod as string;
    if (advancedFilters.source) params.source = advancedFilters.source as string;
    if (advancedFilters.printStatus) params.printStatus = advancedFilters.printStatus as string;
    if (advancedFilters.packagingStatus) params.packagingStatus = advancedFilters.packagingStatus as string;
    if (advancedFilters.hasNotes !== null && advancedFilters.hasNotes !== undefined) params.hasNotes = advancedFilters.hasNotes ? 'true' : 'false';
    const gtr = advancedFilters.grandTotalRange as { min?: string; max?: string } | null;
    if (gtr?.min) params.minGrandTotal = gtr.min;
    if (gtr?.max) params.maxGrandTotal = gtr.max;
    const dr2 = advancedFilters.discountRange as { min?: string; max?: string } | null;
    if (dr2?.min) params.minDiscount = dr2.min;
    if (dr2?.max) params.maxDiscount = dr2.max;
    const eddr = advancedFilters.expectedDeliveryDateRange as { from?: string; to?: string } | null;
    if (eddr?.from) params.expectedDeliveryStartDate = eddr.from;
    if (eddr?.to) params.expectedDeliveryEndDate = eddr.to;
    const adr = advancedFilters.approvedDateRange as { from?: string; to?: string } | null;
    if (adr?.from) params.approvedStartDate = adr.from;
    if (adr?.to) params.approvedEndDate = adr.to;
    const cdr = advancedFilters.completedDateRange as { from?: string; to?: string } | null;
    if (cdr?.from) params.completedStartDate = cdr.from;
    if (cdr?.to) params.completedEndDate = cdr.to;
    const candr = advancedFilters.cancelledDateRange as { from?: string; to?: string } | null;
    if (candr?.from) params.cancelledStartDate = candr.from;
    if (candr?.to) params.cancelledEndDate = candr.to;
    return params;
  }, [advancedFilters]);

  // Server-side pagination with query params
  const { data: ordersData, isLoading: isLoadingOrders, isFetching } = useOrders({
    page: pagination.pageIndex + 1, // API uses 1-based page
    limit: pagination.pageSize,
    search: debouncedSearchQuery || undefined,
    statusIn: statusEnums,
    startDate: dateRange?.[0] || undefined,
    endDate: dateRange?.[1] || undefined,
    salespersonSystemId: employeeFilter && employeeFilter !== 'all' ? employeeFilter : undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
    ...advancedApiParams,
    ...cardFilter,
  });
  const orders = useMemo(() => ordersData?.data ?? [], [ordersData?.data]);
  const totalRows = ordersData?.pagination?.total ?? 0;
  const pageCount = ordersData?.pagination?.totalPages ?? 1;
  const { cancelOrder, bulkCancelOrders, bulkApproveOrders, bulkPayOrders } = useOrderDetailActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {  employee: authEmployee, can } = useAuth();
  const canCreate = can('create_orders');
  const _canDelete = can('delete_orders');
  const _canEdit = can('edit_orders');
  const canEditSettings = can('edit_settings');
  const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Dialog state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSapoImportOpen, setIsSapoImportOpen] = useState(false);
  const dialogsOpen = isImportOpen || isExportOpen || isSapoImportOpen;

  // ✅ Lazy-load ALL records chỉ khi Import/Export dialogs mở
  const { data: allCustomers } = useAllCustomers({ enabled: dialogsOpen });
  const { data: allProducts } = useAllProducts({ enabled: dialogsOpen });
  const productStore = useMemo(() => ({ data: allProducts, findById: (id: SystemId) => allProducts.find(p => p.systemId === id) }), [allProducts]);

  // ✅ Paginated combobox: load 20 records, search server-side, infinite scroll
  const COMBOBOX_PAGE_SIZE = 20;
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  const customerInfinite = useInfiniteQuery({
    queryKey: ['customers', 'combobox', customerSearch],
    queryFn: ({ pageParam = 1 }) => fetchCustomers({ page: pageParam, limit: COMBOBOX_PAGE_SIZE, search: customerSearch || undefined }),
    getNextPageParam: (last) => last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    initialPageParam: 1,
    enabled: filterPanelOpen,
    staleTime: 5 * 60 * 1000,
  });
  const customerComboboxOptions: ComboboxOption[] = useMemo(
    () => customerInfinite.data?.pages.flatMap(p => p.data.map(c => ({ value: c.systemId, label: c.name, subtitle: c.phone || undefined }))) ?? [],
    [customerInfinite.data]
  );

  const productInfinite = useInfiniteQuery({
    queryKey: ['products', 'combobox', productSearch],
    queryFn: ({ pageParam = 1 }) => fetchProducts({ page: pageParam, limit: COMBOBOX_PAGE_SIZE, search: productSearch || undefined }),
    getNextPageParam: (last) => last.pagination.page < last.pagination.totalPages ? last.pagination.page + 1 : undefined,
    initialPageParam: 1,
    enabled: filterPanelOpen,
    staleTime: 5 * 60 * 1000,
  });
  const productComboboxOptions: ComboboxOption[] = useMemo(
    () => productInfinite.data?.pages.flatMap(p => p.data.map(pr => ({ value: pr.systemId, label: pr.name, subtitle: pr.id }))) ?? [],
    [productInfinite.data]
  );

  // Employees for filter dropdown + dialogs
  const { data: employees } = useAllEmployees();

  const { data: branches } = useAllBranches();
  const { printActions, handleBulkPrintConfirm } = useOrderPrintHandlers();

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('orders');
  const fetchMoreCustomers = useCallback(() => { customerInfinite.fetchNextPage(); }, [customerInfinite]);
  const fetchMoreProducts = useCallback(() => { productInfinite.fetchNextPage(); }, [productInfinite]);
  const customerHasMore = customerInfinite.hasNextPage;
  const customerIsLoadingMore = customerInfinite.isFetchingNextPage;
  const customerIsLoading = customerInfinite.isLoading;
  const productHasMore = productInfinite.hasNextPage;
  const productIsLoadingMore = productInfinite.isFetchingNextPage;
  const productIsLoading = productInfinite.isLoading;

  const filterConfigs: FilterConfig[] = useMemo(() => [
    // --- Thông tin đơn ---
    { id: 'employee', label: 'NV phụ trách', type: 'select' as const, group: 'Thông tin đơn', options: employees.map(e => ({ value: e.systemId, label: e.fullName || e.id })) },
    { id: 'createdBy', label: 'NV tạo đơn', type: 'select' as const, group: 'Thông tin đơn', options: employees.map(e => ({ value: e.systemId, label: e.fullName || e.id })) },
    { id: 'branch', label: 'Chi nhánh', type: 'select' as const, group: 'Thông tin đơn', options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'customer', label: 'Khách hàng', type: 'combobox' as const, group: 'Thông tin đơn', placeholder: 'Tìm khách hàng...', comboboxOptions: customerComboboxOptions, comboboxOnSearchChange: setCustomerSearch, comboboxOnLoadMore: fetchMoreCustomers, comboboxHasMore: customerHasMore, comboboxIsLoadingMore: customerIsLoadingMore, comboboxIsLoading: customerIsLoading },
    { id: 'product', label: 'Sản phẩm', type: 'combobox' as const, group: 'Thông tin đơn', placeholder: 'Tìm sản phẩm...', comboboxOptions: productComboboxOptions, comboboxOnSearchChange: setProductSearch, comboboxOnLoadMore: fetchMoreProducts, comboboxHasMore: productHasMore, comboboxIsLoadingMore: productIsLoadingMore, comboboxIsLoading: productIsLoading },
    { id: 'source', label: 'Nguồn bán hàng', type: 'text' as const, group: 'Thông tin đơn', placeholder: 'Nhập nguồn bán hàng...' },
    { id: 'deliveryMethod', label: 'Hình thức giao hàng', type: 'select' as const, group: 'Thông tin đơn', options: Object.entries(DELIVERY_METHOD_LABELS).map(([value, label]) => ({ value, label })) },
    // --- Trạng thái ---
    { id: 'status', label: 'Trạng thái đơn hàng', type: 'multi-select' as const, group: 'Trạng thái', options: [{ value: 'Đặt hàng', label: 'Đặt hàng' }, { value: 'Đang giao dịch', label: 'Đang giao dịch' }, { value: 'Hoàn thành', label: 'Hoàn thành' }, { value: 'Đã hủy', label: 'Đã hủy' }] },
    { id: 'paymentStatus', label: 'Thanh toán', type: 'select' as const, group: 'Trạng thái', options: Object.entries(PAYMENT_STATUS_LABELS).filter(([k]) => ['UNPAID', 'PARTIAL', 'PAID'].includes(k)).map(([value, label]) => ({ value, label })) },
    { id: 'deliveryStatus', label: 'Giao hàng', type: 'select' as const, group: 'Trạng thái', options: Object.entries(DELIVERY_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
    { id: 'stockOutStatus', label: 'Xuất kho', type: 'select' as const, group: 'Trạng thái', options: Object.entries(STOCK_OUT_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
    { id: 'returnStatus', label: 'Trả hàng', type: 'multi-select' as const, group: 'Trạng thái', options: Object.entries(RETURN_STATUS_LABELS).filter(([, label]) => label !== '').map(([value, label]) => ({ value, label })) },
    { id: 'codPending', label: 'Chờ thu hộ COD', type: 'boolean' as const, group: 'Trạng thái' },
    { id: 'printStatus', label: 'Trạng thái in', type: 'select' as const, group: 'Trạng thái', options: Object.entries(PRINT_STATUS_LABELS).map(([value, label]) => ({ value, label })) },
    { id: 'packagingStatus', label: 'Đóng gói', type: 'select' as const, group: 'Trạng thái', options: Object.entries(packagingStatusLabels).map(([value, label]) => ({ value, label })) },
    { id: 'hasNotes', label: 'Có ghi chú', type: 'boolean' as const, group: 'Trạng thái' },
    // --- Giá trị ---
    { id: 'grandTotalRange', label: 'Tổng tiền', type: 'number-range' as const, group: 'Giá trị', placeholder: 'VNĐ' },
    { id: 'discountRange', label: 'Chiết khấu', type: 'number-range' as const, group: 'Giá trị', placeholder: 'VNĐ' },
    // --- Thời gian ---
    { id: 'dateRange', label: 'Ngày đặt hàng', type: 'date-range' as const, group: 'Thời gian' },
    { id: 'expectedDeliveryDateRange', label: 'Ngày hẹn giao', type: 'date-range' as const, group: 'Thời gian' },
    { id: 'approvedDateRange', label: 'Ngày duyệt đơn', type: 'date-range' as const, group: 'Thời gian' },
    { id: 'completedDateRange', label: 'Ngày hoàn thành', type: 'date-range' as const, group: 'Thời gian' },
    { id: 'cancelledDateRange', label: 'Ngày hủy đơn', type: 'date-range' as const, group: 'Thời gian' },
  ], [employees, branches, customerComboboxOptions, productComboboxOptions, fetchMoreCustomers, customerHasMore, customerIsLoadingMore, customerIsLoading, fetchMoreProducts, productHasMore, productIsLoadingMore, productIsLoading, setCustomerSearch, setProductSearch]);
  const panelValues = useMemo(() => ({
    employee: employeeFilter || null,
    branch: advancedFilters.branch ?? null,
    customer: advancedFilters.customer ?? null,
    product: advancedFilters.product ?? null,
    source: advancedFilters.source ?? null,
    deliveryMethod: advancedFilters.deliveryMethod ?? null,
    createdBy: advancedFilters.createdBy ?? null,
    dateRange: dateRange ? { from: dateRange[0], to: dateRange[1] } : null,
    expectedDeliveryDateRange: advancedFilters.expectedDeliveryDateRange ?? null,
    approvedDateRange: advancedFilters.approvedDateRange ?? null,
    completedDateRange: advancedFilters.completedDateRange ?? null,
    cancelledDateRange: advancedFilters.cancelledDateRange ?? null,
    status: Array.from(statusFilter),
    paymentStatus: advancedFilters.paymentStatus ?? null,
    deliveryStatus: advancedFilters.deliveryStatus ?? null,
    stockOutStatus: advancedFilters.stockOutStatus ?? null,
    returnStatus: advancedFilters.returnStatus ?? [],
    codPending: advancedFilters.codPending ?? null,
    printStatus: advancedFilters.printStatus ?? null,
    packagingStatus: advancedFilters.packagingStatus ?? null,
    hasNotes: advancedFilters.hasNotes ?? null,
    grandTotalRange: advancedFilters.grandTotalRange ?? null,
    discountRange: advancedFilters.discountRange ?? null,
  }), [employeeFilter, dateRange, statusFilter, advancedFilters]);
  const handlePanelApply = useCallback((v: Record<string, unknown>) => {
    startFilterTransition(() => {
      setEmployeeFilter((v.employee as string) || '');
      const dr = v.dateRange as { from?: string; to?: string } | null;
      setDateRange(dr ? [dr.from, dr.to] : undefined);
      setStatusFilter(new Set((v.status as string[]) ?? []));
      if ((v.status as string[] | undefined)?.length) setActiveCard(null);

      // All other advanced filters
      const { employee: _e, dateRange: _d, status: _s, ...rest } = v;
      setAdvancedFilters(rest);
    });
  }, [startFilterTransition]);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [idToCancel, setIdToCancel] = useState<SystemId | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [restockItems, setRestockItems] = useState(true);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [pendingPrintOrders, setPendingPrintOrders] = useState<Order[]>([]);
  const [initialPrintTemplateType, setInitialPrintTemplateType] = useState<OrderPrintTemplateType>('order');

  const defaultColumnVisibility = useMemo(() => { const cols = getColumns(() => {}, null as unknown as ReturnType<typeof useRouter>); const init: Record<string, boolean> = {}; cols.forEach(c => { if (c.id) init[c.id] = true; }); return init; }, []);
  const [columnVisibility, setColumnVisibility, isVisibilityLoaded] = useColumnVisibility('orders', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = useColumnOrder('orders', []);
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('orders', ['select', 'id']);

  useEffect(() => { const status = searchParams?.get('status'); if (status) setStatusFilter(new Set([status])); }, [searchParams]);

  useEffect(() => { if (!isCancelAlertOpen) { setCancelReason(''); setRestockItems(true); } }, [isCancelAlertOpen]);

  const handleCancelRequest = useCallback((systemId: string) => { setIdToCancel(systemId as SystemId); setIsCancelAlertOpen(true); }, []);
  const orderPendingCancel = useMemo(() => idToCancel ? orders.find(o => o.systemId === idToCancel) ?? null : null, [idToCancel, orders]);
  const pendingCancelQuantity = useMemo(() => orderPendingCancel?.lineItems.reduce((s, i) => s + i.quantity, 0) ?? 0, [orderPendingCancel]);

  // Print handlers - dùng chung hook duy nhất (use-order-print-handlers.ts)
  const columns = useMemo(() => getColumns(handleCancelRequest, router, printActions), [handleCancelRequest, router, printActions]);

  // Only set defaults if user has no saved preferences
  const columnDefaultsInitialized = useRef(false);
  useEffect(() => {
    if (columnDefaultsInitialized.current || columns.length === 0 || !isVisibilityLoaded) return;
    columnDefaultsInitialized.current = true;
    // If visibility already has custom values (loaded from DB), don't override
    const hasCustomVisibility = Object.values(columnVisibility).some(v => v === false);
    if (hasCustomVisibility) return;
    const defaultVisible = ['id', 'customerName', 'orderDate', 'branchName', 'salesperson', 'grandTotal', 'totalPaid', 'debt', 'codAmount', 'status', 'paymentStatus', 'packagingStatus', 'deliveryStatus', 'printStatus', 'stockOutStatus'];
    const vis: Record<string, boolean> = {};
    columns.forEach(c => { vis[c.id!] = c.id === 'select' || c.id === 'actions' || defaultVisible.includes(c.id!); });
    setColumnVisibility(vis);
  }, [columns, setColumnVisibility, isVisibilityLoaded, columnVisibility]);

  const confirmCancel = () => {
    if (!idToCancel || !orderPendingCancel) { toast.error('Không tìm thấy đơn cần hủy'); setIsCancelAlertOpen(false); return; }
    if (!cancelReason.trim()) { toast.error('Vui lòng nhập lý do hủy'); return; }
    cancelOrder(idToCancel, currentEmployeeSystemId, { reason: cancelReason.trim(), restock: restockItems }).then(() => toast.success(`Đơn ${orderPendingCancel.id} đã hủy`)).catch(() => toast.error('Không thể hủy đơn'));
    setIsCancelAlertOpen(false); setIdToCancel(null);
  };

  const allSelectedRows = useMemo(() => orders.filter(o => rowSelection[o.systemId]), [orders, rowSelection]);

  const handleRowHover = useCallback((row: Order) => {
    queryClient.prefetchQuery({
      queryKey: orderKeys.detail(row.systemId),
      queryFn: () => fetchOrder(row.systemId),
      staleTime: 60_000,
    });
  }, [queryClient]);
  const handleRowClick = (row: Order) => router.push(`/orders/${row.systemId}`);
  const handleBulkDelete = useCallback(async () => { if (allSelectedRows.length === 0 || !confirm(`Hủy ${allSelectedRows.length} đơn?`)) return; try { const result = await bulkCancelOrders({ systemIds: allSelectedRows.map(o => o.systemId), reason: 'Hủy hàng loạt', restockItems: true }); const msgs: string[] = []; if (result?.cancelled) msgs.push(`Đã hủy ${result.cancelled} đơn`); if (result?.failed?.length) msgs.push(`${result.failed.length} đơn không thể hủy`); toast.success(msgs.join(', ') || 'Đã xử lý'); } catch { toast.error('Lỗi khi hủy đơn hàng loạt'); } setRowSelection({}); }, [allSelectedRows, bulkCancelOrders]);

  const handleBulkApprove = useCallback(async (rows: Order[]) => {
    const pendingRows = rows.filter(o => o.status === 'PENDING' || o.status === 'Đặt hàng');
    if (pendingRows.length === 0) { toast.error('Không có đơn nào ở trạng thái chờ duyệt'); return; }
    if (!confirm(`Duyệt ${pendingRows.length} đơn hàng?`)) return;
    try {
      const result = await bulkApproveOrders({ systemIds: pendingRows.map(o => o.systemId) });
      const msgs: string[] = [];
      if (result?.approved) msgs.push(`Đã duyệt ${result.approved} đơn`);
      if (result?.failed?.length) msgs.push(`${result.failed.length} đơn không thể duyệt`);
      toast.success(msgs.join(', ') || 'Đã xử lý');
    } catch { toast.error('Lỗi khi duyệt đơn hàng loạt'); }
    setRowSelection({});
  }, [bulkApproveOrders]);

  const handleBulkPayment = useCallback(async (rows: Order[]) => {
    const unpaidRows = rows.filter(o => o.status !== 'CANCELLED' && o.paymentStatus !== 'PAID');
    if (unpaidRows.length === 0) { toast.error('Không có đơn nào cần thanh toán'); return; }
    if (!confirm(`Thanh toán toàn bộ ${unpaidRows.length} đơn hàng?`)) return;
    try {
      const result = await bulkPayOrders({ systemIds: unpaidRows.map(o => o.systemId), paymentMethodId: 'cash' });
      const msgs: string[] = [];
      if (result?.paid) msgs.push(`Đã thanh toán ${result.paid} đơn`);
      if (result?.failed?.length) msgs.push(`${result.failed.length} đơn không thể thanh toán`);
      toast.success(msgs.join(', ') || 'Đã xử lý');
    } catch { toast.error('Lỗi khi thanh toán hàng loạt'); }
    setRowSelection({});
  }, [bulkPayOrders]);

  const handleBulkPrintWithOptions = useCallback((rows: Order[], type: OrderPrintTemplateType = 'order') => { setPendingPrintOrders(rows); setInitialPrintTemplateType(type); setIsPrintDialogOpen(true); }, []);
  const handlePrintConfirm = useCallback((opts: PrintOptionsResult) => {
    handleBulkPrintConfirm(pendingPrintOrders, opts);
    setPendingPrintOrders([]);
  }, [pendingPrintOrders, handleBulkPrintConfirm]);

  const bulkActions = useMemo(() => [
    { label: 'In hàng loạt', icon: FileText, onSelect: (rows: Order[]) => handleBulkPrintWithOptions(rows, 'order') },
    ...(can('approve_orders') ? [{ label: 'Duyệt hàng loạt', icon: CheckCircle, onSelect: handleBulkApprove }] : []),
    ...(can('pay_orders') ? [{ label: 'Thanh toán hàng loạt', icon: DollarSign, onSelect: handleBulkPayment }] : []),
  ], [handleBulkPrintWithOptions, handleBulkApprove, handleBulkPayment, can]);

  const storeContext = useMemo(() => ({ customerStore: { data: allCustomers }, productStore, branchStore: { data: branches }, employeeStore: { data: employees } }), [allCustomers, productStore, branches, employees]);

  const [ordersForExport, setOrdersForExport] = useState<Order[]>([]);
  const [filteredOrdersForExport, setFilteredOrdersForExport] = useState<Order[]>([]);
  const [pageOrdersForExport, setPageOrdersForExport] = useState<Order[]>([]);
  const [selectedOrdersForExport, setSelectedOrdersForExport] = useState<Order[]>([]);

  useEffect(() => { if (isExportOpen) loadFlattenOrdersForExport().then(fn => { setOrdersForExport(fn(orders, allCustomers) as unknown as Order[]); setFilteredOrdersForExport(fn(orders, allCustomers) as unknown as Order[]); setPageOrdersForExport(fn(orders, allCustomers) as unknown as Order[]); setSelectedOrdersForExport(fn(allSelectedRows, allCustomers) as unknown as Order[]); }); }, [isExportOpen, orders, allSelectedRows, allCustomers]);

  const handleImport = useOrderImportHandler({ authEmployeeSystemId: authEmployee?.systemId });

  const headerActions = useMemo(() => [canCreate && <Button key="add" size="sm" onClick={() => router.push('/orders/new')}><PlusCircle className="mr-2 h-4 w-4" />Tạo đơn hàng</Button>].filter(Boolean), [router, canCreate]);
  usePageHeader({ title: 'Danh sách đơn hàng', breadcrumb: [{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng', href: '/orders', isCurrent: true }], showBackButton: false, actions: headerActions });

  const handlePullRefresh = useCallback(async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: orderKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['orderStats'] }),
    ]);
  }, [queryClient]);

  return (
    <PullToRefresh onRefresh={handlePullRefresh} disabled={!isMobile}>
      {/* Workflow Status Cards - ToggleGroup */}
      <div className="mb-4 overflow-x-auto">
        <ToggleGroup
          type="single"
          value={activeCard ?? ''}
          onValueChange={(val) => {
            const key = val as WorkflowFilterKey | '';
            startFilterTransition(() => {
              setActiveCard(key || null);
              if (key) setStatusFilter(new Set());
            });
          }}
          className="justify-start gap-1.5 min-w-max pb-1"
        >
          {WORKFLOW_CARDS.map(card => {
            const data = stats?.workflowCards?.[card.key];
            const count = data?.count ?? 0;
            const amount = data?.amount ?? 0;
            return (
              <ToggleGroupItem
                key={card.key}
                value={card.key}
                variant="outline"
                className="h-auto shrink-0 rounded-lg px-3.5 py-2 text-left data-[state=on]:bg-primary/5 data-[state=on]:border-primary data-[state=on]:ring-1 data-[state=on]:ring-primary"
              >
                <div className="flex flex-col items-start gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{card.label}</span>
                    {count > 0 && (
                      <Badge variant={activeCard === card.key ? 'default' : 'destructive'} className="h-5 min-w-5 justify-center rounded-full px-1.5 text-xs leading-none">
                        {count}
                      </Badge>
                    )}
                  </div>
                  <span className="text-sm font-semibold tabular-nums">{formatCurrency(amount)}</span>
                </div>
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
      </div>

      {/* Mobile: Search in toolbar */}
      <PageToolbar
        search={{ value: searchQuery, onChange: setSearchQuery, placeholder: 'Tìm kiếm đơn hàng...' }}
        rightActions={<Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground" onClick={() => setScannerOpen(true)} title="Quét mã QR/Barcode"><ScanLine className="h-5 w-5" /></Button>}
      />

      {/* Desktop toolbar + Mobile filters row */}
      <div className="flex flex-col gap-2">
        {/* Desktop toolbar */}
        {!isMobile && <PageToolbar leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/sales-config')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsSapoImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Import Sapo</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} />}

        {/* Desktop search + filters */}
        <div className="hidden md:flex flex-col sm:flex-row items-stretch sm:items-center gap-3 py-3">
          <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm kiếm đơn hàng..." className="py-0!" >
            <DataTableFacetedFilter title="Trạng thái" selectedValues={statusFilter} onSelectedValuesChange={(v) => { startFilterTransition(() => { setStatusFilter(v); setActiveCard(null); }); }} options={[{ label: 'Đặt hàng', value: 'Đặt hàng' }, { label: 'Đang giao dịch', value: 'Đang giao dịch' }, { label: 'Hoàn thành', value: 'Hoàn thành' }, { label: 'Đã hủy', value: 'Đã hủy' }]} />
            <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} onOpenChange={setFilterPanelOpen} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
          </PageFilters>
          <DataTableDateFilter value={dateRange} onChange={(v) => startFilterTransition(() => setDateRange(v))} title="Ngày đặt" />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={employeeFilter} onValueChange={(v) => startFilterTransition(() => setEmployeeFilter(v))}>
            <SelectTrigger className="w-45">
              <SelectValue placeholder="NV phụ trách" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả NV</SelectItem>
              {employees.map(emp => (
                <SelectItem key={emp.systemId} value={emp.systemId}>
                  {emp.fullName || emp.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile filters - horizontal scroll */}
        <div className="md:hidden overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-4 -mx-4">
          <div className="flex items-center gap-2 py-2 min-w-max">
            <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)} className="shrink-0"><FileUp className="mr-1 h-4 w-4" />Nhập</Button>
            <Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)} className="shrink-0"><Download className="mr-1 h-4 w-4" />Xuất</Button>
            <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} onOpenChange={setFilterPanelOpen} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
          </div>
        </div>

        {/* Clear filters button */}
        {(dateRange || employeeFilter || activeCard || statusFilter.size > 0) && (
          <Button variant="ghost" size="sm" className="text-muted-foreground self-start" onClick={() => {
            startFilterTransition(() => {
              setDateRange(undefined);
              setEmployeeFilter('');
              setActiveCard(null);
              setStatusFilter(new Set());
            });
          }}>
            Xóa lọc
          </Button>
        )}
      </div>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      </div>
      <div className={cn("pb-4", (isFilterPending || (isFetching && !isLoadingOrders)) && "opacity-60 transition-opacity")}><ResponsiveDataTable columns={columns} data={orders} renderMobileCard={o => <OrderCard order={o} onCancel={handleCancelRequest} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} onBulkDelete={handleBulkDelete} bulkActions={bulkActions} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} onRowHover={handleRowHover} emptyTitle="Không có đơn hàng" emptyDescription="Tạo đơn hàng đầu tiên" isLoading={isLoadingOrders} mobileInfiniteScroll /></div>
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy đơn hàng?</AlertDialogTitle><AlertDialogDescription className="space-y-4 text-left"><div className="space-y-2 text-sm"><p>Thao tác sẽ cập nhật trạng thái đơn thành "Đã hủy".</p></div><div className="space-y-2"><Label htmlFor="cancel-reason" className="text-sm font-semibold">Lý do hủy (bắt buộc)</Label><Textarea id="cancel-reason" value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Nhập lý do hủy..." rows={3} /></div><div className="flex items-start gap-3 rounded-md border border-border p-3"><Checkbox id="restock" checked={restockItems} onCheckedChange={c => setRestockItems(c === true)} /><div><Label htmlFor="restock" className="text-sm font-medium">Hoàn kho {pendingCancelQuantity} SP</Label><p className="text-xs text-muted-foreground">Bỏ chọn nếu tự xử lý tồn kho</p></div></div></AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Thoát</AlertDialogCancel><AlertDialogAction onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <PrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintOrders.length} initialTemplateType={initialPrintTemplateType} />
      <OrderImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={orders} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} storeContext={storeContext} />
      <OrderExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={ordersForExport} filteredData={filteredOrdersForExport} currentPageData={pageOrdersForExport} selectedData={selectedOrdersForExport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
      <SapoOrderImportDialog open={isSapoImportOpen} onOpenChange={setIsSapoImportOpen} existingData={orders} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} storeContext={storeContext} />
      <QrScannerDialog open={scannerOpen} onOpenChange={setScannerOpen} onScan={(value) => setSearchQuery(value)} />
      {isMobile && canCreate && <FAB onClick={() => router.push('/orders/new')} />}
    </PullToRefresh>
  )
}
