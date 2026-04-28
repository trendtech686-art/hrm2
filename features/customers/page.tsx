'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, FileSpreadsheet, Download, Settings } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from '@tanstack/react-query';

import { useCustomers, useCustomerMutations, useCustomerStats, useBulkCustomerMutations, usePrefetchCustomer, type CustomerStats } from "./hooks/use-customers";
import { useMeiliCustomerSearch } from "@/hooks/use-meilisearch";
import { useActiveCustomerTypes } from "../settings/customers/hooks/use-all-customer-settings";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { type Customer } from "@/lib/types/prisma-extended";
import { getColumns } from "./columns";
import { DEFAULT_CUSTOMER_SORT, type CustomerQueryParams } from "./customer-service";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { useColumnLayout } from "@/hooks/use-column-visibility";
import { type SystemId } from "@/lib/id-types";
import { usePageHeader } from "@/contexts/page-header-context";
import { useMediaQuery } from "@/lib/use-media-query";
import { useDebounce } from "@/hooks/use-debounce";
import { formatCurrency } from "@/lib/format-utils";

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { PageFilters } from "@/components/layout/page-filters";
import { MobileSearchBar } from "@/components/mobile/mobile-search-bar";
import { MobileCustomerCard } from "./components/mobile-customer-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { logError } from '@/lib/logger'
import { useAuth } from "@/contexts/auth-context";
import { FAB } from '@/components/mobile/fab';
import { ListPageShell } from '@/components/layout/page-section';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Loading component for dialogs
function DialogLoadingFallback() {
  return (
    <Dialog open>
      <DialogContent className="max-w-md">
        <div className="space-y-4 p-4">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

const BulkActionConfirmDialog = dynamic(
  () => import("./components/bulk-action-confirm-dialog").then(mod => ({ default: mod.BulkActionConfirmDialog })),
  { ssr: false, loading: () => <DialogLoadingFallback /> }
);
const CustomerImportDialog = dynamic(
  () => import("./components/customer-import-export-dialogs").then(mod => ({ default: mod.CustomerImportDialog })),
  { ssr: false, loading: () => <DialogLoadingFallback /> }
);
const CustomerExportDialog = dynamic(
  () => import("./components/customer-import-export-dialogs").then(mod => ({ default: mod.CustomerExportDialog })),
  { ssr: false, loading: () => <DialogLoadingFallback /> }
);

const TABLE_STATE_STORAGE_KEY = "customers-table-state";
type PendingBulkAction = { kind: "delete" | "restore"; customers: Customer[] } | { kind: "status"; status: Customer["status"]; customers: Customer[] } | null;

const defaultTableState: CustomerQueryParams = {
  search: "", statusFilter: "all", typeFilter: "all", dateRange: undefined, showDeleted: false, debtFilter: "all",
  pagination: { pageIndex: 0, pageSize: 20 }, sorting: DEFAULT_CUSTOMER_SORT,
};

function resolveStateAction<T>(current: T, action: React.SetStateAction<T>): T {
  return typeof action === "function" ? (action as (prev: T) => T)(current) : action;
}

// Workflow card definitions — clicking a card sets the debtFilter
// Each card: countFn returns badge number, valueFn returns the bottom line (currency or count)
const CUSTOMER_CARDS = [
  { key: 'all', label: 'Tổng khách hàng', debtFilter: 'all' as const },
  { key: 'customerOwes', label: 'Có công nợ', debtFilter: 'customerOwes' as const },
  { key: 'weOwe', label: 'Dư công nợ', debtFilter: 'weOwe' as const },
  { key: 'overdue', label: 'Quá hạn thanh toán', debtFilter: 'overdue' as const },
  { key: 'dueSoon', label: 'Sắp đến hạn', debtFilter: 'dueSoon' as const },
  { key: 'newThisMonth', label: 'Khách mới tháng này', debtFilter: 'all' as const },
] as const;

type CustomerCardKey = typeof CUSTOMER_CARDS[number]['key'];

/** Resolve count (badge) + value (bottom line) for each card */
function getCardData(key: CustomerCardKey, stats: CustomerStats | undefined) {
  switch (key) {
    case 'all':
      return { count: stats?.totalCustomers ?? 0, value: '' };
    case 'customerOwes':
      return { count: stats?.customersOweUs ?? 0, value: formatCurrency(Number(stats?.totalReceivable ?? 0)) };
    case 'weOwe':
      return { count: stats?.weOweCustomers ?? 0, value: formatCurrency(Number(stats?.totalPayable ?? 0)) };
    case 'overdue':
      return { count: stats?.overdue ?? 0, value: '' };
    case 'dueSoon':
      return { count: stats?.dueSoon ?? 0, value: '' };
    case 'newThisMonth':
      return { count: stats?.newCustomersThisMonth ?? 0, value: '' };
    default:
      return { count: 0, value: '' };
  }
}

// Props interface for server-side data
export interface CustomersPageProps {
  initialStats?: {
    totalCustomers: number;
    customersWithDebt: number;
    totalDebtAmount: number;
    newCustomersThisMonth: number;
  };
  initialGroups?: Array<{
    systemId: string;
    id: string;
    name: string;
    color: string | null;
  }>;
}

export function CustomersPage({ initialStats, initialGroups: _initialGroups }: CustomersPageProps = {}) {
  // Permission checks
  const { can } = useAuth();
  const canCreate = can('create_customers');
  const canDelete = can('delete_customers');
  const _canEdit = can('edit_customers');
  const _canEditSettings = can('edit_settings');
  // useTransition for non-blocking filter updates
  const [isFilterPending, startFilterTransition] = React.useTransition();

  // Use persistent state for filters
  const [tableState, setTableState] = usePersistentState<CustomerQueryParams>(TABLE_STATE_STORAGE_KEY, defaultTableState);
  const _queryClient = useQueryClient();
  
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useCustomerStats(initialStats);
  
  // Debounced search for server-side
  const debouncedSearch = useDebounce(tableState.search, 300);
  
  // Reset page when filters change (wrapped in transition)
  React.useEffect(() => {
    startFilterTransition(() => {
      setTableState(p => ({ ...p, pagination: { ...p.pagination, pageIndex: 0 } }));
    });
  }, [debouncedSearch, tableState.statusFilter, tableState.typeFilter, tableState.dateRange, tableState.debtFilter, setTableState]);
  
  // Server-side paginated query
  const { data: customersData, isLoading: isLoadingCustomers, isFetching: isFetchingCustomers } = useCustomers({
    page: tableState.pagination.pageIndex + 1,
    limit: tableState.pagination.pageSize,
    search: debouncedSearch || undefined,
    status: tableState.statusFilter !== 'all' ? tableState.statusFilter : undefined,
    type: tableState.typeFilter !== 'all' ? tableState.typeFilter : undefined,
    dateFrom: tableState.dateRange?.[0],
    dateTo: tableState.dateRange?.[1],
    sortBy: tableState.sorting.id,
    sortOrder: tableState.sorting.desc ? 'desc' : 'asc',
    debtFilter: tableState.debtFilter !== 'all' ? tableState.debtFilter : undefined,
  });
  
  const customers = React.useMemo(() => customersData?.data ?? [], [customersData?.data]);
  const totalRows = customersData?.pagination?.total ?? 0;
  const serverPageCount = customersData?.pagination?.totalPages ?? 1;
  
  // Lazy-load all customers for Import/Export dialogs using Meilisearch (high limit, no debounce)
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const { data: allCustomersForExport } = useMeiliCustomerSearch({ query: '', enabled: showImportDialog || showExportDialog, limit: 1000, debounceMs: 0 });
  const allCustomers = React.useMemo(() => allCustomersForExport?.data ?? [], [allCustomersForExport]);
  const { remove: removeMutation } = useCustomerMutations({
    onDeleteSuccess: () => toast.success("Đã chuyển khách hàng vào thùng rác"),
    onUpdateSuccess: () => toast.success("Đã cập nhật khách hàng"),
    onError: (err) => toast.error(err.message || "Thao tác thất bại"),
  });
  const { bulkDelete, bulkRestore, bulkUpdateStatus } = useBulkCustomerMutations({
    onSuccess: () => toast.success("Thao tác hàng loạt thành công"),
    onError: (err) => toast.error(err.message || "Thao tác hàng loạt thất bại"),
  });
  
  const { data: customerTypesData } = useActiveCustomerTypes();
  const { data: branches } = useAllBranches({ enabled: showImportDialog });
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const deletedCount = stats?.deletedCount ?? 0;
  const prefetchCustomer = usePrefetchCustomer();

  const headerActions = React.useMemo(() => [
    canDelete && <Button key="trash" variant="outline" size="sm" asChild><Link href="/customers/trash"><Trash2 className="mr-2 h-4 w-4" />Thùng rác ({deletedCount})</Link></Button>,
    canCreate && <Button key="add" size="sm" asChild><Link href="/customers/new"><PlusCircle className="mr-2 h-4 w-4" />Thêm khách hàng</Link></Button>,
  ], [deletedCount, canCreate, canDelete]);

  usePageHeader({ title: 'Danh sách khách hàng', breadcrumb: [{ label: 'Trang chủ', href: '/' }, { label: 'Khách hàng', href: '/customers', isCurrent: true }], showBackButton: false, actions: headerActions });

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [pendingAction, setPendingAction] = React.useState<PendingBulkAction>(null);
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('customers', {
    pinned: ['select', 'actions'],
  });

  React.useEffect(() => { if (tableState.showDeleted) setTableState(p => ({ ...p, showDeleted: false })); }, [tableState.showDeleted, setTableState]);

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleRestore = React.useCallback((_systemId: string) => { 
    toast.info("Khôi phục từ thùng rác");
  }, []);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, router), [handleDelete, handleRestore, router]);

  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => {
    if (columnDefaultsInitialized.current || columns.length === 0) return;
    // Only set defaults if no visibility has been persisted yet
    if (Object.keys(columnVisibility).length === 0) {
      const defaultVisible = ["id", "name", "email", "phone", "shippingAddress", "status", "accountManagerName"];
      const vis: Record<string, boolean> = {};
      columns.forEach(c => { if (c.id) vis[c.id] = c.id === "select" || c.id === "actions" || defaultVisible.includes(c.id); });
      setColumnVisibility(vis);
    }
    if (columnOrder.length === 0) {
      setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    }
    columnDefaultsInitialized.current = true;
  }, [columns, columnVisibility, columnOrder, setColumnVisibility, setColumnOrder]);

  const updateTableState = React.useCallback((updater: (prev: CustomerQueryParams) => CustomerQueryParams) => { setTableState(updater); }, [setTableState]);
  const handleSearchChange = React.useCallback((v: string) => updateTableState(p => ({ ...p, search: v })), [updateTableState]);
  const handleStatusFilterChange = React.useCallback((v: string) => startFilterTransition(() => updateTableState(p => ({ ...p, statusFilter: v }))), [updateTableState]);
  const handleTypeFilterChange = React.useCallback((v: string) => startFilterTransition(() => updateTableState(p => ({ ...p, typeFilter: v }))), [updateTableState]);
  const handleDateRangeChange = React.useCallback((v: [string | undefined, string | undefined] | undefined) => startFilterTransition(() => updateTableState(p => ({ ...p, dateRange: v }))), [updateTableState]);
  const handlePaginationChange = React.useCallback((action: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => updateTableState(p => ({ ...p, pagination: resolveStateAction(p.pagination, action) })), [updateTableState]);
  const handleSortingChange = React.useCallback((action: React.SetStateAction<{ id: string; desc: boolean }>) => updateTableState(p => ({ ...p, sorting: { id: (resolveStateAction(p.sorting, action).id as CustomerQueryParams["sorting"]["id"]) ?? p.sorting.id, desc: resolveStateAction(p.sorting, action).desc } })), [updateTableState]);
  const handleDebtFilterChange = React.useCallback((v: string) => startFilterTransition(() => updateTableState(p => ({ ...p, debtFilter: v as typeof p.debtFilter }))), [updateTableState]);

  // Workflow card state — clicking a card sets debtFilter
  const [activeCard, setActiveCard] = React.useState<CustomerCardKey | null>(null);
  const handleCardClick = React.useCallback((key: CustomerCardKey | '') => {
    if (!key) {
      setActiveCard(null);
      startFilterTransition(() => updateTableState(p => ({ ...p, debtFilter: 'all' })));
      return;
    }
    const card = CUSTOMER_CARDS.find(c => c.key === key);
    setActiveCard(key);
    startFilterTransition(() => updateTableState(p => ({ ...p, debtFilter: (card?.debtFilter ?? 'all') as typeof p.debtFilter })));
  }, [updateTableState]);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('customers');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [{ value: 'Đang giao dịch', label: 'Đang giao dịch' }, { value: 'Ngừng Giao Dịch', label: 'Ngừng giao dịch' }] },
    { id: 'type', label: 'Loại khách hàng', type: 'select' as const, options: customerTypesData.map(t => ({ value: t.id, label: t.name })) },
    { id: 'debtFilter', label: 'Công nợ', type: 'select' as const, options: [{ value: 'customerOwes', label: 'Phải thu (khách nợ mình)' }, { value: 'weOwe', label: 'Phải trả (mình nợ khách)' }, { value: 'hasDebt', label: 'Có công nợ' }, { value: 'noDebt', label: 'Không có công nợ' }, { value: 'overdue', label: 'Quá hạn thanh toán' }, { value: 'dueSoon', label: 'Sắp đến hạn' }] },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [customerTypesData]);
  const panelValues = React.useMemo(() => ({
    status: tableState.statusFilter !== 'all' ? tableState.statusFilter : null,
    type: tableState.typeFilter !== 'all' ? tableState.typeFilter : null,
    debtFilter: tableState.debtFilter !== 'all' ? tableState.debtFilter : null,
    dateRange: tableState.dateRange ? { from: tableState.dateRange[0], to: tableState.dateRange[1] } : null,
  }), [tableState.statusFilter, tableState.typeFilter, tableState.debtFilter, tableState.dateRange]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    const dr = v.dateRange as { from?: string; to?: string } | null;
    startFilterTransition(() => {
      updateTableState(p => ({
        ...p,
        statusFilter: (v.status as string) || 'all',
        typeFilter: (v.type as string) || 'all',
        debtFilter: ((v.debtFilter as string) || 'all') as typeof p.debtFilter,
        dateRange: dr ? [dr.from, dr.to] : undefined,
      }));
    });
    if (v.debtFilter) setActiveCard(null);
  }, [updateTableState]);

  // Server-side handles all filtering including debt filters
  const displayData = customers;
  const pageCount = serverPageCount;
  const displayTotalRows = totalRows;

  const selectedCustomers = React.useMemo(() => displayData.filter(c => rowSelection[c.systemId]), [displayData, rowSelection]);
  const activeCustomers = React.useMemo(() => allCustomers.filter(c => !c.isDeleted), [allCustomers]);

  const confirmDelete = React.useCallback(() => { if (idToDelete) { removeMutation.mutate(idToDelete); } setIsAlertOpen(false); setIdToDelete(null); }, [idToDelete, removeMutation]);
  const handleRowClick = React.useCallback((c: Customer) => router.push(`/customers/${c.systemId}`), [router]);
  const handleRowHover = React.useCallback((c: Customer) => prefetchCustomer(c.systemId), [prefetchCustomer]);

  const handleImportV2 = React.useCallback(async (
    data: Partial<Customer>[], 
    mode: 'insert-only' | 'update-only' | 'upsert',
    _branchId?: string
  ) => {
    // Create background import job - returns immediately
    // Progress can be tracked at /settings/import-export-logs
    try {
      const response = await fetch('/api/import-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'customers',
          data,
          mode,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Lỗi tạo job import');
      }
      
      const jobData = await response.json();
      
      // Show success message with link to logs
      toast.success(
        `Đã tạo job import ${jobData.totalRecords || data.length} khách hàng. Xem tiến trình tại Cài đặt > Nhật ký Import/Export`,
        { duration: 5000 }
      );
      
      // Return immediately - job will process in background
      return {
        success: 0, // Will be updated by background job
        failed: 0,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [] as Array<{ row: number; message: string }>,
        isBackgroundJob: true, // Flag to indicate this is a background job
      };
    } catch (e) {
      logError('Create import job error', e);
      toast.error(String(e));
      return { 
        success: 0, 
        failed: data.length, 
        inserted: 0, 
        updated: 0, 
        skipped: 0, 
        errors: [{ row: 0, message: String(e) }],
        isBackgroundJob: false,
      };
    }
  }, []);

  const currentUser = React.useMemo(() => ({ name: 'Admin', systemId: 'USR000001' as SystemId }), []);
  const bulkActions = React.useMemo(() => [
    { label: "Chuyển vào thùng rác", onSelect: (rows: Customer[]) => setPendingAction({ kind: "delete", customers: rows }) },
    { label: "Đang giao dịch", onSelect: (rows: Customer[]) => setPendingAction({ kind: "status", status: "Đang giao dịch", customers: rows }) },
    { label: "Ngừng giao dịch", onSelect: (rows: Customer[]) => setPendingAction({ kind: "status", status: "Ngừng Giao Dịch", customers: rows }) },
  ], []);

  const bulkDialogCopy = React.useMemo(() => {
    if (!pendingAction) return null;
    const count = pendingAction.customers.length;
    if (pendingAction.kind === "delete") return { title: "Chuyển vào thùng rác", description: `Xác nhận chuyển ${count} khách hàng vào thùng rác?`, confirmLabel: "Chuyển" };
    if (pendingAction.kind === "restore") return { title: "Khôi phục khách hàng", description: `Khôi phục ${count} khách hàng?`, confirmLabel: "Khôi phục" };
    if (pendingAction.kind === "status") return { title: "Cập nhật trạng thái", description: `Cập nhật ${count} khách hàng sang "${pendingAction.status}"?`, confirmLabel: "Cập nhật" };
    return null;
  }, [pendingAction]);

  const handleConfirmBulkAction = React.useCallback(() => {
    if (!pendingAction) return;
    const ids = pendingAction.customers.map(c => c.systemId);
    if (pendingAction.kind === "delete") { 
      bulkDelete.mutate(ids);
    }
    else if (pendingAction.kind === "restore") { 
      bulkRestore.mutate(ids);
    }
    else if (pendingAction.kind === "status") { 
      bulkUpdateStatus.mutate({ systemIds: ids, status: pendingAction.status });
    }
    setRowSelection(p => { const n = { ...p }; pendingAction.customers.forEach(c => delete n[c.systemId]); return n; });
    setPendingAction(null);
  }, [pendingAction, bulkDelete, bulkRestore, bulkUpdateStatus]);

  return (
    <ListPageShell>
      <div className="flex flex-col gap-4">
        {/* Workflow Cards — click to filter */}
        <div className="overflow-x-auto mb-2">
          <ToggleGroup
            type="single"
            value={activeCard ?? ''}
            onValueChange={(val) => handleCardClick(val as CustomerCardKey | '')}
            className="justify-start gap-1.5 min-w-max pb-1"
          >
            {CUSTOMER_CARDS.map(card => {
              const { count, value } = getCardData(card.key, stats);
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
                        <Badge variant={activeCard === card.key ? 'default' : card.key === 'overdue' ? 'destructive' : 'secondary'} className="h-5 min-w-5 justify-center rounded-full px-1.5 text-xs leading-none">
                          {count}
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-semibold tabular-nums">{value || `${count} khách hàng`}</span>
                  </div>
                </ToggleGroupItem>
              );
            })}
          </ToggleGroup>
        </div>

        <div className="shrink-0 space-y-4">
          {isMobile ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập</Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất</Button>
                <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
              </div>
              <MobileSearchBar value={tableState.search} onChange={handleSearchChange} placeholder="Tìm kiếm khách hàng..." />
              <div className="grid grid-cols-2 gap-2">
                <Select value={tableState.debtFilter} onValueChange={handleDebtFilterChange}><SelectTrigger><SelectValue placeholder="Công nợ" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả công nợ</SelectItem><SelectItem value="customerOwes">Phải thu (khách nợ mình)</SelectItem><SelectItem value="weOwe">Phải trả (mình nợ khách)</SelectItem><SelectItem value="hasDebt">Có công nợ</SelectItem><SelectItem value="noDebt">Không có công nợ</SelectItem><SelectItem value="overdue">Quá hạn thanh toán</SelectItem><SelectItem value="dueSoon">Sắp đến hạn</SelectItem></SelectContent></Select>
                <Select value={tableState.statusFilter} onValueChange={handleStatusFilterChange}><SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem><SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem><SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem></SelectContent></Select>
                <Select value={tableState.typeFilter} onValueChange={handleTypeFilterChange}><SelectTrigger><SelectValue placeholder="Loại KH" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả loại</SelectItem>{customerTypesData.map(t => <SelectItem key={t.systemId} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
              </div>
              <p className="text-sm text-muted-foreground pt-2 border-t">{displayTotalRows} khách hàng</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {_canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/customers')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}
                <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button>
                <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
              </div>
              <PageFilters searchValue={tableState.search} onSearchChange={handleSearchChange} searchPlaceholder="Tìm kiếm khách hàng...">
                <DataTableDateFilter value={tableState.dateRange} onChange={handleDateRangeChange} title="Ngày tạo" />
                <Select value={tableState.debtFilter} onValueChange={handleDebtFilterChange}><SelectTrigger className="w-48"><SelectValue placeholder="Công nợ" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả công nợ</SelectItem><SelectItem value="customerOwes">Phải thu (khách nợ mình)</SelectItem><SelectItem value="weOwe">Phải trả (mình nợ khách)</SelectItem><SelectItem value="hasDebt">Có công nợ</SelectItem><SelectItem value="noDebt">Không có công nợ</SelectItem><SelectItem value="overdue">Quá hạn thanh toán</SelectItem><SelectItem value="dueSoon">Sắp đến hạn</SelectItem></SelectContent></Select>
                <Select value={tableState.statusFilter} onValueChange={handleStatusFilterChange}><SelectTrigger className="w-40"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem><SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem><SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem></SelectContent></Select>
                <Select value={tableState.typeFilter} onValueChange={handleTypeFilterChange}><SelectTrigger className="w-40"><SelectValue placeholder="Loại KH" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả loại</SelectItem>{customerTypesData.map(t => <SelectItem key={t.systemId} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
                <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
              </PageFilters>
              <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
            </>
          )}
        </div>

        <div className={`w-full py-4${isFilterPending || (isFetchingCustomers && !isLoadingCustomers) ? ' opacity-70 transition-opacity duration-200' : ''}`}>
          <ResponsiveDataTable columns={columns} data={displayData} renderMobileCard={c => <MobileCustomerCard customer={c} onRowClick={handleRowClick} onDelete={handleDelete} />} pageCount={pageCount} pagination={tableState.pagination} setPagination={handlePaginationChange} rowCount={displayTotalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} bulkActions={bulkActions} allSelectedRows={selectedCustomers} sorting={tableState.sorting} setSorting={handleSortingChange} expanded={expanded} setExpanded={setExpanded} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} onRowHover={handleRowHover} isLoading={isLoadingCustomers} mobileInfiniteScroll />
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa khách hàng?</AlertDialogTitle><AlertDialogDescription>Khách hàng sẽ được chuyển vào thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      {pendingAction && bulkDialogCopy && <BulkActionConfirmDialog open title={bulkDialogCopy.title} description={bulkDialogCopy.description} confirmLabel={bulkDialogCopy.confirmLabel} customers={pendingAction.customers} onConfirm={handleConfirmBulkAction} onCancel={() => setPendingAction(null)} />}
      <CustomerImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={activeCustomers} onImport={handleImportV2} currentUser={currentUser} />
      <CustomerExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={activeCustomers} filteredData={displayData} currentPageData={displayData} selectedData={selectedCustomers} currentUser={currentUser} />
      {isMobile && canCreate && <FAB onClick={() => router.push('/customers/new')} />}
    </ListPageShell>
  );
}
