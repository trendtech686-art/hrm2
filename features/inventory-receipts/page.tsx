'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Printer, Download, Settings } from "lucide-react";

import { ROUTES } from '@/lib/router';
import { formatDate, formatDateCustom, parseDate } from '@/lib/date-utils';
import { useInventoryReceipts } from "./hooks/use-inventory-receipts";
import { useAllInventoryReceipts } from "./hooks/use-all-inventory-receipts";
import { useAllSuppliers, useSupplierFinder } from "../suppliers/hooks/use-all-suppliers";
import { usePageHeader } from "@/contexts/page-header-context";
import { useAllBranches, useBranchFinder } from "../settings/branches/hooks/use-all-branches";
import { fetchPrintData } from '@/lib/lazy-print-data';
import { usePrint } from "@/lib/use-print";
import { convertStockInForPrint, mapStockInToPrintData, mapStockInLineItems, createStoreSettings } from "@/lib/print/stock-in-print-helper";
import { useAuth } from "@/contexts/auth-context";
import { useColumnLayout } from "@/hooks/use-column-visibility";
import { asSystemId } from "@/lib/id-types";
import { useMediaQuery } from "@/lib/use-media-query";
import type { ColumnDef } from "@/components/data-table/types";
import type { InventoryReceipt } from '@/lib/types/prisma-extended';

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { MobileCard, MobileCardBody, MobileCardHeader } from "@/components/mobile/mobile-card";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { PageFilters } from "@/components/layout/page-filters";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from "@/components/shared/simple-print-options-dialog";
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';

const InventoryReceiptExportDialog = dynamic(() => import("./components/inventory-receipts-import-export-dialogs").then(mod => ({ default: mod.InventoryReceiptExportDialog })), { ssr: false });

const getColumns = (handlers: { onPrint: (r: InventoryReceipt) => void }): ColumnDef<InventoryReceipt>[] => [
  { id: "select", header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => <div className="flex items-center justify-center"><Checkbox checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false} onCheckedChange={(v) => onToggleAll?.(!!v)} /></div>, cell: ({ isSelected, onToggleSelect }) => <div className="flex items-center justify-center"><Checkbox checked={isSelected} onCheckedChange={onToggleSelect} /></div>, size: 48, meta: { displayName: "Chọn", sticky: "left" } },
  { id: 'id', accessorKey: 'id', header: 'Mã phiếu', cell: ({ row }) => <span className="font-medium text-primary">{row.id}</span>, meta: { displayName: 'Mã phiếu' }, size: 120 },
  { id: 'receivedDate', accessorKey: 'receivedDate', header: 'Ngày nhập', cell: ({ row }) => formatDateCustom(parseDate(row.receivedDate)!, 'dd/MM/yyyy HH:mm'), meta: { displayName: 'Ngày nhập' }, size: 150 },
  { id: 'supplierName', accessorKey: 'supplierName', header: 'Nhà cung cấp', cell: ({ row }) => row.supplierName, meta: { displayName: 'Nhà cung cấp' } },
  { id: 'purchaseOrderId', accessorKey: 'purchaseOrderId', header: 'Đơn mua hàng', cell: ({ row }) => row.purchaseOrderId, meta: { displayName: 'Đơn mua hàng' }, size: 140 },
  { id: 'totalQuantity', header: 'Tổng SL', cell: ({ row }) => <span className="font-medium">{row.items.reduce((s, i) => s + Number(i.receivedQuantity), 0)}</span>, meta: { displayName: 'Tổng SL' }, size: 100 },
  { id: 'receiverName', accessorKey: 'receiverName', header: 'Người nhận', cell: ({ row }) => row.receiverName, meta: { displayName: 'Người nhận' }, size: 150 },
  { id: 'notes', accessorKey: 'notes', header: 'Ghi chú', cell: ({ row }) => <span className="text-xs max-w-xs line-clamp-2">{row.notes || '-'}</span>, meta: { displayName: 'Ghi chú' }, size: 200 },
  { id: 'itemsCount', header: 'Số mặt hàng', cell: ({ row }) => <span className="font-medium">{row.items.length}</span>, meta: { displayName: 'Số mặt hàng' }, size: 100 },
  { id: 'totalValue', header: 'Tổng giá trị', cell: ({ row }) => <span className="font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.items.reduce((s, i) => s + i.receivedQuantity * i.unitPrice, 0))}</span>, meta: { displayName: 'Tổng giá trị' }, size: 150 },
  { id: 'actions', header: 'Hành động', cell: ({ row }) => <Button variant="ghost" size="sm" className="h-8" onClick={(e) => { e.stopPropagation(); handlers.onPrint(row); }}><Printer className="h-4 w-4 mr-1" />In</Button>, size: 100, meta: { displayName: 'Hành động', sticky: 'right' } },
];

export function InventoryReceiptsPage() {
  // Search & filter state
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [supplierFilter, setSupplierFilter] = React.useState('all');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();

  // Debounce search
  React.useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page when filters change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [supplierFilter, branchFilter, dateRange]);

  // Server-side paginated query
  const { data: queryData, isLoading } = useInventoryReceipts({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    supplierId: supplierFilter !== 'all' ? supplierFilter : undefined,
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    startDate: dateRange?.[0] || undefined,
    endDate: dateRange?.[1] || undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });

  const receipts = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const totalRows = queryData?.pagination?.total ?? 0;
  const pageCount = queryData?.pagination?.totalPages ?? 1;

  // Lazy-load all data only for export
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const { data: allReceipts } = useAllInventoryReceipts({ enabled: exportDialogOpen });

  // Lazy-load suppliers only when filter dropdown is interacted with
  const { data: suppliers } = useAllSuppliers({ enabled: true });
  const { findById: findSupplierById } = useSupplierFinder();
  const { data: branches } = useAllBranches();
  const { findById: findBranchById } = useBranchFinder();
  // ⚡ OPTIMIZED: Defer print template loading until print is clicked
  const { print, printMultiple } = usePrint({ enabled: false });
  const {  employee: currentUser, can } = useAuth();
  const canEdit = can('edit_inventory');
  const canView = can('view_inventory');
  const canEditSettings = can('edit_settings');
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintReceipts, setPendingPrintReceipts] = React.useState<InventoryReceipt[]>([]);

  // Column visibility (persisted to DB) with proper defaults
  const defaultColumnVisibility = React.useMemo(() => {
    const initial: Record<string, boolean> = {};
    getColumns({ onPrint: () => undefined }).forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, []);
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('inventory-receipts', { visibility: defaultColumnVisibility, pinned: ['select', 'actions'] });

  const headerActions = React.useMemo(() => [
    <Button key="po" variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDERS)}>Đơn mua hàng</Button>,
    canEdit && <Button key="new" size="sm" className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW)}>Tạo phiếu nhập</Button>,
  ].filter(Boolean), [router, canEdit]);

  usePageHeader({ title: 'Danh sách phiếu nhập kho', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.DASHBOARD }, { label: 'Phiếu nhập kho', href: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS, isCurrent: true }], showBackButton: false, actions: headerActions });

  const handlePrintReceipt = React.useCallback(async (receipt: InventoryReceipt) => {
    const branch = receipt.branchSystemId ? findBranchById(receipt.branchSystemId) : undefined;
    const supplier = receipt.supplierSystemId ? findSupplierById(receipt.supplierSystemId) : undefined;
    const { storeInfo } = await fetchPrintData();
    const storeSettings = branch ? createStoreSettings(branch) : createStoreSettings(storeInfo);
    const data = convertStockInForPrint(receipt, { branch, supplier });
    print('stock-in', { data: mapStockInToPrintData(data, storeSettings), lineItems: mapStockInLineItems(data.items) });
    toast.info(`Đang in phiếu ${receipt.id}`);
  }, [findBranchById, findSupplierById, print]);

  const columns = React.useMemo(() => getColumns({ onPrint: handlePrintReceipt }), [handlePrintReceipt]);

  const handleRowClick = React.useCallback((r: InventoryReceipt) => router.push(ROUTES.PROCUREMENT.INVENTORY_RECEIPT_VIEW.replace(':systemId', r.systemId)), [router]);
  const selectedRows = React.useMemo(() => receipts.filter(r => rowSelection[r.systemId]), [receipts, rowSelection]);

  const handleBulkPrint = React.useCallback(() => { if (selectedRows.length === 0) return; setPendingPrintReceipts(selectedRows); setIsPrintDialogOpen(true); }, [selectedRows]);
  const handlePrintConfirm = React.useCallback(async (opts: SimplePrintOptionsResult) => {
    const { storeInfo } = await fetchPrintData();
    const list = pendingPrintReceipts.map(r => { const b = opts.branchSystemId ? findBranchById(opts.branchSystemId) : (r.branchSystemId ? findBranchById(r.branchSystemId) : undefined), s = r.supplierSystemId ? findSupplierById(r.supplierSystemId) : undefined, st = b ? createStoreSettings(b) : createStoreSettings(storeInfo), d = convertStockInForPrint(r, { branch: b, supplier: s }); return { data: mapStockInToPrintData(d, st), lineItems: mapStockInLineItems(d.items), paperSize: opts.paperSize }; });
    printMultiple('stock-in', list); toast.success(`Đã gửi in ${pendingPrintReceipts.length} phiếu`); setRowSelection({}); setPendingPrintReceipts([]);
  }, [pendingPrintReceipts, findBranchById, findSupplierById, printMultiple]);

  const bulkActions = [{ label: "In phiếu nhập", icon: Printer, onSelect: handleBulkPrint }];

  // Branch options from useAllBranches (always small dataset)
  const branchOptions = React.useMemo(() => branches.map(b => ({ value: b.systemId, label: b.name })).sort((a, b) => a.label.localeCompare(b.label)), [branches]);
  // Supplier options from useAllSuppliers
  const supplierOptions = React.useMemo(() => suppliers.map(s => ({ value: s.systemId, label: s.name })).sort((a, b) => a.label.localeCompare(b.label)), [suppliers]);

  // Mobile infinite scroll
  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedSearch, supplierFilter, branchFilter, dateRange]);
  React.useEffect(() => {
    if (!isMobile) return;
    const h = () => {
      if ((window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight * 0.8 && mobileLoadedCount < receipts.length)
        setMobileLoadedCount(p => Math.min(p + 20, receipts.length));
    };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileLoadedCount]);

  const displayData = isMobile ? receipts.slice(0, mobileLoadedCount) : receipts;
  const currentUserInfo = React.useMemo(() => ({ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }), [currentUser]);

  const MobileReceiptCard = ({ receipt }: { receipt: InventoryReceipt }) => {
    const totalQty = (receipt.items || []).reduce((s, i) => s + (Number(i.receivedQuantity) || 0), 0);
    return (
      <MobileCard onClick={() => handleRowClick(receipt)}>
        <MobileCardHeader className="items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Phiếu nhập kho</div>
            <div className="mt-0.5 text-sm font-semibold text-foreground truncate font-mono">{receipt.id}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold leading-none">{totalQty}</div>
            <div className="mt-1 text-xs text-muted-foreground">Tổng SL</div>
          </div>
        </MobileCardHeader>
        <MobileCardBody>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
            <div className="col-span-2">
              <dt className="text-xs text-muted-foreground">Nhà cung cấp</dt>
              <dd className="font-medium truncate">{receipt.supplierName || '—'}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Ngày nhập</dt>
              <dd className="font-medium">{formatDate(receipt.receivedDate)}</dd>
            </div>
            {receipt.purchaseOrderId && (
              <div>
                <dt className="text-xs text-muted-foreground">Đơn mua hàng</dt>
                <dd className="font-medium truncate font-mono">{receipt.purchaseOrderId}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-muted-foreground">Số mặt hàng</dt>
              <dd className="font-medium">{(receipt.items || []).length}</dd>
            </div>
            {receipt.receiverName && (
              <div>
                <dt className="text-xs text-muted-foreground">Người nhận</dt>
                <dd className="font-medium truncate">{receipt.receiverName}</dd>
              </div>
            )}
          </dl>
        </MobileCardBody>
      </MobileCard>
    );
  };

  return (
    <div className="space-y-4 flex flex-col h-full">
      {!isMobile && <PageToolbar leftActions={<>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button></>} />}

      <PageFilters searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm theo mã phiếu, NCC...">
        <Select value={supplierFilter} onValueChange={setSupplierFilter}><SelectTrigger className="h-9 w-full sm:w-50"><SelectValue placeholder="Nhà cung cấp" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả NCC</SelectItem>{supplierOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
        <Select value={branchFilter} onValueChange={setBranchFilter}><SelectTrigger className="h-9 w-full sm:w-50"><SelectValue placeholder="Chi nhánh" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branchOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
        <DataTableDateFilter value={dateRange} onChange={setDateRange} title="Ngày nhập" />
      </PageFilters>

      {isMobile ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {receipts.length === 0 && !isLoading ? <div className="p-8 text-center text-muted-foreground">Không tìm thấy phiếu</div>
              : displayData.map(r => <MobileReceiptCard key={r.systemId} receipt={r} />)}
          </div>
          {receipts.length > 0 && (
            <div className="py-6 text-center">
              {mobileLoadedCount < receipts.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải...</span></div>
                : receipts.length > 20 ? <p className="text-sm text-muted-foreground">Đã hiển thị {receipts.length} phiếu</p> : null}
            </div>
          )}
        </div>
      ) : (
        <ResponsiveDataTable columns={columns} data={receipts} renderMobileCard={r => <MobileReceiptCard receipt={r} />} onRowClick={handleRowClick}
          pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection}
          allSelectedRows={selectedRows} bulkActions={bulkActions} showBulkDeleteButton={false}
          expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} isLoading={isLoading} />
      )}

      <SimplePrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintReceipts.length} title="In phiếu nhập kho" />
      {/* ✅ Only render export dialog when opened to avoid loading pricing-policies API */}
      {exportDialogOpen && <InventoryReceiptExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={allReceipts} filteredData={allReceipts} currentPageData={receipts} selectedData={selectedRows}
        currentUser={currentUserInfo} />}
    </div>
  );
}
