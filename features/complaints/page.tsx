'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Plus, X, AlertCircle, Settings } from "lucide-react";
import { toast } from "sonner";
import { asSystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import { ROUTES } from "@/lib/router";

import type { Complaint } from "./types";
import { useComplaints, useComplaintMutations, useComplaintStats, type ComplaintStats } from "./hooks/use-complaints";
import { useAllEmployees } from "../employees/hooks/use-all-employees";
import { useDebounce } from '@/hooks/use-debounce';
import { checkOverdue } from "./sla-utils";
import { usePageHeader } from "@/contexts/page-header-context";
import { useBreakpoint } from "@/contexts/breakpoint-context";
import { useComplaintsSettings } from "../settings/complaints/hooks/use-complaints-settings";
import { generateTrackingUrl, getTrackingCode } from "./tracking-utils";
import { useColumnLayout } from "@/hooks/use-column-visibility";
import type { BreadcrumbItem } from "@/lib/breadcrumb-system";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageFilters } from "@/components/layout/page-filters";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "@/components/data-table/dynamic-column-customizer";
import { ResponsiveDataTable, type BulkAction } from "@/components/data-table/responsive-data-table";
import { StatsBar } from "@/components/shared/stats-bar";
import { getColumns } from "./columns";

// Dynamic imports for heavy components
const ComplaintCard = dynamic(() => import('./components/complaint-card').then(mod => ({ default: mod.ComplaintCard })), { ssr: false });

import { parseTailwindClass } from "@/components/ui/tailwind-color-picker";
import { useAuth } from "@/contexts/auth-context";
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { FAB } from '@/components/mobile/fab';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { ListPageShell } from '@/components/layout/page-section';

function parseColorClass(colorClass: string): React.CSSProperties {
  if (!colorClass || typeof colorClass !== 'string') return {};
  const parts = colorClass.split(' ');
  const bgClass = parts.find(c => c.startsWith('bg-'));
  if (!bgClass) return {};
  const parsed = parseTailwindClass(bgClass);
  return parsed ? { backgroundColor: parsed.hex } : {};
}

export interface ComplaintsPageProps {
  initialStats?: ComplaintStats;
}

export function ComplaintsPage({ initialStats }: ComplaintsPageProps = {}) {
  // Permission checks
  const { can } = useAuth();
  const canCreate = can('create_complaints');
  const _canEdit = can('edit_complaints');
  const _canResolve = can('resolve_complaints');
  const canEditSettings = can('edit_settings');
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useComplaintStats(initialStats);
  
  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { update: updateMutation } = useComplaintMutations({
    onSuccess: () => {
      toast.success('Đã cập nhật khiếu nại');
    },
    onError: (err) => toast.error(err.message)
  });
  const { data: employees } = useAllEmployees({ enabled: false });


  // ✅ Settings from React Query (DB via server actions)
  const { data: complaintsSettings } = useComplaintsSettings();
  const storeCardColors = complaintsSettings.cardColors;
  const storeComplaintTypes = complaintsSettings.complaintTypes;

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  const [confirmDialog, setConfirmDialog] = React.useState<{ open: boolean; title: string; description: string; onConfirm: () => void }>({ open: false, title: '', description: '', onConfirm: () => {} });

  // ✅ DB-persisted column layout
  const [columnLayout, columnLayoutSetters] = useColumnLayout('complaints', React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: ['select', 'complaintId'] as string[] }), []));
  const { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns } = columnLayout;
  const { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns } = columnLayoutSetters;

  const cardColors = storeCardColors;

  const getRowStyle = React.useCallback((c: Complaint): React.CSSProperties => {
    const od = checkOverdue(c);
    if (cardColors.enableOverdueColor && (od.isOverdueResponse || od.isOverdueResolve)) return parseColorClass(cardColors.overdueColor);
    if (cardColors.enablePriorityColors && c.priority) { const pc = cardColors.priorityColors[c.priority]; if (pc) return parseColorClass(pc); }
    if (cardColors.enableStatusColors) { const sc = cardColors.statusColors[c.status as keyof typeof cardColors.statusColors]; if (sc) return parseColorClass(sc); }
    return {};
  }, [cardColors]);

  const statusOptions = React.useMemo(() => [
    { label: "Chờ xử lý", value: "OPEN" },
    { label: "Đang xử lý", value: "IN_PROGRESS" },
    { label: "Đã giải quyết", value: "RESOLVED" },
    { label: "Đã đóng", value: "CLOSED" },
    // Legacy lowercase (API may map these)
    { label: "Chờ xử lý", value: "pending" },
    { label: "Đang kiểm tra", value: "investigating" },
    { label: "Đã giải quyết", value: "resolved" },
    { label: "Đã hủy", value: "cancelled" },
  ], []);
  const typeOptions = React.useMemo(() => {
    const types = storeComplaintTypes.filter(t => t.isActive);
    if (types.length > 0) return types.map(t => ({ label: t.name, value: t.id }));
    return [
      { label: "Sai hàng", value: "wrong-product" },
      { label: "Thiếu hàng", value: "missing-items" },
      { label: "Đóng gói sai", value: "wrong-packaging" },
      { label: "Lỗi do kho", value: "warehouse-defect" },
      { label: "Tình trạng hàng", value: "product-condition" },
    ];
  }, [storeComplaintTypes]);
  const priorityOptions = React.useMemo(() => [
    { label: 'Tất cả', value: 'all' },
    { label: 'Thấp', value: 'LOW' },
    { label: 'Trung bình', value: 'MEDIUM' },
    { label: 'Cao', value: 'HIGH' },
    { label: 'Khẩn cấp', value: 'URGENT' },
  ], []);
  const employeeOptions = React.useMemo(() => employees.map(e => ({ label: e.fullName, value: e.systemId })), [employees]);

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('complaints');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'multi-select' as const, options: statusOptions },
    { id: 'type', label: 'Loại khiếu nại', type: 'multi-select' as const, options: typeOptions },
    { id: 'priority', label: 'Độ ưu tiên', type: 'select' as const, options: priorityOptions },
    { id: 'assignedTo', label: 'Nhân viên xử lý', type: 'multi-select' as const, options: employeeOptions },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [statusOptions, typeOptions, priorityOptions, employeeOptions]);
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  const panelValues = React.useMemo(() => ({
    status: advancedFilters.status ?? [],
    type: advancedFilters.type ?? [],
    priority: advancedFilters.priority ?? null,
    assignedTo: advancedFilters.assignedTo ?? [],
    dateRange: advancedFilters.dateRange ?? null,
  }), [advancedFilters]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [setPagination]);

  // ✅ Server-side filters — push ALL filters to API
  const serverFilters = React.useMemo(() => {
    const statuses = advancedFilters.status as string[] | undefined;
    const types = advancedFilters.type as string[] | undefined;
    const assignees = advancedFilters.assignedTo as string[] | undefined;
    const priority = advancedFilters.priority as string | undefined;
    const dateRange = advancedFilters.dateRange as { from?: string; to?: string } | null;
    return {
      search: debouncedSearch || undefined,
      status: statuses?.length === 1 ? statuses[0] : undefined,
      priority: priority && priority !== 'all' ? priority : undefined,
      type: types?.length === 1 ? types[0] : undefined,
      assignedTo: assignees?.length === 1 ? assignees[0] : undefined,
      startDate: dateRange?.from || undefined,
      endDate: dateRange?.to || undefined,
      sortBy: sorting.id,
      sortOrder: sorting.desc ? 'desc' as const : 'asc' as const,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    };
  }, [debouncedSearch, advancedFilters, sorting, pagination]);

  const { data: complaintsData, isLoading: isLoadingComplaints, isFetching: isComplaintsFetching, isError: isComplaintsError, error: complaintsError } = useComplaints(serverFilters);

  // Show toast when data fetch fails
  React.useEffect(() => {
    if (isComplaintsError && complaintsError) {
      toast.error(`Lỗi tải danh sách khiếu nại: ${complaintsError.message}`);
    }
  }, [isComplaintsError, complaintsError]);

  const complaints = React.useMemo(() => complaintsData?.data ?? [], [complaintsData?.data]);
  const totalRows = complaintsData?.pagination?.total ?? 0;
  const pageCount = complaintsData?.pagination?.totalPages ?? 0;

  // Reset pagination on filter change
  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedSearch, advancedFilters, setPagination]);

  const handleComplaintClick = (c: Complaint) => router.push(`/complaints/${c.systemId}`);
  const handleView = React.useCallback((id: string) => router.push(`/complaints/${id}`), [router]);
  const handleEdit = React.useCallback((id: string) => router.push(`/complaints/${id}/edit`), [router]);

  const handleFinish = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy khiếu nại'); return; } setConfirmDialog({ open: true, title: 'Kết thúc khiếu nại', description: 'Bạn có chắc muốn kết thúc?', onConfirm: () => { updateMutation.mutate({ systemId: id, data: { status: 'resolved', updatedAt: new Date(), resolvedAt: new Date(), timeline: [...(c.timeline || []), { id: asSystemId(generateSubEntityId('ACTION')), actionType: 'resolved', performedBy: asSystemId('Admin'), performedAt: new Date(), note: 'Kết thúc khiếu nại' }] } }); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [complaints, updateMutation]);

  const handleOpen = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy'); return; } setConfirmDialog({ open: true, title: 'Mở lại khiếu nại', description: 'Bạn có chắc muốn mở lại?', onConfirm: () => { updateMutation.mutate({ systemId: id, data: { status: 'investigating', endedBy: undefined, endedAt: undefined, resolvedBy: undefined, resolvedAt: undefined, cancelledBy: undefined, cancelledAt: undefined, updatedAt: new Date(), timeline: [...(c.timeline || []), { id: asSystemId(generateSubEntityId('ACTION')), actionType: 'reopened', performedBy: asSystemId('Admin'), performedAt: new Date(), note: 'Mở lại khiếu nại' }] } }); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [complaints, updateMutation]);

  const handleCancel = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy'); return; } setConfirmDialog({ open: true, title: 'Hủy khiếu nại', description: 'Bạn có chắc muốn hủy?', onConfirm: () => { updateMutation.mutate({ systemId: id, data: { status: 'cancelled', updatedAt: new Date(), cancelledAt: new Date(), timeline: [...(c.timeline || []), { id: asSystemId(generateSubEntityId('ACTION')), actionType: 'cancelled', performedBy: asSystemId('Admin'), performedAt: new Date(), note: 'Hủy khiếu nại' }] } }); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [complaints, updateMutation]);

  const trackingEnabled = complaintsSettings.publicTracking?.enabled ?? false;
  const handleGetLink = React.useCallback((id: string) => { const c = complaints.find(x => x.systemId === id); if (!c) { toast.error('Không tìm thấy'); return; } if (!trackingEnabled) { toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.'); return; } try { const url = generateTrackingUrl(c); const code = getTrackingCode(c.id); navigator.clipboard.writeText(url); toast.success(<div className="flex flex-col gap-1"><div className="font-semibold">Đã copy link tracking</div><div className="text-sm text-muted-foreground">Mã: {code}</div></div>, { duration: 5000 }); } catch (_e) { toast.error('Không thể copy'); } }, [complaints, trackingEnabled]);

  const handleRowClick = React.useCallback((c: Complaint) => router.push(`/complaints/${c.systemId}`), [router]);
  const columns = React.useMemo(() => getColumns(handleView, handleEdit, handleFinish, handleOpen, handleCancel, handleGetLink, employees, router, storeComplaintTypes, trackingEnabled), [handleView, handleEdit, handleFinish, handleOpen, handleCancel, handleGetLink, employees, router, storeComplaintTypes, trackingEnabled]);

  // Initialize default column visibility if empty (first load before DB data arrives)
  const defaultVisibleCols = React.useMemo(() => new Set(['complaintId', 'orderCode', 'customerName', 'type', 'priority', 'status', 'verification', 'slaStatus', 'assignedTo', 'createdAt', 'actions']), []);
  const buildDefaultVisibility = React.useCallback(() => Object.fromEntries(columns.map(c => [c.id, c.id === 'select' || c.id === 'actions' || defaultVisibleCols.has(c.id!)])), [columns, defaultVisibleCols]);
  const buildDefaultOrder = React.useCallback(() => columns.map(c => c.id).filter(Boolean) as string[], [columns]);
  const defaultsInitialized = React.useRef(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => { if (columns.length === 0 || defaultsInitialized.current) return; defaultsInitialized.current = true; if (Object.keys(columnVisibility).length === 0) setColumnVisibility(buildDefaultVisibility()); if (columnOrder.length === 0) setColumnOrder(buildDefaultOrder()); }, []);

  const breadcrumb = React.useMemo<BreadcrumbItem[]>(() => [{ label: "Trang chủ", href: ROUTES.ROOT }, { label: "Quản lý Khiếu nại", href: ROUTES.INTERNAL.COMPLAINTS, isCurrent: true }], []);
  const actions = React.useMemo(() => [canCreate && <Button key="create" onClick={() => router.push("/complaints/new")}><Plus className="h-4 w-4 mr-2" />Tạo khiếu nại</Button>].filter(Boolean), [router, canCreate]);
  usePageHeader({ title: "Quản lý Khiếu nại", breadcrumb, showBackButton: false, actions });

  const allSelectedRows = React.useMemo(() => Object.keys(rowSelection).filter(k => rowSelection[k]).map(id => complaints.find(c => c.systemId === id)).filter(Boolean) as Complaint[], [rowSelection, complaints]);


  const handleBulkFinish = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn ít nhất 1 khiếu nại'); return; } setConfirmDialog({ open: true, title: 'Kết thúc khiếu nại', description: `Kết thúc ${allSelectedRows.length} khiếu nại?`, onConfirm: () => { toast.success(`Đã kết thúc ${allSelectedRows.length} khiếu nại`); setRowSelection({}); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [allSelectedRows]);
  const handleBulkOpen = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn'); return; } setConfirmDialog({ open: true, title: 'Mở lại khiếu nại', description: `Mở lại ${allSelectedRows.length} khiếu nại?`, onConfirm: () => { toast.success(`Đã mở lại ${allSelectedRows.length} khiếu nại`); setRowSelection({}); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [allSelectedRows]);
  const handleBulkCancel = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn'); return; } setConfirmDialog({ open: true, title: 'Hủy khiếu nại', description: `Hủy ${allSelectedRows.length} khiếu nại?`, onConfirm: () => { toast.success(`Đã hủy ${allSelectedRows.length} khiếu nại`); setRowSelection({}); setConfirmDialog(p => ({ ...p, open: false })); } }); }, [allSelectedRows]);
  const handleBulkGetLink = React.useCallback(() => { if (allSelectedRows.length === 0) { toast.error('Vui lòng chọn'); return; } if (!trackingEnabled) { toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.'); return; } try { const links = allSelectedRows.map(c => `${getTrackingCode(c.id)}: ${generateTrackingUrl(c)}`); navigator.clipboard.writeText(links.join('\n')); toast.success(`Đã copy ${allSelectedRows.length} link`); } catch (_e) { toast.error('Không thể copy'); } }, [allSelectedRows, trackingEnabled]);

  const bulkActions: BulkAction<Complaint>[] = React.useMemo(() => [{ label: 'Kết thúc', onSelect: handleBulkFinish }, { label: 'Mở', onSelect: handleBulkOpen }, { label: 'Get Link', onSelect: handleBulkGetLink }, { label: 'Hủy', onSelect: handleBulkCancel }], [handleBulkFinish, handleBulkOpen, handleBulkGetLink, handleBulkCancel]);

  const handleClearFilters = () => { setAdvancedFilters({}); setSearchQuery(""); };
  const hasActiveFilters = Object.values(advancedFilters).some(v => v != null && v !== '' && !(Array.isArray(v) && v.length === 0)) || searchQuery !== "";

  return (
    <ListPageShell>
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        className="mb-4"
        items={[
          { key: 'total', label: 'Tổng khiếu nại', value: stats?.total ?? 0 },
          { key: 'pending', label: 'Chờ xử lý', value: stats?.pending ?? 0 },
          { key: 'inProgress', label: 'Đang xử lý', value: stats?.inProgress ?? 0 },
          { key: 'resolved', label: 'Đã giải quyết', value: stats?.resolved ?? 0 },
        ]}
      />

      <div className="flex items-center justify-end gap-2 mb-3">
        {canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push("/settings/complaints")}>
          <Settings className="h-4 w-4 mr-2" />Cài đặt
        </Button>}
        <DataTableColumnCustomizer<Complaint> columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />
      </div>
      
      <PageFilters searchValue={searchQuery} onSearchChange={setSearchQuery} searchPlaceholder="Tìm theo đơn hàng, khách hàng, SĐT...">
        {hasActiveFilters && <Button variant="ghost" size="sm" onClick={handleClearFilters}><X className="h-4 w-4 mr-1" />Xóa lọc</Button>}
        <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      <div className={cn(isComplaintsFetching && !isLoadingComplaints && 'opacity-70 transition-opacity')}>
      <ResponsiveDataTable 
        data={complaints} 
        columns={columns} 
        rowSelection={rowSelection} 
        setRowSelection={setRowSelection} 
        allSelectedRows={allSelectedRows} 
        columnVisibility={columnVisibility} 
        setColumnVisibility={setColumnVisibility} 
        columnOrder={columnOrder} 
        setColumnOrder={setColumnOrder} 
        sorting={sorting} 
        setSorting={setSorting} 
        pagination={pagination} 
        setPagination={setPagination} 
        pageCount={pageCount} 
        rowCount={totalRows} 
        pinnedColumns={pinnedColumns} 
        setPinnedColumns={setPinnedColumns} 
        isLoading={isLoadingComplaints}
        onRowClick={handleRowClick} 
        getRowStyle={getRowStyle} 
        bulkActions={bulkActions} 
        renderMobileCard={c => <ComplaintCard key={c.systemId} complaint={c} onClick={() => handleComplaintClick(c)} employees={employees} />} 
        mobileInfiniteScroll
      />
      </div>

      {complaints.length === 0 && !isLoadingComplaints && <div className="flex flex-col items-center justify-center py-12 text-center"><AlertCircle className="h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-h4 font-semibold mb-2">Chưa có khiếu nại nào</h3><p className="text-muted-foreground mb-4">{hasActiveFilters ? "Không tìm thấy khiếu nại phù hợp" : "Bắt đầu bằng cách tạo khiếu nại mới"}</p>{!hasActiveFilters && <Button onClick={() => router.push("/complaints/new")}><Plus className="h-4 w-4 mr-2" />Tạo khiếu nại đầu tiên</Button>}</div>}

      <Dialog open={confirmDialog.open} onOpenChange={o => setConfirmDialog(p => ({ ...p, open: o }))}><DialogContent><DialogHeader><DialogTitle>{confirmDialog.title}</DialogTitle><DialogDescription>{confirmDialog.description}</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setConfirmDialog(p => ({ ...p, open: false }))}>Hủy</Button><Button onClick={confirmDialog.onConfirm}>Xác nhận</Button></DialogFooter></DialogContent></Dialog>
      {isMobile && canCreate && <FAB onClick={() => router.push('/complaints/new')} />}
    </ListPageShell>
  );
}
