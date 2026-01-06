'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { toast } from "sonner";
import { Package, Calendar as CalendarIcon, Users, FileText, Printer, Download } from "lucide-react";

import { ROUTES } from '@/lib/router';
import { formatDate, formatDateCustom, parseDate, isDateAfter, isDateBefore, getDaysDiff } from '@/lib/date-utils';
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
import { useFuseFilter } from "@/hooks/use-fuse-search";
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
  const { data: receipts } = useAllInventoryReceipts();
  const { data: suppliers } = useAllSuppliers();
  const { findById: findSupplierById } = useSupplierFinder();
  const { data: branches } = useAllBranches();
  const { findById: findBranchById } = useBranchFinder();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();
  const { employee: currentUser } = useAuth();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [supplierFilter, setSupplierFilter] = React.useState('all');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('inventory-receipts', {});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintReceipts, setPendingPrintReceipts] = React.useState<InventoryReceipt[]>([]);

  const headerActions = React.useMemo(() => [
    <Button key="po" variant="outline" size="sm" className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDERS)}>Đơn mua hàng</Button>,
    <Button key="new" size="sm" className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW)}>Tạo phiếu nhập</Button>,
  ], [router]);

  usePageHeader({ title: 'Danh sách phiếu nhập kho', breadcrumb: [{ label: 'Trang chủ', href: ROUTES.DASHBOARD }, { label: 'Phiếu nhập kho', href: ROUTES.PROCUREMENT.INVENTORY_RECEIPTS, isCurrent: true }], showBackButton: false, actions: headerActions });

  const filteredDataBase = React.useMemo(() => [...receipts].sort((a, b) => getDaysDiff(parseDate(b.receivedDate), parseDate(a.receivedDate))), [receipts]);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const handlePrintReceipt = React.useCallback((receipt: InventoryReceipt) => {
    const branch = receipt.branchSystemId ? findBranchById(receipt.branchSystemId) : undefined;
    const supplier = receipt.supplierSystemId ? findSupplierById(receipt.supplierSystemId) : undefined;
    const storeSettings = branch ? createStoreSettings(branch) : createStoreSettings(storeInfo);
    const data = convertStockInForPrint(receipt, { branch, supplier });
    print('stock-in', { data: mapStockInToPrintData(data, storeSettings), lineItems: mapStockInLineItems(data.items) });
    toast.info(`Đang in phiếu ${receipt.id}`);
  }, [findBranchById, findSupplierById, storeInfo, print]);

  const columns = React.useMemo(() => getColumns({ onPrint: handlePrintReceipt }), [handlePrintReceipt]);

  React.useEffect(() => {
    if (!columns.length) return;
    if (Object.keys(columnVisibility).length === 0) { const v: Record<string, boolean> = {}; columns.forEach(c => { if (c.id) v[c.id] = true; }); setColumnVisibility(v); }
    setColumnOrder(p => p.length ? p : columns.map(c => c.id).filter(Boolean) as string[]);
  }, [columns, columnVisibility, setColumnVisibility]);

  const fuseOptions = React.useMemo(() => ({ keys: ["id", "supplierName", "receiverName", "purchaseOrderId"], threshold: 0.3, ignoreLocation: true }), []);
  const searchedReceipts = useFuseFilter(filteredDataBase, debouncedGlobalFilter, fuseOptions);

  const filteredData = React.useMemo(() => {
    let d = filteredDataBase;
    if (supplierFilter !== 'all') d = d.filter(v => v.supplierSystemId === supplierFilter);
    if (branchFilter !== 'all') d = d.filter(v => v.branchSystemId === branchFilter);
    if (dateRange?.[0] || dateRange?.[1]) d = d.filter(v => { const dt = parseDate(v.receivedDate); if (!dt) return false; const from = dateRange[0] ? new Date(dateRange[0]) : null, to = dateRange[1] ? new Date(dateRange[1]) : null; return !(from && isDateBefore(dt, from)) && !(to && isDateAfter(dt, to)); });
    if (debouncedGlobalFilter) { const ids = new Set(searchedReceipts.map(r => r.systemId)); d = d.filter(v => ids.has(v.systemId)); }
    return d;
  }, [filteredDataBase, supplierFilter, branchFilter, dateRange, debouncedGlobalFilter, searchedReceipts]);

  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, supplierFilter, branchFilter, dateRange]);
  React.useEffect(() => { if (!isMobile) return; const h = () => { if ((window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight * 0.8 && mobileLoadedCount < filteredData.length) setMobileLoadedCount(p => Math.min(p + 20, filteredData.length)); }; window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, filteredData]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting?.id) sorted.sort((a, b) => { const aV = a[sorting.id as keyof InventoryReceipt], bV = b[sorting.id as keyof InventoryReceipt]; if (sorting.id === 'createdAt' || sorting.id === 'receivedDate') { const aT = aV ? new Date(aV as string).getTime() : 0, bT = bV ? new Date(bV as string).getTime() : 0; return sorting.desc ? bT - aT : aT - bT; } return aV === bV ? 0 : aV < bV ? (sorting.desc ? 1 : -1) : (sorting.desc ? -1 : 1); });
    return sorted;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const handleRowClick = React.useCallback((r: InventoryReceipt) => router.push(ROUTES.PROCUREMENT.INVENTORY_RECEIPT_VIEW.replace(':systemId', r.systemId)), [router]);
  const selectedRows = React.useMemo(() => sortedData.filter(r => rowSelection[r.systemId]), [sortedData, rowSelection]);

  const handleBulkPrint = React.useCallback(() => { if (selectedRows.length === 0) return; setPendingPrintReceipts(selectedRows); setIsPrintDialogOpen(true); }, [selectedRows]);
  const handlePrintConfirm = React.useCallback((opts: SimplePrintOptionsResult) => {
    const list = pendingPrintReceipts.map(r => { const b = opts.branchSystemId ? findBranchById(opts.branchSystemId) : (r.branchSystemId ? findBranchById(r.branchSystemId) : undefined), s = r.supplierSystemId ? findSupplierById(r.supplierSystemId) : undefined, st = b ? createStoreSettings(b) : createStoreSettings(storeInfo), d = convertStockInForPrint(r, { branch: b, supplier: s }); return { data: mapStockInToPrintData(d, st), lineItems: mapStockInLineItems(d.items), paperSize: opts.paperSize }; });
    printMultiple('stock-in', list); toast.success(`Đã gửi in ${pendingPrintReceipts.length} phiếu`); setRowSelection({}); setPendingPrintReceipts([]);
  }, [pendingPrintReceipts, findBranchById, findSupplierById, storeInfo, printMultiple]);

  const bulkActions = [{ label: "In phiếu nhập", icon: Printer, onSelect: handleBulkPrint }];
  const receiptStats = React.useMemo(() => ({ totalReceipts: filteredData.length, totalQuantity: filteredData.reduce((s, r) => s + r.items.reduce((is, i) => is + i.receivedQuantity, 0), 0) }), [filteredData]);

  const supplierOptions = React.useMemo(() => { const m = new Map<string, string>(); filteredDataBase.forEach(r => { if (r.supplierSystemId) m.set(r.supplierSystemId, r.supplierName); }); suppliers.forEach(s => { if (filteredDataBase.some(r => r.supplierSystemId === s.systemId)) m.set(s.systemId, s.name); }); return Array.from(m.entries()).map(([v, l]) => ({ value: v, label: l })).sort((a, b) => a.label.localeCompare(b.label)); }, [filteredDataBase, suppliers]);
  const branchOptions = React.useMemo(() => { const m = new Map<string, string>(); filteredDataBase.forEach(r => { if (r.branchSystemId) m.set(r.branchSystemId, r.branchName || branches.find(b => b.systemId === r.branchSystemId)?.name || 'Chưa gắn'); }); return Array.from(m.entries()).map(([v, l]) => ({ value: v, label: l })).sort((a, b) => a.label.localeCompare(b.label)); }, [filteredDataBase, branches]);

  const MobileReceiptCard = ({ receipt }: { receipt: InventoryReceipt }) => (
    <Card className="mb-4 cursor-pointer hover:border-primary" onClick={() => handleRowClick(receipt)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3"><div className="p-2 rounded-full bg-green-100 text-green-600"><Package className="h-6 w-6" /></div>
            <div className="flex-1"><div className="font-semibold text-body-sm mb-1">{receipt.id}</div><div className="text-body-sm text-muted-foreground space-y-1"><div className="flex items-center gap-1"><CalendarIcon className="h-3 w-3" /><span>{formatDate(receipt.receivedDate)}</span></div><div className="flex items-center gap-1"><Users className="h-3 w-3" /><span>{receipt.supplierName}</span></div>{receipt.purchaseOrderId && <div className="flex items-center gap-1"><FileText className="h-3 w-3" /><span>Đơn: {receipt.purchaseOrderId}</span></div>}</div></div>
          </div>
          <div className="text-right"><div className="font-semibold text-body-sm">{receipt.items.reduce((s, i) => s + i.receivedQuantity, 0)} SP</div></div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 flex flex-col h-full">
      {!isMobile && <PageToolbar leftActions={<Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button>} />}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng phiếu nhập</p><p className="text-h3 font-semibold text-green-600">{receiptStats.totalReceipts}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng số lượng nhập</p><p className="text-h3 font-semibold text-blue-600">{receiptStats.totalQuantity} SP</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Đang hiển thị</p><p className="text-h3 font-semibold">{filteredData.length} / {receipts.length}</p></CardContent></Card>
      </div>
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã phiếu, NCC...">
        <Select value={supplierFilter} onValueChange={setSupplierFilter}><SelectTrigger className="h-9 w-full sm:w-[200px]"><SelectValue placeholder="Nhà cung cấp" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả NCC</SelectItem>{supplierOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
        <Select value={branchFilter} onValueChange={setBranchFilter}><SelectTrigger className="h-9 w-full sm:w-[200px]"><SelectValue placeholder="Chi nhánh" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branchOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>
        <DataTableDateFilter value={dateRange} onChange={setDateRange} title="Ngày nhập" />
      </PageFilters>
      {isMobile ? (
        <div className="space-y-4"><div className="space-y-2">{sortedData.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">Không tìm thấy phiếu</CardContent></Card> : sortedData.slice(0, mobileLoadedCount).map(r => <MobileReceiptCard key={r.systemId} receipt={r} />)}</div>{sortedData.length > 0 && <div className="py-6 text-center">{mobileLoadedCount < sortedData.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-body-sm">Đang tải...</span></div> : sortedData.length > 20 ? <p className="text-body-sm text-muted-foreground">Đã hiển thị {sortedData.length} phiếu</p> : null}</div>}</div>
      ) : (
        <ResponsiveDataTable columns={columns} data={paginatedData} renderMobileCard={r => <MobileReceiptCard receipt={r} />} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={selectedRows} bulkActions={bulkActions} showBulkDeleteButton={false} expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} />
      )}
      <SimplePrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintReceipts.length} title="In phiếu nhập kho" />
      <InventoryReceiptExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={receipts} filteredData={filteredData} currentPageData={paginatedData} selectedData={selectedRows} currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
