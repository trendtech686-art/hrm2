'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, FileSpreadsheet, Download } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";

import { useFuseFilter } from "@/hooks/use-fuse-search";
import { useCustomerStore } from "./store";
import { useActiveCustomerTypes } from "../settings/customers/hooks/use-all-customer-settings";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { type Customer } from "@/lib/types/prisma-extended";
import { getColumns } from "./columns";
import { DEFAULT_CUSTOMER_SORT, type CustomerQueryParams } from "./customer-service";
import { usePersistentState } from "@/hooks/use-persistent-state";
import { useColumnVisibility } from "@/hooks/use-column-visibility";
import { asSystemId, asBusinessId, type SystemId } from "@/lib/id-types";
import { usePageHeader } from "@/contexts/page-header-context";
import { useMediaQuery } from "@/lib/use-media-query";
import { useDebounce } from "@/hooks/use-debounce";
import { isDateAfter, isDateBefore } from "@/lib/date-utils";
import { useCustomersQuery } from "./hooks/use-customers-query";
import { useCustomersWithComputedDebt } from "./hooks/use-computed-debt";
import { useCustomerSlaEvaluation } from "./sla/hooks";

import { ResponsiveDataTable } from "@/components/data-table/responsive-data-table";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { DataTableDateFilter } from "@/components/data-table/data-table-date-filter";
import { PageFilters } from "@/components/layout/page-filters";
import { TouchButton } from "@/components/mobile/touch-button";
import { MobileSearchBar } from "@/components/mobile/mobile-search-bar";
import { MobileCustomerCard } from "./components/mobile-customer-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const BulkActionConfirmDialog = dynamic(() => import("./components/bulk-action-confirm-dialog").then(mod => ({ default: mod.BulkActionConfirmDialog })), { ssr: false });
const CustomerImportDialog = dynamic(() => import("./components/customer-import-export-dialogs").then(mod => ({ default: mod.CustomerImportDialog })), { ssr: false });
const CustomerExportDialog = dynamic(() => import("./components/customer-import-export-dialogs").then(mod => ({ default: mod.CustomerExportDialog })), { ssr: false });

const TABLE_STATE_STORAGE_KEY = "customers-table-state";
type PendingBulkAction = { kind: "delete" | "restore"; customers: Customer[] } | { kind: "status"; status: Customer["status"]; customers: Customer[] } | null;

const defaultTableState: CustomerQueryParams = {
  search: "", statusFilter: "all", typeFilter: "all", dateRange: undefined, showDeleted: false, slaFilter: "all", debtFilter: "all",
  pagination: { pageIndex: 0, pageSize: 10 }, sorting: DEFAULT_CUSTOMER_SORT,
};

function resolveStateAction<T>(current: T, action: React.SetStateAction<T>): T {
  return typeof action === "function" ? (action as (prev: T) => T)(current) : action;
}

export function CustomersPage() {
  const { data: customers, remove, removeMany, restore, restoreMany, addMultiple, updateManyStatus, update } = useCustomerStore(useShallow((s) => ({ data: s.data, remove: s.remove, removeMany: s.removeMany, restore: s.restore, restoreMany: s.restoreMany, addMultiple: s.addMultiple, updateManyStatus: s.updateManyStatus, update: s.update })));
  const { data: customerTypesData } = useActiveCustomerTypes();
  const { data: branches } = useAllBranches();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const customersWithDebt = useCustomersWithComputedDebt(customers);
  const deletedCount = React.useMemo(() => customers.filter(c => c.isDeleted).length, [customers]);

  const headerActions = React.useMemo(() => [
    <Button key="trash" variant="outline" size="sm" className="h-9" asChild><Link href="/customers/trash"><Trash2 className="mr-2 h-4 w-4" />Thùng rác ({deletedCount})</Link></Button>,
    <Button key="add" size="sm" className="h-9" asChild><Link href="/customers/new"><PlusCircle className="mr-2 h-4 w-4" />Thêm khách hàng</Link></Button>,
  ], [deletedCount]);

  usePageHeader({ title: 'Danh sách khách hàng', breadcrumb: [{ label: 'Trang chủ', href: '/' }, { label: 'Khách hàng', href: '/customers', isCurrent: true }], showBackButton: false, actions: headerActions });

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [pendingAction, setPendingAction] = React.useState<PendingBulkAction>(null);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('customers', {});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [tableState, setTableState] = usePersistentState<CustomerQueryParams>(TABLE_STATE_STORAGE_KEY, defaultTableState);

  useCustomersQuery(React.useMemo(() => ({ ...tableState, showDeleted: false }), [tableState]));
  React.useEffect(() => { if (tableState.showDeleted) setTableState(p => ({ ...p, showDeleted: false })); }, [tableState.showDeleted, setTableState]);

  const handleDelete = React.useCallback((systemId: string) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleRestore = React.useCallback((systemId: string) => { restore(asSystemId(systemId)); }, [restore]);

  const slaEngine = useCustomerSlaEvaluation();
  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, router, { slaIndex: slaEngine.index }), [handleDelete, handleRestore, router, slaEngine.index]);

  const columnDefaultsInitialized = React.useRef(false);
  React.useEffect(() => {
    if (columnDefaultsInitialized.current || columns.length === 0) return;
    const defaultVisible = ["id", "name", "email", "phone", "shippingAddress", "status", "slaStatus", "accountManagerName"];
    const vis: Record<string, boolean> = {};
    columns.forEach(c => { if (c.id) vis[c.id] = c.id === "select" || c.id === "actions" || defaultVisible.includes(c.id); });
    setColumnVisibility(vis);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    columnDefaultsInitialized.current = true;
  }, [columns, setColumnVisibility]);

  const updateTableState = React.useCallback((updater: (prev: CustomerQueryParams) => CustomerQueryParams) => { setTableState(updater); }, [setTableState]);
  const handleSearchChange = React.useCallback((v: string) => updateTableState(p => ({ ...p, search: v, pagination: { ...p.pagination, pageIndex: 0 } })), [updateTableState]);
  const handleStatusFilterChange = React.useCallback((v: string) => updateTableState(p => ({ ...p, statusFilter: v, pagination: { ...p.pagination, pageIndex: 0 } })), [updateTableState]);
  const handleTypeFilterChange = React.useCallback((v: string) => updateTableState(p => ({ ...p, typeFilter: v, pagination: { ...p.pagination, pageIndex: 0 } })), [updateTableState]);
  const handleDateRangeChange = React.useCallback((v: [string | undefined, string | undefined] | undefined) => updateTableState(p => ({ ...p, dateRange: v, pagination: { ...p.pagination, pageIndex: 0 } })), [updateTableState]);
  const handlePaginationChange = React.useCallback((action: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => updateTableState(p => ({ ...p, pagination: resolveStateAction(p.pagination, action) })), [updateTableState]);
  const handleSortingChange = React.useCallback((action: React.SetStateAction<{ id: string; desc: boolean }>) => updateTableState(p => ({ ...p, sorting: { id: (resolveStateAction(p.sorting, action).id as CustomerQueryParams["sorting"]["id"]) ?? p.sorting.id, desc: resolveStateAction(p.sorting, action).desc } })), [updateTableState]);
  const handleDebtFilterChange = React.useCallback((v: string) => updateTableState(p => ({ ...p, debtFilter: v as typeof p.debtFilter, pagination: { ...p.pagination, pageIndex: 0 } })), [updateTableState]);
  const handleSlaFilterChange = React.useCallback((v: string) => updateTableState(p => ({ ...p, slaFilter: v as typeof p.slaFilter, pagination: { ...p.pagination, pageIndex: 0 } })), [updateTableState]);

  const debouncedSearch = useDebounce(tableState.search, 300);
  const fuseOptions = React.useMemo(() => ({ keys: ['name', 'email', 'phone', 'company', 'taxCode', 'id'], threshold: 0.3, ignoreLocation: true }), []);

  const preFilteredData = React.useMemo(() => {
    let data = customersWithDebt.filter(c => !c.isDeleted);
    if (tableState.statusFilter !== 'all') data = data.filter(c => c.status === tableState.statusFilter);
    if (tableState.typeFilter !== 'all') data = data.filter(c => c.type === tableState.typeFilter);
    if (tableState.dateRange?.[0] || tableState.dateRange?.[1]) {
      data = data.filter(c => {
        if (!c.createdAt) return false;
        const d = new Date(c.createdAt), from = tableState.dateRange![0] ? new Date(tableState.dateRange![0]) : null, to = tableState.dateRange![1] ? new Date(tableState.dateRange![1]) : null;
        return !(from && isDateBefore(d, from)) && !(to && isDateAfter(d, to));
      });
    }
    if (tableState.slaFilter !== 'all' && slaEngine.index) {
      const ids = new Set<string>();
      const alerts = { followUp: slaEngine.index.followUpAlerts, reengage: slaEngine.index.reEngagementAlerts, debt: slaEngine.index.debtAlerts, health: slaEngine.index.healthAlerts }[tableState.slaFilter];
      alerts?.forEach(a => ids.add(a.systemId));
      data = data.filter(c => ids.has(c.systemId));
    }
    if (tableState.debtFilter !== 'all') {
      const now = new Date();
      if (tableState.debtFilter === 'totalOverdue' || tableState.debtFilter === 'overdue') data = data.filter(c => c.debtReminders?.some(r => r.dueDate && new Date(r.dueDate) < now && (r.amountDue ?? 0) > 0));
      else if (tableState.debtFilter === 'dueSoon') { const soon = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); data = data.filter(c => c.debtReminders?.some(r => r.dueDate && new Date(r.dueDate) >= now && new Date(r.dueDate) <= soon && (r.amountDue ?? 0) > 0)); }
      else if (tableState.debtFilter === 'hasDebt') data = data.filter(c => (c.currentDebt || 0) > 0);
    }
    return data;
  }, [customersWithDebt, tableState.statusFilter, tableState.typeFilter, tableState.dateRange, tableState.slaFilter, tableState.debtFilter, slaEngine.index]);

  const searchedData = useFuseFilter(preFilteredData, debouncedSearch.trim(), fuseOptions);
  const filteredData = React.useMemo(() => debouncedSearch.trim() ? searchedData : preFilteredData, [preFilteredData, debouncedSearch, searchedData]);

  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    const key = tableState.sorting.id as keyof Customer;
    sorted.sort((a, b) => {
      const aV = a[key] ?? '', bV = b[key] ?? '';
      if (key === 'createdAt') {
        const aT = aV ? new Date(aV as string | number | Date).getTime() : 0, bT = bV ? new Date(bV as string | number | Date).getTime() : 0;
        if (aT === bT) { const aN = parseInt(a.systemId.replace(/\D/g, '')) || 0, bN = parseInt(b.systemId.replace(/\D/g, '')) || 0; return tableState.sorting.desc ? bN - aN : aN - bN; }
        return tableState.sorting.desc ? bT - aT : aT - bT;
      }
      return aV < bV ? (tableState.sorting.desc ? 1 : -1) : aV > bV ? (tableState.sorting.desc ? -1 : 1) : 0;
    });
    return sorted;
  }, [filteredData, tableState.sorting]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / tableState.pagination.pageSize));
  const pageData = React.useMemo(() => sortedData.slice(tableState.pagination.pageIndex * tableState.pagination.pageSize, (tableState.pagination.pageIndex + 1) * tableState.pagination.pageSize), [sortedData, tableState.pagination]);
  const selectedCustomers = React.useMemo(() => customers.filter(c => rowSelection[c.systemId]), [customers, rowSelection]);
  const activeCustomers = React.useMemo(() => customers.filter(c => !c.isDeleted), [customers]);

  const confirmDelete = React.useCallback(() => { if (idToDelete) { remove(asSystemId(idToDelete)); toast.success("Đã chuyển khách hàng vào thùng rác"); } setIsAlertOpen(false); setIdToDelete(null); }, [idToDelete, remove]);
  const handleRowClick = React.useCallback((c: Customer) => router.push(`/customers/${c.systemId}`), [router]);

  const handleImportV2 = React.useCallback(async (data: Partial<Customer>[], mode: 'insert-only' | 'update-only' | 'upsert') => {
    let inserted = 0, updated = 0, skipped = 0, failed = 0;
    const errors: Array<{ row: number; message: string }> = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        const existing = item.id ? activeCustomers.find(c => c.id === item.id) : null;
        if (existing) {
          if (mode === 'insert-only') { skipped++; continue; }
          update(existing.systemId, { ...existing, ...item } as Customer); updated++;
        } else {
          if (mode === 'update-only') { errors.push({ row: i + 2, message: `Không tìm thấy KH mã ${item.id}` }); failed++; continue; }
          const { systemId: _, ...newData } = item as Partial<Customer> & { systemId?: string };
          addMultiple([{ ...newData, id: asBusinessId(""), status: newData.status || "Đang giao dịch" } as Omit<Customer, "systemId">]); inserted++;
        }
      } catch (e) { errors.push({ row: i + 2, message: String(e) }); failed++; }
    }
    return { success: inserted + updated, failed, inserted, updated, skipped, errors };
  }, [activeCustomers, addMultiple, update]);

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
    const ids = pendingAction.customers.map(c => asSystemId(c.systemId));
    if (pendingAction.kind === "delete") { removeMany(ids); toast.success(`Đã chuyển ${ids.length} khách hàng vào thùng rác`); }
    else if (pendingAction.kind === "restore") { restoreMany(ids); toast.success(`Đã khôi phục ${ids.length} khách hàng`); }
    else if (pendingAction.kind === "status") { updateManyStatus(ids, pendingAction.status); toast.success(`Đã cập nhật ${ids.length} khách hàng`); }
    setRowSelection(p => { const n = { ...p }; pendingAction.customers.forEach(c => delete n[c.systemId]); return n; });
    setPendingAction(null);
  }, [pendingAction, removeMany, restoreMany, updateManyStatus]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4">
        <div className="flex-shrink-0 space-y-4">
          {isMobile ? (
            <div className="space-y-3">
              <TouchButton onClick={() => router.push("/customers/new")} size="default" className="w-full min-h-touch"><PlusCircle className="mr-2 h-4 w-4" />Thêm khách hàng</TouchButton>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập</Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất</Button>
                <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
              </div>
              <MobileSearchBar value={tableState.search} onChange={handleSearchChange} placeholder="Tìm kiếm khách hàng..." />
              <div className="grid grid-cols-2 gap-2">
                <Select value={tableState.debtFilter} onValueChange={handleDebtFilterChange}><SelectTrigger className="h-9"><SelectValue placeholder="Công nợ" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả công nợ</SelectItem><SelectItem value="totalOverdue">Tổng quá hạn</SelectItem><SelectItem value="overdue">Quá hạn</SelectItem><SelectItem value="dueSoon">Sắp đến hạn</SelectItem><SelectItem value="hasDebt">Có công nợ</SelectItem></SelectContent></Select>
                <Select value={tableState.slaFilter} onValueChange={handleSlaFilterChange}><SelectTrigger className="h-9"><SelectValue placeholder="Cảnh báo" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả cảnh báo</SelectItem><SelectItem value="followUp">Cần liên hệ</SelectItem><SelectItem value="reengage">Lâu không mua</SelectItem><SelectItem value="debt">Cảnh báo nợ</SelectItem><SelectItem value="health">Nguy cơ mất</SelectItem></SelectContent></Select>
                <Select value={tableState.statusFilter} onValueChange={handleStatusFilterChange}><SelectTrigger className="h-9"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem><SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem><SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem></SelectContent></Select>
                <Select value={tableState.typeFilter} onValueChange={handleTypeFilterChange}><SelectTrigger className="h-9"><SelectValue placeholder="Loại KH" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả loại</SelectItem>{customerTypesData.map(t => <SelectItem key={t.systemId} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
              </div>
              <p className="text-body-sm text-muted-foreground pt-2 border-t">{sortedData.length} khách hàng</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}><FileSpreadsheet className="mr-2 h-4 w-4" />Nhập file</Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}><Download className="mr-2 h-4 w-4" />Xuất Excel</Button>
                <DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
              </div>
              <PageFilters searchValue={tableState.search} onSearchChange={handleSearchChange} searchPlaceholder="Tìm kiếm khách hàng...">
                <DataTableDateFilter value={tableState.dateRange} onChange={handleDateRangeChange} title="Ngày tạo" />
                <Select value={tableState.debtFilter} onValueChange={handleDebtFilterChange}><SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Công nợ" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả công nợ</SelectItem><SelectItem value="totalOverdue">Tổng công nợ quá hạn</SelectItem><SelectItem value="overdue">Quá hạn thanh toán</SelectItem><SelectItem value="dueSoon">Sắp đến hạn</SelectItem><SelectItem value="hasDebt">Có công nợ</SelectItem></SelectContent></Select>
                {slaEngine.summary && <Select value={tableState.slaFilter} onValueChange={handleSlaFilterChange}><SelectTrigger className="w-[180px] h-9"><SelectValue placeholder="Cảnh báo" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả cảnh báo</SelectItem><SelectItem value="followUp">Cần liên hệ ({slaEngine.summary.followUpAlerts})</SelectItem><SelectItem value="reengage">Lâu không mua ({slaEngine.summary.reEngagementAlerts})</SelectItem><SelectItem value="debt">Cảnh báo nợ ({slaEngine.summary.debtAlerts})</SelectItem><SelectItem value="health">Nguy cơ mất ({slaEngine.summary.healthAlerts})</SelectItem></SelectContent></Select>}
                <Select value={tableState.statusFilter} onValueChange={handleStatusFilterChange}><SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Trạng thái" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem><SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem><SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem></SelectContent></Select>
                <Select value={tableState.typeFilter} onValueChange={handleTypeFilterChange}><SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Loại KH" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả loại</SelectItem>{customerTypesData.map(t => <SelectItem key={t.systemId} value={t.id}>{t.name}</SelectItem>)}</SelectContent></Select>
              </PageFilters>
            </>
          )}
        </div>

        <div className="w-full py-4">
          <ResponsiveDataTable columns={columns} data={pageData} renderMobileCard={c => <MobileCustomerCard customer={c} onRowClick={handleRowClick} onDelete={handleDelete} />} pageCount={pageCount} pagination={tableState.pagination} setPagination={handlePaginationChange} rowCount={sortedData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} bulkActions={bulkActions} allSelectedRows={selectedCustomers} sorting={tableState.sorting} setSorting={handleSortingChange} expanded={expanded} setExpanded={setExpanded} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} mobileVirtualized mobileRowHeight={190} mobileListHeight={520} />
        </div>
      </div>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa khách hàng?</AlertDialogTitle><AlertDialogDescription>Khách hàng sẽ được chuyển vào thùng rác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      {pendingAction && bulkDialogCopy && <BulkActionConfirmDialog open title={bulkDialogCopy.title} description={bulkDialogCopy.description} confirmLabel={bulkDialogCopy.confirmLabel} customers={pendingAction.customers} onConfirm={handleConfirmBulkAction} onCancel={() => setPendingAction(null)} />}
      <CustomerImportDialog open={showImportDialog} onOpenChange={setShowImportDialog} branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))} existingData={activeCustomers} onImport={handleImportV2} currentUser={currentUser} />
      <CustomerExportDialog open={showExportDialog} onOpenChange={setShowExportDialog} allData={activeCustomers} filteredData={sortedData} currentPageData={pageData} selectedData={selectedCustomers} currentUser={currentUser} />
    </div>
  );
}
