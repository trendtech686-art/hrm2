'use client'

import * as React from "react";
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Plus, Printer, Download, Settings, RotateCcw, Package, Banknote, FileText } from "lucide-react";
import { ROUTES } from '../../lib/router';
import { usePurchaseReturns, usePurchaseReturnStats } from "./hooks/use-purchase-returns";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { useMediaQuery } from "../../lib/use-media-query";
import type { PurchaseReturn } from '@/lib/types/prisma-extended';
import { asSystemId } from '../../lib/id-types';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from "../../components/shared/simple-print-options-dialog";
import { useAuth } from "../../contexts/auth-context";
import { useColumnVisibility } from '../../hooks/use-column-visibility';
import { getColumns } from './columns';
import { MobileReturnCard } from './components/mobile-return-card';
import { StatsCard, StatsCardGrid } from "@/components/shared/stats-card";
import { formatCurrency, formatNumber } from "@/lib/format-utils";
import type { PurchaseReturnStats } from './api/purchase-returns-api';

const PurchaseReturnExportDialog = dynamic(() => import("./components/purchase-returns-import-export-dialogs").then(mod => ({ default: mod.PurchaseReturnExportDialog })), { ssr: false });

export interface PurchaseReturnsPageProps {
  initialStats?: PurchaseReturnStats;
}

export function PurchaseReturnsPage({ initialStats }: PurchaseReturnsPageProps = {}) {
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
  const { data: queryData, isLoading } = usePurchaseReturns({
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

  const purchaseReturns = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const totalRows = queryData?.pagination?.total ?? 0;
  const pageCount = queryData?.pagination?.totalPages ?? 1;

  // Stats from API
  const { data: statsData } = usePurchaseReturnStats();
  const stats = statsData ?? initialStats;

  // Lazy-load all data only for export
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const { data: allPurchaseReturns } = useAllPurchaseReturns({ enabled: exportDialogOpen });

  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();
  const { print, printMultiple } = usePrint();
  const { employee: currentUser } = useAuth();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintReturns, setPendingPrintReturns] = React.useState<PurchaseReturn[]>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Column visibility (persisted to DB)
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

  const columns = React.useMemo(() => getColumns(handleRowPrint), [handleRowPrint]);

  // Initialize column order once
  React.useEffect(() => {
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClick = (row: PurchaseReturn) => router.push(`${ROUTES.PROCUREMENT.PURCHASE_RETURNS}/${row.systemId}`);
  const selectedRows = React.useMemo(() => purchaseReturns.filter(pr => rowSelection[pr.systemId]), [purchaseReturns, rowSelection]);

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

  // Mobile infinite scroll
  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedSearch, supplierFilter, branchFilter, dateRange]);
  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const { scrollY, innerHeight } = window, { scrollHeight } = document.documentElement;
      if (scrollY + innerHeight >= scrollHeight * 0.8 && mobileLoadedCount < purchaseReturns.length) setMobileLoadedCount(prev => Math.min(prev + 20, purchaseReturns.length));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, mobileLoadedCount]);

  const displayData = isMobile ? purchaseReturns.slice(0, mobileLoadedCount) : purchaseReturns;
  const currentUserInfo = React.useMemo(() => ({ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }), [currentUser]);

  return (
    <div className="space-y-4 flex flex-col h-full">
      {!isMobile && <PageToolbar leftActions={<><Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button><Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button></>} />}

      <StatsCardGrid columns={4}>
        <StatsCard title="Tổng phiếu trả" value={stats?.total ?? 0} icon={FileText} formatValue={(v) => formatNumber(Number(v))} />
        <StatsCard title="Tổng giá trị trả" value={stats?.totalValue ?? 0} icon={Package} formatValue={(v) => formatCurrency(Number(v))} variant="warning" />
        <StatsCard title="Đã hoàn tiền" value={stats?.totalRefund ?? 0} icon={Banknote} formatValue={(v) => formatCurrency(Number(v))} variant="success" />
        <StatsCard title="Chờ xử lý" value={stats?.byStatus?.find(s => s.status === 'PENDING')?.count ?? 0} icon={RotateCcw} formatValue={(v) => formatNumber(Number(v))} variant={Number(stats?.byStatus?.find(s => s.status === 'PENDING')?.count ?? 0) > 0 ? 'danger' : 'default'} />
      </StatsCardGrid>

      <PageFilters searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm theo mã phiếu, NCC, đơn hàng...">
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="h-9 w-full sm:w-45"><SelectValue placeholder="Chi nhánh" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="h-9 w-full sm:w-50"><SelectValue placeholder="Nhà cung cấp" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tất cả NCC</SelectItem></SelectContent>
        </Select>
        <DataTableDateFilter value={dateRange} onChange={setDateRange} title="Ngày trả hàng" />
      </PageFilters>

      {isMobile ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {purchaseReturns.length === 0 && !isLoading ? <div className="p-8 text-center text-muted-foreground">Không tìm thấy phiếu trả hàng nào.</div>
              : displayData.map(pr => <MobileReturnCard key={pr.systemId} purchaseReturn={pr} onClick={handleRowClick} />)}
          </div>
          {purchaseReturns.length > 0 && (
            <div className="py-6 text-center">
              {mobileLoadedCount < purchaseReturns.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải thêm...</span></div>
                : purchaseReturns.length > 20 && <p className="text-sm text-muted-foreground">Đã hiển thị tất cả {purchaseReturns.length} phiếu trả hàng</p>}
            </div>
          )}
        </div>
      ) : (
        <ResponsiveDataTable columns={columns} data={purchaseReturns} renderMobileCard={row => <MobileReturnCard purchaseReturn={row} onClick={handleRowClick} />} onRowClick={handleRowClick}
          pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection}
          allSelectedRows={selectedRows} bulkActions={[{ label: "In phiếu trả", icon: Printer, onSelect: handleBulkPrint }]} showBulkDeleteButton={false}
          expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} isLoading={isLoading} />
      )}

      <SimplePrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintReturns.length} title="In phiếu trả NCC" />
      <PurchaseReturnExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={allPurchaseReturns} filteredData={allPurchaseReturns} currentPageData={purchaseReturns} selectedData={selectedRows}
        currentUser={currentUserInfo} />
    </div>
  );
}
