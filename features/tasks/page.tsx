'use client'
import * as React from "react"
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useTaskStore } from "./store"
import { getColumns } from "./columns"
import type { Task, TaskStatus, TaskPriority } from "./types"
import { usePageHeader } from "../../contexts/page-header-context";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { useAuth } from "../../contexts/auth-context";
import { useAllEmployees } from "../employees/hooks/use-all-employees";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageFilters } from "../../components/layout/page-filters"
import { PageToolbar } from "../../components/layout/page-toolbar"
import { Button } from "../../components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { PlusCircle, LayoutGrid, Table, BarChart3, FileText, Repeat, Settings } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { TaskCard } from "./components/task-card";
import { useFuseFilter } from "../../hooks/use-fuse-search";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { toast } from "sonner";
import { QuickFilters, QuickFiltersCompact } from "./components/QuickFilters";
import { createQuickFilters } from "./types-filter";
import type { SystemId } from '../../lib/id-types';
import { useColumnVisibility } from "../../hooks/use-column-visibility";

const TaskKanbanView = dynamic(() => import("./components/kanban-view").then(mod => ({ default: mod.TaskKanbanView })), { ssr: false, loading: () => <div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> });

export function TasksPage() {
  const { data: allTasks, remove, update, restoreTimer } = useTaskStore();
  const { data: employees } = useAllEmployees();
  const { isMobile } = useBreakpoint();
  const { isAdmin, employee } = useAuth();
  const router = useRouter();
  const quickFilters = React.useMemo(() => createQuickFilters({ employeeId: employee?.systemId, username: employee?.fullName }), [employee?.systemId, employee?.fullName]);
  const [activeQuickFilters, setActiveQuickFilters] = React.useState<string[]>([]);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list');
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<"all" | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<"all" | TaskPriority>('all');
  const [assigneeFilter, setAssigneeFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const defaultColVis = React.useMemo(() => { const cols = getColumns(() => {}, () => {}, () => {}); const v: Record<string, boolean> = {}; cols.forEach(c => { if (c.id) v[c.id] = true; }); return v; }, []);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('tasks', defaultColVis);
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  const handleDelete = React.useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  const columns = React.useMemo(() => getColumns(handleDelete, () => {}, router.push, isAdmin), [handleDelete, router, isAdmin]);
  const colInitRef = React.useRef(false);

  React.useEffect(() => { restoreTimer(); }, [restoreTimer]);
  React.useEffect(() => { setMobileLoadedCount(20); }, [globalFilter, statusFilter, priorityFilter, assigneeFilter]);
  React.useEffect(() => {
    if (colInitRef.current || !columns.length) return;
    const defVisible = ['id', 'title', 'assigneeName', 'assignerName', 'priority', 'status', 'progress', 'startDate', 'dueDate', 'estimatedHours', 'actualHours'];
    const vis: Record<string, boolean> = {};
    columns.forEach(c => { vis[c.id!] = c.id === 'select' || c.id === 'actions' || defVisible.includes(c.id!); });
    setColumnVisibility(vis); setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]); colInitRef.current = true;
  }, [columns, setColumnVisibility]);

  const empSysId = employee?.systemId;
  const tasks = React.useMemo(() => isAdmin ? allTasks : !empSysId ? allTasks : allTasks.filter(t => t.assignees?.some(a => a.employeeSystemId === empSysId) || t.assigneeId === empSysId), [isAdmin, allTasks, empSysId]);
  const searchedTasks = useFuseFilter(tasks, globalFilter, React.useMemo(() => ({ keys: ["id", "title", "assigneeName", "assignerName", "description"] }), []));
  const filteredData = React.useMemo(() => {
    let d = searchedTasks;
    if (statusFilter !== 'all') d = d.filter(r => r.status === statusFilter);
    if (priorityFilter !== 'all') d = d.filter(r => r.priority === priorityFilter);
    if (assigneeFilter !== 'all') d = d.filter(r => r.assigneeId === assigneeFilter);
    if (activeQuickFilters.length) { const fns = quickFilters.filter(q => activeQuickFilters.includes(q.id)).map(q => q.filter); d = d.filter(t => fns.every(fn => fn(t))); }
    return d;
  }, [searchedTasks, statusFilter, priorityFilter, assigneeFilter, activeQuickFilters, quickFilters]);

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
    { label: "Đánh dấu Đang chờ", onSelect: (rows: Task[]) => { rows.forEach(t => update(t.systemId, { ...t, status: "Đang chờ" })); toast.success("Đã cập nhật trạng thái", { description: `${rows.length} công việc đã chuyển sang "Đang chờ"` }); setRowSelection({}); } },
    { label: "Xóa các công việc đã chọn", onSelect: () => { setIdToDelete(null); setIsAlertOpen(true); } }
  ];

  const actions = React.useMemo(() => {
    const btns = [<Tabs key="vt" value={viewMode} onValueChange={v => setViewMode(v as 'list' | 'kanban')} className="h-9"><TabsList className="h-9"><TabsTrigger value="list" className="h-8 px-3"><Table className="mr-2 h-4 w-4" />Danh sách</TabsTrigger><TabsTrigger value="kanban" className="h-8 px-3"><LayoutGrid className="mr-2 h-4 w-4" />Kanban</TabsTrigger></TabsList></Tabs>];
    if (isAdmin) { btns.push(<Button key="r" variant="outline" size="sm" className="h-9" onClick={() => router.push('/tasks/recurring')}><Repeat className="mr-2 h-4 w-4" />Lặp lại</Button>, <Button key="t" variant="outline" size="sm" className="h-9" onClick={() => router.push('/tasks/templates')}><FileText className="mr-2 h-4 w-4" />Mẫu</Button>, <Button key="f" variant="outline" size="sm" className="h-9" onClick={() => router.push('/tasks/fields')}><Settings className="mr-2 h-4 w-4" />Trường</Button>, <Button key="d" variant="outline" size="sm" className="h-9" onClick={() => router.push('/tasks/dashboard')}><BarChart3 className="mr-2 h-4 w-4" />Dashboard</Button>, <Button key="n" onClick={() => router.push('/tasks/new')} size="sm" className="h-9"><PlusCircle className="mr-2 h-4 w-4" />Tạo công việc mới</Button>); }
    return btns;
  }, [viewMode, router, isAdmin]);

  usePageHeader({ title: 'Quản lý công việc', actions, breadcrumb: [{ label: 'Trang chủ', href: '/', isCurrent: false }, { label: 'Quản lý công việc', href: '/tasks', isCurrent: true }] });

  return (
    <div className="space-y-4">
      <div className="px-1">{isMobile ? <QuickFiltersCompact activeFilters={activeQuickFilters} onToggleFilter={handleToggleQuickFilter} taskCounts={quickFilterCounts} filters={quickFilters} /> : <QuickFilters activeFilters={activeQuickFilters} onToggleFilter={handleToggleQuickFilter} taskCounts={quickFilterCounts} filters={quickFilters} />}</div>
      {viewMode === 'list' && (<>
        {!isMobile && <PageToolbar rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />} />}
        <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm công việc...">
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as typeof statusFilter)}><SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Lọc trạng thái" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả trạng thái</SelectItem><SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem><SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem><SelectItem value="Đang chờ">Đang chờ</SelectItem><SelectItem value="Hoàn thành">Hoàn thành</SelectItem><SelectItem value="Đã hủy">Đã hủy</SelectItem></SelectContent></Select>
          <Select value={priorityFilter} onValueChange={v => setPriorityFilter(v as typeof priorityFilter)}><SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Độ ưu tiên" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả độ ưu tiên</SelectItem><SelectItem value="Thấp">Thấp</SelectItem><SelectItem value="Trung bình">Trung bình</SelectItem><SelectItem value="Cao">Cao</SelectItem><SelectItem value="Khẩn cấp">Khẩn cấp</SelectItem></SelectContent></Select>
          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}><SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Người thực hiện" /></SelectTrigger><SelectContent><SelectItem value="all">Tất cả</SelectItem>{employees.map(e => <SelectItem key={e.systemId} value={e.systemId}>{e.fullName}</SelectItem>)}</SelectContent></Select>
        </PageFilters>
      </>)}
      {viewMode === 'kanban' && <TaskKanbanView tasks={filteredData} onTaskClick={handleRowClick} employees={employees} onTaskUpdate={update} />}
      {viewMode === 'list' && (<>
        <ResponsiveDataTable columns={columns} data={displayData} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} allSelectedRows={allSelectedRows} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} bulkActions={bulkActions} renderMobileCard={task => <TaskCard task={task} onDelete={id => { setIdToDelete(id); setIsAlertOpen(true); }} />} />
        {isMobile && mobileLoadedCount < filteredData.length && <div className="flex justify-center py-4"><span className="text-body-sm text-muted-foreground">Hiển thị {mobileLoadedCount} / {filteredData.length} • Cuộn xuống để xem thêm</span></div>}
      </>)}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{idToDelete ? "Xóa công việc?" : `Xóa ${allSelectedRows.length} công việc?`}</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  );
}
