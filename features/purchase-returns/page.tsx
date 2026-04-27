'use client'

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import { Plus, Printer, Download, Settings } from "lucide-react";
import { ROUTES } from '../../lib/router';
import { cn } from '@/lib/utils';
import { usePurchaseReturns, usePurchaseReturnStats } from "./hooks/use-purchase-returns";
import { useAllPurchaseReturns } from "./hooks/use-all-purchase-returns";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { fetchPrintData } from '@/lib/lazy-print-data';
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
import { useColumnLayout } from '../../hooks/use-column-visibility';
import { getColumns } from './columns';
import { MobileReturnCard } from './components/mobile-return-card';
import { StatsBar } from "@/components/shared/stats-bar";
import { formatCurrency, formatNumber } from "@/lib/format-utils";
import type { PurchaseReturnStats } from './api/purchase-returns-api';
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '../../components/shared/advanced-filter-panel';
import { useFilterPresets } from '../../hooks/use-filter-presets';

const PurchaseReturnExportDialog = dynamic(() => import("./components/purchase-returns-import-export-dialogs").then(mod => ({ default: mod.PurchaseReturnExportDialog })), { ssr: false });

export interface PurchaseReturnsPageProps {
  initialStats?: PurchaseReturnStats;
}

export function PurchaseReturnsPage({ initialStats }: PurchaseReturnsPageProps = {}) {
  // Search & filter state
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [dateRange, setDateRange] = useState<[string | undefined, string | undefined] | undefined>();

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(t);
  }, [search, setPagination]);

  // Reset page when filters change
  useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [supplierFilter, branchFilter, dateRange, setPagination]);

  // Server-side paginated query
  const { data: queryData, isLoading, isFetching } = usePurchaseReturns({
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

  const purchaseReturns = useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const totalRows = queryData?.pagination?.total ?? 0;
  const pageCount = queryData?.pagination?.totalPages ?? 1;

  // Stats from API - use initialData from server to prevent duplicate fetch
  const { data: stats } = usePurchaseReturnStats({ initialData: initialStats });

  // Lazy-load all data only for export
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { data: allPurchaseReturns } = useAllPurchaseReturns({ enabled: exportDialogOpen });

  const { data: branches } = useAllBranches();

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('purchase-returns');
  const filterConfigs: FilterConfig[] = useMemo(() => [
    { id: 'branch', label: 'Chi nhánh', type: 'select', options: branches.map(b => ({ value: b.systemId, label: b.name })) },
    { id: 'supplier', label: 'Nhà cung cấp', type: 'select', options: [] },
    { id: 'dateRange', label: 'Ngày trả hàng', type: 'date-range' },
  ], [branches]);
  const panelValues = useMemo(() => ({
    branch: branchFilter !== 'all' ? branchFilter : null,
    supplier: supplierFilter !== 'all' ? supplierFilter : null,
    dateRange: dateRange ? { from: dateRange[0], to: dateRange[1] } : null,
  }), [branchFilter, supplierFilter, dateRange]);
  const handlePanelApply = useCallback((v: Record<string, unknown>) => {
    setBranchFilter((v.branch as string) || 'all');
    setSupplierFilter((v.supplier as string) || 'all');
    const dr = v.dateRange as { from?: string; to?: string } | null;
    setDateRange(dr ? [dr.from, dr.to] : undefined);
  }, []);

  // ⚡ OPTIMIZED: storeInfo lazy loaded in print handlers
  const { print, printMultiple } = usePrint();
  const {  employee: currentUser, can } = useAuth();
  const canCreate = can('create_purchase_returns');
  const _canEdit = can('edit_purchase_returns');
  const _canEditSettings = can('edit_settings');
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [pendingPrintReturns, setPendingPrintReturns] = useState<PurchaseReturn[]>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Column visibility (persisted to DB)
  const defaultColumnVisibility = useMemo(() => {
    const initial: Record<string, boolean> = {};
    getColumns(() => undefined).forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, []);
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('purchase-returns', { visibility: defaultColumnVisibility, pinned: ['select', 'actions'] });

  const handleRowPrint = useCallback(async (entry: PurchaseReturn) => {
    const branch = branches.find(b => b.systemId === entry.branchSystemId);
    const { storeInfo } = await fetchPrintData();
    print('supplier-return', { data: mapSupplierReturnToPrintData(convertSupplierReturnForPrint(entry, { branch }), createStoreSettings(storeInfo)), lineItems: mapSupplierReturnLineItems(convertSupplierReturnForPrint(entry, { branch }).items) });
    toast.success('Đã gửi lệnh in', { description: `Đang in phiếu trả ${entry.id}.` });
  }, [branches, print]);

  const headerActions = useMemo(() => [
    canCreate && <Button key="create" size="sm" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_RETURN_NEW)}><Plus className="mr-2 h-4 w-4" />Tạo phiếu trả hàng</Button>
  ].filter(Boolean), [router, canCreate]);

  usePageHeader({
    title: 'Danh sách phiếu trả NCC',
    actions: headerActions,
    breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Trả hàng nhập', href: ROUTES.PROCUREMENT.PURCHASE_RETURNS, isCurrent: true }],
    showBackButton: false
  });

  const columns = useMemo(() => getColumns(handleRowPrint), [handleRowPrint]);

  const handleRowClick = (row: PurchaseReturn) => router.push(`${ROUTES.PROCUREMENT.PURCHASE_RETURNS}/${row.systemId}`);
  const selectedRows = useMemo(() => purchaseReturns.filter(pr => rowSelection[pr.systemId]), [purchaseReturns, rowSelection]);

  const handleBulkPrint = useCallback(() => {
    if (selectedRows.length === 0) { toast.error('Chưa chọn phiếu trả', { description: 'Vui lòng chọn ít nhất một phiếu trước khi in.' }); return; }
    setPendingPrintReturns(selectedRows); setIsPrintDialogOpen(true);
  }, [selectedRows]);

  const handlePrintConfirm = useCallback(async (options: SimplePrintOptionsResult) => {
    const { branchSystemId, paperSize } = options;
    const { storeInfo } = await fetchPrintData();
    const printOptionsList = pendingPrintReturns.map(entry => {
      const branch = branchSystemId ? branches.find(b => b.systemId === branchSystemId) : branches.find(b => b.systemId === entry.branchSystemId);
      const forPrint = convertSupplierReturnForPrint(entry, { branch });
      return { data: mapSupplierReturnToPrintData(forPrint, branch ? createStoreSettings(branch) : createStoreSettings(storeInfo)), lineItems: mapSupplierReturnLineItems(forPrint.items), paperSize };
    });
    printMultiple('supplier-return', printOptionsList);
    toast.success('Đã gửi lệnh in cho phiếu trả', { description: pendingPrintReturns.map(r => r.id).join(', ') });
    setRowSelection({}); setPendingPrintReturns([]);
  }, [pendingPrintReturns, branches, printMultiple]);

  const currentUserInfo = useMemo(() => ({ name: currentUser?.fullName || 'Hệ thống', systemId: currentUser?.systemId || asSystemId('SYSTEM') }), [currentUser]);

  return (
    <div className="space-y-4 flex flex-col h-full">
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        items={[
          { key: 'total', label: 'Tổng phiếu trả', value: formatNumber(stats?.total ?? 0) },
          { key: 'totalValue', label: 'Tổng giá trị trả', value: formatCurrency(stats?.totalValue ?? 0) },
          { key: 'totalRefund', label: 'Đã hoàn tiền', value: formatCurrency(stats?.totalRefund ?? 0) },
          { key: 'pending', label: 'Chờ xử lý', value: stats?.byStatus?.find(s => s.status === 'PENDING')?.count ?? 0 },
        ]}
      />

      {!isMobile && <PageToolbar leftActions={<>{_canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/inventory')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}<Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}><Download className="h-4 w-4 mr-2" />Xuất Excel</Button></>} />}

      <PageFilters searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm theo mã phiếu, NCC, đơn hàng...">
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full sm:w-45"><SelectValue placeholder="Chi nhánh" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tất cả chi nhánh</SelectItem>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="w-full sm:w-50"><SelectValue placeholder="Nhà cung cấp" /></SelectTrigger>
          <SelectContent><SelectItem value="all">Tất cả NCC</SelectItem></SelectContent>
        </Select>
        <DataTableDateFilter value={dateRange} onChange={setDateRange} title="Ngày trả hàng" />
        <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={cn(isFetching && !isLoading && 'opacity-70 transition-opacity')}>
      <ResponsiveDataTable columns={columns} data={purchaseReturns} renderMobileCard={row => <MobileReturnCard purchaseReturn={row} onClick={handleRowClick} />} onRowClick={handleRowClick}
        pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection}
        allSelectedRows={selectedRows} bulkActions={[{ label: "In phiếu trả", icon: Printer, onSelect: handleBulkPrint }]} showBulkDeleteButton={false}
        expanded={expanded} setExpanded={setExpanded} sorting={sorting} setSorting={setSorting} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} isLoading={isLoading} mobileInfiniteScroll />
      </div>

      <SimplePrintOptionsDialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={pendingPrintReturns.length} title="In phiếu trả NCC" />
      {/* ✅ Only render export dialog when opened to avoid loading pricing-policies API */}
      {exportDialogOpen && <PurchaseReturnExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} allData={allPurchaseReturns} filteredData={allPurchaseReturns} currentPageData={purchaseReturns} selectedData={selectedRows}
        currentUser={currentUserInfo} />}
    </div>
  );
}
