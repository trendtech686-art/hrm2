'use client'

import * as React from "react"
import * as ReactRouterDOM from '@/lib/next-compat';
import { useTaskStore } from "./store"
import { getColumns } from "./columns"
import type { Task, TaskStatus, TaskPriority } from "./types"
import { usePageHeader } from "../../contexts/page-header-context";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { useAuth } from "../../contexts/auth-context";
import { useEmployeeStore } from "../employees/store";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table"
import { PageFilters } from "../../components/layout/page-filters"
import { PageToolbar } from "../../components/layout/page-toolbar"
import { Button } from "../../components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { PlusCircle, LayoutGrid, Table, BarChart3, FileText, Repeat, Settings } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { TaskCard } from "./task-card";
import { TaskKanbanView } from "./kanban-view";
import Fuse from "fuse.js"
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle";
import { toast } from "sonner";
import { QuickFilters, QuickFiltersCompact } from "./components/QuickFilters";
import { QUICK_FILTERS } from "./types-filter";
import type { SystemId } from '../../lib/id-types';

export function TasksPage() {
  const store = useTaskStore();
  const { data: allTasks, remove, add, update, getMyTasks, restoreTimer } = store;
  const { data: employees } = useEmployeeStore();
  const { isMobile } = useBreakpoint();
  const { isAdmin, employee } = useAuth();
  const navigate = ReactRouterDOM.useNavigate();
  
  // Quick filters state
  const [activeQuickFilters, setActiveQuickFilters] = React.useState<string[]>([]);
  
  // Restore running timer on mount
  React.useEffect(() => {
    restoreTimer();
  }, [restoreTimer]);
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null)

  // Mobile infinite scroll state
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // View mode: list or kanban
  const [viewMode, setViewMode] = React.useState<'list' | 'kanban'>('list');

  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<"all" | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<"all" | TaskPriority>('all');
  const [assigneeFilter, setAssigneeFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'tasks-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, () => {});
    const allColumnIds = cols.map(c => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every(id => id in parsed)) return parsed;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  
  React.useEffect(() => {
    localStorage.setItem('tasks-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);

  const handleDelete = React.useCallback((id: SystemId) => {
    setIdToDelete(id);
    setIsAlertOpen(true);
  }, []);

  const columns = React.useMemo(() => getColumns(handleDelete, () => {}, navigate, isAdmin), [handleDelete, navigate, isAdmin]);
  
  // Initialize column visibility and order only once
  const [isColumnsInitialized, setIsColumnsInitialized] = React.useState(false);
  
  React.useEffect(() => {
    if (isColumnsInitialized || columns.length === 0) return;
    
    const defaultVisibleColumns = [
      'id', 
      'title', 
      'assigneeName',
      'assignerName',
      'priority', 
      'status',
      'progress',
      'startDate',
      'dueDate',
      'estimatedHours',
      'actualHours'
    ];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    setIsColumnsInitialized(true);
  }, [columns, isColumnsInitialized]);

  // Role-based data filtering
  const employeeSystemId = employee?.systemId;
  const tasks = React.useMemo(() => {
    // Admin sees all tasks, regular users see only assigned tasks
    if (isAdmin) return allTasks;
    if (!employeeSystemId) return allTasks;
    return allTasks.filter(task => 
      task.assignees?.some(a => a.employeeSystemId === employeeSystemId) || 
      task.assigneeId === employeeSystemId
    );
  }, [isAdmin, allTasks, employeeSystemId]);
  
  const fuse = React.useMemo(() => new Fuse(tasks, { keys: ["id", "title", "assigneeName", "assignerName", "description"] }), [tasks]);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [globalFilter, statusFilter, priorityFilter, assigneeFilter]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
    } else {
      // Bulk delete
      allSelectedRows.forEach(task => remove(task.systemId));
      setRowSelection({});
    }
    setIsAlertOpen(false);
  };

  const filteredData = React.useMemo(() => {
    let data = tasks;
    if (globalFilter) data = fuse.search(globalFilter).map(r => r.item);
    if (statusFilter !== 'all') data = data.filter(r => r.status === statusFilter);
    if (priorityFilter !== 'all') data = data.filter(r => r.priority === priorityFilter);
    if (assigneeFilter !== 'all') data = data.filter(r => r.assigneeId === assigneeFilter);
    
    // Apply quick filters
    if (activeQuickFilters.length > 0) {
      const quickFilterFns = QUICK_FILTERS.filter(qf => activeQuickFilters.includes(qf.id)).map(qf => qf.filter);
      data = data.filter(task => quickFilterFns.every(fn => fn(task)));
    }
    
    return data;
  }, [tasks, globalFilter, statusFilter, priorityFilter, assigneeFilter, fuse, activeQuickFilters]);

  // Mobile infinite scroll listener
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / documentHeight) * 100;

      // Load more when scroll 80%
      if (scrollPercentage > 80 && mobileLoadedCount < filteredData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredData.length]);
  
  const sortedData = React.useMemo(() => {
    const data = [...filteredData];
    if (sorting.id) {
      data.sort((a, b) => {
        const aVal = (a as any)[sorting.id];
        const bVal = (b as any)[sorting.id];
        if (!aVal) return 1;
        if (!bVal) return -1;
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'dueDate') {
          const aTime = aVal ? new Date(aVal).getTime() : 0;
          const bTime = bVal ? new Date(bVal).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aVal < bVal) return sorting.desc ? 1 : -1;
        if (aVal > bVal) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return data;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  
  // Display data: mobile uses slice for infinite scroll, desktop uses pagination
  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;

  const allSelectedRows = React.useMemo(() => 
    tasks.filter(t => rowSelection[t.systemId]),
  [tasks, rowSelection]);
  
  const handleRowClick = (row: Task) => {
    navigate(`/tasks/${row.systemId}`);
  };
  
  // Quick filter handlers
  const handleToggleQuickFilter = React.useCallback((filterId: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  }, []);
  
  // Calculate task counts for quick filters
  const quickFilterCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    QUICK_FILTERS.forEach(qf => {
      counts[qf.id] = tasks.filter(qf.filter).length;
    });
    return counts;
  }, [tasks]);

  // Header actions
  const actions = React.useMemo(() => {
    const actionButtons = [
      <Tabs key="view-toggle" value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'kanban')} className="h-9">
        <TabsList className="h-9">
          <TabsTrigger value="list" className="h-8 px-3">
            <Table className="mr-2 h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="kanban" className="h-8 px-3">
            <LayoutGrid className="mr-2 h-4 w-4" />
            Kanban
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    ];
    
    // Dashboard link (for admin only)
    if (isAdmin) {
      actionButtons.push(
        <Button
          key="recurring"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => navigate('/tasks/recurring')}
        >
          <Repeat className="mr-2 h-4 w-4" />
          Lặp lại
        </Button>,
        <Button
          key="templates"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => navigate('/tasks/templates')}
        >
          <FileText className="mr-2 h-4 w-4" />
          Mẫu
        </Button>,
        <Button
          key="fields"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => navigate('/tasks/fields')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Trường
        </Button>,
        <Button
          key="dashboard"
          variant="outline"
          size="sm"
          className="h-9"
          onClick={() => navigate('/tasks/dashboard')}
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
      );
    }
    
    // Only admin can create tasks
    if (isAdmin) {
      actionButtons.push(
        <Button key="new" onClick={() => navigate('/tasks/new')} size="sm" className="h-9">
          <PlusCircle className="mr-2 h-4 w-4" /> Tạo công việc mới
        </Button>
      );
    }
    
    return actionButtons;
  }, [viewMode, navigate, isAdmin]);

  const taskStats = React.useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        acc.total += 1;
        if (task.status === 'Đang thực hiện') acc.inProgress += 1;
        if (task.status === 'Đang chờ') acc.waiting += 1;
        if (task.status === 'Hoàn thành') acc.completed += 1;
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        if (dueDate && !isNaN(dueDate.getTime()) && dueDate < new Date() && task.status !== 'Hoàn thành') {
          acc.overdue += 1;
        }
        return acc;
      },
      { total: 0, inProgress: 0, waiting: 0, completed: 0, overdue: 0 }
    );
  }, [tasks]);

  const bulkActions = [
    {
      label: "Đánh dấu Đang thực hiện",
      onSelect: (selectedRows: Task[]) => {
        selectedRows.forEach(task => {
          update(task.systemId as any, { ...task, status: "Đang thực hiện" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} công việc đã chuyển sang "Đang thực hiện"`,
        });
        setRowSelection({});
      }
    },
    {
      label: "Đánh dấu Hoàn thành",
      onSelect: (selectedRows: Task[]) => {
        const now = new Date().toISOString().split('T')[0];
        selectedRows.forEach(task => {
          update(task.systemId as any, { ...task, status: "Hoàn thành", progress: 100, completedDate: now });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} công việc đã chuyển sang "Hoàn thành"`,
        });
        setRowSelection({});
      }
    },
    {
      label: "Đánh dấu Đang chờ",
      onSelect: (selectedRows: Task[]) => {
        selectedRows.forEach(task => {
          update(task.systemId as any, { ...task, status: "Đang chờ" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} công việc đã chuyển sang "Đang chờ"`,
        });
        setRowSelection({});
      }
    },
    {
      label: "Xóa các công việc đã chọn",
      onSelect: (selectedRows: Task[]) => {
        setIdToDelete(null); // Clear single delete ID for bulk delete
        setIsAlertOpen(true);
      }
    }
  ];

  // Set page header with actions and breadcrumb
  usePageHeader({ 
    title: 'Quản lý công việc',
    actions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { 
        label: 'Quản lý công việc', 
        href: '/tasks', 
        isCurrent: true 
      }
    ]
  });

  return (
    <div className="space-y-4">
      {/* Quick Filters - Always visible */}
      <div className="px-1">
        {isMobile ? (
          <QuickFiltersCompact
            activeFilters={activeQuickFilters}
            onToggleFilter={handleToggleQuickFilter}
            taskCounts={quickFilterCounts}
          />
        ) : (
          <QuickFilters
            activeFilters={activeQuickFilters}
            onToggleFilter={handleToggleQuickFilter}
            taskCounts={quickFilterCounts}
          />
        )}
      </div>
      
      {viewMode === 'list' && (
        <>
          {/* PageToolbar - Desktop only */}
          {!isMobile && (
            <PageToolbar
              rightActions={
                <DataTableColumnCustomizer
                  columns={columns}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                  pinnedColumns={pinnedColumns}
                  setPinnedColumns={setPinnedColumns}
                />
              }
            />
          )}

          <PageFilters
            searchValue={globalFilter}
            onSearchChange={setGlobalFilter}
            searchPlaceholder="Tìm kiếm công việc..."
          >
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Lọc trạng thái" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Chưa bắt đầu">Chưa bắt đầu</SelectItem>
                <SelectItem value="Đang thực hiện">Đang thực hiện</SelectItem>
                <SelectItem value="Đang chờ">Đang chờ</SelectItem>
                <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                <SelectItem value="Đã hủy">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as any)}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Độ ưu tiên" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ ưu tiên</SelectItem>
                <SelectItem value="Thấp">Thấp</SelectItem>
                <SelectItem value="Trung bình">Trung bình</SelectItem>
                <SelectItem value="Cao">Cao</SelectItem>
                <SelectItem value="Khẩn cấp">Khẩn cấp</SelectItem>
              </SelectContent>
            </Select>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Người thực hiện" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {employees.map(e => <SelectItem key={e.systemId} value={e.systemId}>{e.fullName}</SelectItem>)}
              </SelectContent>
            </Select>
          </PageFilters>
        </>
      )}

        {/* Kanban View */}
        {viewMode === 'kanban' && (
          <TaskKanbanView
            tasks={filteredData}
            onTaskClick={handleRowClick}
            employees={employees}
            onTaskUpdate={update}
          />
        )}      {/* List/Table View */}
      {viewMode === 'list' && (
        <>
          <ResponsiveDataTable
        columns={columns}
        data={displayData}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        onRowClick={handleRowClick}
        allSelectedRows={allSelectedRows}
        expanded={{}}
        setExpanded={() => {}}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        bulkActions={bulkActions}
        renderMobileCard={(task) => (
          <TaskCard
            task={task}
            onDelete={(id) => {
              setIdToDelete(id);
              setIsAlertOpen(true);
            }}
          />
        )}
      />

      {isMobile && mobileLoadedCount < filteredData.length && (
        <div className="flex justify-center py-4">
          <span className="text-body-sm text-muted-foreground">
            Hiển thị {mobileLoadedCount} / {filteredData.length} • Cuộn xuống để xem thêm
          </span>
        </div>
      )}
        </>
      )}
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {idToDelete ? "Xóa công việc?" : `Xóa ${allSelectedRows.length} công việc?`}
            </AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
