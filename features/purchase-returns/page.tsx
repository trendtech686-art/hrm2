'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Plus, Printer, Download } from "lucide-react";
import { ROUTES } from '../../lib/router';
import { isDateAfter, isDateBefore, parseDate } from '../../lib/date-utils';
import { useAllPurchaseReturns } from "./hooks/use-all-purchase-returns";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { useStoreInfoData } from "../settings/store-info/hooks/use-store-info";
import { usePageHeader } from "../../contexts/page-header-context";
import { usePrint } from "../../lib/use-print";
import { convertSupplierReturnForPrint, mapSupplierReturnToPrintData, mapSupplierReturnLineItems, createStoreSettings } from "../../lib/print/supplier-return-print-helper";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter";
import { PageFilters } from "../../components/layout/page-filters";
import { PageToolbar } from "../../components/layout/page-toolbar";
import { Card, CardContent } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useMediaQuery } from "../../lib/use-media-query";
import { useFuseFilter } from "../../hooks/use-fuse-search";
import type { PurchaseReturn } from '@/lib/types/prisma-extended';
import { asSystemId } from '../../lib/id-types';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from "../../components/shared/simple-print-options-dialog";
import { useAuth } from "../../contexts/auth-context";
import { useColumnVisibility } from '../../hooks/use-column-visibility';
import { getColumns } from './columns';
import { MobileReturnCard } from './components/mobile-return-card';

const PurchaseReturnExportDialog = dynamic(() => import("./components/purchase-returns-import-export-dialogs").then(mod => ({ default: mod.PurchaseReturnExportDialog })), { ssr: false });

const formatCurrency = (value?: number) => typeof value === 'number' && !isNaN(value) ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value) : '0 ₫';

export function PurchaseReturnsPage() {
  const { data: purchaseReturns } = useAllPurchaseReturns();
  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();
  const { employee: currentUser } = useAuth();
  const router = useRouter(), isMobile = useMediaQuery("(max-width: 768px)");

  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false), [pendingPrintReturns, setPendingPrintReturns] = React.useState<PurchaseReturn[]>([]);
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({}), [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState(''), [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [supplierFilter, setSupplierFilter] = React.useState('all'), [branchFilter, setBranchFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]), [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({}), [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  const defaultColumnVisibility = React.useMemo(() => {
    const initial: Record<string, boolean> = {};
    getColumns(() => undefined).forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('purchase-returns', defaultColumnVisibility);

  const handleRowPrint = React.useCallback((entry: PurchaseReturn) => {
    const branch = branches.find(b => b.systemId === entry.branchSystemId);
    print('supplier-return', { data: mapSupplierReturnToPrintData(convertSupplierReturnForPrint(entry, { branch }), createStoreSettings(storeInfo)), lineItems: mapSupplierReturnLineItems(convertSupplierReturnForPrint(entry, { branch }).items) });
    toast.success('Đã gửi lệnh in', { description: `Đang in phiếu trả ${entry.id}.` });
  }, [branches, storeInfo, print]);

  const headerActions = React.useMemo(() => [
    <Button key="create" size="sm" className="h-9" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_RETURN_NEW)}><Plus className="mr-2 h-4 w-4" />Tạo phiếu trả hàng</Button>
  ], [router]);

  usePageHeader({
    title: 'Danh sách phiếu trả NCC',
    actions: headerActions,
    breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Trả hàng nhập', href: ROUTES.PROCUREMENT.PURCHASE_RETURNS, isCurrent: true }],
    showBackButton: false
  });

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const columns = React.useMemo(() => getColumns(handleRowPrint), [handleRowPrint]);

  React.useEffect(() => {
    const init: Record<string, boolean> = {};
    columns.forEach(c => { init[c.id!] = true; });
    setColumnVisibility(init);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fuseOptions = React.useMemo(() => ({ keys: ["id", "supplierName", "creatorName", "purchaseOrderId", "branchName"], threshold: 0.3, ignoreLocation: true }), []);
  const searchedData = useFuseFilter(purchaseReturns, debouncedGlobalFilter, fuseOptions);

  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedGlobalFilter, supplierFilter, branchFilter, dateRange]);

  const filteredData = React.useMemo(() => {
    let data = purchaseReturns;
    if (supplierFilter !== 'all') data = data.filter(pr => pr.supplierSystemId === supplierFilter);
    if (branchFilter !== 'all') data = data.filter(pr => pr.branchSystemId === branchFilter);
    if (dateRange && (dateRange[0] || dateRange[1])) {
      data = data.filter(pr => {
        const returnDate = parseDate(pr.returnDate);
        if (!returnDate) return false;
        const fromDate = dateRange[0] ? new Date(dateRange[0]) : null, toDate = dateRange[1] ? new Date(dateRange[1]) : null;
        return !(fromDate && isDateBefore(returnDate, fromDate)) && !(toDate && isDateAfter(returnDate, toDate));
      });
    }
    if (debouncedGlobalFilter) { const ids = new Set(searchedData.map(r => r.systemId)); return data.filter(d => ids.has(d.systemId)); }
    return data;
  }, [purchaseReturns, supplierFilter, branchFilter, dateRange, debouncedGlobalFilter, searchedData]);

  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const { scrollY, innerHeight } = window, { scrollHeight } = document.documentElement;
      if (scrollY + innerHeight >= scrollHeight * 0.8 && mobileLoadedCount < filteredData.length) setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileLoadedCount]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) sorted.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sorting.id] as string | number | null | undefined, bVal = (b as Record<string, unknown>)[sorting.id] as string | number | null | undefined;
      if (sorting.id === 'createdAt' || sorting.id === 'returnDate') {
        const aTime = aVal ? new Date(aVal as string | number | Date).getTime() : 0, bTime = bVal ? new Date(bVal as string | number | Date).getTime() : 0;
        return sorting.desc ? bTime - aTime : aTime - bTime;
      }
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      return aVal < bVal ? (sorting.desc ? 1 : -1) : (sorting.desc ? -1 : 1);
    });
    return sorted;
  }, [filteredData, sorting]);

  const handleRowClick = (row: PurchaseReturn) => router.push(`${ROUTES.PROCUREMENT.PURCHASE_RETURNS}/${row.systemId}`);
  const selectedRows = React.useMemo(() => filteredData.filter(pr => rowSelection[pr.systemId]), [filteredData, rowSelection]);

  const handleBulkPrint = React.useCallback(() => {
    if (selectedRows.length === 0) { toast.error('Chưa chọn phiếu trả', { description: 'Vui lòng chọn ít nhất một phiếu trước khi in.' }); return; }
    setPendingPrintReturns(selectedRows); setIsPrintDialogOpen(true);
  }, [selectedRows]);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const { branchSystemId, paperSize } = options;
    const printOptionsList = pendingPrintReturns.map(entry => {
      const branch = branchSystemId ? branches.find(b => b.systemId === branchSystemId) : branches.find(b => b.systemId === entry.branchSystemId);
      const forPrint = convertSupplierReturnForPrint(entry, { branch });
      return { data: mapSupplierReturnToPrintData(forPrint, branch ? createStoreSettings(branch) : createStoreSettings(storeInfo)), lineItems: mapSupplierReturnLineItems(forPrint.items), paperSize };
    });
    printMultiple('supplier-return', printOptionsList);
    toast.success('Đã gửi lệnh in cho phiếu trả', { description: pendingPrintReturns.map(r => r.id).join(', ') });
    setRowSelection({}); setPendingPrintReturns([]);
  }, [pendingPrintReturns, branches, storeInfo, printMultiple]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);

  const { totalReturnValue, totalRefundAmount, totalQuantity } = React.useMemo(() => ({
    totalReturnValue: filteredData.reduce((sum, pr) => sum + pr.totalReturnValue, 0),
    totalRefundAmount: filteredData.reduce((sum, pr) => sum + pr.refundAmount, 0),
    totalQuantity: filteredData.reduce((sum, pr) => sum + pr.items.reduce((s, i) => s + i.returnQuantity, 0), 0)
  }), [filteredData]);

  const supplierOptions = React.useMemo(() => {
    const map = new Map<string, string>();
    purchaseReturns.forEach(pr => { if (!map.has(pr.supplierSystemId)) map.set(pr.supplierSystemId, pr.supplierName); });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [purchaseReturns]);

  return (
    <div className="space-y-4 flex flex-col h-full">
      {!isMobile && <PageToolbar leftActions={<Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button>} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng phiếu trả</p><p className="text-h2 font-semibold">{filteredData.length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng SL trả</p><p className="text-h2 font-semibold text-orange-600">{totalQuantity}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng giá trị hàng trả</p><p className="text-h2 font-semibold text-orange-600">{formatCurrency(totalReturnValue)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-body-sm text-muted-foreground">Tổng tiền đã hoàn</p><p className="text-h2 font-semibold text-green-600">{formatCurrency(totalRefundAmount)}</p></CardContent></Card>
      </div>

      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm theo mã phiếu, NCC, đơn hàng...">
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Chi nhánh" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="h-9 w-full sm:w-[200px]"><SelectValue placeholder="Nhà cung cấp" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tất cả NCC</SelectItem>{supplierOptions.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
        </Select>
        <DataTableDateFilter value={dateRange} onChange={setDateRange} title="Ngày trả hàng" />
      </PageFilters>

      {isMobile ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {sortedData.length === 0 ? <Card><CardContent className="p-8 text-center text-muted-foreground">Không tìm thấy phiếu trả hàng nào.</CardContent></Card>
              : sortedData.slice(0, mobileLoadedCount).map(pr => <MobileReturnCard key={pr.systemId} purchaseReturn={pr} onClick={handleRowClick} />)}
          </div>
          {sortedData.length > 0 && (
            <div className="py-6 text-center">
              {mobileLoadedCount < sortedData.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải thêm...</span></div>
                : sortedData.length > 20 && <p className="text-sm text-muted-foreground">Đã hiển thị tất cả {sortedData.length} phiếu trả hàng</p>}
            </div>
          )}
        </div>
      ) : (
        <ResponsiveDataTable columns={columns} data={paginatedData} renderMobileCard={row => <MobileReturnCard purchaseReturn={row} onClick={handleRowClick} />} onRowClick={handleRowClick}
          pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection}
          allSelectedRows={selectedRows} bulkActions={[{ label: "In phiếu trả", icon: Printer, onSelect: handleBulkPrint }]} showBulkDeleteButton={false}
          expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
      )}

      <SimplePrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintReturns.length} title="In phiếu trả NCC" />
      <PurchaseReturnExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={purchaseReturns} filteredData={filteredData} currentPageData={paginatedData} selectedData={selectedRows}
        currentUser={{ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }} />
    </div>
  );
}
