'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Package, Calendar as CalendarIcon, Users, FileText, Printer, Download, Settings } from "lucide-react";

import { ROUTES } from '@/lib/router';
import { formatDate, formatDateCustom, parseDate } from '@/lib/date-utils';
import { useInventoryReceipts } from "./hooks/use-inventory-receipts";
import { useAllInventoryReceipts } from "./hooks/use-all-inventory-receipts";
import { useAllSuppliers, useSupplierFinder } from "../suppliers/hooks/use-all-suppliers";
import { usePageHeader } from "@/contexts/page-header-context";
import { useAllBranches, useBranchFinder } from "../settings/branches/hooks/use-all-branches";
import { useStoreInfoData } from "../settings/store-info/hooks/use-store-info";
import { usePrint } from "@/lib/use-print";
import { convertStockInForPrint, mapStockInToPrintData, mapStockInLineItems, createStoreSettings } from "@/lib/print/stock-in-print-helper";
import { useAuth } from "@/contexts/auth-context";
import { useColumnVisibility } from "@/hooks/use-column-visibility";
import { asSystemId } from "@/lib/id-types";
import { useMediaQuery } from "@/lib/use-media-query";
import type { ColumnDef } from "@/components/data-table/types";
import type { InventoryReceipt } from '@/lib/types/prisma-extended';

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { PageFilters } from "@/components/layout/page-filters";
import { PageToolbar } from "@/components/layout/page-toolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from "@/components/shared/simple-print-options-dialog";

const InventoryReceiptExportDialog = dynamic(() => import("./components/inventory-receipts-import-export-dialogs").then(mod => ({ default: mod.InventoryReceiptExportDialog })), { ssr: false });

const getColumns = (handlers: { onPrint: (r: InventoryReceipt) => void }): ColumnDef<InventoryReceipt>[] => [
  { id: "select", header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => <div className="flex items-center justify-center"><Checkbox checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false} onCheckedChange={(v) => onToggleAll?.(!!v)} /></div>, cell: ({ isSelected, onToggleSelect }) => <div className="flex items-center justify-center"><Checkbox checked={isSelected} onCheckedChange={onToggleSelect} /></div>, size: 48, meta: { displayName: "Chọn", sticky: "left" } },
  { id: 'id', accessorKey: 'id', header: 'Mã phiếu', cell: ({ row }) => <span className="font-medium text-primary">{row.id}</span>, meta: { displayName: 'Mã phiếu' }, size: 120 },
  { id: 'receivedDate', accessorKey: 'receivedDate', header: 'Ngày nhập', cell: ({ row }) => formatDateCustom(parseDate(row.receivedDate)!, 'dd/MM/yyyy HH:mm'), meta: { displayName: 'Ngày nhập' }, size: 150 },
  { id: 'supplierName', accessorKey: 'supplierName', header: 'Nhà cung cấp', cell: ({ row }) => row.supplierName, meta: { displayName: 'Nhà cung cấp' } },
  { id: 'purchaseOrderId', accessorKey: 'purchaseOrderId', header: 'Đơn mua hàng', cell: ({ row }) => row.purchaseOrderId, meta: { displayName: 'Đơn mua hàng' }, size: 140 },
  { id: 'totalQuantity', header: 'Tổng SL', cell: ({ row }) => <span className="font-medium">{row.items.reduce((s, i) => s + Number(i.receivedQuantity), 0)}</span>, meta: { displayName: 'Tổng SL' }, size: 100 },
  { id: 'receiverName', accessorKey: 'receiverName', header: 'Người nhận', cell: ({ row }) => row.receiverName, meta: { displayName: 'Người nhận' }, size: 150 },
  { id: 'notes', accessorKey: 'notes', header: 'Ghi chú', cell: ({ row }) => <span className="text-body-xs max-w-xs line-clamp-2">{row.notes || '-'}</span>, meta: { displayName: 'Ghi chú' }, size: 200 },
  { id: 'itemsCount', header: 'Số mặt hàng', cell: ({ row }) => <span className="font-medium">{row.items.length}</span>, meta: { displayName: 'Số mặt hàng' }, size: 100 },
  { id: 'totalValue', header: 'Tổng giá trị', cell: ({ row }) => <span className="font-semibold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.items.reduce((s, i) => s + i.receivedQuantity * i.unitPrice, 0))}</span>, meta: { displayName: 'Tổng giá trị' }, size: 150 },
  { id: 'actions', header: 'Hành động', cell: ({ row }) => <Button variant="ghost" size="sm" className="h-8" onClick={(e) => { e.stopPropagation(); handlers.onPrint(row); }}><Printer className="h-4 w-4 mr-1" />In</Button>, size: 100, meta: { displayName: 'Hành động', sticky: 'right' } },
];

export function InventoryReceiptsPage() {
  // Search & filter state
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
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
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();
  const { employee: currentUser } = useAuth();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
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
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('inventory-receipts', defaultColumnVisibility);

  const headerActions = React.useMemo(() => [
    <Button key="po" variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDERS)}>Đơn mua hàng</Button>,
    <Button key="new" size="sm" className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW)}>Tạo phiếu nhập</Button>,
  ], [router]);

  usePageHeader({ title: 'Danh sách phiếu nhập kho', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.DASHBOARD }, { label: 'Phiếu nhập kho', href: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS, isCurrent: true }], showBackButton: false, actions: headerActions });

  const handlePrintReceipt = React.useCallback((receipt: InventoryReceipt) => {
    const branch = receipt.branchSystemId ? findBranchById(receipt.branchSystemId) : undefined;
    const supplier = receipt.supplierSystemId ? findSupplierById(receipt.supplierSystemId) : undefined;
    const storeSettings = branch ? createStoreSettings(branch) : createStoreSettings(storeInfo);
    const data = convertStockInForPrint(receipt, { branch, supplier });
    print('stock-in', { data: mapStockInToPrintData(data, storeSettings), lineItems: mapStockInLineItems(data.items) });
    toast.info(`Đang in phiếu ${receipt.id}`);
  }, [findBranchById, findSupplierById, storeInfo, print]);

  const columns = React.useMemo(() => getColumns({ onPrint: handlePrintReceipt }), [handlePrintReceipt]);

  // Initialize column order once
  React.useEffect(() => {
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClick = React.useCallback((r: InventoryReceipt) => router.push(ROUTES.PROCUREMENT.INVENTORY_RECEIPT_VIEW.replace(':systemId', r.systemId)), [router]);
  const selectedRows = React.useMemo(() => receipts.filter(r => rowSelection[r.systemId]), [receipts, rowSelection]);

  const handleBulkPrint = React.useCallback(() => { if (selectedRows.length === 0) return; setPendingPrintReceipts(selectedRows); setIsPrintDialogOpen(true); }, [selectedRows]);
  const handlePrintConfirm = React.useCallback((opts: SimplePrintOptionsResult) => {
    const list = pendingPrintReceipts.map(r => { const b = opts.branchSystemId ? findBranchById(opts.branchSystemId) : (r.branchSystemId ? findBranchById(r.branchSystemId) : undefined), s = r.supplierSystemId ? findSupplierById(r.supplierSystemId) : undefined, st = b ? createStoreSettings(b) : createStoreSettings(storeInfo), d = convertStockInForPrint(r, { branch: b, supplier: s }); return { data: mapStockInToPrintData(d, st), lineItems: mapStockInLineItems(d.items), paperSize: opts.paperSize }; });
    printMultiple('stock-in', list); toast.success(`Đã gửi in ${pendingPrintReceipts.length} phiếu`); setRowSelection({}); setPendingPrintReceipts([]);
  }, [pendingPrintReceipts, findBranchById, findSupplierById, storeInfo, printMultiple]);

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

  const MobileReceiptCard = ({ receipt }: { receipt: InventoryReceipt }) => (
    <Card className="mb-4 cursor-pointer hover:border-primary" onClick={() => handleRowClick(receipt)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3"><div className="p-2 rounded-full bg-green-100 text-green-600"><Package className="h-6 w-6" /></div>
            <div className="flex-1"><div className="font-semibold text-body-sm mb-1">{receipt.id}</div><div className="text-body-sm text-muted-foreground space-y-1"><div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /><span>{formatDate(receipt.receivedDate)}</span></div><div className="flex items-center gap-1"><Users className="h-3 w-3" /><span>{receipt.supplierName || '-'}</span></div>{receipt.purchaseOrderId && <div className="flex items-center gap-1"><FileText className="h-3 w-3" /><span>Đơn: {receipt.purchaseOrderId}</span></div>}</div></div>
          </div>
          <div className="text-right"><div className="font-semibold text-body-sm">{(receipt.items || []).reduce((s, i) => s + (Number(i.receivedQuantity) || 0), 0)} SP</div></div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 flex flex-col h-full">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button><Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button></>} />}

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
              {mobileLoadedCount < receipts.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-body-sm">Đang tải...</span></div>
                : receipts.length > 20 ? <p className="text-body-sm text-muted-foreground">Đã hiển thị {receipts.length} phiếu</p> : null}
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
      <InventoryReceiptExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={allReceipts} filteredData={allReceipts} currentPageData={receipts} selectedData={selectedRows}
        currentUser={currentUserInfo} />
    </div>
  );
}
