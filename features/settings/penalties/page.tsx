import * as React from "react"
import * as ReactRouterDOM from 'react-router-dom';
import { usePenaltyStore } from "./store.ts"
import { getColumns } from "./columns.tsx"
import type { Penalty, PenaltyStatus } from "./types.ts"
import { usePageHeader } from "../../../contexts/page-header-context.tsx";
import { useBreakpoint } from "../../../contexts/breakpoint-context.tsx";
import { useEmployeeStore } from "../../employees/store.ts";
import { ResponsiveDataTable } from "../../../components/data-table/responsive-data-table.tsx"
import { DataTableToolbar } from "../../../components/data-table/data-table-toolbar.tsx"
import { PageFilters } from "../../../components/layout/page-filters.tsx"
import { Button } from "../../../components/ui/button.tsx"
import { PlusCircle } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { PenaltyCard } from "./penalty-card.tsx";
import Fuse from "fuse.js"
import { DataTableColumnCustomizer } from "../../../components/data-table/data-table-column-toggle.tsx";
import { toast } from "sonner";

export function PenaltiesPage() {
  const navigate = ReactRouterDOM.useNavigate();
  const { data: penalties, remove, add, update } = usePenaltyStore();
  const { data: employees } = useEmployeeStore();
  const { isMobile } = useBreakpoint();
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null)

  // Mobile infinite scroll state
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'issueDate', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<"all" | PenaltyStatus>('all');
  const [assigneeFilter, setAssigneeFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'penalties-column-visibility';
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
    localStorage.setItem('penalties-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);

  const handleDelete = React.useCallback((id: string) => {
    setIdToDelete(id);
    setIsAlertOpen(true);
  }, []);

  const columns = React.useMemo(() => getColumns(handleDelete, () => {}, navigate), [handleDelete, navigate]);
  
  // Set default visible columns (15+ for sticky scrollbar)
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 
      'employeeName',
      'employeeId',
      'reason',
      'category',
      'amount', 
      'issueDate',
      'dueDate',
      'paidDate',
      'issuerName',
      'approverName',
      'status',
      'notes',
      'attachments',
      'createdAt'
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
  }, []);

  const fuse = React.useMemo(() => new Fuse(penalties, { keys: ["id", "employeeName", "reason", "issuerName"] }), [penalties]);

  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [globalFilter, statusFilter, assigneeFilter]);

  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete as any);
    } else {
      // Bulk delete
      allSelectedRows.forEach(penalty => remove(penalty.systemId as any));
      setRowSelection({});
    }
    setIsAlertOpen(false);
  };

  const filteredData = React.useMemo(() => {
    let data = penalties;
    if (globalFilter) data = fuse.search(globalFilter).map(r => r.item);
    if (statusFilter !== 'all') data = data.filter(r => r.status === statusFilter);
    if (assigneeFilter !== 'all') data = data.filter(r => r.employeeSystemId === assigneeFilter);
    return data;
  }, [penalties, globalFilter, statusFilter, assigneeFilter, fuse]);

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
    penalties.filter(p => rowSelection[p.systemId]),
  [penalties, rowSelection]);
  
  const handleRowClick = (row: Penalty) => {
    navigate(`/penalties/${row.systemId}`);
  };

  const bulkActions = [
    {
      label: "Đánh dấu đã thanh toán",
      onSelect: (selectedRows: Penalty[]) => {
        selectedRows.forEach(penalty => {
          update(penalty.systemId as any, { ...penalty, status: "Đã thanh toán" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} phiếu phạt đã chuyển sang "Đã thanh toán"`,
        });
        setRowSelection({});
      }
    },
    {
      label: "Hủy phiếu phạt",
      onSelect: (selectedRows: Penalty[]) => {
        selectedRows.forEach(penalty => {
          update(penalty.systemId as any, { ...penalty, status: "Đã hủy" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} phiếu phạt đã chuyển sang "Đã hủy"`,
        });
        setRowSelection({});
      }
    },
    {
      label: "Xóa các phiếu đã chọn",
      onSelect: (selectedRows: Penalty[]) => {
        setIdToDelete(null);
        setIsAlertOpen(true);
      }
    }
  ];

  // Header actions
  const actions = React.useMemo(() => [
    <Button key="new" onClick={() => navigate('/penalties/new')} size="sm" className="h-9">
      <PlusCircle className="mr-2 h-4 w-4" />
      Tạo phiếu phạt
    </Button>
  ], [navigate]);

  // Set page header with auto-generated title and breadcrumb from breadcrumb-system.ts
  usePageHeader({ 
    actions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Phiếu phạt', href: '/penalties', isCurrent: true }
    ]
  });

  return (
    <div className="space-y-4">
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm phiếu phạt..."
      >
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Lọc trạng thái" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                <SelectItem value="Đã hủy">Đã hủy</SelectItem>
            </SelectContent>
        </Select>
        <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="h-9 w-full sm:w-[180px]"><SelectValue placeholder="Nhân viên" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {employees.map(e => <SelectItem key={e.systemId} value={e.systemId}>{e.fullName}</SelectItem>)}
            </SelectContent>
        </Select>
        <div className="flex-grow" />
        <DataTableColumnCustomizer
          columns={columns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
        />
      </PageFilters>

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
        showBulkDeleteButton={true}
        onBulkDelete={() => {
          setIdToDelete(null);
          setIsAlertOpen(true);
        }}
        renderMobileCard={(penalty) => (
          <PenaltyCard
            penalty={penalty}
            onDelete={(id) => {
              setIdToDelete(id);
              setIsAlertOpen(true);
            }}
          />
        )}
      />

      {isMobile && mobileLoadedCount < filteredData.length && (
        <div className="flex justify-center py-4">
          <span className="text-sm text-muted-foreground">
            Hiển thị {mobileLoadedCount} / {filteredData.length} • Cuộn xuống để xem thêm
          </span>
        </div>
      )}
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {idToDelete ? "Xóa phiếu phạt?" : `Xóa ${allSelectedRows.length} phiếu phạt?`}
            </AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
