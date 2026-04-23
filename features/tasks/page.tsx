'use client'
import * as React from "react"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTasks, useTaskMutations, useTaskStats, type TaskStats } from "./hooks/use-tasks"
import { getColumns } from "./columns"
import type { Task } from "./types"
import { usePageHeader } from "../../contexts/page-header-context";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { useAuth } from "../../contexts/auth-context";
import { useAllEmployees } from "../employees/hooks/use-all-employees";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageFilters } from "../../components/layout/page-filters"
import { PageToolbar } from "../../components/layout/page-toolbar"
import { StatsBar } from "../../components/shared/stats-bar"
import { Button } from "../../components/ui/button"
import { Tabs } from "../../components/ui/tabs"
import { MobileTabsList, MobileTabsTrigger } from "../../components/layout/page-section"
import { PlusCircle, LayoutGrid, Table, BarChart3, FileText, Settings, Loader2 } from "lucide-react"
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog"

import { TaskCard } from "./components/task-card";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { toast } from "sonner";
import { QuickFilters, QuickFiltersCompact } from "./components/QuickFilters";
import { createQuickFilters } from "./types-filter";
import type { SystemId } from '../../lib/id-types';
import { useColumnVisibility, useColumnOrder, usePinnedColumns } from "../../hooks/use-column-visibility";
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '../../components/shared/advanced-filter-panel';
import { useFilterPresets } from '../../hooks/use-filter-presets';

const TaskKanbanView = dynamic(() => import("./components/kanban-view").then(mod => ({ default: mod.TaskKanbanView })), { ssr: false, loading: () => <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> });
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { FAB } from '@/components/mobile/fab';

export interface TasksPageProps {
  initialStats?: TaskStats;
}

export function TasksPage({ initialStats }: TasksPageProps = {}) {
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useTaskStats(initialStats);
  
  // Search state at top for server-side search
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  React.useEffect(() => { const t = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(t); }, [search]);

  const { data: tasksData, isFetching: isTasksFetching } = useTasks({ search: debouncedSearch || undefined });
  const allTasks = React.useMemo(() => tasksData?.data ?? [], [tasksData?.data]);
  const { remove: removeMutation, update: updateMutation } = useTaskMutations({
    onSuccess: () => {
      toast.success('Đã cập nhật task');
    },
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    }
  });
  
  // Wrapper functions for legacy code
  const remove = React.useCallback((systemId: string) => {
    removeMutation.mutate(systemId);
  }, [removeMutation]);
  
  const update = React.useCallback((systemId: string, data: Partial<Task>) => {
    updateMutation.mutate({ systemId, data });
  }, [updateMutation]);
  
  const restoreTimer = React.useCallback(() => {
    // Timer restoration logic if needed
  }, []);
  
  const { data: employees } = useAllEmployees();
  const { isMobile } = useBreakpoint();
  const { isAdmin, employee, can } = useAuth();
  const router = useRouter();

  // Only admins / managers can access the full task management page
  // Employees are redirected to /my-tasks
  React.useEffect(() => {
    if (!isAdmin && !can('manage_tasks')) {
      router.replace('/my-tasks');
    }
  }, [isAdmin, can, router]);
  const quickFilters = React.useMemo(() => createQuickFilters({ employeeId: employee?.systemId, username: employee?.fullName }), [employee?.systemId, employee?.fullName]);
  const [activeQuickFilters, setActiveQuickFilters] = React.useState<string[]>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list');
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('tasks');
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' }, { value: 'Chưa bắt đầu', label: 'Chưa bắt đầu' }, { value: 'Đang thực hiện', label: 'Đang thực hiện' },
      { value: 'Chờ duyệt', label: 'Chờ duyệt' }, { value: 'Hoàn thành', label: 'Hoàn thành' }, { value: 'Đã hủy', label: 'Đã hủy' },
    ] },
    { id: 'priority', label: 'Độ ưu tiên', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' }, { value: 'Thấp', label: 'Thấp' }, { value: 'Trung bình', label: 'Trung bình' },
      { value: 'Cao', label: 'Cao' }, { value: 'Khẩn cấp', label: 'Khẩn cấp' },
    ] },
    { id: 'assignee', label: 'Người thực hiện', type: 'select' as const, options: [
      { value: 'all', label: 'Tất cả' }, ...employees.map(e => ({ value: e.systemId, label: e.fullName })),
    ] },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [employees]);
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  const panelValues = React.useMemo(() => ({
    status: advancedFilters.status ?? null,
    priority: advancedFilters.priority ?? null,
    assignee: advancedFilters.assignee ?? null,
    dateRange: advancedFilters.dateRange ?? null,
  }), [advancedFilters]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [setPagination]);

  const defaultColVis = React.useMemo(() => { const cols = getColumns(() => {}, () => {}, () => {}); const v: Record<string, boolean> = {}; cols.forEach(c => { if (c.id) v[c.id] = true; }); return v; }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('tasks', defaultColVis);
  const [columnOrder, setColumnOrder] = useColumnOrder('tasks');
  const [pinnedColumns, setPinnedColumns] = usePinnedColumns('tasks', ['select', 'id']);
  const handleDelete = React.useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  const canEditTasks = can('edit_tasks');
  const canDeleteTasks = can('delete_tasks');
  const showActions = canEditTasks || canDeleteTasks;
  const columns = React.useMemo(() => getColumns(handleDelete, () => {}, router.push, showActions), [handleDelete, router, showActions]);
  const colInitRef = React.useRef(false);

  React.useEffect(() => { restoreTimer(); }, [restoreTimer]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [debouncedSearch, advancedFilters]);
  React.useEffect(() => {
    if (colInitRef.current || !columns.length) return;
    const defVisible = ['id', 'title', 'assigneeName', 'assignerName', 'priority', 'status', 'progress', 'startDate', 'dueDate', 'estimatedHours', 'actualHours'];
    const vis: Record<string, boolean> = {};
    columns.forEach(c => { vis[c.id!] = c.id === 'select' || c.id === 'actions' || defVisible.includes(c.id!); });
    setColumnVisibility(vis); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); colInitRef.current = true;
  }, [columns, setColumnVisibility]);

  const empSysId = employee?.systemId;
  const canViewAllTasks = can('view_tasks') && (isAdmin || can('approve_tasks'));
  const tasks = React.useMemo(() => canViewAllTasks ? allTasks : !empSysId ? allTasks : allTasks.filter(t => t.assignees?.some(a => a.employeeSystemId === empSysId) || t.assigneeId === empSysId), [canViewAllTasks, allTasks, empSysId]);
  // Server-side search - filter only by facets
  const filteredData = React.useMemo(() => {
    let d = tasks;
    const status = advancedFilters.status as string | undefined;
    const priority = advancedFilters.priority as string | undefined;
    const assignee = advancedFilters.assignee as string | undefined;
    const dateRange = advancedFilters.dateRange as { from?: string; to?: string } | null;
    if (status && status !== 'all') d = d.filter(r => r.status === status);
    if (priority && priority !== 'all') d = d.filter(r => r.priority === priority);
    if (assignee && assignee !== 'all') d = d.filter(r => r.assigneeId === assignee);
    if (dateRange?.from) { const from = new Date(dateRange.from).getTime(); d = d.filter(r => r.createdAt && new Date(r.createdAt).getTime() >= from); }
    if (dateRange?.to) { const to = new Date(dateRange.to).getTime() + 86400000; d = d.filter(r => r.createdAt && new Date(r.createdAt).getTime() < to); }
    if (activeQuickFilters.length) { const fns = quickFilters.filter(q => activeQuickFilters.includes(q.id)).map(q => q.filter); d = d.filter(t => fns.every(fn => fn(t))); }
    return d;
  }, [tasks, advancedFilters, activeQuickFilters, quickFilters]);

  React.useEffect(() => {
    if (!isMobile) return;
    const onScroll = () => { if ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight > 0.8 && mobileLoadedCount < filteredData.length) setMobileLoadedCount(p => Math.min(p + 20, filteredData.length)); };
    window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, mobileLoadedCount, filteredData.length]);

  const sortedData = React.useMemo(() => {
    const d = [...filteredData];
    if (!sorting.id) return d;
    d.sort((a, b) => { const av = (a as Record<string, unknown>)[sorting.id], bv = (b as Record<string, unknown>)[sorting.id]; if (!av) return 1; if (!bv) return -1; if (sorting.id === 'createdAt' || sorting.id === 'dueDate') { const at = av ? new Date(av as string).getTime() : 0, bt = bv ? new Date(bv as string).getTime() : 0; return sorting.desc ? bt - at : at - bt; } return av < bv ? (sorting.desc ? 1 : -1) : av > bv ? (sorting.desc ? -1 : 1) : 0; });
    return d;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;
  const allSelectedRows = React.useMemo(() => tasks.filter(t => rowSelection[t.systemId]), [tasks, rowSelection]);
  const handleRowClick = (row: Task) => router.push(`/tasks/${row.systemId}`);
  const handleToggleQuickFilter = React.useCallback((id: string) => setActiveQuickFilters(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const quickFilterCounts = React.useMemo(() => { const c: Record<string, number> = {}; quickFilters.forEach(q => { c[q.id] = tasks.filter(q.filter).length; }); return c; }, [tasks, quickFilters]);
  const confirmDelete = () => { if (idToDelete) remove(idToDelete); else { allSelectedRows.forEach(t => remove(t.systemId)); setRowSelection({}); } setIsAlertOpen(false); };

  const bulkActions = [
    { label: "Đánh dấu Đang thực hiện", onSelect: (rows: Task[]) => { rows.forEach(t => update(t.systemId, { ...t, status: "Đang thực hiện" })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} công việc đã chuyển sang "Đang thực hiện"` }); setRowSelection({}); } },
    { label: "Đánh dấu Hoàn thành", onSelect: (rows: Task[]) => { const now = new Date().toISOString().split('T')[0]; rows.forEach(t => update(t.systemId, { ...t, status: "Hoàn thành", progress: 100, completedDate: now })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} công việc đã chuyển sang "Hoàn thành"` }); setRowSelection({}); } },
    { label: "Đánh dấu Chờ duyệt", onSelect: (rows: Task[]) => { rows.forEach(t => update(t.systemId, { ...t, status: "Chờ duyệt" })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} công việc đã chuyển sang "Chờ duyệt"` }); setRowSelection({}); } },
    { label: "Xóa các công việc đã chọn", onSelect: () => { setIdToDelete(null); setIsAlertOpen(true); } }
  ];

  const actions = React.useMemo(() => {
    const btns = [<Tabs key={`vt-${viewMode}`} value={viewMode} onValueChange={v => setViewMode(v as 'list' | 'kanban')} className="h-9"><MobileTabsList><MobileTabsTrigger value="list"><Table className="mr-2 h-4 w-4" />Danh sách</MobileTabsTrigger><MobileTabsTrigger value="kanban"><LayoutGrid className="mr-2 h-4 w-4" />Kanban</MobileTabsTrigger></MobileTabsList></Tabs>];
    if (can('approve_tasks')) { btns.push(<Button key="t" variant="outline" size="sm" className="h-9" onClick={() => router.push('/tasks/templates')}><FileText className="mr-2 h-4 w-4" />Mẫu</Button>, <Button key="d" variant="outline" size="sm" className="h-9" onClick={() => router.push('/tasks/dashboard')}><BarChart3 className="mr-2 h-4 w-4" />Dashboard</Button>); }
    if (can('create_tasks')) { btns.push(<Button key="n" onClick={() => router.push('/tasks/new')} size="sm" className="h-9"><PlusCircle className="mr-2 h-4 w-4" />Tạo công việc mới</Button>); }
    return btns;
  }, [viewMode, router, can]);

  usePageHeader({ title: 'Quản lý công việc', actions, breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Quản lý công việc', href: '/tasks', isCurrent: true }] });

  return (
    <div className="space-y-2">
      <div className="px-1">{isMobile ? <QuickFiltersCompact activeFilters={activeQuickFilters} onToggleFilter={handleToggleQuickFilter} taskCounts={quickFilterCounts} filters={quickFilters} /> : <QuickFilters activeFilters={activeQuickFilters} onToggleFilter={handleToggleQuickFilter} taskCounts={quickFilterCounts} filters={quickFilters} />}</div>
      {viewMode === 'list' && (<>
        {/* Stats Bar - instant display from Server Component */}
        <StatsBar
          className="mb-2"
          items={[
            { key: 'todo', label: 'Chờ thực hiện', value: stats?.todo ?? 0 },
            { key: 'inProgress', label: 'Đang thực hiện', value: stats?.inProgress ?? 0 },
            { key: 'completed', label: 'Hoàn thành', value: stats?.completed ?? 0 },
            { key: 'overdue', label: 'Quá hạn', value: stats?.overdue ?? 0 },
          ]}
        />

        {!isMobile && <PageToolbar leftActions={<>{can('edit_settings') && <Button variant="outline" size="sm" onClick={() => router.push('/settings/tasks')}><Settings className="h-4 w-4 mr-2" />Cài đặt</Button>}</>} rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} />}
        <PageFilters searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm kiếm công việc...">
          <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
        </PageFilters>
        <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      </>)}
      {viewMode === 'kanban' && <TaskKanbanView tasks={filteredData} onTaskClick={handleRowClick} employees={employees} onTaskUpdate={update} />}
      {viewMode === 'list' && (<>
        <div className={cn(isTasksFetching && 'opacity-70 transition-opacity')}>
        <ResponsiveDataTable columns={columns} data={displayData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} allSelectedRows={allSelectedRows} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} bulkActions={bulkActions} renderMobileCard={task => <TaskCard task={task} onDelete={id => { setIdToDelete(id); setIsAlertOpen(true); }} />} />
        </div>
        {isMobile && mobileLoadedCount < filteredData.length && <div className="flex justify-center py-4"><span className="text-sm text-muted-foreground">Hiển thị {mobileLoadedCount} / {filteredData.length} • Cuộn xuống để xem thêm</span></div>}
      </>)}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{idToDelete ? "Xóa công việc?" : `Xóa ${allSelectedRows.length} công việc?`}</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} disabled={removeMutation.isPending}>{removeMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xóa...</> : 'Xóa'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      {isMobile && can('create_tasks') && <FAB onClick={() => router.push('/tasks/new')} />}
    </div>
  );
}
