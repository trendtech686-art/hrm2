'use client'
import * as React from "react"
import { useRouter } from 'next/navigation';
import { useAllTasks, useTaskMutations, useTaskStats, type TaskStats } from "./hooks/use-tasks"
import { getColumns } from "./columns"
import type { Task } from "./types"
import type { TaskStatus, TaskPriority } from '@/lib/types/prisma-extended';
import { usePageHeader } from "../../contexts/page-header-context";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { useAuth } from "../../contexts/auth-context";
import { useAllEmployees } from "../employees/hooks/use-all-employees";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageFilters } from "../../components/layout/page-filters"
import { PageToolbar } from "../../components/layout/page-toolbar"
import { StatsBar } from "../../components/shared/stats-bar"
import { Button } from "../../components/ui/button"
import { PlusCircle, FileText, Loader2 } from "lucide-react"
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
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
  
  // Advanced filter state - must be before query that uses it
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});
  
  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, setPagination]);

  // Server-side paginated query
  const { data: tasksData, isLoading: isTasksFetching, isFetching: isTasksFetchingAny } = useAllTasks({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: (advancedFilters.status as TaskStatus) || undefined,
    priority: (advancedFilters.priority as TaskPriority) || undefined,
    assigneeId: advancedFilters.assignee as string | undefined,
    createdFrom: (advancedFilters.dateRange as { from?: string; to?: string } | null)?.from,
    createdTo: (advancedFilters.dateRange as { from?: string; to?: string } | null)?.to,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });

  const tasks = React.useMemo(() => tasksData?.data ?? [], [tasksData?.data]);
  const totalRows = tasksData?.pagination?.total ?? 0;
  const pageCount = tasksData?.pagination?.totalPages ?? 1;
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
  const [viewMode] = React.useState<'list'>('list');

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
  React.useEffect(() => {
    if (colInitRef.current || !columns.length) return;
    const defVisible = ['id', 'title', 'assigneeName', 'assignerName', 'priority', 'status', 'progress', 'startDate', 'dueDate', 'estimatedHours', 'actualHours'];
    const vis: Record<string, boolean> = {};
    columns.forEach(c => { vis[c.id!] = c.id === 'select' || c.id === 'actions' || defVisible.includes(c.id!); });
    setColumnVisibility(vis); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); colInitRef.current = true;
  }, [columns, setColumnVisibility, setColumnOrder]);

  const allSelectedRows = React.useMemo(() => tasks.filter(t => rowSelection[t.systemId]), [tasks, rowSelection]);
  const handleRowClick = (row: Task) => router.push(`/tasks/${row.systemId}`);
  const handleToggleQuickFilter = React.useCallback((id: string) => setActiveQuickFilters(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]), []);
  const quickFilterCounts = React.useMemo(() => { const c: Record<string, number> = {}; quickFilters.forEach(q => { c[q.id] = 0; }); return c; }, [quickFilters]);
  const confirmDelete = () => { if (idToDelete) remove(idToDelete); else { allSelectedRows.forEach(t => remove(t.systemId)); setRowSelection({}); } setIsAlertOpen(false); };

  const bulkActions = [
    { label: "Đánh dấu Đang thực hiện", onSelect: (rows: Task[]) => { rows.forEach(t => update(t.systemId, { ...t, status: "Đang thực hiện" })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} công việc đã chuyển sang "Đang thực hiện"` }); setRowSelection({}); } },
    { label: "Đánh dấu Hoàn thành", onSelect: (rows: Task[]) => { const now = new Date().toISOString().split('T')[0]; rows.forEach(t => update(t.systemId, { ...t, status: "Hoàn thành", progress: 100, completedDate: now })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} công việc đã chuyển sang "Hoàn thành"` }); setRowSelection({}); } },
    { label: "Đánh dấu Chờ duyệt", onSelect: (rows: Task[]) => { rows.forEach(t => update(t.systemId, { ...t, status: "Chờ duyệt" })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} công việc đã chuyển sang "Chờ duyệt"` }); setRowSelection({}); } },
    { label: "Xóa các công việc đã chọn", onSelect: () => { setIdToDelete(null); setIsAlertOpen(true); } }
  ];

  const actions = React.useMemo(() => {
    const btns: React.ReactNode[] = [];
    if (can('approve_tasks')) { btns.push(<Button key="t" variant="outline" size="sm" onClick={() => router.push('/tasks/templates')}><FileText className="mr-2 h-4 w-4" />Mẫu</Button>); }
    if (can('create_tasks')) { btns.push(<Button key="n" onClick={() => router.push('/tasks/new')} size="sm"><PlusCircle className="mr-2 h-4 w-4" />Tạo công việc mới</Button>); }
    return btns;
  }, [router, can]);

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

        <PageToolbar
          search={{ value: search, onChange: setSearch, placeholder: 'Tìm kiếm công việc...' }}
          rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
        />
        <div className="hidden md:block px-4">
          <PageFilters searchValue={search} onSearchChange={setSearch} searchPlaceholder="Tìm kiếm công việc...">
            <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
          </PageFilters>
          <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
        </div>
      </>)}
      {viewMode === 'list' && (<>
        <div className={cn((isTasksFetchingAny && !isTasksFetching) && 'opacity-70 transition-opacity')}>
        <ResponsiveDataTable columns={columns} data={tasks} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={totalRows} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} allSelectedRows={allSelectedRows} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} bulkActions={bulkActions} renderMobileCard={task => <TaskCard task={task} onDelete={id => { setIdToDelete(id); setIsAlertOpen(true); }} />} mobileInfiniteScroll isLoading={isTasksFetching} />
        </div>
      </>)}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{idToDelete ? "Xóa công việc?" : `Xóa ${allSelectedRows.length} công việc?`}</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete} disabled={removeMutation.isPending}>{removeMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xóa...</> : 'Xóa'}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      {isMobile && can('create_tasks') && <FAB onClick={() => router.push('/tasks/new')} />}
    </div>
  );
}
