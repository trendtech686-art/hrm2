import * as React from "react";
import * as ReactRouterDOM from 'react-router-dom';
import { useLeaveStore } from './store.ts';
import { getColumns } from './columns.tsx';
import type { LeaveRequest, LeaveStatus } from "./types.ts";
import type { SystemId } from '@/lib/id-types';
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx";
import { DataTableToolbar } from "../../components/data-table/data-table-toolbar.tsx";
import { Button } from "../../components/ui/button.tsx";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog.tsx";
import { LeaveForm } from "./leave-form.tsx";
import Fuse from "fuse.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";

export function LeavesPage() {
  const { data: leaveRequests, remove, add, update } = useLeaveStore();
  const navigate = ReactRouterDOM.useNavigate();
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingRequest, setEditingRequest] = React.useState<LeaveRequest | null>(null);
  
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'requestDate', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<"all" | LeaveStatus>('all');
  const [dateFilter, setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'leaves-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, () => {}, () => {});
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
    localStorage.setItem('leaves-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const handleStatusChange = (systemId: SystemId, status: LeaveStatus) => {
    const request = leaveRequests.find(r => r.systemId === systemId);
    if (request) {
        update(systemId, { ...request, status });
        toast.success("Đã cập nhật trạng thái", {
          description: `Đơn ${request.id} đã được ${status.toLowerCase()}`,
        });
    }
  };

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleEdit = React.useCallback((request: LeaveRequest) => {
    setEditingRequest(request);
    setIsFormOpen(true);
  }, []);

  const columns = React.useMemo(() => getColumns(handleDelete, handleEdit, handleStatusChange, navigate), [handleDelete, handleEdit, handleStatusChange, navigate]);
  
  React.useEffect(() => {
    const defaultVisibleColumns = ['employeeName', 'leaveTypeName', 'dateRange', 'numberOfDays', 'reason', 'status'];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
  
  const fuse = React.useMemo(() => new Fuse(leaveRequests, { keys: ["employeeName", "leaveTypeName", "reason"] }), [leaveRequests]);

  const confirmDelete = () => {
    if (idToDelete) {
      const request = leaveRequests.find(r => r.systemId === idToDelete);
      remove(idToDelete);
      toast.success("Đã xóa đơn nghỉ phép", {
        description: `Đơn của ${request?.employeeName || 'nhân viên'} đã được xóa`,
      });
    }
    setIsAlertOpen(false);
  };

  const handleAddNew = () => {
    setEditingRequest(null);
    setIsFormOpen(true);
  };

  const handleSubmit = (values: Omit<LeaveRequest, 'systemId'>) => {
    if (editingRequest) {
      update(editingRequest.systemId, { ...editingRequest, ...values });
      toast.success("Đã cập nhật đơn nghỉ phép", {
        description: `Đơn ${values.id} đã được cập nhật thành công`,
      });
    } else {
      add(values);
      toast.success("Đã tạo đơn nghỉ phép mới", {
        description: `Đơn ${values.id} đã được tạo, đang chờ duyệt`,
      });
    }
    setIsFormOpen(false);
    setEditingRequest(null);
  };

  const filteredData = React.useMemo(() => {
    let data = leaveRequests;
    if (globalFilter) data = fuse.search(globalFilter).map(r => r.item);
    if (statusFilter !== 'all') data = data.filter(r => r.status === statusFilter);
    // Add date filtering logic if needed
    return data;
  }, [leaveRequests, globalFilter, statusFilter, fuse]);

  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => filteredData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [filteredData, pagination]);
  
  const allSelectedRows = React.useMemo(() => 
    leaveRequests.filter(lr => rowSelection[lr.systemId]),
  [leaveRequests, rowSelection]);

  const handleRowClick = (row: LeaveRequest) => {
    navigate(`/leaves/${row.systemId}`);
  };

  const handleBulkApprove = () => {
    allSelectedRows.forEach(row => {
      update(row.systemId, { ...row, status: 'Đã duyệt' });
    });
    setRowSelection({});
    toast.success(`Đã duyệt ${allSelectedRows.length} đơn nghỉ phép`);
  };

  const handleBulkReject = () => {
    allSelectedRows.forEach(row => {
      update(row.systemId, { ...row, status: 'Đã từ chối' });
    });
    setRowSelection({});
    toast.error(`Đã từ chối ${allSelectedRows.length} đơn nghỉ phép`);
  };

  usePageHeader({
    actions: [
      allSelectedRows.length > 0 && (
        <Button key="bulk-approve" onClick={handleBulkApprove} size="sm" className="h-9" variant="default">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Duyệt ({allSelectedRows.length})
        </Button>
      ),
      allSelectedRows.length > 0 && (
        <Button key="bulk-reject" onClick={handleBulkReject} size="sm" className="h-9" variant="destructive">
          <XCircle className="mr-2 h-4 w-4" />
          Từ chối ({allSelectedRows.length})
        </Button>
      ),
      <Button key="add" onClick={() => setIsFormOpen(true)} size="sm" className="h-9">
        <PlusCircle className="mr-2 h-4 w-4" />
        Tạo đơn nghỉ phép
      </Button>
    ].filter(Boolean)
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <DataTableToolbar
            search={globalFilter}
            onSearchChange={setGlobalFilter}
            searchPlaceholder="Tìm kiếm đơn..."
            numResults={filteredData.length}
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
            <SelectTrigger className="h-9 w-[180px]">
                <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
                <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
                <SelectItem value="Đã từ chối">Đã từ chối</SelectItem>
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
      </div>

      <ResponsiveDataTable
        columns={columns}
        data={paginatedData}
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
      />
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Xóa đơn nghỉ phép?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRequest ? 'Chỉnh sửa đơn nghỉ phép' : 'Tạo đơn nghỉ phép mới'}</DialogTitle>
            <DialogDescription>Điền thông tin chi tiết cho đơn xin nghỉ phép.</DialogDescription>
          </DialogHeader>
          <LeaveForm initialData={editingRequest} onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
