'use client'

import * as React from "react";
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useLeaveStore } from './store';
import { getColumns } from './columns';
import type { LeaveRequest, LeaveStatus } from "@/lib/types/prisma-extended";
import type { SystemId } from '@/lib/id-types';
import { usePageHeader } from "../../contexts/page-header-context";
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table";
import { PageToolbar } from "../../components/layout/page-toolbar"
import { PageFilters } from "../../components/layout/page-filters";
import { Button } from "../../components/ui/button";
import { PlusCircle, CheckCircle2, XCircle, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { useFuseFilter } from "../../hooks/use-fuse-search";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from "../../components/data-table/dynamic-column-customizer";
import { toast } from "sonner";
import { useBreakpoint } from "../../contexts/breakpoint-context";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { formatDate } from "../../lib/date-utils";
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog";
import { DataTableImportDialog, type ImportConfig } from "../../components/data-table/data-table-import-dialog";

const LeaveForm = dynamic(() => import("./components/leave-form").then(mod => ({ default: mod.LeaveForm })), { ssr: false });

export function LeavesPage() {
  const { data: leaveRequests, remove, add, update } = useLeaveStore();
  const router = useRouter(), { isMobile } = useBreakpoint();
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({}), [isAlertOpen, setIsAlertOpen] = React.useState(false), [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null), [isFormOpen, setIsFormOpen] = React.useState(false), [editingRequest, setEditingRequest] = React.useState<LeaveRequest | null>(null);
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true }), [globalFilter, setGlobalFilter] = React.useState(''), [statusFilter, setStatusFilter] = React.useState<"all" | LeaveStatus>('all'), [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20), [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({}), [columnOrder, setColumnOrder] = React.useState<string[]>([]), [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'employeeName']);

  const handleStatusChange = React.useCallback((systemId: SystemId, status: LeaveStatus) => {
    const request = leaveRequests.find(r => r.systemId === systemId);
    if (request) { update(systemId, { ...request, status }); toast.success("Đã cập nhật trạng thái", { description: `Đơn ${request.id} đã được ${status.toLowerCase()}` }); }
  }, [leaveRequests, update]);

  const handleDelete = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleEdit = React.useCallback((request: LeaveRequest) => { setEditingRequest(request); setIsFormOpen(true); }, []);
  const columns = React.useMemo(() => getColumns(handleDelete, handleEdit, handleStatusChange, router.push), [handleDelete, handleEdit, handleStatusChange, router]);
  
  React.useEffect(() => {
    const defaultVisibleColumns = ['employeeName', 'employeeId', 'leaveTypeName', 'leaveTypeId', 'dateRange', 'startDate', 'endDate', 'numberOfDays', 'reason', 'status', 'requestDate', 'leaveTypeIsPaid', 'leaveTypeRequiresAttachment', 'createdAt', 'updatedAt'];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => { initialVisibility[c.id!] = c.id === 'select' || c.id === 'actions' ? true : defaultVisibleColumns.includes(c.id!); });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const fuseOptions = React.useMemo(() => ({ keys: ["employeeName", "leaveTypeName", "reason", "employeeId"] }), []);
  const searchedData = useFuseFilter(leaveRequests, globalFilter, fuseOptions);

  const confirmDelete = () => {
    if (idToDelete) { const request = leaveRequests.find(r => r.systemId === idToDelete); remove(idToDelete); toast.success("Đã xóa đơn nghỉ phép", { description: `Đơn của ${request?.employeeName || 'nhân viên'} đã được xóa` }); }
    setIsAlertOpen(false);
  };

  const handleSubmit = (values: Omit<LeaveRequest, 'systemId'>) => {
    if (editingRequest) { update(editingRequest.systemId, { ...editingRequest, ...values }); toast.success("Đã cập nhật đơn nghỉ phép", { description: `Đơn ${values.id} đã được cập nhật thành công` }); }
    else { add(values); toast.success("Đã tạo đơn nghỉ phép mới", { description: `Đơn ${values.id} đã được tạo, đang chờ duyệt` }); }
    setIsFormOpen(false); setEditingRequest(null);
  };

  const filteredData = React.useMemo(() => {
    const data = globalFilter ? searchedData : leaveRequests;
    return statusFilter !== 'all' ? data.filter(r => r.status === statusFilter) : data;
  }, [leaveRequests, globalFilter, statusFilter, searchedData]);

  React.useEffect(() => { setMobileLoadedCount(20); }, [globalFilter, statusFilter]);

  React.useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const scrollPercentage = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      if (scrollPercentage > 80 && mobileLoadedCount < filteredData.length) setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredData.length]);

  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => filteredData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [filteredData, pagination]);
  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;
  const allSelectedRows = React.useMemo(() => leaveRequests.filter(lr => rowSelection[lr.systemId]), [leaveRequests, rowSelection]);
  const handleRowClick = (row: LeaveRequest) => router.push(`/leaves/${row.systemId}`);

  const handleBulkApprove = React.useCallback(() => { allSelectedRows.forEach(row => update(row.systemId, { ...row, status: 'Đã duyệt' })); setRowSelection({}); toast.success(`Đã duyệt ${allSelectedRows.length} đơn nghỉ phép`); }, [allSelectedRows, update]);
  const handleBulkReject = React.useCallback(() => { allSelectedRows.forEach(row => update(row.systemId, { ...row, status: 'Đã từ chối' })); setRowSelection({}); toast.error(`Đã từ chối ${allSelectedRows.length} đơn nghỉ phép`); }, [allSelectedRows, update]);
  const handleBulkDelete = React.useCallback(() => { if (allSelectedRows.length === 0) return; allSelectedRows.forEach(row => remove(row.systemId)); setRowSelection({}); toast.success(`Đã xóa ${allSelectedRows.length} đơn nghỉ phép`); }, [allSelectedRows, remove]);

  const exportConfig = React.useMemo(() => ({ fileName: 'Danh_sach_Nghi_phep', columns }), [columns]);
  const importConfig: ImportConfig<LeaveRequest> = React.useMemo(() => ({
    importer: (items) => { items.forEach(item => { const { systemId: _systemId, ...rest } = item as Partial<LeaveRequest> & { systemId?: string }; add({ ...rest, status: 'Chờ duyệt', requestDate: new Date().toISOString().split('T')[0] } as Omit<LeaveRequest, 'systemId'>); }); toast.success(`Đã nhập ${items.length} đơn nghỉ phép`); },
    fileName: 'Mau_Nhap_Nghi_phep', existingData: leaveRequests, getUniqueKey: (item: Partial<LeaveRequest>) => item.id || `${item.employeeId}-${item.startDate}`,
  }), [add, leaveRequests]);

  const bulkActions = React.useMemo(() => [
    { label: 'Duyệt đã chọn', icon: CheckCircle2, onSelect: () => handleBulkApprove() },
    { label: 'Từ chối đã chọn', icon: XCircle, onSelect: () => handleBulkReject() },
    { label: 'Xuất Excel đã chọn', icon: Download, onSelect: (selectedRows: LeaveRequest[]) => toast.success(`Xuất ${selectedRows.length} đơn nghỉ phép`) }
  ], [handleBulkApprove, handleBulkReject]);

  const headerActions = React.useMemo(() => [<Button key="add" onClick={() => setIsFormOpen(true)} size="sm" className="h-9"><PlusCircle className="mr-2 h-4 w-4" />Tạo đơn nghỉ phép</Button>], []);
  usePageHeader({ actions: headerActions });

  const renderMobileCard = React.useCallback((leave: LeaveRequest) => {
    const statusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = { "Chờ duyệt": "warning", "Đã duyệt": "success", "Đã từ chối": "destructive" };
    return (
      <Card key={leave.systemId} className="mb-3">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div><div className="font-medium">{leave.employeeName}</div><div className="text-xs text-muted-foreground">{leave.employeeId}</div></div>
            <Badge variant={statusVariants[leave.status]}>{leave.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Loại phép:</span><div>{leave.leaveTypeName}</div></div>
            <div><span className="text-muted-foreground">Số ngày:</span><div>{leave.numberOfDays}</div></div>
            <div className="col-span-2"><span className="text-muted-foreground">Thời gian:</span><div>{formatDate(leave.startDate)} - {formatDate(leave.endDate)}</div></div>
            {leave.reason && <div className="col-span-2"><span className="text-muted-foreground">Lý do:</span><div className="truncate">{leave.reason}</div></div>}
          </div>
        </CardContent>
      </Card>
    );
  }, []);

  return (
    <div className="space-y-4">
      {!isMobile && (
        <PageToolbar
          leftActions={<><DataTableImportDialog config={importConfig} /><DataTableExportDialog allData={leaveRequests} filteredData={filteredData} pageData={paginatedData} config={exportConfig} /></>}
          rightActions={<DataTableColumnCustomizer columns={columns} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} />}
        />
      )}
      <PageFilters searchValue={globalFilter} onSearchChange={setGlobalFilter} searchPlaceholder="Tìm kiếm đơn...">
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as LeaveStatus | 'all')}>
          <SelectTrigger className="h-9 w-[180px]"><SelectValue placeholder="Lọc trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Chờ duyệt">Chờ duyệt</SelectItem>
            <SelectItem value="Đã duyệt">Đã duyệt</SelectItem>
            <SelectItem value="Đã từ chối">Đã từ chối</SelectItem>
          </SelectContent>
        </Select>
      </PageFilters>
      <ResponsiveDataTable columns={columns} data={displayData} renderMobileCard={renderMobileCard} pageCount={pageCount} pagination={pagination} setPagination={setPagination} rowCount={filteredData.length} rowSelection={rowSelection} setRowSelection={setRowSelection} sorting={sorting} setSorting={setSorting} onRowClick={handleRowClick} allSelectedRows={allSelectedRows} onBulkDelete={handleBulkDelete} bulkActions={bulkActions} expanded={{}} setExpanded={() => {}} columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} columnOrder={columnOrder} setColumnOrder={setColumnOrder} pinnedColumns={pinnedColumns} setPinnedColumns={setPinnedColumns} emptyTitle="Không có đơn nghỉ phép" emptyDescription="Tạo đơn nghỉ phép đầu tiên để bắt đầu" />
      {isMobile && (
        <div className="py-6 text-center">
          {mobileLoadedCount < filteredData.length ? (
            <div className="flex items-center justify-center gap-2 text-muted-foreground"><div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" /><span className="text-sm">Đang tải thêm...</span></div>
          ) : filteredData.length > 20 ? (<p className="text-sm text-muted-foreground">Đã hiển thị tất cả {filteredData.length} kết quả</p>) : null}
        </div>
      )}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Xóa đơn nghỉ phép?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingRequest ? 'Chỉnh sửa đơn nghỉ phép' : 'Tạo đơn nghỉ phép mới'}</DialogTitle><DialogDescription>Điền thông tin chi tiết cho đơn xin nghỉ phép.</DialogDescription></DialogHeader>
          <LeaveForm initialData={editingRequest} onSubmit={handleSubmit} onCancel={() => setIsFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
