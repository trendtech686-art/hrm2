'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Plus, X, LayoutGrid, Table, AlertCircle, BarChart3, RefreshCw, Printer, Settings } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { asSystemId } from '@/lib/id-types';
import { useFuseFilter } from "@/hooks/use-fuse-search";
import { ROUTES } from "@/lib/router";

import type { Complaint } from "./types";
import { useComplaintStore } from "./store";
import { useAllEmployees } from "../employees/hooks/use-all-employees";
import { useAllBranches } from "../settings/branches/hooks/use-all-branches";
import { useStoreInfoData } from "../settings/store-info/hooks/use-store-info";
import { checkOverdue } from "./sla-utils";
import { usePrint } from "@/lib/use-print";
import { convertComplaintForPrint, mapComplaintToPrintData, mapComplaintLineItems, createStoreSettings } from "@/lib/print/complaint-print-helper";
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from "@/components/shared/simple-print-options-dialog";
import { usePageHeader } from "@/contexts/page-header-context";
import { useBreakpoint } from "@/contexts/breakpoint-context";
import { loadCardColorSettings } from "../settings/complaints/complaints-settings-page";
import { useRealtimeUpdates, getDataVersion, triggerDataUpdate } from "./use-realtime-updates";
import { generateTrackingUrl, getTrackingCode, isTrackingEnabled } from "./tracking-utils";
import type { BreadcrumbItem } from "@/lib/breadcrumb-system";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageFilters } from "@/components/layout/page-filters";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { ResponsiveDataTable, type BulkAction } from "@/components/data-table/responsive-data-table";
import { getColumns } from "./columns";

// Dynamic imports for heavy components
const KanbanColumn = dynamic(() => import('./components/kanban-column').then(mod => ({ default: mod.KanbanColumn })), { ssr: false });
const ComplaintCard = dynamic(() => import('./components/complaint-card').then(mod => ({ default: mod.ComplaintCard })), { ssr: false });

function parseColorClass(colorClass: string): React.CSSProperties {
  if (!colorClass || typeof colorClass !== 'string') return {};
  const colorMap: Record<string, string> = { 'bg-yellow-50': '#fefce8', 'bg-blue-50': '#eff6ff', 'bg-green-50': '#f0fdf4', 'bg-gray-50': '#f9fafb', 'bg-amber-50': '#fffbeb', 'bg-orange-50': '#fff7ed', 'bg-red-50': '#fef2f2', 'bg-red-100': '#fee2e2', 'bg-slate-50': '#f8fafc' };
  const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-'));
  return bgClass && colorMap[bgClass] ? { backgroundColor: colorMap[bgClass] } : {};
}

export function ComplaintsPage() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { complaints, searchQuery, setSearchQuery, updateComplaint } = useComplaintStore();
  const { data: employees } = useAllEmployees();
  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();
  const { printMultiple } = usePrint();

  const [viewMode, setViewMode] = React.useState<"kanban" | "table">("kanban");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = React.useState<Set<string>>(new Set());
  const [assignedToFilter, setAssignedToFilter] = React.useState<Set<string>>(new Set());
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => { const def = ['complaintId', 'orderCode', 'customerName', 'type', 'priority', 'status', 'verification', 'slaStatus', 'assignedTo', 'affectedProducts', 'createdAt', 'resolvedAt']; const init: Record<string, boolean> = {}; const cols = getColumns(() => {}, () => {}, () => {}, () => {}, () => {}, () => {}, employees, router); cols.forEach(c => { const id = c.id || ''; init[id] = id === 'select' || id === 'actions' || def.includes(id); }); return init; });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'complaintId']);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<Complaint[]>([]);
  const [confirmDialog, setConfirmDialog] = React.useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });

  const [dataVersion, setDataVersion] = React.useState(() => getDataVersion());
  const { isPolling, togglePolling } = useRealtimeUpdates(dataVersion, () => setDataVersion(Date.now()), 30000);
  const cardColors = React.useMemo(() => loadCardColorSettings(), []);

  const getRowStyle = React.useCallback((c: Complaint): React.CSSProperties => {
    const od = checkOverdue(c);
    if (cardColors.enableOverdueColor && (od.isOverdueResponse || od.isOverdueResolve)) return parseColorClass(cardColors.overdueColor);
    if (cardColors.enablePriorityColors && c.priority) { const pc = cardColors.priorityColors[c.priority]; if (pc) return parseColorClass(pc); }
    if (cardColors.enableStatusColors) { const sc = cardColors.statusColors[c.status]; if (sc) return parseColorClass(sc); }
    return {};
  }, [cardColors]);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedSearch(searchQuery), 300); return () => clearTimeout(t); }, [searchQuery]);

  const statusOptions = React.useMemo(() => [{ label: "Chờ xử lý", value: "pending" }, { label: "Đang kiểm tra", value: "investigating" }, { label: "Đã giải quyết", value: "resolved" }, { label: "Đã hủy", value: "cancelled" }], []);
  const typeOptions = React.useMemo(() => [{ label: "Sai hàng", value: "wrong-product" }, { label: "Thiếu hàng", value: "missing-items" }, { label: "Đóng gói sai", value: "wrong-packaging" }, { label: "Lỗi do kho", value: "warehouse-defect" }, { label: "Tình trạng hàng", value: "product-condition" }], []);
  const employeeOptions = React.useMemo(() => employees.map(e => ({ label: e.fullName, value: e.systemId })), [employees]);

  const fuseOptions = React.useMemo(() => ({ keys: ["orderCode", "customerName", "customerPhone", "description"], threshold: 0.3 }), []);
  const searchedComplaints = useFuseFilter(complaints, debouncedSearch, fuseOptions);

  const filteredComplaints = React.useMemo(() => {
    let r = [...complaints];
    if (statusFilter.size > 0) r = r.filter(c => statusFilter.has(c.status));
    if (typeFilter.size > 0) r = r.filter(c => typeFilter.has(c.type));
    if (assignedToFilter.size > 0) r = r.filter(c => c.assignedTo && assignedToFilter.has(c.assignedTo));
    if (debouncedSearch) { const ids = new Set(searchedComplaints.map(c => c.systemId)); r = r.filter(c => ids.has(c.systemId)); }
    return r;
  }, [complaints, statusFilter, typeFilter, assignedToFilter, debouncedSearch, searchedComplaints]);

  const complaintsByStatus = React.useMemo(() => ({ pending: filteredComplaints.filter(c => c.status === "pending"), investigating: filteredComplaints.filter(c => c.status === "investigating"), resolved: filteredComplaints.filter(c => c.status === "resolved"), cancelled: filteredComplaints.filter(c => c.status === "cancelled") }), [filteredComplaints]);

  const handleComplaintClick = (c: Complaint) => router.push(`/complaints/${c.systemId}`);
  const handleView = React.useCallback((id: string) => router.push(`/complaints/${id}`), [router]);
  const handleEdit = React.useCallback((id: string) => router.push(`/complaints/${id}/edit`), [router]);

  const handleFinish = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy khiếu nại'); return; } setConfirmDialog({ open: true, title: 'Kết thúc khiếu nại', description: 'Bạn có chắc muốn kết thúc?', onConfirm: () => { try { updateComplaint(asSystemId(id), { status: 'resolved', updatedAt: new Date(), resolvedAt: new Date(), timeline: [...c.timeline, { id: asSystemId(`action_${Date.now()}`), actionType: 'resolved', performedBy: asSystemId('Admin'), performedAt: new Date(), note: 'Kết thúc từ Kanban' }] } as Partial<Complaint>); toast.success('Đã kết thúc khiếu nại'); triggerDataUpdate(); } catch (_e) { toast.error('Lỗi kết thúc'); } setConfirmDialog(p => ({ ...p, open: false })); } }); }, [complaints, updateComplaint]);

  const handleOpen = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy'); return; } setConfirmDialog({ open: true, title: 'Mở lại khiếu nại', description: 'Bạn có chắc muốn mở lại?', onConfirm: () => { try { updateComplaint(asSystemId(id), { status: 'investigating', endedBy: undefined, endedAt: undefined, resolvedBy: undefined, resolvedAt: undefined, cancelledBy: undefined, cancelledAt: undefined, updatedAt: new Date(), timeline: [...c.timeline, { id: asSystemId(`action_${Date.now()}`), actionType: 'reopened', performedBy: asSystemId('Admin'), performedAt: new Date(), note: 'Mở lại từ Kanban' }] } as Partial<Complaint>); toast.success('Đã mở lại'); triggerDataUpdate(); } catch (_e) { toast.error('Lỗi'); } setConfirmDialog(p => ({ ...p, open: false })); } }); }, [complaints, updateComplaint]);

  const handleCancel = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy'); return; } setConfirmDialog({ open: true, title: 'Hủy khiếu nại', description: 'Bạn có chắc muốn hủy?', onConfirm: () => { try { updateComplaint(asSystemId(id), { status: 'cancelled', updatedAt: new Date(), cancelledAt: new Date(), timeline: [...c.timeline, { id: asSystemId(`action_${Date.now()}`), actionType: 'cancelled', performedBy: asSystemId('Admin'), performedAt: new Date(), note: 'Hủy từ Kanban' }] } as Partial<Complaint>); toast.success('Đã hủy'); triggerDataUpdate(); } catch (_e) { toast.error('Lỗi'); } setConfirmDialog(p => ({ ...p, open: false })); } }); }, [complaints, updateComplaint]);

  const handleStartInvestigation = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy'); return; } setConfirmDialog({ open: true, title: 'Bắt đầu xử lý', description: 'Bạn có chắc muốn bắt đầu xử lý?', onConfirm: () => { try { updateComplaint(asSystemId(id), { status: 'investigating', updatedAt: new Date(), timeline: [...c.timeline, { id: asSystemId(`action_${Date.now()}`), actionType: 'investigating', performedBy: asSystemId('Admin'), performedAt: new Date(), note: 'Bắt đầu xử lý' }] } as Partial<Complaint>); toast.success('Đã bắt đầu xử lý'); triggerDataUpdate(); } catch (_e) { toast.error('Lỗi'); } setConfirmDialog(p => ({ ...p, open: false })); } }); }, [complaints, updateComplaint]);

  const handleGetLink = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy'); return; } if (!isTrackingEnabled()) { toast.error('Tracking chưa được bật'); return; } try { const url = generateTrackingUrl(c); const code = getTrackingCode(c.id); navigator.clipboard.writeText(url); toast.success(<div className="flex flex-col gap-1"><div className="font-semibold">Đã copy link tracking</div><div className="text-sm text-muted-foreground">Mã: {code}</div></div>, { duration: 5000 }); } catch (_e) { toast.error('Không thể copy'); } }, [complaints]);

  const handleRemind = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) return; toast.success(<div className="flex flex-col gap-1"><div className="font-semibold">Đã gửi nhắc nhở</div><div className="text-sm text-muted-foreground">Khiếu nại: {c.id}</div></div>, { duration: 3000 }); }, [complaints]);

  const handleRowClick = React.useCallback((c: Complaint) => router.push(`/complaints/${c.systemId}`), [router]);
  const columns = React.useMemo(() => getColumns(handleView, handleEdit, handleFinish, handleOpen, handleCancel, handleGetLink, employees, router), [handleView, handleEdit, handleFinish, handleOpen, handleCancel, handleGetLink, employees, router]);

  const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => [{ label: "Trang chủ", href: ROUTES.ROOT }, { label: "Quản lý Khiếu nại", href: ROUTES.INTERNAL.COMPLAINTS, isCurrent: true }], []);
  const actions = React.useMemo(() => [<Button key="live-toggle" variant={isPolling ? "default" : "outline"} size="sm" className="h-9" onClick={togglePolling} title={isPolling ? "Tắt cập nhật" : "Bật cập nhật"}><RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />{isPolling ? "Live" : "Cài đặt"}</Button>, <Button key="view-toggle" onClick={() => setViewMode(v => v === 'kanban' ? 'table' : 'kanban')} variant="outline" size="sm" className="h-9">{viewMode === 'kanban' ? <><Table className="h-4 w-4 mr-2" />Chế độ bảng</> : <><LayoutGrid className="h-4 w-4 mr-2" />Chế độ Kanban</>}</Button>, <Button key="statistics" variant="outline" onClick={() => router.push("/complaints/statistics")} className="h-9"><BarChart3 className="h-4 w-4 mr-2" />Thống kê</Button>, <Button key="create" onClick={() => router.push("/complaints/new")} className="h-9"><Plus className="h-4 w-4 mr-2" />Tạo khiếu nại</Button>], [router, viewMode, isPolling, togglePolling]);
  usePageHeader({ title: "Quản lý Khiếu nại", breadcrumb, showBackButton: false, actions });

  React.useEffect(() => { if (columnOrder.length === 0) setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); }, [columns, columnOrder.length]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [searchQuery, statusFilter, typeFilter, assignedToFilter]);
  React.useEffect(() => { if (!isMobile || viewMode !== 'table') return; const h = () => { const sp = window.scrollY + window.innerHeight; const dh = document.documentElement.scrollHeight; if (sp >= dh * 0.8) setMobileLoadedCount(p => Math.min(p + 20, filteredComplaints.length)); }; window.addEventListener('scroll', h); return () => window.removeEventListener('scroll', h); }, [isMobile, mobileLoadedCount, filteredComplaints.length, viewMode]);

  const pageCount = Math.ceil(filteredComplaints.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => { const s = pagination.pageIndex * pagination.pageSize; return filteredComplaints.slice(s, s + pagination.pageSize); }, [filteredComplaints, pagination.pageIndex, pagination.pageSize]);
  const displayData = isMobile ? filteredComplaints.slice(0, mobileLoadedCount) : paginatedData;
  const allSelectedRows = React.useMemo(() => Object.keys(rowSelection).filter(k => rowSelection[k]).map(id => filteredComplaints.find(c => c.systemId === id)).filter(Boolean) as Complaint[], [rowSelection, filteredComplaints]);

  const handleBulkPrint = React.useCallback((rows: Complaint[]) => { setItemsToPrint(rows); setPrintDialogOpen(true); }, []);
  const handlePrintConfirm = React.useCallback((opt: SimplePrintOptionsResult) => { if (itemsToPrint.length === 0) return; const items = itemsToPrint.map(c => { const br = opt.branchSystemId ? branches.find(b => b.systemId === opt.branchSystemId) : branches.find(b => b.systemId === c.branchSystemId); const ss = br ? createStoreSettings(br) : createStoreSettings(storeInfo); const cd = convertComplaintForPrint(c, {}); return { data: mapComplaintToPrintData(cd, ss), lineItems: mapComplaintLineItems(cd.items || []), paperSize: opt.paperSize }; }); printMultiple('complaint', items); toast.success(`Đang in ${itemsToPrint.length} phiếu`); setItemsToPrint([]); setPrintDialogOpen(false); }, [itemsToPrint, branches, storeInfo, printMultiple]);
  const handleBulkFinish = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn ít nhất 1 khiếu nại'); return; } setConfirmDialog({ open: true, title: 'Kết thúc khiếu nại', description: `Kết thúc ${allSelectedRows.length} khiếu nại?`, onConfirm: () => { toast.success(`Đã kết thúc ${allSelectedRows.length} khiếu nại`); setRowSelection({}); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [allSelectedRows]);
  const handleBulkOpen = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn'); return; } setConfirmDialog({ open: true, title: 'Mở lại khiếu nại', description: `Mở lại ${allSelectedRows.length} khiếu nại?`, onConfirm: () => { toast.success(`Đã mở lại ${allSelectedRows.length} khiếu nại`); setRowSelection({}); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [allSelectedRows]);
  const handleBulkCancel = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn'); return; } setConfirmDialog({ open: true, title: 'Hủy khiếu nại', description: `Hủy ${allSelectedRows.length} khiếu nại?`, onConfirm: () => { toast.success(`Đã hủy ${allSelectedRows.length} khiếu nại`); setRowSelection({}); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [allSelectedRows]);
  const handleBulkGetLink = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn'); return; } if (!isTrackingEnabled()) { toast.error('Tracking chưa được bật'); return; } try { const links = allSelectedRows.map(c => `${getTrackingCode(c.id)}: ${generateTrackingUrl(c)}`); navigator.clipboard.writeText(links.join('\n')); toast.success(`Đã copy ${allSelectedRows.length} link`); } catch (_e) { toast.error('Không thể copy'); } }, [allSelectedRows]);

  const bulkActions: BulkAction<Complaint>[] = React.useMemo(() => [{ label: 'In phiếu', icon: Printer, onSelect: handleBulkPrint }, { label: 'Kết thúc', onSelect: handleBulkFinish }, { label: 'Mở', onSelect: handleBulkOpen }, { label: 'Get Link', onSelect: handleBulkGetLink }, { label: 'Hủy', onSelect: handleBulkCancel }], [handleBulkPrint, handleBulkFinish, handleBulkOpen, handleBulkGetLink, handleBulkCancel]);

  const handleClearFilters = () => { setStatusFilter(new Set()); setTypeFilter(new Set()); setAssignedToFilter(new Set()); setSearchQuery(""); };
  const hasActiveFilters = statusFilter.size > 0 || typeFilter.size > 0 || assignedToFilter.size > 0 || searchQuery !== "";

  return (
    <div className="flex flex-col w-full h-full">
      {viewMode === "kanban" && (<div className="space-y-4"><div className="space-y-2"><div className="flex flex-wrap items-center gap-2"><Input placeholder="Tìm theo mã, đơn hàng, khách hàng..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="h-9 max-w-xs" /><DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /><DataTableFacetedFilter title="Loại khiếu nại" options={typeOptions} selectedValues={typeFilter} onSelectedValuesChange={setTypeFilter} /><DataTableFacetedFilter title="Người xử lý" options={employeeOptions} selectedValues={assignedToFilter} onSelectedValuesChange={setAssignedToFilter} />{hasActiveFilters && <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-9 px-2 lg:px-3">Xóa lọc<X className="ml-2 h-4 w-4" /></Button>}</div></div><div className="flex gap-4 overflow-x-auto pb-4">{(['pending', 'investigating', 'resolved', 'cancelled'] as const).map(status => <KanbanColumn key={status} status={status} complaints={complaintsByStatus[status]} onComplaintClick={handleComplaintClick} employees={employees} onEdit={handleEdit} onGetLink={handleGetLink} onStartInvestigation={handleStartInvestigation} onFinish={handleFinish} onOpen={handleOpen} onCancel={handleCancel} onRemind={handleRemind} />)}</div></div>)}

      {viewMode === "table" && (<><div className="flex items-center justify-end gap-2 mb-3"><Button variant="outline" size="sm" className="h-9" onClick={() => router.push("/settings/complaints")}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button><DataTableColumnCustomizer<Complaint> columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} /></div><PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm theo đơn hàng, khách hàng, SĐT..."><DataTableFacetedFilter title="Trạng thái" options={statusOptions} selectedValues={statusFilter} onSelectedValuesChange={setStatusFilter} /><DataTableFacetedFilter title="Loại khiếu nại" options={typeOptions} selectedValues={typeFilter} onSelectedValuesChange={setTypeFilter} />{employeeOptions.length > 0 && <DataTableFacetedFilter title="Nhân viên xử lý" options={employeeOptions} selectedValues={assignedToFilter} onSelectedValuesChange={setAssignedToFilter} />}{hasActiveFilters && <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-9"><X className="h-4 w-4 mr-1" />Xóa lọc</Button>}</PageFilters><ResponsiveDataTable data={displayData} columns={columns} rowSelection={rowSelection} setRowSelection={setRowSelection} allSelectedRows={allSelectedRows} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} sorting={sorting} setSorting={setSorting} pagination={pagination} setPagination={setPagination} pageCount={pageCount} rowCount={filteredComplaints.length} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} onRowClick={handleRowClick} getRowStyle={getRowStyle} bulkActions={bulkActions} renderMobileCard={c => <ComplaintCard key={c.systemId} complaint={c} onClick={() => handleComplaintClick(c)} employees={employees} />} /></>)}

      {isMobile && viewMode === 'table' && <div className="py-6 text-center">{mobileLoadedCount < filteredComplaints.length ? <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div><span className="text-body-sm">Đang tải thêm...</span></div> : filteredComplaints.length > 0 ? <p className="text-body-sm text-muted-foreground">Đã hiển thị tất cả {filteredComplaints.length} khiếu nại</p> : null}</div>}
      {filteredComplaints.length === 0 && <div className="flex flex-col items-center justify-center py-12 text-center"><AlertCircle className="h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-h4 font-semibold mb-2">Chưa có khiếu nại nào</h3><p className="text-muted-foreground mb-4">{hasActiveFilters ? "Không tìm thấy khiếu nại phù hợp" : "Bắt đầu bằng cách tạo khiếu nại mới"}</p>{!hasActiveFilters && <Button onClick={() => router.push("/complaints/new")} className="h-9"><Plus className="h-4 w-4 mr-2" />Tạo khiếu nại đầu tiên</Button>}</div>}

      <Dialog open={confirmDialog.open} onOpenChange={o => setConfirmDialog(p => ({ ...p, open: o }))}><DialogContent><DialogHeader><DialogTitle>{confirmDialog.title}</DialogTitle><DialogDescription>{confirmDialog.description}</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" className="h-9" onClick={() => setConfirmDialog(p => ({ ...p, open: false }))}>Hủy</Button><Button className="h-9" onClick={confirmDialog.onConfirm}>Xác nhận</Button></DialogFooter></DialogContent></Dialog>
      <SimplePrintOptionsDialog open={printDialogOpen} onOpenChange={setPrintDialogOpen} onConfirm={handlePrintConfirm} selectedCount={itemsToPrint.length} title="In phiếu khiếu nại" />
    </div>
  );
}
