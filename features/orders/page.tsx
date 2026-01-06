'use client'

import * as React from "react"
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from "sonner"
import { PlusCircle, FileUp, Download, FileText } from "lucide-react"

import { useOrderStore } from "./store"
import { useOrderDetailActions } from "./hooks/use-order-detail-actions"
import { getColumns } from "./columns"
import { useFuseFilter } from "@/hooks/use-fuse-search"
import { usePageHeader } from "@/contexts/page-header-context"
import { useMediaQuery } from "@/lib/use-media-query"
import { useAuth } from "@/contexts/auth-context"
import { asSystemId, type SystemId } from "@/lib/id-types"
import { useColumnVisibility } from "@/hooks/use-column-visibility"
import { usePrint } from "@/lib/use-print"
import { useAllCustomers, useCustomerFinder } from "../customers/hooks/use-all-customers"
import { useAllBranches, useBranchFinder } from "../settings/branches/hooks/use-all-branches"
import { useProductStore } from "../products/store"
import { useAllEmployees } from "../employees/hooks/use-all-employees"
import { convertOrderForPrint, convertPackagingToDeliveryForPrint, convertToShippingLabelForPrint, convertToPackingForPrint, mapOrderToPrintData, mapOrderLineItems, mapDeliveryToPrintData, mapDeliveryLineItems, mapShippingLabelToPrintData, mapPackingToPrintData, mapPackingLineItems, createStoreSettings } from "@/lib/print/order-print-helper"
import type { TemplateType } from "../settings/printer/types"
import type { PrintOptions } from "@/lib/use-print"
import type { Order } from '@/lib/types/prisma-extended'

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table"
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter"
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { PrintOptionsDialog, type PrintOptionsResult, type OrderPrintTemplateType } from "@/components/shared/print-options-dialog"
import { PageFilters } from "@/components/layout/page-filters"
import { PageToolbar } from "@/components/layout/page-toolbar"
import { OrderCard } from "./components/order-card"

const OrderImportDialog = dynamic(() => import("./components/order-import-export-dialogs").then(mod => ({ default: mod.OrderImportDialog })), { ssr: false });
const OrderExportDialog = dynamic(() => import("./components/order-import-export-dialogs").then(mod => ({ default: mod.OrderExportDialog })), { ssr: false });
const SapoOrderImportDialog = dynamic(() => import("./components/order-import-export-dialogs").then(mod => ({ default: mod.SapoOrderImportDialog })), { ssr: false });
const loadFlattenOrdersForExport = () => import("./components/order-import-export-dialogs").then(mod => mod.flattenOrdersForExport);

export function OrdersPage() {
  const orderStore = useOrderStore();
  const orders = React.useMemo(() => orderStore.data ?? [], [orderStore.data]);
  const { cancelOrder } = useOrderDetailActions();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { employee: authEmployee } = useAuth();
  const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { data: allCustomers } = useAllCustomers();
  const { findById: findCustomerById } = useCustomerFinder();
  const { data: branches } = useAllBranches();
  const { findById: findBranchById } = useBranchFinder();
  const productStore = useProductStore();
  const { data: employees } = useAllEmployees();
  const { print, printMixedDocuments } = usePrint();

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false);
  const [idToCancel, setIdToCancel] = React.useState<SystemId | null>(null);
  const [cancelReason, setCancelReason] = React.useState('');
  const [restockItems, setRestockItems] = React.useState(true);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintOrders, setPendingPrintOrders] = React.useState<Order[]>([]);
  const [initialPrintTemplateType, setInitialPrintTemplateType] = React.useState<OrderPrintTemplateType>('order');
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [isSapoImportOpen, setIsSapoImportOpen] = React.useState(false);
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  const defaultColumnVisibility = React.useMemo(() => { const cols = getColumns(() => {}, null as unknown as ReturnType<typeof useRouter>); const init: Record<string, boolean> = {}; cols.forEach(c => { if (c.id) init[c.id] = true; }); return init; }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('orders', defaultColumnVisibility);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);

  React.useEffect(() => { const status = searchParams?.get('status'); if (status) setStatusFilter(new Set([status])); }, [searchParams]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [searchQuery, statusFilter]);
  React.useEffect(() => { if (!isCancelAlertOpen) { setCancelReason(''); setRestockItems(true); } }, [isCancelAlertOpen]);

  const handleCancelRequest = React.useCallback((systemId: SystemId) => { setIdToCancel(systemId); setIsCancelAlertOpen(true); }, []);
  const orderPendingCancel = React.useMemo(() => idToCancel ? orders.find(o => o.systemId === idToCancel) ?? null : null, [idToCancel, orders]);
  const pendingCancelQuantity = React.useMemo(() => orderPendingCancel?.lineItems.reduce((s, i) => s + i.quantity, 0) ?? 0, [orderPendingCancel]);

  // Print handlers
  const handlePrintOrder = React.useCallback((order: Order) => { const c = findCustomerById(order.customerSystemId), b = findBranchById(order.branchSystemId), s = createStoreSettings(b), d = convertOrderForPrint(order, { customer: c }); print('order', { data: mapOrderToPrintData(d, s), lineItems: mapOrderLineItems(d.items) }); toast.success(`Đang in đơn hàng ${order.id}`); }, [findCustomerById, findBranchById, print]);
  const handlePrintPacking = React.useCallback((order: Order) => { const p = order.packagings?.[order.packagings.length - 1]; if (!p) { toast.error('Chưa có phiếu đóng gói'); return; } const c = findCustomerById(order.customerSystemId), b = findBranchById(order.branchSystemId), s = createStoreSettings(b), d = convertToPackingForPrint(order, p, { customer: c }); print('packing', { data: mapPackingToPrintData(d, s), lineItems: mapPackingLineItems(d.items) }); toast.success(`Đang in phiếu đóng gói ${p.id}`); }, [findCustomerById, findBranchById, print]);
  const handlePrintShippingLabel = React.useCallback((order: Order) => { const p = order.packagings?.find(x => x.status === 'Đã đóng gói'); if (!p) { toast.error('Chưa có đóng gói xác nhận'); return; } const c = findCustomerById(order.customerSystemId), b = findBranchById(order.branchSystemId), s = createStoreSettings(b), d = convertToShippingLabelForPrint(order, p, { customer: c }); print('shipping-label', { data: mapShippingLabelToPrintData(d, s) }); toast.success(`Đang in nhãn ${order.id}`); }, [findCustomerById, findBranchById, print]);
  const handlePrintDelivery = React.useCallback((order: Order) => { const p = order.packagings?.find(x => x.status === 'Đã đóng gói'); if (!p) { toast.error('Chưa có đóng gói xác nhận'); return; } const c = findCustomerById(order.customerSystemId), b = findBranchById(order.branchSystemId), s = createStoreSettings(b), d = convertPackagingToDeliveryForPrint(order, p, { customer: c }); print('delivery', { data: mapDeliveryToPrintData(d, s), lineItems: mapDeliveryLineItems(d.items) }); toast.success(`Đang in phiếu giao ${order.id}`); }, [findCustomerById, findBranchById, print]);

  const printActions = React.useMemo(() => ({ onPrintOrder: handlePrintOrder, onPrintPacking: handlePrintPacking, onPrintShippingLabel: handlePrintShippingLabel, onPrintDelivery: handlePrintDelivery }), [handlePrintOrder, handlePrintPacking, handlePrintShippingLabel, handlePrintDelivery]);
  const columns = React.useMemo(() => getColumns(handleCancelRequest, router, printActions), [handleCancelRequest, router, printActions]);

  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => {
    if (columnDefaultsInitialized.current || columns.length === 0) return;
    const defaultVisible = ['id', 'customerName', 'orderDate', 'branchName', 'salesperson', 'grandTotal', 'totalPaid', 'debt', 'codAmount', 'status', 'paymentStatus', 'packagingStatus', 'deliveryStatus', 'printStatus', 'stockOutStatus'];
    const vis: Record<string, boolean> = {};
    columns.forEach(c => { vis[c.id!] = c.id === 'select' || c.id === 'actions' || defaultVisible.includes(c.id!); });
    setColumnVisibility(vis);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    columnDefaultsInitialized.current = true;
  }, [columns, setColumnVisibility]);

  const fuseOptions = React.useMemo(() => ({ keys: ["id", "customerName", "salesperson"], threshold: 0.3 }), []);
  const searchedOrders = useFuseFilter(orders, searchQuery, fuseOptions);

  const confirmCancel = () => {
    if (!idToCancel || !orderPendingCancel) { toast.error('Không tìm thấy đơn cần hủy'); setIsCancelAlertOpen(false); return; }
    if (!cancelReason.trim()) { toast.error('Vui lòng nhập lý do hủy'); return; }
    cancelOrder(idToCancel, currentEmployeeSystemId, { reason: cancelReason.trim(), restock: restockItems }).then(() => toast.success(`Đơn ${orderPendingCancel.id} đã hủy`)).catch(() => toast.error('Không thể hủy đơn'));
    setIsCancelAlertOpen(false); setIdToCancel(null);
  };

  const filteredData = React.useMemo(() => { let d = searchQuery ? searchedOrders : orders; if (statusFilter.size > 0) d = d.filter(o => statusFilter.has(o.status)); return d; }, [orders, searchQuery, searchedOrders, statusFilter]);
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) sorted.sort((a, b) => {
      const aV = (a as Record<string, unknown>)[sorting.id], bV = (b as Record<string, unknown>)[sorting.id];
      if (sorting.id === 'createdAt' || sorting.id === 'orderDate') { const aT = aV ? new Date(aV as string).getTime() : 0, bT = bV ? new Date(bV as string).getTime() : 0; return sorting.desc ? bT - aT : aT - bT; }
      return aV < bV ? (sorting.desc ? 1 : -1) : aV > bV ? (sorting.desc ? -1 : 1) : 0;
    });
    return sorted;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const displayData = isMobile ? sortedData.slice(0, mobileLoadedCount) : paginatedData;
  const allSelectedRows = React.useMemo(() => sortedData.filter(o => rowSelection[o.systemId]), [sortedData, rowSelection]);

  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < sortedData.length) setMobileLoadedCount(p => Math.min(p + 20, sortedData.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, sortedData.length]);

  const handleRowClick = (row: Order) => router.push(`/orders/${row.systemId}`);
  const handleBulkDelete = React.useCallback(() => { if (allSelectedRows.length === 0 || !confirm(`Hủy ${allSelectedRows.length} đơn?`)) return; allSelectedRows.forEach(o => cancelOrder(o.systemId, currentEmployeeSystemId, { reason: 'Hủy hàng loạt', restock: true })); setRowSelection({}); }, [allSelectedRows, cancelOrder, currentEmployeeSystemId]);

  const handleBulkPrintWithOptions = React.useCallback((rows: Order[], type: OrderPrintTemplateType = 'order') => { setPendingPrintOrders(rows); setInitialPrintTemplateType(type); setIsPrintDialogOpen(true); }, []);
  const handlePrintConfirm = React.useCallback((opts: PrintOptionsResult) => {
    const { branchSystemId, paperSize, printOrder, printDelivery, printPacking, printShippingLabel } = opts;
    const docs: Array<{ type: TemplateType; options: PrintOptions }> = [];
    const msgs: string[] = [];
    pendingPrintOrders.forEach(order => {
      const c = findCustomerById(order.customerSystemId), b = branchSystemId ? findBranchById(branchSystemId) : findBranchById(order.branchSystemId), s = createStoreSettings(b);
      if (printOrder) { const d = convertOrderForPrint(order, { customer: c }); docs.push({ type: 'order', options: { data: mapOrderToPrintData(d, s), lineItems: mapOrderLineItems(d.items), paperSize } }); }
      const pkg = order.packagings?.find(p => p.status === 'Đã đóng gói') ?? order.packagings?.[order.packagings.length - 1];
      if (printPacking && pkg) { const d = convertToPackingForPrint(order, pkg, { customer: c }); docs.push({ type: 'packing', options: { data: mapPackingToPrintData(d, s), lineItems: mapPackingLineItems(d.items), paperSize } }); }
      if (printDelivery && pkg) { const d = convertPackagingToDeliveryForPrint(order, pkg, { customer: c }); docs.push({ type: 'delivery', options: { data: mapDeliveryToPrintData(d, s), lineItems: mapDeliveryLineItems(d.items), paperSize } }); }
      const confirmedPkg = order.packagings?.find(p => p.status === 'Đã đóng gói');
      if (printShippingLabel && confirmedPkg) { const d = convertToShippingLabelForPrint(order, confirmedPkg, { customer: c }); docs.push({ type: 'shipping-label', options: { data: mapShippingLabelToPrintData(d, s), paperSize } }); }
    });
    if (printOrder) msgs.push(`${pendingPrintOrders.length} đơn hàng`);
    if (printPacking) msgs.push(`phiếu đóng gói`);
    if (printDelivery) msgs.push(`phiếu giao`);
    if (printShippingLabel) msgs.push(`nhãn giao`);
    if (docs.length > 0) { printMixedDocuments(docs); toast.success(`Đang in ${msgs.join(', ')}`); } else toast.error('Không có dữ liệu để in');
    setPendingPrintOrders([]);
  }, [pendingPrintOrders, findCustomerById, findBranchById, printMixedDocuments]);

  const bulkActions = React.useMemo(() => [{ label: 'In hàng loạt', icon: FileText, onSelect: (rows: Order[]) => handleBulkPrintWithOptions(rows, 'order') }], [handleBulkPrintWithOptions]);

  const storeContext = React.useMemo(() => ({ customerStore: { data: allCustomers }, productStore, branchStore: { data: branches }, employeeStore: { data: employees } }), [allCustomers, productStore, branches, employees]);

  const [ordersForExport, setOrdersForExport] = React.useState<Order[]>([]);
  const [filteredOrdersForExport, setFilteredOrdersForExport] = React.useState<Order[]>([]);
  const [pageOrdersForExport, setPageOrdersForExport] = React.useState<Order[]>([]);
  const [selectedOrdersForExport, setSelectedOrdersForExport] = React.useState<Order[]>([]);

  React.useEffect(() => { if (isExportOpen) loadFlattenOrdersForExport().then(fn => { setOrdersForExport(fn(orders) as unknown as Order[]); setFilteredOrdersForExport(fn(sortedData) as unknown as Order[]); setPageOrdersForExport(fn(paginatedData) as unknown as Order[]); setSelectedOrdersForExport(fn(allSelectedRows) as unknown as Order[]); }); }, [isExportOpen, orders, sortedData, paginatedData, allSelectedRows]);

  const handleImport = React.useCallback(async (data: Partial<Order>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
    const results = { success: 0, failed: 0, inserted: 0, updated: 0, skipped: 0, errors: [] as Array<{ row: number; message: string }> };
    for (let i = 0; i < data.length; i++) {
      if (mode === 'update-only') { results.skipped++; continue; }
      try { orderStore.add(data[i] as Order); results.inserted++; results.success++; } catch (e) { results.failed++; results.errors.push({ row: i + 1, message: e instanceof Error ? e.message : 'Lỗi' }); }
    }
    if (results.inserted > 0) toast.success(`Đã nhập ${results.inserted} đơn`);
    if (results.skipped > 0) toast.info(`Bỏ qua ${results.skipped} đơn`);
    if (results.failed > 0) toast.error(`${results.failed} đơn thất bại`);
    return results;
  }, [orderStore]);

  const headerActions = React.useMemo(() => [<Button key="add" size="sm" className="h-9" onClick={() => router.push('/orders/new')}><PlusCircle className="mr-2 h-4 w-4" />Tạo đơn hàng</Button>], [router]);
  usePageHeader({ title: 'Danh sách đơn hàng', breadcrumb: [{ label: 'Trang chủ', href: '/' }, { label: 'Đơn hàng', href: '/orders', isCurrent: true }], showBackButton: false, actions: headerActions });

  return (
    <>
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Nhập file</Button><Button variant="outline" size="sm" onClick={() => setIsSapoImportOpen(true)}><FileUp className="mr-2 h-4 w-4" />Import Sapo</Button><Button variant="outline" size="sm" onClick={() => setIsExportOpen(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button></>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} />}
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm kiếm đơn hàng..."><DataTableFacetedFilter title="Trạng thái" selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} options={[{ label: 'Đặt hàng', value: 'Đặt hàng' }, { label: 'Đang giao dịch', value: 'Đang giao dịch' }, { label: 'Hoàn thành', value: 'Hoàn thành' }, { label: 'Đã hủy', value: 'Đã hủy' }]} /></PageFilters>
      <div className="pb-4"><ResponsiveDataTable columns={columns} data={displayData} renderMobileCard={o => <OrderCard order={o} onCancel={handleCancelRequest} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} onBulkDelete={handleBulkDelete} bulkActions={bulkActions} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} emptyTitle="Không có đơn hàng" emptyDescription="Tạo đơn hàng đầu tiên" /></div>
      {isMobile && <div className="py-6 text-center">{mobileLoadedCount < sortedData.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-body-sm">Đang tải...</span></div> : sortedData.length > 20 ? <p className="text-body-sm text-muted-foreground">Đã hiển thị {sortedData.length} kết quả</p> : null}</div>}
      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Hủy đơn hàng?</AlertDialogTitle><AlertDialogDescription className="space-y-4 text-left"><div className="space-y-2 text-body-sm"><p>Thao tác sẽ cập nhật trạng thái đơn thành "Đã hủy".</p></div><div className="space-y-2"><Label htmlFor="cancel-reason" className="text-body-sm font-semibold">Lý do hủy (bắt buộc)</Label><Textarea id="cancel-reason" value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Nhập lý do hủy..." rows={3} /></div><div className="flex items-start gap-3 rounded-md border p-3"><Checkbox id="restock" checked={restockItems} onCheckedChange={c => setRestockItems(c === true)} /><div><Label htmlFor="restock" className="text-body-sm font-medium">Hoàn kho {pendingCancelQuantity} SP</Label><p className="text-body-xs text-muted-foreground">Bỏ chọn nếu tự xử lý tồn kho</p></div></div></AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Thoát</AlertDialogCancel><AlertDialogAction onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <PrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintOrders.length} initialTemplateType={initialPrintTemplateType} />
      <OrderImportDialog open={isImportOpen} onOpenChange={setIsImportOpen} existingData={orders} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} storeContext={storeContext} />
      <OrderExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} allData={ordersForExport} filteredData={filteredOrdersForExport} currentPageData={pageOrdersForExport} selectedData={selectedOrdersForExport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : { systemId: asSystemId('SYSTEM'), name: 'System' }} />
      <SapoOrderImportDialog open={isSapoImportOpen} onOpenChange={setIsSapoImportOpen} existingData={orders} onImport={handleImport} currentUser={authEmployee ? { systemId: authEmployee.systemId, name: authEmployee.fullName || authEmployee.id } : undefined} storeContext={storeContext} />
    </>
  )
}
